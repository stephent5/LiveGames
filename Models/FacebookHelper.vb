Imports System.Collections.Generic
Imports System.Text
Imports Newtonsoft.Json.Linq
Imports System.Security.Cryptography
Imports MySql.Data.MySqlClient
Imports System.Net
Imports System.IO
Imports System.Threading

Public Class FacebookHelper

    Public Property FacebookCreditsObject As FacebookGetItemsRequest
    Public Property FacebookPaymentsStatusObject As New FacebookPaymentsStatusRequest
    Public Property fb_item_id As String
    Public Property full_fb_details As String

    Public Shared Function isFaceBookSession() As Boolean
        Dim FaceBookSession As Boolean = False
        Try
            'first check the session
            'FaceBookSession = CType(HttpContext.Current.Session("isFaceBookSession"), Boolean)

            'Not FaceBookSession AndAlso
            If Not String.IsNullOrEmpty(HttpContext.Current.Request("signed_request")) Then

                Dim requestData As String = HttpContext.Current.Request("signed_request")
                FaceBookSession = FacebookHelper.ValidateSignedRequest(requestData)


                'HttpContext.Current.Session.Add("isFaceBookSession", FaceBookSession) 'no longer add this to the session - instead we will determine if we are in a facebook session via javascript!!

                GetFaceBookPayload()
            End If
        Catch ex As Exception
        End Try
        Return FaceBookSession
    End Function

    Public Shared Sub GetFaceBookPayload()
        If Not String.IsNullOrEmpty(HttpContext.Current.Request("signed_request")) Then
            Dim requestData As String = HttpContext.Current.Request("signed_request")
            Dim splitPayload As String() = requestData.Split("."c)
            Dim payload As String = splitPayload(1)
            Dim decodedPayload = DecodePayload(payload)

            ' get the items from the decodedObject
            Dim userFacebookID As String = decodedPayload("user_id")
        End If
    End Sub

    Public Shared Function DecodePayloadForGetItemsRequest(ByVal requestData As String) As FacebookHelper
        Dim splitPayload As String() = requestData.Split("."c)
        Dim payload As String = splitPayload(1)
        Dim encoding = New UTF8Encoding()
        Dim decodedJson = payload.Replace("=", String.Empty).Replace("-"c, "+"c).Replace("_"c, "/"c)
        Dim base64JsonArray = Convert.FromBase64String(decodedJson.PadRight(decodedJson.Length + (4 - decodedJson.Length Mod 4) Mod 4, "="c))
        Dim json = encoding.GetString(base64JsonArray)

        'What we receive from facebook should be like the following ... (from https://developers.facebook.com/docs/credits/callback/)
        '        Array(
        '  [algorithm] => HMAC-SHA256
        '  [credits] => Array(
        '                 [buyer] => 409697
        '                 [receiver] => 409697
        '                 [order_id] => 9006597900959
        '                 [order_info] => {"item_id":"1a"}
        '  )
        '  [expires] => 1325210400
        '  [issued_at] => 1325203762
        '  [oauth_token] => AAABhWGUwIE8BABlFo...
        '  [user] => Array(
        '              [country] => us
        '              [locale] => en_US
        '              [age] => Array(
        '                        [min] => 21
        '                       )

        '            )
        '  [user_id] => 409697
        ')

        Dim jObject__1 = JObject.Parse(json)
        Dim thisFacebookCreditsObject As New FacebookGetItemsRequest
        thisFacebookCreditsObject.buyer = JObject.Parse(jObject__1("credits").ToString())("buyer").ToString
        thisFacebookCreditsObject.receiver = JObject.Parse(jObject__1("credits").ToString())("receiver").ToString
        thisFacebookCreditsObject.order_id = JObject.Parse(jObject__1("credits").ToString())("order_id").ToString
        thisFacebookCreditsObject.order_info = New FacebookCreditsOrderInfo
        thisFacebookCreditsObject.order_info.item_id = JObject.Parse(JObject.Parse(jObject__1("credits").ToString())("order_info").ToString)("item_id").ToString.Replace("'", "")

        Dim thisFaceBookHelper As New FacebookHelper
        thisFaceBookHelper.FacebookCreditsObject = thisFacebookCreditsObject
        thisFaceBookHelper.full_fb_details = json

        Return thisFaceBookHelper
    End Function

    Public Shared Function DecodePayloadForPaymentsStatusRequest(ByVal requestData As String) As FacebookHelper
        Dim splitPayload As String() = requestData.Split("."c)
        Dim payload As String = splitPayload(1)
        Dim encoding = New UTF8Encoding()
        Dim decodedJson = payload.Replace("=", String.Empty).Replace("-"c, "+"c).Replace("_"c, "/"c)
        Dim base64JsonArray = Convert.FromBase64String(decodedJson.PadRight(decodedJson.Length + (4 - decodedJson.Length Mod 4) Mod 4, "="c))
        Dim json = encoding.GetString(base64JsonArray)

        'What we receive from facebook should be like the following ... (from https://developers.facebook.com/docs/credits/callback/)
        '        Array(
        '  [algorithm] => HMAC-SHA256
        '  [credits] => Array(
        '                 [order_details] => {"order_id":9007076736544,"buyer":409697,"app":107032282669135,"receiver":409697,"amount":1,"time_placed":1329243276,"update_time":1329243277,"data":"","items":[{"item_id":"0","title":"100 FredCoins","description":"Spend FredCoins for all things in FredLand.","image_url":"http:\/\/www.inexpensivegold.com\/wp-content\/uploads\/2009\/12\/20-liberty-double-eagle.jpg","product_url":"","price":1,"data":""}],"status":"placed"}
        '                 [status] => placed
        '                 [order_id] => 9007076736544
        '               )
        '  [expires] => 1329249600
        '  [issued_at] => 1329243278
        '  [oauth_token] => AAABhWGUwIE8BALBqO...
        '  [user] => Array(
        '              [country] => us
        '              [locale] => en_US
        '              [age] => Array(
        '                         [min] => 21
        '                       )

        '            )
        '  [user_id] => 409697
        ')

        Dim jObject__1 = JObject.Parse(json)

        Dim FacebookPaymentsStatusRequestObject As New FacebookPaymentsStatusRequest
        FacebookPaymentsStatusRequestObject.order_id = JObject.Parse(JObject.Parse(jObject__1("credits").ToString())("order_details").ToString)("order_id").ToString
        FacebookPaymentsStatusRequestObject.buyer = JObject.Parse(JObject.Parse(jObject__1("credits").ToString())("order_details").ToString)("buyer").ToString
        FacebookPaymentsStatusRequestObject.app = JObject.Parse(JObject.Parse(jObject__1("credits").ToString())("order_details").ToString)("app").ToString
        FacebookPaymentsStatusRequestObject.receiver = JObject.Parse(JObject.Parse(jObject__1("credits").ToString())("order_details").ToString)("receiver").ToString
        Decimal.TryParse(JObject.Parse(JObject.Parse(jObject__1("credits").ToString())("order_details").ToString)("amount").ToString, FacebookPaymentsStatusRequestObject.amount)
        FacebookPaymentsStatusRequestObject.status = JObject.Parse(JObject.Parse(jObject__1("credits").ToString())("order_details").ToString)("status").ToString

        FacebookPaymentsStatusRequestObject.items = New System.Collections.Generic.List(Of FacebookCreditsItem)
        FacebookPaymentsStatusRequestObject.items = Newtonsoft.Json.JsonConvert.DeserializeObject(JObject.Parse(JObject.Parse(jObject__1("credits").ToString())("order_details").ToString)("items").ToString, FacebookPaymentsStatusRequestObject.items.GetType())

        Dim thisFaceBookHelper As New FacebookHelper
        thisFaceBookHelper.FacebookPaymentsStatusObject = FacebookPaymentsStatusRequestObject
        thisFaceBookHelper.full_fb_details = json

        Return thisFaceBookHelper
    End Function


    Public Shared Function DecodePayloadForFBCreditsStatusUpdate(ByVal requestData As String) As FacebookOrderFulfillment
        Dim FacebookOrderFulfillment As New FacebookOrderFulfillment

        Try
            Dim splitPayload As String() = requestData.Split("."c)
            Dim payload As String = splitPayload(1)
            Dim encoding = New UTF8Encoding()
            Dim decodedJson = payload.Replace("=", String.Empty).Replace("-"c, "+"c).Replace("_"c, "/"c)
            Dim base64JsonArray = Convert.FromBase64String(decodedJson.PadRight(decodedJson.Length + (4 - decodedJson.Length Mod 4) Mod 4, "="c))
            Dim json = encoding.GetString(base64JsonArray)

            'What we receive from facebook should be like the following ... (from https://developers.facebook.com/docs/howtos/payments/fulfillment/#orderfulfillment)
            '       {
            '   "algorithm": "HMAC-SHA256",
            '   "issued_at": 1367617646,
            '   "payment_id": 375225202592604,
            '   "quantity": 1,
            '   "status": "completed"
            '}

            'actualy comes in like 
            '        {
            '"algorithm":"HMAC-SHA256",
            '"amount":"5.00",
            '"currency":"EUR",
            '"issued_at":1378215746,
            '"payment_id":332030213594547,
            '"quantity":"1",
            '"request_id":"2670",
            '"status":"completed"
            '}

            Dim valid As Boolean = ValidateSignedRequest(requestData)
            If valid Then
                Dim jObject__1 = JObject.Parse(json)
                FacebookOrderFulfillment.full_fb_details = json
                FacebookOrderFulfillment.algorithm = jObject__1("algorithm").ToString()
                FacebookOrderFulfillment.issued_at = jObject__1("issued_at").ToString()
                FacebookOrderFulfillment.payment_id = jObject__1("payment_id").ToString()
                FacebookOrderFulfillment.quantity = jObject__1("quantity").ToString()
                FacebookOrderFulfillment.request_id = jObject__1("request_id").ToString()
                FacebookOrderFulfillment.status = jObject__1("status").ToString()
                FacebookOrderFulfillment.currency = jObject__1("currency").ToString()
                Double.TryParse(jObject__1("amount").ToString(), FacebookOrderFulfillment.amount)

            End If
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        End Try
        Return FacebookOrderFulfillment
    End Function


    Public Shared Function SerializeJSONForFBPaymentStatusUpdate(ByVal json As String) As FacebookPaymentUpdate
        'What we receive from facebook should be like the following ... (from https://developers.facebook.com/docs/howtos/payments/fulfillment/#asynchronousconfirmation)
        '        {
        '  "object": "payments",
        '  "entry": [
        '    {
        '      "id": "296989303750203",
        '      "time": 1347996346,
        '      "changed_fields": [
        '        "actions"
        '      ]
        '    }
        '  ]
        '}

        Dim FacebookPaymentDetails As New FacebookPaymentUpdate

        Try
            'Dim valid As Boolean = ValidateSignedRequest(requestData)
            'If valid Then
            Dim jObject__1 = JObject.Parse(json)
            If jObject__1("object") = "payments" Then
                FacebookPaymentDetails.json = json
                FacebookPaymentDetails.id = JObject.Parse(jObject__1("entry").ToArray(0).ToString())("id")
                FacebookPaymentDetails.time = JObject.Parse(jObject__1("entry").ToArray(0).ToString())("time")
                'FacebookPaymentDetails.changed_fields = JObject.Parse(jObject__1("entry").ToArray(0).ToString())("changed_fields").ToArray

                Try
                    Dim i As Integer = 0
                    While i < JObject.Parse(jObject__1("entry").ToArray(0).ToString())("changed_fields").ToArray().Length
                        FacebookPaymentDetails.changed_fields.Add(JObject.Parse(jObject__1("entry").ToArray(0).ToString())("changed_fields").ToArray()(i))
                        i = i + 1
                    End While
                Catch ex As Exception
                End Try

            End If
            'End If
        Catch ex As Exception
        End Try

        Return FacebookPaymentDetails
    End Function




    Public Shared Function DecodePayload(payload As String) As Dictionary(Of String, String)
        Dim encoding = New UTF8Encoding()
        Dim decodedJson = payload.Replace("=", String.Empty).Replace("-"c, "+"c).Replace("_"c, "/"c)
        Dim base64JsonArray = Convert.FromBase64String(decodedJson.PadRight(decodedJson.Length + (4 - decodedJson.Length Mod 4) Mod 4, "="c))
        Dim json = encoding.GetString(base64JsonArray)
        Dim jObject__1 = JObject.Parse(json)

        Dim parameters = New Dictionary(Of String, String)()

        parameters.Add("user_id", CType(jObject__1("user_id"), String))
        parameters.Add("oauth_token", CType(jObject__1("oauth_token"), String))
        Dim expires As Long = CType(jObject__1("expires"), Long)
        parameters.Add("expires", If(expires > 0, expires.ToString(), ""))
        parameters.Add("profile_id", CType(jObject__1("profile_id"), String))

        Return parameters
    End Function



    Public Shared Function ValidateSignedRequest(ByVal Incoming_SignedREquest As String) As Boolean
        If Not String.IsNullOrEmpty(Incoming_SignedREquest) Then
            Dim applicationSecret As String = ConfigurationManager.AppSettings("FacebookSecret")
            Dim signedRequest As String() = Incoming_SignedREquest.Split(".")
            Dim expectedSignature As String = signedRequest(0)
            Dim payload As String = signedRequest(1)

            ' Attempt to get same hash
            Dim Hmac = SignWithHmac(UTF8Encoding.UTF8.GetBytes(payload), UTF8Encoding.UTF8.GetBytes(applicationSecret))
            Dim HmacBase64 = ToUrlBase64String(Hmac)

            Return (HmacBase64 = expectedSignature)
        Else
            Return False
        End If
    End Function

    Private Shared Function ToUrlBase64String(Input As Byte()) As String
        Return Convert.ToBase64String(Input).Replace("=", [String].Empty).Replace("+"c, "-"c).Replace("/"c, "_"c)
    End Function

    Private Shared Function SignWithHmac(dataToSign As Byte(), keyBody As Byte()) As Byte()
        Using hmacAlgorithm = New HMACSHA256(keyBody)
            hmacAlgorithm.ComputeHash(dataToSign)
            Return hmacAlgorithm.Hash
        End Using
    End Function

    Public Shared Function LogJSONResponse(ByVal fbid As Integer, ByVal JSONResponse As String, ByVal RequestType As Integer) As Integer
        Dim settled As Integer = -1

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_LogJSONResponse"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_FBID", fbid)
            cmd.Parameters.AddWithValue("_JSONResponse", JSONResponse)
            cmd.Parameters.AddWithValue("_RequestType", RequestType)
            cmd.ExecuteNonQuery()
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
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
        Return settled
    End Function


    Public Shared Function LogUpdateReceived(ByVal json As String, ByVal fbid As String, ByVal time As String, ByVal changed_fields As ArrayList) As Integer
        Dim logid As Integer = -1

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim cmd As MySqlCommand
        Dim reader As MySqlDataReader
        Try
            conn.Open()

            Dim query As String = "USP_StoreLogFBPaymentUpdate"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_json", json)
            cmd.Parameters.AddWithValue("_fbid", fbid)
            cmd.Parameters.AddWithValue("_time", time)

            Try
                Dim i As Integer = 0
                Dim fields As String = ""
                While i < changed_fields.Count
                    If (i > 0) Then
                        fields = fields & "," & changed_fields(i).ToString()
                    Else
                        'first item - no preceeding comma
                        fields = fields & changed_fields(i).ToString()
                    End If
                    i = i + 1
                End While
                cmd.Parameters.AddWithValue("_changed_fields", fields)
            Catch ex As Exception

                cmd.Parameters.AddWithValue("_changed_fields", "T5 Error reading fields")
            End Try



            reader = cmd.ExecuteReader

            If reader.Read Then
                Integer.TryParse(reader("ID").ToString(), logid)
            End If

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
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
        Return logid
    End Function


    ' The delegate must have the same signature as the method  it will call asynchronously i.e - LogTimeTaken
    Public Delegate Sub LogUpdateFBPaymentFromGraphAsyncMethodCaller(ByVal request_id As Integer, ByVal updateLogId As Integer, ByVal json As String, ByVal fbid As String, ByVal _Type As String, ByVal _Status As String, ByVal _Currency As String, ByVal _Amount As String, ByVal _TimeCreated As String, ByVal _TimeUpdated As String)


    Public Shared Sub LogUpdateFBPaymentFromGraph(ByVal request_id As Integer, ByVal updateLogId As Integer, ByVal json As String, ByVal fbid As String, ByVal _Type As String, ByVal _Status As String, ByVal _Currency As String, ByVal _Amount As String, ByVal _TimeCreated As String, ByVal _TimeUpdated As String)
        Dim logged As Integer = -1


        'we are going to put a 5 (or a few seconds anyway!) second sleep here!!!!!
        'this is because sometimes this API gets called by facebook before the javascript callback does.
        'if this happens then the user will not be told on screen "Purchase compete"
        'so we will wait 5 seonds here  - this is not an issue - time is not an issue here - what is important is that we log the event 
        '- we can wait 5 seconds no probs - what IS important is we try to make sure the javascript callback is called first 
        Thread.Sleep(3000)

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim cmd As MySqlCommand
        Dim reader As MySqlDataReader
        Try
            conn.Open()

            Dim query As String = "USP_UpdateFBPaymentFromGraph"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_storepurchaseid", request_id)
            cmd.Parameters.AddWithValue("_updateLogId", updateLogId)
            cmd.Parameters.AddWithValue("_json", json)
            cmd.Parameters.AddWithValue("_fbid", fbid)
            cmd.Parameters.AddWithValue("_Type", _Type)
            cmd.Parameters.AddWithValue("_Status", _Status)
            cmd.Parameters.AddWithValue("_Currency", _Currency)
            cmd.Parameters.AddWithValue("_Amount", _Amount)
            cmd.Parameters.AddWithValue("_TimeCreated", _TimeCreated)
            cmd.Parameters.AddWithValue("_TimeUpdated", _TimeUpdated)

            reader = cmd.ExecuteReader

            If reader.Read Then
                Integer.TryParse(reader("Result").ToString(), logged)
            End If

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
        Catch ex As Exception
            T5Error.LogError("VB", ex.ToString)
        Finally
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
        'Return logged
    End Sub



End Class
