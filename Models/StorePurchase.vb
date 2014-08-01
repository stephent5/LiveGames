Public Class StorePurchase

    Public Property id As Integer
    Public Property storeitemid As Integer
    Public Property name As String
    Public Property price As Double
    Public Property time As String

    Public Property cs As String 'currencysymbol
    
    Public Property status As Integer
    Public Property purchasedescription As String
    Public Property purchaseresult As Integer

    'ub specific details
    Public Property ubid As Integer
    Public Property ubpurchaseid As Integer
    Public Property ubsak As String
    Public Property ubbilloptionid As Integer
    Public Property ubresultid As Integer

    'IOS specific details
    Public Property iosid As Integer

    'Facebook credits specific details
    Public Property fboi As String 'facebook order info (order_info)
    Public Property fbid As Integer
    Public Property p As Integer 'p = platform
    Public Property u As String 'url where facebook can get the details for the item

End Class
