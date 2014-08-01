var GameFeedScroller, friendsScoreScroller, leaderboardScroller, popupScroller, leagueMessageScroller, myStorePurchasesScroller;

//this function stops us proceeding 
//it is used in the league's list - we have a clickable span within an anchor link
//and we dont want to do both!!!!
function DontContinue() {
    if (window.event) {
        window.event.cancelBubble = true;
    }
    else {
        if (e.cancelable) { e.stopPropagation(); }
    }
}

function refreshScroller(scroller, div) {

    try {

        //if i have not loaded this particular scroller yet - then initialise
        if (div == 'GameFeedInfo') {
            if (!GameFeedScroller) {
                if (displaymode == "w") {
                    //if in the web mode then link the GameFeedScroller to 'wrapper'
                    GameFeedScroller = new iScroll('wrapper', { hScrollbar: false, vScrollbar: false });
                }
                else {
                    //if in the mobile mode then link the GameFeedScroller to 'wrapper5'
                    GameFeedScroller = new iScroll('wrapper5', { hScrollbar: false, vScrollbar: false });
                }

                GameFeedScroller.onScrollEnd = function () {
                    _gaq.push(['_trackEvent', 'Clicks', 'ViewGameTracker', 'Scroll']);
                };
                scroller = GameFeedScroller;
            }
        }
        else if ((div == 'MyleagueInvites') || (div == 'LeagueLeaderboard2')) {
            if (!leaderboardScroller) {
                if (displaymode == "w") {
                    //if in the web mode then link the leaderboardScroller to 'wrapper3'
                    leaderboardScroller = new iScroll('wrapper3', { hScrollbar: false, vScrollbar: false });
                }
                else {
                    //if in the mobile mode then link the leaderboardScroller to 'wrapper7'
                    leaderboardScroller = new iScroll('wrapper7', { hScrollbar: false, vScrollbar: false });
                }

                leaderboardScroller.onScrollEnd = function () {
                    _gaq.push(['_trackEvent', 'Clicks', 'ViewLeaderboard', 'Scroll']);
                };
                scroller = leaderboardScroller;
            }
        }
        else if (div == 'FriendsLeaderboard') {
            if (!friendsScoreScroller) {

                if (displaymode == "w") {
                    //if in the web mode then link the friendsScoreScroller to 'wrapper2'
                    friendsScoreScroller = new iScroll('wrapper2', { hScrollbar: false, vScrollbar: false });
                }
                else {
                    //if in the mobile mode then link the friendsScoreScroller to 'wrapper6'
                    friendsScoreScroller = new iScroll('wrapper6', { hScrollbar: false, vScrollbar: false });
                }

                friendsScoreScroller.onScrollEnd = function () {
                    _gaq.push(['_trackEvent', 'Clicks', 'ViewFriendsScores', 'Scroll']);
                };
                scroller = leaderboardScroller;
            }
        }


        else if (div == 'invitepanel') {
            if (!leagueMessageScroller) {
                if (displaymode == "w") {
                    //if in the web mode then link the leagueMessageScroller to 'leagueMessageWrapper'
                    leagueMessageScroller = new iScroll('leagueMessageWrapper', { hScrollbar: false, vScrollbar: false });
                }
                else {
                    //if in the mobile mode then link the leagueMessageScroller to 'leagueMessageWrapper_mobile'
                    leagueMessageScroller = new iScroll('leagueMessageWrapper_mobile', { hScrollbar: false, vScrollbar: false });
                }

                leagueMessageScroller.onScrollEnd = function () {
                    _gaq.push(['_trackEvent', 'Clicks', 'ViewLeagueMessages', 'Scroll']);
                };
                scroller = leagueMessageScroller;
            }
        }


        else if (div == 'storepurchases') {
            if (!myStorePurchasesScroller) {
                myStorePurchasesScroller = new iScroll(displaymode + '_scroll_storepurchases', { hScrollbar: false, vScrollbar: false });

                myStorePurchasesScroller.onScrollEnd = function () {
                    _gaq.push(['_trackEvent', 'Clicks', 'ScrollMyStorePurchases', 'Scroll']);
                };
                scroller = myStorePurchasesScroller;
            }
        }

        else if (div == 'popup') {
            if (!popupScroller) {
                popupScroller = new iScroll('wrapperpopup', { hScrollbar: false, scrollbarClass: 'myScrollbar' });
                scroller = popupScroller;
            }
        }

        if ((scroller) && (typeof scroller != 'undefined')) {
            setTimeout(function () {
                scroller.refresh();
            }, 0);
        }

    } catch (ex) { };
}

