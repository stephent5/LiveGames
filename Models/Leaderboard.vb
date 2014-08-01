Imports MySql.Data.MySqlClient

Public Class Leaderboard

    'Altered all the properties to only have one character - 23-Apr-12
    'The reason for this is to reduce the size of the leaderboard
    'which we send via Lightstreamer - current data is too big - every character counts!!!!!

    'Extra Note - Stephen 24-Apr
    'the only difference between the FriendsLeaderboard class and the Leaderboard class is that the friends leaderboard
    'needs the Bet object. We dont use this object in displaying the overall leaderboard so the Leaderboard class can do without it.
    'Again this is to reduce unneccessary data sent back in our API's - particularly our Lightstream data.

    Public Property P As Integer '_Pos
    Public Property U As String '_Username
    Public Property S As Integer '_Credits (S is for Score)

    'We dont need a property telling us that this user is the current user - we can just compare the fbid in the javascript
    'Public Property C As Integer = 0 '_CurrentUser 'changed from a boolean as false and true are 3 characters more than 1 or 0

    Public Property F As String '_FBUserIDList
    'Public Property I As Integer '_UserID 'User ID is not used by either the FriendsLeaderboard or the Leaderboard object - removed stephen 24-Apr
    Public Property T As String 'Added Stephen 1-Dec-11 'TimeStamp

    Public Property I As String 'Added Stephen 8-Nov-12 - this is the Image associated with the user in the position 

    Public Function GetOverAllLeaderBoard(ByVal GameID As Integer, ByVal UserID As String) As List(Of Leaderboard)
        Dim LeaderboardList As New List(Of Leaderboard)
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            ' MessageBox.Show("Connection Opened Successfully")
            'Dim query As String = "USP_GetOverallLeaderBoardv1"
            Dim query As String = "USP_GetOverallLeaderBoard_v2"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_GameID", GameID)
            cmd.Parameters.AddWithValue("_UserID", UserID)
            reader = cmd.ExecuteReader()
            Dim i As Integer = 1

            Dim currentUserInList As Boolean = False
            While reader.Read()
                Dim leaderboarditem As New Leaderboard()

                leaderboarditem.P = i
                leaderboarditem.U = reader("name")
                Integer.TryParse(reader("Credits"), leaderboarditem.S)
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

                LeaderboardList.Add(leaderboarditem)
                i = i + 1
            End While

            If currentUserInList = False Then
                reader.NextResult()
                While reader.Read()
                    Dim leaderboarditem As New Leaderboard()

                    leaderboarditem.P = reader("position")
                    leaderboarditem.U = reader("name")
                    Integer.TryParse(reader("Credits"), leaderboarditem.S)
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

                    LeaderboardList.Add(leaderboarditem)
                End While
            End If

            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            'Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            'Logger.LogError("MySql", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try

        Return LeaderboardList


    End Function


    Public Function GetFacebookFriendsLeaderboard(ByVal GameID As Integer, ByVal fbUserID As String, ByVal currentUserID As Integer) As List(Of Leaderboard)
        Dim LeaderboardList As New List(Of Leaderboard)
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            ' MessageBox.Show("Connection Opened Successfully")
            Dim query As String = "USP_GetFacebookFriendsLeaderboardv1"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_fbid", fbUserID)
            cmd.Parameters.AddWithValue("_gameid", 1)
            cmd.Parameters.AddWithValue("_currentuserid", currentUserID)
            reader = cmd.ExecuteReader()
            Dim i As Integer = 1

            Dim currentUserInList As Boolean = False
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
                'If currentUserID = leaderboarditem.I Then
                '    currentUserInList = True
                'End If

                Dim tempUserID As Integer = reader("userid")
                If currentUserID = tempUserID Then
                    'leaderboarditem.C = 1
                    currentUserInList = True
                Else
                    'leaderboarditem.C = 0
                End If

                LeaderboardList.Add(leaderboarditem)
                i = i + 1
            End While

            If currentUserInList = False Then
                reader.NextResult()
                While reader.Read()
                    Dim leaderboarditem As New Leaderboard()

                    leaderboarditem.P = reader("position")
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
                    'If currentUserID = leaderboarditem.I Then
                    '    currentUserInList = True
                    'End If

                    Dim tempUserID As Integer = reader("userid")
                    If currentUserID = tempUserID Then
                        'leaderboarditem.C = 1
                        currentUserInList = True
                    Else
                        'leaderboarditem.C = 0
                    End If

                    LeaderboardList.Add(leaderboarditem)
                End While
            End If

            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            'Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            'Logger.LogError("MySql", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try

        Return LeaderboardList
    End Function

    Public Shared Function GetLeague(ByVal USerID As Integer, ByVal LeagueID As Integer, Optional ByVal facebookUserID As String = "", Optional ByVal isAdmin As Integer = -1) As List(Of Leaderboard)
        Dim LeaderboardList As New List(Of Leaderboard)
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            Dim query As String = "USP_GetLeagueLeaderboard_v2"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_leagueid", LeagueID)
            cmd.Parameters.AddWithValue("_currentuserid", USerID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)
            cmd.Parameters.AddWithValue("_isAdmin", isAdmin)

            Dim i As Integer = 1
            Dim currentUserInList As Boolean = False
            Dim Position As Integer = 0

            'Dim TimeBefore As Long = (DateTime.Now - New DateTime(1970, 1, 1)).TotalMilliseconds


            Dim before As DateTime = DateTime.Now
            reader = cmd.ExecuteReader()
            Dim after As DateTime = DateTime.Now
            Dim span As TimeSpan = after - before
            Dim it As Integer = 1

            Dim facebookprofilepicurl As String = ConfigurationManager.AppSettings("FacebookProfilePicURL")

            'reader = cmd.ExecuteReader()
            While reader.Read()
                Try
                    Position = Position + 1
                    Dim leaderboarditem As New Leaderboard()

                    leaderboarditem.P = Position
                    leaderboarditem.U = reader("name")
                    Integer.TryParse(reader("Credits"), leaderboarditem.S)
                    'Boolean.TryParse(reader("CurrentUser"), leaderboarditem.C)
                    leaderboarditem.F = reader("FB_UserID")

                    leaderboarditem.I = reader("ProfilePic")
                    'what we are doing here is removing facebookprofilepicurl from the imageurl which we return
                    'this is usually https://graph.facebook.com/
                    'the reason we are doing this is that we want to send as little data as possible back to the user!!!
                    If leaderboarditem.I.IndexOf(facebookprofilepicurl) > -1 Then
                        leaderboarditem.I = leaderboarditem.I.Replace(facebookprofilepicurl, "")
                    End If

                    'Added this Stephen 1-Dec
                    Dim tempDate As Date = reader.GetMySqlDateTime("TimeStamp")

                    If Position = 1 Then
                        'Only add the timestamp for the FIRST Item - it is the same for all items and only referenced from the first item in the list
                        leaderboarditem.T = tempDate.ToString("MM/dd/yyyy HH:mm:ss")
                    End If

                    'leaderboarditem.I = reader("userid")
                    'If USerID = leaderboarditem.I Then
                    '    currentUserInList = True
                    '    leaderboarditem.C = 1
                    'Else
                    '    leaderboarditem.C = 0
                    'End If

                    Dim tempUserID As Integer = reader("userid")
                    If USerID = tempUserID Then
                        'leaderboarditem.C = 1
                        currentUserInList = True
                    Else
                        'leaderboarditem.C = 0
                    End If

                    LeaderboardList.Add(leaderboarditem)
                    i = i + 1
                Catch ex As Exception
                End Try
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
                    'If USerID = leaderboarditem.I Then
                    '    currentUserInList = True
                    '    leaderboarditem.C = 1
                    'Else
                    '    leaderboarditem.C = 0
                    'End If

                    Dim tempUserID As Integer = reader("userid")
                    If USerID = tempUserID Then
                        'leaderboarditem.C = 1
                        currentUserInList = True
                    Else
                        'leaderboarditem.C = 0
                    End If

                    LeaderboardList.Add(leaderboarditem)
                End While
            End If
            Dim TimeAfter As Long = (DateTime.Now - New DateTime(1970, 1, 1)).TotalMilliseconds
            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            'Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            'Logger.LogError("MySql", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try

        Return LeaderboardList


    End Function

End Class
