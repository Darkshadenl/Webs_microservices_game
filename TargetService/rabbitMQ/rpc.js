const amqp = require('amqplib');
const {response} = require("express");
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

        await channel.consume(queue, (message) => {
            console.log(message.content.toString());
            const reply = "Hello from target";

            channel.sendToQueue(message.properties.replyTo, Buffer.from(reply), {
                correlationId: message.properties.correlationId
            });
            channel.ack(message);
        });

    } catch (e) {
        console.warn("Error in rpc: ", e);
    }
}

module.exports = setupForReceivingRPC;
