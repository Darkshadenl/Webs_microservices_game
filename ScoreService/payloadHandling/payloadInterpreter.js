const repo = require('../repos/repo');

class PayloadInterpreter {

    constructor(payload) {
        this.payload = payload;
    }

    async interpret() {
        await this.#action().then(() => {
            console.log('Payload interpreted');
            return('interpret message from broker was succesfully processed');
        }).catch(err => {
            console.log(err);
            throw err;
        });
    }

    async #action() {
        try {
            if (this.payload.action === "delete") {
                let value = this.payload.value.id
                await this.repo.delete(value);
                return;
            }
            if (this.payload.action === "create") {
                console.log('create');
                return;
            }
            if (this.payload.action === "get") {
                console.log('getImage');
                await this.repo.get(this.payload.body);
                return;
            }
        } catch (e) {
            throw 'Throwed: error occurred in service check of private method #action in post service';
        }
    }
}

module.exports = PayloadInterpreter;
