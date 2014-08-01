Public Class FacebookListener
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Response.ContentType = "application/json"
        Dim JSONResponse As String = ""
        Dim thisFacebookHelper As FacebookHelper
        Dim fbid As Integer = -1 'this will link to the row in tblStorePurchases_FB and we will use this variable to store the json response we return for this request!!
        Dim requestType As Integer = -1
        Try
            If FacebookHelper.ValidateSignedRequest(Request("signed_request")) Then
                'valid facebook connection

                If Request("method") = "payments_get_items" Then
                    requestType = 1
                    ' Get order info from Pay Dialog's order_info.
                    ' Assumes order_info is a JSON encoded string.

                    'what happens here is - we parse the data received from facebook and we return the detilas of the item in question - facebook will then display these details 
                    'to the user and prompt the user to buy!!!

                    thisFacebookHelper = FacebookHelper.DecodePayloadForGetItemsRequest(Request("signed_request"))

                    If thisFacebookHelper IsNot Nothing AndAlso thisFacebookHelper.FacebookCreditsObject IsNot Nothing AndAlso thisFacebookHelper.FacebookCreditsObject.order_info IsNot Nothing AndAlso Not String.IsNullOrEmpty(thisFacebookHelper.FacebookCreditsObject.order_info.item_id) Then
                        'we successfully parsed the facebook signed_request and retrieved the order info!!!

                        'so - go  to DB and return the details of this item to facebook so they can display the correct purchase details to the user!!!!!
                        Dim userID As String = ""
                        Dim storePurchaseID As Integer

                        Dim tempuserID As String = ""
                        Dim tempstorePurchaseID As String = ""

                        For Each c As Char In thisFacebookHelper.FacebookCreditsObject.order_info.item_id
                            If String.IsNullOrEmpty(userID) And Char.IsDigit(c) Then
                                tempuserID &= c
                            ElseIf String.IsNullOrEmpty(userID) And Not Char.IsDigit(c) Then
                                'we have reached the first letter in this string - this means whatever is in tempuserID is the userid!!!!
                                userID = tempuserID
                            ElseIf tempuserID > 0 And Char.IsDigit(c) Then
                                tempstorePurchaseID &= c
                            ElseIf tempuserID > 0 And Not Char.IsDigit(c) Then
                                'we have reached the second letter in this string - this means whatever is in tempstorePurchaseID is the storePurchaseID!!!!
                                Integer.TryParse(tempstorePurchaseID, storePurchaseID)
                            End If
                        Next c

                        'log what we recieve 
                        Dim thisItemsDetails As StoreItem = Store.GetPurchaseItemDetails_ForFaceBook(userID, storePurchaseID, thisFacebookHelper.FacebookCreditsObject.order_info.item_id, thisFacebookHelper.full_fb_details)
                        fbid = thisItemsDetails.fbid 'this will link to the row in tblStorePurchases_FB and we will use this variable to store the json response we return for this request!!
                        If thisItemsDetails.id > 0 Then
                            'everything worked - i.e the storePurchaseID and FBuserID match in the DB and we returned the item details!!

                            'Sample Response (from facebook documentation!!) - https://developers.facebook.com/docs/credits/callback/
                            '{
                            '  "content":[
                            '              {
                            '                "title":"BFF Locket",
                            '                "description":"Best friend locket",
                            '                "price":1,
                            '                "image_url":"http:\/\/www.facebook.com\/images\/gifts\/21.png"
                            '              }
                            '            ],
                            '  "method":"payments_get_items"
                            '}

                            Dim ImgURL As String = thisItemsDetails.imgurl.Replace("/", "\/") 'replcae all forward slashes with back slashes!!!
                            If String.IsNullOrEmpty(ImgURL) Then
                                ImgURL = ""
                            End If
                            Dim Price As Integer = Convert.ToInt32(thisItemsDetails.price)
                            JSONResponse = "{  ""content"":[    {  ""title"":"" " & thisItemsDetails.name & " "",  ""description"":"" " & thisItemsDetails.description & " "",  ""item_id"":"" " & thisItemsDetails.fbid & " "",  ""price"":" & Price & ", ""image_url"":""" & ImgURL & """   }  ],  ""method"":""payments_get_items"" }   "
                        End If
                    End If

                ElseIf Request("method") = "payments_status_update" Then

                    'if in here then facebook are notifying  us that the user has decided to buy the item or that the user has been refunded OR the user is disputing a previous transaction

                    thisFacebookHelper = FacebookHelper.DecodePayloadForPaymentsStatusRequest(Request("signed_request"))

                    If thisFacebookHelper IsNot Nothing AndAlso thisFacebookHelper.FacebookPaymentsStatusObject IsNot Nothing AndAlso thisFacebookHelper.FacebookPaymentsStatusObject.items.Count > 0 Then
                        requestType = 2
                        fbid = thisFacebookHelper.FacebookPaymentsStatusObject.items(0).item_id 'this will link to the row in tblStorePurchases_FB and we will use this variable to store the json response we return for this request!!
                        Dim Settled As Integer = Store.LogFaceBookPaymentStatusUpdated(thisFacebookHelper.FacebookPaymentsStatusObject.items(0).item_id, thisFacebookHelper.FacebookPaymentsStatusObject.status, thisFacebookHelper.FacebookPaymentsStatusObject.order_id, thisFacebookHelper.FacebookPaymentsStatusObject.amount, thisFacebookHelper.full_fb_details)

                        If thisFacebookHelper.FacebookPaymentsStatusObject.status = "placed" And Settled = 1 Then 'the user is buying the item

                            'log reponse from facebook in our DB ( after this logging the status in tblStorePurchases_FB will be either 1 or -1)
                            'then return to facebook and when they call our Javascript listener we will then complete the Store purchase by calling the javascript function
                            'Store.CompletePurchase

                            'Sample Response (from facebook documentation!!) - https://developers.facebook.com/docs/credits/callback/
                            '{
                            '  "content":{
                            '              "status":"settled",
                            '              "order_id":9006195253076
                            '            },
                            '  "method":"payments_status_update"
                            '}

                            JSONResponse = "{ ""content"":{ ""status"":""settled"",""order_id"": " & thisFacebookHelper.FacebookPaymentsStatusObject.order_id & " }, ""method"":""payments_status_update"" } "

                        ElseIf thisFacebookHelper.FacebookPaymentsStatusObject.status = "disputed" Then
                            requestType = 3
                            ' 1. Track disputed item orders.
                            ' 2. Investigate user's dispute and resolve by settling or refunding the order.
                            ' 3. Update the order status asychronously using Graph API.


                            '- do nothing here - we have logged the item in the DB - will have to check these logs to investigate

                        ElseIf thisFacebookHelper.FacebookPaymentsStatusObject.status = "refunded" Then
                            requestType = 4
                            'Track refunded item orders initiated by Facebook. No need to respond.
                        End If

                    End If
                End If
            End If

            If fbid > 0 And Not String.IsNullOrEmpty(JSONResponse) Then
                'Log the JSON response in DB!!!!
                FacebookHelper.LogJSONResponse(fbid, JSONResponse, requestType)
            End If

        Catch ex As Exception
            T5Error.LogError("VB", "FacebookListener.aspx : " + ex.ToString)
        End Try



        Response.Write(JSONResponse)
    End Sub

End Class