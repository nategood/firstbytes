// The beginning of KO integration. Need to pull in the stuff from
// dom/editor.js and dom/user.js
// requires moment.js, auth.js, repo.js
(function(g) {
    var L = {
    };
    var PAGES = {
        DASHBOARD: 1,
        STUDENT: 2
    };
    g.PAGES = PAGES;

    function AdminViewModel() {
        var self, initSession, restoreSession, clearSession;
        self = this;

        self.user = ko.observable(null);
        self.session = ko.observable(null);
        self.students = ko.observableArray([]);
        self.err = ko.observable(false);

        // currently selected student / projects
        self.student = ko.observable(null);
        self.projects = ko.observableArray([]);

        // what is the current view? (excludes login view as that is implicit)
        self.view = ko.observable(PAGES.DASHBOARD);

        // todo dry up with edit version
        self.authenticated = ko.computed(function() { return !!self.session(); }, this);
        self.unauthenticated = ko.computed(function() { return !self.session(); }, this);

        // dry up with editor version
        initSession = function(err, response, status) {
            if (err) return self.err(err);
            self.session(new Session({token: response.token}));
            self.user(new User(response.user));
        };
        restoreSession = function(parsed) {
            if (parsed.session) self.session(new Session(parsed.session));
            if (parsed.user) self.user(new User(parsed.user));
        };
        clearSession = function() {
            self.session(null);
            self.user(null);
        };
        g.restoreSession = restoreSession;

        self.cformlogin = function(form) {
            var data = $(form).serialize();
            auth(data, initSession);
        };

        self.cstudent = function(user, e) {
            var token = self.session().token(); // todo token
            self.view(PAGES.STUDENT);
            self.student(new User(user));
            // todo move this out of here... too much network / logic
            fetchStudentDetails(user._id, token, function(err, response) {
                console.log(err, response);
                if (err || !response) return console.error(err); // todo messaging
                if (response.length === 0) return console.error('could not'); // todo messaging
                self.projects(response.projects);
            });
        };

        self.clogout = function() {
            clearSession();
        };
    }

    // Main View Model
    g.adminvm = new AdminViewModel();

    $(function() {
        ko.applyBindings(g.adminvm);
    });

})(window);
