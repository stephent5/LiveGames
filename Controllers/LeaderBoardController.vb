Namespace LiveGamesClient1._2
    Public Class LeaderBoardController
        Inherits System.Web.Mvc.Controller


        'Function GetOverallLeaderBoard(ByVal user As User) As String
        '    Response.Cache.SetCacheability(HttpCacheability.NoCache)

        '    Dim LeaderboardList As New List(Of Leaderboard)
        '    Dim l As New Leaderboard
        '    Dim GameID As Integer
        '    Integer.TryParse(ConfigurationManager.AppSettings("GameID"), GameID)
        '    LeaderboardList = l.GetOverAllLeaderBoard(GameID, user.id)
        '    'ViewData("Title") = "Overall Leader Board"
        '    Return Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardList)

        'End Function


        'Function GetFacebookFriendsLeaderbroad(ByVal FacebookFriends As String) As String
        '    Dim LeaderboardList As New List(Of Leaderboard)
        '    Dim tempUserfriend As New facebookFriendList
        '    If Not String.IsNullOrEmpty(FacebookFriends) Then
        '        Dim myDeserializedObjList As facebookFriendList = Newtonsoft.Json.JsonConvert.DeserializeObject(FacebookFriends, tempUserfriend.GetType())
        '        Dim i As Integer = 0
        '        Dim fid As String = String.Empty
        '        While i < myDeserializedObjList.data.Length
        '            fid = fid & myDeserializedObjList.data(i).Values(1) & ","
        '            i = i + 1
        '        End While


        '        Dim l As New Leaderboard
        '        Dim GameID As Integer
        '        Integer.TryParse(ConfigurationManager.AppSettings("GameID"), GameID)
        '        LeaderboardList = l.GetOverAllLeaderBoard(GameID, fid)
        '        'ViewData("Title") = "Friends Leader Board"
        '        'Return View("Leaderboard", LeaderboardList)
        '        Return Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardList)
        '    Else
        '        Return String.Empty
        '    End If


        'End Function

        'Function GetFacebookFriendsLeaderbroad(ByVal FacebookFriends As System.Collections.Generic.List(Of FacebookUser), ByVal user As User) As String
        '    'Dim i As Integer = 1
        '    Dim LeaderboardList As New List(Of Leaderboard)
        '    'Dim tempUserfriend As New facebookFriendList
        '    'If Not String.IsNullOrEmpty(FacebookFriends) Then
        '    '    Dim myDeserializedObjList As facebookFriendList = Newtonsoft.Json.JsonConvert.DeserializeObject(FacebookFriends, tempUserfriend.GetType())
        '    Dim i As Integer = 0
        '    Dim fid As String = String.Empty
        '    While i < FacebookFriends.Count
        '        fid = fid & FacebookFriends(i).id & ","
        '        i = i + 1
        '    End While


        '    Dim l As New Leaderboard
        '    Dim GameID As Integer
        '    Integer.TryParse(ConfigurationManager.AppSettings("GameID"), GameID)
        '    LeaderboardList = l.GetOverAllLeaderBoard(GameID, fid, user.fbUserID)
        '    ViewData("Title") = "Friends Leader Board"
        '    '    'Return View("Leaderboard", LeaderboardList)
        '    Return Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardList)
        '    'Else
        '    '    Return String.Empty
        '    'End If


        'End Function

        Function GetFacebookFriendsLeaderbroad(ByVal FacebookFriends As String, ByVal user As String) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'Dim i As Integer = 1
            If Not String.IsNullOrEmpty(user) AndAlso user <> "null" Then
                Dim LeaderboardList As New List(Of Leaderboard)
                Dim tempUserfriend As New System.Collections.Generic.List(Of FacebookUser)
                If Not String.IsNullOrEmpty(FacebookFriends) Then
                    Dim myDeserializedObjList As System.Collections.Generic.List(Of FacebookUser) = Newtonsoft.Json.JsonConvert.DeserializeObject(FacebookFriends, tempUserfriend.GetType())
                    Dim i As Integer = 0
                    Dim fid As String = String.Empty
                    If myDeserializedObjList IsNot Nothing Then
                        While i < myDeserializedObjList.Count
                            'fid = fid & FacebookFriends(i).id & ","
                            fid = fid & myDeserializedObjList(i).id & ","
                            i = i + 1
                        End While
                    Else
                        myDeserializedObjList = New System.Collections.Generic.List(Of FacebookUser)
                    End If

                    Dim myDeserializeduser As New User
                    myDeserializeduser = Newtonsoft.Json.JsonConvert.DeserializeObject(user, myDeserializeduser.GetType())

                    Dim l As New Leaderboard
                    Dim GameID As Integer
                    'Integer.TryParse(ConfigurationManager.AppSettings("GameID"), GameID)
                    LeaderboardList = l.GetFacebookFriendsLeaderboard(GameID, fid, myDeserializeduser.id)
                    'ViewData("Title") = "Friends Leader Board"
                    ''    'Return View("Leaderboard", LeaderboardList)
                    Return Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardList)
                Else
                    Return String.Empty
                End If
            Else
                Return String.Empty
            End If

        End Function


        'Function GetleagueLeaderboard(ByVal LeagueID As Integer, ByVal User As String) As String
        '    'Dim i As Integer = 1
        '    Dim LeaderboardList As New List(Of Leaderboard)
        '    Dim tempUserfriend As New System.Collections.Generic.List(Of FacebookUser)
        '    If Not String.IsNullOrEmpty(user) Then
        '        Dim u As New User
        '        Dim myDeserializedObjList As User = Newtonsoft.Json.JsonConvert.DeserializeObject(user, u.GetType())
        '        If myDeserializedObjList IsNot Nothing Then
        '            Dim l As New Leaderboard
        '            Dim GameID As Integer
        '            Integer.TryParse(ConfigurationManager.AppSettings("GameID"), GameID)
        '            LeaderboardList = l.GetLeague(myDeserializedObjList.id, LeagueID)
        '            'ViewData("Title") = "Friends Leader Board"
        '            ''    'Return View("Leaderboard", LeaderboardList)
        '            Return Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardList)
        '        Else
        '            Return String.Empty
        '        End If

        '    Else
        '        Return String.Empty
        '    End If
        'End Function

        'Function GetleagueLeaderboard(ByVal LeagueID As Integer, ByVal User As String) As String
        '    Dim userid As Integer

        '    If Not String.IsNullOrWhiteSpace(User) Then
        '        Try
        '            Dim u As New User
        '            Dim myDeserializedObjList As User = Newtonsoft.Json.JsonConvert.DeserializeObject(User, u.GetType())
        '            userid = myDeserializedObjList.id
        '        Catch ex As Exception
        '            userid = -1
        '        End Try
        '    Else
        '        userid = -1
        '    End If

        '    Return Newtonsoft.Json.JsonConvert.SerializeObject(Leaderboard.GetLeague(userid, LeagueID))
        'End Function

        'no longer pass up the userobject - just userid !!
        Function GetleagueLeaderboard(ByVal LeagueID As Integer, ByVal u As Integer, ByVal fu As String) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Newtonsoft.Json.JsonConvert.SerializeObject(Leaderboard.GetLeague(u, LeagueID, fu))
        End Function

        Function GetleagueLeaderboardStress(ByVal LeagueID As Integer, ByVal u As Integer, ByVal fu As String) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Newtonsoft.Json.JsonConvert.SerializeObject(Leaderboard.GetLeague(u, LeagueID, fu))
        End Function

        Function GetFriendsLeaderboard(ByVal FriendList As String, ByVal u As Integer, ByVal f As Integer, ByVal fu As String) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim LeaderboardList As New List(Of FriendsLeaderboard)
            LeaderboardList = FriendsLeaderboard.GetFriendsLeaderboard(f, u, FriendList, fu)

            Return Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardList)
        End Function

        Function GetFriendsLeaderboardStress(ByVal u As Integer, ByVal f As Integer, ByVal fu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim FriendList As String = "501118012,549916867,634431137,684417817,692475321,696599274,728675640,1389504291,1692075853,1761189594,100002677540470,100003125153257,100003354231840,100003365631803,100003370401837,100004107183934,100004224494351,100004256071956,100004510150466,100005803694577,100005813646815"

            Dim LeaderboardList As New List(Of FriendsLeaderboard)
            LeaderboardList = FriendsLeaderboard.GetFriendsLeaderboard(f, u, FriendList, fu)

            Return Json(LeaderboardList, JsonRequestBehavior.AllowGet)
        End Function


        'Function GetFriendsLeaderboard(ByVal FriendList As String, ByVal user As String, ByVal fixtureID As Integer) As String
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

        '    Dim LeaderboardList As New List(Of FriendsLeaderboard)
        '    LeaderboardList = FriendsLeaderboard.GetFriendsLeaderboard(fixtureID, myDeserializeduser.id, friends)

        '    Return Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardList)
        'End Function

        Function leaderboardLeague(ByVal LeagueID As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            ViewBag.LeagueID = LeagueID
            Return View()
        End Function

        'Function Leaderboard() As ActionResult
        '    Return View()
        'End Function

        ''
        '' GET: /LeaderBoard

        'Function Index() As ActionResult
        '    Return View()
        'End Function

        ''
        '' GET: /LeaderBoard/Details/5

        'Function Details(ByVal id As Integer) As ActionResult
        '    Return View()
        'End Function

        ''
        '' GET: /LeaderBoard/Create

        'Function Create() As ActionResult
        '    Return View()
        'End Function

        ''
        '' POST: /LeaderBoard/Create

        '<HttpPost> _
        'Function Create(ByVal collection As FormCollection) As ActionResult
        '    Try
        '        ' TODO: Add insert logic here
        '        Return RedirectToAction("Index")
        '    Catch
        '        Return View()
        '    End Try
        'End Function

        ''
        '' GET: /LeaderBoard/Edit/5

        'Function Edit(ByVal id As Integer) As ActionResult
        '    Return View()
        'End Function

        ''
        '' POST: /LeaderBoard/Edit/5

        '<HttpPost> _
        'Function Edit(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
        '    Try
        '        ' TODO: Add update logic here

        '        Return RedirectToAction("Index")
        '    Catch
        '        Return View()
        '    End Try
        'End Function

        ''
        '' GET: /LeaderBoard/Delete/5

        'Function Delete(ByVal id As Integer) As ActionResult
        '    Return View()
        'End Function

        ''
        '' POST: /LeaderBoard/Delete/5

        '<HttpPost> _
        'Function Delete(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
        '    Try
        '        ' TODO: Add delete logic here

        '        Return RedirectToAction("Index")
        '    Catch
        '        Return View()
        '    End Try
        'End Function     
    End Class
End Namespace
