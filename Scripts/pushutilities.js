var isSafari = 0;
var isChrome = 0;
var IOSversion = -1;

//This function logs each time we interact with the current LiveEvent server
function LogThisInteractionTime() {
    //we have received a message from SignalR - so reset numREconnects value
    numReconnectsSinceWeLastReceivedASignalRMessage = 0;

    var DateHelper = new Date();
    lastInteractionTime = DateHelper.getTime();
}

//reloads page
function ReloadPage() {
    //var requestFixtureID = GetRequestParam("f");
    //window.location.replace(location.protocol + '//' + location.host + "/Game/?f=" + requestFixtureID); // similar behavior as an HTTP redirect

    //updated this - Stephen 29-nov-12 as we are seeing prblems on IE this way!!! - ie seems to freeze 
    window.location.reload(false);
}

function GetCurrentTimeStamp() {
    var EventTimeStamp = new Date();
    return EventTimeStamp.getTime();
}

function DetermineClientDetails() {
    DetermineIfSafari();
    DetermineIOSVersion();
}

function DetermineIfSafari() {
    try {

        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') != -1) {
            if ((ua.indexOf('chrome') > -1) || (ua.indexOf('crios') > -1)) { //crios is the name for Chrome on iOS. 
                isSafari = 0;
                isChrome = 1;
            } else {
                isSafari = 1;
                isChrome = 0;
            }
        }
    } catch (e) { logError("DetermineIfSafari", ex); }
}

function DetermineIOSVersion() {
    try {
        // if (isSafari == 1) {
        IOSversion = parseFloat(
        ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1])
        .replace('undefined', '3_2').replace('_', '.').replace('_', '')
        ) || false;
        //}
        //else {
        //alert("not safari!");
        //}

    } catch (ex) { logError("DetermineIOSVersion", ex); }
}


function HaveWeReceviedThisFreezeOrThawEventBefore(eventid) {
    if (DisplayedFreezeAndThawEventIDs.indexOf(eventid) > -1) {
        return true;
    }
    else {
        DisplayedFreezeAndThawEventIDs.push(eventid);
        return false;
    }
}

function HaveWeReceviedThisLeagueTableBefore(eventid) {
    if (DisplayedLeagueEventIDs.indexOf(eventid) > -1) {
        return true;
    }
    else {
        DisplayedLeagueEventIDs.push(eventid);
        return false;
    }
}

//we want to call this funtion on the pageload!!!
DetermineClientDetails();