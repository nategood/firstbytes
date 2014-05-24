// dependencies
var express = require("express"),
  http = require("http"),
  path = require("path"),
  db = require("./services/db.js").get();

var routes = {
  main: require("./routes"),
  user: require("./routes/user"),
  project: require("./routes/project")
};

// app setup
var app = express();

app.configure(function(){
  app.set("port", process.env.PORT || 3000);
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.favicon("/favicon.ico"));
  app.use(express.logger("dev"));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, "public")));

  // todo load from config
  app.set("data.type", "mongo");
  app.set("data.mongo", "mongodb://localhost:9490");
});

app.configure("development", function(){
  app.use(express.errorHandler());
  // todo load from config
  app.set("data.type", "mongo");
  app.set("data.mongo", "mongodb://localhost:9490");
});

// routes
app.get("/", routes.main.index);
app.get("/canvas", routes.main.canvas);

app.get("/project/:id/", routes.project.get);
app.post("/project/", routes.project.post);
app.put("/project/:id/", routes.project.put);
app.post("/project/:id/", routes.project.put); // overload
app.delete("/project/:id/", routes.project.delete);

// Boostrap
db.connect(app.get("data.mongo"));
http.createServer(app).listen(app.get("port"), function(){
  console.log("Express server listening on port " + app.get("port"));
});
