const amqp = require('amqplib');
const PayloadInterpreter = require("../payloadHandling/payloadInterpreter");
const uri = process.env.AMQP;

// server
async function setupForReceivingRPC() {
    const queue = 'rpc_queue';

    try {
        const connection = await amqp.connect(uri);
        const channel = await connection.createChannel();

        process.once('SIGINT', async () => {
            await channel.close();
            await connection.close();
        });

        await channel.assertQueue(queue, { durable: false });
        await channel.prefetch(1); // only one message at a time

        await channel.consume(queue, async (message) => {
            const received = JSON.parse(message.content);
            if (!received) {
                console.log(' [.] Faulty message')
                channel.ack(message);
                return;
            }

            console.log(' [.] Received %s', received)
            console.info(' [.] Body', received.body)

            const interpreter = new PayloadInterpreter(received);
            const interpretation = await interpreter.interpret();
            let reply;
            if (!interpretation) {
                reply = 'No image found'
            } else {
                reply = interpretation.base64;
            }

            console.info(' [.] Reply', reply)
            console.log('%c [.] Done', 'color: red');

            channel.sendToQueue(message.properties.replyTo, Buffer.from(reply), {
                correlationId: message.properties.correlationId
            });
            channel.ack(message);
        });

    } catch (e) {
        console.warn("Error in rpc: ", e);
        return false;
    }

    return true;
}

module.exports = setupForReceivingRPC;
