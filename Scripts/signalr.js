var stevetest = 1;
var signalRcrossdomainurl = "http://signal.t5livegames.com";
var listOfConnectionIds = new Array();
var SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce = 0;
var ConnectionCheckInProgress = 0;
var thisConnectionIsAReconnect = 0;
var numReconnectsSinceWeLastReceivedASignalRMessage = 0;
var StartingInProgress = 0;
var SignalRTimeout = null;
var SignalRWaitInterval = 10000; //10 seconds

//function StartSignalR(restartingconnection) {
function StartSignalR(Origin) {
    //logErrorExtra("SR_Con", "In StartSignalR Origin is " + Origin + ", StartingInProgress is " + StartingInProgress + " time is  " + GetCurrentTimeStamp(), "", "", GetCurrentTimeStamp());
    //need to put an if here - we seem to be calling this too much - investiage why and put a stop to it!!!!
    //i think that if we call this - then go to join groups - BUT - before we attempt to join the group - we call start again which kills the previous connection???
    //i dunno - investiage - why do we go in here so often???
    //we shouldn;t
    if (StartingInProgress == 0) {
        //logErrorExtra("SR_Con", "About to call $.connection.hub.start. time is  " + GetCurrentTimeStamp(), "", "", GetCurrentTimeStamp());
        StartingInProgress = 1;
        $.connection.hub.start(function () {
            //connection.start(function () {
            //listOfConnectionIds.push(liveGamesSignalRConnection.connection.id);
            if (srstarted == 0) {
                //LogThisInteractionTime(); //log fact we have connected as if we have recevied a message!!!!!!!!
                SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce = 1;
                //logErrorExtra("SR_Con", "isSafari is " + isSafari + ":Connection created!!", "", "", GetCurrentTimeStamp());
                srstarted = 1;

                //initialiseProxyFunctions();

                //we now dont class the signalR connection as having started  - untill we have successfully listened for friend updates!!!
                //srstarted = ListenForFriendUpdates();
                ListenForFriendUpdates();

                //if (!restartingconnection) { //if we are restarting the signalr connection we dont want to start the CheckConnection flow here - this flow is already running
                if (ConnectionCheckInProgress == 0) {
                    setTimeout("CheckConnection();", (timeBetweenLightstreamConnections * 1000));    //check our connection
                    ConnectionCheckInProgress = 1;
                }

                try {
                    if ((admin) && (keepAliveStarted == 0) && (admin.isAdmin())) {
                        admin.SendKeepAlive();
                    }
                } catch (e) { }
            }
        });
    }
    else {
        //logErrorExtra("SR_Con", "Not calling $.connection.hub.start. time is  " + GetCurrentTimeStamp(), "", "", GetCurrentTimeStamp());
    }
};

