//////////////////////////////////////////////////////////////////////////////////////////////////////
//work now on populating these items correctly from game start and after updates during game!!!!

//at match start - first thing should be number bets needed to unock 20 - if already unlocked 

//also - if user has not set one click value - remind tem that it exists - if on mobile explain how to get there

//also - note if user has gone to boot room - tell them what they can do there!!!!

//after every event - who is leader - what their points are - what my points are - and then how many points behind i am
//also - dont forget a power play goal wirth 200 credits can win you 12000 points!!!!!

//check what the user hasn;t purchased in the store - remnd them

//friends current bets!!!!!

var powerplayused = 0;
var forfeitsUsed = 0;
var bootroomused = 0;
var lastOverallScoresList;
var lastCountOfUsersInLeague;
var previousLeaderboardDetails = "";
var previousFriendDetails = "";
var previousTickerDetails = "";
var previouscreditLimitTickerDetails = "";

var creditLimit_ticker = ""; //'<li class="news-item">Unlock <strong>200</strong> Credit Limit after 20 predictions</li>';
var storeDetails_ticker = ""; //'<li class="news-item">Use your Powerplay to double you odds for 10 minutes!</li>';
var friendDetails_ticker = ''; //empty initially //<li class="news-item">Your friend Jimbo has predicted a 'Goal' for Liverpool</li>
var Hints_ticker = ""; //' <li class="news-item">Use a forfeit to cancel your Prediction, it will cost you your credits - but could be worth it!!</li>';
var LeagueStandings_ticker = ""; // <li class="news-item">You are 2000 credits from top spot!</li>
var PreGameDetails_ticker = ""; // <li class="news-item">Liverpool have made a substitute. Joe Allen on for Nuri Sahin.</li>

function resetTickerInfo() {
    previousLeaderboardDetails = "";
    previousFriendDetails = "";
}

