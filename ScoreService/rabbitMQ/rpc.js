const amqp = require('amqplib');
const uri = process.env.AMQP;
const exchangeName = 'Main';
const selfName = process.env.ROUTING_KEY || 'Undefined';

const props = { clientProperties: { connection_name: 'scoreConnection' }};

// client
async function sendTargetAMessage(message){
    let connection;
    const queue = 'rpc_queue';

    try {
        connection = await amqp.connect(uri);
        const channel = await connection.createChannel();
        const correlationId = generateUuid();

        const sendingAMessage = new Promise(async (resolve) => {
            const { queue: replyTo } = await channel.assertQueue('', { exclusive: true });

            await channel.consume(replyTo, (message) => {
                if (!message) console.warn(' [x] Consumer cancelled');
                else if (message.properties.correlationId === correlationId) {
                    console.log(` [.] Got: ${message.content.toString()}`);
                    resolve(message.content.toString());
                }
            }, { noAck: true });

            await channel.assertQueue(queue, { durable: false });
            console.log(` [x] Requesting: ${message}`);
            channel.sendToQueue(queue, Buffer.from(message), {
                correlationId,
                replyTo,
            });
        });

        return await sendingAMessage;
    } catch (e) {
        console.log("Error in rpc: ", e);
    } finally {
        if (connection) await connection.close();
    }
}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports = {
    sendTargetAMessage
};
