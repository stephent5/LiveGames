'Unneccessary change

Imports MySql.Data.MySqlClient
Imports System.Security.Cryptography

Public Class League

    Private _ID As Integer
    Private _GameID As Integer
    Private _Name As String
    Private _Description As String
    Private _JoinCode As String
    Private _TSCreated As DateTime
    Private _TSUpdates As DateTime
    Public Property CreaterFBID As String
    Private _AdminName As String
    Property fixtureid As Integer
    Public Property leaguetype As Integer '1 = 1 game only league,2 = multi-game league (i.e season league)
    Public Property nummembers As Integer
    Public Property ismember As Integer
    Public Property status As Integer '0 = normal league,1 = Official League
    Public Property allowinvites As Integer '0= no ,1 = yes
    Public Property defaultleague As Integer '0 = no ,1 = yes

    Public Property ID As Integer
        Get
            Return _ID
        End Get
        Set(value As Integer)
            _ID = value
        End Set
    End Property

    Public Property GameID As Integer
        Get
            Return _GameID
        End Get
        Set(value As Integer)
            _GameID = value
        End Set
    End Property

    Public Property Name As String
        Get
            Return _Name
        End Get
        Set(value As String)
            _Name = value
        End Set
    End Property

    Public Property Description As String
        Get
            Return _Description
        End Get
        Set(value As String)
            _Description = value
        End Set
    End Property

    Public Property JoinCode As String
        Get
            Return _JoinCode
        End Get
        Set(value As String)
            _JoinCode = value
        End Set
    End Property

    Public Property TSCreated As DateTime
        Get
            Return _TSCreated
        End Get
        Set(value As DateTime)
            _TSCreated = value
        End Set
    End Property

    Public Property TSUpdated As DateTime
        Get
            Return _TSUpdates
        End Get
        Set(value As DateTime)
            _TSUpdates = value
        End Set
    End Property

    Public Property AdminName() As String
        Get
            Return _AdminName
        End Get
        Set(value As String)
            _AdminName = value
        End Set
    End Property

    Public Function CreateLeague(ByVal name As String, ByVal fixtureID As Integer, ByVal LeagueType As Integer, ByVal Description As String, ByVal UserID As Integer, ByVal allowinvites As Integer) As League
        Dim conn As New MySqlConnection
        Dim league As New League
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try

            'Dim joinCodeCreate As String = Encrypt(name & UserID, "LiveGame", True)
            'joinCodeCreate = joinCodeCreate.Replace(
            'Integer.TryParse(ConfigurationManager.AppSettings("GameID"), GameID)
            conn.Open()
            ' MessageBox.Show("Connection Opened Successfully")
            Dim query As String = "USP_CreateLeague_V2"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_name", name)

            If String.IsNullOrEmpty(Description) Then
                cmd.Parameters.AddWithValue("_description", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_description", Description)
            End If


            cmd.Parameters.AddWithValue("_userid", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            'cmd.Parameters.AddWithValue("_gameid", GameID) 'we can no longer pass in GameID from the config as we could have multiple clients - all cant be the same gameid!!!!  - we will instead use the fixtureID to tell us what game/client this is linked to 
            cmd.Parameters.AddWithValue("_LeagueType", LeagueType)
            cmd.Parameters.AddWithValue("_allowinvites", allowinvites)
            'cmd.Parameters.AddWithValue("_joincode", joinCodeCreate)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader("ID"), league.ID)
                Integer.TryParse(reader("GameID"), league.GameID)
                league.Name = reader("Name")
                Try
                    league.Description = reader("Description")
                Catch ex As Exception
                End Try
                league.leaguetype = LeagueType
                league.allowinvites = allowinvites
                league.CreaterFBID = UserID
                league.ismember = 1 'just created therefore this user is of course a member!!
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

        Return league
    End Function

    Public Shared Function EditLeague(ByVal name As String, ByVal LeagueID As Integer, ByVal LeagueType As Integer, ByVal UserID As Integer, ByVal allowinvites As Integer, ByVal fixtureid As Integer) As Integer
        Dim updated As Integer = -1
        Dim conn As New MySqlConnection
        Dim league As New League
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            Dim query As String = "USP_EditLeague"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_name", name)
            cmd.Parameters.AddWithValue("_leagueID", LeagueID)
            cmd.Parameters.AddWithValue("_userid", UserID)
            cmd.Parameters.AddWithValue("_leagueType", LeagueType)
            cmd.Parameters.AddWithValue("_allowinvites", allowinvites)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureid)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader("RC"), updated)
            End If

            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try

        Return updated
    End Function



    Public Function Encrypt(ByVal toEncrypt As String, ByVal key As String, ByVal useHashing As Boolean) As String
        Dim keyArray As Byte()
        Dim toEncryptArray As Byte() = UTF8Encoding.UTF8.GetBytes(toEncrypt)

        If useHashing = True Then
            Dim hashmd5 As New MD5CryptoServiceProvider()
            keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key))
        Else
            keyArray = UTF8Encoding.UTF8.GetBytes(key)
        End If

        Dim tdes As New TripleDESCryptoServiceProvider()
        tdes.Key = keyArray
        tdes.Mode = CipherMode.ECB
        tdes.Padding = PaddingMode.PKCS7

        Dim cTransform As ICryptoTransform = tdes.CreateEncryptor()
        Dim resultArray As Byte() = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length)

        Return (Convert.ToBase64String(resultArray, 0, resultArray.Length))
    End Function


    'Public Function Decrypt(ByVal toDecrypt As String, ByVal key As String, ByVal useHashing As Boolean) As String
    '    Dim keyArray As Byte()
    '    Dim toEncryptArray As Byte() = Convert.FromBase64String(toDecrypt)

    '    If useHashing = True Then
    '        Dim hashmd5 As New MD5CryptoServiceProvider()
    '        keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key))
    '    Else
    '        keyArray = UTF8Encoding.UTF8.GetBytes(key)
    '    End If

    '    Dim tdes As New TripleDESCryptoServiceProvider()
    '    tdes.Key = keyArray
    '    tdes.Mode = CipherMode.ECB
    '    tdes.Padding = PaddingMode.PKCS7

    '    Dim cTransform As ICryptoTransform = tdes.CreateDecryptor()
    '    Dim resultArray As Byte() = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length)

    '    Return UTF8Encoding.UTF8.GetString(resultArray)
    'End Function

    'we now select back two result sets to get the users leagues
    'ResultSet 1 - the list of leagues and their details
    'ResultSet 2 - the number of users in each league - incredibly this is the quickest way to get the relevant data back.
    '- once we have the data  we can link the two result sets in the one list!!!
    Public Shared Function GetUserLeaguesLinkedToThisFixture(ByVal userID As Integer, ByVal fixtureid As Integer) As System.Collections.Generic.List(Of League)
        Dim userLeagues As New System.Collections.Generic.List(Of League)
        Dim conn As New MySqlConnection

        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            Dim query As String = "USP_ViewLeaguesMembership"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userid", userID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureid)
            reader = cmd.ExecuteReader()

            Dim tempLeague As New System.Collections.Generic.List(Of League)

            'Get Details for each league
            While reader.Read()
                Dim league As New League
                Integer.TryParse(reader("ID"), league.ID)
                Integer.TryParse(reader("CreaterFBID"), league.CreaterFBID)

                Integer.TryParse(reader("GameID"), league.GameID)
                Integer.TryParse(reader("fixtureid"), league.fixtureid)
                If league.fixtureid > 0 Then
                    league.leaguetype = 1 'single game league
                Else
                    league.leaguetype = 2 'multi game league
                End If

                league.Name = reader("Name")

                Integer.TryParse(reader("LeagueStatus"), league.status)

                Integer.TryParse(reader("allowinvites"), league.allowinvites)

                Integer.TryParse(reader("DefaultLeague"), league.DefaultLeague)

                league.ismember = 1 'the user is amember of ALL leagues returned here!!!

                'league.Description = reader("Description")
                'league.JoinCode = reader("JoinCode")
                'league.AdminName = reader("Username")

                tempLeague.Add(league)
            End While

            reader.NextResult()

            'this next result set returns each leagueid with the number of members in each league
            While reader.Read()
                Dim thisLeagueID As Integer
                Integer.TryParse(reader("ID"), thisLeagueID)

                For Each LeagueItem As League In tempLeague
                    'now loop through our temp List tempLeague to find the league with this ID  and then insert its details into the real list
                    If LeagueItem.ID = thisLeagueID Then
                        'we found the next league in the list
                        Integer.TryParse(reader("LeagueMembers"), LeagueItem.nummembers)
                        userLeagues.Add(LeagueItem) 'add it to the list (now in the correct order )
                        Exit For 'exit 
                    End If
                Next
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

        Return userLeagues

    End Function



    Public Shared Function LeaveLeague(ByVal leagueid As Integer, ByVal userID As Integer) As Integer
        Dim LeftLeague As Integer = -1
        Dim conn As New MySqlConnection

        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            Dim query As String = "USP_LeaveLeague"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userid", userID)
            cmd.Parameters.AddWithValue("_leagueid", leagueid)
            reader = cmd.ExecuteReader()

            'Get Details for each league
            If reader.Read() Then
                Integer.TryParse(reader("RC"), LeftLeague)
            End If

            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try

        Return LeftLeague
    End Function


    'we now select back two result sets to get the users leagues
    'ResultSet 1 - the list of leagues and their details
    'ResultSet 2 - the number of users in each league - incredibly this is the quickest way to get the relevant data back.
    '- once we have the data  we can link the two result sets in the one list!!!
    Public Shared Function GetOfficialLeagues(ByVal userID As Integer, ByVal fixtureid As Integer) As System.Collections.Generic.List(Of League)
        Dim userLeagues As New System.Collections.Generic.List(Of League)
        Dim conn As New MySqlConnection

        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            Dim query As String = "USP_GetOfficialLeagues"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userid", userID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureid)
            reader = cmd.ExecuteReader()

            Dim tempLeague As New System.Collections.Generic.List(Of League)

            'Get Details for each league
            While reader.Read()
                Dim league As New League
                Integer.TryParse(reader("ID"), league.ID)
                Integer.TryParse(reader("CreaterFBID"), league.CreaterFBID)

                Integer.TryParse(reader("GameID"), league.GameID)
                Integer.TryParse(reader("fixtureid"), league.fixtureid)
                If league.fixtureid > 0 Then
                    league.leaguetype = 1 'single game league
                Else
                    league.leaguetype = 2 'multi game league
                End If

                league.Name = reader("Name")

                Integer.TryParse(reader("LeagueStatus"), league.status)
                Integer.TryParse(reader("AlreadyMember"), league.ismember)

                Integer.TryParse(reader("DefaultLeague"), league.defaultleague)

                tempLeague.Add(league)
            End While

            reader.NextResult()

            'this next result set returns each leagueid with the number of members in each league
            While reader.Read()
                Dim thisLeagueID As Integer
                Integer.TryParse(reader("ID"), thisLeagueID)

                For Each LeagueItem As League In tempLeague
                    'now loop through our temp List tempLeague to find the league with this ID  and then insert its details into the real list
                    If LeagueItem.ID = thisLeagueID Then
                        'we found the next league in the list
                        Integer.TryParse(reader("LeagueMembers"), LeagueItem.nummembers)
                        userLeagues.Add(LeagueItem) 'add it to the list (now in the correct order )
                        Exit For 'exit 
                    End If
                Next
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

        Return userLeagues

    End Function
    
    Public Shared Function GetFixturesLeagues(ByVal userID As Integer, ByVal fixtureid As Integer, ByVal FacebookUserID As String) As System.Collections.Generic.List(Of League)
        Dim userLeagues As New System.Collections.Generic.List(Of League)
        Dim conn As New MySqlConnection

        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            Dim query As String = "USP_GetFixturesLeagues"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userid", userID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureid)
            cmd.Parameters.AddWithValue("_facebookUserID", FacebookUserID)
            reader = cmd.ExecuteReader()

            'Get Details for each league
            While reader.Read()
                Dim league As New League
                Integer.TryParse(reader("ID"), league.ID)
                'Integer.TryParse(reader("CreaterFBID"), league.CreaterFBID)

                Integer.TryParse(reader("GameID"), league.GameID)
                Integer.TryParse(reader("fixtureid"), league.fixtureid)
                If league.fixtureid > 0 Then
                    league.leaguetype = 1 'single game league
                Else
                    league.leaguetype = 2 'multi game league
                End If

                league.Name = reader("Name")

                Integer.TryParse(reader("Status"), league.status)
                'Integer.TryParse(reader("AlreadyMember"), league.ismember)

                Integer.TryParse(reader("DefaultLeague"), league.defaultleague)

                userLeagues.Add(league)
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

        Return userLeagues

    End Function


    Public Shared Function DeActivateLeague(ByVal userID As Integer, ByVal leagueID As Integer, ByVal FacebookUserID As String) As Integer
        Dim DeActivated As Integer = 0
        Dim conn As New MySqlConnection

        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            Dim query As String = "USP_DeActivateLeague"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userid", userID)
            cmd.Parameters.AddWithValue("_leagueID", leagueID)
            cmd.Parameters.AddWithValue("_facebookUserID", FacebookUserID)
            reader = cmd.ExecuteReader()

            'Get Details for each league
            If reader.Read() Then
                Integer.TryParse(reader("RC"), DeActivated)
            End If

            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try

        Return DeActivated

    End Function



    'Gets all a users outstanding League invites
    Public Shared Function GetLeagueInvites(ByVal userid As Integer, ByVal FixtureID As Integer, Optional ByVal facebookUserID As String = "") As System.Collections.Generic.List(Of LeagueInvite)
        Dim LeaguesInvites As New System.Collections.Generic.List(Of LeagueInvite)
        Dim NumTotalPlayersInvited As Integer = -1
        Dim conn As New MySqlConnection

        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection

        Dim before As DateTime
        Dim span As TimeSpan
        Try
            conn.Open()
            Dim query As String = "USP_GetUsersLeagueInvites"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userID", userid)
            cmd.Parameters.AddWithValue("_FixtureID", FixtureID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            before = DateTime.Now

            reader = cmd.ExecuteReader()

            Dim after As DateTime = DateTime.Now
            span = after - before

            While reader.Read()
                Dim thisLeagueInvite As New LeagueInvite

                Integer.TryParse(reader("ID"), thisLeagueInvite.iid)
                Integer.TryParse(reader("leagueID"), thisLeagueInvite.lid)
                thisLeagueInvite.uid = userid
                thisLeagueInvite.ln = reader("LeagueName")
                thisLeagueInvite.iname = reader("inviter_username")
                Integer.TryParse(reader("inviter_UserID"), thisLeagueInvite.iuid)
                Integer.TryParse(reader("FixtureID"), thisLeagueInvite.f)
                LeaguesInvites.Add(thisLeagueInvite)
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
        Dim after2 As DateTime = DateTime.Now
        Dim span2 As TimeSpan = after2 - before
        Return LeaguesInvites
    End Function


    'Logs in DB all the fbuserid's of those invited to a league
    Public Shared Function LogLeagueInvites(ByVal userid As Integer, ByVal fbREquest As String, ByVal FBUserID_List As String, ByVal LeagueID As Integer) As System.Collections.Generic.List(Of LeagueInvite)
        Dim LeaguesInvites As New System.Collections.Generic.List(Of LeagueInvite)
        Dim NumTotalPlayersInvited As Integer = -1
        Dim conn As New MySqlConnection

        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            Dim query As String = "USP_LeagueInvitesLog_V2"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userID", userid)
            cmd.Parameters.AddWithValue("_fbuseridList", FBUserID_List)
            cmd.Parameters.AddWithValue("_fbRequest", fbREquest)
            cmd.Parameters.AddWithValue("_leagueID", LeagueID)
            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader("NumTotalPlayersInvited"), NumTotalPlayersInvited)
            End If

            reader.NextResult()

            While reader.Read()
                Dim thisLeagueInvite As New LeagueInvite

                Integer.TryParse(reader("ID"), thisLeagueInvite.iid)
                'Integer.TryParse(reader("userid"), thisLeagueInvite.uid)
                thisLeagueInvite.uid = reader("userid")

                LeaguesInvites.Add(thisLeagueInvite)
            End While
            
            If LeaguesInvites.Count = 0 And NumTotalPlayersInvited > 0 Then
                'no current livegamesplayers were invited - but there WERE some players invited
                'this means that the user only invited people who have never played livegames before

                'so we need to set an invite object in the array we return to tell the awaiting javascript that the logging on the DB worked
                'we set the inviteid of this object to -1 . This stops the javascript trying to send a message to the object in this list via SignalR
                Dim thisLeagueInvite As New LeagueInvite

                thisLeagueInvite.iid = -1
                thisLeagueInvite.uid = -1

                LeaguesInvites.Add(thisLeagueInvite)
            End If

            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try

        Return LeaguesInvites
    End Function

    Public Shared Function UpdateLeagueInvitation(ByVal inviteID As Integer, ByVal userid As Integer, ByVal status As Integer) As Integer
        Dim Joined As Integer = -1
        Dim conn As New MySqlConnection

        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            Dim query As String = "USP_UpdateLeagueInvitation"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userID", userid)
            cmd.Parameters.AddWithValue("_inviteID", inviteID)
            cmd.Parameters.AddWithValue("_status", status)
            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader("Joined"), Joined)
            End If

            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try
        Return Joined
    End Function

    Public Function GetLeagueForUser(ByVal thisUser As User) As System.Collections.Generic.List(Of League)

        Dim l As New System.Collections.Generic.List(Of League)
        Dim conn As New MySqlConnection

        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            'Integer.TryParse(ConfigurationManager.AppSettings("GameID"), GameID)
            conn.Open()
            ' MessageBox.Show("Connection Opened Successfully")
            Dim query As String = "USP_ViewLeaguesMembership"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userid", thisUser.id)
            cmd.Parameters.AddWithValue("_fixtureID", thisUser.currentfixtureid)
            reader = cmd.ExecuteReader()

            While reader.Read()
                Dim league As New League
                Integer.TryParse(reader("ID"), league.ID)
                Integer.TryParse(reader("CreaterFBID"), league.CreaterFBID)

                Integer.TryParse(reader("GameID"), league.GameID)
                Integer.TryParse(reader("fixtureid"), league.fixtureid)
                league.Name = reader("Name")

                league.Description = reader("Description")
                league.JoinCode = reader("JoinCode")
                league.AdminName = reader("name")
                l.Add(league)
            End While

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

        Return l

    End Function

    Public Function SendInvites(ByVal emailAddess As String, ByVal user As User, ByVal leagueID As Integer, ByVal joincode As String) As String
        Dim ID As Integer
        ID = LogLeagueInvite(emailAddess, user.ID, 0)

        If user.ID > 0 Then
            If emailAddess.Contains("@") Then

                Dim emailSend As New Email
                Dim sent As Boolean
                Dim rooturl = "http://" & HttpContext.Current.Request.Url.Host
                sent = emailSend.SendMail(emailAddess, "League Invite from " + user.firstname, "You have been invited to join a league the secret key is " + joincode + " please resister at the following link: ", rooturl + "/league/joinLeague", ID)

                If sent Then
                    LogLeagueInviteUpdate(ID, 1, True)

                    Return emailAddess + " Successful"
                Else
                    LogLeagueInviteUpdate(ID, -103, True)

                    Return emailAddess + " UnSuccessful"

                End If



            Else

                LogLeagueInviteUpdate(ID, -101, True)

                Return emailAddess + " The e-mail address in invalid"

            End If
        Else
            LogLeagueInviteUpdate(ID, -102, True)

            Return " You must be logged in to invite friends"
        End If


    End Function

    Public Function SendOneTimeOnlyMatchInvites(ByVal SendToUser As FacebookUser, ByVal user As User, ByVal fixtureID As Integer) As String
        Try
            Dim InviteID As Integer
            InviteID = LogLeagueInvite(SendToUser.email, user.id, 0)

            If user.id > 0 Then
                If SendToUser.email.Contains("@") Then

                    Dim emailSend As New Email
                    Dim sent As Boolean
                    Dim rooturl = "http://" & HttpContext.Current.Request.Url.Host
                    sent = emailSend.SendMail(SendToUser.email, "Live Game Invite from " & user.firstname, "Hi " & SendToUser.first_name & vbNewLine & vbNewLine & " <br /><br />  You have been invited to play " & Name & " against " & user.firstname & " (and others) in a one off Live Games game!!! <br /><br />" & vbNewLine, rooturl + "/Game/?f=" & fixtureID, ID)

                    If sent Then
                        LogLeagueInviteUpdate(InviteID, 1, True)
                        Return SendToUser.email + " Successful"
                    Else
                        LogLeagueInviteUpdate(InviteID, -103, True)
                        Return SendToUser.email + " UnSuccessful"
                    End If
                Else
                    LogLeagueInviteUpdate(InviteID, -101, True)
                    Return SendToUser.email + " The e-mail address in invalid"
                End If
            Else
                LogLeagueInviteUpdate(InviteID, -102, True)
                Return " You must be logged in to invite friends"
            End If
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
            Return "Error"
        End Try
    End Function


    Public Function LogLeagueInvite(ByVal email As String, ByVal UserID As Integer, ByVal leagueID As Integer) As Integer
        Dim conn As New MySqlConnection
        Dim ID As Integer
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            ' MessageBox.Show("Connection Opened Successfully")
            Dim query As String = "USP_LeagueInvitesLog"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_email", email)
            cmd.Parameters.AddWithValue("_userid", UserID)
            cmd.Parameters.AddWithValue("_leagueID", leagueID)

            reader = cmd.ExecuteReader()
            While reader.Read()
                Integer.TryParse(reader("_ID"), ID)
            End While

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

        Return ID

    End Function

    Public Function LogLeagueInviteUpdate(ByVal ID As Integer, ByVal SendStatus As Integer, ByVal Complete As Boolean) As Boolean
        Dim conn As New MySqlConnection
        'Dim ID As Integer
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            ' MessageBox.Show("Connection Opened Successfully")
            Dim query As String = "USP_LeagueInviteUpdate"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            'Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_ID", ID)
            cmd.Parameters.AddWithValue("_SendStatus", SendStatus)
            cmd.Parameters.AddWithValue("_Complete", Complete)

            cmd.ExecuteScalar()

            'reader.Close()
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

        Return ID

    End Function

    Public Shared Function joinLeague(ByVal userid As Integer, ByVal leagueid As Integer) As Integer
        Dim Joined As Integer
        Dim conn As New MySqlConnection

        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Try
            conn.Open()
            Dim query As String = "USP_LeagueJoin_v2"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_userid", userid)
            cmd.Parameters.AddWithValue("_leagueid", leagueid)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader("Joined"), Joined)
            End If

            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try

       

        Return Joined
    End Function

    'Old Way - removed Stephen 11-July - we no longer 
    'Public Function joinLeague(ByVal userid As Integer, ByVal joinCode As String) As League
    '    Dim l As New League
    '    Dim conn As New MySqlConnection
    '    'Dim ID As Integer
    '    conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
    '    Dim connResponse As New MySqlConnection
    '    Try
    '        conn.Open()
    '        ' MessageBox.Show("Connection Opened Successfully")
    '        Dim query As String = "USP_LeagueJoin"
    '        Dim cmd As New MySqlCommand(query, conn)
    '        cmd.CommandType = CommandType.StoredProcedure
    '        Dim reader As MySqlDataReader
    '        cmd.Parameters.AddWithValue("_userid", userid)
    '        cmd.Parameters.AddWithValue("_joincode", joinCode)

    '        reader = cmd.ExecuteReader()

    '        While reader.Read()
    '            Integer.TryParse(reader("_leagueID"), l.ID)
    '            l.Name = reader("_name")
    '            l.Description = reader("_Description")
    '            l.AdminName = reader("_userName")
    '        End While

    '        reader.Close()
    '        conn.Close()
    '    Catch myerror As MySqlException
    '        'Logger.LogError("MySql", myerror)
    '        T5Error.LogError("VB", myerror.ToString)
    '    Catch ex As Exception
    '        'Logger.LogError("MySql", ex)
    '        T5Error.LogError("VB", ex.ToString)
    '    Finally
    '        conn.Dispose()
    '    End Try

    '    Return l
    'End Function

    Public Shared Function SetUpNewOneTimeFriendGame(ByVal FBRequestID As String, ByVal fixtureID As Integer, ByVal thisUser As User, ByVal FriendList As String) As System.Collections.Generic.List(Of FacebookUser)
        Dim listOfLiveGamesUsers As New System.Collections.Generic.List(Of FacebookUser)
        Dim thisLeague As New League

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_CreateOneGameLeague"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", thisUser.id)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_friendList", FriendList)
            cmd.Parameters.AddWithValue("_fbRequestID", FBRequestID)

            reader = cmd.ExecuteReader()

            Try
                If reader.Read Then
                    thisLeague.Name = reader.GetString("LeagueName")
                    thisLeague.Description = reader.GetString("Description")
                    Integer.TryParse(reader.GetString("LeagueID"), thisLeague.ID)
                End If

                reader.NextResult()

                While reader.Read()
                    Try
                        Dim thisFBUser = New FacebookUser
                        thisFBUser.id = reader.GetString("FB_UserID")
                        thisFBUser.email = reader.GetString("email")
                        thisFBUser.first_name = reader.GetString("firstName")
                        thisFBUser.extradata = "You've been invited to play " & thisLeague.Name & " against " & thisUser.name & " and others at http://apps.facebook.com/tfivelive/?f=" & fixtureID

                        thisFBUser.last_name = thisLeague.Name 'this is a HACK!!!!!!!!!!!!!!!!!!!!!
                        thisFBUser.name = thisLeague.Description 'this is a HACK!!!!!!!!!!!!!!!!!!!!!
                        thisFBUser.currentfixtureid = thisLeague.ID 'this is a HACK!!!!!!!!!!!!!!!!!!!!!
                        thisFBUser.verified = reader.GetString("isplayingGame") 'this is a HACK!!!!!!!!!!!!!!!!!!!!!
                        thisFBUser.locale = reader.GetString("LMID") 'this is a HACK!!!!!!!!!!!!!!!!!!!!!

                        listOfLiveGamesUsers.Add(thisFBUser)
                    Catch ex As Exception
                        T5Error.LogError("VB", ex.ToString)
                    End Try
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

        Try
            'Now that we have the DB connections closed - send emails and lightstream invitations

            'first send lightstream invites
            For Each fbUser As FacebookUser In listOfLiveGamesUsers
                Dim isPlaying As Integer
                Integer.TryParse(fbUser.verified, isPlaying) 'this is a HACK - we are using the verified property to tell us if the user in question is playing the game or not - if they are playing the game - then send them alight stream invitation
                If isPlaying > 0 Then
                    AMQEngine.NotifyFriendOfLeagueInvite(fbUser.id, fixtureID, fbUser.locale, fbUser.last_name, fbUser.currentfixtureid, fbUser.name, thisUser)
                End If
            Next

            'now send emails!
            For Each fbUser As FacebookUser In listOfLiveGamesUsers
                thisLeague.SendOneTimeOnlyMatchInvites(fbUser, thisUser, fixtureID)
            Next
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        End Try

        Return listOfLiveGamesUsers
    End Function

    'This function updates either accepts or declines an invitaion to a league
    Public Shared Function inviteUpdate(ByVal lmid As String, ByVal Accept As Integer) As Integer
        Dim updateID As Integer = -1

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_inviteUpdate"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_lmid", lmid)
            cmd.Parameters.AddWithValue("_Accept", Accept)

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Try
                    Integer.TryParse(reader.GetString("updateID"), updateID)
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
        Return updateID
    End Function


    'this function returns the fixture the user should be sent to (based on the facebook request)
    ' Public Shared Function GetFixtureIdFromFbRequest(ByVal fbRequest As String, ByVal thisUser As User) As Integer
    Public Shared Function GetFixtureIdFromFbRequest(ByVal fbRequest As String, ByVal userid As Integer, ByVal facebookUserid As String) As Integer
        Dim fixtureID As Integer = -1

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "USP_GetFixtureIdFromFbRequest"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", userid)
            cmd.Parameters.AddWithValue("_fbuserid", facebookUserid)
            cmd.Parameters.AddWithValue("_fbRequest", fbRequest)

            reader = cmd.ExecuteReader()

            Try
                If reader.Read Then
                    Integer.TryParse(reader.GetString("fixtureID"), fixtureID)
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


        Return fixtureID
    End Function

End Class
