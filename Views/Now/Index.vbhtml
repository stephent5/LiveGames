@ModelType LiveGamesClient1._2.LiveGamesModule
@Code
    'Layout = "~/Views/Shared/_HomeLayoutPage.vbhtml" 'no longer use this as the homelayout page now uses styles that were intially developed for the landing page!!!!
End Code

@Code
    ViewData("Title") = "King of the Kop - Live Interactive Football"
End Code

<div data-role="page" data-theme="a" id="main" title="Live Games">
   
   <div id="content">

   
    <div id="header home"></div>

        <div class="logo home"></div>
            
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
            <div class="howtopopup" id="m_howtotutorial" style="display:none;">                
                                
                <div class="slidecontainer">
                    
                    <div id="m_howtoslide2" class="howtoslide" style="display:block;">
                        <h2 style="text-align:center;">Welcome to Training, Let's start with a Warm-Up!</h2>             
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
                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/icon-helper.png" border="0" alt="" style="width:100%;" />                            
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

            <!-- tech req -->
            <div class="howtopopup" id="techsupport" style="display:none;">                
                <h1>What do you need to play this game?</h1>   
                <p><strong>Browsers</strong><br />T5Live Games can be played on your Smartphone, Tablet, Desktop or Laptop using a modern web browser. We recommend using the latest version of Chrome, Firefox or Safari on your PC/Laptop. Use the native OS browser on your Android or Apple Smartphone/Tablet.</p>
                <p>T5Live Games uses leading edge web technology that is not supported in older browsers. Please upgrade to play, it’s worth it!</p> 
                <p><strong>Internet Connection</strong><br />You will need a stable Internet connection to fully enjoy T5Live Games. You can play over Wifi or 3G, but we would highly recommend using Wifi. If the game is constantly reconnecting during a match we would advise that you check your Internet connection or switch to Wifi if you are on 3G.</p>            
                <p><strong>Known Issues</strong><br />O2 Ireland Customers using 3G will need to update their APN settings in order to play. Update your APN from 'Internet' to 'Open.Internet'.<br /></p>
                <span class="button" onClick="showtech();">I get it, Let's Play!</span>
            </div>            
            <div class="tooltip-shade" style="display:none;"></div>
    
            <div class="game-menu" style="height:94%;">
             @*  start of xml replace*@
                <span id="homeSpan"></span> <!-- DO NOT REMOVE THIS SPAN _ EVER!!!!!! _ IT TELLS US WHAT PAGE WE ARE ON -->
                <span id="logout" style="left:90%;"></span>

                 <div id="webview">
                   <div class="promo" style="padding-top:50px;">        
                      <div style="width:900px; height:400px; margin:auto; line-height:50px;">
                        <div style="width:100%; text-align:center;">
                          <br clear="all">		
                          <br clear="all">	
                          <br/>
                          <div class="match_intro" style="margin:0 auto; width:340px;">
				              <span class="home_team_desc">@ViewBag.HomeTeam</span>
                              <span class="seperator">V</span>
                              <span class="away_team_desc">@ViewBag.AwayTeam</span>		
                              <br clear="all"/>
			                    </div>	
                          <br clear="all"/>
                         @* <strong>KICKOFF @ViewBag.KickOffTime (GMT)</strong>*@
                        </div>
                        <br clear="all"/>
                      </div>
		               </div>  
                    
                     <div id="w_registration_form" style="display:none;">
                         
		 <div class="tab" id="w_register_tab" onclick="show_registerform();">Register</div><div class="tab" id="w_login_tab" onclick="show_login();">Sign In</div>
		 
		             <!-- register screen - shown by default -->
		             <div id="w_register">
	         
                         <div id="w_registerdetails">Enter your email address and password to Register to Play.</div>
			                 <fieldset>
				                 <input type="text" placeholder="username"  id="w_username" />
				                 <input type="email" placeholder="Email" id="w_email" />
				                 <input type="password" placeholder="Password" id="w_pass1" />
				                 <input type="password" placeholder="Confirm Password" id="w_pass2" />
				                 <input type="submit" value="Register" onClick="Login.Register(); return false;"  /> @*onClick="confirm_registration();"*@
			                 </fieldset>
			                 <div><span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">Cancel X</span></div>
		                 </div>

		                 <!-- confirmation screen after submitting registration form -->
		                 <div id="w_confirm" style="display:none;">
			                  <div>Check your inbox for a confirmation email. Click on the link provided to access the game. Remember your login details for the next time you play. <span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">Close X</span></div>
		                 </div>

		                 <!-- login screen -->
		                 <div id="w_login" style="display:none;">
			                 <div id="w_logindetails">Enter your registered email address and password to Sign In to Play.</div>
			                 <fieldset>
				                 <input type="email" placeholder="Email" id="w_email_login" />
				                 <input type="password" placeholder="Password" id="w_pass_login" />
				                 <input type="submit" value="Sign In" onClick="Login.Login(@ViewBag.fixtureID); return false;" />
			                 </fieldset>
			                 <div><span onclick="forgot_pass();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:inline-block;">Forgot Password</span> / <span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:inline-block;">Cancel X</span></div>
		                 </div>

		                 <!-- forgot password screen -->
		                 <div id="w_forgotpass" style="display:none;">
			                 <div id="w_resenddetails">Enter your registered email address</div>
			                 <fieldset>
				                 <input type="email" placeholder="Email" id="w_rsemail" />
				                 <input type="submit" value="Reset Password" onclick="Login.ResendPassword(); return false;" />
			                 </fieldset>
			                 <div><span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">Cancel X</span></div>
		                 </div>

                        <div id="w_passResent" style="display:none;">
			                 Password sent - check your inbox!!
			                 <div><span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">OK</span></div>
		                 </div>

	                </div>

                   <div class="navbar" style="position:relative;">
                        <!-- registration link -->
	                    <div onclick="show_registration();" id="w_registration_btn">Don't have a Facebook account? Click here to Play</div>
	                    <!--/ registration link -->
                       <a id="PlayLink" style="display:none;" class="playnow" onClick="return Login.CheckIfLoggedIn(@ViewBag.fixtureID);" href="/Game/?f=@ViewBag.fixtureID"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/playnow-new-btn.png" alt="Play Now!" border="0" /></a>
                   </div>  
                          
                 </div>
    
                <!-- mobile view below here -->
                 <div id="mobileview" style="display:none;">
                   <div class="promo">        
                      <div style="width:100%; text-align:center;">

                     <div id="m_registration_form" style="display:none;">
                         
		                    <div class="tab" id="m_register_tab" onclick="show_registerform();">Register</div><div class="tab" id="m_login_tab" onclick="show_login();">Sign In</div>
	 
		                     <!-- register screen - shown by default -->
		                     <div id="m_register">
			                     <div>Enter your email address and password to Register to Play.</div>
			                     <fieldset>
				                     <input type="email" placeholder="Email" />
				                     <input type="password" placeholder="Password" />
				                     <input type="password" placeholder="Confirm Password" />
				                     <input type="submit" value="Register" onClick="confirm_registration();" />
			                     </fieldset>
			                     <div><span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">Cancel X</span></div>
		                     </div>

		                      <!-- confirmation screen after submitting registration form -->
		                     <div id="m_confirm" style="display:none;">
			                      <div>Check your inbox for a confirmation email. Click on the link provided to access the game. Remember your login details for the next time you play. <span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">Close X</span></div>
		                     </div>

		                     <!-- login screen -->
		                     <div id="m_login" style="display:none;">
			                     <div>Enter your registered email address and password to Sign In to Play.</div>
			                     <fieldset>
				                     <input type="email" placeholder="Email" />
				                     <input type="password" placeholder="Password" />
				                     <input type="submit" value="Sign In" />
			                     </fieldset>
			                     <div><span onclick="forgot_pass();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:inline-block;">Forgot Password</span> / <span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:inline-block;">Cancel X</span></div>
		                     </div>

		                     <!-- forgot password screen -->
		                     <div id="m_forgotpass" style="display:none;">
			                     <div>Enter your registered email address</div>
			                     <fieldset>
				                     <input type="email" placeholder="Email"/>
				                     <input type="submit" value="Reset Password" onclick="Login.ResendPassword(); return false;" />
			                     </fieldset>
			                     <div><span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">Cancel X</span></div>
		                     </div>

	                    </div>

                        <div style="background:#b50909; padding:0.5em;">
                            <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/kingkop-logo-horz.png" border="0" />
                        </div>

                          <div class="column_tracker">
                              <br /><br />
                              <!-- registration link -->
	                            <div onclick="show_registration();" id="m_registration_btn">Don't have a Facebook account? Click here to Play</div> 
	                          <!--/ registration link -->
                          </div>
                          
                          <div class="column_gameinfo">

                          <div class="match_intro">
				              <span class="home_team_desc">@ViewBag.HomeTeam</span>
                              <span class="seperator">V&nbsp;</span>
                              <span class="away_team_desc">@ViewBag.AwayTeam</span>		
                              <br clear="all"/>
			              </div>	
                          <strong>@ViewBag.fixturedescription</strong>
                        
                           <div class="navbar">               
                                <a id="PlayLink" style="display:none;" class="playnow" onClick="return Login.CheckIfLoggedIn(@ViewBag.fixtureID);" href="/Game/?f=@ViewBag.fixtureID"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/playnow-new-btn.png" alt="Play Now!" border="0" /></a>
                           </div>

                        </div>
                 </div>     
                 <script type="text/javascript">
                     loginFixtureID = @ViewBag.fixtureID; //NB - John - this needs to be the same id as number in the url above ie. if url = /Game/?f=8 therefore loginFixtureID = 8
                 </script> 
            </div>
             @*  end of xml replace*@

             @*  <script type="text/javascript"> 
                      FaceBookElementsLoaded(); //now do this at end of homepage - cos we need to run it after we have loaded fb.js and this file now runs last (as it needs to run after we check the modernizr browser compatibilities) 
                </script>*@
            </div>
     </div>
</div><!-- /page -->
