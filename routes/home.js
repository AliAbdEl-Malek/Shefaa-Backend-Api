const express = require('express')
const router = express.Router();


const authCheck = (req, res, next) => {
    if (!req.user) {
        // user is not loggedin
        console.log("not loggedin.............!")
        res.redirect('/auth/google')

    } else {
        // user is loggedin 
        console.log(" logging.............!")
        next();
    }
}

router.get('/', authCheck, (req, res) => {
    console.log(req.headers)
        //render the main profile
        // res.status(200).send(`Now you are loggedin, this is your profile id:  ${req.user.id} <img src=" ${req.user.photoURL}" >`)
    res.redirect("http://localhost:4200")

})


module.exports = router