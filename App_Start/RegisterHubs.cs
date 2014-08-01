using System.Web;
using System.Web.Routing;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hosting.AspNet;

[assembly: PreApplicationStartMethod(typeof(LiveGamesClient1._2.RegisterHubs), "Start")]

namespace LiveGamesClient1._2
{
    public static class RegisterHubs
    {
        public static void Start()
        {
            // Register the default hubs route: ~/signalr/hubs
            RouteTable.Routes.MapHubs();      
            //GlobalHost.HubPipeline.EnableAutoRejoiningGroups();            
        }
    }
}
