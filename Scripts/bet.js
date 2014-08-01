//new bet constructor - added stephen 27-Sep-11
//Bet Object Constructor
var value1 = -1;
var value2 = -1;

function Bet(eventid, fixtureID, amount, userid) { //, odds
    this.betid = 0;
    this.eventid = eventid;
    this.eventdesc = null;
    this.fixtureid = fixtureID;
    this.amount = amount;
    this.odds = 0.0;
    this.newodds = null;
    this.userid = userid;
    this.user = null;
    this.betdescription = null;
    this.betresult = null;
    this.creditsremaining = null;
    this.status = 0 // initially set to pending
    this.betcomplete = false;
    this.creditsearned = 0; //winnings from a bet
    this.newcredits = false;  //users new credits total (previous credits + winnings)
    this.eventtime = null; // new Date();
    this.numattempts = 0;
    this.addamount = 0; //this property tells us if we  need to add the amount bet to the credits earned when displaying the new total (after a win)
    this.incorrectEventID = null;
    this.incorrectOdds = null;
   // this.friendsleaderboardlist = null;
   // this.leagueleaderboardlist = null;
    this.leagueid = 0;
    this.unlockcredits = 0;
    
    //Added Stephen 23-Mar-12
    this.numbetsplaced = 0;
    this.numbetstounlockhigherlevel = 0;
}

//FixtureBet is used to return details of all a fixtures pregame and mid game bets
//function FixtureBet() 
//{
//    this.fbid = 0;
//    this.d = null; //description
//    this.o = null; //array of options for this bet - check FixtureBetOptions below 'options
//    this.bm = 0; //has the user made a choice already for this bet (betmade)
//    this.bs = -101; // ' 0 = pending,1 = bet won , -1 = bet lost (betstatus)
//    this.pg = 0; //is this pregame or postgame (pregame)
//    this.open = 0; //is the bet still available for making a bet [if the bet is pregame and the match has started then you can't make a bet so this value will be 0]
//    this.pb = 0; //tells us whether we should place this bet or not (placebet)
//    this.f = 0; //(fixtureid)
//    this.u = 0; //userid
//    this.fbuserid = null;
//    this.userscreditsforthisgame = -999999;
//    this.value1 = -1;  //we use this value for taking in the users predictions for a pre game bet
//    this.value2 = -1;  //we use this value for taking in the users predictions for a pre game bet
//    this.sd; //added this stephen 27-july - this holds the description of the what the user selected 
//}


//we no longer want to post up all the details ina ab et object when a user places a bet as it is too much data ( too much unneccessary data)
//so..we are going to use this new object to only pass up the data we need to send!!!!
//function FixtureBet_short() {
//    this.fbid = 0;
//    this.description = null;
//    this.options = null; //array of options for this bet - check FixtureBetOptions below
//    this.betmade = 0; //has the user made a choice already for this bet
//    this.betstatus = -101; // ' 0 = pending,1 = bet won , -1 = bet lost
//    this.pregame = 0; //is this pregame or postgame
//    this.open = 0; //is the bet still available for making a bet [if the bet is pregame and the match has started then you can't make a bet so this value will be 0]
//    this.placebet = 0; //tells us whether we should place this bet or not
//    this.fixtureid = 0;
//    this.userid = 0;
//    this.fbuserid = null;
//    this.userscreditsforthisgame = -999999;
//    this.value1 = -1;  //we use this value for taking in the users predictions for a pre game bet
//    this.value2 = -1;  //we use this value for taking in the users predictions for a pre game bet
//    this.sd; //added this stephen 27-july - this holds the description of the what the user selected 
//}


//function FixtureBetOptions() {
//    this.oid = 0; //id of bet option/choice for this bet
//    this.soid = 0; //the id of what the user selected
//    //this.userid = 0; 
//    this.d = null;
//    this.o = 0.0;
//    this.uo = 0.0;
//    this.a = 0;
//    this.w = 0;
//    this.s = 0;
//    //this.fixtureid = 0;
//}


//function FixtureBetOptions() {
//    this.optionid = 0; //id of bet option/choice for this bet
//    this.soid = 0; //the id of what the user selected
//    //this.userid = 0; 
//    this.description = null;
//    this.odds = 0.0;
//    this.uo = 0.0;
//    this.amount = 0;
//    this.winnings = 0;
//    this.status = 0;
//    //this.fixtureid = 0;
//}

function pregamecalculate(fbid) {

    var errorMessage;
    var fixtureid = GetCurrentfixtureID();

    //get the value(s) the user input
    switch (fbid) {
        case 3:  //HT Score

            value1 = $('#betoption3').val(); //home score
            value2 = $('#betoption4').val(); //away score
            if ((!isNaN(value1) && !isNaN(value2) && value1 >= 0 && value2 >= 0) && ((value1) && (value2))) {
                //do nothing
            }
            else {
                errorMessage = "You must enter a valid half time score!!";
            }
            break;     //end of  case 3:  //HT Score
        case 4:  //FT Score

            value1 = $('#betoption5').val(); //home score
            value2 = $('#betoption6').val(); //away score
            if ((!isNaN(value1) && !isNaN(value2) && value1 >= 0 && value2 >= 0) && ( (value1)  && (value2)) ) {
                //do nothing
            }
            else {
                errorMessage = "You must enter a valid full time score!!";
            }
            break;     //end of  case 4:  //FT Score
        case 5:  //first half frees

            value1 = $('#betoption7').val();

            if ((!isNaN(value1) && value1 >= 0) && (value1) ) {
                //do nothing
            }
            else {
                errorMessage = "You must enter a valid number!!";
            }
            break;     //end of  case 5:  //first half frees
        case 6:  //second half frees

            value1 = $('#betoption8').val();

            if ((!isNaN(value1) && value1 >= 0) && (value1)) {
                //do nothing
            }
            else {
                errorMessage = "You must enter a valid number!!";
            }
            break;     //end of  case 6:  //second half frees
        case 7:  //first half throws

            value1 = $('#betoption9').val();

            if ((!isNaN(value1) && value1 >= 0) && (value1)) {
                //do nothing
            }
            else {
                errorMessage = "You must enter a valid number!!";
            }
            break;     //end of  case 7:  //second half throws
        case 8:  //second half throws

            value1 = $('#betoption10').val();

            if ((!isNaN(value1) && value1 >= 0) && (value1)) {
                //do nothing
            }
            else {
                errorMessage = "You must enter a valid number!!";
            }
            break;     //end of  case 8:  //second half throws
    } //end of switch

    if (!errorMessage) {
        //getPreGamePotentialWinnings(fbid, fixtureid, value1, value2);
        var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        $.ajax({
            url: WS_URL_ROOT + "/Game/CalculatePreGame",
            type: "POST",
            data: "fbid=" + fbid + "&userid=" + user.id + "&fixtureid=" + fixtureid + "&v1=" + value1 + "&v2=" + value2,
            dataType: "html",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                AjaxFail("pregamecalculate", XMLHttpRequest, textStatus, errorThrown);

                //if we have failed to join the league we need to output an error and stop showing the loading gif!!!
            },
            success: function (response) {
                if (response > 0) {
                    $('#calc' + fbid).html("If correct you will win <strong>" + response + "</strong> Credits!!");
                }
                else {
                    $('#calc' + fbid).html("Error calculating potential winnings.");
                }
            }
        });
    }
    else {
        $('#calc' + fbid).html(errorMessage);
    }
}

