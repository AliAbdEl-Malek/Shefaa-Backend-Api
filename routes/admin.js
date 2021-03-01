const express = require('express');

const router = express.Router();

const Admin = require('../models/admin')

const bcrypt = require('bcrypt');

const mailService = require('../config/mailService')

const jwt = require('jsonwebtoken');

const { verifyToken } = require('../config/accessAuth');

const { generateCode } = require('../config/codeGenerator');

const multer = require('multer');

const keys = require('../config/keys');

//===================================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage })


// router for sign up new admin
router.post('/signup', (req, res) => {
    // search for admin in database first , if not there craete a new one 
    Admin.findOne({ email: req.body.email }).then((admin) => {
        if (admin) {
            res.send({ "Data": admin, "message": "admin already exists, try to login!", "Status": false })
        } else {

            // hash the password and save it in database
            bcrypt.hash(req.body.password, 10).then(function (hash) {
                console.log(hash)

                Admin.create({
                    // id: "",
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                },
                (err, admin) => {
                    if (err) {
                        res.send({ "Data": err, "message": "Failed in requesting...!", "status": false })
                    } else {

                        //create an access token for new admin
                        const accesstoken = jwt.sign({ email: req.body.email },
                            'secretKey');
                        console.log("Token : ", accesstoken);

                        //update the admin's id and access token
                        Admin.findOneAndUpdate({ email: req.body.email }, { id: admin._id.toString(), accessToken: accesstoken }, { new: true }, (err, newUser) => {
                            if (err)
                                console.log(err)
                            else
                                console.log(newUser)

                            res.status(200).send({ "Data": newUser, "message": "New admin signed up Successfully", "status": true, "token": accesstoken })
                        })
                        // mailService.sendEmail(admin.email).catch(console.error);
                    }
                })
            })
        }
    })
})

// login -------------------------------------------------
router.post('/login', (req, res) => {
    Admin.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
            res.status(500).send("Failed to find email: " + err)
        } else {
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
                                'secretKey');
                            console.log("Token : ", accesstoken);

                            //update use's access token
                            Admin.findOneAndUpdate({ email: req.body.email }, { accessToken: accesstoken }, { new: true }, (err, newUser) => {
                                if (err)
                                    console.log(err)
                                else
                                    console.log(newUser)
                            })
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

//Get Profile By accessToken
router.get('/get/:accessToken', verifyToken, (req, res) => {
    jwt.verify(req.params.accessToken, "secretKey", (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            Admin.findOne({ accessToken: req.params.accessToken }, (err, admin) => {
                if (err) {
                    // console.log("Error from find:", err)
                    res.status(500).send({ "Data": err, "message": "Error in getting data...!", "status": false })
                } else {
                    res.status(200).send({ "Data": admin, "message": "Data loaded Successfully", "status": true })
                }
            })
        }
    });
})

//Get All Admins
router.get('/', (req, res) => {
    Admin.find({}, (err, data) => {
        if (err) {
            res.status(500).send({ "Data": err, "message": "Failed in getting admins data ...!", "status": false })
        } else {
            res.status(200).send({ "Data": data, "message": "All admins retrieved Successfully..!", "status": true })
        }
    })
})

//delete Admin
router.delete('/delete/:id', (req, res) => {
    
    Admin.findByIdAndDelete({ "_id": req.params.id } , (err, data) => {
        if (err) {

            res.send({ "Data": err, "message": "Failed to delete Admin", "status": false });
        } else {
            res.status(200).send({ "Data": data, "message": "Admin deleted successfully", "status": true })
        }
    })
       
})

//Get Profile By ID from admins
router.get('/:id', verifyToken, (req, res) => {
    console.log(req.headers)
    console.log("request params:", req.params)
    jwt.verify(req.headers.authorization, keys.secretKey, (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            Admin.findOne({ _id: req.params.id }, (err, admin) => {
                if (err) {
                    // console.log("Error from find:", err)
                    res.status(500).send({ "Data": err, "message": "Error in getting data...!", "status": false })
                } else {
                    res.status(200).send({ "Data": admin, "message": "Data loaded Successfully", "status": true })
                }
            })
        }
    });
})

// reset code for admin
router.post('/resetCode', verifyToken, (req, res) => {
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            Admin.findOne({ email: req.body.email }, (err, data) => {
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


//Update admin Profile
router.put('/update/:id', verifyToken, (req, res) => {
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
        console.log("req.params.accessToken:", req.headers.authorization)
        if (err) {
            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            console.log("req.body", req.body)
            Admin.updateOne({ _id: req.params.id }, req.body, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in updating data...!", "status": false })
                } else {
                    res.status(200).send({ "Data": data, "message": "Data Updated Successfully", "status": true })
                }
            })
        }
    });
});

// upload profile image 
router.post('/photo/:id', upload.single('photoURL'), (req, res) => {

    let id = req.params.id
    console.log(id)
    console.log("req.File: ", req.file)

    let photo_URL = req.file.path
    console.log("req.files.path:", req.file.path)

    Admin.findOneAndUpdate({ _id: req.params.id }, { photoURL: photo_URL }, (err, userData) => {
        if (err) {
            console.log("Error in update admin", err)
            res.status(500).send({ "Data": err, "message": "Failed in uploading image", "status": false })

        } else {
            console.log("image uploaded", userData)
            res.status(200).send({ "Data": userData, "message": "Image uploaded successfully ", "status": true })
        }
    })

})

router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

// reset admin's password
router.put('/update', (req, res) => {
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            console.log("req.body.pass: ", req.body.password)
            // hash the password and save it in database
            bcrypt.hash(req.body.password, 10).then(function (hash) {
                console.log("hash: ", hash)
                Admin.updateOne({ accessToken: req.headers.authorization }, { password: hash }, (err, data) => {
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


module.exports = router