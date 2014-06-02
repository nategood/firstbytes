// todo force test env NODE_ENV=test

var mongo = require("mongodb");
var server = require("../../services/server")();
// server.connect(); // need to explicitly connect if we aren't going to server.listen()

exports.setUp = function(done) {
    server.connect(); // need to explicitly connect if we aren't going to server.listen()
    done();
};

exports.tearDown = function(done) {
    conditionallyWipeDb(function(err) {
        server.disconnect();
        console.log("WUT");
        done();
    });
};

// todo put into model test helper
var conditionallyWipeDb = function(done) {
    if (server.app.get("env") !== "test") {
        console.log(server.app.get("env"));
        done();
        return;
    }

    // have to go native here instead of use mongoose
    // http://stackoverflow.com/questions/10519432/how-to-do-raw-mongodb-operations-in-mongoose
    var mongo = require("mongodb").MongoClient;
    doneAndClose = function(err) {
        mongo.disconnect();
        done(err);
    };
    mongo.connect(server.app.get("data.mongo"), function(err, db) {
        if (err) {
            console.warn("Unable to drop database - Could not connect");
            doneAndClose(new Error("Unable to drop database - Could not connect"));
            return;
        }
        db.dropDatabase(function(err) {
            if (err) {
                console.warn("Unable to drop database - ", err);
                doneAndClose(err);
                return;
            }
            doneAndClose();
        });
    });
};

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

// There is no final teardown method for nodeunit so this test MUST be called at the END
// of all other tests
// exports.testCleanup = function(test) {
//     test.expect();
//     conditionallyWipeDb(function(err) {
//         server.disconnect();
//         test.done();
//     });
// };
