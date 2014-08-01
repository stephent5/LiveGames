@ModelType IEnumerable(Of LiveGamesClient1._2.League)
    
<script src="@Url.Content("~/Scripts/jquery-1.5.1.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>
@Helpers.Script("league/leaguemanger.js", Url)

<script type="text/javascript" >
    ViewLeagues();
</script>

<div id="Myleagues"></div>
@*
<p>
    @Html.ActionLink("Create New", "Create")
</p>
<table>
    <tr>
        <th>
            GameID
        </th>
        <th>
            Name
        </th>
        <th>
            Description
        </th>
        <th>
            JoinCode
        </th>
        <th>
            TSCreated
        </th>
        <th>
            TSUpdated
        </th>
        <th>
            CreaterFBID
        </th>
        <th></th>
    </tr>

@For Each item In Model
    Dim currentItem = item
    @<tr>
        <td>
            @Html.DisplayFor(Function(modelItem) currentItem.GameID)
        </td>
        <td>
            @Html.DisplayFor(Function(modelItem) currentItem.Name)
        </td>
        <td>
            @Html.DisplayFor(Function(modelItem) currentItem.Description)
        </td>
        <td>
            @Html.DisplayFor(Function(modelItem) currentItem.JoinCode)
        </td>
        <td>
            @Html.DisplayFor(Function(modelItem) currentItem.TSCreated)
        </td>
        <td>
            @Html.DisplayFor(Function(modelItem) currentItem.TSUpdated)
        </td>
        <td>
            @Html.DisplayFor(Function(modelItem) currentItem.CreaterFBID)
        </td>
        <td>
            @Html.ActionLink("Edit", "Edit", New With {.id = currentItem.ID}) |
            @Html.ActionLink("Details", "Details", New With {.id = currentItem.ID}) |
            @Html.ActionLink("Delete", "Delete", New With {.id = currentItem.ID})
        </td>
    </tr>
Next

</table>
*@