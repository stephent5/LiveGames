//put t5pusher integration here!!!!!
var PushConnectionStarted = 0;
var thisConnectionIsAReconnect = 0;
var timeout = null;
var interval = 10000; //10 seconds
var firstTimeConnected = 1;
var AdminPusher = new T5Pusher();
var FriendPusher;
var currentlyConnected = 0;
var numConnectionFailures = 0;

function EstablishPushConnection() {

    var thisUser;
    try {
        thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
    } catch (ex) { }

    var thisIsAdminUser = 0;

    if ((t5pusherAppKey)) { //(thisUser) && (thisUser.id > 0) && 
        AdminPusher.SetPusherURL(ap); //ap = AdminPushurl //"http://127.0.0.1:81" for testing local (if i can receive the messages (which were sent from live) from local - then this means we ARE using service bus
        
        if ( (admin) && (admin.isAdmin()) ) //only the admin gets validated - as the admin will send via a secure gropu - everyone else can connect - unvalidated
        {
            AdminPusher.setClientAuthorisationURL("/Push/AddSignature");
            AdminPusher.setGroupAuthorisationURL("/Push/AddSecureGroupSignature");

            //temporarily removed this too - just for initial games!!!!! - due to John admin issues!!!
            //AdminPusher.useSecureConnection();

            thisIsAdminUser = 1;
        }
        
        AdminPusher.start(t5pusherAppKey);

        //if we ARE using seperate push connections and we are NOT the admin (we dont need the admin to start 2 pushers!!!)
        if ((sp == 1) && (!homepagefixtureid) && (thisIsAdminUser == 0) ) { 
            //..so start friendPusher!!!
            FriendPusher = new T5Pusher();

            FriendPusher.connectionbind("connected", function () {
                        //we have connected to T5Pusher!!!!! now we can join groups etc
                        console.log("FriendPusher says i am connected!!!");

                        PushConnectionStarted = 1; 
                        ListenForFriendUpdates(); //this will join us to the groups for our friends so we can see what bets they place etc!!!!

                        initialiseFriendProxyFunctions(); //set up functions where we will receive messages from T5Pusher
            });
            
            FriendPusher.SetPusherURL(fp); //fp = FriendPushurl
            FriendPusher.setClientAuthorisationURL("/Push/AddSignature");

            //no longer do authorisation for friends!!!!!
            //if we add this back in then we need to update the server side code to store user details in session again!!!!!
            //FriendPusher.useSecureConnection(); 
            FriendPusher.start(t5pusherAppKey);
        }
    }
}

AdminPusher.connectionbind("connected", function () {
    //we have connected to T5Pusher!!!!! now we can join groups etc

    
    if ((admin) && (admin.isAdmin())) {
        //admin.SetUpRefereesSecureGroup(); //removed the secure gropu as Johns Admin was occasionaly losing connection -  16july13

        //join this group so we can test the Pusher 
        var thisUser;
        try {
            thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        } catch (ex) { }
        AdminPusher.joinGroup("PT" + thisUser.fbuserid); //PT = pusher Test
        PushConnectionStarted = 1;
    }
    else {
        //not the admin user!!!
        if (sp == 0) {  //we are NOT using seperate push connections - so do friends logic here
            PushConnectionStarted = 1; //this variable is only used for the friends connection/joining
            ListenForFriendUpdates(); //this wil ljoin us to the groups for our friends so we can see what bets they place etc!!!!
        }
    }

    initialiseProxyFunctions(); //set up functions where we will receive messages from T5Pusher
    console.log("AdminPusher says i am connected!!!");
});

//removed the secure gropu as Johns Admin was occasionaly losing connection
//so we dont go in here any more - as of 16july13
AdminPusher.bind("CreateBroadcastGroupReturn", function (data) {
    if (data) {
        if (data.created == 1)
        {
            //created secure broadcast group
            currentlyConnected = 1;
            $('.GameFeedInfo').prepend("<span class='losetext'>Referees Broadcast Group Created. <br /> You can now send to players!</span><br />");
            refreshScroller(GameFeedScroller, "GameFeedInfo");
            $('#GTracker').html("Connection Status: Connected");
        }
        else {
            //failed to secure broadcast group
            alert("error creating broadcast group!!!");
        }
    }
});

