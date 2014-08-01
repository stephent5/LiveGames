@Code
    ViewData("Title") = "Ref!!!!!"
End Code
  
    <input type="hidden" id="friendList" runat="server"   />
    <div class="flipwarning"></div>
    
    <div class="gameplay">
        
        <div class="gameplay-screen">
            
            <div class="gameinfo" style="display:none">
				<h1>
                    <span class="hometeam" id="home_team"></span>                    
                    <div class="home_score"><span id="home_score"></span></div>
                    <div class="away_score"><span id="away_score"></span></div>					
                    <span class="awayteam" id="away_team"></span>             
				</h1>              
			</div>

            <div class="userinfoclick">
                <a onclick="ToggleUserInfo();return false;" href="#"><span></span>&nbsp;Menu</a>
            </div>
            <div class="pregameclick" onclick="GetPreGameBetDetails();return false;">
                <a href="#">Pre-Game Bets</a>
                <span class="numPregame">0</span>
            </div>
            <div class="helpclick" style="display:none;" onclick="ShowTips();return false;">
                <a id="helpclickbtn" href="#"><span>?</span>&nbsp;Help!</a>
            </div>
            <div class="creditsmanagerclick" style="display:none;" onclick="ToggleCreditsmanager();return false;">
                <a id="creditsmanagerclickbtn" href="#"><span>$</span>&nbsp;1-Click Bets</a>
            </div>
            <div class="powerplayclick" style="display:block;" onclick="startpowerplay();return false;">
                <a id="powerplayclickbtn" href="#"><span>P</span>&nbsp;Start 10-min Power Play!</a>
            </div>

            <div class="powerplaytimer" style="display:none;">
                10:00
            </div>

            <div class="unlockcreditsDiv" style="display:none;">
                <span></span><span id="unlockcreditsSpan"></span>
            </div>

            <!-- forfeit bet -->
            <div onclick="forfeitpopup();return false;" class="forfeitclick">
                <span>Forfeit Bet</span>
                <span id="forfeitnum"></span>
            </div>

            <div class="powerplaytitle">Power Play Active</div>

            <!--credit manager-->
            <div id="creditsmanager" class="popup-placebet">
                <div class="details">
                    <h4>Select your default Credit amount for 1-Click Bets</h4>                     
                    <div class="checkcontainer">
                        <div class="check">
						    <input type="radio" name="storecredits" id="storecredits1" value="10" >
						    <label class="credit_amount" for="storecredits1">
							    10
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="storecredits" id="storecredits2" value="25" >
						    <label class="credit_amount" for="storecredits2">
							    25
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="storecredits" id="storecredits3" value="50"  >
						    <label class="credit_amount" for="storecredits3">
							    50
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="storecredits" id="storecredits4" value="75" >
						    <label class="credit_amount" for="storecredits4">
							    75
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="storecredits" id="storecredits5" value="100" />
						    <label class="credit_amount" for="storecredits5">
							    100
						    </label>
					    </div>
                    <br clear="all"/>
                    </div>  
                    <div class="check bonus" id="StoreBonusCredits200" style="display:none;" >
						<input type="radio" name="storecredits" id="storecredits6" value="200" />
						<label class="credit_amount" for="storecredits6">
							200
						</label>
					</div>
                    <div class="check first">
						<input type="radio" name="storecredits" id="storecredits0" value="0" />
						<label class="credit_amount" for="storecredits0">
							None
						</label>
					</div>
                    <div class="button" id="confirm_1click" onclick="storeOneClickCreditValue();return false;">Confirm</div>
					<div class="button-alt" id="cancelCreditsManager" onclick="ToggleCreditsmanager();return false;">Cancel</div>
                </div>
            </div>

            <!-- reconnectind DIV -->
            <div id="reconnectstatus" style="display:none;">
                <div class="message">&#8646; Connection Lost. Reconnecting now...</div>
                <div class="tooltip-shade"></div>
            </div>
            <!---->
            
            <script type="text/javascript">
                //function to call to switch slides in how to play popup!
                function showslide(s) {
                    var slideid = s;
                    $('.howtoslide').hide();
                    $('#howtoslide' + slideid).fadeIn('slow');
                    $('body').scrollTop(0);
                }            
            </script>

            <!-- game tutorial -->
            <div class="howtopopup" id="howtotutorial" style="display:none;">                
                
                <h1>How to Play!</h1>   
                
                <div class="slidecontainer">
                    
                    <div id="howtoslide2" class="howtoslide" style="display:block;">
                        <h2>Get to know the Game Interface</h2>             
                        <img src="/Images/help-ui.png" border="0" alt="" style="max-width:550px;margin:auto;" class="webimage" />                        
                        <img src="/Images/help-ui-mobile.png" border="0" alt="" style="max-width:550px;margin:auto;" class="mobileimage" /> 
                        <span onClick='showslide(3);return false;' class='navbtn'>Place Bets <strong>&#8250;</strong></span>                        
                    </div>

                    <div id="howtoslide3" class="howtoslide" style="display:none;">
                        <h2>How do I place a Bet?</h2>             
                        <p>There are 2 types of Bets in T5Live Games, Pre-Game Bets and In-Game Bets. You can bet the following Credit amounts: 10, 25, 50, 75 and 100.</p>
                        <p><strong>Pre-Game Bets</strong><br />Before a Match kicks off you have the opportunity to win some extra Credits during a game. You can place a bet on the First Team to Score, the Half-Time result, the Full-Time result and the Number of Free-kicks in each half. You can review these Bets during 
                        the game by clicking on 'Pre-Game Bets'.</p>
                        <br />
                        <span onClick='showslide(2);return false;' class='navbtn'><strong>&#8249;</strong> Game Play</span>
                        <span onClick='showslide(4);return false;' class='navbtn'>In-Game Bets <strong>&#8250;</strong></span>
                    </div> 

                    <div id="howtoslide4" class="howtoslide" style="display:none;">
                        <h2>How do I place a Bet?</h2>             
                        <p><strong>In-Game Bets</strong><br />During gameplay you will see 10 markers on the pitch. These markers represent 10 events that take place during a game, each event has odds based on their likelyhood.</p>
                        <p style="text-align:center;">
                            <img src="/Images/howto-markers.png" border="0" alt="" style="border-radius:5px;-moz-border-radius:5px; max-width:400px;margin:auto;" class="webimage" />
                            <img src="/Images/howto-markers-mobile.png" border="0" alt="" style="border-radius:5px;-moz-border-radius:5px; max-width:400px;margin:auto;" class="mobileimage" />
                        </p>
                        <p>Each team has 4 events associated with them, GOAL, WIDE, CORNER and SAVE. You can differentiate between these by the team colours. There are also 2 generic events, THROW IN and FREE-KICK.</p>
                        <p>To place a bet, click on the event of your choosing, you will be presented with a popup which allows you to select the amount of credits you are willing to risk.</p>
                        <p><strong>1-Click Bets</strong><br />If you want to make bet placing faster, setup 1-Click bets. This allows you to set a fixed credit amount which you always bet with, removing the time spent selecting your bet amount.</p>
                        <p class="webimage">To set this up, click on '1-Click Bets' on the right hand side of the game screen. You can now select the fixed credits amount. Select 'None' if you want to turn this feature off.</p>
                        <p class="mobileimage">To set this up, click on 'Menu' at the top of the game screen, then select '1-Click Bets'. You can now select the fixed credits amount. Select 'None' if you want to turn this feature off.</p>
                        <br />
                        <span onClick='showslide(3);return false;' class='navbtn'><strong>&#8249;</strong> Pre-Game Bets</span>
                        <span onClick='showslide(5);return false;' class='navbtn'>Play with Friends <strong>&#8250;</strong></span>
                    </div>

                    <div id="howtoslide5" class="howtoslide" style="display:none;">
                        <h2>How to Play with Friends</h2>            
                        <p>During Gameplay you will see a Friends Leaderboard as well as the Overall Leaderboard. If your Friends are playing they will appear in your Friends Leaderboard along with their score.</p>
                        <p style="text-align:center;">
                            <img src="/Images/howto-friends.png" border="0" alt="" style="border-radius:5px;-moz-border-radius:5px; max-width:300px;margin:auto;" class="webimage" />
                            <img src="/Images/howto-friends-mobile.png" border="0" alt="" style="border-radius:5px;-moz-border-radius:5px; max-width:300px;margin:auto;" class="mobileimage" />
                        </p>
                        <p>Whenever your friends place a bet you will see a 'Bet Placed' icon beside their name.</p>                         
                        <span onClick='showslide(4);return false;' class='navbtn'><strong>&#8249;</strong> In-Game Bets</span>
                    </div>  

                    <br clear="all" />
                </div>
                
                <br clear="all" />
                <span class="button" onClick="showhowtoplay();">I get it, Let's Play!</span>
            </div> 
            <div class="tooltip-shade" style="display:none;"></div>


            <!-- for feit confirm -->

            <div class="popup-placebet" id="forfeitconfirm">
				<div class="details">					
					<h4></h4>
					<br clear="all"/>
					<div class="button" id="forfeitconfirmbutton">Confirm</div>
					<div class="button-alt" id="forfeitcancel" onClick="closeforfeitpopup();">Cancel</div>
                    <div align="center"><br/>
                    <input type="checkbox" name="dontshowforfeit" id="dontshowforfeit" checked/> Don't show this popup again!<br/>
                    <br/>
                    </div>
				</div>				
			</div>

            
        	<!-- bet -->
			<div class="popup-placebet" id="popupplacebet">
				<div class="details">					
					<h4></h4>
					 <div class="checkcontainer">
                         <div class="check">
						    <input type="radio" name="credits" id="credits1" value="10"  >
						    <label class="credit_amount" for="credits1">
							    10
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="credits2" value="25">
						    <label class="credit_amount" for="credits2">
							    25
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="credits3" value="50" checked>
						    <label class="credit_amount" for="credits3">
							    50
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="credits4" value="75">
						    <label class="credit_amount" for="credits4">
							    75
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="credits5" value="100">
						    <label class="credit_amount" for="credits5">
							    100
						    </label>
					    </div>
                        <br clear="all"/>
                    </div>
                    <div class="check bonus" id="BonusCredits200" style="display:none;" >
						<input type="radio" name="credits" id="credits6" value="200" />
						<label class="credit_amount" for="credits6">
							200
						</label>
					</div>
					<br clear="all"/>
					<div class="button" id="confirm">Confirm</div>
					<div class="button-alt" id="cancel" onClick="closepanel();">Cancel</div>
				</div>				
			</div>

            <div class="popup-notify" id="popup-notify">
                <h1>GOAL!</h1>
            </div>
            			
            <div class="halftime" style="display:none"> 
                <div style="font-size:1.5em;"><span class="match_desc"></span></div>
                <img class="game-desc-image" border="0" style="max-width:100%;"/>
                <br />
                Half Time<br /><br />
                <a onClick="showhowtoplay();" href="#">How to play?</a>
            </div>
            <div class="fulltime" style="display:none"> 
                <div style="font-size:1.5em;"><span class="match_desc"></span></div>
                <img class="game-desc-image" border="0" style="max-width:100%;"/>
                <br />
               Full Time
            </div>
            <div class="match-notstarted" style="display:none"> 
                <div style="font-size:1.5em;"><span class="match_desc"></span></div>
                <img class="game-desc-image" border="0" style="max-width:100%;"/>
                <br />
                Awaiting Kick Off<br /><br />
                <a onclick="GetPreGameBetDetails();return false;" href="#">Place Pre-Game Match Bets</a> &nbsp;
                <a onClick="showhowtoplay();" href="#">How to play?</a>
            </div>
            
            <div id="tooltips" style="display:none;">
                <div class="tooltip-home-wide">Wide</div>
                <div class="tooltip-home-goal">Goal</div>
                <div class="tooltip-home-corner">Corner</div>
                <div class="tooltip-home-save">Save</div>

                <div class="tooltip-away-wide">Wide</div>
                <div class="tooltip-away-goal">Goal</div>
                <div class="tooltip-away-corner">Corner</div>
                <div class="tooltip-away-save">Save</div>

                <div class="tooltip-freekick">Free-kick</div>
                <div class="tooltip-throwin">Throw In</div>
                <div class="tooltip-shade-bg" onclick="ShowTips();return false;"></div>
            </div>

			<!-- pitch -->
			<div class="pitch-container">
                <div class="pitch-icons"></div>
				<canvas class="pitch" id="pitch" width="834" height="157"></canvas>
			</div> 

           <audio id="audio" style="display:none"></audio>
			
           <div id="slide4" class="slidepanel">
                <div id="wrapperpopup">
                    <div id="popup" class="gamemenu">
                            
                            <div class="pregameclick" onclick="slider(4);GetPreGameBetDetails();return false;">
                                <a href="#">Pre-Game Bets</a>
                                <span class="numPregame">0</span>
                            </div>                            
                            
                            <div onclick="slider(4);ToggleCreditsmanager();return false;">
                                <a id="creditsmanagerclickbtn" href="#"><span>$</span>&nbsp;1-Click Bets</a>
                            </div>           
                            
                            <div onclick="slider(4);ShowTips();return false;">
                                <a id="helpclickbtn" href="#"><span>?</span>&nbsp;Help!</a>
                            </div>                 

                            <div onclick="startpowerplay();return false;">
                                <a id="powerplayclickbtn" href="#"><span>P</span>&nbsp;Start Power Play!</a>
                            </div>
                    </div>
                </div>
            </div><!--/end slide -->
            
            <div class="game-control">
                <div class="button-1" onClick="slider(1); refreshScroller(GameFeedScroller, 'GameFeedInfo');" id="slidebtn1"><img src="/images/icon_timer.png" border="0" alt="Game Tracker" /> <span>Tracker</span></div>
                <div class="button-1" onClick="slider(2); refreshScroller(friendsScoreScroller, 'FriendsLeaderboard');" id="slidebtn2"><img src="/images/icon_friends.png" border="0" alt="Friends" /> <span>Friends</span></div>
                <div class="button-1" onClick="slider(3); refreshScroller(leaderboardScroller, 'LeagueLeaderboard');" id="slidebtn3"><img src="/images/icon_leagues.png" border="0" alt="My Leagues" /> <span>Scores</span></div>
                <div class="button-1" onClick="slider(4); refreshScroller(popupScroller, 'popup');" id="slidebtn4"><img src="/images/icon_star.png" border="0" alt="My Leagues" /> <span>Menu</span></div>
            </div>

            <div class="game-control-close">
                <div class="close-btn" onClick="slider(0);">X</div>
            </div>

            <div class="pregame-betpanel">                        
                    <div class="pregame-bets" style="text-align:center;">
                        <span style="font-weight:bold; font-size:1.5em; padding:3px 0px 3px 0px; display:block;">Place extra bets on the Game before it kicks off...</span>                        
                    </div>             
                    <!-- featured div gets populated by Ajax function ShowPreGameBets  -->
                    <div id="BetHTML"></div>

                    <div style="text-align:center; padding-top:10px;">
                        <div class="button" id="confirm_pregame" onclick="placePreGameBets();">Place All Bets</div>
					    <div class="button-alt" id="cancel_pregame" onclick="closePreGamepanel();">Cancel</div>
                        <br clear="all" />
                    </div>
            </div><!-- pregame-betpanel div -->   
            
        </div><!--/ end #gameplay-screen -->  
            			
        <div id="gamefeed">
			    
            <div id="slide1" class="split-column slidepanel">
				<div class="tabs"><img src="/images/icon_timer.png" style="height:36px;" border="0" alt="Game Tracker" /><span>Game Tracker</span></div>
				    <div id="wrapper">
					<div class="GameFeedInfo">
                    </div>
                </div>
			</div> 		
            <div id="slide2" class="split-column slidepanel">
				<div class="tabs"><img src="/images/icon_friends.png" border="0" alt="Friends" /><span>Friends  <input style="display:none" id="FriendInviteButton" type="button" onclick="InviteFriendsToPlayAGame(); return false;" value="Play This Game Against Friends" /> </span></div>
				<div id="wrapper2">
                        <div id="FriendsLeaderboard" class="Myleagues">  
				        </div>
                    <div class="FriendFeedInfo">
					</div>   
                    </div>             
			</div>	    
            <div id="slide3" class="split-column slidepanel">   
                <div class="tabs"><img src="/images/icon_leagues.png" border="0" alt="My Leagues" /><span class="up">Overall Leaderboard</span></div>                    
                <div id="wrapper3">
                    <div id="leaguespanel">
                        <div id="MyleagueInvites"></div>		
                        <div id="Myleagues" class="Myleagues"></div> 
                           
                        <div id="LeagueLeaderboard"></div>	
                           
                    </div>
                </div>
            </div>   
                
        </div><!--/ end #gamefeed-->            
                 
    </div><!--/ end #gameplay-->

    @*Include the scripts here that we need for the GamePlay*@     
    @Section GamePlayScripts
          <script type="text/javascript">
              $(document).ready(function () {
                  try {
                      //we no longer do the two lines below here 
                      //instead we do them as soon as we have created the LightStreamer functions in lsbind
                      //fixture = "@ViewBag.fixture";
                      setTimeout("CheckConnection();", (timeBetweenLightstreamConnections * 1000));    //check our connection 

                      //disable all other dropdowns when you have selected one, prevents 'Next', 'Previous' button from working
                      $("select").focus(function (e) {
                          $("select").not(this).attr('disabled', 'true');
                      });
                      //onBlur remove disabled attribute from all selects
                      $("select").blur(function (e) {
                          $("select").not(this).removeAttr('disabled');
                      });
                  }
                  catch (ex) {
                      //logError("Document.Ready", ex);
                  }
              });
          </script>
    End Section






 