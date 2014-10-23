// The beginning of KO integration. Need to pull in the stuff from
// dom/editor.js and dom/user.js
(function(g) {
    function AppViewModel() {
        // state
        this.err = ko.observable("");
        this.showprojects = ko.observable(false);
        this.showlogin = ko.observable(false);
        // current user
        this.user = ko.observable(null);
        this.username = ko.observable("");
        this.userprojects = ko.observableArray([]);
        // current project
        this.projectid = ko.observable(null); // todo
        this.projectname = ko.observable(""); // todo
        this.projectsource = ko.observable(""); // todo
        this.projectdirty = ko.observable(false);

        this.authenticated = ko.computed(function() {
            return !this.username();
        }, this);
        this.unauthenticated = ko.computed(function() {
            return this.username();
        }, this);
    }
    g.appvm = new AppViewModel();
    ko.applyBindings(g.appvm);
})(window);
