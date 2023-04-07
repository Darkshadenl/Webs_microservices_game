const Target = require('../models/target');

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
  *  @param {string} username - The username of the target to find.
  *  @returns {Object} The target object if found, otherwise null.
  */
 async function findTargetByUsername(username){
    try {
        return await Target.findOne({username: username});
    } catch (e) {
        console.log(e);
    }
 }

async function deleteTarget(id, username) {
    console.info('id username ', id, username);

    return new Promise((resolve, reject) => {
        Target.findOneAndUpdate(
            { username: username },
            { $pull: { targets: { _id: id } } },
            { useFindAndModify: false, new: true }
        )
            .then((result) => {
                console.log('result: ', result);

                if (!result) {
                    resolve({ message: "No matching target found for the given username.", code: 0 });
                } else {
                    const deletedTargetCount = result.targets.filter((target) => target._id.toString() === id).length;
                    if (deletedTargetCount === 0) {
                        resolve({ message: "No matching target found for the given username.", code: 0 });
                    } else {
                        resolve({ message: "Deleted target successfully.", code: 1 });
                    }
                }
            })
            .catch((e) => {
                reject(`Deleting failed: ${e}`);
            });
    });
}


/**
    *
    *  Saves a user target
    *  @param {Object} user - The user object
    *  @param {{base64: string, location: string}} target - The target object
    *  @returns {Promise} - A promise that resolves when the user target is saved
    */
async function saveUserTarget(user, target) {
    const {base64, location} = target;

    return new Promise((resolve, reject) => {

        user.targets.push({
            base64: base64,
            location: location
        });

        user.save()
            .then((savedValue) => {
                if (savedValue) {
                    console.log('savedValue: ', savedValue)
                    resolve(savedValue)
                }
            })
            .catch(e => {
                console.trace('Saving failed')
                reject(e);
            })
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

async function findImage(username, id) {
    try {
        return await findTargetByUsername(username).then((target) => {
            if (target) {
                return target.targets.id(id);
            }
        });
    } catch (e) {
        console.trace(e);
    }
}

async function getAllTargets(filter = {}) {
    try {
        return await Target.find(filter);
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
    findSingleTargetById,
    findImage,
    getAllTargets
}