function placePreGameBets() {
    // - loop through all the bet objects
    // - find the bet's that havn't been placed yet
    // - for each of these unplaced bets....
    // - check to see if the user has selected any bet option and if they have selected any credits for this bet option
    try {
        var pregameBets;
        try {
            pregameBets = JSON.parse(window.sessionStorage.getItem("pregamebets"));
        } catch (TempEx) { }

        var requestFixtureID = GetRequestParam("f");
        var betsMadeBefore = 0;
        PreGamesBetsToPlace = 0; //reset this value before we place our bets
        numPreGamesBetsJustPlaced = 0; //reset this value before we place our bets
        if (pregameBets) {
            for (var i = 0; i < pregameBets.length; i++) {
                var thisBet = pregameBets[i];
                if (thisBet.bm == 0) {
                    //user hasn't placed a bet for this particular bet yet...so check to see if they have now!!!!
                    //back to radio buttons - john

                    if (thisBet.fbid == 1 || thisBet.fbid == 9) {
                        //if in here than the pregame bet in question is either first team to score (1) or first player to score (9)
                        //both of these pregame bets are the type that allow a user to select their choice as opposed to entering it in input boxes
                        var selection = parseInt($('input:radio[name=bet' + thisBet.fbid + ']:checked').val());

                        if (selection > 0) {
                            //the user has made a bet for this bet option!!!

                            //now loop through the bet options and update the correct option before we update the DB
                            for (var j = 0; j < thisBet.o.length; j++) {
                                var thisBetOption = thisBet.o[j];
                                if (thisBetOption.oid == selection) {
                                    //we have the correct bet option
                                    thisBetOption.soid = selection;
                                    PreGamesBetsToPlace = PreGamesBetsToPlace +  1;
                                    thisBet.pb = 1; //place this Bet!!!

                                    placePreGameBet(thisBet.fbid, thisBetOption.soid, -1, -1);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        //if in here then the pregame bet in question is the type that the user inputs their selection into an input box!!!
                        //we need to look for each specific bet here

                        switch (thisBet.fbid) {
                            case 3:  //HT Score 

                                value1 = $('#betoption3').val(); //home score
                                value2 = $('#betoption4').val(); //away score
                                if ((!isNaN(value1) && !isNaN(value2) && value1 >= 0 && value2 >= 0) && ((value1) && (value2))) {
                                    //user has entered both values - so place this bet!!!!!
                                    thisBet.pb = 1; //place this Bet!!!
                                    thisBet.v1 = value1;
                                    thisBet.v2 = value2;
                                    PreGamesBetsToPlace = PreGamesBetsToPlace + 1;
                                    placePreGameBet(thisBet.fbid, -1, value1, value2);
                                }
                                break;     //end of  case 3:  //HT Score
                            case 4:  //FT Score

                                value1 = $('#betoption5').val(); //home score
                                value2 = $('#betoption6').val(); //away score
                                if ((!isNaN(value1) && !isNaN(value2) && value1 >= 0 && value2 >= 0) && ((value1) && (value2))) {
                                    //user has entered both values - so place this bet!!!!!
                                    thisBet.pb = 1; //place this Bet!!!
                                    thisBet.v1 = value1;
                                    thisBet.v2 = value2;
                                    PreGamesBetsToPlace = PreGamesBetsToPlace + 1;
                                    placePreGameBet(thisBet.fbid, -1, value1, value2);
                                }
                                break;     //end of  case 4:  //FT Score
                            case 5:  //first half frees
                                value1 = $('#betoption7').val();

                                if ((!isNaN(value1) && value1 >= 0) && (value1)) {
                                    //user has entered a valid value - so place this bet!!!!!
                                    thisBet.pb = 1; //place this Bet!!!
                                    thisBet.v1 = value1;
                                    PreGamesBetsToPlace = PreGamesBetsToPlace + 1;
                                    placePreGameBet(thisBet.fbid, -1, value1, value2);
                                }                                
                                break;     //end of  case 5:  //first half frees
                            case 6:  //second half frees

                                value1 = $('#betoption8').val();

                                if ((!isNaN(value1) && value1 >= 0) && (value1)) {
                                    //user has entered a valid value - so place this bet!!!!!
                                    thisBet.pb = 1; //place this Bet!!!
                                    thisBet.v1 = value1;
                                    PreGamesBetsToPlace = PreGamesBetsToPlace + 1;
                                    placePreGameBet(thisBet.fbid, -1, value1, value2);
                                }                               
                                break;     //end of  case 6:  //second half frees
                            case 7:  //first half throws

                                value1 = $('#betoption9').val();

                                if ((!isNaN(value1) && value1 >= 0) && (value1)) {
                                    //user has entered a valid value - so place this bet!!!!!
                                    thisBet.pb = 1; //place this Bet!!!
                                    thisBet.v1 = value1;
                                    PreGamesBetsToPlace = PreGamesBetsToPlace + 1;
                                    placePreGameBet(thisBet.fbid, -1, value1, value2);
                                }
                                
                                break;     //end of  case 7:  //second half throws
                            case 8:  //second half throws

                                value1 = $('#betoption10').val();

                                if ((!isNaN(value1) && value1 >= 0) && (value1)) {
                                    //user has entered a valid value - so place this bet!!!!!
                                    thisBet.pb = 1; //place this Bet!!!
                                    thisBet.v1 = value1;
                                    PreGamesBetsToPlace = PreGamesBetsToPlace + 1;
                                    placePreGameBet(thisBet.fbid, -1, value1, value2);
                                }
                                break;     //end of  case 8:  //second half throws
                        } //end of switch
                    }
                }
                else {
                    betsMadeBefore = betsMadeBefore + 1;
                }
            }

//            if (PreGamesBetsToPlace > 0) {
//                $('.pregameclick').hide(); //don't allow the user to click the "PreGame bets" link while we are placing pregame bets
//                //bets have been made .. so update session storage
//                window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets));

//                //the user HAS placed a new preGame bet..so update DB
//                $.ajax({
//                    url: WS_URL_ROOT + "/Game/PlacePreGameBets",

//                    data: JSON.stringify(pregameBets),
//                    dataType: "json",
//                    contentType: "application/json: charset=utf-8",
//                    type: "POST",
//                    error: function (XMLHttpRequest, textStatus, errorThrown) {
//                        AjaxFail("placePreGameBets", XMLHttpRequest, textStatus, errorThrown);
//                    },
//                    success: function (response) {
//                        if (response) {
//                            PreGameBetsPlaced(response, betsMadeBefore);
//                        } 
//                    }
//                 });
//            }


        }
    }
    catch (ex) {
        logError("placePreGameBets", ex);
    }
    $('.pregame-betpanel').hide();
}


function placePreGameBet(fbid, fboid, value1, value2) 
{
    var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
    $('.pregameclick').hide();

//    $.ajax({
//        url: WS_URL_ROOT + "/Game/PlacePreGameBet",

//        //data: "u=" + user.id + "&fbid=" + fbid + "&fboid=" + fboid + "&value1=" + value1 + "&value2=" + value2 + "&f=" + GetCurrentfixtureID() + "&fu=" + user.fbuserid,
//        data: "u=" + user.id + "&fu=" + user.fbuserid,
//        type: "POST",
//        error: function (XMLHttpRequest, textStatus, errorThrown) {
//            AjaxFail("placePreGameBets", XMLHttpRequest, textStatus, errorThrown);
//        },
//        success: function (response) {
//            if ((response) && (response > 0)) {
//                numPreGamesBetsJustPlaced = numPreGamesBetsJustPlaced + 1;
//                if (numPreGamesBetsJustPlaced == PreGamesBetsToPlace) {
//                    //we have now placed all the bets
//                    $('.pregameclick').show();

//                    if (numPreGamesBetsJustPlaced == 1) {
//                        $('.GameFeedInfo').prepend("<b class='bettext'>1 Pre-Game Prediction was placed!!</b><br />");
//                    }
//                    else {
//                        $('.GameFeedInfo').prepend("<b class='bettext'>" + numPreGamesBetsJustPlaced + " Pre-Game Predictions were placed!!</b><br />");
//                    }
//                }
//            }
//        }
    //    });


    $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/PlacePreGameBet",
                        type: "POST",
                        data: "u=" + user.id + "&fbid=" + fbid + "&fboid=" + fboid + "&value1=" + value1 + "&value2=" + value2 + "&f=" + GetCurrentfixtureID() + "&fu=" + user.fbuserid,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("GetSteveItems", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            if ((response) && (response > 0)) {
                                numPreGamesBetsJustPlaced = numPreGamesBetsJustPlaced + 1;
                                if (numPreGamesBetsJustPlaced == PreGamesBetsToPlace) {
                                    //we have now placed all the bets
                                    $('.pregameclick').show();

                                    if (numPreGamesBetsJustPlaced == 1) {
                                        $('.GameFeedInfo').prepend("<b class='bettext'>1 Pre-Game Prediction was placed!!</b><br />");
                                    }
                                    else {
                                        $('.GameFeedInfo').prepend("<b class='bettext'>" + numPreGamesBetsJustPlaced + " Pre-Game Predictions were placed!!</b><br />");
                                    }

                                    var currentpregames = parseInt($('.numPregame').html());
                                    var newpregames = currentpregames + numPreGamesBetsJustPlaced;
                                    $('.numPregame').html(newpregames);

                                    GetPreGameBetDetails(true, true); //removed this = Stephen 24-Sep-11 - what is the 
                                }
                            }

                        }
                    }
            );






}


//Old way - removed stephen 24-july
//function placePreGameBets() 
//{
//    // - loop through all the bet objects
//    // - find the bet's that havn't been placed yet
//    // - for each of these unplaced bets....
//    // - check to see if the user has selected any bet option and if they have selected any credits for this bet option
//    try 
//    {
//        var pregameBets = JSON.parse(window.sessionStorage.getItem("pregamebets"));
//        var requestFixtureID = GetRequestParam("f");
//        var betsMadeBefore = 0;
//        var newBetplaced = 0;
//        if (pregameBets) {
//            for (var i = 0; i < pregameBets.length; i++) {
//                var thisBet = pregameBets[i];
//                if (thisBet.bm == 0) {
//                    //user hasn't placed a bet for this particular bet yet...so check to see if they have now!!!!
//                    //back to radio buttons - john
//                    var selection = parseInt($('input:radio[name=bet' + thisBet.fbid + ']:checked').val());
//                    //var selection = parseInt($("#betoptionselect" + thisBet.fbid).val());
//                    //user no longer picks credit amount, potential winnings calculated with odds x 100 credits
//                    var creditsplaced = "100";  //parseInt($("#betselect" + thisBet.fbid).val());

//                    if ((selection > 0) && (creditsplaced > 0)) {
//                        //the user has made a bet for this bet option!!!

//                        //now loop through the bet options and update the correct option before we update the DB
//                        for (var j = 0; j < thisBet.o.length; j++) {
//                            var thisBetOption = thisBet.o[j];
//                            if (thisBetOption.optionid == selection) {
//                                //we have the correct bet option
//                                thisBetOption.soid = selection;
//                                thisBetOption.a = creditsplaced;
//                                //thisBetOption.fixtureid = requestFixtureID; //can also get this value from the 
//                                thisBetOption.o = CastToDecimal(thisBetOption.o);
//                                newBetplaced = 1;
//                                thisBet.pb = 1; //place this Bet!!!
//                                break;
//                            }
//                        }
//                    }
//                }
//                else {
//                    betsMadeBefore = betsMadeBefore + 1;
//                }
//            }

//            if (newBetplaced == 1) {
//                $('.pregameclick').hide(); //don't allow the user to click the "PreGame bets" link while we are placing pregame bets
//                //bets have been made .. so update session storage
//                window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets)); 

//                //the user HAS placed a new preGame bet..so update DB
//                $.ajax({
//                    url: WS_URL_ROOT + "/Game/PlacePreGameBets",

//                    data: JSON.stringify(pregameBets),
//                    dataType: "json",
//                    contentType: "application/json: charset=utf-8",
//                    type: "POST",
//                    error: function (XMLHttpRequest, textStatus, errorThrown) {
//                        AjaxFail("placePreGameBets", XMLHttpRequest, textStatus, errorThrown);
//                    },
//                    success: function (response) {
//                        if (response) {
//                            PreGameBetsPlaced(response, betsMadeBefore);
//                        } 
//                    }
//                });
//            }
//        }
//    }
//    catch (ex) {
//        logError("placePreGameBets", ex);
//    }
//    $('.pregame-betpanel').hide();

//}

function PreGameBetsPlaced(response,betsMadeBefore) 
{
      try
      {
        var pregameBets = response;
        var totalcreditsjustplaced = 0;
          
        var betsMadeAfter = 0;
        if ((pregameBets) && (pregameBets.length > 0)) {
            window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets)); //update session storage with 100% correct details from DB
            
            //No longer deduct credits from user's total amount
            //try {
            //    totalcreditsjustplaced = pregameBets[0].totalcreditsjustbet;
            //    if (totalcreditsjustplaced > 0) {
            //       var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            //        uiUser.credits = uiUser.credits - totalcreditsjustplaced;
            //        window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
            //        $('.credits').html(uiUser.credits);
            //        var userscreditsforthisgame = pregameBets[0].userscreditsforthisgame;
            //        if (userscreditsforthisgame != -999999) 
            //        {
            //            NotifyFriendsOfNewBalanceForThisGame(thisFixture.fixtureid, uiUser.fbuserid, userscreditsforthisgame);
            //       }
            //    }
            //now try to update the friends leaderboard and the overall leaderboard
            //    DisplayFriendsLeaderBoard(pregameBets[0].friendsleaderboardlist); //now that we have made a bet - update the friends leaderboard list
            //    UpdateLeaderboard(pregameBets[0].leagueleaderboardlist, pregameBets[0].leagueid); //now that we have made a bet - update the overall leaderboard too
            //}
            //catch (ex){ }

            var requestFixtureID = GetRequestParam("f");
            for (var i = 0; i < pregameBets.length; i++)
            {
                var thisBet = pregameBets[i];
                if (thisBet.bm == true) 
                {
                    betsMadeAfter = betsMadeAfter + 1;

                    var Prediction = "";
                    for (var j = 0; j < thisBet.o.length; j++) 
                    {
                        var thisBetOption = thisBet.o[j];

                        if (thisBetOption.soid > 0) 
                        {
                            Prediction = thisBetOption.d;
                            break;
                        }
                    }

                    //store the users predicted number of frees/throws - so we can then display these values whenever we receive an event for them
                    if (thisBet.fbid == 5)  //firstHalf FRees
                    {
                        localStorage.setItem("predictedFirstHalfFrees", requestFixtureID + "_" + Prediction);
                    }
                    else if (thisBet.fbid == 6)  //2ndHalf FRees
                    {
                        localStorage.setItem("predicted2ndHalfFrees", requestFixtureID + "_" + Prediction);
                    }
                    if (thisBet.fbid == 7)  //firstHalf Throws
                    {
                        localStorage.setItem("predictedFirstHalfThrows", requestFixtureID + "_" + Prediction);
                    }
                    else if (thisBet.fbid == 8)  //2ndHalf Throws
                    {
                        localStorage.setItem("predicted2ndHalfThrows", requestFixtureID + "_" + Prediction);
                    }
                }
            }

            var BetsPlaced = parseInt(betsMadeAfter) - parseInt(betsMadeBefore);
            if (BetsPlaced > 0) {

                if (BetsPlaced == 1) {
                    $('.GameFeedInfo').prepend("<b class='bettext'>" + BetsPlaced + " Pre-Game Prediction was placed!!</b><br />");
                    _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameBetPlaced']);
                }
                else {
                    $('.GameFeedInfo').prepend("<b class='bettext'>" + BetsPlaced + " Pre-Game Predictions were placed!!</b><br />");

                    for (var i = 0; i < BetsPlaced; i++) 
                    {
                        _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameBetPlaced']);
                    }
                }

                $('.numPregame').html(betsMadeAfter);
                refreshScroller(GameFeedScroller, "GameFeedInfo");
            }

        }

       

        $('.pregameclick').show(); // allow the user to click the "PreGame bets" link again
    }
    catch (ex) 
    {
        logError("PreGameBetsPlaced", ex);
    }
}