//OLD Version - removed stephen 17-july
//function refreshScroller(scroller, div) {

//    //if i have not loaded this particular scroller yet - then initialise
//    // Added scrollable class to target multiple divs - John

//    //this looks wrong to me - we seem to be pointing every scoller at every div marked scrollable?
//    //what is the point of having multiple scrollers then?????
//    //should we not point the GameFeedScroller at only the GameFeed div and so on???
//    if (div == 'GameFeedInfo') {
//        if (!GameFeedScroller) {
//            $('.scrollable').each(function () {
//                var id = $(this).attr('id');
//                GameFeedScroller = new iScroll(id, { hScrollbar: false, vScrollbar: false });
//                GameFeedScroller.onScrollEnd = function () {
//                    _gaq.push(['_trackEvent', 'Clicks', 'ViewGameTracker', 'Scroll']);
//                };
//                scroller = GameFeedScroller;
//            });            
//        }
//    }
//    else if ((div == 'MyleagueInvites') || (div == 'LeagueLeaderboard2') || (div == 'adminlinks')) {
//        if (!leaderboardScroller) {
//            $('.scrollable').each(function () {
//                var id = $(this).attr('id');
//                leaderboardScroller = new iScroll(id, { hScrollbar: false, vScrollbar: false });
//                leaderboardScroller.onScrollEnd = function () {
//                    _gaq.push(['_trackEvent', 'Clicks', 'ViewLeaderboard', 'Scroll']);
//                };
//                scroller = leaderboardScroller;
//            }); 
//        }
//    }
//    else if (div == 'FriendsLeaderboard') {
//        if (!friendsScoreScroller) {
//            $('.scrollable').each(function () {
//                var id = $(this).attr('id');
//                friendsScoreScroller = new iScroll(id, { hScrollbar: false, vScrollbar: false });
//                friendsScoreScroller.onScrollEnd = function () {
//                    _gaq.push(['_trackEvent', 'Clicks', 'ViewFriendsScores', 'Scroll']);
//                };
//                scroller = leaderboardScroller;
//            });
//        }
//    }    
//    else if (div == 'popup') {
//        if (!popupScroller) {
//            popupScroller = new iScroll('wrapperpopup', { hScrollbar: false, scrollbarClass: 'myScrollbar' });
//            scroller = popupScroller;
//        }
//    }

//    if ((scroller) && (typeof scroller != 'undefined')) {
//        setTimeout(function () {
//            scroller.refresh();
//        }, 0);
//    }
//}




//function to display credits manager popup
function ToggleCreditsmanager() {

    if ($('#' + displaymode + '_creditsmanager').is(":visible") == false) {

        //$('.tooltip-shade').show();

        $('#' + displaymode + '_creditsmanager').animate({ top: '5%' }, 800, function () {
            $('#' + displaymode + '_creditsmanagerclickbtn').html($('#' + displaymode + '_creditsmanagerclickbtn').html() == '<span>$</span>1-Click Mode' ? '<span>$</span>&nbsp;Close' : '<span>$</span>1-Click Mode');
        });

        $('#' + displaymode + '_creditsmanager').attr("style", "display:block;z-index:900;");

    } else {

        //$('.tooltip-shade').hide();
        $('#' + displaymode + '_creditsmanager').fadeOut('slow', function () {
            $('#' + displaymode + '_creditsmanagerclickbtn').html($('#' + displaymode + '_creditsmanagerclickbtn').html() == '<span>$</span>1-Click Mode' ? '<span>$</span>&nbsp;Close' : '<span>$</span>1-Click Mode');
        });
    }

    if ($('#' + displaymode + '_creditsmanager').is(":visible") == true) 
    {
        //if we are displaying the credits manager display then... 
        //...set the default selection based on users previous choice
        var usersOneClickCreditValue = getUsersOneClickCreditValue();
        var $radios = $('input:radio[name=' + displaymode + '_storecredits]');
        $radios.filter('[value=' + usersOneClickCreditValue + ']').attr('checked', true);
    }

}

//function to display how to play
function showhowtoplay() {
    //$('.tooltip-shade').toggle('fast');
    $('#' + displaymode + '_howtotutorial').toggle('fast');
    //$('.howtopopup').toggle('fast');
    //$('#howtotutorial').toggle('fast');
}

