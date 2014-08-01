Imports System.IO
Imports LiveGamesClient1._2

Namespace LiveGamesClient1._2
    Public Class HomeModuleController
        Inherits System.Web.Mvc.Controller

        Function HeaderFeed(ByVal FileName As String, Optional ByVal UseLocal As Boolean = True) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim model As New LiveGamesModule

            Try
                Dim thisURL = New UrlHelper(Me.Url.RequestContext)

                Dim fileLocation As String
                If UseLocal Then
                    'Currently works (reading from local file structure)
                    Dim rooturl = String.Format("{0}://{1}{2}", Request.Url.Scheme, Request.Url.Authority, Url.Content("~"))
                    fileLocation = Url.Content(rooturl + "Content/XML/" & FileName)
                    model = T5XML.ReadXMLFileToLiveGamesModule(fileLocation)
                Else
                    'read XML file from URL ( from cloud)
                    fileLocation = ConfigurationManager.AppSettings("XMLFileURL") & FileName
                    model = T5XML.ReadXMLFileToLiveGamesModule(fileLocation)
                End If
            Catch ex As Exception
            End Try
            Return View(model)
        End Function

    End Class
End Namespace
