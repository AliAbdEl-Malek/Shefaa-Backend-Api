const express = require('express');

const router = express.Router();

const User = require('../models/user')

const prescription = require('../models/prescription')

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './prescriptions/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage })

// upload prescription image 
router.post('/:id', upload.single('prescriptionURL'), (req, res) => {

    // let userData;
    let id = req.params.id
    console.log(id)
    console.log("req.File: ", req.file)

    let prescription_URL = req.file.path
    console.log("req.files.path:", req.file.path)

    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(user)
            // userData = user

            prescription.create({
                user:user,
                userID: req.params.id,
                prescriptionURL: prescription_URL
            }, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Failed in posting a prescription...!", "status": false })
                } else {
                    res.status(200).send({ "Data": data , "message": "Prescription uploaded successfully...!", "status": true })
                }
        
            })
        }
    })

    

})


//Get All prescriptions
router.get('/', (req, res) => {
    prescription.find({}, (err, data) => {
        if (err) {
            res.status(500).send({ "Data": err, "message": "Failed in getting prescriptions data ...!", "status": false })
        } else {
            res.status(200).send({ "Data": data, "message": "All prescriptions retrieved Successfully..!", "status": true })
        }
    })
})






module.exports = router