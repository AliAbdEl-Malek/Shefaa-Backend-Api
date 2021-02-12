const express = require('express');

const router = express.Router();

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

    let id = req.params.id
    console.log(id)
    console.log("req.File: ", req.file)

    let prescription_URL = req.file.path
    console.log("req.files.path:", req.file.path)

    prescription.create({
        userID: req.params.id,
        prescriptionURL: prescription_URL
    }, (err, data) => {
        if (err) {
            res.status(500).send({ "Data": err, "message": "Failed in posting a prescription...!", "status": false })
        } else {
            res.status(200).send({ "Data": data, "message": "Prescription uploaded successfully...!", "status": true })
        }

    })

})






module.exports = router