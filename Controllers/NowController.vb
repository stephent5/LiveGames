

Namespace LiveGamesClient1._2
    Public Class NowController
        Inherits System.Web.Mvc.Controller

        'Here we return the details of the latest fixture created
        Function Index() As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'no longer do this - instead we will determine if we are in a facebook session via javascript!!
            'ViewBag.isfacebooksession = FacebookHelper.isFaceBookSession
            'Dim isFaceBookSession As Boolean = FacebookHelper.isFaceBookSession()

            Dim thisFixturesDetails As Fixture = Fixture.GetLatestFixtureDetails()

            ViewBag.fixtureID = thisFixturesDetails.fixtureid
            ViewBag.HomeTeam = thisFixturesDetails.hometeam
            ViewBag.AwayTeam = thisFixturesDetails.awayteam
            ViewBag.KickOffTime = thisFixturesDetails.starttime
            ViewBag.sp = thisFixturesDetails.sp 'sp= seperatePushers - if set to 1 this will mean we will use a seperate push connection for the friends and the admin pushing 
            ViewBag.ap = thisFixturesDetails.ap ' ap = AdminPusherURL - the url we will use to get the push messages from the administrator
            ViewBag.fp = thisFixturesDetails.fp ' fp = FriendPusherURL - the url we will use to get the push messages from friends


            Dim LiveEventMethod As String = ConfigurationManager.AppSettings("LiveEventMethod")
            ViewBag.liveeventmethod = LiveEventMethod

            ViewBag.t5pusherappkey = ConfigurationManager.AppSettings("T5PusherAppKey")
            'FormsAuthentication.SetAuthCookie("LGP", True) 'LGP = livegamesplayer - if a request to our validation API has this cookie then it IS as request the has originated from a user playing the game on our site - and not an external request from a hacker!!
            Return View()
        End Function


       

    End Class
End Namespace
