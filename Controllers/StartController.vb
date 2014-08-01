Imports SignalR.Connection
Imports SignalR.Hubs

Namespace LiveGamesClient1._2
    Public Class StartController
        Inherits System.Web.Mvc.Controller

        ' GET: /Start

        'Updated to dynamically popluate homepage game
        Function Index() As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'no longer do this - instead we will determine if we are in a facebook session via javascript!!
            'ViewBag.isfacebooksession = FacebookHelper.isFaceBookSession 

            Dim GameID As Integer = 1 'HardCoded untill we run multiple servies on this app
            Dim thisFixturesDetails As Fixture = Fixture.GetHomePageFixture(GameID)

            ViewBag.fixtureID = thisFixturesDetails.fixtureid
            ViewBag.HomeTeam = thisFixturesDetails.hometeam
            ViewBag.AwayTeam = thisFixturesDetails.awayteam
            ViewBag.HomeCrest = thisFixturesDetails.homecrest
            ViewBag.AwayCrest = thisFixturesDetails.awaycrest
            ViewBag.FixtureDescription = thisFixturesDetails.fd
            ViewBag.FixtureCrest = thisFixturesDetails.fc
            ViewBag.starttime = thisFixturesDetails.starttime
            ViewBag.sp = thisFixturesDetails.sp 'sp= seperatePushers - if set to 1 this will mean we will use a seperate push connection for the friends and the admin pushing 
            ViewBag.ap = thisFixturesDetails.ap ' ap = AdminPusherURL - the url we will use to get the push messages from the administrator
            ViewBag.fp = thisFixturesDetails.fp ' fp = FriendPusherURL - the url we will use to get the push messages from friends

            If thisFixturesDetails.sp = 1 AndAlso Not String.IsNullOrEmpty(thisFixturesDetails.fp) Then
                'Only set the javascript to create two push connections if the sp value is 1 AND we have a url for the friend Pusher
                thisFixturesDetails.sp = 1
            Else
                thisFixturesDetails.sp = 0
            End If

            Dim LiveEventMethod As String = ConfigurationManager.AppSettings("LiveEventMethod")
            ViewBag.liveeventmethod = LiveEventMethod

            'ViewBag.tmp = thisFixturesDetails.tmp

            ViewBag.t5pusherappkey = ConfigurationManager.AppSettings("T5PusherAppKey")
            FormsAuthentication.SetAuthCookie("LGP", True) 'LGP = livegamesplayer - if a request to our validation API has this cookie then it IS as request the has originated from a user playing the game on our site - and not an external request from a hacker!!
            Return View()
        End Function

    End Class
End Namespace