//onclick='pregamecalculate(" + thisBet.fbid + "," + GetCurrentfixtureID() + ");

function ShowPreGameBets_mobile(pregameBets) {
    try {
        //first up clear all the $('#calc' + fbid) spans!!!!!
        for (var v = 1; v < 10; v++) {
            $('#calc' + v).html("");
        }

        //var BetHTML = "<div id='featured'>";
        var BetHTML = "<div class='pregameslides'>";
        //previous and next buttons
        BetHTML = BetHTML + "<div id='shownext_1' onClick='shownextbet(1);return false;' class='next button-alt'>Next Prediction <strong>&#8250;</strong></div>";
        BetHTML = BetHTML + "<div id='showprev_1' class='prev button-alt' style='display:none;'><strong>&#8249;</strong> Prev Prediction</div>";

        //loop through each betoption returned and write the appropriate HTML
        for (var i = 0; i < pregameBets.length; i++) {
            var thisBet = pregameBets[i];

            var betnumber = i + 1;

            //show first bet by default
            if (betnumber == 1) {

                BetHTML = BetHTML + "<div class='content' id='" + displaymode + "_pregamebet_" + betnumber + "' style='display:block;'>";

            } else {

                BetHTML = BetHTML + "<div class='content' id='" + displaymode + "_pregamebet_" + betnumber + "' style='display:none;'>";

            }
            BetHTML = BetHTML + "<span class='betindicator'>" + betnumber + " of " + pregameBets.length + "</span><div>" //id='pregamescroll" + i + "'
            BetHTML = BetHTML + "<div class='pregame-bets'>";
            
            if ((thisBet.fbid == 9) && (thisBet.bm == 0) && (thisBet.open == true)) { //first goal scorer
                BetHTML = BetHTML + "<div class='bet-title'>" + thisBet.d + "<br /><small><i>Click player image to make your selection!</i></small></div>";
            }
            else if ((thisBet.fbid == 1) && (thisBet.bm == 0) && (thisBet.open == true)) { //first team to score
                BetHTML = BetHTML + "<div class='bet-title'>" + thisBet.d + "<br /><small><i>Click team image to make your selection!</i></small></div>";
            }
            else {
                BetHTML = BetHTML + "<div class='bet-title'>" + thisBet.d + "</div>";
            }

            if (thisBet.bm == 0) {
                if (thisBet.open == true) {
                    //this bet has not been made - display all posible bet options

                    BetHTML = BetHTML + "<div class='option3' id='b" + betnumber + "'>";

                    switch (thisBet.fbid) {

                        //first team to score
                        case 1:
                            var divcount = 1;
                            for (var j = 0; j < thisBet.o.length; j++) {
                                var thisBetOption = thisBet.o[j];

                                BetHTML = BetHTML + "<div class='betselection club' id='selection_" + divcount + "'><input type='radio' name='bet" + thisBet.fbid + "' id='betoptionselect_c" + thisBetOption.oid + "' value='" + thisBetOption.oid + "' name='betoptionselect" + thisBetOption.oid + "' class='betdesc'>";

                                if ((thisBetOption.oid == 1) && (thisFixture.homecrest)) {
                                    //home team 
                                    //we DO have an image linked to the HOME TEAM = so ..use it
                                    var cresturl;
                                    if (thisFixture.homecrest.indexOf("http://") > -1) {
                                        //this crest is pointing to the full url
                                        cresturl = thisFixture.homecrest;
                                    }
                                    else {
                                        cresturl = "/images/crests/" + thisFixture.homecrest;
                                    }
                                    BetHTML = BetHTML + "<label for='betoptionselect_c" + thisBetOption.oid + "' onClick=\"$('#betoptionselect_c" + thisBetOption.oid + "').attr('checked', 'checked');\"><img src='" + cresturl + "' alt='" + thisBetOption.d + "' /></label>";

                                }
                                else if ((thisBetOption.oid == 2) && (thisFixture.awaycrest)) {
                                    //away team 
                                    var cresturl;
                                    if (thisFixture.awaycrest.indexOf("http://") > -1) {
                                        //this crest is pointing to the full url
                                        cresturl = thisFixture.awaycrest;
                                    }
                                    else {
                                        cresturl = "/images/crests/" + thisFixture.awaycrest;
                                    }
                                    BetHTML = BetHTML + "<label for='betoptionselect_c" + thisBetOption.oid + "' onClick=\"$('#betoptionselect_c" + thisBetOption.oid + "').attr('checked', 'checked');\"><img src='" + cresturl + "' alt='" + thisBetOption.d + "' /></label>";
                                }
                                else {
                                    //we DONT have an image linked to this 
                                    BetHTML = BetHTML + "<label for='betoptionselect_c" + thisBetOption.oid + "' onClick=\"$('#betoptionselect_c" + thisBetOption.oid + "').attr('checked', 'checked');\">" + thisBetOption.d + "</label>";
                                }

                                BetHTML = BetHTML + "<span class='betwinnings'>WIN " + thisBetOption.pw + "</span></div>";
                                divcount = divcount + 1;
                            }
                            break;

                            //first player to score - not sure on ID
                        case 9:
                            var divcount = 1;
                            for (var j = 0; j < thisBet.o.length; j++) {
                                var thisBetOption = thisBet.o[j];

                                BetHTML = BetHTML + "<div class='betselection scorer' id='selection_" + divcount + "'><input type='radio' name='bet" + thisBet.fbid + "' id='betoptionselect" + thisBetOption.oid + "' value='" + thisBetOption.oid + "' name='betoptionselect" + thisBetOption.oid + "' class='betdesc'>";

                                if (thisBetOption.i) {
                                    //BetHTML = BetHTML + "<label for='betoptionselect" + thisBetOption.oid + "' onClick=\"$('#betoptionselect" + thisBetOption.oid + "').attr('checked', 'checked');\"><img src='/images/players/" + thisBetOption.i + "' alt='" + thisBetOption.d + "' /></label><span class='playerselection'>" + thisBetOption.d + "</span>";
                                    //we now take the entire image url from the DB!!!
                                    BetHTML = BetHTML + "<label for='betoptionselect" + thisBetOption.oid + "' onClick=\"$('#betoptionselect" + thisBetOption.oid + "').attr('checked', 'checked');\"><img src='" + thisBetOption.i + "' alt='" + thisBetOption.d + "' /></label><span class='playerselection'>" + thisBetOption.d + "</span>";
                                }
                                else {
                                    BetHTML = BetHTML + "<label for='betoptionselect" + thisBetOption.oid + "' onClick=\"$('#betoptionselect" + thisBetOption.oid + "').attr('checked', 'checked');\">" + thisBetOption.d + "</label>";
                                }

                                BetHTML = BetHTML + "<span class='betwinnings'>WIN " + thisBetOption.pw + "</span></div>";
                                divcount = divcount + 1;
                            }
                            break;

                            //HT Score
                        case 3:
                            BetHTML = BetHTML + thisFixture.hometeam + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + thisFixture.awayteam + "<br/><input type='number' min='0' name='homescrore2' id='betoption3' size='10' class='pregameinput' />  -  <input type='number' min='0' name='awayscrore2' id='betoption4' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;

                            //FT Score
                        case 4:
                            BetHTML = BetHTML + thisFixture.hometeam + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + thisFixture.awayteam + "<br/><input type='number' min='0' name='homescrore3' id='betoption5' size='10' class='pregameinput' />  -  <input type='number' min='0' name='awayscrore3' id='betoption6' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;

                            //freekicks 1st half
                        case 5:
                            BetHTML = BetHTML + "<input type='number' min='0' name='free' id='betoption7' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;

                            //freekicks 2nd half
                        case 6:
                            BetHTML = BetHTML + "<input type='number' min='0' name='free' id='betoption8' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;

                            //throws 1st half
                        case 7:
                            BetHTML = BetHTML + "<input type='number' min='0' name='throw' id='betoption9' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;

                            //throws 2nd half
                        case 8:
                            BetHTML = BetHTML + "<input type='number' name='throw' id='betoption10' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;

                    }

                    BetHTML = BetHTML + "</div>";
                    BetHTML = BetHTML + "<div class='spacer'></div><br clear='all' />";

                }
                else {
                    //this bet can no longer be placed - usually due to the game having started!!!
                    BetHTML = BetHTML + "<div class='pregame-betmade'>Sorry, the game has kicked off, you can no longer make a pre-game prediction.</div>";
                }

            }
            else {
                //this bet has been made - show user what they have bet on 

                if ((thisBet.fbid == 9) || (thisBet.fbid == 1)) { //first goal scorer or first team to score
                    $('#click' + thisBet.fbid).hide();//hide the  text that says click image
                }


                //loop through available options for this bet and find the option the user selected
                for (var j = 0; j < thisBet.o.length; j++) {
                    var thisBetOption = thisBet.o[j];
                    if (thisBetOption.soid == thisBetOption.oid) { //(thisBetOption.soid > 0) 
                        //the user has selected this option
                        //var potentialWinnings = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + thisBetOption.a;
                        var potentialWinnings = parseInt(thisBetOption.pw);
                        BetHTML = BetHTML + "<div class='pregame-betmade'>You Predicted that the result would be <br /> <span class='pregame-betmade-desc'>" + thisBetOption.sd + "</span>";

                        if (thisBetOption.s == 0) {
                            BetHTML = BetHTML + "<br /><strong>You stand to win " + potentialWinnings + " credits, Good Luck!</strong>";
                        }
                        else if (thisBetOption.s == 1) {
                            BetHTML = BetHTML + "<br /><strong>Congratulations, You won " + thisBetOption.pw + " credits!</strong>";
                        }
                        else if (thisBetOption.s == -1) {
                            BetHTML = BetHTML + "<br /><strong>Hard luck, Your Prediction was incorrect!</strong>";
                        }

                        BetHTML = BetHTML + "</div>"; //end pregame-selected
                        break; //we have found users selection - exit this for loop!
                    }
                }
            }
            BetHTML = BetHTML + "<div id='next'>&#9654;</div><div id='prev'>&#9664;</div><div id='betnum'></div></div>"; //end pregame-bets
            BetHTML = BetHTML + "</div>"; //end pregame scroll div
            BetHTML = BetHTML + "</div>"; //end content div

            //now add the scrollerName to the listOfPreGameBetScrollerNames which we will need to update later
            //listOfPreGameBetScrollerNames.push("pregamescroll" + i);
        }
        BetHTML = BetHTML + "</div>"; //end featured div

        $('#' + displaymode + '_BetHTML').html(BetHTML); //set the bet HTML

        $('.pregame-betpanel').show();

        //create carousel for bet options
        setupcarousel_mobile(1);
        
    }
    catch (ex) {
        logError("ShowPreGameBets", ex);
    }
}