AdminPusher.connectionbind("connectionattemptfailed", function () {

    //no longer do this - if the page cannot establish a connection then inform the user
    //refreshing simply menas that when we have a problem the page just loads and loads
    /*
    $('#' + displaymode + '_reconnectstatus').fadeIn(50).delay(400).fadeOut(50);
    var ReconnectHTML = "Failed To Establish Connection. Reconnecting...<br />";
    $('.GameFeedInfo').prepend(ReconnectHTML);
    logErrorExtra("SignalR", "Failed to Establish Conn. Reloading page!!", "", "", GetCurrentTimeStamp());
    refreshScroller(GameFeedScroller, "GameFeedInfo");
    setTimeout("ReloadPage();", (500)); //reload the page in 0.5 seconds 
    */

    setTimeout("AdminPusher.start(t5pusherAppKey);", (5000)); //try to connect again in 5 seconds!
    if (numConnectionFailures == 0) {
        ConnectionIsSlow();
    }
    numConnectionFailures = numConnectionFailures + 1;
});

AdminPusher.connectionbind("connectionlost", function () {
    $('#' + displaymode + '_reconnectstatus').fadeIn(50).delay(400).fadeOut(50);
    var ReconnectHTML = "Connection lost. Reconnecting...<br />";
    $('.GameFeedInfo').prepend(ReconnectHTML);
    logErrorExtra("SignalR", "Failed to Re_establish Conn. Reloading page!!", "", "", GetCurrentTimeStamp());
    refreshScroller(GameFeedScroller, "GameFeedInfo");
    setTimeout("ReloadPage();", (1000)); //reload the page in 1 second
});

AdminPusher.connectionbind("connectionslow", function () {
    ConnectionIsSlow();
});

function ConnectionIsSlow() {
    var newFeedHTML = "<span class='losetext'>You are experiencing connection issues due to your network!!! <br />You may not be receiving all messages due to these connection issues!!</span><br />";
    $('.GameFeedInfo').prepend(newFeedHTML);
    refreshScroller(GameFeedScroller, "GameFeedInfo");

    if ((admin) && (admin.isAdmin())) {
        $('#GTracker').html("Connection Status: Connection Slow");
    }


    if (displaymode == "m") {
        var tickerWarningText = '<li class="news-item">You are experiencing connection issues due to your network!!!</li><li class="news-item">You may not be receiving all messages due to these connection issues!!</li>';
        //we are viewing the mobile version - so add this info to ticker!!!!!!!!!
        SetTickerContent("connectionWarningDetails_ticker", tickerWarningText)
    }

    //if we are experiencing slowness - update the game details!!!

    if (!homepagefixtureid) {
        GetGameDetails(0, GameDetailsComplete);
        if (WeAreCurrentlyShowingFriendsLeagueTable == true) {
            userLeague.GetFriendsLeaderBoard();
        }
    }
}


AdminPusher.connectionbind("statechanged", function (newconnectionstate) {
    //this function gets called if the T5Pusher Connection State has Changed

    if (newconnectionstate == "reconnecting")
    {
        currentlyConnected = 0;
        thisConnectionIsAReconnect = 1;

        if ((admin) && (admin.isAdmin())) {
            $('#GTracker').html("Connection Status: reconnecting");
        }
        else {
            $('.connectionstatus').html("reconnecting");
        }
        timeout = setTimeout(function () {
            //if we reach here then we have spent 10 seconds trying to re- establish the connection and have not been able to - so prompt a reload of page here!!!!! //if we reach here then we have spent 10 seconds trying to re- establish the connection and have not been able to - so prompt a reload of page here!!!!!
            logErrorExtra("SR_Con", "setTimeout - about to call RestartSignalRConnection!", "", "", GetCurrentTimeStamp());
            ReloadPage();
        }, interval);
    }
    else if (newconnectionstate == "connected") {


        if ((admin) && (admin.isAdmin())) {

            currentlyConnected = 1;
            $('#GTracker').html("Connection Status: Connected");
           
            //if (admin.secureGroupName) {
            //    currentlyConnected = 1;
            //    $('#GTracker').html("Connection Status: Connected");
            //}
            //else {
            //    $('#GTracker').html("Connection Status: NOT Connected - we have no secure group!!!! - reload page!!!!");
            //}
        }
        else {
            $('.connectionstatus').html("Connected");
        }
        
        if (timeout) //if we were previously trying to reconnect - then clear the values set in this process
        {
            clearTimeout(timeout);
            timeout = null;
        }
        $('#connmethod').html(AdminPusher.GetCurrentConnectionMethod());

        if (firstTimeConnected == 1) {
            firstTimeConnected = 0;
            Store.CheckForOpenStorePurchases(); //only do this AFTER we've defo connected as it can lead to loading issues on certain mobile devices
        }
    }
    else if (newconnectionstate == "disconnected") {
        currentlyConnected = 0;
        if ((admin) && (admin.isAdmin())) {
            $('#GTracker').html("Connection Status: disconnected");
        }
        else {
            $('.connectionstatus').html("disconnected");
        }
    }
    else if (newconnectionstate == "connecting") {
        currentlyConnected = 0;
        if ((admin) && (admin.isAdmin())) {
            $('#GTracker').html("Connection Status: Connecting");
        }
        else {
            $('.connectionstatus').html("Connecting");
        }
    }
});

