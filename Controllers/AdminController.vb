Imports MySql.Data.MySqlClient

Namespace LiveGamesClient1._2
    Public Class AdminController
        Inherits System.Web.Mvc.Controller

        'this function is a copy of the function from Hub LiveEvent
        'The difference is that we create an object with all the properties et and then return that object
        'In the Hub we send 3 different messages
        Function LogEvent(ByVal eventID As Integer, ByVal FixtureID As Integer, ByVal FBOID As Integer, ByVal BroadCastMessage As String, ByVal u As Integer, ByVal fu As String, ByVal EventTimeStamp As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim thisLogEvent As New LogEvent

            Dim newEventID As Integer
            Dim HomeScore As Integer
            Dim AwayScore As Integer
            Dim EventDescription As String
            Dim EventEndTime As String
            Dim EventTime As String
            Dim LeagueID As Integer
            Dim PreviousEvents As String

            Dim MatchStartExtraDetails As String = ""
            Dim EventString As String = ""
            Dim oddsString As String = ""
            Dim returnString = ""
            Dim conn As New MySqlConnection
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
            Dim connResponse As New MySqlConnection
            Dim reader As MySqlDataReader
            Dim cmd As MySqlCommand
            Try
                conn.Open()
                Dim query As String = "usp_logevent_v2"
                cmd = New MySqlCommand(query, conn)
                cmd.CommandType = CommandType.StoredProcedure
                cmd.Parameters.AddWithValue("_fixtureid", FixtureID)
                cmd.Parameters.AddWithValue("_eventID", eventID)
                cmd.Parameters.AddWithValue("_fboid", FBOID)
                If String.IsNullOrEmpty(BroadCastMessage) Then
                    cmd.Parameters.AddWithValue("_broadcastMessage", DBNull.Value)
                Else
                    cmd.Parameters.AddWithValue("_broadcastMessage", BroadCastMessage)
                End If
                cmd.Parameters.AddWithValue("_userID", u)
                cmd.Parameters.AddWithValue("_facebookUserID", fu)
                cmd.Parameters.AddWithValue("_EventTimeStamp", EventTimeStamp)

                Dim before As DateTime = DateTime.Now
                reader = cmd.ExecuteReader()
                Dim after As DateTime = DateTime.Now
                Dim span As TimeSpan = after - before
                Dim it As Integer = 1

                While reader.Read() 'First Get event details
                    Integer.TryParse(reader.GetString("newEventID"), newEventID)

                    Dim eventDetails As String = eventID.ToString() + ":" + newEventID.ToString()

                    'update the admin that this message is DEFO in the DB!!!!!
                    'Clients.Caller.ConfirmEventSent(eventDetails)
                    thisLogEvent.c = eventDetails

                    'Added this stpehen - 18-july - we need the date for  freeze events for bet countdown
                    Dim tempDate As Date
                    Try
                        tempDate = reader.GetMySqlDateTime("EventEndTime")
                        EventEndTime = tempDate.ToString("MM/dd/yyyy HH:mm:ss")
                    Catch ex As Exception
                    End Try

                    If newEventID > 0 Then
                        Integer.TryParse(reader.GetString("HomeScore"), HomeScore)
                        Integer.TryParse(reader.GetString("AwayScore"), AwayScore)
                        EventDescription = reader.GetString("EventDescription")
                        tempDate = reader.GetMySqlDateTime("EventTime")
                        EventTime = tempDate.ToString("MM/dd/yyyy HH:mm:ss")
                        Integer.TryParse(reader.GetString("LeagueID"), LeagueID)
                        MatchStartExtraDetails = reader.GetString("MatchStartExtraDetails")
                    End If
                End While

                If newEventID > 0 Then 'only proceed if we logged event successfully
                    'If LeagueID > 0 Then 'changed this stephen 23-10 - we now have a newEventID for freeze's and thaws so we use the LeagueID to tell us if we should send extra info to the user
                    reader.NextResult()
                    While reader.Read()
                        Dim thisEventID As Integer
                        Integer.TryParse(reader.GetString("ID"), thisEventID)

                        If Not String.IsNullOrEmpty(PreviousEvents) Then
                            PreviousEvents = PreviousEvents + "," + reader.GetString("ID")
                        Else
                            PreviousEvents = reader.GetString("ID")
                        End If
                    End While

                    'Clients.All.UpdateGameEvent(FixtureID, eventID, newEventID, HomeScore, AwayScore, EventDescription, EventTime, EventEndTime, PreviousEvents, MatchStartExtraDetails)
                    thisLogEvent.f = FixtureID
                    thisLogEvent.e = eventID
                    thisLogEvent.ne = newEventID
                    thisLogEvent.h = HomeScore
                    thisLogEvent.a = AwayScore
                    thisLogEvent.d = EventDescription
                    thisLogEvent.t = EventTime
                    thisLogEvent.et = EventEndTime
                    thisLogEvent.p = PreviousEvents
                    thisLogEvent.s = MatchStartExtraDetails

                    reader.NextResult()
                    Dim oddsUpdated = False
                    While reader.Read
                        If oddsUpdated Then
                            oddsString = oddsString & "," & reader.GetString("EventId") & ":" & reader.GetString("Odds")
                        Else
                            oddsString = reader.GetString("EventId") & ":" & reader.GetString("Odds")
                            oddsUpdated = True
                        End If
                    End While

                    If Not String.IsNullOrEmpty(oddsString) Then
                        'if new odds exist - return new odds 
                        'Clients.UpdateGameOdds(oddsString, FixtureID)
                        'Clients.All.UpdateGameOdds(oddsString, FixtureID)
                        thisLogEvent.o = oddsString
                    End If

                    If LeagueID > 0 Then
                        'if we know the leagueid - return the league Leaderborad
                        Dim LeaderboardExtraDetails As New LeaderboardExtra
                        LeaderboardExtraDetails = LeaderboardExtra.GetLeagueDetails(u, LeagueID, fu, 1)
                        'Clients.All.UpdateLeaderboard(Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardExtraDetails.LeaderboardList), LeagueID, FixtureID, newEventID, LeaderboardExtraDetails.TotalUsersInLeague)
                        thisLogEvent.l = Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardExtraDetails.LeaderboardList)
                        thisLogEvent.i = LeagueID
                        thisLogEvent.n = LeaderboardExtraDetails.TotalUsersInLeague
                    End If

                    If Not eventID = 22 AndAlso Not eventID = 23 Then 'Dont back up for thaw/freeze
                        Fixture.BackUpToDisk()
                    End If

                    Try
                        'Log time taken to call logevent each time!!
                        Dim AsyncCaller As New Logger.LogTimeTakenAsyncMethodCaller(AddressOf Logger.LogTimeTaken)
                        Dim LogResult As IAsyncResult = AsyncCaller.BeginInvoke("LogEvent", span.TotalMilliseconds, Nothing, Nothing)
                    Catch ex As Exception
                    End Try

                End If 'newEventID > 0

            Catch ex As Exception
                T5Error.LogError("VB", ex.ToString)
                Throw New ApplicationException("Server Side liveevent error - LogEvent  - details ...." & ex.ToString())
            Finally
                Try
                    reader.Close()
                Catch ex As Exception
                End Try
                Try
                    cmd.Dispose()
                Catch ex As Exception
                End Try
                Try
                    conn.Dispose()
                    conn.Close()
                Catch ex As Exception
                End Try
            End Try
            Return Json(thisLogEvent)
        End Function

        Function GetSecureGroupName() As JsonResult
            If Session("level") = "trust5" Then
                Return Json(System.Guid.NewGuid().ToString())
            End If
        End Function

        'reset Backup
        Function RB(ByVal u As Integer, ByVal fu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim reset As Integer
            Dim conn As New MySqlConnection
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
            Dim connResponse As New MySqlConnection
            Dim reader As MySqlDataReader
            Dim cmd As MySqlCommand
            Try
                conn.Open()
                Dim query As String = "USP_ResetBackup"
                cmd = New MySqlCommand(query, conn)
                cmd.CommandType = CommandType.StoredProcedure
                cmd.Parameters.AddWithValue("_userID", u)
                cmd.Parameters.AddWithValue("_facebookUserID", fu)

                reader = cmd.ExecuteReader()

                If reader.Read() Then
                    Integer.TryParse(reader.GetString("result"), reset)
                End If


            Catch ex As Exception
                T5Error.LogError("VB", ex.ToString)
            Finally
                Try
                    reader.Close()
                Catch ex As Exception
                End Try
                Try
                    cmd.Dispose()
                Catch ex As Exception
                End Try
                Try
                    conn.Dispose()
                    conn.Close()
                Catch ex As Exception
                End Try
            End Try
            Return Json(reset)
        End Function


        'get PusherDetails
        Function GetPusherURLS(ByVal u As Integer, ByVal fu As String, ByVal p As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim ListOfPushers As Collections.Generic.List(Of Pusher) = New Collections.Generic.List(Of Pusher)
            Dim conn As New MySqlConnection
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
            Dim connResponse As New MySqlConnection
            Dim reader As MySqlDataReader
            Dim cmd As MySqlCommand
            Try
                conn.Open()
                Dim query As String = "USP_GetPusherURL"
                cmd = New MySqlCommand(query, conn)
                cmd.CommandType = CommandType.StoredProcedure
                cmd.Parameters.AddWithValue("_userID", u)
                cmd.Parameters.AddWithValue("_facebookUserID", fu)
                cmd.Parameters.AddWithValue("_Pusher", p)

                reader = cmd.ExecuteReader()

                While reader.Read()
                    Dim tempPusher As New Pusher
                    Integer.TryParse(reader.GetString("PID"), tempPusher.id)
                    tempPusher.URL = reader.GetString("URL")
                    ListOfPushers.Add(tempPusher)
                End While
            Catch ex As Exception
                T5Error.LogError("VB", ex.ToString)
            Finally
                Try
                    reader.Close()
                Catch ex As Exception
                End Try
                Try
                    cmd.Dispose()
                Catch ex As Exception
                End Try
                Try
                    conn.Dispose()
                    conn.Close()
                Catch ex As Exception
                End Try
            End Try
            Return Json(ListOfPushers)
        End Function

        'UpdatePusherURL
        Function UpdatePusherURL(ByVal u As Integer, ByVal fu As String, ByVal p As String, ByVal pu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim updated As Integer
            Dim conn As New MySqlConnection
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
            Dim connResponse As New MySqlConnection
            Dim reader As MySqlDataReader
            Dim cmd As MySqlCommand
            Try
                conn.Open()
                Dim query As String = "USP_UpdatePusherURL"
                cmd = New MySqlCommand(query, conn)
                cmd.CommandType = CommandType.StoredProcedure
                cmd.Parameters.AddWithValue("_userID", u)
                cmd.Parameters.AddWithValue("_facebookUserID", fu)
                cmd.Parameters.AddWithValue("_Pusher", p)
                cmd.Parameters.AddWithValue("_PusherURL", pu)

                reader = cmd.ExecuteReader()

                If reader.Read() Then
                    Integer.TryParse(reader.GetString("RC"), updated)
                End If
            Catch ex As Exception
                updated = -1
                T5Error.LogError("VB", ex.ToString)
            Finally
                Try
                    reader.Close()
                Catch ex As Exception
                End Try
                Try
                    cmd.Dispose()
                Catch ex As Exception
                End Try
                Try
                    conn.Dispose()
                    conn.Close()
                Catch ex As Exception
                End Try
            End Try
            Return Json(updated)
        End Function


        'GetPusherSetUpDetails - this returns if we are using seperatePushers or not
        Function GetNumPushers(ByVal u As Integer, ByVal fu As String, ByVal p As String, ByVal pu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim seperatePushers As Integer
            Dim conn As New MySqlConnection
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
            Dim connResponse As New MySqlConnection
            Dim reader As MySqlDataReader
            Dim cmd As MySqlCommand
            Try
                conn.Open()
                Dim query As String = "USP_GetPusherSetUpDetails"
                cmd = New MySqlCommand(query, conn)
                cmd.CommandType = CommandType.StoredProcedure
                cmd.Parameters.AddWithValue("_userID", u)
                cmd.Parameters.AddWithValue("_facebookUserID", fu)
                reader = cmd.ExecuteReader()

                If reader.Read() Then
                    Integer.TryParse(reader.GetString("seperatePushers"), seperatePushers)
                End If

            Catch ex As Exception
                seperatePushers = -1
                T5Error.LogError("VB", ex.ToString)
            Finally
                Try
                    reader.Close()
                Catch ex As Exception
                End Try
                Try
                    cmd.Dispose()
                Catch ex As Exception
                End Try
                Try
                    conn.Dispose()
                    conn.Close()
                Catch ex As Exception
                End Try
            End Try
            Return Json(seperatePushers)
        End Function

        'GetPusherSetUpDetails - this returns if we are using seperatePushers or not
        Function UpdateNumPushers(ByVal u As Integer, ByVal fu As String, ByVal np As Integer) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim done As Integer
            Dim conn As New MySqlConnection
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
            Dim connResponse As New MySqlConnection
            Dim reader As MySqlDataReader
            Dim cmd As MySqlCommand
            Try
                conn.Open()
                Dim query As String = "USP_UpdateNumPushers"
                cmd = New MySqlCommand(query, conn)
                cmd.CommandType = CommandType.StoredProcedure
                cmd.Parameters.AddWithValue("_userID", u)
                cmd.Parameters.AddWithValue("_facebookUserID", fu)
                cmd.Parameters.AddWithValue("_numPushers", np)
                cmd.ExecuteNonQuery()
                done = 1
            Catch ex As Exception
                done = -1
                T5Error.LogError("VB", ex.ToString)
            Finally
                Try
                    reader.Close()
                Catch ex As Exception
                End Try
                Try
                    cmd.Dispose()
                Catch ex As Exception
                End Try
                Try
                    conn.Dispose()
                    conn.Close()
                Catch ex As Exception
                End Try
            End Try
            Return Json(done)
        End Function

        Function GetEmailDetails(ByVal u As Integer, ByVal fu As String) As FileContentResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim csv As String = ""
            Dim counter As Integer = 0

            Dim conn As New MySqlConnection
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
            Dim connResponse As New MySqlConnection
            Dim reader As MySqlDataReader
            Dim cmd As MySqlCommand
            Try
                conn.Open()

                Dim query As String = "USP_GetEmailCSV"
                cmd = New MySqlCommand(query, conn)
                cmd.CommandType = CommandType.StoredProcedure
                cmd.Parameters.AddWithValue("_userID", u)
                cmd.Parameters.AddWithValue("_facebookUserID", fu)
                reader = cmd.ExecuteReader

                While reader.Read()
                    csv = csv & reader.GetString("email") & "," & reader.GetString("firstname") & "," & reader.GetString("lastname") & vbNewLine
                    counter = counter + 1
                End While

            Catch ex As Exception
                T5Error.LogError("VB", ex.ToString)
            Finally
                Try
                    reader.Close()
                Catch ex As Exception
                End Try
                Try
                    cmd.Dispose()
                Catch ex As Exception
                End Try
                Try
                    conn.Dispose()
                    conn.Close()
                Catch ex As Exception
                End Try
            End Try

            Return File(New System.Text.UTF8Encoding().GetBytes(csv), "text/csv", "LiveGamesEmailList_" & Date.Now.Ticks & ".csv")

        End Function

        Function GetNotifications(ByVal f As Integer, ByVal u As Integer, ByVal fu As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim NotificationDetails As New FacebookNotificationDetails

            Dim conn As New MySqlConnection
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
            Dim connResponse As New MySqlConnection
            Dim reader As MySqlDataReader
            Dim cmd As MySqlCommand
            Try
                conn.Open()

                Dim query As String = "USP_SendFaceBookNotifications"
                cmd = New MySqlCommand(query, conn)
                cmd.CommandType = CommandType.StoredProcedure
                cmd.Parameters.AddWithValue("_FixtureID", f)
                cmd.Parameters.AddWithValue("_userID", u)
                cmd.Parameters.AddWithValue("_facebookUserID", fu)
                reader = cmd.ExecuteReader

                If reader.Read() Then
                    Integer.TryParse(reader.GetString("NotificationID"), NotificationDetails.NotificationId)
                End If

                reader.NextResult()

                While reader.Read()
                    NotificationDetails.userList.Add(reader.GetString("fbuserid"))
                End While

            Catch ex As Exception
                T5Error.LogError("VB", ex.ToString)
            Finally
                Try
                    reader.Close()
                Catch ex As Exception
                End Try
                Try
                    cmd.Dispose()
                Catch ex As Exception
                End Try
                Try
                    conn.Dispose()
                    conn.Close()
                Catch ex As Exception
                End Try
            End Try
            Return Json(NotificationDetails)
        End Function



    End Class
End Namespace
