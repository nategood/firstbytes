(function(g) {
    var signup = {};
    signup.bind = function(selector, callback) {
        var $form, url, L;
        L = {
            ERROR: 'Looks like we have some problems creating your account. Make sure you fill out all required fields.',
            SUCCESS: 'Saved!',
        };
        url = '/user/';
        $form = $(selector);
        // form must have a name, email, password.
        // can have locale, joined, country, locality, region, postalCode.
        $form.submit(function() {
            $.ajax(url, {
                type: 'post',
                dataType: 'json',
                data: $form.serialize(),
                success: function(user, status, xhr) {
                    callback(null, L.SUCCESS, user);
                },
                error: function(xhr) {
                    callback(L.ERROR);
                }
            });
            return false;
        });
        return $form;
    };
    g.signup = signup;
})(window);