function initialiseFriendProxyFunctions()
{

    var thisLocalFriendPusher;

    if (sp == 0) { //we are NOT using seperate push connections
        thisLocalFriendPusher = AdminPusher;
    }
    else {
        thisLocalFriendPusher = FriendPusher;
    }

    thisLocalFriendPusher.bind("DisplayLeagueInvite", function (data) {
        try {
            LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server
            var inviteID = data[0];
            var leagueID = data[1];
            var leagueName = data[2];
            var inviter_UserID = data[3];
            var inviter_UserName = data[4];
            var FixtureID = data[5];
            userLeague.DisplayLeagueInvite(inviteID, leagueID, leagueName, inviter_UserID, inviter_UserName, FixtureID);
        }
        catch (ex) { logError("DisplayLeagueInvite", ex); }
    });//end DisplayLeagueInvite

    thisLocalFriendPusher.bind("processfriendupdates", function (data) {
        try {
            LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server
            var updateDetails = data[0];
            var fbuserid = data[1];
            var thisFixtureId = data[2];

            //first make sure we are receiving details for the correct fixture - in case ther are two games going on at the same time
            if (thisFixtureId == GetCurrentfixtureID()) {
                var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                ProcessFriendUpdate(updateDetails, fbuserid); //this is the same function LightStreamer calls
            }
        }
        catch (ex) { logError("ProcessFriendUpdate", ex); }
    });//end ProcessFriendUpdate

}



