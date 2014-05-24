/**
 * API end points
 * /user/*
 */

// /user/ID/
exports.get = function(req, res){
  // res.send("json", {});
};
exports.post = function(req, res){
  // res.send("json", {});
};
exports.put = function(req, res){
  // res.send("json", {});
};
exports.delete = function(req, res){
  // res.send("json", {});
};

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