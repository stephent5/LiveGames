'updated 8-nov
Imports MySql.Data.MySqlClient

Public Class FriendsLeaderboard

    'Altered all the properties to only have one character - 23-Apr-12
    'The reason for this is to reduce the size of the leaderboard
    'which we send via Lightstreamer - current data is too big - every character counts!!!!!

    'Extra Note - Stephen 24-Apr
    'the only difference between the FriendsLeaderboard class and the Leaderboard class is that the friends leaderboard
    'needs the Bet object. We dont use this object in displaying the overall leaderboard so the Leaderboard class can do without it.
    'Again this is to reduce unneccessary data sent back in our API's - particularly our Lightstream data.

    'Also - FriendsLEaderboard no longer has T( i.e. TimeStamp propert) - this is only used for overall leaderboard

    Public Property P As Integer '_Pos
    Public Property U As String '_Username
    Public Property S As Integer '_Credits (S is for Score)

    'We dont need a property telling us that this user is the current user - we can just compare the fbid in the javascript
    'Public Property C As Integer = 0 '_CurrentUser 'changed from a boolean as false and true are 3 characters more than 1 or 0

    Public Property F As String '_FBUserIDList
    'Public Property I As Integer '_UserID 'User ID is not used by either the FriendsLeaderboard or the Leaderboard object - removed stephen 24-Apr
    Public Property B As Bet 'Added Stephen 24-Nov-11 'CurrentBet
    'Public Property T As String 'Added Stephen 1-Dec-11 'TimeStamp - removed stephen 24-Apr

    Public Property I As String 'Added Stephen 8-Nov-12 - this is the Image associated with the user in the position 

    Public Shared Function GetFriendsLeaderboard(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal FriendList As String, Optional ByVal facebookUserID As String = "") As List(Of FriendsLeaderboard)
        Dim LeaderboardList As New List(Of FriendsLeaderboard)
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            'Dim query As String = "USP_GetFriendsLeaderboard"
            Dim query As String = "USP_GetFriendsLeaderboard_v2"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_friendList", FriendList)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            Dim before As DateTime = DateTime.Now
            reader = cmd.ExecuteReader()
            Dim after As DateTime = DateTime.Now
            Dim span As TimeSpan = after - before
            Dim facebookprofilepicurl As String = ConfigurationManager.AppSettings("FacebookProfilePicURL")
            Dim i As Integer = 1

            While reader.Read()
                Try
                    Dim leaderboarditem As New FriendsLeaderboard()

                    leaderboarditem.P = i

                    Dim nickName As String = reader("NickName")
                    Dim name As String = reader("name")

                    If Not name = nickName Then
                        'the user HAS set a nickname - so display this in the friend leaderboard
                        name = name & " <span class='nick'>" & nickName & "</span>"
                    End If
                    leaderboarditem.U = name
                    Integer.TryParse(reader("Credits"), leaderboarditem.S)
                    leaderboarditem.F = reader("FB_UserID")

                    leaderboarditem.I = reader("ProfilePic")
                    'what we are doing here is removing facebookprofilepicurl from the imageurl which we return
                    'this is usually https://graph.facebook.com/
                    'the reason we are doing this is that we want to send as little data as possible back to the user!!!
                    If leaderboarditem.I.IndexOf(facebookprofilepicurl) > -1 Then
                        leaderboarditem.I = leaderboarditem.I.Replace(facebookprofilepicurl, "")
                    End If

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

                        Integer.TryParse(reader("amount"), currentBet.amount)

                        leaderboarditem.B = currentBet
                        'don't do line below - show credits as is in DB - 
                        'leaderboarditem.S = leaderboarditem.S + currentBet.amount 'if the user has a bet made - then show theur credits as if they hadn't placed bet

                        'Button DO set property to tell us we need to add the winnings
                        leaderboarditem.B.addamount = 1
                    End If

                    LeaderboardList.Add(leaderboarditem)
                Catch ex As Exception
                End Try
                i = i + 1
            End While

            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try

        Return LeaderboardList
    End Function

End Class