function RestartSignalRConnection(Origin) {
    //keepAliveStarted = 0;
    logErrorExtra("SR_Con", "In RestartSignalRConnection Origin is " + Origin + "time is  " + GetCurrentTimeStamp(), "", "", GetCurrentTimeStamp());

    StartingInProgress = 0; //reset this value

    //set this so we can start the CheckConnection flow again after the signalR restart!
    //we dont want the connection flow running when we are restaring the connetion - we know the connection is down!!!!
    //thats why we are here!!!! - so there's no need for the connection flow to continue!!!!!
    ConnectionCheckInProgress = 0; 
    numReconnectsSinceWeLastReceivedASignalRMessage = numReconnectsSinceWeLastReceivedASignalRMessage + 1;

    if (numReconnectsSinceWeLastReceivedASignalRMessage == 3) {
        //this is the 3rd time we've tried to reconnect since we last received a message from SignalR
        //so instead of reconnecting we will do a page refresh this time
        //the reason for this is that - if we keep trying to reconnect then the signalR behaviour
        //will not be reliable - we often move to longpolling and it can lead to errors
        //safest thing to do is to refresh - really we should very rarely have to do a refresh 
        //(unless the admin is having a problem)

        $('#' + displaymode + '_reconnectstatus').fadeIn(200).delay(1100).fadeOut(200);
        var ReconnectHTML = "Connection lost. Reconnecting...<br />";
        $('.GameFeedInfo').prepend(ReconnectHTML);
        logErrorExtra("SignalR", "Failed to Re_establish Conn. numAttempts is " + numReconnectsSinceWeLastReceivedASignalRMessage + ".Reloading page!!", "", "", GetCurrentTimeStamp());
        refreshScroller(GameFeedScroller, "GameFeedInfo");
        setTimeout("ReloadPage();", (1500)); //reload the page in 0.5 seconds 
    }
    else {
        //start signalR as normal!!!!

        //anytime we try to restart the signalR connection I am going to create a timeout that reloads the page if we haven;t recevied any message from 
        //signalR within the time period (usually 10 seconds!!)
        //this is because we are seeing occasions when IE is finding it hard to reconnect by re-initialising SignalR 
        //so --if 10 seconds from now our reconnect logic hasn;t resulted in us receiving at least one message from signalR - then refresh page!!!!

        SignalRTimeout = setTimeout(function () {
            //if we reach here then we have spent 10 seconds trying to re- establish the connection and have not been able to - so prompt a reload of page here!!!!! //if we reach here then we have spent 10 seconds trying to re- establish the connection and have not been able to - so prompt a reload of page here!!!!!
            $('#' + displaymode + '_reconnectstatus').fadeIn(50).delay(400).fadeOut(50);
            var ReconnectHTML = "Connection lost. Reconnecting...<br />";
            $('.GameFeedInfo').prepend(ReconnectHTML);
            logErrorExtra("SignalR", "Failed to Re_establish Conn. numAttempts is " + numReconnectsSinceWeLastReceivedASignalRMessage + ".Reloading page!!", "", "", GetCurrentTimeStamp());
            refreshScroller(GameFeedScroller, "GameFeedInfo");
            setTimeout("ReloadPage();", (500)); //reload the page in 0.5 seconds 
        }, SignalRWaitInterval);


        FriendsAddedToLSSchema = 0; //reset t his so we join all our friend groups for the new connection
        //connection.stop();
        //connection = null;
        $.connection.hub.stop();
        logErrorExtra("SR_Con", "isSafari is " + isSafari + ":Setting srstarted to 0!!!!!", "", "", GetCurrentTimeStamp());
        srstarted = 0;
        //$.connection.hub = null;
        liveGamesSignalRProxy = null;
        initializeSignalR(1);
        //resetTickerInfo();
        GetGameDetails(0, GameDetailsComplete);
        if (WeAreCurrentlyShowingFriendsLeagueTable == true) {
            userLeague.GetFriendsLeaderBoard();
        }        
    }
}

