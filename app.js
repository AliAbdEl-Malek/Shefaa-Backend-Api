// start with express
const express = require('express')

// start mongoose 
const mongoose = require('mongoose')


// use fs module to load modules with their relative path
const fs = require('fs');

// use body parser
const bodyParser = require("body-parser")

// use a cors module to enable connecting from any other environment to this API using the url(localhost:3000)
var cors = require('cors')

const authRouter = require('./routes/auth')

const passportsetup = require('./config/passport-setup')

const keys = require('./config/keys')

const cookieSession = require('cookie-session')

const passport = require('passport')

const session = require('express-session')

const userRouter = require('./routes/user')

const homeRouter = require('./routes/home')

const productRouter = require('./routes/product')

const previousorderRouter = require('./routes/previousOrder')

const cartRouter = require('./routes/cart')

const websiteMessagesRouter = require('./routes/website-messages')

const prescriptionRouter = require('./routes/prescription')

const partnerRouter = require('./routes/partner')

const orderRouter = require('./routes/order')

const favouriteRouter = require('./routes/favourite')

// ----------------------------------------------------

//======== user ==========

// an instance from express object
const app = express();

// body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//enabling the cors options
// using cors middleware
app.use(cors());

app.options('*', cors());


// use middleware
app.use('/user', userRouter);

// use middle ware for the uploads folder 
app.use('/uploads',express.static("uploads"))

// use middle ware for the uploads folder 
app.use('/prescriptions',express.static("prescriptions"))


// use cookie session
app.use(cookieSession({
    // maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
    overwrite: false
}))



// now we initailize passport 
app.use(passport.initialize())

// now we want passport to use cookies
app.use(passport.session())

// use auth middleware
app.use('/auth', authRouter)

// home router
app.use('/home', homeRouter)

// product router
app.use('/product', productRouter)

// Previos orders router
app.use('/porder', previousorderRouter);

// cart router
app.use('/cart', cartRouter);

// website messages router
app.use('/message', websiteMessagesRouter);

// prescription router
app.use('/prescription', prescriptionRouter);

// checkout router
app.use('/order', orderRouter);

// favourite router
app.use('/favourite', favouriteRouter);








//======== partner ==========

// partner router
app.use('/partner', partnerRouter)

// use middle ware for the partnersPhotos folder 
app.use('/partnersPhotos',express.static("partnersPhotos"))

// ----------------------------------------------------


mongoose.set('useFindAndModify', false);

// use mongoose to access database 
mongoose.connect(keys.mongodb.dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});



// ----------------------------------------------------


// use fs to select the files of modles
var modelFiles = fs.readdirSync(__dirname + "/models/");
modelFiles.forEach((file) => {
    require(__dirname + "/models/" + file);
});


// ----------------------------------------------------

// listen on port 3000
app.listen(3000, () => {
    console.log("server is running successfully on port 3000")
})