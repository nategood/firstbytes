var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require('../../models/user');

var MSG_INVALID_PASSWORD = "Incorrect username/password combination.";

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        console.log("uer", user);
        if (err) return done(err);
        if (!user || !user.checkPassword(password)) {
            return done(null, false, { message: MSG_INVALID_PASSWORD});
        }
        return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({_id: id}, done);
});

module.exports = passport;
