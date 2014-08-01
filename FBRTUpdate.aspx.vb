Imports System.Net
Imports System.IO
Imports Newtonsoft.Json.Linq

Public Class FBRTUpdate
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        
        If Request("hub.verify_token") = "test1" Then
            Response.Write(Request("hub.challenge")) 'this is purely for when we set up the API the first time
        Else
            'this is not a get request that is testing our system - instead it must be an actual update from FB!!!!

            Dim Updatejson As String = ""
            Using reader As New StreamReader(Context.Request.InputStream)
                Updatejson = reader.ReadToEnd()
            End Using
            Dim FacebookUpdateDetails As New FacebookPaymentUpdate

            'Parse JSON data
            Try
                FacebookUpdateDetails = FacebookHelper.SerializeJSONForFBPaymentStatusUpdate(Updatejson)
            Catch ex As Exception
            End Try

            If String.IsNullOrEmpty(FacebookUpdateDetails.json) Then
                'There must have been an error parsing the update recieved - set json property so we can save this in db
                FacebookUpdateDetails.json = Updatejson
            End If

            'Log the data we have recieved
            'Dim n As Newtonsoft.Json.Linq.JToken = 
            Dim updateLogId As Integer = FacebookHelper.LogUpdateReceived(FacebookUpdateDetails.json, FacebookUpdateDetails.id, FacebookUpdateDetails.time, FacebookUpdateDetails.changed_fields)

            If Not String.IsNullOrEmpty(FacebookUpdateDetails.id) AndAlso updateLogId > 0 Then

                'we have succesfully parsed the facebook update and it WAS a payment update AND we logged this data in the DB
                'so now go to the fb graph API and get the details of this item

                Try
                    Dim request As WebRequest = WebRequest.Create(String.Format("https://graph.facebook.com/{0}?access_token={1}|{2}", FacebookUpdateDetails.id, ConfigurationManager.AppSettings("FacebookAppid"), ConfigurationManager.AppSettings("FacebookSecret")))
                    Dim response As WebResponse = request.GetResponse()
                    Dim stream As Stream = response.GetResponseStream()
                    Dim strmRdr As New System.IO.StreamReader(stream)
                    Dim GraphJSON As String = strmRdr.ReadToEnd()
                    Dim jObject__1 = JObject.Parse(GraphJSON)

                    Dim actionType As String = JObject.Parse(jObject__1("actions").ToArray(0).ToString())("type")
                    Dim actionStatus As String = JObject.Parse(jObject__1("actions").ToArray(0).ToString())("status")
                    Dim actionCurrency As String = JObject.Parse(jObject__1("actions").ToArray(0).ToString())("currency")
                    Dim actionAmount As String = JObject.Parse(jObject__1("actions").ToArray(0).ToString())("amount")
                    Dim actionTimeCreated As String = JObject.Parse(jObject__1("actions").ToArray(0).ToString())("time_created")
                    Dim actionTimeUpdated As String = JObject.Parse(jObject__1("actions").ToArray(0).ToString())("time_updated")
                    Dim request_id As String = jObject__1("request_id").ToString()

                    'go to DB with these details

                   
                    Try
                        'we call the below in a seperate thread as we are doing a sleep in it and we dont want to wait for it to return!
                        Dim AsyncCaller As New FacebookHelper.LogUpdateFBPaymentFromGraphAsyncMethodCaller(AddressOf FacebookHelper.LogUpdateFBPaymentFromGraph)
                        Dim LogResult As IAsyncResult = AsyncCaller.BeginInvoke(request_id, updateLogId, GraphJSON, FacebookUpdateDetails.id, actionType, actionStatus, actionCurrency, actionAmount, actionTimeCreated, actionTimeUpdated, Nothing, Nothing)
                    Catch ex As Exception
                    End Try

                    'old synchonrous way
                    'FacebookHelper.LogUpdateFBPaymentFromGraph(request_id, updateLogId, GraphJSON, FacebookUpdateDetails.id, actionType, actionStatus, actionCurrency, actionAmount, actionTimeCreated, actionTimeUpdated)
                    'Dim i As Integer = 0

                Catch ex As Exception
                    T5Error.LogError("VB", "GraphPaymentCall" & ex.ToString)
                End Try


            End If


        End If





    End Sub

End Class