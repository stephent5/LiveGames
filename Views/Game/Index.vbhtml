@Code
    ViewData("Title") = "King of the Kop - Live Interactive Football"
End Code
  
    <input type="hidden" id="friendList" runat="server"   />
    <div class="flipwarning"></div>
        
    @*<div class="connectionstatus">Disconnected</div>*@
	
    <div id="gameplay">
        
        <div class="friend_notification" id="w_friend_notification"></div>

        <div class="flipwarning-tab"></div>

        <div class="gameplay-screen">

         <div id="AdminButtons" style="width:100%; text-align:center; display:none;">
			<div class="tabpanel" id="gamefeed_panel_0">
                <div class="button-update" id="setLive" onclick="admin.setLive(); return false;" style="display:none">Game is not live!!!!</div>
                <div class="button-update" id="EventID11" onclick="admin.sendEvent(11,'Start Match'); return false;" style="display:none">Start Game</div>
				<div class="button-update" id="EventID12" onclick="admin.sendEvent(12,'SET HALF TIME'); return false;" style="display:none">Set Half Time</div>
				<div class="button-update" id="EventID13" onclick="admin.sendEvent(13,'START 2ND HALF'); return false;" style="display:none">Start 2nd Half</div>
				<div class="button-update" id="EventID14" onclick="admin.sendEvent(14,'SET FULL TIME'); return false;" style="display:none">Set Full Time</div>
				<div class="button-update" id="EventFullTime" onclick="return false;" style="display:none">Full Time</div>
                <div class="button-update" id="ShowAwardPrizes" onclick="admin.ShowAwardPrizes(); return false;" style="display:none;">Award Prizes</div>
                <br /><br />
				<div class="button-update" id="EventID22" onclick="admin.freezeBets(); return false;" style="display:none;">Freeze Bets!!</div>
				<div class="button-update" id="EventID23" onclick="admin.thawBets(); return false;" style="display:none;">Thaw Bets!!</div>
			</div>
		</div>
        
<div id="AdminExtraButtons" style="display:none;">
<div><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/admin_ticker.png" border="0" alt="Edit Ticker Text" onclick="admin.DisplayEditTickerText();return false;" /></div>
    <div><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/admin_EDIT.png" border="0" alt="Edit Match Details" onclick="admin.DisplayEditMatchPopUp();return false;" /></div>
    <div><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/admin_goalscorer.png" onclick="admin.ShowAddGoalScorerPanel();return false;" border="0" alt="Add Goal Scorer" /></div>
    <div onclick="admin.previewPitch();return false;" id="previewpitchdiv" ><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/admin_previewpitch.png" border="0" alt="Preview Pitch" /></div>
    <div onclick="admin.sendBroadcastMessage(26, 'OOPS MESSAGE');return false;"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/admin_oops.png" border="0" alt="Oops" /></div>
    <div onclick="admin.sendBroadcastMessage(24, 'NOT A SAVE MESSAGE');return false;"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/admin_nosave.png" border="0" alt="Not a Save" /></div>
    <div onclick="admin.ShowNotificationPanel();return false;"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/FBNotifications.png" border="0" alt="Notifications" /></div>
</div>
            
<div class="gameinfo" style="display:none">
<h1>
    <span class="hometeam" id="w_home_team"></span>                    
    <div class="home_score"><span id="w_home_score"></span></div>
    <div class="away_score"><span id="w_away_score"></span></div>					
    <span class="awayteam" id="w_away_team"></span>             
