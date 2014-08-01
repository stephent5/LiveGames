@ModelType IEnumerable(Of LiveGamesClient1._2.Leaderboard)
@Code
    Layout = Nothing
End Code
    <h2>@ViewData("Title")</h2>
<table>
    <tr>
        <th>
            pos
        </th>
        <th>
            USername
        </th>
        <th>
            Credits
        </th>
        <th></th>
    </tr>

@For Each item In Model
    Dim currentItem = item
    @<tr>
        <td>
            @Html.DisplayFor(Function(modelItem) currentItem.pos)
        </td>
        <td>
            @Html.DisplayFor(Function(modelItem) currentItem.USername)
        </td>
        <td>
            @Html.DisplayFor(Function(modelItem) currentItem.Credits)
        </td>
    </tr>
Next

</table>
