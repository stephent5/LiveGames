Imports MySql.Data.MySqlClient
Imports System.Security.Cryptography
Imports System.Reflection

Public Class Fixture

    Public Property fixtureid As Integer
    Public Property fixture As String
    Public Property starttime As String
    Public Property secondhalfstarttime As Date
    Public Property hometeam As String
    Public Property awayteam As String
    Public Property venue As String
    Public Property inplay As Boolean = False 'If true then the game has started and the user can play the game!!!!!

    'Public Property events As New ArrayList() 'Changed this Stephen 7-Nov-11
    Public Property events As New System.Collections.Generic.List(Of GameEvent) 'Changed this Stephen 7-Nov-11

    Public Property activebet As Bet
    Public Property homescore As Integer = -1
    Public Property awayscore As Integer = -1
    Public Property eventodds As System.Collections.Generic.List(Of Odds)
    Public Property justjoinedgame As Integer
    Public Property remainingforfeits As Integer
    Public Property unlockcredits As Integer

    Public Property hometeamcolour As String ' = "red"
    Public Property awayteamcolour As String ' = "blue"
    Public Property firsthalfleftteam As String
    Public Property currenthalf As Integer
    Public Property fixturename As String

    'Added these 15-Dec-11
    Public Property numfreesfirsthalf As Integer
    Public Property numfreessecondhalf As Integer
    Public Property numthrowsfirsthalf As Integer
    Public Property numthrowssecondhalf As Integer

    Public Property friendbets As New System.Collections.Generic.List(Of Bet)

    Public Property thisfixturesbetdetails As New System.Collections.Generic.List(Of FixtureBet)

    'Added by Gamal 13/03/2012: An integer that shows if a user is in power play or not
    Public Property inPowerPlay As Integer = -1

    'Added by Gamal 14/03/2012: Number of seconds remaining in power play.
    Public Property remainingPowerPlaySecs As Integer
    Public Property remainingpowerplays As Integer 'added this Stephen 13-Aug - a user can now have multiple powerplays during a game

    'Stephen added these 23-Mar-12 - Use these varibales to determine of the user can bet up to 200 - also to increment the bet counter
    Public Property numbetsplaced As Integer
    Public Property numbetstounlockhigherlevel As Integer

    'Added by Gamal 29/03/2012: One click bet value
    Public Property oneClickBetValue As Integer = 0

    Public Property voidOffset As Integer

    Public Property credits As Integer = 0 'added by Stephen 25-Apr-12 - we now get the users credits from the GetfixtureDetails function

    Public Property defaultleagueid As Integer 'added Stephen 10-july-12
    Public Property defaultleaguecreator As Integer 'added Stephen 10-july-12
    Public Property defaultleaguename As String 'added Stephen 10-july-12
    Public Property defaultleaguenummembers As String 'added Stephen 10-july-12

    Public Property live As Integer = 1 'added Stephen 10-july-12

    Public Property homecrest As String = 1 'added Stephen 25-july-12
    Public Property awaycrest As String = 1 'added Stephen 25-july-12

    Public Property sound As Integer = 1 ' this tells us whether the user wants to turn off or on the sounds

    Public Property fc As String  '= fixturecrest
    Public Property fd As String '= fixturedescription

    Public Property tmp As Integer = -1 'tmp = too many players
    Public Property lg As Integer = 0 'livegame
    Public Property tsftbu As String 'tsfulltimebackup
    Public Property et As String 'endtime
    Public Property hp As Integer 'homepageFixture
    Public Property ko As String 'kick-off time
    Public Property sp As Integer = 0 'sp= seperatePushers - if set to 1 this will mean we will use a seperate push connection for the friends and the admin pushing 
    Public Property ap As String ' ap = AdminPusherURL - the url we will use to get the push messages from the administrator
    Public Property fp As String ' fp = FriendPusherURL - the url we will use to get the push messages from friends
    Public Property a As Integer = 0 'a = archived
    Public Property v As Integer = 1 'v = valid user - this will always be 1 unless a user tries to get the fixture details with an invalid facebookuserid - this will happen only if 1 - a hack - 2 they logged in with email and then on another browser logged in with facebook - this will overwrite their fbuserid in db - in either case - prompt javascript to log the user OUT!!!!

    Public Property al As Integer

    Public Sub New()

    End Sub

    'This function is a copy of GetFixtureDetails - the difference is that this fucntion returns the details of the latest game created as opposed to the game requested by the fixtureID
    Public Shared Function GetLatestFixtureDetails() As Fixture
        Dim thisFixturesDetails As New Fixture

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_GetLatestFixtureDetails"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader.GetString("fixtureid"), thisFixturesDetails.fixtureid)
            End If

            reader.NextResult()
            If reader.Read() Then
                Try
                    Dim betID As Integer
                    Integer.TryParse(reader.GetString("betID"), betID)

                    If betID > 0 Then
                        'This user DOES have an active bet!!!!
                        'Get these details
                        thisFixturesDetails.activebet = New Bet
                        thisFixturesDetails.activebet.betid = betID

                        thisFixturesDetails.activebet.betdescription = reader.GetString("BetDescription")
                        thisFixturesDetails.activebet.eventdesc = reader.GetString("event") 'Added this Stephen 30-jan-11 
                        Integer.TryParse(reader.GetString("BetStatusId"), thisFixturesDetails.activebet.status)
                        Integer.TryParse(reader.GetString("amount"), thisFixturesDetails.activebet.amount)
                        Integer.TryParse(reader.GetString("fixtureId"), thisFixturesDetails.activebet.fixtureid)
                        Integer.TryParse(reader.GetString("eventId"), thisFixturesDetails.activebet.eventid)
                        Integer.TryParse(reader.GetString("UserID"), thisFixturesDetails.activebet.userid)
                        Decimal.TryParse(reader.GetString("odds"), thisFixturesDetails.activebet.odds)

                        Dim tempDate As Date = reader.GetMySqlDateTime("eventtime")
                        'thisFixturesDetails.activebet.eventtime = tempDate.ToString("yyyy-MM-dd HH:mm:ss") + ".0"
                        thisFixturesDetails.activebet.eventtime = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari



                        reader.NextResult()

                        If reader.Read() Then
                            'Now check if the bet has completed 
                            Dim tempStatuscheck As Integer
                            Integer.TryParse(reader.GetString("betStatus"), tempStatuscheck)

                            If tempStatuscheck = -101 Then
                                'Bet has either not been comleted yet (i.e. we are still wating for an event after the users bet)
                                'or the bet has already been checked ( and the details already returned)
                                'Either way .... if we get here we should ignore all details returned and we should NOt update anything!!!
                            ElseIf tempStatuscheck = 1 Then
                                thisFixturesDetails.activebet.status = 1  'Bet has been won!!!!

                                thisFixturesDetails.activebet.betresult = reader.GetString("betResult")
                                Integer.TryParse(reader.GetString("winnings"), thisFixturesDetails.activebet.creditsearned)
                                Integer.TryParse(reader.GetString("newcredits"), thisFixturesDetails.activebet.newcredits)
                                thisFixturesDetails.activebet.betcomplete = True
                            ElseIf tempStatuscheck = -1 Then
                                thisFixturesDetails.activebet.status = -1  'Bet has been lost!!!!
                                thisFixturesDetails.activebet.betresult = reader.GetString("betResult")
                                thisFixturesDetails.activebet.betcomplete = True
                            End If
                        End If
                    End If

                    'Next..Get all the event details 
                    reader.NextResult()
                    While reader.Read()
                        'changed this loop to now use gameevent object - 7-Nov-11
                        Dim tempEvent As New GameEvent
                        tempEvent.d = reader.GetString("GameFeedEvent") 'description

                        'Integer.TryParse(reader.GetString("EventID"), tempEvent.u) 'eventupdateid
                        tempEvent.u = reader.GetString("EventID")

                        Integer.TryParse(reader.GetString("EID"), tempEvent.e) '//added stephen 24-Feb-12 'tempEvent.eventid
                        Integer.TryParse(reader.GetString("CurrentHalf"), tempEvent.c) '//added stephen 24-Feb-12
                        thisFixturesDetails.events.Add(tempEvent)
                    End While

                    'Next..Get scores
                    reader.NextResult()
                    If reader.Read() Then
                        Integer.TryParse(reader.GetString("homescore"), thisFixturesDetails.homescore)
                        Integer.TryParse(reader.GetString("awayscore"), thisFixturesDetails.awayscore)

                        thisFixturesDetails.hometeam = reader.GetString("hometeam")
                        thisFixturesDetails.awayteam = reader.GetString("awayteam")

                        thisFixturesDetails.hometeamcolour = reader.GetString("HomeTeamColour")
                        thisFixturesDetails.awayteamcolour = reader.GetString("AwayTeamColour")
                        thisFixturesDetails.firsthalfleftteam = reader.GetString("FirstHalfLeftTeam")

                        thisFixturesDetails.fixturename = reader.GetString("fixtureName")

                        Integer.TryParse(reader.GetString("currenthalf"), thisFixturesDetails.currenthalf)

                        Integer.TryParse(reader.GetString("numFreesFirstHalf"), thisFixturesDetails.numfreesfirsthalf)
                        Integer.TryParse(reader.GetString("numFreesSecondHalf"), thisFixturesDetails.numfreessecondhalf)

                        Try
                            Dim tempDate As Date = reader.GetMySqlDateTime("TSKickOffTime")
                            thisFixturesDetails.starttime = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari
                        Catch ex As Exception
                        End Try


                        Integer.TryParse(reader.GetString("_SeperatePushers"), thisFixturesDetails.sp)
                        thisFixturesDetails.ap = reader.GetString("AdminPushURL")  'Added Stephen 14-Jun-12
                        thisFixturesDetails.fp = reader.GetString("FriendPushURL")  'Added Stephen 14-Jun-12

                    End If

                    thisFixturesDetails.eventodds = New System.Collections.Generic.List(Of Odds)()
                    reader.NextResult()
                    While reader.Read
                        Dim thisEventsOdds As New Odds
                        Integer.TryParse(reader.GetString("EventId"), thisEventsOdds.e) 'eventid
                        Decimal.TryParse(reader.GetString("Odds"), thisEventsOdds.o) 'odds
                        thisFixturesDetails.eventodds.Add(thisEventsOdds)
                    End While

                    'Now check if the user has just joined the game for the first time
                    reader.NextResult()
                    If reader.Read() Then
                        Integer.TryParse(reader.GetString("JustJoinedGame"), thisFixturesDetails.justjoinedgame)
                    End If

                    'Now get how many forfeits the user has left
                    reader.NextResult()
                    If reader.Read() Then
                        Integer.TryParse(reader.GetString("RemainingForfeits"), thisFixturesDetails.remainingforfeits)
                        Integer.TryParse(reader.GetString("unlockcredits"), thisFixturesDetails.unlockcredits)
                    End If

                    'Now read in the list of all pregame bets related to this fixture 
                    Dim previousBetId As Integer = -1
                    Dim thisFixtureBet As New FixtureBet
                    reader.NextResult()
                    While reader.Read
                        Dim currentBetId As Integer = -1
                        Integer.TryParse(reader.GetString("FBID"), currentBetId)

                        If Not previousBetId = currentBetId Then
                            'This is a new bet detail

                            If previousBetId > 0 Then
                                thisFixturesDetails.thisfixturesbetdetails.Add(thisFixtureBet) 'Add the previous Bet detail to the array
                                thisFixtureBet = New FixtureBet 'reset our bet object
                            End If

                            thisFixtureBet.f = thisFixturesDetails.fixtureid
                            thisFixtureBet.u = -1
                            thisFixtureBet.fbid = currentBetId
                            thisFixtureBet.fbu = reader.GetString("FB_UserID")

                            thisFixtureBet.d = reader.GetString("DisplayDescription")
                            Boolean.TryParse(reader.GetBoolean("PreGame"), thisFixtureBet.pg)

                            Dim tempKickOffTime As String
                            Dim tempHalfTime As String
                            tempKickOffTime = reader.GetString("TSACtualKickOff")
                            tempHalfTime = reader.GetString("TSSecondHalf")

                            If thisFixtureBet.pg AndAlso Not String.IsNullOrWhiteSpace(tempKickOffTime) Then
                                'this bet is a pregame bet and the game has started 
                                'so...the user can not bet on this game!!!!!
                                thisFixtureBet.open = False
                            Else
                                thisFixtureBet.open = True
                            End If

                            previousBetId = thisFixtureBet.fbid 'point to the new one
                        End If

                        'Do the options 
                        Dim thisFixtureBetOption As New FixtureBetOption
                        Integer.TryParse(reader.GetString("OptionID"), thisFixtureBetOption.oid)
                        Integer.TryParse(reader.GetString("SelectedOptionID"), thisFixtureBetOption.soid)
                        thisFixtureBetOption.d = reader.GetString("BetOption")
                        Decimal.TryParse(reader.GetString("odds"), thisFixtureBetOption.o)
                        Decimal.TryParse(reader.GetString("UsersOdds"), thisFixtureBetOption.uo)

                        Integer.TryParse(reader.GetString("amount"), thisFixtureBetOption.a)
                        Dim tempWinnings As Decimal
                        Decimal.TryParse(reader.GetString("winnings"), tempWinnings)
                        thisFixtureBetOption.w = tempWinnings
                        Integer.TryParse(reader.GetString("status"), thisFixtureBetOption.s)

                        Dim tempBetID As Integer
                        Integer.TryParse(reader.GetString("FBOUID"), tempBetID)
                        If tempBetID > 0 Then
                            'this is the bet option that we have bet on 
                            'so this is the status for this bet that is relevant
                            thisFixtureBet.bm = True
                            thisFixtureBet.bs = thisFixtureBetOption.s
                        End If

                        'thisFixtureBetOption.userid = UserID
                        thisFixtureBet.o.Add(thisFixtureBetOption) 'Add this option to the thisFixtureBet

                    End While
                    If previousBetId > 0 Then
                        thisFixturesDetails.thisfixturesbetdetails.Add(thisFixtureBet)
                    End If

                    If thisFixturesDetails.thisfixturesbetdetails.Count > 0 Then 'we have returned some details
                        'Now return friendsleaderboard
                        Dim i As Integer = 1
                        reader.NextResult()
                        While reader.Read()
                            Dim leaderboarditem As New FriendsLeaderboard()

                            leaderboarditem.P = i
                            leaderboarditem.U = reader("name")
                            Integer.TryParse(reader("Credits"), leaderboarditem.S)
                            leaderboarditem.F = reader("FB_UserID")

                            'leaderboarditem.I = reader("userid")


                            ' If UserID = leaderboarditem.I Then
                            'leaderboarditem.C = 1
                            'End If

                            Dim ActiveBetID As Integer
                            Integer.TryParse(reader("betid"), ActiveBetID)
                            If ActiveBetID > 0 Then
                                Dim currentBet As New Bet
                                currentBet.betid = ActiveBetID

                                Integer.TryParse(reader("amount"), currentBet.amount)
                                leaderboarditem.B = currentBet

                                'don't do line below - show credits as is in DB - 
                                'leaderboarditem.S = leaderboarditem.S + currentBet.amount 'if the user has a bet made - then show theur credits as if they hadn't placed bet

                                'Button DO set property to tell us we need to add the winnings
                                leaderboarditem.B.addamount = 1
                            End If

                            'thisFixturesDetails.thisfixturesbetdetails.Item(0).friendsleaderboardlist.Add(leaderboarditem)
                            i = i + 1
                        End While

                        'get LeagueId
                        reader.NextResult()
                        If reader.Read Then
                            Integer.TryParse(reader("LeagueID"), thisFixturesDetails.thisfixturesbetdetails.Item(0).l)
                        End If

                        i = 1
                        Dim currentUserInList As Boolean = False
                        'Now return overallleaderboard
                        reader.NextResult()
                        While reader.Read()
                            Dim leaderboarditem As New Leaderboard()

                            leaderboarditem.P = i
                            leaderboarditem.U = reader("name")
                            Integer.TryParse(reader("Credits"), leaderboarditem.S)
                            'If reader("CurrentUser") = "1" Then
                            '    leaderboarditem.C = 1
                            'Else
                            '    leaderboarditem.C = 0
                            'End If
                            'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.C)
                            leaderboarditem.F = reader("FB_UserID")

                            'leaderboarditem.I = reader("userid")

                            'Added this Stephen 1-Dec
                            Dim tempDate As Date = reader.GetMySqlDateTime("TimeStamp")
                            If i = 1 Then
                                'Only add the timestamp for the FIRST Item - it is the same for all items and only referenced from the first item in the list
                                leaderboarditem.T = tempDate.ToString("MM/dd/yyyy HH:mm:ss")
                            End If



                            'If UserID = leaderboarditem.I Then
                            'currentUserInList = True
                            'thisFixturesDetails.thisfixturesbetdetails.Item(0).userscreditsforthisgame = leaderboarditem.S
                            'End If
                            'thisFixturesDetails.thisfixturesbetdetails.Item(0).leagueleaderboardlist.Add(leaderboarditem)
                            i = i + 1
                        End While

                        'No Longer need this - Stephen 17-Apr - it's pointless in this scenario
                        'If currentUserInList = False Then
                        '    reader.NextResult()
                        '    While reader.Read()
                        '        Dim leaderboarditem As New Leaderboard()

                        '        leaderboarditem.P = reader("position")
                        '        leaderboarditem.U = reader("name")
                        '        Integer.TryParse(reader("Credits"), leaderboarditem.S)
                        '        'If reader("CurrentUser") = "1" Then
                        '        '    leaderboarditem.C = 1
                        '        'Else
                        '        '    leaderboarditem.C = 0
                        '        'End If
                        '        'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.C)
                        '        leaderboarditem.F = reader("FB_UserID")
                        '        leaderboarditem.I = reader("userid")
                        '        'If UserID = leaderboarditem.I Then
                        '        'currentUserInList = True
                        '        'End If
                        '        thisFixturesDetails.thisfixturesbetdetails.Item(0).userscreditsforthisgame = leaderboarditem.S
                        '        thisFixturesDetails.thisfixturesbetdetails.Item(0).leagueleaderboardlist.Add(leaderboarditem)
                        '    End While
                        'End If
                        'end of overallleaderboard
                    End If

                Catch ex As Exception
                End Try
            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return thisFixturesDetails
    End Function

    ' Added by Gamal 02/04/2012: Edit Nick Name for that user and make sure that user haven't already edited his nickname for that fixture
    Shared Function EditNickName(ByVal fixtureID As Integer, ByVal userID As Integer, ByVal facebookUserID As String, ByVal nickName As String) As Integer
        Dim result As Integer = 0
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_EditNickName"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_userID", userID)
            cmd.Parameters.AddWithValue("_nickName", nickName)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader.GetInt16("result"), result)
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
        Return result

    End Function

    Shared Function ConfirmEmail(ByVal userid As String, ByVal hash As String) As User
        Dim thisUser As New User
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Dim tempsessionGUID As String = System.Guid.NewGuid().ToString()
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_ConfirmEmail"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userid", userid)
            cmd.Parameters.AddWithValue("_hash", hash)
            'cmd.Parameters.AddWithValue("_sessionGUID", tempsessionGUID)

            reader = cmd.ExecuteReader()
            If reader.Read() Then
                Integer.TryParse(reader.GetString("userid"), thisUser.id)

                If thisUser.id > 0 Then
                    'thisUser.sg = tempsessionGUID
                    thisUser.level = reader.GetString("level")

                    'user logged in 
                    'we no longer validate normal users connections ( we are only going to validate the admin!!!)
                    'so we dont want to access DynamoDB session too often ( especially if its not neccessary!!)
                    'HttpContext.Current.Session.Add("id", thisUser.id)

                    If thisUser.level = "trust5" Then
                        'this user IS the admin
                        HttpContext.Current.Session.Add("level", thisUser.level)
                    End If

                    Integer.TryParse(reader.GetString("timezone"), thisUser.timezone)
                    Integer.TryParse(reader.GetString("verified"), thisUser.verified)

                    thisUser.name = reader.GetString("firstname") & " " & reader.GetString("lastname")
                    thisUser.nn = reader.GetString("nickname")
                    thisUser.fbuserid = reader.GetString("fb_userid")
                    thisUser.firstname = reader.GetString("firstname")
                    thisUser.lastname = reader.GetString("lastname")
                    thisUser.link = reader.GetString("link")
                    thisUser.locale = reader.GetString("locale")
                    thisUser.gender = reader.GetString("gender")
                    thisUser.birthday = reader.GetString("birthday")
                    thisUser.email = reader.GetString("email")
                    thisUser.timezone = reader.GetString("timezone")
                    thisUser.verified = reader.GetString("verified")
                    thisUser.profilepic = reader.GetString("profilepic")
                End If
            End If

        Catch ex As Exception
            thisUser.id = -1
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
        Return thisUser
    End Function

    Shared Function EmailSignIn(ByVal email As String, ByVal password As String, ByVal RememberMe As Integer, ByVal RememberMeGUID As String) As User
        Dim thisUser As New User
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_EmailSignIn"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure

            If String.IsNullOrEmpty(email) Then
                cmd.Parameters.AddWithValue("_email", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_email", email)
            End If

            If String.IsNullOrEmpty(password) Then
                cmd.Parameters.AddWithValue("_password", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_password", password)
            End If

            If RememberMe > 0 Then
                cmd.Parameters.AddWithValue("_RememberMeGUIDToSet", System.Guid.NewGuid().ToString())
            Else
                cmd.Parameters.AddWithValue("_RememberMeGUIDToSet", DBNull.Value)
            End If

            If Not String.IsNullOrEmpty(RememberMeGUID) Then
                cmd.Parameters.AddWithValue("_RememberMeGUIDToLogInWith", RememberMeGUID)
            Else
                cmd.Parameters.AddWithValue("_RememberMeGUIDToLogInWith", DBNull.Value)
            End If

            reader = cmd.ExecuteReader()
            If reader.Read() Then
                Integer.TryParse(reader.GetString("userid"), thisUser.id)

                If thisUser.id > 0 Then
                    thisUser.level = reader.GetString("level")
                    thisUser.rm = reader.GetString("RememberMe")

                    'user logged in 
                    'we no longer validate normal users connections ( we are only going to validate the admin!!!)
                    'so we dont want to access DynamoDB session too often ( especially if its not neccessary!!)
                    'HttpContext.Current.Session.Add("id", thisUser.id)

                    If thisUser.level = "trust5" Then
                        'this user IS the admin
                        HttpContext.Current.Session.Add("level", thisUser.level)
                    End If

                    Integer.TryParse(reader.GetString("timezone"), thisUser.timezone)
                    Integer.TryParse(reader.GetString("verified"), thisUser.verified)

                    thisUser.name = reader.GetString("firstname") & " " & reader.GetString("lastname")
                    thisUser.nn = reader.GetString("nickname")
                    thisUser.fbuserid = reader.GetString("fb_userid")
                    thisUser.firstname = reader.GetString("firstname")
                    thisUser.lastname = reader.GetString("lastname")
                    thisUser.link = reader.GetString("link")
                    thisUser.locale = reader.GetString("locale")
                    thisUser.gender = reader.GetString("gender")
                    thisUser.birthday = reader.GetString("birthday")
                    thisUser.email = reader.GetString("email")
                    thisUser.timezone = reader.GetString("timezone")
                    thisUser.verified = reader.GetString("verified")
                    thisUser.profilepic = reader.GetString("profilepic")
                End If
            End If

        Catch ex As Exception
            thisUser.id = -102
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
        Return thisUser
    End Function


    Shared Function RegisterEmail(ByVal email As String, ByVal password As String, ByVal userName As String) As RegisterResult
        Dim result As New RegisterResult
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_RegisterUser"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_email", email)
            cmd.Parameters.AddWithValue("_password", password)
            cmd.Parameters.AddWithValue("_username", userName)

            reader = cmd.ExecuteReader()
            If reader.Read() Then
                Integer.TryParse(reader.GetString("ResultID"), result.ResultID)
                Integer.TryParse(reader.GetString("UserID"), result.UserID)
                result.EmailConfirmationURL = reader.GetString("emailConfirmationURL")
            End If
        Catch ex As Exception
            result.ResultID = -1
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
        Return result
    End Function

    Shared Function GetPasswordLinkedToEmail(ByVal email As String) As String
        Dim password As String
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString

            conn.Open()
            Dim query As String = "USP_GetPassword"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_email", email)

            reader = cmd.ExecuteReader()
            If reader.Read() Then
                password = reader.GetString("password")
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
        Return password
    End Function

    Shared Function UpdateDBWithHash(ByVal hash As String, ByVal userid As Integer) As String
        Dim DBHash As String = ""
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_UpdateUserRegistrationHASH"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userid", userid)
            cmd.Parameters.AddWithValue("_hash", hash)

            reader = cmd.ExecuteReader()
            If reader.Read() Then
                DBHash = reader.GetString("ConfirmationHash")
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
        Return DBHash
    End Function


    'return homepage game
    Shared Function GetHomePageFixture(ByVal GameID As Integer) As Fixture
        Dim HomePageFixture As New Fixture
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString

            conn.Open()
            Dim query As String = "USP_GetHomePageFixtureDetails"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_GameID", GameID)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader.GetInt16("ID"), HomePageFixture.fixtureid)

                HomePageFixture.hometeam = reader.GetString("hometeam")
                HomePageFixture.awayteam = reader.GetString("awayteam")

                HomePageFixture.fc = reader.GetString("fixturecrest")
                HomePageFixture.fd = reader.GetString("fixturedescription")

                HomePageFixture.homecrest = reader.GetString("homecrest")
                HomePageFixture.awaycrest = reader.GetString("awaycrest")

                Dim tempDate As Date = reader.GetMySqlDateTime("TSKickOff")
                HomePageFixture.starttime = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari

                Integer.TryParse(reader.GetInt16("seperatePushers"), HomePageFixture.sp)
                HomePageFixture.ap = reader.GetString("adminPushURL")
                HomePageFixture.fp = reader.GetString("friendPushURL")

                Integer.TryParse(reader.GetInt16("AllowLogin"), HomePageFixture.al) 'Added stephen 9-Aug-13 

                'Integer.TryParse(reader.GetInt16("TooManyPlayers"), HomePageFixture.tmp)
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
        Return HomePageFixture
    End Function

    'set pregame Ticker Details2
    Shared Function SetTickerText(ByVal fixtureID As Integer, ByVal userID As Integer, ByVal facebookuserid As String, ByVal tickerText As String, ByVal matchposition As Integer) As String
        Dim updated As Integer = -1
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_SetFixtureTickerText"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_userID", userID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookuserid)
            cmd.Parameters.AddWithValue("_tickerText", tickerText)
            cmd.Parameters.AddWithValue("_matchposition", matchposition)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                updated = reader.GetString("updated")
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
        Return updated
    End Function

    Shared Function GetTickerText(ByVal fixtureID As Integer, ByVal userID As Integer, ByVal facebookuserid As String) As String
        Dim TickerText As String = ""
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString

            conn.Open()
            Dim query As String = "USP_GetFixtureTickerText"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_userID", userID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookuserid)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                TickerText = reader.GetString("TickerText")
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
        Return TickerText
    End Function

    'this function is a proxy method we are using to call the AysncMethod from an external class
    Shared Sub BackUpToDisk()
        'this sub calls the Aysnc method - this is a way of running a method asyncronously - BUT we dont care when it's finished runing!!!!!
        Dim AsyncCaller As New BackupLeagueMemoryTableAfterEachEvent_AsyncMethodCaller(AddressOf BackupLeagueMemoryTableAfterEachEvent)
        Dim result As IAsyncResult = AsyncCaller.BeginInvoke(Nothing, Nothing)
    End Sub

    ' The delegate must have the same signature as the method  it will call asynchronously i.e - BackupLeagueMemoryTableAfterEachEvent
    Public Delegate Sub BackupLeagueMemoryTableAfterEachEvent_AsyncMethodCaller()

    'Added this function Stephen 2-July-2012
    'this function is called by the LiveEventing function LogEvent
    'it is called after every event
    'it backs up all the league table data in the memory table to disk
    'in tests it tookt about 12 seconds to back up 600,000 rows 



    Shared Sub BackupLeagueMemoryTableAfterEachEvent()
        Dim result As Integer = -1
        Dim connResponse As New MySqlConnection
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_Backup_LeagueMemoryTableAfterEachEvent"
            cmd = New MySqlCommand(query, conn)
            cmd.Parameters.AddWithValue("backupDone_", 0)
            cmd.Parameters.AddWithValue("_returnDetails", 0)
            cmd.Parameters.AddWithValue("_DoBackupRegardlessOfIfMemoryTables", 0) 'if this game is a disk game then we dont need to backup after every event
            cmd.CommandType = CommandType.StoredProcedure
            cmd.CommandTimeout = 300 '300 = 5 minutes 
            cmd.ExecuteNonQuery()
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
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

    Shared Function GetSystemMemoryDiskStatus(ByVal gameid As Integer) As String
        Dim status As String = ""
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_GetSystemMemoryDiskStatus"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_gameid", gameid)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                status = reader.GetString("MemoryDiskstatus")
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
        Return status
    End Function

    Shared Function SetSystemMemoryDiskStatus(ByVal userID As Integer, ByVal facebookUserID As String, ByVal gameid As Integer, ByVal newStatus As String) As Integer
        Dim status As Integer
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_ChangeMemoryDiskSetUp"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_gameid", gameid)
            cmd.Parameters.AddWithValue("_userID", userID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)
            cmd.Parameters.AddWithValue("_newStatus", newStatus)

            cmd.CommandTimeout = 600 ' 600 = 10 minutes

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader.GetString("RC"), status)
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
        Return status
    End Function



    Shared Function CheckGameLimits(ByVal fixtureID As Integer, ByVal userID As Integer, ByVal facebookuserid As String) As Integer
        Dim limitReached As Integer = -1
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString

            conn.Open()
            Dim query As String = "USP_FindOutIfGameHasReachedItsLimit"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_userID", userID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookuserid)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader.GetString("TooManyPlayers"), limitReached)
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
        Return limitReached
    End Function


    'Added by Gamal 29/03/2012
    Public Shared Function StoreOneClickCreditValue(ByVal fixtureID As Integer, ByVal userID As Integer, ByVal oneClickValue As Integer) As Integer
        Dim result As Integer = -1
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try


            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_StoreUserOneClickCredit"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_userID", userID)
            cmd.Parameters.AddWithValue("_oneClickValue", oneClickValue)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader.GetInt16("result"), result)
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
        Return result
    End Function

    Public Shared Function UpdatePassword(ByVal oldPassword As String, ByVal newPassword As String, ByVal UserID As Integer, ByVal facebookUserID As String) As Integer
        Dim Result As Integer
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            'Dim query As String = "USP_StartPowerPlay"
            Dim query As String = "USP_ChangePassword"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_oldPassword", oldPassword)
            cmd.Parameters.AddWithValue("_newPassword", newPassword)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                'Dim inPowerPlay As Integer
                Integer.TryParse(reader.GetInt16("result"), Result)
            End If

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return Result
    End Function


    Public Shared Function StartPowerPlay(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal facebookUserID As String) As Integer
        Dim Result As Integer
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            'Dim query As String = "USP_StartPowerPlay"
            Dim query As String = "USP_StartPowerPlay_v2"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                'Dim inPowerPlay As Integer
                Integer.TryParse(reader.GetInt16("powerPlayResult"), Result)

            End If

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return Result
    End Function


    'Created by Gamal 13/03/2012: A function to start power play and return true if successful or false otherwise. This function will return game details as well
    'Public Shared Function StartPowerPlay(ByVal fixtureID As Integer, ByVal UserID As Integer) As Fixture
    '    Dim thisFixturesDetails As New Fixture
    '    thisFixturesDetails.fixtureid = fixtureID
    '    Dim conn As New MySqlConnection
    '    conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
    '    Dim connResponse As New MySqlConnection
    '    Dim reader As MySqlDataReader
    '    Dim cmd As MySqlCommand
    '    Try
    '        conn.Open()
    '        'Dim query As String = "USP_StartPowerPlay"
    '        Dim query As String = "USP_StartPowerPlay_v2"
    '        cmd = New MySqlCommand(query, conn)
    '        cmd.CommandType = CommandType.StoredProcedure
    '        cmd.Parameters.AddWithValue("_userID", UserID)
    '        cmd.Parameters.AddWithValue("_fixtureID", fixtureID)

    '        reader = cmd.ExecuteReader()

    '        If reader.Read() Then
    '            'Dim inPowerPlay As Integer
    '            Integer.TryParse(reader.GetInt16("powerPlayResult"), thisFixturesDetails.inPowerPlay)
    '            If thisFixturesDetails.inPowerPlay >= 0 Then
    '                ' User managed to start power play or already in power play and fixture details are returned
    '                reader.NextResult()
    '                ' Do The same as in Get fixture Details
    '                If reader.Read() Then
    '                    Try
    '                        Dim betID As Integer
    '                        Integer.TryParse(reader.GetString("betID"), betID)

    '                        If betID > 0 Then
    '                            'This user DOES have an active bet!!!!
    '                            'Get these details
    '                            thisFixturesDetails.activebet = New Bet
    '                            thisFixturesDetails.activebet.betid = betID

    '                            thisFixturesDetails.activebet.betdescription = reader.GetString("BetDescription")
    '                            thisFixturesDetails.activebet.eventdesc = reader.GetString("event") 'Added this Stephen 30-jan-11 
    '                            Integer.TryParse(reader.GetString("BetStatusId"), thisFixturesDetails.activebet.status)
    '                            Integer.TryParse(reader.GetString("amount"), thisFixturesDetails.activebet.amount)
    '                            Integer.TryParse(reader.GetString("fixtureId"), thisFixturesDetails.activebet.fixtureid)
    '                            Integer.TryParse(reader.GetString("eventId"), thisFixturesDetails.activebet.eventid)
    '                            Integer.TryParse(reader.GetString("UserID"), thisFixturesDetails.activebet.userid)
    '                            Decimal.TryParse(reader.GetString("odds"), thisFixturesDetails.activebet.odds)

    '                            Dim tempDate As Date = reader.GetMySqlDateTime("eventtime")
    '                            'thisFixturesDetails.activebet.eventtime = tempDate.ToString("yyyy-MM-dd HH:mm:ss") + ".0"
    '                            thisFixturesDetails.activebet.eventtime = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari



    '                            reader.NextResult()

    '                            If reader.Read() Then
    '                                'Now check if the bet has completed 
    '                                Dim tempStatuscheck As Integer
    '                                Integer.TryParse(reader.GetString("betStatus"), tempStatuscheck)

    '                                If tempStatuscheck = -101 Then
    '                                    'Bet has either not been comleted yet (i.e. we are still wating for an event after the users bet)
    '                                    'or the bet has already been checked ( and the details already returned)
    '                                    'Either way .... if we get here we should ignore all details returned and we should NOt update anything!!!
    '                                ElseIf tempStatuscheck = 1 Then
    '                                    thisFixturesDetails.activebet.status = 1  'Bet has been won!!!!

    '                                    thisFixturesDetails.activebet.betresult = reader.GetString("betResult")
    '                                    Integer.TryParse(reader.GetString("winnings"), thisFixturesDetails.activebet.creditsearned)
    '                                    Integer.TryParse(reader.GetString("newcredits"), thisFixturesDetails.activebet.newcredits)
    '                                    thisFixturesDetails.activebet.betcomplete = True
    '                                ElseIf tempStatuscheck = -1 Then
    '                                    thisFixturesDetails.activebet.status = -1  'Bet has been lost!!!!
    '                                    thisFixturesDetails.activebet.betresult = reader.GetString("betResult")
    '                                    thisFixturesDetails.activebet.betcomplete = True
    '                                End If
    '                            End If
    '                        End If

    '                        'Next..Get all the event details 
    '                        reader.NextResult()
    '                        While reader.Read()
    '                            'changed this loop to now use gameevent object - 7-Nov-11
    '                            Dim tempEvent As New GameEvent
    '                            tempEvent.description = reader.GetString("GameFeedEvent")
    '                            Integer.TryParse(reader.GetString("EventID"), tempEvent.eventupdateid)
    '                            thisFixturesDetails.events.Add(tempEvent)
    '                            Integer.TryParse(reader.GetString("EID"), tempEvent.eventid) '//added stephen 24-Feb-12
    '                            Integer.TryParse(reader.GetString("CurrentHalf"), tempEvent.currenthalf) '//added stephen 24-Feb-12
    '                        End While

    '                        'Next..Get scores
    '                        reader.NextResult()
    '                        If reader.Read() Then
    '                            Integer.TryParse(reader.GetString("homescore"), thisFixturesDetails.homescore)
    '                            Integer.TryParse(reader.GetString("awayscore"), thisFixturesDetails.awayscore)

    '                            thisFixturesDetails.hometeam = reader.GetString("hometeam")
    '                            thisFixturesDetails.awayteam = reader.GetString("awayteam")

    '                            thisFixturesDetails.hometeamcolour = reader.GetString("HomeTeamColour")
    '                            thisFixturesDetails.awayteamcolour = reader.GetString("AwayTeamColour")
    '                            thisFixturesDetails.firsthalfleftteam = reader.GetString("FirstHalfLeftTeam")

    '                            thisFixturesDetails.fixturename = reader.GetString("fixtureName")

    '                            Integer.TryParse(reader.GetString("currenthalf"), thisFixturesDetails.currenthalf)

    '                            Integer.TryParse(reader.GetString("numFreesFirstHalf"), thisFixturesDetails.numfreesfirsthalf)
    '                            Integer.TryParse(reader.GetString("numFreesSecondHalf"), thisFixturesDetails.numfreessecondhalf)

    '                            'Added Stephen 23-MAR-12
    '                            Integer.TryParse(reader.GetString("NumBetsMade"), thisFixturesDetails.numbetsplaced)
    '                            Integer.TryParse(reader.GetString("NumBetsToUnlockHigherLevel"), thisFixturesDetails.numbetstounlockhigherlevel)

    '                            'Added Stephen 25-APR-12
    '                            Integer.TryParse(reader.GetString("OverallCredits"), thisFixturesDetails.credits)
    '                        End If

    '                        thisFixturesDetails.eventodds = New System.Collections.Generic.List(Of Odds)()
    '                        reader.NextResult()
    '                        While reader.Read
    '                            Dim thisEventsOdds As New Odds
    '                            Integer.TryParse(reader.GetString("EventId"), thisEventsOdds.eventid)
    '                            Decimal.TryParse(reader.GetString("Odds"), thisEventsOdds.odds)
    '                            thisFixturesDetails.eventodds.Add(thisEventsOdds)
    '                        End While

    '                        'Now check if the user has just joined the game for the first time
    '                        reader.NextResult()
    '                        If reader.Read() Then
    '                            Integer.TryParse(reader.GetString("JustJoinedGame"), thisFixturesDetails.justjoinedgame)
    '                        End If

    '                        'Now get how many forfeits the user has left
    '                        reader.NextResult()
    '                        If reader.Read() Then
    '                            Integer.TryParse(reader.GetString("RemainingForfeits"), thisFixturesDetails.remainingforfeits)
    '                            Integer.TryParse(reader.GetString("unlockcredits"), thisFixturesDetails.unlockcredits)

    '                            'Added by Gamal 14/03/2012: Number of seconds remaining
    '                            Integer.TryParse(reader.GetString("RemainingPowerPlay"), thisFixturesDetails.remainingPowerPlaySecs)

    '                            'Added by Stephen 13/08/2012: Number of seconds remaining
    '                            Integer.TryParse(reader.GetString("remainingpowerplays"), thisFixturesDetails.remainingpowerplays)

    '                            'Added by Gamal 29/03/2012: One Click Bet Value
    '                            Integer.TryParse(reader.GetString("OneClickBetValue"), thisFixturesDetails.oneClickBetValue)

    '                            'Added by Gamal 30/03/2012: Void Offset 
    '                            Integer.TryParse(reader.GetString("VoidOffset"), thisFixturesDetails.voidOffset)

    '                        End If

    '                        'Now read in the list of all pregame bets related to this fixture 
    '                        Dim previousBetId As Integer = -1
    '                        Dim thisFixtureBet As New FixtureBet
    '                        reader.NextResult()
    '                        While reader.Read
    '                            Dim currentBetId As Integer = -1
    '                            Integer.TryParse(reader.GetString("FBID"), currentBetId)

    '                            If Not previousBetId = currentBetId Then
    '                                'This is a new bet detail

    '                                If previousBetId > 0 Then
    '                                    thisFixturesDetails.thisfixturesbetdetails.Add(thisFixtureBet) 'Add the previous Bet detail to the array
    '                                    thisFixtureBet = New FixtureBet 'reset our bet object
    '                                End If

    '                                thisFixtureBet.fixtureid = fixtureID
    '                                thisFixtureBet.userid = UserID
    '                                thisFixtureBet.fbid = currentBetId
    '                                thisFixtureBet.fbuserid = reader.GetString("FB_UserID")

    '                                thisFixtureBet.description = reader.GetString("DisplayDescription")
    '                                Boolean.TryParse(reader.GetBoolean("PreGame"), thisFixtureBet.pregame)

    '                                Dim tempKickOffTime As String
    '                                Dim tempHalfTime As String
    '                                tempKickOffTime = reader.GetString("TSACtualKickOff")
    '                                tempHalfTime = reader.GetString("TSSecondHalf")

    '                                If thisFixtureBet.pregame AndAlso Not String.IsNullOrWhiteSpace(tempKickOffTime) Then
    '                                    'this bet is a pregame bet and the game has started 
    '                                    'so...the user can not bet on this game!!!!!
    '                                    thisFixtureBet.open = False
    '                                Else
    '                                    thisFixtureBet.open = True
    '                                End If

    '                                previousBetId = thisFixtureBet.fbid 'point to the new one
    '                            End If

    '                            'Do the options 
    '                            Dim thisFixtureBetOption As New FixtureBetOption
    '                            Integer.TryParse(reader.GetString("OptionID"), thisFixtureBetOption.optionid)
    '                            Integer.TryParse(reader.GetString("SelectedOptionID"), thisFixtureBetOption.soid)
    '                            thisFixtureBetOption.description = reader.GetString("BetOption")
    '                            Decimal.TryParse(reader.GetString("odds"), thisFixtureBetOption.odds)
    '                            Decimal.TryParse(reader.GetString("UsersOdds"), thisFixtureBetOption.uo)

    '                            Integer.TryParse(reader.GetString("amount"), thisFixtureBetOption.amount)
    '                            Dim tempWinnings As Decimal
    '                            Decimal.TryParse(reader.GetString("winnings"), tempWinnings)
    '                            thisFixtureBetOption.winnings = tempWinnings
    '                            Integer.TryParse(reader.GetString("status"), thisFixtureBetOption.status)

    '                            Dim tempBetID As Integer
    '                            Integer.TryParse(reader.GetString("FBOUID"), tempBetID)
    '                            If tempBetID > 0 Then
    '                                'this is the bet option that we have bet on 
    '                                'so this is the status for this bet that is relevant
    '                                thisFixtureBet.betmade = True
    '                                thisFixtureBet.betstatus = thisFixtureBetOption.status
    '                            End If

    '                            'thisFixtureBetOption.userid = UserID
    '                            thisFixtureBet.options.Add(thisFixtureBetOption) 'Add this option to the thisFixtureBet

    '                        End While
    '                        If previousBetId > 0 Then
    '                            thisFixturesDetails.thisfixturesbetdetails.Add(thisFixtureBet)
    '                        End If

    '                        If thisFixturesDetails.thisfixturesbetdetails.Count > 0 Then 'we have returned some details
    '                            'Now return friendsleaderboard
    '                            Dim i As Integer = 1
    '                            reader.NextResult()
    '                            While reader.Read()
    '                                Dim leaderboarditem As New FriendsLeaderboard()

    '                                leaderboarditem.P = i
    '                                leaderboarditem.U = reader("name")
    '                                Integer.TryParse(reader("Credits"), leaderboarditem.S)
    '                                leaderboarditem.F = reader("FB_UserID")

    '                                'Dim tempUserID As Integer = reader("userid")
    '                                'If UserID = tempUserID Then
    '                                '    leaderboarditem.C = 1
    '                                'Else
    '                                '    leaderboarditem.C = 0
    '                                'End If

    '                                Dim ActiveBetID As Integer
    '                                Integer.TryParse(reader("betid"), ActiveBetID)
    '                                If ActiveBetID > 0 Then
    '                                    Dim currentBet As New Bet
    '                                    currentBet.betid = ActiveBetID
    '                                    leaderboarditem.B = currentBet

    '                                    Integer.TryParse(reader("amount"), currentBet.amount)

    '                                    'don't do line below - show credits as is in DB - 
    '                                    'leaderboarditem.S = leaderboarditem.S + currentBet.amount 'if the user has a bet made - then show theur credits as if they hadn't placed bet

    '                                    'Button DO set property to tell us we need to add the winnings
    '                                    leaderboarditem.B.addamount = 1
    '                                End If

    '                                thisFixturesDetails.thisfixturesbetdetails.Item(0).friendsleaderboardlist.Add(leaderboarditem)
    '                                i = i + 1
    '                            End While

    '                            'get LeagueId
    '                            reader.NextResult()
    '                            If reader.Read Then
    '                                Integer.TryParse(reader("LeagueID"), thisFixturesDetails.thisfixturesbetdetails.Item(0).leagueid)
    '                            End If

    '                            i = 1
    '                            Dim currentUserInList As Boolean = False
    '                            'Now return overallleaderboard
    '                            reader.NextResult()
    '                            While reader.Read()
    '                                Dim leaderboarditem As New Leaderboard()

    '                                leaderboarditem.P = i
    '                                leaderboarditem.U = reader("name")
    '                                Integer.TryParse(reader("Credits"), leaderboarditem.S)
    '                                'If reader("CurrentUser") = "1" Then
    '                                '    leaderboarditem.C = 1
    '                                'Else
    '                                '    leaderboarditem.C = 0
    '                                'End If

    '                                'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.C)
    '                                leaderboarditem.F = reader("FB_UserID")


    '                                'Added this Stephen 1-Dec
    '                                Dim tempDate As Date = reader.GetMySqlDateTime("TimeStamp")
    '                                If i = 1 Then
    '                                    'Only add the timestamp for the FIRST Item - it is the same for all items and only referenced from the first item in the list
    '                                    leaderboarditem.T = tempDate.ToString("MM/dd/yyyy HH:mm:ss")
    '                                End If

    '                                'leaderboarditem.I = reader("userid")
    '                                'If UserID = leaderboarditem.I Then
    '                                '    leaderboarditem.C = 1
    '                                '    currentUserInList = True
    '                                '    thisFixturesDetails.thisfixturesbetdetails.Item(0).userscreditsforthisgame = leaderboarditem.S
    '                                'End If

    '                                Dim tempUserID As Integer = reader("userid")
    '                                If UserID = tempUserID Then
    '                                    currentUserInList = True
    '                                    'leaderboarditem.C = 1
    '                                    thisFixturesDetails.thisfixturesbetdetails.Item(0).userscreditsforthisgame = leaderboarditem.S
    '                                Else
    '                                    'leaderboarditem.C = 0
    '                                End If

    '                                thisFixturesDetails.thisfixturesbetdetails.Item(0).leagueleaderboardlist.Add(leaderboarditem)
    '                                i = i + 1
    '                            End While

    '                            If currentUserInList = False Then
    '                                reader.NextResult()
    '                                While reader.Read()
    '                                    Dim leaderboarditem As New Leaderboard()

    '                                    leaderboarditem.P = reader("position")
    '                                    leaderboarditem.U = reader("name")
    '                                    Integer.TryParse(reader("Credits"), leaderboarditem.S)
    '                                    'If reader("CurrentUser") = "1" Then
    '                                    '    leaderboarditem.C = 1
    '                                    'Else
    '                                    '    leaderboarditem.C = 0
    '                                    'End If
    '                                    'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.C)
    '                                    leaderboarditem.F = reader("FB_UserID")

    '                                    'leaderboarditem.I = reader("userid")
    '                                    'If UserID = leaderboarditem.I Then
    '                                    '    leaderboarditem.C = 1
    '                                    '    currentUserInList = True
    '                                    'End If

    '                                    Dim tempUserID As Integer = reader("userid")
    '                                    If UserID = tempUserID Then
    '                                        'leaderboarditem.C = 1
    '                                        currentUserInList = True
    '                                    Else
    '                                        'leaderboarditem.C = 0
    '                                    End If


    '                                    thisFixturesDetails.thisfixturesbetdetails.Item(0).userscreditsforthisgame = leaderboarditem.S
    '                                    thisFixturesDetails.thisfixturesbetdetails.Item(0).leagueleaderboardlist.Add(leaderboarditem)
    '                                End While
    '                            End If
    '                            'end of overallleaderboard
    '                        End If
    '                    Catch ex As Exception
    '                        T5Error.LogError("VB", ex.ToString)
    '                    End Try
    '                End If
    '            Else
    '                'User already used power play and no fixture details are returned
    '            End If
    '        End If

    '    Catch myerror As MySqlException
    '        T5Error.LogError("VB", myerror.ToString)
    '    Catch ex As Exception
    '        T5Error.LogError("VB", ex.ToString)
    '    Finally
    '        Try
    '            reader.Close()
    '        Catch ex As Exception
    '        End Try
    '        Try
    '            cmd.Dispose()
    '        Catch ex As Exception
    '        End Try
    '        Try
    '            conn.Dispose()
    '            conn.Close()
    '        Catch ex As Exception
    '        End Try
    '    End Try
    '    Return thisFixturesDetails
    'End Function

    Public Shared Function GetFixtureDetails(ByVal fixtureID As Integer, Optional ByVal UserID As Integer = -1, Optional ByVal facebookUserID As String = "") As Fixture

        Dim thisFixturesDetails As New Fixture
        thisFixturesDetails.fixtureid = fixtureID
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim before As DateTime
        Dim span As TimeSpan
        Try
            conn.Open()
            'Dim query As String = "USP_GetFixtureDetails"
            Dim query As String = "USP_GetFixtureDetails_v2"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            before = DateTime.Now
            reader = cmd.ExecuteReader()
            Dim after As DateTime = DateTime.Now
            span = after - before
            Dim it As Integer = 1

            If reader.Read() Then
                Try
                    Dim betID As Integer
                    Integer.TryParse(reader.GetString("betID"), betID)

                    If betID > 0 Then
                        'This user DOES have an active bet!!!!
                        'Get these details
                        thisFixturesDetails.activebet = New Bet
                        thisFixturesDetails.activebet.betid = betID

                        thisFixturesDetails.activebet.betdescription = reader.GetString("BetDescription")
                        thisFixturesDetails.activebet.eventdesc = reader.GetString("event") 'Added this Stephen 30-jan-11 
                        Integer.TryParse(reader.GetString("BetStatusId"), thisFixturesDetails.activebet.status)
                        Integer.TryParse(reader.GetString("amount"), thisFixturesDetails.activebet.amount)
                        Integer.TryParse(reader.GetString("fixtureId"), thisFixturesDetails.activebet.fixtureid)
                        Integer.TryParse(reader.GetString("eventId"), thisFixturesDetails.activebet.eventid)
                        Integer.TryParse(reader.GetString("UserID"), thisFixturesDetails.activebet.userid)
                        Decimal.TryParse(reader.GetString("odds"), thisFixturesDetails.activebet.odds)

                        Dim tempDate As Date = reader.GetMySqlDateTime("eventtime")
                        'thisFixturesDetails.activebet.eventtime = tempDate.ToString("yyyy-MM-dd HH:mm:ss") + ".0"
                        thisFixturesDetails.activebet.eventtime = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari


                        'Removed this Stpehen - 17-Apr-2012 'pointless!!!
                        'reader.NextResult()

                        'If reader.Read() Then
                        '    'Now check if the bet has completed 
                        '    Dim tempStatuscheck As Integer
                        '    Integer.TryParse(reader.GetString("betStatus"), tempStatuscheck)

                        '    If tempStatuscheck = -101 Then
                        '        'Bet has either not been comleted yet (i.e. we are still wating for an event after the users bet)
                        '        'or the bet has already been checked ( and the details already returned)
                        '        'Either way .... if we get here we should ignore all details returned and we should NOt update anything!!!
                        '    ElseIf tempStatuscheck = 1 Then
                        '        thisFixturesDetails.activebet.status = 1  'Bet has been won!!!!

                        '        thisFixturesDetails.activebet.betresult = reader.GetString("betResult")
                        '        Integer.TryParse(reader.GetString("winnings"), thisFixturesDetails.activebet.creditsearned)
                        '        Integer.TryParse(reader.GetString("newcredits"), thisFixturesDetails.activebet.newcredits)
                        '        thisFixturesDetails.activebet.betcomplete = True
                        '    ElseIf tempStatuscheck = -1 Then
                        '        thisFixturesDetails.activebet.status = -1  'Bet has been lost!!!!
                        '        thisFixturesDetails.activebet.betresult = reader.GetString("betResult")
                        '        thisFixturesDetails.activebet.betcomplete = True
                        '    End If
                        'End If
                    ElseIf betID = -999 Then
                        'v = valid user - this will always be 1 unless a user tries to get the fixture details with an invalid facebookuserid - this will happen only if 1 - a hack - 2 they logged in with email and then on another browser logged in with facebook - this will overwrite their fbuserid in db - in either case - prompt javascript to log the user OUT!!!!
                        thisFixturesDetails.v = -999
                    End If

                    'Next..Get all the event details 
                    reader.NextResult()
                    While reader.Read()
                        'changed this loop to now use gameevent object - 7-Nov-11
                        Dim tempEvent As New GameEvent
                        tempEvent.d = reader.GetString("GameFeedEvent") 'description

                        'Integer.TryParse(reader.GetString("EventID"), tempEvent.u) 'eventupdateid
                        tempEvent.u = reader.GetString("EventID")

                        thisFixturesDetails.events.Add(tempEvent)
                        Integer.TryParse(reader.GetString("EID"), tempEvent.e) '//added stephen 24-Feb-12 'tempEvent.eventid
                        Integer.TryParse(reader.GetString("CurrentHalf"), tempEvent.c) '//added stephen 24-Feb-12 'currenthalf
                    End While

                    'Next..Get scores
                    reader.NextResult()
                    If reader.Read() Then
                        Integer.TryParse(reader.GetString("homescore"), thisFixturesDetails.homescore)
                        Integer.TryParse(reader.GetString("awayscore"), thisFixturesDetails.awayscore)

                        thisFixturesDetails.hometeam = reader.GetString("hometeam")
                        thisFixturesDetails.awayteam = reader.GetString("awayteam")

                        thisFixturesDetails.hometeamcolour = reader.GetString("HomeTeamColour")
                        thisFixturesDetails.awayteamcolour = reader.GetString("AwayTeamColour")
                        thisFixturesDetails.firsthalfleftteam = reader.GetString("FirstHalfLeftTeam")

                        thisFixturesDetails.fixturename = reader.GetString("fixtureName")

                        Integer.TryParse(reader.GetString("currenthalf"), thisFixturesDetails.currenthalf)

                        Integer.TryParse(reader.GetString("numFreesFirstHalf"), thisFixturesDetails.numfreesfirsthalf)
                        Integer.TryParse(reader.GetString("numFreesSecondHalf"), thisFixturesDetails.numfreessecondhalf)

                        Integer.TryParse(reader.GetString("numThrowsFirstHalf"), thisFixturesDetails.numthrowsfirsthalf)
                        Integer.TryParse(reader.GetString("numThrowsSecondHalf"), thisFixturesDetails.numthrowssecondhalf)

                        'Added Stephen 23-MAR-12
                        Integer.TryParse(reader.GetString("NumBetsMade"), thisFixturesDetails.numbetsplaced)
                        Integer.TryParse(reader.GetString("NumBetsToUnlockHigherLevel"), thisFixturesDetails.numbetstounlockhigherlevel)

                        'Added Stephen 25-APR-12
                        Integer.TryParse(reader.GetString("OverallCredits"), thisFixturesDetails.credits)

                        'Added Stephen 10-Jul-12
                        Integer.TryParse(reader.GetString("defaultLeagueID"), thisFixturesDetails.defaultleagueid)
                        Integer.TryParse(reader.GetString("defaultLeagueCreator"), thisFixturesDetails.defaultleaguecreator)
                        thisFixturesDetails.defaultleaguename = reader.GetString("defaultLeagueName")
                        Integer.TryParse(reader.GetString("defaultLeagueNumMembers"), thisFixturesDetails.defaultleaguenummembers)

                        Integer.TryParse(reader.GetString("live"), thisFixturesDetails.live)  'Added Stephen 19-Jul-12

                        thisFixturesDetails.homecrest = reader.GetString("homeCrest")  'Added Stephen 25-Jul-12
                        thisFixturesDetails.awaycrest = reader.GetString("awayCrest")  'Added Stephen 25-Jul-12

                        thisFixturesDetails.fd = reader.GetString("FixtureDescription")  'Added Stephen 14-Jun-12
                        thisFixturesDetails.fc = reader.GetString("FixtureCrest")  'Added Stephen 14-Jun-12

                        Integer.TryParse(reader.GetString("_SeperatePushers"), thisFixturesDetails.sp)
                        thisFixturesDetails.ap = reader.GetString("AdminPushURL")  'Added Stephen 14-Jun-12
                        thisFixturesDetails.fp = reader.GetString("FriendPushURL")  'Added Stephen 14-Jun-12

                        Integer.TryParse(reader.GetString("HomePageFixture"), thisFixturesDetails.hp)

                        Try
                            Dim tempDate As Date = reader.GetMySqlDateTime("TSKickOffTime")
                            '2013-03-18T13:00
                            thisFixturesDetails.starttime = tempDate.ToString("yyyy-MM-ddTHH:mm") 'New way - used for the html5 datetime object
                        Catch ex As Exception
                        End Try

                        Try
                            Dim ArchiveTime As String = reader.GetString("ArchiveTime")
                            If Not String.IsNullOrEmpty(ArchiveTime) Then
                                thisFixturesDetails.a = 1  'this game has been archived!!!!! - redirect to hompage
                            End If
                        Catch ex As Exception
                        End Try

                    End If

                    thisFixturesDetails.eventodds = New System.Collections.Generic.List(Of Odds)()
                    reader.NextResult()
                    While reader.Read
                        Dim thisEventsOdds As New Odds
                        Integer.TryParse(reader.GetString("EventId"), thisEventsOdds.e) 'eventid
                        Decimal.TryParse(reader.GetString("Odds"), thisEventsOdds.o) 'odds
                        thisFixturesDetails.eventodds.Add(thisEventsOdds)
                    End While

                    'Now check if the user has just joined the game for the first time
                    reader.NextResult()
                    If reader.Read() Then
                        Integer.TryParse(reader.GetString("JustJoinedGame"), thisFixturesDetails.justjoinedgame)
                    End If

                    'Now get how many forfeits the user has left
                    reader.NextResult()
                    If reader.Read() Then
                        Integer.TryParse(reader.GetString("RemainingForfeits"), thisFixturesDetails.remainingforfeits)
                        Integer.TryParse(reader.GetString("unlockcredits"), thisFixturesDetails.unlockcredits)

                        'Added by Gamal 14/03/2012: Number of seconds remaining
                        Integer.TryParse(reader.GetString("RemainingPowerPlay"), thisFixturesDetails.remainingPowerPlaySecs)

                        'Added by Stephen 13/08/2012: Number of power plays remaining
                        Integer.TryParse(reader.GetString("remainingpowerplays"), thisFixturesDetails.remainingpowerplays)

                        'Added by Gamal 29/03/2012: One Click Bet Value
                        Integer.TryParse(reader.GetString("OneClickBetValue"), thisFixturesDetails.oneClickBetValue)

                        'Added by Gamal 30/03/2012: Void Offset
                        Integer.TryParse(reader.GetString("VoidOffset"), thisFixturesDetails.voidOffset)

                        'Added by Stephen 17/03/2012: Void Offset
                        Integer.TryParse(reader.GetString("Sound"), thisFixturesDetails.sound)

                        Integer.TryParse(reader.GetString("TooManyPlayers"), thisFixturesDetails.tmp)

                    End If

                    'Now 
                    reader.NextResult()
                    If reader.Read() Then
                        Integer.TryParse(reader.GetString("RemainingForfeits"), thisFixturesDetails.remainingforfeits)
                        Integer.TryParse(reader.GetString("unlockcredits"), thisFixturesDetails.unlockcredits)

                        'Added by Gamal 14/03/2012: Number of seconds remaining
                        Integer.TryParse(reader.GetString("RemainingPowerPlay"), thisFixturesDetails.remainingPowerPlaySecs)

                        'Added by Gamal 29/03/2012: One Click Bet Value
                        Integer.TryParse(reader.GetString("OneClickBetValue"), thisFixturesDetails.oneClickBetValue)

                        'Added by Gamal 30/03/2012: Void Offset
                        Integer.TryParse(reader.GetString("VoidOffset"), thisFixturesDetails.voidOffset)

                    End If


                    'Now read in the list of all pregame bets related to this fixture 
                    Dim previousBetId As Integer = -1
                    Dim thisFixtureBet As New FixtureBet
                    reader.NextResult()
                    While reader.Read
                        Dim currentBetId As Integer = -1
                        Integer.TryParse(reader.GetString("FBID"), currentBetId)

                        If Not previousBetId = currentBetId Then
                            'This is a new bet detail

                            If previousBetId > 0 Then
                                thisFixturesDetails.thisfixturesbetdetails.Add(thisFixtureBet) 'Add the previous Bet detail to the array
                                thisFixtureBet = New FixtureBet 'reset our bet object
                            End If

                            thisFixtureBet.f = fixtureID
                            thisFixtureBet.u = UserID
                            thisFixtureBet.fbid = currentBetId
                            thisFixtureBet.fbu = reader.GetString("FB_UserID")

                            thisFixtureBet.d = reader.GetString("DisplayDescription")
                            Boolean.TryParse(reader.GetBoolean("PreGame"), thisFixtureBet.pg)

                            Dim tempKickOffTime As String
                            Dim tempHalfTime As String
                            tempKickOffTime = reader.GetString("TSACtualKickOff")
                            tempHalfTime = reader.GetString("TSSecondHalf")

                            If thisFixtureBet.pg AndAlso Not String.IsNullOrWhiteSpace(tempKickOffTime) Then
                                'this bet is a pregame bet and the game has started 
                                'so...the user can not bet on this game!!!!!
                                thisFixtureBet.open = False
                            Else
                                thisFixtureBet.open = True
                            End If

                            previousBetId = thisFixtureBet.fbid 'point to the new one
                        End If

                        'Do the options 
                        Dim thisFixtureBetOption As New FixtureBetOption
                        Integer.TryParse(reader.GetString("OptionID"), thisFixtureBetOption.oid)
                        Integer.TryParse(reader.GetString("SelectedOptionID"), thisFixtureBetOption.soid)
                        thisFixtureBetOption.d = reader.GetString("BetOption")
                        Decimal.TryParse(reader.GetString("odds"), thisFixtureBetOption.o)
                        Decimal.TryParse(reader.GetString("UsersOdds"), thisFixtureBetOption.uo)

                        Integer.TryParse(reader.GetString("amount"), thisFixtureBetOption.a)
                        Dim tempWinnings As Decimal
                        Decimal.TryParse(reader.GetString("winnings"), tempWinnings)
                        thisFixtureBetOption.w = tempWinnings
                        Integer.TryParse(reader.GetString("status"), thisFixtureBetOption.s)

                        Dim tempBetID As Integer
                        Integer.TryParse(reader.GetString("FBOUID"), tempBetID)
                        If tempBetID > 0 Then
                            'this is the bet option that we have bet on 
                            'so this is the status for this bet that is relevant
                            thisFixtureBet.bm = True
                            thisFixtureBet.bs = thisFixtureBetOption.s
                        End If

                        'thisFixtureBetOption.userid = UserID
                        thisFixtureBet.o.Add(thisFixtureBetOption) 'Add this option to the thisFixtureBet

                    End While
                    If previousBetId > 0 Then
                        thisFixturesDetails.thisfixturesbetdetails.Add(thisFixtureBet)
                    End If

                    If thisFixturesDetails.thisfixturesbetdetails.Count > 0 Then 'we have returned some details
                        'Now return friendsleaderboard
                        Dim i As Integer = 1
                        reader.NextResult()
                        While reader.Read()
                            Dim leaderboarditem As New FriendsLeaderboard()

                            leaderboarditem.P = i
                            leaderboarditem.U = reader("name")
                            Integer.TryParse(reader("Credits"), leaderboarditem.S)
                            leaderboarditem.F = reader("FB_UserID")

                            'Dim tempUserID As Integer = reader("userid")
                            'If UserID = tempUserID Then
                            '    leaderboarditem.C = 1
                            'Else
                            '    leaderboarditem.C = 0
                            'End If

                            Dim ActiveBetID As Integer
                            Integer.TryParse(reader("betid"), ActiveBetID)
                            If ActiveBetID > 0 Then
                                Dim currentBet As New Bet
                                currentBet.betid = ActiveBetID
                                leaderboarditem.B = currentBet

                                Integer.TryParse(reader("amount"), currentBet.amount)

                                'don't do line below - show credits as is in DB - 
                                'leaderboarditem.S = leaderboarditem.S + currentBet.amount 'if the user has a bet made - then show theur credits as if they hadn't placed bet

                                'Button DO set property to tell us we need to add the winnings
                                leaderboarditem.B.addamount = 1
                            End If

                            'thisFixturesDetails.thisfixturesbetdetails.Item(0).friendsleaderboardlist.Add(leaderboarditem)
                            i = i + 1
                        End While

                        'get LeagueId
                        reader.NextResult()
                        If reader.Read Then
                            Integer.TryParse(reader("LeagueID"), thisFixturesDetails.thisfixturesbetdetails.Item(0).l)
                        End If

                        i = 1
                        Dim currentUserInList As Boolean = False
                        'Now return overallleaderboard
                        reader.NextResult()
                        While reader.Read()
                            Dim leaderboarditem As New Leaderboard()

                            leaderboarditem.P = i
                            leaderboarditem.U = reader("name")
                            Integer.TryParse(reader("Credits"), leaderboarditem.S)

                            'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.C)
                            leaderboarditem.F = reader("FB_UserID")


                            'Added this Stephen 1-Dec
                            Dim tempDate As Date = reader.GetMySqlDateTime("TimeStamp")
                            If i = 1 Then
                                'Only add the timestamp for the FIRST Item - it is the same for all items and only referenced from the first item in the list
                                leaderboarditem.T = tempDate.ToString("MM/dd/yyyy HH:mm:ss")
                            End If

                            'leaderboarditem.I = reader("userid")
                            'If UserID = leaderboarditem.I Then
                            '    currentUserInList = True
                            '    leaderboarditem.C = 1
                            '    thisFixturesDetails.thisfixturesbetdetails.Item(0).userscreditsforthisgame = leaderboarditem.S
                            'Else
                            '    leaderboarditem.C = 0
                            'End If

                            Dim tempUserID As Integer = reader("userid")
                            If UserID = tempUserID Then
                                currentUserInList = True
                                'leaderboarditem.C = 1
                                thisFixturesDetails.thisfixturesbetdetails.Item(0).c = leaderboarditem.S '(userscreditsforthisgame)
                            Else
                                'leaderboarditem.C = 0
                            End If

                            'thisFixturesDetails.thisfixturesbetdetails.Item(0).leagueleaderboardlist.Add(leaderboarditem)
                            i = i + 1
                        End While

                        If currentUserInList = False Then
                            reader.NextResult()
                            While reader.Read()
                                Dim leaderboarditem As New Leaderboard()

                                leaderboarditem.P = reader("position")
                                leaderboarditem.U = reader("name")
                                Integer.TryParse(reader("Credits"), leaderboarditem.S)

                                'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.C)
                                leaderboarditem.F = reader("FB_UserID")

                                'leaderboarditem.I = reader("userid")
                                'If UserID = leaderboarditem.I Then
                                '    currentUserInList = True
                                '    leaderboarditem.C = 1
                                'Else
                                '    leaderboarditem.C = 0
                                'End If

                                Dim tempUserID As Integer = reader("userid")
                                If UserID = tempUserID Then
                                    currentUserInList = True
                                    'leaderboarditem.C = 1
                                Else
                                    'leaderboarditem.C = 0
                                End If

                                'thisFixturesDetails.thisfixturesbetdetails.Item(0).userscreditsforthisgame = leaderboarditem.S
                                'thisFixturesDetails.thisfixturesbetdetails.Item(0).leagueleaderboardlist.Add(leaderboarditem)
                            End While
                        End If
                        'end of overallleaderboard
                    End If

                Catch ex As Exception
                End Try
            End If
        Catch myerror As MySqlException
            'Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            'Logger.LogError("MySql", ex)
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

        Dim after2 As DateTime = DateTime.Now
        Dim span2 As TimeSpan = after2 - before
        Return thisFixturesDetails
    End Function

    Public Shared Function GetGameTrackerDetails(ByVal UserID As Integer, ByVal fixtureID As Integer) As System.Collections.Generic.List(Of GameEvent)
        Dim events As New System.Collections.Generic.List(Of GameEvent)

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try

            conn.Open()
            Dim query As String = "USP_GetGameTrackerDetails"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_userID", UserID)
            reader = cmd.ExecuteReader()

            Try
                While reader.Read()
                    Dim tempEvent As New GameEvent
                    tempEvent.d = reader.GetString("GameFeedEvent") 'description

                    tempEvent.u = reader.GetString("EventID")

                    events.Add(tempEvent)
                    Integer.TryParse(reader.GetString("EID"), tempEvent.e) '//added stephen 24-Feb-12 'tempEvent.eventid
                    Integer.TryParse(reader.GetString("CurrentHalf"), tempEvent.c) '//added stephen 24-Feb-12 'currenthalf
                End While
            Catch ex As Exception
            End Try

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return events
    End Function

    Public Shared Function CreateMatch(ByVal UserID As Integer, ByVal hometeam As String, ByVal awayteam As String, ByVal hometeamcolour As String, ByVal awayteamcolour As String, ByVal firsthalfleftteam As String, ByVal live As Integer) As Integer
        Dim newFixtureID As Integer

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_CreateMatch2"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_gameID", 1) 'temporary hardcode
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_hometeam", hometeam)
            cmd.Parameters.AddWithValue("_awayteam", awayteam)
            cmd.Parameters.AddWithValue("_hometeamcolour", hometeamcolour)
            cmd.Parameters.AddWithValue("_awayteamcolour", awayteamcolour)
            cmd.Parameters.AddWithValue("_firsthalfleftteam", firsthalfleftteam)
            cmd.Parameters.AddWithValue("_live", live)
            cmd.CommandTimeout = 600 '600 = 10 minutes
            reader = cmd.ExecuteReader()

            Try
                If reader.Read() Then
                    Integer.TryParse(reader.GetString("newFixtureID"), newFixtureID)
                End If
            Catch ex As Exception
            End Try

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return newFixtureID
    End Function


    Public Shared Function AwardCredits(ByVal credits As Integer, ByVal topplayers As Integer, ByVal fixtureID As Integer, ByVal LeaguesToUpdate As String, ByVal userid As Integer, ByVal overallCredits As Integer) As Integer
        Dim updated As Integer

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_AwardCredits"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_credits", credits)
            cmd.Parameters.AddWithValue("_topplayers", topplayers)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_LeaguesToUpdate", LeaguesToUpdate)
            cmd.Parameters.AddWithValue("_userid", userid)
            cmd.Parameters.AddWithValue("_overallCredits", overallCredits)

            reader = cmd.ExecuteReader()

            Try
                If reader.Read() Then
                    Integer.TryParse(reader.GetString("updated"), updated)
                End If
            Catch ex As Exception
            End Try

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return updated
    End Function


    Public Shared Function AwardBonus(ByVal amount As Integer, ByVal topplayers As Integer, ByVal fixtureID As Integer, ByVal userid As Integer, ByVal bonus As String) As Integer
        Dim updated As Integer

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_AwardBonus"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_amount", amount)
            cmd.Parameters.AddWithValue("_topplayers", topplayers)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_userid", userid)
            cmd.Parameters.AddWithValue("_bonus", bonus)

            reader = cmd.ExecuteReader()

            Try
                If reader.Read() Then
                    Integer.TryParse(reader.GetString("updated"), updated)
                End If
            Catch ex As Exception
            End Try

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return updated
    End Function





    Public Shared Function EditMatchDetails(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal hometeam As String, ByVal awayteam As String, ByVal hometeamcolour As String, ByVal awayteamcolour As String, ByVal firsthalfleftteam As String, ByVal voidTime As Integer, ByVal homecrest As String, ByVal awaycrest As String, ByVal fixturecrest As String, ByVal fixturedescription As String, ByVal tsko As String, ByVal homepageFixture As Integer, ByVal fixturesLeagues As String) As Integer
        Dim updated As Integer

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_EditMatchDetails2"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_hometeam", hometeam)
            cmd.Parameters.AddWithValue("_awayteam", awayteam)
            cmd.Parameters.AddWithValue("_hometeamcolour", hometeamcolour)
            cmd.Parameters.AddWithValue("_awayteamcolour", awayteamcolour)
            cmd.Parameters.AddWithValue("_firsthalfleftteam", firsthalfleftteam)
            cmd.Parameters.AddWithValue("_homecrest", homecrest)
            cmd.Parameters.AddWithValue("_awaycrest", awaycrest)
            cmd.Parameters.AddWithValue("_fixturecrest", fixturecrest)
            cmd.Parameters.AddWithValue("_fixturedescription", fixturedescription)
            cmd.Parameters.AddWithValue("_TSKickOff", tsko)
            cmd.Parameters.AddWithValue("_homepageFixture", homepageFixture)
            cmd.Parameters.AddWithValue("_voidTime", voidTime)
            cmd.Parameters.AddWithValue("_fixturesLeagues", fixturesLeagues)

            reader = cmd.ExecuteReader()

            Try
                If reader.Read() Then
                    Integer.TryParse(reader.GetString("updated"), updated)
                End If
            Catch ex As Exception
            End Try

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return updated
    End Function


    Public Shared Function GetTeamColours(ByVal fixtureID As Integer, ByVal UserID As Integer) As System.Collections.Generic.List(Of String)
        Dim TeamColours As New System.Collections.Generic.List(Of String)

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_GetTeamColours"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            reader = cmd.ExecuteReader()

            Try
                'Next..Get all the friends bet details
                While reader.Read()
                    TeamColours.Add(reader.GetString("colourid"))
                End While
            Catch ex As Exception
            End Try

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return TeamColours
    End Function


    Public Shared Function GetFriendsBetHistory(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal FriendList As String, Optional ByVal facebookUserID As String = "") As Fixture
        Dim thisFixturesDetails As New Fixture

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            'Dim query As String = "USP_GetFixtureDetails_ForFriends"
            'Dim query As String = "USP_GetFixtureDetails_ForFriends_v2"
            Dim query As String = "USP_GetFriendsBetHistory"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_friendList", FriendList)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader()

            Try
                'Next..Get all the friends bet details
                While reader.Read()
                    Dim thisbet As New Bet
                    'Dim thisUser As New User
                    'thisbet.eventdesc = reader.GetString("GameFeedEvent") ' no longer need this value - stephen 4-May-
                    Integer.TryParse(reader.GetString("betID"), thisbet.betid)

                    If thisbet.betid > 0 Then
                        'Only get these details if the details returned are for a bet
                        '---it could be that these details are a list of your friends playing the game and not a list of your friends bets (we return a list of which friends are playing the game the first time you join the game!!)
                        Integer.TryParse(reader.GetString("EventID"), thisbet.eventid)

                        Integer.TryParse(reader.GetString("betstatusid"), thisbet.status)
                        Integer.TryParse(reader.GetString("winnings"), thisbet.creditsearned)
                        Integer.TryParse(reader.GetString("amount"), thisbet.amount)

                        Dim tempDate As Date = reader.GetMySqlDateTime("eventtime")
                        'thisbet.eventtime = tempDate.ToString("yyyy-MM-dd HH:mm:ss") + ".0"
                        thisbet.eventtime = tempDate.ToString("yyyy-MM-dd HH:mm:ss") 'New way - used for safari 'Removed this Stephen 25-Nov-11
                        thisbet.eventtime = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari 'Added this Stephen 25-Nov-11

                        'thisUser.name = reader.GetString("name") 'no longer need this value - stephen 4-May-
                        'thisbet.user = thisUser ' no longer need this value - stephen 4-May-
                    End If
                    thisFixturesDetails.friendbets.Add(thisbet)
                End While
            Catch ex As Exception
            End Try

        Catch myerror As MySqlException
            'Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            'Logger.LogError("MySql", ex)
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
        Return thisFixturesDetails
    End Function

    Public Shared Function MidGameDBCleanUp(ByVal fixtureID As Integer) As DBCleanup
        Dim thisCleanup As New DBCleanup
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_MidMatchMemoryCleanup"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.CommandTimeout = 600 '600 = 10 minutes

            Dim before As DateTime = DateTime.Now
            reader = cmd.ExecuteReader()
            Dim after As DateTime = DateTime.Now
            Dim span As TimeSpan = after - before
            thisCleanup.details = "Time taken to clean up DB (in seconds) " & span.TotalSeconds.ToString

            If reader.Read() Then
                Try
                    Integer.TryParse(reader.GetString("RC"), thisCleanup.result)
                Catch ex As Exception
                End Try
            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
            thisCleanup.result = -1
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            thisCleanup.result = -1
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
        Return thisCleanup
    End Function

    Public Shared Function FullTimeStoreDBMatchDetails(ByVal fixtureID As Integer) As Integer
        Dim Result As New Integer
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_FullTime_StoreMatchDetails"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.CommandTimeout = 600 ' 360 = 10 minutes

            reader = cmd.ExecuteReader()
            If reader.Read() Then
                Try
                    'next step is to read the results of this update and display them!!!!!
                    'or alternatively - provide a way to view comparisson of details in each table!!!
                    Integer.TryParse(reader.GetString("RC"), Result)
                Catch ex As Exception
                End Try
            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
            Result = -1
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Result = -1
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
        Return Result
    End Function

    Public Shared Function BackupToDisk(ByVal fixtureID As Integer) As DBBackup
        Dim thisBackup As New DBBackup
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "BackUpAllMemoryTables"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_returnDetails", 1)

            'cmd.Parameters.Add("backupDone_", MySqlDbType.Int24)
            'cmd.Parameters("backupDone_").Direction = ParameterDirection.Output

            cmd.Parameters.Add(New MySqlParameter("backupDone_", MySqlDbType.Int64))
            cmd.Parameters("backupDone_").Direction = ParameterDirection.Output

            cmd.Parameters.AddWithValue("_DoBackupRegardlessOfIfMemoryTables", 1) 'this means we will back up the tables if they are memory or Disk

            cmd.CommandTimeout = 600 ' 600 = 10 minutes

            Dim before As DateTime = DateTime.Now
            reader = cmd.ExecuteReader()
            Dim after As DateTime = DateTime.Now
            Dim span As TimeSpan = after - before

            'For some reason we can not get the result this way!!!
            'Integer.TryParse(cmd.Parameters("backupDone_").Value.ToString(), thisBackup.BackupResult)

            If reader.Read() Then
                Integer.TryParse(reader.GetString("backUpResult"), thisBackup.backupresult)

                If thisBackup.backupresult > 0 Then

                    thisBackup.backupdetails = "Time taken to BackupToDisk (in seconds) " & span.TotalSeconds.ToString & "brk Items Backed up to Disk per table... brk "
                    Dim BetsResultsUpdated As Integer
                    Integer.TryParse(reader.GetString("BetsResults"), BetsResultsUpdated)
                    thisBackup.backupdetails = thisBackup.backupdetails & "Bets Results: " & BetsResultsUpdated & "brk"

                    Dim BetsResultsArchive As Integer
                    Integer.TryParse(reader.GetString("BetsResultsArchive"), BetsResultsArchive)
                    thisBackup.backupdetails = thisBackup.backupdetails & "BetsResultsArchive: " & BetsResultsArchive & "brk"

                    Dim PreGameBets_FTTS As Integer
                    Integer.TryParse(reader.GetString("PreGameBets_FTTS"), PreGameBets_FTTS)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBets_FTTS: " & PreGameBets_FTTS & "brk"

                    Dim PreGameBets_FGS As Integer
                    Integer.TryParse(reader.GetString("PreGameBets_FGS"), PreGameBets_FGS)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBets_FGS: " & PreGameBets_FGS & "brk"

                    Dim PreGameBets_HTS As Integer
                    Integer.TryParse(reader.GetString("PreGameBets_HTS"), PreGameBets_HTS)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBets_HTS: " & PreGameBets_HTS & "brk"

                    Dim PreGameBets_HTT As Integer
                    Integer.TryParse(reader.GetString("PreGameBets_HTT"), PreGameBets_HTT)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBets_HTT: " & PreGameBets_HTT & "brk"

                    Dim PreGameBets_HTF As Integer
                    Integer.TryParse(reader.GetString("PreGameBets_HTF"), PreGameBets_HTF)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBets_HTF: " & PreGameBets_HTF & "brk"

                    Dim PreGameBets_FTS As Integer
                    Integer.TryParse(reader.GetString("PreGameBets_FTS"), PreGameBets_FTS)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBets_FTS: " & PreGameBets_FTS & "brk"

                    Dim PreGameBets_FTT As Integer
                    Integer.TryParse(reader.GetString("PreGameBets_FTT"), PreGameBets_FTT)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBets_FTT: " & PreGameBets_FTT & "brk"

                    Dim PreGameBetsLinkedLeagues_FGS As Integer
                    Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FGS"), PreGameBetsLinkedLeagues_FGS)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBetsLinkedLeagues_FGSs: " & PreGameBetsLinkedLeagues_FGS & "brk"

                    Dim PreGameBetsLinkedLeagues_FTF As Integer
                    Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTF"), PreGameBetsLinkedLeagues_FTF)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBetsLinkedLeagues_FTF: " & PreGameBetsLinkedLeagues_FTF & "brk"

                    Dim PreGameBetsLinkedLeagues_FTS As Integer
                    Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTS"), PreGameBetsLinkedLeagues_FTS)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBetsLinkedLeagues_FTS: " & PreGameBetsLinkedLeagues_FTS & "brk"

                    Dim PreGameBetsLinkedLeagues_FTT As Integer
                    Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTT"), PreGameBetsLinkedLeagues_FTT)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBetsLinkedLeagues_FTT: " & PreGameBetsLinkedLeagues_FTT & "brk"

                    Dim PreGameBetsLinkedLeagues_FTTS As Integer
                    Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTTS"), PreGameBetsLinkedLeagues_FTTS)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBetsLinkedLeagues_FTTS: " & PreGameBetsLinkedLeagues_FTTS & "brk"

                    Dim PreGameBetsLinkedLeagues_HTF As Integer
                    Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_HTF"), PreGameBetsLinkedLeagues_HTF)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBetsLinkedLeagues_HTF: " & PreGameBetsLinkedLeagues_HTF & "brk"

                    Dim PreGameBetsLinkedLeagues_HTS As Integer
                    Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_HTS"), PreGameBetsLinkedLeagues_HTS)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBetsLinkedLeagues_HTS: " & PreGameBetsLinkedLeagues_HTS & "brk"

                    Dim PreGameBetsLinkedLeagues_HTT As Integer
                    Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_HTT"), PreGameBetsLinkedLeagues_HTT)
                    thisBackup.backupdetails = thisBackup.backupdetails & "PreGameBetsLinkedLeagues_HTT: " & PreGameBetsLinkedLeagues_HTT & "brk"

                    Dim NumLeagueTableRowsBackedUp As Integer
                    Integer.TryParse(reader.GetString("NumLeagueTableRowsBackedUp"), NumLeagueTableRowsBackedUp)
                    thisBackup.backupdetails = thisBackup.backupdetails & "NumLeagueTableRowsBackedUp: " & NumLeagueTableRowsBackedUp & "brk"

                End If






            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
            thisBackup.backupresult = -1
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            thisBackup.backupresult = -1
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
        Return thisBackup
    End Function

    Public Shared Function RebootMemoryTables(ByVal fixtureID As Integer) As DBReset
        Dim thisReset As New DBReset
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_REsetMemoryTablesAfterSystemReset"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_Fixtureid", fixtureID)
            cmd.CommandTimeout = 600 ' 600 = 10 minutes

            Dim before As DateTime = DateTime.Now
            reader = cmd.ExecuteReader()
            Dim after As DateTime = DateTime.Now
            Dim span As TimeSpan = after - before

            'For some reason we can not get the result this way!!!
            'Integer.TryParse(cmd.Parameters("backupDone_").Value.ToString(), thisBackup.BackupResult)

            If reader.Read() Then

                thisReset.resetdetails = "Time taken to Repopulate memory tables (in seconds) " & span.TotalSeconds.ToString & " brk Items Reset per table... brk "

                Dim PreGameBets_FTTS As Integer
                Integer.TryParse(reader.GetString("_PreGameBets_FTTS"), PreGameBets_FTTS)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBets_FTTS: " & PreGameBets_FTTS & "brk"

                Dim PreGameBets_FGS As Integer
                Integer.TryParse(reader.GetString("_PreGameBets_FGS"), PreGameBets_FGS)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBets_FGS: " & PreGameBets_FGS & "brk"

                Dim PreGameBets_HTS As Integer
                Integer.TryParse(reader.GetString("_PreGameBets_HTS"), PreGameBets_HTS)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBets_HTS: " & PreGameBets_HTS & "brk"

                Dim PreGameBets_HTT As Integer
                Integer.TryParse(reader.GetString("_PreGameBets_HTT"), PreGameBets_HTT)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBets_HTT: " & PreGameBets_HTT & "brk"

                Dim PreGameBets_HTF As Integer
                Integer.TryParse(reader.GetString("_PreGameBets_HTF"), PreGameBets_HTF)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBets_HTF: " & PreGameBets_HTF & "brk"

                Dim PreGameBets_FTS As Integer
                Integer.TryParse(reader.GetString("_PreGameBets_FTS"), PreGameBets_FTS)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBets_FTS: " & PreGameBets_FTS & "brk"

                Dim PreGameBets_FTT As Integer
                Integer.TryParse(reader.GetString("_PreGameBets_FTT"), PreGameBets_FTT)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBets_FTT: " & PreGameBets_FTT & "brk"

                Dim PreGameBetsLinkedLeagues_FGS As Integer
                Integer.TryParse(reader.GetString("_PreGameBetsLinkedLeagues_FGS"), PreGameBetsLinkedLeagues_FGS)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBetsLinkedLeagues_FGSs: " & PreGameBetsLinkedLeagues_FGS & "brk"

                Dim PreGameBetsLinkedLeagues_FTF As Integer
                Integer.TryParse(reader.GetString("_PreGameBetsLinkedLeagues_FTF"), PreGameBetsLinkedLeagues_FTF)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBetsLinkedLeagues_FTF: " & PreGameBetsLinkedLeagues_FTF & "brk"

                Dim PreGameBetsLinkedLeagues_FTS As Integer
                Integer.TryParse(reader.GetString("_PreGameBetsLinkedLeagues_FTS"), PreGameBetsLinkedLeagues_FTS)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBetsLinkedLeagues_FTS: " & PreGameBetsLinkedLeagues_FTS & "brk"

                Dim PreGameBetsLinkedLeagues_FTT As Integer
                Integer.TryParse(reader.GetString("_PreGameBetsLinkedLeagues_FTT"), PreGameBetsLinkedLeagues_FTT)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBetsLinkedLeagues_FTT: " & PreGameBetsLinkedLeagues_FTT & "brk"

                Dim PreGameBetsLinkedLeagues_FTTS As Integer
                Integer.TryParse(reader.GetString("_PreGameBetsLinkedLeagues_FTTS"), PreGameBetsLinkedLeagues_FTTS)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBetsLinkedLeagues_FTTS: " & PreGameBetsLinkedLeagues_FTTS & "brk"

                Dim PreGameBetsLinkedLeagues_HTF As Integer
                Integer.TryParse(reader.GetString("_PreGameBetsLinkedLeagues_HTF"), PreGameBetsLinkedLeagues_HTF)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBetsLinkedLeagues_HTF: " & PreGameBetsLinkedLeagues_HTF & "brk"

                Dim PreGameBetsLinkedLeagues_HTS As Integer
                Integer.TryParse(reader.GetString("_PreGameBetsLinkedLeagues_HTS"), PreGameBetsLinkedLeagues_HTS)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBetsLinkedLeagues_HTS: " & PreGameBetsLinkedLeagues_HTS & "brk"

                Dim PreGameBetsLinkedLeagues_HTT As Integer
                Integer.TryParse(reader.GetString("_PreGameBetsLinkedLeagues_HTT"), PreGameBetsLinkedLeagues_HTT)
                thisReset.resetdetails = thisReset.resetdetails & "PreGameBetsLinkedLeagues_HTT: " & PreGameBetsLinkedLeagues_HTT & "brk"

                Dim NumLeagueTableRowsUpdate As Integer
                Integer.TryParse(reader.GetString("NumLeagueTableRowsUpdated_"), NumLeagueTableRowsUpdate)
                thisReset.resetdetails = thisReset.resetdetails & "NumLeagueTableRowsUpdate: " & NumLeagueTableRowsUpdate & "brk"

                thisReset.resetresult = 1

            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
            thisReset.resetresult = -1
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            thisReset.resetresult = -1
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
        Return thisReset
    End Function

    Public Shared Function CompareMemoryTables(ByVal fixtureID As Integer) As String
        Dim Comparisson As String = "No details returned "
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_CompareMemoryTablesToDisk"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_Fixtureid", fixtureID)
            cmd.CommandTimeout = 600 ' 600 = 10 minutes

            Dim before As DateTime = DateTime.Now
            reader = cmd.ExecuteReader()
            Dim after As DateTime = DateTime.Now
            Dim span As TimeSpan = after - before


            'For some reason we can not get the result this way!!!
            'Integer.TryParse(cmd.Parameters("backupDone_").Value.ToString(), thisBackup.BackupResult)

            If reader.Read() Then
                Comparisson = "Time taken to compare tables (in seconds) " & span.TotalSeconds.ToString & "brk Comparisson of Memory Tables for this Fixture....brk Disk should have >= memory tables if system has been backed up correctly....brk"

                Dim BetsResults As Integer
                Integer.TryParse(reader.GetString("BetsResults_Mem"), BetsResults)
                Comparisson = Comparisson & "BetsResults_Mem: " & BetsResults & "brk"

                Integer.TryParse(reader.GetString("BetsResults_Disk"), BetsResults)
                Comparisson = Comparisson & "BetsResults_Disk: " & BetsResults & "brk-----------brk"

                Dim BetsResultsArchive As Integer
                Integer.TryParse(reader.GetString("BetsResultsArchive_Mem"), BetsResultsArchive)
                Comparisson = Comparisson & "BetsResultsArchive_Mem: " & BetsResultsArchive & "brk"

                Integer.TryParse(reader.GetString("BetsResultsArchive_Disk"), BetsResultsArchive)
                Comparisson = Comparisson & "BetsResultsArchive_Disk: " & BetsResultsArchive & "brk-----------brk"

                Dim PreGameBets_FTTS As Integer
                Integer.TryParse(reader.GetString("PreGameBets_FTTS_Mem"), PreGameBets_FTTS)
                Comparisson = Comparisson & "PreGameBets_FTTS_Mem: " & PreGameBets_FTTS & "brk"

                Integer.TryParse(reader.GetString("PreGameBets_FTTS_Disk"), PreGameBets_FTTS)
                Comparisson = Comparisson & "PreGameBets_FTTS_Disk: " & PreGameBets_FTTS & "brk-----------brk"

                Dim PreGameBets_FGS As Integer
                Integer.TryParse(reader.GetString("PreGameBets_FGS_Mem"), PreGameBets_FGS)
                Comparisson = Comparisson & "PreGameBets_FGS_Mem: " & PreGameBets_FGS & "brk"

                Integer.TryParse(reader.GetString("PreGameBets_FGS_Disk"), PreGameBets_FGS)
                Comparisson = Comparisson & "PreGameBets_FGS_Disk: " & PreGameBets_FGS & "brk-----------brk"

                Dim PreGameBets_HTS As Integer
                Integer.TryParse(reader.GetString("PreGameBets_HTS_Mem"), PreGameBets_HTS)
                Comparisson = Comparisson & "PreGameBets_HTS_Mem: " & PreGameBets_HTS & "brk"

                Integer.TryParse(reader.GetString("PreGameBets_HTS_Disk"), PreGameBets_HTS)
                Comparisson = Comparisson & "PreGameBets_HTS_Disk: " & PreGameBets_HTS & "brk-----------brk"

                Dim PreGameBets_HTT As Integer
                Integer.TryParse(reader.GetString("PreGameBets_HTT_Mem"), PreGameBets_HTT)
                Comparisson = Comparisson & "PreGameBets_HTT_Mem: " & PreGameBets_HTT & "brk"


                Integer.TryParse(reader.GetString("PreGameBets_HTT_Disk"), PreGameBets_HTT)
                Comparisson = Comparisson & "PreGameBets_HTT_Disk: " & PreGameBets_HTT & "brk-----------brk"

                Dim PreGameBets_HTF As Integer
                Integer.TryParse(reader.GetString("PreGameBets_HTF_Mem"), PreGameBets_HTF)
                Comparisson = Comparisson & "PreGameBets_HTF_Mem: " & PreGameBets_HTF & "brk"


                Integer.TryParse(reader.GetString("PreGameBets_HTF_Disk"), PreGameBets_HTF)
                Comparisson = Comparisson & "PreGameBets_HTF_Disk: " & PreGameBets_HTF & "brk-----------brk"

                Dim PreGameBets_FTS As Integer
                Integer.TryParse(reader.GetString("PreGameBets_FTS_Mem"), PreGameBets_FTS)
                Comparisson = Comparisson & "PreGameBets_FTS_Mem: " & PreGameBets_FTS & "brk"


                Integer.TryParse(reader.GetString("PreGameBets_FTS_Disk"), PreGameBets_FTS)
                Comparisson = Comparisson & "PreGameBets_FTS_Disk: " & PreGameBets_FTS & "brk-----------brk"

                Dim PreGameBets_FTT As Integer
                Integer.TryParse(reader.GetString("PreGameBets_FTT_Mem"), PreGameBets_FTT)
                Comparisson = Comparisson & "PreGameBets_FTT_Mem: " & PreGameBets_FTT & "brk"


                Integer.TryParse(reader.GetString("PreGameBets_FTT_Disk"), PreGameBets_FTT)
                Comparisson = Comparisson & "PreGameBets_FTT_Disk: " & PreGameBets_FTT & "brk-----------brk"

                Dim PreGameBetsLinkedLeagues_FGS As Integer
                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FGS_Mem"), PreGameBetsLinkedLeagues_FGS)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_FGS_Mem: " & PreGameBetsLinkedLeagues_FGS & "brk"


                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FGS_Disk"), PreGameBetsLinkedLeagues_FGS)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_FGS_Disk: " & PreGameBetsLinkedLeagues_FGS & "brk-----------brk"

                Dim PreGameBetsLinkedLeagues_FTF As Integer
                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTF_Mem"), PreGameBetsLinkedLeagues_FTF)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_FTF_Mem: " & PreGameBetsLinkedLeagues_FTF & "brk"


                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTF_Disk"), PreGameBetsLinkedLeagues_FTF)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_FTF_Disk: " & PreGameBetsLinkedLeagues_FTF & "brk-----------brk"

                Dim PreGameBetsLinkedLeagues_FTS As Integer
                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTS_Mem"), PreGameBetsLinkedLeagues_FTS)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_FTS_Mem: " & PreGameBetsLinkedLeagues_FTS & "brk"


                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTS_Disk"), PreGameBetsLinkedLeagues_FTS)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_FTS_Disk: " & PreGameBetsLinkedLeagues_FTS & "brk-----------brk"

                Dim PreGameBetsLinkedLeagues_FTT As Integer
                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTT_Mem"), PreGameBetsLinkedLeagues_FTT)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_FTT_Mem: " & PreGameBetsLinkedLeagues_FTT & "brk"


                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTT_Disk"), PreGameBetsLinkedLeagues_FTT)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_FTT_Disk: " & PreGameBetsLinkedLeagues_FTT & "brk-----------brk"

                Dim PreGameBetsLinkedLeagues_FTTS As Integer
                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTTS_Mem"), PreGameBetsLinkedLeagues_FTTS)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_FTTS_Mem: " & PreGameBetsLinkedLeagues_FTTS & "brk"


                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_FTTS_Disk"), PreGameBetsLinkedLeagues_FTTS)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_FTTS_Disk: " & PreGameBetsLinkedLeagues_FTTS & "brk-----------brk"

                Dim PreGameBetsLinkedLeagues_HTF As Integer
                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_HTF_Mem"), PreGameBetsLinkedLeagues_HTF)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_HTF_Mem: " & PreGameBetsLinkedLeagues_HTF & "brk"


                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_HTF_Disk"), PreGameBetsLinkedLeagues_HTF)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_HTF_Disk: " & PreGameBetsLinkedLeagues_HTF & "brk-----------brk"

                Dim PreGameBetsLinkedLeagues_HTS As Integer
                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_HTS_Mem"), PreGameBetsLinkedLeagues_HTS)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_HTS_Mem: " & PreGameBetsLinkedLeagues_HTS & "brk"


                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_HTS_Disk"), PreGameBetsLinkedLeagues_HTS)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_HTS_Disk: " & PreGameBetsLinkedLeagues_HTS & "brk-----------brk"

                Dim PreGameBetsLinkedLeagues_HTT As Integer
                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_HTT_Mem"), PreGameBetsLinkedLeagues_HTT)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_HTT_Mem: " & PreGameBetsLinkedLeagues_HTT & "brk"


                Integer.TryParse(reader.GetString("PreGameBetsLinkedLeagues_HTT_Disk"), PreGameBetsLinkedLeagues_HTT)
                Comparisson = Comparisson & "PreGameBetsLinkedLeagues_HTT_Disk: " & PreGameBetsLinkedLeagues_HTT & "brk-----------brk"

                Dim NumLeagueTableRowsUpdate As Integer
                Integer.TryParse(reader.GetString("NumLeagueTableRows_Mem"), NumLeagueTableRowsUpdate)
                Comparisson = Comparisson & "NumLeagueTableRows_Mem: " & NumLeagueTableRowsUpdate & "brk"

                Integer.TryParse(reader.GetString("NumLeagueTableRows_Disk"), NumLeagueTableRowsUpdate)
                Comparisson = Comparisson & "NumLeagueTableRows_Disk: " & NumLeagueTableRowsUpdate & "brk-----------brk"

            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
            Comparisson = Comparisson & myerror.ToString
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Comparisson = Comparisson & ex.ToString
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
        Return Comparisson
    End Function


    Public Shared Function AddNewGoalScorer(ByVal fixtureID As Integer, ByVal potentialwinnings As Integer, ByVal GoalScorer As String, ByVal playerid As Integer) As Integer
        Dim Result As New Integer
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_AddGoalScorerToFixture"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            If String.IsNullOrEmpty(GoalScorer) Then
                cmd.Parameters.AddWithValue("_GoalScorer", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_GoalScorer", GoalScorer)
            End If
            cmd.Parameters.AddWithValue("_potentialwinnings", potentialwinnings)
            cmd.Parameters.AddWithValue("_playerid", playerid)

            reader = cmd.ExecuteReader()
            If reader.Read() Then
                Try
                    Integer.TryParse(reader.GetString("Result"), Result)
                Catch ex As Exception
                End Try
            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
            Result = -1
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Result = -1
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
        Return Result
    End Function

    Public Shared Function RemoveGoalScorer(ByVal fixtureID As Integer, ByVal FBOID As Integer) As Integer
        Dim Result As New Integer
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_RemoveGoalScorerFromFixture"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_FBOID", FBOID)

            reader = cmd.ExecuteReader()
            If reader.Read() Then
                Try
                    Integer.TryParse(reader.GetString("Result"), Result)
                Catch ex As Exception
                End Try
            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
            Result = -1
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Result = -1
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
        Return Result
    End Function


    Public Shared Function GetLastEventFixture(ByVal fixtureID As Integer) As GameEvent
        Dim thisEvent As New GameEvent
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_GetLastEvent"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Try

                    Integer.TryParse(reader.GetString("eventid"), thisEvent.e) 'thisEvent.eventid

                    'Integer.TryParse(reader.GetString("NewEventID"), thisEvent.u) 'eventupdateid
                    thisEvent.u = reader.GetString("NewEventID")

                    thisEvent.f = fixtureID
                    thisEvent.d = reader.GetString("EventDescription") 'description
                    'Integer.TryParse(reader.GetString("AwayScore"), thisEvent.awayscore)
                    'Integer.TryParse(reader.GetString("HomeScore"), thisEvent.homescore) 'homescore

                    Dim tempDate As Date = reader.GetMySqlDateTime("EventTime")
                    'thisEvent.et = tempDate.ToString("yyyy-MM-dd HH:mm:ss") 'New way - used for safari 'eventtime

                    Dim tempEndDate As Date = reader.GetMySqlDateTime("EventEndTime")
                    'thisEvent.eet = tempEndDate.ToString("yyyy-MM-dd HH:mm:ss") 'New way - used for safari 'eventendtime
                Catch ex As Exception
                End Try
            End If
        Catch myerror As MySqlException
            'Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            'Logger.LogError("MySql", ex)
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
        Return thisEvent
    End Function

    Public Shared Function GetFixtures(ByVal GameID As Integer, ByVal userid As Integer) As System.Collections.Generic.List(Of Fixture)
        Dim fixtureList As New System.Collections.Generic.List(Of Fixture)
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_GetCurrentFixtures"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_gameid", GameID)
            cmd.Parameters.AddWithValue("_userid", userid)

            reader = cmd.ExecuteReader()

            While reader.Read()
                Try
                    Dim thisFixture As New Fixture
                    Integer.TryParse(reader.GetString("ID"), thisFixture.fixtureid)
                    thisFixture.hometeam = reader.GetString("HomeTeam")
                    thisFixture.awayteam = reader.GetString("AwayTeam")
                    'thisFixture.starttime = reader.GetString("TSKickOff")

                    Dim tempDate As Date = reader.GetMySqlDateTime("TSKickOff")
                    thisFixture.starttime = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari

                    Try
                        tempDate = reader.GetMySqlDateTime("TSFullTime")
                        thisFixture.et = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari
                    Catch ex As Exception
                    End Try

                    thisFixture.venue = reader.GetString("Venue")
                    If Not String.IsNullOrEmpty(thisFixture.hometeam) AndAlso Not String.IsNullOrEmpty(thisFixture.awayteam) Then
                        thisFixture.fixture = thisFixture.hometeam & " V " & thisFixture.awayteam
                    End If
                    Boolean.TryParse(reader.GetBoolean("GameStartedYet"), thisFixture.inplay)

                    Integer.TryParse(reader.GetString("liveGame"), thisFixture.lg)
                    Try
                        tempDate = reader.GetMySqlDateTime("TSBackUpToDiskAfterFullTime")
                        thisFixture.tsftbu = reader.GetString("TSBackUpToDiskAfterFullTime")
                    Catch ex As Exception
                    End Try

                    fixtureList.Add(thisFixture)
                Catch ex As Exception
                End Try
            End While

        Catch myerror As MySqlException
            Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            Logger.LogError("MySql", ex)
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
        Return fixtureList
    End Function

    Public Shared Function GetListOfPlayers(ByVal userid As Integer) As System.Collections.Generic.List(Of Player)
        Dim players As New System.Collections.Generic.List(Of Player)
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_GetPlayers"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userid", userid)

            reader = cmd.ExecuteReader()

            While reader.Read()
                Try
                    Dim thisPlayer As New Player
                    Integer.TryParse(reader.GetString("ID"), thisPlayer.id)
                    thisPlayer.imgurl = reader.GetString("imgurl")
                    thisPlayer.name = reader.GetString("name")
                    thisPlayer.team = reader.GetString("team")
                    players.Add(thisPlayer)
                Catch ex As Exception
                End Try
            End While

        Catch myerror As MySqlException
            Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            Logger.LogError("MySql", ex)
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
        Return players
    End Function

    Public Shared Function GetListOfGoalScorers(ByVal fixtureId As Integer, ByVal userid As Integer) As System.Collections.Generic.List(Of Scorer)
        Dim scorers As New System.Collections.Generic.List(Of Scorer)
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_GetListOfGoalScorersForFixture"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userid", userid)
            cmd.Parameters.AddWithValue("_fixtureid", fixtureId)

            reader = cmd.ExecuteReader()

            While reader.Read()
                Try
                    Dim thisScorer As New Scorer
                    Integer.TryParse(reader.GetString("FBOID"), thisScorer.oid)
                    Integer.TryParse(reader.GetString("PotentialWinnings"), thisScorer.w)
                    thisScorer.d = reader.GetString("description")
                    scorers.Add(thisScorer)
                Catch ex As Exception
                End Try
            End While

        Catch myerror As MySqlException
            Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            Logger.LogError("MySql", ex)
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
        Return scorers
    End Function

    Public Shared Function SetSound(ByVal facebookUserID As String, ByVal userid As Integer, ByVal sound As Integer) As Integer
        Dim newSoundSetting As Integer = -101
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_SetSound"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userid", userid)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)
            cmd.Parameters.AddWithValue("_sound", sound)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Try
                    Integer.TryParse(reader.GetString("newSoundSetting"), newSoundSetting)
                Catch ex As Exception
                End Try
            End If

        Catch myerror As MySqlException
            Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            Logger.LogError("MySql", ex)
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
        Return newSoundSetting
    End Function


    Public Shared Function SetGameLive(ByVal fixtureId As Integer, ByVal userid As Integer) As Integer
        Dim live As Integer = 0
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_SetGameLive"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userid", userid)
            cmd.Parameters.AddWithValue("_fixtureid", fixtureId)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Try
                    Integer.TryParse(reader.GetString("live"), live)
                Catch ex As Exception
                End Try
            End If

        Catch myerror As MySqlException
            Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            Logger.LogError("MySql", ex)
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
        Return live
    End Function


    ' Hash an input string and return the hash as
    ' a 32 character hexadecimal string.
    Public Shared Function getMd5Hash(ByVal input As String) As String
        ' Create a new instance of the MD5 object.
        Dim md5Hasher As MD5 = MD5.Create()

        ' Convert the input string to a byte array and compute the hash.
        Dim data As Byte() = md5Hasher.ComputeHash(System.Text.Encoding.Default.GetBytes(input))

        ' Create a new Stringbuilder to collect the bytes
        ' and create a string.
        Dim sBuilder As New StringBuilder()

        ' Loop through each byte of the hashed data 
        ' and format each one as a hexadecimal string.
        Dim i As Integer
        For i = 0 To data.Length - 1
            sBuilder.Append(data(i).ToString("x2"))
        Next i

        ' Return the hexadecimal string.
        Return sBuilder.ToString()

    End Function

    ' Verify a hash against a string.
    Public Shared Function verifyMd5Hash(ByVal input As String, ByVal hash As String) As Boolean
        ' Hash the input.
        Dim hashOfInput As String = getMd5Hash(input)

        ' Create a StringComparer an comare the hashes.
        Dim comparer As StringComparer = StringComparer.OrdinalIgnoreCase

        If 0 = comparer.Compare(hashOfInput, hash) Then
            Return True
        Else
            Return False
        End If

    End Function





End Class
