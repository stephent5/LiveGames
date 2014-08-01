//this function is called for the HOMEPAGE only!!!
function DoHomePageLoadLogic() {

    //9-Aug-2013  removed  CheckGameLimits as we are no longer going to connect to pusher from the homePage
    //CheckGameLimits();

    try {
        var thisUser;
        var userid = -1;

        try {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            userid = thisUser.id;
        } catch (ex) { }

        $.ajax({                        
            url: WS_URL_ROOT + "/Home/GetGameTrackerDetailsForHomePage",  //GetGameTrackerDetails
            type: "POST",
            data: "f=" + GetCurrentfixtureID() + "&u=" + userid,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                AjaxFail("GetGameTrackerDetails", XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (response) {
                DisplayGameTracker(response);
            }
        });
    }
    catch (ex) {
        logError("GetGameTrackerDetails", ex);
    }
    IOSWebViewWarning(); //this will be aclled from the home page
}


//this function contains function calls we want o run on a page load!!
//this function called from fb.js (in 3 seperate places) if the user is looged in via facebook and from login.js if the user is logged in via email/pass
function DoGamePageLoadLogic() {
    GetGameDetails(GetCurrentfixtureID(), GameDetailsComplete);
    if (alreadycalledGameDetails == 1) {
        //if in here it means we have the user object and were able to call GetGameDetails
        //so..now call the other functions on page load

        //only show the pregame bets link when we know the user's user id - as i think part of the problem we are are with displaying pregame bets is that we are allowing users to click the link to see pregame bets - before we know who the user is!!!!
        $('.pregameclick').show();
        $('#BeforeMatchPreGame').show();

        userLeague.GetLeagueInvites(); //aded this Stephen 17-July-12 - while getting game details - make simultaneous AJAX call to get latest invites!!!

        //after a UB transaction we will get redirected back to the game page ( i.e here!!!!!!!!!!)
        //1 - we want to check our DB to see if we have any open transactions
        //2 - then - for each of the open transactions we call a UB API to see if the transaction was a success
        //3 - if the transaction WAS a success we update our system and give the user the relevant store item (redits,forfeits etc)
        //4 - if the transaction was NOT a success we update our DB!!!
        //Store.CheckForOpenStorePurchases();

        //changed this to only check for store purchases after a timeout as we are seeing strange behaviour upon returning to page after a 
        //store purchase - particularly on safari - not sure if this will help resolve isssue - keep an eye on this
        //setTimeout("Store.CheckForOpenStorePurchases();", 1500); 
        //the above line now called AFTER we've established SignalR connection!!!!!!!!! - this is due to signalr issue with loading always appearing
    }
}


//This function is called when the page loads
//It returns details of all events and bets made by the user
//This function is needed in case the user joins the game half way through so we can set the correct score and list all the previous event
//It is also used if the user leaves the page during the game and comes back or if they do a page refresh while playing the game
function GetGameDetails(thisFixture, callback) {
    try {
        var userid = -1;
        uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        if (
            (uiUser) && (uiUser.id > 0)
        ) {
            //only get the game details if we know who the user is - user can't play the game anonymously
            userid = uiUser.id;

            $.ajax({
                url: WS_URL_ROOT + "/Game/GetGameDetails",
                type: "POST",
                data: "f=" + GetCurrentfixtureID() + "&u=" + userid + "&fu=" + uiUser.fbuserid,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetGameDetails", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    if (callback instanceof Function) {
                        callback(response);
                    }
                }
            });
            alreadycalledGameDetails = 1;
            
            var LogInMethod;
            try {
                LogInMethod = window.sessionStorage.getItem("lim");
                if (LogInMethod == 2) {
                    //user is logged in as am email user - and so has no friends - so hide create leagues div!!!
                    $('#menubtn2').hide();
                    $('.FriendFeedInfo').html("<p>You have no Friends playing.</p><p style='background:#3b5998;color:#fff;border-radius:10px;-webkit-border-radius:10px;-moz-border-radius:10px;'><strong>Login using Facebook</strong> to compete against your Facebook friends that are playing.</p>");

                    //user is NOT a facebook user - so HIDE the invite friend button!!!!!!
                    $('#InviteClick').hide();
                }
                else {
                    //user is a facebook user - so SHOW the invite friend button!!!!!!
                    $('#InviteClick').show();
                }
            } catch (ex) { }
           

            //removed the following - stephen 5-10-2012 - replaced by FunctionsToRunOnPageLoad which is called from elsewhere!!!!
            //the following pregame bets line is only relevant for when this function is called via a page load- but it's no harm calling it here at other times!!
            //only show the pregame bets two when we know the user's user id - as i think part of the problem we are are with displaying pregame bets is that we are allowing users to click the link to see pregame bets - before we know who the user is!!!!
            //$('.pregameclick').show();

            //userLeague.GetLeagueInvites(); //aded this Stephen 17-July-12 - while getting game details - make simultaneous AJAX call to get latest invites!!!

            //after a UB transaction we will get redirected back to the game page ( i.e here!!!!!!!!!!)
            //1 - we want to check our DB to see if we have any open transactions
            //2 - then - for each of the open transactions we call a UB API to see if the transaction was a success
            //3 - if the transaction WAS a success we update our system and give the user the relevant store item (redits,forfeits etc)
            //4 - if the transaction was NOT a success we update our DB!!!
            //Store.CheckForOpenStorePurchases();
            //End - removed the following - stephen 5-10-2012

        }
        else {
            //alert("calling getgame details - no user!!");
            logError("GetGameDetails", "calling getgame details - no user!!");
        }
        IOSWebViewWarning(); //this will be aclled from the game page
    }
    catch (ex) {
        logError("GetGameDetails", ex);
    }
}



//this function is called when the game details have been returned after calling GetGameDetails
//NB John - here is where we populate the gametracker( and all the page) when the user loads page
//Added hometeam and awayteam scores at halftime and fulltime - John
function GameDetailsComplete(response) {
    try {
        thisFixture = response;

        if (thisFixture.v == -999) {
            //this will always be -999 if 1 - a hack - 2 user REgistered with email and then on another browser REgistered with facebook - this will overwrite their fbuserid in db - in either case - prompt javascript to log the user OUT!!!!
            Login.ClearSessionDetails();
            logError("GetGameDetailsError", "-999");
            return;
        }
        else  if (thisFixture.a == 1) {
            //if the game has been archived - redirect to the homepage
            $('#' + displaymode + '_leavepagemessage').html("Game has been archived! Returning to home page!!");
            $('#' + displaymode + '_leavepagestatus').fadeIn(50).delay(500).fadeOut(50);
            setTimeout("Login.goHome();", (500)); //go to homepage the page in 0.5 seconds 
            logError("GetGameDetailsError", "Archive");
            return;
        }
        else if (thisFixture.tmp > 0) {
            //user has just logged in and loaded the game page - however the game has reached its players limit!!!
            ///send user to the  player limit page!!!
            window.location.href = "http://liveplayfootballterms.s3-website-eu-west-1.amazonaws.com/full.html";
            logError("GetGameDetailsError", "PlayerLimit");
            return;
        }
        else if ((PushConnectionStarted == 0) && (thisFixture.fixtureid > 0)) {
            //the connection has not been started yet - this must be the first time we are loading the game page - so start push connection!!

            //first get push connection details (loaded from DB!) 
            //( we cant do connection anymore untill we have been to db and find out how many pushers we need and what their urls are!!!)
            sp = thisFixture.sp;
            ap = thisFixture.ap;
            fp = thisFixture.fp;
            EstablishPushConnection();
        }
        else if (PushConnectionStarted == 0) {
            //if in here then we haven't got the correct fixture details - redirect to honpegae
            window.location.href = location.protocol + '//' + location.host + "/"; // "/Start"
            logError("GetGameDetailsError", "DontHaveAllDetails");
            return;
        }

        //StartBetValidCountDownValue = thisFixture.voidOffset; //no longer use this variable!!!
        gameisLive = thisFixture.live;

        UpdatePreGameTickerTickerText();

        if (thisFixture.sound == 1) {
            //the user currently CAN hear the sound ...so...show the link to allow them turn it off!!!!
            if (displaymode == "m") {
                $('#soundbadge-off').show();
                $('#soundbadge-on').hide();
            } else {
                //change text for link in web/ipad view
                $('#soundlink').html("&#10006; Turn Off Sound");
            }
        }
        else {
            //the user currently can NOT hear the sound ...so...show the link to allow them turn it ON!!!!
            if (displaymode == "m") {
                $('#soundbadge-off').hide();
                $('#soundbadge-on').show();
            } else {
                //change text for link in web/ipad view
                $('#soundlink').html("&#10004; Turn On Sound");
            }
        }


        //added this Stephen 25-Apr - we now get credits from this function instead of from the user object
        $('.credits').html(response.credits);
        $('.credits').show();

        if (response.currenthalf == -101) {
            //game hasn't started yet
            HideNonPitchDisplays(); //hie everything anyway - occasionally we have scenarios where we diaply both the half-time and full-time displays

            populatePitch(response);

            if ((admin) && (admin.isAdmin())) {
                //added this Stephen 14-June-12
                //we now popultae the pitch here - it will not display for the user but we need to show it as we watn the admin to be able to preview the pitch!!!
                //populatePitch(response);
            }
            else {
                $('.match-notstarted').show();

                $('.match_desc').html("<span class='home_team_desc'>" + response.hometeam + "</span><span class='seperator'>V</span><span class='away_team_desc'>" + response.awayteam + "</span>");
                //$(".game-desc-image").attr({ src: "/Images/game-intro-fix" + response.fixtureid + ".png", alt: response.hometeam + " V " + response.awayteam });
                //if there's no image for this fixture show default
                //$('.game-desc-image').error(function () {
                $(".game-desc-image").attr({ src: "https://d2q72sm6lqeuqa.cloudfront.net/images/game-intro.png", alt: response.hometeam + " V " + response.awayteam });
                //});
            }

            HidePitch();
        }
        else if (response.currenthalf == -102) {
            //Half Time!!
            DisplayHalfTime(response.hometeam, response.awayteam, response.homescore, response.awayscore, response.fixtureid);
        }
        else if (response.currenthalf == -103) {
            //Full Time!!
            DisplayFullTime(response.hometeam, response.awayteam, response.homescore, response.awayscore, response.fixtureid);

            if ((admin) && (admin.isAdmin()))
            { }
        }
        else {
            populatePitch(response);
        }

        remainingforfeits = response.remainingforfeits;
        //DisplayHigherCreditsAvailabilityToUser(response.unlockcredits); //old way  - //Stephen 23-Mar-12
        DisplayHigherCreditsAvailabilityToUserV2(response.unlockcredits, response.numbetsplaced, response.numbetstounlockhigherlevel); //new way  - //Stephen 23-Mar-12

        // Added by Gamal 14/03/2012: Check remaining Power Play seconds
        //        remainingPowerPlaySecs = response.remainingPowerPlaySecs;
        //        if (remainingPowerPlaySecs > 0) {
        //            // Currenty in Power Play
        //            showPowerPlayTimer();
        //            inPowerPlay = 1;
        //        } else if (remainingPowerPlaySecs == 0) {
        //            // Haven't started Power Play yet & therefore do nothing
        //            //but we might want to set the number of power plays here so the user can see how many they have left!!!
        //        } else {
        //                // Used Power Play
        //                //test this!!!!!!!!
        //                if (response.remainingpowerplays == 0) {
        //                    RemovePowerPlayTimer(-1); // Pass -1 to tell the function not to call get game details again
        //                }
        //        }

        LiveHelper.SavePowerPlayTimeRemaining(response.remainingPowerPlaySecs);
        if (LiveHelper.GetPowerPlayTimeRemaining() > 0) {
            // Currenty in Power Play
            showPowerPlayTimer();
            inPowerPlay = 1;
        }
        else if (response.remainingpowerplays == 0) {
            RemovePowerPlayTimer(-1); // Pass -1 to tell the function not to call get game details again
        }
        else {
            //if we are in here - then 
            //1 - we are not currently in a power play
            //2 - we have remaing power plays

            //so...display how many power plays we have left!!!!!
            var message = '<span>' + response.remainingpowerplays + '</span>Power Play';
            if (response.remainingpowerplays > 1) {
                message += "s";
            }
            $('#' + displaymode + '_powerplayclickbtn').html(message);
        }


        // Added by Gamal 29/03/2012: One click bet value
        oneClickBetValue = response.oneClickBetValue;
        if (oneClickBetValue > 0) {
            if (localStorage.getItem("usersOneClickCreditValue") != null) {
                localStorage.removeItem("usersOneClickCreditValue");
            }
            localStorage.setItem("usersOneClickCreditValue", GetCurrentfixtureID() + "-" + oneClickBetValue);
        }

        // Added by Gamal 30/03/2012: Void Offset
        voidOffset = response.voidOffset;

        if ((response.activebet)) {
            //there is a bet object returned - update our current bet object to be this bet
            Currentbet = response.activebet;
            try {
                Currentbet.odds = Currentbet.odds.toFixed(2); //odds gets returned here as an integer - this changes the value to a decimal - we need this value as a decimal
            } catch (EX) { }

            window.sessionStorage.setItem("Currentbet", $.toJSON(Currentbet));  //Reset the sessionStorage Currentbet object

            if (remainingforfeits > 0) {
                //user has a current Bet AND has forfeits remaing ...so show forfeit button
                $('.forfeitclick').show();
                $('#' + displaymode + '_forfeitnum').html(remainingforfeits);
            }
        }
        else {
            //we are loading page and their is no active bet - therefore clear bet objects
            Currentbet = null;
            window.sessionStorage.setItem("Currentbet", Currentbet);
        }

        populatePitchOdds(response);

        //if we have an active bet then display the icon
        if ((Currentbet != null) && (Currentbet.status == 0)) {
            //we have a current bet 
            //these 3 lines set the marker over the event button to indicate you have a bet here!!
            $('#' + displaymode + '_bubble' + Currentbet.eventid).removeClass("bubble");
            $('#' + displaymode + '_bubble' + Currentbet.eventid).addClass("bubble_active");
            $('#' + displaymode + '_bubble' + Currentbet.eventid).html("" + Currentbet.amount + "");
        }

        if (response.events) {
            DisplayGameTracker(response.events);
        }

        if (response.justjoinedgame > 0) {

            if (NotifyFriendsThatUserHasJoinedGame(friendsNotified) < 0) {
                //i have seen that we failed to send messages via SignalR as the signalr connection hasn't been initialised when 
                //we tried to send the message - so try again if it fails!!!
                setTimeout("NotifyFriendsThatUserHasJoinedGame(friendsNotified,1);", 5000);
            }

            //i dont like the way we call this - this has been replaced by the  function call below - userLeague.GetDefaultLeague()
            //ViewLeagues(1); //we have just joined the game - therefore we have also just been included in the default league for this fixture - so show the league!!!!
        }
        else {
            //if in here it means that the user is returning to the page having already been here playing the game
            //in this case we want to get the pregame bet details and have them in session storage in case any events come in
            GetPreGameBetDetails(true, 1);
        }

        //moved this here stephen - 10-july 
        //userLeague.GetLeagueTable(response.defaultleagueid, response.defaultleaguename, null, response.defaultleaguecreator, response.defaultleaguenummembers);
        userLeague.GetDefaultLeague(); //this displays the league table for the default league linked to this fixture (i.e the overall scores)

        //TickerContent() will be started when we update the friends or overall leaderboard 
        //SetTickerContent(); //this starts the ticker - and populates it!

        //added this Stephen 2-May
        if ((admin) && (admin.isAdmin())) {
            admin.configureStartButtons();
        }

        //removed this stephen 26-july - having this in means that every time we sent out a message - every single user then hits our API's/DB
        //two seconds later to get the last event - is this really neccesary?? especially now that we dont use lightstreamer???
        //also we now send out the list of the last 5 events with every event - we can use this to tell us if we've missed a message
        //- this is a much better way - less hits on API's/DB!!!!
        //setTimeout("GetLastEvent(DisplayLastEvent)", 2000); //this gets the last game event  - we need to call this as in some cases ( if you load the page at the exact same time a lightstream message is sent) we lose a lightstream message - by calling this function we make sure we do not lose any messages!!
    }
    catch (ex) {
        logError("GameDetailsComplete", ex);
    }
}


function CheckGameLimits() {
    try {
        var thisUser;
        var userid = -1;
        var fbuserid = "";

        try {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            userid = thisUser.id;
            fbuserid = thisUser.fbuserid;
        } catch (ex) { }

        $.ajax({
            url: WS_URL_ROOT + "/Game/CheckGameLimits",
            type: "POST",
            data: "f=" + GetCurrentfixtureID() + "&u=" + userid + "&fu=" + fbuserid,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                EstablishPushConnection();
                AjaxFail("CheckGameLimits", XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (response) {
                if (response > 0) {
                    //too many players playing the game - so do redirect!!!!!!
                    //window.location.href = "http://liveplayfootballterms.s3-website-eu-west-1.amazonaws.com/full.html";

                    //no longer do redirect here - instead just not connecting to T5Pusher is enough
                    //the reason we dont want to block people here is...
                    //if a user logs in and plays and then for some reason logs out ( which they may do the day before the game starts if the link has been up for a few days)
                    //then they wont be able to get back in to the game
                    //- to fix this we no longer block people on the home page
                    //its' only after they log in and go to the fixture page that we will block them (if of course there are too many players playing the game)!!!!
                }
                else {
                    //the game limit has NOT been reached - so establish push connection!!
                    EstablishPushConnection();
                }
            }
        });
    }
    catch (ex) {
        EstablishPushConnection();
        logError("GetGameTrackerDetails", ex);
    }
}



var LiveHelper = function () {
    //private variables - which the 3rd party cannot see
    var remainingSecs;

    function SavePowerPlayTimeRemaining(secondsLeft) {
        remainingSecs = secondsLeft;
    }

    function GetPowerPlayTimeRemaining() {
        return remainingSecs;
    }

    return {
        SavePowerPlayTimeRemaining: SavePowerPlayTimeRemaining,
        GetPowerPlayTimeRemaining: GetPowerPlayTimeRemaining
    };

}();


var uiUser;
var Currentbet;
var lastUpdateID;
var teamPlayingFromLeftToRight;
var teamPlayingFromRightToLeft;
var iosApp = false;

function GetCurrentfixtureID() 
{
    var CurrentfixtureID = GetRequestParam("f");

    if ((!CurrentfixtureID) && (homepagefixtureid))
    {
        CurrentfixtureID = homepagefixtureid;
    }

    return CurrentfixtureID;
}

function CastToDecimal(num)
{
    try
    {
        var string = "" + num;
        if (string.indexOf('.') > 0) {
            //this IS already a decimal - so return as is!!!
            return num;
        }
        else {
            //this is not a decimal - so cast it to decimal and return!!!!!
            return num.toFixed(2);
        }
    }
    catch (ex) {
        logError("CastToDecimal", ex);

    }
}

function IOSWebViewWarning() {

    //alert("IOSversion is " + IOSversion);
    if ((IOSversion > 0)) {
        var is_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
        //alert("is_uiwebview " + is_uiwebview);
        if (is_uiwebview) {
            var IOSUserhasseenthiswarningbefore = 0;
            try {
                if (localStorage.getItem("IOSWebViewWarning") != null) {
                    IOSUserhasseenthiswarningbefore = 1;
                }
            } catch (ex) { }

            //alert("IOSUserhasseenthiswarningbefore is " + IOSUserhasseenthiswarningbefore);
            if (IOSUserhasseenthiswarningbefore == 0) {
                //in 5 seconds do an alert to tell the user they should play this game elsewhere!!!
                //alert("we will call function in 5 secs!");
                window.setTimeout(function () {

                    alert("For the best gaming experience open this page in Safari using the 'Open in Safari' link in the app menu");
                    localStorage.setItem("IOSWebViewWarning", 1);
                }, 100);
            }
        }
    }
}





function HidePitch() {
    try
    {
        $('.headline').hide();
        $('.pitch-container').hide();
        $('.pitch-icons').hide();
        $('.pitch').hide();
        $('.headline').hide();
        $('.helpclick').hide();
        $('.forfeitclick').hide();
        $('.powerplayclick').hide(); // Added by Gamal 16/03/2012

        if (displaymode != "m") { //always show the powere play icon on mobile - stephen 9-nov-12
            $('#' + displaymode + '_phonepowerplay').hide();
            $('#' + displaymode + '_powerplaytimertext').hide();
            $('#' + displaymode + '_powerplaytimerlabel').hide();
        }
        else {
            //we dont want the clock to continue counting at half time!!!! - stephen 19-4-13
            $('#' + displaymode + '_powerplaytimertext').hide();
        }

//        $('.powerplayclick').hide();
//        $('#powerplaytimertext').hide();
    }
    catch (ex) {
        logError("HidePitch", ex);
    }
}

function HideNonPitchDisplays() {
    try
    {
        //hide all non-match div's
        $('.match-notstarted').hide();
        $('.halftime').hide();
        $('.fulltime').hide();
    }
    catch (ex) {
        logError("HideNonPitchDisplays", ex);
    }
}

function ShowPitch() {
    try 
    {
       $('.headline').show();
       $('.pitch-container').show();
       $('.pitch-icons').show();
       $('.pitch').show();
       $('.headline').show();
       $('.helpclick').show();
       $('.powerplayclick').show(); // Added by Gamal 16/03/2012
       $('#' + displaymode + '_phonepowerplay').show();
       $('#' + displaymode + '_powerplaytimertext').show();
       $('#' + displaymode + '_powerplaytimerlabel').show();

         

       $('#powerplayclickbtn2 span').html(thisFixture.remainingpowerplays);
//       $('.powerplayclick').show();
//       $('#powerplaytimertext').show();
    }
    catch (ex) {
        logError("ShowPitch", ex);
    }
}

function GetLastEvent(callback) {
    try
    {
        $.ajax({
        url: WS_URL_ROOT + "/Game/GetLastEventFixture",
        type: "POST",
        data: "fixtureID=" + GetCurrentfixtureID(),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            AjaxFail("GetLastEvent", XMLHttpRequest, textStatus, errorThrown);
        },
        success: function (response) {
            if (callback instanceof Function) {
                callback(response);
            }
        }
        });
    }
    catch (ex) {
        logError("GetLastEvent", ex);
    }
}

function DisplayLastEvent(response) {
    try
    {
        if ((response.eventid) && (response.eventid > 0)) {
            var eventDate = new Date(response.et);
            var eventEndDate = new Date(response.eet);

            //renamed the function we call here to be UpdateGameEvent instead of UpdateGameEventFromLightStreamer - stephen 2-may-12
            UpdateGameEvent(response.f, response.e, response.u, response.h, response.a, response.d, eventDate, eventEndDate); //, newOddsCounter
        }
    }
    catch (ex) {
        logError("DisplayLastEvent", ex);
    }
}

// Added by Gamal 13/03/2012: A function to show a pop-up upon clicking on Power Play (Bonus Time) icon
function powerplaypopup() {
    try {

        
        if (inPowerPlay != 1) //ony do this is we are not already in a power play!!!!!!
        {
            if (thisFixture.remainingpowerplays <= 0) {
                //the user has clicked on the power play icon but has no power plays 
                //so....send the user to the store!!!!
                //Store.showstore();
                $('.storepopup').fadeIn('fast');
                //$('.tooltip-shade').show();
                Store.GetStoreItems("power");
            }
            else {
                //user HAS power plays  - so continue

                var CHECKSET;

                //Added this Stephen 22-Mar-12
                //This try/catch is for certain android devices 
                //if the value is not set on certain android devices it will through an error and not continue with the rest of the function
                try {
                    CHECKSET = JSON.parse(window.sessionStorage.getItem("dontShowPowerPlayPopup"));
                } catch (TempEx) { }

                var fixtureID = -1;
                var dontshow = -1;
                if (CHECKSET) {
                    var tempArray = CHECKSET.split("-");
                    fixtureID = parseInt(tempArray[0]);
                    if (fixtureID == GetCurrentfixtureID()) {
                        dontshow = parseInt(tempArray[1]);
                    }
                }
                if (dontshow == 1) {
                    // DO Nothing - Maybe Stop powerplay?!!
                }
                else {
                    var message = "<h4 class='PPStart'>Start Power Play now?</h4>" + "<br clear=\"all\"/><br clear=\"all\"/>";
                    message += "<h4>Your odds are going to double for the next 10 minutes! <br clear=\"all\"/><br clear=\"all\"/>";


                    if (thisFixture.remainingpowerplays == 1) {
                        message += "You currently have only 1 power play - but remember you can buy more in the store at any time!!</h4>";
                    }
                    else if (thisFixture.remainingpowerplays > 1) {
                        message += "You currently have " + thisFixture.remainingpowerplays + " power plays remaining!!</h4>";
                    }


                    //new animation effects - John

                    //$('.tooltip-shade').show();
                    $('#' + displaymode + '_powerplaypopup').animate({ top: '5%' }, 300);

                    //move it to top
                    $('#' + displaymode + '_powerplaypopup').attr("style", "display:block;z-index:900;");

                    $('#' + displaymode + '_powerplaypopup .text').html(message);
                    $('#' + displaymode + '_powerplayconfirmbutton').attr('onClick', 'startpowerplay()');

                }
            }
        }
    } catch (ex) {
        logError("powerplaypopup", ex);
    }
}


