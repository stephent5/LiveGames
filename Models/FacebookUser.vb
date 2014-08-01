

Public Class FacebookUser

    Private _id As String
    Private _name As String
    Private _first_name As String
    Private _last_name As String
    Private _link As String
    Private _gender As String
    Private _email As String
    Private _timezone As String
    Private _locale As String
    Private _verified As String
    Private _updated_time As String
    Public Property currentfixtureid As Integer 'Added this Stephen 20-Oct-11
    'Public Property fbuserid As String 'not sure if we will end up using thi
    Public Property extradata As String 'Added this Stephen 9-Nov-11 - 

    Public Property id As String
        Get
            Return _id
        End Get
        Set(value As String)
            _id = value
        End Set
    End Property
    Public Property name As String
        Get
            Return _name
        End Get
        Set(value As String)
            _name = value
        End Set
    End Property
    Public Property first_name As String
        Get
            Return _first_name
        End Get
        Set(value As String)
            _first_name = value
        End Set
    End Property
    Public Property last_name As String
        Get
            Return _last_name
        End Get
        Set(value As String)
            _last_name = value
        End Set
    End Property
    Public Property link As String
        Get
            Return _link
        End Get
        Set(value As String)
            _link = value
        End Set
    End Property
    Public Property gender As String
        Get
            Return _gender
        End Get
        Set(value As String)
            _gender = value
        End Set
    End Property
    Public Property email As String
        Get
            Return _email
        End Get
        Set(value As String)
            _email = value
        End Set
    End Property
    Public Property timezone As String
        Get
            Return _timezone
        End Get
        Set(value As String)
            _timezone = value
        End Set
    End Property
    Public Property locale As String
        Get
            Return _locale
        End Get
        Set(value As String)
            _locale = value
        End Set
    End Property
    Public Property verified As String
        Get
            Return _verified
        End Get
        Set(value As String)
            _verified = value
        End Set
    End Property
    Public Property updated_time As String
        Get
            Return _updated_time
        End Get
        Set(value As String)
            _updated_time = value
        End Set
    End Property


   

End Class
