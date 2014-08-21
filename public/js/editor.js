// editor.js
// todo require js, angular, and all the other goodies
// needs zepto
$(function() {
    var editor = ace.edit("editor");
    // editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setShowPrintMargin(false);

    // editor.getSession().on('change', function(e) {
    // });

    editor.getSession().on("changeAnnotation", function(){
        var annotations = editor.getSession().getAnnotations();
        var errors = annotations.filter(function(annotation) {
            // "error" || "warning" || "info"
            return (annotation.type === "error");
        });
        if (errors.length > 0) return; // short circuit when there are errors
        var win = $("#sandbox").get(0).contentWindow;
        var code = editor.getValue();
        var l = window.location;
        var origin = l.protocol + "//" + l.host;
        win.postMessage(code, origin); // todo listen for errors coming back from iframe
    });
});