function ShowPreGameBets_web(pregameBets) 
{
    try {
        //first up clear all the $('#calc' + fbid) spans!!!!!
        for (var v = 1; v < 10; v++) {
            $('#calc' + v).html("");
        } 

        //var BetHTML = "<div id='featured'>";
        var BetHTML = "<div class='pregameslides'>";
        //previous and next buttons
        //BetHTML = BetHTML + "<div id='shownext_1' onClick='shownextbet(1);return false;' class='next button-alt'>Next Prediction <strong>&#8250;</strong></div>";
        //BetHTML = BetHTML + "<div id='showprev_1' class='prev button-alt' style='display:none;'><strong>&#8249;</strong> Prev Prediction</div>";

        //loop through each betoption returned and write the appropriate HTML
        for (var i = 0; i < pregameBets.length; i++) {
            var thisBet = pregameBets[i];

            var betnumber = i + 1;

            //show first bet by default
            if (betnumber == 1) {

                BetHTML = BetHTML + "<div class='content' id='" + displaymode + "_pregamebet_" + betnumber + "' style='display:block;'>";

            } else {

                BetHTML = BetHTML + "<div class='content' id='" + displaymode + "_pregamebet_" + betnumber + "' style='display:block;'>";

            }
            //BetHTML = BetHTML + "<span class='betindicator'>" + betnumber + " of " + pregameBets.length + "</span><div>" //id='pregamescroll" + i + "'
            BetHTML = BetHTML + "<div>" //id='pregamescroll" + i + "'
            BetHTML = BetHTML + "<div class='pregame-bets'>";


            if ((thisBet.fbid == 9) && (thisBet.bm == 0) && (thisBet.open == true)) { //first goal scorer
                BetHTML = BetHTML + "<div class='bet-title'>" + thisBet.d + "<br /><small><i>Click player image to make your selection!</i></small></div>";
            }
            else if ((thisBet.fbid == 1) && (thisBet.bm == 0) && (thisBet.open == true)) { //first team to score
                BetHTML = BetHTML + "<div class='bet-title'>" + thisBet.d + "<br /><small><i>Click team image to make your selection!</i></small></div>";
                }
            else {
                BetHTML = BetHTML + "<div class='bet-title'>" + thisBet.d + "</div>";
            }
            

            if (thisBet.bm == 0) {
                if (thisBet.open == true) {
                    //this bet has not been made - display all posible bet options

                    BetHTML = BetHTML + "<div class='option3' id='b" + betnumber + "'>";

                    switch (thisBet.fbid) {

                        //first team to score
                        case 1:
                            var divcount = 1;
                            for (var j = 0; j < thisBet.o.length; j++) {
                                var thisBetOption = thisBet.o[j];

                                BetHTML = BetHTML + "<div class='betselection club' id='selection_" + divcount + "'><input type='radio' name='bet" + thisBet.fbid + "' id='betoptionselect_c" + thisBetOption.oid + "' value='" + thisBetOption.oid + "' class='betdesc'>";

                                if ((thisBetOption.oid == 1) && (thisFixture.homecrest)) {
                                    //home team 
                                    //we DO have an image linked to the HOME TEAM = so ..use it
                                    var cresturl;
                                    if (thisFixture.homecrest.indexOf("http://") > -1) {
                                        //this crest is pointing to the full url
                                        cresturl = thisFixture.homecrest;
                                    }
                                    else {
                                        cresturl = "/images/crests/" + thisFixture.homecrest;
                                    }
                                    BetHTML = BetHTML + "<label for='betoptionselect_c" + thisBetOption.oid + "' onClick=\"$('#betoptionselect_c" + thisBetOption.oid + "').attr('checked', 'checked');\"><img src='" + cresturl + "' alt='" + thisBetOption.d + "' /></label>";

                                }
                                else if ((thisBetOption.oid == 2) && (thisFixture.awaycrest)) {
                                    //away team 
                                    var cresturl;
                                    if (thisFixture.awaycrest.indexOf("http://") > -1) {
                                        //this crest is pointing to the full url
                                        cresturl = thisFixture.awaycrest;
                                    }
                                    else {
                                        cresturl = "/images/crests/" + thisFixture.awaycrest;
                                    }
                                    BetHTML = BetHTML + "<label for='betoptionselect_c" + thisBetOption.oid + "' onClick=\"$('#betoptionselect_c" + thisBetOption.oid + "').attr('checked', 'checked');\"><img src='" + cresturl + "' alt='" + thisBetOption.d + "' /></label>";
                                }
                                else {
                                    //we DONT have an image linked to this 
                                    BetHTML = BetHTML + "<label for='betoptionselect_c" + thisBetOption.oid + "' onClick=\"$('#betoptionselect_c" + thisBetOption.oid + "').attr('checked', 'checked');\">" + thisBetOption.d + "</label>";
                                }

                                BetHTML = BetHTML + "<span class='betwinnings'>WIN " + thisBetOption.pw + "</span></div>";
                                divcount = divcount + 1;
                            }
                            break;

                        //first player to score - not sure on ID
                        case 9:
                            var divcount = 1;
                            for (var j = 0; j < thisBet.o.length; j++) {
                                var thisBetOption = thisBet.o[j];

                                BetHTML = BetHTML + "<div class='betselection scorer' id='selection_" + divcount + "'><input type='radio' name='bet" + thisBet.fbid + "' id='betoptionselect" + thisBetOption.oid + "' value='" + thisBetOption.oid + "' name='betoptionselect" + thisBetOption.oid + "' class='betdesc'>";

                                if (thisBetOption.i) 
                                {
                                    //BetHTML = BetHTML + "<label for='betoptionselect" + thisBetOption.oid + "' onClick=\"$('#betoptionselect" + thisBetOption.oid + "').attr('checked', 'checked');\"><img src='/images/players/" + thisBetOption.i + "' alt='" + thisBetOption.d + "' /></label><span class='playerselection'>" + thisBetOption.d + "</span>";
                                    //we now take the entire image url from the DB!!!
                                    BetHTML = BetHTML + "<label for='betoptionselect" + thisBetOption.oid + "' onClick=\"$('#betoptionselect" + thisBetOption.oid + "').attr('checked', 'checked');\"><img src='" + thisBetOption.i + "' alt='" + thisBetOption.d + "' /></label><span class='playerselection'>" + thisBetOption.d + "</span>";
                                }
                                else 
                                {
                                    BetHTML = BetHTML + "<label for='betoptionselect" + thisBetOption.oid + "' onClick=\"$('#betoptionselect" + thisBetOption.oid + "').attr('checked', 'checked');\">" + thisBetOption.d + "</label>";
                                }

                                BetHTML = BetHTML + "<span class='betwinnings'>WIN " + thisBetOption.pw + "</span></div>";
                                divcount = divcount + 1;
                            }
                            break;

                        //HT Score
                        case 3:
                            BetHTML = BetHTML + thisFixture.hometeam + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + thisFixture.awayteam + "<br/><input type='number' min='0' name='homescrore2' id='betoption3' size='10' class='pregameinput' />  -  <input type='number' min='0' name='awayscrore2' id='betoption4' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc"  +  thisBet.fbid + "'></span>";
                            break;
                        
                        //FT Score
                        case 4:
                            BetHTML = BetHTML + thisFixture.hometeam + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + thisFixture.awayteam + "<br/><input type='number' min='0' name='homescrore3' id='betoption5' size='10' class='pregameinput' />  -  <input type='number' min='0' name='awayscrore3' id='betoption6' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;

                        //freekicks 1st half
                        case 5:
                            BetHTML = BetHTML + "<input type='number' min='0' name='free' id='betoption7' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;
                        
                        //freekicks 2nd half
                        case 6:
                            BetHTML = BetHTML + "<input type='number' min='0' name='free' id='betoption8' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;

                        //throws 1st half
                        case 7:
                            BetHTML = BetHTML + "<input type='number' min='0' name='throw' id='betoption9' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;

                        //throws 2nd half
                        case 8:
                            BetHTML = BetHTML + "<input type='number' name='throw' id='betoption10' size='10' class='pregameinput' />";
                            BetHTML = BetHTML + "<span class='calc-button' onclick='pregamecalculate(" + thisBet.fbid + "); return false;'>Calculate winnings</span>";
                            BetHTML = BetHTML + "<span class='calc-winnings' id='calc" + thisBet.fbid + "'></span>";
                            break;

                    }
                    
                    BetHTML = BetHTML + "</div>";
                    BetHTML = BetHTML + "<div class='spacer'></div><br clear='all' />";

                }
                else {
                    //this bet can no longer be placed - usually due to the game having started!!!
                    BetHTML = BetHTML + "<div class='pregame-betmade'>Sorry, the game has kicked off, you can no longer make a pre-game prediction.</div>";
                }

            }
            else {
                //this bet has been made - show user what they have bet on 

                //loop through available options for this bet and find the option the user selected
                for (var j = 0; j < thisBet.o.length; j++) {
                    var thisBetOption = thisBet.o[j];
                    if (thisBetOption.soid == thisBetOption.oid) { //(thisBetOption.soid > 0) 
                        //the user has selected this option
                        //var potentialWinnings = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + thisBetOption.a;
                        var potentialWinnings = parseInt(thisBetOption.pw);
                        BetHTML = BetHTML + "<div class='pregame-betmade'>You Predicted that the result would be <br /> <span class='pregame-betmade-desc'>" + thisBetOption.sd + "</span>";

                        if (thisBetOption.s == 0) {
                            BetHTML = BetHTML + "<br /><strong>You stand to win " + potentialWinnings + " credits, Good Luck!</strong>";
                        }
                        else if (thisBetOption.s == 1) {
                            BetHTML = BetHTML + "<br /><strong>Congratulations, You won " + thisBetOption.pw + " credits!</strong>";
                        }
                        else if (thisBetOption.s == -1) {
                            BetHTML = BetHTML + "<br /><strong>Hard luck, Your Prediction was incorrect!</strong>";
                        }

                        BetHTML = BetHTML + "</div>"; //end pregame-selected
                        break; //we have found users selection - exit this for loop!
                    }
                }
            }
            BetHTML = BetHTML + "<div class='nextbet'>&#9654;</div><div class='prevbet'>&#9664;</div><div class='betnum'></div>"; //end pregame-bets
            BetHTML = BetHTML + "</div></div>"; //end pregame scroll div
            BetHTML = BetHTML + "</div>"; //end content div

            //now add the scrollerName to the listOfPreGameBetScrollerNames which we will need to update later
            //listOfPreGameBetScrollerNames.push("pregamescroll" + i);
        }
        BetHTML = BetHTML + "</div>"; //end featured div

        $('#' + displaymode + '_BetHTML').html(BetHTML); //set the bet HTML

        $('.pregame-betpanel').show();
        
        setupcarousel_web(1);
    }
    catch (ex) {
        logError("ShowPreGameBets", ex);
        console.log(ex);
    }
}

