// admin.js
(function(g) {

    var L = {
        UNABLE_TO_GET_STUDENTS: 'Failed to pull the students :-(',
        ERROR: 'Uh... this is awkward. Something went wrong.',
    };

    // @param {function} callback (err string, students array)
    g.fetchStudents = function(callback) {
        var url = '/admin/students/';
        $.ajax(url, {
            type: 'get',
            dataType: 'json',
            success: function(response, status, xhr) {
                if (xhr.status != 200) return callback(L.ERROR);
                callback(null, response);
            },
            error: function(xhr) {
                callback(L.ERROR);
            }
        });
    };

    g.initSession = function(err, response, status) {
        if (err) return self.err(err);
        self.session(new Session({token: response.token}));
        self.user(new User(response.user));
        self.message(status);
        self.showlogin(false);
    };

})(window);

$(function() {
    fetchStudents(function(err, students) {
        if (err) return adminvm.err(err);
        adminvm.students(students);
    });
});