Public Class LiveGamesMessage

    'This object holds the data we send to our clients - telling them of each Live Events

    Public Property Name As String
    Public Property Value As String

    Public Sub New(ByVal newName As String, ByVal NewValue As String)
        Name = newName
        Value = NewValue
    End Sub

End Class
