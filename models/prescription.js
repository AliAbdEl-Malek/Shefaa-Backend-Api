const mongoose = require('mongoose')


var prescription = new mongoose.Schema({

    'userID': String,
    'prescriptionURL': String,
    

});

module.exports = mongoose.model("prescription", prescription);