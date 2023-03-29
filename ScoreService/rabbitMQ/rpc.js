const amqp = require('amqplib');
const uri = process.env.AMQP;

// client
/**
 *
 *  Sends a message to a queue and waits for a response
 *  @param {Object} payload - The message to be sent
 *  @returns {Promise<object>} The response from the queue
 */
async function rpcMessage(payload) {
    let connection;
    const queue = 'rpc_queue';

    console.info('sending payload', payload)

    try {
        connection = await amqp.connect(uri);
        const channel = await connection.createChannel();
        const correlationId = generateUuid();

        const sendingAMessage = new Promise(async (resolve) => {
            const {queue: replyTo} = await channel.assertQueue('', {exclusive: true});

            await channel.consume(replyTo, (message) => {
                if (!message) console.warn(' [x] Consumer cancelled');
                else if (message.properties.correlationId === correlationId) {
                    resolve(message.content.toString());
                }
            }, {noAck: true});

            await channel.assertQueue(queue, {durable: false});
            console.log(` [x] Requesting: ${payload}`);
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
                correlationId,
                replyTo,
            });
        });

        return await sendingAMessage;
    } catch (e) {
        console.trace("Error in rpc", e);
    } finally {
        if (connection)
            await connection.close();
    }
}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports = {
    rpcMessage
};
