const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productShema = new Schema({
    
    ID: String,
    pharmacyID: String,
    name: String,
    description: String,
    details: {
        title: String,
        body: String,
        sideEffects: String,
    },
    photoURL: String,
    price: Number,
    quantity: Number,
    category: String, // medicine or skin-care or baby-care or .....etc.
    language: String, //AR or EN

})

module.exports = mongoose.model('product', productShema);