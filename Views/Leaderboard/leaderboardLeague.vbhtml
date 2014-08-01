@Code
    Dim LeagueID As Integer
    Integer.TryParse(ViewBag.LeagueID, LeagueID)
    
End Code
  <script src="@Url.Content("~/Scripts/jquery-1.5.1.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>
<script type="text/javascript" >
    var v = "@LeagueID";
    GetLeagueTable(v);

</script>

<div id="LeagueLeaderboard"></div>