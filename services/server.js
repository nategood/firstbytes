/**
 * Exports a simple object that wraps all the express app and other related
 * server goodies.
 *
 * var conf = {optional: conf};
 * var server = require("./server")(conf);
 * server.listen();
 */

var express = require("express"),
  http = require("http"),
  path = require("path"),
  db = require("./db.js").get(),
  passport = require("./auth/user-auth.js");

var routes = {
  main: require("../routes"),
  user: require("../routes/user"),
  project: require("../routes/project")
};

// app setup
var app = express();

app.configure(function(){
  app.set("port", process.env.PORT || 3000);
  app.set("views", path.resolve(__dirname + "/../views"));
  app.set("view engine", "jade");

  app.use(express.favicon("/favicon.ico"));
  app.use(express.logger("dev"));
  app.use(express.bodyParser());
  app.use(express.cookieParser('2z9sS2c0ks'));
  app.use(express.session()); //{ path: '/', httpOnly: false, maxAge: null, secret: '2z9sS2c0ks' }
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.resolve(__dirname + "/../public")));

  // authentication middleware
  app.use(passport.initialize());
  app.use(passport.session());

});

app.configure("production", function(){
  // todo load from config
  app.set("data.type", "mongo");
  app.set("data.mongo", "mongodb://localhost:9490/firstbytes");
});

app.configure("development", function(){
  app.use(express.errorHandler());
  // todo load from config
  app.set("data.type", "mongo");
  app.set("data.mongo", "mongodb://localhost:9490/firstbytes-dev");
});

app.configure("test", function(){
  app.use(express.errorHandler());
  // todo load from config
  app.set("data.type", "mongo");
  app.set("data.mongo", "mongodb://localhost:9490/firstbytes-test");
});

// todo routes that require auth...

// page routes
app.all("/", function (req, res, next) {
  console.log(req.isAuthenticated()); next();
  // if (req.isAuthenticated()) { return next(); }
  // res.redirect('/login');
});
app.get("/", routes.main.index);
app.get("/canvas/?", routes.main.canvas);
app.get("/login/", routes.user.pages.login);

// json api routes
app.get("/project/:id/", routes.project.get);
app.post("/project/", routes.project.post);
app.put("/project/:id/", routes.project.put);
app.post("/project/:id/", routes.project.put); // overload
app.delete("/project/:id/", routes.project.delete);

app.get("/user/:id/", routes.user.get);
app.post("/user/", routes.user.post);
app.put("/user/:id/", routes.user.put);
app.post("/user/:id/", routes.user.put); // overload
app.delete("/user/:id/", routes.user.delete);

// var ensureAuth = function (req, res, next) {
//   console.log(req.isAuthenticated());
//   next();
//   // if (req.isAuthenticated()) { return next(); }
//   // res.redirect('/login');
// };

db.connect(app.get("data.mongo"));

var listening = false;
var listen = function() {
  if (listening) return;
  http.createServer(app).listen(app.get("port"), function(){
    console.log("Express server listening on port " + app.get("port"));
  });
  listening = true;
};

module.exports = function(conf) {
  // todo use conf to pass in env, other overrides, etc.
  if (conf && conf.autolisten === true) listen();
  return {
    app: app,
    listen: function() {
      listen();
    }
  };
};
