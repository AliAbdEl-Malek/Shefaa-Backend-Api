const mongoose = require('mongoose')

var notification = new mongoose.Schema({

    'userid' : {
        type: String,
    },
    'data' : [],

    // 'title' : {
    //     type: String,
    //     required: true
    // },
    // 'body' : {
    //     type: String,
    //     required: true
    // },
    // 'date' : {
    //     type: Date,
    // },
    // 'source' : {
    //     type: String,
    //     required: true
    // }
    
})

module.exports = mongoose.model("Notification", notification);