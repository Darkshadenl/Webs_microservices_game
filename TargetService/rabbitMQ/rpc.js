const amqp = require('amqplib/callback_api');
const uri = process.env.AMQP;

// server
async function setupForReceivingRPC() {
    try {
        amqp.connect(uri,  function (err, connection){
            if (err) {
                console.log("Error in rpc: ", err);
                throw err;
            }

            connection.createChannel(function (err2, channel) {
                if (err2) {
                    throw err2;
                }
                const queue = 'rpc_queue';

                channel.assertQueue(queue, {
                    durable: false
                });
                channel.prefetch(1);
                console.log(' [x] Awaiting RPC requests');

                channel.consume(queue, function reply(msg) {
                    console.log(msg.content.toString());

                    const reply = "Hello from target";

                    channel.sendToQueue(msg.properties.replyTo,
                        Buffer.from(reply), {
                            correlationId: msg.properties.correlationId
                        });

                    channel.ack(msg);
                });
            });
        })
    } catch (e) {
        console.log("Error in rpc: ", e);
    }
}

module.exports = setupForReceivingRPC;
