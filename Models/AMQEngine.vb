Imports Apache.NMS.ActiveMQ
Imports Apache.NMS
Imports Apache.NMS.Util
Imports Apache.NMS.ActiveMQ.Commands
Imports System

Public Class AMQEngine

    Private Property connectURI As Uri
    Private Property factory As IConnectionFactory '= New NMSConnectionFactory(connectURI)
    Private Property connection As IConnection '= factory.CreateConnection()
    Private Property session As ISession '= connection.CreateSession()
    Private Property destination As IDestination '= SessionUtil.GetDestination(session, "queue://LiveGamesAdmin")
    Private Property receiveTimeout As TimeSpan '= TimeSpan.FromSeconds(10)

    Private US As String = Chr(31)
    Private RS As String = Chr(30)

    Public Shared Sub Test()
        Try
            Dim receiveTimeout As TimeSpan = TimeSpan.FromSeconds(10)
            Dim connectURI As Uri = New Uri("tcp://localhost:61616")

            Console.WriteLine("About to connect to " & connectURI.ToString)

            Dim factory As IConnectionFactory = New NMSConnectionFactory(connectURI)

            Using connection As IConnection = factory.CreateConnection()
                Using session As ISession = connection.CreateSession()
                    Dim destination As IDestination = SessionUtil.GetDestination(session, "queue://LiveGamesAdmin")

                    Using producer As IMessageProducer = session.CreateProducer(destination)
                        connection.Start()
                        'producer.Persistent = True
                        producer.RequestTimeout = receiveTimeout


                        'consumer.Listener += New MessageListener(OnMessage)

                        Dim US As String = Chr(31)
                        Dim RS As String = Chr(30)
                        Dim testString = "FixtureID1" & RS & "EventID" & US & "6" & RS & "Timestamp" & US & "1317717724437" & RS & "Admin" & US & "admin"
                        Dim request As ITextMessage = session.CreateTextMessage(testString)

                        producer.Send(request)

                    End Using
                End Using
            End Using
        Catch ex As Exception
            Dim i As Integer = 0
        End Try

    End Sub

    'Old way - removed Stephen 24-Apr- this way sends far too many characters
    'Public Shared Sub NotifyFriendsOfBetPlaced(ByVal thisBet As Bet)
    '    Dim thisAmqEngine As New AMQEngine
    '    Try
    '        Dim US As String = Chr(31)
    '        Dim RS As String = Chr(30)

    '        If thisAmqEngine.SetUp() Then
    '            Dim PotentialWinnings As Integer = (thisBet.odds * thisBet.amount)
    '            'Dim UsersBetDetails As String = thisBet.user.name & " will win " & PotentialWinnings & " credits if the next event is a " & thisBet.eventdesc & ";" & thisBet.eventid & ";" & thisBet.betid & ";" + thisBet.eventdesc & ";" + thisBet.user.name & ";" & thisBet.amount & ";" & PotentialWinnings & ";" & thisBet.eventtime

    '            'no longer send through the bet description sentence (as we no longer use it and we want to send as littel as possible data - stephen 29-Feb-12
    '            Dim UsersBetDetails As String = "BD;" & thisBet.eventid & ";" & thisBet.betid & ";" + thisBet.eventdesc & ";" + thisBet.user.name & ";" & thisBet.amount & ";" & PotentialWinnings & ";" & thisBet.eventtime
    '            Dim Message = "FixtureID" & thisBet.f & RS & "UserID" & US & thisBet.user.fbuserid & RS & "UBD" & US & UsersBetDetails
    '            thisAmqEngine.SendMessage(Message)
    '        End If
    '    Catch ex As Exception
    '        'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
    '        T5Error.LogError("VB", ex.ToString)
    '    Finally
    '        Try
    '            thisAmqEngine.CleanUp()
    '        Catch ex As Exception
    '            'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
    '            T5Error.LogError("VB", ex.ToString)
    '        End Try
    '    End Try
    'End Sub

    Public Shared Sub NotifyFriendsOfBetPlaced(ByVal thisBet As Bet)
        Dim thisAmqEngine As New AMQEngine
        Try
            Dim US As String = Chr(31)
            Dim RS As String = Chr(30)

            If thisAmqEngine.SetUp() Then
                Dim PotentialWinnings As Integer = (thisBet.odds * thisBet.amount)

                'We start the string with a 1 - this indicates the message is for a bet placed
                Dim UsersBetDetails As String = "1;" & thisBet.eventid & ";" & thisBet.betid & ";" & thisBet.amount & ";" & PotentialWinnings & ";" & thisBet.eventtime
                Dim Message = "FixtureID" & thisBet.fixtureid & RS & "UserID" & US & thisBet.user.fbuserid & RS & "UBD" & US & UsersBetDetails

                'Notify friends via signalR - for time being we have to call SignalR from javascript!!!!
                'Dim thisLiveEvent As New LiveEvent
                'thisLiveEvent.NotifyFriendsOfBetPlaced(UsersBetDetails, "UBD" & thisBet.user.fbuserid)
                'thisLiveEvent.notifyfriendsofbetplacedtest("betplacedserverside")

                'Notify friends via LightStremer
                thisAmqEngine.SendMessage(Message)
            End If
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
            Try
                thisAmqEngine.CleanUp()
            Catch ex As Exception
                'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
                T5Error.LogError("VB", ex.ToString)
            End Try
        End Try
    End Sub

    Public Shared Sub NotifyFriendsOfBetForfeit(ByVal thisBet As Bet)
        Dim thisAmqEngine As New AMQEngine
        Try
            Dim US As String = Chr(31)
            Dim RS As String = Chr(30)

            If thisAmqEngine.SetUp() Then

                'We start the string with a 2 - this indicates the message is for a bet forfeit
                Dim ForfeitDetailsDetails As String = "2;" & thisBet.betid
                Dim Message = "FixtureID" & thisBet.fixtureid & RS & "UserID" & US & thisBet.user.fbuserid & RS & "UBD" & US & ForfeitDetailsDetails
                thisAmqEngine.SendMessage(Message)
            End If
        Catch ex As Exception
            'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            Try
                thisAmqEngine.CleanUp()
            Catch ex As Exception
                'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
                T5Error.LogError("VB", ex.ToString)
            End Try
        End Try
    End Sub

    'Old way - removed Stephen 24-Apr- this way sends far too many characters
    'Public Shared Sub NotifyFriendsOfBetForfeit(ByVal thisBet As Bet)
    '    Dim thisAmqEngine As New AMQEngine
    '    Try
    '        Dim US As String = Chr(31)
    '        Dim RS As String = Chr(30)

    '        If thisAmqEngine.SetUp() Then
    '            Dim ForfeitDetailsDetails As String = ";;" & thisBet.betid 'this is a hack - we differentiate between the various user bet detail messages we send by the number of semi colons
    '            Dim Message = "FixtureID" & thisBet.f & RS & "UserID" & US & thisBet.user.fbuserid & RS & "UBD" & US & ForfeitDetailsDetails
    '            thisAmqEngine.SendMessage(Message)
    '        End If
    '    Catch ex As Exception
    '        'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
    '        T5Error.LogError("VB", ex.ToString)
    '    Finally
    '        Try
    '            thisAmqEngine.CleanUp()
    '        Catch ex As Exception
    '            'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
    '            T5Error.LogError("VB", ex.ToString)
    '        End Try
    '    End Try
    'End Sub

    Public Shared Sub NotifyFriendOfLeagueInvite(ByVal UserToInvite_ID As String, ByVal fixtureID As Integer, ByVal LMID As Integer, ByVal leagueName As String, ByVal LeagueID As Integer, ByVal LeagueDesc As String, ByVal InvitedBy As User)
        Dim thisAmqEngine As New AMQEngine
        Try
            Dim US As String = Chr(31)
            Dim RS As String = Chr(30)

            If thisAmqEngine.SetUp() Then
                Dim encodedLeagueName As String = leagueName.Replace("'", "`")
                Dim encodedLeagueDesc As String = ""
                If Not String.IsNullOrEmpty(LeagueDesc) Then
                    encodedLeagueDesc = LeagueDesc.Replace("'", "`")
                End If

                Dim inviteDetails As String = "<span id=""inviteUpdateSpan_" & LMID & """><b class='friendtext'>You've been invited to play this game against your friend</b> <b>" & InvitedBy.name & "</b> <span class=""inviteLinks""> <a href=""#"" onclick=""inviteUpdate(" & LeagueID & "," & LMID & ",1,'" & encodedLeagueName & "','" & encodedLeagueDesc & "')s: return falses:"">Accept</a> or <a href=""#"" onclick=""inviteUpdate(" & LeagueID & "," & LMID & ",-1,'" & encodedLeagueName & "','" & encodedLeagueDesc & "')s: return falses:"">Decline</a></span><br /></span>;" & LMID
                Dim Message = "FixtureID" & fixtureID & RS & "UserID" & US & UserToInvite_ID & RS & "UID" & US & inviteDetails
                thisAmqEngine.SendMessage(Message)
            End If
        Catch ex As Exception
            'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            Try
                thisAmqEngine.CleanUp()
            Catch ex As Exception
                'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
                T5Error.LogError("VB", ex.ToString)
            End Try
        End Try
    End Sub

    'No longer going to user this function 
    'instead each user will have a local list of all their friends bets
    'we will use to local list to see who won/lost based on an incoming event
    Public Shared Sub NotifyFriendsOfBetResult(ByVal thisBet As Bet)
        Dim thisAmqEngine As New AMQEngine
        Dim US As String = Chr(31)
        Dim RS As String = Chr(30)
        Try
            If thisAmqEngine.SetUp() Then
                Dim UsersBetDetails As String
                If thisBet.status = 1 Then
                    'Bet has been won!!!!
                    Dim Winnings As Integer = (thisBet.odds * thisBet.amount)
                    UsersBetDetails = thisBet.user.name & " wins " & Winnings & " credits!!!!"
                ElseIf thisBet.status = 1 Then
                    'Bet is void!!!
                    Dim Winnings As Integer = (thisBet.odds * thisBet.amount)
                    UsersBetDetails = thisBet.user.name & "'s bet is void!!!!"
                Else
                    UsersBetDetails = thisBet.user.name & " loses " & thisBet.amount & " credits!!!!"
                End If

                'Dim Message = "FixtureID" & thisBet.f & RS & "UserID" & US & thisBet.user.id & RS & "UBD" & US & UsersBetDetails & RS & "Timestamp" & US & Date.Now.Ticks ' "1317717724437"
                Dim Message = "FixtureID" & thisBet.fixtureid & RS & "UserID" & US & thisBet.user.fbuserid & RS & "UBD" & US & UsersBetDetails & RS & "Timestamp" & US & Date.Now.Ticks ' "1317717724437"
                thisAmqEngine.SendMessage(Message)
            End If
        Catch ex As Exception
            'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            Try
                thisAmqEngine.CleanUp()
            Catch ex As Exception
                'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
                T5Error.LogError("VB", ex.ToString)
            End Try
        End Try
    End Sub

    Public Shared Sub NotifyFriendsThatUserHasJoinedGame(ByVal thisUser As User)
        Dim thisAmqEngine As New AMQEngine
        Try
            Dim US As String = Chr(31)
            Dim RS As String = Chr(30)

            If thisAmqEngine.SetUp() Then

                'All we need to send is the number 3 - this will tell the receiving client the user has joined the game- they will be able to find the user ID from the schema field
                Dim UserDetails As String = "3;" & thisUser.name
                Dim Message = "FixtureID" & thisUser.currentfixtureid & RS & "UserID" & US & thisUser.fbuserid & RS & "UBD" & US & UserDetails
                thisAmqEngine.SendMessage(Message)
            End If
        Catch ex As Exception
            'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            Try
                thisAmqEngine.CleanUp()
            Catch ex As Exception
                'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
                T5Error.LogError("VB", ex.ToString)
            End Try
        End Try
    End Sub

    'Old way - removed Stephen 24-Apr- this way sends far too many characters
    'Public Shared Sub NotifyFriendsThatUserHasJoinedGame(ByVal thisUser As User)
    '    Dim thisAmqEngine As New AMQEngine
    '    Try
    '        Dim US As String = Chr(31)
    '        Dim RS As String = Chr(30)

    '        If thisAmqEngine.SetUp() Then
    '            Dim UserDetails As String = thisUser.name & " has joined the game!"
    '            Dim Message = "FixtureID" & thisUser.currentfixtureid & RS & "UserID" & US & thisUser.fbuserid & RS & "UBD" & US & UserDetails & RS & "Timestamp" & US & Date.Now.Ticks
    '            thisAmqEngine.SendMessage(Message)
    '        End If
    '    Catch ex As Exception
    '        'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
    '        T5Error.LogError("VB", ex.ToString)
    '    Finally
    '        Try
    '            thisAmqEngine.CleanUp()
    '        Catch ex As Exception
    '            'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
    '            T5Error.LogError("VB", ex.ToString)
    '        End Try
    '    End Try
    'End Sub

    Public Shared Sub NotifyFriendsOfNewBalanceForThisGame(ByVal fixtureID As Integer, ByVal fbuserid As String, ByVal newBalance As Integer)
        Dim thisAmqEngine As New AMQEngine
        Try
            Dim US As String = Chr(31)
            Dim RS As String = Chr(30)

            If thisAmqEngine.SetUp() Then
                'We start the string with a 4 - this indicates the message is for a users new balance
                Dim UserDetails As String = "4;" & newBalance
                Dim Message = "FixtureID" & fixtureID & RS & "UserID" & US & fbuserid & RS & "UBD" & US & UserDetails
                thisAmqEngine.SendMessage(Message)
            End If
        Catch ex As Exception
            'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            Try
                thisAmqEngine.CleanUp()
            Catch ex As Exception
                'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
                T5Error.LogError("VB", ex.ToString)
            End Try
        End Try
    End Sub

    'Old way - removed Stephen 24-Apr- this way sends far too many characters
    'Public Shared Sub NotifyFriendsOfNewBalanceForThisGame(ByVal fixtureID As Integer, ByVal fbuserid As String, ByVal newBalance As Integer)
    '    Dim thisAmqEngine As New AMQEngine
    '    Try
    '        Dim US As String = Chr(31)
    '        Dim RS As String = Chr(30)

    '        If thisAmqEngine.SetUp() Then
    '            Dim UserDetails As String = "User Balance Update;" & newBalance
    '            Dim Message = "FixtureID" & fixtureID & RS & "UserID" & US & fbuserid & RS & "UBD" & US & UserDetails & RS & "Timestamp" & US & Date.Now.Ticks
    '            thisAmqEngine.SendMessage(Message)
    '        End If
    '    Catch ex As Exception
    '        'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
    '        T5Error.LogError("VB", ex.ToString)
    '    Finally
    '        Try
    '            thisAmqEngine.CleanUp()
    '        Catch ex As Exception
    '            'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
    '            T5Error.LogError("VB", ex.ToString)
    '        End Try
    '    End Try
    'End Sub

    'this function is not used - instead we just send the users new balance
    Public Shared Sub NotifyFriendsOfPreGameBetDetail(ByVal thisBet As FixtureBet)
        Dim thisAmqEngine As New AMQEngine
        Try
            Dim US As String = Chr(31)
            Dim RS As String = Chr(30)

            If thisAmqEngine.SetUp() Then
                Dim amountToSend As Integer
                Dim won As Integer = 0
                Dim selectedOptionId As Integer = 0
                For Each betOption As FixtureBetOption In thisBet.o
                    If betOption.soid > 0 Then
                        selectedOptionId = betOption.soid
                        If thisBet.bs = 1 Then
                            won = 1
                            amountToSend = betOption.w
                        Else
                            amountToSend = betOption.a
                        End If
                    End If
                Next
                If selectedOptionId > 0 Then
                    Dim UserDetails As String = "PreGameBet Update:" & thisBet.f & ":" & amountToSend & ":" & won & ":" & selectedOptionId
                    Dim Message = "FixtureID" & thisBet.f & RS & "UserID" & US & thisBet.fbu & RS & "UBD" & US & UserDetails & RS & "Timestamp" & US & Date.Now.Ticks
                    thisAmqEngine.SendMessage(Message)
                End If
            End If
        Catch ex As Exception
            'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            Try
                thisAmqEngine.CleanUp()
            Catch ex As Exception
                'Logger.LogError("NotifyFriendsOfBetPlaced", ex)
                T5Error.LogError("VB", ex.ToString)
            End Try
        End Try
    End Sub


    Public Sub SendMessage(ByVal Message As String)
        Using producer As IMessageProducer = session.CreateProducer(destination)
            producer.RequestTimeout = receiveTimeout
            Dim request As ITextMessage = session.CreateTextMessage(Message)
            producer.Send(request)
        End Using
    End Sub


    '''''''''''''''''''''''''''''''''''''''''''''Start LightStreamer Set up stuff'''''''''''''''''''''''''''''''''''''''''''''''
    'we run this function when we are using Lightstreamer
    Public Function SetUp() As Boolean
        Try
            connectURI = New Uri(ConfigurationManager.AppSettings("LSTCPURL"))
            factory = New NMSConnectionFactory(connectURI)
            connection = factory.CreateConnection()
            session = connection.CreateSession()
            destination = SessionUtil.GetDestination(session, "queue://LiveGamesAdmin")
            connection.Start()
        Catch ex As Exception
            'Logger.LogError("AMQEngine_SetUP", ex)
            T5Error.LogError("VB", ex.ToString)
            Return False
        End Try
        Return True
    End Function

    'we run this function when we are using Lightstreamer
    Public Function CleanUp() As Boolean
        Try
            session.Close()
        Catch ex As Exception
            Return False
        End Try
        Try
            session.Dispose()
        Catch ex As Exception
        End Try
        Try
            connection.Stop()
        Catch ex As Exception
        End Try
        Try
            connection.Close()
        Catch ex As Exception
        End Try
        Try
            connection.Dispose()
        Catch ex As Exception
        End Try
        Return True
    End Function
    '''''''''''''''''''''''''''''''''''''''''''''End LightStreamer Set up stuff'''''''''''''''''''''''''''''''''''''''''''''''

    ''''''''''''''''''''''''''''''''''''''''''''''''Start Signalr set up stuff''''''''''''''''''''''''''''''''''''''''''''''''
    'we run this function when we are using SignalR - it just returns true!!!
    'Public Function SetUp() As Boolean
    '    Return True
    'End Function

    'Public Function CleanUp() As Boolean
    '    Return True
    'End Function
    ''''''''''''''''''''''''''''''''''''''''''''''''End Signalr set up stuff''''''''''''''''''''''''''''''''''''''''''''''''

End Class