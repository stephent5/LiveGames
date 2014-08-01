//initialising important variables//////////////

//var fbid = "276786905679012";
var fbid = "680510885340104"; //putely for testing - this is the t5bupa!

var timeBetweenLightstreamConnections = 12; //used to be 14 - changed stephen 30-nov //used to be 20 - changed stephen 21-Sep
var srstarted = 0;
var thisFixture = null;
var LSBound = 0;
var ReTryBetAttempts = 0;
var FriendScoresUpdating = 0; //we use this to make sure we don't update the same item at the same time losing data in the process
var LoginClick = 0; //this vaiable tells us of the user has clicked to login (i.e manually logged in ) , or , if they have been automatically logged in ( via facebooks "stay logged in" functionality)
var loginFixtureID = 0; //this variable tells us which game to drop the user on after they've logged in
var listOfPreGameBetScrollers = new Array();
var listOfPreGameBetScrollerNames = new Array();
var pregamescroller = null;
var numPreGameplaced = 0;
var lastInteractionTime = null;
//var timeBetweenLightstreamConnections = 20; //number of seconds to wait before we attempt to reconnect to LightStreamer if we haven't received anything  (this is just over double the KeepAlive value in the admin tool)
var DateHelper = new Date(); //object we use to call date functions
var lastEventReceivedTime = null; //we use this object to record the time of the latest game even treceived from Lightstreamer
var CreditsWon = 0;
var KeepAliveCount = 0;
var displayFriendsDetals = 0;
var WS_URL_ROOT = "";
var gameOver = 0;
var remainingforfeits = 0;
var LastGoalScorer = "";
var teamcolours;
var alreadycalledGameDetails = 0;
var connection; //Added this Stephen 20-Sep - we use this object to send/receive messages via the SignalR class
var liveGamesSignalRProxy;  //Added this Stephen 02-May - we use this object to send/receive messages via the SignalR class
var liveGamesSignalRConnection;
var admin; //Added this Stephen 02-May - we use this if the user IS an AdminUser
var keepAliveStarted = 0;
var LastEventReceived = 0;
var DisplayedFreezeAndThawEventIDs = new Array(); //This is going to copy all the eventid's for freeze and thaw events we recevie - we will keep this seperate to the session object we use to store actual game eventid's
var DisplayedLeagueEventIDs = new Array(); //this is going to save all the eventid's for league table signalR messages we receve - again - it wil be quicker if we have a seperate list for these league messages!!

var BetNumberJustDisplayed = 0;
var correctedBetsNeeded = 0;

//check screen size to find out if mobile or web, if user changes orientation - reload page! - John 15/06
var displaymode = "w";//default web
var screenwidth = -1; //default
var screenheight = -1; //default
var isFaceBookSession;
var NewDisplayMode;