// Added by Gamal 13/03/2012: A function to start power play 
function startpowerplay() {
    try {

        if (thisFixture.currenthalf < 0) {
            closepowerplaypopup();
            //alert("You can only start a power play when the game is on!!!");
            if (displaymode == "w") {

                $('#' + displaymode + '_predictionpending').html("<strong>You can only start a power play when the game is on!!!</strong>!");
                $('#' + displaymode + '_predictionpending').show();
                $('.tooltip-shade').show();
                $('.betcountdown').show();
                $('.betcountdown').delay(2500).fadeOut('slow');
                $('.tooltip-shade').delay(2500).fadeOut('slow');
            }
            else if (displaymode == "m") {
                $('.popup-notify > h1').text("You can only start a power play when the game is on!");
                $('.popup-notify > span').text("");
                $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
            }
        }
        else 
        {
            //game IS in play - so start power play!!!
            var userid = -1;
            uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if (uiUser) {
                //only get the game details if we know who the user is - user can't play the game anonymously
                userid = uiUser.id;

                $.ajax({
                    url: WS_URL_ROOT + "/Game/StartPowerPlay",
                    type: "POST",
                    data: "fixtureID=" + GetCurrentfixtureID() + "&userid=" + userid + "&fu=" + uiUser.fbuserid,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("startpowerplay", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {

                        powerplayused = 1; // this logs the fact that the user has used the power play functionality!! (this info will be used to tell us if we need to remind the user about the power play!)

                        var powerplayresult = response.inPowerPlay;
                        if (powerplayresult == 0 || powerplayresult == 1) {
                            // User is already in power play or just started power play
                            //this will populate the pitch with new odds and also update our game tracker feed
                            inPowerPlay = 1; //probably don't need to set this as we set it from GameDetailsComplete
                            GameDetailsComplete(response);
                            _gaq.push(['_trackEvent', 'Clicks', 'PowerPlay']);

                            //Power Play flash
                            $('.popup-notify-powerplay > h1').text("Power Play Started!");
                            $('.popup-notify-powerplay').fadeIn(200).delay(3000).fadeOut(200);
                        }

                    }
                });
            }
            closepowerplaypopup();
            //window.sessionStorage.setItem("dontShowPowerPlayPopup", $.toJSON(GetCurrentfixtureID() + "-" + "1"));

            //if mobile version fade out powerplay link - John
            $('#powerplayclickbtn2 span').html(thisFixture.remainingpowerplays);
            //if ((displaymode == "m") && (thisFixture.remainingpowerplays == 0)) {
            //    $('#phonepowerplaybadge').attr("style", "opacity:0.6;");
            //}

            //        var gamefeedmsg = "Power Play Started!" + "<br />";
            //        $('.GameFeedInfo').prepend(gamefeedmsg);
            //        refreshScroller(GameFeedScroller, "GameFeedInfo");
        } //end if to check if game is in play!!!!
    } catch (ex) {
        logError("startpowerplay", ex);
    }
}

function powerplaypopupTest() {
    $('#m_powerplaytimertest').countdown({ until: 20, compact: true, format: 'MS' });
}

// Added by Gamal 15/03/2012: A function to display power play timer if user have remaining power play
// Altered by Gamal 22/03/2012: Change Power Play text to Power Play Activated
function showPowerPlayTimer() {
    try {

        if ($('#' + displaymode + '_powerplaytimertext').is(":visible") == true) {
            logError("ppDebug", "_powerplaytimertext IS visible - " + $('#' + displaymode + '_powerplaytimertext').is(":visible"));
        }
        else {
            logError("ppDebug", "_powerplaytimertext is NOT visible - " + $('#' + displaymode + '_powerplaytimertext').is(":visible"));
        }

        logError("ppDebug", "about to start pp!!!");
        logError("ppDebug", "html is " + $('#' + displaymode + '_powerplaytimertext').html() + " remainingPowerPlaySecs is " + LiveHelper.GetPowerPlayTimeRemaining());
       
        $('#' + displaymode + '_powerplaytimertext').countdown({ until: LiveHelper.GetPowerPlayTimeRemaining(), compact: true, onExpiry: RemovePowerPlayTimer, format: 'MS' });
        logError("ppDebug", "PP1!");
        //Added by Gamal: 26/03/2012: Hide Menu when a notification arrives
        try {
            slider(0);
        } catch (tempEX) { }
        //Added by Gamal 22/03/2012
        logError("ppDebug", "PP2!");
        var message = '<span>' + thisFixture.remainingpowerplays + '</span>' + 'Activated!';
        $('#' + displaymode + '_powerplayclickbtn').html(message);
        $('#powerplayclickbtn2 span').html(thisFixture.remainingpowerplays);
        logError("ppDebug", "PP3!");
        //if ((displaymode == "m") && (thisFixture.remainingpowerplays == 0)) {
        //    $('#phonepowerplaybadge').attr("style", "opacity:0.6;");
        //}
      //  $('#powerplaytimer').show();
    } catch (ex) {
        logError("ShowPowerPlayTimer", ex);
    }

}

// Added by Gamal 15/03/2012: A function to remove power play timer when time is up
// If -1 is passed then get game details is not called
function RemovePowerPlayTimer(callGetGameDetails) {
    try {

        inPowerPlay = 0; //no longer in powerplay

        if ($('.pitch').is(":visible")) //only do this if the game is on - i.e if the timer runs during half-time then we do not want to do continue with this function
        {
           
            var message;

//            if (thisFixture.remainingpowerplays == 0) {
//                message = '<span id="' + displaymode + '_NumPowerPlays">0</span>' + 'Finished!';
//                $('.powerplayclick').addClass("off");
//            }
//            else
//            {
                message = '<span>' + thisFixture.remainingpowerplays + '</span>Power Play';
                if (thisFixture.remainingpowerplays != 1) {
                    message += "s";
                }
                $('#' + displaymode + '_powerplayclickbtn').html(message);
                $('#powerplayclickbtn2 span').html(thisFixture.remainingpowerplays);
            //}

            $('#' + displaymode + '_powerplayclickbtn').html(message);
            $('#' + displaymode + '_powerplaytimertext').countdown('destroy');
            $('#' + displaymode + '_powerplaytimertext').html("10.00");
            //$('#' + displaymode + '_powerplaytimertext').hide();
            //$('#' + displaymode + '_powerplaytimertext').countdown({ until: 0, compact: true, format: 'MS' });
            
            
            //if mobile version fade out powerplay link - John
            //if ((displaymode == "m") && (thisFixture.remainingpowerplays == 0)) {
            //    $('#phonepowerplaybadge').attr("style", "opacity:0.6;");
            //}
            var userid = -1;

            uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if (uiUser) {
                //only get the game details if we know who the user is - user can't play the game anonymously
                userid = uiUser.id;
                if (callGetGameDetails != -1) {

                    //Added by Gamal: 26/03/2012: Hide Menu when a notification arrives
                    try {
                        slider(0);
                    } catch (tempEX) { }
                    $('.popup-notify-powerplay > h1').text("Power Play Ended!");
                    $('.popup-notify-powerplay').fadeIn(200).delay(3000).fadeOut(200);
                    
                    //if mobile version fade out powerplay link - John
                    if ((displaymode == "m") && (thisFixture.remainingpowerplays > 0)) {
                        $('#phonepowerplaybadge').attr("style", "opacity:1;");
                    }

                    $.ajax({
                        url: WS_URL_ROOT + "/Game/GetGameDetails",
                        type: "POST",
                        data: "f=" + GetCurrentfixtureID() + "&u=" + userid + "&fu=" + uiUser.fbuserid,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("GetGameDetails", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            GameDetailsComplete(response);
                        }
                    });
                }
            }
        }
        else 
        {
            //pitch hidden - therefore this is half-time (or end of game) -so... kill the countdown object - it will be reset when the 2nd half starts
            $('#' + displaymode + '_powerplaytimertext').countdown('destroy');
        }
    } catch (ex) {
        logError("RemovePowerPlayTimer", ex);
    }
}





function DisplayGameTracker(eventlist) {
    var eventArray = new Array();
    var inviteHTML = "";
    window.sessionStorage.setItem("listOfDisplayedEvents", eventArray);  //clear local storage - when this function runs it overwrite everything in the gamefeed Details

    var GameFeedHTML = "";
    for (var i = 0; i < eventlist.length; i++) {
        try {

            //before we continue we want to check if the minute of the event is contained in the description
            //i.e 45' - if it is it will be like so "^1481'~"
            //we want to replace the ^ character with <span class='min'> and the ~ charcter with </span> - this is as we want to reduce the data we send via http!!!

            try {
                eventlist[i].d = eventlist[i].d.replace("^", "<span class='min'>");
                eventlist[i].d = eventlist[i].d.replace("~", "</span>");
            } catch (ex) { }

            if (eventlist[i].d.toLowerCase().indexOf("ref says") > 0) {
                //output event HTml as normal - the ref span comes from a DB!!
                GameFeedHTML = GameFeedHTML + eventlist[i].d + "<br />";
            }
            else if ((eventlist[i].d.toLowerCase().indexOf("win") > 0) || (eventlist[i].d.toLowerCase().indexOf("won") > 0)) {
                //This event is a winning bet by the user - we may want to use different HTML here!!
                GameFeedHTML = GameFeedHTML + "<b class='wintext'>" + eventlist[i].d + "</b><br />";
            }
            else if ((eventlist[i].d.toLowerCase().indexOf("lose") > 0) || (eventlist[i].d.toLowerCase().indexOf("lost") > 0) || (eventlist[i].d.toLowerCase().indexOf("too late") > 0)) {
                //This event is a losing bet by the user - we may want to use different HTML here!!
                GameFeedHTML = GameFeedHTML + "<b class='losetext'>" + eventlist[i].d + "</b><br />";
            }
                //else if ((eventlist[i].d.toLowerCase().indexOf("bet") > 0)) {
            else if ((eventlist[i].d.toLowerCase().indexOf("made") > 0)) {
                //This event is for a bet placed by the user - we may want to use different HTML here!!
                GameFeedHTML = GameFeedHTML + "<b class='bettext'>" + eventlist[i].d + "</b><br />";
            }
            else if ((eventlist[i].d.toLowerCase().indexOf("invite") > 0)) {
                //This event is for an invite to a league - so we need to display this html in the MyleagueInvites div too!!

                //what we are doing here is we are returning ALL invites but we are only showing the invites that have class="accept_0" 
                //this means we only show invites that have not been accepted yet HOWeVER we add each evnet Id to the eventArray below
                //so that we don't show an invite even after you've eventlistd to it ( this can happen with light streamer - if you reload the page shortly after the light streamer message we receive the message again and we don't want to show the message if not needed!)

                if (eventlist[i].d.toLowerCase().indexOf("accept_0") > 0) {
                    //only display if we have not accepted yet!!
                    inviteHTML = inviteHTML + eventlist[i].d;
                    //$('#MyleagueInvites').prepend(eventlist[i].d);
                }

                //no longer put in GameFeed!!!!
                //GameFeedHTML = GameFeedHTML + eventlist[i].d;
            }
            else {
                //standard feed output html
                try {
                    //if (eventlist[i].d.indexOf("Throw-In") > 0)  
                    if ((eventlist[i].e == 19) || (eventlist[i].e == 20)) {
                        GameFeedHTML = GameFeedHTML + AddPredictionsToEvents(null, eventlist[i].d, eventlist[i].e, eventlist[i].c) + "<br />";
                    }
                    else {
                        //output event HTml as normal
                        GameFeedHTML = GameFeedHTML + eventlist[i].d + "<br />";
                    }
                }
                catch (ex) { GameFeedHTML = GameFeedHTML + eventlist[i].d + "<br />"; }
            }
            eventArray.push(eventlist[i].u); //add each eventupdateid to array
        }
        catch (err2) { }
    }
    window.sessionStorage.setItem("listOfDisplayedEvents", $.toJSON(eventArray)); //now set the local storage list of Displayed Events
    $('.GameFeedInfo').html(GameFeedHTML); //changed this as when we run this function we want to completely overwrite the gamefeed
    refreshScroller(GameFeedScroller, "GameFeedInfo");

    if (GetRequestParam("f")) {
        $('#' + displaymode + '_MyleagueInvites').html(inviteHTML);
        refreshScroller(leaderboardScroller, "MyleagueInvites");
    }

} //end displaygametracker

//Stephen 23-MAR-12
//this function replaces the function DisplayHigherCreditsAvailabilityToUser 
function DisplayHigherCreditsAvailabilityToUserV2(CreditsLevel, numbetsplaced, numbetstounlockhigherlevel, updateTicker) {
    try {
        if (CreditsLevel > 100) {
            //fade out the locked message - john
            $('.unlockcreditsDiv_locked').fadeOut('slow');
            //the user has gained the ability to bet greater than 100 credits - so display this to the user
            //added animation
            //get the screenwidth and if less than 799 it's a mobile, so animate to different position
            var screenwidth = $(window).width();
            if (screenwidth >= 799) {
                $('.unlockcreditsDiv').fadeIn('slow').animate({ top: '150px' }, 1000);
            } else {
                
                //no longer do this - due to ticker!!!!
                //$('.unlockcreditsDiv').fadeIn('slow').animate({ top: '0px' }, 1000);
                
                //show badges in Powerups screen
                $('#lockedcreditsbadge').fadeOut('slow'); 
                $('#lockedcreditsbadge').fadeOut('slow', function () {
                    $('#unlockedcreditsbadge').fadeIn('slow');
                });
            }

            //only set this if the user is on web
            //for mobile this info will be on the ticker!!!
            if (displaymode == "w") {
                $('#' + displaymode + '_unlockcreditsSpan').html("You unlocked the <strong>" + CreditsLevel + "</strong> Credit Limit!");
            }

            if (updateTicker) {
                //update the ticker with details of the number of bets left
                SetTickerContent("creditLimit_ticker", GetCreditLimitTickerText(0));
            }
            
            if (CreditsLevel == 200) {
                $('#' + displaymode + '_BonusCredits200').show();
                $('#' + displaymode + '_StoreBonusCredits200').show();
            }
        }
        else 
        {
            //user has NOT unlocked the 20 credits level
            //display to the user how many more bets he needs to place to unlock the higher credits level
            if (numbetsplaced == 0) {
                //user has not placed any bets
                $('#' + displaymode + '_UnlockNumBetsSpan').html("<strong>" + numbetstounlockhigherlevel + "</strong> predictions");
            }
            else 
            {
                //the user HAS placed some bets ...so calculate how many more bets they need to place to unlock the new level
                var BetsNeeded = numbetstounlockhigherlevel - numbetsplaced;
                if (BetsNeeded == 1) 
                {
                    $('#' + displaymode + '_UnlockNumBetsSpan').html("<strong>1</strong> more prediction!!");
                }
                else 
                {
                    $('#' + displaymode + '_UnlockNumBetsSpan').html("<strong>" + BetsNeeded + "</strong> more predictions");
                }

                //animated ghostly effect for number of bets left before unlocking new level - John
                if (betJustComplete == 1)  //only show this flash animation if a bet has just been placed
                {
                    //only do Pop-up of bet number if a bet has been placed
                    betJustComplete = 0; //reset this variable 
                    $('.betnum').html(BetsNeeded);
                    $('.betnum').show();
                    $('.betnum').animate({ position: 'absolute', top: '100px', right: '40px', fontSize: '45px', opacity: '0.0' }, 2000, function () {
                        $('.betnum').hide();
                        $('.betnum').css({ top: "", fontSize: "", opacity: "" });
                    });
                    BetNumberJustDisplayed = BetsNeeded;
                }

                if (updateTicker) {
                    //update the ticker with details of the number of bets left
                    SetTickerContent("creditLimit_ticker", GetCreditLimitTickerText(BetsNeeded));
                }
            }
            $('.unlockcreditsDiv_locked').show();
        }
    }
    catch (ex) {
        logError("DisplayHigherCreditsAvailabilityToUserV2", ex);
    }
}

function DisplayHigherCreditsAvailabilityToUser(CreditsLevel) 
{
   try
   {
       if (CreditsLevel > 100) 
       {
           //fade out the locked message - john
           $('.unlockcreditsDiv_locked').fadeOut('slow'); 

           //the user has gained the ability to bet greater than 100 credits - so display this to the user
           //added animation
           //get the screenwidth and if less than 799 it's a mobile, so animate to different position
           var screenwidth = $(window).width();
           if (screenwidth >= 799) {
               $('.unlockcreditsDiv').fadeIn('slow').animate({ top: '150px' }, 1000);
           } else {
               $('.unlockcreditsDiv').fadeIn('slow').animate({ top: '0px' }, 1000);
               //show badges in Powerups screen
               $('#lockedcreditsbadge').fadeOut('slow', function() {
                    $('#unlockedcreditsbadge').fadeIn('slow');
               });
           }

           $('#' + displaymode + '_unlockcreditsSpan').html("You unlocked the <strong>" + CreditsLevel + "</strong> Credit Limit!");
           if (CreditsLevel == 200) 
           {
               $('#' + displaymode + '_BonusCredits200').show();
               $('#' + displaymode + '_StoreBonusCredits200').show();
           }
       }
   }
   catch (ex) {
       logError("DisplayHigherCreditsAvailabilityToUser", ex);
   }
}

//this function adds the users predictions to events -.. i.e adds the number of predicted throws when a throw event comes in
function AddPredictionsToEvents(fixtureDetails, EventDescription,eventid, HalfTheEventHappenedIn) 
{
    try 
    {
        if (eventid == 19) //free
        {
                if (HalfTheEventHappenedIn == 1) 
                {
                    //first Half
                    if (fixtureDetails) {
                        fixtureDetails.numfreesfirsthalf = fixtureDetails.numfreesfirsthalf + 1;
                    }
                    var checkpredictedFirstHalfFrees = localStorage.getItem("predictedFirstHalfFrees");
                    if (checkpredictedFirstHalfFrees) {
                        var tempArray = checkpredictedFirstHalfFrees.split("_");
                        var tempFixture = tempArray[0];
                        var requestFixtureID = GetRequestParam("f");
                        if (requestFixtureID == tempFixture) {
                            //we HAVE stored the users predicted number of free's for this fixture!!!
                            var predictedFirstHalfFrees = tempArray[1];
                            EventDescription = EventDescription + " - You predicted between " + predictedFirstHalfFrees.replace("-", " and ");
                        }
                    }
                }
                else if (HalfTheEventHappenedIn = 2)
                {
                    //2nd Half
                    if (fixtureDetails) {
                        fixtureDetails.numfreessecondhalf = fixtureDetails.numfreessecondhalf + 1;
                    }
                    var checkpredicted2ndHalfFrees = localStorage.getItem("predicted2ndHalfFrees");
                    if (checkpredicted2ndHalfFrees) {
                        var tempArray = checkpredicted2ndHalfFrees.split("_");
                        var tempFixture = tempArray[0];
                        var requestFixtureID = GetRequestParam("f");
                        if (requestFixtureID == tempFixture) {
                            //we HAVE stored the users predicted number of free's for this fixture!!!
                            var predicted2ndHalfFrees = tempArray[1];
                            EventDescription = EventDescription + " - You predicted between " + predicted2ndHalfFrees.replace("-", " and ");
                        }
                    }
                }
        }
        else if (eventid == 20) //throws
        {
            if (HalfTheEventHappenedIn == 1) 
            {
                //first Half
                if (fixtureDetails) {
                    fixtureDetails.numthrowsfirsthalf = fixtureDetails.numthrowsfirsthalf + 1;
                }
                var checkpredictedFirstHalfThrows = localStorage.getItem("predictedFirstHalfThrows");
                if (checkpredictedFirstHalfThrows) {
                    var tempArray = checkpredictedFirstHalfThrows.split("_");
                    var tempFixture = tempArray[0];
                    var requestFixtureID = GetRequestParam("f");
                    if (requestFixtureID == tempFixture) {
                        //we HAVE stored the users predicted number of free's for this fixture!!!
                        var predictedFirstHalfThrows = tempArray[1];
                        EventDescription = EventDescription + " - You predicted between " + predictedFirstHalfThrows.replace("-", " and ");
                    }
                }
            }
            else if (HalfTheEventHappenedIn = 2) {
                //2nd Half
                if (fixtureDetails) {
                    fixtureDetails.numthrowssecondhalf = fixtureDetails.numthrowssecondhalf + 1;
                }
                var checkpredicted2ndHalfThrows = localStorage.getItem("predicted2ndHalfThrows");
                if (checkpredicted2ndHalfThrows) {
                    var tempArray = checkpredicted2ndHalfThrows.split("_");
                    var tempFixture = tempArray[0];
                    var requestFixtureID = GetRequestParam("f");
                    if (requestFixtureID == tempFixture) {
                        //we HAVE stored the users predicted number of free's for this fixture!!!
                        var predicted2ndHalfThrows = tempArray[1];
                        EventDescription = EventDescription + " - You predicted between " + predicted2ndHalfThrows.replace("-", " and ");
                    }
                }
            }
        }
    }
    catch (e) {
        logError("AddPredictionsToEvents", ex);
    }
    return EventDescription;
}


function DisplayHalfTime(hometeam, awayteam, homescore, awayscore, fixtureid) 
{
    HideNonPitchDisplays(); //hie everything anyway - occasionally we have scenarios where we display both the half-time and full-time displays

    $('.halftime').show();
    $('.match_desc').html("<span class='home_team_desc'>" + hometeam + "</span><span class='score_desc'>" + homescore + " - " + awayscore + "</span><span class='away_team_desc'>" + awayteam + "</span>");
    //$(".game-desc-image").attr({ src: "https://d2q72sm6lqeuqa.cloudfront.net/images/game-intro-fix" + fixtureid + ".png", alt: hometeam + " V " + awayteam });
    //if there's no image for this fixture show default
    //$('.game-desc-image').error(function () {
    $(".game-desc-image").attr({ src: "https://d2q72sm6lqeuqa.cloudfront.net/images/game-intro.png", alt: hometeam + " V " + awayteam });
    //});

    HidePitch();

    if ((admin) && (admin.isAdmin()))
    {
        admin.halfTimeSetup();
    }
}

function DisplayFullTime(hometeam, awayteam, homescore, awayscore, fixtureid) 
{
    gameOver = 1; //record when the game has ended - so we don't do any more reloads!
    HideNonPitchDisplays(); //hie everything anyway - occasionally we have scenarios where we diaply both the half-time and full-time displays

    $('.fulltime').show();
    $('.match_desc').html("<span class='home_team_desc'>" + hometeam + "</span><span class='score_desc'>" + homescore + " - " + awayscore + "</span><span class='away_team_desc'>" + awayteam + "</span>");
    //$(".game-desc-image").attr({ src: "/Images/game-intro-fix" + fixtureid + ".png", alt: hometeam + " V " + awayteam });
    //if there's no image for this fixture show default
    //$('.game-desc-image').error(function () {
    $(".game-desc-image").attr({ src: "https://d2q72sm6lqeuqa.cloudfront.net/images/game-intro.png", alt: hometeam + " V " + awayteam });
    //});

    HidePitch();

    if ((admin) && (admin.isAdmin())) 
    {
        admin.fullTimeSetup();
    }
}

function populatePitchOdds(response) 
{
    if (response.eventodds) 
    {
        for (var i = 0; i < response.eventodds.length; i++) 
        {
            //Populate the appropriate DIV with the correct odds
            $('#' + displaymode + '_bubble' + response.eventodds[i].e).html(response.eventodds[i].o + "/1");
            if ((Currentbet) && (Currentbet.eventid == response.eventodds[i].e)) {
                if (Currentbet.odds != response.eventodds[i].o) {
                    //the bet we made for this event does NOT have the same odds as the current odds for this event
                    //this could be as we left site after making bet and the odds updated while we were away
                    //so store the current odds in bet object
                    //we can use this new value when we reset the odds display after the bet has been complete
                    Currentbet.newodds = response.eventodds[i].o;
                    window.sessionStorage.setItem("Currentbet", $.toJSON(Currentbet)); // Altered by Gamal 16/03/2012: added $.toJSON
                }
            }
        }
    }
}

function populatePitch(response) {
    try
    {
            var pitchHTMl = "";
            //first ... sort out which direction the teams are playing
  
            var LeftCornerEventId;
            var LeftGoalEventId;
            var LeftWideEventId;
            var RightCornerEventId;
            var RightGoalEventId;
            var RighttWideEventId;
            var FreeEventId = 19; //generic event - doesn't change based on the half 
            var ThrowEventId = 20; //generic event - doesn't change based on the half 
            var RightColor;
            var LeftColor;
            var RightPenoEventId;
            var LeftPenoEventId;

            //if (response.currenthalf == 1) {
            if ((response.currenthalf == 1) || (response.currenthalf == -101)) { //changed this stephen - 14-9-12 - -101 means the game hasn't started yet - so we treat this as first half ( this is so we can preview the pitch in the position of the first half before the game starts!!!!)

                //this is the first half
                if (response.firsthalfleftteam == response.hometeam) {
                    //the home team are playing from left to right this half(which is the first half)
                    teamPlayingFromLeftToRight = response.hometeam;
                    teamPlayingFromRightToLeft = response.awayteam;

                    RightColor = response.hometeamcolour;
                    LeftColor = response.awayteamcolour;
                }
                else {
                    //the home team are playing from right to left this half(which is the first half)
                    teamPlayingFromLeftToRight = response.awayteam;
                    teamPlayingFromRightToLeft = response.hometeam;

                    LeftColor = response.hometeamcolour;
                    RightColor = response.awayteamcolour;
            
                }
            }
            else {
                //this is the 2nd half
                if (response.firsthalfleftteam == response.hometeam) {
                    //the home team are playing from right to left this half(which is the 2nd half)
                    teamPlayingFromLeftToRight = response.awayteam;
                    teamPlayingFromRightToLeft = response.hometeam;

                    LeftColor = response.hometeamcolour;
                    RightColor = response.awayteamcolour;
           
                }
                else {
                    //the home team are playing from left to right this half(which is the 2nd half)
                    teamPlayingFromLeftToRight = response.hometeam;
                    teamPlayingFromRightToLeft = response.awayteam;

                    RightColor = response.hometeamcolour;
                    LeftColor = response.awayteamcolour;
            
                }
            }

            //$('#home_team').html(teamPlayingFromLeftToRight);
            //$('#away_team').html(teamPlayingFromRightToLeft);     
            //no longer switch sides of team names at half-time - 19-Jan-11       
            $('#' + displaymode + '_home_team').html(response.hometeam);
            $('#' + displaymode + '_away_team').html(response.awayteam);        

            //the below needs to be done in the DB - as it is not secure if done here in javascript!!???
            if (teamPlayingFromLeftToRight == response.hometeam) {
                //set the EventId's to use here based on the home team playing from left to right
                LeftCornerEventId = 1; //i.e an away goal
                LeftGoalEventId = 4; //i.e an away goal
                LeftWideEventId = 5; //i.e an away wide
                RightCornerEventId = 3; //i.e a home corner
                RightGoalEventId = 6; //i.e a home team goal
                RighttWideEventId = 7; //i.e a home team wide
                RightSaveEventID = 17; //i.e a home team save
                LeftSaveEventID = 18; //i.e an away team save

                RightPenoEventId = 15; //i.e a home team peno
                LeftPenoEventId = 16; //i.e a left team peno

                //$('#home_score').html(response.homescore);  //no longer switch sides of team names at half-time - 19-Jan-11
                //$('#away_score').html(response.awayscore);
            }
            else {
                LeftCornerEventId = 3; //i.e a home corner
                LeftGoalEventId = 6; //i.e a home team goal
                LeftWideEventId = 7; //i.e a home team wide
                RightCornerEventId = 1; //i.e an away goal
                RightGoalEventId = 4; //i.e an away goal
                RighttWideEventId = 5; //i.e an away wide
                LeftSaveEventID = 17; //i.e a home team save
                RightSaveEventID = 18; //i.e an away team save

                LeftPenoEventId = 15; //i.e a left team peno
                RightPenoEventId = 16; //i.e a home team peno

                //$('#home_score').html(response.awayscore);  //no longer switch sides of team names at half-time - 19-Jan-11
                //$('#away_score').html(response.homescore);
            }

            //no longer switch sides of team names at half-time - 19-Jan-11
            $('#' + displaymode + '_home_score').html(response.homescore);
            $('#' + displaymode + '_away_score').html(response.awayscore);

            pitchHTMl = pitchHTMl + "<div class=\"home-corner icon-corner-" + LeftColor + "\" onClick=\"betpupup(\'CORNER FOR " + teamPlayingFromRightToLeft  +
             "\', " + LeftCornerEventId + ");\"></div><div id=\"" + displaymode + "_bubble" + LeftCornerEventId + "\" class=\"bubble-home-corner bubble\"></div>";

            pitchHTMl = pitchHTMl + "<div class=\"home-goal icon-goal-" + LeftColor + "\" onClick=\"betpupup(\'GOAL FOR " + teamPlayingFromRightToLeft  +
             "\', " + LeftGoalEventId + ");\"></div><div id=\"" + displaymode + "_bubble" + LeftGoalEventId + "\" class=\"bubble-home-goal bubble\"></div>";

            pitchHTMl = pitchHTMl + "<div class=\"home-wide icon-wide-" + LeftColor + "\"  onClick=\"betpupup(\'WIDE BY " + teamPlayingFromRightToLeft  +
             "\', " + LeftWideEventId + ");\"></div><div id=\"" + displaymode + "_bubble" + LeftWideEventId + "\" class=\"bubble-home-wide bubble\"></div>";

            pitchHTMl = pitchHTMl + "<div class=\"away-save icon-save-" + RightColor + "\"  onClick=\"betpupup(\'SAVE BY " + teamPlayingFromLeftToRight +
             "\', " + RightSaveEventID + ");\"></div><div id=\"" + displaymode + "_bubble" + RightSaveEventID + "\" class=\"bubble-away-save bubble\"></div>";

             //peno
            if ((admin) && (admin.isAdmin())) {
                pitchHTMl = pitchHTMl + "<div class=\"home-peno icon-goal-" + LeftColor + "\"  onClick=\"betpupup(\'Peno For " + teamPlayingFromRightToLeft +
                 "\', " + LeftPenoEventId + ");\"></div><div id=\"" + displaymode + "_bubble" + LeftPenoEventId + "\" class=\"bubble-home-peno bubble\"></div>";
            }

            //free kick
            pitchHTMl = pitchHTMl + "<div class=\"gen-free icon-free-gen\" onClick=\"betpupup(\'FREE-KICK\', " + FreeEventId + ");\"></div><div id=\"" + displaymode + "_bubble" + FreeEventId + "\" class=\"bubble-free bubble\"></div>";

            //throw kick
            pitchHTMl = pitchHTMl + "<div class=\"gen-throw icon-throw-gen\" onClick=\"betpupup(\'THROWIN\', " + ThrowEventId + ");\"></div><div id=\"" + displaymode + "_bubble" + ThrowEventId + "\" class=\"bubble-throw bubble\"></div>";

            //peno
            if ((admin) && (admin.isAdmin())) {
                pitchHTMl = pitchHTMl + "<div class=\"away-peno icon-goal-" + RightColor + "\"  onClick=\"betpupup(\'Peno For " + teamPlayingFromLeftToRight +
                 "\', " + RightPenoEventId + ");\"></div><div id=\"" + displaymode + "_bubble" + RightPenoEventId + "\" class=\"bubble-away-peno bubble\"></div>";
            }


            pitchHTMl = pitchHTMl + "<div class=\"home-save icon-save-" + LeftColor + "\"  onClick=\"betpupup(\'SAVE BY " + teamPlayingFromRightToLeft +
             "\', " + LeftSaveEventID + ");\"></div><div id=\"" + displaymode + "_bubble" + LeftSaveEventID + "\" class=\"bubble-home-save bubble\"></div>";

            pitchHTMl = pitchHTMl + "<div class=\"away-corner icon-corner-" + RightColor + "\" onClick=\"betpupup(\'CORNER FOR " + teamPlayingFromLeftToRight  +
             "\', " + RightCornerEventId + ");\"></div><div id=\"" + displaymode + "_bubble" + RightCornerEventId + "\" class=\"bubble-away-corner bubble\"></div>";

            pitchHTMl = pitchHTMl + "<div class=\"away-goal icon-goal-" + RightColor + "\" onClick=\"betpupup(\'GOAL FOR " + teamPlayingFromLeftToRight  +
             "\', " + RightGoalEventId + ");\"></div><div id=\"" + displaymode + "_bubble" + RightGoalEventId + "\" class=\"bubble-away-goal bubble\"></div>";

            pitchHTMl = pitchHTMl + "<div class=\"away-wide icon-wide-" + RightColor + "\" onClick=\"betpupup(\'WIDE BY " + teamPlayingFromLeftToRight  +
             "\', " + RighttWideEventId + ");\"></div><div id=\"" + displaymode + "_bubble" + RighttWideEventId + "\" class=\"bubble-away-wide bubble\"></div>";

            //pitchHTMl = pitchHTMl + "<div class=\"gen-free icon-free-gen\" onClick=\"betpupup(\'FREEKICK " + RighttWideEventId +
            // "\', " + RighttWideEventId + ");\"></div><div id=\"bubble" + RighttWideEventId + "\" class=\"bubble-free bubble\"></div>";

            //pitchHTMl = pitchHTMl + "<div class=\"gen-throw icon-throw-gen\" onClick=\"betpupup(\'THROWIN " + RighttWideEventId +
            // "\', " + RighttWideEventId + ");\"></div><div id=\"bubble" + RighttWideEventId + "\" class=\"bubble-throw bubble\"></div>";

            HideNonPitchDisplays();

            $('.' + displaymode + '_pitch-icons').html(pitchHTMl);
            ShowPitch();
            $('.gameinfo').show();
    }
    catch (ex) {
       logError("populatePitch", ex);
    } 
}

//this function sets the fixture details like direction,voidoffset etc
function updateFixtureDetails(GameDetailsString) {
    var GameDetails = GameDetailsString.split("^");
    thisFixture.hometeamcolour = GameDetails[0];
    thisFixture.awayteamcolour = GameDetails[1];
    thisFixture.firsthalfleftteam = GameDetails[2];
    thisFixture.voidOffset = parseInt(GameDetails[3]);
    voidOffset = thisFixture.voidOffset;
    populatePitch(thisFixture);
    populatePitchOdds(thisFixture);

    var Currentbet;
    try {
        Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
    } catch (TempEx) { }

    //if we have an active bet then display the icon
    if ((Currentbet != null) && (Currentbet.status == 0))
    {
        //we have a current bet 
        //these 3 lines set the marker over the event button to indicate you have a bet here!!
        $('#' + displaymode + '_bubble' + Currentbet.eventid).removeClass("bubble");
        $('#' + displaymode + '_bubble' + Currentbet.eventid).addClass("bubble_active");
        $('#' + displaymode + '_bubble' + Currentbet.eventid).html("" + Currentbet.amount + "");
    }
}

//this function does logic for starting match- half time-full time etc
function MatchStartEvents(eventid, HomeScore, AwayScore, EventDescription, MatchStartExtraDetails) {
    try
    {
           if (eventid == 11) 
           {
               //Game has started - so load all details
                //logError("LSBind", "Starting Match!!!!!!!", "", "");
                playsound("gamestart");
                $('.helpclick').show();

                //We HAVE to call this here cos when the user loaded the page the tams may have been in the wrong direction
                //i.e - very often the admin only sets the positions the teams play in seconds before the game starts!!!!!!!
                if ((admin) && (admin.isAdmin())) {

                    //removed this stephen - no need??? - 19-Aug-13
                    //GetGameDetails(GetCurrentfixtureID(), GameDetailsComplete); 

                    //just test this!
                    thisFixture.currenthalf = 1;
                    updateFixtureDetails(MatchStartExtraDetails);
                    admin.firstHalfSetup();
                }
                else {
                    //updated this - Stephen 5-Nov
                    //no longer call this upon match start (as we dont want to do a mini denial of service db attack!!!)
                    //- instead we will call populatepitch!!!
                    thisFixture.currenthalf = 1;
                    updateFixtureDetails(MatchStartExtraDetails);
                    UpdatePreGameTickerTickerText();
                }

                if (displaymode == "m") {
                    //if on mobile - force the pitch to be displayed when the game starts!!!!
                    var panelid = 1;
                    $('.panel').hide();
                    $('.coda-nav a').removeAttr("class");
                    $('#panel' + panelid).fadeIn('fast');
                    $('.tab' + panelid + ' a').attr("class", "current");
                }

                //HideNonPitchDisplays();
                //ShowPitch();

                return false; //don't update bets
            }
            else if (eventid == 12) {
                //half time

                try
                {
                    //first check if we are in a power play!!
                    if ($('#' + displaymode + '_powerplaytimertext').is(":visible") == true) {

                        var powerplayTimeLeft = $('#' + displaymode + '_powerplaytimertext').countdown('getTimes');
                        var minsleft = powerplayTimeLeft[5];
                        var secsleft = powerplayTimeLeft[6];

                        if ((minsleft > 0) || (secsleft > 0)) {
                            var totalsecondsleft = (minsleft * 60) + secsleft;
                            LiveHelper.SavePowerPlayTimeRemaining(totalsecondsleft);

                            //$('#' + displaymode + '_powerplayclickbtn').html("");
                            $('#' + displaymode + '_powerplaytimertext').countdown('destroy');
                        }
                    }
                } catch (ex2) { }


                thisFixture.currenthalf = -102;
                $('.GameFeedInfo').prepend("<b>Half Time</b> <br />");
                refreshScroller(GameFeedScroller,"GameFeedInfo");

                DisplayHalfTime(thisFixture.hometeam, thisFixture.awayteam, HomeScore, AwayScore, thisFixture.fixtureid);

                //now check if user has an active bet - if they do - then void it!!
                var Currentbet;
                try {
                    Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
                } catch (TempEx) { }

                if ((Currentbet) && (Currentbet.status == 0)) 
                {
                        $('.forfeitclick').hide(); //bet is voided voided due to half-time ..so hide the forfeit button
                        $('.GameFeedInfo').prepend("<span class='losetext'>BET VOID [Half-Time] - CREDITS RETURNED</span><br />");
                        refreshScroller(GameFeedScroller, "GameFeedInfo");

                        var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                        uiUser.credits = uiUser.credits + Currentbet.amount; //give user back the amount they bet
                        window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                        $('.credits').html(uiUser.credits);

                        Currentbet.status = -102;
                        //playsound("void");

                        UpdateFriendScoresWithBetResult(Currentbet);
                        ReOrderFriendsScoresBasedOnCurrentScore();

                        window.sessionStorage.setItem("Currentbet", $.toJSON(Currentbet));  //reset CurrentBet in sessionStorage
                }
                else {
                    playsound("halftime"); //only play this sound if we aren't playing the void sound
                }

                //also void all friends active bets here
                updateFriendsBetStatus(eventid, null);

                return false; //don't update bets
            }
            else if (eventid == 13) {
                playsound("secondhalf");
                //Game has started again (for the 2nd half) - so need to switch direction teams playing !!!!!!!

                try {
                    //first check if we are in a power play!!
                    if (LiveHelper.GetPowerPlayTimeRemaining() > 0) {
                        showPowerPlayTimer();
                    }
                } catch (ex2) { }

                $('.GameFeedInfo').prepend("<b>And we're off again!!</b> <br />");
                refreshScroller(GameFeedScroller, "GameFeedInfo");

                //GetGameDetails(GetCurrentfixtureID(), GameDetailsComplete); //get game details - BUT - we are only interested in the pitch details- we don't want to reload game feed info again
                if ((admin) && (admin.isAdmin())) {
                    GetGameDetails(GetCurrentfixtureID(), GameDetailsComplete); 
                }
                else {
                    //updated this - Stephen 5-Nov
                    //no longer call this upon match start (as we dont want to do a mini denial of service db attack!!!)
                    //- instead we will call populatepitch!!!
                    thisFixture.currenthalf = 2;
                    populatePitch(thisFixture);
                    populatePitchOdds(thisFixture);
                }

                if (displaymode == "m") {
                    //if on mobile - force the pitch to be displayed when the second half starts!!!!
                    var panelid = 1;
                    $('.panel').hide();
                    $('.coda-nav a').removeAttr("class");
                    $('#panel' + panelid).fadeIn('fast');
                    $('.tab' + panelid + ' a').attr("class", "current");
                }

                $('.helpclick').show();
                return false; //don't update bets
            }
            else if (eventid == 21) {
                //Keep Alive
                return false; //don't update bets!!!!
            }
            else if ((eventid == 24) || (eventid == 26) || (eventid == 15) || (eventid == 16) || (eventid == 27)) {
                //Broadcast messages
                if (EventDescription != null) {
                    var newFeedHTML = EventDescription + "<br />";
                    $('.GameFeedInfo').prepend(newFeedHTML);
                    refreshScroller(GameFeedScroller, "GameFeedInfo");
                }

                return false; //don't update bets!!!!
            }
            else {
                return true;
            }
    }
    catch (ex) {
       logError("MatchStartEvents", ex);
    } 
}


function ChangeSound() {
    var newSetting;
    if (thisFixture.sound == 1) {
        //the user currently CAN hear the sound ...so...now turn it off!!!!
        newSetting = 0;

        //switch on/off sound badges on mobile
        if (displaymode == "m") {
            $('#soundbadge-off').hide();
            $('#soundbadge-on').show();
        } else {
            //change text for link in web/ipad view
            $('#soundlink').html("&#10004; Turn On Sound");
        }
    }
    else {
        //the user currently can NOT hear the sound ...so...now turn it on!!!!
        newSetting = 1;

        //switch on/off sound badges on mobile 
        if (displaymode == "m") {
            $('#soundbadge-on').hide();
            $('#soundbadge-off').show();
        } else {
            //change text for link in web/ipad view
            $('#soundlink').html("&#10006; Turn Off Sound");
        }
    }
    thisFixture.sound = newSetting;

    try
    {
        var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

        if (thisUser) {
            $.ajax({
                url: WS_URL_ROOT + "/Game/SetSound",
                type: "POST",
                data: "fu=" + thisUser.fbuserid + "&u=" + thisUser.id + "&s=" + newSetting,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("SetSound", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    //if (response == newSetting) {
                        //sound was changed in DB
                    //}
                }
            });
        }
    }
    catch (ex) {
        logError("SetSound", ex);
    }
}


function playsound(Event) {
        try {
            if (thisFixture.sound == 1) {
                //only play cound if the user has not turned off sound!!!!
                var soundfile;
                switch (Event) {
                    case "gamestart":
                        soundfile = "whistle.mp3";
                        break;
                    case "halftime":
                        soundfile = "whistle.mp3";
                        break;
                    case "secondhalf":
                        soundfile = "whistle.mp3";
                        break;
                    case "gameover":
                        soundfile = "whistle.mp3";
                        break;
                    case "win":
                        soundfile = "cheer_8k.mp3";
                        break;
                    case "lose":
                        soundfile = "sadtrombone.mp3";
                        break;
                    case "void":
                        soundfile = "pan.mp3";
                        break;
                }

                var audio;
                audio = document.getElementById("audio");
                audio.load();
                audio.src = "/Content/sounds/" + soundfile;
                audio.play();
            }
        }
        catch (ex) {
            logError("playsound", ex);
        }
}

//this function stores a value which the user wants to user for each bet
//it enables the user to place bets with one click!!!!

// Altered by Gamal 29/03/2012: Store one click bets value in DB in tblFixtureUsers
function storeOneClickCreditValue() 
{
    try
    {
        var usersOneClickCreditValue = parseInt($('#' + displaymode + '_creditsmanager input:checked').val())
        if (!usersOneClickCreditValue)  
        {
            usersOneClickCreditValue = 0;
        }
        
        if (localStorage.getItem("usersOneClickCreditValue") != null) {

            localStorage.removeItem("usersOneClickCreditValue");
        }

       // var requestFixtureID = GetRequestParam("f");
        localStorage.setItem("usersOneClickCreditValue", GetCurrentfixtureID() + "-" + usersOneClickCreditValue);
        var userid = -1;
        uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

        if (uiUser) {
            userid = uiUser.id;
            $.ajax({
                url: WS_URL_ROOT + "/Game/StoreOneClickCreditValue",
                type: "POST",
                data: "fixtureID=" + GetCurrentfixtureID() + "&userid=" + userid + "&oneClickVlaue=" + usersOneClickCreditValue,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("StoreOneClickCreditValue", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    // Probably do nothing
                        //_gaq.push(['_trackEvent', 'Clicks', 'SetOneClickBet', '', parseInt(usersOneClickCreditValue)]);

                }
            });

            }
            _gaq.push(['_trackEvent', 'Clicks', 'SetOneClickBet', '', parseInt(usersOneClickCreditValue)]);
               
    }
    catch (ex) 
    {
        logError("storeOneClickCreditValue", ex);
    }
    ToggleCreditsmanager(); //now hide the div!!
}


function getUsersOneClickCreditValue()
{
    var usersOneClickCreditValue = 0;
    try
    {
        var checkOneClickCreditValue = localStorage.getItem("usersOneClickCreditValue");
        if (checkOneClickCreditValue) {
            var tempArray = checkOneClickCreditValue.split("-");
            var oneClickFixture = tempArray[0];
            var requestFixtureID = GetRequestParam("f");
            if (requestFixtureID == oneClickFixture)
            {
                    //local stroage DOES have a value for doing one click bets for this fixture
                    usersOneClickCreditValue = parseInt(tempArray[1]);
            }
        }
    } catch (ex) {}
    return usersOneClickCreditValue;
}

//this should rarely be needed - it makes sure the pitch is displayed ( we only call this function if the pitch should be displayed (i.e. we've received an event that is in the live match gameplay)
//if the pitch is not displayed it reloads it!
//note - not sure if we still need this procedure now that we have stopped using lightstreamer - keep an eye on this - stephen 26-july
function MakeSurePitchIsDisplayed(eventid) 
{
    if ((eventid != 24) && (eventid != 26) && (eventid != 27)) 
    {
        //only do this check if the event is NOT a referee message (a lot of these get sent out before the game starts!!!!!)
        if (displaymode == "w") //only do this for the web - as for the mobile - very often we will not be viewing the pitch!!!!  - this function is hopefully not needed anymore since we have replaced LightStreamer with SignalR
        {
            //only do this if the event is 
            if ($('.pitch').is(":visible") != true) 
            {
                var requestFixtureID = GetRequestParam("f");
                GetGameDetails(requestFixtureID, GameDetailsComplete);
                logError("MakeSurePitchIsDisplayed", "MatchEventReceived while pitch not displayed!!!!!! eventid is  " + eventid, "", "");
            }
        }
    }
}

function UpdateLatestEventReceived(newTime) 
{
    if (lastEventReceivedTime) {
        //make sure that the new Time IS later than the previous time
        if (newTime > lastEventReceivedTime) 
        {
            lastEventReceivedTime = newTime;
        }
    }
    else 
    {
        //lastEventReceivedTime has not been set yet - this must be the first Lightstream event time
        lastEventReceivedTime = newTime;
    }
}

//this function checks that the friends bet we have recieved was placed AFTER the latest event we have received
//sometimes (very rarely) due to connection latency we may receive details of a friends bet AFTER the subsequent game event
//in cases like this we dont want to update our friends list with details of this bet
function FriendsBetIsUpToDate(friendsBet) 
{
    if (lastEventReceivedTime) 
    {
        var tempDate = new Date(friendsBet.eventtime); 
        if (tempDate > lastEventReceivedTime) 
        {
            return true; //users bet IS after our last event
        }
        else 
        {
            return false; //users bet is NOT after our last event!!!
        }
    }
    else 
    {
        //we have no lastEventReceivedTime value ..so return true - the user bet IS up to date
        return true
    }
}

//Stephen 29-Mar-12 
//this function checks if we have received all the last 5 events from the admin
//sometimes we can lose conection for 5-10 seconds and then reconnect so we miss one or two events BUT we reconnect again before our
//own reload logic notices and propmts a reload
//this function reloads the page if we dont have all 5 of the last 5 messages
function CheckWeHaveReceivedAllRecentMessages(PreviousEvents) 
{
  try 
  {
      var wehavereceivedAllRecentMessages = true; 
      var ListOfPreviousEvents = PreviousEvents.split(",");
      for (var i = 0; i < ListOfPreviousEvents.length; i++) 
      {
          if(!HaveWeDisplayedThisEventBefore(ListOfPreviousEvents[i]))
          {
              //if in here it means we HAVE NOT displayed a previous event ID 
              //this means we may have temporarily lost connection 
              //...so.... call getGameDetails!!!!
              wehavereceivedAllRecentMessages = false;
              logError("CheckWeHaveReceivedAllRecentMessages", "We missed at least one event. Reloading GameDetails!!!!!!!", "", "");
              GetGameDetails(GetCurrentfixtureID(), GameDetailsComplete);
              break;
          }
      }
  }
  catch (ex) 
  {
      logError("CheckWeHaveReceivedAllRecentMessages", ex);
  }
  return wehavereceivedAllRecentMessages;
}

//renamed the function to be UpdateGameEvent instead of UpdateGameEventFromLightStreamer - stephen 2-may-12
function UpdateGameEvent(fixtureid, eventid, updateId, HomeScore, AwayScore, EventDescription, eventUpdateTime, eventEndTime, PreviousEvents, MatchStartExtraDetails) { //, newOddsCounter
    try {
        //first do some checks
        //1 - make sure that this fixtureid is the same as the game we are playing
        if ((GetCurrentfixtureID() == fixtureid) && (fixtureid > 0)) {
            //the lightstreamer update is for this fixture!!!!!

            var WeDisplayedThisEventBefore = HaveWeDisplayedThisEventBefore(updateId);
            var WeHaveReceivedAllRecentMessages = CheckWeHaveReceivedAllRecentMessages(PreviousEvents)

            //lastUpdateID = localStorage.getItem("lastEventUpdateID"); //check in local storage for the last event we updated
            //Stephen 29-Mar-12 - added && (CheckWeHaveReceivedAllRecentMessages(PreviousEvents)) to the line below

            if ( (!WeDisplayedThisEventBefore)  &&  (updateId > 0)  &&  (WeHaveReceivedAllRecentMessages) ) {

           // if ((!HaveWeDisplayedThisEventBefore(updateId)) && (updateId > 0) && (CheckWeHaveReceivedAllRecentMessages(PreviousEvents))) {  //make sure we don't display the same event twice
                //if ((lastUpdateID != updateId) && (updateId > 0)) {  //make sure we don't display the same event twice --//change this line to check a list/array of all updates we've shown

                //lastUpdateID = updateId;
                //localStorage.setItem("lastEventUpdateID", lastUpdateID); //stick this eventId in local storage

                UpdateLatestEventReceived(eventUpdateTime);

                if (MatchStartEvents(eventid, HomeScore, AwayScore, EventDescription, MatchStartExtraDetails)) //this returns true if the event was a normal event - it returns false if the event was half time or full time or match start ( we dont want to complete any bets for these type of events)
                {
                    

                    //Always set the home and Away score
                   $('#' + displaymode + '_home_score').html(HomeScore);
                   $('#' + displaymode + '_away_score').html(AwayScore);

                    /*
                    //No longer do this as we now complete bets in DB
                    //now check to see if we have an outstanding bet
                    if ((Currentbet != null) && (Currentbet.status == 0)) {
                    //we have a current pending bet - so now call the DB to see if we won or lost!!!

                    //we could actually tell if user has won here by looking at the Currentbet object but we want o go to DB to update tbl
                    checkBetStatus(CheckComplete); 
                    }
                    */

                    //instead we need to compare the event in our bet object object(if it is active/pending) to the event passed in 
                   //then update new credits and new feed data
                    var betStatuscheck = checkBetStatusNew(eventid, eventUpdateTime, eventEndTime);

                    if (betStatuscheck == -200) 
                    {
                        //the event we received from the admin actually happened BEFORE we placed our bet ( and so BEFORE we created our local bet object)
                        //this means that we didn't update our local bet object
                        //this scenario is due to latency - for some reason the message from the admin was slow coming to us
                        //so - we dont want to write the description of this event to the game tracker as it will be confusing to the player
                        //as they will have bet placed - then after that they will see an event come in - BUT it wont say win/loss/or void.
                        //So - what we want to do here is call getgamedetails - this will update the game tracker correctly
                        //we call it in 1 seconds time as we want to finish through the rest of this function (i.e we want to complete our friends bets and so on) 

                        setTimeout("GetGameDetails(" + fixtureid + ", GameDetailsComplete);", 500);
                    }
                    else {
                        //checkBetStatusNew ran fine - continue as normal!
                        if (EventDescription != null) {
                            //now output the description
                            if ((eventid == 19) || (eventid == 20)) {
                                EventDescription = AddPredictionsToEvents(thisFixture, EventDescription, eventid, thisFixture.currenthalf);
                            }

                            var newFeedHTML = EventDescription + "<br />";
                            $('.GameFeedInfo').prepend(newFeedHTML);
                            refreshScroller(GameFeedScroller, "GameFeedInfo");
                        }
                    }

                    updateFriendsBetStatus(eventid, eventUpdateTime, eventEndTime);
                   
//                    var league = JSON.parse(window.sessionStorage.getItem("leagueview"));
//                    if (league) {
//                        GetLeagueTable_WithLeagueHeader(league.leagueID, league.name, league.desc, league.createrID);
//                    }

                    if (eventid == 14)  //the game is over - remove pitch so user can't make any more bets
                    {
                        DisplayFullTime(thisFixture.hometeam, thisFixture.awayteam, HomeScore, AwayScore, thisFixture.fixtureid);
                        thisFixture.currenthalf = -103;
                    }
                    else if ((eventid == 4) || (eventid == 6)) 
                    {
                        var GoalScorerStartPosition = EventDescription.indexOf(" - ");
                        if (GoalScorerStartPosition > 0) 
                        {
                            //we have the goalscorer
                            LastGoalScorer = EventDescription.substring(GoalScorerStartPosition + 3);
                        }
                        else
                        {
                            LastGoalScorer = "";
                        }
                    }
                    if (eventid != 14) {
                        MakeSurePitchIsDisplayed(eventid);
                    }
                } //match start

                updatePreGamebets(eventid, HomeScore, AwayScore);

                if (userLeague.id == thisFixture.defaultleagueid) 
                {
                    //the last league table we displayed WAS the default league - this means we need to add the user playing the game to this table
                    //(if the user is not already in the table of course!! )

                    //the reason we only need to do this for the default league is that if we are displaying 
                    //any other league when we get an event then we make an AJAX call to get the league
                    //the response from this league will have the user in it - so we dont need to append them like we are doing no
                    //it is only when we receive the non personalized table after an event that we need to add the users score to the table

                    //(we also call this function from signalr.js - when we recieve the actual leaderboard
                    //it is far more likely to be needed from there than here
                    //but - keep the function here just in case we recieve the leaderboard BEFORE we process this function (it shouldn;t happen - but - just in case!)
                    AddMyScoreToOverAllLeaderBoard();
                }

            } //   if (lastUpdateID != updateId) {
            else {

                //if in here then it means that we are NOT displaying an event for some reason  - I want to record this fact!!!!!!

                //  var WeDisplayedThisEventBefore = HaveWeDisplayedThisEventBefore(updateId);
                //                var WeHaveReceivedAllRecentMessages = CheckWeHaveReceivedAllRecentMessages(PreviousEvents)
                var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                logError("Event Debug", thisUser.name + " is Not showing event.updateId is '" + updateId + "' ,WeDisplayedThisEventBefore '" + WeDisplayedThisEventBefore + "'" + " ,WeHaveReceivedAllRecentMessages is '" + WeHaveReceivedAllRecentMessages + "'");
            }

        } //if (fixture == fixtureid) {
    }
    catch (ex) {
        logError("UpdateGameEventFromLightStreamer", ex);
    }
}

function HaveWeDisplayedThisEventBefore(eventUpateID) {
    try {
        var DisplayedEvents;
        try {
            DisplayedEvents = window.sessionStorage.getItem("listOfDisplayedEvents");
        } catch (TempEx) { }

        var listOfDisplayedEvents;

        if (typeof (DisplayedEvents) != 'undefined' && DisplayedEvents != null && DisplayedEvents != "") {
            listOfDisplayedEvents = typeof DisplayedEvents != 'object' ? JSON.parse(DisplayedEvents) : DisplayedEvents;

            eventUpateID = "e" + eventUpateID;

            if (typeof (listOfDisplayedEvents) != 'undefined' && listOfDisplayedEvents != null) {
                for (var i = 0; i <= listOfDisplayedEvents.length - 1; i++) {
                    if (listOfDisplayedEvents[i] == eventUpateID) {
                        return true; //we HAVE showed this event before!!!!!
                    }
                }
            } //if (typeof (listOfDisplayedEvents) != 'undefined' && listOfDisplayedEvents != null) {
            else {
                //listOfDisplayedEvents is null - so create empty array
                listOfDisplayedEvents = new Array();
            }
        } // if (typeof (DisplayedEvents) != 'undefined' && DisplayedEvents != null && DisplayedEvents != "") {
        else {
            listOfDisplayedEvents = new Array(); //do this so we don't leave a null object in the listOfDisplayedEvents sessionStorage object
        }

        //this eventUpateID is not in our list -- so add it to the list!!!
        listOfDisplayedEvents.push(eventUpateID);
        window.sessionStorage.setItem("listOfDisplayedEvents", $.toJSON(listOfDisplayedEvents));
    }
    catch (ex) {
        logError("listOfDisplayedEvents", ex);
    }
    //logError("LSBind", "WE HAVE NOT SHOWED THIS BEFORE!!!!!!!! eventUpateID is " + eventUpateID, "", "");
    return false;
}



// Added by Gamal 12/03/2012: A function to show a pop-up upon clicking on forfeit bet
function forfeitpopup(){
    try {

        var CHECKSET;

        //Added this Gamal 26/03/2012
        //This try/catch is for certain android devices 
        //if the value is not set on certain android devices it will through an error and not continue with the rest of the function
        try {
            CHECKSET = JSON.parse(window.sessionStorage.getItem("dontShowForfeitPopup"));
        } catch (TempEx) { }


        if (CHECKSET == 1) {
            // User Chose not to show him popup again
            forfeitbet();
        } else {
            var Currentbet;
            try {
                Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
            } catch (TempEx) { }

            var result;
            if ((Currentbet != null) && (Currentbet.status == 0)) {
                // User have a current bet pending and therefore can forfeit bet

                // Generate the popup message
                result = "Are you sure that you want to cancel your prediction and lose your " + Currentbet.amount + " credits?";
                result += "<br clear=\"all\"/>";
                if (remainingforfeits > 1) {
                    result += "<br clear=\"all\"/> You have " + remainingforfeits + " forfeits remaining!";
                } else {
                    result += "<br clear=\"all\"/> You only have " + remainingforfeits + " forfeit remaining!";
                }
                
                //new animation effects - John

                //$('.tooltip-shade').show();
                $('#' + displaymode + '_forfeitconfirm').animate({ top: '55px' }, 300);

                //move it to top
                $('#' + displaymode + '_forfeitconfirm').attr("style", "display:block;z-index:903;");

                $('#' + displaymode + '_forfeitconfirm h4').html(result);
                $('#' + displaymode + '_forfeitconfirmbutton').attr('onClick', 'forfeitbet()');
            } else {
                // User Doesn't have a pending bet and therefore shouldn't see  the forfeit icon

                // Hide Forfeit Icon
                $('.forfeitclick').hide(); //bet has just been completed ..so hide the forfeit button

            }
        }
    }catch(ex){
        logError("forfeitpopup", ex);    
    }
}

/* create popup */
function betpupup(r, i) {
    try {
            //not signed in so you can't bet!
            uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if (uiUser == null) {
                //alert('Sign in with Facebook to Play!');
                if (displaymode == "w") {

                    $('#' + displaymode + '_predictionpending').html("<strong>Sign in with Facebook to Play!</strong>!");
                    $('#' + displaymode + '_predictionpending').show();
                    $('.tooltip-shade').show();
                    $('.betcountdown').show();
                    $('.betcountdown').delay(2500).fadeOut('slow');
                    $('.tooltip-shade').delay(2500).fadeOut('slow');
                }
                else if (displaymode == "m") {
                    $('.popup-notify > h1').text("Sign in with Facebook to Play!");
                    $('.popup-notify > span').text("");
                    $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
                }
                return false;
            }
            var eventid = i;

            if ( admin && admin.isAdmin()) //don't know why the admin would ever be undefined - but it has happened!!!
            {
                //this user IS the admin ...so..don't place bet - instead.....log the EVENT!!!!!!
                //LiveEventMessaging.send("Admin says....hello!!!!!");
                //liveGamesSignalRProxy.logEvent(eventid, GetCurrentfixtureID(), 0, null);
                //alert("event sent!!!");
                if (admin.inPreview() == 1) {
                    //we are in PreviewMode - so do nothing!!!
                }
                else 
                {
                    //we are not in previewmode - so send event
                    admin.sendEvent(eventid, r);
                }
            }
            else 
            {
                //this is NOT an admin user ...so ... continue placebet flow as normal
                var Currentbet;
                try {
                    Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
                } catch (TempEx) { }

                if ((Currentbet != null) && (Currentbet.status == 0)) {
                    //the user currently has a pending bet ( i.e. a bet that is active and is awaiting completion!)
                    //so - don't let user make a bet untill this Currentbet is completed!!!!

                    if (LastEventReceived == 22) {
                        //we DO have a bet placed - however the last event we recieved was a freeze 
                        //...so - tell the iser they must wait for the ref's decision!!!
                        //alert("Can't make a prediction right now - Waiting for the LiveGames referee's decision!!");

                        if (displaymode == "w") {

                            $('#' + displaymode + '_predictionpending').html("<strong>Can't place a bet right now - waiting for the referee's decision!!!</strong>!");
                            $('#' + displaymode + '_predictionpending').show();
                            $('.tooltip-shade').show();
                            $('.betcountdown').show();
                            $('.betcountdown').delay(2500).fadeOut('slow');
                            $('.tooltip-shade').delay(2500).fadeOut('slow');
                        }
                        else if (displaymode == "m") {
                            $('.popup-notify > h1').text("Can't place a bet right now - waiting for the referee's decision!!");
                            $('.popup-notify > span').text("");
                            $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
                        }

                    }
                    else {
                        //alert('You have already made a prediction! You must wait until an event has occurred until you make another. Alternatively, you can forfeit!');

                        if (displaymode == "w") {
                            
                            $('#' + displaymode + '_predictionpending').html('<strong>You have already made a prediction!</strong>!');
                            $('#' + displaymode + '_predictionpending').show();
                            $('.tooltip-shade').show();
                            $('.betcountdown').show();
                            $('.betcountdown').delay(2500).fadeOut('slow');
                            $('.tooltip-shade').delay(2500).fadeOut('slow');
                        }
                        else if (displaymode == "m") {
                            $('.popup-notify > h1').text("You have already made a prediction!");
                            $('.popup-notify > span').text("");
                            $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
                        }
                        
                    }
                    return false;
                }

                var checktempbet;
                try {
                    checktempbet = JSON.parse(window.sessionStorage.getItem("tempBet")); //get temp bet object from session storage
                } catch (TempEx) { }

                if (checktempbet != null) {
                    //the user is currently in the process of making a bet 
                    //so - don't let user make a bet untill this checktempbet is removed/updated!!!!

                    //alert('You must wait until your previous prediction has finished processing!!');

                    if (displaymode == "w") {

                        $('#' + displaymode + '_predictionpending').html("<strong>You must wait until your previous prediction has finished processing!!!</strong>!");
                        $('#' + displaymode + '_predictionpending').show();
                        $('.tooltip-shade').show();
                        $('.betcountdown').show();
                        $('.betcountdown').delay(2500).fadeOut('slow');
                        $('.tooltip-shade').delay(2500).fadeOut('slow');
                    }
                    else if (displaymode == "m") {
                        $('.popup-notify > h1').text("You must wait until your previous prediction has finished processing!");
                        $('.popup-notify > span').text("");
                        $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
                    }

                    return false;
                }
               
                var usersOneClickCreditValue = getUsersOneClickCreditValue();

                if (usersOneClickCreditValue > 0) {
                    //the user HAS set a price he wants to use to bet with one click...so ..go straight to prepare Bet without prompting the user to select a price!!!
                    prepareBet(eventid);
                }
                else {
                    //place bet as normal - the old fashioned way!!!!
                    var result = r;
                    //$("#popupplacebet").show();
                    //$("#popupplacebet").fadeIn(1000); - this line kills lightstreamer!! fadein is linked to jquery mobile which we have removed

                    //new animation effects - John
                    //$('.tooltip-shade').show();
                    $('#' + displaymode + '_popupplacebet').animate({ top: '55px' }, 300);

                    //move it to top
                    $('#' + displaymode + '_popupplacebet').attr("style", "display:block;z-index:900;");

                    $('#' + displaymode + '_popupplacebet h4').html("You have selected <span style='color:#FFFFCC;'>'" + result + "'</span>, How many credits do you want to risk?");
                    $('#' + displaymode + '_confirm').attr('onClick', 'prepareBet(' + eventid + ')');
                }
            }
    }
    catch (ex) {
       logError("betpupup", ex);
    } 
}

/* function prepareBet 
* creates a new bet and places it in system
* */
function prepareBet(eventid) {
    try 
    {
        var credits = 10;
        var usersOneClickCreditValue = getUsersOneClickCreditValue();
        
        if (usersOneClickCreditValue > 0) {
            //the user HAS set a price he wants to use to bet with one click...so ..use this!!!!!
            credits = usersOneClickCreditValue;
        }
        else 
        {
            //get users chosen price for this bet
            credits = parseInt($('#' + displaymode + '_popupplacebet input:checked').val());
        }

        if ((credits) && (credits > 0)) {
            //create new bet
            uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            /* --removed this 4-11-11 - now dont set currentbet until we get response from DB
            Currentbet = null; //we are now making a new bet - so set object to null - clearing previous bet
            Currentbet = new Bet(eventid, fixture, credits, uiUser.id);
            Currentbet.user = uiUser;
            //dont set this until we get a response from the server saying that the bet has ben placed!
            //window.sessionStorage.setItem("Currentbet", $.toJSON(Currentbet));  //Reset the sessionStorage Currentbet object
            */

            //just use tempoary variable here - we will not update the live bet object until we get positive response back from server!!!!
            var tempbet = new Bet(eventid, GetCurrentfixtureID(), credits, uiUser.id);
            tempbet.user = uiUser;
            window.sessionStorage.setItem("tempBet", $.toJSON(tempbet)); //put this variable in local storage - so we don't allow the user to create a bet while the previous one is still connecting to DB!!!!

            $('#' + displaymode + '_bubble' + eventid).removeClass("bubble");
            $('#' + displaymode + '_bubble' + eventid).addClass("bubble_loading");

            $('#' + displaymode + '_popupplacebet').hide();
            //$('.tooltip-shade').hide();

            //place bet in system. takes a callback function as a parameter, which updates the balance when successful
            ReTryBetAttempts = 0;
            placeBet(BetComplete, tempbet);

            //;
            /*
            //Also....don'r do any of these things until we get a response from the server saying that the bet has ben placed!
      
            $('#button' + eventid).hide();

            //these 3 lines set the marker over the event button to indicate you have a bet here!!
            $('#bubble' + eventid).removeClass("bubble");
            $('#bubble' + eventid).addClass("bubble_active");
            $('#bubble' + eventid).html("" + credits + "");
            */
        }
        else {
            //alert("You must select an amount!!");
            if (displaymode == "w") {

                $('#' + displaymode + '_predictionpending').html("<strong>You must select an amount!</strong>!");
                $('#' + displaymode + '_predictionpending').show();
                $('.tooltip-shade').show();
                $('.betcountdown').show();
                $('.betcountdown').delay(2500).fadeOut('slow');
                $('.tooltip-shade').delay(2500).fadeOut('slow');
            }
            else if (displaymode == "m") {
                $('.popup-notify > h1').text("You must select an amount!");
                $('.popup-notify > span').text("");
                $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
            }
        }
       
    }
    catch (ex) {
       logError("prepareBet", ex);
    }
}

function placeBet(callback, thisBet, timeout) 
{
    if (timeout == 1) 
    {
        //check for the stored timeout object - this will only be here if we are retrying after a timeout
        try {
            thisBet = JSON.parse(window.sessionStorage.getItem("timeOutBet"));
        } catch (TempEx) { }
    }
    else {
        //not a timeout!!!! - a normal placebet flow
        if ((!thisBet) || (typeof thisBet == 'undefined')) 
        {
            //alert("no bet object - getting from session storage!");
            try {
                thisBet = JSON.parse(window.sessionStorage.getItem("tempBet"));
            } catch (TempEx) { }
        }
    }

    try {
        //Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
        var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

        $.ajax({
            url: WS_URL_ROOT + "/Game/PlaceBet",
            type: "POST",
            timeout: 7000, //7 second timeout - if longer than this then bet has taken too long  (increased from 5 to 7 due to now returning)


            //data: JSON.stringify(thisBet),changed this stephen - we now want to send as little data as possible 
            //dataType: "json",
            //contentType: "application/json: charset=utf-8",

            data: "u=" + user.id + "&e=" + thisBet.eventid + "&f=" + GetCurrentfixtureID() + "&a=" + thisBet.amount + "&fu=" + user.fbuserid,


            success: function (response) {
                if (callback instanceof Function) {
                    callback(response);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (textStatus == "timeout") {
                    if (ReTryBetAttempts < 1) {
                        //try again (do this 1 times) [only try twice in total]
                        ReTryBetAttempts = ReTryBetAttempts + 1;
                        window.sessionStorage.setItem("timeOutBet", $.toJSON(thisBet));
                        setTimeout("placeBet(BetComplete,null,1);", 1500); //try bet again in 1.5 seconds - cos if we have trouble connecting now we should wait a few seconds before attempting again
                    }
                    else {
                        //BetNotPlaced(thisBet);

                        //changed this Stephen 7-Mar-2012
                        //if we get here it means that we have timed out two times in a row trying to place a bet
                        //often we may actually have managed to place a bet in the DB - yet we have not bben able to recieve a response from the db for 2 successive attempts
                        //this scenario happens very rarely - and if it occurs we should reload the page - as when we reload we will 
                        //read in all data from the db - including any bets placed

                        //before we reload the page - tell te user whats happening!!!! ( as they've just attempted to placce abet and will not know whay instead the page reloads)
                        logError("placeBet", "Failed to place bet - 2 times in a row. Reloading page!!!!!!!", "", "");
                        location.reload(false); //false means get from cahce - true means ge tpage from server!!!
                        //RestartSignalRConnection("PlaceBetRetry");
                    }
                }
                else {
                    BetNotPlaced(thisBet);
                }
            }
        });
        //once we have called the placebet function we need to clear the tempBet object in session storage
        //a scenario can arise (ver very rarely) where - the user places a bet - but for some reason they don't get a response saying the bet was placed (bandwidth issses or they refresh the page before the response comes back)
        //in this scenario the user will always have the tempBet object in the session and will never be able to place a bet again - until they close their browser and reopen it - which is shit
        window.sessionStorage.setItem("tempBet", null); //clear the tempBet variable from local storage - once the bet has been made we now use the Currentbet item!!
        window.sessionStorage.setItem("Currentbet", $.toJSON(thisBet)); //store the bet details 
    }
    catch (ex) {
        logError("placeBet", ex);
    }
}

//this function is called when a bet has been made
function BetComplete(response) {
    try {
        ReTryBetAttempts = 0;
        if (response.betid > 0) {
            //bet was a success

            StartBetCountDown(); //start countdown!!!!


            // - stephen 17-Aug-12
            //we need to change the way we retrieve the details sent back to us from the bet object
            //we no longer pass up the bet object as we want to reduce the data we send - instead we only pass up the parameters needed
            //Currentbet = response; //set Currentbet to the bet object returned
            ///////////////////////////////////////////////////////
            try {
                Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet"));
            } catch (TempEx) { }

            Currentbet.betdescription = response.betdescription;
            Currentbet.eventdesc = response.eventdesc;
            Currentbet.betid = response.betid;
            Currentbet.creditsremaining = response.creditsremaining;
            Currentbet.odds = response.odds;
            Currentbet.eventtime = response.eventtime;
            Currentbet.existingBetId = response.existingBetId;
            Currentbet.unlockcredits = response.unlockcredits;
            Currentbet.numbetsplaced = response.numbetsplaced;
            Currentbet.numbetstounlockhigherlevel = response.numbetstounlockhigherlevel;
            
            if  ( (response.existingBetId) && (response.existingBetId > 0) )
            {
                Currentbet.eventid = response.existingBetId;
            }

            Currentbet.amount = response.amount;
            Currentbet.incorrectEventID = response.incorrectEventID;
            Currentbet.incorrectOdds = response.incorrectOdds;
            Currentbet.status = response.status;
            ////////////////////////////////////////////////////////////

            betJustComplete = 1; //Added this Stephen 23-Mar - we use this to determine whether to show join the bet number flash up

            //DisplayHigherCreditsAvailabilityToUser(response.unlockcredits);
            DisplayHigherCreditsAvailabilityToUserV2(response.unlockcredits, response.numbetsplaced, response.numbetstounlockhigherlevel, "updateTicker"); //new way  - //Stephen 23-Mar-12

            uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            uiUser.credits = response.creditsremaining; //update the users credits
            window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser));  //reset the sessionStorage object with the correct credits
            $('.credits').html(uiUser.credits); //update html so user can see their new credits total
            
            ///if the bet has been maded - then call this aysnch function to notify friends of bet
            Currentbet.user = uiUser; //make sure the current bet has the correct user
            Currentbet.odds = CastToDecimal(Currentbet.odds);
            window.sessionStorage.setItem("Currentbet", $.toJSON(Currentbet));  //Set the sessionStorage Currentbet object
            window.sessionStorage.setItem("tempBet", null); //clear the tempBet variable from local storage - once the bet has been made we now use the Currentbet item!!

            if (NotifyFriendsOfBetPlaced(friendsNotified) < 0) {
                //i have seen that we failed to send messages via SignalR as the signalr connection hasn't been initialised when 
                //we tried to send the message - so try again if it fails!!!
                setTimeout("NotifyFriendsOfBetPlaced(friendsNotified);", 2000);
            }
            
            $('#' + displaymode + '_button' + Currentbet.eventid).hide();

            $('#' + displaymode + '_bubble' + Currentbet.eventid).removeClass("bubble_loading");
            $('#' + displaymode + '_bubble' + Currentbet.eventid).addClass("bubble_active");
            $('#' + displaymode + '_bubble' + Currentbet.eventid).html("" + Currentbet.amount + "");

            if (Currentbet.incorrectEventID) {
                //the user tried to place a bet but the db already had an active bet for this user (most likely due to losing connection before the DB can tell the client the bet was made)
                //also the active bet is NOT for the same event as the new bet attempt

                //in cases like this the DB is ALWAYS the master - we need to unset the loading icon for the new (and incorrect) bet attempt
                $('#' + displaymode + '_bubble' + Currentbet.incorrectEventID).removeClass("bubble_loading");
                $('#' + displaymode + '_bubble' + Currentbet.incorrectEventID).addClass("bubble");
                $('#' + displaymode + '_bubble' + Currentbet.incorrectEventID).html(Currentbet.incorrectOdds + "/1");
            }

            var updatedDescription = response.betdescription;
            try
            {
                updatedDescription = updatedDescription.replace("^", "<span class='min'>");
                updatedDescription = updatedDescription.replace("~", "</span>");
            } catch (ex2) { }

            var newFeedHTML = "<b class='bettext'>" + updatedDescription + "</b><br />";
            $('.GameFeedInfo').prepend(newFeedHTML);
            refreshScroller(GameFeedScroller, "GameFeedInfo");

            //removed th line below - stephen 5th-7-12
            //not sure if we need this line anymore as we are populating the friends list in the line below ( DisplayFriendsLeaderBoard(Currentbet.friendsleaderboardlist); )!!!!!!
            //AddBetToFriendScores(Currentbet); //we need to add the users bets to the friendsScores as the user himself appears in the friends leaderboard!!

            //Removed this Stephen 19-July
            //no longer wish to return these tables directly from the placeBet procedure/API call
            //DisplayFriendsLeaderBoard(Currentbet.friendsleaderboardlist); //now that we have made a bet - update the friends leaderboard list
            //UpdateLeaderboard(Currentbet.leagueleaderboardlist, Currentbet.leagueid); //now that we have made a bet - update the overall leaderboard too

            //instead we will make AJAX API call's here to get the latest tables/leaderboards!!!!
            if (WeAreCurrentlyShowingLeagueTable() == true) {
                userLeague.UpdateCurrentLeaderboard(1); //the "1" indicates that we dont want to show the loading gif for this update
            }

            if (WeAreCurrentlyShowingFriendsLeagueTable == true) {
                userLeague.GetFriendsLeaderBoard();
            }
            else 
            {
                //if we are not updateing friends list via the DB - then add this bet object to the list!!!!!!
               AddBetToFriendScores(Currentbet);
            }

            //updated this flow - stephen 1- nov-12
            //if we are on mobile then we dont need to update


            if (remainingforfeits > 0) {
                //user has a current Bet AND has forfeits remaing ...so show forfeit button
                $('.forfeitclick').show();
                $('#' + displaymode + '_forfeitnum').html(remainingforfeits);
            }

            //Slide panel to tracker panel on mobile view - John
            //if (displaymode == "m") {
                //$('[href=#1]').click();
                //$('.notification_msg').html('<h1><span><img src="/Images/prediction-success.png" border="0" alt="-" /></span><br/>' + response.betdescription + '</h1>');
                //$('.notification_msg').fadeIn('fast').delay(4000).fadeOut('slow');
            //}

            _gaq.push(['_trackEvent', 'Bets', 'BetPlaced', GetEventFromEventDescription(Currentbet.eventdesc), parseInt(Currentbet.amount)]);
        }
        else {
         
            //no need for 2 flows here
            if (response.betid == -2) { //must wait for previous bet 
                //try to make bet one more time
                if (response.numattempts == 0) {
                    response.numattempts = 1; //set this so we don't go into infinite loop
                    placeBet(BetComplete, response); //try to place bet again
                }
                else {
                    //we have failed again - so clear bet objects!!!!!
                    $('#' + displaymode + '_bubble' + response.eventid).removeClass("bubble_loading");
                    $('#' + displaymode + '_bubble' + response.eventid).addClass("bubble");
                    $('#' + displaymode + '_bubble' + response.eventid).html("" + response.odds + "/1");

                    window.sessionStorage.setItem("Currentbet", null);  //Set the sessionStorage Currentbet object
                    window.sessionStorage.setItem("tempBet", null);

                    var newFeedHTML = "<b class='bettext'>" + response.betdescription + "</b><br />";
                    $('.GameFeedInfo').prepend(newFeedHTML);
                    refreshScroller(GameFeedScroller, "GameFeedInfo");
                    logError("BetComplete - BetFailed", "Failed To connect to place bet in DB twice : -2");

                    //Slide panel to tracker panel on mobile view - John
                    //if (displaymode == "m") {
                        //$('[href=#1]').click();
                        //$('.notification_msg').html('<h1><span style="color:green;">Prediction Result:</span><br/>' + response.betdescription + '</h1>');
                        //$('.notification_msg').fadeIn('fast').delay(4000).fadeOut('slow');
                    //}
                }
            }
            else if (response.betid == -101) { //error connecting to DB
                //try to make bet one more time
                if (response.numattempts == 0) {
                    response.numattempts = 1; //set this so we don't go into infinite loop
                    placeBet(BetComplete, response); //try to place bet again
                }
                else {
                    //we have failed again - so clear bet objects!!!!!
                    $('#' + displaymode + '_bubble' + response.eventid).removeClass("bubble_loading");
                    $('#' + displaymode + '_bubble' + response.eventid).addClass("bubble");
                    $('#' + displaymode + '_bubble' + response.eventid).html("" + response.odds + "/1");

                    window.sessionStorage.setItem("Currentbet", null);  //Set the sessionStorage Currentbet object
                    window.sessionStorage.setItem("tempBet", null);

                    var newFeedHTML = "<b class='bettext'>" + response.betdescription + "</b><br />";
                    $('.GameFeedInfo').prepend(newFeedHTML);
                    refreshScroller(GameFeedScroller, "GameFeedInfo");
                    logError("BetComplete - BetFailed", "Failed To connect to place bet in DB twice : -101");

                    //Slide panel to tracker panel on mobile view - John
                   //if (displaymode == "m") {
                       // $('[href=#1]').click();
                        //$('.notification_msg').html('<h1><span style="color:green;">Prediction Result:</span><br/>' + response.betdescription + '</h1>');
                        //$('.notification_msg').fadeIn('fast').delay(4000).fadeOut('slow');
                    //}
                }
            }
            else if (response.betid == -3) { //awaiting decision
                $('#' + displaymode + '_bubble' + response.eventid).removeClass("bubble_loading");
                $('#' + displaymode + '_bubble' + response.eventid).addClass("bubble");
                $('#' + displaymode + '_bubble' + response.eventid).html("" + response.odds + "/1");

                window.sessionStorage.setItem("Currentbet", null);  //Set the sessionStorage Currentbet object
                window.sessionStorage.setItem("tempBet", null);

                _gaq.push(['_trackEvent', 'Bets', 'BetDeniedAwaitingDecision']);

                //alert("Can't make a prediction right now - Waiting for the LiveGames referee's decision!!");
                if (displaymode == "w") {

                    $('#' + displaymode + '_predictionpending').html("<strong>Can't make a prediction right now - Waiting for the LiveGames referee's decision!</strong>!");
                    $('#' + displaymode + '_predictionpending').show();
                    $('.tooltip-shade').show();
                    $('.betcountdown').show();
                    $('.betcountdown').delay(2500).fadeOut('slow');
                    $('.tooltip-shade').delay(2500).fadeOut('slow');
                }
                else if (displaymode == "m") {
                    $('.popup-notify > h1').text("Can't make a prediction right now - Waiting for the LiveGames referee's decision!");
                    $('.popup-notify > span').text("");
                    $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
                }
                return false;
            }
            else {

                if (response.betid == -104) {
                    //user does not have enough credits!!!!! - tell them and prompt them to go to the store to buy more!!!!!
                    //alert("You have run out of credits! You can buy more in the store!!");
                    if (displaymode == "w") {

                        $('#' + displaymode + '_predictionpending').html("<strong>You have run out of credits! You can buy more in the store!!</strong>!");
                        $('#' + displaymode + '_predictionpending').show();
                        $('.tooltip-shade').show();
                        $('.betcountdown').show();
                        $('.betcountdown').delay(2500).fadeOut('slow');
                        $('.tooltip-shade').delay(2500).fadeOut('slow');
                    }
                    else if (displaymode == "m") {
                        $('.popup-notify > h1').text("You have run out of credits! You can buy more in the store!!");
                        $('.popup-notify > span').text("");
                        $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
                    }
                }

                $('.GameFeedInfo').prepend("<b class='bettext'>" + response.betdescription + "</b><br />");
                refreshScroller(GameFeedScroller, "GameFeedInfo");                
                $('#' + displaymode + '_bubble' + response.eventid).removeClass("bubble_loading");
                $('#' + displaymode + '_bubble' + response.eventid).addClass("bubble");
                $('#' + displaymode + '_bubble' + response.eventid).html("" + response.odds + "/1");

                window.sessionStorage.setItem("Currentbet", null);  //Set the sessionStorage Currentbet object
                window.sessionStorage.setItem("tempBet", null);

                //Slide panel to tracker panel on mobile view - John
               // if (displaymode == "m") {
                   // $('[href=#1]').click();
                    //$('.notification_msg').html('<h1><span style="color:green;">Prediction Result:</span><br/>' + response.betdescription + '</h1>');
                    //$('.notification_msg').fadeIn('fast').delay(4000).fadeOut('slow');
                //}
            }
        }
                
    }
    catch (ex) {
       logError("BetComplete", ex);
   }
   //alert("at end of betcomplete!");
}


