<!DOCTYPE html>
<html xmlns:fb="https://www.facebook.com/2008/fbml">
<head>
    <meta charset="utf-8" />
    <title>@ViewData("Title")</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
  
   <script type="text/javascript">
       var LiveEventMethod = "@ViewBag.liveeventmethod";

      @* var isFaceBookSession;
       try {
           isFaceBookSession = window.sessionStorage.getItem("isFaceBookSession");
       } catch (ex) { }

        if (isFaceBookSession == null) {
           //we haven't set this value yet - so look for it from the server side!!!!
           isFaceBookSession = "@ViewBag.isfacebooksession";
           window.sessionStorage.setItem("isFaceBookSession", isFaceBookSession);
       }*@


       var facebookprofilepicurl = "@ViewBag.facebookprofilepicurl";
       var t5pusherAppKey = "@ViewBag.t5pusherappkey";
       var homepagefixtureid = "@ViewBag.fixtureID";
       var sp = "@ViewBag.sp";
       var ap = "@ViewBag.ap";
       var fp = "@ViewBag.fp";
       var al = "@ViewBag.al";
       var startDate = new Date("@ViewBag.starttime"); //newcastle game!!!
       var homepage = "@ViewBag.hp"; 
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
   @Helpers.Script("ga.js", Url)`
   @Helpers.Script("Login.js", Url)
   @Helpers.Script("jquery.multi-select.js", Url)
 @* 
  @Helpers.Script("allmin_22_11_13_1046.js", Url, True)*@

@* @Helpers.Style("ui-styles_06_01_2014.css", Url, True)*@ @*no longer compress css cos it throws weird errors!!!!*@
 @*  @Helpers.Style("ui-styles.css", Url, False)*@


    <!-- iOS icons & startup images -->    
    <link rel="icon" href="https://d2q72sm6lqeuqa.cloudfront.net/images/favicon.ico" />
    <link rel="apple-touch-icon-precomposed" href="https://d2q72sm6lqeuqa.cloudfront.net/images/favicon_57.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="https://d2q72sm6lqeuqa.cloudfront.net/images/favicon_72.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="https://d2q72sm6lqeuqa.cloudfront.net/images/favicon_114.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="https://d2q72sm6lqeuqa.cloudfront.net/images/favicon_144.png" />
</head>
 
<body>
    <div id="fb-root"></div> <!-- Facebook - should this be in the body ??? -->
    <div class="page">
        <section id="main">
                @RenderBody()    
        </section>
    </div>
   
    <span id="TestlayoutSpan" style="display:none">non game page!!!</span>  @* dont remove this span - this span will tell us if we are on a non game page page - i.e one using the layout page*@

   
</body>
</html>