//when the document has loaded - start the magic!!!!!!!!!!!!!!!!!!!!!!
$(document).ready(function () {

    isFaceBookSession = (parent !== window);
    //alert("isFaceBookSession " + isFaceBookSession);

    if (isFaceBookSession)
    {
        //this IS a facebook session - so remove change password div!!!
        $('#' + displaymode + '_changepass').hide();

        if((homepagefixtureid))
        {
            if (GetRequestParam("l") == "1") {
                //this is a facebook session and we are on the homepage
                //AND this user HAS come from the landing page
                //so..show FBHome!!!!!
                window.location = location.protocol + '//' + location.host + "/FBHome";
            }
            else {
                //this is a facebook session AND the homepage
                //so hide the button that allows a user to log in via the web site(i.e remove the link to http://www.liveplayfootball.com/Game/?f=245)
                $('#webVisit').hide();
                $('#nonIE').hide();
                $('#FBOnlyDiv').show();
            }
        }
    }

    screenwidth = $(window).width();
    screenheight = $(window).height();
    if (screenwidth <= 799) {
        displaymode = "m";
        _gaq.push(['_trackEvent', 'DeviceView', 'Mobile']);

        if ((homepagefixtureid)) {
            $('#nav').hide();
            $('#FBMobilePrompt').show();
            $('#w_registration_btn').hide();
            $('#FBAsk').html("");
            $('#w_registration_form').css({"top": "10px","position":"fixed"});
        }

    } else {
        displaymode = "w";
        _gaq.push(['_trackEvent', 'DeviceView', 'Web']);

        $('#FBAsk').html("Don't want to login with Facebook? Click here");

        if ((homepagefixtureid)) {
            $('#mobileNav').hide();
        }

    }

   
    if ((homepagefixtureid)) {

        //NewDisplayMode is used for divs which are always web on ther new homepage(the merge with the landing page!!)
        //this is used primarily for the email login/registration flow on the new landing page!!!
        if (homepage == "landing") {
            NewDisplayMode = "w"; //if landing page - always web
        }
        else {
            NewDisplayMode = displaymode;
        }

        if ((displaymode == "m") || (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i))) {
            $('#nonIE').hide(); //don't allow the user to go to the facebook site when on mobile!!! - or on tablet!!!!
        }
    }
    else {
        NewDisplayMode = displaymode;
    }

    Login.FaceBookElementsLoaded();
    
    //this is the function that loads the FB sdk asynchronously
    (function () {
        var e = document.createElement('script');
        e.async = true;
        e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
        document.getElementById('fb-root').appendChild(e);
    }());

    //this is the asynchronous way to load the facebook Javascript SDK
    window.fbAsyncInit = function () {

        //FB.UIServer.setLoadedNode = function (a, b) { FB.UIServer._loadedNodes[a.id] = b; }

        //all references to FB. must be in here (after the FB.init call
        FB.init(
            {
                appId: fbid,  //'276786905679012',
                status: true,
                cookie: true,
                oauth: true,
                xfbml: true,
                channelUrl: 'http://' + location.host + '/channel.html'
            }
        );

        checkIfUserInPrivateBrowsing();

        //continue as normal!!!
        //FB.UIServer.setActiveNode = function(a,b){FB.UIServer._active[a.id]=b;} // IE hack to correct FB bug

        FB.getLoginStatus(Login.DoLoginFlow);

        //FB.Event.subscribe('auth.statusChange', newLoginFlow);

        //new stuff below....
        FB.Event.subscribe('auth.login', function (response) {
            //login();
            Login.DoLoginFlow(response);
        });

        FB.Event.subscribe('auth.logout', function (response) {
            Login.SetUpSiteForLoggedOutUser(0); //clear details but DONT redirect to home page
        });
    };



    setTimeout(function () { window.scrollTo(0, 1); }, 100);

    Login.DoEmailLoginChecks(); //check if this user is an eamil user - and log them in if they are and we can!!!

    //homePage details
    if (homepagefixtureid) {
        //no need for these two lines when tey are contained below
        var winheight = $(window).height();
        $('#mobileview .promo').height(winheight);

        $(window).resize(function () {
            var winheight = $(window).height();
            $('#mobileview .promo').height(winheight);
        });

        var now = new Date();
        if (now > startDate) {
            //the game should have already kicked off - so dont show the countdown!!!!!
            $('#m_kickoffcountdown').hide();
            $('#w_kickoffcountdown').hide();
        }
        else {
            $('#matchcountdown').countdown({ until: startDate, format: 'dHMS', layout: '<span>{dn} {dl}</span><span>{hn} {hl}</span><span>{mn} {ml}</span><span>{sn} {sl}</span>' });
            $('#m_matchcountdown').countdown({ until: startDate, format: 'HMS', layout: '<span>{hn} {hl}</span><span>{mn} {ml}</span><span>{sn} {sl}</span>' });
        }

        var fixturecrest = "@ViewBag.fixturecrest";
        if (fixturecrest) {
            $('.fcrest').show();
        } else {
            $('.fcrest').attr('src', "https://d2q72sm6lqeuqa.cloudfront.net/images/blank-crests.png");
        }
    }

    //$('#pre-selected-options').multiSelect();

   

    //end homePage details
}); ////////////////////////end document loaded ////////////////////////
////////////////start compatibiility check////////////////////////

try {
    var canvasOK = Modernizr.canvas;
    var backgroundsizeOK = Modernizr.backgroundsize;
    var MediaQueriesOK = Modernizr.mq('only all and (min-width: 200px)');
    var localStorageOK = Modernizr.localstorage;

    //alert("init canvasOK is " + canvasOK + ", backgroundsizeOK is " + backgroundsizeOK + ", MediaQueriesOK is " + MediaQueriesOK);

    if ((!canvasOK) || (!backgroundsizeOK) || !MediaQueriesOK) //this will get rid of a most of the old browsers - before we load the page!!!
    {
        //users browser is not compatible with features we usr ..so redirect to support page
        //alert("browser failed checks - redirecting!!");
        window.location = location.protocol + '//' + location.host + "/Support";
    }
    else if (!localStorageOK) {
        //user cannot do local storage - this is usually as they are in private bowsing - check for this AND handle it!!!!
        var privatebrowsingOn = 0;
        var testKey = 'qeTest', storage = window.sessionStorage;
        try {
            // Try and catch quota exceeded errors 
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
        }
        catch (error) {
            if (error.code === DOMException.QUOTA_EXCEEDED_ERR && storage.length === 0) {
                //the user DOES have private browsing on!!!!!!!!!!!! ( we get this error on IOS anyway!!!)
                privatebrowsingOn = 1;
            }
        }

        if (privatebrowsingOn == 1) {
            //users browser is not compatible with features we usr ..so redirect to support page
            //alert("browser failed checks - redirecting!!");
            window.location = location.protocol + '//' + location.host + "/Support?ei=pb"; //add parameter which tells support page thjat the user needs to turn off private browsing!!!!
        }
        else {
            //users browser is not compatible with features we use ..so redirect to support page 
            //- this is the same flow as for all other non compatible browsers!!!
            //alert("browser failed checks - redirecting!!");
            window.location = location.protocol + '//' + location.host + "/Support";
        }
    }
    else {
        //users browser IS compatible with features we use ..so redirect to start page!!!!!
        //window.location = location.protocol + '//' + location.host + "/Start";
        //alert("browser passed all checks!!");
    }
}
catch (error) { }
///////////end compatibiility check


