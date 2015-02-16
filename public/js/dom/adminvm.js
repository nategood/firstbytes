// The beginning of KO integration. Need to pull in the stuff from
// dom/editor.js and dom/user.js
// requires moment.js, auth.js, repo.js
(function(g) {
    var L = {
    };

    function AdminViewModel() {
        var self, initSession;
        self = this;

        self.user = ko.observable(null);
        self.session = ko.observable(null);
        self.students = ko.observableArray([]);
        self.err = ko.observable(false);

        // currently selected student / projects
        self.student = ko.observable(null);
        self.projects = ko.observableArray([]);

        // todo dry up with edit version
        self.authenticated = ko.computed(function() { return !!self.session(); }, this);
        self.unauthenticated = ko.computed(function() { return !self.session(); }, this);

        // dry up with editor version
        initSession = function(err, response, status) {
            if (err) return self.err(err);
            self.session(new Session({token: response.token}));
            self.user(new User(response.user));
            self.authenticated(true);
        };

        self.cformlogin = function(form) {
            var data = $(form).serialize();
            auth(data, initSession);
        };
    }

    // Main View Model
    g.adminvm = new AdminViewModel();

    $(function() {
        ko.applyBindings(g.adminvm);
    });

})(window);
