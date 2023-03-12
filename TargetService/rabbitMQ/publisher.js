const Rabbit = require('./Rabbit');

const rabbit = Rabbit;
let channel = undefined;
const exchangeName = 'Main';

async function assertExchange() {
    try {
        channel = await rabbit.getChannel();

        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        console.log(typeof channel);

    } catch (e) {
        console.log('Error: ' + e);
    }
}

const publish = async function (msg) {
    try {
        await assertExchange();
        await channel.publish(exchangeName, process.env.ROUTING_KEY, Buffer.from(JSON.stringify(msg)))
    } catch (e) {
        console.log(e);
    }
}

module.exports = publish;