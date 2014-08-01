//admin object - using module pattern!!!!
var Administrator = function (userObj) {

    //declare properties ( all properties declared here are private)
    var user = userObj;
    var inPreview = 0;
    var secureGroupName = 0;
    var MidMatchCleanupinProgress = 0; //we use this property to stop us calling the function twice if the user hits it twice and it takes ages to run
    var refereesBroadcastGroup = "";
    var numNotificationsSent = 0;
    var numNotificationsFailed = 0;
    var numNotifications = 0;

    //declare public functions/properties
    return {

        user: user,

        secureGroupName :secureGroupName,

        isAdmin: function () { //returns true if the current user is an administrator
            var isAdmin = false;
            try {   
                if ((user) && (user.level == "trust5")) {
                    isAdmin = true;
                }
            }
            catch (ex) {
                logError("isAdmin", ex);
            }
            return isAdmin;
        },

        SendKeepAlive: function () //this sends a keepAlive message every 5 seconds - we use this messsage to figure out on the clients side if we've lost connection 
        {
         
            try {
                //liveGamesSignalRProxy.sendkeepalive();
                //liveGamesSignalRProxy.invoke('sendkeepalive');

                /* dont do keepAlive for moment - T5Pusher should take cate of this!!!!!!!
                liveGamesSignalRConnection.server.sendkeepalive();
                //after every message we send we want to send another keepAlive 5 seconds later!!!!!
                setTimeout("admin.SendKeepAlive();", 5000);
                */
                keepAliveStarted = 1;
            }
            catch (ex) {
                //var error = ex.GetError();
                //Console.WriteLine(error.StatusCode);
            }
        },

        //this function gets The secureGropuName which the administrator needs to send broadcast messages!!!
        SetUpRefereesSecureGroup: function () 
        {
            try {
                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                refereesBroadcastGroup = guid;
                AdminPusher.CreateSecureGroup(refereesBroadcastGroup, "CreateBroadcastGroupReturn", 1);
            }
            catch (ex) {
                alert("error creating broadcast group!!! ex is " + ex.toString());
            }
        },



        DisplayAdminDivs: function () {
            $('#AdminButtons').show();
            $('#AdminExtraButtons').show();
            $('#slide5').show();
            //hide game buttons not relevant to admin UI
            $('#gameoptions').hide();
            $('#slide2').hide();
        },
        showFreeze: function () {
            $("#EventID22").show(); //show freeze button
            $('.' + displaymode + '_pitch-icons').hide();
        },
        freezeBets: function () {
            freezeInDB = 0;

            //liveGamesSignalRConnection.server.logEvent(22, GetCurrentfixtureID(), 0, null, user.id, user.fbuserid, ""); //,admin.GetEventTimeStamp() - //no longer send timestamp ( duplicate messages was NOt the issue - and we want to send as little data as possible!!)
            
            //for using T5Pusher sending a message from the admin is now a two step process
            //step 1- we log the event in our DB ( this will update the tables etc) via AJAX API
            admin.putEventDetailsInDB(22,0,'','');
           
            lastEventSent = 22; //we want to record the last event we sent - this will help use determine if the freeze event DID get to DB before the actual game event!!!!!

            admin.populateListOfGoalScorers();
            $("#EventID22").hide(); //hide freeze button
            $("#EventID23").show(); //show thaw button
            $('.' + displaymode + '_pitch-icons').show();
        },

        ResetBackup: function () {
            try {
                if ((admin) && (admin.isAdmin())) {
                    var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                    $.ajax(
                          {
                              url: WS_URL_ROOT + "/Admin/RB",
                              type: "POST",
                              data: "u=" + user.id + "&fu=" + user.fbuserid,
                              error: function (XMLHttpRequest, textStatus, errorThrown) {
                                  AjaxFail("RB", XMLHttpRequest, textStatus, errorThrown);
                              },
                              success: function (response) {
                                  //step 2 - we then post the relevant data (which we will receive from AJAX response) to all players via T5Pusher!!!
                                  if (response > 0) {
                                      $('.GameFeedInfo').prepend("DB Backup values reset!!!<br />");
                                  }
                                  else {
                                      $('.GameFeedInfo').prepend("DB Backup values NOT reset - contact DBA!!!<br />");
                                  }
                              }//end success
                          }
                    ); //end ajax call
                } //end admin if
            }
            catch (ex) { logError("ResetBackup", ex); }
        }, //end putEventDetailsInDB

        putEventDetailsInDB: function (eventid, fboid, BroadCastMessage, EventTimeStamp) {
            try {
                if ((admin) && (admin.isAdmin())) {


                    if (currentlyConnected == 1)
                    {

                        //only send if we ARE connected!!!!!!!
                        var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                        $.ajax(
                              {
                                  url: WS_URL_ROOT + "/Admin/LogEvent",
                                  type: "POST",
                                  data: "eventID=" + eventid + "&FixtureID=" + GetCurrentfixtureID() + "&FBOID=" + fboid + "&BroadCastMessage=" + BroadCastMessage + "&EventTimeStamp=" + EventTimeStamp + "&u=" + user.id + "&fu=" + user.fbuserid,
                                  error: function (XMLHttpRequest, textStatus, errorThrown) {
                                      AjaxFail("setLive", XMLHttpRequest, textStatus, errorThrown);
                                  },
                                  success: function (response) {
                                      //step 2 - we then post the relevant data (which we will receive from AJAX response) to all players via T5Pusher!!!
                                      if (response) {
                                          admin.pushEventDetailsToPlayers(response);
                                      }
                                  }//end success
                              }
                        ); //end ajax call
                    }
                    else
                    {
                        alert("you are NOT connected to T5Pusher!!!!! - reload page to establish connection - then - send message again!!!!!!!");
                    }
                    
                } //end admin if
            }
            catch (ex) { logError("putEventDetailsInDB", ex); }
        }, //end putEventDetailsInDB

        testPusher: function (Event) {
            try {
                if ((admin) && (admin.isAdmin())) {
                    var testArray = new Array();
                    testArray.push(1);

                    //join this group so we can test the Pusher 
                    var thisUser;
                    try {
                        thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                    } catch (ex) { }
                    AdminPusher.push("pusherTest", testArray, "PT" + thisUser.fbuserid); //PT = pusher Test
                }
            }
            catch (ex) { logError("testPusher", ex); }
        }, //end testPusher



        pushEventDetailsToPlayers: function (Event) {
            try {
                if ((admin) && (admin.isAdmin())) {
                    
                    if (Event.c) {
                        admin.confirmEventSent(Event.c);
                    }

                    //send event
                    if (Event.ne) {
                        var eventdetailsArray = new Array();
                        eventdetailsArray.push(Event.f); //thisFixtureId
                        eventdetailsArray.push(Event.e); //thisEventId
                        eventdetailsArray.push(Event.ne); //thisEventLogID
                        eventdetailsArray.push(Event.h); //thisHomeScore
                        eventdetailsArray.push(Event.a); //thisAwayScore
                        eventdetailsArray.push(Event.d); //thisDescription
                        eventdetailsArray.push(Event.t); //eventUpdateTime
                        eventdetailsArray.push(Event.et); //eventEndTime
                        eventdetailsArray.push(Event.p); //PreviousEvents
                        eventdetailsArray.push(Event.s); //MatchStartExtraDetails
                        AdminPusher.push("UpdateGameEvent", eventdetailsArray, refereesBroadcastGroup);
                    }

                    //send odds
                    if (Event.o) {
                        var oddsArray = new Array();
                        oddsArray.push(Event.o);
                        oddsArray.push(GetCurrentfixtureID());
                        AdminPusher.push("UpdateGameOdds", oddsArray, refereesBroadcastGroup);
                    }

                    //send league table
                    if (Event.i) {
                        var leagueArray = new Array();
                        leagueArray.push(Event.l); //LeagueDetails
                        leagueArray.push(Event.i); //leagueId
                        leagueArray.push(Event.f); //thisFixtureId
                        leagueArray.push(Event.ne); //thisEventLogID
                        leagueArray.push(Event.n); //totalUsersInLeague
                        AdminPusher.push("UpdateLeaderboard", leagueArray, refereesBroadcastGroup);
                    }
                }
            }
            catch (ex) { logError("confirmEventSent", ex); }
        }, //end confirmEventSent

        confirmEventSent: function(EventDetailsString) {
            try {
                if ((admin) && (admin.isAdmin())) {
                    //parse string
                    var EventDetails = EventDetailsString.split(":");
                    var eventSent = EventDetails[0];
                    var newEventID = EventDetails[1];
                    if ((eventSent == 22)) {
                        //the message we just sent was the FREEZE message and we now know it IS in DB
                        freezeInDB = newEventID;

                        if ((lastEventSent != 22) && (lastEventSent != 23)) {
                            //we just recieved confirmation that our FREEZE event was logged in the DB - BUT the last message we sent was NOT a FREEZE event (and not a thaw - if it's a thaw we dont care - thats not a problem!!!)
                            //this means that the FREEZE event may have reached the DB AFTER the actual event ( this should never happen but has been known to happen )

                            //so send a thaw!!!! ( this will ensure that the last event we sent was NOT a freeze and so will mean users can place bets whnever they wish!!!!!
                            admin.thawBets();
                            logError("FreezeIssue", "We had to send a thaw!!!! - lastEventSent is " + lastEventSent + ", newEventID is " + newEventID);
                        }
                    }
                }
            }
            catch (ex) { logError("confirmEventSent", ex); }
        }, //end confirmEventSent

        thawBets: function () {
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            
            //liveGamesSignalRConnection.server.logEvent(23, GetCurrentfixtureID(), 0, null, user.id, user.fbuserid, ""); //,admin.GetEventTimeStamp() - //no longer send timestamp ( duplicate messages was NOt the issue - and we want to send as little data as possible!!)
            admin.putEventDetailsInDB(23, 0, '', '');

            freezeInDB = 1; //once we send a thaw we can assume that there is no freeze in the DB!!!!!
            lastEventSent = 23; //we want to record the last event we sent - this will help use determine if the freeze event DID get to DB before the actual game event!!!!!
            $("#EventID22").show(); //show freeze button
            $("#EventID23").hide(); //hide thaw button
            $('.' + displaymode + '_pitch-icons').hide();
        },

        confirmEvent: function (eventid) {

            if (freezeInDB == 0) {
                //the freeze event still hasn't been confirmed in DB - so sleep for half a second before we call the actual event!!
                setTimeout("admin.SendEvent(" + eventid + ");", 500);
                logError("FreezeIssue", "We had to delay sending the actual event. eventid is " + eventid);
            }
            else
            {
                //we DO have the freeze in the DB ...so ...continue sending event to DB
                logError("NoFreezeIssue", "We did NOT have to delay sending the actual event. eventid is " + eventid);
                admin.SendEvent(eventid); 
            }
            //if we did NOT have the freeze event
            //maybe send a thaw here to gaurantee we will have no error in future!!!!
        },

        SendEvent : function(eventid){
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            //liveGamesSignalRConnection.server.logEvent(eventid, GetCurrentfixtureID(), 0, null, user.id, user.fbuserid, ""); //,admin.GetEventTimeStamp() - //no longer send timestamp ( duplicate messages was NOt the issue - and we want to send as little data as possible!!)

            //for using T5Pusher sending a message from the admin is now a two step process
            //step 1- we log the event in our DB ( this will update the tables etc) via AJAX API
            admin.putEventDetailsInDB(eventid, 0, '', '');

            lastEventSent = eventid; //we want to record the last event we sent - this will help use determine if the freeze event DID get to DB before the actual game event!!!!!

            //now message has been sent - hide pitch - show freeze
            $("#EventID22").show(); //show freeze button
            $("#EventID23").hide(); //hide thaw button
            $('.' + displaymode + '_pitch-icons').hide();
            $("#confirmevent").hide();
        },

        GetEventTimeStamp : function() {
            var EventTimeStamp = new Date();
            return EventTimeStamp.getTime();
        }, //end GetEventTimeStamp

        confirmGoal: function (eventid) {
            var firstGoalScorerBetID = parseInt($("#betoptionselect9").val());
            if (firstGoalScorerBetID >= 0) {
                var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                
                //liveGamesSignalRConnection.server.logEvent(eventid, GetCurrentfixtureID(), firstGoalScorerBetID, null, user.id, user.fbuserid, ""); //,admin.GetEventTimeStamp() - //no longer send timestamp ( duplicate messages was NOt the issue - and we want to send as little data as possible!!)
                //for using T5Pusher sending a message from the admin is now a two step process
                //step 1- we log the event in our DB ( this will update the tables etc) via AJAX API
                admin.putEventDetailsInDB(eventid, firstGoalScorerBetID, '', '');

                lastEventSent = eventid; //we want to record the last event we sent - this will help use determine if the freeze event DID get to DB before the actual game event!!!!!
                $("#confirmgoal").hide();
                $("#EventID22").show(); //show freeze button
                $("#EventID23").hide(); //hide thaw button
                $('.' + displaymode + '_pitch-icons').hide();
            }
            else {
                alert("YOU MUST SELECT WHO SCORED!!!!");
            }
        },

        sendEvent: function (eventID, eventDesc) {
            if ((eventID == 4) || (eventID == 6)) //goal
            {
                $("#confirmgoal").show();
                $('#confirmgoal').animate({ top: '55px' }, 300);
                $('#confirmgoal').attr("style", "display:block;z-index:900;");
                $('#confirmgoal h4').html("You have selected <span style='color:#FFFFCC;'>" + eventDesc + "</span><br />Select the GoalScorer and confirm the event.");
                $("#confirmgoalbutton").attr('onClick', 'admin.confirmGoal(' + eventID + ')');
            }
            else {
                $("#confirmevent").show();
                $('#confirmevent').animate({ top: '55px' }, 300);
                $('#confirmevent').attr("style", "display:block;z-index:900;");
                $('#confirmevent h4').html("You have selected <span style='color:#FFFFCC;'>" + eventDesc + "</span><br />Are you sure?");
                $("#confirmeventbutton").attr('onClick', 'admin.confirmEvent(' + eventID + ')');
            }
        },
        sendBroadcastMessage: function (eventid, eventdesc) {
            if (eventid == 27) {
                eventdesc = $("#broadcastmessagetext").val();
                if ((eventdesc) && (eventdesc.length > 0)) {
                    //this is a broadcast message with the text written by the administrator
                    if (confirm("You have selected to send out the message \n'" + eventdesc + "' \nAre you sure?")) {
                        var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

                        //liveGamesSignalRConnection.server.logEvent(eventid, GetCurrentfixtureID(), 0, eventdesc, user.id, user.fbuserid, ""); //,admin.GetEventTimeStamp() - //no longer send timestamp ( duplicate messages was NOt the issue - and we want to send as little data as possible!!)

                        //for using T5Pusher sending a message from the admin is now a two step process
                        //step 1- we log the event in our DB ( this will update the tables etc) via AJAX API
                        admin.putEventDetailsInDB(eventid, 0, eventdesc, '');

                        lastEventSent = eventid; //we want to record the last event we sent - this will help use determine if the freeze event DID get to DB before the actual game event!!!!!
                        $('#broadcastmessagetext').value = ""; //clear input field after sending so we don't send message twice if user clicks send button my mistake!!!!!!
                    }
                }
                else {
                    alert("You can't send empty broadcast messages!!!!!!");
                }
            }
            else {
                //pre-defined broadcast message
                if (confirm("You have selected " + eventdesc + "\nAre you sure?")) {
                    var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                    //liveGamesSignalRConnection.server.logEvent(eventid, GetCurrentfixtureID(), 0, null, user.id, user.fbuserid, ""); //,admin.GetEventTimeStamp() - //no longer send timestamp ( duplicate messages was NOt the issue - and we want to send as little data as possible!!)

                    //for using T5Pusher sending a message from the admin is now a two step process
                    //step 1- we log the event in our DB ( this will update the tables etc) via AJAX API
                    admin.putEventDetailsInDB(eventid, 0, '', '');

                    lastEventSent = eventid; //we want to record the last event we sent - this will help use determine if the freeze event DID get to DB before the actual game event!!!!!
                }
            }
        },
        configureStartButtons: function () {
            //This IS the admin - now we need to figure out what buttons to display to the administrator
            if (thisFixture) {
                switch (thisFixture.currenthalf) {
                    case -101: admin.notStartedSetup(); break; //game hasn't started yet
                    case -102: admin.halfTimeSetup(); break; //Half Time!!
                    case -103: admin.fullTimeSetup(); break; //Full Time!!
                    case 1: admin.firstHalfSetup(); break;  //admin.showFreeze(); //1st half - so show freeze button
                    case 2: admin.secondHalfSetup(); break;  //admin.showFreeze(); //2nd half - so show freeze button	
                    default: break;
                }

               // if (thisFixture.live == 0) {
                    //the game has still not been flagged live in the db yet - so show the button to let the admin set it live

                    //no longer use this functionality - we rely on the t5Pusher heartbeat instead!!! 
                    //$("#setLive").show();
               // }
            }
        },

        setLive: function () {
            //this function sets the game to live in the DB
            if (confirm("Are you sure?")) {
                var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/SetLive",
                        type: "POST",
                        data: "f=" + GetCurrentfixtureID() + "&u=" + user.id,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("setLive", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            if (response == 1) {
                                $("#setLive").hide();
                                alert("Game is now live!");
                            }
                        }
                    }
                );
            }
        }, //end setLive

        notStartedSetup: function () {
            $('.' + displaymode + '_pitch-icons').hide();
            $("#EventID22").hide(); //game not started yet..so hide freeze bet button
            $("#EventID11").show(); //show the button to start the game
            $("#EventID12").hide();
            $("#EventID13").hide();
            $("#EventID14").hide();
            $("#EventFullTime").hide();
        },
        halfTimeSetup: function () {
            $('.' + displaymode + '_pitch-icons').hide();
            $("#EventID22").hide(); //game not started yet..so hide freeze bet button
            $("#EventID11").hide();
            $("#EventID12").hide();
            $("#EventID13").show(); //show the button to start the 2nd half!!!
            $("#EventID14").hide();
            $("#EventFullTime").hide();
            $("#previewpitchdiv").hide(); //it is half -time - so hide preview pitch button
        },

        fullTimeSetup: function () {
            $('.' + displaymode + '_pitch-icons').hide();
            $("#EventID22").hide(); //full-time ..so hide freeze bet button
            $("#EventID11").hide();
            $("#EventID12").hide();
            $("#EventID13").hide();
            $("#EventID14").hide();
            $("#previewpitchdiv").hide(); //it is full -time - so hide preview pitch button
            $("#BackupToDisk").show(); //shoe the livegames-ref the button to do a full time clean up!!!!

            $("#ShowAwardPrizes").show(); //show the button to allow the admin to award prizes after game has ended!

            //need to do the two below things later!!!!
            //document.getElementById("EventFullTime").style.display = "inline-block";
            //document.getElementById("BackupToDisk").style.display = "inline-block"; //shoe the livegames-ref the button to do a full time clean up!!!!
            //ResetFixtureOdds(); - ?????? - do we need to do this ???
        }

        , firstHalfSetup: function () {
            $('.' + displaymode + '_pitch-icons').hide();
            $("#EventID22").show(); //we are in 1st half..so show freeze bet button
            $("#EventID11").hide();
            $("#EventID12").show(); //show the button to end the first half (i.e set half time!!!)
            $("#EventID13").hide();
            $("#EventID14").hide();
            $("#EventFullTime").hide();
        },
        secondHalfSetup: function () {
            $('.' + displaymode + '_pitch-icons').hide();
            $("#EventID22").show(); //we are in 2nd half..so show freeze bet button
            $("#EventID11").hide();
            $("#EventID12").hide();
            $("#EventID13").hide();
            $("#EventID14").show(); //show the button to end the match (i.e set Full time!!!)
            $("#EventFullTime").hide();
            $("#previewpitchdiv").show(); //it is 2nd half - so show preview pitch button again
        },
        startGame: function () {
            $('.' + displaymode + '_pitch-icons').hide();
            $("#EventID22").show(); //we are in 2nd half..so show freeze bet button
            $("#EventID11").hide();
            $("#EventID12").hide();
            $("#EventID13").hide();
            $("#EventID14").show(); //show the button to end the match (i.e set Full time!!!)
            $("#EventFullTime").hide();
        },

        ShowAwardPrizes: function () {
            $("#setMatchPrizes").show();
            $("#awardcreditsresult").html("");
            userLeague.GetOfficialLeagues_ForAdmin("FixturesLeaguePrizes");
        },

        previewPitch: function () {
            if (inPreview == 0) {
                //go into PreviewPitch mode
                $('.match-notstarted').hide();
                inPreview = 1; //we set this so if the user clicks on any of the events while in a preview - the event does not trigger!!
                $('.' + displaymode + '_pitch-icons').show();
                $('.pitch-container').show();
                $('.pitch').show();
            }
            else {
                //leave PreviewPitch mode
                inPreview = 0;
                $('.' + displaymode + '_pitch-icons').hide();

                if ($("#EventID11").is(':visible')) {
                    //if in here it measn that the game has not started yet ( as the 'Start Game' button is visible)
                    //so..hide the pitch canvas and the pitch container!!!!
                    $('.pitch-container').hide();
                    $('.pitch').hide();
                }
            }
        },
        inPreview: function () { //returns true if we are currently in previewPitchmode
            return inPreview;
        },

        CleanupDBMidMatch: function () { //goes to DB and removes data from tblBetsResultsArchive - this enables us complete bets in this table quicker!!!!!
            if (MidMatchCleanupinProgress == 0) {

                if (confirm("Are you sure?")) {
                    $.ajax(
                            {
                                url: WS_URL_ROOT + "/Game/MidGameDBCleanUp",
                                type: "POST",
                                data: "fixtureID=" + GetCurrentfixtureID(),
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    AjaxFail("GetLastEvent", XMLHttpRequest, textStatus, errorThrown);
                                },
                                success: function (response) {
                                    MidMatchCleanupinProgress = 0;
                                    if (response) {
                                        if (response.result == 1) {
                                            $('.GameFeedInfo').prepend("<span class='losetext'>DB cleaned up <br />" + response.details + "</span><br />");
                                        }
                                    }
                                    else {
                                        $('.GameFeedInfo').prepend("<span class='losetext'>Error cleaning up DB!!! <br /></span>");
                                    }
                                }
                            }
                        );
                    MidMatchCleanupinProgress = 1;
                    $('.GameFeedInfo').prepend("DB Clean up started!<br />");
                }
            }
        },

        ChangeDiskMemoryTableStatus: function (NewStatus) {

            if (confirm("Are you sure you want to change the LiveGames system to use " + NewStatus + " tables?????! - This may take a few moments"))
            {
                $("#memdiskstatusdiv").hide();
                $("#changingsystem").show();
                
                var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                $.ajax(
                {
                    url: WS_URL_ROOT + "/Game/SetSystemMemoryDiskStatus",
                    type: "POST",
                    data: { u: thisUser.id, fu: thisUser.fbuserid, g: 1, s: NewStatus },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("ChangeDiskMemoryTableStatus", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {
                        if (response) {
                                        if (response == 1) 
                                        {
                                            alert("System switched to use " + NewStatus + " tables");

                                            if (NewStatus == "Memory") {
                                                ShowThatWeAreUsingMemoryTables();
                                            }
                                            else {
                                                ShowThatWeAreUsingDiskTables();
                                            }
                                        }
                                        else if (response == -2) {
                                            alert("System already using " + NewStatus + " tables");
                                        }
                                        else if (response == -3) {
                                            alert("failed to back up tables before moving to Memory system");
                                        }
                                        else if (response == -4) {
                                            alert("failed to back up tables before moving to Disk system");
                                        }
                                        else {
                                            alert("failed to do update");
                                        }
                                    }
                                    else {
                                        alert("failed to do update");
                                    }
                                }
                       }
                   );
            }
        }, //end ChangeDiskMemoryTableStatus


        BackupDBToDisk: function () { //this function fires off a call to an API that copies all the data in our memory tables to disk tables

            if (confirm("Are you sure you want to Back up the memory tables to disk now??!")) {
                $.ajax(
                   {
                       url: WS_URL_ROOT + "/Game/BackupToDisk",
                       type: "POST",
                       data: "fixtureID=" + GetCurrentfixtureID(),
                       error: function (XMLHttpRequest, textStatus, errorThrown) {
                           AjaxFail("BackupToDisk", XMLHttpRequest, textStatus, errorThrown);
                       },
                       success: function (response) {
                           if (response)
                           {
                               if (response.backupresult > 0) {
                                   $('.GameFeedInfo').prepend("<span class='losetext'>" + "Data Backed up to Disk!<br /> " + replaceAll("brk", "<br />", response.backupdetails) + "</span>");
                                   refreshScroller(GameFeedScroller, "GameFeedInfo");
                                   //call ViewDBComparison here!!! - show user the number of rows in each table for this fixture!!!!
                               }
                               else if (response.backupresult == -4) {
                                   $('.GameFeedInfo').prepend("Unable to back up to disk - awaiting previous MEMORY backup to complete - this can take up to 5 minutes - if this function still does not run in  max 10 minutes - contact administrator!!!!<br />");
                               }
                               else if (response.backupresult == -5) {
                                   $('.GameFeedInfo').prepend("Unable to back up to disk - awaiting previous LEAGUE backup to complete - if this function still does not run in  max 10 minutes - contact administrator!!!!<br />");
                               }
                               else {
                                   $('.GameFeedInfo').prepend("Error backing up data to disk!!!!<br />");
                               }
                           }
                           else {
                               $('.GameFeedInfo').prepend("Error backing up data to disk!!!!<br />");
                           }
                       }
                   }
               );
                $('.GameFeedInfo').prepend("Starting backing up memory tables to disk ..this may take a number of minutes....<br />");
            }
        }, //end BackupDBToDisk


        RebootMemoryTables: function () { //this function fires off a call to an API that copies all the data in our memory tables to disk tables

            if (confirm("Are you sure you want to reboot the memory tables now??!  You MUST have backed up to disk before calling this or you will LOSE ALL DATA!!!!!")) {

                if (confirm("This will kill any games currently running????!!??!")) {

                    $.ajax(
                   {
                       url: WS_URL_ROOT + "/Game/RebootMemoryTables",
                       type: "POST",
                       data: "fixtureID=" + GetCurrentfixtureID(),
                       error: function (XMLHttpRequest, textStatus, errorThrown) {
                           AjaxFail("RebootMemoryTables", XMLHttpRequest, textStatus, errorThrown);
                       },
                       success: function (response) {
                           if (response) {
                               if (response.resetresult > 0) {
                                   $('.GameFeedInfo').prepend("<span class='wintext'>System Rebooted!<br /> " + replaceAll("brk", "<br />", response.resetdetails) + "</span>");
                                   refreshScroller(GameFeedScroller, "GameFeedInfo");
                                   //call ViewDBComparison here!!! - show user the number of rows in each table for this fixture!!!!
                               }
                               else {
                                   $('.GameFeedInfo').prepend("Error rebooting memory tables!!!<br />");
                               }
                           }
                           else {
                               $('.GameFeedInfo').prepend("Error rebooting memory tables!!!!<br />");
                           }
                       }
                   });
                    $('.GameFeedInfo').prepend("Starting memory tables reboot to disk ..this may take a number of minutes....<br />");
                }; //end 2nd confirm
            }; //end 1st confirm
        }, //end RebootMemoryTables


        CompareMemoryTables: function () { //this function fires off a call to an API that copies all the data in our memory tables to disk tables

            if (confirm("Are you sure you want to Compare the disk and memory table contents for this fixture????!")) {
                $.ajax(
                   {
                       url: WS_URL_ROOT + "/Game/CompareMemoryTables",
                       type: "POST",
                       data: "fixtureID=" + GetCurrentfixtureID(),
                       error: function (XMLHttpRequest, textStatus, errorThrown) {
                           AjaxFail("CompareMemoryTables", XMLHttpRequest, textStatus, errorThrown);
                       },
                       success: function (response) {
                           if (response) {
                               $('.GameFeedInfo').prepend("<span class='losetext'>" + replaceAll("brk", "<br />", response) + "</span>");
                               refreshScroller(GameFeedScroller, "GameFeedInfo");
                           }
                       }
                   }
               );
                $('.GameFeedInfo').prepend("Starting the comparisson of the disk and memory table contents for this fixture ..this may take a number of minutes....<br />");
            }
        }, //end CompareMemoryTables


        PopulateEditTeamColourDropDowns: function () {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            if (!teamcolours) {
                $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/GetTeamColours",
                        type: "POST",
                        data: "f=" + GetCurrentfixtureID() + "&u=" + thisUser.id,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("GetTeamColours", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            teamcolours = typeof response != 'object' ? JSON.parse(response) : response;
                            window.sessionStorage.setItem("teamcolours", teamcolours);
                            admin.PopulateEditTeamColourDropDowns_DisplayHTML(teamcolours);
                        }
                    }
                );
            }
            else {
                admin.PopulateEditTeamColourDropDowns_DisplayHTML(teamcolours);
            }

        }, //PopulateEditTeamColourDropDowns

        PopulateEditTeamColourDropDowns_DisplayHTML: function (teamcolours) {
            var HomeTeamColourDropDown = "<select id='edithometeamcolour' name='edithometeamcolour'>";
            var AwayTeamColourDropDown = "<select id='editawayteamcolour' name='editawayteamcolour'>";
            for (var i = 0; i < teamcolours.length; i++) {
                if (thisFixture.hometeamcolour == teamcolours[i]) {
                    HomeTeamColourDropDown = HomeTeamColourDropDown + "<option selected value='" + teamcolours[i] + "'>" + teamcolours[i] + "</option>";
                }
                else {
                    HomeTeamColourDropDown = HomeTeamColourDropDown + "<option value='" + teamcolours[i] + "'>" + teamcolours[i] + "</option>";
                }

                if (thisFixture.awayteamcolour == teamcolours[i]) {
                    AwayTeamColourDropDown = AwayTeamColourDropDown + "<option selected value='" + teamcolours[i] + "'>" + teamcolours[i] + "</option>";
                }
                else {
                    AwayTeamColourDropDown = AwayTeamColourDropDown + "<option value='" + teamcolours[i] + "'>" + teamcolours[i] + "</option>";
                }
            }
            HomeTeamColourDropDown = HomeTeamColourDropDown + "</select>";
            AwayTeamColourDropDown = AwayTeamColourDropDown + "</select>";
            $('#hometeamcolourdiv').html(HomeTeamColourDropDown);
            $('#awayteamcolourdiv').html(AwayTeamColourDropDown);
        }, //PopulateEditTeamColourDropDowns_DisplayHTML

        EditPusherDetails: function () {
            $("#UpdateStatus").html("");
            $('#editpusherdetails').show();
            $('#EditPusher').hide();
            $("#PusherURL").html();
            $("#UpdateStatus").html();
            $("#PusherDDL option[value='0']").attr("selected", "selected");
        }, //end EditPusherDetails

        EditIndividualPusher: function () {
            var pusher = $("#PusherDDL").val();

            $.ajax({
                url: WS_URL_ROOT + "/Admin/GetPusherURLS",
                type: "POST",
                data: "p=" + pusher + "&u=" + user.id + "&fu=" + user.fbuserid,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetPusherURLS", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    var PusherURLS = typeof response != 'object' ? JSON.parse(response) : response;

                    if ((PusherURLS) && (PusherURLS.length > 0)) {
                        $('#EditPusher').show();
                        $("#PusherURL").html("");
                        for (var i = 0; i < PusherURLS.length; i++) {

                            if (PusherURLS[i].id > 0) {
                                

                                $("#PusherURL").append('<option selected >' + PusherURLS[i].url + '</option>');
                            }
                            else {
                                $("#PusherURL").append('<option>' + PusherURLS[i].url + '</option>');
                            }
                        }
                    }
                }
            });


        }, //end EditIndividualPusher

        UpdatePusherURL: function () {
            var pusher = $("#PusherDDL").val();
            var pusherurl = $("#newpushurl").val();

            if (!pusherurl) {
                pusherurl = $("#PusherURL").val();
            }

            if ((pusher) && (pusherurl)) {
                $.ajax({
                    url: WS_URL_ROOT + "/Admin/UpdatePusherURL",
                    type: "POST",
                    data: "p=" + pusher + "&pu=" + pusherurl + "&u=" + user.id + "&fu=" + user.fbuserid,
                    dataType: "html",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("GetPusherURLS", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {

                        if (response > 0) {
                            //pusher url was updated!!!
                            $('#editpusherdetails').hide();
                            alert("pusher url was updated - reload the game page and check the pusherurl in the Chrome console view to confirm!!!");
                        }
                        else {
                            //pusher url was NOT updated!!!
                            $("#UpdateStatus").html("<br />pusher url was NOT updated - contact system administrator!!!");
                        }
                    }
                });
            }
            else {
                $("#UpdateStatus").html("<br />You must select the pusher AND1 enter or select a valid URL");
            }

           
        }, //end UpdatePusherURL


        UpdateNumPushers: function () {

            var numPushers = "1";
            var selected = $("input[type='radio'][name='SeperatePushers']:checked");
            if (selected.length > 0) {
                numPushers = selected.val();
            }

           
            $.ajax({
                url: WS_URL_ROOT + "/Admin/UpdateNumPushers",
                type: "POST",
                data: "np=" + numPushers + "&u=" + user.id + "&fu=" + user.fbuserid,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("UpdateNumPushers", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {

                    if (response > 0) {
                        //pusher url was updated!!!
                        $('#editpusherdetails').hide();
                        alert("number of pusher urls was updated - reload the game page and check the number of pusherurls in the Chrome console view to confirm!!!");
                    }
                    else {
                        //pusher url was NOT updated!!!
                        $("#UpdateStatus").html("<br />pusher numbers were NOT updated - contact system administrator!!!");
                    }

                }
            });
            
            

           
        }, //end UpdatePusherURL



        GetNumPushers: function () {

            var numPushers = "1";
            var selected = $("input[type='radio'][name='SeperatePushers']:checked");
            if (selected.length > 0) {
                numPushers = selected.val();
            }


            $.ajax({
                url: WS_URL_ROOT + "/Admin/GetNumPushers",
                type: "POST",
                data: "np=" + numPushers + "&u=" + user.id + "&fu=" + user.fbuserid,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetNumPushers", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {

                    if (response > -1) {
                        //pusher url was updated!!!
                        $("#sp" + response).attr('checked', 'checked');
                    }
                }
            });

        }, //end GetNumPushers


        DisplayEditMatchPopUp: function () {
            try {
                userLeague.GetOfficialLeagues_ForAdmin("FixturesLeague");
                $('#editmatchdetails').show();
                $("#hometeamname").val(thisFixture.hometeam);
                $("#awayteamname").val(thisFixture.awayteam);

                $("#homecrest").val(thisFixture.homecrest);
                $("#awaycrest").val(thisFixture.awaycrest);
                $("#fixturedescription").val(thisFixture.fd);
                $("#fixturecrest").val(thisFixture.fc);

                $("#kotime").val(thisFixture.starttime);
                //$("#kotime").val("06/20/2013T12:30:00");
                
                //$("#kotime").val("2013-03-18T13:00");

                if (thisFixture.hp == 1) {
                    $("#hp_1").attr('checked', 'checked'); //homePage Fixture

                }
                else {
                    $("#hp_0").attr('checked', 'checked'); //NOT homepage Fixture
                }

                var TeamPlayingFromLEftToRightHTML = "<select id='editteamdirection' name='editteamdirection'>";

                if (thisFixture.firsthalfleftteam == thisFixture.hometeam) {
                    TeamPlayingFromLEftToRightHTML = TeamPlayingFromLEftToRightHTML + "<option value='1'>" + thisFixture.hometeam + "</option>" + "<option value='2'>" + thisFixture.awayteam + "</option>";
                }
                else {
                    TeamPlayingFromLEftToRightHTML = TeamPlayingFromLEftToRightHTML + "<option value='2'>" + thisFixture.awayteam + "</option>" + "<option value='1'>" + thisFixture.hometeam + "</option>";
                }

                TeamPlayingFromLEftToRightHTML = TeamPlayingFromLEftToRightHTML + "</select>";
                $('#teamDirectionhtml').html(TeamPlayingFromLEftToRightHTML);
                $("#editvoid").val(thisFixture.voidOffset);
                admin.PopulateEditTeamColourDropDowns();
            }
            catch (ex) { alert(ex); }
        }, //end DisplayEditMatchPopUp

        EditMatchDetails: function () {
            try {
                var hometeam_name = $("#hometeamname").val();
                var awayteam_name = $("#awayteamname").val();

                var homecrest = $.trim($("#homecrest").val());
                var awaycrest = $.trim($("#awaycrest").val());
                var fixturecrest = $.trim($("#fixturecrest").val());
                var fixturedescription = $.trim($("#fixturedescription").val());
                var tsko = $("#kotime").val();

                var homepageFixture = "0";
                var selected = $("input[type='radio'][name='HomePageFixture']:checked");
                if (selected.length > 0) {
                    homepageFixture = selected.val();
                }

                if (homepageFixture == 1) {
                    if ((!fixturecrest) || (!tsko)) {
                        $("#editstatus").html("You MUST set the image and ko Time for the homepage fixture!!!!!!");
                        return -1;
                    }
                }

                var hometeam_colour = $("#edithometeamcolour").val();
                var awayteam_colour = $("#editawayteamcolour").val();

                var firsthalfleftteam = $("#editteamdirection").val();

                if (firsthalfleftteam == 1) {
                    //the user wants the home team to be playing from left to right in the first half
                    firsthalfleftteam = hometeam_name;
                }
                else {
                    //the user wants the away team to be playing from left to right in the first half
                    firsthalfleftteam = awayteam_name;
                }

                var voidtime = $("#editvoid").val();
                if (isNaN(voidtime)) {
                    voidtime = thisFixture.voidOffset;
                }

                var leaguesForThisFixture;
                try
                {
                    leaguesForThisFixture = $("#FixturesLeague").val().toString();
                } catch (ex) {
                    //if there are no leagues selected we will go in here!
                    leaguesForThisFixture = "";
                }

                var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

                if (
                    ((hometeam_name) && (awayteam_name))
                    &&
                    (hometeam_name != awayteam_name)
                   ) {
                    $.ajax({
                        url: WS_URL_ROOT + "/Game/EditMatchDetails",

                        type: "POST",

                        data: "f=" + GetCurrentfixtureID() + "&u=" + thisUser.id + "&htn=" + encodeURIComponent(hometeam_name) + "&atn=" + encodeURIComponent(awayteam_name) + "&atc=" + encodeURIComponent(awayteam_colour) + "&htc=" + encodeURIComponent(hometeam_colour) + "&fhlt=" + encodeURIComponent(firsthalfleftteam) + "&v=" + voidtime
                        + "&hc=" + encodeURIComponent(homecrest) + "&ac=" + encodeURIComponent(awaycrest) + "&fc=" + encodeURIComponent(fixturecrest) + "&fb=" + encodeURIComponent(fixturedescription) + "&tsko=" + encodeURIComponent(tsko) + "&hp=" + encodeURIComponent(homepageFixture)
                        + "&fl=" + encodeURIComponent(leaguesForThisFixture)
                        ,

                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("EditMatchDetails", XMLHttpRequest, textStatus, errorThrown);
                        },

                        success: function (response) {
                            var ResultID = parseInt(response);
                            if (ResultID > 0) { //fixture WAS updated
                                $('#editmatchdetails').hide();
                                if (confirm("Match Details Updated!")) {

                                    if (thisFixture.currenthalf  > 0) {
                                        //the game is currently being played - so send the update to the players!!!!!!!!!
                                        var GameDetailsUpdateString = hometeam_colour + "^" + awayteam_colour + "^" + firsthalfleftteam + "^" + voidtime;
                                        //liveGamesSignalRConnection.server.sendgamedetailsupdate(GameDetailsUpdateString);

                                        var gameDetailsArray = new Array();
                                        gameDetailsArray.push(GameDetailsUpdateString);
                                        AdminPusher.push("updateGameDetails", gameDetailsArray, refereesBroadcastGroup);
                                    }

                                    GetGameDetails(GetCurrentfixtureID(), GameDetailsComplete); //if the details have been updated - reload them!!!!!!
                                }
                                else {
                                    //even if the user refuses to confirm they've seen the update message ( why would they???) - we reload the game details!!!
                                    GetGameDetails(GetCurrentfixtureID(), GameDetailsComplete); //if the details have been updated - reload them!!!!!!
                                }
                            }
                            else {
                                $("#editstatus").html("Error editing details!!");
                            }
                        }
                    });
                }
                else {
                    $("#editstatus").html("You must enter a valid names for the teams!!");
                }
            }
            catch (ex) { alert(ex); }
        }, //EditMatchDetails

        AwardCredits: function () {
            try {
                var credits = $("#resultscredits").val();
                var players = $("#resultsnumplayers").val();
                
                var leaguesToIncrement;
                try {
                    leaguesToIncrement = $("#FixturesLeaguePrizes").val().toString();
                } catch (ex) {
                    //if there are no leagues selected we will go in here!
                    leaguesToIncrement = "";
                }

                var overallCredits = 0;
                if ($('#awardoverallcredits').is(':checked')) {
                    overallCredits = 1;
                }

                var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

                if (    
                        (credits) && (players)
                        && ( 
                            (leaguesToIncrement) || (overallCredits == 1) //either we are updating the league scores or the overall scores (or both!!!)
                           )
                        && (!isNaN(credits)) //valid int
                        && (!isNaN(players)) //valid int
                    )
                    {
                    $.ajax({
                        url: WS_URL_ROOT + "/Game/AwardCredits",

                        type: "POST",

                        data: "c=" + credits + "&t=" + players + "&o=" + overallCredits + "&f=" + encodeURIComponent(GetCurrentfixtureID()) + "&l=" + encodeURIComponent(leaguesToIncrement) + "&u=" + encodeURIComponent(thisUser.id)
                        ,

                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("AwardCredits", XMLHttpRequest, textStatus, errorThrown);
                        },

                        success: function (response) {
                            var ResultID = parseInt(response);
                            if (ResultID > 0) { //credits WERE updated

                                if ((leaguesToIncrement) && (overallCredits == 1)) {
                                    $("#awardcreditsresult").html("Leagues AND Overall Credits Updated!");
                                }
                                else if (leaguesToIncrement) {
                                    $("#awardcreditsresult").html("Leagues Credits updated but Overall Credits NOT Updated (as overall credits was NOT selected)");
                                }
                                else if (overallCredits == 1) {
                                    $("#awardcreditsresult").html("Overall Credits Updated but Leagues Credits NOT updated  (as Leagues Credits was NOT selected)");
                                }
                            }
                            else {
                                $("#awardcreditsresult").html("Credits NOT Updated!!!");
                            }
                        }
                    });
                }
                else {
                    $("#awardcreditsresult").html("You must enter the correct details!!!!");
                }
            }
            catch (ex) { alert(ex); }
        }, //AwardCredits


        AwardBonus: function () {
            try {
                var amount = $("#resultsbonus").val();
                var players = $("#resultsnumplayersbonus").val();
                var bonus = $("#BonusPrize").val();

                var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

                if (
                        (amount) && (players) && (bonus)
                        && (!isNaN(players)) //valid int
                        && (!isNaN(amount)) //valid int
                    )
                {
                    $.ajax({
                        url: WS_URL_ROOT + "/Game/AwardBonus",

                        type: "POST",

                        data: "a=" + amount + "&t=" + players + "&b=" + bonus + "&f=" + encodeURIComponent(GetCurrentfixtureID()) + "&u=" + encodeURIComponent(thisUser.id)
                        ,

                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("AwardBonus", XMLHttpRequest, textStatus, errorThrown);
                        },

                        success: function (response) {
                            var ResultID = parseInt(response);
                            if (ResultID > 0) { //bonuses WERE awarded!!!
                                $("#awardbonusresult").html("<br />The top " + players + " players have been awarded " + amount + " " + bonus + "(s)");
                            }
                            else {
                                $("#awardbonusresult").html("<br />Bonuses have NOT been awarded");
                            }
                        }
                    });
                }
                else {
                    $("#awardcreditsresult").html("<br />You must enter all details!!");
                }
            }
            catch (ex) { alert(ex); }
        }, //AwardBonus


        DisplayEditTickerText: function () {

            //only call this if the match has just started - OR - if the match has NOT started and this is the first time we have called this function
            $.ajax({
                url: WS_URL_ROOT + "/Game/GetTickerText",
                type: "POST",
                data: "f=" + GetCurrentfixtureID() + "&u=" + user.id + "&fu=" + user.fbuserid,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("UpdateMiscellaneousTickerText", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    var listofPreGameTickerSentences = response.split("^");
                    var FormattedpreGameTicketText = "";
                    if (listofPreGameTickerSentences.length > 0) {
                        for (var i = 0; i < listofPreGameTickerSentences.length; i++) {
                            if (listofPreGameTickerSentences[i].length > 0) {
                                FormattedpreGameTicketText = FormattedpreGameTicketText + listofPreGameTickerSentences[i] + "\n";
                            }
                        }
                        $("#pregametickertext").val(FormattedpreGameTicketText)
                    }
                    $('#edittickertext').show();
                }
            });

        }, //end DisplayEditTickerText

        EditTickerText: function () {
            //first do pre game ticker
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var preGamecontent = $("#pregametickertext").val();
            var split = preGamecontent.split("\n");
            var preGameComplete = ""

            for (var i = 0; i < split.length; i++) {
                if (i > 0) {
                    preGameComplete = preGameComplete + "^"; //we store this symbol in th DB - then when we load the pregame text this symbol will tell us when one ticking sentance ends and the next starts - and we will add in the appropriate <li> html then
                }
                preGameComplete = preGameComplete + split[i];
            }

            $.ajax({
                url: WS_URL_ROOT + "/Game/UpdateTickerText",
                type: "POST",
                data: "f=" + GetCurrentfixtureID() + "&u=" + thisUser.id + "&fu=" + thisUser.fbuserid + "&tt=" + encodeURIComponent(preGameComplete) + "&mp=-101",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("UpdateTickerText", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    var ResultID = parseInt(response);
                    if (ResultID > 0) { //fixture WAS updated
                        $("#pregametickereditstatus").html("Details Updated!!");
                    }
                    else {
                        $("#pregametickereditstatus").html("Error updating ticker details!!");
                    }
                }
            });
        }, //end EditTickerText


        ShowAddGoalScorerPanel: function () {
            try {
                admin.populateListOfGoalScorers();
                admin.populateListOfPlayers();
                $('#addgoalscorer').show();
                $("#AddGoalScorerDetails").html("");
            }
            catch (ex) { alert(ex); }
        }, //end ShowAddGoalScorerPanel


        addGoalScorer: function () {
            try {
                var odds = document.getElementById('NewGoalScorerOdds').value;
                var goalscorer = document.getElementById('NewGoalScorerName').value;
                var playerid = document.getElementById('playerList').value;

                if (
                    ((playerid) && (playerid > 0))
                    &&
                    (goalscorer)
                   ) {
                    $("#AddGoalScorerDetails").html("<br /><b>Unable to add goalscorer. <br />You can't add a player AND enter a goalscorer at the same time!!</b>");
                }
                else {
                    if (
                        ((!isNaN(odds)) && (odds))
                        &&
                        (
                            ((playerid) && (playerid > 0))
                            ||
                            (goalscorer)
                        )
                      ) {
                        $("#AddGoalScorerDetails").html("<br /><b>Adding goalscorer.....</b>");

                        $.ajax({
                            url: WS_URL_ROOT + "/Game/AddNewGoalScorer",
                            type: "POST",
                            data: "fixtureid=" + GetCurrentfixtureID() + "&potentialwinnings=" + odds + "&goalscorer=" + goalscorer + "&p=" + playerid,
                            //dataType: "jsonp",
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                AjaxFail("addGoalScorer", XMLHttpRequest, textStatus, errorThrown);
                            },
                            success: function (response) {
                                var ResultID = parseInt(response);
                                if (ResultID > 0) {
                                    $("#AddGoalScorerDetails").html("<br /><b>Goalscorer added.</b>");
                                    document.getElementById('NewGoalScorerOdds').value = "";
                                    document.getElementById('NewGoalScorerName').value = "";
                                    admin.populateListOfGoalScorers();
                                }
                                else {
                                    $("#AddGoalScorerDetails").html("<br /><b>Goalscorer not added.</b>");
                                }
                            }
                        });
                    }
                    else {
                        $("#AddGoalScorerDetails").html("<br /><b>Unable to add goalscorer. <br /> You must enter a goalscorer or player AND you must enter valid winnings!!</b>");
                    }
                }
            }
            catch (ex) {
                alert(ex);
            }
        }, //addGoalScorer

        removeGoalScorer: function () {

            var firstGoalScorerBetID = parseInt($("#betoptionselect_remove9").val());
            if (firstGoalScorerBetID > 0) {
                $("#AddGoalScorerDetails").html("<br /><b>Removing goalscorer.....</b>");
                $.ajax({
                    url: WS_URL_ROOT + "/Game/RemoveGoalScorer",
                    type: "POST",
                    data: "fixtureid=" + GetCurrentfixtureID() + "&fboid=" + firstGoalScorerBetID,
                    //dataType: "jsonp",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("removeGoalScorer", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {
                        var ResultID = parseInt(response);
                        if (ResultID > 0) {
                            $("#AddGoalScorerDetails").html("<br /><b>Goalscorer removed.</b>");
                            admin.populateListOfGoalScorers();
                        }
                        else {
                            $("#AddGoalScorerDetails").html("<br /><b>Goalscorer not removed</b>");
                        }
                    }
                });
            }
            else {
                $("#AddGoalScorerDetails").html("<br /><b>YOU MUST SELECT a goalscorer to remove!!!!!!!!</b>");
            }
        }, //removeGoalScorer

        //old way
        //        populateGoalScorers_HTML: function (pregameBets_in) {

        //            try {
        //                var pregameBets = typeof pregameBets_in != 'object' ? JSON.parse(pregameBets_in) : pregameBets_in;
        //                var BetHTML = "";
        //                //loop through each betoption returned and write the appropriate HTML
        //                for (var i = 0; i < pregameBets.length; i++) {
        //                    var thisBet = pregameBets[i];

        //                    if (thisBet.fbid == 9) {
        //                        //only do this logic for fbid - i.e = the first goalscorer
        //                        var betnumber = i + 1;

        //                        BetHTML = BetHTML + "<div class='content' id='pregamebet_" + betnumber + "' style='display:block;'>";

        //                        BetHTML = BetHTML + "<div class='pregame-bets'>";

        //                        //this bet has not been made - display all posible goalscorers
        //                        BetHTML = BetHTML + "<form>";

        //                        BetHTML = BetHTML + "<div class='option3'>GoalScorers<select id='betoptionselect" + thisBet.fbid + "' name='betoptionselect" + thisBet.fbid + "'>";
        //                        BetHTML = BetHTML + "<option value='-1'></option>";
        //                        for (var j = 0; j < thisBet.o.length; j++) {
        //                            var thisBetOption = thisBet.o[j];
        //                            BetHTML = BetHTML + "<option value='" + thisBetOption.oid + "'>" + thisBetOption.d + " (" + thisBetOption.o + "/1)</option>";
        //                        }
        //                        BetHTML = BetHTML + "<option value='0'>None Of The Above</option>";
        //                        BetHTML = BetHTML + "</select></div></form>";

        //                        BetHTML = BetHTML + "</div>"; //end pregame-bets
        //                        BetHTML = BetHTML + "</div>"; //end content div
        //                    }
        //                }
        //                if (BetHTML) {
        //                    $('#goalscorershtml').html(BetHTML); //set the bet HTML   
        //                    var RemoveScorerHTML = BetHTML.replace("betoptionselect9", "betoptionselect_remove9");
        //                    RemoveScorerHTML = RemoveScorerHTML.replace("betoptionselect9", "betoptionselect_remove9");
        //                    $('#goalscorersListhtml').html(RemoveScorerHTML); //set the bet HTML   
        //                }
        //                else {
        //                    //if we dont know any scorer then set the default drop down
        //                    $('#goalscorershtml').html("<div class='content' id='pregamebet_1' style='display:block;'><div class='pregame-bets'><form><div class='option3'><select id='betoptionselect9' name='betoptionselect9'><option value='0'>Unknown Scorer</option></select></div></form></div></div>");
        //                }
        //            }
        //            catch (ex) {
        //                alert(ex);
        //            }
        //        }, //end populateListOfGoalScorers_HTML

        //new way
        populateGoalScorers_HTML: function (scorers_in) {

            try {
                var scorers = typeof scorers_in != 'object' ? JSON.parse(scorers_in) : scorers_in;

                var scorersHTML = "<select id='betoptionselect9' name='betoptionselect9'><option value='-1'></option>";
                if ((scorers) && (scorers.length > 0)) {


                    //loop through each betoption returned and write the appropriate HTML
                    for (var i = 0; i < scorers.length; i++) {
                        scorersHTML = scorersHTML + "<option value='" + scorers[i].oid + "'>" + scorers[i].d + " (" + scorers[i].w + ")</option>";
                    }

                }
                scorersHTML = scorersHTML + "<option value='0'>None Of The Above</option>";
                scorersHTML = scorersHTML + "</select>";

                var RemoveScorerHTML = scorersHTML.replace("betoptionselect9", "betoptionselect_remove9");
                RemoveScorerHTML = RemoveScorerHTML.replace("betoptionselect9", "betoptionselect_remove9");
                $('#goalscorersListhtml').html(RemoveScorerHTML);

                $('#goalscorershtml').html(scorersHTML);
            }
            catch (ex) {
                alert(ex);
            }
        }, //end populateListOfGoalScorers_HTML


        populateListOfGoalScorers: function () {
            var listOfScorers;
            try {
                listOfScorers = JSON.parse(window.sessionStorage.getItem("listofscorers"));
            } catch (TempEx) { }


            if (listOfScorers) {
                admin.populateGoalScorers_HTML(listOfScorers);
            }

            //old way
            //            $.ajax({
            //                url: WS_URL_ROOT + "/Game/GetFixtureBetDetails",
            //                type: "POST",
            //                data: "fixtureID=" + GetCurrentfixtureID() + "&userid=-101",
            //                success: function (response) {
            //                    admin.populateGoalScorers_HTML(response);
            //                } //,dataType: "jsonp"
            //            });

            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            //new way
            $.ajax({
                url: WS_URL_ROOT + "/Game/GetListOfGoalScorers",
                type: "POST",
                data: "f=" + GetCurrentfixtureID() + "&u=" + user.id,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("populateListOfGoalScorers", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    window.sessionStorage.setItem("listofscorers", $.toJSON(response));
                    admin.populateGoalScorers_HTML(response);
                } //,dataType: "jsonp"
            });

        },

        populateListOfPlayers: function () {
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            $.ajax({
                url: WS_URL_ROOT + "/Game/GetListOfPlayers",
                type: "POST",
                data: "f=" + GetCurrentfixtureID() + "&u=" + user.id,
                success: function (response) {
                    admin.populatePlayers_HTML(response);
                } //,dataType: "jsonp"
            });
        },

        populatePlayers_HTML: function (players_in) {

            try {
                var players = typeof players_in != 'object' ? JSON.parse(players_in) : players_in;

                if ((players) && (players.length > 0)) {
                    //<div id="goalscorersListhtml"></div>
                    var playerHTML = "<select id='playerList' name='playerList'><option value='-1'></option>";

                    //loop through each betoption returned and write the appropriate HTML
                    for (var i = 0; i < players.length; i++) {
                        playerHTML = playerHTML + "<option value='" + players[i].id + "'>" + players[i].name + " (" + players[i].team + ")</option>";
                    }
                    playerHTML = playerHTML + "</select>"; //</div>
                    $('#playerListhtml').html(playerHTML);
                }
            }
            catch (ex) {
                alert(ex);
            }
        }, //end populatePlayers_HTML

        CreateNewFixture: function () {
            $('#creatematchdetails').show();

            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            if (!teamcolours) {
                $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/GetTeamColours",
                        type: "POST",
                        data: "f=-1&u=" + thisUser.id,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("GetTeamColours", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            teamcolours = typeof response != 'object' ? JSON.parse(response) : response;
                            window.sessionStorage.setItem("teamcolours", teamcolours);
                            admin.PopulateCreateFixtureColourDropDowns_DisplayHTML(teamcolours);
                        }
                    }
                );
            }
            else {
                admin.PopulateCreateFixtureColourDropDowns_DisplayHTML(teamcolours);
            }
        }, //CreateNewFixture

        CreateNewMatch: function () {
            try {
                var hometeam_name = $("#hometeamname").val();
                var awayteam_name = $("#awayteamname").val();

                var hometeam_colour = $("#createhometeamcolour").val();
                var awayteam_colour = $("#createawayteamcolour").val();

                var firsthalfleftteam = $("#createteamdirection").val();

                if (firsthalfleftteam == 1) {
                    //the user wants the home team to be playing from left to right in the first half
                    firsthalfleftteam = hometeam_name;
                }
                else {
                    //the user wants the away team to be playing from left to right in the first half
                    firsthalfleftteam = awayteam_name;
                }


                var liveFixture = "0";
                var selected = $("input[type='radio'][name='LiveFixture']:checked");
                if (selected.length > 0) {
                    liveFixture = selected.val();
                }

                var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

                if (
                    ((hometeam_name) && (awayteam_name))
                    &&
                    (hometeam_name != awayteam_name)
                   ) {
                    var proceed = 1;

                    if (liveFixture == 1) {
                        proceed = 0;
                        if (confirm("You have selected to clear the DB before creating this game - this may take a minute or two - be patient!!!!!")) {
                            proceed = 1;
                        }
                    }

                    if (proceed == 1) {

                        $.ajax({
                            url: WS_URL_ROOT + "/Game/CreateMatch",
                            type: "POST",
                            data: "u=" + thisUser.id + "&htn=" + encodeURIComponent(hometeam_name) + "&atn=" + encodeURIComponent(awayteam_name) + "&atc=" + encodeURIComponent(awayteam_colour) + "&htc=" + encodeURIComponent(hometeam_colour) + "&fhlt=" + encodeURIComponent(firsthalfleftteam) + "&l=" + encodeURIComponent(liveFixture),
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                AjaxFail("CreateNewMatch", XMLHttpRequest, textStatus, errorThrown);
                            },
                            success: function (response) {
                                var ResultID = parseInt(response);
                                if (ResultID > 0) { //fixture WAS created
                                    $('#creatematchdetails').hide();
                                    if (confirm("MatchCreated! FixtureID is " + ResultID)) {
                                        GetFixtures();
                                    }
                                    else {
                                        GetFixtures();
                                    }
                                }
                                else {

                                    if (ResultID == -2) {
                                        $("#createstatus").html("Match not created - You can only have one live match in system at any time - Please wait until the current live game is finished before creating another live game!!!!!");
                                    }
                                    else if (ResultID == -3) {
                                        $("#createstatus").html("Match not created - Can't create live fixture while Disk Backup is currently running - try again in a minute and if problem persists then contact administrator!!");
                                    }
                                    else if (ResultID == -4) {
                                        $("#createstatus").html("Match not created - Can't create live fixture while Memory Tables Backup is currently running - try again in a minute and if problem persists then contact administrator!!");
                                    }
                                    else if (ResultID == -5) {
                                        $("#createstatus").html("Match not created - Can't create live fixture while League Memory Tables Backup is currently running - try again in a minute and if problem persists then contact administrator!!");
                                    }
                                    else {
                                        $("#createstatus").html("Error creating match!!");
                                    }
                                }
                            }
                        });


                    }

                  
                }
                else {
                    $("#createstatus").html("You must enter a valid names for the teams!!");
                }
            }
            catch (ex) { alert(ex); }

        }, //CreateNewMatch


        PopulateCreateFixtureColourDropDowns_DisplayHTML: function (teamcolours) {
            var HomeTeamColourDropDown = "<select id='createhometeamcolour' name='createhometeamcolour' style='padding:0.5em;'>";
            var AwayTeamColourDropDown = "<select id='createawayteamcolour' name='createawayteamcolour' style='padding:0.5em;'>";
            for (var i = 0; i < teamcolours.length; i++) {
                HomeTeamColourDropDown = HomeTeamColourDropDown + "<option value='" + teamcolours[i] + "'>" + teamcolours[i] + "</option>";
                AwayTeamColourDropDown = AwayTeamColourDropDown + "<option value='" + teamcolours[i] + "'>" + teamcolours[i] + "</option>";
            }
            HomeTeamColourDropDown = HomeTeamColourDropDown + "</select>";
            AwayTeamColourDropDown = AwayTeamColourDropDown + "</select>";
            $('#hometeamcolourdiv').html(HomeTeamColourDropDown);
            $('#awayteamcolourdiv').html(AwayTeamColourDropDown);
        } //PopulateEditTeamColourDropDowns_DisplayHTML,
        ,

        ShowNotificationPanel: function () {
            try {
                $('#notificationDetails').show();
                $('#NumNotificationsText').html("");
                $('#NumNotificationsSent').html("");

                if(!$('#notificationText').val())
                {
                    
                    $('#notificationText').val("Play " + thisFixture.fixturename + " and win prizes!!");
                    
                    if (thisFixture.starttime)
                    {
                        var KickOffTime = thisFixture.starttime.split("T")[1];
                        $('#notificationText').val( $('#notificationText').val() + " Game starts at " + KickOffTime);
                    }
                }
                admin.countNotificationChar();
            }
            catch (ex) { }
        }, //end ShowNotificationPanel


        countNotificationChar: function () {
            try {
                
                var len = $('#notificationText').val().length;
                if (len >= 180) {
                    var shortenedString = $('#notificationText').val().substring(0, 180);
                    $('#notificationText').val(shortenedString);
                } else {
                    $('#NumNotificationsChar').text(180 - len);
                }
            }
            catch (ex) { }
        }, //end countNotificationChar

        SendFaceBookNotifications: function () {
            //1 - go to DB -

            //2 - return list of all fb userid's

            //3 - for each one - send invite!!!!!

            //4 - incremenet counter each time a notification has been sent

            //5 - display - "finished - attempted to send 1234 - sucessfu;;y sent x"
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            numNotificationsSent = 0;
            numNotificationsFailed = 0;
            numNotifications = 0;

            $.ajax({
                url: WS_URL_ROOT + "/Admin/GetNotifications",
                type: "POST",
                data: "f=" + GetCurrentfixtureID() + "&u=" + user.id + "&fu=" + user.fbuserid,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetListOfPlayers", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {

                    if ((response.NotificationId > 0) && (response.userList.length > 0)) {

                        $('#NumNotificationsText').html("About to send " + response.userList.length + " Notifications - <b>do NOT leave this page until sending has completed!!!!!!!!!</b><br /><br />");
                        numNotifications = response.userList.length;
                        for (var i = 0; i < response.userList.length; i++) {
                            admin.SendFaceBookNotification(response.userList[i], response.NotificationId, response.a);
                        }
                    }
                } 
            }); 
        }, // end SendFaceBookNotificationS

        SendFaceBookNotification: function (fbuserid,NotificationId,a) {
           
            try {
                var url = "https://graph.facebook.com/" + fbuserid + "/notifications?access_token=" + encodeURIComponent(a) + "&template=" + encodeURIComponent($('#notificationText').val()) + "&ref=" + encodeURIComponent(thisFixture.fixturename) + "&href=" + encodeURIComponent("/Game/?f=" & GetCurrentfixtureID());  //Play Everton v Liverpool in LiveGames
                $.ajax(
                        {
                            url: url,
                            type: "POST",
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                AjaxFail("SendFaceBookNotification", XMLHttpRequest, textStatus, errorThrown);

                                numNotificationsFailed = numNotificationsFailed + 1;
                                $('#NumNotificationsFailed').html("Num Failed:" + numNotificationsSent + "  <i>Failures can be due many reasons e.g - a user removing the app</i>");

                                if (numNotificationsFailed + numNotificationsSent == numNotifications) {
                                    $('#NumNotificationsText').html("All notifications sent!!!!<br />");
                                }

                            },
                            success: function (response) {
                                //store currency data in DB - no DONT - cos they may well change!!!!!
                                var test = fbuserid;
                                var n = NotificationId;
                                numNotificationsSent = numNotificationsSent + 1;
                                $('#NumNotificationsSent').html("Num Sent:" + numNotificationsSent);


                                if (numNotificationsFailed + numNotificationsSent == numNotifications)
                                {
                                    $('#NumNotificationsText').html("All notifications sent!!!!<br />");
                                }
                            }
                        }
                );
            }
            catch (ex2) {
                logError("SendFaceBookNotification", ex2);
            }
        } // end SendFaceBookNotification

    };
};

