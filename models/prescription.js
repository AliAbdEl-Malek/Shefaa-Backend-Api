const mongoose = require('mongoose')


var prescription = new mongoose.Schema({

    'userID': String,
    "user":Object,
    'prescriptionURL': String,
    

});

module.exports = mongoose.model("prescription", prescription);