//function initializeSignalR(restartingconnection)  //key to this function is when to call it?? as soon as possible ?? or after page has loaded???
function initializeSignalR()
{
    try {
        //logErrorExtra("SR_Con", "In initializeSignalR ", "", "", GetCurrentTimeStamp());

        liveGamesSignalRConnection = $.connection.liveevent;
        
        if( (IOSversion == 6) && (isSafari == 1) ) {
            //if the user is on IOS6 (and using safari!!) then we need to connect to SignalR on a different url than what the site is on 
            //- this is due to a ios6 bug - when this is fixed then remove this bit of code
            //alert("ios6 - connecting crossDomain");
            //connection = $.hubConnection(signalRcrossdomainurl);
            //$.connection.liveevent.url = signalRcrossdomainurl;
            liveGamesSignalRConnection.url = signalRcrossdomainurl;
            logError("SR_Con", "IOS 6 flow", "", "");
        }
        else {
            //not ios6 - so connect to local domain
            //connection = $.hubConnection();
        }
        
        //liveGamesSignalRProxy = connection.createProxy('liveevent');

        var timeout = null;
        var interval = 10000; //10 seconds

        $.connection.hub.stateChanged(function (change) {
            if (change.newState === $.signalR.connectionState.reconnecting) {
                thisConnectionIsAReconnect = 1;
                $('.connectionstatus').html("reconnecting");
                //logErrorExtra("SR_Con", "isSafari is " + isSafari + ":Reconnecting!!!", "", "", GetCurrentTimeStamp());
                timeout = setTimeout(function () {
                    //if we reach here then we have spent 10 seconds trying to re- establish the connection and have not been able to - so prompt a reload of page here!!!!! //if we reach here then we have spent 10 seconds trying to re- establish the connection and have not been able to - so prompt a reload of page here!!!!!
                    logErrorExtra("SR_Con", "setTimeout - about to call RestartSignalRConnection!", "", "", GetCurrentTimeStamp());
                    RestartSignalRConnection("ReconnectingTimeout");
                }, interval);
            }
            else if (change.newState === $.signalR.connectionState.connected) {
                $('.connectionstatus').html("Connected");
                //logErrorExtra("SR_Con", "isSafari is " + isSafari + ":state is now Connected!!!", "", "", GetCurrentTimeStamp());

                if (thisConnectionIsAReconnect == 1) {
                    //SignalR attempted to reconnect 
                    //After this happens we lose the groups we were in - so re-establish them now
                   // logErrorExtra("SR_Con", "isSafari is " + isSafari + ":connected After reconnect - so now join groups again!!!!!!", "", "", GetCurrentTimeStamp());
                    FriendsAddedToLSSchema = 0; //reset this so we join all our friend groups
                    ListenForFriendUpdates();
                }
                thisConnectionIsAReconnect = 0;

                //listOfConnectionIds.push(liveGamesSignalRConnection.connection.id);
                if (timeout) //if we  were previously tryig to reconnect - then clear the values set in this process
                {
                    clearTimeout(timeout);
                    timeout = null;
                }
                if (SignalRTimeout) //if we  were previously tryig to reconnect - then clear the values set in this process
                {
                    clearTimeout(SignalRTimeout);
                    SignalRTimeout = null;
                }
            }
            else if (change.newState === $.signalR.connectionState.disconnected) {
                $('.connectionstatus').html("disconnected");
                //alert("disconnnected!!!!!");
            }
            else if (change.newState === $.signalR.connectionState.connecting) {
                $('.connectionstatus').html("Connecting");
            }
        });
        
        $.connection.hub.logging = true; //will most likely want to make this a configurable db value!!!!!!
        initialiseProxyFunctions();

        //if (!restartingconnection) { //we only want to start signalr with a delay on the page load - NOT on any subsequent restarts (which are due to temporarily losing connection)
        if (SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce == 0) {
            if (isSafari == 1) {
                if (displaymode == "w") {
                    setTimeout("StartSignalR('FromInitSafariWeb');", (2000));
                }
                else {
                    //if we are on mobile lets delay the signalrR connecting until slightly later
                    //they key is to only connet to signalR once the rest of the page has loaded!!!!!!
                    //even 5 seconds might not be enough if you are on a slow connection - but then if your connection is that slow you most likely will
                    //not be able to enjoy a good game experience anyway!!!!!
                    setTimeout("StartSignalR('FromInitSafariMobile');", (5000));
                }
            }
            else {
                //if we are not on safari then start signalR instantly
                StartSignalR('FromInit');
            }
        }
        else {
            //StartSignalR(restartingconnection);
            StartSignalR('FromInit');
        }
    }
    catch (ex) {
        logError("StartingSignalR", ex);
    }
}

