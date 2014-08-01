//league object - using module pattern!!!!
var League = function () {
    //declare private properties ( all properties declared here are private)
    var name, //leagename
    currentlyShowingDefaultLeague = 0, //this will tell us if we are currently showing the overall league - i.e - the scores for this game
    desc, //dont use description anymore
    id, //league id
    num_MembersInLeague, //numberOfMembersInLeague
    creater_Id, //the id of who created the league
    positions_array, //this stores the league tables (i.e the positions)
    type, //1 = 1 game only league,2 = multi-game league (i.e season league)
    mobile_APICall_Needed = 1; //this property is to tell us if we need to make an API call when the user clicks the view leagues button on mobile - if we have the latest league table then we dont need to make an api call

    IsThisLeagueTableUptoDate = function (leaderBoardList, leagueID) {
        var UpToDate = 1; //do update unless date comparisson tells us otherwise
        var temparray = typeof leaderBoardList != 'object' ? JSON.parse(leaderBoardList) : leaderBoardList;
        var TimeStamp;
        try {
            TimeStamp = temparray[0].T;
            if (TimeStamp) {
                //this table has a time associated with it!!!!
                //only show this table if the TimeStamp > than the previous stored timestamp
                var thisTime = new Date(TimeStamp);
                //thisTime.setTime(TimeStamp);

                var LeaderboardLog;
                try {
                    LeaderboardLog = JSON.parse(window.sessionStorage.getItem("LeaderboardLog"));
                } catch (TempEx) { }


                if ((LeaderboardLog) && (LeaderboardLog != "null") && (LeaderboardLog != "")) {
                    //we have the time the leaderboard was last updated   
                    var previousDateString = LeaderboardLog[0];
                    var previousLeagueID = LeaderboardLog[1];

                    if ((previousLeagueID == leagueID) && (previousDateString)) {
                        //make sure the last leaderboard update was for the same league
                        var lastLeaderboardTime = new Date(previousDateString);
                        //lastLeaderboardTime.setTime(previousDateString);

                        if (lastLeaderboardTime > thisTime) {
                            //this league table is out of date - so do NOT display it
                            //this can happen if there is a delay in the message we get from LightStreamer and it tries to give us a league table that is out of date
                            UpToDate = 0;
                        }
                        else {
                            //this league table DOES have a later timestamp and so does have new data
                            //update our session storage data
                            updateThisLeaderboardLog(TimeStamp, leagueID);
                        }
                    }
                    else {
                        //this update is for a different league - do nothing

                        //added note here Stephen 9-July-12
                        //now that we have multipple leagues do we just want to ignore a new league update here????
                        //possibly yes - if we are showing a league table and we then get data for another league table - we should not replace the current league table we are showing
                        //perhaps if one league table has updated we should automatically trigger a request for an update for the league table we ARE showing???? as it most likely will have udpated too?
                        //need to monitor this
                    }
                }
                else {
                    //there is no data currently in session storage - so add this data!!
                    updateThisLeaderboardLog(TimeStamp, leagueID);
                }
            }
        }
        catch (ex2) {
            //alert("IsThisLeagueTableUptoDateError!!!!!!!");
            logError("IsThisLeagueTableUptoDate", ex2);
        }
        return UpToDate;
    }, //end IsThisLeagueTableUptoDate


    updateThisLeaderboardLog = function (TimeStamp, leagueID) {
        var tempLeaderboardArray = new Array();
        tempLeaderboardArray.push(TimeStamp); //add the Date String first
        tempLeaderboardArray.push(leagueID); //add the league ID
        window.sessionStorage.setItem("LeaderboardLog", $.toJSON(tempLeaderboardArray));
    }, //end updateLeaderboardLog



    DisplayListOfLeagues = function (objArray, NameOfSessionObject, promptUserToJoin) {
        //hide anything that could also be displayed in this area

        $('.leaguepanel').hide();
        $('.leaguestandings').hide();

        var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        // If the returned data is an object do nothing, else try to parse
        var leagueArray = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        
        var LeagueHTML = "";
        //loop through leagues and get the HTML to display
        for (var i = 0; i < leagueArray.length; i++) {
            //Altered the below to reference the new one character properties of each object
            //var userstatus = array[i].C; //CurrentUser
            var pos = i + 1; //Pos
            var leagueName = leagueArray[i].Name;
            var leagueID = leagueArray[i].ID;
            var numberOfMembersInLeague = leagueArray[i].nummembers;
            var CreatorID = leagueArray[i].CreaterFBID;
            var ismember = leagueArray[i].ismember;
            var defaultleague = leagueArray[i].defaultleague;
            var allowInvites = leagueArray[i].allowinvites; //if this is greater than 0 then anyone who is a member of the league can invite people to the join the league

            if (ismember > 0) {
                //the user IS already a member of this league ...so allow them to click it and view the league standings

                if (defaultleague == 1) {
                    //If in here then this league is the scores for this particular fixture
                    //so - John - add new style here!!!!!!
                    LeagueHTML += "<div class='league_title_highlight' id='LL" + leagueArray[i].ID + "' onClick='userLeague.GetLeagueTable(" + leagueID + ",\x22" + leagueName + "\x22,null," + CreatorID + "," + numberOfMembersInLeague + ",null,1); return false;'>";
                }
                else {
                    LeagueHTML += "<div class='league_title' id='LL" + leagueArray[i].ID + "' onClick='userLeague.GetLeagueTable(" + leagueID + ",\x22" + leagueName + "\x22,null," + CreatorID + "," + numberOfMembersInLeague + ",null,1); return false;'>";
                }

                LeagueHTML += "<span>" + leagueName + "</span> <span class='league_population'>" + numberOfMembersInLeague + "</span>"; //close span which allows the user to click to bring them to the actual league table
            }
            else {
                //the user is NOT a member of this league ...so DONT allow them to click it and view the league standings
                LeagueHTML += "<div class='league_title' id='LL" + leagueArray[i].ID + "'><span>" + leagueName + "</span> <span class='league_population'>" + numberOfMembersInLeague + "</span>"; //close span which allows the user to click to bring them to the actual league table
            }

            if ((ismember > 0) && (defaultleague != 1) && (CreatorID != thisUser.id)) {
                //if the user is a member of the league (and the league is NOT the default league for the fixture [i.e. the overall scoreboard for a fixture#)
                //also = the user is not the creator - we dont let the administrator leave the league!!!!!!!
                // - then offer them the chance to leave the league!!!
                LeagueHTML += "<a class='join_league' onClick='userLeague.LeaveLeague(" + leagueID + ",\x22" + leagueName + "\x22); DontContinue(); return false;'>Leave</a>";
            }

            if ((promptUserToJoin) && (promptUserToJoin == true) && (ismember <= 0)) {
                //ask the user to join 
                LeagueHTML += "<a class='join_league' onClick='userLeague.JoinLeague(" + leagueID + ",\x22" + leagueName + "\x22,null," + CreatorID + "," + numberOfMembersInLeague + "); DontContinue(); return false;'>Join</a>";
            }
            else if (CreatorID == thisUser.id) {
                //this user is the creator of this league!!!!!
                //so show the manage option

                LeagueHTML += "<a class='join_league' onClick='userLeague.ManageLeague(" + leagueID + ",\x22" + NameOfSessionObject + "\x22); DontContinue(); return false;'>Manage</a>";
            }
            else if ((ismember > 0) && (allowInvites == 1)) {
                //the user is a member and this league allows all members to invite friends
                LeagueHTML += "<a class='join_league' onClick='userLeague.LeagueInvite(" + leagueID + ",\x22" + NameOfSessionObject + "\x22,false); DontContinue(); return false;'>Invite</a>";
            }
            else if ((leagueArray[i].status == 1) && (admin) && (admin.isAdmin()) && (defaultleague != 1))
            {
                //this is an official league and this user is the administrator - so allow the option to deactivate the 
                LeagueHTML += "<a class='join_league' onClick='userLeague.DeActivateLeague(" + leagueID + ",\x22" + leagueName + "\x22); DontContinue(); return false;'>DeActivate</a>";

            }

            LeagueHTML += "</div>";
        }



        $('#' + displaymode + '_league_view_1').html(LeagueHTML);
        $('#' + displaymode + '_league_view_1').show();
        refreshScroller(leaderboardScroller, "LeagueLeaderboard2"); //this line tells the scroller to point to the leagueScroller and to refresh itself!!!



        //store this league list in the session storage - perhaps if this exists we can use it before we fire off the AJAX request to get the leagues??
        window.sessionStorage.setItem(NameOfSessionObject, $.toJSON(leagueArray));


    } //end DisplayLeagues



    ; //end private members

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //start Public members
    return {

        name: name,
        desc: desc,
        id: id,
        type: type,
        num_MembersInLeague: num_MembersInLeague, //numberOfMembersInLeague
        creater_Id: creater_Id, //the id of who created the league
        positions_array: positions_array, //this stores the league tables (i.e the positions)

        mobile_APICall_Needed: mobile_APICall_Needed, //this property is to tell us if we need to make an API call when the user clicks the view leagues button on mobile - if we have the latest league table then we dont need to make an api call


        OutputScores: function (objArray, leagueName, leagueID, numberOfMembersInLeague) {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            // If the returned data is an object do nothing, else try to parse
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

            // table head
            var LeagueHTML;

            if (numberOfMembersInLeague) {
                LeagueHTML = "<div class='league_title'  id='" + displaymode + leagueID + "'><span>" + leagueName + "</span> <span class='league_population'>" + numberOfMembersInLeague + "</span></div>";
            }
            else {
                //we DONT have the number of people playing the league
                LeagueHTML = "<div class='league_title'  id='" + displaymode + leagueID + "'><span>" + leagueName + "</span></div>";
            }

            // table body
            for (var i = 0; i < array.length; i++) {
                //Altered the below to reference the new one character properties of each object
                //var userstatus = array[i].C; //CurrentUser
                var pos = array[i].P; //Pos
                if (!pos) {
                    pos = "?"; //sometimes we will not know the users position - just their score
                }

                var username = array[i].U; //Username
                var credits = array[i].S; //Credits
                var fbuid = array[i].F; //FBUserIDList
                var profilepic;

                if (array[i].I) {
                    profilepic = facebookprofilepicurl + array[i].I; //I = Image
                }
                else {
                    profilepic = "/images/profile-pic.png"
                }

                var currentBet;
                try { //put this in its own try/catch as we will not always have a current bet object!!
                    currentBet = array[i].B; //CurrentBet
                } catch (ex) { }

                var activeBetStyle = ""; //default no style 
                var TimeStamp = array[i].T; //TimeStamp

                if ((currentBet) && (currentBet.status == 0) && (currentBet.betid > 0)) {
                    activeBetStyle = " beton"; //this item has an active bet
                }

                //no need for userstaus - just use the fbuserid
                // if ((userstatus == true) || (thisUser.fbuserid == fbuid)) {
                if (thisUser.fbuserid == fbuid) {
                    //str += '<tr class="alt_me' + activeBetStyle + '">'; //highlight this row as it is the user who is playing the game!!!!!
                    LeagueHTML += '<div class="standing"><span class="pos">' + pos + '</span><img src="' + profilepic + '" /><span class="usr">' + username + '</span><span class="creditstotal">' + credits + '</span></div>';
                }
                else {
                    //str += '<tr class="alt' + activeBetStyle + '">';
                    LeagueHTML += '<div class="standing"><span class="pos">' + pos + '</span><img src="' + profilepic + '" /><span class="usr">' + username + '</span><span class="creditstotal">' + credits + '</span></div>';
                }
            }
            return LeagueHTML;
        }, //end OutputScores





        Set_mobile_APICallStatus: function (newstatus) {
            this.mobile_APICall_Needed = newstatus;
        }, //end Set_mobile_APICallStatus

        LeaveLeague: function (LeagueID, LeagueName) {
                        
            //ask user if they are sure they want to leave the league
            var thisDivID = getRandomNumber();
            var confirmHTML = "<div id=" + thisDivID + ">Are you sure you want to leave league '<strong>" + LeagueName + "</strong>' <br> <span class='button' onClick='userLeague.ConfirmLeaveLeague(" + thisDivID + "," + LeagueID + ",\x22" + LeagueName + "\x22); return false;'>Yes</span><span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>No</span></div>";
            $('#' + displaymode + '_league_messages').prepend(confirmHTML);
            showLeagueExtraDetails();
            refreshScroller(leagueMessageScroller, "invitepanel");
            _gaq.push(['_trackEvent', 'Clicks', 'LeaveLeague']);
        }, //end LeaveLeague


        LeaveLeague: function (LeagueID, LeagueName) {

            //ask user if they are sure they want to leave the league
            var thisDivID = getRandomNumber();
            var confirmHTML = "<div id=" + thisDivID + ">Are you sure you want to leave league '<strong>" + LeagueName + "</strong>' <br> <span class='button' onClick='userLeague.ConfirmLeaveLeague(" + thisDivID + "," + LeagueID + ",\x22" + LeagueName + "\x22); return false;'>Yes</span><span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>No</span></div>";
            $('#' + displaymode + '_league_messages').prepend(confirmHTML);
            showLeagueExtraDetails();
            refreshScroller(leagueMessageScroller, "invitepanel");
            _gaq.push(['_trackEvent', 'Clicks', 'LeaveLeague']);
        }, //end LeaveLeague


        ConfirmLeaveLeague: function (thisDivID, LeagueID, LeagueName) {
            //first up - hide the confirm text
            hideLeagueExtraDetails(thisDivID);

            //ask user if they are sure they want to leave the league
            var thisDivID = getRandomNumber();
            var confirmHTML = "";
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var fid = GetCurrentfixtureID();

            $.ajax({
                url: WS_URL_ROOT + "/League/LeaveLeague",
                type: "POST",
                data: "leagueid=" + LeagueID + "&fixtureid=" + fid + "&userid=" + thisUser.id,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("LeaveLeague", XMLHttpRequest, textStatus, errorThrown);

                    confirmHTML = "<div id=" + thisDivID + ">Error removing you from league '<strong>" + LeagueName + "</strong>'. Please Try again. <br> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>";
                    $('#' + displaymode + '_league_messages').prepend(confirmHTML);
                    showLeagueExtraDetails();
                    refreshScroller(leagueMessageScroller, "invitepanel");
                },
                success: function (response) {
                    var newListOfLeagues = typeof objArray != 'object' ? JSON.parse(response) : response;

                    try {
                        if ((newListOfLeagues) && (newListOfLeagues.length > 0)) {
                            var SessionObjectName = "ListOfUsersLeagues_" + fid;
                            DisplayListOfLeagues(response, SessionObjectName, false);
                            confirmHTML = "<div id=" + thisDivID + ">You have been removed from league '<strong>" + LeagueName + "</strong>' <br> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>";
                        }
                        else {
                            confirmHTML = "<div id=" + thisDivID + ">Error removing you from league '<strong>" + LeagueName + "</strong>'. Please Try again. <br> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>";
                        }
                    } catch (ex) {
                        confirmHTML = "<div id=" + thisDivID + ">Error removing you from league '<strong>" + LeagueName + "</strong>'. Please Try again. <br> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>";
                    }

                    $('#' + displaymode + '_league_messages').prepend(confirmHTML);
                    showLeagueExtraDetails();
                    refreshScroller(leagueMessageScroller, "invitepanel");
                }
            });
            _gaq.push(['_trackEvent', 'Clicks', 'LeaveLeague_confirm']);
        }, //end ConfirmLeaveLeague

        GetLeagueInvites: function () {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            if ((thisUser) && (thisUser.id > 0)) {
                $.ajax({
                    url: WS_URL_ROOT + "/League/GetLeagueInvites",
                    type: "POST",
                    data: "f=" + GetCurrentfixtureID() + "&u=" + thisUser.id + "&fu=" + thisUser.fbuserid,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("GetLeagueInvites", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {

                        try {
                            if (response) {
                                var inviteArray = typeof response != 'object' ? JSON.parse(response) : response;
                                //loop through leagues and find the league the user is trying to invite users to 

                                if (inviteArray.length > 0) {
                                    showLeagueExtraDetails();

                                    var invitehtml = ""
                                    for (var i = 0; i < inviteArray.length; i++) {
                                        // if (i > 0) {
                                        //   invitehtml += "<br clear='all' />";
                                        //}
                                        invitehtml += "<div class='linv_" + inviteArray[i].lid + "'><strong>" + inviteArray[i].iname + "</strong> has invited you to join league <strong>" + inviteArray[i].ln + "</strong> <br clear='all' /><span class='button' onClick='userLeague.acceptLeagueInvitation(" + inviteArray[i].iid + "," + inviteArray[i].lid + ",\x22" + inviteArray[i].ln + "\x22," + inviteArray[i].iuid + "); return false;'>Join</span> <span class='button' onclick='userLeague.rejectLeagueInvitation(" + inviteArray[i].iid + "," + inviteArray[i].lid + "); return false'>Decline</span></div>"
                                    }
                                    $('#' + displaymode + '_league_messages').html(invitehtml);
                                    refreshScroller(leagueMessageScroller, "invitepanel");
                                }
                            }

                        } catch (ex) { }
                    }
                });
            } //end user check
        }, //end GetLeagueInvites


        ManageLeague: function (leagueID, NameOfSessionObjectForLeagueList) {
            var permissionToManageLeague = 0;
            var thisLeague;

            if (NameOfSessionObjectForLeagueList) {
                var thisTempLeagueList;
                try {
                    thisTempLeagueList = JSON.parse(window.sessionStorage.getItem(NameOfSessionObjectForLeagueList));
                } catch (TempEx) { }

                //this league has not just been created - so check this user has permission to invite others to the league
                if (thisTempLeagueList) {
                    //league list exists in session - so get the league object from this list and make sure the current user has permission to  invite people to the league
                    var leagueArray = typeof thisTempLeagueList != 'object' ? JSON.parse(thisTempLeagueList) : thisTempLeagueList;
                    //loop through leagues and find the league the user is trying to invite users to 
                    for (var i = 0; i < leagueArray.length; i++) {
                        if (leagueArray[i].ID == leagueID) {
                            thisLeague = leagueArray[i]; //this is the league ibject we want to invite users to 
                        }
                    }
                }

                if (thisLeague) {
                    var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                    if (thisLeague.CreaterFBID == thisUser.id) {
                        permissionToManageLeague = 1;
                    }
                }
            }


            if (permissionToManageLeague == 1) {
                //set the values on the edit pop-up

                $('#' + displaymode + '_edit_leaguename').val(thisLeague.Name);
                $('#' + displaymode + '_edit_lid').val(thisLeague.ID);

                if (thisLeague.leaguetype == 1) //single game league
                {
                    $("[name=" + displaymode + "_edit_LeagueType]").filter("[value=1]").prop("checked", true);
                    $("[name=" + displaymode + "_edit_LeagueType]").filter("[value=2]").prop("checked", false);
                }
                else //multi game league
                {
                    $("[name=" + displaymode + "_edit_LeagueType]").filter("[value=1]").prop("checked", false);
                    $("[name=" + displaymode + "_edit_LeagueType]").filter("[value=2]").prop("checked", true);
                }

                if (thisLeague.allowinvites == 1) {
                    $('#' + displaymode + '_edit_allowinvites').prop("checked", true);
                }
                else {
                    $('#' + displaymode + '_edit_allowinvites').prop("checked", false);
                }

                showleaguepanel(4); // this displays the edit league pop-up
                _gaq.push(['_trackEvent', 'Clicks', 'ManageLeague_click']);
            }
            else {
                //print message saying - you do not have permission to manage this league
                showLeagueExtraDetails();

                var thisDivID = getRandomNumber();
                $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>You don't have permission to edit this league. </strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                refreshScroller(leagueMessageScroller, "invitepanel");
            }
        }, //end ManageLeague




        EditLeagueDetails: function () {
            var leagueid = $('#' + displaymode + '_edit_lid').val();
            var leagueName = $('#' + displaymode + '_edit_leaguename').val();

            var newLeagueType = parseInt($('#' + displaymode + '_league_view_4 input:checked').val());
            var allowinvites = $('#' + displaymode + '_edit_allowinvites').is(':checked');
            var allowUserInvites = 0;
            if (allowinvites == true) {
                allowUserInvites = 1;
            }
            var fid = GetCurrentfixtureID();
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            //now make AJAX call to update the league details
            $.ajax({
                url: WS_URL_ROOT + "/League/UpdateLeagueDetails",
                type: "POST",
                data: "leagueid=" + leagueid + "&fixtureID=" + fid + "&userid=" + thisUser.id + "&leagueName=" + leagueName + "&LeagueType=" + newLeagueType + "&allowinvites=" + allowUserInvites,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("EditLeagueDetails", XMLHttpRequest, textStatus, errorThrown);
                    hideleaguepanel(4);
                    showLeagueExtraDetails();
                    var thisDivID = getRandomNumber();
                    $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>Unable to Edit League. Please try again later </strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                    refreshScroller(leagueMessageScroller, "invitepanel");
                },
                success: function (response) {
                    if (response > 0) {
                        hideleaguepanel(4);
                        showLeagueExtraDetails();
                        var thisDivID = getRandomNumber();
                        $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>League Updated!</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                        refreshScroller(leagueMessageScroller, "invitepanel");

                        //now show the league
                        userLeague.GetLeagueTable(leagueid, leagueName, null, thisUser.id, response);
                    }
                    else {
                        hideleaguepanel(4);
                        showLeagueExtraDetails();
                        var thisDivID = getRandomNumber();
                        $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>Unable to Edit League.</strong> <br /> Please try again later <br /><span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                        refreshScroller(leagueMessageScroller, "invitepanel");
                    }
                }
            });
            _gaq.push(['_trackEvent', 'Clicks', 'ManageLeague_edit']);
        }, //end EditLeagueDetails


        SendInvitesFromManageLeaguePopup: function () {
            //this function is just a proxy function 
            //we get the relevant values and then pass them into the function below - LeagueInvite
            var leagueid = $('#' + displaymode + '_edit_lid').val();
            var NameOfSessionObjectForLeagueList = "ListOfUsersLeagues_" + GetCurrentfixtureID(); //this will not work if we allow users to manage leagues from the official leagues view
            userLeague.LeagueInvite(leagueid, NameOfSessionObjectForLeagueList, false);
            hideleaguepanel(4); //after we open the invite display - hide the manager display!!
            _gaq.push(['_trackEvent', 'Clicks', 'ManageLeague_invite']);
        }, //end SendInvitesFromManageLeaguePopup


        LeagueInvite: function (leagueID, NameOfSessionObjectForLeagueList, DisplayLeagueAfterInvitesSent) {
            //this function will invite people to join a league
            //userLeague.LeagueInvite(newLeague.ID, null, newLeague, true);
            var permissionToInvite = 0;
            var thisLeague;

            if (NameOfSessionObjectForLeagueList) {
                //if we get in here then it means that we are inviting users to an already created league 
                //this is most likely due to the user clicking the "invite" button on the league list

                //this league has not just been created - so check this user has permission to invite others to the league
                var thisTempLeagueList;
                try {
                    thisTempLeagueList = JSON.parse(window.sessionStorage.getItem(NameOfSessionObjectForLeagueList));
                } catch (TempEx) { }


                if (thisTempLeagueList) {
                    //league list exists in session - so get the league object from this list and make sure the current user has permission to invite people to the league
                    var leagueArray = typeof thisTempLeagueList != 'object' ? JSON.parse(thisTempLeagueList) : thisTempLeagueList;

                    //loop through leagues and find the league the user is trying to invite users to 
                    for (var i = 0; i < leagueArray.length; i++) {
                        if (leagueArray[i].ID == leagueID) {
                            thisLeague = leagueArray[i]; //this is the league object we want to invite users to 
                        }
                    }
                }
            }
            else {
                //if we get in here then it means that we are inviting users to a league that has just been created
                //the new league details should be stored in the object UsersLastCreatedLeague"
                if ((UsersLastCreatedLeague) && (UsersLastCreatedLeague.ID = leagueID)) {
                    thisLeague = UsersLastCreatedLeague;
                }
            }

            if (thisLeague) {
                //this is the league object that the user is trying to invite users to 
                var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                if ((thisLeague.CreaterFBID == thisUser.id) || ((thisLeague.ismember > 0) && (thisLeague.allowinvites == 1))) {
                    permissionToInvite = 1;
                    //now prompt the user to invite friends!!
                    var inviteMessage = "You've been invited to join a KingOfTheKop league by " + thisUser.name + "!!";
                    FB.ui(
                            {
                                method: 'apprequests',
                                message: inviteMessage
                            },
                            function (response) {
                                if (response && response.request && response.to) {
                                    //if we get here can I assume the invites were sent????
                                    var NumInvitesLogged;
                                    try {
                                        //now log in the DB all the fbuserid's of those invited and the fbrequest which we received 
                                        var fbUserIDList = "";

                                        for (var i = 0; i < response.to.length; i++) {
                                            if (i == 0) {
                                                fbUserIDList = response.to[i];
                                            }
                                            else {
                                                fbUserIDList += "," + response.to[i];
                                            }
                                        }

                                        $.ajax({
                                            url: WS_URL_ROOT + "/League/LogLeagueInvites",
                                            type: "POST",
                                            data: "userid=" + thisUser.id + "&fbREquest=" + response.request + "&FBUserID_List=" + fbUserIDList + "&LeagueID=" + thisLeague.ID,
                                            dataType: "html",
                                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                                AjaxFail("LeagueInvite", XMLHttpRequest, textStatus, errorThrown);

                                                if ((DisplayLeagueAfterInvitesSent) && (DisplayLeagueAfterInvitesSent == true)) {
                                                    //if in here it means this function is being called to send invites after a league has been created ( because DisplayLeagueAfterInvitesSent == true)
                                                    userLeague.GetLeagueTable(thisLeague.ID, thisLeague.Name, thisLeague.Description, thisLeague.CreaterFBID, thisLeague.nummembers);

                                                    //and also tell the user the league was created
                                                    showLeagueExtraDetails();
                                                    var thisDivID = getRandomNumber();
                                                    $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>League was created but no invites were sent!!</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                                                    refreshScroller(leagueMessageScroller, "invitepanel");
                                                }
                                                else {
                                                    showLeagueExtraDetails();
                                                    var thisDivID = getRandomNumber();
                                                    $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>Invites were not sent! Please try again later.</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                                                    refreshScroller(leagueMessageScroller, "invitepanel");
                                                }
                                            },
                                            success: function (response) {
                                                var inviteArray = typeof response != 'object' ? JSON.parse(response) : response;

                                                //send each user who we invited an invite to their livegames page ( this wil only work if the user has joined livegames before and is currently playing the game)
                                                userLeague.sendLeagueInvitesViaSignalR(inviteArray, thisLeague.ID, thisLeague.Name);

                                                //removed - so note at function - du to fb rules/updates
                                                //userLeague.sendLeagueInvitesViaFacebookPost(inviteArray, thisLeague.ID, thisLeague.Name);

                                                if ((DisplayLeagueAfterInvitesSent) && (DisplayLeagueAfterInvitesSent == true)) {
                                                    //if in here it means this function is being called to send invites after a league has been created ( because DisplayLeagueAfterInvitesSent == true)

                                                    //so - display the new league table ( the creator should be the only user in it initially)
                                                    userLeague.GetLeagueTable(thisLeague.ID, thisLeague.Name, thisLeague.Description, thisLeague.CreaterFBID, thisLeague.nummembers);

                                                    //and also tell the user the league was created
                                                    showLeagueExtraDetails();
                                                    var thisDivID = getRandomNumber();
                                                    $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>League Created!!</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                                                    refreshScroller(leagueMessageScroller, "invitepanel");
                                                }
                                                else {
                                                    //This function is only being called purely to send invites ( because DisplayLeagueAfterInvitesSent != true)
                                                    showLeagueExtraDetails();
                                                    var thisDivID = getRandomNumber();
                                                    $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>Invites Sent!!</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                                                    refreshScroller(leagueMessageScroller, "invitepanel");
                                                }
                                            }
                                        });
                                    }
                                    catch (ex) { }

                                } //no response recieved
                                else {
                                    //if we get here can we asume the invites were NOT sent??? 
                                    if ((DisplayLeagueAfterInvitesSent) && (DisplayLeagueAfterInvitesSent == true)) {
                                        //if in here it means this function is being called to send invites after a league has been created ( because DisplayLeagueAfterInvitesSent == true)
                                        userLeague.GetLeagueTable(thisLeague.ID, thisLeague.Name, thisLeague.Description, thisLeague.CreaterFBID, thisLeague.nummembers);

                                        //and also tell the user the league was created
                                        showLeagueExtraDetails();
                                        var thisDivID = getRandomNumber();
                                        $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>League was created but no invites were sent !!</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                                        refreshScroller(leagueMessageScroller, "invitepanel");
                                    }
                                    else {
                                        showLeagueExtraDetails();
                                        var thisDivID = getRandomNumber();
                                        //thisDivID = "148.98"; //"148.98406551219523";

                                        $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>Invites were not sent! Please try again later.</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                                        refreshScroller(leagueMessageScroller, "invitepanel");
                                    }
                                }
                            }
                        );
                }
            }
            else {
                //thisLeague is null - this means we have not been able to find the league the user wishes to invite people to!!!!!
                if ((DisplayLeagueAfterInvitesSent) && (DisplayLeagueAfterInvitesSent == true)) {
                    //if in here it means this function is being called to send invites after a league has been created ( because DisplayLeagueAfterInvitesSent == true)
                    userLeague.GetLeagueTable(thisLeague.ID, thisLeague.Name, thisLeague.Description, thisLeague.CreaterFBID, thisLeague.nummembers);

                    //and also tell the user the league was created
                    showLeagueExtraDetails();
                    var thisDivID = getRandomNumber();
                    $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>League was created but no invites were sent !!</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                    refreshScroller(leagueMessageScroller, "invitepanel");
                }
                else {
                    showLeagueExtraDetails();
                    var thisDivID = getRandomNumber();
                    $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>Invites were not sent! Please try again later.</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                    refreshScroller(leagueMessageScroller, "invitepanel");
                }
            }
        }, //end LeagueInvite

        sendLeagueInvitesViaSignalR: function (inviteArray, leagueID, League_name) {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            for (var i = 0; i < inviteArray.length; i++) {
                //loop through the list of users who have been invited and send them an update via SignalR
                //(this list only contains invitee's who have joined the game before)
                var groupName = "UD" + inviteArray[i].uid;
                var inviteID = inviteArray[i].iid;

                if (inviteID > 0) {
                    //liveGamesSignalRProxy.sendleagueinvite(inviteID, leagueID, League_name, thisUser.name, GetCurrentfixtureID(), groupName);
                    //liveGamesSignalRProxy.invoke('sendleagueinvite', inviteID, leagueID, League_name, thisUser.name, GetCurrentfixtureID(), groupName);

                    if (LiveEventMethod == "T5P") {
                        //we are using T5Pusher NOt signalR!!!

                        if (UserHasFriendsPlayingThisGame() == 1) {
                            var detailsArray = new Array();
                            detailsArray.push(inviteID);
                            detailsArray.push(leagueID);
                            detailsArray.push(League_name);
                            detailsArray.push(thisUser.id);
                            detailsArray.push(thisUser.name);
                            detailsArray.push(GetCurrentfixtureID());

                            if (sp == 1) { //we ARE using seperate push connections
                                FriendPusher.push("DisplayLeagueInvite", detailsArray, groupName);
                            }
                            else {
                                AdminPusher.push("DisplayLeagueInvite", detailsArray, groupName);
                            }


                            _gaq.push(['_trackEvent', 'T5Pusher', 'LeagueInvite']);
                        }
                    }
                    else {
                        liveGamesSignalRConnection.server.sendleagueinvite(inviteID, leagueID, League_name, thisUser.name, GetCurrentfixtureID(), groupName);
                    }
                }
            }
        }, //end sendLeagueInvitesViaSignalR


        //no longer able to post to a friens wall using the method below - read ....
        // https://developers.facebook.com/roadmap/completed-changes/#february-2013
        //Removing ability to post to friends walls via Graph API 
        //We will remove the ability to post to a user's friends' walls via the Graph API. Specifically, 
        //posts against [user_id]/feed where [user_id] is different from the session user, or stream.publish calls where the target_id user is different from the session user,
        //will fail. If you want to allow people to post to their friends' timelines, invoke the feed dialog. Stories that include friends via user mentions tagging or action 
        //tagging will show up on the friend’s timeline (assuming the friend approves the tag). For more info, see this blog post.

        //instead do the following -  https://developers.facebook.com/docs/reference/dialogs/feed/
        //but dont think this will work for waht we want - as it requiresa user to enter data!!!


        sendLeagueInvitesViaFacebookPost: function (inviteArray, leagueID, League_name) {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var message = "You've been invited to join a LiveGames league by " + thisUser.name + " -  http://apps.facebook.com/tfivelive/?f=" + GetCurrentfixtureID();

            //now loop through each of my invited friends(who have this app installed) and send them an invite to their facebook wall
            for (var i = 0; i < inviteArray.length; i++) {
                try {
                    var data = {
                        name: League_name,
                        //message: "You've been invited to join a LiveGames league by " + thisUser.name + " -  http://apps.facebook.com/tfivelive", // "/?ff=" + GetCurrentfixtureID()
                        message: "You've been invited to join  " + thisUser.name + "'s LiveGames league -  " + League_name + " - http://apps.facebook.com/tfivelive", // "/?ff=" + GetCurrentfixtureID()
                        picture: "http://profile.ak.fbcdn.net/hprofile-ak-snc4/373028_169134899848595_616111560_n.jpg", //temporary hardcode untill we're sure what picture to use!!!
                        link: "http://apps.facebook.com/tfivelive"
                    };
                    var callback = function (response) {
                        //this is the response from our attempt to post to the facbook users wall
                        var v = 1;
                    };
                    FB.api("/" + inviteArray[i].uid + "/feed", "post", data, callback);
                }
                catch (ex2) {
                    logError("sendLeagueInvitesViaFacebookPost", ex2);
                }
            }
        }, //end sendLeagueInvitesViaFacebookPost

        //this function displays a SignalR league invite to the user 
        DisplayLeagueInvite: function (inviteID, leagueID, leagueName, inviter_UserID, inviter_UserName, FixtureID) {
            var newHTML = "<div style='display:block;' class='linv_" + leagueID + "'><strong>" + inviter_UserName + "</strong> has invited you to join league <strong>" + leagueName + "</strong> <br clear='all' /><span class='button' onClick='userLeague.acceptLeagueInvitation(" + inviteID + "," + leagueID + ",\x22" + leagueName + "\x22," + inviter_UserID + "); return false;'>Join</span> <span class='button' onclick='userLeague.rejectLeagueInvitation(" + inviteID + "," + leagueID + "); return false'>Decline</span></div>";
            $('#' + displaymode + '_league_messages').prepend(newHTML);
            refreshScroller(leagueMessageScroller, "invitepanel");
            showLeagueExtraDetails();
        }, //end DisplayLeagueInvite

        rejectLeagueInvitation: function (inviteID, leagueid) {
            // hideLeagueExtraDetails();
            hideInvites(leagueid);
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            $.ajax({
                url: WS_URL_ROOT + "/League/updateLeagueInvitation",
                type: "POST",
                data: "inviteID=" + inviteID + "&leagueid=-1&userid=" + thisUser.id + "&status=-1&fu=" + thisUser.fbuserid,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("rejectLeagueInvitation", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    //dont show anything here - just remove the invitation - which is done at start!
                    //userLeague.DisplayTheLeagueTable(response, leagueid, name, desc, createrId, numberOfMembersInLeague);
                }
            });

        }, //end rejectLeagueInvitation


        acceptLeagueInvitation: function (inviteID, leagueID, leagueName, inviter_UserID) {
            //hideLeagueExtraDetails();
            hideInvites(leagueID);
            //before we make the call - show the loading panel!!!!!!
            $('.leaguepanel').hide();
            $('.leaguestandings').hide();
            $('.loadingpanel').show();

            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            $.ajax({
                url: WS_URL_ROOT + "/League/updateLeagueInvitation",
                type: "POST",
                data: "inviteID=" + inviteID + "&leagueID=" + leagueID + "&userid=" + thisUser.id + "&status=1&fu=" + thisUser.fbuserid,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("rejectLeagueInvitation", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    //only display the league when the user is in it!!!!
                    userLeague.DisplayTheLeagueTable(response, leagueID, leagueName, null, inviter_UserID, 0);
                }
            });

        }, //end DisplayLeagueInvite


        //this function goes through the leaderboard scores and for each score it checks if this user is in the friends table
        //if the user Is in the friends table we then make sure the friends score IS the same as the score in the league table ( as the league table comes from DB and is correct)
        MakeSureFriendsTableIsTheSameAsLeagueTable: function (LeagueTableScores)
        {
            try
            {
                var LeagueTablearray = typeof LeagueTableScores != 'object' ? JSON.parse(LeagueTableScores) : LeagueTableScores;
                var friendScores;
                try {
                    friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
                } catch (ex) { }
                var friendsScoresUpdated = 0;

                if ((friendScores) && (friendScores.length > 0)) {
                    //we DO have friends!!!
                    for (var i = 0; i < LeagueTablearray.length; i++) {
                        var LeagueTableCredits = LeagueTablearray[i].S; //Credits
                        var LeagueTableFBUserID = LeagueTablearray[i].F; //FBUserIDList

                        //now go through the friends list for this user and see if the friends score is the same as in the league table

                        for (var f = 0; f <= friendScores.length - 1; f++) {
                            var thisFriend = friendScores[f];

                            if (thisFriend.F == LeagueTableFBUserID) {
                                //this user IS in the Friend table!!!!!
                                //now check if the scores are different in the two tables!!!!!!
                                if ( 
                                    (thisFriend.S != LeagueTableCredits)  //the scores are NOT the same in the two tables
                                    &&  
                                    ((thisFriend.B == null) || (thisFriend.B.status != 0)) //AND the user does NOT have a bet pending ( if they have a bet pending then we often reduce the score in the friend table with the amount of the bet)
                                    ) 
                                {
                                    //update the score in the friends table
                                    thisFriend.S = LeagueTableCredits;
                                    friendsScoresUpdated = 1;
                                }
                                break; //we found the corresponding user in the friend table - there is no need to continue through other friends
                            }
                        } //end friend for
                    }//end league table for

                    if (friendsScoresUpdated == 1) {
                        window.sessionStorage.setItem("listOfFriendsScores", $.toJSON(friendScores));
                        ReOrderFriendsScoresBasedOnCurrentScore();
                    }

                }//end friends check
            }
            catch (ex) {
                logError("MakeSureFriendsTableIsTheSameAsLeagueTable", ex);
            }
        }, //end MakeSureFriendsTableIsTheSameAsLeagueTable

        DisplayTheLeagueTable: function (response, leagueID, League_name, League_desc, League_createrId, numberOfMembersInLeague, dontUpdateTicker) {
            if (IsThisLeagueTableUptoDate(response, leagueID) == 1) {
                //hide anything that could also be displayed in this area

                $('#' + displaymode + '_leaguestandings_1').html(userLeague.OutputScores(response, League_name, leagueID, numberOfMembersInLeague));
                window.sessionStorage.setItem("leaderboard", $.toJSON(response)); //this stores the last league table in session storage

                //we only want to hide the other panels and show the league panel in certain situations
                //for example - if the user was viewing  their list of leagues or the official leagues we would not show this league update
                //instead we would populate the HTML so when the user clicks on the tab it is there!!! 
                //- bollox - there's no point doing this - we can populate the league table whenthe user clicks on it

                $('.leaguepanel').hide();
                $('.leaguestandings').hide();
                $('#' + displaymode + '_leaguestandings_1').show();
                //now that we have updated the HTML with the league table we can hide the loading panel!!!
                $('.loadingpanel').hide();
                this.mobile_APICall_Needed = 0; //this lets the mobile version know that it does NOT have to make an API call when the user clicks on the league TAB

                refreshScroller(leaderboardScroller, "LeagueLeaderboard2"); //this line tells the scroller to point to the leagueScroller and to refresh itself!!!
                userLeague.StoreLeagueDetails(response, leagueID, League_name, League_desc, League_createrId, numberOfMembersInLeague);

                if (leagueID == thisFixture.defaultleagueid) {
                    //we have just displayed the default league table..so update the ticker based on this!!!!
                    this.currentlyShowingDefaultLeague = leagueID;
                    if (!dontUpdateTicker) {
                        SetTickerContent("LeagueStandings_ticker", GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame(response, numberOfMembersInLeague));
                    }

                    //added this Stephen 30-nov-12 -- only do this if the league table in question IS the default league for this fixture!!!!!!!
                    this.MakeSureFriendsTableIsTheSameAsLeagueTable(response);
                }
                else {
                    this.currentlyShowingDefaultLeague = -1; //we are showing a different league - NOT the overall scores!!!
                }

                //not sure if we need anything below here anymore.. can remove them later....///////////////////////////////////////////////////////////////////
                /*
                var array = typeof response != 'object' ? JSON.parse(response) : response;
                window.sessionStorage.setItem("leaderboard_" + GetCurrentfixtureID(), $.toJSON(array));

                var LeagueDesc;
                var thisuser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                if (thisuser.id == createrId) {
                //this league was created by the current user so give him the ability to invite more friends
                LeagueDesc = "<table class='o'><tbody><tr class='alt'><td class='Name'>" + name + "</td></tr></tbody></table>"; //<td class='Description'><input id='FriendInviteButton' type='button' onclick='InviteFriendsToPlayAGame(); return false;' value='Invite More Friends' /></td>
                }
                else {
                //this league was NOT created by the current user
                LeagueDesc = "<table class='o'><tbody><tr class='alt'><td class='Name'>" + name + "</td><td class='Description'>" + desc + "</td></tr></tbody></table>";
                }

                //no longer display details of the league who's leaderboard we are displaying - we can addd it back in later
                //$('#Myleagues').html(LeagueDesc);
                //$('#Myleagues').show();
                //refreshScroller(leaderboardScroller);

                //$('#leaguebuttondiv').show(); //only one league (overall leaderboard) for time being
                var thisTempLeague = new tempLeague(leagueID, name, desc, createrId)
                window.sessionStorage.setItem("leagueview_" + GetCurrentfixtureID(), $.toJSON(thisTempLeague));

                //store all the details of the last league which we have displayed
                //this means that when we get an event from LightStreamer we can look at this object to tell us which
                //league we are currently displaying and so which league we need to update!!!!!
                */
            }
        }, //end ShowLeagueTable


        GetLeagueTable: function (leagueID, League_name, League_desc, League_createrId, numberOfMembersInLeague, DontDisplayLoadingGif, userClicked, dontUpdateTicker) {
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            //we dont always want to display the loading gif
            //for example - after a user places a bet or clicks on the pre game bets we update the leaderboards
            //we do this to make sure that the user always has the latest scores ( they always should but sometimes they might miss a message from SignalR and so their tables may be slightly out of sync - because of this we update the scores after the user places abet and after they click the button to see pre game bets  - we might decide to do it other times too)
            //When we do these updates we want to do them without the user noticing ( if possible) 
            //that's why we dont want to show the loading gif 
            //- if the user has clicked to view a league then viewing the loading gif makes more sense

            //before we do anything - hide the loadingpanel
            //this may be shown again a few more lines time however it sometimes can appear above a league table
            //so..always hide it intitially
            $('.loadingpanel').hide();

            if (!DontDisplayLoadingGif) {
                //before we make the call - show the loading panel!!!!!!
                $('.leaguepanel').hide();
                $('.leaguestandings').hide();
                $('.loadingpanel').show();
            }

            if (userClicked) {
                //if in here then the user has CLICKED to see this league update ( i.e this update isn't based on an event from the admin or a placed bet)
                //so...we want to log the fact that the user is viewing the league!!!!
                if (leagueID == thisFixture.defaultleagueid) {
                    //the user is viewing the default league!!!!
                    _gaq.push(['_trackEvent', 'Clicks', 'ViewLeaderBoard_DefaultLeague']);
                }
                else {
                    //the user is viewing a league that is NOT the default league
                    _gaq.push(['_trackEvent', 'Clicks', 'ViewLeaderBoard_NOTDefaultLeague']);
                }
            }

            $.ajax({
                url: WS_URL_ROOT + "/LeaderBoard/GetleagueLeaderboard",
                type: "POST",
                //data: "LeagueID=" + leagueID + "&User=" + user,
                data: "LeagueID=" + leagueID + "&u=" + user.id + "&fu=" + user.fbuserid,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetLeagueTable" + " additional info " + "LeagueID=" + leagueID + "&u=" + user.id + "&fu=" + user.fbuserid, XMLHttpRequest, textStatus, errorThrown);

                    //if we have failed to join the league we need to output an error and stop showing the loading gif!!!
                },
                success: function (response) {
                    if (response) {
                        userLeague.DisplayTheLeagueTable(response, leagueID, League_name, League_desc, League_createrId, numberOfMembersInLeague, dontUpdateTicker);
                    }
                }
            });
        },  //end GetLeagueTable


        createNewLeague: function () { //create a new League //New_name, New_desc, leagueType

            //var name = form.Name.value;
            //var description = form.Description.value;


            var newName = $('#' + displaymode + '_leaguename').val();
            var newDesc = ''; //$('#' + displaymode + '_leaguedesc').val(); //no longer look for desc
            var newLeagueType = parseInt($('#' + displaymode + '_league_view_2 input:checked').val());
            var allowinvites = $('#' + displaymode + '_allowinvites').is(':checked');
            var allowUserInvites = 0;
            if (allowinvites == true) {
                allowUserInvites = 1;
            }
            var fid = GetCurrentfixtureID();

            if ((newName) && (newLeagueType > 0)) { //&& (newDesc) - no longer ask for description
                var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

                if (user) {
                    user = window.sessionStorage.getItem("facebookuser"); // need to reset the user object as the AJAX API is expecting a non JSON parameter
                    $.ajax({
                        url: WS_URL_ROOT + "/League/LeagueCreateHandler",
                        type: "POST",
                        data: "name=" + newName + "&fixtureID=" + fid + "&allowinvites=" + allowUserInvites + "&LeagueType=" + newLeagueType + "&description=" + newDesc + "&user=" + user,
                        dataType: "html",
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("createNewLeague", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            if (JSON.parse(response).ID > 0) {
                                //the league was created successfully
                                UsersLastCreatedLeague = JSON.parse(response); //store the league details here - the LeagueInvite function will look for this object
                                userLeague.LeagueInvite(UsersLastCreatedLeague.ID, null, true);
                            }
                            else {
                                //the league was NOT created successfully
                                //explain reason
                                var thisDivID = getRandomNumber();
                                $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>League was not created! Please try again.</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                                refreshScroller(leagueMessageScroller, "invitepanel");
                                showLeagueExtraDetails();
                            }
                        } //end createNewLeague
                    });

                } //end undefined if
                _gaq.push(['_trackEvent', 'Clicks', 'CreateLeague_step2']);
            }
            else {
                //inputs not correct!!!!
                $('#' + displaymode + '_CreateLeagueError').html("You must give the league a name!");
            }
        }, //end createNewLeague

        GetUserLeaguesLinkedToThisFixture: function () {
            //before we make an AJAX request - check if we have a list of leagues in session storage
            //if we do have a list in session storage - display this list untill the AJAX request returns!!!!

            //before we do anything - hide the loadingpanel
            $('.loadingpanel').hide();

            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var fid = GetCurrentfixtureID();

            var SessionObjectName = "ListOfUsersLeagues_" + fid; //the leagues returned are all linked to a particular fixture
            var thisTempLeagueList;

            //This try/catch is for certain android devices 
            //if the value is not set on certain android devices it will throw an error and not continue with the rest of the function
            try {
                thisTempLeagueList = JSON.parse(window.sessionStorage.getItem(SessionObjectName));
            } catch (TempEx) { }

            if (thisTempLeagueList) { //list exists in session - so display it 

                DisplayListOfLeagues(thisTempLeagueList, SessionObjectName, false);
            }

            //now make AJAX call to get the 100% up to date list!!!!
            $.ajax({
                url: WS_URL_ROOT + "/League/GetUserLeaguesLinkedToThisFixture",
                type: "POST",
                data: "fixtureid=" + fid + "&userid=" + user.id,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    AjaxFail("GetUserLeaguesLinkedToThisFixture", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {

                    DisplayListOfLeagues(response, SessionObjectName, false);
                }
            });
            _gaq.push(['_trackEvent', 'Clicks', 'ViewMyLeagues']);
        }, //end GetUserLeaguesLinkedToThisFixture


        GetOfficialLeagues: function (logClick) {
            //before we make an AJAX request - check if we have a list of leagues in session storage
            //if we do have a list in session storage - display this list untill the AJAX request returns!!!!
            //now make AJAX call to get the 100% up to date list!!!!

            //before we do anything - hide the loadingpanel
            $('.loadingpanel').hide();

            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var fid = GetCurrentfixtureID();

            var SessionObjectName = "ListOfOfficialLeagues_" + fid; //the leagues returned are all linked to a particular fixture
            var thisTempLeagueList;

            //This try/catch is for certain android devices 
            //if the value is not set on certain android devices it will throw an error and not continue with the rest of the function
            try {
                thisTempLeagueList = JSON.parse(window.sessionStorage.getItem(SessionObjectName));
            } catch (TempEx) { }

            if (thisTempLeagueList) { //list exists in session - so display it 

                DisplayListOfLeagues(thisTempLeagueList, SessionObjectName, true);
            }


            //now make AJAX call to get the 100% up to date list!!!!
            $.ajax({
                url: WS_URL_ROOT + "/League/GetOfficialLeagues",
                type: "POST",
                data: "fixtureid=" + fid + "&userid=" + user.id,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetOfficialLeagues", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    DisplayListOfLeagues(response, SessionObjectName, true);
                }
            });

            if (logClick) {
                _gaq.push(['_trackEvent', 'Clicks', 'ViewOfficialLeagues']);
            }

        }, //end GetOfficialLeagues

        GetOfficialLeagues_ForAdmin: function (divtoupdate) {
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var fid = GetCurrentfixtureID();

            var SessionObjectName = "ListOfOfficialLeagues_" + fid; //the leagues returned are all linked to a particular fixture
            

            //now make AJAX call to get the 100% up to date list!!!!
            $.ajax({
                url: WS_URL_ROOT + "/League/GetOfficialLeagues",
                type: "POST",
                data: "fixtureid=" + fid + "&userid=" + user.id,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetOfficialLeagues", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response)
                {
                    userLeague.GetFixturesLeagues();//once we have ALL the official fixtures - then get the leagues just for this Fixture
                    var leagueArray = typeof response != 'object' ? JSON.parse(response) : response;

                    $("#" + divtoupdate).html("");

                    for (var i = 0; i < leagueArray.length; i++) {
                        $("#" + divtoupdate).append('<option value=' + leagueArray[i].ID + '>' + leagueArray[i].Name + '</option>');
                    }

                    window.sessionStorage.setItem(SessionObjectName, $.toJSON(leagueArray));

                    $("#" + divtoupdate).multiSelect({
                        selectableHeader: "<div class='custom-header'>All Official Leagues</div>",
                        selectionHeader: "<div class='custom-header'>Leagues Linked To This Fixture</div>"
                    });
                    $("#" + divtoupdate).multiSelect('refresh');

                }
            });

        }, //end GetOfficialLeagues_ForAdmin 


        DeActivateLeague: function (LeagueID,LeagueName) {
            //ask user if they are sure they want to leave the league
            var thisDivID = getRandomNumber();
            var confirmHTML = "<div id=" + thisDivID + ">Are you sure you want to DeActivate league '<strong>" + LeagueName + "</strong>' <br> <span class='button' onClick='userLeague.ConfirmDeActivateLeague(" + thisDivID + "," + LeagueID + "); return false;'>Yes</span><span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>No</span></div>";
            $('#' + displaymode + '_league_messages').prepend(confirmHTML);
            $('#' + displaymode + '_league_messages').show();
        }, //end DeActivateLeague

        ConfirmDeActivateLeague: function (thisDivID,leagueID) {
            hideLeagueExtraDetails(thisDivID);

            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var fid = GetCurrentfixtureID();

            //now make AJAX call to get the 100% up to date list!!!!
            $.ajax({
                url: WS_URL_ROOT + "/League/DeActivateLeague",
                type: "POST",
                data: "l=" + leagueID + "&u=" + user.id + "&fu=" + user.fbuserid,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("DeActivateLeague", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response)
                {
                    if (response > 0)
                    {
                        //league 
                        $('#LL' + leagueID).hide();
                    }
                }
            });

        }, //end ConfirmDeActivateLeague 



        GetFixturesLeagues: function () {
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var fid = GetCurrentfixtureID();

            //now make AJAX call to get the 100% up to date list!!!!
            $.ajax({
                url: WS_URL_ROOT + "/League/GetFixturesLeagues",
                type: "POST",
                data: "f=" + fid + "&u=" + user.id + "&fu=" + user.fbuserid,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetFixturesLeagues", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    var leagueArray = typeof response != 'object' ? JSON.parse(response) : response;

                    for (var i = 0; i < leagueArray.length; i++) {
                        var LeagueIDtoString = '' + leagueArray[i].ID;
                        $('#FixturesLeague').multiSelect('select', LeagueIDtoString);
                    }

                    $('#FixturesLeague').multiSelect({
                        selectableHeader: "<div class='custom-header'>All Official Leagues</div>",
                        selectionHeader: "<div class='custom-header'>Leagues Linked To This Fixture</div>"
                    });
                }
            });

        }, //end GetFixturesLeagues




        JoinLeague: function (leagueID, LeagueName, Leaguedesc, League_createrId, numberOfMembersInLeague) {
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            //before we make the call - show the loading panel!!!!!!
            $('.leaguepanel').hide();
            $('.leaguestandings').hide();
            $('.loadingpanel').show();


            //now make AJAX call to get the 100% up to date list!!!!
            $.ajax({
                url: WS_URL_ROOT + "/League/JoinLeague",
                type: "POST",
                data: "leagueid=" + leagueID + "&u=" + user.id + "&fu=" + user.fbuserid,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("JoinLeague", XMLHttpRequest, textStatus, errorThrown);

                    $('.loadingpanel').hide(); //remove loading panel
                    userLeague.GetOfficialLeagues(); //show official leagues - is this the only way a user can come in here - i.e they tried to join a league from the official leagues section?? - maybe not - keep an eye on this

                    //tell user join failed
                    showLeagueExtraDetails();

                    var thisDivID = getRandomNumber();
                    $('#' + displaymode + '_league_messages').prepend("<div id=" + thisDivID + "><strong>Failed to join the league! Please try again.</strong> <br /> <span class='button' onclick='hideLeagueExtraDetails(" + thisDivID + "); return false'>OK</span></div>");
                    refreshScroller(leagueMessageScroller, "invitepanel");

                },
                success: function (response) {
                    //if the user joined the league we need to return the league standings to the user - with the users position of course - so the top 20 plus the user at the end
                    userLeague.DisplayTheLeagueTable(response, leagueID, LeagueName, Leaguedesc, League_createrId, numberOfMembersInLeague);
                }
            });
            _gaq.push(['_trackEvent', 'Clicks', 'JoinOfficialLeague']);
        }, //end JoinLeague


        StoreLeagueDetails: function (positions, leagueID, LeagueName, Leaguedesc, LeaguecreaterId, numberOfMembersInLeague) {
            //this function is used to store all the details of the last league which we have displayed
            this.name = LeagueName;
            this.desc = Leaguedesc;
            this.id = leagueID;
            this.num_MembersInLeague = numberOfMembersInLeague;
            this.creater_Id = LeaguecreaterId;
            this.positions_array = positions;
        }, //end StoreLeagueDetails

        GetDefaultLeague: function () { //this makes an updated API call to get the latest league table for the default league linked to this fixture
            if (thisFixture) {
                userLeague.GetLeagueTable(thisFixture.defaultleagueid, thisFixture.defaultleaguename, null, thisFixture.defaultleaguecreator, thisFixture.defaultleaguenummembers);
            }
        }, //end GetDefaultLeague

        UpdateCurrentLeaderboard: function (DontDisplayLoadingGif) { //this makes an updated API call to get the latest league table for the default league linked to this fixture
            if ((this.id > 0) && ($('#' + displaymode + '_leaguestandings_1').css('display') == "block")) {
                //only make this call to update the leaderboard if
                //1 - we know the id of the current league we are displaying
                //2 - the user is currently viewing the leaderboard!!!!!
                if (DontDisplayLoadingGif) {
                    userLeague.GetLeagueTable(this.id, this.name, null, this.creater_Id, this.num_MembersInLeague, DontDisplayLoadingGif);
                }
                else {
                    userLeague.GetLeagueTable(this.id, this.name, null, this.creater_Id, this.num_MembersInLeague);
                }
            }
        }, //end UpdateCurrentLeaderboard

        GetFriendsLeaderBoard: function () {
            try {
                var friendlist;
                try {
                    friendlist = JSON.parse(window.sessionStorage.getItem("facebookfriendlist"));
                } catch (TempEx) { }

                var friendsString = "";

                if (friendlist) {
                    for (var i = 0; i < friendlist.length; i++) {
                        if (i == 0) {
                            friendsString = friendlist[i].id;
                        }
                        else {
                            friendsString = friendsString + "," + friendlist[i].id;
                        }
                    }
                }
                var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

                $.ajax({
                    url: WS_URL_ROOT + "/Leaderboard/GetFriendsLeaderboard",
                    type: "POST",
                    data: "FriendList=" + friendsString + "&f=" + fixture + "&u=" + user.id + "&fu=" + user.fbuserid,
                    dataType: "html",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("GetFriendsLeaderBoard", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {
                        try {
                            if (response) {
                                var friendScores_array = typeof response != 'object' ? JSON.parse(response) : response;
                                window.sessionStorage.setItem("listOfFriendsScores", $.toJSON(friendScores_array));
                                $('.FriendsLeaderboard').html(userLeague.DisplayFriendsLeaderBoard(response, "ff", true));
                                refreshScroller(friendsScoreScroller, "FriendsLeaderboard");
                                SetTickerContent("friendDetails_ticker", null, "friendsFirst");
                            }
                        }
                        catch (ex) {
                            logError("DisplayFriendsLeaderBoard", ex + "response is " + response);
                        }
                    }
                });
            }
            catch (ex) {
                logError("GetFriendsLeaderBoard", ex);
            }
        }, //GetFriendsLeaderBoard

        DisplayFriendsLeaderBoard: function (objArray, theme, enableHeader) {

            // set optional theme parameter
            if (theme === undefined) {
                theme = 'mediumTable'; //default theme
            }

            enableHeader = false; //tempoary hardcode

            if (enableHeader === undefined) {
                enableHeader = true; //default enable headers
            }

            var james = 1;
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            // If the returned data is an object do nothing, else try to parse
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

            var str = '<table class="' + theme + '">';

            // table head
            if (enableHeader) {
                str += '<thead><tr>';
                for (var index in array[0]) {
                    str += '<th scope="col" class="' + index.toString() + '">' + index + '</th>';
                }
                str += '</tr></thead>';
            }

            // table body
            str += '<tbody>';

            for (var i = 0; i < array.length; i++) {

                //Altered the below to reference the new one character properties of each object
                //var userstatus = array[i].C; //CurrentUser
                var pos = array[i].P; //Pos
                var username = array[i].U.replace(/'/g, "\'"); ; //Username  
                //var username = array[i].U.replace(/\'/g, '"');
                var username = array[i].U;

                var credits = array[i].S; //Credits
                var fbuid = array[i].F; //FBUserIDList
                var profilepic = array[i].I; //I = Image

                if ( (profilepic) && (profilepic.indexOf("http") < 0) ) {
                    //if an image is returned AND the image url does NOT contain http (i.e is not the full URL)
                    profilepic = facebookprofilepicurl + profilepic;
                }

                var currentBet;
                try { //put this in its own try/catch as we will not always have a current bet object!!
                    currentBet = array[i].B; //CurrentBet
                } catch (ex) { }

                var activeBetStyle = ""; //default no style 
                var TimeStamp = array[i].T; //TimeStamp


                if ((currentBet) && (currentBet.status == 0) && (currentBet.betid > 0)) {
                    activeBetStyle = " beton"; //this item has an active bet
                }

                //no need for userstaus - just use the fbuserid
                // if ((userstatus == true) || (thisUser.fbuserid == fbuid)) {
                if (thisUser.fbuserid == fbuid) {
                    str += '<tr class="alt_me' + activeBetStyle + '">'; //highlight this row as it is the user who is playing the game!!!!!
                }
                else {
                    str += '<tr class="alt' + activeBetStyle + '">';
                }

                //removed this way Stephen 4-10- 12
                //for (var index in array[i]) {
                // str += '<td class="' + index.toString() + '">' + array[i][index] + '</td>';
                //}

                //replaced with this way
                str += '<td class="P">' + pos + '</td><td class="U"><img src="' + profilepic + '" /><span class="uname">' + username + '</span></td><td class="S">' + credits + '</td>';
                str += '</tr>';
            }
            str += '</tbody>'
            str += '</table>';
            return str;
        } //end DisplayFriendsLeaderBoard

    }; //end of return statement
};                                                                                                           //end of League object