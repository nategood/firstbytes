var mongo = require("mongodb");
var server = require("../../services/server")();
var helper = require("./_helper")(server);

exports.setUp = helper.setup;
exports.tearDown = helper.teardown;

var User = require("../../models/user.js");

exports.testCreation = function(test) {
    test.expect(3);

    var password = "turing test!";
    var u1 = new User({
        name: "Alan Turing",
        password: password,
        email: "alan@example.com"
    });

    u1.save(function(err, user) {
        test.ok(!err, err);
        test.ok(user, "User was not created");
        test.ok(user.password !== password, "Password was not hashed");
        test.done();
    });
};
