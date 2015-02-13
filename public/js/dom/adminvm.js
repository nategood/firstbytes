// The beginning of KO integration. Need to pull in the stuff from
// dom/editor.js and dom/user.js
// requires moment.js, auth.js, repo.js
(function(g) {
    var L = {
    };

    // todo dry
    function User(data) {
        this._id = ko.observable(data._id);
        this.name = ko.observable(data.name);
        this.email = ko.observable(data.email);
        this.locale = ko.observable(data.locale);
    }

    function AdminViewModel() {
        var self;

        self = this;

        // self.session = ko.observable(null); // new Session({})
        // self.user = ko.observable(null); //new User({email: "asdlfkjals"})
        // self.projects = ko.observableArray([]); // don't bother making these actual "Project" instances
        // self.lessons = ko.observableArray([]);
        // // self.editor = ko.observable(new Editor({}));
        // self.username = ko.computed(function() {
        //     return self.user() ? self.user().name() : L.DEFAULT_USERNAME_TEXT;
        // });
    }

    // Main View Model
    g.adminvm = new AppViewModel();
    ko.applyBindings(g.adminvm);

})(window);