//function to display how can I play
function showtech() {
    //$('.tooltip-shade').toggle('fast');
    $('#' + displaymode + '_techsupport').toggle('fast');
    $('#techsupport').toggle('fast');
}

//function to display/hide nickname editor
function nicknameeditor() {
    if ($('.nicknamepopup').is(":visible") == true) {
        $('.nicknamepopup').fadeOut('fast');
        //$('.tooltip-shade').hide();
    } else {
        $('.nicknamepopup').fadeIn('fast');
        //$('.tooltip-shade').show();
    }
}

////function to display/hide store
//function showstore() {
//    if ($('.storepopup').is(":visible") == true) {
//        $('.storepopup').fadeOut('fast');
//        $('.tooltip-shade').hide();
//        //reset inventory screen
//        $('#' + displaymode + '_checkout').hide();
//        $('#' + displaymode + '_inventory').show();
//    } else {
//        $('.storepopup').fadeIn('fast');
//        $('.tooltip-shade').show();
//    }
//}


////confirm purchase screen
//function confirmpurchase(i) {
//    var itemid = i;
//    //If the user is on the iOS app perform iOS billing, if not display the confirm popup
//    if (iosApp) {
//        window.location = "livegames:BuyItem:" + itemid;
//    }
//    else {
//        $('#' + displaymode + '_inventory').fadeOut('fast', function () {
//            $('#' + displaymode + '_checkout').fadeIn('fast');
//        });
//    }
//}

//Function called once payment is complete
function makePurchase(itemId) {
    //Insert API call in here, the item ID is passed 
}
//function to display reconnection message
function reconnectclick() {
    $('#' + displaymode + '_reconnectstatus').slideToggle('fast');
}

//function to display tooltips on icons by clicking Help button
function ShowTips() {

    //on mobile version - go to pitch view
    if (displaymode == "m") {
        $('[href=#3]').click();
    }

    $('#' + displaymode + '_tooltips').toggle('fast', function () {
        $('#' + displaymode + '_helpclickbtn').html($('#' + displaymode + '_helpclickbtn').html() == '<span>?</span>Help!' ? '<span>X</span>Hide' : '<span>?</span>Help!');
        $('.tooltip-shade-bg').toggle();
    });

    if ($('#' + displaymode + '_tooltips').is(":visible") == true)
    {
        _gaq.push(['_trackEvent', 'Clicks', 'ShowTips']);
    }
}

//function to display menu for credits and username
function ToggleUserInfo() {
    //$('.gameplay').attr({ style: "position:relative!important" });
    $('#' + displaymode + '_userinfo').slideToggle('fast', function () { });

    if ($('#' + displaymode + '_userinfo').is(":visible") == true) {
        _gaq.push(['_trackEvent', 'Clicks', 'ShowMenu']);
    }
}

//this functio HIDES the invitepanel div - i.e the div we are going to use to display info regarding league invites/league creation/league editing etc
function hideLeagueExtraDetails(divid) {
    $("#" + divid).hide();
}

function hideInvites(leagueid) {
    $(".linv_" + leagueid).hide();
}

//this function SHOWS the invitepanel div - i.e the div we are going to use to display info regarding league invites/league creation/league editing etc
function showLeagueExtraDetails() {
    $('.invitepanel').show();
}

function checkBetCountDown() {
    BetValidCount--;
    if (BetValidCount > 0) {
        span = document.getElementById(displaymode + "_count");
        span.innerHTML = BetValidCount;
        setTimeout("checkBetCountDown();", 1000); //make recursive call to this function again in 1 second!!!
    }
    else if (BetValidCount === 0) {
        //if we get here it means the user placed their bet before we recevied any bet freeze event
        //therefore the bet is valid!!!!!!!!!!!!
        //removed fadeOut due to problems with iPad and iOS6, delay and fadeout combined on a large scale seems to cause issues. Use hide instead - John
        $('#' + displaymode + '_predictionpending').html('<img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_tick.png" border="0" alt="Success" style="vertical-align:middle; height:16px;" />&nbsp;<strong>Success</strong>, Prediction Made!');
        $('#' + displaymode + '_predictionpending').delay(1000).hide();
        $('#' + displaymode + '_count').hide();
        $('.tooltip-shade').delay(1000).hide();
        //if (displaymode == "m") {
        //    $('[href=#1]').delay(1000).click();
        //}      
    }
}

