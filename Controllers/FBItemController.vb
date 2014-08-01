Namespace LiveGamesClient1._2
    Public Class FBItemController
        Inherits System.Web.Mvc.Controller

        '
        ' GET: /FBItem

        Function Index(ByVal i As Integer) As ActionResult
            'ViewBag.fbitem = FBItem.GetFBItemDEtails(i)
            Return View(FBItem.GetFBItemDEtails(i))
        End Function

    End Class
End Namespace
