const Target = require('../models/target');

function putMessage(value) {
    return new Promise((resolve, reject) => {

        const target = new Target({
            username: value.username,
            photoLink: value.photoLink,
            location: value.location
        })

        target.save()
            .then(savedValue => {
                if (savedValue) {
                    resolve(savedValue)
                }
            })
            .catch(e => {
                console.trace('Saving failed')
                reject(e);
            })
    })
}

function deleteMessage(value) {
    return new Promise((resolve, reject) => {
        Target.deleteOne({ _id: value })
            .then((ok) => {
                if (ok.deletedCount === 0) {
                    resolve({message: "Nothing deleted. No such photoLink.", code: 0});
                }
                resolve({message: `Deleted ${ok.deletedCount} items successfully`, code: 1});
            }).catch((e) => {
            //https://microservices.io/patterns/observability/application-logging.html
            reject(`Deleting failed: ${e}`);
        })
    })
}

module.exports = {
    putMessage,
    deleteMessage
}
