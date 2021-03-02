const express = require('express');

const router = express.Router();

const User = require('../models/user')

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



// router for sign up new user
router.post('/signup', (req, res) => {
    // search for user in database first , if not there craete a new one 
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            res.send({ "Data": user, "message": "User already exists, try to login!", "Status": false })
        } else {

            // hash the password and save it in database
            bcrypt.hash(req.body.password, 10).then(function (hash) {
                console.log(hash)

                User.create({
                    // id: "",
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,

                },
                    (err, user) => {
                        if (err) {
                            res.send({ "Data": err, "message": "Failed in requesting...!", "status": false })
                        } else {

                            //create an access token for new user
                            const accesstoken = jwt.sign({ email: req.body.email },
                                'secretKey');
                            console.log("Token : ", accesstoken);

                            //update the user's id and access token
                            User.findOneAndUpdate({ email: req.body.email }, { id: user._id.toString(), accessToken: accesstoken }, { new: true }, (err, newUser) => {
                                if (err)
                                    console.log(err)
                                else
                                    console.log(newUser)

                                res.status(200).send({ "Data": newUser, "message": "New user signed up Successfully", "status": true, "token": accesstoken })
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
    User.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
            res.status(500).send("Failed to find email: " + err)
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
                            if (data.deactivate == true) {
                                console.log("This User is Activated")
                            }
                            else {
                                console.log("password equals hash = ", result) // true 

                                //action (login)
                                const accesstoken = jwt.sign({ email: data.email },
                                    'secretKey');
                                console.log("Token : ", accesstoken);

                                //update use's access token
                                User.findOneAndUpdate({ email: req.body.email }, { accessToken: accesstoken }, { new: true }, (err, newUser) => {
                                    if (err)
                                        console.log(err)
                                    else
                                        console.log(newUser)
                                })

                                // const refreshToken = jwt.sign({ email: data.email }, 'RefreshTokenSercterSentence', { expiresIn: '100h' });
                                // data.refreshToken = refreshToken;
                                //res.cookie("jwt", accesstoken, {secure: true, httpOnly: true})

                                res.status(200).send({ "Data": data, "message": "Logged in successfully", "status": true, "token": accesstoken })

                             
                            }
                        }
                        else {
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
    // console.log(req.headers)
    // console.log("request params:", req.params)
    // console.log("Token is: ",req.params.accessToken)
    jwt.verify(req.params.accessToken, "secretKey", (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {

            User.findOne({ accessToken: req.params.accessToken }, (err, User) => {
                if (err) {
                    // console.log("Error from find:", err)
                    res.status(500).send({ "Data": err, "message": "Error in getting data...!", "status": false })
                } else {
                    res.status(200).send({ "Data": User, "message": "Data loaded Successfully", "status": true })
                }
            })
        }
    });
})

//Get All Users
router.get('/', (req, res) => {
    User.find({}, (err, data) => {
        if (err) {
            res.status(500).send({ "Data": err, "message": "Failed in getting Users data ...!", "status": false })
        } else {
            res.status(200).send({ "Data": data, "message": "All Users retrieved Successfully..!", "status": true })
        }
    })
})

//delete User
router.delete('/delete/:id', (req, res) => {

    User.findByIdAndDelete({ "_id": req.params.id }, (err, data) => {
        if (err) {

            res.send({ "Data": err, "message": "Failed to delete User", "status": false });
        } else {
            res.status(200).send({ "Data": data, "message": "User deleted successfully", "status": true })
        }
    })

})

//Get Profile By ID from partners
router.get('/:id', verifyToken, (req, res) => {
    // console.log(req.headers)
    // console.log("request params:", req.params)
    // console.log("Token is: ",req.params.accessToken)
    jwt.verify(req.headers.authorization, keys.secretKey, (err, authData) => {

        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {

            User.findOne({ _id: req.params.id }, (err, User) => {
                if (err) {
                    // console.log("Error from find:", err)
                    res.status(500).send({ "Data": err, "message": "Error in getting data...!", "status": false })
                } else {
                    res.status(200).send({ "Data": User, "message": "Data loaded Successfully", "status": true })
                }
            })
        }
    });
})

// reset code for user
router.post('/resetCode',  (req, res) => {
    // // console.log(req.headers)
    // // console.log("Token: ", req.headers.authorization)
    // // console.log(req.body)
    // // console.log("Email from front: ",req.body.email)
    // jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

    //     if (err) {

    //         res.send({ "Data": err, "message": "Session expired!", "status": false });

    //     } else {

            
    //     }
    // });
    User.findOne({ email: req.body.email }, (err, data) => {
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
})


//Update User Profile
router.put('/update/:id', verifyToken, (req, res) => {
    jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
        console.log("req.params.accessToken:", req.headers.authorization)
        if (err) {

            res.send({ "Data": err, "message": "Session expired!", "status": false });

        } else {
            console.log("req.body", req.body)

            User.updateOne({ _id: req.params.id }, req.body, (err, data) => {
                if (err) {
                    res.status(500).send({ "Data": err, "message": "Error in updating data...!", "status": false })
                } else {
                    res.status(200).send({ "Data": data, "message": "Data Updated Successfully", "status": true })
                }
            })
        }
    });

});

//Deactivate  User Profile
router.put('/deactivate/:id', (req, res) => {
    // jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
    // console.log("req.params.accessToken:", req.headers.authorization)
    // if (err) {

    // res.send({ "Data": err, "message": "Session expired!", "status": false });

    // } else {
    // console.log("req.body", req.body)

    User.updateOne({ _id: req.params.id }, { deactivate: "true" }, (err, data) => {
        if (err) {
            console.log("Backend Error/// Deactivate")
            res.status(500).send({ "Data": err, "message": "Error in updating data...!", "status": false })
        } else {
            console.log("Backend --> Deactivate")

            res.status(200).send({ "Data": data, "message": "Data Updated Successfully", "status": true })
        }
    })
    //     }
    // });

});


//Activate  User Profile
router.put('/activate/:id', (req, res) => {
    // jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {
    // console.log("req.params.accessToken:", req.headers.authorization)
    // if (err) {

    // res.send({ "Data": err, "message": "Session expired!", "status": false });

    // } else {
    // console.log("req.body", req.body)

    User.updateOne({ _id: req.params.id }, { deactivate: "false" }, (err, data) => {
        if (err) {
            console.log("Backend Error/// Activate")
            res.status(500).send({ "Data": err, "message": "Error in updating data...!", "status": false })
        } else {
            console.log("Backend --> Activated")

            res.status(200).send({ "Data": data, "message": "Data Updated Successfully", "status": true })
        }
    })
    //     }
    // });

});




// upload profile image 
router.post('/photo/:id', upload.single('photoURL'), (req, res) => {

    let id = req.params.id
    console.log(id)
    console.log("req.File: ", req.file)

    let photo_URL = req.file.path
    console.log("req.files.path:", req.file.path)

    User.findOneAndUpdate({ _id: req.params.id }, { photoURL: photo_URL }, (err, userData) => {
        if (err) {
            console.log("Error in update user", err)
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


// reset user's password
router.put('/update', (req, res) => {
    // jwt.verify(req.headers.authorization, "secretKey", (err, authData) => {

    //     if (err) {

    //         res.send({ "Data": err, "message": "Session expired!", "status": false });

    //     } else {
           

    //     }
    // });
    console.log("req.body.pass: ", req.body.password)
    // hash the password and save it in database
    bcrypt.hash(req.body.password, 10).then(function (hash) {
        console.log("hash: ", hash)
        User.updateOne({ accessToken: req.headers.authorization }, { password: hash }, (err, data) => {
            if (err) {
                res.status(500).send({ "Data": err, "message": "Error in resetting password...!", "status": false })
            } else {
                res.status(200).send({ "Data": data, "message": "Password reset Successfully", "status": true })
            }
        })

    })

});


















module.exports = router