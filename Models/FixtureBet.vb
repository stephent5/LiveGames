Imports MySql.Data.MySqlClient

Public Class FixtureBet

    'this class is used to return details of all a fixtures pregame and mid game bets
    Property fbid As Integer
    Property d As String 'description
    Property o As New System.Collections.Generic.List(Of FixtureBetOption) 'options
    Property bm As Boolean = False 'betmade
    Property bs As Integer = -101 ' 0 = pending,1 = bet won , -1 = bet lost (betstatus)
    Property pg As Boolean = True 'pregame
    Property open As Boolean = False
    Property pb As Boolean = False '(placebet)
    Property f As Integer = 0 '(fixtureid)
    Property u As Integer = 0 'userid
    Property fbu As String 'fbuserid
    Property b As Integer = 0 'we use this variable to return to the client the amount of money the user has just bet ( so the client can then update the users credits) (totalcreditsjustbet)
    Property c As Integer = -999999 '(userscreditsforthisgame)
    'Public Property friendsleaderboardlist As New List(Of FriendsLeaderboard) 'Changed to be a list of FriendsLeaderboard objects Stephen 24-Apr 
    'Public Property leagueleaderboardlist As New List(Of Leaderboard)
    Public Property l As Integer '(leagueid)

    Public Property v1 As Integer = -1 'we use this value for taking in the users predictions for a pre game bet ('value1)
    Public Property v2 As Integer = -1 'we use this value for taking in the users predictions for a pre game bet
    Public Property pw As Integer 'we use this value for taking in the users predictions for a pre game bet '(potentialwinnings)

    'this function returns a list of fixture bets 
    'each fixture bet contains a list of the options available for each bet
    Public Shared Function GetFixtureBetDetails(ByVal fixtureID As Integer, ByVal UserID As Integer, Optional ByVal facebookUserID As String = "") As System.Collections.Generic.List(Of FixtureBet)
        Dim theseFixturesDetails As New System.Collections.Generic.List(Of FixtureBet)

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            'Dim query As String = "USP_GetFixtureBetDetails"
            Dim query As String = "USP_GetFixtureBetDetails_v2"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            Dim before As DateTime = DateTime.Now
            reader = cmd.ExecuteReader()
            Dim after As DateTime = DateTime.Now
            Dim span As TimeSpan = after - before

            'Dim currentBetDetails As New FixtureBet
            Dim previousBetId As Integer = -1

            Dim thisFixtureBet As New FixtureBet
            While reader.Read
                Dim currentBetId As Integer = -1
                Integer.TryParse(reader.GetString("FBID"), currentBetId)

                If Not previousBetId = currentBetId Then
                    'This is a new bet detail

                    If previousBetId > 0 Then
                        theseFixturesDetails.Add(thisFixtureBet) 'Add the previous Bet detail to the array
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
                If thisFixtureBetOption.soid > 0 Then
                    Integer.TryParse(reader.GetString("SelectedPotentialWinnings"), thisFixtureBetOption.pw)
                End If

                thisFixtureBetOption.d = reader.GetString("BetOption")
                thisFixtureBetOption.sd = reader.GetString("SelectedBetOption")

                'removed this - stephen 24-july
                'Decimal.TryParse(reader.GetString("odds"), thisFixtureBetOption.odds)

                'new properties - stephen 24-july
                Integer.TryParse(reader.GetString("PotentialWinnings"), thisFixtureBetOption.pw)

                Dim ImageRequired As Integer
                Integer.TryParse(reader.GetString("ImageRequired"), ImageRequired)
                If ImageRequired = 1 Then
                    thisFixtureBetOption.i = reader.GetString("ImageURL")
                End If
                ''end new properties

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
                theseFixturesDetails.Add(thisFixtureBet)
            End If

            'Stephen - 19-July
            'no longer return leaderboards from procedure - instead we will make seperate AJAX requests
            'If theseFixturesDetails.Count > 0 Then 'we have returned some details
            '    'Now return friendsleaderboard
            '    Dim i As Integer = 1
            '    reader.NextResult()
            '    While reader.Read()
            '        Dim leaderboarditem As New FriendsLeaderboard()

            '        leaderboarditem.P = i
            '        leaderboarditem.U = reader("name")
            '        Integer.TryParse(reader("Credits"), leaderboarditem.S)
            '        leaderboarditem.F = reader("FB_UserID")

            '        'leaderboarditem.I = reader("userid")
            '        'If UserID = leaderboarditem.I Then
            '        'leaderboarditem.C = 1
            '        'End If

            '        'Dim tempUserID As Integer = reader("userid")
            '        'If UserID = tempUserID Then
            '        '    leaderboarditem.C = 1
            '        'Else
            '        '    leaderboarditem.C = 0
            '        'End If

            '        Dim ActiveBetID As Integer
            '        Integer.TryParse(reader("betid"), ActiveBetID)
            '        If ActiveBetID > 0 Then
            '            Dim currentBet As New Bet
            '            currentBet.betid = ActiveBetID

            '            Integer.TryParse(reader("amount"), currentBet.amount)
            '            leaderboarditem.B = currentBet

            '            'don't do line below - show credits as is in DB - 
            '            'leaderboarditem.S = leaderboarditem.S + currentBet.amount 'if the user has a bet made - then show theur credits as if they hadn't placed bet

            '            'Button DO set property to tell us we need to add the winnings
            '            leaderboarditem.B.addamount = 1
            '        End If

            '        theseFixturesDetails.Item(0).friendsleaderboardlist.Add(leaderboarditem)
            '        i = i + 1
            '    End While

            '    'get LeagueId
            '    reader.NextResult()
            '    If reader.Read Then
            '        Integer.TryParse(reader("LeagueID"), theseFixturesDetails.Item(0).leagueid)
            '    End If

            '    i = 1
            '    Dim currentUserInList As Boolean = False
            '    'Now return overallleaderboard
            '    reader.NextResult()
            '    While reader.Read()
            '        Dim leaderboarditem As New Leaderboard()

            '        leaderboarditem.P = i
            '        leaderboarditem.U = reader("name")
            '        Integer.TryParse(reader("Credits"), leaderboarditem.S)
            '        'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.C)
            '        leaderboarditem.F = reader("FB_UserID")


            '        'Added this Stephen 1-Dec
            '        Dim tempDate As Date = reader.GetMySqlDateTime("TimeStamp")
            '        If i = 1 Then
            '            'Only add the timestamp for the FIRST Item - it is the same for all items and only referenced from the first item in the list
            '            leaderboarditem.T = tempDate.ToString("MM/dd/yyyy HH:mm:ss")
            '        End If

            '        'leaderboarditem.I = reader("userid")
            '        'If UserID = leaderboarditem.I Then
            '        '    leaderboarditem.C = 1
            '        '    currentUserInList = True
            '        '    theseFixturesDetails.Item(0).userscreditsforthisgame = leaderboarditem.S
            '        'Else
            '        '    leaderboarditem.C = 0
            '        'End If

            '        Dim tempUserID As Integer = reader("userid")
            '        If UserID = tempUserID Then
            '            'leaderboarditem.C = 1
            '            currentUserInList = True
            '            theseFixturesDetails.Item(0).userscreditsforthisgame = leaderboarditem.S
            '        Else
            '            'leaderboarditem.C = 0
            '        End If

            '        theseFixturesDetails.Item(0).leagueleaderboardlist.Add(leaderboarditem)
            '        i = i + 1
            '    End While

            '    If currentUserInList = False Then
            '        reader.NextResult()
            '        While reader.Read()
            '            Dim leaderboarditem As New Leaderboard()

            '            leaderboarditem.P = reader("position")
            '            leaderboarditem.U = reader("name")
            '            Integer.TryParse(reader("Credits"), leaderboarditem.S)
            '            'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.C)
            '            leaderboarditem.F = reader("FB_UserID")

            '            'leaderboarditem.I = reader("userid")
            '            'If UserID = leaderboarditem.I Then
            '            '    currentUserInList = True
            '            '    leaderboarditem.C = 1
            '            'Else
            '            '    leaderboarditem.C = 0
            '            'End If

            '            Dim tempUserID As Integer = reader("userid")
            '            If UserID = tempUserID Then
            '                'leaderboarditem.C = 1
            '                currentUserInList = True
            '            Else
            '                'leaderboarditem.C = 0
            '            End If

            '            theseFixturesDetails.Item(0).userscreditsforthisgame = leaderboarditem.S
            '            theseFixturesDetails.Item(0).leagueleaderboardlist.Add(leaderboarditem)
            '        End While
            '    End If
            '    'end of overallleaderboard
            'End If





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
        Return theseFixturesDetails
    End Function

    Public Shared Function CalculatePreGame(ByVal fixtureID As Integer, ByVal fbid As Integer, ByVal v1 As Integer, ByVal v2 As Integer, Optional ByVal userid As Integer = -1) As Integer
        Dim PotentialWinnings As Integer = -1
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand

        conn.Open()

        Try
            Dim query As String = "USP_CalculatePreGame"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", userid)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_fbid", fbid)
            cmd.Parameters.AddWithValue("_v1", v1)
            cmd.Parameters.AddWithValue("_v2", v2)

            reader = cmd.ExecuteReader()
            If reader.Read Then
                Integer.TryParse(reader.GetString("PotentialWinnings"), PotentialWinnings)
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
        End Try
        Return PotentialWinnings
    End Function

    Public Shared Function PlacePreGameBets(ByVal bets As System.Collections.Generic.List(Of FixtureBet)) As Integer
        Dim totalCreditsBet As Integer = 0
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            'loop through each bet in the list 
            'and place each bet that needs to be placed
            For Each preGameBet As FixtureBet In bets

                If preGameBet.pb Then
                    'this bet should be placed now

                    'loop through the bet options for this bet and place the appropriate bet option

                    For Each betoption As FixtureBetOption In preGameBet.o
                        If betoption.soid > 0 Or preGameBet.v1 >= 0 Then
                            'the user has selected an option bet there are no odds
                            'this means ..this is the newly selected bet option
                            'place this in DB!!!!!!!
                            Try
                                'Dim query As String = "USP_PlacePreGameBet"
                                Dim query As String = "USP_PlacePreGameBet_v2"
                                cmd = New MySqlCommand(query, conn)
                                cmd.CommandType = CommandType.StoredProcedure
                                cmd.Parameters.AddWithValue("_userID", preGameBet.u)
                                cmd.Parameters.AddWithValue("_fixtureID", preGameBet.f)
                                cmd.Parameters.AddWithValue("_fbid", preGameBet.fbid)
                                cmd.Parameters.AddWithValue("_fboid", betoption.soid)

                                'removed these 
                                'cmd.Parameters.AddWithValue("_odds", betoption.odds)
                                'cmd.Parameters.AddWithValue("_amount", betoption.amount)

                                cmd.Parameters.AddWithValue("_odds", DBNull.Value)
                                cmd.Parameters.AddWithValue("_amount", DBNull.Value)

                                cmd.Parameters.AddWithValue("_v1", preGameBet.v1)
                                cmd.Parameters.AddWithValue("_v2", preGameBet.v2)

                                Dim newBetID As Integer

                                reader = cmd.ExecuteReader()
                                If reader.Read Then
                                    Integer.TryParse(reader.GetString("betID"), newBetID)
                                    totalCreditsBet = totalCreditsBet + 1
                                End If
                                'If newBetID > 0 Then
                                '    totalCreditsBet = totalCreditsBet + betoption.amount
                                'End If
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
                            End Try
                            'we have found the users selection ..so stop looping through all posible bet options
                            Exit For
                        End If
                    Next
                End If
            Next
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
            Try
                conn.Dispose()
                conn.Close()
            Catch ex As Exception
            End Try
        End Try
        Return totalCreditsBet 'this value now holds the number of bets we just made!!!!
    End Function

    'We now place each bet one bet at a time
    Public Shared Function PlacePreGameBet(ByVal userid As Integer, ByVal fu As String, ByVal fixtureid As Integer, ByVal fbid As Integer, ByVal fboid As Integer, ByVal value1 As String, ByVal value2 As String) As Integer
        Dim newBetID As Integer = 0
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Try
                Dim query As String = "USP_PlacePreGameBet_v2"
                cmd = New MySqlCommand(query, conn)
                cmd.CommandType = CommandType.StoredProcedure
                cmd.Parameters.AddWithValue("_userID", userid)
                cmd.Parameters.AddWithValue("_facebookUserID", fu)
                cmd.Parameters.AddWithValue("_fixtureID", fixtureid)
                cmd.Parameters.AddWithValue("_fbid", fbid)
                cmd.Parameters.AddWithValue("_fboid", fboid)

                'removed these 
                'cmd.Parameters.AddWithValue("_odds", betoption.odds)
                'cmd.Parameters.AddWithValue("_amount", betoption.amount)

                cmd.Parameters.AddWithValue("_odds", DBNull.Value)
                cmd.Parameters.AddWithValue("_amount", DBNull.Value)


                If String.IsNullOrEmpty(value1) Then
                    cmd.Parameters.AddWithValue("_v1", -1)
                Else
                    cmd.Parameters.AddWithValue("_v1", value1)
                End If

                If String.IsNullOrEmpty(value2) Then
                    cmd.Parameters.AddWithValue("_v2", -1)
                Else
                    cmd.Parameters.AddWithValue("_v2", value2)
                End If

                reader = cmd.ExecuteReader()
                If reader.Read Then
                    Integer.TryParse(reader.GetString("betID"), newBetID)
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
            End Try
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
            Try
                conn.Dispose()
                conn.Close()
            Catch ex As Exception
            End Try
        End Try
        Return newBetID
    End Function



End Class

