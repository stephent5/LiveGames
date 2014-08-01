@ModelType LiveGamesClient1._2.League

<fieldset>
    <legend>League</legend>

    <div class="display-label">GameID</div>
    <div class="display-field">
        @Html.DisplayFor(Function(model) model.GameID)
    </div>

    <div class="display-label">Name</div>
    <div class="display-field">
        @Html.DisplayFor(Function(model) model.Name)
    </div>

    <div class="display-label">Description</div>
    <div class="display-field">
        @Html.DisplayFor(Function(model) model.Description)
    </div>

    <div class="display-label">JoinCode</div>
    <div class="display-field">
        @Html.DisplayFor(Function(model) model.JoinCode)
    </div>

    <div class="display-label">TSCreated</div>
    <div class="display-field">
        @Html.DisplayFor(Function(model) model.TSCreated)
    </div>

    <div class="display-label">TSUpdated</div>
    <div class="display-field">
        @Html.DisplayFor(Function(model) model.TSUpdated)
    </div>

    <div class="display-label">CreaterFBID</div>
    <div class="display-field">
        @Html.DisplayFor(Function(model) model.CreaterFBID)
    </div>
</fieldset>
<p>

    @Html.ActionLink("Edit", "Edit", New With {.id = Model.ID}) |
    @Html.ActionLink("Back to List", "Index")
</p>
