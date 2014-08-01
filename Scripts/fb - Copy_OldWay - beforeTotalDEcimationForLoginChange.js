var alreadyDoneLogInFlow = 0; //we need this variable as we don;t want to call fb stuff twice - why the fuck Is it going twice
var accessToken = null;
var userisLoggedIn = -1;
var LoginDetailsLoaded = 0;
var GameID = 0; //this value tells the DB what game(client) the user is Logging in for - we need it when creating the user in our tables for the first time!!!!

//this fucntion replaced by Login.FaceBookCheckLoginResponse
//function loginV2(response, info) 
//{
//    if (response.authResponse) 
//    {
//        if (alreadyDoneLogInFlow == 0) 
//        {
//            alreadyDoneLogInFlow = 1;
//            DoFlowForLoggedInUser(response, info);
//        }
//    }
//    else
//    {
//        ///the user doesn't have the app installed or they aren't logged in - either way = what we need is to prompt the user to click the fb login button
//        $('#signUp').show();
//        $('#fbLogin').hide();
//        Login.SetUpSiteForLoggedOutUser(1); //clear details and redirect to home page(if on the fixture page)
//        SetUpButtonForLoggedOutUser();
//        CheckForFacebookRequests(0);// calling this function here - but dont redirect to fixture as we dont know the user yet
//    }
//}

//replcaed by Login.DoFlowForFacebookLoggedInUser
//function DoFlowForLoggedInUser(response, info) 
//{
//    //user is already logged in and connected

//    var ua = navigator.userAgent.toLowerCase();
//    logError("UserAgent", ua);

//    accessToken = response.authResponse.accessToken;
//    //var user = window.sessionStorage.getItem("facebookuser");
//    var user;

//    try {
//        //put this in try/catch as it will throw an error on certain android devices if we try to reference something from session storage that hasn't been set
//        user = JSON.parse(window.sessionStorage.getItem("facebookuser"));   //user = window.sessionStorage.getItem("facebookuser");
//    }
//    catch (ex) {
//        user = null;
//        logError("UpdateLiveGamesToFacebookUser", ex);
//    }

//    SetUpButtonForLoggedInUser(info);

//    var weHavetheusersDetails = 0;
//    if ((user) && (user.id > 0)) {
//        weHavetheusersDetails = 1;
//    }

//    //if ( (user == undefined)  || (user == null) ) {
//    if (weHavetheusersDetails == 0) {
//        //the user is logged in and connected with facebook - however we do not have the user details locally - so get them!!!

//        //if the user has just logged in - redirect them to the game page - we can get all their detailsd there
//        //there is no point doing all this logic on the home page and then redircting
//        if ((typeof (loginFixtureID) != 'undefined' && loginFixtureID != null) && (loginFixtureID > 0) && (LoginClick == 1)) {
//            //user has just logged in - so drop them on the current T5 Live Game (if we know the fixture to drop them on [loginFixtureID] ) -no point just updating the home page - there's nothing on that page!!
//            window.location.href = location.protocol + '//' + location.host + "/Game/?f=" + loginFixtureID;
//        }
//        else 
//        {
//            UpdateLiveGamesToFacebookUser(response, info);
//        }
//    }
//    else {

//        //the user is logged in and connected with facebook AND we have their details locally
//        //the user IS logged in - so when they click PlayLink they will be directed striaght to the game page
//        //$('.playnow').show(); //As soon as we have returned from facebook we make sure this link is visible - we dont want to show this link if we don't know if there are a facebook user or not
//        $('.flipwarning').show();
//        //$('.credits').html(user.credits);
//        //$('.credits').show();

//        if (homepagefixtureid) {
//            //this is the home page - so populate tracker for this user
//            DoHomePageLoadLogic();
//        }

//        var requestFixtureID = GetRequestParam("f");
//        SetUpMainMenuLink();

//        if (requestFixtureID > 0) {
//            //we are on the game page - load relevant details
//            if (alreadycalledGameDetails == 0) { //no need calling this twice on the page load
//                DoGamePageLoadLogic();
//            }
//            //ViewLeagues(1); //as we have the user object in session stoarage - load league info for this user - no longer call this - we now get the leaderboard AFTER we call get game details - stephen 19-july
//            GetFriends();
//        }
//        else 
//        {
//            $('.playnow').show();
//        }