function StartBetCountDown() {
    if (voidOffset == 0) {
        //voidOffset should NEVER be 0 - but it has been 0 at least once - and this led to error
        //so.. if it's 0 - set to 5 ( the original default)
        voidOffset = 5;
   }

    BetValidCount = voidOffset; //reset the BetValidCount value  (as it may de now at zero due to a previous countdown!!!)

    //var span = document.getElementById(displaymode + "_count");
    //span.innerHTML = BetValidCount;
    $('.tooltip-shade').show();
    $('.betcountdown').show();
    $('#' + displaymode + '_count').html(BetValidCount);
    $('#' + displaymode + '_count').show();
    $('#' + displaymode + '_predictionpending').html('Prediction pending...');
    $('#' + displaymode + '_predictionpending').show();
    setTimeout("checkBetCountDown();", 1000); //check betcountdown in 1 second!!!
}


function bouncenotification(t) {

    var innertext = "";
    innertext = t;
    //if we pass text to function use it!
    if (innertext != "") {
        $('.notification-bubble .text').text(innertext);
    }

    $('.notification-bubble').fadeIn("slow");
    //make notification bubble bounce 10 times
    for (var i = 0; i < 6; i++) {        
        $('.notification-bubble').animate({ top: '15px' }, 500).animate({ top: '0px' }, 500);
    }
    $('.notification-bubble').fadeOut("slow");
}


//function for league UI
function showleaguepanel(i) 
{
    //$('.leaguepanel').hide();
    //$('.leaguestandings').hide();

    if (i == 2) {
        //we are showing the create league panel
        //clear the error text ( in case we previously put a warning to the user ther ( e.g - you must give the league a name ...)
        $('#' + displaymode + '_CreateLeagueError').html("");
        $('#' + displaymode + '_leaguename').val("");
        _gaq.push(['_trackEvent', 'Clicks', 'CreateLeague_step1']);
    }

    $('#' + displaymode + '_league_view_' + i).fadeIn('fast');
}

function hideleaguepanel(i) {
    //$('.leaguepanel').hide();
    //$('.leaguestandings').hide();
    $('#' + displaymode + '_league_view_' + i).hide();
}

function getleague(i) 
{
    $('.leaguepanel').hide();
    $('#' + displaymode + '_leaguestandings_' + i).fadeIn('fast');
}

function slider(s) {

    var slideid = s;

    //use 0 to close any open panels
    if (slideid == 0) {

        $('.slidepanel').slideUp();
        $('.game-control-close').hide();
        $('.button-1').removeClass("active");

    } else {

        $('.slidepanel').not('#' + displaymode + '_slide' + slideid).slideUp();
        //deactivate all buttons
        $('.button-1').removeClass("active");

        //toggle selected panel
        $('#' + displaymode + '_slide' + slideid).slideToggle('fast', function () {

            //find out should we show/hide (X) button & add/remove active state to button
            if ($('#' + displaymode + '_slide' + slideid).is(':visible')) {
                $('.game-control-close').show();
                $('#' + displaymode + 'slidebtn' + slideid).addClass("active");
            } else {
                $('.game-control-close').hide();
                $('.button-1').removeClass("active");
            }
        });
    }

    var SlideShown = "";
    if (slideid == 1) {
        SlideShown = "ViewGameTracker";
    }
    else if (slideid == 2) 
    {
        SlideShown = "ViewFriendsScores";
    }
    else if (slideid == 3) {
        SlideShown = "ViewLeaderboard";
    }
    else if (slideid == 4) {
        SlideShown = "ViewBonus";
    }
    if (SlideShown) {
        _gaq.push(['_trackEvent', 'Clicks', SlideShown]);
    }
}


