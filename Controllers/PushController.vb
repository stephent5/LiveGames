Imports Microsoft.VisualBasic

Namespace LiveGamesClient1._2
    Public Class PushController
        Inherits System.Web.Mvc.Controller

        '
        ' GET: /Push

        Function Index() As ActionResult
            Return View()
        End Function

        Function AddSignature(ByVal connectionid As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim returnJSON As String = ""
            'If (User.Identity.Name = "LGP") Then

            Dim afterQuery As DateTime
            Dim QuerySpan As TimeSpan
            Dim before As DateTime = DateTime.Now

            If Not String.IsNullOrEmpty(Session("id")) Then
                'This request for validation IS from a client that just loaded our LiveGames page and NOT
                'from a remote third party hacker!!!

                afterQuery = DateTime.Now
                QuerySpan = afterQuery - before

                Dim AsyncCaller As New Logger.LogTimeTakenAsyncMethodCaller(AddressOf Logger.LogTimeTaken)
                Dim LogResult As IAsyncResult = AsyncCaller.BeginInvoke("getting id FROM session", QuerySpan.TotalMilliseconds, Nothing, Nothing)

                Dim appkey As String = ConfigurationManager.AppSettings("T5PusherAppKey")
                Dim appSecret As String = ConfigurationManager.AppSettings("T5PusherAppSecret")
                Dim hash As String = Fixture.getMd5Hash(appSecret + ":" + connectionid)

                returnJSON = "{""auth"":""" + appkey + ":" + hash + """}"
            End If
            Return Json(returnJSON)
        End Function

        Function AddSecureGroupSignature(ByVal connectionid As String, ByVal broadcast As String, ByVal groupName As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim returnJSON As String = ""

            'If Not String.IsNullOrEmpty(Session("id")) Then
            'This request for validation IS from a client that just loaded our LiveGames page and NOT
            'from a remote third party hacker!!!
            Dim appkey As String = ConfigurationManager.AppSettings("T5PusherAppKey")
            Dim appSecret As String = ConfigurationManager.AppSettings("T5PusherAppSecret")
            Dim hash As String
            If broadcast = 1 AndAlso Session("level") = "trust5" Then 'Only admin can create a broadcast group
                hash = Fixture.getMd5Hash(appSecret + ":" + connectionid + ":" + groupName + ":broadcast")
            Else
                hash = Fixture.getMd5Hash(appSecret + ":" + connectionid + ":" + groupName)
            End If
            returnJSON = "{""auth"":""" + appkey + ":" + hash + """}"
            'End If
            Return Json(returnJSON)
        End Function




    End Class
End Namespace