function SetTickerContent(itemjustupdated,updatedcontent,friendsFirst) {
   var updateTicker = 1;
   var tickerhtml = "";
   if (itemjustupdated == "creditLimit_ticker") {

       if 
       (
           (previouscreditLimitTickerDetails != updatedcontent) 
           ||
           ((previouscreditLimitTickerDetails == "") && (updatedcontent != ""))
       )  //if  we have not set any ticker contetn previously - then update the ticker!!!!
       {
           previouscreditLimitTickerDetails = updatedcontent;
           //the credit limit text has just been updated 
           //so..we want this to appear first in our list of ticking tick thing
           tickerhtml = tickerhtml + updatedcontent;

           //now set the rest of the ticker content
           tickerhtml = tickerhtml + GetStoreDetailsTickerText() + GetFriendsScoresForTicker() + GetHintsTickerText() + GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame() + GetPreGameTickerText();

       }
       else {
           //there is no point upating the tickerhtml as there has been no change to the creditLimit_ticker data  -
           updateTicker = 0;
       }
   }
   else if (itemjustupdated == "connectionWarningDetails_ticker") {
       //the storeDetails_ticker text has just been updated 
       //so..we want this to appear first in our list of ticking tick thing

       tickerhtml = tickerhtml + updatedcontent;

       //now set the rest of the ticker content
       tickerhtml = tickerhtml + GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame() + GetFriendsScoresForTicker() + GetStoreDetailsTickerText() + GetCreditLimitTickerText() + GetHintsTickerText() + GetPreGameTickerText(); //+ GetCreditLimitTickerText()

   }
   else if (itemjustupdated == "storeDetails_ticker") {
       //the storeDetails_ticker text has just been updated 
       //so..we want this to appear first in our list of ticking tick thing
       tickerhtml = tickerhtml + updatedcontent;

       //now set the rest of the ticker content
       tickerhtml = tickerhtml + GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame() + GetFriendsScoresForTicker() + GetCreditLimitTickerText() + GetHintsTickerText() + GetPreGameTickerText(); //+ GetCreditLimitTickerText()

   }
   else if (itemjustupdated == "friendDetails_ticker") {
       //the friendDetails_ticker text has just been updated 
       //so..we want this to appear first in our list of ticking tick thing

       var friendTickerDetails = GetFriendsScoresForTicker();
       if ((previousFriendDetails != friendTickerDetails)  || (previousTickerDetails == "")  )  //if  we have not set any ticker contetn previously - then update the ticker!!!!
       {
            previousFriendDetails = friendTickerDetails;
            //tickerhtml = tickerhtml + friendTickerDetails;

            if (friendsFirst) {
                //now set the rest of the ticker content [put league standings before friends]
                tickerhtml = tickerhtml + friendTickerDetails + GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame() + GetCreditLimitTickerText() + GetStoreDetailsTickerText() + GetHintsTickerText() + GetPreGameTickerText();
            }
            else {
                //now set the rest of the ticker content [put league standings before friends]
                tickerhtml = tickerhtml + GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame() + GetCreditLimitTickerText() + friendTickerDetails + GetStoreDetailsTickerText() + GetHintsTickerText() + GetPreGameTickerText();
            }
       }
       else
       {
           //there is no point upating the tickerhtml as there has been no change to the FriendsScores data  -
           updateTicker = 0;
       }
   }
   else if (itemjustupdated == "Hints_ticker") {
       //the Hints_ticker text has just been updated 
       //so..we want this to appear first in our list of ticking tick thing
       tickerhtml = tickerhtml + updatedcontent;

       //now set the rest of the ticker content
       tickerhtml = tickerhtml + GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame() + GetCreditLimitTickerText() + GetStoreDetailsTickerText() + GetFriendsScoresForTicker() + GetPreGameTickerText();
   }
   else if (itemjustupdated == "LeagueStandings_ticker") {
       //the LeagueStandings_ticker text has just been updated 
       //so..we want this to appear first in our list of ticking tick thing
       if ( (previousLeaderboardDetails != updatedcontent) || (previousTickerDetails == "")  ) { //if  we have not set any ticker contetn previously - then update the ticker!!!!
           previousLeaderboardDetails = updatedcontent;
           tickerhtml = tickerhtml + updatedcontent;

           //now set the rest of the ticker content
           tickerhtml = tickerhtml + GetStoreDetailsTickerText() + GetFriendsScoresForTicker() + GetCreditLimitTickerText() + GetHintsTickerText() + GetPreGameTickerText();
       }
       else {
           //there is no point upating the tickerhtml as there has been no change to the leagueStanding data  -
           updateTicker = 0;
       }
   }
   else if (itemjustupdated == "PreGameDetails_ticker") {
       //the PreGameDetails_ticker text has just been updated 
       //so..we want this to appear first in our list of ticking tick thing
       if (PreGameDetails_ticker != updatedcontent) {
            PreGameDetails_ticker = updatedcontent;
       }
       tickerhtml = tickerhtml + updatedcontent;

       //now set the rest of the ticker content
       tickerhtml = tickerhtml + GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame() + GetCreditLimitTickerText() + GetStoreDetailsTickerText() + GetFriendsScoresForTicker() + GetHintsTickerText();
   }
   else if (!itemjustupdated) {
       //nothing has been updated -so set ticker html as normal
       tickerhtml = + GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame()  + GetCreditLimitTickerText() + GetStoreDetailsTickerText() + GetFriendsScoresForTicker() + GetHintsTickerText() + GetPreGameTickerText();
   }
   if ((updateTicker == 1) && (previousTickerDetails != tickerhtml)) {
       previousTickerDetails = tickerhtml;
       $('#tickerDiv').html('<ul id="js-news" class="js-hidden">' + tickerhtml + '</ul>');
       ResetTicker();
   }
}

//this function returns whatever text we have already stored
function GetPreGameTickerText() {
    if ((thisFixture) && (thisFixture.currenthalf != -101)) {
        return ""; //if the game has started - return nothing for this!!! - i.e no pregame ticker text once the game has started!!!!!
    }
    else {
         //otherwise - return whatever has been set
        return PreGameDetails_ticker;
    }
}

