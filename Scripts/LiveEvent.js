//This function logs each time we interact with the current LiveEvent server
function LogThisInteractionTime() 
{
    //we have received a message from SignalR - so reset numREconnects value
    numReconnectsSinceWeLastReceivedASignalRMessage = 0;

    if (SignalRTimeout) //if we  were previously tryig to reconnect - then clear the values set in this process
    {
        clearTimeout(SignalRTimeout);
        SignalRTimeout = null;
    }

    var DateHelper = new Date();
    lastInteractionTime = DateHelper.getTime();
}

function CheckConnection() 
{
    //dont forget!!!! - only do this if the game is in progress!!!!! - i.e. don't keep reconnecting before the match or at halftime!!!!!
    //but what happens if we lose connection at half time and we never know when the game has restarted??????
    //so.. we probably DO need to make sure our connection stays alive at half-time and before the match!!!
    try {
        if ((gameOver == 0) && (gameisLive == 1)) //only do the Lightstream Reconnection/Reload flow if the game is NOT over AND the game is flagged as LIVE 
        {
            var restartTriggered = 0;
            try {
                var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                //logError("CheckConnection Debug", user.name + " in CheckConnection");
            } catch (e) { }

            ///////////////////////////////////////////////
            if (lastInteractionTime == null) {
                //this is the first time this function has been called and we have still not connected to or interacted with the current LiveEvent server!!!!
                //so.....attempt to connect to the current LiveEvent server!!!!
                var requestFixtureID = GetRequestParam("f");
                if (requestFixtureID > 0) {
                    LogThisInteractionTime();

                    if (LiveEventMethod == "LS")
                    {
                        //our current LiveEvent method is LightStreamer - so reconnect to LightStreamer!!!
                        LSBind();
                        SetUpLightstreamerPushTable("FixtureID" + fixture, "AMQ1", "AdminUpdates");
                        SetUpLightstreamerPushTable("FixtureID" + fixture, "AMQ2", "FriendUpdates");
                    }
                    else
                        if (LiveEventMethod == "SR") 
                        {
                            //our current LiveEvent method is SignalR - so reconnect to SignalR - by reloading page
                            logErrorExtra("SR_Con", "CheckConnection - about to call RestartSignalRConnection! - TimeSinceLastInteraction is nukll", "", "", GetCurrentTimeStamp());
                            RestartSignalRConnection("LiveEvent_NeverRecevied");
                            restartTriggered = 1;
                        }
                }
            }
            else {
                var DateHelper = new Date();
                var currentTime = DateHelper.getTime(); 
                var TimeSinceLastInteraction = parseInt((currentTime - lastInteractionTime) / 1000);

                if (
                    (TimeSinceLastInteraction > timeBetweenLightstreamConnections)
                    &&
                    (!$('.pregame-betpanel').is(":visible")) //don't do refresh if user is currently viewing the pregame bets panel
                   ) {
                    //we have exceeded the acceptable length of time without a message from the current LiveEvent server!!!!
                    //so...attempt reload of page!!!!
                    logErrorExtra("SR_Con", "isSafari is " + isSafari + ":CheckConnection - about to call RestartSignalRConnection! - TimeSinceLastInteraction is " + TimeSinceLastInteraction + " and timeBetweenLightstreamConnections is " + timeBetweenLightstreamConnections, "", "", GetCurrentTimeStamp());
                    RestartSignalRConnection("LiveEvent_TimeTooGreat");
                    restartTriggered = 1;
                }
                else { //start friend else
                    //we are receiving all the keepALive messages - now check if we are are currently listening out for our friends!!!
                    var myfriends;
                    try {
                        myfriends = JSON.parse(window.sessionStorage.getItem("facebookfriendlist"));
                    } catch (TempEx) { }

                    if (
                           ((typeof (myfriends) != 'undefined' && myfriends != null) && (myfriends.length > 0)) //we HAVE friends
                           &&
                            (($.connection.hub.groups == null) || ($.connection.hub.groups.length == 0) || ($.connection.hub.groups.length < myfriends.length)) //BUT we DONT have any groups set up with signalr for these friends!!!!!!
                       ) {
                        //we have friends BUT we DONT have any groups set up with signalr for these friends!!!!!!
                        //so - reinitialize our friend details!!!
                        logErrorExtra("SR_Con", "isSafari is " + isSafari + ":CheckConnection - we have friends BUT we DONT have any groups set up with signalr for these friends - so joining groups now!!!", "", "", GetCurrentTimeStamp());

                        GetFriendsBetHistoryForThisGame(); //this will get all our friends bets - (as we haven't been receving friend updates we wont have all the latest bets)
                        FriendsAddedToLSSchema = 0; //reset this so we can proceed with  ListenForFriendUpdates
                        var listening = 0;
                        listening = ListenForFriendUpdates(); //now attempt to join friend groups
                        if (listening <= 0) {
                            //we were unsuccessfull in our attempt to join groups - so restart total connection!!!!
                            logErrorExtra("SR_Con", "isSafari is " + isSafari + ":CheckConnection - unable to join groups - so restarting entire connection", "", "", GetCurrentTimeStamp());
                            RestartSignalRConnection("LiveEvent_NoFriends");
                            restartTriggered = 1;
                        }
                    }
                    else if (myfriends == null)
                    {
                        //we should have our friends list at this stage - but we dont!!
                        //so call getfriends!!!
                        GetFriends();
                    } //end myfriends is null
                }//end friend else
            }
        } 
    }
    catch (ex) {
        logError("CheckConnection", ex);
    }
    if (restartTriggered == 0) {
        //we have NOT triggered a restart - so continue checking the connection!!!!!!
        setTimeout("CheckConnection();", ((timeBetweenLightstreamConnections / 2) * 1000));
    }
    else {
        //we HAVE triggered a restart - so DONT continue checking the connection!!!!
        //the CheckConnection flow will be restarted again when the connection IS restarted!!!!
        var v = 1;
    }
}

