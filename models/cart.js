const mongoose= require ('mongoose')

var cart= new mongoose.Schema({

    cartId:String,
    
    
    productsIds:
     [{
        photoURL: String,
        price: Number,
        name: String,
    }],

    quantity: Number,
    
    

},{timestamps:true});

module.exports=mongoose.model("Cart",cart);