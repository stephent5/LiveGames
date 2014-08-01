<!DOCTYPE html>
<html xmlns:fb="https://www.facebook.com/2008/fbml">
<!-- --------------Facebook --> <!-- We are now loading the facebook javascript before anything else!!!!!! -->
    <div id="fb-root"></div>
    <script src="/Scripts/fb.js" type="text/javascript"></script>
<!-- --------------END Facebook -->
<head>
    <meta charset="utf-8" />
    <title>@ViewData("Title")</title>

    <!-- -------------- Styles -->
    @Helpers.Style("jquery.mobile-1.0b1.css", Url)
    @Helpers.Style("ui-styles.css", Url)
    <!-- -------------- The StyleSheet returned from the below function determines which template ( and therefore which modules) get used -->
        @Code
            Html.RenderAction("GetStyle", "StyleSelector", New With {.FileName = "HomePageStyle.xml"})
        End Code
    <!-- -------------- End Template Function -->
    <!-- -------------- END Styles -->

    <!-- -------------- JS Scripts  -->
    <script type="text/javascript">
        //this function is a global error catcher
        window.onerror = function (msg, url, lineNo) {
            logError("onerror", msg, url, lineNo);
        }   
    </script>

    @* -------------- These 2 Scripts are not stored locally - we should look at reading these in from a CDN   *@

    <script src="http://code.jquery.com/jquery-1.6.2.min.js" type="text/javascript"></script>

    @Helpers.Script("error.js", Url)
    @Helpers.Script("init.js", Url)

    @* <script src="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.js" type="text/javascript"></script>*@

    <!-- END external scripts -->
    @Helpers.Script("jquery.json-2.3.js", Url)

    @Helpers.Script("error.js", Url)

    @Helpers.Script("fball/fballobj.js", Url)
    @Helpers.Script("fball/sendfball.js", Url)

    @Helpers.Script("lsbind.js", Url)
    @Helpers.Script("lscommons.js", Url)
    @Helpers.Script("lspushpage.js", Url)

    @Helpers.Script("interface/ui.js", Url)
    @Helpers.Script("config.js", Url)
    @Helpers.Script("customObjects/bet.js", Url)
    @Helpers.Script("modernizr-1.7.min.js", Url)
    @Helpers.Script("user.js", Url)
    @Helpers.Script("leaderboard/leaderboardmanagement.js",Url)
    @Helpers.Script("league/leaguemanger.js", Url)

    <!-- -------------- END JS Scripts -->
</head>
<body>

    <div class="page">           
           
                    <header id="header">	
                        @*   <fb:login-button autologoutlink="true" perms="email,user_birthday,status_update,publish_stream"></fb:login-button>                *@
                           <button id="fb-auth" style="display:none"></button>
                           <a href="/Home/"><span class="username"></span></a>
		                   <a href="/Home/">Main Menu</a>
		                   <br clear="all"/>

                           <script type="text/javascript">
                                       FaceBookElementsLoaded();
                           </script>
                    </header>

		<div class="logo"></div>

		<div class="credits_panel" >&nbsp;<span class="currentscore"><span class="credits"></span></span></div>

        <section id="main">
            <i>IP is @HttpContext.Current.Request.ServerVariables("LOCAL_ADDR")</i>
            @RenderBody()
        </section>

    </div>
     
    @*The below section includes the scripts  that we need for the GamePlay - if we put this in head it doesn't seem to work ( looks like the head is obnly ever used from the first layout page)*@
    @*Scripts included here as it is (supposed to be) quicker*@
    @RenderSection("GamePlayScripts",False)
</body>
</html>


