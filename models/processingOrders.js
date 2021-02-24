const mongoose = require('mongoose')


var processingOrder = new mongoose.Schema({

    partnerEmail:String,
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    ],
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
    totalPrice:String,
    orderTime:String




},{timestamps:true});

module.exports = mongoose.model("processingOrder", processingOrder);