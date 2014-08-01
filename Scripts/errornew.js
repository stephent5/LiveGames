window.onerror = function (msg, url, lineNo) {
    logError("onerror", msg, url, lineNo);
}   

//Error object used for sending error details to DB
function T5Error(errordesc) {
    this.errordesc = errordesc;
    this.origin = "JS";
}

//this is our T5 custom error handler - we should log errors in DB (via AJAX call)
function logError(origin, msg, url, lineNo) {
    try {
        var userString = "";
        try {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if (thisUser) {
                userString = "[User is " + thisUser.name + "]";
            }
        }
        catch (temp) { }

        //now add the user details to evey DB logging!!!!
        var errordesc = "origin:" + origin + "; msg:" + msg + userString + "; url:" + url + "; lineNo:" + lineNo;

        var thisError = new T5Error(errordesc);

        $.ajax({
            url: WS_URL_ROOT + "/Game/logError",
            type: "POST",
            data: JSON.stringify(thisError),
            dataType: "json",
            contentType: "application/json: charset=utf-8",
            success: function (response) {
                //Errorlogged(response);
            }
        });

    }
    catch (ex) {}
}

//this is our T5 custom error handler - we should log errors in DB (via AJAX call)
function logErrorExtra(origin, msg, url, lineNo,timeOfError) {
    try {
        var userString = ""
        try {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if (thisUser) {
                userString = "[User is " + thisUser.name + "]";
            }
        }
        catch (temp) { }

        //now add the user details to evey DB logging!!!!
        var errordesc = "origin:" + origin + "; msg:" + msg + userString + "; url:" + url + "; lineNo:" + lineNo;
        
        var thisError = new T5Error(errordesc);
        thisError.origin = timeOfError; //this is a hack - just looking for quickest way to get the exact time of error to db so we can debug order of errors!!!

        $.ajax({
            url: WS_URL_ROOT + "/Game/logError",
            type: "POST",
            data: JSON.stringify(thisError),
            dataType: "json",
            contentType: "application/json: charset=utf-8",
            success: function (response) {
                //Errorlogged(response);
            }
        });

    }
    catch (ex) { }
}


//function Errorlogged(response) {}
//var v1 = 1;
// override jQuery.fn.bind to wrap every provided function in try/catch
//var jQueryBind = jQuery.fn.bind;
//jQuery.fn.bind = function (type, data, fn) {
//    if (!fn && data && typeof data == 'function') {
//        fn = data;
//        data = null;
//    }
//    if (fn) {
//        var origFn = fn;
//        var wrappedFn = function () {
//            try {
//                return origFn.apply(this, arguments);
//            }
//            catch (ex) {
//                //trackError(ex);
//                logError("BindOverRide", ex);
//                // re-throw ex iff error should propogate
//                // throw ex;
//            }
//        };
//        fn = wrappedFn;
//    }
//    return jQueryBind.call(this, type, data, fn);
//};
