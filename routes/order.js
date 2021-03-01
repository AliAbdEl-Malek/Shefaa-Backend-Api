const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const { verifyToken } = require('../config/accessAuth');

const Order = require('../models/order');

const User = require('../models/user')

const keys = require('../config/keys');

const partner = require('../models/partner');

const processingOrders = require('../models/processingOrders');

const deliveredOrders = require('../models/deliveredOrders');



//==================== (user) =======================================

// router for creating an order
router.post('/', verifyToken, (req, res) => {

    // console.log("req.body.products",req.body.products)
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {

            //craete an order for user
            Order.create({
                products:req.body.products,
                user: req.body.user,
                customer: req.body.customer,
                totalPrice: req.body.totalPrice
            }, (err, data) => {
                if (err) {
                    //    console.log("Error in creating a checkout")
                    res.status(500).send({ "Data": err, "message": "Error in creating an order", "status": false })
                } else {
                    res.status(200).send({ "Data": data, "message": "Order is posted successfully", "status": true })

                }
            })
        }
    });

})


//get delivered orders for specific user
router.get('/user/delivered', verifyToken, (req, res) => {
    let result = []
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", async (err, authData) => {
        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            const data = await User.findOne({ accessToken: req.headers.authorization }).populate({path:"deliveredOrders",populate:[{path:"products"}]})
           for(let item of data.deliveredOrders){
                result.push({id:item._id,products:item.products,orderTime:item.orderTime,totalPrice:item.totalPrice,customer:item.customer,user:item.user })
           }
            // console.log("products:", products)
            res.status(200).send({ "Data": result, "message": "Products retreived successfully", "status": true })
        }
    });

})



// Router for deleting an order with id
router.put('/delete/:id', verifyToken, (req, res) => {
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {

            User.findOneAndUpdate({ accessToken: req.headers.authorization }, { $pull: { deliveredOrders: req.params.id } }, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in deleting an order", "status": false })
                } else {

                    res.status(200).send({ "Data": data, "message": "Order deleted successfully", "status": true })
                }
            })
        }
    });

})


// Router for deleting all orders
router.put('/delete', verifyToken, (req, res) => {

    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            User.findOneAndUpdate({ accessToken: req.headers.authorization }, { deliveredOrders: [] }, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in deleting an order", "status": false })
                } else {
                    res.status(200).send({ "Data": data, "message": "All orders deleted successfully", "status": true })
                }
            })
        }
    });

})



//===================== (partners) ==========================================

// router for getting all orders for partner
router.get('/', verifyToken, (req, res) => {
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, keys.secretKey, (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            Order.find({}, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in retrieving orders", "status": false })
                } else if (data == null) {
                    res.status(500).send({ "Data": err, "message": "Error in retrieving orders", "status": false })

                }
                else {
                    res.status(200).send({ "Data": data, "message": "Orders retrieved successfully", "status": true })
                }
            })
        }
    });
})



// router for posting a processing order
router.put('/processing/:id', verifyToken, (req, res) => {

    let myPartner;
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, keys.secretKey, (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {

            partner.findOne({ accessToken: req.headers.authorization }, (err, partner) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in finding the partner", "status": false })
                } else {
                    myPartner = partner.email
                    //creating a processing order
                    processingOrders.create({
                        partnerEmail: myPartner,
                        products: req.body.products,
                        user: req.body.user,
                        customer: req.body.customer,
                        totalPrice: req.body.totalPrice,
                        orderTime: req.body.orderTime
                    }, (err, data) => {
                        if (err) {
                            //    console.log("Error in creating a checkout")
                            res.status(500).send({ "Data": err, "message": "Error in creating a processing order", "status": false })
                        } else {
                            //deleting the order from orders
                            Order.findOneAndDelete({ _id: req.params.id }, (err, result) => {
                                if (err) {
                                    console.log("Error in deleting the order from partner orders",err)
                                } else {
                                    console.log("Order id deleted from partner orders successfully",result)
                                    res.status(200).send({ "Data": data, "message": "Order is in processing successfully", "status": true })
                                }
                            })
                        }
                    })
                }
            })
        }
    });
})



// router for getting all processing orders for partner
router.get('/get/processing', verifyToken, (req, res) => {
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, keys.secretKey, (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            processingOrders.find({}, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in retrieving orders", "status": false })
                } else if (data == null) {
                    res.status(500).send({ "Data": err, "message": "Error in retrieving orders", "status": false })
                }
                else {
                    res.status(200).send({ "Data": data, "message": "Orders retrieved successfully", "status": true })
                }
            })
        }
    });
})



// router for posting a delivered order
router.put('/partner/deliver/:id', verifyToken, (req, res) => {

    let myPartner;
    // console.log("req.headers.authorization:",req.headers.authorization)
    jwt.verify(req.headers.authorization, keys.secretKey, (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {

            partner.findOne({ accessToken: req.headers.authorization }, (err, partner) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in finding the partner", "status": false })
                } else {
                    myPartner = partner.email

                    deliveredOrders.create({
                        partnerEmail: myPartner,
                        products: req.body.products,
                        user: req.body.user,
                        customer: req.body.customer,
                        totalPrice: req.body.totalPrice,
                        orderTime: req.body.orderTime
                    }, (err, data) => {
                        if (err) {
                            //    console.log("Error in creating a checkout")
                            res.status(500).send({ "Data": err, "message": "Error in creating an order", "status": false })
                        } else {
                            console.log("data._id",data._id)
                            // update user with delivered order id 
                            User.findOneAndUpdate({ _id: req.body.user.id }, { $push: { deliveredOrders: data._id } }, (err, user) => {
                                if (err) {
                                    console.log("Error in updating", err)
                                } else {
                                    console.log("User delivered ordered updated successfully", user)
                                }
                            })
                            // delete order from processing orders 
                            processingOrders.findOneAndDelete({ _id: req.params.id }, (err, data) => {
                                if (err) {
                                    console.log(`Error in deleting an order form partner orders of id`, req.params.id)
                                } else {
                                    console.log(`Order form partner orders deleted successfully of id ${req.params.id}`)
                                }
                            })
                            res.status(200).send({ "Data": data, "message": "Order delivered successfully ...!", "status": true })

                        }
                    })
                }
            })
        }
    });

})




// router for getting all deliverd orders for partner
router.get('/get/deliverd', verifyToken, (req, res) => {
    // console.log("req.headers.authorization:", req.headers.authorization)
    jwt.verify(req.headers.authorization, keys.secretKey, (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            deliveredOrders.find({}, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in retrieving orders", "status": false })
                } else if (data == null) {
                    res.status(500).send({ "Data": err, "message": "Error in retrieving orders", "status": false })
                }
                else {
                    res.status(200).send({ "Data": data, "message": "Orders retrieved successfully", "status": true })
                }
            })
        }
    });
})



//===================== (admin) ==========================================


// router for getting all deliverd orders for admin
router.get('/admin/deliverd', verifyToken, (req, res) => {
    // console.log("req.headers.authorization:", req.headers.authorization)
    jwt.verify(req.headers.authorization, 'secretKey', (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });
        } else {
            deliveredOrders.find({}, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in retrieving orders", "status": false })
                } else if (data == null) {
                    res.status(500).send({ "Data": err, "message": "Error in retrieving orders", "status": false })
                }
                else {
                    res.status(200).send({ "Data": data, "message": "Orders retrieved successfully", "status": true })
                }
            })
        }
    });
})



















module.exports = router