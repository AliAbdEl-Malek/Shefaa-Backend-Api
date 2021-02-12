const express = require('express');

const router = express.Router();

const passport = require('passport')


const keys = require('../config/keys');

const mailService = require('../config/mailService')

//=================================================

// router for login
router.get('/login', (req, res) => {

    // mailService.sendEmail("ali01090807533@gmail.com").catch(console.error);

    res.status(200).send("Welcome to login page...........!")
});

//=================================================

//router for auth with google
// router.get('/google', (req, res) => {
//     //handle with passport
//     res.status(200).send("Logging in with google ......!")
// });


// router for auth with google using passport
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))


// callback route for google to redirect to after signing in
// we used passport authentication again to handle the data comes from the user's profile 
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    //here we redirect the user after signing in with google

    // res.status(200).send("You have reached the callback URI...!")
    // now we can handle our user after redirecting from google and storing the user's id in our cookie session
    // res.send({ "Data": req.user, "message": "Data loaded Successfully", "status": true })

    res.redirect('/home')
})

//=================================================

// router for login
router.get('/logout', (req, res) => {
    //handle with passport
    // res.status(200).send("Logging out .....!")

    req.logOut();
    res.redirect('/home')
});

//=================================================


module.exports = router;