@ModelType LiveGamesClient1._2.LiveGamesModule
@Code
    Layout = ""
End Code

<!DOCTYPE html>

<html>
<head>
    <title>@ViewData("Title")</title>
    <style type="text/css">
        body {font-family:Arial, Sans-Serif, Verdana; font-size:14px; color:#fff; background-image:url(https://d2q72sm6lqeuqa.cloudfront.net/images/bg-net.jpg);}
        h1   {font-size:22px;}
        a    {color:red; font-size:1.2em;}
        .content
        {
            width: 600px;
            margin: 0 auto;
            border-radius: 10px;
            -moz-border-radius: 10px;
            -webkit-border-radius: 10px;
            margin-top: 2em;
            text-align: center;
            min-height: 300px;
            background: #222;
            padding:1em;
        }
    </style>
     <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>     
</head>
<body>
    <div id="BrowserUpdate" class="content">
       <p style="text-align:center; border-bottom:1px solid #222;"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/intro-logo.png" border="0" alt="-" style="max-width:100%;" /></p>
       <h1>Oops! You don't have a suitable browser to play King of the Kop.</h1>
       <p>We recommend you download and use the latest version of one of the following:</p>
       <p><strong><a href="https://www.google.com/chrome" target="_blank">Google Chrome</a></strong></p>
       <p><strong><a href="http://www.mozilla.com/firefox/" target="_blank">Mozilla Firefox</a></strong></p>
       <p><strong><a href="http://www.apple.com/safari/" target="_blank">Safari</a></strong></p>
       <p></p>
       <p>If you are using an Android or iPhone device, try accessing King of the Kop with the native OS browser!</p>
       <p>Still having issues? <a href="https://twitter.com/canyoubeking" target="_blank">Tweet Us</a></p>
    </div>
    <div id="UpdatePrivateBrowsing" class="content" style="display:none;">
       <p style="text-align:center; border-bottom:1px solid #222;"><img src="https://d2q72sm6lqeuqa.cloudfront.net/images/intro-logo.png" border="0" alt="-" style="max-width:100%;" /></p>
       <h1>Oops! Looks like you are in private browsing mode!! You need to turn this off to play the game!!!</h1>
       <p>If you are not in private browsing mode then you may be using an old browser. We recommend you download and use the latest version of one of the following:</p>
       <p><strong><a href="https://www.google.com/chrome" target="_blank">Google Chrome</a></strong></p>
       <p><strong><a href="http://www.mozilla.com/firefox/" target="_blank">Mozilla Firefox</a></strong></p>
       <p><strong><a href="http://www.apple.com/safari/" target="_blank">Safari</a></strong></p>
       <p></p>
       <p>If you are using an Android or iPhone device, try accessing King of the Kop with the native OS browser!</p>
       <p>Still having issues? <a href="https://twitter.com/canyoubeking" target="_blank">Tweet Us</a></p>
    </div>

    <script type="text/javascript">

        function GetRequestParam(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null)
                return "";
            else
                return results[1];
        }

        var extrainfo = GetRequestParam("ei");
        if (extrainfo == "pb") {
            //user has private browsing on - needs to turn this off to play game !!!!!
            $('#BrowserUpdate').hide();
            $('#UpdatePrivateBrowsing').show();
        }

    </script>

</body>
</html>
