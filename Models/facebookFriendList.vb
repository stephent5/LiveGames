Public Class facebookFriendList

    Private _data As Dictionary(Of String, String)()

    Public Property data As Dictionary(Of String, String)()
        Get
            Return _data
        End Get
        Set(value As Dictionary(Of String, String)())
            _data = value
        End Set
    End Property

    Private _name As String()
    Private _id As String()

    Public Property name As String()
        Get
            Return _name
        End Get
        Set(value As String())
            _name = value
        End Set
    End Property

    Public Property id As String()
        Get
            Return _id
        End Get
        Set(value As String())
            _id = value
        End Set
    End Property




    'Public Property name As String
    '    Get
    '        Return _name
    '    End Get
    '    Set(value As String)
    '        _name = value
    '    End Set
    'End Property

    'Public Property id As String
    '    Get
    '        Return _id
    '    End Get
    '    Set(value As String)
    '        _id = value
    '    End Set
    'End Property

End Class