//        //new Admin Logic
//        if ( (LiveEventMethod == "SR") || (LiveEventMethod == "T5P"))  //the admin logic is only relevant if the LiveEvent method is SignalR(or T5pusher)
//        {
//            admin = new Administrator(user);
//            if (admin.isAdmin()) {
//                //admin.SetUpRefereesSecureGroup();
//                admin.DisplayAdminDivs();
//                if (keepAliveStarted == 0) {
//                    admin.SendKeepAlive(); //start the sending of the admin KeepALive messages
//                }
//                admin.configureStartButtons();

//                if (thisFixture) {
//                    populatePitch(thisFixture); //we do this as we need to be admin to show peno's - and the first time we called populatePitch we may not have known we were the admin yet!!!
//                    populatePitchOdds(thisFixture);
//                }
//            }
//        }

//        getCurrencyDetails();
//        CheckForFacebookRequests(1); //check to see if the user has arrived on our site from a facebook notification  //if we do have a fb request - then delete it and drop user on approriate fixture
//    }
//}

function DisplayAdminDivs() 
{
    $('#gamestatus').show();
}

function GetUsersCurrency() {

}


//function UpdateLiveGamesToFacebookUser(response, info) {

//    try {
//        thisUser = new User(info);
//        LogUserDetailsV1(info, thisUser); //update DB that this user has logged in (or if the users first time - then add them to the DB)
//    }
//    catch (ex) {
//        logError("UpdateFacebookUserToLiveGamesUser", ex);
//    }
//}

