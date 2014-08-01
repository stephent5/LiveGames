Public Class UBListener
    Inherits System.Web.UI.Page

    Dim billstatusID As Integer
    Dim billstatus As String = ""
    Dim displaytext As String = ""
    Dim purchaseid As Integer
    Dim api_id As Integer
    Dim correlationid As String = ""
    Dim billoptionid As Integer
    Dim consumerid As String = ""
    Dim amountbilled As Double
    Dim billoutstanding As Double
    Dim currency As String = ""

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
      
        Integer.TryParse(Request("billstatusID"), billstatusID)
        billstatus = Request("billstatus")
        displaytext = Request("displaytext")
        Integer.TryParse(Request("purchaseid"), purchaseid)
        Integer.TryParse(Request("id"), api_id)
        correlationid = Request("correlationid")
        Integer.TryParse(Request("billoptionid"), billoptionid)
        consumerid = Request("consumerid")
        Double.TryParse(Request("amountbilled"), amountbilled)
        Double.TryParse(Request("billoutstanding"), billoutstanding)
        currency = Request("currency")

        'need userid
        'goodUser

        Response.ContentType = "text/xml"

        'If Store.UpdateUBBillRequestStatusViaListener(billstatusID, billstatus, Request.RawUrl, displaytext, purchaseid, api_id, correlationid, billoptionid, amountbilled, consumerid, billoutstanding, currency) > 0 Then
        If Store.UpdateUBBillRequestStatusV2(-1, -1, billstatus, billstatusID, Request.RawUrl, Nothing, displaytext, purchaseid, api_id, correlationid, billoptionid, consumerid, amountbilled, billoutstanding, currency, Nothing, "") > 0 Then
            Response.Write("<StatusNotify><StatusResponse ID=""" & api_id & """ /></StatusNotify>")
        Else
            Response.Write("<StatusNotify><StatusResponse ID=""-1"" /></StatusNotify>")
        End If



    End Sub




End Class