//this function called when failed placeing a bet
//if we get here then we need to clear the bet and undo all the bet details and tell the user - "unable to place bet - please try again"
function BetNotPlaced(thisBet) {
    ReTryBetAttempts = 0;
    //set back the icon over event
    $('#' + displaymode + '_bubble' + thisBet.eventid).removeClass("bubble_loading");
    $('#' + displaymode + '_bubble' + thisBet.eventid).addClass("bubble");

    //clear storage bet items - so we can make another bet!!!!
    window.sessionStorage.setItem("Currentbet", null);
    window.sessionStorage.setItem("tempBet", null); //clear the tempBet variable from local storage - once the bet has been made we now use the Currentbet item!!

    //tell user bet was not made
    $('.GameFeedInfo').prepend("Unable to make a prediction... try again <br />");
    refreshScroller(GameFeedScroller, "GameFeedInfo");
    logError("BetNotPlaced");
}

function forfeitbet() {
    $('.forfeitclick').hide();

    // Added by Gamal 12/03/2012
    closeforfeitpopup();

    var thisBet;
    try {
        thisBet = JSON.parse(window.sessionStorage.getItem("Currentbet"));
    } catch (TempEx) { }

    try {
        
        //Added by Gamal 12/03/2012: Update session variable if user opted to not show him the forfeit popup again
        var donshowForfeit = $('#' + displaymode + '_dontshowforfeit').prop('checked');
        if (donshowForfeit) {
            window.sessionStorage.setItem("dontShowForfeitPopup", $.toJSON(1));
        }
        var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

        $.ajax({
            url: WS_URL_ROOT + "/Game/ForFeitBet",
            type: "POST",
            timeout: 5000,
            data: "u=" + user.id + "&b=" + thisBet.betid + "&f=" + GetCurrentfixtureID() + "&fu=" + user.fbuserid,
            //data: JSON.stringify(thisBet),
            //dataType: "json",
            //contentType: "application/json: charset=utf-8",
            success: function (response) {
                var tempBet = response;
                if (tempBet.status == -103) {
                    //bet was forfeited successfully
                    forfeitsUsed = 1; // this logs the fact that the user has used the forfeit functionality!! (this info will be used to tell us if we need to remind the user this functionality!)

                    //check if coutdown is in progress
                    if (BetValidCount > 0) {
                        //we are currently displaying the count down to when the bet will be valid (i,e not void!!!)
                        BetValidCount = -1; //we set this so we do nothing the next time we go into checkBetCountDown()
                        $('#' + displaymode + '_predictionpending').html('<strong>Bet Forfeit!</strong>!');
                        //removed fadeOut due to problems with iPad and iOS6, delay and fadeout combined on a large scale seems to cause issues. Use hide instead - John
                        $('#' + displaymode + '_predictionpending').delay(1000).fadeOut('slow');
                        $('#' + displaymode + '_count').hide();
                        $('.tooltip-shade').delay(1000).fadeOut('slow');
                        $('.betcountdown').delay(1000).fadeOut('slow');
                    }

                    if (NotifyFriendsOfBetForfeit() < 0) {
                        //i have seen that we failed to send messages via SignalR as the signalr connection hasn't been initialised when 
                        //we tried to send the message - so try again if it fails!!!
                        setTimeout("NotifyFriendsOfBetForfeit();", 2000);
                    }

                    remainingforfeits = remainingforfeits - 1;
                    //ran out of forfeits - notify user that they can buy more in the store! chi ching!
                    if (remainingforfeits == 0) {
                        bouncenotification("Purchase more Forfeits from the Store!");
                    }
                    window.sessionStorage.setItem("Currentbet", null);  //Set the sessionStorage Currentbet object
                    var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                    RemoveForfeitBetFromFriendScores(thisUser.fbuserid, tempBet.betid);

                    RemoveUsersForfeitBetFromLeaderboards(thisUser.fbuserid, tempBet.betid);

                    // Edited by Gamal 13/03/2012: Add number of forfeits remaining to message in game tracker
                    if (remainingforfeits > 1) {
                        $('.GameFeedInfo').prepend("<span class='losetext'>FORFEIT - CREDITS LOST - " + remainingforfeits + " forfeits left!</span><br />");
                    } else if (remainingforfeits == 1) {
                        $('.GameFeedInfo').prepend("<span class='losetext'>FORFEIT - CREDITS LOST - ONLY " + remainingforfeits + " forfeit left!</span><br />");
                    } else {
                        $('.GameFeedInfo').prepend("<span class='losetext'>FORFEIT - CREDITS LOST - NO forfeits left!</span><br />");
                    }
                    $('#' + displaymode + '_bubble' + Currentbet.eventid).removeClass("bubble_active");
                    $('#' + displaymode + '_bubble' + Currentbet.eventid).addClass("bubble");

                    var displayOdds;
                    if (tempBet.newodds) {
                        //if Currentbet.newodds is set it means that the odds we bet on are no longer the odds given for this bet 
                        //so ..display the new odds
                        displayOdds = Math.round(tempBet.newodds);
                    }
                    else {
                        displayOdds = Math.round(tempBet.odds);
                    }

                    $('#' + displaymode + '_bubble' + tempBet.eventid).html("" + displayOdds + "/1");

                    $('#' + displaymode + '_forfeitnum').html(remainingforfeits);
                    _gaq.push(['_trackEvent', 'Clicks', 'Forfeit']);
                }
                else if (tempBet.status == -1) {
                    //bet was NOT forfeited successfully due to bet freeze
                    //alert("Too late to forfeit - Waiting for the LiveGames referee's decision!!");
                    if (displaymode == "w") {

                        $('#' + displaymode + '_predictionpending').html("<strong>Too late to forfeit - Waiting for the LiveGames referee's decision!</strong>!");
                        $('#' + displaymode + '_predictionpending').show();
                        $('.tooltip-shade').show();
                        $('.betcountdown').show();
                        $('.betcountdown').delay(2500).fadeOut('slow');
                        $('.tooltip-shade').delay(2500).fadeOut('slow');
                    }
                    else if (displaymode == "m") {
                        $('.popup-notify > h1').text("Too late to forfeit - Waiting for the LiveGames referee's decision!");
                        $('.popup-notify > span').text("");
                        $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
                    }
                }
                else {
                    //bet was NOT forfeited successfully
                    $('.GameFeedInfo').prepend("We were unable to forfeit your prediction - please try again.<br />");
                    $('.forfeitclick').show();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                AjaxFail("forfeitBet", XMLHttpRequest, textStatus, errorThrown);
            }
        });

    }
    catch (ex) {
        logError("placeBet", ex);
    }
}


//AjaxFail("LogUserDetailsV1", XMLHttpRequest, textStatus, errorThrown);
function AjaxFail(CallerFunctionName, XMLHttpRequest, textStatus, errorThrown) 
{
    var errorDesc = "status: " + XMLHttpRequest.status + ";" + " response-text:" + XMLHttpRequest.responseText;
    if( (CallerFunctionName) ) {
        logError("AjaxFail : " + CallerFunctionName, errorDesc);
    }
}

//this function allows other processes to update window.sessionStorage.getItem("listOfFriendsScores")
function FinishedProcessingFriendScores() 
{
    FriendScoresUpdating = 0;
}

//this is an updated version of RemoveForfeitBetFromFriendScores
//we now update the bet in listOfFriendsBets instead of listOfFriendsScores.
//once its updated in listOfFriendsBets we call UpdateFriendScoresWithBetResult to update listOfFriendsScores
function RemoveForfeitBetFromFriendScores(friendID, BetID) {
    try {

        var LogInMethod;
        try {
            LogInMethod = window.sessionStorage.getItem("lim");
        } catch (ex) { }
         
        if (LogInMethod != 2) { //dont do this if the login method was email!!!
                        var listOfFriendsBets_temp;
                        try {
                            listOfFriendsBets_temp = window.sessionStorage.getItem("listOfFriendsBets");
                        } catch (TempEx) { }

                        var listOfFriendsBets;
                        var updated = 0;
                        var scoresUpdated = 0;
                        var newBalance;

                        if (typeof (listOfFriendsBets_temp) != 'undefined' && listOfFriendsBets_temp != null && listOfFriendsBets_temp != "") {
                            listOfFriendsBets = typeof listOfFriendsBets_temp != 'object' ? JSON.parse(listOfFriendsBets_temp) : listOfFriendsBets_temp;
                        }

                        if (listOfFriendsBets) {
                            for (var i = 0; i <= listOfFriendsBets.length - 1; i++) {
                                if (listOfFriendsBets[i].betid == BetID) {
                                    //we have found the bet that has been forfeit!!!! 
                                    listOfFriendsBets[i].status = -103; //forfeit
                                    newBalance = UpdateFriendScoresWithBetResult(listOfFriendsBets[i]);
                                    scoresUpdated = 1;
                                    updated = 1;
                                    break;
                                }
                            }
                        }
                        else {
                            listOfFriendsBets = new Array();
                            scoresUpdated = 1; //it's now an empty array
                        }

                        //now update the friendsList in sessionStorage

                        if (scoresUpdated == 1) {
                            window.sessionStorage.setItem("listOfFriendsBets", $.toJSON(listOfFriendsBets)); //moved this line here when commented out the code above which adds a user with no name to the list

                            newBalance = newBalance + ""; //force this to be a string - so we can do the indexOf
                            if (newBalance.indexOf("sameasbefore") >= 0) {
                                //we updated the bet object - but did NOT change the score (this can happen after a void/loss if we updated our score list AFTER the bet was made) then we dont want to update the ticker
                                ReOrderFriendsScoresBasedOnCurrentScore("BetObjectUpdatedButScoreNotChanged");

                                var theseDetails = newBalance.split(":");
                                var correctBalanceAccordingToFriendsList = theseDetails[1];

                                //we still want to update the leaderboard even though we did not update the score in the friendslaeaderboard
                                //this is because on the web view the two leaderboards may be out of sync as we update each one individually when the user click to view 
                                //them!!!!!
                                UpdateLeaderboardWithNewBalance(friendID, correctBalanceAccordingToFriendsList);
                            }
                            else {
                                ReOrderFriendsScoresBasedOnCurrentScore();
                                //now that we have set our friends balance correctly in the friends list - we need to update it in the overall leaderboard ( if the friend is there of course)
                                UpdateLeaderboardWithNewBalance(friendID, newBalance);
                            }
                        }
                    }

        } //end login method check
       
    catch (ex) {
        logError("RemoveForfeitBetFromFriendScores", ex);
    }
}

//this function allows other processes to update window.sessionStorage.getItem("listOfFriendsScores")
function FinishedProcessingFriendScores() {
    FriendScoresUpdating = 0;
    //window.sessionStorage.setItem("FriendScoresUpdating", 0);
}

//the below version of RemoveForfeitBetFromFriendScores is WRONG!!!!!
//update leaderboards with users forfeit 
function RemoveUsersForfeitBetFromLeaderboards(userid, BetID) 
{
    try 
    {
        var friendScores;
        var updated = 0;
        var scoresUpdated = 0;
        var newBalance;

        try {
            friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
        }
        catch (e2) {
        }

        if (friendScores) {
            for (var i = 0; i <= friendScores.length - 1; i++) {
                if (friendScores[i].F == userid) {
                    //this is the user in the list
                    if ((friendScores[i].B) && (friendScores[i].B.betid == BetID)) 
                    {
                        //we have found the bet that has been forfeit!!!! 
                        friendScores[i].B.status = -103; //forfeit
                        //UpdateFriendScoresWithBetResult(friendScores[i].CurrentBet); 

                        //the bet has been forfeit - so - just like a loss - they lose their credits!!!
                        var addamount = parseInt(friendScores[i].B.addamount);
                        if (addamount == 0) //dont subtract the amount bet if addamount == 1
                        {
                            friendScores[i].S = parseInt(friendScores[i].S) - parseInt(friendScores[i].B.amount);
                        } //else - leave score as is
                        newBalance = friendScores[i].S;
                        //now that we have set our friends balance correctly in the friends list - we need to update it in the overall leaderboard ( if the friend is there of course)
                        //UpdateLeaderboardWithNewBalance(friendID, friendScores[i].Credits);

                        scoresUpdated = 1;
                        updated = 1;
                        break;
                    }
                }
            }
        }
        else {
            friendScores = new Array();
            scoresUpdated = 1; //it's now an empty array
        }

        //now update the friendsList in sessionStorage

        if (scoresUpdated == 1) {
            window.sessionStorage.setItem("listOfFriendsScores", $.toJSON(friendScores)); //moved this line here when commented out the code above which adds a user with no name to the list
            ReOrderFriendsScoresBasedOnCurrentScore();

            //now that we have set our friends balance correctly in the friends list - we need to update it in the overall leaderboard ( if the friend is there of course)
            UpdateLeaderboardWithNewBalance(userid, newBalance);
        }
    }
    catch (ex) {
        logError("RemoveForfeitBetFromFriendScores", ex);
    }
    FinishedProcessingFriendScores();
}


//loop through our friends leaderboard and check if the user making this bet is in our list
//if the user IS in our list - then update the currentbet object with this object
//if the user is NOT in the list - then add this user to the list (although they have to be in the list
function AddBetToFriendScores(friendsBet) 
{
    try {

        //WaitForFriendScoresToFinishProcessing(); //wait until there is no other process updating the friendscores ( these scores are usually updated via a lightStreamer message indicating that a friend has placed a bet)
        var friendScores;
        var updated = 0;
        var scoresUpdated = 0;

        try
        {
             friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
        }
        catch (e2) {
             //don't log here as listOfFriendsScores is usually "" and that throws an error
             //logError("AddBetToFriendScores", ex2);
        }

        if (friendScores) {
            for (var i = 0; i <= friendScores.length - 1; i++) {
                if (friendScores[i].F == friendsBet.user.fbuserid) {
                    //this is the user in the list
                    friendScores[i].B = friendsBet;

                     //no longer do this - only change table scores and positions AFTER event
//                    if ((friendsBet.status == 0) && (friendsBet.betid > 0)) {
//                        //this is an active bet - so update the users credits!!!
//                        friendScores[i].Credits = friendScores[i].Credits - friendsBet.amount;
//                        scoresUpdated = 1;
                    //                    }
                    scoresUpdated = 1;

                    updated = 1;

                    var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                    if (friendScores[i].F != thisUser.fbuserid)
                    {

                        var username = "";
                        if (friendScores[i].U.indexOf("<span") > 0) {
                            username = friendScores[i].U.substring(0, friendScores[i].U.indexOf("<span")).trim();
                        }
                        else {
                            username = friendScores[i].U;
                        }

                        var displaytext = username + " made a prediction";
                        friend_notification(friendScores[i].I, displaytext);
                    }
                    break;
                }
            }
        }
        else {
            friendScores = new Array();
            scoresUpdated = 1; //it's now an empty array
        }

        //no longer do this - we use AddFriendToFriendScores instead 28-11-11
        //        if (updated == 0) {
        //            //we did not update the bet - this must mean that the userid was not in the list - so add the user
        //            var tempLeaderboardItem = new Leaderboard();
        //            tempLeaderboardItem.F = friendsBet.user.fbuserid;
        //            tempLeaderboardItem.Credits = 0; //as user has just joined the game their credits will be 0
        //            friendScores.push(tempLeaderboardItem);
        //        }

        //now update the friendsList in sessionStorage

        if (scoresUpdated == 1) {
            window.sessionStorage.setItem("listOfFriendsScores", $.toJSON(friendScores)); //moved this line here when commented out the code above which adds a user with no name to the list

            //as we are no longer changing the score when tey place a bet - there is no need to ReOrderFriendsScoresBasedOnCurrentScore
            //just updating the friendScores list is sufficient

            //no - the reason we call this is so we can display an icon showing the user ha made a prediction!!!!!
            ReOrderFriendsScoresBasedOnCurrentScore("BetObjectUpdatedButScoreNotChanged");
        }
    }
    catch (ex) {
        logError("AddBetToFriendScores", ex);
    }
    FinishedProcessingFriendScores();
}


//test - stephen 4-10-2012
function Leaderboard() {
    this.F = "";
    this.S = 0;
    this.U = "";
    this.P = -1;
    this.B = null;
    this.I = ""; //image
}

//removed the contents of AddFriendToFriendScores - stephen 4-10-12
//no longer add a friend to friend scores - a users friends leaderboard
//will update itself after a user has placed a bet
function AddFriendToFriendScores(friendId,friendName,profilePic) {
    try 
    {
        //WaitForFriendScoresToFinishProcessing(); //wait until there is no other process updating the friendscores ( these scores are usually updated via a lightStreamer message indicating that a friend has placed a bet)
        var friendScores;
        try {
            friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
        } catch (TempEx) { }

        if (friendScores == null) {
            friendScores = new Array();
        }

        //here
        var tempLeaderboardItem = new Leaderboard();
        tempLeaderboardItem.F = friendId;
        tempLeaderboardItem.S = 0; //as user has just joined the game their credits will be 0
        tempLeaderboardItem.U = friendName;
        tempLeaderboardItem.I = profilePic; //added profilePic - 30-Nov-12
        if (IsUserAlreadyInFriendsLeaderBoard(friendId) == 0) {
            friendScores.push(tempLeaderboardItem);

            //now update the friendsList in sessionStorage
            window.sessionStorage.setItem("listOfFriendsScores", $.toJSON(friendScores));
            ReOrderFriendsScoresBasedOnCurrentScore();
        }
    }
    catch (ex) 
    {   
        logError("AddFriendToFriendScores", ex);
    }
    FinishedProcessingFriendScores();
}

//test - stephen 4-10-2012
function friend() {
    this.id = "";
    this.name = 0;
}

//we go through the friendlist - and if this friend is not in the list
//then we add them - AND listen out for them
//this will only happen if the friend in question has just joined the game
//for the first time ever (i.e if they had played the game before then we would have put them in our friends list when we fist loaded our friends list!!)
function CheckAndAddFriendToFriendList(friendId,friendName) {
    try 
    {
        var tempFriends;
        try {
            tempFriends = JSON.parse(window.sessionStorage.getItem("facebookfriendlist"));
        } catch (TempEx) { }

        if (tempFriends == null) {
            tempFriends = new Array();
        }

        var weAlreadyHaveTHisFriendInOurList = 0;
        for (var i = 0; i <= tempFriends.length - 1; i++)
        {
            if (tempFriends[i].id == friendId) {
                //this is the friend!!!
                //they are already in our list!!!!
                weAlreadyHaveTHisFriendInOurList = 1;
                break;
            }
        }

        if (weAlreadyHaveTHisFriendInOurList == 0) {
            //this friend is NOT in our list
            //so add them - and then listen to their group!!!
            var newFriend = new friend();
            newFriend.id = friendId;
            newFriend.name = friendName;

            tempFriends.push(newFriend);

            //now update the friendsList in sessionStorage
            window.sessionStorage.setItem("facebookfriendlist", $.toJSON(tempFriends));
            
            //now listen to the group for this friend!!
            var currentUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            liveGamesSignalRConnection.server.joingroup("UBD" + friendId, currentUser.firstname);
        }
    }
    catch (ex) 
    {   
        logError("AddFriendToFriendList", ex);
    }
}

function IsUserAlreadyInFriendsLeaderBoard(fbuserid) {
    try 
    {
        var friendScores;
        try {
            friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
        } catch (TempEx) { }

        if (friendScores == null) {
            return 0; //not in list
        }
        else {
            for (var i = 0; i <= friendScores.length - 1; i++) {

                if (friendScores[i].F == fbuserid) {
                    return 1; //user is already in the list
                }
            }
            return 0; //we have looped through all friends in list and this fbuserid is not there
        }
    }
    catch (ex) {
        logError("IsUserAlreadyInFriendsLeaderBoard", ex);
    }
}

//this function updates friendsScores with their new balance
//it is only used after a user wins a pregamebet
function UpdateFriendScoresWithNewBalance(friendid, newbalance) 
{
    try 
    {
      var friendScores_temp;
      try {
            friendScores_temp = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
      } catch (TempEx) { }

      if (friendScores_temp) 
      {
            //var friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
            var friendScores = typeof friendScores_temp != 'object' ? JSON.parse(friendScores_temp) : friendScores_temp;

            for (var i = 0; i <= friendScores.length - 1; i++) {
                if (friendScores[i].F == friendid) {

                    if (friendScores[i].S != parseInt(newbalance)) //only update if the balance is new!!!
                    {
                        friendScores[i].S = parseInt(newbalance);

                        friendScores[i].B = null;   //a friend of the user has just received a new updated balance
                        //so clear their bet object - [if it exists] -  as the bet object is irrelevant now ( as it was linked to a previous balance)
                        //this scenario should not happen often - but it does seem to have occured at least once
                        //basically we dont want to update the users new balance - and then complete their bet and add the winnings again
                        // ( this could happen if we get the lightstream messages in the wrong order [for whatever reason])

                        window.sessionStorage.setItem("listOfFriendsScores", $.toJSON(friendScores));
                        ReOrderFriendsScoresBasedOnCurrentScore();
                    }
                    break; // we have found the user - now exit the loop
                   
                }
            }
      }
    }
    catch (ex) {
        logError("UpdateFriendScoresWithNewBalance", ex);
    }
  
    UpdateLeaderboardWithNewBalance(friendid, newbalance);
}

function UpdateLeaderboardWithNewBalance(friendid, newbalance) {
    try 
    {
        var leaderboard_temp;
        try {
            leaderboard_temp = JSON.parse(window.sessionStorage.getItem("leaderboard"));
        } catch (ex) { }

        if (leaderboard_temp) 
        {
            //var leaderboard = JSON.parse(window.sessionStorage.getItem("leaderboard"));
            var leaderboard = typeof leaderboard_temp != 'object' ? JSON.parse(leaderboard_temp) : leaderboard_temp;

            for (var i = 0; i <= leaderboard.length - 1; i++) 
            {
                if (leaderboard[i].F == friendid) 
                {
                    if (leaderboard[i].S != parseInt(newbalance)) 
                    {
                        //only make changes if the new score is different from the previous score!!
                        leaderboard[i].S = parseInt(newbalance); 
                        window.sessionStorage.setItem("leaderboard", $.toJSON(leaderboard));

                        //these nexst two lines don't check to see if the user was viewing this league
                        //could display incorrect league if multi leagues are in use
                        //$('.LeagueLeaderboard').html(CreateLeagueScoresView2(leaderboard, "ff", true));
                        //refreshScroller(leaderboardScroller, "LeagueLeaderboard");


                        var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                        var currentUser = 0;
                        if (thisUser.fbuserid == leaderboard[i].F) {
                            ReOrderLeaderBoardBasedOnCurrentScore("userJustUpdatedIsCurrentUser");
                            currentUser = 1;
                        }
                        else {
                            ReOrderLeaderBoardBasedOnCurrentScore();
                        }
                        

                        if (userLeague.currentlyShowingDefaultLeague > 0) {
                            //we are currently showing the default league table - i.e we ARE showing the overall scores for the game
                            //so .... if we updated and reordered the league above -  ReOrderLeaderBoardBasedOnCurrentScore 
                            //- the ticker would have been updated with the latest values
                            var v = 1;
                        }
                        else {
                            //however...if we reach here it means the line above -  ReOrderLeaderBoardBasedOnCurrentScore.DisplayTheLeagueTable - updated a league that was NOT
                            //the default overall scores - BUT - there has clearly been a change to the scores (i've forfeited or voided or a friend has forfeited)
                            //this means my score and my position in the ticker may have changed
                            //so if we reach here - we need to update the ticker based on the last OverallScores used!!! ( the last OverallScores would be from the last time we got the table from signalR or the last time we clicked to view the default scores table)

                            //BUT - first we need to update this OverallScores list with the newBalance!!!!!!
                            UpdateTickersLeaderboardWithNewBalance(friendid, newbalance) 
                            if (currentUser == 1) {
                                ReOrderTickersOverallScoresBasedOnCurrentScore("userJustUpdatedIsCurrentUser");
                            }
                            else {
                                ReOrderTickersOverallScoresBasedOnCurrentScore();
                            }
                            SetTickerContent("LeagueStandings_ticker", GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame());
                        }
                        break; // we have found the user - now exit the loop
                    }
                }
            }
        }
    }
    catch (ex) {
        logError("UpdateLeaderboardWithNewBalance", ex);
    }
}


//this is a copy of UpdateLeaderboardWithNewBalance - used for udating the default table that the ticker uses ( in cases when the user is vieing ta league other than the default!!!)_
function UpdateTickersLeaderboardWithNewBalance(friendid, newbalance) {
    try {
        var leaderboard_temp;
        try {
            leaderboard_temp = JSON.parse(lastOverallScoresList);
        } catch (ex) { }

        if (leaderboard_temp) {
            //var leaderboard = JSON.parse(window.sessionStorage.getItem("leaderboard"));
            var leaderboard = typeof leaderboard_temp != 'object' ? JSON.parse(leaderboard_temp) : leaderboard_temp;

            for (var i = 0; i <= leaderboard.length - 1; i++) {
                if (leaderboard[i].F == friendid) {
                    if (leaderboard[i].S != parseInt(newbalance)) {
                        //only make changes if the new score is different from the previous score!!
                        leaderboard[i].S = parseInt(newbalance);
                        lastOverallScoresList =  $.toJSON(leaderboard);
                        break; // we have found the user - now exit the loop
                    }
                }
            }
        }
    }
    catch (ex) {
        logError("UpdateTickersLeaderboardWithNewBalance", ex);
    }
}



//function UpdateLeaderboardWithNewBalance(friendid, newbalance) {
//    try {
//        var leaderboard_temp;
//        try {
//            leaderboard_temp = window.sessionStorage.getItem("leaderboard");
//        } catch (ex) { }

//        if (leaderboard_temp) {
//            //var leaderboard = JSON.parse(window.sessionStorage.getItem("leaderboard"));
//            var leaderboard = typeof leaderboard_temp != 'object' ? JSON.parse(leaderboard_temp) : leaderboard_temp;

//            for (var i = 0; i <= leaderboard.length - 1; i++) {
//                if (leaderboard[i].F == friendid) {
//                    leaderboard[i].S = parseInt(newbalance);
//                    window.sessionStorage.setItem("leaderboard", $.toJSON(leaderboard));

//                    //these nexst two lines don't check to see if the user was viewing this league
//                    //could display incorrect league if multi leagues are in use
//                    //$('.LeagueLeaderboard').html(CreateLeagueScoresView2(leaderboard, "ff", true));
//                    //refreshScroller(leaderboardScroller, "LeagueLeaderboard");
//                    ReOrderLeaderBoardBasedOnCurrentScore(); //replace the above 2 lines with this new function - 23-Jan-11

//                    if (userLeague.currentlyShowingDefaultLeague > 0) {
//                        //we are currently showing the default league table - i.e we ARE showing the overall scores for the game
//                        //so .... if we updated and reordered the league above -  ReOrderLeaderBoardBasedOnCurrentScore 
//                        //- the ticker would have been updated with the latest values
//                    }
//                    else {
//                        //however...if we reach here it means the line above -  ReOrderLeaderBoardBasedOnCurrentScore.DisplayTheLeagueTable - updated a league that was NOT
//                        //the default overall scores - BUT - there has clearly been a change the the scores (i've forfeited or voided or a friend has forfeited)
//                        //this means my score and my position in the ticker may have changed
//                        //so if we reach here - we need to update the ticker based on  
//                    }



//                    break; // we have found the user - now exit the loop
//                }
//            }
//        }
//    }
//    catch (ex) {
//        logError("UpdateLeaderboardWithNewBalance", ex);
//    }
//}


function ReOrderLeaderBoardBasedOnCurrentScore(userJustUpdatedIsCurrentUser) {
    try {
        var Scores = JSON.parse(window.sessionStorage.getItem("leaderboard"));
        var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        var tempScores = new Array();
        var position = 1;
        var ScoreLength = 0;
        if (Scores) {
            ScoreLength = Scores.length;
            while (Scores.length > 0) {
                var highestScorePosition = -1;
                var currentHighestScore = -100000000; //no user should ever have a score this low!!!!!
                for (var i = 0; i <= Scores.length - 1; i++) {
                    if (Scores[i].S > currentHighestScore) {
                        currentHighestScore = Scores[i].S;
                        highestScorePosition = i;
                    }
                }
                //when we reach the end of the above loop we will know the location of the highest score in the loop


                //the if below basically says - if the user playing this game is at the bottom of the list - and they've just had an event that has updated their scores
                //then we dont know for sure what there postion is going to be ( cos we only have the top 20 positions and if your're score has changed then somebosy else's may also
                //have changed - this function generally gets called after forfeits so it's when a user has LOST credits - thats why - if you're score has been updated
                //then you will most likely have dropeed a few positions!!!!
                if (
                    (Scores.length == 1) //this is the last user in the list
                    && //and 
                    (
                        //we dont know the position of the person at the bottom of the list ( this can happen as we append the user playing the gaem at the bottom)
                        (
                            (Scores[0].P == "") //we dont know the position
                            ||
                            (Scores[0].P == "?") //OR we dont know the position
                            ||
                            (Scores[0].P > ScoreLength)  //Or the position is greater than the list length
                        )
                    || // or - the person at the bottom IS the user playing - and they've also just updated (so we dont know their new position now)
                       (
                          //
                          (Scores[0].F == thisUser.fbuserid) && (userJustUpdatedIsCurrentUser)
                       ) 
                    )
                 ) {
                    //this is the last item in the list AND we do not know it's position - so dont give it one now!!!!!!
                    //sometimes the user playing the game is appended to the bottom of the list without a number ( as we know their score [from the friends leaderboard] - but we do not know their position
                    if (userJustUpdatedIsCurrentUser) {
                        Scores[highestScorePosition].P = ""; // Scores[0].P; the users previous position is may NOT be the same now as their score has changed 
                    }
                    else {
                        //the user playing the game Is at the bottom BUT - their score hasn't changed - someone above them doesn;t affect their position!
                        Scores[highestScorePosition].P = Scores[0].P;
                    }
                }
                else {
                    Scores[highestScorePosition].P = position;
                }

              
                position = position + 1;
                tempScores.push(Scores[highestScorePosition]); //this adds the friend with the highest score to the new array
                Scores.splice(highestScorePosition, 1); //now remove the highest item from the list and do the loop again!!!!
            }
            //when we reach here we should have removed all items from Scores and added them to tempScores
            window.sessionStorage.setItem("leaderboard", $.toJSON(tempScores));

            userLeague.DisplayTheLeagueTable($.toJSON(tempScores), userLeague.id, userLeague.name, null, userLeague.creater_Id, userLeague.num_MembersInLeague);

            //now reDisplay the correct list
            //$('#' + displaymode + '_LeagueLeaderboard').html(userLeague.DisplayFriendsLeaderBoard(tempScores, "ff", true));
            //refreshScroller(leaderboardScroller, displaymode + "_LeagueLeaderboard");
        }
    }
    catch (ex) {
        logError("ReOrderLeaderBoardBasedOnCurrentScore", ex);
    }
}



//the below function is not finished yet!!!
//this function is a copy of ReOrderLeaderBoardBasedOnCurrentScore ( the function above)
//the difference is that this function runs on hte default league - not any other league
//it is only run after we have run UpdateLeaderboardWithNewBalance on a league which is NOT the default league
//we run this as we need to update the ticker!!!!!!
function ReOrderTickersOverallScoresBasedOnCurrentScore(userJustUpdatedIsCurrentUser) {
    try {
        //lastOverallScoresList is going to hold the default scores list we used the last time we wrote to the ticker
        //we update this every time we show the overall scores - and every time we receive the latest overall scores from SignalR
        //but what happens when the user is NOT in the message from SignalR
        var Scores = typeof lastOverallScoresList != 'object' ? JSON.parse(lastOverallScoresList) : lastOverallScoresList;

        var tempScores = new Array();
        var position = 1;
        var ScoreLength = 0;
        if (Scores) {
            while (Scores.length > 0) {
                var highestScorePosition = -1;
                var currentHighestScore = -100000000; //no user should ever have a score this low!!!!!
                for (var i = 0; i <= Scores.length - 1; i++) {
                    if (Scores[i].S > currentHighestScore) {
                        currentHighestScore = Scores[i].S;
                        highestScorePosition = i;
                    }
                }
                //when we reach the end of the above loop we will know the location of the highest score in the loop

                if (
                    (Scores.length == 1)
                    &&
                    ((Scores[0].P == "") || (Scores[0].P == "?") || (Scores[0].P > ScoreLength))
                 ) {
                    //this is the last item in the list AND we do not know it's position - so dont give it one now!!!!!!
                    //sometimes the user playing the game is appended to the bottom of the list without a number ( as we know their score [from the friends leaderboard] - but we do not know their position

                    if (userJustUpdatedIsCurrentUser) {
                        Scores[highestScorePosition].P = ""; // Scores[0].P; the users previous position is may NOT be the same now as their score has changed 
                    }
                    else {
                        Scores[highestScorePosition].P = Scores[0].P;
                    }


                }
                else {
                    Scores[highestScorePosition].P = position;
                }

                position = position + 1;
                tempScores.push(Scores[highestScorePosition]); //this adds the friend with the highest score to the new array
                Scores.splice(highestScorePosition, 1); //now remove the highest item from the list and do the loop again!!!!
            }
            //when we reach here we should have removed all items from friendScores and added them to tempScores
            lastOverallScoresList = $.toJSON(tempScores);
        }
    }
    catch (ex) {
        logError("ReOrderTickersOverallScoresBasedOnCurrentScore", ex);
    }
}


//this function checks if we've won a pregame bet and then sends a mesage to all our friends with our new balance
//this function is no longer used!!!
function UpdateFriendScoresWithNewCredit(fixtureid,PreGameBetOptionID,amount,fbuserid,won) {
    try
    {
        var listOfAlreadyReceivedPreGameBetOptionDetails;
        try {
            listOfAlreadyReceivedPreGameBetOptionDetails = window.sessionStorage.getItem("listOfAlreadyReceivedPreGameBetOptionDetails");
        } catch (ex) { }

        var firstTimeReceivingThisUpdate = 1;
        var UpdateIdentifier = fixtureid + "-" + PreGameBetOptionID + "-" + fbuserid;

        if (typeof (listOfAlreadyReceivedPreGameBetOptionDetails) != 'undefined' && listOfAlreadyReceivedPreGameBetOptionDetails != null && listOfAlreadyReceivedPreGameBetOptionDetails != "") {
            listOfAlreadyReceivedPreGameBetOptionDetails = JSON.parse(window.sessionStorage.getItem("listOfAlreadyReceivedPreGameBetOptionDetails"));

            for (var i = 0; i <= listOfAlreadyReceivedPreGameBetOptionDetails.length - 1; i++)
            {
                if (listOfAlreadyReceivedPreGameBetOptionDetails[i] == UpdateIdentifier) 
                {
                    firstTimeReceivingThisUpdate = 0; //we have received this update before!!
                    break;
                }
            }
        }
        else {
            listOfAlreadyReceivedPreGameBetOptionDetails = new Array();
        }

        if (firstTimeReceivingThisUpdate == 1) 
        {
            listOfAlreadyReceivedPreGameBetOptionDetails.push(UpdateIdentifier); //we have not received thisupdate before ..so add it to the list
            var friendScores;
            try {
                friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
            } catch (ex) { }

            if (friendScores) {
                for (var i = 0; i <= friendScores.length - 1; i++) {
                    if (friendScores[i].F == fbuserid) {
                        var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                        if (won == 1) 
                        {
                            friendScores[i].S = parseInt(friendScores[i].S) + parseInt(amount);

                            if (friendScores[i].F == uiUser.fbuserid) {
                                //this is an update for the user playing the game!!!!!
                                //they have just won - so we need to send a mesage to their friends with the new balance
                                NotifyFriendsOfNewBalanceForThisGame(fixtureid, uiUser.fbuserid, friendScores[i].S);
                            }
                        }
                        else {
                            friendScores[i].S = parseInt(friendScores[i].S) - parseInt(amount);
                        }

                       

                        window.sessionStorage.setItem("listOfFriendsScores", $.toJSON(friendScores));
                        ReOrderFriendsScoresBasedOnCurrentScore();
                        break; // we have found the user - now exit the loop
                    }
                }
            }
        }
        window.sessionStorage.setItem("listOfAlreadyReceivedPreGameBetOptionDetails", $.toJSON(listOfAlreadyReceivedPreGameBetOptionDetails));
    }
    catch (ex) {
        logError("UpdateFriendScoresWithNewCredit", ex);
    }
}

//updated this function - Stephen 4-May-11 - we now return the friends new score
function UpdateFriendScoresWithBetResult(updatedBet) {
    try {
        var FriendsNewScore = "";
        var tempNewScore = 0;
        var friendScores;
        try {
           friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
        } catch (ex) { }

        if (friendScores) {
            for (var i = 0; i <= friendScores.length - 1; i++) {
                if ( (friendScores[i].B) && (friendScores[i].B.betid == updatedBet.betid) ){
                    //this is the bet in the list
                    var addamount = parseInt(friendScores[i].B.addamount);
                    friendScores[i].B = updatedBet; //update the bet object

                    //now update the score in the leaderboard
                    if (updatedBet.status == 1) {
                        //bet was won - increment the users score for this game
                        //var winnings = parseInt(updatedBet.creditsearned) + parseInt(updatedBet.amount); no longer do this way

                        var winnings;
                        if (addamount == 1) {
                            winnings = parseInt(updatedBet.creditsearned) + parseInt(updatedBet.amount);
                        }
                        else {
                            winnings = parseInt(updatedBet.creditsearned) ;
                        }

                        friendScores[i].S = parseInt(friendScores[i].S) + winnings;

                        //try{
                        //    var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                        //    if (friendScores[i].F != thisUser.fbuserid) {

                        //        var username = "";
                        //        if (friendScores[i].U.indexOf("<span") > 0) {
                        //            username = friendScores[i].U.substring(0, friendScores[i].U.indexOf("<span")).trim();
                        //        }
                        //        else {
                        //            username = friendScores[i].U;
                        //        }

                        //        var displaytext = username + " made a prediction";
                        //        friend_notification(friendScores[i].I, displaytext);
                        //    }
                        //} catch (ex) { }

                    }
                    else if (updatedBet.status == -1) {
                        //bet was lost - decrement the users score for this game
                        if (addamount == 0) //dont subtract the amount bet if addamount == 1
                        {
                            tempNewScore = parseInt(friendScores[i].S) - parseInt(updatedBet.amount)
                            if (tempNewScore != friendScores[i].S) {
                                //the score HAS been updated from what we have in our list - so update it!!!
                                friendScores[i].S = tempNewScore;
                            }
                            else {
                                //the score has NOT been updated - so return notification of this - and the current (and correct) score
                                FriendsNewScore = "sameasbefore:" + friendScores[i].S;
                            }
                            //friendScores[i].S = parseInt(friendScores[i].S) - parseInt(updatedBet.amount);
                        }
                        else {
                            FriendsNewScore = "sameasbefore:" + friendScores[i].S; //if a user loses or forfeits - we may not need to change the score - depending on when we loaded the score
                        }
                    }
                    else if (updatedBet.status == -102) {
                        //bet was void - give the user back their bet amount
                        if (addamount == 1) //dont subtract the amount bet if addamount == 1
                        {
                            friendScores[i].S = parseInt(friendScores[i].S) + parseInt(updatedBet.amount);
                        }
                        //else - leave score as is
                    }
                    else if (updatedBet.status == -103) 
                    {
                        //the bet has been forfeit - so - just like a loss - they lose their credits!!!
//                        if (addamount == 0) //dont subtract the amount bet if addamount == 1
//                        {
//                            friendScores[i].S = parseInt(friendScores[i].S) - parseInt(updatedBet.amount);
//                        }

                        if (addamount == 0) //dont subtract the amount bet if addamount == 1
                        {
                            tempNewScore = parseInt(friendScores[i].S) - parseInt(updatedBet.amount)
                            if (tempNewScore != friendScores[i].S) {
                                //the score HAS been updated from what we have in our list - so update it!!!
                                friendScores[i].S = tempNewScore;
                            }
                            else {
                                //the score has NOT been updated - so return notification of this - and the current (and correct) score
                                FriendsNewScore = "sameasbefore:" + friendScores[i].S;
                            }
                        }
                        else {
                            FriendsNewScore = "sameasbefore:" + friendScores[i].S; //if a user loses or forfeits - we may not need to change the score - depending on when we loaded the score
                        }
                    }
                    if (FriendsNewScore.indexOf("sameasbefore") < 0) 
                    {
                        FriendsNewScore = friendScores[i].S;
                    }
                    break;
                }
            }
            //now update the friendsList in sessionStorage
            window.sessionStorage.setItem("listOfFriendsScores", $.toJSON(friendScores));
        }
    }
    catch (ex) {
        logError("UpdateFriendScoresWithBetResult", ex);
    }
    FinishedProcessingFriendScores();
    return FriendsNewScore;
}

function ReOrderFriendsScoresBasedOnCurrentScore(BetObjectUpdatedButScoreNotChanged)
{
    try
    {
        var friendScores;
        try {
            friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
        } catch (ex) { }

        var tempScores = new Array();
        var position = 1;
        if (friendScores) {
            while (friendScores.length > 0) {
                var highestScorePosition = -1;
                var currentHighestScore = -100000000; //no user should ever have a score this low!!!!!
                for (var i = 0; i <= friendScores.length - 1; i++) {
                    if (friendScores[i].S > currentHighestScore) {
                        currentHighestScore = friendScores[i].S;
                        highestScorePosition = i;
                    }
                }
                //when we reach the end of the above loop we will know the location of the highest score in the loop
                friendScores[highestScorePosition].P = position;
                position = position + 1;
                tempScores.push(friendScores[highestScorePosition]); //this adds the friend with the highest score to the new array
                friendScores.splice(highestScorePosition, 1); //now remove the highest item from the list and do the loop again!!!!
            }
            //when we reach here we should have removed all items from friendScores and added them to tempScores
            window.sessionStorage.setItem("listOfFriendsScores",  $.toJSON(tempScores));

            //now reDisplay the correct list
            $('.FriendsLeaderboard').html(userLeague.DisplayFriendsLeaderBoard(tempScores, "ff", true));
            refreshScroller(friendsScoreScroller, "FriendsLeaderboard");

            if (!BetObjectUpdatedButScoreNotChanged) {
                SetTickerContent("friendDetails_ticker");
            }
        }
    }
    catch (ex) {
        logError("ReOrderFriendsScoresBasedOnCurrentScore", ex);
    }
}


//this function goes through the friends leaderboard untill it finds the users score
//it then appends this score to the end of the overall leaderboard table if the user is not already in it
//we do this as we can't personlise the league table data that we send out after an event
function AddMyScoreToOverAllLeaderBoard(totalUsersInLeague,AddingToTickersLEagueInfo) 
{
    try 
    {
        var friendScores_temp;
        var thisUser_temp;

        try 
        {
            friendScores_temp = window.sessionStorage.getItem("listOfFriendsScores");
        } catch (ex) { }

        try 
        {
            thisUser_temp = window.sessionStorage.getItem("facebookuser");
        } catch (ex) { }

        if ( (friendScores_temp) && (thisUser_temp) )
        {
            var friendScores = typeof friendScores_temp != 'object' ? JSON.parse(friendScores_temp) : friendScores_temp;
            var thisUser = typeof thisUser_temp != 'object' ? JSON.parse(thisUser_temp) : thisUser_temp;
            var thisUsersScoreObject;


            for (var i = 0; i <= friendScores.length - 1; i++) 
            {
                if (friendScores[i].F == thisUser.fbuserid) 
                {
                    //this is the object relating to the user playing the game's score!!!!
                    thisUsersScoreObject = friendScores[i];
                    break;
                }
            }

            if (thisUsersScoreObject) 
            {
                //we have the users score - now loop through the overall leaderboard and see if the user is in the overall leaderboard
                //if not - then append the user to the leaderboard!!!
                var leaderboard;
                try {
                    //leaderboard = JSON.parse(window.sessionStorage.getItem("leaderboard"));
                    var sessionLeaderboard;

                    if (AddingToTickersLEagueInfo) {
                        sessionLeaderboard = lastOverallScoresList;
                    }
                    else {
                        sessionLeaderboard = JSON.parse(window.sessionStorage.getItem("leaderboard"));
                    } 
                    leaderboard = typeof sessionLeaderboard != 'object' ? JSON.parse(sessionLeaderboard) : sessionLeaderboard; 
                } catch (ex) { }

                //var templeaderboard = JSON.parse(window.sessionStorage.getItem("leaderboard"));
                //var leaderboard = JSON.parse(templeaderboard); //remove this after  web 11 jan test

                var thisUserInOverAllLeaderboard = 0;
                if (leaderboard) 
                {
                    for (var i = 0; i <= leaderboard.length - 1; i++) 
                    {
                        if (leaderboard[i].F == thisUser.fbuserid) 
                        {
                            thisUserInOverAllLeaderboard = 1;
                            break; // we have found the user - now exit the loop
                        }
                    }

                    if (thisUserInOverAllLeaderboard == 0)
                    {
                        //the user playing the game is NOT in the overall leaderboard
                        //so add him!!!
                        thisUsersScoreObject.P = "";
                        leaderboard.push(thisUsersScoreObject);

                        if (AddingToTickersLEagueInfo) {
                            lastOverallScoresList = $.toJSON(sessionLeaderboard);
                        }
                        else {
                            window.sessionStorage.setItem("leaderboard", $.toJSON(leaderboard));
                        } 

                        if (totalUsersInLeague) {
                            userLeague.DisplayTheLeagueTable(leaderboard, thisFixture.defaultleagueid, thisFixture.defaultleaguename, null, thisFixture.defaultleaguecreator, totalUsersInLeague); 
                        }
                        else {
                            userLeague.DisplayTheLeagueTable(leaderboard, thisFixture.defaultleagueid, thisFixture.defaultleaguename, null, thisFixture.defaultleaguecreator, 0); 
                        }
                        
                        //$('#' + displaymode + '_leaguestandings_1').html(userLeague.OutputScores(leaderboard, thisFixture.defaultleaguename, thisFixture.defaultleagueid, 0));
                        //refreshScroller(leaderboardScroller, displaymode + "_LeagueLeaderboard");
                    }
                }
            }
        }
    }
    catch (ex) {
        logError("AddMyScoreToOverAllLeaderBoard", ex);
    }
}

//this function checks each friend bet object we have to see if is still active 
//if the bet obj IS still active we compare the eventId with the new LS eventID and then update the bets!!!!!
function updateFriendsBetStatus(eventid, eventUpdateTime, eventEndTime) {
   try 
   {
       var friendbets;
       try {
           friendbets = window.sessionStorage.getItem("listOfFriendsBets");
       } catch (ex) { }

       var friendBetDetails;
       var friendsScoreChanged = 0;

       if (typeof (friendbets) != 'undefined' && friendbets != null && friendbets != "") {
            friendBetDetails = typeof friendbets != 'object' ? JSON.parse(friendbets) : friendbets;

            var newFriendFeedHTML = "";

            if (typeof (friendBetDetails) != 'undefined' && friendBetDetails != null) {
                for (var i = 0; i <= friendBetDetails.length - 1; i++) {
                    if (friendBetDetails[i].status == 0)  
                    {
                        //this Bet is active!!!!

                        if (eventid == 12) 
                        {
                            //it's Half-Time - so ...void all bets!!!!!!!!!
                            friendBetDetails[i].status = -102;
                            
                            //no longer output these freind details - so we dont pass the friends name in the bet object
                            //newFriendFeedHTML = newFriendFeedHTML + "<span class='losetext'>" + friendBetDetails[i].user.name + "'s bet was voided [Half-Time]!! </span><br />"

                            UpdateFriendScoresWithBetResult(friendBetDetails[i]);
                            friendsScoreChanged = 1;
                        }
                        else 
                        {
                            //not half-time...so continue updating bets based on if they won,lost or were void
                            var timebetplaced = new Date(friendBetDetails[i].eventtime);

                            var voidTime = new Date();
                            voidTime.setTime(eventUpdateTime.getTime() - (voidOffset * 1000)); // Altered by Gamal 30/03/2012: If bet made after void offset it will be void (No Longer hardcoded 5 seconds value) 
                             //if the bet was made 5 seconds before the event - then the bet will be void

                            if (timebetplaced <= voidTime) { //changed this to less-than/equal-to as this is how the DB computes void time, stephen 12-Jan-12

                                //bet WAS placed before event void time!!
                                if (friendBetDetails[i].eventid == eventid) {
                                    //the bet made has WON!!!!
                                    friendBetDetails[i].status = 1;
                                    //newFriendFeedHTML = newFriendFeedHTML + "<span class='wintext'>" + friendBetDetails[i].user.name + " wins " + friendBetDetails[i].creditsearned + " credits!!! </span><br />";

                                    //no longer output these freind details - so we dont pass the friends name in the bet object
                                    //newFriendFeedHTML = newFriendFeedHTML + "<span class='wintext'>" + friendBetDetails[i].user.name + " wins " + friendBetDetails[i].creditsearned + " credits!!! </span><br />";

                                    UpdateFriendScoresWithBetResult(friendBetDetails[i]); //update the friend score for this game in the friends leaderboard
                                    friendsScoreChanged = 1;

                                    

                                }
                                else {
                                    //the bet made has LOST!!!!
                                    friendBetDetails[i].status = -1;
                                    //newFriendFeedHTML = newFriendFeedHTML + "<span class='losetext'>" + friendBetDetails[i].user.name + " loses " + friendBetDetails[i].amount + " credits!!! </span><br />";

                                    //no longer output these freind details - so we dont pass the friends name in the bet object
                                    //newFriendFeedHTML = newFriendFeedHTML + "<span class='losetext'>" + friendBetDetails[i].user.name + " loses " + friendBetDetails[i].amount + " credits!!! </span><br />";

                                    UpdateFriendScoresWithBetResult(friendBetDetails[i]); //update the friend score for this game in the friends leaderboard
                                    friendsScoreChanged = 1;
                                }
                            }
                            else {//void chnage needed here
                                if (timebetplaced < eventEndTime) {
                                    //the bet is void!!!!!!
                                    friendBetDetails[i].status = -102;
                                    //newFriendFeedHTML = newFriendFeedHTML + "<span class='losetext'>" + friendBetDetails[i].user.name + "'s bet was voided!! </span><br />"

                                    //no longer output these freind details - so we dont pass the friends name in the bet object
                                    //newFriendFeedHTML = newFriendFeedHTML + "<span class='losetext'>" + friendBetDetails[i].user.name + "'s bet was voided!! </span><br />"

                                    UpdateFriendScoresWithBetResult(friendBetDetails[i]);
                                    friendsScoreChanged = 1;
                                }
                                else {
                                    //if we get in here it means that the friends bet should NOT be updated because
                                    //the friends bet(friendBetDetails[i]) was made after the void time but also AFTER the event was made 
                                    //(this is most likely due to lightstreamer latency)

                                    //This means that the lightstream event we have just received does NOT relate to this bet
                                    //so don't do anything to this bet!!!!!!!
                                    logError("VoidFlow", "not clearing friends bet due to LS latency", "", "");
                                }
                            }
                        } //not half-time
                    } //end of Bet is active!!!!


                } //for loop over - update friendsFeed

                if (friendsScoreChanged == 1) 
                {
                    //WaitForFriendScoresToFinishProcessing(); //wait until there is no other process updating the friendscores ( these scores are usually updated via a lightStreamer message indicating that a friend has placed a bet)  
                    ReOrderFriendsScoresBasedOnCurrentScore();
                    FinishedProcessingFriendScores();
                }
                //if (Config.displayFriendsDetals == "1") {
                if (displayFriendsDetals == "1") {
                    $('.FriendFeedInfo').prepend(newFriendFeedHTML);
                }
            } //if (typeof (friendBetDetails) != 'undefined' && friendBetDetails != null) {
            else {
                friendBetDetails = new Array(); //do this so we don't leave a null object in the listOfFriendsBets sessionStorage object
            }
        } // if (typeof (friendbets) != 'undefined' && friendbets != null && friendbets != "") {
        else {
            friendBetDetails = new Array(); //do this so we don't leave a null object in the listOfFriendsBets sessionStorage object
        }
        //update sessionstorage
        window.sessionStorage.setItem("listOfFriendsBets", $.toJSON(friendBetDetails));
   } //end try
   catch (ex) {
       logError("updateFriendsBetStatus", ex);
   }
} //end updateFriendsBetStatus


function GetEventFromEventDescription(EventDescription) 
{
    try
    {
//        var startPos = EventDescription.indexOf("</span> ");
//        var Event = EventDescription.substring(startPos + 8);
//        var endPos = Event.indexOf(" ");
//        if (endPos == -1){ //this must be a throw
//            endPos = Event.indexOf("-");
//        }
//        Event = Event.substring(0, endPos);
        //        return Event;
        var startPos = 0;
        var Event;
        var endPos = EventDescription.indexOf(" ");
        if (endPos == -1) { //this must be a throw
            endPos = EventDescription.indexOf("-");
        }
        Event = EventDescription.substring(0, endPos);
        return Event;
    }
    catch(ex)
    {
        logError("GetEventFromEventDescription", ex);
        return '';
    }
}

//this function checks the bet status by checking the local bet object against the eventid passed from the Lightstreamer
function checkBetStatusNew(eventid, eventUpdateTime, eventEndTime) {
   try 
   {
       try {
           Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
       } catch (ex) { }

       if (Currentbet == null) {
           //the user either has no current bet . therefore there is no bet to check in DB
           return false;
       }
       //else if (Currentbet.status == -102) {
       //    //the users bet was voided when we got a freeze - but we did not write out to the game tracker( just in case we recevied a thaw!!!)
       //    //so....now that we HAVE received a message - display the void - and then clear the currentbet from session storage!!!!
       //    DoBetVoidLogic();
       //}
       else if ( (Currentbet.status != 0) &&  (Currentbet.status != -102) )
       {
           //the user  has a bet and it is not pending - therefore there is no bet to check in DB

           //updated this Stephen 26-Nov-11
           //after each event we should have NO currentbet object in session storage - so clear the currentbet from session storage!!!!
           window.sessionStorage.setItem("Currentbet", null);
           return false;
       }
       else {
           var newFeedHTML = "";
           var timebetplaced = new Date(Currentbet.eventtime);
           var voidTime = new Date();
           voidTime.setTime(eventUpdateTime.getTime() - (voidOffset * 1000)); // Altered by Gamal 30/03/2012: If bet made after void offset it will be void (No Longer hardcoded 5 seconds value) 
             //if the bet was made 5 seconds before the event - then the bet will be void

           //void time is EXACTLY Void Offset before the event

           if (timebetplaced <= voidTime) { //changed this to less-than/equal-to as this is how the DB computes void time, stephen 2-Dec-11
               //bet WAS placed before event void time!!
               if (Currentbet.eventid == eventid) {
                   //the bet we made has WON!!!!
                   $('.forfeitclick').hide(); //bet has just been completed ..so hide the forfeit button

                   // Added by Gamal 12/03/2012: Close forfeit popup if an event occurred
                   closeforfeitpopup(); 

                   var winnings = Math.round((Currentbet.amount * Currentbet.odds) + Currentbet.amount);
                   //newFeedHTML = "<span class='wintext'>BET WON!!!! You win " + winnings + " credits!</span><br />";
                   newFeedHTML = "<span class='wintext'>You win " + winnings + " credits!</span><br />";
                   Currentbet.status = 1;
                   Currentbet.creditsearned = Math.round(Currentbet.amount * Currentbet.odds);

                   uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                   uiUser.credits = uiUser.credits + winnings;
                   window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                   $('.credits').html(uiUser.credits);
                   playsound("win");

                   ////fade in a popup overlay over the pitch to display result
                   //if (eventid == 4 || eventid == 6) {

                        //Added by Gamal: 26/03/2012: Hide Menu when a notification arrives
                   try {
                       slider(0);
                   } catch (tempEX) { }
                        
                        $('.popup-notify > h1').text("WIN!");
                        $('.popup-notify > span').text("You won " + winnings + " credits!");
                        $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);

                   //}

                   UpdateFriendScoresWithBetResult(Currentbet); //as the user is also in their friends score board then we need to update the friend leaderboard
                   
                   //WaitForFriendScoresToFinishProcessing(); //wait until there is no other process updating the friendscores ( these scores are usually updated via a lightStreamer message indicating that a friend has placed a bet)
                   ReOrderFriendsScoresBasedOnCurrentScore();
                   FinishedProcessingFriendScores();

                   _gaq.push(['_trackEvent', 'Bets', 'Win', GetEventFromEventDescription(Currentbet.eventdesc), parseInt(winnings)]);
               }
               else {
                   //the bet we made has LOST!!!!
                   $('.forfeitclick').hide(); //bet has just been completed ..so hide the forfeit button

                   // Added by Gamal 12/03/2012: Close forfeit popup if an event occurred
                   closeforfeitpopup();

                   //newFeedHTML = "<span class='losetext'>BET LOST!!!!!!!</span><br />";
                   newFeedHTML = "<span class='losetext'>YOU LOSE!!!!!!!</span><br />";
                   Currentbet.status = -1;
                   playsound("lose");

                   UpdateFriendScoresWithBetResult(Currentbet);

                   ////fade in a popup overlay over the pitch to display result
                   //if (eventid == 4 || eventid == 6) {

                       //Added by Gamal: 26/03/2012: Hide Menu when a notification arrives
                   try {
                       slider(0);
                   } catch (tempEX) { }

                        $('.popup-notify > h1').text("LOSE!");
                        $('.popup-notify > span').text("You lost " + Currentbet.amount + " credits!");
                        $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);

                   //}

                   //WaitForFriendScoresToFinishProcessing(); //wait until there is no other process updating the friendscores ( these scores are usually updated via a lightStreamer message indicating that a friend has placed a bet)
                   ReOrderFriendsScoresBasedOnCurrentScore();
                   FinishedProcessingFriendScores();

                   _gaq.push(['_trackEvent', 'Bets', 'Lose', GetEventFromEventDescription(Currentbet.eventdesc), parseInt(Currentbet.amount)]);
               }
           }
           else {
               //if in here it means the bet was placed AFTER the void time
               //BUT - we need to make sure that the bet was placed BEFORE the eventTime!!!!!!!!!!!!!
               //DoBetVoidLogic(timebetplaced, eventEndTime);
               if ((!timebetplaced) || (timebetplaced < eventEndTime)) {
                   //if in here it means that bet WAS placed AFTER the void time AND BEFORE the event was made
                   //event was made less than 5 seconds (or whatever the void offset is) after the bet was placed - so the bet is void!!!
                   $('.forfeitclick').hide(); //bet has just been completed ..so hide the forfeit button

                   // Added by Gamal 12/03/2012: Close forfeit popup if an event occurred
                   closeforfeitpopup();


                   newFeedHTML = "<span class='losetext'>CREDITS RETURNED - PREDICTION WAS TOO LATE</span><br />"; //YOU BET TOO LATE
                   uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                   uiUser.credits = uiUser.credits + Currentbet.amount; //give user back the amount they bet
                   window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                   $('.credits').html(uiUser.credits);
                   Currentbet.status = -102;
                   //playsound("void");

                   UpdateFriendScoresWithBetResult(Currentbet);

                   ////fade in a popup overlay over the pitch to display result - Maybe just do it for Goals??
                   // if (eventid == 4 || eventid == 6) {

                   //     $('.popup-notify > h1').text("GOAL!");
                   //     $('.popup-notify').fadeIn(200).delay(5000).fadeOut(200);

                   // }

                   //WaitForFriendScoresToFinishProcessing(); //wait until there is no other process updating the friendscores ( these scores are usually updated via a lightStreamer message indicating that a friend has placed a bet)
                   ReOrderFriendsScoresBasedOnCurrentScore();
                   FinishedProcessingFriendScores();

                   _gaq.push(['_trackEvent', 'Bets', 'Void', GetEventFromEventDescription(Currentbet.eventdesc), parseInt(Currentbet.amount)]);
               }
               else {
                   //if we get in here it means that the user bet should NOT be updated because
                   //the users bet(Currentbet) was made after the void time but also AFTER the event was made 
                   //(this is most likely due to lightstreamer latency)

                   //This means that the lightstream event we have just received does NOT relate to this bet
                   //so return false( don't do any of the below lines as they are all related to clearing the bet details)
                   logError("VoidFlow", "not clearing users bet due to LS latency", "", "");

                   //return false;

                   //no longer return false - instead return a value that tells the calling code that this event does NOT relate to this bet!!!!!!
                   return -200;
               }
           }

           $('#' + displaymode + '_bubble' + Currentbet.eventid).removeClass("bubble_active");
           $('#' + displaymode + '_bubble' + Currentbet.eventid).addClass("bubble");

           var displayOdds;
           if (Currentbet.newodds) {
               //if Currentbet.newodds is set it means that the odds we bet on are no longer the odds given for this bet 
               //so ..display the new odds
               displayOdds = Math.round(Currentbet.newodds);
           }
           else {
               displayOdds = Math.round(Currentbet.odds);
           }

           $('#' + displaymode + '_bubble' + Currentbet.eventid).html("" + displayOdds + "/1");

           //NB JOHN 
           //this prints out if user has won or lost 
           //eg - BET WON!!!! You win 1100 credits!
           var CurrentFeedHTML = $('.GameFeedInfo').html();
           $('.GameFeedInfo').html(newFeedHTML + CurrentFeedHTML); //overwrite everything in this DIV
           refreshScroller(GameFeedScroller, "GameFeedInfo");

           Currentbet.user = uiUser;
           Currentbet.odds = CastToDecimal(Currentbet.odds); //if the odds are an integer - then cast them to decimal

           if (Currentbet.status == -102) {
               //updated this Stephen 26-Nov-11
               //After a void we want to remove the bet object from session storage - because if we get a thaw we then look to see if we have just voided a bet and we then re-initialise the bet
               //that flow is only valid after a freeze/thaw flow ( i.e the admin made an error) - if however we have voided a bet based on an actual game event then we should
               //remove the bet from session storage altogether so we dont get an error if the admin hits thaw.
               window.sessionStorage.setItem("Currentbet", null);
           }
           else {
               window.sessionStorage.setItem("Currentbet", $.toJSON(Currentbet));  //Reset the sessionStorage Currentbet object
           }
           //NotifyFriendsOfBetResult(friendsNotified); - no longer do this - instead each user will have a local list of their friends - they can then each check all their friends bets locally!!

       }
   } //end try
   catch (ex) {
       logError("checkBetStatusNew", ex);
   }
   return 1;
}//end checkbetstatusnew

