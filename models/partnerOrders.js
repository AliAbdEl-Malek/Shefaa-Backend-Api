const mongoose = require('mongoose')


var partnerOrder = new mongoose.Schema({

    orderID:String,
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
    totalPrice:String




},{timestamps:true});

module.exports = mongoose.model("partnerOrder", partnerOrder);