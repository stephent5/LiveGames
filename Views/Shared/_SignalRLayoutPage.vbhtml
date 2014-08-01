<html >
<head runat="server">
  @*SignalR version 0.4 - works!!!*@
@* <script src="http://code.jquery.com/jquery-1.7.min.js" type="text/javascript"></script>
   @Helpers.Script("jquery.signalR.min.js", Url)
   <script src="@Url.Content("~/signalr/hubs")" type="text/javascript"></script>*@

   @*SignalR version 0.5.84*@
   <script src="http://code.jquery.com/jquery-1.7.min.js" type="text/javascript"></script>
   @Helpers.Script("jquery.signalR-0.5rc.min.js", Url)
   <script src="@Url.Content("~/signalr/hubs")" type="text/javascript"></script>
</head>
<body>
    <div>
        <script type="text/javascript">
            try {
                // Proxy created on the fly
                var LiveEventMessaging = $.connection.liveEvent;

                // Declare a function on the chat hub so the server can invoke it
                LiveEventMessaging.addMessage = function (message) {
                    $('#messages').append('<li>' + message + '</li>')
                };

                function sendText() 
                {
                    LiveEventMessaging.send($('#msg').val());
                }

                // Start the connection
                $.connection.hub.start();
            }
            catch (ex) {
                logError("StartingSignalR", ex);
            }
        </script>
        <input type="text" id="msg" />
        <input type="button" id="broadcast" value="Send Message" onclick="sendText(); return false;" />
        <ul id="messages"></ul>
    </div>
    <div>
            @RenderBody()
    </div>
</body>
</html>