//added this Stephen 30-Jan-12
function DoBetVoidLogic(timebetplaced, eventEndTime) {
    if ((!timebetplaced) || (timebetplaced < eventEndTime))
    {
        //if in here it means that bet WAS placed AFTER the void time AND BEFORE the event was made
        //event was made less than 5 seconds (or whatever the void offset is) after the bet was placed - so the bet is void!!!
        $('.forfeitclick').hide(); //bet has just been completed ..so hide the forfeit button

        // Added by Gamal 12/03/2012: Close forfeit popup if an event occurred
        closeforfeitpopup();


        newFeedHTML = "<span class='losetext'>CREDITS RETURNED - PREDICTION WAS TOO LATE</span><br />"; //YOU BET TOO LATE
        uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        uiUser.credits = uiUser.credits + Currentbet.amount; //give user back the amount they bet
        window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
        $('.credits').html(uiUser.credits);
        Currentbet.status = -102;
        //playsound("void");

        UpdateFriendScoresWithBetResult(Currentbet);

        ////fade in a popup overlay over the pitch to display result - Maybe just do it for Goals??
        // if (eventid == 4 || eventid == 6) {

        //     $('.popup-notify > h1').text("GOAL!");
        //     $('.popup-notify').fadeIn(200).delay(5000).fadeOut(200);

        // }

        //WaitForFriendScoresToFinishProcessing(); //wait until there is no other process updating the friendscores ( these scores are usually updated via a lightStreamer message indicating that a friend has placed a bet)
        ReOrderFriendsScoresBasedOnCurrentScore();
        FinishedProcessingFriendScores();

        _gaq.push(['_trackEvent', 'Bets', 'Void', GetEventFromEventDescription(Currentbet.eventdesc), parseInt(Currentbet.amount)]);
    }
    else {
        //if we get in here it means that the user bet should NOT be updated because
        //the users bet(Currentbet) was made after the void time but also AFTER the event was made 
        //(this is most likely due to lightstreamer latency)

        //This means that the lightstream event we have just received does NOT relate to this bet
        //so return false( don't do any of the below lines as they are all related to clearing the bet details)
        logError("VoidFlow", "not clearing users bet due to LS latency", "", "");

        //return false;

        //no longer return false - instead return a value that tells the calling code that this event does NOT relate to this bet!!!!!!
        return -200;
    }
}


