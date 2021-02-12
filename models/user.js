const mongoose = require('mongoose')


var user = new mongoose.Schema({

    cartProducts:
   [{
       type:mongoose.Schema.Types.ObjectId,
       ref:"product"
    }],

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

module.exports = mongoose.model("siteuser", user);