var Login = function () {

    var method = -1; //1 = facebook, 2 - email
    function UserPreviouslyLoggedInViaEmail() {
        var previousEmailLogin;
        try
        {
            previousEmailLogin = localStorage.getItem("facebookuser");
        } catch (ex) { }
        return previousEmailLogin;
    }
    var alreadyDoneLogInFlow = 0; //we need this variable as we don;t want to call fb stuff twice - why the fuck Is it going twice
    var userisLoggedIn = -1;


    function DoEmailLoginChecks() {
        CheckIfUserIsEmailUser();
    }


    function DoLoginFlow(response) {
        if (response.authResponse) {
            //user is already logged in and connected with facebook
            FB.api('/me', function (info) {
                FaceBookCheckLoginResponse(response, info);
            });
        } else {
            //facebook says this user is NOT logged in 
            //-now check if they've logged in via email
            var thisUser;
            var userLoggedInViaEmail = 0;
            var rememberMeGUID;
            try {
                rememberMeGUID = localStorage.getItem("rm"); //get remember me value
            } catch (ex) { }
            try {
                thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

                if ((thisUser)) {

                    if (thisUser.link) {
                        //the user is logged out on facebook - but not on this app!!!!
                        //we still think he's logged in with facebook - but he is NOT!!!!!!!
                        ClearSessionDetails();
                        return; //dont continue with this function - we will have displayed the details for a logged out user by calling ClearSessionDetails
                    }
                    else {
                        userLoggedInViaEmail = thisUser.id;
                    }
                }
            } catch (ex) { }

            if (userLoggedInViaEmail > 0) {
                //this user IS  logged in via email - so show the login link 
                userisLoggedIn = 1;
                SetUpButtonForLoggedInUser();
                SetUpMainMenuLink();
                CheckIfAdminAndIfSoSetUpAdminDetails(thisUser);
            }
            else if (rememberMeGUID) {
                //the user is NOT logged in - however they DID click rememberMe the last time they logged in 
                //so attempt to log them in via this key
               
                //Login.CallLoginAPI("", "", 0, rememberMeGUID);
                CallLoginAPI("", "", 0, rememberMeGUID);
            }
            else { //user is NOT logged in via facebook - OR email - set up facebook button!
                DoSetUpForLoggedOUtUser();

                if (homepagefixtureid) {
                    //this is the home page - so populate tracker
                    DoHomePageLoadLogic();
                }

                if (document.URL.toLowerCase().indexOf("fixtures") > 0) {
                    //we are on the Fixtures page and we are NOt logged in 
                    alert("You are NOT logged in - we are redirecting to homepage where you can login!");
                    window.location.href = location.protocol + '//' + location.host;
                }
            }
        }
    } //end DoLoginFlow


    function CheckIfAdminAndIfSoSetUpAdminDetails(user) {
        admin = new Administrator(user);
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
            else {
                if (document.URL.toLowerCase().indexOf("fixtures") > 0) {
                    //we are on the Fixtures page
                    GetGameAdminDetails();
                }
            }
        }
        else {

            if (document.URL.toLowerCase().indexOf("fixtures") > 0) {
                //we are on the Fixtures page and we are NOt the admin - so tell the user they need to log in !
                alert("You are NOT authorised to view this page - redirecting to homepage!");
                window.location.href = location.protocol + '//' + location.host;
            }


        }
    }


    function SetUpButtonForLoggedInUser(userInfo) {
        if (LoginDetailsLoaded == 1) //the facebook elements we are going to reference have been load so we can continue!!!
        {
            var HomePagecheck = $('#TestlayoutSpan').html();//document.getElementById('TestlayoutSpan'); //changed this to use 'layout' instead of 'homeSpan' - we dont want to limit this check to only the home page - using a span on the layout page means we can use this logic on all pages that use the layout page!!!

            var LogInMethod;
            try {
                LogInMethod = window.sessionStorage.getItem("lim");
            } catch (ex) { }


            if (HomePagecheck) {
                //we are on home page 
                var button = document.getElementById('PlayLink');
                if (button) {
                    //if the play now button exists - i.e there is a game in play - allow the user to log out by displaying the new/seperate logout button

                    /* --removed this Stephen - 18-Nov-13 - upon introduction of the landing page merge
                    //Hide this as on the new landing page there is no logout option!!!

                    var LogoutButton = document.getElementById('logout');
                    LogoutButton.innerHTML = 'Logout';

                    // if (isFaceBookSession != "True") { 

                    if (getPlatform() != 4)
                    {
                        //dont show logout links if the user isplaying the game in the facebook canvas!!!
                        $('#logout').show();
                    }
                    else {
                        $('#logout').hide();
                    }
                    */

                    if (LogInMethod == 2) {
                        //user logged in via email - so the logout click does not reference facebook!


                        /* --removed this Stephen - 18-Nov-13 - upon introduction of the landing page merge
                       //Hide this as on the new landing page there is no logout option!!!

                        LogoutButton.onclick = function () {
                            //SetUpButtonForLoggedOutUser();
                            //Login.SetUpSiteForLoggedOutUser(1);
                            ClearSessionDetails();
                        };

                        */

                        DoHomePageLoadLogic();

                        $('#' + NewDisplayMode + '_registration_btn').show(); //show the prompt to log in via email

                        if (al != -1) {
                            $('.playnow').show(); //show playNow button - which when a user is logged out will prompt them to login via facebook
                        }
                    }
                    else {
                        //the user logged in via facebook
                        /* --removed this Stephen - 18-Nov-13 - upon introduction of the landing page merge
                      //Hide this as on the new landing page there is no logout option!!!

                        LogoutButton.onclick = function () {
                            FB.logout(function (response) {
                                //SetUpButtonForLoggedOutUser();
                                //Login.SetUpSiteForLoggedOutUser(1);
                                ClearSessionDetails();
                            });
                        };

                        */


                    }

                    $('#' + NewDisplayMode + '_registration_btn').hide(); //hide the prompt to log in via email

                }
                //end homepage logic
            }
            else {
                //we are on game page - 
                //user is logged in - so update the button to log a person out when they click it!!!!!!!!!
                var button = document.getElementById('fb-auth');
                button.innerHTML = 'Logout';

                //if (isFaceBookSession != "True") {
                if (getPlatform() != 4) {  //dont show logout links if the user isplaying the game in the facebook canvas!!!
                    $('.fb-auth').show();
                }
                else {
                    $('.fb-auth').hide();
                }

                if (LogInMethod == 2) {
                    //user logged in via email - so the logout click does not reference facebook!
                    button.onclick = function () {
                        //SetUpButtonForLoggedOutUser();
                        //Login.SetUpSiteForLoggedOutUser(1);
                        ClearSessionDetails();
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
                            //SetUpButtonForLoggedOutUser();
                            //Login.SetUpSiteForLoggedOutUser(1);
                            ClearSessionDetails();
                        });
                    };
                }
            } //end else of  if (HomePagecheck) {

            var button2 = document.getElementById('fb-auth2');
            if (button2) {
                button2.innerHTML = 'Logout';

                //if (isFaceBookSession != "True") {
                if (getPlatform() != 4) {  //dont show logout links if the user isplaying the game in the facebook canvas!!!
                    $('.fb-auth').show();
                }
                else {
                    $('.fb-auth').hide();
                }

                if (LogInMethod == 2) {
                    //user logged in via email - so the logout click does not reference facebook!
                    button2.onclick = function () {
                        SetUpButtonForLoggedOutUser();
                        //Login.SetUpSiteForLoggedOutUser(1);
                        ClearSessionDetails();
                    };

                    $('#' + NewDisplayMode + '_registration_btn').hide(); //hide the prompt to log in via email
                }
                else {
                    //the user logged in via facebook
                    button2.onclick = function () {
                        FB.logout(function (response) {
                            SetUpButtonForLoggedOutUser();
                            //Login.SetUpSiteForLoggedOutUser(1);
                            ClearSessionDetails();
                        });
                    };
                }
            } //end fb-auth2 button

            var thisUser;
            if (userInfo) {
                //use the object returned to us from facebook
                thisUser = userInfo;
            }
            else {
                try
                {
                    thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                }
                catch (ex) {}
            }

            if (thisUser) {
                //we have user details SO ..we can display these
                $('.username').html(thisUser.name);

                var fbLogin = document.getElementById('fbLogin');
                if (fbLogin) {
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


    function SetUpButtonForLoggedOutUser() {
        // if (isFaceBookSession != "True") { //dont allow email login if the user is in the facebook canvas!!!

        if (getPlatform() != 4) {  //dont allow email login if the user is in the facebook canvas!!!
            $('#' + NewDisplayMode + '_registration_btn').show(); //show the prompt to log in via email
        }
        else {
            $('#' + NewDisplayMode + '_registration_btn').hide();
        }

        if (LoginDetailsLoaded == 1) //the elements we are going to reference have been loaded so we can continue!!!
        {
            var HomePagecheck = $('#TestlayoutSpan').html();//document.getElementById('TestlayoutSpan'); //changed this to use 'layout' instead of 'homeSpan' - we dont want to limit this check to only the home page - using a span on the layout page means we can use this logic on all pages that use the layout page!!!
            if (HomePagecheck) {
                //make logout button invisible (cos we ARE logged out!!!!)
                var LogoutButton = document.getElementById('logout');
                if (LogoutButton) {
                    LogoutButton.innerHTML = '';
                    $('.logout').hide();
                }
            } //end homePage logic
        }
        userisLoggedIn = 0;

    }

    function goHome() {
        window.location.href = location.protocol + '//' + location.host + "/"; // "/Start"
    }


    //this function gets called by facebook - telling us (via the response object) if the user is logged in via facebook
    function FaceBookCheckLoginResponse(response, info) {
        if (response.authResponse) {
            if (alreadyDoneLogInFlow == 0) {
                alreadyDoneLogInFlow = 1;
                DoFlowForFacebookLoggedInUser(response, info);
            }
        }
        else {
            ///the user doesn't have the app installed or they aren't logged in - either way = what we need is to prompt the user to click the fb login button
            $('#signUp').show();
            $('#fbLogin').hide();
            SetUpSiteForLoggedOutUser(1); //clear details and redirect to home page(if on the fixture page)
            SetUpButtonForLoggedOutUser();
            CheckForFacebookRequests(0);// calling this function here - but dont redirect to fixture as we dont know the user yet
        }
    }


    function DoFlowForFacebookLoggedInUser(response, info) {
        //user is already logged in and connected

        var ua = navigator.userAgent.toLowerCase();
        logError("UserAgent", ua);

        accessToken = response.authResponse.accessToken;
        var user;

        try {
            //put this in try/catch as it will throw an error on certain android devices if we try to reference something from session storage that hasn't been set
            user = JSON.parse(window.sessionStorage.getItem("facebookuser"));   //user = window.sessionStorage.getItem("facebookuser");
        }
        catch (ex) {
            user = null;
            //logError("DoFlowForFacebookLoggedInUser", ex);
        }

        SetUpButtonForLoggedInUser(info);

        var weHavetheusersDetails = 0;
        if ((user) && (user.id > 0)) {
            weHavetheusersDetails = 1;
        }

        if (weHavetheusersDetails == 0) {
            //the user is logged in and connected with facebook - however we do not have the user details locally - so get them!!!

            //if the user has just logged in - redirect them to the game page - we can get all their detailsd there
            //there is no point doing all this logic on the home page and then redircting
            if ((typeof (loginFixtureID) != 'undefined' && loginFixtureID != null) && (loginFixtureID > 0) && (LoginClick == 1)) {
                //user has just logged in - so drop them on the current T5 Live Game (if we know the fixture to drop them on [loginFixtureID] ) -no point just updating the home page - there's nothing on that page!!
                window.location.href = location.protocol + '//' + location.host + "/Game/?f=" + loginFixtureID;
            }
            else {
                var tempUser = new User(info);
                LogFacebookUserIntoLiveGames(tempUser); //update DB that this user has logged in (or if the users first time - then add them to the DB)
            }
        }
        else {

            //the user is logged in and connected with facebook AND we have their details locally
            $('.flipwarning').show();
            
            if (homepagefixtureid) {
                //this is the home page - so populate tracker for this user
                DoHomePageLoadLogic();
            }

            var requestFixtureID = GetRequestParam("f");
            SetUpMainMenuLink();

            if (requestFixtureID > 0) {
                //we are on the game page - load relevant details
                if (alreadycalledGameDetails == 0) { //no need calling this twice on the page load
                    DoGamePageLoadLogic();
                }
                GetFriends();
            }
            else {
                if (al != -1) {
                    $('.playnow').show(); //show playNow button - which when a user is logged out will prompt them to login via facebook
                }
            }

            CheckIfAdminAndIfSoSetUpAdminDetails(user);
            getCurrencyDetails();
            CheckForFacebookRequests(1); //check to see if the user has arrived on our site from a facebook notification  //if we do have a fb request - then delete it and drop user on approriate fixture
        }
    }

    function LogFacebookUserIntoLiveGames(thisUser) {
        try {
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

                    try {
                        window.sessionStorage.setItem("facebookuser", $.toJSON(response)); //now that we have logged user in DB - stick in local storage
                        window.sessionStorage.setItem("lim", 1); //lim = log in method 1 = fb , 2 = email

                        //the user IS logged in - so when they click PlayLink they will be directed striaght to the game page
                       
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

                                GetFriends();
                                CheckIfAdminAndIfSoSetUpAdminDetails(response);
                            }
                            else {
                                //we are on home page 
                                CheckIfAdminAndIfSoSetUpAdminDetails(response);

                                if (homepagefixtureid) {
                                    //this is the home page - so populate tracker for this user
                                    DoHomePageLoadLogic();
                                }

                                getCurrencyDetails();
                                SetUpMainMenuLink();

                                CheckForFacebookRequests(1); //check to see if the user has arrived on our site from a facebook notification  //if we do have a fb request - then delete it and drop user on approriate fixture
                                if (al != -1) {
                                    $('.playnow').show(); //show playNow button - which when a user is logged out will prompt them to login via facebook
                                }
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

    //this calls the server to clear the session details on the server side
    function SetUpSiteForLoggedOutUser(redirect)
    {
        alreadyDoneLogInFlow = 0; //reset this so the next time we DO call the fb login api
        alreadycalledGameDetails = 0 //reset this

        try
        {
            window.sessionStorage.removeItem("facebookuser");
        } catch (ex) { }

        try {
            window.sessionStorage.removeItem("facebookuser");
        } catch (ex) { }
        
        
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

    //this function is used after a user tries to get to the game page - i.e. href="/Game/?f=10"
    //if the user is not logged in we don't allow them to go to the page and instead we show them the facebook login
    //if they log in via facebook we then drop them on the relevant game page
    function CheckIfLoggedIn(gotoFixtureID) {
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
    }


    function DoFaceBookLogin() {
        //first - when a user has clicked this - we need to set a variable to show that the user has logged in 
        //otherwise we won't know if a user has just arrived on our site and we have "remembered" them (via facebook)
        //or they have actually clicke the log-in button.
        //When they click log-in we try to redirect them to the appropriate T5LiveGame fixture (ie. the game that we are linking to from the home page)
        LoginClick = 1;
        alreadyDoneLogInFlow = 0;


        if ((IOSversion > 0)) //&& (isChrome == 1)
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
            var permissionUrl = "https://m.facebook.com/dialog/oauth?client_id=" + fbid + "&response_type=code&redirect_uri=" + encodeURIComponent(redirectlocation) + "&scope=email"; //removed publish_stream on 30-Aug - as facebook recommended that we should not being asking for this permission on login and we use it to write to fb homepage after a league invite but this does not seem to be working anymore??!?!
            window.location = permissionUrl;
            return;
        }
        else {
            //for everyone else - do normal login!!!!
            FB.login(function (response) {
                if (response.authResponse) {
                    FB.api('/me', function (info) {
                        FaceBookCheckLoginResponse(response, info);
                    });
                }
            },
            { scope: 'email' }); //status_update,,publish_stream ?? removed these as we want to request as few permissions as possible from the user //removed publish_stream on 30-Aug - as facebook recommended that we should not being asking for this permission on login and we use it to write to fb homepage after a league invite but this does not seem to be working anymore??!?!
        }
    }

    //this function gets called whenever a user actually clicks logout - the above function logout gets called whenever a user IS logged out
    function ClearSessionDetails() {

        try {
            localStorage.removeItem("rm"); //remove remember me value
        } catch (ex) { }

        try {
            $.ajax({
                url: WS_URL_ROOT + "/Login/Logout",
                type: "POST",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("Logout", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                }
            });
        } catch (ex) { }

        SetUpButtonForLoggedOutUser();
        SetUpSiteForLoggedOutUser(1);
    }

    function CheckIfUserIsEmailUser()
    {

        var thisUser;
        try {
            thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        } catch (ex) { }



        var emailConfirmation = GetRequestParam("ec");
        var rememberMeGUID;
        try {
            rememberMeGUID = localStorage.getItem("rm"); //get remember me value
        } catch (ex) { }


        if (
            (thisUser) && (thisUser.id > 0)
        ) {
            ////user is already logged in 
            //if (GetCurrentfixtureID() > 0) {
            //    //this is the game page!!! load the game details!!!
            //    if (alreadycalledGameDetails == 0) { //no need calling this twice on the page load
            //        DoGamePageLoadLogic();
            //    }
            //}
            //else if ((homepagefixtureid)) {
            //    //this is the hoempage - 
            //}
            var v = 1;
        }
        else { //user is NOT logged in - so do email checks

            //if (rememberMeGUID) {
            //    //user clicked Remember Me
            //    CallLoginAPI("", "", 0, rememberMeGUID);
            //} //end  if (rememberMeGUID) {
            //else
            if (emailConfirmation) {
                //this user IS returning to the site to confirm their email address
                DoConfirmEmailFlow(emailConfirmation);
            } //end  if (emailConfirmation) {
        }
    } //end checkif email user


    function CallLoginAPI(email, pass, RememberMe, RememberMeGuid, goToFixtureID) {
        $.ajax({
            url: WS_URL_ROOT + "/Login/EmailLogin",
            type: "POST",
            data: { e: email, p: pass, r: RememberMe, rmg: RememberMeGuid },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                AjaxFail("EmailLogin", XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (response) {
                if ((response.id > 0)) {
                    //user signed in - now redirect to the game page!!!

                    window.sessionStorage.setItem("facebookuser", $.toJSON(response)); //now that we have logged user in DB - stick in local storage
                    window.sessionStorage.setItem("lim", 2); //lim = log in method 1 = fb , 2 = email

                    if (RememberMeGuid) {
                        //we have just logged in via the users REmemberMe GUID 

                        //the below 3 lines are acopy of what we do in fb.js when a user is logged in via email - which is what this scenarion is
                        userisLoggedIn = 1;
                        SetUpButtonForLoggedInUser();
                        SetUpMainMenuLink();

                        CheckIfAdminAndIfSoSetUpAdminDetails(user);
                    }
                    else {
                        //the user has just logged in via logging in with their username/pass
                        if ((RememberMe == 1) && (response.rm)) {
                            //user wants us to remember his login
                            localStorage.setItem("rm", response.rm);
                        }
                        //they've logged in - so send them to the game page!!!
                        window.location.href = location.protocol + '//' + location.host + "/Game/?f=" + goToFixtureID;
                    }
                }
                else {

                    if (RememberMeGuid) {
                        //we attempted to log a user in via their guid - but the log in was unsuccessfull
                        DoSetUpForLoggedOUtUser();

                        if (homepagefixtureid) {
                            //this is the home page - so populate tracker
                            DoHomePageLoadLogic();
                        }
                    }
                    else {
                        //uncuccessfull login attempt via usernmae/pass
                        if (response.id == -102) {
                            $('#' + NewDisplayMode + '_logindetails').html("Error during login : " + response);
                        }
                        else {
                            $('#' + NewDisplayMode + '_logindetails').html("Invalid details!");
                        }
                    }
                }
            }
        });
    }


    //this function gets called at the bottom of the layout pages
    // Only do this this function here cos we cant do it until the fb-auth button has been loaded on page 
    function FaceBookElementsLoaded() {
        LoginDetailsLoaded = 1; //this tell the displayButton functions that we can reference them

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
        }
    }

    function DoSetUpForLoggedOUtUser() {
        //user is either not connected to your app or is logged out - what we need is to prompt the user to click the fb login button
        $('#signUp').show();
        $('#fbLogin').hide();

        if (al != -1) {
            $('.playnow').show(); //show playNow button - which when a user is logged out will prompt them to login via facebook
        }

        $('#' + NewDisplayMode + '_registration_btn').show(); //show the prompt to log in via email

        SetUpSiteForLoggedOutUser(1); //clear details and redirect to home page(if on the fixture page)
        SetUpButtonForLoggedOutUser();
        CheckForFacebookRequests(0); // calling this function here - but dont redirect to fixture as we dont know the user yet
    }


    function Login(goToFixtureID) {

        try {

            var email = $('#' + NewDisplayMode + '_email_login').val();
            var pass = $('#' + NewDisplayMode + '_pass_login').val();
            var RememberMe = 0;
            var RememberMeGuid = ""; //always empty when a user logs in with username/pass

            if ($('#' + NewDisplayMode + '_rm').attr('checked')) {
                RememberMe = 1;
            }

            if ((!pass) || (!email)) {
                $('#' + NewDisplayMode + '_logindetails').html("You must enter all details!");
            }
            else if (email.indexOf("@") < 1) {
                $('#' + NewDisplayMode + '_logindetails').html("Invalid email!");
            }
            else {
                    CallLoginAPI(email, pass, RememberMe, RememberMeGuid, goToFixtureID);
            }
        } catch (ex) { }

    }//end Login




    function DoConfirmEmailFlow(emailConfirmation)
    {
        $.ajax({
            url: WS_URL_ROOT + "/Login/CEmail",
            type: "POST",
            data: { ch: emailConfirmation },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                AjaxFail("CEmail", XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (response) {
                //if this was a success the response will be a userobject - we will then store this user object and call DoHomePageLoadLogic()
                if ((response) && (response.id > 0)) {
                    window.sessionStorage.setItem("facebookuser", $.toJSON(response)); //now that we have logged user in DB - stick in local storage
                    window.sessionStorage.setItem("lim", 2); //lim = log in method 1 = fb , 2 = email
                        
                    if (homepagefixtureid) {
                        //DoHomePageLoadLogic(); //this is the home page - so populate tracker for this user
                        window.location.href = location.protocol + '//' + location.host + "/Game/?f=" + homepagefixtureid;
                    }
                    else if (GetCurrentfixtureID() > 0)
                    {
                        //we are on the game page!!
                        if (alreadycalledGameDetails == 0) { //no need calling this twice on the page load
                            DoGamePageLoadLogic();
                        }
                    }
                }
            }
        });
    } //end DoConfirmEmailFlow

    function ChangePassword() {

        try {

            var oldpass = $('#' + NewDisplayMode + '_oldpass').val();
            var newpass = $('#' + NewDisplayMode + '_newpass').val();
            
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            if ((!oldpass) || (!newpass)) {
                $('#' + NewDisplayMode + '_cpresult').html("<strong>You must enter both old password and new password</strong>");
            }
            else {

                $.ajax({
                    url: WS_URL_ROOT + "/Login/ChangePassword",
                    type: "POST",
                    data: { op: oldpass, np: newpass, u: thisUser.id, fu: thisUser.fbuserid },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("ChangePassword", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {
                        if ((response == 1) ) {
                            $('#' + NewDisplayMode + '_cpresult').html("<strong>Password updated!!!!</strong>");
                        }
                        else if (response == -3) {
                            $('#' + NewDisplayMode + '_cpresult').html("Old password not correct!");
                        }
                        else {
                            $('#' + NewDisplayMode + '_cpresult').html("Error during registration : " + response);
                        }
                    }
                });
            }
        } catch (ex) { }

    }//end Register

    function Register() {
        
        try{

            var username = $('#' + NewDisplayMode + '_username').val();
            var pass1 = $('#' + NewDisplayMode + '_pass1').val();
            var pass2 = $('#' + NewDisplayMode + '_pass2').val();
            var email = $('#' + NewDisplayMode + '_email').val();

            if ((!pass2) || (!pass1) || (!username) | (!email)) {
                $('#' + NewDisplayMode + '_registerdetails').html("You must enter all details!");
            } 
            else if (email.indexOf("@") < 1) {
                $('#' + NewDisplayMode + '_registerdetails').html("Invalid email!");
            }
            else if (pass2 != pass1) {
                $('#' + NewDisplayMode + '_registerdetails').html("Passwords do not match!");
            }
            else {

                    $.ajax({
                        url: WS_URL_ROOT + "/Login/REmail",
                        type: "POST",
                        data: { e: email, p: pass1, u: username },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("REmail", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response)
                        {
                            if ( (response == 1) || (response == -103) ) {
                                //users email was registered - confirmation email sent out
                                //$('#' + displaymode + 'emaildetails').html("Confirmation email sent out!");

                                $('#' + NewDisplayMode + '_register').hide();
                                $('#' + NewDisplayMode + '_confirm').fadeIn();
                            }
                            else if (response == -106) {
                                $('#' + NewDisplayMode + '_registerdetails').html("You already have a livegames account linked to this email address - login instead!!!!");
                            }
                            else if (response == -102) {
                                $('#' + NewDisplayMode + '_registerdetails').html("Try another username!");
                            }
                            else if (response == -101) {
                                $('#' + NewDisplayMode + '_registerdetails').html("This email is already in the system!!!");
                            }
                            else if (response == -104) {
                                $('#' + NewDisplayMode + '_registerdetails').html("Error generating the confirmation email URL!!!");
                            }
                            else if (response == -105) {
                                $('#' + NewDisplayMode + '_registerdetails').html("Error sending the confirmation email URL!!!");
                            }
                            else  {
                                $('#' + NewDisplayMode + '_registerdetails').html("Error during registration : " + response);
                            }
                        }
                    });
            }
        } catch (ex) { }

    }//end Register

    function ResendPassword() {

        try {

            var email = $('#' + NewDisplayMode + '_rsemail').val();

            if (!email) {
                $('#' + NewDisplayMode + '_resenddetails').html("You must enter your email address!");
            }
            else if (email.indexOf("@") < 1) {
                $('#' + NewDisplayMode + '_resenddetails').html("Invalid email!");
            }
            else {

                $.ajax({
                    url: WS_URL_ROOT + "/Login/ResendPassword",
                    type: "POST",
                    data: { e: email},
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("ResendPassword", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {
                        if ((response > 0)) {
                            //users password was sent to email address
                            $('#' + NewDisplayMode + '_forgotpass').hide();
                            $('#' + NewDisplayMode + '_passResent').fadeIn();
                            $('#' + NewDisplayMode + '_registerdetails').html("Password sent - check your inbox!!");
                        }
                        else if (response == -102) {
                            $('#' + NewDisplayMode + '_resenddetails').html("Email does not have a login!");
                        }

                        else if (response == -105) {
                            $('#' + NewDisplayMode + '_resenddetails').html("Error sending email.");
                        }
                        else 
                            $('#' + NewDisplayMode + '_resenddetails').html("Password not sent! " + response);
                    }
                });
            }
        } catch (ex) { }

    }//end ResendPassword


    return {
        Register: Register,
        DoEmailLoginChecks: DoEmailLoginChecks,
        Login: Login,
        SetUpSiteForLoggedOutUser: SetUpSiteForLoggedOutUser,
        CallLoginAPI: CallLoginAPI,
        DoLoginFlow: DoLoginFlow,
        ClearSessionDetails: ClearSessionDetails,
        FaceBookCheckLoginResponse: FaceBookCheckLoginResponse,
        DoFlowForFacebookLoggedInUser: DoFlowForFacebookLoggedInUser,
        CheckIfLoggedIn: CheckIfLoggedIn,
        FaceBookElementsLoaded: FaceBookElementsLoaded,
        ResendPassword: ResendPassword,
        ChangePassword: ChangePassword,
        goHome: goHome
    };

}() //end Login object


/*
if (Login.UserPreviouslyLoggedInViaEmail > 0)
{
    //this user previoulsy logged in with email/password and we have stored their user object (they clicked remember me)
}

localStorage.setItem("predicted2ndHalfFrees", requestFixtureID + "_" + Prediction);
*/
