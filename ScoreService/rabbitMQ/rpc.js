const amqp = require('amqplib/callback_api');
const uri = process.env.AMQP;
const exchangeName = 'Main';
const selfName = process.env.ROUTING_KEY || 'Undefined';

const props = { clientProperties: { connection_name: 'scoreConnection' }};

// client
async function sendTargetAMessage(message){
    try {
        amqp.connect(uri,  function (err, connection){
            if (err) {
                console.log("Error in rpc: ", err);
                throw err;
            }
            console.log('sending a message')

            connection.createChannel(function (err2, channel) {
                if (err2) {
                    throw err2;
                }

                const queue = 'rpc_queue';

                channel.assertQueue(queue, {
                    durable: false
                }, (err, q) => {
                    if (err) {
                        console.log(`error in assertQueue: ${err}`);
                        throw err;
                    }

                    let correlationId = generateUuid();

                    console.log('uuid generated: ' + correlationId);

                    channel.consume(q.queue, function (msg) {
                        if (msg.properties.correlationId === correlationId) {
                            console.log(' [.] Got %s', msg.content.toString());

                            setTimeout(function () {
                                connection.close();
                                process.exit(0)
                            }, 500);
                        }
                    }, {
                        noAck: true
                    });

                    channel.sendToQueue(queue, Buffer.from('testmessage'), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
                });

            });
        });
    } catch (e) {
        console.log("Error in rpc: ", e);
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
