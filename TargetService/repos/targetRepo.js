const Target = require('../models/target');

function putMessage(username, location, base64) {
    return new Promise((resolve, reject) => {

        const target = new Target({
            base64: base64,
            username: username,
            location: location
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
                    resolve({message: "Nothing deleted.", code: 0});
                }
                resolve({message: `Deleted ${ok.deletedCount} items successfully`, code: 1});
            }).catch((e) => {
            reject(`Deleting failed: ${e}`);
        })
    })
}

module.exports = {
    putMessage,
    deleteMessage
}
