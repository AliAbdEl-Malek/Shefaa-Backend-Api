const express = require('express');

const Notification = require('../models/notification')
const router = express.Router();

router.post('/post/:id', (req,res) => {
    Notification.findOne({userid:req.params.id},(err,notification)=>{
        if(err){
            console.log("Error",err)
        }else{
            Notification.insertMany({userid : notification.userid},{
        
                data: req.body.data
                // title: req.body.title,
                // body: req.body.body,
                // date: req.body.date,
                // source: req.body.source 
        
            },
             (err, Notification) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Data in requesting...!", "status": false })
                }
                else {
                    res.status(200).send({ "Data": Notification, "message": "Posted Successfully", "status": true })
                }
            })
        }
    })
    
})

router.get('/get', (req,res) => {
    Notification.find({}, (err, Notification) => {
        if (err) {
            res.status(500).send({ "Data": err, "message": "Data in getting data...!", "status": false })
        }
        else {
            res.status(200).send({ "Data": Notification, "message": "Data loaded Successfully", "status": true })
        }
    })
})



module.exports = router