</h1>              
</div>

        <div class="notification-bubble" style="display:none;">
            <span class="text">Buy extra <strong>Power Plays, Forfeits and Credits</strong> in the Store!</span>
            <div class="bubble-arrow-border"></div>
            <div class="bubble-arrow"></div>
        </div>

        <div id="gameoptions">
            <div class="userinfoclick">
                <a onclick="ToggleUserInfo();return false;" href="#"><span></span>&nbsp;Menu</a>
            </div>
            <div class="pregameclick" style="display:none;" onclick="GetPreGameBetDetails();return false;">
                <a href="#">Pre-Game Predictions</a>
                <span class="numPregame">0</span>
            </div>
            <div class="helpclick" style="display:none;" onclick="ShowTips();return false;">
                <a id="w_helpclickbtn" href="#"><span>?</span>Help!</a>
            </div>
           
             <div class="creditsmanagerclick" style="display:none;" onclick="ToggleCreditsmanager();return false;">
           @*  <div class="creditsmanagerclick" style="display:none;" onclick="InviteFriends();return false;">*@
                    <a id="w_creditsmanagerclickbtn" href="#"><span>$</span>1-Click Mode</a>
            </div>

            <div class="powerplayclick" style="display:none;" onclick="powerplaypopup();return false;">
                <a id="w_powerplayclickbtn" href="#" onclick="return false;"><span>P</span>Power Play</a>
            </div>            

            <div class="invitefriendsclick" id="InviteClick" style="display:none;" onclick="InviteFriends();return false;">
                 <a href="#" onclick="return false;"><span>!</span>Invite</a>
            </div>

            <div class="powerplaytimer" style="display:none;" id="w_powerplaytimertext" onclick="powerplaypopup();  return false;">
                10:00
            </div>

            @*<br /><br /><br />

            <div id="m_powerplaytimertest" onclick="powerplaypopupTest(); return false;">
                    ||||||**TestTestTest**ZZZ
            </div>*@

            <div class="unlockcreditsDiv_locked" style="display:none;">
                <span></span><span>Unlock <strong>200</strong> Credit Limit after <span id="w_UnlockNumBetsSpan"></span></span>
            </div>
            <div class="betnum" style="display:none;"></div>

            <div class="unlockcreditsDiv" style="display:none;">
                <span></span><span id="w_unlockcreditsSpan"></span>
            </div>
        </div>

             <!-- demo UI for Penalty shootout -->
             <div class="penalty-score" style="display:none;">
                <span>Penalty Shootout</span>
                <span class="homescore">2</span>
                <span class="divider"> - </span>
                <span class="awayscore">2</span>
            </div>

            <!-- forfeit bet -->
            <div onclick="forfeitpopup();return false;" class="forfeitclick">
                <span>Forfeit!</span>
                <span id="w_forfeitnum" class="forfeitnum"></span>
            </div>

            <!--credit manager-->
            <div id="w_creditsmanager" class="creditsmanager popup-placebet">
                <div class="details">
                    <h4>Select your default Credit amount for 1-Click Predictions</h4>                     
                    <div class="checkcontainer">
                        <div class="check">
						    <input type="radio" name="w_storecredits" id="w_storecredits1" value="10">
						    <label class="credit_amount" for="w_storecredits1">
							    10
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="w_storecredits" id="w_storecredits2" value="25">
						    <label class="credit_amount" for="w_storecredits2">
							    25
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="w_storecredits" id="w_storecredits3" value="50">
						    <label class="credit_amount" for="w_storecredits3">
							    50
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="w_storecredits" id="w_storecredits4" value="75" >
						    <label class="credit_amount" for="w_storecredits4">
							    75
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="w_storecredits" id="w_storecredits5" value="100" />
						    <label class="credit_amount" for="w_storecredits5">
							    100
						    </label>
					    </div>
                    <br clear="all"/>
                    </div>  
                    <div class="check bonus" id="w_StoreBonusCredits200" style="display:none;" >
						<input type="radio" name="w_storecredits" id="w_storecredits6" value="200" />
						<label class="credit_amount" for="w_storecredits6">
							200
						</label>
					</div>
                    <div class="check first">
						<input type="radio" name="w_storecredits" id="w_storecredits0" value="0" />
						<label class="credit_amount" for="w_storecredits0">
							None
						</label>
					</div>
                    <div class="button" id="confirm_1click" onclick="storeOneClickCreditValue();return false;">Confirm</div>
					<div class="button-alt" id="cancelCreditsManager" onclick="ToggleCreditsmanager();return false;">Cancel</div>
                </div>
            </div>

            <!-- reconnectind DIV -->
            <div id="w_reconnectstatus" style="display:none;">
                <div class="message">&#8646; Connection Lost. Reconnecting now...</div>
                <div class="tooltip-shade"></div>
            </div>

            <div id="w_leavepagestatus" style="display:none;">
                <div class="message" id="w_leavepagemessage">&#8646; sdgdfghdfhfghfgjhfgj</div>
                <div class="tooltip-shade"></div>
            </div>

            <!---->

            <!-- nickname editor-->
            <div class="nicknamepopup" style="display:none;">                    
                <h4>My Account</h4>
                <div style="width:49%;float:left;color:#fff; text-align:center;">
                    <p><strong>You have <span class="credits" style="line-height:auto;"></span> Credits.</strong></p>
                    <p style="display:none;"><br />Connection: <strong><span id="connmethod"></span></strong></p>
                    <br />
                    <strong>Choose a nickname to appear in the overall leaderboard</strong>
                    <input type="text" id="w_nicknameValue"  maxlength="25" value="" placeholder="Nick Name" />
                    <div class="button" id="w_confirm_nn">Confirm</div>
                    <br />
                    <div id="w_changepass">
                        <br />
                        <p><strong>Reset your Password</strong></p>
                        <input type="password" id="w_oldpass" maxlength="25" value="" placeholder="Old Password" />                    
                        <input type="password" id="w_newpass" maxlength="25" value="" placeholder="New Password" />
                        <br /><p id="w_cpresult"></p>
                        <div class="button" id="w_confirm_pass" onClick="Login.ChangePassword(); return false;">Update</div>
                   </div>
                </div>
                <div  style="width:50%; float:left; color:#fff; text-align:center; border-left:1px solid #444;">                    
                    <br />
                    <p><span style='font-weight:bold; font-size:1.2em; display:inline-block; padding-bottom:5px;'>Purchase History</span></p>
                    <div id="w_scroll_storepurchases" class="scrollable">
                        <div id="w_storepurchases">
                        </div>
                    </div>                    
                </div>       
                <br clear="all" />
                <div class="button-alt" id="cancel_nn" onclick="nickNameCancel();  return false;">Exit</div>             
                          
            </div>

            <!-- store -->
            <div class="storepopup" id="w_store" style="display:none; text-align:center;">                    
                <div style="color:#fff;">
                    <div class="storeheader"><h4>Store</h4></div>
                    <br /><br />
                    <div id="w_inventory">
                    @*    <div style="width:25%; float:left; text-align:center;">
                             <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-200limit.png" border="0" alt="200"  /><br />
                             <strong>€1.50</strong><br />
                             <div class="button" onclick="confirmpurchase(1);">BUY</div>
                        </div>
                        <div style="width:25%; float:left; text-align:center;">
                             <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-pp.png" border="0" alt="Power Play" /><br />
                          ¬   <strong>€0.99 each</strong><br />
                             <div class="button" onclick="confirmpurchase(2);">BUY</div>
                        </div>
                        <div style="width:25%; float:left; text-align:center;">
                             <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-forfeit.png" border="0" alt="Forfeit" /><br />
                             <strong>€0.99 each</strong><br />
                             <div class="button" onclick="confirmpurchase(3);">BUY</div>
                        </div>
                         <div style="width:25%; float:left; text-align:center;">
                             <  img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-credits.png" border="0" alt="Forfeit" /><br />
                             <strong>€1.00 x 1000</strong><br />
                             <div class="button" onclick="confirmpurchase(4);">BUY</div>
                        </div>
                        <br clear="all" />
                        *@
                        @*this is just here for ipad test!!!!!*@
                        @*  <div style="width:25%; float:left; text-align:center;"> <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-credits.png" border="0" alt="200"  />
                                <br />  
                        </div>
                        
                        <div style="width:25%; float:left; text-align:center;"> <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-200limit.png" border="0" alt="200"  />
                            <br />
                        </div>
                        
                        <div style="width:25%; float:left; text-align:center;"> <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-forfeit.png" border="0" alt="200"  /><br /> 
                               
                        </div>
                        
                        <div style="width:25%; float:left; text-align:center;"> <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-pp.png" border="0" alt="200"  /><br /> 
                               
                        </div>*@
                    </div>
                    <div id="w_checkout" style="display:none;">
                        <span class="itemdescriptiondetails"></span>
                        <span class="itempurchasedetails"></span>
                         @* <input type="number" value="1" name="quantity" min="1" class="quantity" />*@
                         @* <div class="button">Confirm</div>*@
                        <div class="button" onclick="Store.resetinventory();return false;">View Other Items</div>
                    </div>
                    <span onclick="Store.showstore();  return false;" class="button-alt">Exit</span>
                </div>
            </div>

            <!-- game tutorial -->
            <div class="howtopopup" id="w_howtotutorial" style="display:none;">                
                
                <h1>Game Training</h1>   
                
                <div class="slidecontainer">
                    
                    <div id="w_howtoslide2" class="howtoslide" style="display:block;">
                        <h2 style="text-align:center;">Welcome to Training <span class="username"></span>, Let's start with a Warm-Up!</h2>             
                        <p><strong>Game Objectives</strong><br />Like every Game the objective is to WIN! To win you need to finish the game at the top of the overall leaderboard (or top of your Friends leaderboard for bragging rights!).</p>
                        <p>To advance up the leaderboard you need to WIN Credits. You Win Credits by predicting what will happen next in the game correctly. Use 1-Click Mode, Forfeits and Power Plays to help your game!</p>
                        <br /><span onClick='showslide(3);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>                        
                    </div>

                    <div id="w_howtoslide3" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How do I make a Prediction?</h2>             
                        <p>There are 2 types of Predictions in KING OF THE KOP, Pre-Game Predictions and In-Game Predictions. You can place the following Credit amounts: 10, 25, 50, 75 and 100.</p>
                        <p><strong>Pre-Game Predictions</strong><br />Before a Match kicks off you have the opportunity to win some extra Credits during a game. You can make a prediction on the First Team to Score, the Half-Time result, the Full-Time result and the Number of Free-kicks in each half. You can review these Predictions during 
                        the game by clicking on 'Pre-Game Predictions'.</p>
                        <br />
                        <span onClick='showslide(2);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>
                        <span onClick='showslide(4);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div> 

                    <div id="w_howtoslide4" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How do I make a Prediction?</h2>             
                        <p><strong>In-Game Predictions</strong><br />During gameplay you will see 10 markers on the pitch. These markers represent 10 events that take place during a game, each event has odds based on their likelyhood.</p>
                        <p>
                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon-helper-v2.png" border="0" alt="" style="width:100%;" />                            
                        </p>
                        <p>Each team has 4 events associated with them, GOAL, WIDE, CORNER and SAVE. You can differentiate between these by the team colours. There are also 2 generic events, THROW IN and FREE-KICK.</p>
                        <p>To make a Prediction, click on the event of your choosing, you will be presented with a popup which allows you to select the amount of credits you are willing to risk.</p>
                        <p><strong>1-Click Predictions</strong><br />If you want to make Predictions faster, setup 1-Click-mode. This allows you to set a fixed credit amount which you always make Predictions with, removing the time spent selecting your credit amount.</p>
                        <p class="webimage">To set this up, click on '1-Click-Mode' on the right hand side of the game screen. You can now select the fixed credits amount. Select 'None' if you want to turn this feature off.</p>
                        <p class="mobileimage">To set this up, click on 'Powerups' on the game menu, then select '1-Click Mode'. You can now select the fixed credits amount. Select 'None' if you want to turn this feature off.</p>
                        <br />
                        <span onClick='showslide(3);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>
                        <span onClick='showslide(5);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div>

                    <div id="w_howtoslide5" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How to Play with Friends</h2>            
                        <p>During Gameplay you will see a Friends Leaderboard as well as the Overall Leaderboard. If your Friends are playing they will appear in your Friends Leaderboard along with their score.</p>
                        <p style="text-align:center;">
                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/howto-friends.png" border="0" alt="" style="border-radius:5px;-moz-border-radius:5px; max-width:300px;margin:auto;" class="webimage" />
                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/howto-friends-mobile.png" border="0" alt="" style="border-radius:5px;-moz-border-radius:5px; max-width:300px;margin:auto;" class="mobileimage" />
                        </p>
                        <p>Whenever your friends makes a Predictions you will see a 'Prediction Made' icon beside their name.</p>                         
                        <span onClick='showslide(4);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>                        
                        <span onClick='showslide(6);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div> 
                    
                    <div id="w_howtoslide6" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">Congratulations <span class="username"></span>, You have completed Game Training!</h2>            
                        <p style="text-align:center;">Now go use your new skills!</p>
                        <p style="text-align:center;">
                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-training.png" border="0" alt="" />
                        </p>                     
                        <span onClick='showslide(5);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>   
                    </div>  
                </div>                
                <span class="button" onClick="showhowtoplay();  return false;">I'm done with Training, Let's Play!</span>
            </div> 
            <div class="tooltip-shade" style="display:none;"></div>

            <!-- Added by Gamal 12/03/2012 -->
            <!-- for feit confirm -->

            <div class="popup-placebet" id="w_forfeitconfirm">
				<div class="details">					
					<h4></h4>
					<br clear="all"/>
					<div class="button" id="w_forfeitconfirmbutton">Confirm</div>
					<div class="button-alt" id="w_forfeitcancel" onClick="closeforfeitpopup();  return false;">Cancel</div>
                    <div align="center"><br/>
                    <input type="checkbox" name="w_dontshowforfeit" id="w_dontshowforfeit" checked/> Don't show this popup again!<br/>
                    <br/>
                    </div>
				</div>				
			</div>

            @*added by stephen 2-may*@
            @*these two divs are used for the Admin*@
            <div class="popup-placebet" id="confirmevent" style="display:none;">
				<div class="details">					
					<h4>You have selected...</h4>
					<br clear="all"/>
					<div class="button" id="confirmeventbutton" onclick="admin.confirmEvent();  return false;">Confirm</div>
					<div class="button-alt" onclick="closepanel(this);  return false;">Cancel</div>
				</div>
			</div>

            @* award prizes*@

            <div class="popup-placebet" id="setMatchPrizes" style="position:absolute; top:0px; left:0px;  background:#000; padding-top:10px; display:none; z-index:1200;">
				<div class="details">					
					
                    <div class="team">                    
                        <h4>Add Points To Players</h4>
                        <br />
					    <b>Award Top :</b> <input type="text" id="resultsnumplayers" name="resultsnumplayers"  value="10"  /> players <br /><br />
					    <b>The following amount of Credits :</b> <input type="text" id="resultscredits" name="resultscredits" /> <br />
                        
                        <br />
                        <input type="checkbox" id="awardoverallcredits" name="awardoverallcredits" value="1"><b>Update Users Overall Credits</b><br>

                        <strong>Award Credits To The Players in The Following Leagues</strong><br />
                        <small><i>...click to move from left to right</i></small><br />
					    
                        <select id='FixturesLeaguePrizes' multiple='multiple'></select>

                        <span id="awardcreditsresult"></span>
					
					    <div class="button" id="addprizescreditsbutton" onclick="admin.AwardCredits(); return false;">Award Credits</div>					
                    </div>
                    <div class="team">
                        <h4>Add Extra Bonus To Players</h4>

                        <br />
					    <b>Award Top :</b> <input type="text" id="resultsnumplayersbonus" name="resultsnumplayersbonus" value="10" /> players <br />
                        <b>The Following number Of :</b> <input type="text" id="resultsbonus" name="resultsbonus" /> <br />

					    <select id='BonusPrize'>
                            <option value='forfeit' selected>forfeits</option>
                            <option value='powerplay'>powerplays</option> 
                        </select>

                        <span id="awardbonusresult"></span>

                        <br />
                        <div class="button" id="addprizesbonusbutton" onclick="admin.AwardBonus(); return false;">Award Bonus</div>			
                    </div>
					<br clear="all" />
                    <div class="button-alt" onclick="closepanel(this); return false;">Cancel</div>
				</div>
			</div>


                
			<div class="popup-placebet" id="notificationDetails" style="top:50px; background:#000; padding-top:10px; display:none; z-index:1200;">
				<div class="details">					
					<div class="team">                    
                        <h4>Facebook Notification</h4>
                        <br />
					    
                        <textarea cols="30" rows="7" id="notificationText" onkeyup="admin.countNotificationChar()" ></textarea>
                        Num Characters Left:<span id="NumNotificationsChar"></span>
                        <br />

                        <span id="NumNotificationsText"></span>
                        <span id="NumNotificationsSent"></span>
                        <span id="NumNotificationsFailed"></span>

					    <div class="button" id="sendfacebookNotification" onclick="admin.SendFaceBookNotifications(); return false;">Send New Facebook Notifications</div>					
                    </div>
                    
					<br clear="all" />
                    <div class="button-alt" onclick="closepanel(this); return false;">Cancel</div>
				</div>
			</div>

               
			<div class="popup-placebet" id="addgoalscorer" style="position:absolute; top:0px; left:0px;  background:#000; padding-top:10px; display:none; z-index:1200;">
				<div class="details">					
					
                    <div class="team">                    
                        <h4>Add New Goalscorers</h4>
                        <br />
					    <b>New Scorer :</b> <input type="text" id="NewGoalScorerName" name="NewGoalScorerName" /> <br />
					    <b>Or Existing Player Scorer :</b> <div id="playerListhtml"></div> <br />
                        
                        <div style="width:100px;margin:auto;"><b>Potential Winnings :</b> <input type="text" id="NewGoalScorerOdds" name="NewGoalScorerOdds" size="4" maxlength="8" style="width:60px;display:inline;" /></div>
					    <span id="AddGoalScorerDetails"></span>
					
					    <div class="button" id="addgoalscorerbutton" onclick="admin.addGoalScorer(); return false;">Add New GoalScorer</div>					
                    </div>
                    <div class="team">
                        <h4>Remove an existing goalscorer</h4>
                        <br />
                        <div id="goalscorersListhtml"></div><br />
                        <div class="button" id="removegoalscorerbutton" onclick="admin.removeGoalScorer(); return false;">Remove GoalScorer</div><br />
                    </div>
					<br clear="all" />
                    <div class="button-alt" onclick="closepanel(this); return false;">Cancel</div>
				</div>
			</div>

            <div class="popup-placebet" style="position:absolute; top:0px; left:0px; padding-top:10px; background:#000; z-index:1200; display:none;" id="edittickertext">
				<div class="details">					
					<h4>Edit Ticker Text - Put each ticking sentence on a new line!</h4>					
                    <div class="team" style="width:auto; float:none;">
                        <strong>PreGame Ticker Text</strong>
                        <textarea cols="71" rows="15" id="pregametickertext" name="pregametickertext" ></textarea>
                        <br />
                    </div>
                  
                    <br clear="all" />
                    <span id="pregametickereditstatus"></span>
                    <br clear="all" /> <br clear="all" />
					<div class="button" id="edittickertextbutton" onclick="admin.EditTickerText(); return false;">Edit Ticker Text</div>
					<div class="button-alt" onclick="closepanel(this); return false;">Close</div>
				</div>
			</div>

            <div class="popup-placebet" style="position:absolute; top:0px; left:0px; padding-top:10px; background:#000; z-index:1200; display:none;" id="editmatchdetails">
				<div class="details">					
					<h4>Edit Match Details</h4>					
                    <div class="team">
                        <strong>Home Team</strong>
                        <input type="text" id="hometeamname" name="hometeamname" /> <br />
                        <br clear="all"/>
                        <b>Kit Colour:</b> <div id="hometeamcolourdiv" > </div> <br />
                    </div>
                    
                    <div class="team">
                        <strong>Away Team</strong>    
                        <input type="text" id="awayteamname" name="awayteamname" /> <br />
                        <br clear="all"/>
                        <b>Kit Colour:</b> <div id="awayteamcolourdiv"></div> <br />
                    </div>

                    <div class="team">
                        <strong>Home Crest</strong> <small><i>LFC = liverpoolfc-crest.png</i></small><br />
                        <input type="text" id="homecrest" name="homecrest"  /> <br />
                        <br clear="all"/>
                        <strong>Away Crest</strong> <small><i>enter img url</i></small><br />
                        <input type="text" id="awaycrest" name="awaycrest" /> <br />
                    </div>

                     <div class="team">
                        <strong>Fixture Crest</strong> <small><i>enter img url</i></small><br />
                        <input type="text" id="fixturecrest" name="fixturecrest"  /> <br />
                        <br clear="all"/>
                        <strong>Fixture Description</strong>
                        <input type="text" id="fixturedescription" name="fixturedescription" /> <br />
                    </div>                    

                    <div class="team" style="width:94%;">
					    <b>Team Playing From Left To Right In First Half :</b> <br /><br />
                        <div id="teamDirectionhtml"></div>
					</div>

                    <div class="team">
                          <strong>TS KickOff</strong> <small><i>format  2013-06-28 12:30:00</i></small><br />
					      <input type="datetime-local" name="kotime" id="kotime">
					</div>                    

                    <div class="team">
                        <b>Bet Void Time (in seconds):</b> <br /><br />
                        <input type="text" id="editvoid" name="editvoid" style="width:50px;" />
                    </div>

                    <div class="team">
                          <strong>Leagues This Fixture Is Linked To</strong><br />
                          <small><i>...move from left to right to select</i></small><br />
					     
                          <select id='FixturesLeague' multiple='multiple'>
                              @*<option value='elem_1' selected>elem 1</option>
                              <option value='elem_2'>elem 2</option>
                              <option value='elem_3'>elem 3</option>
                              <option value='elem_4' selected>elem 4</option>
                              <option value='elem_100'>elem 100</option>*@
                          </select>
					</div>   

                    <div class="team" style="width:94%;">
                          <strong>HomePage Fixture</strong>
					      <input type="radio" name="HomePageFixture" id="hp_1" value="1"> Yes &nbsp;&nbsp;&nbsp;
                          <input type="radio" name="HomePageFixture" id="hp_0" value="0"> No<br>
					</div>                     

                    <br clear="all" />
                    <span id="editstatus"></span>

					<div class="button" id="editmatchdetailsbutton" onclick="admin.EditMatchDetails(); return false;">Edit Match Details</div>
					<div class="button-alt" onclick="closepanel(this);  return false;">Cancel</div>
				</div>
			</div>

    
            <div class="popup-placebet" id="confirmgoal">
				<div class="details">					
					<h4>Select GoalScorer and Confirm The Goal</h4>
					<div id="goalscorershtml">
							<div class='content' id='pregamebet_1' style='display:block;'>
								<div class='pregame-bets'>
									<form>
										<div class='option3'>
											<select id='betoptionselect9' name='betoptionselect9'>
													<option value='0'>Unknown Scorer</option>
											</select>
										</div>
									</form>
								</div>
							</div>
					</div>
					<br clear="all"/>
					<div class="button" id="confirmgoalbutton" onClick="admin.confirmGoal();  return false;">Confirm</div>
					<div class="button-alt" onClick="closepanel(this);  return false;">Cancel Goal</div>
				</div>
			</div>
                       
            @*end Admin pop up divs*@
                
              <!-- Added by Gamal 13/03/2012 -->
              <!-- Power Play (Bonus Time) confirm -->
            <div class="popup-placebet" id="w_powerplaypopup">
				<div class="details">					
					<div class="text"></div>
					<br clear="all"/>
					<div class="button" id="w_powerplayconfirmbutton">Confirm</div>
					<div class="button-alt" id="w_powerplaycancel" onClick="closepowerplaypopup();  return false;">Cancel</div>
				</div>				
			</div>

            <div class="popup-placebet" id="w_invitefriendspopup">
				<div class="details">					
					<div class="text"></div>
					<br clear="all"/>
					<div class="button" id="w_invitefriendsconfirmbutton">Invite Now</div>
					<div class="button-alt" id="w_invitefriendscancel" onClick="closeinvitefriendpopup();  return false;">Cancel</div>
				</div>				
			</div>

        	<!-- bet -->
			<div class="popup-placebet" id="w_popupplacebet">
				<div class="details">					
					<h4></h4>
					 <div class="checkcontainer">
                         <div class="check">
						    <input type="radio" name="credits" id="w_credits1" value="10">
						    <label class="credit_amount" for="w_credits1">
							    10
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="w_credits2" value="25">
						    <label class="credit_amount" for="w_credits2">
							    25
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="w_credits3" value="50" checked>
						    <label class="credit_amount" for="w_credits3">
							    50
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="w_credits4" value="75">
						    <label class="credit_amount" for="w_credits4">
							    75
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="w_credits5" value="100">
						    <label class="credit_amount" for="w_credits5">
							    100
						    </label>
					    </div>
                        <br clear="all"/>
                    </div>
                    <div class="check bonus" id="w_BonusCredits200" style="display:none;" >
						<input type="radio" name="credits" id="w_credits6" value="200" />
						<label class="credit_amount" for="w_credits6">
							200
						</label>
					</div>
					<br clear="all"/>
					<div class="button" id="w_confirm">Confirm</div>
					<div class="button-alt" id="w_cancel" onClick="closebetpanel();  return false;">Cancel</div>
				</div>				
			</div>

            @*<div id="w_predictionpending"> </div>*@
            <div class="betcountdown">
                 <span id="w_count" style="display:none"></span>
                 <div id="w_predictionpending" style="display:inline-block;"></div>
            </div>

            @*<span id="w_count">5</span> Prediction pending...*@

            <div class="popup-notify-powerplay" id="w_popup-notify-powerplay">
                <h1>Power Play!</h1>
            </div>

            <div class="popup-notify-purchase">
                <h1>Purchase Completed!</h1>
                <span></span>
            </div>
            
            <div class="popup-notify-invites">
                <h1>Invites Sent!</h1>
                <span></span>
            </div>

            <div class="popup-notify" id="w_popup-notify">
                <h1>GOAL!</h1>
            </div>
            		
            <div class="halftime" style="display:none"> 
                <div style="font-size:1.5em;"><span class="match_desc"></span></div>
                <img class="game-desc-image" border="0" style="max-width:100%;"/>
                <br />
                Half Time<br /><br />
            </div>
            <div class="fulltime" style="display:none"> 
                <div style="font-size:1.5em;"><span class="match_desc"></span></div>
                <img class="game-desc-image" border="0" style="max-width:100%;"/>
                <br />
                Full Time<br />
            </div>
            <div class="match-notstarted" style="display:none"> 
                <!--<div style="font-size:1.5em;"><span class="match_desc"></span></div>
                <img class="game-desc-image" border="0" style="max-width:100%;"/>
                <br />
                Awaiting Kick Off<br /><br />
                <a onclick="GetPreGameBetDetails();return false;" href="#">Place Pre-Game Match Bets</a> &nbsp;
                <a onClick="showhowtoplay();" href="#">How to play?</a>-->
                <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/intro-v2.png" border="0" /><br />
                <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/intro-btn1.png" class="btn" onclick="GetPreGameBetDetails();return false;" border="0" />                   
                <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/intro-btn4.png" class="btn" onclick="Store.showstore();return false;" border="0" />                             
                <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/intro-btn3.png" class="btn" onClick="showhowtoplay();  return false;" border="0" />

            </div>
            
            <div id="w_tooltips" style="display:none;">
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
            </div>
            <div class="tooltip-shade-bg" onclick="ShowTips();return false;" style="display:none;"></div>

			<!-- pitch -->
			<div class="pitch-container">
                <div class="w_pitch-icons"></div>
				<canvas class="pitch" id="pitch" width="834" height="157"></canvas>
			</div>                        

            <!-- Penalty Shootout UI -->
            <div class="peno-container" style="display:none;">
                <div class="peno-shootout-icons">
                    <!-- Need to create new event ids for these -->                
                    <div class="bubble wide-bubble-left" id="bubble101">5/1</div>
                    <div class="wide-icon-left" onClick="betpupup('WIDE BY LEFT POST', 101); return false;">WIDE</div>

                    <div class="bubble wide-bubble-top" id="bubble102">5/1</div>
                    <div class="wide-icon-top" onClick="betpupup('WIDE OVER BAR', 102);  return false;">WIDE</div>

                    <div class="bubble wide-bubble-right" id="bubble103">5/1</div>
                    <div class="wide-icon-right" onClick="betpupup('WIDE BY RIGHT POST', 103); return false;">WIDE</div>

                    <div class="bubble goal-bubble-left" id="bubble104">3/1</div>
                    <div class="goal-icon-left" onClick="betpupup('LEFT-SIDED GOAL', 104); return false;">GOAL</div>

                    <div class="bubble goal-bubble-middle" id="bubble105">3/1</div>
                    <div class="goal-icon-middle" onClick="betpupup('CENTER GOAL', 105); return false;">GOAL</div>

                    <div class="bubble goal-bubble-right" id="bubble106">3/1</div>
                    <div class="goal-icon-right" onClick="betpupup('RIGHT-SIDED GOAL', 106); return false;">GOAL</div>
                        
                    <div class="bubble save-bubble-middle" id="bubble107">3/1</div>
                    <div class="save-icon-middle" onClick="betpupup('SAVE BY KEEPER', 107); return false;">SAVE</div>
                    <!--//-->                                                
                </div>
            </div>
            
           <audio id="audio" style="display:none"></audio>
			
           <div id="slide4" class="slidepanel">
                <div class="wrapperpopup">
                    <div id="popup" class="gamemenu">
                            
                        <div class="pregameclick" onclick="slider(4);GetPreGameBetDetails();return false;">
                            <a href="#">Pre-Game Bets</a>
                            <span class="numPregame">0</span>
                        </div>                            
                            
                        <div onclick="slider(4);ToggleCreditsmanager();return false;">
                            <a id="creditsmanagerclickbtn" href="#"><span>$</span>&nbsp;1-Click Predictions</a>
                        </div>           
                            
                        <div onclick="slider(4);ShowTips();return false;">
                            <a id="helpclickbtn" href="#"><span>?</span>&nbsp;Help!</a>
                        </div>                 

                        <div onclick="powerplaypopup();return false;" id="phonepowerplay" style="display:none;">
                            <a id="powerplayclickbtn" href="#"><span>P</span>&nbsp;Start Power Play!</a>
                        </div>

                    </div>
                </div>
            </div><!--/end slide -->

            <div class="game-control-close">
                <div class="close-btn" onClick="slider(0);  return false;">X</div>
            </div>

            <div class="pregame-betpanel">                        
                <!--<div class="pregame-bets" style="text-align:center;">
                    <span class="pregame-bets-title">Pre-Game Predictions</span>                      
                </div>-->  
                <!-- featured div gets populated by Ajax function ShowPreGameBets  -->
                <div id="w_BetHTML"></div>

                <div>
                    <div class="button" id="confirm_pregame" onclick="placePreGameBets(); return false;">Confirm All Predictions*</div>
                    <p style="position:absolute; bottom:30px; right:90px; width:200px;">*Any predictions you leave clear can be completed anytime before Kick Off</p>
					<div id="cancel_pregame" onclick="closePreGamepanel();  return false;">X</div>
                    <br clear="all" /><br clear="all" />
                </div>
            </div><!-- pregame-betpanel div -->   
            
        </div><!--/ end #gameplay-screen -->  
            			
        <div id="gamefeed">
		    <div id="w_view">
            <div id="slide1" class="split-column">
				<div class="tabs"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_timer.png" style="height:36px;" border="0" alt="Game Tracker" /><span id="GTracker">Game Tracker</span> @*<span onclick="showpenos();">< Show Penalties! ></span>*@</div>
				<div id="wrapper" class="scrollable">
					<div class="GameFeedInfo">
                    </div>
                </div>
			</div> 		

            <div id="slide2" class="split-column">
				<div class="tabs"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_friends.png" border="0" alt="Friends" /><span>Friends  <input style="display:none" id="FriendInviteButton" type="button" onclick="InviteFriendsToPlayAGame(); return false;" value="Play This Game Against Friends" /> </span>
                    <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/bet-tick-legend.png" border="0" alt="Prediction" style="float:right; position:relative; top:5px;" />
                </div>
				<div id="wrapper2" class="scrollable">
                    <div class="FriendsLeaderboard Myleagues">  
				    </div>
                    <div class="FriendFeedInfo">
					</div>   
                </div>             
			</div>	    

            <div id="slide3" class="split-column">   
                <div class="tabs"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_leagues.png" border="0" alt="My Leagues" /><span class="up">Leagues</span></div>                    
                
                        
                <div id="w_league_view_2" class="leaguepanel popout" style="display:none;">
                    <div class="league_title">Create a League</div>
                    <form>
                    <input type="text" id="w_leaguename" placeholder="Name" /><br />
                    @*<textarea id="w_leaguedesc" rows="2" Placeholder="Desc"></textarea>*@

                    <input type="radio" name="LeagueType" id="w_lt1" value="1" checked="checked"  />
                    <label for="w_lt1">
						Create a League Just For This Match
					</label>
                    <br clear="all"/>
                    <input type="radio" name="LeagueType" id="w_lt2" value="2" />
                    <label class="credit_amount" for="w_lt2">
						Create a Multi Game League
					</label>
                    <div style="border-bottom:1px solid #333; width:100%;">&nbsp;</div>
                    <br clear="all"/>
                    <input type="checkbox" id="w_allowinvites" /> <label for="w_allowinvites">Allow all members of this league to invite players to the league</label>
                    <br clear="all"/><br clear="all"/>
                    @*  <input type="button" value="Next, Invite Friends" class="button" onclick="sendRequestViaMultiFriendSelector(); return false;" />          *@
                    <div style="text-align:center;">
                        <input type="button" value="Next, Invite Friends" class="button" onclick="userLeague.createNewLeague(); return false;" />          
                        <input type="button" value="Cancel" class="button_alt" onclick="hideleaguepanel(2); return false;" />
                    </div>
                    <span id="w_CreateLeagueError"></span>
                    </form>
                </div>

                <!-- Manage league popup -->
                <div id="w_league_view_4" class="leaguepanel popout" style="display:none;">
                    <div class="league_title">Manage League</div>
                    <input type="hidden" id="w_edit_lid" />
                    <input type="text" id="w_edit_leaguename" placeholder="Name" /><br />
                    @*<textarea id="w_leaguedesc" rows="2" Placeholder="Desc"></textarea>*@
                    <input type="radio" name="w_edit_LeagueType" id="w_edit_lt1" value="1">
                    <label for="w_edit_lt1">
						This Match Only
					</label>                    
                    <br clear="all"/>
                    <input type="radio" name="w_edit_LeagueType" id="w_edit_lt2" value="2">
                    <label class="credit_amount" for="w_edit_lt2">
						Multi Game League
					</label>                                        
                    <div style="border-bottom:1px solid #333; width:100%;">&nbsp;</div>
                    <br clear="all"/>
                    <input type="checkbox" id="w_edit_allowinvites" /> <label for="w_edit_allowinvites">Allow all members of this league to invite players to the league</label>
                    <br clear="all"/><br clear="all"/>
                    @*  <input type="button" value="Next, Invite Friends" class="button" onclick="sendRequestViaMultiFriendSelector(); return false;" />          *@
                    <div style="text-align:center;">
                        <input type="button" value="Confirm Changes" class="button" onclick="userLeague.EditLeagueDetails(); return false;" style="display:inline-block;"/> 
                        <input type="button" value="OR Invite Friends" class="button" onclick="userLeague.SendInvitesFromManageLeaguePopup(); return false;" style="display:inline-block;" />          
                    <br clear="all" />
                        <input type="button" value="Cancel" class="button_alt" style="margin-top:5px;" onclick="hideleaguepanel(4); return false;" />
                    </div>
                    <span id="w_CreateLeagueError"></span>
                    <br clear="all" />
                </div>

                <div id="leagueMessageWrapper" class="scrollable">
                    <div class="invitepanel" id="w_league_messages">
                       
                    </div>
                </div>

                <div id="wrapper3" class="scrollable">
                    <div style="width:100%;">                        
                        <div class="loadingpanel"><span class="loadingspinner"></span><strong>Loading League Info...</strong><br clear="all" /></div>
                        
                        <div id="w_league_view_1" class="leaguepanel"></div>

                        <div id="w_leaguestandings_1" class="leaguestandings" style="display:none;"></div>
                        
                        <div id="w_league_view_3" class="leaguepanel" style="display:none;">
                            <div class="league_title">Find League</div>
                            <input type="text" name="leaguename" placeholder="Find League" /><br />
                             <input type="button" value="Search" class="button" />      
                        </div>                          
                    </div>      
                </div>
                <div id="w_league_menu">
                    <a href="#" id="menubtn1" onclick="userLeague.GetUserLeaguesLinkedToThisFixture(); return false;"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/league-icon1.png" border="0" /><br />MY<br />LEAGUES</a>
                    <a href="#" id="menubtn2" onclick="showleaguepanel(2); return false;" id=""><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/league-icon2.png" border="0" /><br />CREATE<br />LEAGUE</a>
                    <a href="#" id="menubtn3" onclick="userLeague.GetOfficialLeagues(1); return false;"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/league-icon4.png" border="0" /><br />OFFICIAL<br />LEAGUES</a>
                </div>
            </div>  

            <div id="slide5" class="split-column" style="display:none;">   
                <div class="tabs">
                    <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_star.png" border="0" alt="My Leagues" /><span class="up">Game Setup</span>
                </div>  
                <div id="adminlinks">
                   
                    @*   <a href="#" class="textbtn">Update Odds</a>
                    <a href="#" class="textbtn">Update Time Delay</a>*@
                    <div>
                        <textarea type="text" name="broadcastmessagetext" id="broadcastmessagetext" style="padding:5px; height:40px; width:90%; margin:10px;"></textarea>
                        <input type="button" onclick="admin.sendBroadcastMessage(27); return false;" value="Send Message" class="button" />
                        <input type="button" onclick="admin.testPusher(); return false;" value="Test Pusher" class="button" />      
                    </div>

                    <div>
                        <a href="#" class="textbtn" style="background:#a10000;" onclick="$('#db_buttons').slideToggle(); return false;">Manage Database Cleanup</a>
                    </div>
                    
                    <div id="db_buttons" style="display:none;">

                        <a id="BackupToDisk"  class="textbtn"  href="#" onclick="admin.BackupDBToDisk(); return false;">Backup DB To Disk For This Fixture <br /><small><i> - Run this before we upsize the DB before games , at half time (after MidGame clean up) and at full time</i><br /> </small> </a> 
                        <a id="RepopulateMemoryTables"  class="textbtn"  href="#" onclick="admin.RebootMemoryTables(); return false;">Repopulate Memory Tables After System Reboot  <br /><small><i> - Run this AFTER we upsize the DB before games </i><br /> </small></a> @*style="display:none;"*@
                        <a id="DBComparison"  class="textbtn"  href="#" onclick="admin.CompareMemoryTables(); return false;">Compare Memory and Disk Tables  For This Fixture </a> <small><i> - Each Disk table should have >= the memory table before we do a reboot!!!</i><br /> </small> @*style="display:none;"*@
                        <a href="#" class="textbtn" onclick="admin.CleanupDBMidMatch(); return false;">Clean up DB Mid Game <br /><small><i> - only call this when there will be no event for 30 seconds!</i><br /> - i.e after a goal or injury and ALWAYS run this at half time!!</small></a> 
                        <a href="#" class="textbtn" style="background:#a10000;" onclick="$('#emergency_buttons').slideToggle(); return false;">Emergency Buttons! It's an emergency!</a>

                    </div>

                    <div id="emergency_buttons" style="display:none; background:#a10000;">
                        <a href="" class="textbtn" onclick="admin.sendEvent(11,'Start Match'); return false;"  >Start Game<br /><small><i> - Shit the game hasn't started!!</i></small></a> 
                        <a href="" class="textbtn" onclick="admin.sendEvent(12,'SET HALF TIME'); return false;">Half Time<br /><small><i> - Shit, it's HT Jeff!!</i></small></a> 
                        <a href="" class="textbtn" onclick="admin.sendEvent(13,'START 2ND HALF'); return false;">2nd Half<br /><small><i> - Start Second Half!!!</i></small></a> 
                        <a href="" class="textbtn" onclick="admin.sendEvent(14,'SET FULL TIME'); return false;">Full Time<br /><small><i> - Balls, the game has ended Jeff!!</i></small></a> 
                        <a href="" class="textbtn" onclick="admin.ResetBackup(); return false;">Rest DB<br /><small><i> - Reset DB values so we can run backup's - <br /> only do this if we have been waiting longer than 10 minutes!!!</i></small></a> 
                    </div>
                </div>
            </div>
            </div>    
        </div><!--/ end #gamefeed-->            
                 
    </div><!--/ end #gameplay-->

    <div id="mobile-gameplay">

        <div class="friend_notification" id="m_friend_notification"></div>
        
        <div class="gameplay-screen">          
            
            <div class="userinfoclick">
                <a onclick="ToggleUserInfo();return false;" href="#"><span></span>&nbsp;Menu</a>
            </div>
            <div class="pregameclick"   onclick="GetPreGameBetDetails();return false;">
                <a href="#">Pre-Game Bets</a>
                <span class="numPregame">0</span>
            </div>
            <div class="helpclick" style="display:none;" onclick="ShowTips();return false;">
                <a id="m_helpclickbtn" href="#"><span>?</span>&nbsp;Help!</a>
            </div>
            <div class="creditsmanagerclick" style="display:none;" onclick="ToggleCreditsmanager();return false;">
                <a id="m_creditsmanagerclickbtn" href="#"><span>$</span>&nbsp;1-Click Predictions</a>
            </div>
            
            <div class="powerplayclick" style="display:none;" onclick="powerplaypopup();return false;">
                <a id="m_powerplayclickbtn" href="#" onclick="return false;"><span>P</span>&nbsp;Start 10-min Power Play!</a>
            </div>

          @*  <div class="powerplayclick" onclick="powerplaypopup();return false;">
                <a href="#" onclick="return false;"><span>P</span>&nbsp;Invite Friends!</a>
            </div>*@
            
            <div class="powerplaytimerlabel"  id="m_powerplaytimerlabel" onclick="powerplaypopup(); return false;"> @*style="display:none;"*@
                Power Play
            </div>      

            <div class="powerplaytimer" style="display:none;" id="m_powerplaytimertext" onclick="powerplaypopup(); return false;">
                10:00
            </div>
            
            <a class="homebtn" href="/"></a>

            <!--<div class="unlockcreditsDiv_locked" style="display:none;">
                <span></span><span>Unlock <strong>200</strong> Credit Limit after <span id="m_UnlockNumBetsSpan"></span></span>
            </div>
            <div class="betnum" style="display:none;"></div>

            <div class="unlockcreditsDiv" style="display:none;">
                <span></span><span id="m_unlockcreditsSpan"></span>
            </div>-->

             <div id="tickerDiv">
            
            </div>

            @*<ul id="js-news" class="js-hidden">
		        <li class="news-item">Unlock <strong>200</strong> Credit Limit after 20 more predictions</li>
		        <li class="news-item">Use your Powerplay to double you odds for 10 minutes!</li>
		        <li class="news-item">Your friend Jimbo has predicted a 'Goal' for Liverpool</li>
		        <li class="news-item">Use a forfeit to cancel your Prediction, it'll cost you your credits!</li>
		        <li class="news-item">Liverpool have made a substitute. Joe Allen on for Nuri Sahin.</li>
		        <li class="news-item">You are 2000 credits from top spot!</li>
	        </ul>*@

            <br clear="all" />

             <div class="penalty-score" style="display:none;">
                <span>Penalty Shootout</span>
                <span class="homescore">2</span>
                <span class="divider"> - </span>
                <span class="awayscore">2</span>
            </div>

            <!-- forfeit bet -->
            <div onclick="forfeitpopup();return false;" class="forfeitclick">
                <span>Forfeit</span>
                <span id="m_forfeitnum" class="forfeitnum"></span>
            </div>

            <!--credit manager-->
            <div id="m_creditsmanager" class="creditsmanager popup-placebet">
                <div class="details">
                    <h4>Select your default Credit amount for 1-Click Predictions</h4>                     
                    <div class="checkcontainer">
                        <div class="check">
						    <input type="radio" name="m_storecredits" id="m_storecredits1" value="10" >
						    <label class="credit_amount" for="m_storecredits1">
							    10
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="m_storecredits" id="m_storecredits2" value="25" >
						    <label class="credit_amount" for="m_storecredits2">
							    25
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="m_storecredits" id="m_storecredits3" value="50"  >
						    <label class="credit_amount" for="m_storecredits3">
							    50
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="m_storecredits" id="m_storecredits4" value="75" >
						    <label class="credit_amount" for="m_storecredits4">
							    75
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="m_storecredits" id="m_storecredits5" value="100" />
						    <label class="credit_amount" for="m_storecredits5">
							    100
						    </label>
					    </div>
                    <br clear="all"/>
                    </div>  
                    <div class="check bonus" id="m_StoreBonusCredits200" style="display:none;" >
						<input type="radio" name="m_storecredits" id="m_storecredits6" value="200" />
						<label class="credit_amount" for="m_storecredits6">
							200
						</label>
					</div>
                    <div class="check first">
						<input type="radio" name="m_storecredits" id="m_storecredits0" value="0" />
						<label class="credit_amount" for="m_storecredits0">
							None
						</label>
					</div>
                    <div class="button" id="m_confirm_1click" onclick="storeOneClickCreditValue();return false;">Confirm</div>
					<div class="button-alt" id="m_cancelCreditsManager" onclick="ToggleCreditsmanager();return false;">Cancel</div>
                </div>
            </div>

            <!-- reconnectind DIV -->
            <div id="m_reconnectstatus" style="display:none;">
                <div class="message">&#8646; Connection Lost. Reconnecting now...</div>
                <div class="tooltip-shade"></div>
            </div>

            <div id="m_leavepagestatus" style="display:none;">
                <div class="message" id="m_leavepagemessage"></div>
                <div class="tooltip-shade"></div>
            </div>
            <!---->

             <!-- nickname editor-->
            <div class="nicknamepopup" style="display:none;">        
                <h4>My Account</h4>            
                <div style="width:49%;float:left;color:#fff; text-align:center;">
                    <p><span class="credits" style="display:inline-block; position:relative; top:0px; left:0px; margin:auto; width:150px;"></span></p>
                    <br />
                    <strong>Choose a nickname to appear in the overall leaderboard</strong>
                    <input type="text" id="m_nicknameValue"  value="" placeholder="Nick Name" />
                    <div class="button" id="m_confirm_nn">Confirm</div>
                    <br />
                    <div id="m_changepass">
                            <Br />
                            <p><strong>Reset your Password</strong></p>
                            <input type="password" id="m_oldpass" maxlength="25" value="" placeholder="Old Password" />                    
                            <input type="password" id="m_newpass" maxlength="25" value="" placeholder="New Password" />
                            <br /><p id="m_cpresult"></p>
                            <div class="button" id="m_confirm_pass" onClick="Login.ChangePassword(); return false;">Update</div>
                    </div>
                </div>
                <div style="width:48%; float:left; color:#fff; text-align:center; border-left:1px solid #444; padding-right:5px;">                    
                    <br clear="all" />
                    <p><strong>Purchase History</strong></p>
                    <div id="m_scroll_storepurchases" class="scrollable">
                           <div id="m_storepurchases">
                                @*<p>27/07/2012 16:26<br /><strong>Power Play</strong> for &euro;0.99</p>
                                <p>27/07/2012 15:12<br /><strong>Forfeit (x5)</strong> for &euro;2.00</p>
                                <p>26/07/2012 15:12<br /><strong>Forfeit (x5)</strong> for &euro;2.00</p>
                                <p>12/07/2012 15:12<br /><strong>200 Credit Limit</strong> for &euro;2.00</p>*@
                            </div>
                    </div>          
                </div>          
                 <br clear="all" />         
                    <div class="button-alt" id="cancel_nn" onclick="nickNameCancel(); return false;">Exit</div>            
            </div>
            
            <!-- store -->
            <div class="storepopup" id="m_store" style="display:none; text-align:center;">                    
                <div style="color:#fff;">
                    <div class="storeheader"><h4>Store</h4></div>
                    <br />
                   <div id="m_inventory">
                    @*
                        <div style="width:25%; float:left; text-align:center;">
                             <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-200limit.png" border="0" alt="200" style="width:100%;"  /><br />
                             <strong>€1.50</strong><br />
                             <div class="button" onclick="confirmpurchase(1);">BUY</div>
                        </div>
                        <div style="width:25%; float:left; text-align:center;">
                             <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-pp.png" border="0" alt="Power Play" style="width:100%;" /><br />
                             <strong>€0.99 each</strong><br />
                             <div class="button" onclick="confirmpurchase(2);">BUY</div>
                        </div>
                        <div style="width:25%; float:left; text-align:center;">
                             <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-forfeit.png" border="0" alt="Forfeit" style="width:100%;" /><br />
                             <strong>€0.99 each</strong><br />
                             <div class="button" onclick="confirmpurchase(3);">BUY</div>
                        </div>
                         <div style="width:25%; float:left; text-align:center;">
                             <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-credits.png" border="0" alt="Credits" style="width:100%;" /><br />
                             <strong>€1.00 x 1000</strong><br />
                             <div class="button" onclick="confirmpurchase(4);">BUY</div>
                        </div>
                    *@
                    </div>
                    <div id="m_checkout" style="display:none;">
                        <span class="itemdescriptiondetails"></span>
                        <span class="itempurchasedetails"></span>
                        @*<input type="number" value="1" name="quantity" min="1" class="quantity" />*@
                       @* <div class="button">Confirm</div>*@
                        <div class="button" onclick="Store.resetinventory();return false;">View Other Items</div>
                    </div>

                    <div id="m_billing" style="display:none;">
                          <div class="button" onclick="Store.resetinventory();return false;">I've Changed My Mind</div>
                    </div>

                    <br clear="all" />
                    <span onclick="Store.showstore();  return false;" class="button-alt">Exit</span>
                </div>
            </div>

            <div class="questionbtn-master" onclick="openCoachmarks();return false;">?</div>

            <div class="coachmarks" id="m_coachmarks" style="display:none;">
                
                <div class="questionbtn pos1" onclick="showdefinition('<strong>Powerplay timer</strong><br/>How long is left on your powerplay');return false;">?</div>
                <div class="questionbtn pos2" onclick="showdefinition('<strong>Pitch View</strong><br/>This is where you make your predictions');return false;">?</div>
                <div class="questionbtn pos3" onclick="showdefinition('<strong>Game Tracker</strong><br/>Track game events and your Wins and Losses');return false;">?</div>
                <div class="questionbtn pos4" onclick="showdefinition('<strong>My Friends</strong><br/>Your Facebook friends who are playing the game');return false;">?</div>
                <div class="questionbtn pos5" onclick="showdefinition('<strong>My Leagues</strong><br/>View Overall leaderboard or Join a League');return false;">?</div>
                <div class="questionbtn pos6" onclick="showdefinition('<strong>Boot Room</strong><br/>Extra game options, Store and more');return false;">?</div>                                
                <div class="questionbtn pos7" onclick="showdefinition('<strong>Ticker</strong><br/>Tips and stats during the game');return false;">?</div>                    

                <div class="definitionlabel"><strong>Help</strong><br />Tap ? for more info</div>
                <div class="donebtn" onclick="closeCoachmarks(); return false;">Close</div>

            </div>
                        
            <!-- game tutorial -->
            <div class="howtopopup" id="m_howtotutorial" style="display:none;">                
                                
                <div class="slidecontainer">
                    
                    <div id="m_howtoslide2" class="howtoslide" style="display:block;">
                        <h2 style="text-align:center;">Welcome to Training <span class="username" style="color:gold;"></span>, Let's start with a Warm-Up!</h2>             
                        <p><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> The aim of the game is to Predict what happens next in the match! You win credits by predicting correctly, and the more you win the further you go up the leaderboard!</p>
                        <p>If you find yourself struggling at the bottom of the table use Powerplays and Forfeits to your advantage. One big win can change the game!</p>
                        <br /><span onClick='showslide(3);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>                        
                    </div>

                    <div id="m_howtoslide3" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How do I make a Prediction?</h2>             
                        <p><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> There are 2 types of Predictions, Pre-Game Predictions and In-Game Predictions.</p>
                        <p>Before a Match kicks off you can make bonus predictions to win extra credits during the game. These include First Goalscorer, First Team to Score, the Half-Time result, the Full-Time result and the Number of Free-kicks/Throws in each half.</p>
                        <br />
                        <span onClick='showslide(2);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>
                        <span onClick='showslide(4);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div> 

                    <div id="m_howtoslide4" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How do I make a Prediction?</h2>             
                        <p><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> During gameplay you will see 10 markers on the pitch which represent 10 events that take place during a game, each event has odds based on their likelyhood.</p>
                        <p>
                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon-helper-v2.png" border="0" alt="" style="width:100%;" />                            
                        </p>
                        <p>Each team has 4 events associated with them, GOAL, WIDE, CORNER and SAVE. You can differentiate between these by the team colours. There are also 2 generic events, THROW IN and FREE-KICK.</p>
                        <p>To make a Prediction, click on an event, you will be presented with a popup which allows you to select the amount of credits you are willing to risk.</p>
                        <p><strong>1-Click Predictions</strong><br /></p>
                        <p class="webimage">To set this up, click on '1-Click-Mode' on the right hand side of the game screen. You can now select the fixed credits amount. Select 'None' if you want to turn this feature off.</p>
                        <p class="mobileimage">To set this up go to the 'Boot Room' on the game menu, then select '1-Click Mode'. You can now select the fixed credits amount. Select 'None' if you want to turn this feature off.</p>
                        <br />
                        <span onClick='showslide(3);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>
                        <span onClick='showslide(5);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div>

                    <div id="m_howtoslide5" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How to Play with Friends</h2>            
                        <p><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> During Gameplay you will see a Friends Leaderboard as well as the Overall Leaderboard. If your Facebook Friends are playing they will appear in your Friends Leaderboard along with their score.</p>
                        <p>Whenever your friends makes a Prediction you will see a &#9787; beside their name.</p>                         
                        <span onClick='showslide(4);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>                        
                        <span onClick='showslide(6);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div> 
                    
                    <div id="m_howtoslide6" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">Congratulations <span class="username"></span>, You have completed Game Training!</h2> 
                        <p style="text-align:center;">
                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-training.png" border="0" alt="" />
                        </p>                     
                        <span onClick='showslide(5);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>   
                    </div>  
                </div>                
                <span class="button" onClick="showhowtoplay(); return false;">I'm done with Training, Let's Play!</span>
            </div> 
            <div class="tooltip-shade" style="display:none;"></div>

            <!-- Added by Gamal 12/03/2012 -->
            <!-- for feit confirm -->
            <div class="popup-placebet" id="m_forfeitconfirm" style="z-index:903;">
				<div class="details">					
					<h4></h4>
					<br clear="all"/>
					<div class="button" id="m_forfeitconfirmbutton">Confirm</div>
					<div class="button-alt" id="m_forfeitcancel" onClick="closeforfeitpopup();  return false;">Cancel</div>
                    <div align="center"><br/>
                    <input type="checkbox" name="m_dontshowforfeit" id="m_dontshowforfeit" checked /> Don't show this popup again!<br/>
                    <br/>
                    </div>
				</div>				
			</div>
                
            <!-- Added by Gamal 13/03/2012 -->
            <!-- Power Play (Bonus Time) confirm -->
            <div class="popup-placebet" id="m_powerplaypopup">
				<div class="details">					
					<div class="text"></div>
					<br clear="all"/>
					<div class="button" id="m_powerplayconfirmbutton">Confirm</div>
					<div class="button-alt" id="m_powerplaycancel" onClick="closepowerplaypopup();  return false;">Cancel</div>
				</div>				
			</div>

             <div class="popup-placebet" id="m_invitefriendspopup">
				<div class="details">					
					<div class="text"></div>
					<br clear="all"/>
					<div class="button" id="m_invitefriendsconfirmbutton">Invite Now</div>
					<div class="button-alt" id="m_invitefriendscancel" onClick="closeinvitefriendpopup();  return false;">Cancel</div>
				</div>				
			</div>

        	<!-- bet -->
			<div class="popup-placebet" id="m_popupplacebet">
				<div class="details">					
					<h4></h4>
					 <div class="checkcontainer">
                         <div class="check">
						    <input type="radio" name="credits" id="m_credits1" value="10">
						    <label class="credit_amount" for="m_credits1">
							    10
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="m_credits2" value="25">
						    <label class="credit_amount" for="m_credits2">
							    25
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="m_credits3" value="50" checked>
						    <label class="credit_amount" for="m_credits3">
							    50
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="m_credits4" value="75">
						    <label class="credit_amount" for="m_credits4">
							    75
						    </label>
					    </div>
					    <div class="check">
						    <input type="radio" name="credits" id="m_credits5" value="100">
						    <label class="credit_amount" for="m_credits5">
							    100
						    </label>
					    </div>
                        <br clear="all"/>
                    </div>
                    <div class="check bonus" id="m_BonusCredits200" style="display:none;" >
						<input type="radio" name="credits" id="m_credits6" value="200" />
						<label class="credit_amount" for="m_credits6">
							200
						</label>
					</div>
					<br clear="all"/>
					<div class="button" id="m_confirm">Confirm</div>
					<div class="button-alt" id="m_cancel" onClick="closebetpanel();  return false;">Cancel</div>
				</div>				
			</div>

            <div class="notification_msg" id="notification_msg"></div>

            <div class="popup-notify-powerplay" id="m_popup-notify-powerplay">
                <h1>Power Play!</h1>
            </div>

            <div class="popup-notify-purchase">
                <h1>Purchase Completed!</h1>
                <span></span>
            </div>

            
            <div class="popup-notify-invites">
                <h1>Invites Sent!</h1>
                <span></span>
            </div>
                
            <div class="popup-notify" id="m_popup-notify">
                <h1>WIN!</h1>
                <span>You won 1000 credits!</span>
            </div>

            <div class="betcountdown" style="display:none">
                <span id="m_count" style="display:none"></span>
                <div id="m_predictionpending" style="display:inline-block;"></div>
            </div>

            @* Prediction pending...*@
                        
            <div id="m_tooltips" style="display:none;">
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
                       
            <div id="m_view">

                <div class="coda-slider-wrapper">
   	                <div class="coda-slider preload" id="coda-slider-1">       	            
                       <div class="panel" id="panel2">
             	            <div class="panel-wrapper">      
                                <span class="panel-title">Game Tracker</span>                     
                               <div id="wrapper5" class="scrollable">					           
                                   <div class="GameFeedInfo"></div>
                               </div>  
                           </div>
                       </div>
                       <div class="panel" id="panel3">
           	               <div class="panel-wrapper">          
                                  
                                  
                                @*  <span onClick="InviteFriends();return false;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<u>Invite Friends</u></span>
                               *@   
                                      
                                <span class="panel-title">Friends Leaderboard &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="stevesfirstclass" href="#" onClick="InviteFriends();return false;">Invite Friends</a> <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/bet-tick-legend.png" border="0" alt="Prediction" style="float:right; position:relative;" /></span>           
               	                <div id="wrapper6" class="scrollable">
                                    <div class="FriendsLeaderboard Myleagues" style="width:100%;"></div>
                                    <div class="FriendFeedInfo"></div>   
                                </div>
                           </div>
                       </div>
                       <div class="panel" id="panel1">           	        
                            <div class="panel-wrapper">
               	            
                                <div class="halftime" style="display:none"> 
                                    <div style="font-size:1.5em;"><span class="match_desc"></span></div>
                                    <img class="game-desc-image" border="0" style="max-width:100%;"/>
                                    HALF TIME<br /><br /><br />
                                    <span style="font-weight:normal; font-size:1.2em; color:gold; line-height:20px;">Use the break to Topup your PowerPlays, Forfeits and Credits in the 'Boot Room' Store</span>
                                </div>
                                <div class="fulltime" style="display:none"> 
                                    <div style="font-size:1.5em;"><span class="match_desc"></span></div>
                                    <img class="game-desc-image" border="0" style="max-width:100%;"/>
                                    <br />
                                    Full Time<br />
                                </div>
                                <div class="match-notstarted" style="display:none"> 
                                    <!--<div style="font-size:1.5em;"><span class="match_desc"></span></div>
                                    <img class="game-desc-image" border="0" style="max-width:100%;"/>
                                    <br />
                                    Awaiting Kick Off<br /><br />
                                    <a onclick="GetPreGameBetDetails();return false;" href="#">Place Pre-Game Match Bets</a> &nbsp;
                                    <a onClick="showhowtoplay();" href="#">How to play?</a>-->
                                    <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/intro-v2.png" border="0" /><br />
                                    <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/intro-btn1.png" id="BeforeMatchPreGame" class="btn" style="display: none;" onclick="GetPreGameBetDetails();return false;" border="0" />  
                                    <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/intro-btn4.png" class="btn" onclick="Store.showstore();return false;" border="0" />                             
                                    <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/intro-btn3.png" class="btn" onclick="showhowtoplay();  return false;" border="0" />
                                </div>
                                <div class="pitch-container">
                                    <div class="m_pitch-icons"></div>
				                    <canvas class="pitch" id="pitch" width="834" height="157"></canvas>
			                    </div>
            	       
                            </div>                   
                       </div>
                       <div class="panel" id="panel4">
           	               <div class="panel-wrapper">
               	            
                                <span class="panel-title">Leagues</span>

                                <div id="m_league_view_2" class="leaguepanel popout" style="display:none;">
                                    <div class="league_title">Create a League</div>
                                    <form>
                                    <input type="text" id="m_leaguename" placeholder="Name" /><br />
                                    @*<textarea id="w_leaguedesc" rows="2" Placeholder="Desc"></textarea>*@

                                    <input type="radio" name="LeagueType" id="m_lt1" value="1" checked="checked"  />
                                    <label for="m_lt1">
						                Create a League Just For This Match
					                </label>
                                    <br clear="all"/>
                                    <input type="radio" name="LeagueType" id="m_lt2" value="2" />
                                    <label class="credit_amount" for="m_lt2">
						                Create a Multi Game League
					                </label>
                                    <div style="border-bottom:1px solid #333; width:100%; height:1px; margin:2px;">&nbsp;</div>
                                    <input type="checkbox" id="m_allowinvites" /> <label for="m_allowinvites">Allow all members of this league to invite players to the league</label>
                                    <br clear="all"/><br clear="all"/>
                                    @*  <input type="button" value="Next, Invite Friends" class="button" onclick="sendRequestViaMultiFriendSelector(); return false;" />          *@
                                    <div style="text-align:center;">
                                        <input type="button" value="Next, Invite Friends" class="button" onclick="userLeague.createNewLeague(); return false;" />          
                                        <input type="button" value="Cancel" class="button_alt" onclick="hideleaguepanel(2); return false;" />
                                    </div>
                                    <span id="m_CreateLeagueError"></span>
                                    </form>
                                </div>

                                <!-- Manage league popup -->
                                <div id="m_league_view_4" class="leaguepanel popout" style="display:none;">
                                    <div class="league_title">Manage League</div>
                                    <input type="hidden" id="m_edit_lid" />
                                    <input type="text" id="m_edit_leaguename" placeholder="Name" /><br />
                                    @*<textarea id="w_leaguedesc" rows="2" Placeholder="Desc"></textarea>*@
                                    <input type="radio" name="m_edit_LeagueType" id="m_edit_lt1" value="1">
                                    <label for="m_edit_lt1">
						                This Match Only
					                </label>                    
                                    <br clear="all"/>
                                    <input type="radio" name="m_edit_LeagueType" id="m_edit_lt2" value="2">
                                    <label for="m_edit_lt2">
						                Multi Game League
					                </label>                                        
                                    <div style="border-bottom:1px solid #333; width:100%; height:1px; margin:2px;">&nbsp;</div>
                                    <input type="checkbox" id="m_edit_allowinvites" /> <label for="m_edit_allowinvites">Allow all members of this league to invite players to the league</label>
                                    <br clear="all"/><br clear="all"/>
                                    @*  <input type="button" value="Next, Invite Friends" class="button" onclick="sendRequestViaMultiFriendSelector(); return false;" />          *@
                                    <div style="text-align:center;">
                                        <input type="button" value="Confirm Changes" class="button" onclick="userLeague.EditLeagueDetails(); return false;" style="display:inline-block;"/> 
                                        <input type="button" value="OR Invite Friends" class="button" onclick="userLeague.SendInvitesFromManageLeaguePopup(); return false;" style="display:inline-block;" />          
                                        <br />
                                        <input type="button" value="Cancel" class="button_alt" onclick="hideleaguepanel(4); return false;" />
                                    </div>
                                    <span id="m_CreateLeagueError"></span>
                                </div>

                               <div id="leagueMessageWrapper_mobile" class="scrollable">
                                    <div class="invitepanel" id="m_league_messages">                                   
                                    </div>
                               </div>

                                <div id="wrapper7" class="scrollable">
                                    <div style="width:100%;">                                    
                                        <div class="loadingpanel"><span class="loadingspinner"></span><strong>Loading League Info...</strong><br clear="all" /></div>    

                                        <div id="m_league_view_1" class="leaguepanel"></div>

                                        <div id="m_leaguestandings_1" class="leaguestandings" style="display:none;">      
                                        </div>
                        
                                        <div id="m_league_view_3" class="leaguepanel" style="display:none;">
                                            <div class="league_title">Find League</div>
                                            <input type="text" name="leaguename" placeholder="Find League" /><br />
                                            <input type="button" value="Search" class="button" />      
                                        </div>                          
                                    </div>      
                                </div>
                                <div id="m_league_menu">
                                    <a href="#" id="menubtn1" onclick="userLeague.GetUserLeaguesLinkedToThisFixture(); return false;"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/league-icon1.png" border="0" /><br />MY<br />LEAGUES</a>
                                    <a href="#" id="menubtn2" onclick="showleaguepanel(2); return false;"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/league-icon2.png" border="0" /><br />CREATES<br />LEAGUE</a>
                                    <a href="#" id="menubtn3" onclick="userLeague.GetOfficialLeagues(1); return false;"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/league-icon4.png" border="0" /><br />OFFICIAL<br />LEAGUES</a>
                                </div>

                           </div>
                       </div>
                       <div class="panel" id="panel5">
           	               <div class="panel-wrapper">
               	            
                                <span class="panel-title">The Boot Room</span>

                                <div class="gamemenu">
                            
                                    <div onclick="powerplaypopup();return false;" id="phonepowerplaybadge">
                                        <a id="powerplayclickbtn2" href="#">
                                            <span>0</span>
                                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-pp.png" border="0" alt="Power Play" style="width:100%; max-width:100px;" />
                                        </a>
                                    </div>
                                
                                    <div class="pregameclick" onclick="slider(4);GetPreGameBetDetails();return false;">
                                        <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-pregame-v3.png" border="0" alt="Pre Game Predictions" style="width:100%; max-width:100px;" />
                                        <span class="numPregame">0</span>
                                    </div>

                                    <div onclick="slider(4);ToggleCreditsmanager();return false;">
                                   @*  <div onclick="InviteFriends();return false;">*@
                                        <a id="creditsmanagerclickbtn" href="#">
                                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-1click-v2.png" border="0" alt="1-Click Mode" style="width:100%; max-width:100px;" />
                                        </a>
                                    </div>

                                    <div id="storebadge" onClick="Store.showstore();return false;">
                                        <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-store.png" border="0" alt="Store" style="width:100%; max-width:100px;" />
                                    </div>
                                
                                    <br clear="all" />
                                    <div>
                                         <a href="#" onClick="nicknamePopup();return false;">
                                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-myacc.png" border="0" alt="My Account" style="width:100%; max-width:100px;" />
                                        </a>
                                    </div>

                                    <div onclick="slider(4);ShowTips();return false;">
                                        <a id="helpclickbtn" href="#">
                                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-help-v3.png" border="0" alt="Help" style="width:100%; max-width:100px;" />
                                        </a>
                                    </div> 
                                
                                    <div id="lockedcreditsbadge">
                                        <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-200credit-locked.png" border="0" alt="200 Credits Limit" style="width:100%; max-width:100px;" />
                                    </div>

                                    <div id="unlockedcreditsbadge" style="display:none;">
                                        <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-200credit-unlocked.png" border="0" alt="200 Credits Limit" style="width:100%; max-width:100px;" />
                                    </div>  
                                
                                    <div id="soundbadge-off" onclick="ChangeSound(); return false;" style="display:none;">
                                        <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-soundoff.png" border="0" alt="Turn Sound Off" style="width:100%; max-width:100px;" />
                                    </div>  
                                
                                    <div id="soundbadge-on" onclick="ChangeSound(); return false;" style="display:none;">
                                        <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/badge-soundon.png" border="0" alt="Turn Sound Off" style="width:100%; max-width:100px;" />
                                    </div>                                                     

                                </div>

                           </div>
                        </div>
                   </div><!-- .coda-slider -->

               </div>
	   
	           <div id="coda-nav-1" class="coda-nav">
			       @* <ul>
			           <li class="tab2" id="tab_2"><a onClick="refreshScroller(GameFeedScroller, 'GameFeedInfo');" href="#1"><span class="nav-icon"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_timer.png" border="0" alt="Game Tracker" /></span>Tracker</a></li>
                       <li class="tab3" id="tab_3"><a onClick="refreshScroller(friendsScoreScroller, 'FriendsLeaderboard');" href="#2"><span class="nav-icon"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_friends.png" border="0" alt="Game Tracker" /></span>Friends</a></li>
                       <li class="tab1" id="tab_1"><a href="#3"><span class="nav-icon"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_1.png" border="0" alt="Game Tracker" /></span>Pitch View</a></li>
                       <li class="tab4" id="tab_4"><a onClick="refreshScroller(leaderboardScroller, 'LeagueLeaderboard');" href="#4"><span class="nav-icon"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_leagues.png" border="0" alt="Game Tracker" /></span>Leaderboard</a></li>
                       <li class="tab5" id="tab_5"><a href="#5"><span class="nav-icon"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_star.png" border="0" alt="Game Tracker" /></span>Power Ups</a></li>
                   </ul>*@
                   <ul>
			           <li class="tab1" id="tab_1"><a href="#3"><span class="nav-icon"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_1.png" border="0" alt="Pitch View" /></span></a></li>
                       <li class="tab2" id="tab_2"><a onClick="refreshScroller(GameFeedScroller, 'GameFeedInfo');  return false;" href="#1"><span class="nav-icon"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_timer.png" border="0" alt="Game Tracker" /></span></a></li>
                       <li class="tab3" id="tab_3"><a onClick="refreshScroller(friendsScoreScroller, 'FriendsLeaderboard'); return false;" href="#2"><span class="nav-icon"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_friends.png" border="0" alt="Friends" /></span></a></li>
                       <li class="tab4" id="tab_4"><a onClick="refreshScroller(leaderboardScroller, 'LeagueLeaderboard'); return false;" href="#4"><span class="nav-icon"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_leagues.png" border="0" alt="Leagues" /></span></a></li>
                       <li class="tab5" id="tab_5"><a href="#5"><span class="nav-icon"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon_boot_v2.png" border="0" alt="The Boot Room" /></span></a></li>
                   </ul>
               </div>
       
           </div><!-- .coda-slider-wrapper -->
            
           <audio id="audio" style="display:none"></audio>			                
            
            <div class="game-control-close">
                <div class="close-btn" onClick="slider(0);  return false;">X</div>
            </div>

            <div class="pregame-betpanel">                        
                <div class="pregame-bets-title" style="text-align:left;">
                    Pre-Game Predictions                  
                </div>             
                <!-- featured div gets populated by Ajax function ShowPreGameBets  -->
                <div id="m_BetHTML"></div>

                <div style="text-align:center;">
                    <div class="button" id="confirm_pregame" onclick="placePreGameBets();  return false;">Confirm All Predictions</div>
				    <div class="button-alt" id="cancel_pregame" onclick="closePreGamepanel();  return false;">X</div>
                    <br clear="all" />
                </div>
            </div><!-- pregame-betpanel div -->   
            
        </div><!--/ end #gameplay-screen -->          
                 
    </div><!--/ end #gameplay-->

    





 