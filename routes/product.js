const express = require('express');
const { verifyToken } = require('../config/accessAuth');

const router = express.Router()

const Product = require('../models/product')

const jwt = require('jsonwebtoken');
const product = require('../models/product');

//create a new product
router.post('/add', (req, res) => {

    Product.create({
        name: req.body.name,
        pharmacyID: req.body.pharmacyID,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        photoURL: req.body.photoURL,
        category: req.body.category

    }, (err, product) => {
        if (err) {
            res.status(500).send({ "Data": err, "message": "Failed in posting new product...!", "status": false })
        } else {

            //update the products's id 
            Product.findOneAndUpdate({ _id: product._id }, { ID: product._id }, { new: true }, (err, newProduct) => {
                if (err)
                    console.log(err)
                else
                    console.log(newProduct)

                    res.status(200).send({ "Data": product, "message": "New product Posted Successfully", "status": true })
            })
            
    }
})
            

});



// get all products
router.get('/', (req, res) => {
    Product.find({}, (err, data) => {
        if (err) {
            res.status(500).send({ "Data": err, "message": "Failed in getting product's data ...!", "status": false })
        } else {
            res.status(200).send({ "Data": data, "message": "All products retrieved Successfully..!", "status": true })
        }
    })
})


// get a specific product by id
router.get('/:id', verifyToken, (req, res) => {

    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
        console.log("req.params.accessToken:" ,req.headers.authorization)
        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {

            
            Product.findById(req.params.id, (err, product) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Failed in getting product's data ...!", "status": false })
                } else {
                    
                    res.status(200).send({ "Data": product, "message": " product retrieved Successfully..!", "status": true })
                }
            })
        }
    });
   
})


// get a specific product by name
router.get('/get/:name', verifyToken, (req, res) => {
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
        console.log("req.headers.authorization:" ,req.headers.authorization)
        if (err) {
            
            res.send({ "Data": err, "message": "Session expired!", "status": false });
            
        } else {
            
            console.log("req.params.name", req.params.name)
            
            Product.findOne({name: req.params.name}, (err, product) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Failed in getting product's data ...!", "status": false })
                } else {
                    
                    res.status(200).send({ "Data": product, "message": " product retrieved Successfully..!", "status": true })
                }
            })
        }
    });
   
})


// get a specific product by category
router.get('/get/:category', verifyToken, (req, res) => {
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
        console.log("req.headers.authorization:" ,req.headers.authorization)
        if (err) {
            
            res.send({ "Data": err, "message": "Session expired!", "status": false });
            
        } else {
            
            console.log("req.params.name", req.params.name)
            
            Product.findOne({category: req.params.category}, (err, product) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Failed in getting product's data ...!", "status": false })
                } else {
                    
                    res.status(200).send({ "Data": product, "message": " product retrieved Successfully..!", "status": true })
                }
            })
        }
    });
   
})


// update a product 
router.put('/update/:id', (req, res) => {

    Product.findOneAndUpdate({ _id: req.params.id }, {
        name: req.body.name,
        pharmacyID: req.body.pharmacyID,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        photoURL: req.body.photoURL,
        category: req.body.category


    }, (err, product) => {

        if (err) {
            res.status(500).send({ "Data": err, "message": "Failed in Updating product's data ...!", "status": false })
        } else {
            res.status(200).send({ "Data": product, "message": " Product Updated Successfully..!", "status": true })
        }
    })
})





module.exports = router