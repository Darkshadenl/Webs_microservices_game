const amqp = require('amqplib');
const uri = process.env.AMQP || undefined;
const exchangeName = 'Main';
const selfName = process.env.ROUTING_KEY || 'Undefined';

class RabbitMQ {

    constructor() {
        this.channel = undefined;
        this.connection = undefined;
        this.haveConnection = false;
        this.haveChannel = false;
    }

    async getChannel() {
        if (!this.haveChannel) {
            throw new Error('No channel');
        }
        return this.channel;
    }

    async createChannel() {
        return new Promise(async (resolve, reject) => {
            if (this.haveChannel === true) {
                resolve(this.channel);
            }
            await this.connection.createChannel().then((channel) => {
                this.channel = channel;
                this.haveChannel = true;
                resolve(this.channel);
            }).catch((error) => {
                this.haveChannel = false;
                console.log('Error creating channel (from Rabbit.js)');
                console.log(error);
                reject(error);
            });
        });
    }

    /**
    *  Creates a connection to RabbitMQ
    *
    *  @returns {Promise<Connection>} A promise that resolves to a connection object
    */
    async createConnection() {
        return new Promise(async (resolve, reject) => {
            const props = {clientProperties: {connection_name: 'targetConnection'}}

            await amqp.connect(uri, props).then((connection) => {
                resolve(connection);
            }).catch((error) => {
                console.log('Error creating connection (from Rabbit.js)');
                console.log(error);
                reject(error);
            });
        });
    }
}

module.exports = RabbitMQ;
