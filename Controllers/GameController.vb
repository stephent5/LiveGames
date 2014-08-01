Imports System.Net
Imports System.Xml
Imports System.IO
Imports System.Net.Http
Imports System.Threading.Tasks
Imports System.Web.Caching

Namespace LiveGamesClient1._2
    Public Class GameController
        'Inherits System.Web.Mvc.AsyncController
        Inherits System.Web.Mvc.Controller

        ' GET: /Game

        'just added this line so i could commit the file

        Function Index(ByVal F As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim LiveEventMethod As String = ConfigurationManager.AppSettings("LiveEventMethod")
            ViewBag.fixture = F
            ViewBag.liveeventmethod = LiveEventMethod
            'ViewBag.isfacebooksession = FacebookHelper.isFaceBookSession 'no longer do this - instead we will determine if we are in a facebook session via javascript!!
            ViewBag.facebookprofilepicurl = ConfigurationManager.AppSettings("FacebookProfilePicURL") 'updated
            ViewBag.t5pusherappkey = ConfigurationManager.AppSettings("T5PusherAppKey")

            'we set this so that when we try to initialise the T5Pusher - then T5Pusher will call our validation API
            'this API will check the cookie sent up to confirm the the user requesting use T5Pusher IS actually on our site
            'and not a hacker trying to validate THEIR t5pusher remotely , pretending to be us!!!!!
            FormsAuthentication.SetAuthCookie("LGP", True) 'LGP = livegamesplayer - if a request to our validation API has this cookie then it IS as request the has originated from a user playing the game on our site - and not an external request from a hacker!!

            Return View()
        End Function

        Function HomePageLoad_StressTest() As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'no longer do this - instead we will determine if we are in a facebook session via javascript!!
            'ViewBag.isfacebooksession = FacebookHelper.isFaceBookSession

            Dim GameID As Integer = 1 'HardCoded untill we run multiple servies on this app
            Dim thisFixturesDetails As Fixture = Fixture.GetHomePageFixture(GameID)

            Return Json(1, JsonRequestBehavior.AllowGet)
        End Function

        'Async Function PlaceBetAsync(ByVal u As Integer, ByVal e As Integer, ByVal f As Integer, ByVal a As Integer, ByVal fu As String) As Task(Of ActionResult)
        '    Response.Cache.SetCacheability(HttpCacheability.NoCache)

        '    'Try
        '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet before DB Connection eventid is " & thisBet.eventid)
        '    'Catch ex As Exception
        '    'End Try
        '    Dim thisBet As New Bet
        '    thisBet.eventid = e
        '    thisBet.userid = u
        '    thisBet.fixtureid = f
        '    thisBet.amount = a

        '    'Await thisBet.PlaceBet(fu)
        '    'Try
        '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet after DB Connection eventid is " & thisBet.eventid)
        '    'Catch ex As Exception
        '    'End Try
        '    Return Json(Await thisBet.PlaceBetAsync(fu), JsonRequestBehavior.AllowGet)
        'End Function

        'Async Function PlaceBetAsync(ByVal u As Integer, ByVal e As Integer, ByVal f As Integer, ByVal a As Integer, ByVal fu As String) As Task(Of ActionResult)
        '    Response.Cache.SetCacheability(HttpCacheability.NoCache)

        '    'Try
        '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet before DB Connection eventid is " & thisBet.eventid)
        '    'Catch ex As Exception
        '    'End Try
        '    Dim thisBet As New Bet
        '    thisBet.eventid = e
        '    thisBet.userid = u
        '    thisBet.fixtureid = f
        '    thisBet.amount = a

        '    'Await thisBet.PlaceBet(fu)
        '    'Try
        '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet after DB Connection eventid is " & thisBet.eventid)
        '    'Catch ex As Exception
        '    'End Try
        '    Return Json(Await thisBet.PlaceBetAsync(fu), JsonRequestBehavior.AllowGet)
        'End Function

        'Async Function PlaceBetAss(ByVal u As Integer, ByVal e As Integer, ByVal f As Integer, ByVal a As Integer, ByVal fu As String) As Task(Of ActionResult)
        '    Response.Cache.SetCacheability(HttpCacheability.NoCache)

        '    'Try
        '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet before DB Connection eventid is " & thisBet.eventid)
        '    'Catch ex As Exception
        '    'End Try
        '    Dim thisBet As New Bet
        '    thisBet.eventid = e
        '    thisBet.userid = u
        '    thisBet.fixtureid = f
        '    thisBet.amount = a

        '    'Await thisBet.PlaceBet(fu)
        '    'Try
        '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet after DB Connection eventid is " & thisBet.eventid)
        '    'Catch ex As Exception
        '    'End Try
        '    Return Json(Await thisBet.PlaceBetAsync(fu), JsonRequestBehavior.AllowGet)
        'End Function

        Function PlaceBet(ByVal u As Integer, ByVal e As Integer, ByVal f As Integer, ByVal a As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'Try
            '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
            '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet before DB Connection eventid is " & thisBet.eventid)
            'Catch ex As Exception
            'End Try
            Dim thisBet As New Bet
            thisBet.eventid = e
            thisBet.userid = u
            thisBet.fixtureid = f
            thisBet.amount = a

            'thisBet.PlaceBet(fu)
            'Try
            '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
            '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet after DB Connection eventid is " & thisBet.eventid)
            'Catch ex As Exception
            'End Try
            Return Json(thisBet.PlaceBet(fu), JsonRequestBehavior.AllowGet)
        End Function


        Function PlaceBetNoDB(ByVal u As Integer, ByVal e As Integer, ByVal f As Integer, ByVal a As Integer, ByVal fu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisBet As New Bet
            thisBet.eventid = 20
            thisBet.userid = 31
            thisBet.fixtureid = 34
            thisBet.eventdesc = "Throw-In"
            thisBet.amount = 100
            thisBet.odds = 1.0
            thisBet.newodds = 0
            thisBet.betid = 114294
            thisBet.betdescription = "^5760\u0027~ Prediction Made : Throw-In (100 credits)"
            thisBet.creditsremaining = 315755
            thisBet.betresult = Nothing
            thisBet.creditsearned = 0
            thisBet.newcredits = 0
            thisBet.betcomplete = False
            thisBet.user = Nothing
            thisBet.status = 0
            thisBet.eventtime = "04/12/2013 09:55:10"
            thisBet.numattempts = 0
            thisBet.addamount = 0
            thisBet.unlockcredits = 200
            thisBet.numbetsplaced = 29688
            thisBet.numbetstounlockhigherlevel = 20

            Return Json(thisBet, JsonRequestBehavior.AllowGet)

        End Function


        'before Async messing
        'Function PlaceBet(ByVal u As Integer, ByVal e As Integer, ByVal f As Integer, ByVal a As Integer, ByVal fu As String) As ActionResult
        '    Response.Cache.SetCacheability(HttpCacheability.NoCache)

        '    'Try
        '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet before DB Connection eventid is " & thisBet.eventid)
        '    'Catch ex As Exception
        '    'End Try
        '    Dim thisBet As New Bet
        '    thisBet.eventid = e
        '    thisBet.userid = u
        '    thisBet.fixtureid = f
        '    thisBet.amount = a

        '    thisBet.PlaceBet(fu)
        '    'Try
        '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet after DB Connection eventid is " & thisBet.eventid)
        '    'Catch ex As Exception
        '    'End Try
        '    Return Json(thisBet, JsonRequestBehavior.AllowGet)
        'End Function

        Function CheckGameLimits(ByVal u As Integer, ByVal f As Integer, ByVal fu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.CheckGameLimits(f, u, fu))
        End Function

        Function CheckGameLimits_StressTest(ByVal u As Integer, ByVal f As Integer, ByVal fu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.CheckGameLimits(f, u, fu), JsonRequestBehavior.AllowGet)
        End Function


        Function NotifyFriendsOfBetResult(ByVal thisBet As Bet) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            AMQEngine.NotifyFriendsOfBetResult(thisBet)
            Return Json(True)
        End Function

        Function NotifyFriendsOfBetPlaced(ByVal thisBet As Bet) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            AMQEngine.NotifyFriendsOfBetPlaced(thisBet)
            Return Json(True)
        End Function

        Function NotifyFriendsOfBetForfeit(ByVal thisBet As Bet) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            AMQEngine.NotifyFriendsOfBetForfeit(thisBet)
            Return Json(True)
        End Function

        Function NotifyFriendsThatUserHasJoinedGame(ByVal thisUser As User) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            AMQEngine.NotifyFriendsThatUserHasJoinedGame(thisUser)
            Return Json(True) 'will this stop error?
        End Function

        Function NotifyFriendsOfPreGameBetDetail(ByVal thisBet As FixtureBet) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            AMQEngine.NotifyFriendsOfPreGameBetDetail(thisBet)
            Return Json(True) 'will this stop error?
        End Function

        Function NotifyFriendsOfNewBalance(ByVal fixtureID As Integer, ByVal fbuserid As String, ByVal newBalance As Integer) As Integer
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            AMQEngine.NotifyFriendsOfNewBalanceForThisGame(fixtureID, fbuserid, newBalance)
            Return 1
        End Function

        Function CheckBet(ByVal thisBet As Bet) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            thisBet.checkBet() 'this goes to DB
            Return Json(thisBet)
        End Function

        'update
        Function UpdateTickerText(ByVal f As Integer, ByVal u As Integer, ByVal fu As String, ByVal tt As String, ByVal mp As Integer) As Integer
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Return Fixture.SetTickerText(f, u, fu, tt, mp)
        End Function

        Function GetTickerText(ByVal f As Integer, ByVal u As Integer, ByVal fu As String) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Return Fixture.GetTickerText(f, u, fu)
        End Function

        Function GetTickerTextStress(ByVal f As Integer, ByVal u As Integer, ByVal fu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Return Json(Fixture.GetTickerText(f, u, fu), JsonRequestBehavior.AllowGet)
        End Function

        Function LogError(ByVal thisError As T5Error) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            thisError.LogError() 'this goes to DB
            Return Json(True) 'Always return error
        End Function

        Function AddNewGoalScorer(ByVal fixtureid As Integer, ByVal potentialwinnings As Integer, ByVal goalscorer As String, ByVal p As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.AddNewGoalScorer(fixtureid, potentialwinnings, goalscorer, p))
        End Function

        Function AwardCredits(ByVal c As Integer, ByVal t As Integer, ByVal f As Integer, ByVal l As String, ByVal u As Integer, ByVal o As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.AwardCredits(c, t, f, l, u, o))
        End Function

        Function AwardBonus(ByVal a As Integer, ByVal t As Integer, ByVal f As Integer, ByVal u As Integer, ByVal b As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.AwardBonus(a, t, f, u, b))
        End Function

        'dummy line so john can read in code
        Function EditMatchDetails(ByVal f As Integer, ByVal u As Integer, ByVal htn As String, ByVal atn As String, ByVal htc As String, ByVal atc As String, ByVal fhlt As String, ByVal v As Integer, ByVal hc As String, ByVal ac As String, ByVal fc As String, ByVal fb As String, ByVal tsko As String, ByVal hp As Integer, ByVal fl As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.EditMatchDetails(f, u, htn, atn, htc, atc, fhlt, v, hc, ac, fc, fb, tsko, hp, fl))
        End Function

        Function CreateMatch(ByVal u As Integer, ByVal htn As String, ByVal atn As String, ByVal htc As String, ByVal atc As String, ByVal fhlt As String, ByVal l As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.CreateMatch(u, htn, atn, htc, atc, fhlt, l))
        End Function

        Function GetTeamColours(ByVal f As Integer, ByVal u As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.GetTeamColours(f, u))
        End Function

        Function RemoveGoalScorer(ByVal fixtureid As Integer, ByVal FBOID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.RemoveGoalScorer(fixtureid, FBOID))
        End Function

        'This function is called when the page loads - it is called by an asynchronous JavaScript call
        'It returns details of all events and bets made by the user
        'This function is needed in case the user joins the game half way through so we can set the correct score and list all the previous event
        'It is also used if the user leaves the page during the game and comes back or if they do a page refresh while playing the game
        Function GetGameDetails(ByVal f As Integer, ByVal fu As String, Optional ByVal u As Integer = -1) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim thisFixturesDetails As Fixture = Fixture.GetFixtureDetails(f, u, fu)
            Return Json(thisFixturesDetails, JsonRequestBehavior.AllowGet)
        End Function

        Function GetGameTrackerDetails(ByVal f As Integer, Optional ByVal u As Integer = -1) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Return Json(Fixture.GetGameTrackerDetails(u, f))
        End Function

        Function GetGameTrackerDetails_StressTest(ByVal f As Integer, Optional ByVal u As Integer = -1) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Return Json(Fixture.GetGameTrackerDetails(u, f), JsonRequestBehavior.AllowGet)
        End Function

        'This returns the Details Of The Fixture On The HomePage
        Function GetHomePageFixtureDetails(ByVal GameID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim HomePageFixture As Fixture = Fixture.GetHomePageFixture(GameID)
            Return Json(HomePageFixture)
        End Function

        Function SetSound(ByVal fu As String, ByVal u As Integer, ByVal s As Integer) As ActionResult
            Return Json(Fixture.SetSound(fu, u, s))
        End Function

        Function SetLive(ByVal f As Integer, ByVal u As Integer) As ActionResult
            Return Json(Fixture.SetGameLive(f, u))
        End Function

        Function CacheTest(ByVal f As Integer, ByVal fu As String, Optional ByVal u As Integer = -1) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim RandomNum As Integer = Store.RandomNumber(25, 0)
            Return Json(RandomNum)
        End Function

        Function NoCacheTest(ByVal f As Integer, ByVal fu As String, Optional ByVal u As Integer = -1) As ActionResult
            Dim RandomNum As Integer = Store.RandomNumber(25, 0)
            Return Json(RandomNum)
        End Function

        'This funtion is a copy of GetGameDetails - it is used only be the admin page
        'The point of this function is to allow a cross domain ajax request ( from the admin page)
        Function GetGameDetailsAdmin(ByVal fixtureID As Integer, Optional ByVal userid As Integer = -1) As JsonpResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisFixturesDetails As Fixture = Fixture.GetFixtureDetails(fixtureID, userid)
            Return Me.Jsonp(thisFixturesDetails)
        End Function

        Function GetGameDetailsAdminT(ByVal fixtureID As Integer, ByVal odds As Decimal) As JsonpResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisFixturesDetails As Fixture = Fixture.GetFixtureDetails(fixtureID, -101)
            Return Me.Jsonp(thisFixturesDetails)
        End Function

        Function GetFriendsBetHistory(ByVal FriendList As String, ByVal u As Integer, ByVal f As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisFixturesDetails As Fixture = Fixture.GetFriendsBetHistory(f, u, FriendList, fu)
            Return Json(thisFixturesDetails.friendbets)
        End Function


        Function GetFriendsBetHistoryStress(ByVal u As Integer, ByVal f As Integer, ByVal fu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim FriendList As String = "501118012,549916867,634431137,684417817,692475321,696599274,728675640,1389504291,1692075853,1761189594,100002677540470,100003125153257,100003354231840,100003365631803,100003370401837,100004107183934,100004224494351,100004256071956,100004510150466,100005803694577,100005813646815"

            Dim thisFixturesDetails As Fixture = Fixture.GetFriendsBetHistory(f, u, FriendList, fu)
            Return Json(thisFixturesDetails.friendbets, JsonRequestBehavior.AllowGet)
        End Function

        Function GetUpdatedFriends(ByVal u As Integer, ByVal fu As String, ByVal f As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim friends As String = ""
            Return Json(FacebookFriend.GetMyFriendsV2(friends, u, fu, f))
            'Return Json(FacebookFriend.GetMyFriends(friends, u, fu, f))
        End Function

        'Logs all the Invites we sent to a league
        Public Function LogInviteFriends(ByVal userid As Integer, ByVal fbREquest As String, ByVal FBUserID_List As String, ByVal fixtureID As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(FacebookFriend.LogInvites(FBUserID_List, userid, fbREquest, fixtureID))
        End Function

        'Function GetFriendsDetails(ByVal FriendList As String, ByVal user As String, ByVal fixtureID As Integer) As ActionResult
        '    Dim tempUserfriend As New System.Collections.Generic.List(Of FacebookUser)
        '    Dim myDeserializedObjList As System.Collections.Generic.List(Of FacebookUser) = Newtonsoft.Json.JsonConvert.DeserializeObject(FriendList, tempUserfriend.GetType())
        '    Dim i As Integer = 0
        '    Dim friends As String = String.Empty
        '    If myDeserializedObjList IsNot Nothing Then
        '        While i < myDeserializedObjList.Count
        '            'fid = fid & FacebookFriends(i).id & ","
        '            friends = friends & myDeserializedObjList(i).id & ","
        '            i = i + 1
        '        End While
        '    End If

        '    Dim myDeserializeduser As New User
        '    myDeserializeduser = Newtonsoft.Json.JsonConvert.DeserializeObject(user, myDeserializeduser.GetType())

        '    Dim thisFixturesDetails As Fixture = Fixture.GetFriendDetails(fixtureID, myDeserializeduser.id, friends)
        '    Return Json(thisFixturesDetails.friendbets)
        'End Function

        'This funtion returns details of the last event
        'It is only necessary for a rare scenario
        'If a user laods the page at the same time a LightStream event is sent then in some cases we may not recieve the LightStream event
        '(this happens as we havn't subscribed to the LightStrem yet)
        'This scenario will not happen often however we need to make sure we recieve EVERY message from LightStreamer 
        'This is no longer used ( we now check the last 5 events with every event and if we dont have one of the last 5 we reload the content - this is how we make sure we get all the events!!!)
        Function GetLastEventFixture(ByVal fixtureID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisEvent As New GameEvent
            thisEvent = Fixture.GetLastEventFixture(fixtureID)
            Return Json(thisEvent)
        End Function

        Function SetUpOneTimeFriendGame(ByVal fbRequestId As String, ByVal friends As String, ByVal user As String, ByVal fixtureID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim tempResponse As New FBFriendGameResponse

            Dim myDeserializeduser As New User
            myDeserializeduser = Newtonsoft.Json.JsonConvert.DeserializeObject(user, myDeserializeduser.GetType())

            Dim thisListOfFBUsers As New System.Collections.Generic.List(Of FacebookUser)
            thisListOfFBUsers = League.SetUpNewOneTimeFriendGame(fbRequestId, fixtureID, myDeserializeduser, friends)

            Return Json(thisListOfFBUsers)
        End Function

        Function GetFixtureIdFromFbRequest(ByVal fbRequest As String, ByVal u As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim FixtureID As New Integer

            FixtureID = League.GetFixtureIdFromFbRequest(fbRequest, u, fu)

            Return Json(FixtureID)
        End Function

        'Function GetFixtureIdFromFbRequest(ByVal fbRequest As String, ByVal user As String) As ActionResult
        '    Dim FixtureID As New Integer

        '    Dim myDeserializeduser As New User
        '    myDeserializeduser = Newtonsoft.Json.JsonConvert.DeserializeObject(user, myDeserializeduser.GetType())

        '    FixtureID = League.GetFixtureIdFromFbRequest(fbRequest, myDeserializeduser)

        '    Return Json(FixtureID)
        'End Function

        'Function ForFeitBet(ByVal thisBet As Bet) As ActionResult
        Function ForFeitBet(ByVal u As Integer, ByVal b As Integer, ByVal f As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'thisBet.ForFeitBet()
            Dim thisBet As New Bet
            thisBet.userid = u
            thisBet.betid = b
            thisBet.fixtureid = f
            thisBet.ForFeitBet(fu)

            Dim LiveEventMethod As String = ConfigurationManager.AppSettings("LiveEventMethod")
            If LiveEventMethod = "LS" Then
                'LiveEvent method is LightStreamer so do AMQ update here instead of on client side
                If thisBet.status = -103 Then
                    ' //bet was forfeited successfully
                    AMQEngine.NotifyFriendsOfBetForfeit(thisBet)
                End If
            End If

            Return Json(thisBet)
        End Function

        'This API call clears up a few of the DB memory tables mid-Game - it enables our queries to run quicker during the game
        'It should be called from the admin as often as possible during a game
        'It can take up to 30 seconds to run so it shoul donly be caleed when we are sure there will not be an event for at least 30 seconds 
        'so after a goal or when a player is injured are the idela times to call this
        Function MidGameDBCleanUp(ByVal fixtureID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.MidGameDBCleanUp(fixtureID))
        End Function

        Function GetSystemMemoryDiskStatus(ByVal gameidID As Integer) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.GetSystemMemoryDiskStatus(gameidID))
        End Function

        Function SetSystemMemoryDiskStatus(ByVal u As Integer, ByVal fu As String, ByVal g As Integer, ByVal s As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.SetSystemMemoryDiskStatus(u, fu, g, s))
        End Function

        Function BackupToDisk(ByVal fixtureID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.BackUpToDisk(fixtureID))
        End Function

        Function RebootMemoryTables(ByVal fixtureID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.RebootMemoryTables(fixtureID))
        End Function

        Function CompareMemoryTables(ByVal fixtureID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.CompareMemoryTables(fixtureID))
        End Function

        'this function is not used anymore
        Function FullTimeStoreDBMatchDetails(ByVal fixtureID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.FullTimeStoreDBMatchDetails(fixtureID))
        End Function

        ' Added by Gamal 13/03/2012: A function to start power play if not started yet and get new game details back
        Function StartPowerPlay(ByVal fixtureID As Integer, ByVal userid As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim Result As Integer = Fixture.StartPowerPlay(fixtureID, userid, fu)
            Dim thisFixturesDetails As New Fixture
            thisFixturesDetails.fixtureid = fixtureID
            'If Result >= 0 Then
            thisFixturesDetails = Fixture.GetFixtureDetails(fixtureID, userid, fu)
            thisFixturesDetails.inPowerPlay = Result
            'End If
            Return Json(thisFixturesDetails)
        End Function


        

        'Added by Gamal 29/03/2012: A function to log user's one click bet value in tblFixtureUsers
        Function StoreOneClickCreditValue(ByVal fixtureID As Integer, ByVal userID As Integer, ByVal oneClickVlaue As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.StoreOneClickCreditValue(fixtureID, userID, oneClickVlaue))
        End Function

        'updated - added new param
        Function EditNickName(ByVal f As Integer, ByVal u As Integer, ByVal fu As String, ByVal nickName As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.EditNickName(f, u, fu, nickName))
        End Function

        Function CalculatePreGame(ByVal fixtureID As Integer, ByVal fbid As Integer, ByVal v1 As Integer, ByVal v2 As Integer, Optional ByVal userid As Integer = -1) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(FixtureBet.CalculatePreGame(fixtureID, fbid, v1, v2, userid))
        End Function

        Function GetListOfGoalScorers(ByVal f As Integer, ByVal u As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.GetListOfGoalScorers(f, u))
        End Function

        Function GetListOfPlayers(ByVal u As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Fixture.GetListOfPlayers(u))
        End Function

        Function GetFixtureBetDetails(ByVal f As Integer, ByVal u As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisFixtureBetDetails As System.Collections.Generic.List(Of FixtureBet) = FixtureBet.GetFixtureBetDetails(f, u, fu)
            Return Json(thisFixtureBetDetails)
        End Function

        Function GetFixtureBetDetailsStress(ByVal f As Integer, ByVal u As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisFixtureBetDetails As System.Collections.Generic.List(Of FixtureBet) = FixtureBet.GetFixtureBetDetails(f, u, fu)
            Return Json(thisFixtureBetDetails, JsonRequestBehavior.AllowGet)
        End Function

        Function GetStoreItems(ByVal fixtureID As Integer, ByVal userid As Integer, ByVal p As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.GetStoreItems(fixtureID, userid, p))
        End Function

        Function GetStorePurchase(ByVal id As Integer, ByVal u As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.GetStorePurchase(id, u))
        End Function

        Function LogIOSReceiptID(receiptID As String, purchaseID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.LogIOSReceiptID(receiptID, purchaseID))
        End Function

        Function ValidateReceipt(jsonString As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.ValidateReceipt(jsonString))
        End Function

        Function LogIOSReceiptInfo(quantity As String, productID As String, transactionID As String, purchaseDate As String, originalTransactionID As String, _
                                      originalPurchaseDate As String, appItemID As String, versionExternalId As String, bid As String, bvrs As String _
                                      , purchaseID As Integer, result As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.LogIOSReceiptInfo(quantity, productID, transactionID, purchaseDate, originalTransactionID, originalPurchaseDate, appItemID, versionExternalId, bid, bvrs, purchaseID, result))
        End Function

        Function LogPurchaseRequest(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal cc As String, ByVal si As Integer, ByVal p As Integer, ByVal fu As String, ByVal c As Integer) As ActionResult
            'Dim thisStorePurchase As StorePurchase = Store.LogPurchaseRequest(fixtureID, UserID, si, p)

            'If thisStorePurchase.id > 0 Then
            '    If p = 1 Then
            '        'we successfully logged this store purchase in our DB AND this is a WEB platform purchase
            '        'so now we need to call the UB Bill Request API
            '    End If
            'End If
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.LogPurchaseRequest(fixtureID, UserID, si, p, fu, c, cc))
        End Function

        Function LogFailedFBStorePurchase(ByVal u As Integer, ByVal spid As Integer, ByVal ec As String, ByVal em As String, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.LogFailedFBStorePurchase(u, spid, ec, em, fu))
        End Function

        Function GetStorePurchases(ByVal u As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.GetStorePurchases(u, fu))
        End Function

        Function CompleteFBStorePurchase(ByVal fboid As String, ByVal u As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.CompleteFBStorePurchase(fboid, u, fu))
        End Function

        Function UpdateFBStorePurchase(ByVal pid As String, ByVal spid As Integer, ByVal a As Double, ByVal c As String, ByVal q As Integer, ByVal s As String, ByVal sr As String, ByVal u As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim FacebookOrderFulfillment As FacebookOrderFulfillment = FacebookHelper.DecodePayloadForFBCreditsStatusUpdate(sr)

            If FacebookOrderFulfillment.request_id = spid Then
                Return Json(Store.UpdateFBStorePurchase(u, fu, FacebookOrderFulfillment))
            Else
                'th facebook id does NOT match the id we have of this request - so do NOT go to DB
                T5Error.LogError("UpdateFBStorePurchaseDEBUG", "UpdateFBStorePurchase FacebookOrderFulfillment.request_id is " + FacebookOrderFulfillment.request_id + " this does not match our id of " + spid + " sr is " + sr)
                Logger.Log(BitFactory.Logging.LogSeverity.Info, "UpdateFBStorePurchase DEBUG", "UpdateFBStorePurchase FacebookOrderFulfillment.request_id is " + FacebookOrderFulfillment.request_id + " this does not match our id of " + spid + " sr is " + sr)
                Dim InvalidstorePurchase As New StorePurchase
                InvalidstorePurchase.status = 0
                Return Json(InvalidstorePurchase)
            End If
        End Function


        'meaningless string for update
        Function LogUsersSelectedUBBillOption(ByVal UserID As Integer, ByVal pid As Integer, ByVal ubboid As Integer, ByVal ubp As Decimal, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.LogUsersSelectedUBBillOption(UserID, pid, ubboid, ubp, fu))
        End Function

        'id = id of store purchase (from tblStorePurchases)
        'ss - status
        'ByVal s As Integer, 
        Function completeStorePurchase(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal id As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(Store.completeStorePurchase(fixtureID, UserID, id, fu)) 's,
        End Function


        Function CheckForSuccessfullUBPurchasesStress(ByVal f As Integer, ByVal u As Integer, ByVal fu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'first go to our DB and get any open UB Purchases
            Dim openUBPurchases As System.Collections.Generic.List(Of StorePurchase) = Store.CheckForOpenUBPurchases(f, u, fu)
            Dim listOfcompletedStorePurchases As New System.Collections.Generic.List(Of StorePurchase)
            Return Json(listOfcompletedStorePurchases, JsonRequestBehavior.AllowGet)
        End Function


        Function CheckForSuccessfullUBPurchases(ByVal f As Integer, ByVal u As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'first go to our DB and get any open UB Purchases
            Dim openUBPurchases As System.Collections.Generic.List(Of StorePurchase) = Store.CheckForOpenUBPurchases(f, u, fu)
            Dim listOfcompletedStorePurchases As New System.Collections.Generic.List(Of StorePurchase)

            For Each openUBPurchase In openUBPurchases

                Try
                    'call UB AI to check status of each of these open purchase requests
                    openUBPurchase = CheckUBStatus(openUBPurchase, f, u) 'CheckUBStatus will update the statusid property of each openUBPurchase object
                    If Not openUBPurchase.status = 0 Then  'if the purchase in question HAS been completed - then 
                        Dim storePurchaseResult As New StorePurchase

                        'we dont want to return back all the properties of each object as this could potentially be a lot of data we are sending back and forth for now reason
                        'so here we only return the properties we need to complete the store purchase!!!
                        storePurchaseResult.id = openUBPurchase.id
                        storePurchaseResult.storeitemid = openUBPurchase.storeitemid
                        storePurchaseResult.status = openUBPurchase.status
                        storePurchaseResult.ubresultid = openUBPurchase.ubresultid

                        listOfcompletedStorePurchases.Add(storePurchaseResult)
                    End If
                Catch ex As Exception
                End Try
            Next
            'we are now returning a list of store transactions that have been completed
            'we will return this list to the client and the client will then call a function 
            'to complete the final step in the DB and then give the user their store item ( if there were billed!!)
            Return Json(listOfcompletedStorePurchases)
        End Function


        'this function calls the UB check API to see if the transaction is complete
        'it then updates the DB with the result
        Function CheckUBStatus(ByVal openUBPurchase As StorePurchase, ByVal fixtureID As Integer, ByVal userid As Integer) As StorePurchase
            'variable we are going to send back to client!!!
            'variables needed to send,post and read XML response
            Dim thisFixturesUBDetails As UBDetails = HttpRuntime.Cache("UBDetails" & fixtureID)  'Session("UBDetails" & fixtureID)

            If thisFixturesUBDetails Is Nothing Then
                thisFixturesUBDetails = Store.GetUBDetails(fixtureID)
                'Session("UBDetails" & fixtureID) = thisFixturesUBDetails
                'Session.Add("UBDetails" & fixtureID, thisFixturesUBDetails)
                HttpRuntime.Cache("UBDetails" & fixtureID) = thisFixturesUBDetails
            End If

            Dim myrequest As HttpWebRequest
            Dim myWebResponse As HttpWebResponse
            Dim myStreamReader As StreamReader
            Dim myXMLReader As XmlTextReader

            Dim jsonResponse As String = ""
            Dim UBResponse As String = ""
            Dim SendURL As String = ""

            Dim ResultID As Integer
            Dim billstatusid As Integer
            Dim billstatus As String

            Try
                'non encrpted way
                'SendURL = thisFixturesUBDetails.ubbillcheckurl & "?username=" & HttpUtility.UrlEncode(thisFixturesUBDetails.ubusername) & _
                '    "&password=" & HttpUtility.UrlEncode(thisFixturesUBDetails.ubpassword) & _
                '    "&purchaseid=" & openUBPurchase.ubpurchaseid & _
                '    "&sak=" & HttpUtility.UrlEncode(openUBPurchase.ubsak) & _
                '    "&billoptionid=" & openUBPurchase.ubbilloptionid & "&returnAsJson=false"
                'end non enrypted way

                'encrpted way
                Dim SendURLParameters As String = "&username=" & HttpUtility.UrlEncode(thisFixturesUBDetails.ubusername) & _
                    "&password=" & HttpUtility.UrlEncode(thisFixturesUBDetails.ubpassword) & _
                    "&purchaseid=" & openUBPurchase.ubpurchaseid & _
                    "&sak=" & HttpUtility.UrlEncode(openUBPurchase.ubsak) & _
                    "&billoptionid=" & openUBPurchase.ubbilloptionid

                Dim EncrptedQueryString = "&q=" & thisFixturesUBDetails.rsaEncrypt(SendURLParameters)
                Dim EncrptedSendURL As String = thisFixturesUBDetails.ubbillcheckurl & "?returnAsJson=false&ubappid=" & thisFixturesUBDetails.ubappid & EncrptedQueryString

                'send request
                'myrequest = CType(WebRequest.Create(SendURL), HttpWebRequest)
                myrequest = CType(WebRequest.Create(EncrptedSendURL), HttpWebRequest)
                myrequest.Method = "GET"
                myrequest.Timeout = 10000 '10 seconds

                'Read in response
                myWebResponse = CType(myrequest.GetResponse(), HttpWebResponse)
                myStreamReader = New StreamReader(myWebResponse.GetResponseStream())
                UBResponse = myStreamReader.ReadToEnd()
                myXMLReader = New XmlTextReader(New StringReader(UBResponse))

                While myXMLReader.Read()
                    Dim nType As XmlNodeType = myXMLReader.NodeType

                    ' If node type is a declaration
                    If nType = XmlNodeType.XmlDeclaration Then
                        Continue While
                    End If

                    If (myXMLReader.Name.ToString() = "AuthenticatePurchase") Then
                        If String.IsNullOrEmpty(billstatus) Then
                            billstatus = myXMLReader.GetAttribute("billstatus")
                            Integer.TryParse(myXMLReader.GetAttribute("ResultID"), ResultID)
                            Integer.TryParse(myXMLReader.GetAttribute("billstatusID"), billstatusid)
                        End If
                    End If
                End While

                Integer.TryParse(Store.UpdateUBBillRequestStatusV2(openUBPurchase.ubid, ResultID, billstatus, billstatusid, UBResponse, SendURL, "", Nothing, Nothing, "", Nothing, "", Nothing, "", "", Nothing, ""), openUBPurchase.status)
                openUBPurchase.ubresultid = billstatusid 'set the billstatusid - we need this to determine if we need to check again!!!!!! 
            Catch ex As Exception
                jsonResponse = ex.ToString
                Logger.Log(BitFactory.Logging.LogSeverity.Error, Nothing, ex)
                Try
                    If String.IsNullOrEmpty(UBResponse) Then
                        Store.UpdateUBBillRequestStatusV2(openUBPurchase.ubid, ResultID, billstatus, billstatusid, ex.ToString, SendURL, "", Nothing, Nothing, "", Nothing, "", Nothing, "", "", Nothing, "")
                    Else
                        Store.UpdateUBBillRequestStatusV2(openUBPurchase.ubid, ResultID, billstatus, billstatusid, UBResponse, SendURL, "", Nothing, Nothing, "", Nothing, "", Nothing, "", "", Nothing, "")
                    End If
                Catch ex2 As Exception
                End Try
            Finally
                Try
                    myXMLReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myStreamReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myWebResponse.Close()
                Catch ex As Exception
                End Try
                Try
                    myXMLReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myStreamReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myWebResponse.Close()
                Catch ex As Exception
                End Try
            End Try
            Return openUBPurchase
        End Function


        'this function goes to the DB and gets the UB username/password details (if they are NOT already in the session)
        'then we store the UB response in the DB before we return it to the client
        Function CallUBBillRequestV2(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal si As Integer, ByVal pid As Integer, ByVal price As Decimal, ByVal title As String, ByVal sak As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisFixturesUBDetails As UBDetails = HttpRuntime.Cache("UBDetails" & fixtureID) 'Session("UBDetails" & fixtureID)

            If thisFixturesUBDetails Is Nothing Then
                thisFixturesUBDetails = Store.GetUBDetails(fixtureID)

                'Session("UBDetails" & fixtureID) = thisFixturesUBDetails
                'Session.Add("UBDetails" & fixtureID, thisFixturesUBDetails)
                HttpRuntime.Cache("UBDetails" & fixtureID) = thisFixturesUBDetails
            End If

            'variables needed to send,post and read XML response
            Dim myrequest As HttpWebRequest
            Dim myWebResponse As HttpWebResponse
            Dim myStreamReader As StreamReader
            Dim myXMLReader As XmlTextReader

            'Variables we are going to store in DB
            Dim UBPurchaseID As Integer
            Dim SAKResponse As String = ""
            Dim UBResponse As String = ""
            Dim ResultID As Integer
            Dim status As Integer = 0 ' processing

            'variable we are going to send back to client!!!
            Dim jsonResponse As String = ""
            Dim dbupdated As Boolean = False
            Dim correlationID As String = pid & UserID & "" & si & fixtureID
            Dim Result As String = ""
            Dim unencryptedURLCalled As String = ""
            Try

                'Dim urlToReturnUserTo = Request.Url.AbsoluteUri.Substring(0, Request.Url.AbsoluteUri.LastIndexOf("/")) & "?f=" & fixtureID
                Dim urlToReturnUserTo = thisFixturesUBDetails.gameurlroot & "?f=" & fixtureID

                Dim urlRoot As String = ""
                'Try
                '    urlRoot = Request.Url.Scheme & "://" & Request.Url.Authority & "/"
                'Catch ex As Exception
                '    Try
                '        urlRoot = thisFixturesUBDetails.gameurlroot.Substring(0, thisFixturesUBDetails.gameurlroot.IndexOf(".com") + 5)
                '    Catch Subex As Exception
                '        urlRoot = ""
                '    End Try
                'End Try
                Try
                    urlRoot = thisFixturesUBDetails.gameurlroot.Substring(0, thisFixturesUBDetails.gameurlroot.IndexOf(".com") + 5)
                Catch Subex As Exception
                    urlRoot = "http://www.liveplayfootball.com/Game/?f=" & fixtureID
                End Try
                Dim Billcheckurl = urlRoot & "UBListener.aspx"

                '"&consumerip=" & HttpUtility.UrlEncode(Request.ServerVariables("REMOTE_ADDR")) & _

                'unencrpted way
                'Dim SendURLParameters As String = "?username=" & HttpUtility.UrlEncode(thisFixturesUBDetails.ubusername) & _
                '    "&password=" & HttpUtility.UrlEncode(thisFixturesUBDetails.ubpassword) & "&correlationid=" & HttpUtility.UrlEncode(correlationID) & _
                '    "&deploymentid=" & HttpUtility.UrlEncode(thisFixturesUBDetails.ubdeploymentid) & _
                '    "&consumerip=" & HttpUtility.UrlEncode(HttpContext.Request.ServerVariables("REMOTE_ADDR")) & _
                '    "&campaign=" & fixtureID & "&itemid=" & si & _
                '    "&locale=" & HttpUtility.UrlEncode(GetLocale()) & _
                '    "&returnurl=" & HttpUtility.UrlEncode(urlToReturnUserTo) & _
                '    "&OrderTitle=" & HttpUtility.UrlEncode(title) & _
                '    "&ExtConsumerID=" & HttpUtility.UrlEncode(UserID) & _
                '    "&DeveloperID=" & HttpUtility.UrlEncode(thisFixturesUBDetails.developerid) & _
                '    "&Currency=" & HttpUtility.UrlEncode(thisFixturesUBDetails.currency) & _
                '    "&sak=" & HttpUtility.UrlEncode(sak) & _
                '    "&Billcheckurl=" & HttpUtility.UrlEncode(Billcheckurl) & _
                '    "&price=" & price & "&returnAsJson=false"

                'Dim SendURL As String = thisFixturesUBDetails.ubbillrequesturl & SendURLParameters
                'end unencrpted way

                'encrpted way
                Dim RemoteIP As String
                Try
                    RemoteIP = HTTPHelper.getRemoteIP(System.Web.HttpContext.Current)
                Catch ex As Exception
                    RemoteIP = HttpContext.Request.ServerVariables("REMOTE_ADDR")
                End Try

                Dim SendURLParameters As String = "&username=" & thisFixturesUBDetails.ubusername & _
                    "&password=" & thisFixturesUBDetails.ubpassword & "&correlationid=" & correlationID & _
                    "&deploymentid=" & thisFixturesUBDetails.ubdeploymentid & _
                    "&consumerip=" & RemoteIP & _
                    "&campaign=" & fixtureID & "&itemid=" & si & _
                    "&locale=" & GetLocale() & _
                    "&returnurl=" & urlToReturnUserTo & _
                    "&OrderTitle=" & title & _
                    "&ExtConsumerID=" & UserID & _
                    "&DeveloperID=" & thisFixturesUBDetails.developerid & _
                    "&Currency=" & thisFixturesUBDetails.currency & _
                    "&sak=" & sak & _
                    "&Billcheckurl=" & Billcheckurl & _
                    "&price=" & price

                unencryptedURLCalled = thisFixturesUBDetails.ubbillrequesturl & "?returnAsJson=false&ubappid=" & thisFixturesUBDetails.ubappid & SendURLParameters
                Dim EncrptedQueryString = "&q=" & thisFixturesUBDetails.rsaEncrypt(SendURLParameters)
                Dim SendURL As String = thisFixturesUBDetails.ubbillrequesturl & "?returnAsJson=false&ubappid=" & thisFixturesUBDetails.ubappid & EncrptedQueryString

                'end encrpted way
                
                'send request
                myrequest = CType(WebRequest.Create(SendURL), HttpWebRequest)
                myrequest.Method = "GET"
                myrequest.Timeout = 10000 '10 seconds

                'Read in response
                myWebResponse = CType(myrequest.GetResponse(), HttpWebResponse)
                myStreamReader = New StreamReader(myWebResponse.GetResponseStream())
                UBResponse = myStreamReader.ReadToEnd()
                myXMLReader = New XmlTextReader(New StringReader(UBResponse))

                Try
                    While myXMLReader.Read()
                        Dim nType As XmlNodeType = myXMLReader.NodeType

                        ' If node type is a declaration
                        If nType = XmlNodeType.XmlDeclaration Then
                            Continue While
                        End If

                        If (myXMLReader.Name.ToString() = "Billing") Then
                            If String.IsNullOrEmpty(Result) Then
                                Integer.TryParse(myXMLReader.GetAttribute("ResultID"), ResultID)
                                Result = myXMLReader.GetAttribute("Result")
                            End If
                        End If

                        If (myXMLReader.Name.ToString() = "BillOptions") Then
                            If UBPurchaseID <= 0 Then
                                UBPurchaseID = Integer.Parse(myXMLReader.GetAttribute("PurchaseID"))
                            End If
                        End If

                        If (myXMLReader.Name.ToString() = "SAK") Then
                            SAKResponse = myXMLReader.ReadString
                        End If
                    End While

                    If ResultID < 0 Then
                        status = -1 'purchase is NOT processing - it has failed!!!!
                    End If

                    Store.LogUBBillRequestResponseinDB(pid, status, ResultID, Result, UBPurchaseID, SAKResponse, UBResponse, correlationID, unencryptedURLCalled)
                    dbupdated = True

                    Dim XMLStringToConvertToJson As String = UBResponse.Substring(UBResponse.IndexOf("<Billing "), UBResponse.Length - (UBResponse.IndexOf("<Billing ")))
                    Dim doc As New XmlDocument
                    doc.LoadXml(XMLStringToConvertToJson)
                    jsonResponse = Newtonsoft.Json.JsonConvert.SerializeXmlNode(doc)
                Catch ex As Exception

                    Try
                        If Not dbupdated Then

                            If String.IsNullOrEmpty(Result) Then
                                'we never received anything from ub api!!!!
                                status = -1
                            End If

                            Store.LogUBBillRequestResponseinDB(pid, status, ResultID, Result, UBPurchaseID, SAKResponse, UBResponse & " : t5error is " & ex.ToString, correlationID, unencryptedURLCalled)
                            dbupdated = True
                        End If
                    Catch ex2 As Exception
                    End Try
                    Logger.Log(BitFactory.Logging.LogSeverity.Error, Nothing, ex)
                    jsonResponse = "-2"
                End Try
            Catch ex As Exception
                'jsonResponse = ex.ToString

                Try
                    If Not dbupdated Then
                        If String.IsNullOrEmpty(Result) Then
                            'we never received anything from ub api!!!!
                            status = -1
                        End If
                        Store.LogUBBillRequestResponseinDB(pid, status, ResultID, Result, UBPurchaseID, SAKResponse, UBResponse & " : t5error is " & ex.ToString, correlationID, unencryptedURLCalled)
                        dbupdated = True
                    End If
                Catch ex2 As Exception
                End Try
                Logger.Log(BitFactory.Logging.LogSeverity.Error, Nothing, ex)
                jsonResponse = "-1"
            Finally
                Try
                    myXMLReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myStreamReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myWebResponse.Close()
                Catch ex As Exception
                End Try
                Try
                    myXMLReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myStreamReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myWebResponse.Close()
                Catch ex As Exception
                End Try
            End Try
            Return Json(jsonResponse)

        End Function

        

        Function ubtest(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal si As Integer, ByVal pid As Integer, ByVal price As Decimal, ByVal title As String, ByVal sak As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisFixturesUBDetails As UBDetails = HttpRuntime.Cache("UBDetails" & fixtureID)

            If thisFixturesUBDetails Is Nothing Then
                thisFixturesUBDetails = Store.GetUBDetails(fixtureID)
                HttpRuntime.Cache("UBDetails" & fixtureID) = thisFixturesUBDetails
            End If

            Return Json(1)
        End Function

        Private Function GetLocale() As String
            Dim browserLocale As String = ""
            Try
                browserLocale = HttpContext.Request.Headers("Accept-Language")
                If Not String.IsNullOrEmpty(browserLocale) AndAlso browserLocale.IndexOf(",") > 0 Then
                    browserLocale = browserLocale.Substring(0, browserLocale.IndexOf(","))
                End If
            Catch ex As Exception
            End Try
            Return browserLocale
        End Function




        'this function goes to the DB and gets the UB username/password details (if they are NOT already in the session)
        'then we store the UB response in the DB before we return it to the client
        Function CallUBBillRequest(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal si As Integer, ByVal pid As Integer, ByVal price As Decimal) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisFixturesUBDetails As UBDetails = HttpRuntime.Cache("UBDetails" & fixtureID) 'Session("UBDetails" & fixtureID)

            'If thisFixturesUBDetails.ubdeploymentid <= 0 Or String.IsNullOrEmpty(thisFixturesUBDetails.ubbillrequesturl) Or String.IsNullOrEmpty(thisFixturesUBDetails.ubusername) Or String.IsNullOrEmpty(thisFixturesUBDetails.ubpassword) Then
            If thisFixturesUBDetails Is Nothing Then
                thisFixturesUBDetails = Store.GetUBDetails(fixtureID)

                'Session("UBDetails" & fixtureID) = thisFixturesUBDetails
                'Session.Add("UBDetails" & fixtureID, thisFixturesUBDetails)
                HttpRuntime.Cache("UBDetails" & fixtureID) = thisFixturesUBDetails
            End If

            'variables needed to send,post and read XML response
            Dim myrequest As HttpWebRequest
            Dim myWebResponse As HttpWebResponse
            Dim myStreamReader As StreamReader
            Dim myXMLReader As XmlTextReader

            'Variables we are going to store in DB
            Dim UBPurchaseID As Integer
            Dim SAK As String = ""
            Dim UBResponse As String = ""
            Dim correlationID As String = pid & UserID & "" & si & fixtureID
            'variable we are going to send back to client!!!
            Dim jsonResponse As String = ""

            Try

                Dim urlToReturnUserTo = Request.Url.AbsoluteUri.Substring(0, Request.Url.AbsoluteUri.LastIndexOf("/")) & "?f=" & fixtureID

                '"&consumerip=" & HttpUtility.UrlEncode(Request.ServerVariables("REMOTE_ADDR")) & _

                Dim SendURL As String = thisFixturesUBDetails.ubbillrequesturl & "?username=" & HttpUtility.UrlEncode(thisFixturesUBDetails.ubusername) & _
                    "&password=" & HttpUtility.UrlEncode(thisFixturesUBDetails.ubpassword) & "&correlationid=" & correlationID & _
                    "&deploymentid=" & thisFixturesUBDetails.ubdeploymentid & _
                    "&consumerip=" & HttpUtility.UrlEncode("212.58.241.131") & _
                    "&campaign=" & fixtureID & "&locale=en-GB&itemid=" & si & _
                    "&returnurl=" & HttpUtility.UrlEncode(urlToReturnUserTo) & _
                    "&currency=GBP&price=" & price

                'currency ' locale - from browser - consumerip - ip of client
                'OrderTitle - so jimbo can display to user
                'update this - returnurl - to be from db + fixtureid

                ''store sak after first purchse - then send sak
                'ExtConsumerID - userid
                'DeveloperID - iguide
                'returnAsJson - true - so call from javascript!!!!!!!!!!!!!!

                'send request
                myrequest = CType(WebRequest.Create(SendURL), HttpWebRequest)
                myrequest.Method = "GET"
                myrequest.Timeout = 10000 '10 seconds

                'Read in response
                myWebResponse = CType(myrequest.GetResponse(), HttpWebResponse)
                myStreamReader = New StreamReader(myWebResponse.GetResponseStream())
                UBResponse = myStreamReader.ReadToEnd()
                myXMLReader = New XmlTextReader(New StringReader(UBResponse))

                While myXMLReader.Read()
                    Dim nType As XmlNodeType = myXMLReader.NodeType

                    ' If node type is a declaration
                    If nType = XmlNodeType.XmlDeclaration Then
                        Continue While
                    End If

                    If (myXMLReader.Name.ToString() = "BillOptions") Then
                        If UBPurchaseID <= 0 Then
                            UBPurchaseID = Integer.Parse(myXMLReader.GetAttribute("PurchaseID"))
                        End If
                    End If

                    If (myXMLReader.Name.ToString() = "SAK") Then
                        SAK = myXMLReader.ReadString
                    End If
                End While

                Store.LogUBBillRequestResponseinDB(pid, 0, 0, 0, UBPurchaseID, SAK, UBResponse, correlationID, "")

                Dim XMLStringToConvertToJson As String = UBResponse.Substring(UBResponse.IndexOf("<Billing "), UBResponse.Length - (UBResponse.IndexOf("<Billing ")))
                Dim doc As New XmlDocument
                doc.LoadXml(XMLStringToConvertToJson)
                jsonResponse = Newtonsoft.Json.JsonConvert.SerializeXmlNode(doc)
            Catch ex As Exception
                jsonResponse = ex.ToString
                Logger.Log(BitFactory.Logging.LogSeverity.Error, Nothing, ex)
            Finally
                Try
                    myXMLReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myStreamReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myWebResponse.Close()
                Catch ex As Exception
                End Try
                Try
                    myXMLReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myStreamReader.Close()
                Catch ex As Exception
                End Try
                Try
                    myWebResponse.Close()
                Catch ex As Exception
                End Try
            End Try
            Return Json(jsonResponse)
        End Function





        'This funtion is a copy of GetFixtureBetDetails - it is used only be the admin page
        'The point of this function is to allow a cross domain ajax request ( from the admin page)
        Function GetFixtureBetDetailsAdmin(ByVal fixtureID As Integer, Optional ByVal userid As Integer = -1) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim thisFixtureBetDetails As System.Collections.Generic.List(Of FixtureBet) = FixtureBet.GetFixtureBetDetails(fixtureID, userid)
            Return Json(thisFixtureBetDetails)
        End Function

        Function PlacePreGameBets(ByVal bets As System.Collections.Generic.List(Of FixtureBet)) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim totalCreditsBet As Integer = FixtureBet.PlacePreGameBets(bets)

            'After we have placed the bets - return all our current bet details
            Dim fixtureID As Integer
            Dim userid As Integer

            Try
                fixtureID = bets.Item(0).f
                userid = bets.Item(0).u
            Catch ex As Exception
            End Try

            Dim thisFixtureBetDetails As System.Collections.Generic.List(Of FixtureBet) = FixtureBet.GetFixtureBetDetails(fixtureID, userid)
            Try
                thisFixtureBetDetails.Item(0).b = totalCreditsBet 'set this so we can return to the client the amount of money the user has just bet ( so the client can then update the users credits)
            Catch ex As Exception
            End Try
            Return Json(thisFixtureBetDetails)
        End Function

        Function PlacePreGameBet(ByVal u As Integer, ByVal fu As String, ByVal f As Integer, ByVal fbid As Integer, ByVal fboid As Integer, ByVal value1 As String, ByVal value2 As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Json(FixtureBet.PlacePreGameBet(u, fu, f, fbid, fboid, value1, value2))
        End Function

    End Class
End Namespace