//this function will ensures that the user playing the game receives updates on all their friends bets 
function ListenForFriendUpdates() {
    try {
         logErrorExtra("SR_Con", "isSafari is " + isSafari + ":in ListenForFriendUpdates!!!", "", "", GetCurrentTimeStamp());
         var FunctionCompletedWithoutErrors = 0;
         var myfriends;
         try {
            myfriends = JSON.parse(window.sessionStorage.getItem("facebookfriendlist"));
         } catch (TempEx) { }

         if (
              (typeof (myfriends) != 'undefined' && myfriends != null)
              &&
              (srstarted == 1)
              &&
              (FriendsAddedToLSSchema == 0) //only do this if it hasn't already been done ( we call this function twice - we only want to do it once!!!!!)
           ) {
             //only preceede if we have the friends list AND we have initialised SignalR!!!!
             uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

             //listen out for messages sent specifically to this user - i.e - invites!!!!
             if (LiveEventMethod == "LS") {
                 //our current LiveEvent method is LightStreamer  
                 schema.push("UD" + uiUser.id);
             }
             else if (LiveEventMethod == "SR") {
                 //liveGamesSignalRProxy.invoke('joingroup', "UD" + uiUser.fbuserid, uiUser.firstname);
                 liveGamesSignalRConnection.server.joingroup("UD" + uiUser.fbuserid, uiUser.firstname);
             }

             for (var i = 0; i <= myfriends.length - 1; i++) {
                 var tempFriendID = myfriends[i].id;
                 ////this feeds in info about friends bet's and friends joining the game

                 if (LiveEventMethod == "LS") {
                     //our current LiveEvent method is LightStreamer  
                     schema.push("UBD" + tempFriendID);
                 }
                 else if (LiveEventMethod == "SR") {
                     //our current LiveEvent method is SignalR
                     //liveGamesSignalRProxy.invoke('joingroup', "UBD" + tempFriendID, uiUser.firstname);
                     liveGamesSignalRConnection.server.joingroup("UBD" + tempFriendID, uiUser.firstname);
                     //logErrorExtra("SR_Con", "isSafari is " + isSafari + ":Listening to friend UBD" + tempFriendID, "", "", GetCurrentTimeStamp());
                 }
             }
             FriendsAddedToLSSchema = 1;
             FunctionCompletedWithoutErrors = 1;

             logErrorExtra("SR_Con", "isSafari is " + isSafari + ":Listening to friends Complete!!!", "", "", GetCurrentTimeStamp());

             if ((FriendsAddedToLSSchema == 1) && (LiveEventMethod == "LS")) {
                 //we have added friends to this schema - so configure the LightStreamer to recevie updates for these friends 
                 SetUpLightstreamerPushTable("FixtureID" + GetRequestParam("f"), "AMQ2", "FriendUpdates");
             }

         } //end preceede if
         else {
             logErrorExtra("SR_Con", "isSafari is " + isSafari + ":did not create connection for friends in ListenForFriendUpdates!!! srstarted is " + srstarted + ", FriendsAddedToLSSchema is  " + FriendsAddedToLSSchema + ", myfriends is " + myfriends, "", "", GetCurrentTimeStamp());
         }
    }
    catch (ex) 
    {
        FunctionCompletedWithoutErrors = -1;
        logErrorExtra("ListenForFriendUpdates", ex, GetCurrentTimeStamp());
    }
    return FunctionCompletedWithoutErrors;
}

