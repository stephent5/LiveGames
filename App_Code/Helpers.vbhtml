@Imports System.Web.MVC

@Helper Script(scriptName As String, url As Web.Mvc.UrlHelper, Optional cloud As Boolean = False)
    If (Not String.IsNullOrWhiteSpace(scriptName)) Then
        If cloud Then
            'Display Version from cloud
            Dim ScriptURL As String = ConfigurationManager.AppSettings("ScriptsCDNURL") & "/livescripts/" & scriptName
            @<script src="@ScriptURL"  type="text/javascript"></script>
        Else
            'Display local version
            @<script src="@url.Content("~/Scripts/" & scriptName)" type="text/javascript"></script>    
        End If
    Else
		@<text> </text>	
    End If
End Helper

@Helper Style(stylesheetName As String, url As Web.Mvc.UrlHelper, Optional cloud As Boolean = False)
    If (Not String.IsNullOrWhiteSpace(stylesheetName)) Then
        If cloud Then
            'Display Version from cloud
            Dim CSSURL As String = ConfigurationManager.AppSettings("ScriptsCDNURL") & "/livestyles/" & stylesheetName
            @<link href="@CSSURL" rel="stylesheet" type="text/css" />   
        Else
            'Display local version
            @<link href="@url.Content("~/Content/CSS/" & stylesheetName)" rel="stylesheet" type="text/css" />   
        End If
    Else
		@<text> </text>	
    End If
End Helper



