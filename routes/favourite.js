const express = require('express');

const router = express.Router()

const siteuser = require('../models/user')

const jwt = require('jsonwebtoken');

const { verifyToken } = require('../config/accessAuth');

//==============================================


//Add to favourite
router.put('/add/:id', verifyToken, (req, res) => {
  

    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            siteuser.findOneAndUpdate({ accessToken: req.headers.authorization }, { $push: { favouriteProducts: req.params.id } }, (err, data) => {
                if (err) {

                    res.send({ "Data": err, "message": "Failed to add product to user's favourite", "status": false });
                } else {
                    res.status(200).send({ "Data": data, "message": "Product added to favourite successfully", "status": true })
                }
            })
        }
    });

});


//get favourite products for specific user
router.get('/', verifyToken, (req, res) => {

    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", async (err, authData) => {
        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            const products = await siteuser.findOne({ accessToken: req.headers.authorization }).populate("favouriteProducts")
            // console.log("products:", products)
            res.status(200).send({ "Data": products.favouriteProducts, "message": "Products retreived successfully", "status": true })
        }
    });

})


//rempve from favourite
router.put('/delete/:id', verifyToken, (req, res) => {
 
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            siteuser.findOneAndUpdate({ accessToken: req.headers.authorization }, { $pull: { favouriteProducts: req.params.id } }, (err, data) => {
                if (err) {

                    res.send({ "Data": err, "message": "Failed to delete product from user's cart", "status": false });
                } else {
                    res.status(200).send({ "Data": data, "message": "Product deleted successfully", "status": true })
                }
            })
        }
    });
})


//rempve all products from favourite
router.put('/delete', verifyToken, (req, res) => {
 
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            siteuser.findOneAndUpdate({ accessToken: req.headers.authorization }, { favouriteProducts: [] }, (err, data) => {
                if (err) {

                    res.send({ "Data": err, "message": "Failed to delete product from user's favourite", "status": false });
                } else {
                    res.status(200).send({ "Data": data, "message": "All favourite deleted successfully", "status": true })
                }
            })
        }
    });
})








module.exports = router