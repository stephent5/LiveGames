Namespace LiveGamesClient1._2
    Public Class LeagueController
        Inherits System.Web.Mvc.Controller

        '
        ' GET: /League

        Function Index() As ActionResult
            Return View()
        End Function

        '
        ' GET: /League/Details/5

        Function Details(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' GET: /League/LeagueCreate

        Function LeagueCreate() As ActionResult
            Return View()
        End Function

        '
        ' POST: /League/Create

        '<HttpPost()> _
        'Function LeagueCreate(ByVal collection As FormCollection) As ActionResult
        '    Try
        '        ' TODO: Add insert logic here
        '        Return RedirectToAction("LeagueCreate")
        '    Catch
        '        Return View()
        '    End Try
        'End Function

        Public Function ViewCreatedLeague() As ActionResult
            Return View()
        End Function

        Public Function LeagueCreateHandler(ByVal name As String, ByVal fixtureID As Integer, ByVal LeagueType As Integer, ByVal allowinvites As Integer, ByVal description As String, ByVal user As String) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim u As New User
            u = Newtonsoft.Json.JsonConvert.DeserializeObject(user, u.GetType())

            Dim league As New League
            league = league.CreateLeague(name, fixtureID, LeagueType, description, u.id, allowinvites)
            Return Newtonsoft.Json.JsonConvert.SerializeObject(league)
        End Function

        Public Function GetYourLeague(ByVal user As User) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim l As New League
            Dim list As New System.Collections.Generic.List(Of League)
            list = l.GetLeagueForUser(user)
            Return Newtonsoft.Json.JsonConvert.SerializeObject(list)
        End Function

        Public Function GetUserLeaguesLinkedToThisFixture(ByVal userid As Integer, ByVal fixtureid As Integer) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim list As System.Collections.Generic.List(Of League) = League.GetUserLeaguesLinkedToThisFixture(userid, fixtureid)
            Return Newtonsoft.Json.JsonConvert.SerializeObject(list)
        End Function

        Public Function LeaveLeague(ByVal leagueid As Integer, ByVal userid As Integer, ByVal fixtureid As Integer) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim LeftLeague As Integer = League.LeaveLeague(leagueid, userid)
            If LeftLeague > 0 Then
                Dim list As System.Collections.Generic.List(Of League) = League.GetUserLeaguesLinkedToThisFixture(userid, fixtureid)
                Return Newtonsoft.Json.JsonConvert.SerializeObject(list)
            Else
                Return Newtonsoft.Json.JsonConvert.SerializeObject("-1")
            End If
        End Function

        Public Function GetOfficialLeagues(ByVal userid As Integer, ByVal fixtureid As Integer) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim list As System.Collections.Generic.List(Of League) = League.GetOfficialLeagues(userid, fixtureid)
            Return Newtonsoft.Json.JsonConvert.SerializeObject(list)
        End Function

        Public Function GetFixturesLeagues(ByVal u As Integer, ByVal f As Integer, ByVal fu As String) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim list As System.Collections.Generic.List(Of League) = League.GetFixturesLeagues(u, f, fu)
            Return Newtonsoft.Json.JsonConvert.SerializeObject(list)
        End Function

        Public Function DeActivateLeague(ByVal u As Integer, ByVal l As Integer, ByVal fu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Return Json(League.DeActivateLeague(u, l, fu))
        End Function

        'Logs all the Invites we sent to a league
        Public Function LogLeagueInvites(ByVal userid As Integer, ByVal fbREquest As String, ByVal FBUserID_List As String, ByVal LeagueID As Integer) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Newtonsoft.Json.JsonConvert.SerializeObject(League.LogLeagueInvites(userid, fbREquest, FBUserID_List, LeagueID))
        End Function

        'Gets all a users outstanding League invites that are linked to this fixture
        Public Function GetLeagueInvites(ByVal u As Integer, ByVal f As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'Return Newtonsoft.Json.JsonConvert.SerializeObject(League.GetLeagueInvites(u, f, fu))
            Return Json(League.GetLeagueInvites(u, f, fu))
        End Function

        Public Function GetLeagueInvitesStress(ByVal u As Integer, ByVal f As Integer, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            'Return Newtonsoft.Json.JsonConvert.SerializeObject(League.GetLeagueInvites(u, f, fu))
            Return Json(League.GetLeagueInvites(u, f, fu), JsonRequestBehavior.AllowGet)
        End Function

        'Logs whether a user accepted or rejected a league invitation
        Public Function UpdateLeagueInvitation(ByVal inviteID As Integer, ByVal leagueid As Integer, ByVal userid As Integer, ByVal status As Integer, ByVal fu As String) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim Joined = League.UpdateLeagueInvitation(inviteID, userid, status)
            If Joined = 1 Then
                'User joined the league!!!
                'so - return the league!!!!!
                Return Newtonsoft.Json.JsonConvert.SerializeObject(Leaderboard.GetLeague(userid, leagueid, fu))
            Else
                Return Newtonsoft.Json.JsonConvert.SerializeObject("false")
            End If
        End Function

        'Updates a league details
        Public Function UpdateLeagueDetails(ByVal leagueid As Integer, ByVal fixtureID As Integer, ByVal userid As Integer, ByVal leagueName As String, ByVal LeagueType As Integer, ByVal allowinvites As Integer) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return Newtonsoft.Json.JsonConvert.SerializeObject(League.EditLeague(leagueName, leagueid, LeagueType, userid, allowinvites, fixtureID))
        End Function

        Public Function ViewYourLeague() As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Return View()
        End Function

        '
        ' GET: /League/Edit/5

        Function Edit(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /League/Edit/5

        <HttpPost()> _
        Function Edit(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add update logic here

                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function

        '
        ' GET: /League/Delete/5

        Function Delete(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /League/Delete/5

        <HttpPost()> _
        Function Delete(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add delete logic here

                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function

        Function sendInvites(ByVal user As String, ByVal inviteList As String, ByVal league As String, ByVal joinCode As String) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim u As New User
            u = Newtonsoft.Json.JsonConvert.DeserializeObject(user, u.GetType())

            Dim email As String()
            email = inviteList.Split(",")
            Dim l As New League
            Dim results As String = String.Empty
            For Each i As String In email
                'Dim resultText As String
                results = results & l.SendInvites(i, u, league, joinCode) & ","

                'results.Add(resultText)
            Next
            results = results.Remove(results.Length - 1)
            Return results

        End Function

        Public Function Joinleague(ByVal leagueid As Integer, ByVal u As Integer, ByVal fu As String) As String
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim Joined = League.joinLeague(u, leagueid)
            If Joined = 1 Then
                'User joined the league!!!
                'so - return the league!!!!!
                Return Newtonsoft.Json.JsonConvert.SerializeObject(Leaderboard.GetLeague(u, leagueid, fu))
            Else
                Return Newtonsoft.Json.JsonConvert.SerializeObject("false")
            End If
        End Function

        'Public Function JoinleagueHandler(ByVal user As String, ByVal joinCode As String) As String
        '    Dim u As New User
        '    u = Newtonsoft.Json.JsonConvert.DeserializeObject(user, u.GetType())
        '    Dim l As New League
        '    l = l.joinLeague(u.ID, joinCode)


        '    Return Newtonsoft.Json.JsonConvert.SerializeObject(l)
        'End Function

        'Function JoinLeague() As ActionResult


        '    Return View()
        'End Function

        'This function updates either accepts or declines an invitaion to a league
        Function inviteUpdate(ByVal lmid As Integer, ByVal Accept As Integer) As ActionResult
            Try
                Response.Cache.SetCacheability(HttpCacheability.NoCache)

                Dim updateID As Integer = League.inviteUpdate(lmid, Accept)
                Return Json(updateID)
            Catch
                Return Json(0)
            End Try
        End Function

    End Class
End Namespace
