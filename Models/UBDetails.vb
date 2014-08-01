Imports System.Security.Cryptography

Public Class UBDetails

    Public Property ubdeploymentid As String
    Public Property ubappid As String
    Public Property ubusername As String
    Public Property ubpassword As String
    Public Property ubbillrequesturl As String
    Public Property ubbillcheckurl As String
    Public Property developerid As String
    Public Property encryptionkey As String
    Public Property currency As String
    Public Property fixtureid As Integer
    Public Property gameurlroot As String


    'Public Sub New(ubdeploymentid_in, ubappid_in, ubusername_in, ubpassword_in, ubbillrequesturl_in, ubbillcheckurl_in, developerid_in, encryptionkey_in, currency_in, fixtureid_in, gameurlroot_in)
    '    ubdeploymentid = ubdeploymentid_in
    '    ubappid = ubappid_in
    '    ubusername = ubusername_in
    '    ubpassword = ubpassword_in
    '    ubbillrequesturl = ubbillrequesturl_in
    '    ubbillcheckurl = ubbillcheckurl_in
    '    developerid = developerid_in
    '    encryptionkey = encryptionkey_in
    '    currency = currency_in
    '    fixtureid = fixtureid_in
    '    gameurlroot = gameurlroot_in
    'End Sub

    'Shared Function GetUBDetails() As UBDetails
    '    If Not String.IsNullOrEmpty(HttpContext.Current.Session("ubdeploymentid")) AndAlso _
    '        Not String.IsNullOrEmpty(HttpContext.Current.Session("ubappid")) AndAlso _
    '        Not String.IsNullOrEmpty(HttpContext.Current.Session("ubusername")) AndAlso _
    '        Not String.IsNullOrEmpty(HttpContext.Current.Session("ubpassword")) AndAlso _
    '        Not String.IsNullOrEmpty(HttpContext.Current.Session("ubbillrequesturl")) AndAlso _
    '        Not String.IsNullOrEmpty(HttpContext.Current.Session("ubbillcheckurl")) AndAlso _
    '        Not String.IsNullOrEmpty(HttpContext.Current.Session("developerid")) AndAlso _
    '        Not String.IsNullOrEmpty(HttpContext.Current.Session("encryptionkey")) AndAlso _
    '        Not String.IsNullOrEmpty(HttpContext.Current.Session("fixtureid")) AndAlso _
    '        Not String.IsNullOrEmpty(HttpContext.Current.Session("gameurlroot")) AndAlso _
    '        Not String.IsNullOrEmpty(HttpContext.Current.Session("currency")) Then

    '        'ALL UBDetails properties are in the cache

    '        Dim tempUBDetails As New UBDetails(HttpContext.Current.Session("ubdeploymentid"), HttpContext.Current.Session("ubappid"), HttpContext.Current.Session("ubusername"), _
    '                                           HttpContext.Current.Session("ubpassword"), HttpContext.Current.Session("ubbillrequesturl"), HttpContext.Current.Session("ubbillcheckurl"), _
    '                                           HttpContext.Current.Session("developerid"), HttpContext.Current.Session("encryptionkey"), HttpContext.Current.Session("currency"), HttpContext.Current.Session("fixtureid"), _
    '                                           HttpContext.Current.Session("gameurlroot"))

    '    End If



    'End Function

    ''Issues Adding complex objects to Dynamo DB session - so add each property of the UBDetails to the session individually
    'Shared Sub AddUBDetailsToSession(ByVal theseUBDetails As UBDetails)
    '    HttpContext.Current.Session.Add("ubdeploymentid", theseUBDetails.ubdeploymentid)
    '    HttpContext.Current.Session.Add("ubappid", theseUBDetails.ubappid)
    '    HttpContext.Current.Session.Add("ubusername", theseUBDetails.ubusername)
    '    HttpContext.Current.Session.Add("ubpassword", theseUBDetails.ubpassword)
    '    HttpContext.Current.Session.Add("ubbillrequesturl", theseUBDetails.ubbillrequesturl)
    '    HttpContext.Current.Session.Add("ubbillcheckurl", theseUBDetails.ubbillcheckurl)
    '    HttpContext.Current.Session.Add("developerid", theseUBDetails.developerid)
    '    HttpContext.Current.Session.Add("encryptionkey", theseUBDetails.encryptionkey)
    '    HttpContext.Current.Session.Add("currency", theseUBDetails.currency)
    '    HttpContext.Current.Session.Add("gameurlroot", theseUBDetails.gameurlroot)
    '    HttpContext.Current.Session.Add("fixtureid", theseUBDetails.fixtureid)
    'End Sub

    Public Function getRSAPublicXMLKey() As String
        Dim xmlString As String
        xmlString = "<RSAKeyValue>"
        xmlString &= "<Modulus>" & encryptionkey & "</Modulus>"
        xmlString &= "<Exponent>AQAB</Exponent>"
        xmlString &= "</RSAKeyValue>"
        Return xmlString
    End Function

    Public Function rsaEncrypt(ByVal unEncryptedText As String) As String
        Dim xmlKey As String = getRSAPublicXMLKey()
        Dim blockSize As Integer = 117
        Dim rsa As RSACryptoServiceProvider

        rsa = New RSACryptoServiceProvider()
        rsa.FromXmlString(xmlKey)

        Dim splittedArrayList As List(Of String) = split(unEncryptedText, blockSize)
        Dim encryptedString As String = ""
        For Each s As String In splittedArrayList
            Dim unEncryptedBytes As Byte() = System.Text.Encoding.UTF8.GetBytes(s)
            Dim plain As Byte() = rsa.Encrypt(unEncryptedBytes, False)
            encryptedString &= Convert.ToBase64String(plain)
        Next
        Return encryptedString
    End Function

    Private Function split(ByVal text As String, ByVal size As Integer) As List(Of String)
        Dim textArrayList As New List(Of String)
        If String.IsNullOrEmpty(text) Then
            textArrayList.Add(text)
        Else
            For i As Integer = 0 To text.Length - 1 Step size
                textArrayList.Add(text.Substring(i, Math.Min(size, (text.Length - i))))
            Next
        End If
        Return textArrayList
    End Function


End Class
