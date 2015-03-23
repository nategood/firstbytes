// The beginning of KO integration. Need to pull in the stuff from
// dom/editor.js and dom/user.js
// requires moment.js, auth.js, repo.js
(function(g) {
    var L = {
    };
    var PAGES = {
        DASHBOARD: 1,
        STUDENT: 2,
        PROJECT: 3,
        CHAT: 4,
        LESSONS: 5,
        STUDENTS: 6,
        LESSON: 7,
        ADMINS: 8,
    };
    g.PAGES = PAGES;

    function AdminViewModel() {
        var self, initSession, restoreSession, clearSession, pushCode, getStats, canvas;
        self = this;

        canvas = stage('#sandbox');

        self.user = ko.observable(null);
        self.session = ko.observable(null);
        self.students = ko.observableArray([]);
        self.admins = ko.observableArray([]);
        self.err = ko.observable(false);
        self.lessons = ko.observableArray([]);
        self.stats = ko.observable({
            students: '-',
            admins: '-',
            projects: '-',
            lessons: '-'
        });

        // currently selected student / projects
        self.student = ko.observable(null);
        self.projects = ko.observableArray([]);
        self.project = ko.observable(null);
        self.lesson = ko.observable(null);

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
        pushCode = function(source) {
            canvas.publishCode(Code().prep(source));
        };
        getStats = function() {
            if (!self.session()) return;
            var token = self.session().token();
            if (!token) return;
            repo.fetchStats(token, function(err, stats) {
                self.stats(stats);
            });
        };
        g.restoreSession = restoreSession;

        self.cformlogin = function(form) {
            var data = $(form).serialize();
            auth(data, initSession);
        };
        self.cstudent = function(user, e) {
            var token = self.session().token();
            self.view(PAGES.STUDENT);
            self.student(new User(user));
            // todo move this out of here... too much network / logic
            fetchStudentDetails(user._id, token, function(err, response) {
                if (err || !response) return console.error(err); // todo messaging
                if (response.length === 0) return console.error('Could not fetch student details'); // todo messaging
                self.projects(response.projects);
            });
        };
        self.cproject = function(project, e) {
            var token = self.session().token();
            self.view(PAGES.PROJECT);
            // self.student(new User(user));
            // todo move this out of here... too much network / logic
            repo.fetchProject(project._id, token, function(err, response) {
                if (err || !response) return console.error(err); // todo messaging
                self.project(response);
                pushCode(self.project().source);
            });
        };
        self.clesson = function(project, e) {
            var token = self.session().token();
            self.view(PAGES.LESSON);
            repo.fetchLesson(project._id, token, function(err, response) { // todo DRY w cproject
                if (err || !response) return console.error(err); // todo messaging
                self.lesson(response);
                pushCode(self.lesson().source);
            });
        };
        self.cdashboard = function() {
            getStats();
            self.view(PAGES.DASHBOARD);
        };
        self.cstudents = function() {
            fetchStudents(self.session().token(), function(err, students) {
                if (err) return adminvm.err(err);
                self.students(students);
            });
            self.view(PAGES.STUDENTS);
        };
        self.cadmins = function() {
            fetchAdmins(self.session().token(), function(err, admins) {
                if (err) return adminvm.err(err);
                self.admins(admins);
            });
            self.view(PAGES.ADMINS);
        };
        self.clessons = function() {
            self.view(PAGES.LESSONS);
            // todo fetch all Lessons instead of just intro and group by category
            repo.fetchLessons('Intro', function(err, lessons) {
                if (err) return console.error(err);
                self.lessons(lessons);
            });
        };
        self.clogout = function() {
            clearSession();
        };

        // todo build in a hook that listens for "view" changes and adds to push state
    }

    // Main View Model
    g.adminvm = new AdminViewModel();

    $(function() {
        ko.applyBindings(g.adminvm);
        g.adminvm.cdashboard();
    });

})(window);
