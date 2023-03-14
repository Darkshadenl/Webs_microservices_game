const Mongoose = require('mongoose');

let targetUserSchema = new Mongoose.Schema({
    username: {type: 'string', required: true, unique: true},
    targets: [{
        base64: {type: 'string'},
        location: {type: 'string'},
    }],
})

targetUserSchema.pre('save', async function () {
    // check if image already exists in database.
    // reject if exists

    const targets = this.targets;
    const length = targets.length;
    let image64;
    let id;

    if (length > 0) {
        id = targets[0]._id;
        image64 = targets[0].base64;
    }

    return new Promise(async (resolve, reject) => {
        if (id === undefined && image64 === undefined)
            resolve();
        for (let i = 0; i < length; i++) {
            let t = this.targets[i];
            if (t._id !== id) {
                if (t.base64 === image64) {
                    await reject(new Error('Image already exists'))
                }
            }
        }
        resolve();
    })
});

const Target = Mongoose.model('Target', targetUserSchema);

module.exports = Target;
