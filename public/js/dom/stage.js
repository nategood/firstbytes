var stage = function(selector) {
    // Publish the code to the iframe
    var win = $(selector).get(0).contentWindow;
    // if (!win) throw Error("Bad selector");
    var publish = function(payload) {
            var l = window.location;
            var origin = l.protocol + '//' + l.host;
            win.postMessage(JSON.stringify(payload), origin);
            // console.debug('Sending code: ', payload);
            // todo listen for errors coming back from iframe
    };
    var publishCode = function(code) {
        // todo clear up this try catch wrapper to be more useful
        // and especially for passing it back to the parent (out of iframe)
        // doesn't help with syntax errors...
        var payload = {
            type: 'code',
            code: 'try{;' + code + '\n;}catch(e){console.log("Error! " + e);}'
        };
        return publish(payload);
    };
    var publishScreenshotIntent = function() {
        // todo clear up this try catch wrapper to be more useful
        // and especially for passing it back to the parent (out of iframe)
        // doesn't help with syntax errors...
        return publish({
            type: 'screenshot'
        });
    };
    var publishProjectPreview = function() {
        return publish({
            type: 'projectpreview'
        });
    };

    $(window).on('message', function(msg) {
        // todo validate origin, etc.
        // console.log('Parent Received: ', msg.data);
    }, false);

    return {
        publish: publish,
        publishCode: publishCode,
        publishScreenshotIntent: publishScreenshotIntent,
        publishProjectPreview: publishProjectPreview
    };
};

// tmp hack because the postMessage return messing is not working?
// not crazy about this living here and touching appvm state
var saveScreenshot = function(data) {
    flashCamera();
    if (!appvm.session()) return;
    var payload = {
        userId: appvm.user()._id(),
        projectId: appvm.project()._id(),
        data: data
    };
    repo.saveScreenshot(appvm.session().token(), payload, function(err, screenshot) {
        appvm.screenshot(screenshot);
        appvm.showscreenshot(true);
        // console.log("Screenshot save", arguments);
    });
};

var saveProjectPreview = function(data) {
    if (!appvm.session() || !appvm.project()) return;
    appvm.project().screenshot(data);
};

var flashCamera = function() {
    $("#cameraflash").css("display", "block").fadeOut(1000);
};
