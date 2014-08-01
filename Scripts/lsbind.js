function LSBind(groupName) 
{
    if (LSBound == 0) { //don't bind Ls if it has already been done
       
        page = new PushPage();
        page.context.setDebugAlertsOnClientError(false); //this should be true in dev , false in live
        page.context.setDomain(appURL);
        page.onEngineCreation = function (engine) {
            LSEngine = engine;
            LogThisInteractionTime();
            logError("LSBind", "page.onEngineCreation - LightStreamer Engine is created!", "", "");
            LSEngine.context.setDebugAlertsOnClientError(false); //this should be true in dev , false in live
            LSEngine.connection.setLSHost(LightStreamURL);
            LSEngine.connection.setLSPort(8055);
            LSEngine.connection.setAdapterName("FBALLSRV");
            LSEngine.changeStatus("STREAMING");

            //added this new event for debugging purposes
            LSEngine.onStatusChange = function (newStatus) {
                logError("LSBind", "LightStream Status Changed. newStatus is " + newStatus + ".", "", ""); //+ userString
            }
        };
        
        /*
                page.onEngineReady = function (engine) {
                    alert("LightStreamer Engine is ready!");
                };
        */

        page.onEngineLost = function () {
            //try to reconnect here
            var requestFixtureID = GetRequestParam("f"); //GetRequestParam("Fixture");
            if (requestFixtureID > 0) {
                LogThisInteractionTime();
                ClearLightstreamObjects();
                LSBind("FixtureID" + requestFixtureID);
                GetGameDetails(fixture, GameDetailsComplete); //if we have lost connection we should go to DB and get all events ( as while we had no conncetion we may have missed something!!!)
                GetFriendsDetails(); //we also need to repopulate our friends leaderboard
                ViewLeagues(1); //also repopulate the overall scoreboard 
            }
            logError("LSBind", "LightStream connection lost. Reconnecting.", "", "");
        };

        //added these new events for debugging purposes
        //page.onClientError = function (errorMex) { alert("ClientError:error is " + errorMex); };
        //page.onClientAlert = function (code, errorMex) { alert("ClientError:error is " + errorMex + ":code is " + code); };

        page.bind();
        page.createEngine("SoccerBallApp", "LS", "SHARE_SESSION"); //"LS" param is wrong??? - should be path i.e. 

        group = new Array(groupName);

        pushTable = new NonVisualTable(group, schema, "MERGE");
        pushTable.setSnapshotRequired(true);
        pushTable.onItemUpdate = function (item, itemUpdate, itemName) {
            LogThisInteractionTime();
            //put all this function in a try/catch as it doesn't get caught by the global error catching - due to it being a call back function and run outside the scope of the error catching??
            try {
                //these params read in the details from LightStreamer
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

                //make sure schema variable is not null
                if (typeof (schema) == 'undefined' || schema == null) {
                    //schema IS null - this should NEVER happen. If it has something has gone wrong
                    alert("schema is null!!!");

                    //reset schema - but - we will not have friends in this schema and so we wont be able to do friend updates
                    schema = new Array("Ball", "EventID", "timestamp", "Adapter", "Admin", "FixtureID", "HomeScore", "AwayScore", "EventDescription", "EventLogID", "EventOdds", "UBD", "UserID", "BD", "EventTime");

                    FriendsAddedToLSSchema = 0;
                    AddMyFriendsToLightStreamerSchema() //try to add friends to the schema
                }

                for (var i = 0; i < schema.length; i++) {
                    if (itemUpdate.isValueChanged(schema[i])) {
                        var updateText = itemUpdate.getNewValue(schema[i]);
                        var schemaField = schema[i];

                        if (updateText != null) {
                            if (schemaField != "timestamp") //don't parse out timestamp for this value
                                updateText = updateText.substring(13); //remove timestamp
                            switch (schemaField) {
                                case "Ball":
                                    var divIndex = updateText.indexOf(",");
                                    if (divIndex > -1) {
                                        var x = parseInt(updateText.substr(0, divIndex + 1));
                                        var y = parseInt(updateText.substr(divIndex + 1));
                                        SendFBall.to(x, y);
                                    }
                                    break;
                                case "EventID":
                                    thisEventId = updateText;
                                    break;
                                case "FixtureID":
                                    thisFixtureId = updateText;
                                    break;
                                case "HomeScore":
                                    thisHomeScore = updateText;
                                    break;
                                case "AwayScore":
                                    thisAwayScore = updateText;
                                    break;
                                case "EventDescription":
                                    thisDescription = updateText;
                                    break;
                                case "EventLogID":
                                    thisEventLogID = updateText;
                                    break;
                                case "UBD":
                                    userBetDetails = updateText;
                                    break;
                                case "timestamp":
                                    timestamp = updateText;
                                    break;
                                case "UserID":
                                    friendUserID = updateText;
                                    break;
                                case "EventOdds":
                                    newOdds = updateText;
                                    break;
                                case "EventTime":
                                    eventUpdateTime = new Date(updateText);
                                    break;
                                case "KeepAlive":
                                    KeepAliveCount = KeepAliveCount + 1;
                                    break;
                                case "EventEndTime":
                                    eventEndTime = new Date(updateText);
                                    break;
                                case "PE":
                                    PreviousEvents = updateText;
                                    break;
                                default:
                                    // alert("DEFAULT: " + schemaField + "|" + updateText);
                                    if (schemaField.substring(0, 3) == "UBD") {
                                        AddBetToFriendsBetList(updateText);
                                    }
                                    else if (schemaField.substring(0, 3) == "UID") {
                                        DisplayInviteDetails(updateText);
                                    }
                                    else if (schemaField.substring(0, 2) == "LT") {
                                        var leagueId = schemaField.substring(2);
                                        UpdateLeaderboard(updateText, leagueId);
                                    }
                                    //if (schemaField.substring(0, 3) == "FBD") {
                                    //    //ForfeitFriendsBet(updateText);
                                    //    alert("ForfeitDetails " + updateText);
                                    //}
                                    break;
                            }
                        } else { } //end if (updateText != null) { ?
                    } else { } // end if (itemUpdate.isValueChanged(schema[i])) {
                }; //end for loop?

                //when we reach here we should have read in all the values from LightStreamer
                if ((thisEventLogID > 0)) { // && (thisFixtureId > 0) && (thisEventLogID > 0)
                    //logError("LSBind", "EventReceived is " + thisEventId, "", "");
                    UpdateGameEventFromLightStreamer(thisFixtureId, thisEventId, thisEventLogID, thisHomeScore, thisAwayScore, thisDescription, eventUpdateTime, eventEndTime, PreviousEvents); //, newOddsCounter
                }

                if (newOdds) {
                    updateOdds(newOdds);
                    //MakeSurePitchIsDisplayed();
                }
            }
            catch (ex) {
                logError("LSBind", ex);
            }

        };       //end pushTable.onItemUpdate

       page.addTable(pushTable, "livegames");
       //LSBound = 1;
    } //END if (LSBound == 0) {
}; //end lsbind???


