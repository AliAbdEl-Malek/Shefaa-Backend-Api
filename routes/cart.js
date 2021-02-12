const express = require('express');

const router = express.Router()

const siteuser = require('../models/user')

//Add to cart
router.put('/add/:id',(req , res)=>{
console.log(req.body);

siteuser.findByIdAndUpdate(req.params.id,{

    $push:{cartProducts : req.body}

    },(err, cartProduct) => {
        if (err) {
            res.status(500).send({ "Data": err, "message": "Failed in posting new cartProduct...!", "status": false })
        } else {
            res.status(200).send({ "Data": cartProduct, "message": "New cartProduct Posted Successfully", "status": true })
        }
    });
});

//get cart
router.get('/',async(req , res) => {
    const foundUser = await siteuser.find().populate("cartProducts");
    console.log("osamaaaaaaaaaaaaa"+foundUser);

    res.status(200).send({ "Data": foundUser, "message": "All products retrieved Successfully..!", "status": true })
    // siteuser.find({}, (err, data) => {
    //     if (err) {
    //         res.status(500).send({ "Data": err, "message": "Failed in getting product's data ...!", "status": false })
    //     } else {
    //         res.status(200).send({ "Data": data, "message": "All products retrieved Successfully..!", "status": true })
    //     }
    // })
})

//rempve from cart
router.put('/delete/:productId',(req , res) => {
    console.log("walaaaaaaaaaa",req.body);
    siteuser.findByIdAndUpdate( req.body.userId , {
        $pull:{cartProducts:req.params.productId}
    })
    .then(data => res.json(data))
    // .catch(next)


})

module.exports = router

