Imports MySql.Data.MySqlClient

Public Class FBItem

    Public Property type As String
    Public Property title As String
    Public Property plural_title As String
    Public Property image As String
    Public Property description As String
    Public Property url As String
    Public Property prices As New System.Collections.Generic.List(Of FBPriceDetails)


    Public Shared Function GetFBItemDEtails(ByVal fbid As Integer) As FBItem
        Dim thisFBITemDetails As New FBItem

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_GetFBItemDetails"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_Itemid", fbid)

            reader = cmd.ExecuteReader()

            Try
                'Next..Get all the friends bet details
                If reader.Read() Then
                    thisFBITemDetails.description = reader.GetString("description")
                    thisFBITemDetails.image = reader.GetString("image")
                    'thisFBITemDetails.plural_title = reader.GetString("plural_title")
                    thisFBITemDetails.title = reader.GetString("title")
                    thisFBITemDetails.type = reader.GetString("fbtype")
                    thisFBITemDetails.url = reader.GetString("url")
                End If

                reader.NextResult()

                While reader.Read()
                    Dim thisPrice As New FBPriceDetails
                    Double.TryParse(reader.GetString("Price"), thisPrice.amount)
                    thisPrice.currency = reader.GetString("CCode")
                    thisFBITemDetails.prices.Add(thisPrice)
                End While

            Catch ex As Exception
            End Try

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
        Return thisFBITemDetails
    End Function



End Class