function initialiseProxyFunctions() {

    AdminPusher.bind("UpdateGameEvent", function (data) {
        try {
            LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server
            var thisFixtureId = data[0];
            var thisEventId = data[1];
            var thisEventLogID = data[2];
            var thisHomeScore = data[3];
            var thisAwayScore = data[4];
            var thisDescription = data[5];
            var eventUpdateTime = data[6];
            var eventEndTime = data[7];
            var PreviousEvents = data[8];
            var MatchStartExtraDetails = data[9];

            //first make sure we are receiving details for the correct fixture - in case ther are two games going on at the same time
            if (thisFixtureId == GetCurrentfixtureID()) {

                LastEventReceived = thisEventId;
                if ((thisEventId == 22) && (!HaveWeReceviedThisFreezeOrThawEventBefore(thisEventLogID))) {
                    //this is a bet freeze

                    $('.forfeitclick').hide();

                    //- if the user IS counting down the seconds - then end the count down and tell the user that their bet is not valid!!!!

                    // - we can then wait the 1-2 seconds untill the actual event comes in and returns the users voided bet amount!!

                    //check if the user is currently counting down the seconds untill their bet is valid 
                    if (BetValidCount > 0) {
                        //we ARE currently counting down the seconds untill their bet is valid 
                        var Currentbet;
                        try {
                            Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
                        } catch (TempEx) { }

                        if ((Currentbet) && (Currentbet.status == 0)) {
                            var eventEndTime_date = new Date(eventEndTime); //need to change this strings into a date object
                            var timebetplaced = new Date(Currentbet.eventtime);
                            var voidTime = new Date();
                            voidTime.setTime(eventEndTime_date.getTime() - (voidOffset * 1000)); // Altered by Gamal 30/03/2012: If bet made after void offset it will be void (No Longer hardcoded 5 seconds value) 

                            if (timebetplaced > voidTime) {
                                //the bet IS void!!!!!!
                                Currentbet.status = -102; //set the status to -102 - as the bet has been voided!!!!!
                                window.sessionStorage.setItem("Currentbet", $.toJSON(Currentbet));

                                BetValidCount = -1; //set this so the countdown doesn't think we've reached 0 and tell the user their bet is valid!!!!
                                //removed fadeOut due to problems with iPad and iOS6, delay and fadeout combined on a large scale seems to cause issues. Use hide instead - John
                                $('#' + displaymode + '_predictionpending').html("<strong>Too Late!</strong>, An event occurred before you could make a prediction! Your Credits were returned!");
                                $('#' + displaymode + '_predictionpending').show();
                                $('.tooltip-shade').show();
                                $('#' + displaymode + '_predictionpending').delay(3000).fadeOut();//queue(function() {
                                //    $('#' + displaymode + '_predictionpending').hide();
                                //}); 
                                $('#' + displaymode + '_count').hide();
                                $('.tooltip-shade').delay(3000).fadeOut();//.queue(function() {
                                //    $('.tooltip-shade').hide();
                                //});

                                //$('.forfeitclick').hide(); //hide forfeit - now hiding this regardless of whether we were counting down or not!!!

                                //now we want to reset the icon (i.e we no longer want it to be hightlighted as a selected bet option
                                //we need to keep any eye on this particular issue as there could be a problem if the admin click freeze bets by mistake ( although there is no easy fix!!!!)
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

                                if (BetNumberJustDisplayed > 0) {
                                    //we just told the user they needed "BetNumberJustDisplayed" more bets to unlick the higher bet level
                                    //however - their bet has just been voided!!!
                                    //so - they are need  "BetNumberJustDisplayed" + 1 more bets to unlock the higher bet level
                                    correctedBetsNeeded = (BetNumberJustDisplayed + 1);
                                    BetNumberJustDisplayed = 0;
                                    $('#' + displaymode + '_UnlockNumBetsSpan').html("<strong>" + correctedBetsNeeded + "</strong> more predictions");

                                    //do animation again!!!!!!
                                    $('.betnum').html(correctedBetsNeeded);
                                    $('.betnum').show();
                                    $('.betnum').animate({ top: '100px', fontSize: '45px', opacity: '0.0' }, 2000, function () {
                                        $('.betnum').hide();
                                        $('.betnum').css({ top: "", fontSize: "", opacity: "" });
                                    });

                                    SetTickerContent("creditLimit_ticker", GetCreditLimitTickerText(correctedBetsNeeded));
                                }
                            }
                        }
                    }
                }
                else if ((thisEventId == 23) && (!HaveWeReceviedThisFreezeOrThawEventBefore(thisEventLogID))) {
                    //bet thaw
                    var checkbet;
                    try {
                        checkbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
                    } catch (TempEx) { }

                    if ((checkbet != null) && (checkbet.status == -102)) { //&& (checkbet.status == 0)
                        //the user currently has a bet that has been voided!!!!

                        //once we get in here i want to update the status of the bet again - as it's no longer voided!!!
                        checkbet.status = 0; //set the status to -102 - as the bet has been voided!!!!!
                        window.sessionStorage.setItem("Currentbet", $.toJSON(checkbet));

                        //we need to highlight the bet icon again!!!!! ( as the bet which we thought was voided ..is now - no longer voided!!!!!)
                        $('#' + displaymode + '_bubble' + checkbet.eventid).removeClass("bubble");
                        $('#' + displaymode + '_bubble' + checkbet.eventid).addClass("bubble_active");
                        $('#' + displaymode + '_bubble' + checkbet.eventid).html(checkbet.amount);

                        //when the user plaveed a bet we told them - you need x more bets to unlock the 200 credit limit
                        //then ..when it was voided we told them you need x + 1 more bets 
                        //so now that we know it wasn;t actullay voided we need to show the mthe original number again!!!!!!
                        correctedBetsNeeded = (correctedBetsNeeded - 1);
                        $('#' + displaymode + '_UnlockNumBetsSpan').html("<strong>" + correctedBetsNeeded + "</strong> more predictions");
                        SetTickerContent("creditLimit_ticker", GetCreditLimitTickerText(correctedBetsNeeded));

                        //removed fadeOut due to problems with iPad and iOS6, delay and fadeout combined on a large scale seems to cause issues. Use hide instead - John
                        $('#' + displaymode + '_predictionpending').html("<strong>Doh!</strong>, The Referee made a mistake - there was no event! <br /><br />Your prediction is Active again.");
                        $('.tooltip-shade').show();
                        $('#' + displaymode + '_predictionpending').show();
                        $('#' + displaymode + '_predictionpending').delay(3000).fadeOut(); //.queue(function() {
                        //    $('#' + displaymode + '_predictionpending').hide();
                        //});
                        $('.tooltip-shade').delay(3000).fadeOut();//.queue(function () {
                        //    $('.tooltip-shade').hide();
                        //});

                        if ((remainingforfeits > 0) && (!$('.forfeitclick').is(':visible'))) {
                            //what can happen is - user can place a bet - admin hits bet freeze  - then user hits forfeit - then user gets told 'cant forfeit' - and the forfeit button gets hidden 
                            //BUT - if the admin then hits thaw - the user shoule be allowed forfeit again!!!!

                            $('.forfeitclick').show();
                            $('#' + displaymode + '_forfeitnum').html(remainingforfeits);
                            $('#' + displaymode + '_popupplacebet').hide();
                        }
                    }
                    else if ((checkbet != null) && (checkbet.status == 0)) {
                        //the user has a bet - it wasn't voided but IS still active - so....
                        //if the user has remaing forfeits - show the forfeit button!!!

                        if ((remainingforfeits > 0) && (!$('.forfeitclick').is(':visible'))) {
                            //what can happen is - user can place a bet - admin hits bet freeze  - then user hits forfeit - then user gets told 'cant forfeit' - and the forfeit button gets hidden 
                            //BUT - if the admin then hits thaw - the user shoule be allowed forfeit again!!!!

                            $('.forfeitclick').show();
                            $('#' + displaymode + '_forfeitnum').html(remainingforfeits);
                            $('#' + displaymode + '_popupplacebet').hide();
                        }
                    }

                }
                else if ((thisEventId != 22) && (thisEventId != 23))
                {
                    //all other events
                    var eventUpdateTime_date = new Date(eventUpdateTime); //need to change these strings into date objects
                    var eventEndTime_date = new Date(eventEndTime); //need to change these strings into date objects
                    UpdateGameEvent(thisFixtureId, thisEventId, thisEventLogID, thisHomeScore, thisAwayScore, thisDescription, eventUpdateTime_date, eventEndTime_date, PreviousEvents, MatchStartExtraDetails);

                    if ( (thisEventId == 15) || (thisEventId == 16) )
                    {
                        //we need to do a bit of logic here if the event was a peno
                        //if the event was a peno and the user has a bet and forfeits - then show the forfeit - cos a peno is NOT an event!!!!
                        var checkbet;
                        try {
                            checkbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
                        } catch (TempEx) { }
                        if ((checkbet != null) && (checkbet.status == 0)) {
                            //the user has a bet - it wasn't voided but IS still active - so....
                            //if the user has remaing forfeits - show the forfeit button!!!

                            if ((remainingforfeits > 0) && (!$('.forfeitclick').is(':visible'))) {
                                //what can happen is - user can place a bet - admin hits bet freeze  - then user hits forfeit - then user gets told 'cant forfeit' - and the forfeit button gets hidden 
                                //BUT - if the admin then hits thaw - the user shoule be allowed forfeit again!!!!

                                $('.forfeitclick').show();
                                $('#' + displaymode + '_forfeitnum').html(remainingforfeits);
                                $('#' + displaymode + '_popupplacebet').hide();
                            }
                        }
                    }//end peno logic
                }
            } //end fixture check
            else {
                var HomePagecheck = $('#TestlayoutSpan').html();
                if ((window.location.href.indexOf("/start") > 0) || (window.location.href.indexOf("/now") > 0) || (window.location.href.indexOf("/home") > 0) || (HomePagecheck))
                {
                    if ((thisEventId != 22) && (thisEventId != 23)) { //make sure not a freeze or a thaw!!!!
                        if (thisFixtureId == homepagefixtureid) {
                            //only output data related to the fixture on the homepage!!!
                            //we are on one of our landing pages!!!!
                            //so if we get a message here - just display it on the game tracker
                            var newFeedHTML = thisDescription + "<br />";
                            $('.GameFeedInfo').prepend(newFeedHTML);
                            refreshScroller(GameFeedScroller, "GameFeedInfo");
                        }
                    }
                }
            }
        } catch (ex) { logError("UpdateGameEvent", ex); }
    });//end UpdateGameEvent

    AdminPusher.bind("UpdateLeaderboard", function (data) {
        try {
            LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server
            var LeagueDetails = data[0];
            var leagueId = data[1];
            var thisFixtureId = data[2];
            var thisEventLogID = data[3];
            var totalUsersInLeague = data[4];

            //first make sure we are receiving details for the correct fixture - in case ther are two games going on at the same time
            if ((thisFixtureId == GetCurrentfixtureID()) )
            {
                LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server
                var weNeedToUpdateTheTicker = 1;

                if (!HaveWeReceviedThisLeagueTableBefore(thisEventLogID)) {
                    //new rule set 
                    //if user is viewing a league table then we update the table - if the table is the default league (i.e this one) then thats great we just update the HTML with this (LeagueDetails)
                    //but - if the user is NOT viewing a league table - then do absolutely NOTHING !!!!!!!
                    //we can make an API call the next time the user clicks to view the relevant table
                    var weAreCurrentlyViewingALeagueTable = 0;

                    if (displaymode == "m") {
                        //we are viewing the mobile version

                        if (($('#panel4').is(":visible") == true) && ($('#' + displaymode + '_leaguestandings_1').css('display') == "block")) {
                            //we are currently displaying the league panel for mobile - and we are showing the league table within that panel - so we need to update the table as there has been an event in the game!!!
                            weAreCurrentlyViewingALeagueTable = 1;
                        }
                        else if (($('#panel4').is(":visible") == false) && ($('#' + displaymode + '_leaguestandings_1').css('display') == "block")) {
                            //if we get here it means....
                            //we are NOT viewing the league tab on mobile
                            //however within the league tab the league table IS visible
                            //this means that the next time the user clicks on the tab we want to make an API call to fill the league table with the latest league positions
                            userLeague.Set_mobile_APICallStatus(1); //this is the only time this value should be set to 1 - we will reset this value to 0 when we display the league
                        }
                    }
                    else {
                        //this is the web view 
                        if (($('#' + displaymode + '_leaguestandings_1').css('display') == "block")) {
                            //we are currently displaying the league panel for mobile - and we are showing the league table within that panel - so we need to update the table as there has been an event in the game!!!
                            weAreCurrentlyViewingALeagueTable = 1;
                        }
                    }

                    if (weAreCurrentlyViewingALeagueTable == 1) {
                        //if we get here it means we are currently viewing a league table AND we have just recieved a new league table update

                        //so if we are currently viewing the league table we have recieved - then just update its html with the "LeagueDetails" value

                        if ((!userLeague.id) || (userLeague.id <= 0) || (userLeague.id == leagueId)) {
                            //we currently ARE showing this league

                            //check if the user is in the league table we just recevied 
                            var array = typeof objArray != 'object' ? JSON.parse(LeagueDetails) : LeagueDetails;
                            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                            var thisUserInOverAllLeaderboard = 0;
                            for (var i = 0; i < array.length; i++) {
                                if (array[i].F == thisUser.fbuserid) {
                                    thisUserInOverAllLeaderboard = 1;
                                    break; // we have found the user - now exit the loop
                                }
                            }
                            if (thisUserInOverAllLeaderboard == 1) {
                                //user IS on leaderboard we just recieved - so display it!!!!
                                userLeague.DisplayTheLeagueTable(LeagueDetails, leagueId, userLeague.name, null, userLeague.creater_Id, totalUsersInLeague); //userLeague.num_MembersInLeague
                            }
                            else {//user is NOT in leaderboard - so 

                                //bedfore we loop through the leaderboard set the leaderboard property to the LATEST and CORRECT leaderboard!!!
                                window.sessionStorage.setItem("leaderboard", LeagueDetails);
                                AddMyScoreToOverAllLeaderBoard(totalUsersInLeague);
                            }
                            weNeedToUpdateTheTicker = 0; //the above call to userLeague.DisplayTheLeagueTable will update the ticker for us - we dont want to update the ticker with the same info twice!!!!
                        }
                        else {
                            //we are currently viewing a different league table - but seeing as there has clearly been an event in the game
                            //- then we need to update this league table too - so make an API call!!!!!!!    
                            userLeague.GetLeagueTable(userLeague.id, userLeague.name, null, userLeague.creater_Id, userLeague.num_MembersInLeague);
                        }
                    }
                    else {
                        //if we are not curently viewing the league table then it will be updated the next time a user clicks on it!!!!!
                    }
                    if (weNeedToUpdateTheTicker == 1) {
                        SetTickerContent("LeagueStandings_ticker", GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame(LeagueDetails, totalUsersInLeague));
                    }
                }
            } //end fixture check
        } catch (ex) { logError("UpdateLeaderboard", ex); }
    });//end UpdateLeaderboard

    
    AdminPusher.bind("UpdateGameOdds", function (data) {
        try
        {
            LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server

            var newOdds = data[0];
            var thisFixtureId = data[1];

            //first make sure we are receiving details for the correct fixture - in case ther are two games going on at the same time
            if (thisFixtureId == GetCurrentfixtureID()) {
                updateOdds(newOdds); //this is the same function LightStreamer calls
            }
        } catch (ex) { logError("UpdateGameOdds", ex); }
    });//end UpdateGameOdds

    AdminPusher.bind("updateGameDetails", function (data) {
        try
        {
            LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server
            updateFixtureDetails(data[0]);
        } catch (ex) { logError("updateGameDetails", ex); }
    });//end updateGameDetails

    AdminPusher.bind("pusherTest", function (data) {
        try {
            LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server
            if (data[0] == 1)
            {
                $('.GameFeedInfo').prepend("<span class='wintext'><b>Pusher Still Alive!!!!</b></span> <br />");
                refreshScroller(GameFeedScroller, "GameFeedInfo");
            }
        } catch (ex) { logError("pusherTest", ex); }
    });//end updateGameDetails


    if (sp == 0) {  //we are NOT using seperate push connections - so bind to friend events here via the main admin pusher
        initialiseFriendProxyFunctions();
    }

    //this function is no longer sent from a live event message!!!!!
    AdminPusher.bind("confirmEventSent", function (data) {
        LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server
        
        admin.confirmEventSent();
    });//end confirmEventSent    
}