//function NotifyFriendsOfNewBalanceForThisGame(fixtureID, fbuserid, newBalance) {
//    try {

//         //we notify friends on the server side if the LiveEvent is LightStreamer
//         if (LiveEventMethod == "LS") 
//         {
//               $.ajax({
//                    url: WS_URL_ROOT + "/Game/NotifyFriendsOfNewBalance",
//                    type: "POST",
//                    data: "fixtureID=" + fixtureID + "&fbuserid=" + fbuserid + "&newBalance=" + newBalance,
//                    error: function (XMLHttpRequest, textStatus, errorThrown) {
//                        AjaxFail("NotifyFriendsOfNewBalance", XMLHttpRequest, textStatus, errorThrown);
//                    },
//                    success: function (response) {
//                        var v = response;
//                    }
//                });
//         }
//         else if (LiveEventMethod == "SR") 
//         {
//            //Signalr
//            var groupName = "UBD" + uiUser.fbuserid;
//            var updateDetails = "4;" + newBalance;
//            //liveGamesSignalRProxy.processfriendupdates(updateDetails, groupName);
//            liveGamesSignalRProxy.invoke('processfriendupdates', updateDetails, groupName, GetCurrentfixtureID());
//         }
//         else if (LiveEventMethod == "T5P") {
//             //T5P
//             if (UserHasFriendsPlayingThisGame() == 1) {
//                 var groupName = "UBD" + uiUser.fbuserid;
//                 var updateDetails = "4;" + newBalance;

//                 var updateDetailsArray = new Array();
//                 updateDetailsArray.push(updateDetails);
//                 updateDetailsArray.push(uiUser.fbuserid);
//                 updateDetailsArray.push(GetCurrentfixtureID());
//                 T5Pusher.push("processfriendupdates", updateDetailsArray, groupName);

//                 _gaq.push(['_trackEvent', 'T5Pusher', 'NewBalance']);
//             }
//         }
//    }
//    catch (ex) {
//        logError("NotifyFriendsOfNewBalanceForThisGame", ex);
//    }
//}

//this function goes through our list of pregame bets and checks to see if the user has won or lost any
function updatePreGamebets(eventid, HomeScore, AwayScore) 
{
    try 
    {
        CreditsWon = 0;
        checkAndUpdateFirstScoreBets(eventid, HomeScore, AwayScore);
        DoHalfTimebets(eventid, HomeScore, AwayScore);
        DoFullTimebets(eventid, HomeScore, AwayScore);


        //where do we update the leagues and the friends list????? is it below - GetUsersNewBalanceAndNotifyFriends - check this

        if (CreditsWon > 0) {
            //at least one of the users pregame credits has won - so send the users new balance to friends!!!!
            GetUsersNewBalanceAndNotifyFriends(CreditsWon);
        }
    }
    catch (ex) {
        logError("updatePreGamebets", ex);
    }
}

//recap stephen 26-july what weare doing here is updateing our score in the friends scores
//then - sedning our new score to all our friends - who will take this score and update their fiends table
//the socre in the friends table is ALWAYS the players core for the default league linked to the fixture!!!!
//note - we DONT seem to update the league table  for the user playing the game 
//- however we DO update the league table (along with the friends table) for all friends who get the new balance for the user  - so why not update this users league table???
function GetUsersNewBalanceAndNotifyFriends(CreditsWon) {
    var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
    var requestFixtureID = GetRequestParam("f");

    //get the users current score for this game from the friends league table
    //we should look at getting this score from somewhere else
    //we should store it in the fixture object??
    var friendScores;
    try {
       friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
    } catch (TempEx) { }

    if (friendScores) {
        for (var i = 0; i <= friendScores.length - 1; i++) 
        {
            if (friendScores[i].F == uiUser.fbuserid) 
            {
                //we have found the user in the friend list!!!!
                friendScores[i].S = parseInt(friendScores[i].S) + parseInt(CreditsWon);
                window.sessionStorage.setItem("listOfFriendsScores", $.toJSON(friendScores));
                ReOrderFriendsScoresBasedOnCurrentScore();
                NotifyFriendsOfNewBalanceForThisGame(requestFixtureID, uiUser.fbuserid, friendScores[i].S);
                break; // we have found the user - now exit the loop
            }
        }
    }
}

function DoFullTimebets(eventid, HomeScore, AwayScore) {
    if (eventid == 14) {
        //full time
        checkAndUpdateFulltimeScore(eventid, HomeScore, AwayScore);
        checkAndUpdateSecondHalfFreeKicks();
        checkAndUpdateSecondHalfThrows();
    }
}

function checkAndUpdateSecondHalfFreeKicks() {
    try {
        var pregameBets;
        try {
            pregameBets = JSON.parse(window.sessionStorage.getItem("pregamebets"));
        } catch (TempEx) { }

        for (var i = 0; i < pregameBets.length; i++) {
            var thisBet = pregameBets[i];
            if ((thisBet.bm == true) && (thisBet.bs == 0) && (thisBet.fbid == 6)) //thisBet.fbid == 6 means this bet is a bet on the number of second half free kicks
            {
                for (var j = 0; j < thisBet.o.length; j++) {
                    var thisBetOption = thisBet.o[j];

                    if (thisBetOption.soid == thisBetOption.oid) {
                    //if (thisBetOption.soid > 0) {
                        //old way!!!!!
                        /*
                        var positionofDash = thisBetOption.d.indexOf('-');
                        var minFrees = parseInt(thisBetOption.d.substring(0, positionofDash));
                        var maxFrees = parseInt(thisBetOption.d.substring(positionofDash + 1));
                        */
                        if (thisFixture.numfreessecondhalf < 0) { //should never happen but has happened at least once!!
                            thisFixture.numfreessecondhalf = 0;
                        }
                        var numPredictedfrees = thisBetOption.sd;
                        //if ((thisFixture.numfreessecondhalf == minFrees) || (thisFixture.numfreessecondhalf == maxFrees) || ((thisFixture.numfreessecondhalf < maxFrees) && (thisFixture.numfreessecondhalf > minFrees))) {
                        if (numPredictedfrees == thisFixture.numfreessecondhalf) {
                            //the user predicted the corrent number of second Half Free Kicks - this bet wins!!!!
                            thisBet.bs = 1; //bet won
                            thisBetOption.s = 1; //bet won

                            //thisBetOption.w = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + parseInt(thisBetOption.a);
                            thisBetOption.w = parseInt(thisBetOption.pw);

                            $('.GameFeedInfo').prepend("<b class='wintext'>Pre-Game Prediction : " + thisFixture.numfreessecondhalf + " free-kicks in the second half. You win " + thisBetOption.w + " credits!!</b><br />");
                            refreshScroller(GameFeedScroller, "GameFeedInfo");

                            //update users credits
                            var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                            uiUser.credits = uiUser.credits + thisBetOption.w;
                            window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                            $('.credits').html(uiUser.credits);
                            //UpdateFriendScoresWithNewCredit(thisFixture.fixtureid, thisBetOption.soid, thisBetOption.w, uiUser.fbuserid, 1);
                            CreditsWon = CreditsWon + thisBetOption.w;
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameWin', '', parseInt(thisBetOption.w)]);
                        }
                        else {
                            //this bet loses!!!!
                            thisBet.bs = -1; //bet lost
                            thisBetOption.s = -1; //bet lost
                            thisBetOption.w = 0;

                            $('.GameFeedInfo').prepend("<b class='losetext'>Pre-Game Prediction : " + thisFixture.numfreessecondhalf + " free-kicks in the second half. You lose!!!</b><br />"); //" + thisBetOption.a + " credits!!
                            refreshScroller(GameFeedScroller, "GameFeedInfo");
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameLoss', '', parseInt(thisBetOption.a)]);
                        }
                        window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets)); //now update the session storage with the updated list of bets
                        break;
                    }
                }
            }
        }
    }
    catch (ex) {
        logError("checkAndUpdateHalfTimeFreeKicks", ex);
    }
}

