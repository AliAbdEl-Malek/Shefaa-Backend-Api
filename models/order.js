const mongoose = require('mongoose')


var order = new mongoose.Schema({

    order: [],
    user: {
        "id": String,
        'email':String
    },
    customer: {
        'id': String,
        'name': String,
        'address': String,
        "promoCode": String,
        "phone": String
    },




});

module.exports = mongoose.model("order", order);