/*
function LogUserDetailsV1(response, thisUser) {
    try 
    {
        //first ..get the fixtureid
        var fixtureIdTheUserIstryingToPlay = GetCurrentfixtureID();
        if ((fixtureIdTheUserIstryingToPlay == null) || (!fixtureIdTheUserIstryingToPlay)) {

            //we will get here if the user is on the home page
            fixtureIdTheUserIstryingToPlay = loginFixtureID;
        }

        $.ajax({
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            url: WS_URL_ROOT + "/Login/Login",
            type: "GET",
            data: ({ fbuserid: thisUser.fbuserid, name: thisUser.name, first_name: thisUser.first_name, last_name: thisUser.last_name, link: thisUser.link, locale: thisUser.locale, gender: thisUser.gender, birthday: thisUser.birthday, email: thisUser.email, timezone: thisUser.timezone, verified: thisUser.verified, profilepic: thisUser.profilepic, fixtureid: fixtureIdTheUserIstryingToPlay }),
            dataType: "json",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                AjaxFail("LogUserDetailsV1", XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (response) {

                try
                {
                    window.sessionStorage.setItem("facebookuser", $.toJSON(response)); //now that we have logged user in DB - stick in local storage
                    window.sessionStorage.setItem("lim", 1); //lim = log in method 1 = fb , 2 = email
                   
                    //the user IS logged in - so when they click PlayLink they will be directed striaght to the game page
                    //$('.playnow').show(); //As soon as we have returned from facebook we make sure this link is visible - we dont want to show this link if we don't know if there are a facebook user or not

                    thisUser.userid = response.id;
                    thisUser.credits = response.credits;

                    if (thisUser.userid > 0) {
                        //you were logged in - so redirect???????!!!!!!
                        var url = window.location.href;
                        var requestFixtureID = GetRequestParam("f");

                        if (url.indexOf("signup/") > 0) {
                            //if we are on sign up page - go home!!
                            window.location.href = location.protocol + '//' + location.host + "/"; //"/Start"
                        }
                        //else if ((loginFixtureID) && (loginFixtureID > 0) && (LoginClick == 1)) {
                        else if ((typeof (loginFixtureID) != 'undefined' && loginFixtureID != null) && (loginFixtureID > 0) && (LoginClick == 1)) {
                            //user has just logged in - so drop them on the current T5 Live Game (no point just updating the home page - there's nothing on that page!!)
                            window.location.href = location.protocol + '//' + location.host + "/Game/?f=" + loginFixtureID;
                        }
                        else if ((typeof (requestFixtureID) != 'undefined' && requestFixtureID != null) && (requestFixtureID > 0)) {
                            //we must be on the fixture page!!!!
                            if (alreadycalledGameDetails == 0) { //no need calling this twice on the page load
                                DoGamePageLoadLogic();
                            }

                            getCurrencyDetails();
                            SetUpMainMenuLink();

                            //ViewLeagues(1); //once we have the user object in session stoarage - load league info for this user - no longer call this - stephen
                            GetFriends();

                            //new Admin Logic
                            if ((LiveEventMethod == "SR") || (LiveEventMethod == "T5P"))  //the admin logic is only relevant if the LiveEvent method is SignalR or t5pusher
                            {
                                admin = new Administrator(response);
                                if (admin.isAdmin()) {
                                    //admin.SetUpRefereesSecureGroup();
                                    admin.DisplayAdminDivs();
                                    if (keepAliveStarted == 0) {
                                        admin.SendKeepAlive(); //start the sending of the admin KeepALive messages
                                    }
                                    admin.configureStartButtons();

                                    if (thisFixture) {
                                        populatePitch(thisFixture); //we do this as we need to be admin to show peno's - and the first time we called populatePitch we may not have known we were the admin yet!!!
                                        populatePitchOdds(thisFixture);
                                    }

                                }
                            }
                        }
                        else {
                            //we are on home page 

                            admin = new Administrator(response);
                            if (admin.isAdmin()) {
                                //admin.SetUpRefereesSecureGroup();
                                admin.DisplayAdminDivs();
                                if (keepAliveStarted == 0) {
                                    admin.SendKeepAlive(); //start the sending of the admin KeepALive messages
                                }
                                admin.configureStartButtons();

                                if (thisFixture) {
                                    populatePitch(thisFixture); //we do this as we need to be admin to show peno's - and the first time we called populatePitch we may not have known we were the admin yet!!!
                                    populatePitchOdds(thisFixture);
                                }
                            }

                            if (homepagefixtureid) {
                                //this is the home page - so populate tracker for this user
                                DoHomePageLoadLogic();
                            }

                            getCurrencyDetails();
                            SetUpMainMenuLink();

                            CheckForFacebookRequests(1); //check to see if the user has arrived on our site from a facebook notification  //if we do have a fb request - then delete it and drop user on approriate fixture
                            //$('.playnow').show();
                            $('.playnow').show();
                        }
                    }
                }
                catch (ex) {
                    logError("LogUserDetailsV1_return", ex);
                }
            } //end success
        });       //end  $.ajax
    }
    catch (ex) {
        logError("LogUserDetailsV1", ex);
    }
}
*/

