@Code
    Layout = Nothing
End Code

<!DOCTYPE html>
<!-- --------------Facebook --> <!-- We are now loading the facebook javascript before anything else!!!!!! -->
    <div id="fb-root"></div>
    <script src="/Scripts/fb.js" type="text/javascript"></script>
<!-- --------------END Facebook -->
<html>
<head runat="server">
    <title>TestFB</title>
     <meta charset="utf-8" />
    <title>@ViewData("Title")</title>

    <!-- -------------- Styles -->
    @Helpers.Style("jquery.mobile-1.0b1.css", Url)
    @Helpers.Style("ui-styles.css", Url)
    <!-- -------------- The StyleSheet returned from the below function determines which template ( and therefore which modules) get used -->
        @Code
            'Html.RenderAction("GetStyle", "StyleSelector", New With {.FileName = "HomePageStyle.xml"})
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


@*
    <div id="fb-root"></div>
        <script>
            (
                function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s); 
                js.id = id;
                js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=276786905679012";
                fjs.parentNode.insertBefore(js, fjs);
                } (document, 'script', 'facebook-jssdk')
            );
    </script>*@

    <div>
     @*   <div class="fb-login-button" data-show-faces="true" data-width="200" data-max-rows="1"></div>*@
     @*  <fb:login-button perms="email,offline_access" show-faces="true"></fb:login-button>*@
     <fb:login-button perms="email,publish_actions" show-faces="true"></fb:login-button>
    </div>
</body>
</html>