function setupcarousel_mobile(num, DivWhichIsBeingDisplayedNow) {

    var maxnum = 0, divnum = 1, visibledivID = 0;

    //num is the pre-game bet currently visible, each bet has a number of options, so check the size next of the div
    visibledivID = "b" + num;

    //how many divs e.g. bet options are there
    maxnum = ($("#" + visibledivID + " > div").size());

    $('.option3 > .betselection').hide();
    //show first div by default

    if (DivWhichIsBeingDisplayedNow) {
        if (DivWhichIsBeingDisplayedNow == 1) {
            //we are about to show the first player to score
            divnum = LastPlayerDisplayed;
        }
        else if (DivWhichIsBeingDisplayedNow == 2) {
            //we are about to show the first team to score
            divnum = LastTeamDisplayed;
        }
    }

    $('.option3 > #selection_' + divnum).show();

    //setup prev/next buttons
    if (
        ((num != 1) && (num != 2)) //we are not about to set the details for div1 or 2
        ||
        ((num == 1) && (LastPlayerDisplayed == 1)) //we ARE about to set the details for div 1 - but we are still showing the first player
        ||
        ((num == 2) && (LastTeamDisplayed == 1))//we ARE about to set the details for div 2 - but we are still showing the first team

    ) {
        $('#' + displaymode + '_pregamebet_' + num).find('#next').attr("onClick", "showoption(" + num + ",2);return false;");
        $('#' + displaymode + '_pregamebet_' + num).find('#prev').attr("onClick", "showoption(" + num + "," + maxnum + ");return false;");
    }

    if (maxnum <= 1) {
        //less than 2 bet options so don't show navigation
        show_navbtns(num, 1);
    } else {
        show_navbtns(num, 0);
        //display number of bets

        $('#' + displaymode + '_pregamebet_' + num).find('#betnum').html(divnum + "/" + maxnum);
    }
}

//carousel for pre-game bet options
function setupcarousel_web(num,DivWhichIsBeingDisplayedNow) {

    var maxnum = 0, divnum = 1, visibledivID = 0;

    $('.option3').each(function () {

        try {

            //num is the pre-game bet currently visible, each bet has a number of options, so check the size next of the div
            visibledivID = "b" + num;

            //how many divs e.g. bet options are there
            maxnum = ($("#" + visibledivID + " > div").size());

            //maxnum = $(this).size();

            $("#" + visibledivID + " > .betselection").hide();
            //show first div by default

            if (DivWhichIsBeingDisplayedNow) {
                if (DivWhichIsBeingDisplayedNow == 1) {
                    //we are about to show the first player to score
                    divnum = LastPlayerDisplayed;
                }
                else if (DivWhichIsBeingDisplayedNow == 2) {
                    //we are about to show the first team to score
                    divnum = LastTeamDisplayed;
                }
            }

            $("#" + visibledivID + " > #selection_1").show();   

            //setup prev/next buttons
            if(
                ( (num != 1) && (num != 2)) //we are not about to set the details for div1 or 2
                ||
                ((num == 1) && (LastPlayerDisplayed == 1)) //we ARE about to set the details for div 1 - but we are still showing the first player
                ||
                ((num == 2) && (LastTeamDisplayed == 1))//we ARE about to set the details for div 2 - but we are still showing the first team
            )
            {
                $('#' + displaymode + '_pregamebet_' + num).find('.nextbet').attr("onClick", "showoption(" + num + ",2);return false;");
                $('#' + displaymode + '_pregamebet_' + num).find('.prevbet').attr("onClick", "showoption(" + num + "," + maxnum + ");return false;");
            }

            if (maxnum <= 1) {
                //less than 2 bet options so don't show navigation
                show_navbtns(num, 1);
            } else {
                show_navbtns(num, 0);
                //display number of bets

                //$('#' + displaymode + '_pregamebet_' + num).find('.betnum').html(divnum + "/" + maxnum);
                $('#' + displaymode + '_pregamebet_' + num).find('.betnum').html("1/" + maxnum);
            }

            //count
            divnum = divnum + 1;
            num = num + 1;

        }
        catch (ex) {
            console.log(ex);
        }

    }); //end each

}

//show-hide navigation buttons depending if a pre-game bet is made!
function show_navbtns(num, a) {

    if (displaymode == "m") {
        if (a == 0) {
            $('#' + displaymode + '_pregamebet_' + num).find('#next').show();
            $('#' + displaymode + '_pregamebet_' + num).find('#prev').show();
        } else {
            $('#' + displaymode + '_pregamebet_' + num).find('#next').hide();
            $('#' + displaymode + '_pregamebet_' + num).find('#prev').hide();
        }
    }
    else {
        if (a == 0) {
            $('#' + displaymode + '_pregamebet_' + num).find('.nextbet').show();
            $('#' + displaymode + '_pregamebet_' + num).find('.prevbet').show();
        } else {
            $('#' + displaymode + '_pregamebet_' + num).find('.nextbet').hide();
            $('#' + displaymode + '_pregamebet_' + num).find('.prevbet').hide();
        }
    }

}




