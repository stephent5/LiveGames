Imports MySql.Data.MySqlClient

Public Class FacebookFriend

    Public Property id As String
    Public Property name As String
    Public Property uid As Integer

    Shared Function GetMyFriends(ByVal friends As String, ByVal userID As Integer, ByVal facebookuserid As String, ByVal fixtureID As Integer) As List(Of FacebookFriend)
        Dim myFriends As New List(Of FacebookFriend)
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try


            'T5Error.LogError("VB", "calling GetMyFriends old way _userID is " & userID & " _friendList is " & friends)
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
            conn.Open()
            Dim query As String = "USP_InsertAndReturnMyFriends"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure

            If String.IsNullOrEmpty(friends) Then
                cmd.Parameters.AddWithValue("_friendList", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_friendList", friends)
            End If

            cmd.Parameters.AddWithValue("_userID", userID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookuserid)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)

            reader = cmd.ExecuteReader()

            While reader.Read()
                Dim thisfriend As New FacebookFriend
                thisfriend.id = reader.GetString("id")
                thisfriend.name = reader.GetString("name")
                myFriends.Add(thisfriend)
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
        Return myFriends
    End Function

    Shared Function GetMyFriendsV2(ByVal friends As String, ByVal userID As Integer, ByVal facebookuserid As String, ByVal fixtureID As Integer) As List(Of FacebookFriend)
        Dim myFriends As New List(Of FacebookFriend)
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            'T5Error.LogError("VB", "calling GetMyFriendsV2 new way _userID is " & userID & " _facebookUserID is " & facebookuserid & " _fixtureID is " & fixtureID & " _friendList is " & friends)

            Dim myLiveGamesFriends As String = GetMyFriendsWhoAreAlsoInLiveGames(friends, userID, facebookuserid, fixtureID)


            'T5Error.LogError("VB", "calling GetMyFriendsV2 step 2  _userID is " & userID & " myLiveGamesFriends is " & myLiveGamesFriends)

            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
            conn.Open()
            Dim query As String = "USP_InsertAndReturnMyFriends_V2"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure

            If String.IsNullOrEmpty(myLiveGamesFriends) Then
                cmd.Parameters.AddWithValue("_friendList", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_friendList", myLiveGamesFriends)
            End If

            cmd.Parameters.AddWithValue("_userID", userID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookuserid)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)

            reader = cmd.ExecuteReader()

            While reader.Read()
                Dim thisfriend As New FacebookFriend
                thisfriend.id = reader.GetString("id")
                thisfriend.name = reader.GetString("name")
                myFriends.Add(thisfriend)
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
        Return myFriends
    End Function

    Shared Function GetMyFriendsWhoAreAlsoInLiveGames(ByVal friends As String, ByVal userID As Integer, ByVal facebookuserid As String, ByVal fixtureID As Integer) As String
        Dim myLiveGamesFriends As New List(Of FacebookFriend)
        Dim liveGamesFriendsString As String = ""
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString

            conn.Open()
            Dim query As String = "USP_GetMyFriendsWhoAreAlsoInLiveGames"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure

            If String.IsNullOrEmpty(friends) Then
                cmd.Parameters.AddWithValue("_friendList", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_friendList", friends)
            End If

            cmd.Parameters.AddWithValue("_userID", userID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookuserid)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)

            reader = cmd.ExecuteReader()

            While reader.Read()
                Dim thisfriend As New FacebookFriend
                thisfriend.id = reader.GetString("FB_UserID")
                Integer.TryParse(reader.GetString("userid"), thisfriend.uid)
                'thisfriend.name = reader.GetString("name")

                If String.IsNullOrEmpty(liveGamesFriendsString) Then
                    liveGamesFriendsString = thisfriend.id & ";" & thisfriend.uid
                Else
                    liveGamesFriendsString = liveGamesFriendsString & "," & thisfriend.id & ";" & thisfriend.uid
                End If

                myLiveGamesFriends.Add(thisfriend)
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
        Return liveGamesFriendsString
    End Function

    Shared Function LogInvites(ByVal friends As String, ByVal userID As Integer, ByVal fbREquest As String, ByVal fixtureID As Integer) As Integer
        Dim NumNewInvites As Integer
        Dim NumPowerPlaysEarned As Integer
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Dim conn As New MySqlConnection
        Try
            conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString

            conn.Open()
            Dim query As String = "USP_LogFBInvites"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure

            If String.IsNullOrEmpty(friends) Then
                cmd.Parameters.AddWithValue("_friendList", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_friendList", friends)
            End If

            cmd.Parameters.AddWithValue("_userID", userID)
            cmd.Parameters.AddWithValue("_fbREquest", fbREquest)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader.GetString("NumPowerPlays"), NumPowerPlaysEarned)
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
        Return NumPowerPlaysEarned
    End Function

End Class
