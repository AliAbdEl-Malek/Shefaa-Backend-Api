const mongoose = require('mongoose')


var websiteMessages = new mongoose.Schema({

    
    'name': String,
    'email': {
        type: String,
        required: true
    },
    "phone": String,
    'subject': String,
    "messageContent": String,

});

module.exports = mongoose.model("websiteMessage", websiteMessages);