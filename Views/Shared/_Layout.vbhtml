<!DOCTYPE html>
<html xmlns:fb="https://www.facebook.com/2008/fbml">
<head>
    <meta charset="utf-8" />
    <title>@ViewData("Title")</title>

   <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
   <meta name="apple-mobile-web-app-capable" content="yes" />

   <script type="text/javascript">
       //var fbid = "276786905679012";

       //this variable will tell the rest of the code whether we are using LightStreamer or SignalR to do our LiveEvents
       var LiveEventMethod = "@ViewBag.liveeventmethod";

      @* var isFaceBookSession;
       try
       {
           isFaceBookSession = window.sessionStorage.getItem("isFaceBookSession");
       } catch (ex) { }

       if (isFaceBookSession == null)
       {
           //we haven't set this value yet - so look for it from the server side!!!!
           isFaceBookSession = "@ViewBag.isfacebooksession";
           window.sessionStorage.setItem("isFaceBookSession", isFaceBookSession);
       }*@

       var facebookprofilepicurl = "@ViewBag.facebookprofilepicurl";
       var t5pusherAppKey = "@ViewBag.t5pusherappkey";
       var homepagefixtureid; //set this to null - this is NOT the homepage - it is the gamepage!!!

       var al = 1; //we need this variable however it is only relevant on the homePage
       var sp;
       var ap;
       var fp;
   </script>

   @Helpers.Script("jquery-1.8.2.min.js", Url)   
   @Helpers.Script("jquery.json-2.3.js", Url)
   @Helpers.Script("errornew.js", Url)
   @Helpers.Script("T5Pusher.js", Url)
   @Helpers.Script("League.js", Url) 
   @Helpers.Script("Store.js", Url) 
   @Helpers.Script("administrator.js", Url)
   @Helpers.Script("modernizr.custom.56054.js", Url)
   @Helpers.Script("init.js", Url)
   @Helpers.Script("pushutilities.js", Url)
   @Helpers.Script("ui.js", Url)
   @Helpers.Script("iscroll.js", Url)
   @Helpers.Script("scrollhelper.js", Url)
   @Helpers.Script("bet.js", Url)
   @Helpers.Script("user.js", Url)
   @Helpers.Script("fb.js", Url)
   @Helpers.Script("t5ticker.js", Url)
   @Helpers.Script("jquery.ticker.js", Url)
   @Helpers.Script("jquery.countdown.js", Url) 
   @Helpers.Script("newpush.js", Url)
   @Helpers.Script("ga.js", Url)
   @Helpers.Script("Login.js", Url)
   @Helpers.Script("jquery.multi-select.js", Url)

   @*  @Helpers.Script("allmin_22_11_13_1046.js", Url, True) *@

 @Helpers.Style("ui-styles_06_01_2014.css", Url, True) @*no longer compress css cos it throws weird errors!!!!*@
 @*  @Helpers.Style("ui-styles.css", Url, False)*@

    <!-- iOS icons & startup images -->      
    <link rel="icon" href="https://d2q72sm6lqeuqa.cloudfront.net/images/favicon.ico" />
    <link rel="apple-touch-icon-precomposed" href="https://d2q72sm6lqeuqa.cloudfront.net/images/favicon_57.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="https://d2q72sm6lqeuqa.cloudfront.net/images/favicon_72.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="https://d2q72sm6lqeuqa.cloudfront.net/images/favicon_114.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="https://d2q72sm6lqeuqa.cloudfront.net/images/favicon_144.png" />

     <script type="text/javascript">
         fixture = "@ViewBag.fixture";
     </script>
</head>
<body>
    <div id="fb-root"></div> <!-- Facebook - should this be in the body ??? -->
    <div class="page">           
           
        <header id="header">	
                @*<fb:login-button autologoutlink="true" perms="email,user_birthday,status_update,publish_stream"></fb:login-button>*@         
                <button id="fb-auth" class="fb-auth">Login</button> 
                <a href="#" onClick="nicknamePopup();  return false;">My Account</a>  @* TestCache();*@
                <a href="#" onClick="Store.showstore(); return false;">Store</a>   @*TestNoCache();*@
                <a href="#" class="credittotal"><span class="username"></span> <span class="credits"></span></a>                          
                <a href="#" id="soundlink" onClick="ChangeSound(); return false;"></a>
                <span id="nonfblink" style="display:none"><a href="/">Home</a></span>
		        <br clear="all"/>
        </header>

        <div id="userinfo">                    
            <a href="/">Home </a> 
            <button id="fb-auth2" class="fb-auth">Login                        
            </button> <span class="username"></span> <span class="credits"></span>
            <a onclick="ToggleUserInfo();return false;" href="#" class="userinfoclick-close"><div class="close">X</div>&nbsp;Hide</a>
        </div>                        

		<div class="logo"></div>

		<div class="credits_panel">&nbsp;<span class="currentscore"></span></div>

        <section id="main">
            <!---<i>IP is @HttpContext.Current.Request.ServerVariables("LOCAL_ADDR")</i>-->
            @RenderBody()
        </section>

        <br clear="all" />
    </div>
</body>
</html>

