Imports MySql.Data.MySqlClient
Imports System.Net
Imports System.IO



Public Class Store

    'this function returns a list of store items which a user can buy

    Public Shared Function GetStoreItems(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal platformid As Integer) As System.Collections.Generic.List(Of StoreItem)
        Dim storeItems As New System.Collections.Generic.List(Of StoreItem)

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_GetStoreItems2"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_platformid", platformid)

            reader = cmd.ExecuteReader()

            While reader.Read
                Dim thisStoreItem As New StoreItem
                Integer.TryParse(reader.GetString("id"), thisStoreItem.id)
                thisStoreItem.description = reader.GetString("description")

                'thisStoreItem.pricedescription = reader.GetString("pricedescription")

                thisStoreItem.name = reader.GetString("name")
                thisStoreItem.imgurl = reader.GetString("imgurl")
                Integer.TryParse(reader.GetString("displayorder"), thisStoreItem.displayorder)
                Decimal.TryParse(reader.GetString("price"), thisStoreItem.price)

                thisStoreItem.cs = reader.GetString("CurrencySymbol")
                Integer.TryParse(reader.GetString("CurrencyID"), thisStoreItem.c)

                storeItems.Add(thisStoreItem)
            End While

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return storeItems
    End Function


    Public Shared Function CheckForOpenUBPurchases(ByVal fixtureID As Integer, ByVal UserID As Integer, Optional ByVal facebookUserID As String = "") As System.Collections.Generic.List(Of StorePurchase)
        Dim openUBPurchases As New System.Collections.Generic.List(Of StorePurchase)

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand

        Dim before As DateTime
        Dim span As TimeSpan
        Try
            conn.Open()

            Dim query As String = "USP_Store_CheckForOpenUBPurchases"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            before = DateTime.Now
            reader = cmd.ExecuteReader()
            Dim after As DateTime = DateTime.Now
            span = after - before

            While reader.Read
                Dim openUBPurchase As New StorePurchase
                Integer.TryParse(reader.GetString("ubid"), openUBPurchase.ubid)
                Integer.TryParse(reader.GetString("spid"), openUBPurchase.id)
                Integer.TryParse(reader.GetString("UBPurchaseID"), openUBPurchase.ubpurchaseid)
                Integer.TryParse(reader.GetString("selectedubbilloptionid"), openUBPurchase.ubbilloptionid)
                openUBPurchase.ubsak = reader.GetString("UBSAK")
                openUBPurchases.Add(openUBPurchase)
            End While

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Dim after2 As DateTime = DateTime.Now
        Dim span2 As TimeSpan = after2 - before
        Return openUBPurchases
    End Function

    'ByVal status As Integer,
    Public Shared Function completeStorePurchase(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal storepurchaseid As Integer, ByVal facebookUserID As String) As StorePurchase
        Dim thisStorePurchase As New StorePurchase

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_CompleteStorePurchase"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_storepurchaseid", storepurchaseid)
            'cmd.Parameters.AddWithValue("_status", status)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader()

            If reader.Read Then
                thisStorePurchase.id = storepurchaseid

                Integer.TryParse(reader.GetString("itemid"), thisStorePurchase.storeitemid)
                Integer.TryParse(reader.GetString("result"), thisStorePurchase.purchaseresult)
                thisStorePurchase.purchasedescription = reader.GetString("resultdescription")
            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return thisStorePurchase
    End Function

    Public Shared Function LogUsersSelectedUBBillOption(ByVal UserID As Integer, ByVal PurchaseID As Integer, ByVal UBBillOptionID As Integer, ByVal UBPrice As Decimal, ByVal facebookUserID As String) As Integer
        Dim updated As Integer = -1
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim cmd As MySqlCommand
        Dim reader As MySqlDataReader
        Try
            conn.Open()

            Dim query As String = "USP_Store_LogUsersSelectedUBBillOption"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_PurchaseID", PurchaseID)
            cmd.Parameters.AddWithValue("_UBBillOptionID", UBBillOptionID)
            cmd.Parameters.AddWithValue("_UBPrice", UBPrice)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader

            If reader.Read Then
                Integer.TryParse(reader.GetString("result"), updated)
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
        Return updated
    End Function


    Public Shared Function CompleteFBStorePurchase(ByVal fboid As String, ByVal UserID As Integer, ByVal facebookUserID As String) As StorePurchase
        Dim thisStorePurchase As New StorePurchase

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_CompleteFBStorePurchase"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fboid", fboid)
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader()

            If reader.Read Then
                Integer.TryParse(reader.GetString("spid"), thisStorePurchase.id)
            End If

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return thisStorePurchase
    End Function

    Public Shared Function UpdateFBStorePurchase(ByVal UserID As Integer, ByVal facebookUserID As String, ByVal FacebookOrderFulfillmentDetails As FacebookOrderFulfillment) As StorePurchase
        Dim thisStorePurchase As New StorePurchase

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_UpdateFBStorePurchase"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)
            cmd.Parameters.AddWithValue("_fb_status", FacebookOrderFulfillmentDetails.status)
            cmd.Parameters.AddWithValue("_fb_algorithm", FacebookOrderFulfillmentDetails.algorithm)
            cmd.Parameters.AddWithValue("_fb_currency", FacebookOrderFulfillmentDetails.currency)
            cmd.Parameters.AddWithValue("_fb_issued_at", FacebookOrderFulfillmentDetails.issued_at)
            cmd.Parameters.AddWithValue("_fb_payment_id", FacebookOrderFulfillmentDetails.payment_id)
            cmd.Parameters.AddWithValue("_fb_quantity", FacebookOrderFulfillmentDetails.quantity)
            cmd.Parameters.AddWithValue("_fb_request_id", FacebookOrderFulfillmentDetails.request_id)
            cmd.Parameters.AddWithValue("_fb_json", FacebookOrderFulfillmentDetails.full_fb_details)
            cmd.Parameters.AddWithValue("_fb_amount", FacebookOrderFulfillmentDetails.amount)

            reader = cmd.ExecuteReader()

            If reader.Read Then
                Integer.TryParse(reader.GetString("spid"), thisStorePurchase.id)
                Integer.TryParse(reader.GetString("Updatedstatus"), thisStorePurchase.status)
            End If

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return thisStorePurchase
    End Function





    Public Shared Function GetStorePurchases(ByVal UserID As Integer, ByVal facebookUserID As String) As System.Collections.Generic.List(Of StorePurchase)
        Dim myStorePurchases As New System.Collections.Generic.List(Of StorePurchase)

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_GetMyPurchases"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader()

            While reader.Read
                Dim thisStorePurchase As New StorePurchase

                Integer.TryParse(reader.GetString("id"), thisStorePurchase.id)
                Integer.TryParse(reader.GetString("status"), thisStorePurchase.status)
                Double.TryParse(reader.GetString("price"), thisStorePurchase.price)
                thisStorePurchase.name = reader.GetString("Name")

                Dim tempDate As Date = reader.GetMySqlDateTime("tscreated")
                thisStorePurchase.time = tempDate.ToString("MM/dd/yyyy HH:mm:ss") 'New way - used for safari

                thisStorePurchase.cs = reader.GetString("CurrencySymbol")


                Integer.TryParse(reader.GetString("platform"), thisStorePurchase.p)


                myStorePurchases.Add(thisStorePurchase)
            End While

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return myStorePurchases
    End Function

    Public Shared Function GetPurchaseItemDetails_ForFaceBook(ByVal userid As String, ByVal storePurchaseID As Integer, ByVal fb_item_id As String, ByVal fb_details As String) As StoreItem
        Dim thisStoreItem As New StoreItem

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_GetPurchaseDetails_ForFaceBook"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userid", userid)
            cmd.Parameters.AddWithValue("_storePurchaseID", storePurchaseID)
            cmd.Parameters.AddWithValue("_fb_item_id", fb_item_id)
            cmd.Parameters.AddWithValue("_fb_details", fb_details)

            reader = cmd.ExecuteReader()

            If reader.Read Then
                Integer.TryParse(reader.GetString("itemid"), thisStoreItem.id)
                thisStoreItem.name = reader.GetString("name")
                thisStoreItem.description = reader.GetString("description")
                thisStoreItem.imgurl = ConfigurationManager.AppSettings("ImagesLocation") + reader.GetString("imgurl")
                Decimal.TryParse(reader.GetString("price"), thisStoreItem.price)
                Integer.TryParse(reader.GetString("fbid"), thisStoreItem.fbid)
            End If


        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return thisStoreItem
    End Function


    Public Shared Function LogFaceBookPaymentStatusUpdated(ByVal itemid As String, ByVal fb_status As String, ByVal fb_order_id As String, ByVal fb_amount As Decimal, ByVal fb_details As String) As Integer
        Dim settled As Integer = -1

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_LogFaceBookPaymentStatusUpdate"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_FBID", itemid)
            cmd.Parameters.AddWithValue("_fb_status", fb_status)
            cmd.Parameters.AddWithValue("_fb_order_id", fb_order_id)
            cmd.Parameters.AddWithValue("_fb_amount", fb_amount)
            cmd.Parameters.AddWithValue("_fb_details", fb_details)

            reader = cmd.ExecuteReader()

            If reader.Read Then
                Integer.TryParse(reader.GetString("settled"), settled)
            End If


        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return settled
    End Function


    Public Shared Function LogFailedFBStorePurchase(ByVal UserID As Integer, ByVal StorePurchaseID As Integer, ByVal FBErrorCode As String, ByVal FBErrorMessage As String, ByVal facebookUserID As String) As StorePurchase
        Dim thisStorePurchase As New StorePurchase

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim cmd As MySqlCommand
        Dim reader As MySqlDataReader
        Try
            conn.Open()

            Dim query As String = "USP_Store_LogFailedFBStorePurchase"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_StorePurchaseID", StorePurchaseID)
            cmd.Parameters.AddWithValue("_FBErrorCode", FBErrorCode)
            cmd.Parameters.AddWithValue("_FBErrorMessage", FBErrorMessage)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)

            reader = cmd.ExecuteReader()

            If reader.Read Then
                Integer.TryParse(reader.GetString("spid"), thisStorePurchase.id)
            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return thisStorePurchase
    End Function


    Public Shared Function LogPurchaseRequest(ByVal fixtureID As Integer, ByVal UserID As Integer, ByVal ItemID As Integer, ByVal platform As Integer, ByVal facebookUserID As String, ByVal currencyID As Integer, ByVal currencyCode As String) As StorePurchase
        Dim thisStorePurchase As New StorePurchase

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_LogPurchaseRequest"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_userID", UserID)
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)
            cmd.Parameters.AddWithValue("_storeitem", ItemID)
            cmd.Parameters.AddWithValue("_platformid", platform)
            cmd.Parameters.AddWithValue("_facebookUserID", facebookUserID)
            cmd.Parameters.AddWithValue("_currencyID", currencyID)

            If String.IsNullOrEmpty(currencyCode) Then
                cmd.Parameters.AddWithValue("_currencyCode", currencyCode)
            Else
                cmd.Parameters.AddWithValue("_currencyCode", currencyCode)
            End If

            reader = cmd.ExecuteReader()

            If reader.Read Then
                Integer.TryParse(reader.GetString("purchaseID"), thisStorePurchase.id)
                thisStorePurchase.storeitemid = ItemID

                If platform = 2 Then
                    'IOS
                    Integer.TryParse(reader.GetString("iosid"), thisStorePurchase.iosid)
                End If

                If platform = 4 Then
                    'FACEBOOK CREDITS
                    'the facebook order info (order_info) value is the userid + the purchaseid - we then add on a  random 3 digit number at the end to confuse potential hackers!!!
                    Integer.TryParse(reader.GetString("fbid"), thisStorePurchase.fbid)
                    Dim alphabet As String = "abcdefghijklmnopqrstuvwxyz"

                    thisStorePurchase.fboi = UserID & alphabet.Substring(RandomNumber(25, 0), 1) & "" & thisStorePurchase.id & alphabet.Substring(RandomNumber(25, 0), 1) & "" & RandomNumber(999, 100)

                    'added this for new facebook method
                    thisStorePurchase.u = reader.GetString("url")
                End If
            End If

            'we no longer get these values here - we dont want to send secure UB details to the client!!!!
            'If thisStorePurchase.id > 0 And platform = 1 Then
            '    'get the ub details for web billing
            '    reader.NextResult()

            '    If reader.Read Then
            '        Integer.TryParse(reader.GetString("UBDeploymentID"), thisStorePurchase.ubdeploymentid)
            '        thisStorePurchase.ubusername = reader.GetString("UBUsername")
            '        thisStorePurchase.ubpassword = reader.GetString("UBPassword")
            '    End If
            'End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return thisStorePurchase
    End Function

    Public Shared Function RandomNumber(ByVal MaxNumber As Integer, Optional ByVal MinNumber As Integer = 0) As Integer

        'initialize random number generator
        Dim r As New Random(System.DateTime.Now.Millisecond)

        'if passed incorrect arguments, swap them
        'can also throw exception or return 0

        If MinNumber > MaxNumber Then
            Dim t As Integer = MinNumber
            MinNumber = MaxNumber
            MaxNumber = t
        End If

        Return r.Next(MinNumber, MaxNumber)

    End Function


    Public Shared Function UpdateUBBillRequestStatusViaListener(ByVal UBResultID As Integer, ByVal UBResult As String, ByVal UBResponse As String, ByVal displaytext As String, ByVal purchaseid As Integer, ByVal api_id As Integer, ByVal correlationid As String, ByVal billoptionid As Integer, ByVal amountbilled As Double, ByVal consumerid As String, ByVal billoutstanding As Double, ByVal currency As String) As Integer
        Dim status As Integer = -1
        Dim fixtureID As Integer = -1
        Dim userID As Integer = -1
        Dim storepurchaseid As Integer = -1
        Dim statusLogged As Integer
        Dim facebookUserId As Integer

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_UpdateUBBillRequestStatus_ViaListener"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_UBResultID", UBResultID)
            cmd.Parameters.AddWithValue("_UBResult", UBResult)
            cmd.Parameters.AddWithValue("_UBResponse", UBResponse)
            cmd.Parameters.AddWithValue("_displaytext", displaytext)
            cmd.Parameters.AddWithValue("_api_id", api_id)
            cmd.Parameters.AddWithValue("_purchaseid", purchaseid)
            cmd.Parameters.AddWithValue("_correlationid", correlationid)
            cmd.Parameters.AddWithValue("_billoptionid", billoptionid)
            cmd.Parameters.AddWithValue("_consumerid", consumerid)
            cmd.Parameters.AddWithValue("_amountbilled", amountbilled)
            cmd.Parameters.AddWithValue("_billoutstanding", billoutstanding)
            cmd.Parameters.AddWithValue("_currency", currency)

            reader = cmd.ExecuteReader
            If reader.Read Then
                statusLogged = 1
                Integer.TryParse(reader.GetString("status"), status)
                Integer.TryParse(reader.GetString("fixtureID"), fixtureID)
                Integer.TryParse(reader.GetString("userID"), userID)
                Integer.TryParse(reader.GetString("storepurchaseid"), storepurchaseid)
                facebookUserId = reader.GetString("facebookUserId")
            End If

            If status = 1 Then
                'the update was for a sucess - so update the transaction 
                Store.completeStorePurchase(fixtureID, userID, storepurchaseid, facebookUserId) 'status,
            End If

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return statusLogged
    End Function

    Public Shared Function UpdateUBBillRequestStatusV2(ByVal liveGamesUBPurchaseID As Integer, ByVal UBResultID As Integer, ByVal billstatus As String, ByVal billstatusID As Integer, ByVal UBResponse As String, ByVal SendURL As String, ByVal displaytext As String, ByVal purchaseid As Integer, ByVal api_id As Integer, ByVal correlationid As String, ByVal billoptionid As Integer, ByVal consumerid As String, ByVal amountbilled As Double, ByVal billoutstanding As String, ByVal currency As String, ByVal UBUserid As Integer, ByVal gooduser As String) As Integer
        Dim status As Integer = -1
        Dim returnValue As Integer = -1
        Dim viaListener As Integer
        Dim fixtureID As Integer = -1
        Dim userID As Integer = -1
        Dim storepurchaseid As Integer = -1
        Dim statusLogged As Integer
        Dim facebookUserId As String

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_UpdateUBBillRequestStatus_V2"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_liveGamesUBPurchaseID", liveGamesUBPurchaseID)
            cmd.Parameters.AddWithValue("_UBResultID", UBResultID)
            cmd.Parameters.AddWithValue("_billstatus", billstatus)
            cmd.Parameters.AddWithValue("_billstatusID", billstatusID)
            cmd.Parameters.AddWithValue("_UBResponse", UBResponse)
            cmd.Parameters.AddWithValue("_SendURL", SendURL)

            If String.IsNullOrEmpty(displaytext) Then
                cmd.Parameters.AddWithValue("_displaytext", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_displaytext", displaytext)
            End If

            If purchaseid = Nothing Then
                cmd.Parameters.AddWithValue("_purchaseid", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_purchaseid", purchaseid)
            End If

            If api_id = Nothing Then
                cmd.Parameters.AddWithValue("_api_id", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_api_id", api_id)
            End If

            If billoptionid = Nothing Then
                cmd.Parameters.AddWithValue("_billoptionid", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_billoptionid", billoptionid)
            End If

            If amountbilled = Nothing Then
                cmd.Parameters.AddWithValue("_amountbilled", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_amountbilled", amountbilled)
            End If

            If UBUserid = Nothing Then
                cmd.Parameters.AddWithValue("_UBUserid", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_UBUserid", UBUserid)
            End If

            If String.IsNullOrEmpty(correlationid) Then
                cmd.Parameters.AddWithValue("_correlationid", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_correlationid", correlationid)
            End If

            If String.IsNullOrEmpty(consumerid) Then
                cmd.Parameters.AddWithValue("_consumerid", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_consumerid", consumerid)
            End If

            If String.IsNullOrEmpty(billoutstanding) Then
                cmd.Parameters.AddWithValue("_billoutstanding", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_billoutstanding", billoutstanding)
            End If

            If String.IsNullOrEmpty(currency) Then
                cmd.Parameters.AddWithValue("_currency", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_currency", currency)
            End If

            If String.IsNullOrEmpty(gooduser) Then
                cmd.Parameters.AddWithValue("_gooduser", DBNull.Value)
            Else
                cmd.Parameters.AddWithValue("_gooduser", gooduser)
            End If

            reader = cmd.ExecuteReader
            If reader.Read Then
                Integer.TryParse(reader.GetString("status"), status)

                Integer.TryParse(reader.GetString("viaListener"), viaListener)
                If viaListener > 0 Then
                    returnValue = 1 'this just tells the listener that the status was logged
                    Integer.TryParse(reader.GetString("fixtureID"), fixtureID)
                    Integer.TryParse(reader.GetString("userID"), userID)
                    Integer.TryParse(reader.GetString("storepurchaseid"), storepurchaseid)
                    facebookUserId = reader.GetString("facebookUserId")
                Else
                    returnValue = status
                End If
            End If

            If status = 1 And viaListener > 0 Then
                'the update was for a sucess - so update the transaction 
                Store.completeStorePurchase(fixtureID, userID, storepurchaseid, facebookUserId) 'status,
            Else
                'update thetransaction via client side js call!!! - might change this to update here when we get more time!!
            End If

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return returnValue
    End Function



    Public Shared Function UpdateUBBillRequestStatus(ByVal liveGamesUBPurchaseID As Integer, ByVal UBResultID As Integer, ByVal billstatus As String, ByVal billstatusID As Integer, ByVal UBResponse As String, ByVal SendURL As String) As Integer
        Dim status As Integer = -1

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_UpdateUBBillRequestStatus"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_liveGamesUBPurchaseID", liveGamesUBPurchaseID)
            cmd.Parameters.AddWithValue("_UBResultID", UBResultID)
            cmd.Parameters.AddWithValue("_billstatus", billstatus)
            cmd.Parameters.AddWithValue("_billstatusID", billstatusID)
            cmd.Parameters.AddWithValue("_UBResponse", UBResponse)
            cmd.Parameters.AddWithValue("_SendURL", SendURL)

            reader = cmd.ExecuteReader
            If reader.Read Then
                Integer.TryParse(reader.GetString("status"), status)
            End If


        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return status
    End Function


    Public Shared Function LogUBBillRequestResponseinDB(ByVal liveGamesPurchaseID As Integer, ByVal status As Integer, ByVal UBResultID As Integer, ByVal UBResult As String, ByVal UBPurchaseID As Integer, ByVal UBSak As String, ByVal UBResponse As String, ByVal correlationID As String, ByVal unencryptedURLCalled As String) As Integer
        Dim logResult As Integer

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_LogUBBillRequestDetails"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_liveGamesPurchaseID", liveGamesPurchaseID)
            cmd.Parameters.AddWithValue("_UBPurchaseID", UBPurchaseID)
            cmd.Parameters.AddWithValue("_UBSak", UBSak)
            cmd.Parameters.AddWithValue("_UBResponse", UBResponse)
            cmd.Parameters.AddWithValue("_correlationID", correlationID)
            cmd.Parameters.AddWithValue("_UBResultID", UBResultID)
            cmd.Parameters.AddWithValue("_UBResult", UBResult)
            cmd.Parameters.AddWithValue("_status", status)
            cmd.Parameters.AddWithValue("_unencryptedURLCalled", unencryptedURLCalled)

            reader = cmd.ExecuteReader
            If reader.Read Then
                Integer.TryParse(reader.GetString("RC"), logResult)
            End If
        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return logResult
    End Function



    Public Shared Function GetUBDetails(ByVal fixtureID As Integer) As UBDetails
        Dim theseUBDetails As New UBDetails

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_GetUBDetails"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_fixtureID", fixtureID)

            reader = cmd.ExecuteReader()

            If reader.Read Then
                Integer.TryParse(reader.GetString("UBDeploymentID"), theseUBDetails.ubdeploymentid)
                theseUBDetails.ubusername = reader.GetString("UBUsername")
                theseUBDetails.ubpassword = reader.GetString("UBPassword")
                theseUBDetails.ubbillrequesturl = reader.GetString("ubbillrequesturl")
                theseUBDetails.ubbillcheckurl = reader.GetString("UBBillcheckURL")
                theseUBDetails.Currency = reader.GetString("Currency")
                theseUBDetails.developerid = reader.GetString("developerid")
                theseUBDetails.encryptionkey = reader.GetString("encryptionkey")
                theseUBDetails.gameurlroot = reader.GetString("gameurlroot")

                Integer.TryParse(reader.GetString("UBAppid"), theseUBDetails.ubappid)
                theseUBDetails.fixtureid = fixtureID
            End If

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return theseUBDetails
    End Function

    Public Shared Function GetStorePurchase(ByVal storePurchaseID As Integer, ByVal userid As Integer) As StorePurchase
        Dim thisStorePurchase As New StorePurchase

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("ReadReplica").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_GetStorePurchase"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_id", storePurchaseID)
            cmd.Parameters.AddWithValue("_userid", userid)

            reader = cmd.ExecuteReader()

            If reader.Read Then
                thisStorePurchase.id = storePurchaseID
                Integer.TryParse(reader("status"), thisStorePurchase.status)
            End If

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return thisStorePurchase
    End Function

    Shared Function LogIOSReceiptID(receiptID As String, purchaseID As Integer) As Object

        Dim updated As Integer = -1
        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_UpdateIOSPurchasesReceiptID"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_receipt_id", receiptID)
            cmd.Parameters.AddWithValue("_purchase_id", purchaseID)

            cmd.ExecuteNonQuery()
            updated = 1

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
        Return updated
    End Function


    Shared Function LogIOSReceiptInfo(quantity As String, productID As String, transactionID As String, purchaseDate As String, originalTransactionID As String, _
                                      originalPurchaseDate As String, appItemID As String, versionExternalId As String, bid As String, bvrs As String _
                                      , purchaseID As Integer, result As Integer) As Object

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_UpdateIOSReceiptInfo"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_quantity", quantity)
            cmd.Parameters.AddWithValue("_result", result)
            cmd.Parameters.AddWithValue("_product_id", productID)
            cmd.Parameters.AddWithValue("_transaction_id", transactionID)
            cmd.Parameters.AddWithValue("_purchase_date", purchaseDate)
            cmd.Parameters.AddWithValue("_original_transaction_id", originalTransactionID)
            cmd.Parameters.AddWithValue("_original_purchase_date", originalPurchaseDate)
            cmd.Parameters.AddWithValue("_app_item_id", appItemID)
            cmd.Parameters.AddWithValue("_version_external_identifier", versionExternalId)
            cmd.Parameters.AddWithValue("_bid", bid)
            cmd.Parameters.AddWithValue("_bvrs", bvrs)
            cmd.Parameters.AddWithValue("_purchase_id", purchaseID)

            cmd.ExecuteNonQuery()

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
    End Function

    Shared Function ValidateReceipt(jsonString As String) As String
        Dim req As WebRequest = WebRequest.Create("https://sandbox.itunes.apple.com/verifyReceipt")
        Dim jsonDataBytes = Encoding.UTF8.GetBytes(jsonString)
        req.ContentType = "application/json"
        req.Method = "POST"
        req.ContentLength = jsonDataBytes.Length


        Dim stream = req.GetRequestStream()
        stream.Write(jsonDataBytes, 0, jsonDataBytes.Length)
        stream.Close()

        Dim response = req.GetResponse().GetResponseStream()

        Dim reader As New StreamReader(response)
        Dim res = reader.ReadToEnd()
        reader.Close()
        response.Close()

        Return res
    End Function




    Shared Function LogIOSReceiptError(errorCode As Integer, errorText As String, purchaseID As Integer) As Object

        Dim conn As New MySqlConnection
        conn.ConnectionString = ConfigurationManager.ConnectionStrings("mysql").ConnectionString
        Dim connResponse As New MySqlConnection
        Dim reader As MySqlDataReader
        Dim cmd As MySqlCommand
        Try
            conn.Open()

            Dim query As String = "USP_Store_IOSPurchaseError"
            cmd = New MySqlCommand(query, conn)
            cmd.CommandType = CommandType.StoredProcedure
            cmd.Parameters.AddWithValue("_errorCode", errorCode)
            cmd.Parameters.AddWithValue("_errorText", errorText)
            cmd.Parameters.AddWithValue("_purchase_id", purchaseID)

            cmd.ExecuteNonQuery()

        Catch myerror As MySqlException
            T5Error.LogError("VB", myerror.ToString)
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
    End Function


End Class
