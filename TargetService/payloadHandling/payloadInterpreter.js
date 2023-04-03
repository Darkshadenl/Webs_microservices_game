const {findImage} = require("../repos/targetRepo");

class PayloadInterpreter {

    constructor(payload) {
        this.payload = payload;
    }

    async interpret() {
        return await this.#action().then((result) => {
            return(result);
        }).catch(err => {
            console.log(err);
            throw err;
        });
    }

    async #action() {
        try {
            if (this.payload.action === "delete") {
                let value = this.payload.value.id
                return 'deleted';
            }
            if (this.payload.action === "create") {
                console.log('create');
                return "created";
            }
            if (this.payload.action === "get") {
                const username = this.payload.body.dataValue.targetUsername;
                const imageId = this.payload.body.dataValue.targetId;
                return await findImage(username, imageId);
            }
        } catch (e) {
            throw 'Throwed: error occurred in service check of private method #action in post service';
        }
    }
}

module.exports = PayloadInterpreter;
