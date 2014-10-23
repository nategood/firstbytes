// requires auth.js, jquery/zepto
// todo requirejs, wire up knockout for source code changes
(function(g) {
    var L, repo;
    repo = {};
    L = {
        SAVE_ERROR: 'Whoops! Looks like we were not able to save your code. Bummer. Make sure you are online.',
        GET_PROJECTS_ERROR: 'Uh oh. We were not able to fetch your projects. Make sure you are online.'
    };
    repo.save = function(src, auto) {
        localStorage['fb.source.auto'] = src;
        if (!auto) localStorage['fb.source'] = src;
    };
    repo.getLastAutoSaved = function() {
        return localStorage['fb.source.auto'];
    };
    repo.getLastSaved = function() {
        return localStorage['fb.source'];
    };
    // project: {name: id: user: src: }
    repo.saveToRemote = function(project, token, callback) {
        var url;
        if (auth.isAuthenticated() === false) return callback();
        url = '/project/';
        $.ajax(url, {
            type: 'post',
            dataType: 'json',
            headers: {'token': token},
            data: project,
            success: function(response, status, xhr) {
                callback(null);
            },
            error: function(xhr) {
                callback(L.SAVE_ERROR);
            }
        });
    };
    repo.fetchAll = function(user, token, callback) {
        var url;
        if (auth.isAuthenticated() === false) return callback();
        url = '/user/' + user._id + '/projects';
        $.ajax(url, {
            type: 'get',
            dataType: 'json',
            headers: {'token': token},
            data: project,
            success: function(response, status, xhr) {
                callback(response);
            },
            error: function(xhr) {
                callback(L.GET_PROJECTS_ERROR);
            }
        });
    };

    g.repo = repo;
})(window);
