
// GET /
exports.index = function(req, res){
  res.render("main", { title: "First Bytes Society: Playground" });
};

// GET /canvas
// Part of the sandbox
exports.canvas = function(req, res){
  res.render("canvas");
};