function showoption(n, i) {

    if (n == 1) {
        //we are moving through the list of players to score first
        LastPlayerDisplayed = i;
    }
    else if (n == 2) {
        //we are moving through the list of teams to score first
        LastTeamDisplayed = i;
    }

    var num = 1;
    num = n;
    var option = i;
    var nextoption = option + 1;
    var prevoption = option - 1;
    var visibledivID = 1;

    //num is the pre-game bet currently visible, each bet has a number of options, so check the size next of the div
    visibledivID = "b" + num;

    //check have we reached the end of carousel
    var maxnum = ($("#" + visibledivID + " > div").size());
    if (option == maxnum) {
        nextoption = "1";
    }
    if (prevoption == 0) {
        prevoption = maxnum;
    }
    
    if (displaymode == "m") {
        //show the next bet
        $('.betselection').hide();
        $('.option3 > #selection_' + option).show();

        $('#' + displaymode + '_pregamebet_' + num).find('#betnum').html(option + "/" + (maxnum));

        //setup prev/next buttons
        $('#' + displaymode + '_pregamebet_' + num).find('#next').attr("onClick", "showoption(" + num + "," + nextoption + ");return false;");
        $('#' + displaymode + '_pregamebet_' + num).find('#prev').attr("onClick", "showoption(" + num + "," + prevoption + ");return false;");
    }
    else {
        //show the next bet
        $('#' + visibledivID + ' > .betselection').hide();
        $('#' + visibledivID + ' > #selection_' + option).show();

        $('#' + displaymode + '_pregamebet_' + num).find('.betnum').html(option + "/" + (maxnum));

        //setup prev/next buttons
        $('#' + displaymode + '_pregamebet_' + num).find('.nextbet').attr("onClick", "showoption(" + num + "," + nextoption + ");return false;");
        $('#' + displaymode + '_pregamebet_' + num).find('.prevbet').attr("onClick", "showoption(" + num + "," + prevoption + ");return false;");
    }
}


//Set Number of pregame bets - can we make this dynamic????
var numofpregamebets = 8;

function shownextbet(b) {

    var currentbetid = b;
    var nextpregamebetid = currentbetid + 1;
    var prevpregamebetid = currentbetid - 1;
    var DivtoBeDisplayed;

    if (nextpregamebetid == 1) {
        //we are about to show the firstplayer to score bet!!!!
        DivtoBeDisplayed = 1;
    }
    else if (nextpregamebetid == 2) {
        //we are about to show the first team to score bet!!!!
        DivtoBeDisplayed = 2;
    }

    //hide current bet
    $('#' + displaymode + '_pregamebet_' + currentbetid).hide(10);

    //show next bet
    $('#' + displaymode + '_pregamebet_' + nextpregamebetid).show(10, function () {

        //setup carousel for bet options

        if (displaymode == "m") {
            setupcarousel_mobile(nextpregamebetid, DivtoBeDisplayed);
        }
        else {
            setupcarousel_web(nextpregamebetid, DivtoBeDisplayed);
        }

    });
    //if next bet is max number of bets then it doesn't exist, so hide next button
    if (nextpregamebetid == numofpregamebets) {

        $('.next').hide();

    } else {

        //update next button
        $('.next').removeAttr("style");
        $('.next').attr("onClick", "shownextbet(" + nextpregamebetid + ");return false;");

    }

    //show previous button
    $('.prev').show();
    //update previous button
    $('.prev').attr("onClick", "showprevbet(" + currentbetid + ");return false;");

}

//get previous pregame bet
function showprevbet(b) {

    var currentbetid = b;
    var nextpregamebetid = currentbetid + 1;
    var prevpregamebetid = currentbetid - 1;
    var DivtoBeDisplayed;

    if (currentbetid == 1) {
        //we are about to show the firstplayer to score bet!!!!
        DivtoBeDisplayed = 1;
    }
    else if (currentbetid == 2) {
        //we are about to show the first team to score bet!!!!
        DivtoBeDisplayed = 2;
    }

    //hide current bet
    $('#' + displaymode + '_pregamebet_' + nextpregamebetid).hide(10);

    //show previous bet
    $('#' + displaymode + '_pregamebet_' + currentbetid).show(10, function () {

        //setup carousel for bet options
        if (displaymode == "m") {
            setupcarousel_mobile(nextpregamebetid, DivtoBeDisplayed);
        }
        else {
            setupcarousel_web(nextpregamebetid, DivtoBeDisplayed);
        }
        
    });
        
    //update next button
    $('.next').show();
    $('.next').attr("onClick", "shownextbet(" + currentbetid + ");return false;");

    //if previous bet is 0 then it doesn't exist, so hide previous button
    if (prevpregamebetid == 0) {

        $('.prev').hide();

    } else {

        //update previous button
        $('.prev').attr("onClick", "showprevbet(" + prevpregamebetid + ");return false;");

    }

}



