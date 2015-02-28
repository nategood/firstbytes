// editor.js
// todo require js, angular, and all the other goodies
// needs zepto/jquery, code
$(function() {
    var editor = ace.edit('editor');
    var addAutocomplete, langTools;

    addAutocomplete = function() {
        langTools = ace.require('ace/ext/language_tools');
        editor.setOptions({
            // enableBasicAutocompletion: true,
            // enableSnippets: true,
            enableLiveAutocompletion: true
        });
        var processingAutocompleter = {
            getCompletions: function(editor, session, pos, prefix, callback) {
                if (prefix.length === 0) { callback(null, []); return; }
                callback(null, Manual.basic);
            }
        };
        for (var i = editor.completers.length - 1; i >= 0; i--) {
            if (editor.completers[i] === langTools.keyWordCompleter) {
                editor.completers.splice(i, 1);
            } else if (editor.completers[i] === langTools.textCompleter) {
                this.internalTextCompleter = editor.completers[i];
                editor.completers.splice(i, 1);
            }
        }
        langTools.addCompleter(processingAutocompleter);
    };

    // editor.setTheme('ace/theme/monokai');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setShowPrintMargin(false);
    addAutocomplete();

    var stageCanvas = stage('#sandbox');

    editor.getSession().on('changeAnnotation', function(){
        var annotations = editor.getSession().getAnnotations();
        var code = editor.getValue();
        var errors = annotations.filter(function(annotation) {
            // 'error' || 'warning' || 'info'
            return (annotation.type === 'error');
        });

        // knockout bindings
        appvm.dirty(true);
        appvm.project().source(code);

        // if (errors.length > 0) {
        //     appvm.err(errors.join(', '));
        //     return; // short circuit when there are errors
        // }

        code = Code().prep(code);
        if (code === false) return;

        stageCanvas.publishCode(code);
    });

    appvm.projectObserver = ko.computed(function() {
        var ecode = editor.getValue();
        var pcode = appvm.project().source();
        if (ecode === pcode) return;
        editor.setValue(pcode);
    }, appvm);

    // initialize saving of vm state, see state.js
    initStateListener(appvm, 'fb.state', populateKnockout);
});