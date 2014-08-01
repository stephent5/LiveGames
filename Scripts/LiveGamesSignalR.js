try {

    function initializeSignalR() 
    {
        // Proxy created on the fly
        var liveEventProxy = $.connection.liveEvent;

        // Declare functions on the liveEventProxy so the server can invoke it///////////////////////////////////////////
        LiveEventMessaging.UpdateGameEvent = function (thisFixtureId, thisEventId, thisEventLogID, thisHomeScore, thisAwayScore, thisDescription, eventUpdateTime, eventEndTime) {
            var eventUpdateTime_date = new Date(eventUpdateTime); //need to change these strings into date objects
            var eventEndTime_date = new Date(eventEndTime); //need to change these strings into date objects
            UpdateGameEvent(thisFixtureId, thisEventId, thisEventLogID, thisHomeScore, thisAwayScore, thisDescription, eventUpdateTime_date, eventEndTime_date);
        };

        LiveEventMessaging.UpdateGameOdds = function (newOdds) {
            updateOdds(newOdds);
        };     
        //end of functionns which server can call////////////////////////////////////////////////////////////////////////

        function sendText() {
            LiveEventMessaging.send($('#msg').val());
        }

        // Start the connection
        $.connection.hub.start();
    }
}
catch (ex) {
    logError("StartingSignalR", ex);
}