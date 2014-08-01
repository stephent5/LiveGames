@If Request.IsAuthenticated Then
    @<text>Welcome <strong>@c1.t5livegames.com</strong>!
    [ @Html.ActionLink("Log Off", "LogOff", "Account") ]</text>
Else
    @:[ @Html.ActionLink("Log On", "LogOn", "Account") ]
End If
