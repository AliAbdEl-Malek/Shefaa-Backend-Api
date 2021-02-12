const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser')


//cookieParser()


exports.verifyToken = (req, res, next) => {

    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1]; // Bearer slkdfjsdnfaskmgdfiogjaifgmasdklfm;d
        req.token = bearerToken;
        next();

    } else {
        res.sendStatus(403);
    }

    // console.log(req)

    // let accessToken = req.cookie.jwt

    // //if there is no token stored in cookies, the request is unauthorized
    // if (!accessToken){
    //     return res.status(403).send()
    // }

    // let payload
    // try{
    //     //use the jwt.verify method to verify the access token
    //     //throws an error if the token has expired or has a invalid signature
    //     //payload = jwt.verify(accessToken, 'secretKey')
    //     next()
    // }
    // catch(e){
    //     //if an error occured return request unauthorized error
    //     return res.status(401).send()
    // }

}