//the following code was originally on layout page - moved here as we want ALL javascript in scripts
$(document).ready(function () {
    // start the ticker 
    //SetTickerContent();  - this has been moved to the getgaemdetails complete function in ui!!!!

    $('#' + displaymode + '_league_menu a').click(function () {

        //alert("Clicked");
        $('#' + displaymode + '_league_menu a').removeClass('activebtn');
        $(this).attr('class', 'activebtn');

    });

    //show friend prediction notification demo   
    //friend_notification();

    //bounce store notification
    bouncenotification();

    setTimeout(function () { window.scrollTo(0, 1); }, 100);

    //***************
    //Following script is for tabbed view on mobile, had to remove coda slider as it sucked on actual iDevices. - John
    //***************                 
    //DEFAULTS....
    $('.panel').hide();
    $('.loading').hide();
    $('#panel1').show();
    $('.tab1 a').attr("class", "current");

    //ON CLICK....
    $("[id^=tab_]").click(function () {
        var panelid = $(this).attr("id").split("_")[1];

        $('.panel').hide();
        $('.coda-nav a').removeAttr("class");
        $('#panel' + panelid).fadeIn('fast');
        $('.tab' + panelid + ' a').attr("class", "current");

        if (panelid == 3) {
            //every time a user lcisk to see the frioends leaderboard - we should tak ethis opportunity to update it!!!!!
            userLeague.GetFriendsLeaderBoard();
        }
        if (panelid == 4) {
            //the mobile user has just clicked on the league TAB

            //changed this Stephen - if the _leaguestandings_1 div is visible - then reload the standings - every time!!!!!!
            if (
                (userLeague)
                &&
                ($('#' + displaymode + '_leaguestandings_1').css('display') == "block")
               )  //&& (userLeague.mobile_APICall_Needed == 1
            {
                //we recieved a league update while we were away from this TAB
                //now that the user has clicked on the TAB we should make an API call to get the latest league info ( as it's changed since we've been away!!!!)

                //update - 1-nov-12
                //i have changed this logic - every time a user clicks this tab and we are currently showing a league - then we should take this opportunity to get the latest and correct league info!!!

                userLeague.GetLeagueTable(userLeague.id, userLeague.name, null, userLeague.creater_Id, userLeague.num_MembersInLeague, "DontDisplayLoadingGif", null, null); //update ticker each time!!!!
                //userLeague.GetLeagueTable(userLeague.id, userLeague.name, null, userLeague.creater_Id, userLeague.num_MembersInLeague,"DontDisplayLoadingGif",null,"dontUpdateTicker");
            }
        }
        else if (panelid == 5) {
            //the user has gone into the bootroom!!!!
            bootroomused = 1;
        }


        return false;
    });
    //***************      
});

//function to call to switch slides in how to play popup!
function showslide(s) {
    var slideid = s;
    $('.howtoslide').hide();
    $('#' + displaymode + '_howtoslide' + slideid).fadeIn('slow');
    $('body').scrollTop(0);
}

//show peno shootout UI
function showpenos() {
    $('.pitch-container').fadeOut("fast", function () {
        $('.peno-container').fadeIn("slow");
        $('.penalty-score').fadeIn("slow");
    });
}

//new tooltips added by John - mobile only
function openCoachmarks() {
    
    $(".definitionlabel").html("<strong>Help</strong><br />Tap ? for more info");
    $('#' + displaymode + '_coachmarks').show();

}
//help text for tooltips
function showdefinition(t) {

    var helptext = t;
    $(".definitionlabel").html(helptext);

}
function closeCoachmarks() {

    $('#' + displaymode + '_coachmarks').hide();    
    
}


//function friend_notification() {

//    var notifyDiv = $('#' + displaymode + '_friend_notification');

