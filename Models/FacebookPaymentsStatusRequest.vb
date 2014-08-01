Public Class FacebookPaymentsStatusRequest

    Public Property order_id As String
    Public Property buyer As String
    Public Property app As String
    Public Property receiver As String
    Public Property amount As Decimal
    Public Property items As System.Collections.Generic.List(Of FacebookCreditsItem)
    Public Property status As String

End Class
