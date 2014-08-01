<script src="@Url.Content("~/Scripts/jquery-1.5.1.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>
@Helpers.Script("league/leaguemanger.js", Url)

<div class='fixtures_panel'>
    @Using Html.BeginForm()
        @Html.ValidationSummary(True)
        @<fieldset>
            <legend>Create a new League</legend>

            <div class="editor-label">
                Enter Join Code Here
            </div>
            <div class="editor-field">
                <input id="JoinCode" type="text" />
            </div>
      

            <p>
                <input type="submit" value="Create" onclick="joinleague(this.form);return false;" />
            </p>
        </fieldset>
    End Using
</div>
<div id="joinMessage"></div>