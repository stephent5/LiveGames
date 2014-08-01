var accessToken = null;
var LoginDetailsLoaded = 0;
var GameID = 0; //this value tells the DB what game(client) the user is Logging in for - we need it when creating the user in our tables for the first time!!!!

function DisplayAdminDivs() 
{
    $('#gamestatus').show();
}

function getCurrencyDetails() {

    var tempUser;
    try {
        tempUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
    } catch (ex) { }
   
    //we now get this info for everyone regardless of whether they are currently on facebook or not
    //this is because they may have bought something on facebook previously and when they click myaccount we will want to show them the 
    //correct currency info
    //(getPlatform() == 4) &&
    if ( (!tempUser.CurrencyData))
    {
        //this IS on facebook - so go to fb and get currency details!!!
        try {
            var url = "https://graph.facebook.com/" + tempUser.fbuserid + "?fields=currency,payment_test_group&access_token=" + encodeURIComponent(accessToken);
            $.ajax(
                    {
                        url: url,
                        //data: "?access_token=" + encodeURIComponent(accessToken),
                        type: "GET",
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("getCurrencyDetails", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            //store currency data in DB - no DONT - cos they may well change!!!!!
                            //tempUser.CurrencyData = response;
                            tempUser.CurrencyData = response.currency;
                            tempUser.payment_test_group = response.payment_test_group;
                            window.sessionStorage.setItem("facebookuser", $.toJSON(tempUser));
                        }
                    }
            );
        }
        catch (ex2) {
            logError("getCurrencyDetails.API", ex2);
        }
    }
}

