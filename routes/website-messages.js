const express = require('express');

const router = express.Router();

const websiteMessages = require('../models/website-messages')

// get all messages
router.get('/message', (req, res) => {
    websiteMessages.find({}, (err, data) => {
        if (err) {
            res.status(500).send({ "Data": err, "message": "Failed in getting messages ...!", "status": false })
        } else {
            res.status(200).send({ "Data": data, "message": "All messages retrieved Successfully..!", "status": true })
        }
    })
})

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