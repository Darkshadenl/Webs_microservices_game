const Rabbit = require('./Rabbit');

let channel = undefined;
const exchangeName = 'Main';

async function assertExchange() {
    try {
        await channel.assertExchange(exchangeName, 'direct', { durable: true });
    } catch (e) {
        console.log('Error: ' + e);
    }
}

const publish = async function (payload) {
    try {
        await assertExchange();
        await channel.publish(exchangeName, process.env.ROUTING_KEY, Buffer.from(JSON.stringify(payload)))
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    publish,
    assertExchange
};
