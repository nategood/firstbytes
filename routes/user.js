/**
 * API end points
 * /user/*
 */

var User = require('../models/user.js');
var modelRoute = require("../routes/_model.js");

exports.get = modelRoute.get(User);
exports.put = modelRoute.put(User);
exports.post = modelRoute.post(User, function(req, res, instance) {
    instance.joined = new Date();
});
exports.delete = modelRoute.delete(User);

// GET /user/ID/apps/?page=N&start=M
// GET /user/ID/apps/public/?page=N&start=M
// GET /user/ID/apps/private/?page=N&start=M
exports.apps = function(req, res){
  // res.send("json", {});
};
exports.privateapps = function(req, res){
  // res.send("json", {});
};
exports.publicapps = function(req, res){
  // res.send("json", {});
};

// POST /user/auth/
exports.auth = function(req, res){
  // todo return login token
  // res.send("json", {});
};

// POST /user/login/ (unlike auth, returns a session cookie)
exports.login = function(req, res) {
    passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login", failureFlash: true });
};

// Non API endpoints (exports.pages)

// GET /login/
exports.pages = {
    login: function(req, res) {
        res.render("login");
    }
};