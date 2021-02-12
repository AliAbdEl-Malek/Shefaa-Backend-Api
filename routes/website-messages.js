const express = require('express');

const router = express.Router();


const websiteMessages = require('../models/website-messages')



// router for posting websiteMessages 
router.post('/', (req, res) => {

    websiteMessages.create(
        {
            
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            subject: req.body.subject,
            messageContent: req.body.messageContent
        }, (err, message) => {
        if (err) {
            res.send({ "Data": err, "message": "Failed in posting a message...!", "status": false })
        } else {
            res.status(200).send({ "Data": message, "message": "New message posted Successfully", "status": true })
        }
    })
})















module.exports = router