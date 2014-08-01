'Created by Stephen (copying Conor's C# class): 16/07/2010 A base class to add serialization support to data classes.
Imports System
Imports System.Collections.Generic
Imports System.Text
Imports System.Xml.Serialization
Imports System.IO

Public MustInherit Class XmlSerialization(Of T)

    'Must have default constructor for xml serialization
    Public Sub New()

    End Sub

    'Create an xml representation of this instance
    Public Function Serialize() As String
        Dim serializer As XmlSerializer = New XmlSerializer(Me.GetType())

        Using stream As New StringWriter
            serializer.Serialize(stream, Me)
            stream.Flush()
            Return stream.ToString()
        End Using
    End Function

    'Create a new instance from an xml string.
    'The client is responsible for deserialization of the correct type
    Public Shared Function Deserialize(ByVal xml As String) As T
        If String.IsNullOrEmpty(xml) Then
            Throw New ArgumentNullException("xml")
        End If

        Dim serializer As XmlSerializer = New XmlSerializer(GetType(T))

        Using Stream As New StringReader(xml)
            Try
                Dim returnvalue As T = serializer.Deserialize(Stream)
                Return returnvalue
            Catch ex As Exception
                'The serialization error messages are cryptic at best.
                'Give a hint at what happened
                Throw New InvalidOperationException("Failed to create object from xml string", ex)
            End Try
        End Using



    End Function


End Class