//this function returns the latest DB ticker text for a match from the DB
//this should only be called when the game starts or ends!!!!!
function UpdatePreGameTickerTickerText() {
    var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
    var updateText = 0;

    if ((thisFixture) && (thisFixture.currenthalf == -101)) {
        //the match has not started yet  - so set pregame text
        if (!PreGameDetails_ticker) {
            //if we dont have the Miscellaneous ticker text yet - then set it
            
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
                    if (response) { //only update if there is content
                        if (PreGameDetails_ticker != response) { //only update if content has been updated
                            var listofPreGameTickerSentences = response.split("^");
                            var FormattedpreGameTicketText = ""
                            for (var i = 0; i < listofPreGameTickerSentences.length; i++) {
                                FormattedpreGameTicketText = FormattedpreGameTicketText + "<li class='news-item'>" + listofPreGameTickerSentences[i] + "</li>";
                            }
                            SetTickerContent("PreGameDetails_ticker", FormattedpreGameTicketText)
                        }
                    }
                }
            });
        }
    }
    else if ((thisFixture) && (thisFixture.currenthalf != -101)) {
        //the match HAS started yet - so remove pre game ticker text
        if (PreGameDetails_ticker) { //no point removing it if it's already been removed!!!!!
            SetTickerContent("PreGameDetails_ticker", "")//remove pregame ticker details!!!!
        }
    }
}

