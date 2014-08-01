Imports MySql.Data.MySqlClient

Public Class T5Error

    Public Property origin As String
    Public Property errordesc As String
    Public Property logid As Integer
    
    Public Sub New()

    End Sub

    Public Sub New(ByVal origin As String, ByVal errordesc As String)
        Me.origin = origin
        Me.errordesc = errordesc
    End Sub

    Public Sub LogError()

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("Logging").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_LogError"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_APP", "LiveGames")
            cmd.Parameters.AddWithValue("_Class", origin)
            cmd.Parameters.AddWithValue("_function", "")
            cmd.Parameters.AddWithValue("_text", "")
            cmd.Parameters.AddWithValue("_Exception", errordesc)
            cmd.Parameters.AddWithValue("_MoreText", "")

            reader = cmd.ExecuteReader

            If reader.Read Then
                Integer.TryParse(reader.GetString("LogID"), logid)
            End If

            If logid <= 0 Then
                'we were unable to record the error in the DB - so.... log it to file!!!!!
                Try
                    Dim ErrorDetails As String = "Origin:" & origin & "; errordesc:" & errordesc
                    Logger.Log(BitFactory.Logging.LogSeverity.Error, "MySql", "Error logging error to Logging DB!!!!! We were trying to log " & vbNewLine & ErrorDetails & vbNewLine & " and we received new LogID back from DB" & vbNewLine)
                Catch ex2 As Exception
                End Try
            End If

        Catch myerror As MySqlException
            Try
                Dim ErrorDetails As String = "Origin:" & origin & "; errordesc:" & errordesc
                Logger.Log(BitFactory.Logging.LogSeverity.Error, "MySql", "Error logging error to Logging DB!!!!! We were trying to log " & vbNewLine & ErrorDetails & vbNewLine & " and the error we received while trying to log this was " & vbNewLine & myerror.ToString & vbNewLine)
            Catch ex2 As Exception
            End Try
        Catch ex As Exception
            Try
                Dim ErrorDetails As String = "Origin:" & origin & "; errordesc:" & errordesc
                Logger.Log(BitFactory.Logging.LogSeverity.Error, "MySql", "Error logging error to Logging DB!!!!! We were trying to log " & vbNewLine & ErrorDetails & vbNewLine & " and the error we received while trying to log this was " & vbNewLine & ex.ToString & vbNewLine)
            Catch ex2 As Exception
            End Try
        Finally
            Try
                reader.Close()
                reader = Nothing
            Catch ex As Exception
            End Try
            Try
                cmd.Dispose()
                cmd = Nothing
            Catch ex As Exception
            End Try
            Try
                conn.Dispose()
                conn.Close()
                conn = Nothing
            Catch ex As Exception
            End Try
        End Try
    End Sub

    Public Shared Sub LogError(ByVal origin As String, ByVal errordesc As String)
        Try
            Dim thisError = New T5Error(origin, errordesc)
            thisError.LogError()
        Catch ex As Exception
            Try
                Dim ErrorDetails As String = "Origin:" & origin & "; errordesc:" & errordesc
                Logger.Log(BitFactory.Logging.LogSeverity.Error, "MySql", "Error logging error to Logging DB!!!!! We were trying to log " & vbNewLine & ErrorDetails & vbNewLine & " and the error we received while trying to log this was " & vbNewLine & ex.ToString & vbNewLine)
            Catch ex2 As Exception
            End Try
        End Try
    End Sub

End Class
