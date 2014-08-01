@ModelType LiveGamesClient1._2.LiveGamesModule
@Code
    Layout = "~/Views/Shared/_HomeLayoutPage.vbhtml"
End Code

@Code
    ViewData("Title") = "King of the Kop - Live Interactive Football"
End Code

<link href='http://fonts.googleapis.com/css?family=Roboto:400,300,700|Roboto+Condensed:400,700' rel='stylesheet' type='text/css'>
@Helpers.Style("landingstyles.css", Url, False)

	<div id="container">

	<header id="header">
		<nav id="nav">
		</nav>
	</header>


        <div id="mobileNav" style="background-color:white;height:25px;width:100%;">

        </div>

	<section id="content">

		<div class="column-1">

			<h1>WATCH LFC PLAY AND <span class="highlight">PREDICT WHAT HAPPENS </span><span class="highlight">NEXT</span> IN THE GAME</h1>

			<ul id="features">
				<li>WIN CREDITS BY PREDICTING CORRECTLY</li>
				<li>PLAY AGAINST YOUR FRIENDS</li>
				<li>USE POWERPLAYS, FORFEITS + MORE TO GAIN AN ADVANTAGE</li>
				<li>TOP THE OFFICIAL LEAGUE TO WIN PRIZES</li>
			</ul>

		</div>

		<div class="column-1">

			@*<ul class="rslides" id="slider1">
			  <li><img src="http://d2q72sm6lqeuqa.cloudfront.net/images/screen7.jpg" alt="" /></li>
			  <li><img src="http://d2q72sm6lqeuqa.cloudfront.net/images/screen2.jpg" alt="" /></li>
			  <li><img src="http://d2q72sm6lqeuqa.cloudfront.net/images/screen3.jpg" alt="" /></li>
			  <li><img src="http://d2q72sm6lqeuqa.cloudfront.net/images/screen4.jpg" alt="" /></li>
			  <li><img src="http://d2q72sm6lqeuqa.cloudfront.net/images/screen5.jpg" alt="" /></li>
			  <li><img src="http://d2q72sm6lqeuqa.cloudfront.net/images/screen6.jpg" alt="" /></li>
			</ul>*@

            <div class="panelheader"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/match-icon.png" border="0" style="vertical-align:middle;" /> Kick Off 
                <span id="w_kickoffcountdown">
                    <span class="matchcountdown" id="matchcountdown">
                   
                    </span>
                </span>
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
		</div>

		<div class="clear"></div>

		<div class="playnow-area">
			<div class="column-1" style="border-right:1px solid #333;"  id="webVisit">
				<img src="http://d2q72sm6lqeuqa.cloudfront.net/images/devices.png" />
				
                <a id="PlayLink" href="/Game/?f=@ViewBag.fixtureID" class="play-btn" onClick="return Login.CheckIfLoggedIn(@ViewBag.fixtureID);" >Visit Game</a>	
			    <br />
				<div onclick="show_registration();" id="w_registration_btn" style="color:white;float:right;width:150px;display:none;bottom:5px;position:absolute;right:10px;"><span id="FBAsk"></span></div>
			</div>

			<div id="nonIE" class="column-1">				
				<img src="http://d2q72sm6lqeuqa.cloudfront.net/images/facebook-app.png" />
				<a href="http://apps.facebook.com/kingofkop/?fl=1" target="_blank" class="play-btn">Visit Game</a>
			</div>

  			<div id="FBOnlyDiv" style="width : 50%;position : relative;display : none;margin : 0px auto;">
		            <img src="http://d2q72sm6lqeuqa.cloudfront.net/images/facebook-app.png" />
			       
                    <a href="/Game/?f=@ViewBag.fixtureID" onClick="return Login.CheckIfLoggedIn(@ViewBag.fixtureID);" class="play-btn">Visit Game</a>
		    </div>

			<div class="clear"></div>
		</div>

        <div id="FBMobilePrompt"  onclick="show_registration();" style="display:none;text-align:right;color:white;background-color:#3d3d3d;width:100%;padding-right:5px;;padding-bottom:5px;box-sizing:border-box;">Don't want Facebook login? Click here</div>

        @* start email registration/login for web*@
        <div id="w_registration_form" style="display:none;">
                         
		 <div class="tab" id="w_register_tab" onclick="show_registerform();">Register</div>
          <div class="tab" id="w_login_tab" onclick="show_login();">Sign In</div>
		 
		 <!-- register screen - shown by default -->
		 <div id="w_register">
			 <div id="w_registerdetails">Enter your email address and password to Register to Play.</div>
			 <fieldset>
				 <input type="text" placeholder="Nick Name"  id="w_username" />
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
                 <input type="checkbox" name="RememberMe" value="1" id="w_rm"> Remember Me<br>
			 </fieldset>
			 <div><span onclick="forgot_pass();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:inline-block;">Forgot Password</span> / <span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:inline-block;">Cancel X</span></div>
		 </div>

		 <!-- forgot password screen -->
		 <div id="w_forgotpass" style="display:none;">
			 <div id="w_resenddetails">Enter your registered email address</div>
			 <fieldset>
				 <input type="email" placeholder="Email" id="w_rsemail" />
				 <input type="submit" value="Send Password" onclick="Login.ResendPassword(); return false;" />
			 </fieldset>
			 <div><span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">Cancel X</span></div>
		 </div>

        <div id="w_passResent" style="display:none;">
			 Password sent - check your inbox!!
			 <div><span onclick="cancel_registration();" style="font-weight:bold; padding:0.5em; cursor:pointer; display:block;">OK</span></div>
		 </div>

	</div>

       @* end email registration/login for web*@



		<div class="belowfold-content">

			<div class="column-1 padded">

				<h2 style="color:#c21616">Are YOU King of the Kop?</h2>
				
				<p>Play during each game that is broadcast live this season for your chance to win great <a href="/Prizes">LFC prizes.</a></p>
				<p>From signed balls, vouchers for use in the club store and even an Ian Rush signed 82 shirt.</p>
				
				<p>SIGN UP NOW!</p>
			

				<br/>

				<h2>HOW TO PLAY</h2>

				<p style="font-size:1.4em;">The aim of <strong style="color:#c21616">KING OF THE KOP</strong> is to predict what event happens next in a live match! You win credits by predicting correctly, and the more you win the further you go up the leaderboard!</p>
				<p>During gameplay you will see 10 markers on the pitch which represent 10 events that take place during a game, each event has odds based on their likelihood.</p>
				<p>Each team has 4 events associated with them, <strong>GOAL, WIDE, CORNER</strong> and  <strong>SAVE</strong>. You can differentiate between these by the team colours. There are also 2 generic events, <strong>THROW IN</strong> and <strong>FREE-KICK</strong>.</p>
				<p>Before a match kicks off you can make bonus predictions to win extra credits during the game. These include First Goalscorer, First Team to Score, the Half-Time Result, the Full-Time Result and the Number of Free-kicks/Throws in each half.</p>
				<p>During gameplay you will see a Friends Leaderboard as well as the Overall Leaderboard. If your Facebook Friends are playing they will appear in your Friends Leaderboard along with their score.</p>
			</div>

			<div class="column-1 padded">

				<h2>Support</h2>

				<p>For help or tech support please contact us via email, <a href="mailto:support@liveplayfootball.com">support@liveplayfootball.com</a> or send us your feedback on Twitter <a href="https://twitter.com/canyoubeking" target="_blank">@@canyoubeking</a></p>

				<p><br/></p>
				
				<h2>NEWS</h2>
				
				<a class="twitter-timeline" href="https://twitter.com/canyoubeking" data-widget-id="349853435388129280">Tweets by @@canyoubeking</a>
				<script>!function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https'; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = p + "://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs); } }(document, "script", "twitter-wjs");</script>

			</div>

			<div class="clear"></div>

		</div>

	</section>

	<footer></footer>

</div>

  
	