function ClearLightstreamObjects() 
{
    LSEngine = null;
    page = null;
    group = null;
    pushTable = null;
}

//this function adds users friends to the LightStreamer schema - so we can display their updates
//this function is called from fb.js GetFriends function - ie - when we get our list of friends from facebook
function AddMyFriendsToLightStreamerSchema() {
    try
    {

        uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

        //temp 
        //schema.push("UBD" + uiUser.fbuserid);
        //end temp//

        schema.push("UID" + uiUser.fbuserid) //this feeds in info about invites by friends - in this case we are listening out for messages sent to us (so we are the only people who pick this up) as opposed to the other friend schema items below in which we are listening out for details about other people (which get picked up by more than one person)

        if (FriendsAddedToLSSchema == 0) { //only do this if it hasn't already been done
            var myfriends = JSON.parse(window.sessionStorage.getItem("facebookfriendlist"));
            if (typeof (myfriends) != 'undefined' && myfriends != null) {
                for (var i = 0; i <= myfriends.length - 1; i++) {
                    var tempFriendID = myfriends[i].id;
                    schema.push("UBD" + tempFriendID); //this feeds in info about friends bet's and friends joining the game
                    //schema.push("UID" + tempFriendID); //this is just temporary - for testing!!! - so i can pick up messages invites to John/James
                }
                FriendsAddedToLSSchema = 1;
            }
        }
    }
    catch (ex) {
        logError("AddMyFriendsToLightStreamerSchema", ex);
    }
}

