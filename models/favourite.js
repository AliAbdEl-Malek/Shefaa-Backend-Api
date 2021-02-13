const mongoose= require ('mongoose')

var favourite= new mongoose.Schema({

    favouriteId:String,
    productsIds:
     [{
        photoURL: String,
        price: Number,
        name: String,
    }],

},{timestamps:true});

module.exports=mongoose.model("Favourite",favourite);