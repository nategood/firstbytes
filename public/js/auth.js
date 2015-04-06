(function(g) {
    var L = {
        SIGNUP_ERROR: 'Looks like we have some problems creating your account. Make sure you fill out all required fields.',
        SIGNUP_SUCCESS: 'Saved!',
        ERROR: 'Uh... this is awkward. I don\'t seem to recognize you. Try to log in again.',
        CHANGE_PASSWORD_ERROR: 'We were unable to update the password. Make sure it is strong enough. Maybe make it longer or trickier.',
        SUCCESS: 'Hey! Welcome back my friend!',
        UPDATE_ACCOUNT_ERROR: 'We had trouble updating the account. Make sure you were not missing any fields.'
    };

    // can have locale, joined, country, locality, region, postalCode.
    g.signup = function(data, callback) {
        var url = '/user/';
        $.ajax(url, {
            type: 'post',
            dataType: 'json',
            data: data,
            success: function(response, status, xhr) {
                // response.user, response.token
                callback(null, response, L.SIGNUP_SUCCESS);
            },
            error: function(xhr) {
                callback(L.SIGNUP_ERROR);
            }
        });
    };

    // form must have a username and password field
    g.auth = function(data, callback) {
        var url = '/user/auth/';
        $.ajax(url, {
            type: 'post',
            dataType: 'json',
            data: data,
            success: function(response, status, xhr) {
                // response.user, response.token
                callback(null, response, L.SUCCESS);
            },
            error: function(xhr) {
                callback(L.ERROR);
            }
        });
    };

    // form must have a password field
    g.changePassword = function(id, token, data, callback) {
        var url = '/user/' + id + '/password/';
        $.ajax(url, {
            type: 'post',
            dataType: 'json',
            headers: {'token': token},
            data: data,
            success: function(response, status, xhr) {
                // response.user
                callback(null, response, L.SUCCESS);
            },
            error: function(xhr) {
                // response.error
                callback(L.CHANGE_PASSWORD_ERROR);
            }
        });
    };

    // form must have a name and email field
    g.updateAccount = function(id, token, data, callback) {
        var url = '/user/' + id + '/';
        $.ajax(url, {
            type: 'post',
            dataType: 'json',
            headers: {'token': token},
            data: data,
            success: function(response, status, xhr) {
                // response.user
                callback(null, response, L.SUCCESS);
            },
            error: function(xhr) {
                // response.error
                callback(L.UPDATE_ACCOUNT_ERROR);
            }
        });
    };

})(window); // should append them to a namespace instead of directly on window
