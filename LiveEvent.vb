'Unneccessary change2

Imports System
Imports System.Collections.Generic
Imports System.Linq
Imports System.Web

'Imports SignalR.Hubs 'Old way - as of 0.5.3
'Imports SignalR.Infrastructure 'Old way - as of 0.5.3

Imports Microsoft.AspNet.SignalR.Hubs
Imports MySql.Data.MySqlClient

Imports System.Threading.Tasks ' for updates based on SR 0.5 docs - http://weblogs.asp.net/davidfowler/archive/2012/05/04/api-improvements-made-in-signalr-0-5.aspx

'Namespace LiveGamesMessaging

<HubName("liveevent")> _
Public Class LiveEvent
    Inherits Hub

    'Implements IDisconnect

    'Implements IConnected


    'Public Function Connect() As System.Threading.Tasks.Task Implements SignalR.Hubs.IConnected.Connect
    '    'T5Error.LogError("SignalR Debug", "Connect Called " + Context.ConnectionId)
    '    Return Clients(Context.ConnectionId).keepalive()
    'End Function

    'Public Function Reconnect(groups As System.Collections.Generic.IEnumerable(Of String)) As System.Threading.Tasks.Task Implements SignalR.Hubs.IConnected.Reconnect
    '    'T5Error.LogError("SignalR Debug", "Reconnect Called " + Context.ConnectionId)
    '    Return Clients(Context.ConnectionId).keepalive()
    'End Function



    'Public Function Disconnect() As System.Threading.Tasks.Task Implements SignalR.Hubs.IDisconnect.Disconnect
    '    T5Error.LogError("SignalR Debug", "Disconnect Called " + Context.ConnectionId)

    '    'try something like this.....
    '    'Clients[Context.ConnectionId].addMessage(data);
    '    'Return Clients(Context.ConnectionId).leave(Context.ConnectionId, DateTime.Now.ToString())

    '    Return Clients.keepalive()
    '    'Return Clients.leave(Context.ConnectionId, DateTime.Now.ToString())
    'End Function

    Public Sub sendgamedetailsupdate(ByVal GameDetailsUpdateString As String)
        'Send a keepAliveMessageToAllClients on all clients.
        Try
            Clients.All.updategamedetails(GameDetailsUpdateString)
        Catch ex As Exception
            Throw New ApplicationException("Server Side liveevent error - sendgamedetailsupdate  - details ...." & ex.ToString())
        End Try
    End Sub

    Public Sub sendkeepalive()
        'Send a keepAliveMessageToAllClients on all clients.
        Try
            Clients.All.keepalive()
        Catch ex As Exception
            Throw New ApplicationException("Server Side liveevent error - sendkeepalive  - details ...." & ex.ToString())
        End Try
        'SignalR.GlobalHost.Configuration.KeepAlive = TimeSpan.FromSeconds(20)
    End Sub

    'Public Sub joingroup(ByVal groupName As String, ByVal thisUserName As String)
    '    'users join a group to receive messages about their friends bets/scores
    '    Try
    '        'T5Error.LogError("SignalR Debug", thisUserName & " joins group '" & groupName)


    '        Groups.Add(Context.ConnectionId, groupName)


    '    Catch ex As Exception
    '        T5Error.LogError("VB", ex.ToString)
    '        Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
    '    End Try
    'End Sub

    'new way - added Stephen 26-sep - based on docs http://weblogs.asp.net/davidfowler/archive/2012/05/04/api-improvements-made-in-signalr-0-5.aspx
    Public Function joingroup(ByVal groupName As String, ByVal thisUserName As String) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", thisUserName & " joins group '" & groupName & " Context.ConnectionId is " & Context.ConnectionId)


            'Dim id = Caller.id
            'Caller.name = "test" & thisUserName


            Return Groups.Add(Context.ConnectionId, groupName)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function

    Public Function joinTestgroup1(ByVal groupName As String, ByVal thisUserName As String, ByVal groupID As Integer) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", "Context.ConnectionId  " & Context.ConnectionId & " calling joinTestgroup")
            Return Groups.Add(Context.ConnectionId, "testgroup1")
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function


    Public Function joinTestgroup2(ByVal groupName As String, ByVal thisUserName As String, ByVal groupID As Integer) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", "Context.ConnectionId  " & Context.ConnectionId & " calling joinTestgroup")
            Return Groups.Add(Context.ConnectionId, "testgroup2")
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function


    Public Function joinTestgroup3(ByVal groupName As String, ByVal thisUserName As String, ByVal groupID As Integer) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", "Context.ConnectionId  " & Context.ConnectionId & " calling joinTestgroup")
            Return Groups.Add(Context.ConnectionId, "testgroup3")
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function

    Public Function joinTestgroup4(ByVal groupName As String, ByVal thisUserName As String, ByVal groupID As Integer) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", "Context.ConnectionId  " & Context.ConnectionId & " calling joinTestgroup")
            Return Groups.Add(Context.ConnectionId, "testgroup4")
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function

    Public Function joinTestgroup5(ByVal groupName As String, ByVal thisUserName As String, ByVal groupID As Integer) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", "Context.ConnectionId  " & Context.ConnectionId & " calling joinTestgroup")
            Return Groups.Add(Context.ConnectionId, "testgroup5")
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function

    Public Function joinTestgroup6(ByVal groupName As String, ByVal thisUserName As String, ByVal groupID As Integer) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", "Context.ConnectionId  " & Context.ConnectionId & " calling joinTestgroup")
            Return Groups.Add(Context.ConnectionId, "testgroup6")
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function

    Public Function joinTestgroup7(ByVal groupName As String, ByVal thisUserName As String, ByVal groupID As Integer) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", "Context.ConnectionId  " & Context.ConnectionId & " calling joinTestgroup")
            Return Groups.Add(Context.ConnectionId, "testgroup7")
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function

    Public Function joinTestgroup8(ByVal groupName As String, ByVal thisUserName As String, ByVal groupID As Integer) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", "Context.ConnectionId  " & Context.ConnectionId & " calling joinTestgroup")
            Return Groups.Add(Context.ConnectionId, "testgroup8")
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function

    Public Function joinTestgroup9(ByVal groupName As String, ByVal thisUserName As String, ByVal groupID As Integer) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", "Context.ConnectionId  " & Context.ConnectionId & " calling joinTestgroup")
            Return Groups.Add(Context.ConnectionId, "testgroup9")
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function

    Public Function joinTestgroup10(ByVal groupName As String, ByVal thisUserName As String, ByVal groupID As Integer) As Task
        'users join a group to receive messages about their friends bets/scores
        Try
            'T5Error.LogError("SignalR Debug", "Context.ConnectionId  " & Context.ConnectionId & " calling joinTestgroup")
            Return Groups.Add(Context.ConnectionId, "testgroup10")
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - joingroup  - details ...." & ex.ToString())
        End Try
    End Function

    'this function sends details of an invitation to join a league to a user
    Public Sub sendleagueinvite(ByVal inviteID As Integer, ByVal leagueID As Integer, ByVal leagueName As String, ByVal inviter_UserName As String, ByVal FixtureID As Integer, ByVal groupName As String)
        Try
            Dim inviter_UserID As String = groupName.Substring(groupName.IndexOf("UD") + 2, groupName.Length - (groupName.IndexOf("UD") + 2))
            'Clients(groupName).DisplayLeagueInvite(inviteID, leagueID, leagueName, inviter_UserID, inviter_UserName, FixtureID)
            Clients.Group(groupName).DisplayLeagueInvite(inviteID, leagueID, leagueName, inviter_UserID, inviter_UserName, FixtureID)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - sendleagueinvite  - details ...." & ex.ToString())
        End Try
    End Sub

    'new way - added Stephen 26-sep - based on docs http://weblogs.asp.net/davidfowler/archive/2012/05/04/api-improvements-made-in-signalr-0-5.aspx
    Public Function processfriendupdates(ByVal betdetails As String, ByVal groupName As String, ByVal FixtureID As Integer) As Task
        'Send the users message to only the people in the correct group ( i.e. the people who are specifically listening out for his events - his freinds!!!!)
        Try
            Dim friendID As String = groupName.Substring(groupName.IndexOf("UBD") + 3, groupName.Length - (groupName.IndexOf("UBD") + 3))
            'T5Error.LogError("SignalR Debug", "Calling processfriendupdates  betdetails is '" & betdetails & "' , groupName is ,'" & groupName & "', user is " & friendID)
            'Return Clients(groupName).ProcessFriendUpdate(betdetails, friendID, FixtureID)
            Return Clients.Group(groupName).ProcessFriendUpdate(betdetails, friendID, FixtureID)

            'Clients(groupName).ProcessFriendUpdate(betdetails, friendID)

            'Dim i As Integer = 1
            'While i <= 10 ' each test client will be in 10 test groups!!!
            '    Clients("testgroup" & i).ProcessFriendUpdate("testgroup" & i & "-" & betdetails, friendID)
            '    i = i + 1
            'End While

            'Clients("testgroup1").ProcessFriendUpdate(betdetails, friendID)
            'Clients("testgroup2").ProcessFriendUpdate(betdetails, friendID)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - processfriendupdates  - details ...." & ex.ToString())
        End Try
    End Function

    'new way - added Stephen 26-sep - based on docs http://weblogs.asp.net/davidfowler/archive/2012/05/04/api-improvements-made-in-signalr-0-5.aspx
    Public Function processtestgroupupdate(ByVal betdetails As String, ByVal groupName As String, ByVal FixtureID As Integer) As Task
        'Send the users message to only the people in the correct group ( i.e. the people who are specifically listening out for his events - his freinds!!!!)
        Try
            Dim friendID As String = groupName.Substring(groupName.IndexOf("UBD") + 3, groupName.Length - (groupName.IndexOf("UBD") + 3))
            'T5Error.LogError("SignalR Debug", "processtestgroupupdate called betdetails is '" & betdetails & "' , groupName is ,'" & groupName & "', user is " & friendID)
            'Return Clients("testgroup1").ProcessFriendUpdate(betdetails, friendID)
            Return Clients.Group("testgroup1").ProcessFriendUpdate(betdetails, friendID, FixtureID)

            'Clients(groupName).ProcessFriendUpdate(betdetails, friendID)

            'Dim i As Integer = 1
            'While i <= 10 ' each test client will be in 10 test groups!!!
            '    Clients("testgroup" & i).ProcessFriendUpdate("testgroup" & i & "-" & betdetails, friendID)
            '    i = i + 1
            'End While

            'Clients("testgroup1").ProcessFriendUpdate(betdetails, friendID)
            'Clients("testgroup2").ProcessFriendUpdate(betdetails, friendID)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - processfriendupdates  - details ...." & ex.ToString())
        End Try
    End Function

    'Public Sub processfriendupdates(ByVal betdetails As String, ByVal groupName As String)
    '    'Send the users message to only the people in the correct group ( i.e. the people who are specifically listening out for his events - his freinds!!!!)
    '    Try
    '        Dim friendID As String = groupName.Substring(groupName.IndexOf("UBD") + 3, groupName.Length - (groupName.IndexOf("UBD") + 3))
    '        'T5Error.LogError("SignalR Debug", "betdetails is '" & betdetails & "' , groupName is ,'" & groupName & "', user is " & friendID)
    '        Clients(groupName).ProcessFriendUpdate(betdetails, friendID)
    '    Catch ex As Exception
    '        T5Error.LogError("VB", ex.ToString)
    '        Throw New ApplicationException("Server Side liveevent error - processfriendupdates  - details ...." & ex.ToString())
    '    End Try
    'End Sub

    Public Sub LogEvent(ByVal eventID As Integer, ByVal FixtureID As Integer, ByVal FBOID As Integer, ByVal BroadCastMessage As String, ByVal u As Integer, ByVal fu As String, ByVal EventTimeStamp As String)
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
                Clients.Caller.ConfirmEventSent(eventDetails)

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

                'Clients.UpdateGameEvent(FixtureID, eventID, newEventID, HomeScore, AwayScore, EventDescription, EventTime, EventEndTime, PreviousEvents, MatchStartExtraDetails)
                Clients.All.UpdateGameEvent(FixtureID, eventID, newEventID, HomeScore, AwayScore, EventDescription, EventTime, EventEndTime, PreviousEvents, MatchStartExtraDetails)

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
                    Clients.All.UpdateGameOdds(oddsString, FixtureID)
                End If

                If LeagueID > 0 Then
                    'if we know the leagueid - return the league Leaderborad
                    Dim LeaderboardExtraDetails As New LeaderboardExtra
                    LeaderboardExtraDetails = LeaderboardExtra.GetLeagueDetails(u, LeagueID, fu, 1)
                    'Clients.UpdateLeaderboard(Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardExtraDetails.LeaderboardList), LeagueID, FixtureID, newEventID, LeaderboardExtraDetails.TotalUsersInLeague)
                    Clients.All.UpdateLeaderboard(Newtonsoft.Json.JsonConvert.SerializeObject(LeaderboardExtraDetails.LeaderboardList), LeagueID, FixtureID, newEventID, LeaderboardExtraDetails.TotalUsersInLeague)
                End If

                'now we have sent the data to the users - backup the memory tables
                Fixture.BackupLeagueMemoryTableAfterEachEvent() 'do we need to call this function asynchronously ? - what happens if there is another event before this line finishes running? - will another thread be created???

                'Else
                'we never get here anymore!!!!!

                ''Added this block of code - stephen - 18-July-12
                ''Added thaw to this flow - 15-Oct-12
                'If eventID = 22 Or eventID = 23 AndAlso newEventID > 0 Then 'hardcode to eventid - should read this in from config????
                '    'Event was a bet freeze (or a bet thaw!!!!!)!!!!!!!
                '    'we now want to send this bet freeze/thaw to all clients
                '    'this is so - when they receive this bet freeze they can then stop the bet countdown (if it is counting down) 
                '    'and tell the user their bet is voided!!!!!
                '    'Clients.UpdateGameEvent(FixtureID, eventID, -1, -1, -1, "", "", EventEndTime, "")
                '    Clients.All.UpdateGameEvent(FixtureID, eventID, -1, -1, -1, "", "", EventEndTime, "")
                'End If

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
    End Sub

    'this function not used for liveGames -just a test function
    Public Sub Send(ByVal message As String)
        'Call the addMessage method on all clients.
        Try
            'Clients.addMessage(message)
            Clients.All.addMessage(message)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Throw New ApplicationException("Server Side liveevent error - processfriendupdates  - details ...." & ex.ToString())
        End Try

    End Sub

    'Public Sub Send(ByVal message As String)
    '    'Call the addMessage method on all clients.
    '    'Clients.addMessage(message)

    '    Groups.Add(Context.ConnectionId, "UBD100003370401837")
    '    Clients("UBD100003370401837").addMessage(message)

    '    'For Each lgFriend As SignalAgent In Clients("UBD100003370401837")
    '    'lgFriend()
    '    'Next()
    'End Sub

    'Public Sub sendkeepalive()
    '    'Send a keepAliveMessageToAllClients on all clients.
    '    Clients.keepalive()
    'End Sub

    'Public Sub joingroup(ByVal groupName As String)
    '    'Caller.Groups.Add(groupName)
    '    'AddToGroup("")
    '    Groups.Add(Context.ConnectionId, groupName)
    '    'Groups.Add(Context.ConnectionId, "UBD100003370401837")
    '    'Groups.Add(Caller, groupName)
    '    'Caller.AddToGroup(groupName) 'doesn't throw error
    '    'Clients.addMessage(groupName)
    'End Sub

    ''looks like we can't call this from server side????
    'Public Sub notifyfriendsofbetplacedtest(ByVal testmessage As String)
    '    Try
    '        Clients("UBD100003370401837").addMessage(testmessage)
    '    Catch ex As Exception
    '        Dim i = 1
    '    End Try
    'End Sub

    'Public Sub notifyfriendsofbetplacedamq(ByVal testmessage As String)
    '    Try
    '        'IConnectionManager connectionManager = AspNetHost.DependencyResolver.Resolve<IConnectionManager>();
    '        'Dim connectionManager As SignalR.IConnectionManager = SignalR.Hosting.Common.RoutingHost.Resolve(Of SignalR.IConnectionManager)()
    '        Clients("UBD100003370401837").addMessage(testmessage)
    '    Catch ex As Exception
    '        Dim i = 1
    '    End Try
    'End Sub

    'Public Sub notifyfriendsofbetplaced(ByVal betdetails As String, ByVal groupName As String)
    '    'Send the users message to only the people in the correct group ( i.e. the people who are specifically listening out for his events - his freinds!!!!)
    '    Dim friendID As String = groupName.Substring(groupName.IndexOf("UBD") + 3, groupName.Length - (groupName.IndexOf("UBD") + 3))
    '    Clients(groupName).ProcessFriendUpdate(betdetails, friendID)
    '    'Clients(groupName).addMessage(betdetails)
    '    'Clients("").addMessage("")
    'End Sub

    'Public Function Disconnect() As System.Threading.Tasks.Task Implements SignalR.Hubs.IDisconnect.Disconnect

    'End Function

    
End Class


'End Namespace

