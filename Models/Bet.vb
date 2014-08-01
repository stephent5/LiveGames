Imports MySql.Data.MySqlClient
Imports System.Net
Imports System.IO
Imports System.Configuration
Imports System.Net.Http
Imports System.Threading.Tasks

Public Class Bet

    'Input Params
    Public Property userid As Integer
    Public Property fixtureid As Integer
    Public Property eventid As Integer
    Public Property eventdesc As String
    Public Property amount As Integer
    Public Property odds As Decimal
    Public Property newodds As Decimal 'Added this Stephen 22-Mar-12 - why was this not here before?????

    'Output params
    Public Property betid As Integer = -1
    Public Property betdescription As String
    Public Property creditsremaining As Integer
    Public Property betresult As String
    Public Property creditsearned As Integer
    Public Property newcredits As Integer
    Public Property betcomplete As Boolean = False

    Public Property user As User 'FacebookUser

    Public Property status As Integer   '-1 = Failed,0 = Pending,1 = complete 

    Public Property eventtime As String
    Public Property numattempts As Integer
    Public Property addamount As Integer = 0 'this property tells us if we  need to add the amount bet to the credits earned when displaying the new total (after a win)

    'these two param's are used if the user has an active bet in the DB but manages to place another bet (most likely due to losing connection before the DB can tell the client the bet was made)
    'these two variables tell the client which event to return to it's unselected ( or unloading) state
    Public Property incorrectEventID As Integer
    Public Property incorrectOdds As Decimal

    Public Property friendsleaderboardlist As New List(Of FriendsLeaderboard) 'Changed to be a list of FriendsLeaderboard objects Stephen 24-Apr 
    Public Property leagueleaderboardlist As New List(Of Leaderboard)
    Public Property leagueid As Integer
    Public Property unlockcredits As Integer

    'Stephen added these 23-Mar-12 - Use these varibales to determine of the user can bet up to 200 - also to increment the bet counter
    Public Property numbetsplaced As Integer
    Public Property numbetstounlockhigherlevel As Integer

    Public Sub New()
        'status = 0 '- initially set to pending
    End Sub

    

    'Public Async Function PlaceBetAsync(Optional ByVal facebookUserID As String = "") As Task(Of Bet)
    '    Dim conn As New MySqlConnection
    '    conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
    '    Dim connResponse As New MySqlConnection
    '    Dim reader As MySqlDataReader
    '    Dim cmd As MySqlCommand
    '    Try
    '        conn.Open()

    '        Dim query As String = "USP_PlaceBet_v2"
    '        cmd = New MySqlCommand(query, conn)
    '        cmd.CommandType = CommandType.StoredProcedure
    '        cmd.Parameters.AddWithValue("_userID", userid)
    '        cmd.Parameters.AddWithValue("_eventID", eventid)
    '        cmd.Parameters.AddWithValue("_fixtureID", fixtureid)
    '        cmd.Parameters.AddWithValue("_amount", amount)
    '        cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

    '        reader = cmd.ExecuteReader()

    '        If reader.Read() Then
    '            Try
    '                betdescription = reader.GetString("BetResult")
    '                eventdesc = reader.GetString("Event")
    '                Integer.TryParse(reader.GetString("BetId"), betid)
    '                Integer.TryParse(reader.GetString("Credits"), creditsremaining)
    '                Decimal.TryParse(reader.GetString("odds"), odds)
    '                If betid > 0 Then
    '                    Dim tempDate As Date = reader.GetMySqlDateTime("eventtime")
    '                    'eventtime = tempDate.ToString("yyyy-MM-dd HH:mm:ss") + ".0" 'Old way - changed for safari
    '                    eventtime = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari
    '                End If

    '                Dim existingBetId As Integer
    '                Integer.TryParse(reader.GetString("existingBetId"), existingBetId)
    '                Integer.TryParse(reader.GetString("unlockcredits"), unlockcredits)

    '                'Added Stephen 23-MAR-12
    '                Integer.TryParse(reader.GetString("NumBetsMade"), numbetsplaced)
    '                Integer.TryParse(reader.GetString("NumBetsToUnlockHigherLevel"), numbetstounlockhigherlevel)

    '                If existingBetId > 0 Then
    '                    'this means that the user alrteady has an existing bet in the DB 
    '                    'so..update this bet object to be the previous bet object (as the DB is ALWAYS the master- not the client)
    '                    eventid = existingBetId
    '                    Integer.TryParse(reader.GetString("existingAmount"), amount)

    '                    Integer.TryParse(reader.GetString("incorrectEventID"), incorrectEventID)
    '                    Decimal.TryParse(reader.GetString("incorrectOdds"), incorrectOdds)
    '                End If

    '            Catch ex As Exception
    '            End Try
    '        End If

    '        If betid <= 0 Then 'Bet was not placed - so set status to -1 
    '            status = -1
    '        Else
    '            status = 0 'Pending
    '        End If


    '    Catch myerror As MySqlException
    '        'Logger.LogError("MySql", myerror)
    '        T5Error.LogError("VB", myerror.ToString)
    '        betid = -101 'Error creating bet in DB
    '    Catch ex As Exception
    '        'Logger.LogError("MySql", ex)
    '        T5Error.LogError("VB", ex.ToString)
    '        betid = -101 'Error creating bet in DB
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
    '    Return Me
    'End Function

    'Public Async Function PlaceBetAsync(Optional ByVal facebookUserID As String = "") As Task(Of Bet)
    '    Dim conn As New MySqlConnection
    '    conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
    '    Dim connResponse As New MySqlConnection
    '    Dim reader As MySqlDataReader
    '    Dim cmd As MySqlCommand
    '    Try
    '        conn.Open()
    '        'Dim query As String = "USP_PlaceBet"
    '        Dim query As String = "USP_PlaceBet_v2"
    '        cmd = New MySqlCommand(query, conn)
    '        cmd.CommandType = CommandType.StoredProcedure
    '        cmd.Parameters.AddWithValue("_userID", userid)
    '        cmd.Parameters.AddWithValue("_eventID", eventid)
    '        cmd.Parameters.AddWithValue("_fixtureID", fixtureid)
    '        cmd.Parameters.AddWithValue("_amount", amount)
    '        cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

    '        reader = cmd.ExecuteReader()

    '        If reader.Read() Then
    '            Try
    '                betdescription = reader.GetString("BetResult")
    '                eventdesc = reader.GetString("Event")
    '                Integer.TryParse(reader.GetString("BetId"), betid)
    '                Integer.TryParse(reader.GetString("Credits"), creditsremaining)
    '                Decimal.TryParse(reader.GetString("odds"), odds)
    '                If betid > 0 Then
    '                    Dim tempDate As Date = reader.GetMySqlDateTime("eventtime")
    '                    'eventtime = tempDate.ToString("yyyy-MM-dd HH:mm:ss") + ".0" 'Old way - changed for safari
    '                    eventtime = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari
    '                End If

    '                Dim existingBetId As Integer
    '                Integer.TryParse(reader.GetString("existingBetId"), existingBetId)
    '                Integer.TryParse(reader.GetString("unlockcredits"), unlockcredits)

    '                'Added Stephen 23-MAR-12
    '                Integer.TryParse(reader.GetString("NumBetsMade"), numbetsplaced)
    '                Integer.TryParse(reader.GetString("NumBetsToUnlockHigherLevel"), numbetstounlockhigherlevel)

    '                If existingBetId > 0 Then
    '                    'this means that the user alrteady has an existing bet in the DB 
    '                    'so..update this bet object to be the previous bet object (as the DB is ALWAYS the master- not the client)
    '                    eventid = existingBetId
    '                    Integer.TryParse(reader.GetString("existingAmount"), amount)

    '                    Integer.TryParse(reader.GetString("incorrectEventID"), incorrectEventID)
    '                    Decimal.TryParse(reader.GetString("incorrectOdds"), incorrectOdds)
    '                End If

    '            Catch ex As Exception
    '            End Try
    '        End If

    '        If betid <= 0 Then 'Bet was not placed - so set status to -1 
    '            status = -1
    '        Else
    '            status = 0 'Pending
    '        End If

    '    Catch myerror As MySqlException
    '        'Logger.LogError("MySql", myerror)
    '        'T5Error.LogError("VB", myerror.ToString)
    '        betid = -101 'Error creating bet in DB
    '    Catch ex As Exception
    '        'Logger.LogError("MySql", ex)
    '        'T5Error.LogError("VB", ex.ToString)
    '        betid = -101 'Error creating bet in DB
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
    '    Return Me
    'End Function

    Public Function PlaceBet(Optional ByVal facebookUserID As String = "") As Bet
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            'Dim query As String = "USP_PlaceBet"
            Dim query As String = "USP_PlaceBet_v2"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", userid)
            cmd.Parameters.AddWithValue("_eventID", eventid)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureid)
            cmd.Parameters.AddWithValue("_amount", amount)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Try
                    betdescription = reader.GetString("BetResult")
                    eventdesc = reader.GetString("Event")
                    Integer.TryParse(reader.GetString("BetId"), betid)
                    Integer.TryParse(reader.GetString("Credits"), creditsremaining)
                    Decimal.TryParse(reader.GetString("odds"), odds)
                    If betid > 0 Then
                        Dim tempDate As Date = reader.GetMySqlDateTime("eventtime")
                        'eventtime = tempDate.ToString("yyyy-MM-dd HH:mm:ss") + ".0" 'Old way - changed for safari
                        eventtime = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari
                    End If

                    Dim existingBetId As Integer
                    Integer.TryParse(reader.GetString("existingBetId"), existingBetId)
                    Integer.TryParse(reader.GetString("unlockcredits"), unlockcredits)

                    'Added Stephen 23-MAR-12
                    Integer.TryParse(reader.GetString("NumBetsMade"), numbetsplaced)
                    Integer.TryParse(reader.GetString("NumBetsToUnlockHigherLevel"), numbetstounlockhigherlevel)

                    If existingBetId > 0 Then
                        'this means that the user alrteady has an existing bet in the DB 
                        'so..update this bet object to be the previous bet object (as the DB is ALWAYS the master- not the client)
                        eventid = existingBetId
                        Integer.TryParse(reader.GetString("existingAmount"), amount)

                        Integer.TryParse(reader.GetString("incorrectEventID"), incorrectEventID)
                        Decimal.TryParse(reader.GetString("incorrectOdds"), incorrectOdds)
                    End If

                Catch ex As Exception
                End Try
            End If

            If betid <= 0 Then 'Bet was not placed - so set status to -1 
                status = -1
            Else
                status = 0 'Pending
            End If

            'Stephen - 19-July
            'no longer return leaderboards from procedure - instead we will make seperate AJAX requests
            ''Now return friendsleaderboard
            'Dim i As Integer = 1
            'reader.NextResult()
            'While reader.Read()
            '    Try
            '        Dim leaderboarditem As New FriendsLeaderboard()

            '        leaderboarditem.P = i
            '        leaderboarditem.U = reader("name")
            '        Integer.TryParse(reader("Credits"), leaderboarditem.S)
            '        leaderboarditem.F = reader("FB_UserID")



            '        'Dim tempUserID As Integer = reader("userid")
            '        'If userid = tempUserID Then
            '        '    leaderboarditem.C = 1
            '        'End If

            '        Dim ActiveBetID As Integer
            '        Integer.TryParse(reader("betid"), ActiveBetID)
            '        If ActiveBetID > 0 Then
            '            Dim currentBet As New Bet
            '            currentBet.betid = ActiveBetID
            '            Integer.TryParse(reader("amount"), currentBet.amount)
            '            leaderboarditem.B = currentBet

            '            'don't do line below - show credits as is in DB - 
            '            'leaderboarditem.Credits = leaderboarditem.Credits + currentBet.amount 'if the user has a bet made - then show theur credits as if they hadn't placed bet

            '            'Button DO set property to tell us we need to add the winnings
            '            leaderboarditem.B.addamount = 1
            '        End If

            '        friendsleaderboardlist.Add(leaderboarditem)
            '        i = i + 1
            '    Catch ex As Exception
            '        T5Error.LogError("VB", ex.ToString)
            '    End Try
            'End While

            ''get LeagueId
            'reader.NextResult()
            'If reader.Read Then
            '    Integer.TryParse(reader("LeagueID"), leagueid)
            'End If

            'i = 1
            'Dim currentUserInList As Boolean = False
            ''Now return overallleaderboard
            'reader.NextResult()
            'While reader.Read()
            '    Try
            '        Dim leaderboarditem As New Leaderboard()

            '        leaderboarditem.P = i
            '        leaderboarditem.U = reader("name")
            '        Integer.TryParse(reader("Credits"), leaderboarditem.S)

            '        'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.CurrentUser)
            '        leaderboarditem.F = reader("FB_UserID")


            '        'Added this Stephen 1-Dec
            '        Dim tempDate As Date = reader.GetMySqlDateTime("TimeStamp")
            '        If i = 1 Then
            '            'Only add the timestamp for the FIRST Item - it is the same for all items and only referenced from the first item in the list
            '            leaderboarditem.T = tempDate.ToString("MM/dd/yyyy HH:mm:ss")
            '        End If

            '        Dim tempUserID As String = reader("userid")
            '        If userid = tempUserID Then
            '            currentUserInList = True
            '            'leaderboarditem.C = 1
            '        Else
            '            'leaderboarditem.C = 0
            '        End If

            '        'leaderboarditem.I = reader("userid")
            '        'If userid = leaderboarditem.I Then
            '        '    currentUserInList = True
            '        '    leaderboarditem.C = 1
            '        'Else
            '        '    leaderboarditem.C = 0
            '        'End If

            '        leagueleaderboardlist.Add(leaderboarditem)
            '        i = i + 1
            '    Catch ex As Exception
            '        T5Error.LogError("VB", ex.ToString)
            '    End Try

            'End While

            'If currentUserInList = False Then
            '    reader.NextResult()
            '    While reader.Read()
            '        Try
            '            Dim leaderboarditem As New Leaderboard()

            '            leaderboarditem.P = reader("position")
            '            leaderboarditem.U = reader("name")
            '            Integer.TryParse(reader("Credits"), leaderboarditem.S)

            '            'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.CurrentUser)
            '            leaderboarditem.F = reader("FB_UserID")


            '            'leaderboarditem.I = reader("userid")
            '            'If userid = leaderboarditem.I Then
            '            '    currentUserInList = True
            '            '    leaderboarditem.C = 1
            '            'Else
            '            '    leaderboarditem.C = 0
            '            'End If

            '            Dim tempUserID As Integer = reader("userid")
            '            If userid = tempUserID Then
            '                currentUserInList = True
            '                'leaderboarditem.C = 1
            '            Else
            '                'leaderboarditem.C = 0
            '            End If

            '            leagueleaderboardlist.Add(leaderboarditem)
            '        Catch ex As Exception
            '            T5Error.LogError("VB", ex.ToString)
            '        End Try

            '    End While
            'End If
            ''end of overallleaderboard

        Catch myerror As MySqlException
            'Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
            betid = -101 'Error creating bet in DB
        Catch ex As Exception
            'Logger.LogError("MySql", ex)
            T5Error.LogError("VB", ex.ToString)
            betid = -101 'Error creating bet in DB
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
        Return Me
    End Function

    Public Sub ForFeitBet(Optional ByVal facebookUserID As String = "")
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_ForfeitBet_v2"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", userid)
            cmd.Parameters.AddWithValue("_betid", betid)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureid)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader.GetString("ForfeitResult"), status)

                If status = -103 Then 'the bet was forfeit 
                    'We want to return 
                    Integer.TryParse(reader.GetString("eventid"), eventid)

                    '- check to see if the event the user bet on has changed odds
                    Dim tempOdds As Decimal
                    Decimal.TryParse(reader.GetString("NewOdds"), tempOdds)

                    If Not tempOdds = odds Then
                        newodds = tempOdds 'the odds for the forfeit event ARE different!!!!!!!!!
                    End If
                End If
            End If

        Catch myerror As MySqlException
            'Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
            betid = -101 'Error creating bet in DB
        Catch ex As Exception
            'Logger.LogError("MySql", ex)
            T5Error.LogError("VB", ex.ToString)
            betid = -101 'Error creating bet in DB
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

    Public Function checkBet() As Bet
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_CheckBet"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_betID", betid)
           
            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Try
                    Dim tempStatuscheck As Integer
                    Integer.TryParse(reader.GetString("betStatus"), tempStatuscheck)

                    If tempStatuscheck = -101 Then
                        'Bet has either not been comleted yet (i.e. we are still wating for an event after the users bet)
                        'or the bet has already been checked ( and the details already returned)
                        'Either way .... if we get here we should ignore all details returned and we should NOt update anything!!!
                    ElseIf tempStatuscheck = 1 Then
                        status = 1  'Bet has been won!!!!

                        betresult = reader.GetString("betResult")
                        Integer.TryParse(reader.GetString("winnings"), creditsearned)
                        Integer.TryParse(reader.GetString("newcredits"), newcredits)
                        betcomplete = True
                    ElseIf tempStatuscheck = -1 Then
                        status = -1  'Bet has been lost!!!!
                        betresult = reader.GetString("betResult")
                        betcomplete = True
                    End If
                Catch ex As Exception
                End Try
            End If
        Catch myerror As MySqlException
            Logger.LogError("MySql", myerror)
        Catch ex As Exception
            Logger.LogError("MySql", ex)
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
    End Function

End Class
