const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const CONFIG = require('../config');
const UserModel = require('../models/user');

// (logical step 2)
passport.serializeUser(function (user, done) {
    done(null, user.id);
})

passport.deserializeUser(function (id, done) {
    UserModel.findById(id).then(function (user) {
        done(null, user);
    })
})

// (logical step 1)
passport.use(
    new GoogleStrategy({
            callbackURL: CONFIG.oauth2Credentials.redirect_uris[0],
            clientID: CONFIG.oauth2Credentials.client_id,
            clientSecret: CONFIG.oauth2Credentials.client_secret
        },
        function (accessToken, refreshToken, profile, done) {
            // check if user already exists in db
            UserModel.findOne({
                googleId: profile.id
            }).then(function (currentUser) {
                if (currentUser) {
                    // user already in db
                    console.log('User is: ' + currentUser.username);
                    done(null, currentUser);
                } else {
                    new UserModel({
                        username: profile.displayName,
                        firstName: profile.name.givenName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        photo: profile.photos[0].value
                    }).save().then(function (newUser) {
                        console.log('New user created: ' + newUser);
                        done(null, newUser);
                    });
                }
            });
        })
);