const Target = require('../models/target');
const publisher = require("../rabbitMQ/publisher");

/**
    *  Saves a user to the database
    *  @async
    *  @param {string} username - The username of the user to save
    *  @returns {Promise<Target>} - The saved user
    */
    async function saveUser(username) {
    const target = new Target({
        username: username,
    })

    return new Promise((resolve, reject) => {
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

/**
    *  Checks if a user exists in the database. If exists, returns the user object.
    *  If not, returns false
    *  @async
    *  @param {string} username - The username to check
    *  @returns {Promise<Object|boolean>} - Returns the user object if found, false if not found
    */
async function userExists(username){
    try {
        return await Target.findOne({username: username});
    } catch (e) {
        console.log(e);
    }
}

async function retrieveTarget(username){
    return new Promise((resolve, reject) => {
        Target.findOne({ username: username }).then((target) => {
            if (target) {
                resolve(target)
            }
            reject(false)
        }).catch((e) => {
            reject('Something went wrong. Error: ' + e)
        });
    })
}

async function deleteTarget(id) {
    return new Promise((resolve, reject) => {
        Target.deleteOne({ 'targets._id': id })
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


async function saveUserTarget(user, target) {
    const {image, location} = target;

    return new Promise((resolve, reject) => {
        const binaryData = Buffer.from(image, 'utf8');
        const base64EncodedData = binaryData.toString('base64');

        user.targets.push({
            base64: base64EncodedData,
            location: location
        });

        user.save()
            .then((savedValue) => {
                if (savedValue) {
                    resolve(savedValue)
                }
            })
            .catch(e => {
                console.trace('Saving failed')
                reject(e);
            })
    })

    // const payload = createPayload(
    //     'create',
    //     `${answer.id}`,
    //     "user",
    //     {
    //         uploadByUsername: answer.uploadByUsername,
    //         base64: answer.base64,
    //         location: answer.location
    //     },
    // );
    // publisher(payload);

}


async function checkForExistingImage(image) {
    return new Promise((resolve, reject) => {
        Target.findOne({ 'targets.base64': image })
            .then((target) => {
                if (target) {
                    resolve(target)
                }
                reject(false)
            }).catch((e) => {
            reject('Something went wrong. Error: ' + e)
        });
    })
}

module.exports = {
    deleteTarget,
    userExists,
    saveUserTarget,
    saveUser,
    retrieveTarget,
    checkForExistingImage
}
