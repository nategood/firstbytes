/**
 * API end points
 * /user/*
 */

var uuid = require('node-uuid');
var User = require('../models/user');
var Project = require('../models/project');
var Screenshot = require('../models/screenshot');
var auth = require('../services/auth/user-auth');
var modelRoute = require('../routes/_model');
var stats = require('../services/stats');

var createSession, L, restrictedAdminOnly, restrictedAdminOrSelf;

L = {
  NOPE: 'Unauthorized – Must be an admin user',
  MISSING: 'Missing required field'
};

// We check against the templatized path, e.g. /user/:id/
// These are the routes that require admin access to hit
restrictedAdminOnly = {
  '/stats/overall/': true,
  '/users/': true,
  '/users/admins/': true,
  '/user/:id/password/': true
};
restrictedAdminOrSelf = {
  '/user/:id/': true,
};

// Requires Admin ACL
// GET /users/
exports.allStudents = function(req, res) {
    stats.allStudents(function(err, students) {
        if (err) return res.status(400).json({'error': err});
        var data = students.map(function(s) { return s.toResponse(); });
        res.json(data);
    });
};

// Requires Admin ACL
// GET /users/admins/
exports.allAdmins = function(req, res) {
    stats.allAdmins(function(err, admins) {
        if (err) return res.status(400).json({'error': err});
        var data = admins.map(function(s) { return s.toResponse(); });
        res.json(data);
    });
};

// GET /user/ID/projects/?page=N&start=M
exports.projects = function(req, res) {
  // don't check against user id in auth call because we'll allow admins access
  auth.getAndAssertUserFromRequest(req, false, function(err, user) {
    if (err) return res.status(401).json({'error': err});
    if (req.params.id != user._id && user.acl !== 1)  {
      return res.status(401).json({'error': L.NOPE}); // allow admins
    }
    Project.find({userId: req.params.id}, function(err, projects) {
      if (err) return res.status(401).json({'error': err});
      res.json(projects.map(function(p) { return p.toResponse(); } ));
    });
  });
};

// GET /user/ID/screenshots
exports.screenshots = function(req, res) {
  auth.getAndAssertUserFromRequest(req, false, function(err, user) {
    if (err) return res.status(401).json({'error': err});
    if (req.params.id != user._id && user.acl !== 1)  {
      return res.status(401).json({'error': L.NOPE}); // allow admins
    }
    Screenshot.find({userId: req.params.id}, function(err, screenshots) {
      if (err) return res.status(401).json({'error': err});
      res.json(screenshots.map(function(p) { return p.toResponse(); } ));
    });
  });
};

// // GET /user/ID/projects/public/?page=N&start=M
// exports.publicprojects = function(req, res){
//   // todo
// };

// POST /user/auth/
exports.auth = function(req, res) {
  auth.lookup(req.body['email'], req.body['password'], function(err, user) {
      var token;
      if (err) return res.status(400).json({'error': err});
      if (!user) return res.status(400).send('json', {'error': E_UNKNOWN_USER});
      token = createSession(req, user);
      res.json({'token': token, 'user': user.toResponse()});
  });
};

// POST /user/
exports.create = function(req, res) {
  var user;
  user = new User(req.body);
  user.save(function(err) {
    if (err) return res.status(400).json({'error': err});
    var token = createSession(req, user);
    res.json({'token': token, 'user': user.toResponse()});
  });
};

// Requires Admin ACL or Updating current logged in user
// todo prevent updating other admins
// PUT, POST /user/:id/
exports.update = function(req, res) {
  if (!req.body.name || !req.body.email) return res.status(400).json({'error': L.MISSING});
  auth.getUser(req.params.id, function(err, user) {
    console.log(user);
    if (err) return res.status(404).json({'error': err});
    user.name = req.body.name;
    user.email = req.body.email;
    user.save(function(err, saved) {
      if (err) return res.status(400).json({'error': err});
      res.json({'user': saved.toResponse()});
    });
  });
};

// Requires Admin ACL
// POST /user/:id/password/
exports.changePassword = function(req, res) {
  auth.getUser(req.params.id, function(err, user) {
    if (err) return res.status(404).json({'error': err});
    user.password = req.body.password;
    user.save(function(err, saved) {
      if (err) return res.status(400).json({'error': err});
      res.json({'user': user.toResponse()});
    });
  });
};

// GET /user/ID
exports.authFromToken = function(req, res) {
  auth.getAndAssertUserFromRequest(req, req.params.id, function(err, user) {
    if (err) return res.status(400).json({'error': err});
    res.json({'token': req.get('token'), 'user': user.toResponse()});
  });
};

// Middleware for checking if user is an admin user
exports.authAdminCheck = function(req, res, next) {
  // We check against the templatized path, e.g. /user/:id/
  var path = req.route ? req.route.path : req.path;
  var token = req.get('token');
  var adminOnly = path in restrictedAdminOnly;
  var adminSelf = path in restrictedAdminOrSelf;
  if (!adminOnly && ! adminSelf) return next();
  var userId = req.session[token];
  if (!token || !userId) return res.status(401).json({error: L.NOPE});
  if (adminSelf) { // allow access if :id param matches currently logged in user
    if (!req.param.id) return res.status(401).json({error: L.NOPE});
    auth.getAndAssertUserFromRequest(req, req.params.id, function(err, user) {
      if (err) return res.status(400).json({'error': err});
      next();
    });
  }
  auth.fetchUserAndCheckPermission(userId, 'tbd-granular-permissions-not-supported-yet', function(err, user) {
    if (err) return res.status(401).json({error: L.NOPE});
    next();
  });
};

createSession = function(req, user) {
  var token = uuid.v4();
  req.session.user = req.session[token] = user._id;
  // req.session.acl = user.acl;
  return token;
};

// POST /user/login/ (unlike auth, returns a session cookie)
// exports.login = function(req, res) {
//     // todo pull in passport integration
//     // passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true });
// };
