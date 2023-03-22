const Mongoose = require('mongoose');

let scoreSchema = new Mongoose.Schema({
    username: {type: 'string', required: true, unique: true},
    scored: [
        {
            base64: {type: 'string'},
            targetUsername: {type: 'string'},
            targetId: {type: 'string'},
            score: {type: 'string'}
        }
    ],
}, {timestamps: true});

scoreSchema.pre('save', async function () {
    // check if image already exists in database.
    // reject if exists

    // const targets = this.targets;
    // const length = targets.length;
    // let image64;
    // let id;
    //
    // if (length > 0) {
    //     id = targets[0]._id;
    //     image64 = targets[0].base64;
    // }
    //
    // return new Promise(async (resolve, reject) => {
    //     if (id === undefined && image64 === undefined)
    //         resolve();
    //     for (let i = 0; i < length; i++) {
    //         let t = this.targets[i];
    //         if (t._id !== id) {
    //             if (t.base64 === image64) {
    //                 await reject(new Error('Image already exists'))
    //             }
    //         }
    //     }
    //     resolve();
    // })
});

const Score = Mongoose.model('Score', scoreSchema);

module.exports = Score;
