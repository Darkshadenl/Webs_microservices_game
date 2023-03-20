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
    *  Checks if a user exists in the database. If exists, returns the target object.
 *  @async
    */
async function findTargetByUsername(username){
    try {
        return await Target.findOne({username: username});
    } catch (e) {
        console.log(e);
    }
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


/**
    *
    *  Saves a user target
    *  @param {Object} user - The user object
    *  @param {Object} target - The target object
    *  @param {String} target.image - The image of the target
    *  @param {String} target.location - The location of the target
    *  @returns {Promise} - A promise that resolves when the user target is saved
    */
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

async function findTargetById(id) {
        try {
            return await Target.findById(id)
        } catch (e) {
            console.trace(e);
        }
}

async function findSingleTargetById(id) {
        try {
            return await Target.findOne({ 'targets._id': id })
        } catch (e) {
            console.trace(e);
        }
}

module.exports = {
    deleteTarget,
    findTargetByUsername,
    saveUserTarget,
    saveUser,
    findTargetById,
    findSingleTargetById
}