function getCurrencyDetails() {
    var tempUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

    //we now get this info for everyone regardless of whether they are currently on facebook or not
    //this is because they may have bought something on facebook previously and when they click myaccount we will want to show them the 
    //correct currency info
    //(getPlatform() == 4) &&
    if ( (!tempUser.CurrencyData))
    {
        //this IS on facebook - so go to fb and get currency details!!!
        try {
            var url = "https://graph.facebook.com/" + tempUser.fbuserid + "?fields=currency&access_token=" + encodeURIComponent(accessToken);
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
                            tempUser.CurrencyData = response;
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

//this function gets called at the bottom of the layout pages
function FaceBookElementsLoaded() {
        LoginDetailsLoaded = 1; //this tell the displayButton functions that we can reference them
        SetUpLoginButtons();  // Only do this this function here cos we cant do it until the fb-auth button has been loaded on page 
}


//the function below replcaed by Login.DoLoginFlow()
/*
function newLoginFlow(response) {
    if (response.authResponse) {
        //user is already logged in and connected with facebook
            FB.api('/me', function (info) {
                loginV2(response, info);
            });
    } else {
        //facebook says this user is NOT logged in 
        //-now check if they've logged in via email

        var userLoggedInViaEmail = 0;
        var rememberMeGUID;
        try {
            rememberMeGUID = localStorage.getItem("rm"); //get remember me value
        } catch (ex) { }
        try {
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if (thisUser) {
                userLoggedInViaEmail = thisUser.id;
            }
        } catch (ex) { }

        if (userLoggedInViaEmail > 0)
        {
            //this user IS  logged in via email - so show the login link 
            userisLoggedIn = 1;
            SetUpButtonForLoggedInUser();
            SetUpMainMenuLink();
        }
        else if (rememberMeGUID) {
            //the user is NOT logged in - however they DID click rememberMe the last time they logged in 
            //so attempt to log them in via this key
            Login.CallLoginAPI("", "", 0, rememberMeGUID);
        }
        else { //user is NOT logged in via facebook - OR email - set up facebook button!
            DoSetUpForLoggedOUtUser();
        }
       
    }
} //end newLoginFlow
*/

function DoSetUpForLoggedOUtUser() {
    //user is either not connected to your app or is logged out - what we need is to prompt the user to click the fb login button
    $('#signUp').show();
    $('#fbLogin').hide();

    $('.playnow').show(); //show playNow button - which when a user is logged out will prompt them to login via facebook
    $('#' + displaymode + '_registration_btn').show(); //show the prompt to log in via email

    //the user is NOT logged in - so when they click PlayLink they will be prompted to log in 
    //$('.playnow').show(); //As soon as we have returned from facebook we make sure this link is visible - we dont want to show this link if we don't know if there are a facebook user or not

    Login.SetUpSiteForLoggedOutUser(1); //clear details and redirect to home page(if on the fixture page)
    SetUpButtonForLoggedOutUser();
    CheckForFacebookRequests(0); // calling this function here - but dont redirect to fixture as we dont know the user yet

    if (homepagefixtureid) {
        //this is the home page - so populate tracker
        DoHomePageLoadLogic();
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

    function TestFBOrderAPI() {

        var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        try {
        
            $.ajax(
                    {
                        //https://graph.facebook.com/90700000083422?access_token=AAAD7vHkxBKQBANaYZAW0IUZAORytiBNFWXc0N7vKgVtObPJmTPJFbcxNXyJMQw2ve7QC3ypqSXWyihRW9ZCs9WZCl3xSZB5FNXjC4GCwI8ZBG0AFUAmtHn

                        //url: "https://graph.facebook.com/90700000083422/",
                        url: "https://graph.facebook.com/9009675827130",
                        type: "POST",
                        data: "?status=refunded&access_token=" + encodeURIComponent("276786905679012|JvxvijhmiUdBAYimp8ooJn8OLRI"),
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("TestFBOrderAPI", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            var v = response;
                        }
                    }
            );

        }
        catch (ex2) {
            logError("OneTimeGameSetUpComplete_FB.API", ex2);
        }
    }


    function TestFaceBook() {

        var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        try {
            var data = {
                name: "TestPost", 
                message: "Can you see this message??"
            };
            var callback = function (response) {
                //this is the response from our attempt to post to the facbook users wall
                var v = 1;
            };

            FB.api("/" + user.fbuserid + "/feed", "post", data, callback);
        }
        catch (ex2) {
            logError("OneTimeGameSetUpComplete_FB.API", ex2);
        }
    }




    //this function checks the request parameters to see if the user has arrived on 
    //the site via a facebook notification - if so we need to find out which game (if any) the user
    //has been invited to and drop the user on that game
    function CheckForFacebookRequests(redirectToFixture) {
        var requestids = GetRequestParam("request_ids");

        if (requestids) {
            //we have requestID's from facebook - 

            //we are on facebook .. so set item in storage so we rememeber this as we browse the site
            window.sessionStorage.setItem("fbs", 1);

            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
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
        var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
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
                logError("GetFriends", ex2);
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


    //function GetFriendsLeaderBoard() {
    //    try {
    //        var friendlist = window.sessionStorage.getItem("facebookfriendlist");
    //        var user = window.sessionStorage.getItem("facebookuser");
    //        $.ajax({
    //            url: WS_URL_ROOT + "/Leaderboard/GetFriendsLeaderboard",
    //            type: "POST",
    //            data: "FriendList=" + friendlist + "&user=" + user + "&fixtureID=" + fixture,
    //            dataType: "html",
    //            error: function (XMLHttpRequest, textStatus, errorThrown) {
    //                AjaxFail("GetFriendsLeaderBoard", XMLHttpRequest, textStatus, errorThrown);
    //            },
    //            success: function (response) {
    //                DisplayFriendsLeaderBoard(response);
    //            }
    //        });
    //    }
    //    catch (ex) {
    //        logError("GetFriendsLeaderBoard", ex);
    //    }
    //}

    //function DisplayFriendsLeaderBoard(friendScores) 
    //{
    //    try 
    //    {
    //        if (friendScores) 
    //        {
    //            //WaitForFriendScoresToFinishProcessing(); //wait until there is no other process updating the friendscores ( these scores are usually updated via a lightStreamer message indicating that a friend has placed a bet)
    //            var friendScores_array = typeof friendScores != 'object' ? JSON.parse(friendScores) : friendScores;
    //            window.sessionStorage.setItem("listOfFriendsScores", $.toJSON(friendScores_array));
    //            FinishedProcessingFriendScores();
    //            $('.FriendsLeaderboard').html(CreateLeagueScoresView2(friendScores, "ff", true));
    //            refreshScroller(friendsScoreScroller,"FriendsLeaderboard");
    //        }
    //     }
    //     catch (ex)
    //     {
    //         logError("DisplayFriendsLeaderBoard", ex + "response is " + friendScores);
    //     }
    //}

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


    function getFacebookStatus() {
        if (FB.getSession() != null) {
            return 1;
        } else {
            return 2;
        }
    }

    function facebookLogout() {

        FB.Event.subscribe('auth.logout', function (response) {
            Login.SetUpSiteForLoggedOutUser(0);
            return true;
        });
    }

    function SetUpLoginButtons() 
    {
        if (userisLoggedIn == 1) {
            SetUpButtonForLoggedInUser();
        }
        else if (userisLoggedIn == 0) {
            SetUpButtonForLoggedOutUser();
        }
        else if (userisLoggedIn == -1) {
            //if we reach here then our facebook login flow has not been reached yet 
            //so... do nothing until we call the appropriate function after our facebook flow has run as normal (i.e. untill we call either SetUpButtonForLoggedInUser or SetUpButtonForLoggedOutUser)
            var v = 1;
            //alert("we haven't done our fb logic yet!!!");
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

    function SetUpButtonForLoggedInUser(userInfo) {
        if (LoginDetailsLoaded == 1) //the facebook elements we are going to reference have been load so we can continue!!!
        {

            var HomePagecheck = $('#TestlayoutSpan').html();//document.getElementById('TestlayoutSpan'); //changed this to use 'layout' instead of 'homeSpan' - we dont want to limit this check to only the home page - using a span on the layout page means we can use this logic on all pages that use the layout page!!!

            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var LogInMethod;
            try{
                LogInMethod = window.sessionStorage.getItem("lim");
            }catch(ex){}
        
      
            if (HomePagecheck)
            {
                //we are on home page 
                var button = document.getElementById('PlayLink');
                if (button) {
                    //if the play now button exists - i.e there is a game in play - allow the user to log out by displaying the new/seperate logout button
                    var LogoutButton = document.getElementById('logout');
                    LogoutButton.innerHTML = 'Logout';
                    $('.logout').show();

                    if (LogInMethod == 2) {
                        //user logged in via email - so the logout click does not reference facebook!
                        LogoutButton.onclick = function () {
                            SetUpButtonForLoggedOutUser();
                            //Login.SetUpSiteForLoggedOutUser(1);
                            Login.ClearSessionDetails();
                        };

                        DoHomePageLoadLogic();

                        $('#' + displaymode + '_registration_btn').show(); //show the prompt to log in via email
                        $('.playnow').show(); //user is logged in - show the playnow button so they can get to the game!!!!!
                    }
                    else {
                        //the user logged in via facebook
                        LogoutButton.onclick = function () {
                            FB.logout(function (response) {
                                SetUpButtonForLoggedOutUser();
                                //Login.SetUpSiteForLoggedOutUser(1);
                                Login.ClearSessionDetails();
                            });
                        };
                    }

                    $('#' + displaymode + '_registration_btn').hide(); //hide the prompt to log in via email
                
                } 
                //end homepage logic
            }
            else {
                //we are on game page - 
                //user is logged in - so update the button to log a person out when they click it!!!!!!!!!
                var button = document.getElementById('fb-auth');
                button.innerHTML = 'Logout';
                $('.fb-auth').show();

                if (LogInMethod == 2) {
                    //user logged in via email - so the logout click does not reference facebook!
                    button.onclick = function () {
                        SetUpButtonForLoggedOutUser();
                        //Login.SetUpSiteForLoggedOutUser(1);
                        Login.ClearSessionDetails();
                    };

                    //we are on the game page - load relevant details
                    if (alreadycalledGameDetails == 0) { //no need calling this twice on the page load
                        DoGamePageLoadLogic();
                    }
                }
                else {
                    //the user logged in via facebook
                    button.onclick = function () {
                        FB.logout(function (response) {
                            SetUpButtonForLoggedOutUser();
                            //Login.SetUpSiteForLoggedOutUser(1);
                            Login.ClearSessionDetails();
                        });
                    };
                }
            } //end else of  if (HomePagecheck) {

            var button2 = document.getElementById('fb-auth2');
            if (button2) {
                button2.innerHTML = 'Logout';
                $('.fb-auth').show();

                if (LogInMethod == 2) {
                    //user logged in via email - so the logout click does not reference facebook!
                    button2.onclick = function () {
                        SetUpButtonForLoggedOutUser();
                        //Login.SetUpSiteForLoggedOutUser(1);
                        Login.ClearSessionDetails();
                    };

                    $('#' + displaymode + '_registration_btn').hide(); //hide the prompt to log in via email
                }
                else {
                    //the user logged in via facebook
                    button2.onclick = function () {
                        FB.logout(function (response) {
                            SetUpButtonForLoggedOutUser();
                            //Login.SetUpSiteForLoggedOutUser(1);
                            Login.ClearSessionDetails();
                        });
                    };
                }
            } //end fb-auth2 button

            var thisUser;
            if (userInfo) {
                //use the object returned to us from facebook
                thisUser = userInfo;
            }
            else
            {
                thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            }

            if (thisUser) 
            {
                //we have user details SO ..we can display these
                $('.username').html(thisUser.name);
            
                var fbLogin = document.getElementById('fbLogin');
                if (fbLogin) 
                {
                    //if in here then this is the home page - so set details

                    var image = document.getElementById('image');
                    if (image) {
                        image.src = "https://graph.facebook.com/" + thisUser.id + "/picture"
                    }
              
                    $('#fbLogin').show();
                    $('#signUp').hide();
                }
            }

        
        }
        userisLoggedIn = 1;
    }

    function SetUpButtonForLoggedOutUser() 
    {
        $('#' + displaymode + '_registration_btn').show(); //show the prompt to log in via email

        if (LoginDetailsLoaded == 1) //the elements we are going to reference have been loaded so we can continue!!!
        {
            var HomePagecheck = $('#TestlayoutSpan').html();//document.getElementById('TestlayoutSpan'); //changed this to use 'layout' instead of 'homeSpan' - we dont want to limit this check to only the home page - using a span on the layout page means we can use this logic on all pages that use the layout page!!!
            if (HomePagecheck) 
            {
                //make logout button invisible (cos we ARE logged out!!!!)
                var LogoutButton = document.getElementById('logout');
                if (LogoutButton) 
                {
                    LogoutButton.innerHTML = '';
                    $('.logout').hide();
                }
            } //end homePage logic
            else  
            {
                //set up game page for logged out user 
                //- removed the below code - stephen 26-June-13 - - - logged out user never gets to see game page!!!!
                /*
                //user is logged out - so update the button to log a person in when they click it!!!!!!!!!
                var button = document.getElementById('fb-auth');
                if (button) {
                    $('.fb-auth').show();
                    button.onclick = function () {
                        DoFaceBookLogin();
                    }
                }
    
                var button2 = document.getElementById('fb-auth2');
    
                if (button2) {
                    //we are on the home page
                    button2.innerHTML = 'Login';
                    $('.fb-auth').show();
                    button2.onclick = function () {
                        DoFaceBookLogin();
                    }
                    $('#fbLogin').hide();
                    $('#signUp').show();
                }
                */
            }

       
        }
        userisLoggedIn = 0;
    }

    //this function is used after a user tries to get to the game page - i.e. href="/Game/?f=10"
    //if the user is not logged in we don't allow them to go to the page and instead we show them the facebook login
    //if they log in via facebook we then drop them on the relevant game page
    function CheckIfLoggedIn(gotoFixtureID) {
        //    if (alreadyDoneLogInFlow == 1) {
        var checkUser;
        try {
            //put this in try/catch as it will throw an error on certain android devices if we try to reference something from session storage that hasn't been set
            checkUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));   //user = window.sessionStorage.getItem("facebookuser");
        }
        catch (ex) {
            checkUser = null;
            logError("CheckIfLoggedIn", ex);
        }

        if ((typeof (checkUser) != 'undefined' && checkUser != null) && (checkUser.id > 0)) {
            return true; //user IS logged in ....so - allow them continue to URL
        }
        else {
            //user is NOT logged in - prompt them to log in vai facebook - and DON'T allow them to continue
            loginFixtureID = gotoFixtureID; //this makes sure that we drop the user on the correct fixture after the login
            DoFaceBookLogin();
            return false;
        }

        //    }
        //    else {
        //        //we haven't done th login flow yet ( the user has clicked the link before the facebook asynscronous call has returned)
        //        //therfore - allow the user to the game page
        //        //what we don't want to do here is to try to log a user in  who is already logged in  (by calling the fb login pop up)
        //        //so if we havn;e don the login in flow yet we just allow them to continue
        //        return true;
        //    }
    }
   
    function DoFaceBookLogin() {
        //first - when a user has clicked this - we need to set a variable to show that the user has logged in 
        //otherwise we won't know if a user has just arrived on our site and we have "remembered" them (via facebook)
        //or they have actually clicke the log-in button.
        //When they click log-in we try to redirect them to the appropriate T5LiveGame fixture (ie. the game that we are linking to from the home page)
        LoginClick = 1;
        alreadyDoneLogInFlow = 0;

    
        if ((IOSversion > 0) ) //&& (isChrome == 1)
        {
            //this is Chrome on IOS 
            //so..do a slightly different login flow as the facebook login flow on IOS does not work!!! -  http://developers.facebook.com/bugs/325086340912814

            var redirectlocation = "";
            if ((typeof (loginFixtureID) != 'undefined' && loginFixtureID != null) && (loginFixtureID > 0) && (LoginClick == 1)) {
                redirectlocation = location.protocol + '//' + location.host + "/Game/?f=" + loginFixtureID;
            }
            else {
                redirectlocation = location.protocol + '//' + location.host;
            }
            var permissionUrl = "https://m.facebook.com/dialog/oauth?client_id=" + fbid + "&response_type=code&redirect_uri=" + encodeURIComponent(redirectlocation) + "&scope=email,publish_stream";
            window.location = permissionUrl;
            return;
        }
        else {
            //for everyone else - do normal login!!!!
            FB.login(function (response) {
                if (response.authResponse) {
                    FB.api('/me', function (info) {
                        Login.FaceBookCheckLoginResponse(response, info);
                    });
                }
            },
            { scope: 'email,publish_stream' }); //status_update,,publish_stream ?? removed these as we want to request as few permissions as possible from the user
        }
    }

//this function replaced by Login.Logout();
/*
function logout(redirect) {
        Login.Logout();
        alreadyDoneLogInFlow = 0; //reset this so the next time we DO call the fb login api
        alreadycalledGameDetails = 0 //reset this
        window.sessionStorage.removeItem("facebookuser");
        window.sessionStorage.removeItem("facebookfriendlist");
        if (redirect == 1) {
            //if we are on fixture page - redirect to home page
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

            if (fixtureCheck > 0) {
                //we are on a game page and the user is not logged in - so send to home page
                $('.flipwarning').hide();
                window.location.href = location.protocol + '//' + location.host + "/"; //"/Start"
            }
        }
    
    }
    */

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
