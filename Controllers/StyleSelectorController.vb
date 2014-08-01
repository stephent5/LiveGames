

Namespace LiveGamesClient1._2
    Public Class StyleSelectorController
        Inherits System.Web.Mvc.Controller

        Function Index() As ActionResult
            Return View()
        End Function

        Function GetStyle(ByVal FileName As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim model As New LiveGamesModule
            Dim stylesheetMarkup As String = ""
            Try
                model = T5XML.ReadXMLFileToLiveGamesModule(ConfigurationManager.AppSettings("XMLFileLocation") & FileName)
                stylesheetMarkup = "<link href=""/Content/CSS/" & model.stylesheet & """ rel=""stylesheet"" type=""text/css"" />"
            Catch ex As Exception
            End Try
            ViewBag.StyleSheet = stylesheetMarkup
            Return View(model)
        End Function

    End Class
End Namespace
