Imports System.IO

Public Class T5XML

    Public Shared Function ReadXMLFileToLiveGamesModule(ByVal XMLFileLocation As String) As LiveGamesModule
        Dim thisLiveGamesModule As New LiveGamesModule
        Dim tempString As String
        Try
            thisLiveGamesModule = LiveGamesModule.Deserialize(XDocument.Load(XMLFileLocation).ToString)
            tempString = Newtonsoft.Json.JsonConvert.SerializeObject(thisLiveGamesModule)
            'tempString = thisLiveGamesModule.Serialize()
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        End Try
        Return thisLiveGamesModule
    End Function

End Class