//this function should be called after we have received an update from Lightstreamer
//It goes to DB and checks if the users bet has been succesfull or not and returns the credits earned (if any)
//we no longer call this function
//function checkBetStatus(callback) {

//    if ((Currentbet == null) || (Currentbet.status != 0)) {
//        //the user either has no current bet ... or has a bet and it is not pending - therefore there is no bet to check in DB
//        return false;
//    }
//    else {
//        //should call control function here ..and call a return JS funtion with the bet object updated with credits earned, new user total credits, and HTML output to display in feed
//        $.ajax({
//            url: WS_URL_ROOT + "/Game/CheckBet",
//            type: "POST",
//            data: JSON.stringify(Currentbet),
//            dataType: "json",
//            contentType: "application/json: charset=utf-8",
//            //success: BetComplete(),
//            success: function (response) {
//                if (callback instanceof Function) {
//                    callback(response);
//                }
//            },
//            error: AjaxFail()
//        });
//    }
//}

//this function is not used anymore!!!!!
//function NotifyFriendsOfBetResult(callback)
//{
//    try {
//        Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
//        $.ajax({
//            url: WS_URL_ROOT + "/Game/NotifyFriendsOfBetResult",
//            type: "POST",
//            data: JSON.stringify(Currentbet),
//            dataType: "json",
//            contentType: "application/json: charset=utf-8",
//            error: function (XMLHttpRequest, textStatus, errorThrown) {
//                AjaxFail("NotifyFriendsOfBetResult", XMLHttpRequest, textStatus, errorThrown);
//            },
//            success: function (response) {
//                if (callback instanceof Function) {
//                    callback(response);
//                }
//            }
//        });
//    }
//    catch (ex) {
//        logError("NotifyFriendsOfBetResult", ex);
//    }
//}

