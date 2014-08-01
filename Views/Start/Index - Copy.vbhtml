@ModelType LiveGamesClient1._2.LiveGamesModule
@Code
    Layout = "~/Views/Shared/_HomeLayoutPage.vbhtml"
End Code

@Code
    ViewData("Title") = "King of the Kop - Live Interactive Football"
End Code

 



<div data-role="page" data-theme="a" id="main">
   
   <div id="content">
       
            <!-- game tutorial -->
            <div class="howtopopup" id="m_howtotutorial" style="display:none;">                
                                
                <div class="slidecontainer">
                    
                    <div id="m_howtoslide2" class="howtoslide" style="display:block;">
                        <h2 style="text-align:center;">Welcome to Training, Let's start with a Warm-Up!</h2>             
                        <p><img src="https://dtdz2jt169rfw.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> The aim of the game is to Predict what happens next in the match! You win credits by predicting correctly, and the more you win the further you go up the leaderboard!</p>
                        <p>If you find yourself struggling at the bottom of the table use Powerplays and Forfeits to your advantage. One big win can change the game!</p>
                        <br /><span onClick='showslide(3);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>                        
                    </div>

                    <div id="m_howtoslide3" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How do I make a Prediction?</h2>             
                        <p><img src="https://dtdz2jt169rfw.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> There are 2 types of Predictions, Pre-Game Predictions and In-Game Predictions.</p>
                        <p>Before a Match kicks off you can make bonus predictions to win extra credits during the game. These include First Goalscorer, First Team to Score, the Half-Time result, the Full-Time result and the Number of Freekicks/Throws in each half.</p>
                        <br />
                        <span onClick='showslide(2);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>
                        <span onClick='showslide(4);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div> 

                    <div id="m_howtoslide4" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How do I make a Prediction?</h2>             
                        <p><img src="https://dtdz2jt169rfw.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> During gameplay you will see 10 markers on the pitch which represent 10 events that take place during a game, each event has odds based on their likelyhood.</p>
                        <p>
                            <img src="https://dtdz2jt169rfw.cloudfront.net/images/icon-helper.png" border="0" alt="" style="width:100%;" />                            
                        </p>
                        <p>Each team has 4 events associated with them, GOAL, WIDE, CORNER and SAVE. You can differentiate between these by the team colours. There are also 2 generic events, THROW IN and FREEKICK.</p>
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
                        <p><img src="https://dtdz2jt169rfw.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> During Gameplay you will see a Friends Leaderboard as well as the Overall Leaderboard. If your Facebook Friends are playing they will appear in your Friends Leaderboard along with their score.</p>
                        <p>Whenever your friends makes a Prediction you will see a &#9787; beside their name.</p>                         
                        <span onClick='showslide(4);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>                        
                        <span onClick='showslide(6);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div> 
                    
                    <div id="m_howtoslide6" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">Congratulations <span class="username"></span>, You have completed Game Training!</h2> 
                        <p style="text-align:center;">
                            <img src="https://dtdz2jt169rfw.cloudfront.net/images/badge-training.png" border="0" alt="" />
                        </p>                     
                        <span onClick='showslide(5);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>   
                    </div>  
                </div>                
                <span class="button" onClick="showhowtoplay(); return false;">I'm done with Training, Let's Play!</span>
            </div> 

       <div class="howtopopup" id="w_howtotutorial" style="display:none;">                
                                
                <div class="slidecontainer">
                    
                    <div id="w_howtoslide2" class="howtoslide" style="display:block;">
                        <h2 style="text-align:center;">Welcome to Training, Let's start with a Warm-Up!</h2>             
                        <p><img src="https://dtdz2jt169rfw.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> The aim of KING OF THE KOP is to Predict what event happens next in the match! You win credits by predicting correctly, and the more you win the further you go up the leaderboard!</p>
                        <p>If you find yourself struggling at the bottom of the table use Powerplays and Forfeits to your advantage. One big win can change the game!</p>
                        <br /><span onClick='showslide(3);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>                        
                    </div>

                    <div id="w_howtoslide3" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How do I make a Prediction?</h2>             
                        <p><img src="https://dtdz2jt169rfw.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> There are 2 types of Predictions, Pre-Game Predictions and In-Game Predictions.</p>
                        <p>Before a Match kicks off you can make bonus predictions to win extra credits during the game. These include First Goalscorer, First Team to Score, the Half-Time result, the Full-Time result and the Number of Freekicks/Throws in each half.</p>
                        <br />
                        <span onClick='showslide(2);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>
                        <span onClick='showslide(4);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div> 

                    <div id="w_howtoslide4" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How do I make a Prediction?</h2>             
                        <p><img src="https://dtdz2jt169rfw.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> During gameplay you will see 10 markers on the pitch which represent 10 events that take place during a game, each event has odds based on their likelyhood.</p>
                        <div>
                            <img src="https://dtdz2jt169rfw.cloudfront.net/images/icon-helper.png" border="0" alt="" style="width:100%;" />                            
                        </div>
                        <p>Each team has 4 events associated with them, GOAL, WIDE, CORNER and SAVE. You can differentiate between these by the team colours. There are also 2 generic events, THROW IN and FREEKICK.</p>
                        <p>To make a Prediction, click on an event, you will be presented with a popup which allows you to select the amount of credits you are willing to risk.</p>
                        <br />
                        <span onClick='showslide(3);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>
                        <span onClick='showslide(5);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div>

                    <div id="w_howtoslide5" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">How to Play with Friends</h2>            
                        <p><img src="https://dtdz2jt169rfw.cloudfront.net/images/coach.png" border="0" alt="Coach" style="margin:0px 10px 15px 10px; float:left;"/> During Gameplay you will see a Friends Leaderboard as well as the Overall Leaderboard. If your Facebook Friends are playing they will appear in your Friends Leaderboard along with their score.</p>
                        <p>Whenever your friends makes a Prediction you will see a notification on screen and an icon beside their name.</p>                         
                        <span onClick='showslide(4);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>                        
                        <span onClick='showslide(6);return false;' class='navbtn'>Next Drill <strong>&#8250;</strong></span>
                    </div> 
                    
                    <div id="w_howtoslide6" class="howtoslide" style="display:none;">
                        <h2 style="text-align:center;">Congratulations <span class="username"></span>, You have completed Game Training!</h2> 
                        <p style="text-align:center;">
                            <img src="https://dtdz2jt169rfw.cloudfront.net/images/badge-training.png" border="0" alt="" />
                        </p>                     
                        <span onClick='showslide(5);return false;' class='navbtn'><strong>&#8249;</strong> Previous</span>   
                    </div>  
                </div>                
                <span class="button" onClick="showhowtoplay(); return false;">I'm done with Training, Let's Play!</span>
            </div>

            <!-- tech req -->
            <div class="howtopopup" id="techsupport" style="display:none;">                
                <h1>What do you need to play this game?</h1>   
                <p><strong>Browsers</strong><br />King Of The Kop can be played on your Smartphone, Tablet, Desktop or Laptop using a modern web browser. We recommend using the latest version of Chrome, Firefox or Safari on your PC/Laptop. Use the native OS browser on your Android or Apple Smartphone/Tablet.</p>
                <p>King Of The Kop uses leading edge web technology that is not supported in older browsers. Please upgrade to play, it’s worth it!</p> 
                <p><strong>Internet Connection</strong><br />You will need a stable Internet connection to fully enjoy King Of The Kop. You can play over Wifi or 3G, but we would highly recommend using Wifi. If the game is constantly reconnecting during a match we would advise that you check your Internet connection or switch to Wifi if you are on 3G.</p>            
                <p><strong>Known Issues</strong><br />O2 Ireland Customers using 3G will need to update their APN settings in order to play. Update your APN from 'Internet' to 'Open.Internet'.<br /></p>
                <span class="button" onClick="showtech();">I get it, Let's Play!</span>
            </div>            
            <div class="tooltip-shade" style="display:none;"></div>
    
            <div class="game-menu" style="height:100%;">
                <span id="homeSpan"></span><!-- DO NOT REMOVE THIS SPAN _ EVER!!!!!! _ IT TELLS US WHAT PAGE WE ARE ON -->
                 
                 <span id="logout"></span>

                 <div id="webview">
                   
                     <div class="promo">        
                      <div style="width:100%;">

                        <div style="float:left; width:63%; height:500px; position:relative; text-align:right;">
                          <img src="https://dtdz2jt169rfw.cloudfront.net/images/intro-3d-text.png" border="0" alt="What Happens Next?" style="position:relative; top:30px; max-width:100%;">	                          
                        </div>

                        <div style="float:right; width:360px; max-width:36%; height:500px; background:#0e1013; box-shadow:inset 0px 5px 10px #000;">    
                                
                              <div class="panelheader"><img src="https://dtdz2jt169rfw.cloudfront.net/images/match-icon.png" border="0" style="vertical-align:middle;" /> Kick Off 
                                  <span id="w_kickoffcountdown"><span class="matchcountdown" id="matchcountdown">
                                      <span>00 Days</span><span>00 Hrs</span><span>00 Mins</span>
                                  </span></span>
                              </div>
                              <div class="panelcontent">                              
                                  <div class="match_intro">
				                      <span class="home_team_desc">@ViewBag.HomeTeam</span>
                                      <span class="seperator">&nbsp;</span>
                                      <span class="away_team_desc">@ViewBag.AwayTeam</span>		
                                      <br clear="all"/>
			                      </div>	
                                  <img class="fcrest" src="@ViewBag.fixturecrest" border="0" alt="What Happens Next?" style="width:100%; margin:auto;">	
                                  <strong>@ViewBag.fixturedescription</strong>
                              </div>
                            
                              <div class="panelheader"><img src="https://dtdz2jt169rfw.cloudfront.net/images/tracker-icon.png" border="0" style="vertical-align:middle;" /> Game Tracker</div>
                              <div class="panelcontent" style="text-align:left; font-size:1.1em; line-height:20px;">
                                  <div id="wrapper" class="scrollable" style="height:155px;">
					                <div class="GameFeedInfo">                                      
                                    </div>
                                  </div>
                              </div>

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
			 <div>Enter your registered email address</div>
			 <fieldset>
				 <input type="email" placeholder="Email" />
				 <input type="submit" value="Reset Password" />
			 </fieldset>
			 <div><span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">Cancel X</span></div>
		 </div>

	</div>

                     <div class="navbar" style="position:relative;">
                         <!-- registration link -->
	                           <div onclick="show_registration();" id="w_registration_btn">Don't have a Facebook account? Click here to Play</div>
	                           <!--/ registration link -->

                                <div style="position:absolute; left:5px; top:5px;"><img src="https://dtdz2jt169rfw.cloudfront.net/images/kingkop-logo.png" /></div>
                                <span class="nav" onClick="showhowtoplay();"><img src="https://dtdz2jt169rfw.cloudfront.net/images/navbar-icon1.png" alt="How to play" border="0" /> <span>How to<br/>play</span></span>
                                <a id="PlayLink" style="display:none;" class="playnow" onClick="return CheckIfLoggedIn(@ViewBag.fixtureID);" href="/Game/?f=@ViewBag.fixtureID"><img src="https://dtdz2jt169rfw.cloudfront.net/images/playnow-new-btn.png" alt="Play Now!" border="0" /></a>
                                <span class="nav" onClick="showtech();" style="border-left:none;"><img src="https://dtdz2jt169rfw.cloudfront.net/images/navbar-icon2.png" alt="How can I play?" border="0" /> <span>Browser<br/>Support</span></span>
                     </div>   
                 </div>
    
                <!-- mobile view below here -->
                 <div id="mobileview" style="display:none;">
                   <div class="promo">        
                      <div style="width:100%;">



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
				 <input type="email" placeholder="Email" />
				 <input type="submit" value="Reset Password" />
			 </fieldset>
			 <div><span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">Cancel X</span></div>
		 </div>

	</div>




                        <div style="background:#b50909; padding:0.5em;">
                            <img src="https://dtdz2jt169rfw.cloudfront.net/images/kingkop-logo-horz.png" border="0" />
                        </div>

                          <div class="column_tracker">
                              <img src="https://dtdz2jt169rfw.cloudfront.net/images/intro-3d-text.png" border="0" alt="What Happens Next?" style="max-width:90%; max-height:100%;">	                          

                              <!-- registration link -->
	                            <div onclick="show_registration();" id="m_registration_btn">Don't have a Facebook account? Click here to Play</div> 
	                          <!--/ registration link -->
                          </div>
                          
                          <div class="column_gameinfo">

                           <div class="panelheader" style="position:relative;">K.O
                                <span id="m_kickoffcountdown" >
                                    <span class="matchcountdown" id="m_matchcountdown">
                                      <span>00 Hrs</span><span>00 Mins</span><span>00 Secs</span>
                                  </span>
                                </span>
                           </div> 

                          <div class="match_intro">
				              <span class="home_team_desc">@ViewBag.HomeTeam</span>
                              <span class="seperator">&nbsp;</span>
                              <span class="away_team_desc">@ViewBag.AwayTeam</span>		
                              <br clear="all"/>
			              </div>	
                          <img class="fcrest" src="@ViewBag.fixturecrest" border="0" alt="What Happens Next?" style="width:100%; margin:auto;" />	
                          <strong>@ViewBag.fixturedescription</strong>
                        
                           <div class="navbar">               
                                <a id="PlayLink" style="display:none;" class="playnow" onClick="return CheckIfLoggedIn(@ViewBag.fixtureID);" href="/Game/?f=@ViewBag.fixtureID"><img src="https://dtdz2jt169rfw.cloudfront.net/images/playnow-new-btn.png" alt="Play Now!" border="0" /></a>
                           </div>

                        </div>
                      
                       <!--<div class="column_tracker">
                           
                           <div class="panelheader"><img src="https://dtdz2jt169rfw.cloudfront.net/images/tracker-icon.png" border="0" style="vertical-align:middle;" /> Game Tracker </div>
                              <div class="panelcontent" style="text-align:left; font-size:1.1em; line-height:20px;">
                                  <div id="wrapper5" class="scrollable">
					                <div class="GameFeedInfo">                                      
                                    </div>
                                  </div>
                              </div>
                      </div>-->

                      <br clear="all"/>		   
                     
                  </div>    
                </div> 
                 <script type="text/javascript">
                     loginFixtureID = @ViewBag.fixtureID; //NB - John - this needs to be the same id as number in the url above ie. if url = /Game/?f=8 therefore loginFixtureID = 8
                 </script> 
            </div>
     </div>
