Public Class GameEvent

    Public Property e As Integer  'eventid
    Public Property f As Integer 'fixtureid

    'Public Property u As Integer 'eventupdateid
    Public Property u As String  'this was changed to a string - stephen 18-sep as we had id's clashing so we repend the id with 'E' or "b" etc

    Public Property d As String 'description
    'Public Property h As Integer 'homescore
    'Public Property awayscore As Integer 'awayscore
    'Public Property et As String 'eventtime
    'Public Property eet As String 'eventendtime  'added stephen 20-Feb-12 - need this since we started using the freeze time as the event time
    Public Property c As Integer 'currenthalf '//added stephen 24-Feb-12 - we need to know in which half an event happened!!

End Class