//this function goes through the leaderboard for the overall scores for a game
//and returns details which we display to the user in the ticker
//for example - player x is leading with 400 points
//you are 300 points behind - you are in x position etc ..
//this should only be called after we've just recevied/just populated the leaderboard for the overall scores!!!!!!!
function GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame(scores, totalUsersInLeague)
{
    //we DONT want to display details on the league untill - the game has started - and at least one person has won a bet!!!!!
    var LeaderBoardDetails = "";
    var usersScoreAndPosition = ""; //this will ALWAYS go first - so that when we place a bet or update our score the first thing we see will be our score and position!!

    if (scores) {
        lastOverallScoresList = scores;
    }

    if (totalUsersInLeague) {
        lastCountOfUsersInLeague = totalUsersInLeague;
    }

    if ((lastOverallScoresList) && ((thisFixture) && (thisFixture.currenthalf != -101))) { //we have some league data AND the game HAS started!!!!!

        AddMyScoreToOverAllLeaderBoard(totalUsersInLeague, "AddingToTickersLEagueInfo");

        if (totalUsersInLeague > 1) {
            LeaderBoardDetails = "<li class='news-item'>There are " + lastCountOfUsersInLeague + " people playing this game!!</li>";
        }

        var Scoreboard = typeof scores != 'object' ? JSON.parse(lastOverallScoresList) : lastOverallScoresList;
        var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        
        var LeadersName = "";
        var LeadersScore = "";
        var LeadersFBID = "";
        var userLeading = 0;
        var AllScoresAreTheSame = 1;
        var lastScore = 0;

        try {
            for (var i = 0; i < Scoreboard.length; i++) {

                if (i > 0) {
                    if (Scoreboard[i].S != lastScore) {
                        AllScoresAreTheSame = 0; //this means not all scores are the same - i.e at the start of the game everyone will be on 0!!!!!!!
                    }
                }
                lastScore = Scoreboard[i].S;

                if (i == 0) {
                    //this person is Leading the game!!!!! (well is the first position in the array anyway!!!)
                    LeadersName = Scoreboard[i].U;
                    LeadersScore = Scoreboard[i].S;
                    LeadersFBID = Scoreboard[i].F;

                    if (thisUser.fbuserid == LeadersFBID) {
                        //this user is currently leading!!!!!!!
                        //LeaderBoardDetails = LeaderBoardDetails + "<li class='news-item'>You are currently in the lead with " + LeadersScore + " points!!</li>";
                        usersScoreAndPosition = usersScoreAndPosition + "<li class='news-item'>You are currently in the lead with " + LeadersScore + " points!!</li>";
                        userLeading = 1;
                    }
                    else {
                        LeaderBoardDetails = LeaderBoardDetails + "<li class='news-item'>" + LeadersName + " is currently leading this game with " + LeadersScore + " points!!</li>";
                    }
                }
                else { //this is NOT the first position

                    if (Scoreboard[i].F == thisUser.fbuserid) {
                        //this user!!
                        if (userLeading != 1) { //the user is NOT leading

                            var pointsBehindLeader = LeadersScore - Scoreboard[i].S;
                            var position = Scoreboard[i].P + ""; //force this to be a string - so we can do string functionality on it!!!

                            if ((position) && (position > 0)) {
                                var lastNumber = position.charAt(position.length - 1);
                                var last2numbers;

                                if (position.length >= 2) {
                                    //check if the last 2 digits of the position are 11 - i.e could be 11,211,111,3456811 etc
                                    last2numbers = position.substr(position.length - 2, 2);
                                }

                                if (last2numbers == 11) {
                                    position = position + "th";
                                }
                                else if (lastNumber == 1) {
                                    position = position + "st";
                                }
                                else if (lastNumber == 2) {
                                    
                                    try {
                                        if (last2numbers) {
                                            //check if the 2nd last number is 1 - if it is the this is either 12th or 112th etc
                                            if (last2numbers.substring(0, 1) == "1") {
                                                position = position + "th";
                                            }
                                            else {
                                                position = position + "nd";
                                            }
                                        }
                                        else {
                                            //there is only one number - so this must be 2nd
                                            position = position + "nd";
                                        }

                                    } catch (ex) { position = position + "nd"; }

                                }
                                else if (lastNumber == 3) {

                                    try
                                    {
                                        if (last2numbers) {
                                            //check if the 2nd last number is 1 - if it is the this is either 13th or 113th etc
                                            if (last2numbers.substring(0, 1) == "1") {
                                                position = position + "th";
                                            }
                                            else {
                                                position = position + "rd";
                                            }
                                        }
                                        else {
                                            //there is only one number - so this must be 3rd
                                            position = position + "rd";
                                        }

                                    } catch (ex) { position = position + "rd"; }

                                    
                                }
                                else {
                                    position = position + "th";
                                }

                            }

                            if (pointsBehindLeader > 0) {

                                //LeaderBoardDetails = LeaderBoardDetails + "<li class='news-item'>You are " + pointsBehindLeader + " points behind the leader!!</li>";
                                usersScoreAndPosition = usersScoreAndPosition + "<li class='news-item'>You have " + Scoreboard[i].S + " points!!</li><li class='news-item'>You are " + pointsBehindLeader + " points behind the leader!!</li>";

                                if (position) {
                                    //LeaderBoardDetails = LeaderBoardDetails + "<li class='news-item'>You are in " + position + " position!!</li>";
                                    usersScoreAndPosition = "<li class='news-item'>You are in " + position + " position in the overall scores!!</li>" + usersScoreAndPosition;
                                }
                            }
                            else {
                                //this user may not be the first in the list - however they are joint top!!!!
                                //LeaderBoardDetails = LeaderBoardDetails + "<li class='news-item'>You are joint top of the leader board with " + LeadersName + "!!</li><li class='news-item'>You have " + LeadersScore + " points!!</li>";
                                usersScoreAndPosition = usersScoreAndPosition + "<li class='news-item'>You are joint top of the leader board with " + LeadersName + "!!</li><li class='news-item'>You have " + LeadersScore + " points!!</li>";
                            }
                        }
                    }
                    else { //these details are not the users
                        if ((i == 1) && (userLeading == 1)) {
                            //the current user is in the lead - and these are the details of the person in second!!!
                            var Lead = LeadersScore - Scoreboard[i].S;
                            if (Lead > 0) {
                                LeaderBoardDetails = LeaderBoardDetails + "<li class='news-item'>" + Scoreboard[i].U + " is in second place!!</li><li class='news-item'>You lead " + Scoreboard[i].U + " by " + Lead + " points!!</li>"
                            }
                            else {
                                //the user is not actually in the lead - infact they are joint top!!!!!!
                                //LeaderBoardDetails = LeaderBoardDetails + "<li class='news-item'>You are joint top of the leader board with " + LeadersName + "!!</li><li class='news-item'>You have " + LeadersScore + " points!!</li>";
                                usersScoreAndPosition = usersScoreAndPosition + "<li class='news-item'>You are joint top of the leader board with " + LeadersName + "!!</li><li class='news-item'>You have " + LeadersScore + " points!!</li>";
                            }
                        }
                    } //END - these details are not the users
                } // end this is NOT the first position
            } //end for loop

            if (AllScoresAreTheSame == 1) { //everyone is on the same score - so dont return anything here!!!!
                LeaderBoardDetails = ""; 
                usersScoreAndPosition = "";
            }
        }
        catch (ex) {
            logError("GetLeagueStandingsTickerDetailsBasedOnTheOverallScoresForThisGame", ex);
        }
    }
    return usersScoreAndPosition + LeaderBoardDetails;
}

