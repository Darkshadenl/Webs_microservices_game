const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    isOwner:{type: Boolean},
    username:{type: String,unique:true, required:true},
    password:{type: String, required:true},
    role:{type: String, required:true},
    salt:{type: String, required:true}
})

const User = Mongoose.model('User',userSchema);
module.exports =  User;
