const amqp = require('amqplib');
const uri = 'amqp://rabbit:5672';
const exchangeName = 'Main';
const selfName = process.env.ROUTING_KEY || 'Undefined';


class RabbitMQ {

    constructor() {
        this.channel = undefined;
        this.connection = undefined;
        this.setup().then(r => console.log('RabbitMQ setup complete'));
    }

    async setup() {
        try {
            await this._createConnection();
            await this._createChannel();
            await this._createExchange();
        } catch (e) {
            console.log(e);
        }
    }

    async reset(){
        await this.setup();
        return this.channel;
    }

    async getChannel() {
        if (this.channel === undefined || this.connection === undefined) {
            await this.setup();
        }
        return this.channel;
    }

    async _createExchange() {
        await this.channel.assertExchange(exchangeName, 'direct', { durable: true });
    }

    async _createChannel() {
        if (this.channel !== undefined) {
            return;
        }

        try {
            this.channel = await this.connection.createChannel();
        } catch (error) {
            console.log('Error creating channel (from Rabbit.js)');
            console.log(error);
        }
    }

    async _createConnection() {
        if (this.connection !== undefined) {
            return this.connection;
        }
        try {
            this.connection = await amqp.connect(uri);
            console.log(`Created connection (from Rabbit.js) ${selfName}`);
        } catch (e) {
            console.log('Error creating connection (from Rabbit.js)');
            console.log(e);
        }
    }

}

const Rabbit = new RabbitMQ();

module.exports = Rabbit;
