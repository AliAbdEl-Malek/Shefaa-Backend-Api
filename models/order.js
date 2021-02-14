const mongoose = require('mongoose')


var order = new mongoose.Schema({

    order: [],
    user: {
        "id": String,
        'email':String
    },
    customer: {
        'name': String,
        'address': String,
        "promoCode": String,
        "phone": String
    },




},{timestamps:true});

module.exports = mongoose.model("order", order);