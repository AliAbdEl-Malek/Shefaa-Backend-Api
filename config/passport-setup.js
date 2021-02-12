// use passport module 
const passport = require('passport')

//use the google auth strategy
const googleStrategy = require('passport-google-oauth20')

// use google keys 
const keys = require('./keys')

const GoogleUser = require('../models/user')



// searializing the user's id to be stored in a cookie
passport.serializeUser((user, done) => {
    // console.log("user from serialization: ", user)
    done(null, user.id)
});


// take that id and deserialize it to find out how is that user with this id
passport.deserializeUser((id, done) => {
    GoogleUser.findOne({ id: id }).then((user) => {
        // console.log("user from deserialization: ", user)
        done(null, user)

    })
});



//use passport as a middleware
passport.use(
    new googleStrategy({
        // options for the google startegy

        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        // this url must equal the one in google api 
        redirect_uri: 'http://localhost:3000/auth/google/redirect',
        response_type: 'code'


    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log("passport callback funcion is fired !")
        console.log("User's profile information", profile)
            // console.log("accessToken: ", accessToken)
            // console.log("refreshToken: ", refreshToken)
            // console.log("User's Email: ", email)
            // console.log(done)

        //check if user already in our database
        GoogleUser.findOne({ id: profile._json.sub }).then((user) => {
            if (user) {
                // user already in database
                console.log("User is in database: ", user);

                // call done to stopo the callback when finished
                done(null, user);

            } else {
                // craete a new user in database
                new GoogleUser({
                    id: profile._json.sub,
                    name: profile._json.given_name,
                    // lastName: profile._json.family_name,
                    email: profile._json.email,
                    photoURL: profile._json.picture

                }).save().then((newUser) => {
                    console.log("Created a new user", newUser)

                    // call done to stopo the callback when finished
                    done(null, newUser)
                })
            }
        })

        //now we create a new user and save it to our database suing our googleuser model


    })
);