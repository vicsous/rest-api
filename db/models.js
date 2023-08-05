const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email:  {
        type: String,
    },
    password:  {
        type: String,
    },
    roles: [{
        type: String,
    }]
},
{   
    timestamps: true
})

const ErrorSchema = new mongoose.Schema({
	message: {
        type: String,
    },
    stack:  {
        type: Object,
    }
},
{   
    timestamps: true
})

const Error = mongoose.model('Error', ErrorSchema);
const User = mongoose.model('User', UserSchema);

module.exports = { Error, User }