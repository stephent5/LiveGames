Imports System.Threading.Tasks

Public Class TestController
    'Inherits System.Web.Mvc.AsyncController
    Inherits System.Web.Mvc.Controller

    Function Index() As ActionResult
        ViewData("Message") = "Modify this template to jump-start your ASP.NET MVC application."

        Return View()
    End Function

    Function About() As ActionResult
        ViewData("Message") = "Your app description page."

        Return View()
    End Function

    Function Contact() As ActionResult
        ViewData("Message") = "Your contact page."

        Return View()
    End Function

    'Async Function PlaceBetAsync(ByVal u As Integer, ByVal e As Integer, ByVal f As Integer, ByVal a As Integer, ByVal fu As String) As Task(Of ActionResult)
    '    Response.Cache.SetCacheability(HttpCacheability.NoCache)

    '    'Try
    '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
    '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet before DB Connection eventid is " & thisBet.eventid)
    '    'Catch ex As Exception
    '    'End Try
    '    Dim thisBet As New Bet
    '    thisBet.eventid = e
    '    thisBet.userid = u
    '    thisBet.fixtureid = f
    '    thisBet.amount = a

    '    'Await thisBet.PlaceBet(fu)
    '    'Try
    '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
    '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet after DB Connection eventid is " & thisBet.eventid)
    '    'Catch ex As Exception
    '    'End Try
    '    Return Json(Await thisBet.PlaceBetAsync(fu), JsonRequestBehavior.AllowGet)
    'End Function

    'Async Function PlaceBetAss(ByVal u As Integer, ByVal e As Integer, ByVal f As Integer, ByVal a As Integer, ByVal fu As String) As Task(Of ActionResult)
    '    Response.Cache.SetCacheability(HttpCacheability.NoCache)

    '    'Try
    '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
    '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet before DB Connection eventid is " & thisBet.eventid)
    '    'Catch ex As Exception
    '    'End Try
    '    Dim thisBet As New Bet
    '    thisBet.eventid = e
    '    thisBet.userid = u
    '    thisBet.fixtureid = f
    '    thisBet.amount = a

    '    'Await thisBet.PlaceBet(fu)
    '    'Try
    '    '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
    '    '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet after DB Connection eventid is " & thisBet.eventid)
    '    'Catch ex As Exception
    '    'End Try
    '    Return Json(Await thisBet.PlaceBetAsync(fu), JsonRequestBehavior.AllowGet)
    'End Function

    Function PlaceBetOriginal(ByVal u As Integer, ByVal e As Integer, ByVal f As Integer, ByVal a As Integer, ByVal fu As String) As ActionResult
        Response.Cache.SetCacheability(HttpCacheability.NoCache)

        'Try
        '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet before DB Connection eventid is " & thisBet.eventid)
        'Catch ex As Exception
        'End Try
        Dim thisBet As New Bet
        thisBet.eventid = e
        thisBet.userid = u
        thisBet.fixtureid = f
        thisBet.amount = a

        'Await thisBet.PlaceBet(fu)
        'Try
        '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet after DB Connection eventid is " & thisBet.eventid)
        'Catch ex As Exception
        'End Try
        Return Json(thisBet.PlaceBet(fu), JsonRequestBehavior.AllowGet)
    End Function

    Function PlaceBetNoDB(ByVal u As Integer, ByVal e As Integer, ByVal f As Integer, ByVal a As Integer, ByVal fu As String) As ActionResult
        Response.Cache.SetCacheability(HttpCacheability.NoCache)

        'Try
        '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet before DB Connection eventid is " & thisBet.eventid)
        'Catch ex As Exception
        'End Try
        Dim thisBet As New Bet
        thisBet.eventid = e
        thisBet.userid = u
        thisBet.fixtureid = f
        thisBet.amount = a

        'Await thisBet.PlaceBet(fu)
        'Try
        '    'this line is purely for testing/debugging we are logging when we get to the web app from the client
        '    Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In PlaceBet after DB Connection eventid is " & thisBet.eventid)
        'Catch ex As Exception
        'End Try
        Return Json(thisBet, JsonRequestBehavior.AllowGet)
    End Function



End Class