//this functio nmakes sure a user can 
function checkIfUserInPrivateBrowsing()
{
    //user cannot do local storage - this is usually as they are in private bowsing - check for this AND handle it!!!!
    var privatebrowsingOnAndCausingPotentialIssue = 0;
    var testKey = 'qeTest', storage = window.sessionStorage;
    try {
        // Try and catch quota exceeded errors 
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
    }
    catch (error) {
        if (error.code === DOMException.QUOTA_EXCEEDED_ERR && storage.length === 0) {
            //the user DOES have private browsing on!!!!!!!!!!!! ( we get this error on IOS anyway!!!)
            privatebrowsingOnAndCausingPotentialIssue = 1;
        }
    }

    if (privatebrowsingOnAndCausingPotentialIssue == 1) {
        //users browser is not compatible with features we usr ..so redirect to support page
        window.location = location.protocol + '//' + location.host + "/Support?ei=pb"; //add parameter which tells support page thjat the user needs to turn off private browsing!!!!
    }
}
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //when integrating with LFC - don't think we can run the above window.fbAsyncInit code
    //think we will need to check for accesstoken in the url And then if it's there - that means do new LFC flow - oterwise do origbnal flow (i.e the window.fbAsyncInit code above)
    //if we DO do the LFC flow think we might need to call FB.getAuthResponse??? 
    //we need to do something with the access token anyway to try and find out who the user is - perhaps call  FB.getLoginStatus - if we do call this then the
    //LFC flow will be very similar to the original

    //update - now i think we will have to pass the accesstoken to the server side where we will make a call to an api
    //that will return the users details - this is very similar to what we do to get our facebook friends in the 
    //FacebookLoginController/Handshake function

    //the following call 
    //https://graph.facebook.com/me/?access_token=AAAAAAITEghMBANKGJTypP0Kzy8cIsllmnRkTcZC38PP1bxJ1X3frruDsEDOob2PnCSoxg6o0Gw0oUBNMUcTCU1lBfJLabgVZBk0IQlZA7vtvicqsRGI

    //returns the user details JSON

    /*
    {
       "id": "100003370401837",
       "name": "George Benson",
       "first_name": "George",
       "last_name": "Benson",
       "link": "http://www.facebook.com/george.benson.31337",
       "username": "george.benson.31337",
       "birthday": "03/16/1987",
       "gender": "male",
       "timezone": 1,
       "locale": "en_US",
       "updated_time": "2012-08-22T10:25:12+0000"
    }
    */

    //so - further questions
    //1  - we can get the user object and friends object via server side API calls (perhpas can do via AJAX?????)
    //2- but....how do we do the league invite and the post to wall?????
    //3- also how do we call all the FB. functions if we dont call FB.init????? - i'm pretty sure we can't?????

    //somtething like this apparently - (from stacj overflow) - http://stackoverflow.com/questions/9901722/creating-events-with-the-facebook-graph-api
    //FB.api('/me/events?access_token=' + accessToken, 'post', { name: name, start_time: startTime }, function (retVal) { });
    //276786905679012|JvxvijhmiUdBAYimp8ooJn8OLRI
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //function TestFBOrderAPI() {

    //    var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
    //    try {
        
    //        $.ajax(
    //                {
    //                    //https://graph.facebook.com/90700000083422?access_token=AAAD7vHkxBKQBANaYZAW0IUZAORytiBNFWXc0N7vKgVtObPJmTPJFbcxNXyJMQw2ve7QC3ypqSXWyihRW9ZCs9WZCl3xSZB5FNXjC4GCwI8ZBG0AFUAmtHn

    //                    //url: "https://graph.facebook.com/90700000083422/",
    //                    url: "https://graph.facebook.com/9009675827130",
    //                    type: "POST",
    //                    data: "?status=refunded&access_token=" + encodeURIComponent("276786905679012|JvxvijhmiUdBAYimp8ooJn8OLRI"),
    //                    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //                        AjaxFail("TestFBOrderAPI", XMLHttpRequest, textStatus, errorThrown);
    //                    },
    //                    success: function (response) {
    //                        var v = response;
    //                    }
    //                }
    //        );

    //    }
    //    catch (ex2) {
    //        logError("OneTimeGameSetUpComplete_FB.API", ex2);
    //    }
    //}


    //function TestFaceBook() {

    //    var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
    //    try {
    //        var data = {
    //            name: "TestPost", 
    //            message: "Can you see this message??"
    //        };
    //        var callback = function (response) {
    //            //this is the response from our attempt to post to the facbook users wall
    //            var v = 1;
    //        };

    //        FB.api("/" + user.fbuserid + "/feed", "post", data, callback);
    //    }
    //    catch (ex2) {
    //        logError("OneTimeGameSetUpComplete_FB.API", ex2);
    //    }
    //}




    //this function checks the request parameters to see if the user has arrived on 
    //the site via a facebook notification - if so we need to find out which game (if any) the user
    //has been invited to and drop the user on that game
    function CheckForFacebookRequests(redirectToFixture) {
        var requestids = GetRequestParam("request_ids");

        if (requestids) {
            //we have requestID's from facebook - 

            //we are on facebook .. so set item in storage so we rememeber this as we browse the site
            window.sessionStorage.setItem("fbs", 1);

            var user;

            try
            {
                user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            } catch (ex) { }

            var decodedList = decodeURIComponent(requestids);
            var requestidList = decodedList.split(",");
            if ((requestidList) && (requestidList.length > 0)) {

                //getMultipleRequests(decodedList);

                for (var i = 0; i < requestidList.length; i++) {
                    var thisRequestID;
                    if ((user) && (user.id)) {
                        thisRequestID = requestidList[i] + "_" + user.fbuserid;
                        deleteRequest(thisRequestID);
                    }
                    else {
                        getUserIDAndDeleteRequest(requestidList[i]);
                    }
                }
            }

            //now that we have deleted all the requestid's in facebook we need to go to DB and
            //return the fixture to drop the user to 
            //if there is more that one request id  - drop the user on the latest invite he received - for a game that hasn't started yet or has just started ( i.e. don't drop him on a game that's over!!!)
            if (redirectToFixture == 1) {
                GetFixtureIdFromFbRequest(requestids);
            } //we don't do the redirect to the fixture if we don't know the user - the reason we dont know the user is that somebody has just arrived on our site from facebook - so we need to delete the request( as per facebook rules) - however, the user may not want to sign up so they wont click "SignUp" and we wont know who they are - BUT we always need to delete the request!!!
        }
        else {
            //we DONT have requestid's - BUT the user may still be ariving here fom a facebook WALL not a facebook invite!!!!
            //..do nothing for now = need to think about what happens if a user clicks on a link on their wall to an old game - we may have cleared the game from the db
            //so...should we just drop all users onto the homepage- they can make their way tro the game from there??????


        }
    }

    function getMultipleRequests(requestIds) {
        FB.api('', { "ids": requestIds }, function (response) {
            console.log(response);
        });
    }

    function getUserIDAndDeleteRequest(requestId) {
        FB.api(requestId, function (response) {
            try {
                if ((response) && (response.to) && (response.to.id)) {
                    var FBReturned_userid = response.to.id;
                    var newRequestID = requestId + "_" + FBReturned_userid;
                    deleteRequest(newRequestID);
                }
            }
            catch (ex) { logError("getUserIDAndDeleteRequest", ex); }
        });
    }

    //delete each requestId in facebook
    function deleteRequest(requestId) {
        FB.api(requestId, 'delete',
        function (response) {
            //deleted
            var v = 1;
        });
    }

    function GetFixtureIdFromFbRequest(requests) {
        //we need to go to DB with all the requestid's received from facebook and return the fixture to drop the user to 
        //if there is more that one request id  - drop the user on the latest invite he received - for a game that hasn't started yet or has just started ( i.e. don't drop him on a game that's over!!!)
        //var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        try {
            var user = window.sessionStorage.getItem("facebookuser");
            $.ajax({
                url: WS_URL_ROOT + "/Game/GetFixtureIdFromFbRequest",
                type: "POST",
                data: "fbRequest=" + requests + "&u=" + user.id + "&fu=" + user.fbuserid,
                //data: "fbRequest=" + requests + "&user=" + user,
                //dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetFixtureIdFromFbRequest", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    DropUserOnFixture(response);
                }
            });
       
        }
        catch (ex) {
            logError("GetFixtureIdFromFbRequest", ex);
        }
    }


    function DropUserOnFixture(goToFixtureID) 
    {
        //we need to go to DB with all the requestid's received from facebook andreturn the fixture to drop the user to 
        //if there is more that one request id  - drop the user on the latest invite he received - for a game that hasn't started yet or has just started ( i.e. don't drop him on a game that's over!!!)
        try 
        {
            if (typeof (goToFixtureID) != 'undefined' && goToFixtureID != null) {
                if (goToFixtureID > 0) {
                    window.location.href = location.protocol + '//' + location.host + "/Game/?fb_source=1&f=" + goToFixtureID;
                }
            }
            //if we don't have a fixtureId - then do nothing - stay on home page!! - or maybe later drop on myAccount page??
        }
        catch (ex) {
            logError("DropUserOnFixture", ex);
        }
    }

    function UserHasFriendsPlayingThisGame() {
        var hasfriends = 0;
        try
        {
            var friendScores;
        
            try 
            {
                //put this in try/catch as it will throw an error on certain android devices if we try to reference something from session storage that hasn't been set
                friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
            }
            catch (ex2) 
            {
                //if we arrive here it means we dont have our listOfFriendsScores yet 
                //we will ALWAYS have this list ( as even if we have no friends then the user themselves will be in it!)
                //so if this error is thrown it means that we just haven't gone to fb and to db to get this list!!!!!
                //so in this case we should give the benefit of the doubt to user and allow them to send a message
                return 1; 
            }
        
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if (friendScores)
            {
                for (var i = 0; i <= friendScores.length - 1; i++)
                {
                    if (friendScores[i].F != thisUser.fbuserid)
                    {
                        //this user has a friend playing this game!!!!
                        hasfriends = 1;
                        break;
                    }
                }
            }
        }
        catch (ex) { logError("UserHasFriends", ex); }
        return hasfriends;
    }

    function GetFriends() {
        try {
            var checkFriends;
        
            try 
            {
                //put this in try/catch as it will throw an error on certain android devices if we try to reference something from session storage that hasn't been set
                checkFriends = JSON.parse(window.sessionStorage.getItem("facebookfriendlist"));
            }
            catch (ex2) 
            {
                //logError("GetFriends", ex2);
            }

            var fixtureCheck = -1;

            if (thisFixture) {
                fixtureCheck = thisFixture.fixtureid;
            }
            else {
                var requestFixtureID = GetRequestParam("f"); //GetRequestParam("Fixture");
                if (requestFixtureID > 0) {
                    fixtureCheck = requestFixtureID;
                }
            }
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            if (typeof (checkFriends) == 'undefined' || checkFriends == null || checkFriends == "") {
                //only get friends if we don't already have them!!!
                //var accessToken = response.authResponse.accessToken;

                $.ajax({
                    //headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    url: WS_URL_ROOT + "/FacebookLogin/Handshake",
                    type: "POST",
                    data: ({ authCode: accessToken,u:  user.id , fu: user.fbuserid,f: GetCurrentfixtureID() }),
                    //dataType: "json",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("GetFriends", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {
                        try {
                            //window.sessionStorage.setItem("facebookfriendlist", $.toJSON(response.data));
                            window.sessionStorage.setItem("facebookfriendlist",  $.toJSON(response));

                            if (fixtureCheck > 0) { //only do this logic on game page
                                GetFriendsDetails();
                                ListenForFriendUpdates(); //temporarily removed for testing
                            }
                        }
                        catch (ex) {
                            logError("GetFriends_success", ex);
                        }
                    }
                });
            }
            else {
                //we already have the friends list (no need to make another call to FB)
                if (fixtureCheck > 0)
                { //only do this logic on game page
                    $.ajax({
                        //headers: { "Content-Type": "application/json", "Accept": "application/json" },
                        url: WS_URL_ROOT + "/Game/GetUpdatedFriends",
                        type: "POST",
                        data: ({ u: user.id, fu: user.fbuserid, f: GetCurrentfixtureID() }),
                        //dataType: "json",
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("GetUpdatedFriends", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            try {
                                window.sessionStorage.setItem("facebookfriendlist", $.toJSON(response));

                                GetFriendsDetails();
                                ListenForFriendUpdates(); //temporarily removed for testing
                            }
                            catch (ex) {
                                logError("GetUpdatedFriends_success", ex);
                            }
                        }
                    });
                }
            }
        }
        catch (ex) {
            logError("GetFriends", ex);
        }
    }

    function GetFriendsDetails() {
        try {

            GetFriendsBetHistoryForThisGame();//we need to do this always as we need a log of all the bets our friends have made
            userLeague.GetFriendsLeaderBoard();
        }
        catch (ex) {
            logError("GetFriendsDetails", ex);
        }
    }

    function GetFriendsBetHistoryForThisGame(callback) {
        try
        {
            var friendlist;
            try {
                friendlist = JSON.parse(window.sessionStorage.getItem("facebookfriendlist"));
            } catch (TempEx) { }

            var friendsString = "";

            if (friendlist) 
            {
                for (var i = 0; i < friendlist.length; i++) 
                {
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
                url: WS_URL_ROOT + "/Game/GetFriendsBetHistory",
                type: "POST",
                data: "FriendList=" + friendsString + "&f=" + fixture + "&u=" + user.id + "&fu=" + user.fbuserid,
                dataType: "html",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("GetFriendsBetHistoryForThisGame", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    ProcessFriendsDetails(response); 
                }
            });
        }
        catch (ex) {
            logError("GetFriendsBetHistoryForThisGame", ex);
        }
    }

    function ProcessFriendsDetails(response) {
        try
        {
            var friendBetDetails = typeof response != 'object' ? JSON.parse(response) : response;

            var listOfFriendsBets = new Array();
            var betDetailsHTML = "";

            if (typeof (friendBetDetails) != 'undefined' && friendBetDetails != null) {
                for (var i = 0; i < friendBetDetails.length; i++) {
                    var thisBet = friendBetDetails[i];
                    betDetailsHTML = betDetailsHTML + thisBet.eventdesc;
                    if (thisBet.betid > 0) {
                        listOfFriendsBets.push(thisBet);
                    }
                }
                //if (Config.displayFriendsDetals == "1") {
                if (displayFriendsDetals == "1") {
                    $('.FriendFeedInfo').html(betDetailsHTML); 
                }
            }
            window.sessionStorage.setItem("listOfFriendsBets", $.toJSON(listOfFriendsBets)); 
        }
        catch (ex) {
            logError("ProcessFriendsDetails", ex + "response is " + response);
        }
    }

    function SetUpMainMenuLink() {
        var FaceBookSession = 0;
        try 
        {
            try {
                FaceBookSession = window.sessionStorage.getItem("fbs");
            } catch (TempEx) { }


            if ((window.location.href.indexOf("fb_source") <= 0) && (FaceBookSession != 1)) {
                //user is not using this site via facebook - so....display link to home page
                $('#nonfblink').show();
                $('#fblink').hide();
            }
            else {
                //we are on facebook .. so set item in storage so we rememeber this as we browse the site
                window.sessionStorage.setItem("fbs", 1);
                $('#nonfblink').hide();
                $('#fblink').show();
            
            }
        }
        catch (err) { }
    }

    //this functionality is for sending requests to users ( to come play a game)
    //this message appears on the friends notification
    function InviteFriendsToPlayAGame() {

        var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        var thismessage;
        if (thisFixture)
        {
            thismessage = "You've been invited to play " + thisFixture.fixturename + " against " + user.name + " and others!";
        }
        else
        {
            //we can't get name of fixture(this should never happen!!)
            thismessage = "You've been invited to play a LiveGames game against " + user.name + " and others!";
        }

        FB.ui(
                { 
                    method: 'apprequests',
                    message: thismessage //,
                    //picture: '',
                    //link: ''
                },
                InviteFriendsToPlayAGame_response);
    }

    function InviteFriendsToPlayAGame_response(response) {
        try {
            if (response) {
                //if we reach here then the list of selected friends have all been sent a facebook notification telling
                //them about the new game

                //Now we want to update the DB with all the userid's of those who have been invited to play the game and we want
                //to send them emails(in VB) and when we return from the VB function(SetUpOneTimeFriendGame) we then want
                //to send them messages on their Facebook wall

                var thisRequestId = response.request;
                var friends = "";
                if (response.to) {

                    //we should then print out a message here telling the user that their friends have been notified
                    //(there is no point waiting till the emails and posts have been sent as they may take a while)
                    $('.FriendFeedInfo').prepend("<b class='friendtext'>Your Friends have been invited and will join the league once they accept the invitation!</b><br />");
                    $('#FriendInviteButton').hide(); //don't let the user play against more than one group of friends(for the time being anyway!!)

                    for (var i = 0; i < response.to.length; i++) {
                        if (i == 0) {
                            friends = response.to[i];
                        }
                        else {
                            friends = friends + "," + response.to[i];
                        }
                    }
                }

                var user = window.sessionStorage.getItem("facebookuser");
                $.ajax({
                    url: WS_URL_ROOT + "/Game/SetUpOneTimeFriendGame",
                    type: "POST",
                    data: "fbRequestId=" + thisRequestId + "&friends=" + friends + "&user=" + user + "&fixtureID=" + fixture,
                    dataType: "html",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("InviteFriendsToPlayAGame_response", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {
                        OneTimeGameSetUpComplete(response);
                    }
                });
            }
        }
        catch (ex) {
            logError("InviteFriendsToPlayAGame_response", ex);
        }
    }

    //in here we will have a list of all the fbuserid's of those who were invited to the game
    //we can then post to their walls!!!
    function OneTimeGameSetUpComplete(response) {
        try {
            //before we send the facebook messages - we should display the league in the leagues section
            //(even though there will only be one person in the league at this stage - the user who created it!!)
            var fbusers = typeof response != 'object' ? JSON.parse(response) : response;

            if (fbusers) {
                var newLeagueID = fbusers[0].currentfixtureid; //this is a hack - we are using the currentfixtureid variable to store the newly created leagueID
                var leagueName = fbusers[0].last_name;  //this is a HACK!!!! - we are using the last_name property to send back the name of the game (i.e Liverpool v Norwich)
                if (newLeagueID > 0) {
                    //display the league
                    var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                    GetLeagueTable_WithLeagueHeader(newLeagueID, leagueName + " <i>(Waiting For Friends to Accept)</i>", null, user.id);
                  
                    //we have just created (and so joined) a league - we need to update LighStreamer so we can receive updates for this new league
                    AddLeagueToLightStreamer(newLeagueID);
                }

                //now loop through each of my invited friends(who have this app installed) and send them an invite to their facebook wall
                for (var i = 0; i < fbusers.length; i++) {

                    try 
                    {
                        var data = {
                            name: fbusers[i].last_name, //this is a HACK!!!! - we are using the last_name property to send back the name of the game (i.e Liverpool v Norwich)
                            message: fbusers[i].extradata
                        };
                        var callback = function (response) {
                            //this is the response from our attempt to post to the facbook users wall
                            var v = 1;
                        };
                        FB.api("/" + fbusers[i].id + "/feed", "post", data, callback); 
                    }
                    catch (ex2) 
                    {
                        logError("OneTimeGameSetUpComplete_FB.API", ex2);
                    } 
                }
            }
        }
        catch (ex) {
            logError("OneTimeGameSetUpComplete", ex);
        }
    }

    function inviteUpdate(leagueId, lmid, accept,leagueName,leagueDesc) {
        //call API to tell DB that we accepted/declined invite
        $.ajax({
            url: WS_URL_ROOT + "/League/inviteUpdate",
            type: "POST",
            data: "lmid=" + lmid + "&accept=" + accept,
            dataType: "html",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                AjaxFail("inviteUpdate", XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (response) {
                inviteUpdateReturn(response, leagueId, accept, leagueName, leagueDesc, lmid);
            }
        });
    }

    //if the user accepted the invitation to the league - then show the league!!
    function inviteUpdateReturn(response, leagueId, accept, leagueName, leagueDesc, lmid) {
        if (response == 1) { //successful
            $('#inviteUpdateSpan_' + lmid).hide(); //and make the invitation disappear!!
            //if we have accpeted invitation to play a league for this fixture - hide the invite link
            $('#FriendInviteButton').hide(); //when i have time i will have to change this to only hide it  the invitation we have accepted is for this particular fixture!!!

            if (accept == 1) {
                //we have just joined a league - we need to update LighStreamer so we can receive updates for this new league
                AddLeagueToLightStreamer(leagueId);

                //show league
                GetLeagueTable_WithLeagueHeader(leagueId, leagueName, leagueDesc, -111);
            }
        }
    }
    //END of functionality for sending requests to users ( to come play a game)


    function InviteFriends()
    {
        //$('.popup-notify-invites > h1').text( "10 new invites sent - You have earned an extra power play!");
        //$('.popup-notify-invites > h1').text("10 new invites sent!");
        //$('.popup-notify-invites').fadeIn(200).delay(3000).fadeOut(200);

        var message = "<h4 class='PPStart'>Invite Friends</h4>" + "<br clear=\"all\"/><br clear=\"all\"/>";
        message += "<h4>Invite more than 10 new friends and earn an extra powerplay!! <br clear=\"all\"/><br clear=\"all\"/>";

        $('#' + displaymode + '_invitefriendspopup').animate({ top: '5%' }, 300);

        //move it to top
        $('#' + displaymode + '_invitefriendspopup').attr("style", "display:block;z-index:900;");

        $('#' + displaymode + '_invitefriendspopup .text').html(message);
        $('#' + displaymode + '_invitefriendsconfirmbutton').attr('onClick', 'InviteFriends_DoInvite()');
    }


    //this function invites people to play livegames!!
    //if the user invites 10 new friends( that is ten pepole he has not invited before)
    //then they will earn a new powerplay
    function InviteFriends_DoInvite()
    {
                 closeinvitefriendpopup();
                 var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                 var inviteMessage = "You've been invited to play King Of The Kop by " + thisUser.name + "!!";
                 FB.ui(
                    {
                        method: 'apprequests',
                        message: inviteMessage
                    },
                    function (response)
                    {
                        if (response && response.request && response.to)
                        {
                            //if we get here can I assume the invites were sent????
                            var NumInvitesLogged;
                            try {
                                //now log in the DB all the fbuserid's of those invited and the fbrequest which we received 
                                var fbUserIDList = "";
                                var friendsInvited = response.to.length;


                                if (friendsInvited <= 0) {
                                    //nobody invited!!!!
                                    alert("No invites were sent")
                                }
                                else {
                                    //people WERE invited!!!!!
                                    //log in DB - see does user get their powerplay!!!!!

                                    for (var i = 0; i < response.to.length; i++) {
                                        if (i == 0) {
                                            fbUserIDList = response.to[i];
                                        }
                                        else {
                                            fbUserIDList += "," + response.to[i];
                                        }
                                    }

                                    $.ajax({
                                        url: WS_URL_ROOT + "/Game/LogInviteFriends",
                                        type: "POST",
                                        data: "userid=" + thisUser.id + "&fbREquest=" + response.request + "&FBUserID_List=" + fbUserIDList + "&fixtureID=" + GetCurrentfixtureID(),
                                        dataType: "html",
                                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                                            AjaxFail("LogInviteFriends", XMLHttpRequest, textStatus, errorThrown);
                                        },
                                        success: function (response) {
                                            if (response >= 0) //response is the number of power plays the user has earned!!!!
                                            {
                                               
                                                thisFixture.remainingpowerplays = thisFixture.remainingpowerplays + response;
                                                var message = '<span>' + thisFixture.remainingpowerplays + '</span>Power Play';
                                                if (thisFixture.remainingpowerplays > 1) {
                                                    message += "s";
                                                }
                                                $('#' + displaymode + '_powerplayclickbtn').html(message);
                                                $('#powerplayclickbtn2 span').html(thisFixture.remainingpowerplays)

                                                $('.popup-notify-invites > h1').text("Invites sent - You have earned " + response + " extra power play(s)");
                                                $('.popup-notify-invites').fadeIn(200).delay(3000).fadeOut(200);

                                                $('.GameFeedInfo').prepend("<b>Invites sent - You have earned " + response + " extra power play(s)!</b> <br />");
                                                refreshScroller(GameFeedScroller, "GameFeedInfo");
                                            }
                                            else if (response == 1) {
                                                $('.popup-notify-invites > h1').text("Invites sent!");
                                                $('.popup-notify-invites').fadeIn(200).delay(1000).fadeOut(200);

                                                $('.GameFeedInfo').prepend("<b>" + response + " new friend requests sent!</b> <br />");
                                                refreshScroller(GameFeedScroller, "GameFeedInfo");
                                            }
                                            //else if (response > 0)
                                            //{
                                            //    $('.popup-notify-invites > h1').text(response + " new invites sent!");
                                            //    $('.popup-notify-invites').fadeIn(200).delay(1000).fadeOut(200);

                                            //    $('.GameFeedInfo').prepend("<b>" + response + " new friend requests sent!</b> <br />");
                                            //    refreshScroller(GameFeedScroller, "GameFeedInfo");
                                            //}
                                            else 
                                            {
                                                //error logging (OR no new friends) - BUT invites WERE sent!!!!
                                                $('.popup-notify-invites > h1').text("Invites sent!");
                                                $('.popup-notify-invites').fadeIn(200).delay(1000).fadeOut(200);

                                                $('.GameFeedInfo').prepend("<b>Friends invited!!</b> <br />");
                                                refreshScroller(GameFeedScroller, "GameFeedInfo");
                                            }
                                        }
                                    });

                                } //end else

                            }catch (ex) { }
                        } //no response recieved
                    }//end function
                );//end FB.ui
    }//end InviteFriends