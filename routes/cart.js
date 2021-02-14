const express = require('express');

const { verifyToken } = require('../config/accessAuth');

const router = express.Router()

const siteuser = require('../models/user')

const jwt = require('jsonwebtoken');

const User = require('../models/user')

//=========================================

//Add to cart
router.put('/add/:id', verifyToken, (req, res) => {
  

    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            siteuser.findOneAndUpdate({ accessToken: req.headers.authorization }, { $push: { cartProducts: req.params.id } }, (err, data) => {
                if (err) {

                    res.send({ "Data": err, "message": "Failed to add product to user's cart", "status": false });
                } else {
                    res.status(200).send({ "Data": data, "message": "Product added successfully", "status": true })
                }
            })
        }
    });

});



//get cart products for specific user
router.get('/', verifyToken, (req, res) => {

    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", async (err, authData) => {
        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            const products = await siteuser.findOne({ accessToken: req.headers.authorization }).populate("cartProducts")
            // console.log("products:", products)
            res.status(200).send({ "Data": products.cartProducts, "message": "Products retreived successfully", "status": true })
        }
    });

})



//rempve from cart
router.put('/delete/:id', verifyToken, (req, res) => {
 
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            siteuser.findOneAndUpdate({ accessToken: req.headers.authorization }, { $pull: { cartProducts: req.params.id } }, (err, data) => {
                if (err) {

                    res.send({ "Data": err, "message": "Failed to delete product from user's cart", "status": false });
                } else {
                    res.status(200).send({ "Data": data, "message": "Product deleted successfully", "status": true })
                }
            })
        }
    });
})


// Router for deleting all products in cart
router.put('/delete',verifyToken,(req,res)=>{

    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            User.findOneAndUpdate({ accessToken: req.headers.authorization},{cartProducts:[]}, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Failed to delete cart products", "status": false })
                } else {

                    res.status(200).send({ "Data": data, "message": "All cart products deleted successfully", "status": true })
                }
            })
        }
    });

})







module.exports = router

