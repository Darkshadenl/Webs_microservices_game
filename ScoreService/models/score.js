const Mongoose = require('mongoose');

let scoreSchema = new Mongoose.Schema({
    username: {type: 'string', required: true, unique: true},
    scored: [
        {
            base64: {type: 'string'},
            targetUsername: {type: 'string'},
            targetId: {type: Mongoose.Schema.Types.ObjectId},
            score: {type: 'string'}
        }
    ],
}, {timestamps: true});

const Score = Mongoose.model('Score', scoreSchema);

module.exports = Score;
