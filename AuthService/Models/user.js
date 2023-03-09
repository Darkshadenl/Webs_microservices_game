const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    isOwner:{type: Boolean},
    uid:{type: String},
    email:{type: String,unique:true, required:true},
    hash:{type: String,unique:true, required:true},
    salt:{type: String,unique:true, required:true}
})

const User = Mongoose.model('User',userSchema);
module.exports =  User;
