@ModelType LiveGamesClient1._2.LiveGamesModule
@Code
    Layout = "~/Views/Shared/_HomeLayoutPage.vbhtml"
End Code

@Code
    ViewData("Title") = "Live Games"
End Code

<script type="text/javascript">                
    window.location = location.protocol + '//' + location.host
</script>

<div data-role="page" data-theme="a" id="main" title="Live Games">
   
   <div id="content">

          @Code
            Html.RenderAction("HeaderFeed", "HomeModule", New With {.FileName = "HeaderXML.xml"})
          End Code

          @Code
                Html.RenderAction("HeaderFeed", "HomeModule", New With {.FileName = "TopLogo.xml"})
          End Code
                
          <div class="game-menu" style="height:100%;" >
                    @Code
                        Html.RenderAction("HeaderFeed", "HomeModule", New With {.FileName = "Menu3.xml"})
                    End Code
          </div>
            
     </div><!-- /content -->
</div><!-- /page -->
