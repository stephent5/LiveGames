Public Class FacebookNotificationDetails

    Public Property a As String = ConfigurationManager.AppSettings("FacebookAppid") & "|" & ConfigurationManager.AppSettings("FacebookSecret")
    Public Property NotificationId As Integer
    Public Property userList As New ArrayList

End Class