function NotifyFriendsThatUserHasJoinedGame(callback,log) {
    try
    {
        uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        uiUser.currentfixtureid = GetCurrentfixtureID();

          //we notify friends on the server side if the LiveEvent is LightStreamer
//        if (LiveEventMethod == "LS") 
//        {
//            //LightStreamer
//            $.ajax({
//                url: WS_URL_ROOT + "/Game/NotifyFriendsThatUserHasJoinedGame",
//                type: "POST",
//                data: JSON.stringify(uiUser),
//                dataType: "json",
//                contentType: "application/json: charset=utf-8",
//                error: function (XMLHttpRequest, textStatus, errorThrown) {
//                    AjaxFail("NotifyFriendsThatUserHasJoinedGame", XMLHttpRequest, textStatus, errorThrown);
//                },
//                success: function (response) {
//                    if (callback instanceof Function) {
//                        callback(response);
//                    }
//                }
//            });
//        }
//        else 
        if (LiveEventMethod == "SR") 
        {
            //Signalr
            var groupName = "UBD" + uiUser.fbuserid;
            var profilepic = "";

            if (uiUser.profilepic) {
                profilepic = uiUser.profilepic;
            }
            
            var updateDetails;
            if (uiUser.nn) {
                updateDetails = "3;" + uiUser.name + " <span class='nick'>" + uiUser.nn + "</span>;" + profilepic;
            } 
            else {
                 updateDetails = "3;" + uiUser.name;
            }
            
            //liveGamesSignalRProxy.processfriendupdates(updateDetails, groupName);
            //liveGamesSignalRProxy.invoke('processfriendupdates', updateDetails, groupName, GetCurrentfixtureID());
            liveGamesSignalRConnection.server.processfriendupdates(updateDetails, groupName, GetCurrentfixtureID());
            return 1;
        }
        else if (LiveEventMethod == "T5P") {
            //T5P

            if (UserHasFriendsPlayingThisGame() == 1) {
                var groupName = "UBD" + uiUser.fbuserid;
                var profilepic = "";

                if (uiUser.profilepic) {
                    profilepic = uiUser.profilepic;
                }

                var updateDetails;
                if (uiUser.nn) {
                    updateDetails = "3;" + uiUser.name + " <span class='nick'>" + uiUser.nn + "</span>;" + profilepic;
                }
                else {
                    updateDetails = "3;" + uiUser.name + ";" + profilepic;
                }

                var updateDetailsArray = new Array();
                updateDetailsArray.push(updateDetails);
                updateDetailsArray.push(uiUser.fbuserid);
                updateDetailsArray.push(GetCurrentfixtureID());

                if (sp == 0) {
                    AdminPusher.push("processfriendupdates", updateDetailsArray, groupName);
                }
                else {
                    FriendPusher.push("processfriendupdates", updateDetailsArray, groupName);
                }

                _gaq.push(['_trackEvent', 'T5Pusher', 'JoinGame']);
            }
        }
    }
    catch (ex) {
        if (log) { 
            //we only want to log an error here the cesond time we call this 
            //the reason for this is that the first time we call this we often get told "signalrR hasn;t started yet - we then try to send again 5 sec's later
            //we are only interested in logging the second time!!!!
            logError("NotifyFriendsThatUserHasJoinedGame - Second Call!", ex);
        }
        return -1;
    }
}

