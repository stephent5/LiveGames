Imports MySql.Data.MySqlClient
Imports System.Net.Mail

Public Class Email

    Public Function LogSendMail(ByVal destAddress As String, ByVal sendAddress As String, ByVal password As String, ByVal Subject As String, ByVal body As String) As Integer

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim ID As Integer
        Try
            conn.Open()
            ' MessageBox.Show("Connection Opened Successfully")
            Dim query As String = "USP_EmailSendLog"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_destAddress", destAddress)
            cmd.Parameters.AddWithValue("_sendAddress", sendAddress)
            cmd.Parameters.AddWithValue("_password", password)
            cmd.Parameters.AddWithValue("_Subject", Subject)
            cmd.Parameters.AddWithValue("_body", body)
            reader = cmd.ExecuteReader()

            If reader.Read() Then
                Integer.TryParse(reader("_ID"), ID)
            End If


            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            'Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            ' Logger.LogError("MySql", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try

        Return ID

    End Function


    Public Function LogSendMailUpdate(ByVal ID As Integer, ByVal Send As Boolean) As Integer
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        'Dim ID As Integer
        Try
            conn.Open()
            ' MessageBox.Show("Connection Opened Successfully")
            Dim query As String = "USP_EmailSendLogUpdate"
            Dim cmd As New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            Dim reader As MySqlDataReader
            cmd.Parameters.AddWithValue("_ID", ID)
            cmd.Parameters.AddWithValue("_Send", Send)
            reader = cmd.ExecuteReader()

            reader.Close()
            conn.Close()
        Catch myerror As MySqlException
            'Logger.LogError("MySql", myerror)
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            ' Logger.LogError("MySql", ex)
            T5Error.LogError("VB", ex.ToString)
        Finally
            conn.Dispose()
        End Try


    End Function

    'this function is a copy of the code from reporting
    Public Shared Function SendEmail(ByVal destAddress As String, ByVal Subject As String, ByVal body As String, ByVal URL As String) As Boolean

        Try
            Dim mail As MailMessage = New MailMessage()
            mail.To.Add(destAddress)
            Dim sendAddress = ConfigurationManager.AppSettings("AdminEmail")
            Dim password = ConfigurationManager.AppSettings("EmailPassword")
            mail.From = New MailAddress(sendAddress)
            mail.Subject = Subject

            mail.Body = body

            If Not String.IsNullOrEmpty(URL) Then
                mail.Body = mail.Body & " <a href=" & URL & ">" & URL & "</a>"
            End If


            mail.IsBodyHtml = True
            Dim smtp As SmtpClient = New SmtpClient()
            smtp.Host = ConfigurationManager.AppSettings("SmtpServer")
            smtp.Credentials = New System.Net.NetworkCredential(sendAddress, password)
            smtp.EnableSsl = True
            smtp.Send(mail)
        Catch ex As Exception
            T5Error.LogError("sendMail", ex.ToString)
            Return False
        End Try
        Return True

    End Function

    Public Function SendMail(ByVal destAddress As String, ByVal Subject As String, ByVal body As String, ByVal URL As String, ByVal ID As Integer) As Boolean
        destAddress = destAddress.Trim()
        Try
            Dim mail As MailMessage = New MailMessage()
            mail.To.Add(destAddress)
            Dim sendAddress = ConfigurationManager.AppSettings("AdminEmail")
            Dim password = ConfigurationManager.AppSettings("EmailPassword")
            mail.From = New MailAddress(sendAddress)
            mail.Subject = Subject

            mail.Body = body & " <a href=" & URL & ">" & URL & "</a>"
            'HttpUtility.UrlEncode()
            mail.IsBodyHtml = True
            Dim smtp As SmtpClient = New SmtpClient()
            smtp.Host = ConfigurationManager.AppSettings("SmtpServer")
            smtp.Credentials = New System.Net.NetworkCredential(sendAddress, password)
            smtp.EnableSsl = True
            Dim logID As Integer
            ' logID = LogSendMail(
            logID = LogSendMail(destAddress, sendAddress, password, Subject, body & " <a href=" & URL & ">" & URL & "</a>")
            smtp.Send(mail)
            LogSendMailUpdate(logID, True)
        Catch ex As Exception
            ' LogSendMailUpdate(logID, True)
            ' Logger.Log(Nothing, "sendMail() Exception: " & ex.ToString)
            T5Error.LogError("VB", ex.ToString)
            Return False
        End Try
        Return True

    End Function
End Class