function GetFriendsScoresForTicker() {
    //we DONT want to display details on the league untill - the game has started - and at least one person has won a bet!!!!!
    var friendDetails = "";
    var friendScores;
    try {
        friendScores = JSON.parse(window.sessionStorage.getItem("listOfFriendsScores"));
    } catch (ex) { }

    if ((friendScores) && (friendScores.length > 1)  //we have friends - AND the game has started!!!!
    && 
     ((thisFixture) && (thisFixture.currenthalf != -101))
    )
    {   //you have at least 1 friend playing
        var thisUser = JSON.parse(window.sessionStorage.getItem("facebookuser"));
        var LeadersName = "";
        var LeadersScore = "";
        var LeadersFBID = "";
        var userLeading = 0;
        var AllScoresAreTheSame = 1;
        var lastScore = 0;

        try 
        {
                var numberOfFriendsPlaying = friendScores.length - 1;
                if (numberOfFriendsPlaying == 1)  //you have only 1 friend playing
                {
                    //get friendsName and current Score
                    var usersScore;
                    var FriendsScore;
                    var FriendsName;
                    for (var i = 0; i < friendScores.length; i++) {
                        if (thisUser.fbuserid != friendScores[i].F) {
                            //these details are your friends details
                            FriendsScore = friendScores[i].S;
                            FriendsName = friendScores[i].U;

                            try
                            {
                                var StartOfNickName = FriendsName.indexOf("<span");
                                if (StartOfNickName > 0) {
                                    FriendsName = FriendsName.substring(0, StartOfNickName - 1);
                                }
                            }
                            catch (ex) { }

                            friendDetails = friendDetails + "<li class='news-item'>Your friend " + FriendsName + "  is also playing this game and has " + FriendsScore + " points!</li>";

                            if (usersScore) {
                                //the user is ahead of the friend)
                                if (usersScore > FriendsScore) {
                                    friendDetails = friendDetails + "<li class='news-item'>You lead your friend " + FriendsName + " by " + (usersScore - FriendsScore) + " points!</li>";
                                }
                                else if (usersScore == FriendsScore) {
                                    friendDetails = friendDetails + "<li class='news-item'>You and your friend " + FriendsName + " currently have the same score!!!</li>";
                                }
                            }
                        }
                        else {
                            //these details are Users details!!!!!
                            usersScore = friendScores[i].S;
                            if (FriendsScore) {
                                //the friend is ahead of the user
                                if (usersScore < FriendsScore) {
                                    friendDetails = friendDetails + "<li class='news-item'>You trail your friend " + FriendsName + " by " + (FriendsScore - usersScore) + " points!</li>";
                                }
                                else if (usersScore == FriendsScore) {
                                    friendDetails = friendDetails + "<li class='news-item'>You and your friend " + FriendsName + " currently have the same score!!!</li>";
                                }
                            }
                        }
                    } //end for
                } //end  if (numberOfFriendsPlaying == 1) 
                else 
                {
                    friendDetails = friendDetails + "<li class='news-item'>You have " + friendScores.length + " friends playing this game!!</li>";
                    for (var i = 0; i < friendScores.length; i++) 
                    {
                       if (i > 0) {
                            if (friendScores[i].S != lastScore) {
                                AllScoresAreTheSame = 0; //this means not all scores are the same - i.e at the start of the game everyone will be on 0!!!!!!!
                            }
                       }
                       lastScore = friendScores[i].S;

                       if (i == 0) {
                            //this person is leading the friends scores!!!!!
                            LeadersScore = friendScores[i].S;
                            LeadersFBID = friendScores[i].F;
                            LeadersName = friendScores[i].U;

                           try {
                               var StartOfNickName = LeadersName.indexOf("<span");
                               if (StartOfNickName > 0) {
                                   LeadersName = LeadersName.substring(0, StartOfNickName - 1);
                               }
                           }
                           catch (ex) { }

                            if (thisUser.fbuserid == friendScores[i].F) {
                                friendDetails = friendDetails + "<li class='news-item'>You have the best score of your friends!!</li>";
                            }
                            else {
                                friendDetails = friendDetails + "<li class='news-item'>" + LeadersName + " has the best score of your friends with " + friendScores[i].S + " points!!</li>";
                            }
                       }
                       else if (  (i != friendScores.length - 1)  && (thisUser.fbuserid == friendScores[i].F) && (friendScores[i].S != LeadersScore) ) 
                       {
                           //this is the user playing the game
                           friendDetails = friendDetails + "<li class='news-item'>You trail your friend " + LeadersName + " by " + (LeadersScore - friendScores[i].S) + " points!</li>";
                       }
                       else if (i == friendScores.length - 1) {
                           //this friend is at the bottom of the friends table!!!
                           if (thisUser.fbuserid == friendScores[i].F) {
                               friendDetails = friendDetails + "<li class='news-item'>You have the worst score of your friends!!!</li>";
                               friendDetails = friendDetails + "<li class='news-item'>You trail your friend  " + LeadersName + " by " + (LeadersScore - friendScores[i].S) + " points!</li>";
                           }
                           else {

                               FriendsName = friendScores[i].U;
                               try {
                                   var StartOfNickName = FriendsName.indexOf("<span");
                                   if (StartOfNickName > 0) {
                                       FriendsName = FriendsName.substring(0, StartOfNickName - 1);
                                   }
                               }
                               catch (ex) { }

                               friendDetails = friendDetails + "<li class='news-item'>" + FriendsName + " has the worst score of your friends with " + friendScores[i].S + " points!!</li>";
                           }
                       }

                   } //end for

                   if ((AllScoresAreTheSame == 1) && (lastScore == 0)) 
                   {
                       //all friends have the same score (and that score is 0 - so most likely the game has just started (or hasn;t started yet) 
                       //so...we're not going to write out any of the above( i.e all the ticker content about what position people ar in - 
                       //it's sufficient to just tell how many friends are playing!!!
                       friendDetails = "<li class='news-item'>You have " + friendScores.length + " friends playing this game!!</li>";
                   }
                } //end else
        } //end try
        catch (ex) 
        {
            logError("GetFriendsScoresForTicker", ex);
        }
    }
    return friendDetails;
}



