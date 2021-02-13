const { Router } = require('express');
const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const { verifyToken } = require('../config/accessAuth');

const Order = require('../models/order');

const User = require('../models/user')

//===========================================================

// router for creating an order
router.post('/', verifyToken, (req, res) => {

    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {

            Order.create({
                order: req.body.order,
                user: req.body.user,
                customer: req.body.customer
            }, (err, data) => {
                if (err) {
                    //    console.log("Error in creating a checkout")
                    res.status(500).send({ "Data": err, "message": "Error in creating an order", "status": false })
                } else {
                    User.findOneAndUpdate({ accessToken: req.headers.authorization}, { $push: { orders: data._id } }, (err, user) => {
                        if (err) {
                            //    console.log("Error in creating a checkout")
                            res.status(500).send({ "Data": err, "message": "Failed to find user", "status": false })
                        } else {
                            res.status(200).send({ "Data": data, "message": "Order is posted successfully", "status": true })
                        }
                    })

                }

            })
        }
    });

})


// router for getting all orders
router.get('/', verifyToken, (req, res) => {
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            Order.find({}, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in retrieving orders", "status": false })
                } else {
                    res.status(200).send({ "Data": data, "message": "Orders retrieved successfully", "status": true })

                }
            })

        }
    });

})


// router for getting an order with id
router.get('/:id', verifyToken, (req, res) => {
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {

            Order.findById({ _id: req.params.id }, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in retrieving order", "status": false })
                } else {
                    res.status(200).send({ "Data": data, "message": "Order retrieved successfully", "status": true })

                }
            })

        }
    });

})



// Router for deleting an order with id
router.put('/delete/:id',verifyToken,(req,res)=>{
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {

            User.findOneAndUpdate({ accessToken: req.headers.authorization},{$pull:{orders:req.params.id}}, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in deleting an order", "status": false })
                } else {
                    Order.findOneAndDelete({_id:req.params.id},(err,data)=>{
                        if(err){
                            console.log(`Error in deleting an order of id`, req.params.id)
                        }else{
                            console.log(`Order deleted successfully of id ${req.params.id}`)
                        }
                    })
                    res.status(200).send({ "Data": data, "message": "Order deleted successfully", "status": true })

                }
            })
        }
    });

})


// Router for deleting all orders
router.put('/delete',verifyToken,(req,res)=>{

    let orders=[]
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            User.findOne({ accessToken: req.headers.authorization},(err,user)=>{
                if(err){
                    res.status(500).send({ "Data": err, "message": "failed to find user", "status": false })
                }else{
                    orders = user.orders
                }
            })

            User.findOneAndUpdate({ accessToken: req.headers.authorization},{orders:[]}, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in deleting an order", "status": false })
                } else {
                    for(let order of orders){
                        Order.findOneAndDelete({_id:order},(err,data)=>{
                            if(err){
                                console.log("Error in deleting an order with id:", order)
                            }else{
                                console.log("Order deleted with id:", order)
                            }
                        })
                    }
                    res.status(200).send({ "Data": data, "message": "All orders deleted successfully", "status": true })
                    
                }
            })
        }
    });

})



































module.exports = router