//    notifyDiv.append('<div clas="notification_wrapper"><img src="http://himages.t5mgn.com/67.jpg" border="0" alt="Profile Pic" /><span class="tick"></span><span>Harry McCarthy made a prediction</span></div>');

//    notifyDiv.animate({ top: '0px' }, 1000).delay(2000).animate({ top: '-50px' }, 500, function () {
//        notifyDiv.hide();
//        notifyDiv.Empty();
//    });

//}

function friend_notification(img, displaytext) {

    try
    {
        var notifyDiv = $('#' + displaymode + '_friend_notification');
        var Correctimg;

        if (img.indexOf("http") == 0) {
            Correctimg = img;
        }
        else {
            Correctimg = facebookprofilepicurl + img;
        }

        notifyDiv.append('<div clas="notification_wrapper"><img src="' + Correctimg + '" border="0" alt="Profile Pic" /><span class="tick"></span><span>' + displaytext + '</span></div>');

        notifyDiv.show();
        notifyDiv.animate({ top: '0px' }, 1000).delay(2000).animate({ top: '-50px' }, 500, function () {
            notifyDiv.hide();
            notifyDiv.html("");
            //notifyDiv.Empty();
        });
    } catch (ex) { }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////



/* * * * * * * *
*
* Use this for high compatibility (iDevice + Android)
*
*/
//document.addEventListener('DOMContentLoaded', setTimeout(function () { loaded(); }, 200), false);
/*
* * * * * * * */


/* * * * * * * *
*
* Use this for iDevice only
*
*/
//document.addEventListener('DOMContentLoaded', loaded, false);
/*
* * * * * * * */


/* * * * * * * *
*
* Use this if nothing else works
*
*/
//window.addEventListener('load', setTimeout(function () { loaded(); }, 200), false);
/*
* * * * * * * */


//$(window).load(function () {
//    $('#featured').orbit({
//        animation: 'horizontal-push',
//        directionalNav: false,
//        animationSpeed: 800,
//        timer: false
//    });

//    ////fade in a popup overlay over the pitch to display result
//    //$('.popup-notify').fadeIn(200).delay(3000).fadeOut(200);

//});


//new eamil code

function show_registration() {

    $('#' + NewDisplayMode + '_registration_form').show();
    $('#' + NewDisplayMode + '_confirm').hide();
    show_login();
}

function cancel_registration() {

    //hide registration popup and reset default visiblities
    $('#' + NewDisplayMode + '_registration_form').hide();
    $('#' + NewDisplayMode + '_register').show();
    $('#' + NewDisplayMode + '_confirm').hide();
    $('#' + NewDisplayMode + '_login').hide();
    $('#' + NewDisplayMode + '_forgotpass').hide();
    //switch active colours on tabs
    $('#' + NewDisplayMode + '_login_tab').css({ background: "#999" });
    $('#' + NewDisplayMode + '_register_tab').css({ background: "#222" });

}

function confirm_registration() {

    $('#' + NewDisplayMode + '_register').hide();
    $('#' + NewDisplayMode + '_confirm').fadeIn();
    $('#' + NewDisplayMode + '_registerdetails').html(""); //clear previous warning data
    $('#' + NewDisplayMode + '_logindetails').html(""); //clear previous warning data
    $('#' + NewDisplayMode + '_resenddetails').html("");
}

function show_login() {

    $('#' + NewDisplayMode + '_passResent').hide();
    $('#' + NewDisplayMode + '_forgotpass').hide();
    $('#' + NewDisplayMode + '_register').hide();
    $('#' + NewDisplayMode + '_confirm').hide();
    $('#' + NewDisplayMode + '_login').fadeIn();
    //switch active colours on tabs
    $('#' + NewDisplayMode + '_login_tab').css({ background: "#222" });
    $('#' + NewDisplayMode + '_register_tab').css({ background: "#999" });
}

function show_registerform() {

    $('#' + NewDisplayMode + '_login').hide();
    $('#' + NewDisplayMode + '_forgotpass').hide();
    $('#' + NewDisplayMode + '_register').fadeIn();
    //switch active colours on tabs
    $('#' + NewDisplayMode + '_login_tab').css({ background: "#999" });
    $('#' + NewDisplayMode + '_register_tab').css({ background: "#222" });
}

function forgot_pass() {

    $('#' + NewDisplayMode + '_login').hide();
    $('#' + NewDisplayMode + '_forgotpass').fadeIn();

}
/////end email code