function GetHintsTickerText() 
{
    Hints_ticker = "";
    try {
        if ((bootroomused == 0) && (displaymode == "m")) {
            //the user has NOT gone into the boot room yet - so remind them!!!
            Hints_ticker = Hints_ticker + '<li class="news-item">Use the boot room to start PowerPlays, buy from the store and much more!</li>';
        }
        if (powerplayused == 0) {
            //the user has NOT used the power play yet - so remind them of it and tell tem how to start it!!
            Hints_ticker = Hints_ticker + "<li class='news-item'>Don't forget to use your PowerPlay to double your odds for 10 minutes!!</li>";             
        }
        if (forfeitsUsed == 0) {
            Hints_ticker = Hints_ticker + ' <li class="news-item">Use a forfeit to cancel your Predictions, it could be worth it!!</li>';
        }
        Hints_ticker = Hints_ticker + '<li class="news-item">Use a forfeit to cancel your Predictions, it could be worth it!!</li>';
    }
    catch (ex) {
        logError("GetHintsTickerText", ex);
    }
    return Hints_ticker;
}

//this function returns text which reminds the user to go to the store to buy things
function GetStoreDetailsTickerText() {
    storeDetails_ticker = "";
    try {
        if ($('.credits').html() < 500) {
            //the user has less than 500 credits - so remind them that they can go to the store and by more credits!!!!!!
            if (displaymode == "m") {                        
                storeDetails_ticker = storeDetails_ticker + '<li class="news-item">You are running out of credits - go to the boot room to buy more via the store!</li>';
            }
            else {
                //web - dont mention the the boot room ( or the war)
                storeDetails_ticker = storeDetails_ticker + '<li class="news-item">You are running out of credits - go to the store to top up!</li>';
            }
        }
        if (remainingforfeits <= 0) {
            //the user has no forfeits remaining - remind them that they can buy more in the store
            if (displaymode == "m") {
                storeDetails_ticker = storeDetails_ticker + '<li class="news-item">You have used all your forfeits -  go to the boot room to buy more via the store!</li>';
            }
            else {
                //web - dont mention the the boot room ( or the war)
                storeDetails_ticker = storeDetails_ticker + '<li class="news-item">You have used all your forfeits - go to the store to buy more!</li>';
            }
        }
        if (thisFixture.remainingpowerplays <= 0) {
            //the user has used all their power plays - remind them that they can buy more in the store
            if (displaymode == "m") {
                storeDetails_ticker = storeDetails_ticker + '<li class="news-item">You have used all your power plays - buy more in the store and jump up the leaderboard!</li>';
            }
            else {
                //web - dont mention the the boot room ( or the war)
                storeDetails_ticker = storeDetails_ticker + '<li class="news-item">You have used all your power plays - buy more in the store and jump up the leaderboard!</li>';
            }
        }
    }
    catch (ex) {
        logError("GetStoreDetailsTickerText", ex);
    }
    return storeDetails_ticker;
}