function checkAndUpdateSecondHalfThrows() {
    try {
        var pregameBets;
        try {
            pregameBets = JSON.parse(window.sessionStorage.getItem("pregamebets"));
        } catch (TempEx) { }


        for (var i = 0; i < pregameBets.length; i++) {
            var thisBet = pregameBets[i];
            if ((thisBet.bm == true) && (thisBet.bs == 0) && (thisBet.fbid == 8)) //thisBet.fbid == 8 means this bet is a bet on the number of second half free kicks
            {
                for (var j = 0; j < thisBet.o.length; j++) {
                    var thisBetOption = thisBet.o[j];

                    if (thisBetOption.soid == thisBetOption.oid) {
                    //if (thisBetOption.soid > 0) {
                    //    var positionofDash = thisBetOption.d.indexOf('-');
                    //    var minThrows = parseInt(thisBetOption.d.substring(0, positionofDash));
                     //   var maxThrows = parseInt(thisBetOption.d.substring(positionofDash + 1));

                        if (thisFixture.numthrowssecondhalf < 0) { //should never happen but has happened at least once!!
                            thisFixture.numthrowssecondhalf = 0;
                        }

                        var numPredictedthrows = thisBetOption.sd;
                        //if ((thisFixture.numthrowssecondhalf == minThrows) || (thisFixture.numthrowssecondhalf == maxThrows) || ((thisFixture.numthrowssecondhalf < maxThrows) && (thisFixture.numthrowssecondhalf > minThrows))) {
                        if (numPredictedthrows == thisFixture.numthrowssecondhalf) {
                            //the user predicted the corrent number of second Half Free Kicks - this bet wins!!!!
                            thisBet.bs = 1; //bet won
                            thisBetOption.s = 1; //bet won

                            //thisBetOption.w = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + parseInt(thisBetOption.a);
                            thisBetOption.w = parseInt(thisBetOption.pw);

                            $('.GameFeedInfo').prepend("<b class='wintext'>Pre-Game Prediction : " + thisFixture.numthrowssecondhalf + " throws in the second half. You win " + thisBetOption.w + " credits!!</b><br />");
                            refreshScroller(GameFeedScroller, "GameFeedInfo");

                            //update users credits
                            var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                            uiUser.credits = uiUser.credits + thisBetOption.w;
                            window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                            $('.credits').html(uiUser.credits);
                            //UpdateFriendScoresWithNewCredit(thisFixture.fixtureid, thisBetOption.soid, thisBetOption.w, uiUser.fbuserid, 1);
                            CreditsWon = CreditsWon + thisBetOption.w;
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameWin', '', parseInt(thisBetOption.w)]);
                        }
                        else {
                            //this bet loses!!!!
                            thisBet.bs = -1; //bet lost
                            thisBetOption.s = -1; //bet lost
                            thisBetOption.w = 0;

                            $('.GameFeedInfo').prepend("<b class='losetext'>Pre-Game Prediction : " + thisFixture.numthrowssecondhalf + " throws in the second half. You lose!!!</b><br />"); //" + thisBetOption.a + " credits!!
                            refreshScroller(GameFeedScroller, "GameFeedInfo");
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameLoss', '', parseInt(thisBetOption.a)]);
                        }
                        window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets)); //now update the session storage with the updated list of bets
                        break;
                    }
                }
            }
        }
    }
    catch (ex) {
        logError("checkAndUpdateHalfTimeThrows", ex);
    }
}

function checkAndUpdateFulltimeScore(eventid, HomeScore, AwayScore) {
    try {
//        var fullTimeScore;
//        if (thisFixture.firsthalfleftteam == thisFixture.hometeam) {
//            //the home team are playing from left to right this half - which means that HomeScore IS the score of the HomeTEam
//            fullTimeScore = AwayScore + "-" + HomeScore;
//        }
//        else {
//            //the HomeScore variable is the score of the team playinmg from left to right and in this case it is the score of the awayteam
//            fullTimeScore = HomeScore + "-" + AwayScore;
        //        }
        var fullTimeScore = HomeScore + "-" + AwayScore; //no longer switch sides of team names at half-time - 19-Jan-11

        var pregameBets;
        try {
            pregameBets = JSON.parse(window.sessionStorage.getItem("pregamebets"));
        } catch (TempEx) { }
        for (var i = 0; i < pregameBets.length; i++) {
            var thisBet = pregameBets[i];
            if ((thisBet.bm == true) && (thisBet.bs == 0) && (thisBet.fbid == 4)) //thisBet.fbid == 4 means this bet is a bet on the full time score
            {

                for (var j = 0; j < thisBet.o.length; j++) {
                    var thisBetOption = thisBet.o[j];

                    if (thisBetOption.soid == thisBetOption.oid) {
                    //if (thisBetOption.soid > 0) {
                        //the user has bet on this option
                         if (thisBetOption.sd == fullTimeScore) {
                            //the user predicted the corrent halfTime score - this bet wins!!!!
                            thisBet.bs = 1; //bet won
                            thisBetOption.s = 1; //bet won

                            //thisBetOption.w = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + parseInt(thisBetOption.a);
                            thisBetOption.w = parseInt(thisBetOption.pw);

                            $('.GameFeedInfo').prepend("<b class='wintext'>Pre-Game Prediction : Full Time Score is " + fullTimeScore + ". You win " + thisBetOption.w + " credits!!</b><br />");
                            refreshScroller(GameFeedScroller, "GameFeedInfo");

                            //update users credits
                            var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                            uiUser.credits = uiUser.credits + thisBetOption.w;
                            window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                            $('.credits').html(uiUser.credits);
                            //UpdateFriendScoresWithNewCredit(thisFixture.fixtureid,thisBetOption.soid, thisBetOption.w, uiUser.fbuserid, 1);
                            CreditsWon = CreditsWon + thisBetOption.w;
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameWin', '', parseInt(thisBetOption.w)]);
                        }
                        else {
                            //this bet loses!!!!
                            thisBet.bs = -1; //bet lost
                            thisBetOption.s = -1; //bet lost
                            thisBetOption.w = 0;

                            $('.GameFeedInfo').prepend("<b class='losetext'>Pre-Game Prediction : Full Time Score is " + fullTimeScore + ". You lose!!!</b><br />"); //" + thisBetOption.a + " credits!!
                            refreshScroller(GameFeedScroller, "GameFeedInfo");
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameLoss', '', parseInt(thisBetOption.a)]);
                        }
                        window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets)); //now update the session storage with the updated list of bets
                        break;
                    }
                }
            }
        }
    }
    catch (ex) {
        logError("checkAndUpdateFulltimeScore", ex);
    }
}

function DoHalfTimebets(eventid, HomeScore, AwayScore) 
{
    if (eventid == 12) {
        //half time
        checkAndUpdateHalftimeScore(eventid, HomeScore, AwayScore);
        checkAndUpdateHalfTimeFreeKicks();
        checkAndUpdateHalfTimeThrows();
    }
}

function checkAndUpdateHalfTimeFreeKicks() {
    try {
        var pregameBets;
        try {
            pregameBets = JSON.parse(window.sessionStorage.getItem("pregamebets"));
        } catch (TempEx) { }
        for (var i = 0; i < pregameBets.length; i++) {
            var thisBet = pregameBets[i];
            if ((thisBet.bm == true) && (thisBet.bs == 0) && (thisBet.fbid == 5)) //thisBet.fbid == 5 means this bet is a bet on the number of first half free kicks
            {
                for (var j = 0; j < thisBet.o.length; j++) {
                    var thisBetOption = thisBet.o[j];

                    if (thisBetOption.soid == thisBetOption.oid) {
                    //if (thisBetOption.soid > 0) {
                       // var positionofDash = thisBetOption.d.indexOf('-');
                       // var minFrees = parseInt(thisBetOption.d.substring(0, positionofDash));
                       // var maxFrees = parseInt(thisBetOption.d.substring(positionofDash + 1));

                        if (thisFixture.numfreesfirsthalf < 0) { //should never happen but has happened at least once!!
                            thisFixture.numfreesfirsthalf = 0;
                        }

                        var numPredictedfrees = thisBetOption.sd;
                        //if ((thisFixture.numfreesfirsthalf == minFrees) || (thisFixture.numfreesfirsthalf == maxFrees) || ((thisFixture.numfreesfirsthalf < maxFrees) && (thisFixture.numfreesfirsthalf > minFrees))) {
                        if (numPredictedfrees == thisFixture.numfreesfirsthalf) {

                            //the user predicted the corrent number of first Half Free Kicks - this bet wins!!!!
                            thisBet.bs = 1; //bet won
                            thisBetOption.s = 1; //bet won

                            //thisBetOption.w = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + parseInt(thisBetOption.a);
                            thisBetOption.w = thisBetOption.pw;

                            $('.GameFeedInfo').prepend("<b class='wintext'>Pre-Game Prediction : " + thisFixture.numfreesfirsthalf + " free-kicks in the first half. You win " + thisBetOption.w + " credits!!</b><br />");
                            refreshScroller(GameFeedScroller, "GameFeedInfo");

                            //update users credits
                            var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                            uiUser.credits = uiUser.credits + thisBetOption.w;
                            window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                            $('.credits').html(uiUser.credits);
                            //UpdateFriendScoresWithNewCredit(thisFixture.fixtureid, thisBetOption.soid, thisBetOption.w, uiUser.fbuserid, 1);
                            CreditsWon = CreditsWon + thisBetOption.w;
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameWin', '', parseInt(thisBetOption.w)]);
                        }
                        else {
                            //this bet loses!!!!
                            thisBet.bs = -1; //bet lost
                            thisBetOption.s = -1; //bet lost
                            thisBetOption.w = 0;

                            $('.GameFeedInfo').prepend("<b class='losetext'>Pre-Game Prediction : " + thisFixture.numfreesfirsthalf + " free-kicks in the first half. You lose!!!</b><br />"); //" + thisBetOption.a + " credits!!
                            refreshScroller(GameFeedScroller, "GameFeedInfo");
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameLoss', '', parseInt(thisBetOption.a)]);
                        }
                        window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets)); //now update the session storage with the updated list of bets
                        break;
                    }
                }
            }
        }
    }
    catch (ex) {
        logError("checkAndUpdateHalfTimeFreeKicks", ex);
    }
}