function initialiseProxyFunctions() {
    // Declare functions on the liveEventProxy so the server(i.e. the Signalr HUB) can invoke them///////////////////////////////////////////


    $.connection.hub.connectionSlow(function () {
        //we go in here if signalR notices itself that it is having some connection issues due to slow/buggy networks
        //if this event is triggered 'signalR will try to recover. When this succeeds, nothing happens. If this fails, the stateChanged event will fire with "reconnecting" as it's new state.'

        var newFeedHTML = "<span class='losetext'>You are experiencing connection issues due to your network!!! <br />You may not be receiving all messages due to these connection issues!!</span><br />";
        $('.GameFeedInfo').prepend(newFeedHTML); 
        refreshScroller(GameFeedScroller, "GameFeedInfo");

        if (displaymode == "m")
        {
            var tickerWarningText = '<li class="news-item">You are experiencing connection issues due to your network!!!</li><li class="news-item">You may not be receiving all messages due to these connection issues!!</li>';
            //we are viewing the mobile version - so add this info to ticker!!!!!!!!!
            SetTickerContent("connectionWarningDetails_ticker", tickerWarningText)
        }
        //alert('There seems to be some connectivity issues...');
    });

    liveGamesSignalRConnection.client.UpdateGameEvent = function (thisFixtureId, thisEventId, thisEventLogID, thisHomeScore, thisAwayScore, thisDescription, eventUpdateTime, eventEndTime, PreviousEvents, MatchStartExtraDetails) {

        //liveGamesSignalRProxy.on('UpdateGameEvent', function (thisFixtureId, thisEventId, thisEventLogID, thisHomeScore, thisAwayScore, thisDescription, eventUpdateTime, eventEndTime, PreviousEvents, MatchStartExtraDetails) {
        LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server

        //first make sure we are receiving details for the correct fixture - in case ther are two games going on at the same time
        if (thisFixtureId == GetCurrentfixtureID()) {

            LastEventReceived = thisEventId;
            if ((thisEventId == 22) && (!HaveWeReceviedThisFreezeOrThawEventBefore(thisEventLogID))) {
                //this is a bet freeze

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
                            $('#' + displaymode + '_predictionpending').delay(3000).hide();
                            $('#' + displaymode + '_count').hide();
                            $('.tooltip-shade').delay(3000).hide();

                            $('.forfeitclick').hide(); //hide forfeit

                            //now we want to reset the icon (i.e we no longer want it to be hightlighted as a selected bet option
                            //we need to keep any eye on this particular issue as there could be a problem if the admin click freeze bets by mistake ( although their is no easy fix!!!!)
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
                    $('#' + displaymode + '_predictionpending').html("<strong>Doh!</strong>, The Referee made a mistake - there was no event!!! <br /><br />Your prediction is Active again!");
                    $('.tooltip-shade').show();
                    $('#' + displaymode + '_predictionpending').show();
                    $('#' + displaymode + '_predictionpending').delay(3000).hide();
                    $('.tooltip-shade').delay(3000).hide();


                    //ANd show the forfeit again
                    if ((remainingforfeits > 0) && (!$('.forfeitclick').is(':visible'))) {
                        //what can happen is - user can place a bet - admin hits bet freeze  - then user hits forfeit - then user gets told 'cant forfeit' - and the forfeit button gets hidden 
                        //BUT - if the admin then hits thaw - the user shoule be allowed forfeit again!!!!

                        $('.forfeitclick').show();
                        $('#' + displaymode + '_forfeitnum').html(remainingforfeits);
                        $('#' + displaymode + '_popupplacebet').hide();
                    }
                }
            }
            else if ((thisEventId != 22) && (thisEventId != 23)) {
                //all other events
                var eventUpdateTime_date = new Date(eventUpdateTime); //need to change these strings into date objects
                var eventEndTime_date = new Date(eventEndTime); //need to change these strings into date objects
                UpdateGameEvent(thisFixtureId, thisEventId, thisEventLogID, thisHomeScore, thisAwayScore, thisDescription, eventUpdateTime_date, eventEndTime_date, PreviousEvents, MatchStartExtraDetails);
            }
        } //end fixture check
        //});
    };

    liveGamesSignalRConnection.client.UpdateGameOdds = function (newOdds, thisFixtureId) {
    //liveGamesSignalRProxy.on('UpdateGameOdds', function (newOdds, thisFixtureId) {
        LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server

        //first make sure we are receiving details for the correct fixture - in case ther are two games going on at the same time
        if (thisFixtureId == GetCurrentfixtureID()) {
            updateOdds(newOdds); //this is the same function LightStreamer calls
        } //end fixture check
    //});
    };

    liveGamesSignalRConnection.client.keepalive = function () {
    //liveGamesSignalRProxy.on('keepalive', function () {
        //every time this function is called it means we are still connected to the server 
        LogThisInteractionTime();
        //});
    };

    liveGamesSignalRConnection.client.leave = function (ConnectionId, date) {
    //liveGamesSignalRProxy.on('leave', function (ConnectionId, date) {
        if (listOfConnectionIds.indexOf(ConnectionId) > 0) {
            //alert("leave called - I must have disconnected!!!! " + ConnectionId);
        }
        //});
    };

    liveGamesSignalRConnection.client.UpdateLeaderboard = function (LeagueDetails, leagueId, thisFixtureId, thisEventLogID, totalUsersInLeague) {
    //liveGamesSignalRProxy.on('UpdateLeaderboard', function (LeagueDetails, leagueId, thisFixtureId,thisEventLogID, totalUsersInLeague) {
        //we have just recieved a League update

        //first make sure we are receiving details for the correct fixture - in case ther are two games going on at the same time
        if (thisFixtureId == GetCurrentfixtureID()) {
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
    //}); //end UpdateLeaderboard
    };

    liveGamesSignalRConnection.client.updateGameDetails = function (GameDetailsUpdateString) {
        LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server
        updateFixtureDetails(GameDetailsUpdateString);
    };

    liveGamesSignalRConnection.client.confirmEventSent = function (EventDetailsString) {
        LogThisInteractionTime(); 
        
        try
        {
            if ((admin) && (admin.isAdmin()))
            {
                //parse string
                var EventDetails = EventDetailsString.split(":");
                var eventSent = EventDetails[0];
                var newEventID = EventDetails[1];
                if ((eventSent == 22)) {
                    //the message we just sent was the FREEZE message and we now know it IS in DB
                    freezeInDB = newEventID;

                    if ( (lastEventSent != 22)  && (lastEventSent != 23) ) {
                        //we just recieved confirmation that our FREEZE event was logged in the DB - BUT the last message we sent was NOT a FREEZE event (and not a thaw - if it's a thaw we dont care - thats not a problem!!!)
                        //this means that the FREEZE event may have reached the DB AFTER the actual event ( this should never happen but has been known to happen )

                        //so send a thaw!!!! ( this will ensure that the last event we sent was NOT a freeze and so will mean users can place bets whnever they wish!!!!!
                        admin.thawBets();
                        logError("FreezeIssue", "We had to send a thaw!!!! - lastEventSent is " + lastEventSent + ", newEventID is " + newEventID);
                    }
                }
            }
        }
        catch (ex) {}
    };


    liveGamesSignalRConnection.client.DisplayLeagueInvite = function (inviteID, leagueID, leagueName, inviter_UserID, inviter_UserName, FixtureID) {
    //liveGamesSignalRProxy.on('DisplayLeagueInvite', function (inviteID, leagueID, leagueName, inviter_UserID, inviter_UserName, FixtureID) {
        LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server
        userLeague.DisplayLeagueInvite(inviteID, leagueID, leagueName, inviter_UserID, inviter_UserName, FixtureID);
        //});
    };

    liveGamesSignalRConnection.client.ProcessFriendUpdate = function (updateDetails, fbuserid, thisFixtureId) {
    //liveGamesSignalRProxy.on('ProcessFriendUpdate', function (updateDetails, fbuserid, thisFixtureId) {
        LogThisInteractionTime(); //first - log the fact we hvae received a  message from our liveEvent server

        //first make sure we are receiving details for the correct fixture - in case ther are two games going on at the same time
        if (thisFixtureId == GetCurrentfixtureID()) {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            ProcessFriendUpdate(updateDetails, fbuserid); //this is the same function LightStreamer calls
        } //end fixture check
        // });
        };
    //end of functions which server can call////////////////////////////////////////////////////////////////////////
}

