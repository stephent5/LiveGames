Imports MySql.Data.MySqlClient

Public Class User
  
    Public Property id As Integer
    Public Property name As String
    Public Property fbuserid As String
    Public Property firstname As String
    Public Property lastname As String
    Public Property link As String
    Public Property locale As String
    Public Property credits As Integer
    Public Property gender As String
    Public Property birthday As String
    Public Property email As String
    Public Property timezone As String
    Public Property verified As String
    Public Property profilepic As String
    Public Property currentfixtureid As Integer
    Public Property level As String '//we are going to use this param to determine if the user is the administrator or not
    Public Property nn As String
    Public Property sak As String
    Public Property rm As String 'RememberMe

    Sub New()
        ' TODO: Complete member initialization 
    End Sub


    'Public Property id() As Integer
    '    Get
    '        Return _id
    '    End Get
    '    Set(value As Integer)
    '        _id = value
    '    End Set
    'End Property

    'Public Property fbuserid() As String
    '    Get
    '        Return _fbuserid
    '    End Get
    '    Set(value As String)
    '        _fbuserid = value
    '    End Set
    'End Property

    'Public Property name() As String
    '    Get
    '        Return _name
    '    End Get
    '    Set(value As String)
    '        _name = value
    '    End Set
    'End Property

    'Public Property firstname() As String
    '    Get
    '        Return _firstName
    '    End Get
    '    Set(value As String)
    '        _firstName = value
    '    End Set
    'End Property

    'Public Property lastName() As String
    '    Get
    '        Return _lastName
    '    End Get
    '    Set(value As String)
    '        _lastName = value
    '    End Set
    'End Property

    'Public Property link As String
    '    Get
    '        Return _link
    '    End Get
    '    Set(value As String)
    '        _link = value
    '    End Set
    'End Property

    'Public Property locale() As String
    '    Get
    '        Return _locale
    '    End Get
    '    Set(value As String)
    '        _locale = value
    '    End Set
    'End Property

    'Public Property credits As String
    '    Get
    '        Return _credits
    '    End Get
    '    Set(value As String)
    '        _credits = value
    '    End Set
    'End Property

    'Public Property gender As String
    '    Get
    '        Return _gender
    '    End Get
    '    Set(value As String)
    '        _gender = value
    '    End Set
    'End Property
    'Public Property birthday As String
    '    Get
    '        Return _birthday
    '    End Get
    '    Set(value As String)
    '        _birthday = value
    '    End Set
    'End Property
    'Public Property email As String
    '    Get
    '        Return _email
    '    End Get
    '    Set(value As String)
    '        _email = value
    '    End Set
    'End Property
    'Public Property timezone As String
    '    Get
    '        Return _timezone
    '    End Get
    '    Set(value As String)
    '        _timezone = value
    '    End Set
    'End Property

    'Public Property verified As String
    '    Get
    '        Return _verified
    '    End Get
    '    Set(value As String)
    '        _verified = value
    '    End Set
    'End Property

    'Public Property profilepic As String
    '    Get
    '        Return _profilepic
    '    End Get
    '    Set(value As String)
    '        _profilepic = value
    '    End Set


    'End Property

    'Altered Stephen 4-July
    'Added fixtureId to the login procedure
    'we use the fixtureId so we can find out what game(client) the user is playing the fixture 
    Public Sub CreateUpdateUserInDB(ByVal fixtureID As Integer)

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        'Dim tempsessionGUID As String = System.Guid.NewGuid().ToString()
        Try
            conn.Open()
            ' MessageBox.Show("Connection Opened Successfully")
            Dim query As String = "USP_Login"


            'need to update this procedure - when a user joins or Logs in for the first time
            'we need to tell DB which game/client he is playing - we need to pass this value in to DB
            'where are we going to get this from???

            'XML file????????



            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_FBUserID", _fbuserid)
            cmd.Parameters.AddWithValue("_firstName", _firstname)
            cmd.Parameters.AddWithValue("_lastName", _lastname)
            cmd.Parameters.AddWithValue("_gender", _gender)
            cmd.Parameters.AddWithValue("_email", _email)
            cmd.Parameters.AddWithValue("_link", _link)
            cmd.Parameters.AddWithValue("_locale", _locale)
            cmd.Parameters.AddWithValue("_timezone", _timezone)
            cmd.Parameters.AddWithValue("_DOB", _birthday)
            cmd.Parameters.AddWithValue("_verified", _verified)
            cmd.Parameters.AddWithValue("_profilepic", _profilepic)
            cmd.Parameters.AddWithValue("_name", _name)
            cmd.Parameters.AddWithValue("_fixtureId", fixtureID)
            'cmd.Parameters.AddWithValue("_sessionGUID", tempsessionGUID) 'this guid will be used to identify a user session

            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader("UserID"), _id)
                Integer.TryParse(reader("Credits"), _credits)
                ' sg = tempsessionGUID

                sak = reader("sak")

                nn = reader("NickName") 'Added this Stephen 25-Sep-12

                _level = reader("UserLevel") 'Added this Stephen 5-May-12
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

    End Sub

    Public Sub New(ByVal name As String,
        ByVal fbUserID As String,
        ByVal firstName As String,
        ByVal lastName As String,
        ByVal link As String,
        ByVal locale As String,
        ByVal credits As Integer,
        ByVal gender As String,
        ByVal birthday As String,
        ByVal email As String,
        ByVal timezone As String,
        ByVal verified As String,
        ByVal profilepic As String)


        _name = name
        _fbUserID = fbUserID
        _firstName = firstName
        _lastName = lastName
        _link = link
        _locale = locale
        _credits = credits
        _gender = gender
        _birthday = birthday
        _email = email
        _timezone = timezone
        _verified = verified
        _profilepic = profilepic



    End Sub
End Class
