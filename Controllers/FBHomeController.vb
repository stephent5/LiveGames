Namespace LiveGamesClient1._2
    Public Class FBHomeController
        Inherits System.Web.Mvc.Controller

        '
        ' GET: /FBHome

        'Updated to dynamically popluate homepage game
        Function Index() As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'no longer do this - instead we will determine if we are in a facebook session via javascript!!
            'ViewBag.isfacebooksession = FacebookHelper.isFaceBookSession

            Dim GameID As Integer = 1 'HardCoded untill we run multiple servies on this app
            Dim thisFixturesDetails As Fixture

            'Check for items in cache
            Dim homepagefixtureid As String = HttpRuntime.Cache("homepagefixtureid")
            Dim homepageHomeTeam As String = HttpRuntime.Cache("homepageHomeTeam")
            Dim homepageAwayTeam As String = HttpRuntime.Cache("homepageAwayTeam")
            Dim homepageHomeCrest As String = HttpRuntime.Cache("homepageHomeCrest")
            Dim homepageAwayCrest As String = HttpRuntime.Cache("homepageAwayCrest")
            Dim homepageFixtureDescription As String = HttpRuntime.Cache("homepageFixtureDescription")
            Dim homepageFixtureCrest As String = HttpRuntime.Cache("homepageFixtureCrest")
            Dim homepagestarttime As String = HttpRuntime.Cache("homepagestarttime")
            Dim homepagesp As String = HttpRuntime.Cache("homepagesp")
            Dim homepageap As String = HttpRuntime.Cache("homepageap")
            Dim homepagefp As String = HttpRuntime.Cache("homepagefp")
            Dim homepageal As String = HttpRuntime.Cache("homepageal")


            If Not String.IsNullOrEmpty(homepagefixtureid) AndAlso Not String.IsNullOrEmpty(homepageHomeTeam) AndAlso Not String.IsNullOrEmpty(homepageAwayTeam) _
                 AndAlso Not String.IsNullOrEmpty(homepageHomeCrest) AndAlso Not String.IsNullOrEmpty(homepageAwayCrest) _
                  AndAlso Not String.IsNullOrEmpty(homepageFixtureDescription) AndAlso Not String.IsNullOrEmpty(homepageFixtureCrest) _
                   AndAlso Not String.IsNullOrEmpty(homepagestarttime) AndAlso Not String.IsNullOrEmpty(homepagesp) _
                        AndAlso Not String.IsNullOrEmpty(homepageap) AndAlso Not String.IsNullOrEmpty(homepagefp) AndAlso Not String.IsNullOrEmpty(homepageal) Then

                'all items are in the cache - so set the homepage details with these 

                ViewBag.fixtureID = homepagefixtureid
                ViewBag.HomeTeam = homepageHomeTeam
                ViewBag.AwayTeam = homepageAwayTeam
                ViewBag.HomeCrest = homepageHomeCrest
                ViewBag.AwayCrest = homepageAwayCrest
                ViewBag.FixtureDescription = homepageFixtureDescription
                ViewBag.FixtureCrest = homepageFixtureCrest
                ViewBag.starttime = homepagestarttime


                'Dim ukTime As DateTime = New DateTime()
                'ukTime = DateTime.ParseExact(thisFixturesDetails.starttime, "MM/dd/yyyy HH:mm:ss", Nothing)
                'Dim timeZoneInformation As TimeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time")
                'Dim utcTime As DateTimeOffset = New DateTimeOffset(ukTime, timeZoneInformation.GetUtcOffset(ukTime))
                'Logger.Log(BitFactory.Logging.LogSeverity.Info, "TimeTest", "match starts at " & homepagestarttime & " in DB which is " & utcTime.ToString() & " in utcTime - time on box is " & DateTime.Now.ToString())

                ViewBag.sp = homepagesp 'sp= seperatePushers - if set to 1 this will mean we will use a seperate push connection for the friends and the admin pushing 
                ViewBag.ap = homepageap ' ap = AdminPusherURL - the url we will use to get the push messages from the administrator
                ViewBag.fp = homepagefp ' fp = FriendPusherURL - the url we will use to get the push messages from friends
                ViewBag.al = homepageal 'allowLogin

                If homepagesp = 1 AndAlso Not String.IsNullOrEmpty(homepageap) Then
                    'Only set the javascript to create two push connections if the sp value is 1 AND we have a url for the friend Pusher
                    ViewBag.sp = 1
                Else
                    ViewBag.sp = 0
                End If

            Else
                'Home page details NOT in the cache - so get them from DB

                thisFixturesDetails = Fixture.GetHomePageFixture(GameID)

                ViewBag.fixtureID = thisFixturesDetails.fixtureid
                ViewBag.HomeTeam = thisFixturesDetails.hometeam
                ViewBag.AwayTeam = thisFixturesDetails.awayteam
                ViewBag.HomeCrest = thisFixturesDetails.homecrest
                ViewBag.AwayCrest = thisFixturesDetails.awaycrest
                ViewBag.FixtureDescription = thisFixturesDetails.fd
                ViewBag.FixtureCrest = thisFixturesDetails.fc
                ViewBag.starttime = thisFixturesDetails.starttime


                'Dim ukTime As DateTime = New DateTime()
                'ukTime = DateTime.ParseExact(thisFixturesDetails.starttime, "MM/dd/yyyy HH:mm:ss", Nothing)
                'Dim timeZoneInformation As TimeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time")
                'Dim utcTime As DateTimeOffset = New DateTimeOffset(ukTime, timeZoneInformation.GetUtcOffset(ukTime))
                'Logger.Log(BitFactory.Logging.LogSeverity.Info, "TimeTest", "match starts at " & homepagestarttime & " in DB which is " & utcTime.ToString() & " in utcTime - time on box is " & DateTime.Now.ToString())


                ViewBag.sp = thisFixturesDetails.sp 'sp= seperatePushers - if set to 1 this will mean we will use a seperate push connection for the friends and the admin pushing 
                ViewBag.ap = thisFixturesDetails.ap ' ap = AdminPusherURL - the url we will use to get the push messages from the administrator
                ViewBag.fp = thisFixturesDetails.fp ' fp = FriendPusherURL - the url we will use to get the push messages from friends
                ViewBag.al = thisFixturesDetails.al 'allowLogin

                If thisFixturesDetails.sp = 1 AndAlso Not String.IsNullOrEmpty(thisFixturesDetails.fp) Then
                    'Only set the javascript to create two push connections if the sp value is 1 AND we have a url for the friend Pusher
                    ViewBag.sp = 1
                Else
                    ViewBag.sp = 0
                End If

                'now that we have all the details from the DB - add to Cache - for 2 minutes!!!
                'we are only adding it to cache for ten minutes as we will have multiple instances rtunning and 
                'wont be able to clear the cache on all of them at the same time - going forwar use memcache or some shared caching tool


                HttpRuntime.Cache.Insert("homepagefixtureid", thisFixturesDetails.fixtureid, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepageHomeTeam", thisFixturesDetails.hometeam, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepageAwayTeam", thisFixturesDetails.awayteam, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepageHomeCrest", thisFixturesDetails.homecrest, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepageAwayCrest", thisFixturesDetails.awaycrest, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepageFixtureDescription", thisFixturesDetails.fd, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepageFixtureCrest", thisFixturesDetails.fc, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepagestarttime", thisFixturesDetails.starttime, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepagesp", thisFixturesDetails.sp, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepageap", thisFixturesDetails.ap, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepagefp", thisFixturesDetails.fp, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)
                HttpRuntime.Cache.Insert("homepageal", thisFixturesDetails.al, Nothing, DateTime.Now.AddMinutes(2.0), TimeSpan.Zero)


                Logger.Log(BitFactory.Logging.LogSeverity.Info, "GetHomePageFromDB", "we went to DB for homepageDetails")
            End If

            ViewBag.liveeventmethod = ConfigurationManager.AppSettings("LiveEventMethod")
            ViewBag.t5pusherappkey = ConfigurationManager.AppSettings("T5PusherAppKey")
            FormsAuthentication.SetAuthCookie("LGP", True) 'LGP = livegamesplayer - if a request to our validation API has this cookie then it IS as request the has originated from a user playing the game on our site - and not an external request from a hacker!!

            ViewBag.hp = "fb" 'thisFixturesDetails tells the javascript we are on the fbhome page
            Return View()
        End Function

    End Class
End Namespace