//need to complete this!!!!
function checkAndUpdateHalfTimeThrows() {
    try {
        var pregameBets;
        try {
            pregameBets = JSON.parse(window.sessionStorage.getItem("pregamebets"));
        } catch (TempEx) { }
        for (var i = 0; i < pregameBets.length; i++) {
            var thisBet = pregameBets[i];
            if ((thisBet.bm == true) && (thisBet.bs == 0) && (thisBet.fbid == 7)) //thisBet.fbid == 7 means this bet is a bet on the number of first half throws
            {
                for (var j = 0; j < thisBet.o.length; j++) {
                    var thisBetOption = thisBet.o[j];

                   // if (thisBetOption.soid > 0) {
                    if (thisBetOption.soid == thisBetOption.oid) {
                        //var positionofDash = thisBetOption.d.indexOf('-');
                        //var minThrows = parseInt(thisBetOption.d.substring(0, positionofDash));
                        //var maxThrows = parseInt(thisBetOption.d.substring(positionofDash + 1));

                        //if ((thisFixture.numthrowsfirsthalf == minThrows) || (thisFixture.numthrowsfirsthalf == maxThrows) || ((thisFixture.numthrowsfirsthalf < maxThrows) && (thisFixture.numthrowsfirsthalf > minThrows))) {

                        if (thisFixture.numthrowsfirsthalf < 0) { //should never happen but has happened at least once!!
                            thisFixture.numthrowsfirsthalf = 0;
                        }

                        var numPredictedthrows = thisBetOption.sd;
                        //if ((thisFixture.numfreesfirsthalf == minFrees) || (thisFixture.numfreesfirsthalf == maxFrees) || ((thisFixture.numfreesfirsthalf < maxFrees) && (thisFixture.numfreesfirsthalf > minFrees))) {
                        if (numPredictedthrows == thisFixture.numthrowsfirsthalf) {


                            //the user predicted the corrent number of first Half Free Kicks - this bet wins!!!!
                            thisBet.bs = 1; //bet won
                            thisBetOption.s = 1; //bet won

                            //thisBetOption.w = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + parseInt(thisBetOption.a);
                            thisBetOption.w = thisBetOption.pw;

                            $('.GameFeedInfo').prepend("<b class='wintext'>Pre-Game Prediction : " + thisFixture.numthrowsfirsthalf + " throws in the first half. You win " + thisBetOption.w + " credits!!</b><br />");
                            refreshScroller(GameFeedScroller, "GameFeedInfo");

                            //update users credits
                            var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                            uiUser.credits = uiUser.credits + thisBetOption.w;
                            window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                            $('.credits').html(uiUser.credits);
                            CreditsWon = CreditsWon + thisBetOption.w;
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameWin', '', parseInt(thisBetOption.w)]);
                        }
                        else {
                            //this bet loses!!!!
                            thisBet.bs = -1; //bet lost
                            thisBetOption.s = -1; //bet lost
                            thisBetOption.w = 0;

                            $('.GameFeedInfo').prepend("<b class='losetext'>Pre-Game Prediction : " + thisFixture.numthrowsfirsthalf + " throws in the first half. You lose!!!</b><br />"); //" + thisBetOption.a + " credits!!
                            refreshScroller(GameFeedScroller, "GameFeedInfo");
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameLoss', '', parseInt(thisBetOption.a)]);
                        }
                        window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets)); //now update the session storage with the updated list of bets
                        break;
                    }
                }
            }
        }
    }
    catch (ex) {
        logError("checkAndUpdateHalfTimethrows", ex);
    }
}



function checkAndUpdateHalftimeScore(eventid, HomeScore, AwayScore) 
{
    try
    {
//        var halfTimeScore;
//        if (thisFixture.firsthalfleftteam == thisFixture.hometeam) {
//            //the home team are playing from left to right this half - which means that HomeScore IS the score of the HomeTEam
//            halfTimeScore = HomeScore + "-" + AwayScore;
//        }
//        else
//        {
//           //the HomeScore variable is the score of the team playinmg from left to right and in this case it is the score of the awayteam
//            halfTimeScore = AwayScore + "-" + HomeScore;
        //        }
        var halfTimeScore = HomeScore + "-" + AwayScore; //no longer switch sides of team names at half-time - 19-Jan-11

        var pregameBets;
        try {
            pregameBets = JSON.parse(window.sessionStorage.getItem("pregamebets"));
        } catch (TempEx) { }
        for (var i = 0; i < pregameBets.length; i++) 
        {
            var thisBet = pregameBets[i];
            if ((thisBet.bm == true) && (thisBet.bs == 0) && (thisBet.fbid == 3)) //thisBet.fbid == 3 means this bet is a bet on the half time score
            {

                for (var j = 0; j < thisBet.o.length; j++) {
                    var thisBetOption = thisBet.o[j];

                    if (thisBetOption.soid == thisBetOption.oid) 
                    //if (thisBetOption.soid > 0) 
                    {
                        //the user has bet on this option
                        if (thisBetOption.sd == halfTimeScore) {
                            //the user predicted the corrent halfTime score - this bet wins!!!!
                            thisBet.bs = 1; //bet won
                            thisBetOption.s = 1; //bet won

                            //thisBetOption.w = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + parseInt(thisBetOption.a);
                            thisBetOption.w = thisBetOption.pw;

                            $('.GameFeedInfo').prepend("<b class='wintext'>Pre-Game Prediction : Half Time Score is " + halfTimeScore + ". You win " + thisBetOption.w + " credits!!!</b><br />");
                            refreshScroller(GameFeedScroller, "GameFeedInfo");

                            //update users credits
                            var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                            uiUser.credits = uiUser.credits + thisBetOption.w;
                            window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                            $('.credits').html(uiUser.credits);
                            //UpdateFriendScoresWithNewCredit(thisFixture.fixtureid, thisBetOption.soid, thisBetOption.w, uiUser.fbuserid, 1);
                            CreditsWon = CreditsWon + thisBetOption.w;
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameWin', '', parseInt(thisBetOption.w)]);
                        }
                        else 
                        {
                            //this bet loses!!!!
                            thisBet.bs = -1; //bet lost
                            thisBetOption.s = -1; //bet lost
                            thisBetOption.w = 0;

                            $('.GameFeedInfo').prepend("<b class='losetext'>Pre-Game Prediction : Half Time Score is " + halfTimeScore + ". You lose!!!</b><br />"); //" + thisBetOption.a + " credits!!
                            refreshScroller(GameFeedScroller, "GameFeedInfo");
                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameLoss', '', parseInt(thisBetOption.a)]);
                        }
                        window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets)); //now update the session storage with the updated list of bets
                        break;
                    }
                }
            }
        }
    }
    catch (ex) {
        logError("checkAndUpdateHalftimeScore", ex);
    }
   
}

