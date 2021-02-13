const express = require('express');

const router = express.Router()

const siteuser = require('../models/user')

//Add to favourite
router.put('/add/:id',(req , res)=>{
    console.log(req.body);
    
    siteuser.findByIdAndUpdate(req.params.id,{
    
    $push:{favouriteProducts : req.body}

    },(err, favouriteProduct) => {
        if (err) {
            res.status(500).send({ "Data": err, "message": "Failed in posting new favouriteProduct...!", "status": false })
        } else {
            res.status(200).send({ "Data": favouriteProduct, "message": "New favouriteProduct Posted Successfully", "status": true })
        }
    });
});

//get favourite
router.get('/',async(req , res) => {
    const foundUser = await siteuser.find().populate("favouriteProducts");
    console.log("favourite products "+foundUser);

    res.status(200).send({ "Data": foundUser, "message": "All products retrieved Successfully..!", "status": true })
    // siteuser.find({}, (err, data) => {
    //     if (err) {
    //         res.status(500).send({ "Data": err, "message": "Failed in getting product's data ...!", "status": false })
    //     } else {
    //         res.status(200).send({ "Data": data, "message": "All products retrieved Successfully..!", "status": true })
    //     }
    // })
})

//rempve from favourite
router.put('/delete/:productId',(req , res) => {
    console.log("walaaaaaaaaaa",req.body);
    siteuser.findByIdAndUpdate( req.body.userId , {
        $pull:{favouriteProducts:req.params.productId}
    })
    .then(data => res.json(data))
    // .catch(next)


})

module.exports = router