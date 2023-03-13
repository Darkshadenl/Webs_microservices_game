const Mongoose = require('mongoose');

let targetSchema = new Mongoose.Schema({
    photoLink: { type: 'string', required: true, unique: true},
    username: { type: 'string', required: true},
    location: { type: 'string', required: true},
})

const Target = Mongoose.model('Target', targetSchema);

module.exports = Target;
