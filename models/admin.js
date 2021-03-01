const mongoose = require('mongoose')

var admin = new mongoose.Schema({

    'id': String,
    'name': String,
    'email': {
        type: String,
        unique: true
    },
    'password': String,
    "refreshToken": String,
    "photoURL": String,
    "accessToken":String,
    "address":String,
    "phone":String



});

module.exports = mongoose.model("admin", admin);