//this function checks to see if the event in question is the first goal in the game
//then it checks to see if the user has bet on this event
//and it updates the regame bet list based on whether the user won or lost
function checkAndUpdateFirstScoreBets(eventid, HomeScore, AwayScore)  
{
    try
    {
        if (((eventid == 6) || (eventid == 4)) && (((HomeScore == 1) && (AwayScore == 0)) || ((HomeScore == 0) && (AwayScore == 1))))
        {
            //this goal is the first goal!!!!!!
            var pregameBets;
            try {
                pregameBets = JSON.parse(window.sessionStorage.getItem("pregamebets"));
            } catch (TempEx) { }
            //now check to see if the user had placed a bet on which team would score first!!!
            for (var i = 0; i < pregameBets.length; i++) {
                var thisBet = pregameBets[i];

                if ((thisBet.bm == true) && (thisBet.bs == 0) && (thisBet.fbid == 1)) //thisBet.fbid == 1 means this bet is a bet on the first team to score
                {
                    //this bet has been made, is pending and IS a bet on which team would score first

                    //now loop through the bet options for this bet to see if the user won or not!!

                    for (var j = 0; j < thisBet.o.length; j++) {
                        var thisBetOption = thisBet.o[j];

                        //if (thisBetOption.soid == 1) 
                        if (thisBetOption.oid == 1) //this thisBetOption is for the HOME team to score first
                        {
                            if (eventid == 6) //and the home team DID score first!!!
                            {
                                if (thisBetOption.soid == 1) //the user bet on the HOME team to score first 
                                {
                                    //this bet WINS!!!!!
                                    thisBet.bs = 1; //bet won
                                    thisBetOption.s = 1; //bet won

                                    //thisBetOption.w = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + parseInt(thisBetOption.a);

                                    //this changed - stephen 26-july
                                    thisBetOption.w = parseInt(thisBetOption.pw);

                                    $('.GameFeedInfo').prepend("<b class='wintext'>Pre-Game Prediction : " + thisBetOption.d + " score first. You win " + thisBetOption.w + " credits!!!</b><br />");
                                    refreshScroller(GameFeedScroller, "GameFeedInfo");

                                    //update users credits
                                    var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                                    uiUser.credits = uiUser.credits + thisBetOption.w;
                                    window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                                    $('.credits').html(uiUser.credits);
                                    //UpdateFriendScoresWithNewCredit(thisFixture.fixtureid, thisBetOption.soid, thisBetOption.w, uiUser.fbuserid, 1);
                                    CreditsWon = CreditsWon + thisBetOption.w;
                                    _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameWin', '', parseInt(thisBetOption.w)]);
                                }
                                else {
                                    //this bet loses!!!!
                                    thisBet.bs = -1; //bet lost
                                    thisBetOption.s = -1; //bet lost
                                    thisBetOption.w = 0;

                                    //$('.GameFeedInfo').prepend("<b class='losetext'>Pre-Game Prediction : " + thisBetOption.d + " don't score first. You lose!!!</b><br />");
                                    $('.GameFeedInfo').prepend("<b class='losetext'>Pre-Game Prediction : " + thisBetOption.d + " score first. You lose!!!</b><br />");
                                    refreshScroller(GameFeedScroller, "GameFeedInfo");
                                    _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameLoss', '', parseInt(thisBetOption.a)]);
                                }
                                break; //we have found an updated the correct bet option for this bet ...so ..stop looping through all the bet options

                            }

                           
                        }
                        else //if (thisBetOption.soid == 2) { //the user bet on the AWAY team to score first 
                            if (thisBetOption.oid == 2)  //tthis thisBetOption is for the AWAY team to score first
                            {

                                if (eventid == 4) //and the away team DID score first!!!
                                {
                                    if (thisBetOption.soid == 2)  //the user bet on the AWAY team to score first 
                                        {
                                            //this bet WINS!!!!!
                                            thisBet.bs = 1; //bet won
                                            thisBetOption.s = 1; //bet won

                                            //thisBetOption.w = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + parseInt(thisBetOption.a);

                                            //this changed - stephen 26-july
                                            thisBetOption.w = parseInt(thisBetOption.pw);

                                            $('.GameFeedInfo').prepend("<b class='wintext'>Pre-Game Prediction : " + thisBetOption.d + " score first. You win " + thisBetOption.w + " credits!!</b><br />");
                                            refreshScroller(GameFeedScroller, "GameFeedInfo");

                                            //update users credits
                                            var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                                            uiUser.credits = uiUser.credits + thisBetOption.w;
                                            window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                                            $('.credits').html(uiUser.credits);
                                            //UpdateFriendScoresWithNewCredit(thisFixture.fixtureid, thisBetOption.soid, thisBetOption.w, uiUser.fbuserid, 1);
                                            CreditsWon = CreditsWon + thisBetOption.w;
                                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameWin', '', parseInt(thisBetOption.w)]);
                                        }
                                        else {
                                            //this bet loses!!!!
                                            thisBet.bs = -1; //bet lost
                                            thisBetOption.s = -1; //bet lost
                                            thisBetOption.w = 0;

                                            //$('.GameFeedInfo').prepend("<b class='losetext'>Pre-Game Prediction : " + thisBetOption.d + " don't score first. You lose!!!</b><br />");
                                            $('.GameFeedInfo').prepend("<b class='losetext'>Pre-Game Prediction : " + thisBetOption.d + " score first. You lose!!!</b><br />");
                                            refreshScroller(GameFeedScroller, "GameFeedInfo");
                                            _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameLoss', '', parseInt(thisBetOption.a)]);
                                        }
                                        break; //we have found an updated the correct bet option for this bet ...so ..stop looping through all the bet options
                                    } // if (thisBetOption.soid == 2) 
                          } // if (thisBetOption.oid == 2)
                    }
                    window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets)); //now update the session storage with the updated list of bets
                }
                
                //////////Now that we know that the first goal has been scored .....check the first goalscorer
                if ((thisBet.bm == true) && (thisBet.bs == 0) && (thisBet.fbid == 9)) //thisBet.fbid == 9 means this bet is a bet on the first team to score
                {
                    //this bet has been made, is pending and IS a bet on which team would score first

                    //now loop through the bet options for this bet to see if the user won or not!!
                    var betcomplete = 0;
                    var usersSelection;
                    for (var j = 0; j < thisBet.o.length; j++) {
                        var thisBetOption = thisBet.o[j];

                        if (!usersSelection) {
                            usersSelection = thisBetOption.sd;
                        }

                        if (thisBetOption.d == LastGoalScorer) //this is the Bet that won - i.e this betoption is the scorer!!!!
                        {

                           // if (thisBetOption.soid > 0) //this is the users bet!!
                           // {
                                if (thisBetOption.sd == LastGoalScorer) //the user bet on the correct goalscorer
                                {
                                    //this bet WINS!!!!!
                                    thisBet.bs = 1; //bet won
                                    thisBetOption.s = 1; //bet won

                                    //thisBetOption.w = (parseInt(thisBetOption.a) * parseInt(thisBetOption.o)) + parseInt(thisBetOption.a);

                                    //this changed - stephen 26-july
                                    thisBetOption.w = parseInt(thisBetOption.pw);

                                    $('.GameFeedInfo').prepend("<b class='wintext'>Pre-Game Prediction : " + LastGoalScorer + " is the first goalscorer. You win " + thisBetOption.w + " credits!!!</b><br />");
                                    refreshScroller(GameFeedScroller, "GameFeedInfo");

                                    //update users credits
                                    var uiUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                                    uiUser.credits = uiUser.credits + thisBetOption.w;
                                    window.sessionStorage.setItem("facebookuser", $.toJSON(uiUser)); //reset the sessionStorage object with the correct credits
                                    $('.credits').html(uiUser.credits);
                                    CreditsWon = CreditsWon + thisBetOption.w;
                                    _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameWin', '', parseInt(thisBetOption.w)]);

                                    betcomplete = 1;
                                    break; //we have found an updated the correct bet option for this bet ...so ..stop looping through all the bet options
                                }
                                else {
                                    //this bet loses!!!!
                                    thisBet.bs = -1; //bet lost
                                    thisBetOption.s = -1; //bet lost
                                    thisBetOption.w = 0;

                                    var BetDescriptionHTMl = "";
                                    if (LastGoalScorer) {
                                        //we know the name of the goalscorer ..so ..use this in the output message
                                        BetDescriptionHTMl = "<b class='losetext'>Pre-Game Prediction : " + LastGoalScorer + "  is the first goalscorer. You lose!!!</b><br />";
                                    }
                                    else {
                                        //we don't have the name of the first goal scorer ..but we do know that the user lost - create generic message
                                        BetDescriptionHTMl = "<b class='losetext'>Pre-Game Prediction : You got first goalscorer wrong. You lose!!!</b><br />";
                                    }

                                    $('.GameFeedInfo').prepend(BetDescriptionHTMl);
                                    refreshScroller(GameFeedScroller, "GameFeedInfo");
                                    _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameLoss', '', parseInt(thisBetOption.a)]);

                                    betcomplete = 1;
                                    break; //we have found an updated the correct bet option for this bet ...so ..stop looping through all the bet options
                                }
                          //  }
                        } // end d = lastgoalscorer
                        } //end for loop

                        if ((!LastGoalScorer) && (betcomplete == 0)) {
                            //the user made a selection - however none of the goalscorers provided to players scored
                            //this means the user lost - but we haven;t told him yet!!!

                            //so ... we need to loop through the list again  - find the bet the user made and then tell then update this bet to have lost!!!!

                            for (var j = 0; j < thisBet.o.length; j++) {
                                var thisBetOption = thisBet.o[j];
                                if (thisBetOption.sd == thisBetOption.d) {  //this is the users selection
                                    //this bet loses!!!!
                                    thisBet.bs = -1; //bet lost
                                    thisBetOption.s = -1; //bet lost
                                    thisBetOption.w = 0;

                                    var BetDescriptionHTMl = "";
                                    if (LastGoalScorer) {
                                        //we know the name of the goalscorer ..so ..use this in the output message
                                        BetDescriptionHTMl = "<b class='losetext'>Pre-Game Prediction : " + LastGoalScorer + "  is the first goalscorer. You lose!!!</b><br />";
                                    }
                                    else {
                                        //we don't have the name of the first goal scorer ..but we do know that the user lost - create generic message
                                        BetDescriptionHTMl = "<b class='losetext'>Pre-Game Prediction : You got first goalscorer wrong. You lose!!!</b><br />";
                                    }

                                    $('.GameFeedInfo').prepend(BetDescriptionHTMl);
                                    refreshScroller(GameFeedScroller, "GameFeedInfo");
                                    _gaq.push(['_trackEvent', 'PreGameBets', 'PreGameLoss', '', parseInt(thisBetOption.a)]);

                                    betcomplete = 1;
                                    break; //we have found an updated the correct bet option for this bet ...so ..stop looping through all the bet options
                                }
                            } //end extra for loop
                        } //end of extra logic if the first goalscorer is not known!!!!
                    window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets)); //now update the session storage with the updated list of bets
                }


                /////////////////////////////////////////////////////////////////////////////////////////////////////////////

            }
        }
    }
    catch (ex) {
        logError("UpdateFirstTeamToScore", ex);
    }
}


function closePreGamepanel() 
{
    $('.pregame-betpanel').hide();
}

function RefreshBetScrollers() 
{
    try 
    {
        //once the HTML has been set we can now initialise the scrollers
        //(we can't initialise them until the div's exist !!!!
        if ((listOfPreGameBetScrollers) && (listOfPreGameBetScrollers.length > 0)) {
            //if this array has items in it - it means that we have already created all the scroller objects
            //so all we need to do here is refresh them!!!!
            for (var i = 0; i < listOfPreGameBetScrollers.length; i++) {
                listOfPreGameBetScrollers[i].refresh();
            }
        }
        else {
            //this is the first time the user has click on the pregamebets link
            //we need to initialise each scroller
            //loop through each pregame bet scroller and refresh it!!
            for (var i = 0; i < listOfPreGameBetScrollerNames.length; i++) {
                var thisScroller = new iScroll(listOfPreGameBetScrollerNames[i], { hScrollbar: false, vScrollbar: false });
                listOfPreGameBetScrollers.push(thisScroller);
                thisScroller.refresh();
            }
        }
    }
    catch (ex) {
        logError("RefreshBetScrollers", ex);
    }
}

function GetPreGameBetDetails(dontdisplay,calledOnPageLoad) {
    //logError("PGBDebug", "pgbclick_0----------------------------------------------------");
    //logError("PGBDebug", "pgbclick_1");
    //reset arrays that hold the names and objects that we use to scroll on the prebet pop-up
    listOfPreGameBetScrollers = new Array();
    listOfPreGameBetScrollerNames = new Array();
    LastPlayerDisplayed = 1;
    LastTeamDisplayed = 1;

    //we dont want to make AJAX calls to populate the leaderboards if we are calling this function on the page load
    //as this is already taken care of!!!
    if (!calledOnPageLoad) {
        //logError("PGBDebug", "pgbclick_2");
        //simultaneously try to update the friends leaderboard and the overall leaderboard
        //- we are trying to use any user interaction to update details that could be out of sync
        if (WeAreCurrentlyShowingLeagueTable() == true) {
            userLeague.UpdateCurrentLeaderboard(1); //the "1" indicates that we dont want to show the loading gif for this update
        }
        if (WeAreCurrentlyShowingFriendsLeagueTable == true) {
            userLeague.GetFriendsLeaderBoard();
        }
    }

    try {
        var requestFixtureID = GetRequestParam("f");

        if (requestFixtureID > 0) {
            //logError("PGBDebug", "pgbclick_3");
            var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if (thisUser) {
                //only get the game details if we know who the user is - user can't play the game anonymously
                //logError("PGBDebug", "pgbclick_4");
                $.ajax({
                    url: WS_URL_ROOT + "/Game/GetFixtureBetDetails",
                    type: "POST",
                    data: "f=" + requestFixtureID + "&u=" + thisUser.id + "&fu=" + thisUser.fbuserid,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        //logError("PGBDebug", "pgbclick_5");
                        AjaxFail("GetGameBetDetails", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {
                        //logError("PGBDebug", "pgbclick_6");
                        var pregameBets = response;
                        if ((pregameBets) && (pregameBets.length > 0)) {
                            //logError("PGBDebug", "pgbclick_7");
                            numofpregamebets = pregameBets.length;
                            window.sessionStorage.setItem("pregamebets", $.toJSON(pregameBets));
                            if (!dontdisplay) {//if dontdisplay is set this means we just want to get the pregame bets from the DB and store them in session storage
                                //logError("PGBDebug", "pgbclick_8");
                                
                                if (displaymode == "m") {
                                    ShowPreGameBets_mobile(pregameBets);
                                }
                                else {
                                    ShowPreGameBets_web(pregameBets);
                                }
                            }

                            var totalPreGameBetsMade = 0;
                            for (var i = 0; i < pregameBets.length; i++) {
                                var thisBet = pregameBets[i];
                                if (thisBet.bm == true) {
                                    totalPreGameBetsMade = totalPreGameBetsMade + 1;
                                }
                            }
                            $('.numPregame').html(totalPreGameBetsMade);
                            //logError("PGBDebug", "pgbclick_9");
//                            try {
//                                //now try to update the friends leaderboard and the overall leaderboard
//                                //- we are trying to use any user interaction with us to update details that could be out of sync
//                                //DisplayFriendsLeaderBoard(pregameBets[0].friendsleaderboardlist); //now that we have made a bet - update the friends leaderboard list
//                                //UpdateLeaderboard(pregameBets[0].leagueleaderboardlist, pregameBets[0].leagueid); //now that we have made a bet - update the overall leaderboard too
//                                
//                            }
//                            catch (ex) { }
                        }
                    }
                });
            }
        }
    }
    catch (ex) {
        //logError("PGBDebug", "pgbclick_10");
        logError("GetGameBetDetails", ex);
    }
}