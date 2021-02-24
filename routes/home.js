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

    
    // res.send({ "Data": req.user, "message": "Data loaded Successfully", "status": true , "token": req.user.accesstoken })
    res.redirect('http://localhost:4200/')
    

})


module.exports = router