function NotifyFriendsOfBetPlaced(callback) 
{
    try
    {
        try {
            Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
        } catch (ex) { }

        if (LiveEventMethod == "LS") 
        {
            //- LightStreamer
            $.ajax({
            url: WS_URL_ROOT + "/Game/NotifyFriendsOfBetPlaced",
            type: "POST",
            data: JSON.stringify(Currentbet),
            dataType: "json",
            contentType: "application/json: charset=utf-8",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            AjaxFail("NotifyFriendsOfBetPlaced", XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (response) {
            if (callback instanceof Function) {
            callback(response);
            }
            }
            });
        }
        else if (LiveEventMethod == "SR") 
        {

            //Signalr
            var winnings = (Currentbet.amount * Currentbet.odds);
            var updateDetails = "1;" + Currentbet.eventid + ";" + Currentbet.betid + ";" + Currentbet.amount + ";" + winnings + ";" + Currentbet.eventtime;
            var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var groupName = "UBD" + uiUser.fbuserid;

            //liveGamesSignalRProxy.processfriendupdates(updateDetails, groupName);
            //liveGamesSignalRProxy.invoke('processfriendupdates', updateDetails, groupName, GetCurrentfixtureID());
            liveGamesSignalRConnection.server.processfriendupdates(updateDetails, groupName, GetCurrentfixtureID());

            //this line is purely for the stress test!!!
            //liveGamesSignalRConnection.server.processtestgroupupdate(updateDetails, groupName, GetCurrentfixtureID());
            
            //this line is only used for when we are doing stress tests!!!!!
            //liveGamesSignalRProxy.invoke('processtestgroupupdate', updateDetails, groupName);
            return 1;
        }
        else if (LiveEventMethod == "T5P")
        {
            if (UserHasFriendsPlayingThisGame() == 1) {
                var winnings = (Currentbet.amount * Currentbet.odds);
                var updateDetails = "1;" + Currentbet.eventid + ";" + Currentbet.betid + ";" + Currentbet.amount + ";" + winnings + ";" + Currentbet.eventtime;
                var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                var groupName = "UBD" + uiUser.fbuserid;

                var updateDetailsArray = new Array();
                updateDetailsArray.push(updateDetails);
                updateDetailsArray.push(uiUser.fbuserid);
                updateDetailsArray.push(GetCurrentfixtureID());

                if (sp == 0) {
                    AdminPusher.push("processfriendupdates", updateDetailsArray, groupName);
                }
                else {
                    FriendPusher.push("processfriendupdates", updateDetailsArray, groupName);
                }

                _gaq.push(['_trackEvent', 'T5Pusher', 'BetPlaced']);
            }
           
        }
    }
    catch (ex) {
        logError("NotifyFriendsOfBetPlaced", ex);
        return -1;
    }
}

function NotifyFriendsOfBetForfeit() {
    try {
        try {
            Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
        } catch (ex) { }

        if (LiveEventMethod == "LS") 
        {
            //LightStreamer
            $.ajax({
                url: WS_URL_ROOT + "/Game/NotifyFriendsOfForfeit",
                type: "POST",
                data: JSON.stringify(Currentbet),
                dataType: "json",
                contentType: "application/json: charset=utf-8",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("NotifyFriendsOfBetPlaced", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    if (callback instanceof Function) {
                        callback(response);
                    }
                }
            });
        }
        else if (LiveEventMethod == "SR") 
        {
            //Signalr
            var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var groupName = "UBD" + uiUser.fbuserid;
            var updateDetails = "2;" + Currentbet.betid;
            //liveGamesSignalRProxy.processfriendupdates(updateDetails, groupName);
            //liveGamesSignalRProxy.invoke('processfriendupdates', updateDetails, groupName,GetCurrentfixtureID());
            //liveGamesSignalRProxy.invoke('processtestgroupupdate', updateDetails, groupName, GetCurrentfixtureID());
            liveGamesSignalRConnection.server.processfriendupdates(updateDetails, groupName, GetCurrentfixtureID());


            //this line is purely for the stress test!!!
            //liveGamesSignalRConnection.server.processtestgroupupdate(updateDetails, groupName, GetCurrentfixtureID());

            return 1;
        }
        else if (LiveEventMethod == "T5P") {
            
            if (UserHasFriendsPlayingThisGame() == 1) {
                var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                var groupName = "UBD" + uiUser.fbuserid;
                var updateDetails = "2;" + Currentbet.betid;

                var updateDetailsArray = new Array();
                updateDetailsArray.push(updateDetails);
                updateDetailsArray.push(uiUser.fbuserid);
                updateDetailsArray.push(GetCurrentfixtureID());

                if (sp == 0) {
                    AdminPusher.push("processfriendupdates", updateDetailsArray, groupName);
                }
                else {
                    FriendPusher.push("processfriendupdates", updateDetailsArray, groupName);
                }

                _gaq.push(['_trackEvent', 'T5Pusher', 'Forfeit']);
            }
        }
    }
    catch (ex) {
        logError("NotifyFriendsOfBetForfeit", ex);
        return -1;
    }
}

function NotifyFriendsOfNewBalanceForThisGame(fixtureID, fbuserid, newBalance) {
    try {

        if (LiveEventMethod == "LS") 
        {
            //LightStreamer
            $.ajax({
            url: WS_URL_ROOT + "/Game/NotifyFriendsOfNewBalance",
            type: "POST",
            data: "fixtureID=" + fixtureID + "&fbuserid=" + fbuserid + "&newBalance=" + newBalance,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                AjaxFail("NotifyFriendsOfBetPlaced", XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (response) {
            var v = response;
            }
            });
        }
        else if (LiveEventMethod == "SR") 
        {
            //Signalr
            var groupName = "UBD" + fbuserid;
            var updateDetails = "4;" + newBalance;
            //liveGamesSignalRProxy.processfriendupdates(updateDetails, groupName);
            //liveGamesSignalRProxy.invoke('processfriendupdates', updateDetails, groupName, GetCurrentfixtureID());
            liveGamesSignalRConnection.server.processfriendupdates(updateDetails, groupName, GetCurrentfixtureID());
        }
        else if (LiveEventMethod == "T5P") {
            //T5P
            if (UserHasFriendsPlayingThisGame() == 1) {
                var groupName = "UBD" + fbuserid;
                var updateDetails = "4;" + newBalance;

                var updateDetailsArray = new Array();
                updateDetailsArray.push(updateDetails);
                updateDetailsArray.push(uiUser.fbuserid);
                updateDetailsArray.push(GetCurrentfixtureID());

                if (sp == 0) {
                    AdminPusher.push("processfriendupdates", updateDetailsArray, groupName);
                }
                else {
                    FriendPusher.push("processfriendupdates", updateDetailsArray, groupName);
                }

                _gaq.push(['_trackEvent', 'T5Pusher', 'NewBalance']);
            }
        }
    }
    catch (ex) {
        logError("NotifyFriendsOfNewBalanceForThisGame", ex);
    }
}


function friendsNotified(response) {
    //do nothing
}


//added functionality to double the odds if we are in a power play - Stephen 22-Mar-12
function updateOdds(newOdds) { //, newOddsCounter
    try {
            var oddsMultiple = 1; 
            if (inPowerPlay == 1) 
            {
                //we are in powerPlay - so double all odds!!!!!!!
                oddsMultiple = 2;
            }
            var newOddsList = newOdds.split(",");
            if ((newOddsList) && (newOddsList.length > 0)) {
                try {
                    Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
                } catch (ex) { }

                for (var i = 0; i < newOddsList.length; i++) {
                    try {
                        var thisEvent = newOddsList[i].split(":");
                        var thiseventID = thisEvent[0];
                        var theseOdds = (Math.round(thisEvent[1]) * oddsMultiple); //rounds the decimal value to an int

                        if ($('#' + displaymode + '_bubble' + thiseventID).hasClass('bubble_active') && (Currentbet)) {
                            //if the div has this class - it means the user has a bet on this class - so don't update 
                            //however - DO update the currentbet with the new odds
                            Currentbet.newodds = theseOdds;
                            window.sessionStorage.setItem("Currentbet", $.toJSON(Currentbet));  //Reset the sessionStorage Currentbet object
                        }
                        else {
                            $('#' + displaymode + '_bubble' + thiseventID).html(theseOdds + "/1");
                        }
                    }
                    catch (err) { }
                }
            }
    }
    catch (ex) {
        logError("updateOdds", ex);
    }
}

function HaveWeDisplayedFriendsBetBefore(thisbet) {
    try {
        //WaitForFriendScoresToFinishProcessing(); //wait until there is no other process updating the friendscores ( these scores are usually updated via a lightStreamer message indicating that a friend has placed a bet)
        var friendbets;
        try {
            friendbets = window.sessionStorage.getItem("listOfFriendsBets");
        } catch (ex) { }

        var listOfFriendsBets;

        if (typeof (friendbets) != 'undefined' && friendbets != null && friendbets != "") {
            listOfFriendsBets = typeof friendbets != 'object' ? JSON.parse(friendbets) : friendbets;

            if (typeof (listOfFriendsBets) != 'undefined' && listOfFriendsBets != null) {
                for (var i = 0; i <= listOfFriendsBets.length - 1; i++) {
                    if (listOfFriendsBets[i].betid == thisbet.betid) {
                        return true
                    }
                }
            } //if (typeof (listOfFriendsBets) != 'undefined' && listOfFriendsBets != null) {
            else {
                //listOfFriendsBets is null - so create empty array
                listOfFriendsBets = new Array();
            }
        } // if (typeof (friendbets) != 'undefined' && friendbets != null && friendbets != "") {
        else {
            listOfFriendsBets = new Array(); //do this so we don't leave a null object in the listOfFriendsBets sessionStorage object
        }

        //this incoming bet is not in our list -- so add it to the list!!!
        listOfFriendsBets.push(thisbet);
        window.sessionStorage.setItem("listOfFriendsBets", $.toJSON(listOfFriendsBets));
    }
    catch (ex) {
        logError("HaveWeDisplayedFriendsBetBefore", ex);
    }
    FinishedProcessingFriendScores();
    return false;
}

//this is where we display an invite to a league
function DisplayInviteDetails(inviteDetails) {
        try {

            var theseDetails = inviteDetails.split(";");
            var friendid = theseDetails[0];
            var theseInvitedetails = theseDetails[1];
            var LMID = theseDetails[2];

            var LMID_event = LMID * -1; //we don't want the LMID to clash with the EventID ( as they are both going to be displayed in the GameFeed they will both need event id's so we don't display them twice) - as the League Invite ID is from a different table as the event Id  we dont want them to clash - so set leagueInvites to -LMID

            if (!HaveWeDisplayedThisEventBefore(LMID_event)) {
                //we haven't displayed this invite before
                var inviteDetailsHTML = theseInvitedetails.replace(/s:/g, ";");
                //$('.GameFeedInfo').prepend(inviteDetailsHTML);  //no longer put in GameFeed!!!!

                //also update the  invites div
                //$('#_MyleagueInvites').prepend(inviteDetailsHTML);
                refreshScroller(leaderboardScroller,"MyleagueInvites");
            }
        } catch (ex) { logError("DisplayInviteDetails", ex); }
}

//this function replaces the function AddBetToFriendsBetList
//we now send as little data as possible between friends
//(the less data there is to send the more chance there is of the message getting to all users)
function ProcessFriendUpdate(updateDetails,fbuserid) 
{
    var theseDetails = updateDetails.split(";");
    var updateIdentifier = theseDetails[0];
    if (updateIdentifier == 1) 
    {
        //the user has placed a bet

        //sample updateDetails string =  "1;3;1966077;100;900;04/24/2012 16:56:47"
        var friendsBet = new Bet();

        friendsBet.eventid = theseDetails[1];
        friendsBet.betid = theseDetails[2];

        var friend = new FriendUser(fbuserid, null); //we don't have the name
        friendsBet.user = friend;

        friendsBet.amount = theseDetails[3];
        friendsBet.creditsearned = parseInt(theseDetails[4]);
        friendsBet.eventtime = theseDetails[5];

        if ((UserIsMyFriend(fbuserid)) && (!HaveWeDisplayedFriendsBetBefore(friendsBet)) && (FriendsBetIsUpToDate(friendsBet))) {
            AddBetToFriendScores(friendsBet); 
        }
    }
    else if (updateIdentifier == 2) 
    {
        //forfeit

        ////sample updateDetails string =  "2;1966077"
        var ForFeitBetId = parseInt(theseDetails[1]);
        RemoveForfeitBetFromFriendScores(fbuserid, ForFeitBetId);
    }
    else if (updateIdentifier == 3) 
    {
        //user has just joined game

        //sample updateDetails string =  "3;Férgal Short"
        if (UserIsMyFriend(fbuserid)) {
            var friendName = theseDetails[1];
            var profilePic = theseDetails[2];
            AddFriendToFriendScores(fbuserid, friendName, profilePic);

            //this is pointless as we are NOt listening for the friend!!!!!
            //we will need to refresh to get any of his notifications!!!!
            //CheckAndAddFriendToFriendList(fbuserid, friendName);
        }
    }
    else if (updateIdentifier == 4) 
    {
        //users new balance update

        //sample updateDetails string =  "4;1900"
        if (UserIsMyFriend(fbuserid)) 
        {
            var newbalance = parseInt(theseDetails[1]);

            //we are updating the friend scores table with this result
            UpdateFriendScoresWithNewBalance(fbuserid, newbalance);
        }
    }
}

function UserIsMyFriend(userid) {
    try
    {
        var myfriends;

        try {
            //put this in try/catch as it will throw an error on certain android devices if we try to reference something from session storage that hasn't been set
            myfriends = JSON.parse(window.sessionStorage.getItem("facebookfriendlist"));
        }
        catch (ex2) {
            logError("GetFriends", ex2);
        }


        if (typeof (myfriends) != 'undefined' && myfriends != null) {
            for (var i = 0; i <= myfriends.length - 1; i++) {
                var tempFriendID = myfriends[i].id;
                if (tempFriendID == userid) {
                    return true;
                }
            }
        }
    }
    catch (ex) { logError("UserIsMyFriend", ex); }
    return false; //if we reach here the userid is not my friend
}

//don't call this anymore
//this function is called when a bet has been made
//function CheckComplete(response) {
//    if (response.betcomplete == true) {
//        //bet has been completed!!! - now check if it was won or not

//        Currentbet = response; //set Currentbet to the bet object returned
//        uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
//        if (response.status == 1) {
//            //Bet was won!!!!! - so update users credits!!!
//            uiUser.credits = Currentbet.newcredits;
//            $('.credits').html("$" + uiUser.credits);
//            //Todo - update user here too!
//            uiUser.credits = Currentbet.newcredits;
//            $('.credits').html("$" + uiUser.credits);
//        }

//        var newFeedHTML = "<br /><b>" + response.betresult + "</b>";
//        $('.GameFeedInfo').append(newFeedHTML);
//    }
//    else {
//        //bet has NOT been completed!!!
//        //Do nothing!!!!!
//        var v = 1;
//    }
//}

//function clearBets() {
//    localStorage.clear();
//    location.reload(true);
//}

// Added by Gamal 12/03/2012: A function to close the forfeit popup window
function closeforfeitpopup() {
    try {
        $('#' + displaymode + '_forfeitconfirm').hide(); 
        //$('.tooltip-shade').hide();
    }
     catch (ex) {
    logError("closeforfeitpopup", ex);
    }
}

//Close bet panel
function closebetpanel()
{
    try
    {
        $('#' + displaymode + '_popupplacebet').hide();
        //$('.tooltip-shade').hide();
    }
    catch (ex) { logError("closepanel", ex); }
}


function closepowerplaypopup() {
    try {
        $('#' + displaymode + '_powerplaypopup').hide();
        //$('.tooltip-shade').hide();
    } catch (ex) {
        logError("closepowerplaypopup", ex);
    }
}

function closeinvitefriendpopup() {
    try {
        $('#' + displaymode + '_invitefriendspopup').hide();
    } catch (ex) {
        logError("closeinvitefriendpopup", ex);
    }
}



// Added by Gamal 02/04/2012: This function is called when user clicks on Edit Nick Name
function nicknamePopup() {
    try {
       _gaq.push(['_trackEvent', 'Clicks', 'ViewMyAccount']);
        $(".nicknamepopup").show();
       $("#" + displaymode + "_confirm_nn").attr('onClick', 'nickNameConfirm()');
       //$('.tooltip-shade').show();

       var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
       if (thisUser.nn) {
           $('#' + displaymode + '_nicknameValue').val(thisUser.nn);
       }

       Store.GetMyStorePurchases();
    } catch (ex) {
     logError("nickNameEditor", ex);
    }
}

// Added by Gamal 02/04/2012: This function is called when user presses confirm on Nick Name popup
function nickNameConfirm() {
    try {
        _gaq.push(['_trackEvent', 'Clicks', 'SetNickName']);
        var nickname = $('#' + displaymode + '_nicknameValue').val();
        nickname = $.trim(nickname); // User JQuery trim function as Javascript function is not supported in some browsers
        $(".nicknamepopup").hide();
        //$('.tooltip-shade').hide();


        var userid = -1;
        uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        if (nickname != null && nickname.length > 0 && uiUser !=null) {
            userid = uiUser.id;
            $.ajax({
                url: WS_URL_ROOT + "/Game/EditNickName",
                type: "POST",
                data: "f=" + GetCurrentfixtureID() + "&u=" + userid + "&fu=" + uiUser.fbuserid + "&nickname=" + nickname,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Nickname hasn't been updated, Please Try again later!");
                    AjaxFail("EditNickName", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    _gaq.push(['_trackEvent', 'Clicks', 'EditNickName']);
                    //var resultid = response.result;
                    //if (response == -1) {
                    //    alert("You have already changed your Nickname during this fixture!");
                    //} else 


                    if (response == -2) {
                        //alert("NickName is already used by another user, please try another one!");

                        if (displaymode == "w") {

                            $('#' + displaymode + '_predictionpending').html("<strong>NickName is already used by another user, please try another one!</strong>!");
                            $('#' + displaymode + '_predictionpending').show();
                            $('.tooltip-shade').show();
                            $('.betcountdown').show();
                            $('.betcountdown').delay(2500).fadeOut('slow');
                            $('.tooltip-shade').delay(2500).fadeOut('slow');
                        }
                        else if (displaymode == "m") {
                            $('.popup-notify > h1').text("NickName is already used by another user, please try another one!");
                            $('.popup-notify > span').text("");
                            $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
                        }


                    }
                    else if (response < 0) {
                        alert("Oops - NickName NOT changed - try again later!");
                    }
                    else if (response > 0) {
                        if (localStorage.getItem("nickname") != null) {
                            localStorage.removeItem("nickname");
                        }
                        localStorage.setItem("nickname", nickname);

                        var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                        thisUser.nn = nickname;
                        window.sessionStorage.setItem("facebookuser", $.toJSON(thisUser));
                        //alert("Nickname changed!");

                        if (displaymode == "w") {

                            $('#' + displaymode + '_predictionpending').html("<strong>Nickname changed!</strong>!");
                            $('#' + displaymode + '_predictionpending').show();
                            $('.tooltip-shade').show();
                            $('.betcountdown').show();
                            $('.betcountdown').delay(1000).fadeOut('slow');
                            $('.tooltip-shade').delay(1000).fadeOut('slow');
                        }
                        else if (displaymode == "m") {
                            $('.popup-notify > h1').text("Nickname changed!");
                            $('.popup-notify > span').text("");
                            $('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);
                        }


                        if (WeAreCurrentlyShowingLeagueTable() == true) {
                            userLeague.UpdateCurrentLeaderboard(0); //the "0" indicates that we DO want to show the loading gif for this update
                        }
                        if (WeAreCurrentlyShowingFriendsLeagueTable == true) {
                            userLeague.GetFriendsLeaderBoard();
                        }

                        //Get Game Details
                    }
                }
            });
        } else {
            // User Didn't type anything in text input field
             alert("Please type a nickname or press cancel!");
        }
    } catch (ex) {
        logError("nickNameEditor", ex);
    }

}

// Added by Gamal 02/04/2012: Hide Nick Name Popup
function nickNameCancel() {
    try {
        //$('.tooltip-shade').hide();
        $(".nicknamepopup").hide();
    } catch (ex) {
        logError("nickNamecancel", ex);
    }
}

function closepanel(domobj) {
    try {
        $(domobj).closest('.popup-placebet').hide();
    }
    catch (ex) { alert(ex); }
}

function GetGameAdminDetails() {
    GetFixtures();
    GetGameSetupDetails();
    $("#managePusherdiv").show();

    var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
    $("#GetEmailSpan").html("<h2><a href='/Admin/GetEmailDetails?u=" + thisUser.id + "&fu=" + thisUser.fbuserid + "'>Get Email List</a></h2>");

    admin.GetNumPushers();
}

function GetGameSetupDetails() {
    var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

    if ((admin) && (admin.isAdmin())) {
        $.ajax(
            {
                url: WS_URL_ROOT + "/Game/GetSystemMemoryDiskStatus",
                type: "POST",
                data: "gameidID=1",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetSystemMemoryDiskStatus", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    if (response) {
                        if (response.toLowerCase() == "memory")
                        {
                            ShowThatWeAreUsingMemoryTables();
                        }
                        else if (response.toLowerCase() == "disk")
                        {
                            ShowThatWeAreUsingDiskTables();
                        }
                    }
                }
            }
        );
    } //end admin check
    //else {
    //    //redirect to homepage!!!
    //    window.location.href = location.protocol + '//' + location.host + "/";
    //}

} //GetFixtures

function ShowThatWeAreUsingDiskTables() {
    //the system is currently set up to work with disk tables
    //show the button to change to Memory
    $("#memdiskstatusdiv").show();
    $("#changingsystem").hide();
    $("#memdiskstatusSpan").html("System using Disk Tables --- Click To Switch To Use Memory");

    $('#memdiskstatusdiv').click(function (e) {
        //ChangeDiskMemoryTableStatus("Memory");
        admin.ChangeDiskMemoryTableStatus("Memory");
    });
}

function ShowThatWeAreUsingMemoryTables() {
    //the system is currently set up to work with Memory tables
    //show the button to change to disk
    $("#memdiskstatusdiv").show();
    $("#changingsystem").hide();
    $("#memdiskstatusSpan").html("System using Memory Tables ---  Click To Switch To Use Disk");

    $('#memdiskstatusdiv').click(function (e) {
        //ChangeDiskMemoryTableStatus("Disk");
        admin.ChangeDiskMemoryTableStatus("Disk");
    });
}


function GetFixtures() 
{
    var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

    if ((admin) && (admin.isAdmin())) {
        $.ajax(
            {
                url: WS_URL_ROOT + "/Fixtures/GetFixtures",
                type: "POST",
                data: "u=" + thisUser.id,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetFixtures", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {

                    //dont show the create fixture unless this is returned - i,e we know this userid is a valid admin!!!
                    $('#createFixtureLink').show();

                    var fixtures = typeof response != 'object' ? JSON.parse(response) : response;

                    var fixtureHTML = "";
                    for (var i = 0; i < fixtures.length; i++) {

                        var liveGamestatus = "<b style='color:red;'>DB NOT cleared before this game</b>"; //Not a liveGame
                        var BackUpStatus = "";
                        var liveStyles = "";

                        if (fixtures[i].lg == 1) {
                            liveGamestatus = "<b>DB WAS cleared before this game</b>"; //LIVEGAME
                            liveStyles = "style='background:red;color:#fff;'";
                        }

                        if (fixtures[i].et) {
                            //game is over
                            if (fixtures[i].tsftbu) {
                                BackUpStatus = "<b style='color:yellow;'>Memory Tables have been backed up to disk!!!</b>";
                            }
                            else {
                                //john - can we put a warning span or style here
                                BackUpStatus = "<b style='color:#0bdad8;'>This game has ended but we have not backed up to disk yet!!!</b>";
                            }
                        }

                        fixtureHTML = fixtureHTML + "<div class='ui-button' " + liveStyles + "><h1> " + fixtures[i].fixture + " -  " + fixtures[i].fixtureid + "</h1><span>" + liveGamestatus + "</span><br /><span>" + BackUpStatus + "</span><a href='/Game/?f=" + fixtures[i].fixtureid + "'>Go To Fixture</a></div>";
                    }
                    $('#FixtureDiv').html(fixtureHTML);

                }
            }
        );
    } //end admin check
    //else {
    //    //redirect to homepage!!!
    //    window.location.href = location.protocol + '//' + location.host + "/";
    //}

} //GetFixtures
