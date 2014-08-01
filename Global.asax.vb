' Note: For instructions on enabling IIS6 or IIS7 classic mode, 
' visit http://go.microsoft.com/?LinkId=9394802
Imports System.Web.Mvc
Imports System.Reflection
Imports MySql.Data.MySqlClient

'Imports SignalR_T5.RabbitMQ_T5
'Imports RabbitMQ.Client

'Imports SignalR 'Old way - as of 0.5.3
Imports Microsoft.AspNet.SignalR
Imports Microsoft.AspNet.SignalR.Redis

Imports Microsoft.AspNet.SignalR.Hubs

Public Class MvcApplication
    Inherits System.Web.HttpApplication

    Shared Sub RegisterGlobalFilters(ByVal filters As GlobalFilterCollection)
        filters.Add(New HandleErrorAttribute())
    End Sub

    Shared Sub RegisterRoutes(ByVal routes As RouteCollection)
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}")

        ' MapRoute takes the following parameters, in order:
        ' (1) Route name
        ' (2) URL with parameters
        ' (3) Parameter defaults
        routes.MapRoute( _
            "Default", _
            "{controller}/{action}/{id}", _
            New With {.controller = "Home", .action = "Index", .id = UrlParameter.Optional} _
        )

    End Sub

    Sub Application_Start()
        Dim loglocation As String = "/Logs/" 
        Logger.Init(loglocation)
        'InitialiseSignalR()

        Try
            Dim MS As Assembly = Assembly.LoadFrom("C:\Users\Stephen\Documents\Visual Studio 2010\Projects\LiveGamesClient1.2\bin\MySql.Data.dll")
            Dim type As Type = MS.GetType("MySql.Data.MySqlClient.MySqlPoolManager")
            Dim mi As MethodInfo = type.GetMethod("GetPool", BindingFlags.[Static] Or BindingFlags.[Public])
            Dim pool = mi.Invoke(Nothing, New Object() {New MySqlConnectionStringBuilder(ConfigurationManager.ConnectionStrings("mysql").ConnectionString)})
            Dim i As Integer = 1
        Catch ex As Exception
            Dim j As Integer = 2
        End Try
       
        'Now , configure ASP.NET MVC
        AreaRegistration.RegisterAllAreas()
        RegisterGlobalFilters(GlobalFilters.Filters)
        RegisterRoutes(RouteTable.Routes)
    End Sub

    Private Sub InitialiseSignalR()

        'NOTE: When using ASP.NET MVC, configure SignalR first
        'https://github.com/SignalR/SignalR/wiki/Configuring-SignalR
        'SignalR.GlobalHost.Configuration.KeepAlive = TimeSpan.FromSeconds(20) ' KeepAlive - Representing the amount of time to wait before sending a keep alive packet over an idle connection. Set to null to disable keep alive. This is set to 30 seconds by default. When this is on, the ConnectionTimeout will have no effect. 
        Microsoft.AspNet.SignalR.GlobalHost.Configuration.ConnectionTimeout = TimeSpan.FromSeconds(30) 'ConnectionTimeout - Represents the amount of time to leave a connection open before timing out. Default is 110 seconds.

        InitialiseSignalRRedis()
        'LinkSignalRConnectionToLoadBalancedRabbitMQMessageBus()
        'Dim SubScribeTo As System.Collections.Generic.IEnumerable(Of String)
        'SubScribeTo.a()

        'Dim ThingsToSubScribeTO() As String = {"LiveGamesTest", _
        '                          "Amargasaurus", _
        '                          "Mamenchisaurus"}

        'no longer do this - as sometimes it timeout (and other times it does not!!!)
        'instead we note when we reconnect in javscript and so we reestablish groups then!!
        'GlobalHost.HubPipeline.EnableAutoRejoiningGroups() 'we need this so when we attempt to reconnect - we rejoin all the groups we were in!!

        'did you get this john
        RouteTable.Routes.MapHubs()
    End Sub

    Private Sub InitialiseSignalRRedis()

        Dim ThingsToSubScribeTO() As String = {"LiveGamesTest"}
        Dim ThingsToSubScribeTO_LIST As New List(Of String)(ThingsToSubScribeTO)

        Dim PortNumber As Integer
        Integer.TryParse(ConfigurationManager.AppSettings("redisport"), PortNumber)

        GlobalHost.DependencyResolver.UseRedis(ConfigurationManager.AppSettings("redisserver"), PortNumber, ConfigurationManager.AppSettings("redispassword"), ThingsToSubScribeTO_LIST)

    End Sub


    'removed the following rabbit code - will need to reference te rabbit and signalr_rabbit dll's to get it to work!!!
    'Private Sub LinkSignalRConnectionToLoadBalancedRabbitMQMessageBus()
    '    Try
    '        Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "Starting to initialise")
    '        Dim CurrentRabbitMQInstance As Integer = -1 'initially we are not connected to any RabbitMQ instance
    '        Dim thisRabbitMQInstance As RabbitMQInstance = RabbitMQInstance.GetRabbitMQServerToConnectTo(CurrentRabbitMQInstance)
    '        CurrentRabbitMQInstance = thisRabbitMQInstance.rabbitMQInstance
    '        Dim connected As Boolean = False
    '        Dim attempts As Integer = 0
    '        If thisRabbitMQInstance.rabbitMQInstance > 0 Then
    '            'We MUST establish a connection to Rabbit Before we continue
    '            While Not connected And attempts < 3 ' really attempts should equal the number of rabbit instances we have - we should keep trying each one until we can connect to one of them
    '                attempts = attempts + 1
    '                connected = ConnectToSignalRInstance(thisRabbitMQInstance)
    '                If Not connected And attempts < 3 Then 'if we were unable to connect....
    '                    thisRabbitMQInstance = RabbitMQInstance.GetRabbitMQServerToConnectTo(CurrentRabbitMQInstance) '- get a new rabbit instance to connect to next time!!!

    '                    Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "AppStart - Tried and failed to establish rabbit connection. Attempt number - " + attempts + ". Instance number " + thisRabbitMQInstance.rabbitMQInstance)
    '                End If
    '            End While

    '            If Not connected Then
    '                Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "AppStart - Tried and failed to establish rabbit connection " + attempts + " times.")
    '            End If
    '        Else
    '            Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "Error thrown getting Rabbit Instance To connect To!!!! thisRabbitMQInstance.rabbitMQInstance is : " & thisRabbitMQInstance.rabbitMQInstance.ToString)
    '        End If
    '    Catch ex As Exception
    '        Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "Error thrown : " & ex.ToString)
    '    End Try
    'End Sub

    'Private Function ConnectToSignalRInstance(ByVal thisRabbitMQInstance As RabbitMQInstance) As Boolean
    '    Dim connected As Boolean = False
    '    Try
    '        Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "thisRabbitMQInstance.rabbitMQConnection is " & thisRabbitMQInstance.rabbitMQConnection)
    '        Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "thisRabbitMQInstance.rabbitMQInstance is " & thisRabbitMQInstance.rabbitMQInstance.ToString)

    '        Dim exchangeName As String = "LiveGamesExchangeTest"
    '        Dim factory As ConnectionFactory = New ConnectionFactory
    '        factory.HostName = thisRabbitMQInstance.rabbitMQConnection '"Rabbit-322458103.eu-west-1.elb.amazonaws.com"

    '        'this sets the heartbeat to 20 seconds - 
    '        'it is needed as our underlying TCP connection gets closed after 60 seconds if nothing has been sent on the TCP connection
    '        'this is most likely due to the load balancer?????
    '        factory.RequestedHeartbeat = 20

    '        Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "About to create connection")
    '        Dim connection As RabbitMQ.Client.IConnection = factory.CreateConnection()
    '        Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "connection created!!!!")

    '        Dim channel As RabbitMQ.Client.IModel = connection.CreateModel()
    '        channel.ExchangeDeclare(exchangeName, "topic", True)

    '        Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "About to use dependency resolver")

    '        'the below line commented out as it doesnlt work if we are using any signalr Version but 0.5.3!!!!
    '        'Microsoft.AspNet.SignalR.GlobalHost.DependencyResolver.UseRabbitMq(exchangeName, channel, thisRabbitMQInstance.rabbitMQInstance)



    '        connected = True
    '        Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "Using dependency resolver")

    '        RabbitMQInstance.LogConnectionToRabbitMQInstance(thisRabbitMQInstance.rabbitMQInstance) 'now that we have connected to an instance - log in DB
    '    Catch ex As Exception
    '        Logger.Log(BitFactory.Logging.LogSeverity.Info, "Debug", "Error thrown : " & ex.ToString)
    '    End Try
    '    Return connected
    'End Function


    'Private Sub LinkSignalRConnectionToLoadBalancedRabbitMQMessageBus()
    '    Dim exchangeName As String = "LiveGamesExchange"

    '    Dim factory As ConnectionFactory = New ConnectionFactory
    '    factory.HostName = "Rabbit-322458103.eu-west-1.elb.amazonaws.com"

    '    'this sets the heartbeat to 20 seconds - 
    '    'it is needed as our underlying TCP connection gets closed after 60 seconds if nothing has been sent on the TCP connection
    '    'this is most likely due to the load balancer?????
    '    factory.RequestedHeartbeat = 20



    '    Dim connection As RabbitMQ.Client.IConnection = factory.CreateConnection()
    '    Dim channel As RabbitMQ.Client.IModel = connection.CreateModel()
    '    channel.ExchangeDeclare(exchangeName, "topic", True)

    '    SignalR.GlobalHost.DependencyResolver.UseRabbitMq(exchangeName, channel)
    'End Sub

    Private Sub MvcApplication_PreSendRequestHeaders(sender As Object, e As System.EventArgs) Handles Me.PreSendRequestHeaders
        'Response.Cache.SetCacheability(HttpCacheability.NoCache)
    End Sub

End Class