/*

function BackupDBAtFullTime()
{
	$.ajax({
		url: livegamesURL + "/Game/MidGameDBCleanUp",
		type: "GET",
		data: "fixtureID=" + fixtureID,
		dataType: "jsonp",
		jsonpCallback: "CleanupDBAtFullTimeComplete"
	});
	$('.GameFeedInfo').prepend("Full Time DB Clean up started!<br />");
}		

function CleanupDBAtFullTimeComplete()
{
	//do nothing
	$('.GameFeedInfo').prepend("Full Time DB Clean up complete!<br />");
}


 function firstHalfSetup() {
     //$('.pitch-icons').show();
     document.getElementById("EventID22").style.display = "inline-block"; //show freeze button
     document.getElementById("EventID11").style.display = "none";
     document.getElementById("EventID12").style.display = "inline-block";
     document.getElementById("EventID13").style.display = "none";
     document.getElementById("EventID14").style.display = "none";
     document.getElementById("EventFullTime").style.display = "none";
 }
 function halfTimeSetup() {
     //$('.pitch-icons').hide();
     document.getElementById("EventID22").style.display = "none"; //half-time ..so hide freeze bet button
     document.getElementById("EventID11").style.display = "none";
     document.getElementById("EventID12").style.display = "none";
     document.getElementById("EventID13").style.display = "inline-block";
     document.getElementById("EventID14").style.display = "none";
     document.getElementById("EventFullTime").style.display = "none";
 }
 function secondHalfSetup() {
     //$('.pitch-icons').show();
     document.getElementById("EventID22").style.display = "inline-block"; //show freeze button
     document.getElementById("EventID11").style.display = "none";
     document.getElementById("EventID12").style.display = "none";
     document.getElementById("EventID13").style.display = "none";
     document.getElementById("EventID14").style.display = "inline-block";
     document.getElementById("EventFullTime").style.display = "none";
 }
 function fullTimeSetup() {
     //$('.pitch-icons').hide();
     document.getElementById("EventID22").style.display = "none"; //full-time ..so hide freeze bet button
     document.getElementById("EventID11").style.display = "none";
     document.getElementById("EventID12").style.display = "none";
     document.getElementById("EventID13").style.display = "none";
     document.getElementById("EventID14").style.display = "none";
     document.getElementById("EventFullTime").style.display = "inline-block";
     document.getElementById("BackupToDisk").style.display = "inline-block"; //shoe the livegames-ref the button to do a full time clean up!!!!
     ResetFixtureOdds();
 }
 */