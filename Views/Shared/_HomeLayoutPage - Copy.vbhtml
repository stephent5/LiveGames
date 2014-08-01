<!DOCTYPE html>
<html xmlns:fb="https://www.facebook.com/2008/fbml">
<div id="fb-root"></div> <!-- Facebook - should this be in the body ??? -->
<head>
    <meta charset="utf-8" />
    <title>@ViewData("Title")</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
  
   <script type="text/javascript">
       //var fbid = "276786905679012";

       //this variable will tell the rest of the code whether we are using LightStreamer or SignalR to do our LiveEvents
       var LiveEventMethod = "@ViewBag.liveeventmethod";

       var isFaceBookSession;
       try {
           isFaceBookSession = window.sessionStorage.getItem("isFaceBookSession");
           //alert("isFaceBookSession from sessionStorage is " + isFaceBookSession);
       } catch (ex) { }

       if (isFaceBookSession == null) {
           //we haven't set this value yet - so look for it from the server side!!!!
           isFaceBookSession = "@ViewBag.isfacebooksession";
           window.sessionStorage.setItem("isFaceBookSession", isFaceBookSession);
       }
       //alert("isFaceBookSession at end of logic is " + isFaceBookSession);
       var facebookprofilepicurl = "@ViewBag.facebookprofilepicurl";
       var t5pusherAppKey = "@ViewBag.t5pusherappkey";
       var homepagefixtureid = "@ViewBag.fixtureID";
       var sp = "@ViewBag.sp";
       var ap = "@ViewBag.ap";
       var fp = "@ViewBag.fp";
   </script>
  
  
    @Helpers.Script("jquery-1.8.2.min.js", Url)   
   @Helpers.Script("jquery.json-2.3.js", Url)
   @Helpers.Script("jquery.signalR-1.0.1.min.js", Url)
   
   @*<script src="https://t5pusher.t5livegames.com/signalr/hubs"></script> *@
   @* <script src="http://ec2-54-216-44-121.eu-west-1.compute.amazonaws.com/signalr/hubs"></script> *@ @*no longer need to reference Hubs file as we are NOT using the generated proxy*@

   @Helpers.Script("T5Pusher.js", Url)
   @Helpers.Script("errornew.js", Url)
   @Helpers.Script("League.js", Url) 
   @Helpers.Script("Store.js", Url) 
   @Helpers.Script("administrator.js", Url)
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
   
@*   @Helpers.Script("livegamesmin_01_05_13_16_46.js", Url, True) *@  @* (true means - go to cloud!!!!) this is the compressed file which contains all above JS files below!!!!! *@
         
@*  @Helpers.Style("livestyles_01_05_13_11_55_v3.css", Url, True)*@  @*(true means - go to cloud!!!!)*@
   @Helpers.Style("ui-styles.css", Url, False)
  
    <!-- Begin JavaScript -->
    <script type="text/javascript">
	    $().ready(function () {
                setTimeout(function () { window.scrollTo(0, 1); }, 100);
	    });
    </script>
   
    <!-- iOS icons & startup images -->    
    <link rel="icon" href="https://dtdz2jt169rfw.cloudfront.net/images/favicon.ico" />
    <link rel="apple-touch-icon-precomposed" href="https://dtdz2jt169rfw.cloudfront.net/images/favicon_57.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="https://dtdz2jt169rfw.cloudfront.net/images/favicon_72.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="https://dtdz2jt169rfw.cloudfront.net/images/favicon_114.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="https://dtdz2jt169rfw.cloudfront.net/images/favicon_144.png" />


</head>
 
<body>
    <div class="page">
        <section id="main">
                @RenderBody()    
            
               @* <script type="text/javascript">
                    $(document).ready(function ()
                    {
                        //GetGameTrackerDetails();
                        //var tmpInt = +tmp;
                        //if (tmpInt <= 0) {
                        //    EstablishPushConnection();
                        //}
                    });
                </script>*@
        </section>
    </div>
    @*Google Analytics*@
    <script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-28469603-2']);
        _gaq.push(['_trackPageview']);

        //(function () {
        //    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        //    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        //    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        //})();
    </script>     

    <span id="TestlayoutSpan" style="display:none">non game page!!!</span>  @* dont remove this span - this span will tell us if we are on a non game page page - i.e one using the layout page*@

    <script type="text/javascript">
         FaceBookElementsLoaded(); // now do this at end of homepage - cos we need to run it after we have loaded fb.js and this file now runs last (as it needs to run after we check the modernizr browser compatibilities)
    </script>
</body>
</html>