function AddLeagueToLightStreamer(LeagueID) {
    //we have just created a league - we need to update LighStreamer so we can receive updates for this new league
    var requestFixtureID = GetRequestParam("f"); //GetRequestParam("Fixture");
    if (requestFixtureID > 0) {
        schema.push("LT" + LeagueID);
        LSBind("FixtureID" + fixtureCheck);
    }
}

//This function logs each time we interact with the LightStreamer server
function LogThisInteractionTime() {
    var DateHelper = new Date();
    lastInteractionTime = DateHelper.getTime();
}

function CheckConnection() 
{
    //dont forget!!!! - only do this if the game is in progress!!!!! - i.e. don't keep reconnecting before the match or at halftime!!!!!
    //but what happens if we lose connection at half time and we never know when the game has restarted??????
    //so.. we probably DO need to make sure our connection stays alive at half-time and before the match!!!
    try 
    {
        if (gameOver == 0)  //only do the Lightstream Reconnection/Reload flow if the game is NOT over
        {
            ///////////////////////////////////////////////
            if (lastInteractionTime == null) 
            {
                //this is the first time this function has been called and we have still not connected to or interacted with lightStreamer!!!!
                //so.....attempt to connect to LightStreamer!!!!! - 
                var requestFixtureID = GetRequestParam("f");
                if (requestFixtureID > 0) {
                    LogThisInteractionTime();
                    LSBind("FixtureID" + requestFixtureID);
                }
            }
            else 
            {
                var DateHelper = new Date();
                var currentTime = DateHelper.getTime(); //we have just connected to LightStreamer
                var TimeSinceLastInteraction = parseInt( (currentTime - lastInteractionTime) / 1000);


                //logError("LSBind", "Checking Connection Time!!!!!!!", "", "");
                if (TimeSinceLastInteraction > timeBetweenLightstreamConnections) 
                {
                    //we have exceeded the acceptable length of time we are prepared to wait between LightStream interactions
                    //so...attempt reconnect!!!!
                    var requestFixtureID = GetRequestParam("f");
                    if (requestFixtureID > 0) {

                        //redirect entire page here!!!!!
                        $('#reconnectstatus').fadeIn(200).delay(1100).fadeOut(200);
                        var ReconnectHTML = "Connection lost. Reconnecting...<br />";
                        $('.GameFeedInfo').prepend(ReconnectHTML);
                        logError("LSBind", "Connection lost. Reloading page!!!!!!!", "", "");
                        refreshScroller(GameFeedScroller, "GameFeedInfo");
                        setTimeout("ReloadPage();", (1500)); //reload the page in 1.5 seconds 
                    
                        //LogThisInteractionTime();
                        //ClearLightstreamObjects();
                        //logError("LSBind", "Manual Rebind To LightStreamer!!!", "", "");
                        //LSBind("FixtureID" + requestFixtureID);

                        //not sure about including the lines below - we don't want to be reloading all tese things every one minute do we???
                        //GetGameDetails(fixture, GameDetailsComplete); //if we have lost connection we should go to DB and get all events ( as while we had no conncetion we may have missed something!!!)
                        //GetFriendsDetails(); //we also need to repopulate our friends leaderboard
                        //ViewLeagues(1); //also repopulate the overall scoreboard 
                    }
                }
            }
            //at the end of this function - ALWAYS set it to run again!!!!
            setTimeout("CheckConnection();", ((timeBetweenLightstreamConnections/2) * 1000)); 
            //////////////////////////////////////////////
        } //game over
    }
    catch (ex) {
        logError("CheckConnection", ex);
    }   
}


function ReloadPage() {
    var requestFixtureID = GetRequestParam("f");
    window.location = location.protocol + '//' + location.host + "/Game/?f=" + requestFixtureID;
}