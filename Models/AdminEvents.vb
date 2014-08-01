Imports MySql.Data.MySqlClient

Public Class AdminEvents

    Public Shared Function LogEvent(ByVal FixtureID As Integer, ByVal eventID As Integer, ByVal fboid As Integer, ByVal broadcastMessage As String) As String
        Dim EventString As String = ""
        Dim oddsString As String = ""
        Dim returnString = ""
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()
            Dim query As String = "usp_logevent"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureid", FixtureID)
            cmd.Parameters.AddWithValue("_eventID", eventID)
            cmd.Parameters.AddWithValue("_fboid", fboid)
            If String.IsNullOrEmpty(broadcastMessage) Then
                cmd.Parameters.AddWithValue("_broadcastMessage", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_broadcastMessage", broadcastMessage)
            End If

            reader = cmd.ExecuteReader()

            While reader.Read()
                Dim EventLogID As Integer
                Integer.TryParse(reader.GetString("EventLogID"), EventLogID)
                EventString = EventString & "ELI" & EventLogID

                Dim HomeScore As Integer
                Integer.TryParse(reader.GetString("HomeScore"), HomeScore)
                EventString = EventString & ":;HS" & HomeScore

                Dim AwayScore As Integer
                Integer.TryParse(reader.GetString("AwayScore"), AwayScore)
                EventString = EventString & ":;AS" & AwayScore

                Dim EventDescription As String = reader.GetString("EventDescription")
                EventString = EventString & ":;ED" & EventDescription

                Dim EventEndTime As String
                Dim tempDate As Date = reader.GetMySqlDateTime("EventEndTime")
                EventEndTime = tempDate.ToString("MM/dd/yyyy HH:mm:ss")
                EventString = EventString & ":;EET" & EventEndTime

                Dim EventTime As String
                tempDate = reader.GetMySqlDateTime("EventTime")
                EventTime = tempDate.ToString("MM/dd/yyyy HH:mm:ss")
                EventString = EventString & ":;ET" & EventTime

                EventString = EventString & ":;EID" & eventID
                EventString = EventString & ":;FBOID" & fboid
                If Not String.IsNullOrEmpty(broadcastMessage) Then
                    EventString = EventString & ":;BM" & broadcastMessage
                End If
            End While

            reader.NextResult()
            Dim oddsUpdated = False
            While reader.Read
                If oddsUpdated Then
                    oddsString = oddsString & "," & reader.GetString("EventId") & ":" & reader.GetString("AwayScore")("Odds")
                Else
                    oddsString = reader.GetString("EventId") & ":" & reader.GetString("AwayScore")("Odds")
                    oddsUpdated = True
                End If
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
        returnString = EventString & "----" & oddsString
        Return returnString
    End Function


End Class
