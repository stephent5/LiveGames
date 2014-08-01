Public Class StoreItem

    Public Property id As Integer
    Public Property name As String
    Public Property cs As String 'currencysymbol
    Public Property c As Integer 'currencyid
    Public Property price As Decimal
    Public Property pricedescription As String
    Public Property description As String
    Public Property imgurl As String
    Public Property displayorder As String
    Public Property fbid As Integer
    Public Property stid As Integer ' this identifies the row in the store tiered table - which in turn tells us where we got the price and country from 

End Class
