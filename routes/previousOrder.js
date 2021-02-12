const express = require('express');
const jwt=require('jsonwebtoken');

const PreviousOrder =require ('../models/previous-orders')



const verifyToken = require('../config/accessAuth')



const router = express.Router();



// add new porder

router.post('/add',(req,res)=>{

    PreviousOrder.create({

    date:req.body.date,
    products:req.body.products,
    total:req.body.total,
    paymentMethod:req.body.paymentMethod,
    },
    
    (err,porder) =>{

        if(err)
        res.status(500).send({"Data": err, "message": "Data in requesting...!", "status": false })
        else
        res.status(200).send({"Data": porder, "message": "Posted Successfully", "status": true })

    }

    )

})

// get all porders

router.get('/',(req,res)=>{

    PreviousOrder.find({},(err,porders)=>{
        if(err)
        res.status(500).send({"Data": err, "message": "Data in requesting...!", "status": false })
        else
        res.status(200).send({"Data": porders, "message": "Posted Successfully", "status": true })
    })

})

module.exports =router;