//moved from Game index
function postToFeed() {

    var obj = {
        method: 'feed',
        link: 'http://play.t5livegames.com',
        picture: 'http://content.t5livegames.com.s3.amazonaws.com/intro-crests.png',
        name: 'T5Live Games',
        caption: 'Predict What Happens Next!',
        description: 'I\'m Playing Germany V Greece at T5Live Games -  Join me!'
    };

    function callback(response) {
        document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
    }

    FB.ui(obj, callback);
}


//now set google analytics details here - this has been moved here instead of being in a script on the layout pages
//as it is better practice to have as littel inline scripts as possible!!!!
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-28469603-2']);
_gaq.push(['_trackPageview']);

//moved here from bottom of start .index
//function to call to switch slides in how to play popup!
function showslide(s) {
    var slideid = s;
    $('.howtoslide').hide();
    $('#' + displaymode + '_howtoslide' + slideid).fadeIn('slow');
    $('body').scrollTop(0);
}

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function WeAreCurrentlyShowingLeagueTable() {

   var CurrentlyShowingLeagueTable = false;

   if (displaymode == "m") { //movile view
       if (($('#panel4').is(":visible") == true) && ($('#' + displaymode + '_leaguestandings_1').css('display') == "block")) {
           CurrentlyShowingLeagueTable = true;
       }
   }
   else {
       //web view
       if ($('#' + displaymode + '_leaguestandings_1').css('display') == "block") {
           CurrentlyShowingLeagueTable = true;
       }
   }
   return CurrentlyShowingLeagueTable;
}

//on mobile we are going to update the friends scores every time a user clicks on the leaderboard
//so .. we use this function to determine if we should update it in other flows
//basically - if web - always update - if mobile - then only if we are showing it!!!
function WeAreCurrentlyShowingFriendsLeagueTable() {

    var CurrentlyShowingFriendsTable = false;

    if (displaymode == "m") { //movile view
        if (($('#panel3').is(":visible") == true) && ($('.FriendsLeaderboard').css('display') == "block")) {
            CurrentlyShowingFriendsTable = true;
        }
    }
    else {
        //web view  - we are always showing the friends table!!!!!!
        CurrentlyShowingFriendsTable = true;
    }
    return CurrentlyShowingFriendsTable;
}




//var supportsOrientationChange = "onorientationchange" in window,
//    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

//window.addEventListener(orientationEvent, function () {
//    window.location.reload()
//}, false);  
///////////////////////////

//no longer use this variable!!!
//var StartBetValidCountDownValue = 5; //default 5 seconds  - this will be updated when we get the voidOffset time from the fixture object 

var freezeInDB = 0;//this variable confirms that the freeze IS in the DB - we occasionaly have a scenario where the event gets to the DB BEFORE the Freeze!!! - this rarley happens but if it does happen then nobody can place a bet untill the next event - so its a major problem if it goes wrong
var lastEventSent = 0;

var BetValidCount = 0; //this is the actual variable that will  countdown each time a bet is placed - the StartBetValidCountDownValue variable is a variable that does not change - it's purpose is to hold the voidOffset value permanently so we always know which value to start couuting down from
var gameisLive = 1; //by default the game is live - this variable tells us whether we should check for the heartbeat or not

var userLeague = new League(); //we are going to use this variable to store the details relating to the potentially many user leagues the user could be vieing during a game
var Store = new Store(); //we will use this object to call allour store functions

var LiveEventMessaging; //Added this Stephen 15-Mar - we use this object to send/receive messages via the SignalR class

