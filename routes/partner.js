const express = require('express');

const router = express.Router();

const Partner = require('../models/partner')

const bcrypt = require('bcrypt');

const mailService = require('../config/mailService')

const jwt = require('jsonwebtoken');

const { verifyToken } = require('../config/accessAuth');
const { generateCode } = require('../config/codeGenerator');

const multer = require('multer');
const keys = require('../config/keys');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './partnersPhotos/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage })



// router for sign up new partner
router.post('/signup', (req, res) => {
    // search for partner in database first , if not there craete a new one 
    Partner.findOne({ email: req.body.email }).then((partner) => {
        if (partner) {
            res.send({ "Data": partner, "message": "Partner already exists, try to login!", "Status": false })
        } else {

            // hash the password and save it in database
            bcrypt.hash(req.body.password, 10).then(function (hash) {
                console.log(hash)

                Partner.create({
                    id: "",
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,

                },
                    (err, partner) => {
                        if (err) {
                            res.send({ "Data": err, "message": "Failed in creating a partner...!", "status": false })
                        } else {

                            //create an access token for new partner
                            const accesstoken = jwt.sign({ email: req.body.email },
                                keys.secretKey);
                            console.log("Token : ", accesstoken);

                            //update the user's id and access token
                            Partner.findOneAndUpdate({ email: req.body.email }, { id: partner._id.toString(), accessToken: accesstoken }, { new: true }, (err, newPartner) => {
                                if (err)
                                    console.log(err)
                                else
                                    console.log(newPartner)

                                res.status(200).send({ "Data": newPartner, "message": "New partner signed up successfully", "status": true, "token": accesstoken })
                            })
                            // mailService.sendEmail(user.email).catch(console.error);
                        }
                    })
            })
        }
    })
})


// login -------------------------------------------------
router.post('/login', (req, res) => {
    // console.log(req.headers)
    Partner.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
            res.status(500).send("Failed to find partner: " + err)
        } else {
            // console.log("data:", data)
            if (!data) {
                res.send({ "message": "Error in logging in ...!", "Status": false })
            } else {

                bcrypt.compare(req.body.password, data.password, function (err, result) {
                    if (err)
                        console.log("Error", err)
                    else {
                        if (result) {
                            console.log("password equals hash = ", result) // true 

                            //action (login)
                            const accesstoken = jwt.sign({ email: data.email },
                                keys.secretKey);
                            console.log("Token : ", accesstoken);

                            //update use's access token
                            Partner.findOneAndUpdate({ email: req.body.email }, { accessToken: accesstoken }, { new: true }, (err, newPartner) => {
                                if (err)
                                    console.log(err)
                                else
                                    console.log(newPartner)
                            })

                            // const refreshToken = jwt.sign({ email: data.email }, 'RefreshTokenSercterSentence', { expiresIn: '100h' });
                            // data.refreshToken = refreshToken;
                            //res.cookie("jwt", accesstoken, {secure: true, httpOnly: true})

                            res.status(200).send({ "Data": data, "message": "Logged in successfully", "status": true, "token": accesstoken })

                        } else {
                            console.log("Entered password is " + req.body.password + " and the hashed paswword is " + data.password)
                            res.send({ "message": "Something went wrong, please try again !", "Status": false })
                            // action redirect to login page 
                            // password is incorrect
                        }

                    }
                });
            }
        }
    })


})

//Get Partner By ID
router.get('/get/:accessToken', verifyToken, (req, res) => {
    // console.log(req.headers)
    // console.log("request params:", req.params)
    // console.log("Token is: ", req.params.accessToken)
    jwt.verify(req.params.accessToken, keys.secretKey, (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {

            Partner.findOne({ accessToken: req.params.accessToken }, (err, partner) => {
                if (err) {
                    // console.log("Error from find:", err)
                    res.status(500).send({ "Data": err, "message": "Error in getting data...!", "status": false })
                } else if (partner == null) {
                    res.status(500).send({ "Data": partner, "message": "No partner found ...!", "status": false })
                }
                else {
                    res.status(200).send({ "Data": partner, "message": "Data loaded Successfully", "status": true })
                }
            })
        }
    });
})


//Update Partner Profile
router.put('/update/:id', verifyToken, (req, res) => {
    jwt.verify(req.headers.authorization, keys.secretKey, (err, authData) => {
        console.log("req.params.accessToken:", req.headers.authorization)
        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            console.log("req.body", req.body)

            Partner.updateOne({ _id: req.params.id }, req.body, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in updating data...!", "status": false })
                } else {
                    res.status(200).send({ "Data": data, "message": "Data Updated Successfully", "status": true })
                }
            })
        }
    });

});

// upload Partner image 
router.post('/photo/:id', upload.single('photoURL'), (req, res) => {

    let id = req.params.id
    console.log(id)
    console.log("req.File: ", req.file)

    let photo_URL = req.file.path
    console.log("req.files.path:", req.file.path)

    Partner.findOneAndUpdate({ _id: req.params.id }, { photoURL: photo_URL }, (err, userData) => {
        if (err) {
            console.log("Error in update user", err)
            res.status(500).send({ "Data": err, "message": "Failed in uploading image", "status": false })

        } else {
            console.log("image uploaded", userData)
            res.status(200).send({ "Data": userData, "message": "Image uploaded successfully ", "status": true })

        }
    })

})


// reset Partner's password
router.put('/update', (req, res) => {
    jwt.verify(req.headers.authorization, keys.secretKey, (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            console.log("req.body.pass: ", req.body.password)
            // hash the password and save it in database
            bcrypt.hash(req.body.password, 10).then(function (hash) {
                console.log("hash: ", hash)
                Partner.updateOne({ accessToken: req.headers.authorization }, { password: hash }, (err, data) => {
                    if (err) {
                        res.status(500).send({ "Data": err, "message": "Error in resetting password...!", "status": false })
                    } else {
                        res.status(200).send({ "Data": data, "message": "Password reset Successfully", "status": true })
                    }
                })

            })

        }
    });

});


// reset code for Partner
router.post('/resetCode', verifyToken, (req, res) => {
    // console.log(req.headers)
    // console.log("Token: ", req.headers.authorization)
    // console.log(req.body)
    // console.log("Email from front: ",req.body.email)
    jwt.verify(req.headers.authorization, keys.secretKey, (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {

            Partner.findOne({ email: req.body.email }, (err, data) => {
                if (err) {
                    res.status(500).send("Error in find: " + err)
                }
                else if (data == null) {
                    res.status(500).send("Something is wrong !: ")
                } else {
                    let code = generateCode()
                    mailService.sendEmail(req.body.email, code).catch(console.error);
                    res.send({ "Data": code, "message": "Email sent successfully", "status": true })
                }
            })
        }
    });
})




module.exports = router