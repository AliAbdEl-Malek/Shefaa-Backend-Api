const mongoose= require ('mongoose')

var previousorder= new mongoose.Schema({

    'orderId':String,
    'userId': [{type:mongoose.Schema.Types.ObjectId,ref:"siteuser"}],
    
    'products': [String],
    'total':Number,
    'paymentMethod':String,

},{timestamps:true});

module.exports=mongoose.model("PreviousOrder",previousorder);