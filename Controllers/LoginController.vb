Imports Newtonsoft.Json

Namespace LiveGamesClient1._2
    Public Class LoginController
        Inherits System.Web.Mvc.Controller


        Function Login(ByVal fbUserID As String,
            ByVal name As String,
            ByVal first_name As String,
            ByVal last_name As String,
            ByVal link As String,
            ByVal locale As String,
            ByVal gender As String,
            ByVal birthday As String,
            ByVal email As String,
            ByVal timezone As String,
            ByVal verified As String,
            ByVal profilepic As String,
            ByVal fixtureid As Integer)

            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Try
                'this line is purely for testing/debugging we are logging when we get to the web app from the client
                Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In Login - Before DB Connection fbUserID is " + fbUserID)
            Catch ex As Exception
            End Try

            Dim Result As String = ""
            Dim currentUser As New User(name, fbUserID, first_name, last_name, link, locale, 0, gender, birthday, email, timezone, verified, profilepic)
            currentUser.CreateUpdateUserInDB(fixtureid)

            If currentUser.id > 0 Then
                'user logged in 
                Dim before As DateTime = DateTime.Now
                Dim afterQuery As DateTime
                Dim QuerySpan As TimeSpan
                Dim AsyncCaller As New Logger.LogTimeTakenAsyncMethodCaller(AddressOf Logger.LogTimeTaken)
                Dim LogResult As IAsyncResult

                'removed the session logic below 
                'we no longer validate normal users connections ( we are only going to validate the admin!!!)
                'so we dont want to access DynamoDB session too often ( especially if its not neccessary!!)
                'Session.Add("id", currentUser.id)
                'afterQuery = DateTime.Now
                'QuerySpan = afterQuery - before
                '
                'LogResult = AsyncCaller.BeginInvoke("Add id to session", QuerySpan.TotalMilliseconds, Nothing, Nothing)

                If currentUser.level = "trust5" Then
                    'this user IS the admin - then we DO log in session!!!!!
                    before = DateTime.Now
                    Session.Add("id", currentUser.id)
                    Session.Add("level", currentUser.level)
                    afterQuery = DateTime.Now
                    QuerySpan = afterQuery - before
                    LogResult = AsyncCaller.BeginInvoke("Add level to session", QuerySpan.TotalMilliseconds, Nothing, Nothing)
                End If
            End If

            Try
                'this line is purely for testing/debugging we are logging when we get to the web app from the client
                Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In Login - After DB Connection fbUserID is " + fbUserID)
            Catch ex As Exception
            End Try

            'Dim errorUser As User
            'Result = JsonConvert.SerializeObject(errorUser.fbuserid.Length)

            Result = JsonConvert.SerializeObject(currentUser)

            Return Result
        End Function


        Function LoginStress(ByVal fbUserID As String,
            ByVal name As String,
            ByVal first_name As String,
            ByVal last_name As String,
            ByVal link As String,
            ByVal locale As String,
            ByVal gender As String,
            ByVal birthday As String,
            ByVal email As String,
            ByVal timezone As String,
            ByVal verified As String,
            ByVal profilepic As String,
            ByVal fixtureid As Integer) As JsonResult

            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Try
                'this line is purely for testing/debugging we are logging when we get to the web app from the client
                Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In Login - Before DB Connection fbUserID is " + fbUserID)
            Catch ex As Exception
            End Try

            Dim Result As String = ""
            Dim currentUser As New User(name, fbUserID, first_name, last_name, link, locale, 0, gender, birthday, email, timezone, verified, profilepic)
            currentUser.CreateUpdateUserInDB(fixtureid)

            If currentUser.id > 0 Then
                'user logged in 
                Dim before As DateTime = DateTime.Now
                Dim afterQuery As DateTime
                Dim QuerySpan As TimeSpan
                Dim AsyncCaller As New Logger.LogTimeTakenAsyncMethodCaller(AddressOf Logger.LogTimeTaken)
                Dim LogResult As IAsyncResult

                'removed the session logic below 
                'we no longer validate normal users connections ( we are only going to validate the admin!!!)
                'so we dont want to access DynamoDB session too often ( especially if its not neccessary!!)
                'Session.Add("id", currentUser.id)
                'afterQuery = DateTime.Now
                'QuerySpan = afterQuery - before
                '
                'LogResult = AsyncCaller.BeginInvoke("Add id to session", QuerySpan.TotalMilliseconds, Nothing, Nothing)

                If currentUser.level = "trust5" Then
                    'this user IS the admin - then we DO log in session!!!!!
                    before = DateTime.Now
                    Session.Add("id", currentUser.id)
                    Session.Add("level", currentUser.level)
                    afterQuery = DateTime.Now
                    QuerySpan = afterQuery - before
                    LogResult = AsyncCaller.BeginInvoke("Add level to session", QuerySpan.TotalMilliseconds, Nothing, Nothing)
                End If
            End If

            Try
                'this line is purely for testing/debugging we are logging when we get to the web app from the client
                Logger.Log(BitFactory.Logging.LogSeverity.Info, "TraceFlow", "In Login - After DB Connection fbUserID is " + fbUserID)
            Catch ex As Exception
            End Try

            'Dim errorUser As User
            'Result = JsonConvert.SerializeObject(errorUser.fbuserid.Length)

            Result = JsonConvert.SerializeObject(currentUser)

            Return Json(Result, JsonRequestBehavior.AllowGet)
        End Function

        'Confirm Email
        Function CEmail(ByVal ch As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim userid As String = ch.Split("kotk")(0)
            Dim hash As String
            Try
                hash = ch.Split("kotk")(2) 'why is this 2 and not 1?????
            Catch ex As Exception
                hash = ch.Split("kotk")(1) 'why is this 2 and not 1?????
            End Try


            Dim thisUser As New User

            If Not String.IsNullOrEmpty(userid) AndAlso Not String.IsNullOrEmpty(hash) Then
                If hash = Fixture.getMd5Hash(ConfigurationManager.AppSettings("FacebookSecret") & ":" & userid) Then
                    'Valid hash - so the user HAs confirmed thier email
                    'update DB with this and return the user object
                    thisUser = Fixture.ConfirmEmail(userid, hash)

                    If thisUser.id > 0 Then
                        'user logged in 
                        Dim before As DateTime = DateTime.Now
                        Dim afterQuery As DateTime
                        Dim QuerySpan As TimeSpan
                        Dim AsyncCaller As New Logger.LogTimeTakenAsyncMethodCaller(AddressOf Logger.LogTimeTaken)
                        Dim LogResult As IAsyncResult

                        'removed the session logic below 
                        'we no longer validate normal users connections ( we are only going to validate the admin!!!)
                        'so we dont want to access DynamoDB session too often ( especially if its not neccessary!!)
                        'Session.Add("id", thisUser.id)
                        'afterQuery = DateTime.Now
                        'QuerySpan = afterQuery - before
                        '
                        'LogResult = AsyncCaller.BeginInvoke("Add id to session", QuerySpan.TotalMilliseconds, Nothing, Nothing)


                        If thisUser.level = "trust5" Then
                            'this user IS the admin - then we DO log in session!!!!!
                            before = DateTime.Now
                            Session.Add("id", thisUser.id)
                            Session.Add("level", thisUser.level)
                            afterQuery = DateTime.Now
                            QuerySpan = afterQuery - before
                            LogResult = AsyncCaller.BeginInvoke("Add level to session", QuerySpan.TotalMilliseconds, Nothing, Nothing)
                        End If
                    End If

                Else
                    thisUser.id = -2 'invalid HASH
                End If
            Else
                thisUser.id = -3
            End If
            Return Json(thisUser)
        End Function

        'this function does BOTH a login with a username/pass or the RememberMeGuid(rmg) if the user previously clicked RememberMe
        Function EmailLogin(ByVal e As String, ByVal p As String, ByVal r As Integer, ByVal rmg As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Return Json(Fixture.EmailSignIn(e, p, r, rmg))
        End Function


        Function Logout() As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Try
                Session.RemoveAll()
                Return Json(1)
            Catch ex As Exception
                T5Error.LogError("VB", "Logout error " & ex.ToString)
                Return Json(-1)
            End Try
        End Function

        'Register Email
        Function REmail(ByVal e As String, ByVal p As String, ByVal u As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim result As RegisterResult = Fixture.RegisterEmail(e, p, u)
            Dim returnResult = -0

            If (result.ResultID = 1 Or result.ResultID = -103) And result.UserID > 0 Then
                'users email was registered - now send out confirmation email
                Dim HashKey As String = Fixture.UpdateDBWithHash(Fixture.getMd5Hash(ConfigurationManager.AppSettings("FacebookSecret") & ":" & result.UserID), result.UserID)
                If Not String.IsNullOrEmpty(HashKey) Then

                    If Email.SendEmail(e, "King Of The Kop", "Click this link to confirm your email and start playing <br /> ", result.EmailConfirmationURL & result.UserID & "kotk" & HashKey) Then
                        returnResult = 1 'all good
                    Else
                        returnResult = -105 'error sending the Konfirmation email 
                    End If
                Else
                    returnResult = -104 'error generating the email url
                End If
            Else
                returnResult = result.ResultID
            End If
            Return Json(returnResult)
        End Function

        'Register Email
        Function ResendPassword(ByVal e As String) As JsonResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)

            Dim password As String = Fixture.GetPasswordLinkedToEmail(e)
            Dim returnResult = -0

            If Not String.IsNullOrEmpty(password) Then 'valid email - so now send the password!!!
                If Email.SendEmail(e, "King Of The Kop Password Reminder", "Your King of The Kop password is <br /> " & password, "") Then
                    returnResult = 1 'all good
                Else
                    returnResult = -105 'error sending the email 
                End If
            Else
                returnResult = -102 'Email does not have a login
            End If
            Return Json(returnResult)
        End Function

        Function ChangePassword(ByVal u As Integer, ByVal op As String, ByVal np As String, ByVal fu As String) As ActionResult
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Return Json(Fixture.UpdatePassword(op, np, u, fu))
        End Function


        ''
        '' GET: /Login

        'Function Index() As ActionResult
        '    Return View()
        'End Function

        ''
        '' GET: /Login/Details/5

        'Function Details(ByVal id As Integer) As ActionResult
        '    Return View()
        'End Function

        ''
        '' GET: /Login/Create

        'Function Create() As ActionResult
        '    Return View()
        'End Function

        ''
        '' POST: /Login/Create

        '<HttpPost> _
        'Function Create(ByVal collection As FormCollection) As ActionResult
        '    Try
        '        ' TODO: Add insert logic here
        '        Return RedirectToAction("Index")
        '    Catch
        '        Return View()
        '    End Try
        'End Function

        ''
        '' GET: /Login/Edit/5

        'Function Edit(ByVal id As Integer) As ActionResult
        '    Return View()
        'End Function

        ''
        '' POST: /Login/Edit/5

        '<HttpPost> _
        'Function Edit(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
        '    Try
        '        ' TODO: Add update logic here

        '        Return RedirectToAction("Index")
        '    Catch
        '        Return View()
        '    End Try
        'End Function

        ''
        '' GET: /Login/Delete/5

        'Function Delete(ByVal id As Integer) As ActionResult
        '    Return View()
        'End Function

        ''
        '' POST: /Login/Delete/5

        '<HttpPost> _
        'Function Delete(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
        '    Try
        '        ' TODO: Add delete logic here

        '        Return RedirectToAction("Index")
        '    Catch
        '        Return View()
        '    End Try
        'End Function     
    End Class
End Namespace