//this function will ensures that the user playing the game receives updates on all their friends bets 
function ListenForFriendUpdates() {
    
    try {
        var thisLocalFriendPusher;

        if (sp == 0) { //we are NOT using seperate push connections
            thisLocalFriendPusher = AdminPusher;
        }
        else {
            thisLocalFriendPusher = FriendPusher;
        }

        //logErrorExtra("SR_Con", "isSafari is " + isSafari + ":in ListenForFriendUpdates!!!", "", "", GetCurrentTimeStamp());
        var FunctionCompletedWithoutErrors = 0;
        var myfriends;
        try {
            myfriends = JSON.parse(window.sessionStorage.getItem("facebookfriendlist"));
        } catch (TempEx) { }

        if (
             (typeof (myfriends) != 'undefined' && myfriends != null)
             &&
             (PushConnectionStarted == 1)
             &&
             (FriendsAddedToLSSchema == 0) //only do this if it hasn't already been done ( we call this function twice - we only want to do it once!!!!!)
          ) {
            //only preceede if we have the friends list AND we have initialised SignalR!!!!
            uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            console.log("doin ListenForFriendUpdates " + "UD" + uiUser.fbuserid);

            thisLocalFriendPusher.joinGroup("UD" + uiUser.fbuserid);
            //thisLocalFriendPusher.joinGroup("UBD" + uiUser.fbuserid); //this is just for testing!
            
            //for (var i = 0; i <= 8; i++)
            for (var i = 0; i <= myfriends.length - 1; i++)
            {
                thisLocalFriendPusher.joinGroup("UBD" + myfriends[i].id);
                console.log("doin ListenForFriendUpdates " + "UBD" + myfriends[i].id);
            }
            FriendsAddedToLSSchema = 1;
            FunctionCompletedWithoutErrors = 1;

            //logErrorExtra("SR_Con", "isSafari is " + isSafari + ":Listening to friends Complete!!!", "", "", GetCurrentTimeStamp());
        } //end preceede if
        //else {
            //logErrorExtra("SR_Con", "isSafari is " + isSafari + ":did not create connection for friends in ListenForFriendUpdates!!! PushConnectionStarted is " + PushConnectionStarted + ", FriendsAddedToLSSchema is  " + FriendsAddedToLSSchema + ", myfriends is " + myfriends, "", "", GetCurrentTimeStamp());
        //}
    }
    catch (ex) {
        FunctionCompletedWithoutErrors = -1;
        logErrorExtra("ListenForFriendUpdates", ex, GetCurrentTimeStamp());
    }
    return FunctionCompletedWithoutErrors;
    
    //return 1;
}



