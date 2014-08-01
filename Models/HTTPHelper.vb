
''' <summary>
''' A helper class that provides a static function to get the remote IP address of the current HTTP Context.
''' </summary>
''' <remarks>Created by Gamal 12/04/2013</remarks>

Public Class HTTPHelper


    ''' <summary>
    ''' A helper function that tries to fetch for the correct Remote IP given a context. It is useful in load-balanced envirnoment where the remote IP address is reported incorrectly.
    ''' </summary>
    ''' <param name="context">Current HTTP Context</param>
    ''' <returns>The remote IP address of the HTTP request</returns>
    ''' <remarks></remarks>
    Public Shared Function getRemoteIP(ByVal context As HttpContext) As String
        Try
            Dim remoteIP As String = context.Request.UserHostAddress
            Dim remoteIPArray As String()
            If remoteIP.Contains(":") Then
                remoteIPArray = remoteIP.Split(":")
            Else
                remoteIPArray = remoteIP.Split(".")
            End If
            If Not String.IsNullOrEmpty(remoteIPArray(0)) Then
                Dim IP01 As Integer = remoteIPArray(0)
                Dim IP02 As Integer = remoteIPArray(1)
                Dim IP03 As Integer = remoteIPArray(2)


                Dim HTTP_X_FORWARDED_FOR As String = context.Request.ServerVariables("HTTP_X_FORWARDED_FOR")
                If Not String.IsNullOrEmpty(remoteIP) Then
                    If isIPReserved(IP01, IP02, IP03) Then
                        If Not String.IsNullOrEmpty(HTTP_X_FORWARDED_FOR) Then
                            Dim listOfForwarded As String()
                            listOfForwarded = HTTP_X_FORWARDED_FOR.Split(",")
                            Dim IP As String()
                            For Each i As String In listOfForwarded
                                If i.Contains(":") Then
                                    IP = i.Split(":")
                                Else
                                    IP = i.Split(".")
                                End If

                                Dim IP01X_FORWARDED As Integer = IP(0)
                                Dim IP02X_FORWARDED As Integer = IP(1)
                                Dim IP03X_FORWARDED As Integer = IP(2)
                                If Not isIPReserved(IP01X_FORWARDED, IP02X_FORWARDED, IP03X_FORWARDED) Then
                                    Return i
                                    Exit For
                                End If
                            Next
                        Else
                            Return remoteIP
                        End If
                    Else
                        Return remoteIP
                    End If
                End If
            End If
            Return String.Empty
        Catch ex As Exception
            Return String.Empty
        End Try
    End Function

    ''' <summary>
    ''' A function that checks if an IP address is a reserved IP or not
    ''' </summary>
    ''' <param name="IP01">First octet of IP Address</param>
    ''' <param name="IP02">Second octet of IP Address</param>
    ''' <param name="IP03">Third octet of IP Address</param>
    ''' <returns>True if IP Address is reserved or false otherwise</returns>
    ''' <remarks></remarks>
    Private Shared Function isIPReserved(ByVal IP01 As Integer, ByVal IP02 As Integer, ByVal IP03 As Integer) As Boolean
        '0.0.0.0 - 0.255.255.255 -> This network
        '10.0.0.0 - 10.255.255.255 -> Private-use-Networks
        '127.0.0.0 - 127.255.255.255 -> Loopback
        '169.254.0.0 - 169.254.255.255 -> Link Local
        '172.16.0.0 - 172.31.255.255 -> Private-Use Networks
        '192.0.0.0 - 192.0.0.255 -> IETF Protocol Assignments
        '192.0.2.0 - 192.0.2.255 -> Test-NET-1
        '192.168.0.0 - 192.168.255.255 -> Private-Use Networks
        '198.18.0.0 - 198.19.255.255 -> Network Interconnect Devices Benchmark Testing
        '198.51.100.0 - 198.51.100.255 -> Test-Net-2
        '203.0.113.0 - 203.0.113.255 -> Test-Net-3
        '224.0.0.0 - 239.255.255.255 -> Multicast
        '240.0.0.0 - 255.255.255.255 -> reserved for future use and limited broadcast
        Try
            If (IP01 = 10) Or (IP01 = 0) Or (IP01 = 127) Or (IP01 = 169 AndAlso IP02 = 254) Or _
            (IP01 = 172 AndAlso (IP02 >= 16 And IP02 <= 31)) Or (IP01 = 192 AndAlso IP02 = 0 AndAlso IP03 = 0) Or _
            (IP01 = 192 AndAlso IP02 = 0 AndAlso IP03 = 2) Or (IP01 = 192 AndAlso IP02 = 88 AndAlso IP03 = 99) Or _
            (IP01 = 192 AndAlso IP02 = 168) Or (IP01 = 198 AndAlso (IP02 = 18 Or IP02 = 19)) Or _
            (IP01 = 198 AndAlso IP02 = 51 AndAlso IP03 = 100) Or (IP01 = 203 AndAlso IP02 = 0 AndAlso IP03 = 113) Or _
            (IP01 >= 224 AndAlso IP01 <= 239) Or (IP01 >= 240 AndAlso IP01 <= 255) Then
                'IP is reserved
                Return True
            Else
                Return False
            End If
        Catch ex As Exception
            Return True
        End Try

    End Function

End Class