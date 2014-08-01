Imports System
Imports System.Threading
Imports System.Threading.Tasks
Imports Microsoft.AspNet.SignalR.Hubs


Public Class MyHub
    Inherits Hub

    'Public Sub Foo()
    '    Caller.bar("Hello")
    '    Caller.baz(1)
    '    Caller.foo(New With { _
    '        Key .Name = "David Fowler", _
    '        Key .Age = 24 _
    '    })
    '    Caller.multipleParams(1, 2, New With {Key .Name = "John"})
    '    Caller.notify()
    'End Sub

    'Public Function GetString() As String
    '    Return "David"
    'End Function

    'Public Function GetTask(person As Person) As Task(Of Integer)
    '    Return Task.Factory.StartNew(Function()
    '                                     Thread.Sleep(1000)
    '                                     Return person.Age
    '                                 End Function)
    'End Function

    'Public Sub ThrowError()
    '    Throw New InvalidOperationException("Throwing an exception")
    'End Sub

    'Public Function InitilizeState() As String
    '    Caller.name = "Damian"
    '    Return Caller.id
    'End Function

    'Public Class Person
    '    Public Name As String
    '    Public Age As Integer
    'End Class

End Class