//LightStream Objects/////////////
var schema = new Array("Ball", "EventID", "timestamp", "Adapter", "Admin", "FixtureID", "HomeScore", "AwayScore", "EventDescription", "EventLogID", "EventOdds", "UBD", "UserID", "BD", "EventTime", "KeepAlive", "EventEndTime", "BM", "PE"); //, "FBD"
var LSEngine;
var page; //= new PushPage(); //we now initialize this here - changed Stephen 23-Apr-12 -- commented this out - stephen 10-Sep
var group;
var pushTable;
var UsersLastCreatedLeague; //we use this object to store the details of the latest league we have cerated

//moved these here -stephen - 16-Apr
//need to declare these variables outside of function as they will nolonger be sent each time from lightstreamer
//they will only be sent if they have changed - this means that if the value hasn't chnaged this time - use the previous one
//i.e. - if we get a goal event and the homescore is 1 and the next event is a corner - we will not get a lightstrem message telling us the homescore
//--this is because it hasn;t chengd - so use the previous value!!!!!!!!!
var thisEventId;
var thisFixtureId;
var thisDescription;
var thisHomeScore;
var thisAwayScore;
var thisEventLogID;
var userBetDetails;
var timestamp;
var friendUserID;

var newOdds;
var eventTime;
var eventEndTime;
var PreviousEvents;
//End LightStream Objects/////////////

//these two variables are used for pregame bets!!!!!!
var LastPlayerDisplayed = 1;
var LastTeamDisplayed = 1;

var PreGamesBetsToPlace = 0; //use this to track how many pre game bets we want to  place!!
var numPreGamesBetsJustPlaced = 0; //use this to track how many pre game bets we've just placed!!

/////////////////////////////////////////////////////////////////////////////////////////////////
//we need to initially set ALL session storage items as certain android devices throw an error
//when you try to reference an item in session storage that has not been set
var tempArray = new Array();
window.sessionStorage.setItem("listOfFriendsBets", tempArray); //reset this each time before we do any other logic on game page - set it to an empty array so we don't have any possiblity for errors
window.sessionStorage.setItem("listOfDisplayedEvents", tempArray); //reset this each time before we do any other logic on game page - set it to an empty array so we don't have any possiblity for errors
window.sessionStorage.setItem("leagueview", null); //clear the leagueView object from the caching each time we load the page!!
window.sessionStorage.setItem("listOfFriendsScores", tempArray);
window.sessionStorage.setItem("pregamebets", tempArray);
window.sessionStorage.setItem("listOfAlreadyReceivedPreGameBetOptionDetails", tempArray);
window.sessionStorage.setItem("leaderboard", tempArray);

//added these Stephen 30-Nov-11
//window.sessionStorage.setItem("facebookfriendlist", null); 
//window.sessionStorage.setItem("facebookuser", null);
window.sessionStorage.setItem("Currentbet", null); //when we reload the page we reload this object from the DB
window.sessionStorage.setItem("tempBet", null); //temp object
window.sessionStorage.setItem("timeOutBet", null); //temp object used to hold the bet object in case their is a timeout
window.sessionStorage.setItem("fbs", 0);

window.sessionStorage.setItem("LeaderboardLog", null);
//window.sessionStorage.setItem("FriendScoresUpdating", 0); //we use this to make sure we don't update the same item at the same time losing data in the process
window.sessionStorage.setItem("usersOneClickCreditValue", 0); //default value is 0
var inPowerPlay = 0;
var betJustComplete = 0; //Added this Stephen 23-Mar - we use this to determine whether to show join the bet number flash up
//end all session storage intial settings/////////////////////////////////////////////////////////////

var FriendsAddedToLSSchema = 0;

window.sessionStorage.setItem("tempBet", null); //clear the tempBet variable from local storage !!


//END initialising important variables//////////////

//this is a function to get request param's
function GetRequestParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}

function getRandomNumber(min, max) 
{
    if ((!max) && (!min)) 
    {
        //if no max and min passed in - then set default
        max = 1000;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Called by iOS app to confirm iOS billing should be used
function iOSAppTrue() {
    iosApp = true;
}

//function getPlatform() {
//    return 2;// hardcoded for testing ios flow
//}

function getPlatform() {
    if (iosApp) {
        return 2; //ios
    }
    else {
        if (
            (isFaceBookSession) &&
            ((isFaceBookSession == true) || (isFaceBookSession == "true") || (isFaceBookSession == "True"))
        ) 
        {
            return 4 //facebook!!!!
        }
        else {
            //default - doesn't match anu of the others - so - must be web!!
            return 1; //web
        }
    }
}

