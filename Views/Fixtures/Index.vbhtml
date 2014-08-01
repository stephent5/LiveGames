@ModelType IEnumerable(Of LiveGamesClient1._2.Fixture)

@Code
    ViewData("Title") = "Fixtures"
End Code

    <br clear="all" />
    <br clear="all" />

    <span id="GetEmailSpan"></span>

<div class="fixtures_panel">

    <h2>Database Configuration</h2>
      <br clear="all" />
      <br clear="all" />

      <div class="button" id="changingsystem" style="display:none;text-shadow:none;float:none;width:300px;text-align:center; margin:0px; margin:0 auto;">Updating System - be patient!!!</div>
      <div class="button" id="memdiskstatusdiv" style="display:none;text-shadow:none;float:none;width:500px;text-align:center; margin:0px; margin:0 auto;"><span id="memdiskstatusSpan"></span></div>
      <div class="button" id="managePusherdiv" onclick="admin.EditPusherDetails(); return false;" style="display:none;text-shadow:none;float:none;width:300px;text-align:center; margin:0px; margin:0 auto;">Manage Pusher</div>
     
      <br clear="all" />
      <br clear="all" />

      <h2>Fixtures</h2> 

      <div onclick="admin.CreateNewFixture(); return false;" class="button" id="createFixtureLink" style="display:none;text-shadow:none;float:none;width:200px;text-align:center; margin:0px; margin:0 auto;">Create New Fixture</div>


    <br clear="all" />
    <br clear="all" />

    <div class="popup-placebet" style="top:80px; width:600px; margin-left:-320px; background:#000; font-size:1.2em;" id="editpusherdetails">
                 <div class="details"">	
                                <h4>Edit Pusher Details</h4>

                                <br clear="all"/><br clear="all"/>

                                

                                <div id="numPushers">
                                     
                                        <br /> <br /> <br />

                                        <b>Edit Number Of Pushers Used</b> <br />

                                        <div style="float:left; width:48%; padding:1%; text-align:right;"><b>Use Two Pushers</b><br /><span style="font-size:0.8em;">(this means the game page will use two seperate pushers - the Admin Pusher for the ref's events and the Friend Pusher for all the friends messages)</span></div>
                                        <div style="float:left; width:48%; padding:1%; text-align:left;"><input type="radio" id="sp1" name="SeperatePushers" value="1"></div>
                                        <br clear="all"/>
                                        <div style="float:left; width:48%; padding:1%; text-align:right;"><b>Use One Pusher</b><br /><span style="font-size:0.8em;">(this means the game page will use one pusher - the Admin Pusher -  for both the friends and admin pushing)</span></div>
                                        <div style="float:left; width:48%; padding:1%; text-align:left;"><input type="radio" id="sp0" name="SeperatePushers" value="0"></div>
                   
                                        <br clear="all"/>
                                        <br clear="all"/>

                                        <div class="button-alt" onclick="admin.UpdateNumPushers(); return false;" >Update Number Of Pushers</div>

                                </div>
                      
                                 <br clear="all"/><br clear="all"/>

                                <div style="float:left; width:48%; padding:1%; text-align:right;" id="SelectPusher"><b>Or.. Select A Pusher To Edit:</b>
                                         <br />
                                         <select id='PusherDDL' onchange="admin.EditIndividualPusher(); return false;" >
                                                  <option value='0' selected>Select Pusher</option>
                                                  <option value='Admin'>Admin Pusher</option>
                                                  <option value='Friends'>Friend Pusher</option>
                                                 @* <option value='Backup'>Backup Pusher</option>*@
                                         </select>
                                </div>

                                <div id="EditPusher" style="display:none;">

                                         <br clear="all"/><br clear="all"/>

                                         <div style="float:left; width:48%; padding:1%; text-align:right;" >
                                                 <b>Current URL</b>                                                 
                                                 <select id='PusherURL' >
                                                         
                                                 </select>
                                         </div>

                                        <br clear="all"/><br clear="all"/>
                                        <div style="float:left; width:48%; padding:1%; text-align:right;" >
                                                 <b>Or enter new URL</b>
                                                 <br />
                                                 <input type="text" id="newpushurl" name="newpushurl"  style="padding:0.5em;" />
                                        </div>

                                        <br clear="all"/><br clear="all"/>

                                        <div class="button-alt" onclick="admin.UpdatePusherURL(); return false;" >Update Pusher URL</div>

                                        <span id="UpdateStatus"></span>

                                </div>


                                 
                                <br clear="all"/><br clear="all"/>
                                <div class="button-alt" onclick="closepanel(this);">Close</div>
                 </div>
    </div>

    <div class="popup-placebet" style="top:80px; width:600px; margin-left:-320px; background:#000; font-size:1.2em;" id="creatematchdetails">

				<div class="details"">			
                    		
					<h4>Create New Match</h4>

                    <br clear="all"/><br clear="all"/>
					
                    <div style="float:left; width:48%; padding:1%; text-align:right;"><b>Home Team Name:</b></div><div style="float:left; width:50%; text-align:left;"><input type="text" id="hometeamname" name="hometeamname"  style="padding:0.5em;" /></div>
                    <br clear="all"/><br clear="all"/>
                    <div style="float:left; width:48%; padding:1%; text-align:right;"><b>Home Team Colour:</b></div> <div style="float:left; width:50%; text-align:left;"><div id="hometeamcolourdiv" style="display:inline-block;"></div></div>

                    <br clear="all"/>
                    <br clear="all"/>

                    <div style="float:left; width:48%; padding:1%; text-align:right;"><b>Away Team Name:</b></div><div style="float:left; width:50%; text-align:left;"><input type="text" id="awayteamname" name="awayteamname"  style="padding:0.5em;" /></div>
                    <br clear="all"/><br clear="all"/>
                    <div style="float:left; width:48%; padding:1%; text-align:right;"><b>Away Team Colour:</b></div><div style="float:left; width:50%; text-align:left;"><div id="awayteamcolourdiv" style="display:inline-block;"></div></div>

                    <br clear="all"/>
                    <br clear="all"/>

					<div style="float:left; width:48%; padding:1%; text-align:right;"><b>Team Playing From Left To Right In First Half :</b></div>
                    <div style="float:left; width:50%; text-align:left;">
                        <select id='createteamdirection' name='createteamdirection' style="padding:0.5em;">
                            <option value="1">Home Team</option>
                            <option value="2">Away Team</option>
                        </select>
                    </div>
                    <br /> <br /> <br />

                    <div style="float:left; width:48%; padding:1%; text-align:right;">Clear DB For This Game<br /><span style="font-size:0.8em;">(this will speed up the DB by archiving old games)</span></div>
                    <div style="float:left; width:48%; padding:1%; text-align:left;"><input type="radio" name="LiveFixture" value="1"></div>
                    <br clear="all"/>
                    <div style="float:left; width:48%; padding:1%; text-align:right;">Leave DB as is</div>
                    <div style="float:left; width:48%; padding:1%; text-align:left;"><input type="radio" name="LiveFixture" value="0" checked></div>
                   
                    <br clear="all"/>
                    <br clear="all"/>

                    <i><b style="color:orange;">Clearing DB removes all other games from the system - so any links to previous games will no longer be valid!!!!!! <br />
                        Only do this if the DB is slowing down or we are expecting large numbers for the new fixture (i.e > 10,000)
                    </b></i>

                    <br clear="all"/>
                    <span id="createstatus"></span>

					<div class="button" id="editmatchdetailsbutton" onclick="admin.CreateNewMatch(); return false;">Create</div>
					<div class="button-alt" onclick="closepanel(this);">Cancel</div>
				</div>
			</div>




    <div id="FixtureDiv">

    </div>

@*@For Each item In Model
    Dim currentItem = item
    @<div class="ui-button">
           <h1>@Html.DisplayFor(Function(modelItem) currentItem.Fixture)</h1>
           <p>     
            @Html.DisplayFor(Function(modelItem) currentItem.venue)
        
            @Html.DisplayFor(Function(modelItem) currentItem.StartTime)
            </p>   

            @If currentItem.inplay Then
                'If the Game is currently on - then let the user play it!!!
                @<a href="/Game/?f=@currentItem.fixtureid">Play Now</a>
            End If
            <td>
                @Html.ActionLink("Edit", "Edit", New With {.id = currentItem.FixtureID}) |
                @Html.ActionLink("Details", "Details", New With {.id = currentItem.FixtureID}) |
                @Html.ActionLink("Delete", "Delete", New With {.id = currentItem.FixtureID})
            </td>
    </div>
Next*@

</div>


@*<script type="text/javascript">
     function CheckLogIn() { }

     $(document).ready(function () {
         try {
             setTimeout("CheckLogIn();", (1000));
         }
         catch (ex) { }
     });
</script>*@