Imports MySql.Data.MySqlClient

'This class is needed as I need to return the number of users in the league
'This is initially for when we are sending the data via SignalR - after an event
Public Class LeaderboardExtra

    Public Property LeaderboardList As New List(Of Leaderboard)
    Public Property TotalUsersInLeague As Integer

    'leave this pointing to write db as this is the league we will return to all the users from the admin
    'after an event and we dont want to take the chance of sending back data theat is not 100% up to date
    Public Shared Function GetLeagueDetails(ByVal USerID As Integer, ByVal LeagueID As Integer, Optional ByVal facebookUserID As String = "", Optional ByVal isAdmin As Integer = -1) As LeaderboardExtra
        Dim thisLeaderboardExtra As New LeaderboardExtra
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
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

                    thisLeaderboardExtra.LeaderboardList.Add(leaderboarditem)
                    i = i + 1
                Catch ex As Exception
                End Try
            End While

            If currentUserInList = False And isAdmin = 0 Then
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

                    thisLeaderboardExtra.LeaderboardList.Add(leaderboarditem)
                End While
            End If

            'now get the number of people in the league
            reader.NextResult()
            If reader.Read() Then
                Integer.TryParse(reader("TotalUsersInLeague"), thisLeaderboardExtra.TotalUsersInLeague)
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

        'Return LeaderboardList
        Return thisLeaderboardExtra


    End Function

End Class
