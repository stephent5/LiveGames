Imports System.Net
Imports System.IO
Imports System.Runtime.Serialization.Json

Namespace LiveGamesClient1._2
    Public Class FacebookLoginController
        Inherits System.Web.Mvc.Controller

        Public Function FacebookLogin() As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Try
                Dim rooturl = String.Format("{0}://{1}{2}", Request.Url.Scheme, Request.Url.Authority, Url.Content("~"))
                Return New RedirectResult("https://graph.facebook.com/oauth/authorize? type=web_server& client_id=276786905679012& redirect_uri=" + rooturl + "facebookLogin/Handshake/")
            Catch ex As Exception
                T5Error.LogError("VB", "FacebookLogin" & ex.ToString)
                Return View()
            End Try
        End Function

        Public Function Handshake(ByVal authCode As String, ByVal u As Integer, ByVal fu As String, ByVal f As Integer) As ActionResult
            HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Try
                Dim request As WebRequest
                Dim response As WebResponse
                Dim stream As Stream
                Dim url As String = "https://graph.facebook.com/me/friends?access_token={0}"
                request = WebRequest.Create(String.Format(url, authCode))
                response = request.GetResponse()
                stream = response.GetResponseStream()
                Dim strmRdr As New System.IO.StreamReader(stream)
                Dim PageHTML As String = strmRdr.ReadToEnd()

                Dim tempUserfriend As New facebookFriendList
                Dim myDeserializedObjList As facebookFriendList = Newtonsoft.Json.JsonConvert.DeserializeObject(PageHTML, tempUserfriend.GetType())
                response.Close()

                Dim i As Integer = 0
                Dim facebookfriendids As String
                While i < myDeserializedObjList.data.Length
                    If i = 0 Then
                        facebookfriendids = myDeserializedObjList.data(i).Item("id")
                    Else
                        facebookfriendids = facebookfriendids + "," + myDeserializedObjList.data(i).Item("id")
                    End If
                    i = i + 1
                End While

                'now go to DB and only return 
                'Return Json(FacebookFriend.GetMyFriends(facebookfriendids, u, fu, f))
                Return Json(FacebookFriend.GetMyFriendsV2(facebookfriendids, u, fu, f))
                'Return PageHTML.ToString()
            Catch ex As Exception
                T5Error.LogError("VB", "FacebookLogin" & ex.ToString)
                Return View()
            End Try
        End Function


        Public Function HandshakeStress(ByVal fu As String, ByVal u As Integer, ByVal f As Integer) As ActionResult
            HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Try
                Dim facebookfriendids As String = "501118012,549916867,634431137,684417817,692475321,696599274,728675640,1389504291,1692075853,1761189594,100002677540470,100003125153257,100003354231840,100003365631803,100003370401837,100004107183934,100004224494351,100004256071956,100004510150466,100005803694577,100005813646815"
                'now go to DB and only return 
                Return Json(FacebookFriend.GetMyFriendsV2(facebookfriendids, u, fu, f), JsonRequestBehavior.AllowGet)
                'Return PageHTML.ToString()
            Catch ex As Exception
                T5Error.LogError("VB", "FacebookLogin" & ex.ToString)
                Return View()
            End Try
        End Function

        ''Public Function Handshake(ByVal code As String)
        'Public Function Handshake(ByVal authCode As String) As String
        '    HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache)

        '    Dim clientId As String = "276786905679012"
        '    Dim clientSecret As String = "4ebe0fa161e46fbd55c71cf059e81509"
        '    Dim url As String
        '    Dim request As WebRequest
        '    Dim response As WebResponse
        '    Dim stream As Stream
        '    'Dim url As String = "https://graph.facebook.com/oauth/access_token?client_id={0}&redirect_uri={1}&client_secret={2}&code={3}"
        '    'Dim redirectUri As String = "facebookLogin/Handshake/"


        '    'Dim request As WebRequest = WebRequest.Create(String.Format(url, clientId, redirectUri, clientSecret, code))

        '    'Dim response As WebResponse = request.GetResponse()

        '    'Dim encode As Encoding = System.Text.Encoding.GetEncoding("utf-8")
        '    'Dim stream As Stream = response.GetResponseStream()
        '    'Dim streamReader As StreamReader = New StreamReader(stream, encode)
        '    'Dim accessToken As String = streamReader.ReadToEnd().Replace("access_token=", "")

        '    'streamReader.Close()
        '    'response.Close()

        '    'url = "https://graph.facebook.com/me?access_token={0}"

        '    ''Dim StreamTest As New 
        '    'request = WebRequest.Create(String.Format(url, accessToken))

        '    'response = request.GetResponse()




        '    ''Dim s As TextReader


        '    'Dim tempUser As New FacebookUser
        '    'Dim dataContractJsonSerializer As New DataContractJsonSerializer(tempUser.GetType())

        '    'stream = response.GetResponseStream()
        '    ''Convert.ToString(stream, s)
        '    'tempUser = dataContractJsonSerializer.ReadObject(stream)
        '    ''user = dataContractJsonSerializer.ReadObject(stream) as user


        '    'response.Close()

        '    url = "https://graph.facebook.com/me/friends?access_token={0}"
        '    request = WebRequest.Create(String.Format(url, authCode))

        '    response = request.GetResponse()




        '    'Dim s As TextReader


        '    Dim tempUserfriend As New facebookFriendList
        '    Dim dataContractJsonSerializerFriend As New DataContractJsonSerializer((GetType(List(Of facebookFriendList))))

        '    stream = response.GetResponseStream()
        '    'Convert.ToString(stream, s)
        '    Dim strmRdr As New System.IO.StreamReader(stream)
        '    Dim PageHTML As String = strmRdr.ReadToEnd()
        '    'Dim Result As T
        '    ' Dim memoryStream = New MemoryStream()
        '    'PageHTML = PageHTML.Remove(0,
        '    'Dim js As New System.Web.Script.Serialization.JavaScriptSerializer
        '    'Dim lstTextAreas As List(Of facebookFriendList) = js.Deserialize(PageHTML, GetType(List(Of facebookFriendList)))
        '    'tempUserfriend = dataContractJsonSerializerFriend.ReadObject(PageHTML)
        '    Dim myDeserializedObjList As facebookFriendList = Newtonsoft.Json.JsonConvert.DeserializeObject(PageHTML, tempUserfriend.GetType())
        '    'tempUserfriend = dataContractJsonSerializerFriend.ReadObject(bytes)
        '    'user = dataContractJsonSerializer.ReadObject(stream) as user


        '    response.Close()





        '    Return PageHTML.ToString()


        'End Function

        '
        ' GET: /FacebookLogin

        Function Index() As ActionResult
            Return View()
        End Function

        '
        ' GET: /FacebookLogin/Details/5

        Function Details(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' GET: /FacebookLogin/Create

        Function Create() As ActionResult
            Return View()
        End Function

        '
        ' POST: /FacebookLogin/Create

        <HttpPost()> _
        Function Create(ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add insert logic here
                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function

        '
        ' GET: /FacebookLogin/Edit/5

        Function Edit(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /FacebookLogin/Edit/5

        <HttpPost()> _
        Function Edit(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add update logic here

                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function

        '
        ' GET: /FacebookLogin/Delete/5

        Function Delete(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /FacebookLogin/Delete/5

        <HttpPost()> _
        Function Delete(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add delete logic here

                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function
    End Class
End Namespace