//this function returns the text used in the ticker regarding the number of bets the user needs to unlock the 200 credit precition level
function GetCreditLimitTickerText(BetsNeeded) {
    creditLimit_ticker = ""; //reset this at start
    
    try {
        var bootroom = "";
        if (displaymode == "m") {
            bootroom = "go to the boot room and ";
        }
        var more = "";
        if (thisFixture.numbetsplaced > 0) {
            more = " more";
        }

        // if ((!BetsNeeded) && (BetsNeeded != 0)) {
        if (!BetsNeeded)
        {
            /*
            //no longer output any info here regarding unlockcredits as the thisFixture.numbetsplaced value is not valid
            //we can look at making it valid later - until then this function is only going to return info 
            //after a user just placed a bet ( i.e we are not going to append it to the ticker when we are updating other things in the ticker )

            //this function has NOT been called after a bet has been placed!!!
            if (thisFixture.unlockcredits > 100) {
                //if in here then the user HAS unlocked the 200 credit bet limit
                //so...check if the user has set it in the one click bets
                if (getUsersOneClickCreditValue() != 200) {
                    //the user has NOT set the one click value to 200 even though they have unlocked it!!!!
                    //so remind them to set it!!!!

                    if (displaymode == "m") {
                        creditLimit_ticker = "<li class='news-item'>You have unlocked the <strong>200</strong> Credit Limit!!</li><li class='news-item'>Don't forget to " + bootroom + " set it as your one click value!!</li>";
                    }
                    else {
                        creditLimit_ticker = "<li class='news-item'>You have unlocked the <strong>200</strong> Credit Limit!!</li><li class='news-item'>Don't forget to set it as your one click value!!</li>";
                    }
                }
            }
            else {
                //the user has NOt unlocked the 200 credit level yet - so tell them how many they HAVE placed!!!
                var numBetsNeeded = thisFixture.numbetstounlockhigherlevel - thisFixture.numbetsplaced;
                if (numBetsNeeded == 1) {
                    creditLimit_ticker = '<li class="news-item">You need to place 1 more prediction to unlock the <strong>200</strong> Credit Limit</li><li class="news-item">Or ' + bootroom + 'unlock it now via the store!!</li>';
                }
                else if (numBetsNeeded > 1) {
                    creditLimit_ticker = '<li class="news-item">You need to place ' + numBetsNeeded + more + ' bets to unlock the <strong>200</strong> Credit Limit</li><li class="news-item">Or ' + bootroom + 'unlock it now via the store!!</li>';
                }
            }
            */
        }
        else {
            //the user has NOT unlocked the 200 credit bet limit
            //so..remind the user how many more bets they need to set
          

            if (BetsNeeded == 1) {
                creditLimit_ticker = '<li class="news-item">You need to place 1 more prediction to unlock the <strong>200</strong> Credit Limit</li><li class="news-item">Or ' + bootroom + 'unlock it now via the store!!</li>';
            }
            else if (BetsNeeded > 1) {
                creditLimit_ticker = '<li class="news-item">You need to place ' + BetsNeeded + more + ' bets to unlock the <strong>200</strong> Credit Limit</li><li class="news-item">Or ' + bootroom + 'unlock it now via the store!!</li>';
            }
            else if (BetsNeeded == 0) {
                //the user must have just unlocked the credit limit!!!
                if (getUsersOneClickCreditValue() != 200) {
                    //AND .. the user has NOt yet set their one click bet to 200!!!!
                    if (displaymode == "m") {
                        creditLimit_ticker = "<li class='news-item'>You have unlocked the <strong>200</strong> Credit Limit!!</li><li class='news-item'>Don't forget to " + bootroom + "set it as your one click value!!</li>";
                    }
                    else {
                        creditLimit_ticker = "<li class='news-item'>You have unlocked the <strong>200</strong> Credit Limit!!</li><li class='news-item'>Don't forget to set it as your one click value!!</li>";
                    }
                }
            }
        }
    }
    catch (ex) {
        logError("GetCreditLimitTickerText", ex);
    }
    return creditLimit_ticker;
}


function ResetTicker() {
    $('#js-news').ticker({
        speed: 0.10,
        htmlFeed: true,
        fadeInSpeed: 600,
        debug: true,
        titleText: '>'
    });
}