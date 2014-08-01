@ModelType LiveGamesClient1._2.League
@*<script src="@Url.Content("~/Scripts/jquery-1.5.1.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>*@


@Helpers.Script("league/leaguemanger.js", Url)


<div id="leagueform" class='fixtures_panel'>
@Using Html.BeginForm()
    @Html.ValidationSummary(True)
    @<fieldset>
        <legend>Create a new League</legend>

@*        <div class="editor-label">
            @Html.LabelFor(Function(model) model.GameID)
        </div>*@
  @*      <div class="editor-field">
            @Html.EditorFor(Function(model) model.GameID)
            @Html.ValidationMessageFor(Function(model) model.GameID)
        </div>*@

        <div class="editor-label">
            @Html.LabelFor(Function(model) model.Name)
        </div>
        <div class="editor-field">
            @Html.EditorFor(Function(model) model.Name)
            @Html.ValidationMessageFor(Function(model) model.Name)
        </div>

        <div class="editor-label">
            @Html.LabelFor(Function(model) model.Description)
        </div>
        <div class="editor-field">
            @Html.EditorFor(Function(model) model.Description)
            @Html.ValidationMessageFor(Function(model) model.Description)
        </div>

@*        <div class="editor-label">
            @Html.LabelFor(Function(model) model.JoinCode)
        </div>
        <div class="editor-field">
            @Html.EditorFor(Function(model) model.JoinCode)
            @Html.ValidationMessageFor(Function(model) model.JoinCode)
        </div>*@

@*        <div class="editor-label">
            @Html.LabelFor(Function(model) model.TSCreated)
        </div>
        <div class="editor-field">
            @Html.EditorFor(Function(model) model.TSCreated)
            @Html.ValidationMessageFor(Function(model) model.TSCreated)
        </div>

        <div class="editor-label">
            @Html.LabelFor(Function(model) model.TSUpdated)
        </div>
        <div class="editor-field">
            @Html.EditorFor(Function(model) model.TSUpdated)
            @Html.ValidationMessageFor(Function(model) model.TSUpdated)
        </div>*@

        <p>
            <input type="submit" value="Create" onclick="createleaguemanager(this.form);return false;" />
        </p>
    </fieldset>
End Using
</div>
<div id="CreatedLeague"></div>
<div id="friendsInvite" style="display:none">
@Using Html.BeginForm()
 @<fieldset>
<textarea name="invite" id="invite" rows="10" cols="20" >
</textarea> 
<input type="hidden" id="league" value="10" />
@*<input type="hidden" id="joinCode" value="fjkhgf" />*@
       <p>
            <input type="submit" value="Send Invite" onclick="SendInvite(this.form);return false;" />
        </p>
 </fieldset>
    @*<input type="text" name="invite" id="invite" placeholder="Enter the E-mail of friends you would like to invite to join the game (One email per line)" size="500" />*@
    
End Using
</div>

<div id="invitedetails"></div>


<div>
    @Html.ActionLink("Back to List", "Index")
</div>
@*
<script type="text/javascript" >
    Checklogin();
</script>
*@