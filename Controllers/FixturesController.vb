Namespace LiveGamesClient1._2
    Public Class FixturesController
        Inherits System.Web.Mvc.Controller

        ' GET: /Fixtures
        ''Set the GameID as default to 1 i.e. - Default fixtures are soccer fixtures 
        Function Index(Optional ByVal GameID As Integer = 1, Optional ByVal f As Integer = -1) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Dim LiveEventMethod As String = ConfigurationManager.AppSettings("LiveEventMethod")
            ViewBag.liveeventmethod = LiveEventMethod

            'no longer do this - instead we will determine if we are in a facebook session via javascript!!
            'ViewBag.isfacebooksession = FacebookHelper.isFaceBookSession


            'If F > 0 Then
            '    'user has been sent here looking for a specific fixture
            '    'this must mean the user has come from facebook - redirect user to fixturepage
            '    Dim rooturl = String.Format("{0}://{1}{2}", Request.Url.Scheme, Request.Url.Authority, Url.Content("~"))
            '    Dim fixtureURL As String = rooturl + "Game/?f=" & f
            '    Response.Redirect(fixtureURL)
            'Else
            '    'display list of fixtures as normal
            '    Dim model = Fixture.GetFixtures(GameID)
            '    Return View(model)
            'End If
            Return View()
        End Function

        Function GetFixtures(ByVal u As Integer) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Return Json(Fixture.GetFixtures(1, u))
        End Function

        '
        ' GET: /Fixtures/Details/5

        Function Details(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' GET: /Fixtures/Create

        Function Create() As ActionResult
            Return View()
        End Function

        '
        ' POST: /Fixtures/Create

        <HttpPost> _
        Function Create(ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add insert logic here
                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function
        
        '
        ' GET: /Fixtures/Edit/5

        Function Edit(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /Fixtures/Edit/5

        <HttpPost> _
        Function Edit(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add update logic here

                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function

        '
        ' GET: /Fixtures/Delete/5

        Function Delete(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /Fixtures/Delete/5

        <HttpPost> _
        Function Delete(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add delete logic here

                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function     
    End Class
End Namespace