</div><!-- /page -->

<!--[if gte IE 9]>
  <style type="text/css">
    .gradient {
       filter: none;
    }
  </style>
<![endif]-->
@*<script type="text/javascript">
    Login.DoEmailLoginChecks("@ViewBag.fixtureID"); //check if this user is an eamil user - and log them in if they are and we can!!!

    var now = new Date();
    var startDate = new Date("@ViewBag.starttime"); //newcastle game!!!
    if (now > startDate)
    {
        //the game should have already kicked off - so dont show the countdown!!!!!
        $('#m_kickoffcountdown').hide();
        $('#w_kickoffcountdown').hide();
    }
    else{
        $('#matchcountdown').countdown({until: startDate, format: 'dHMS',  layout: '<span>{dn} {dl}</span><span>{hn} {hl}</span><span>{mn} {ml}</span><span>{sn} {sl}</span>'});
        $('#m_matchcountdown').countdown({until: startDate, format: 'HMS',  layout: '<span>{hn} {hl}</span><span>{mn} {ml}</span><span>{sn} {sl}</span>'});
    }
    
    $(document).ready(function() {
        var winheight = $(window).height();
        $('#mobileview .promo').height(winheight);
    });
    $(window).resize(function() {
        var winheight = $(window).height();
        $('#mobileview .promo').height(winheight);
    });
    
    //function to call to switch slides in how to play popup!
    function showslide(s) {
         var slideid = s;
         $('.howtoslide').hide();
         $('#' + displaymode + '_howtoslide' + slideid).fadeIn('slow');
         $('body').scrollTop(0);
    }
    
    var fixturecrest = "@ViewBag.fixturecrest";
    if (fixturecrest) {
        $('.fcrest').show();
    } else {
        $('.fcrest').attr('src',"https://dtdz2jt169rfw.cloudfront.net/images/blank-crests.png");
    }

 </script>
                *@
