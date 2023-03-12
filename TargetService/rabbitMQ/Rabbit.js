const amqp = require('amqplib');
const uri = 'amqp://rabbit:5672';
const exchangeName = 'Main';
const selfName = process.env.COPY_KEY || 'Undefined';

var Rabbit = (function () {
    var connection = undefined;
    var channel = undefined;

    return {
        getChannel: getChannel,
        reset: reset,
    };

    async function setup() {
        try {
            await _createConnection();
            await _createChannel();
            await _createExchange();
        } catch (e) {
            console.log(e);
        }
    }

    async function reset(){
        await setup();
        return channel;
    }

    async function getChannel() {
        if (channel === undefined || connection === undefined) {
            await setup();
        }
        return channel;
    }

    async function _createExchange() {
        await channel.assertExchange(exchangeName, 'direct', { durable: true });
    }

    async function _createChannel() {
        if (channel !== undefined) {
            return;
        }

        try {
            channel = await connection.createChannel();
        } catch (error) {
            console.log('Error creating channel (from Rabbit.js)');
            console.log(error);
        }
    }

    async function _createConnection() {
        if (connection !== undefined) {
            return connection;
        }
        try {
            connection = await amqp.connect(uri);
            console.log(`Created connection (from Rabbit.js) ${selfName}`);
        } catch (e) {
            console.log('Error creating connection (from Rabbit.js)');
            console.log(e);
        }
    }
})();

module.exports = Rabbit;