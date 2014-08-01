@ModelType LiveGamesClient1._2.FBItem
@Code
    Layout = Nothing
End Code
<!DOCTYPE html>
<html>
<head prefix=
    "og: http://ogp.me/ns# 
     fb: http://ogp.me/ns/fb# 
     product: http://ogp.me/ns/product#" >
    <meta property="og:type" content="@Html.DisplayFor(Function(model) model.type)" />
    <meta property="og:title" content="@Html.DisplayFor(Function(model) model.title)" />
    <meta property="og:image" content="@Html.DisplayFor(Function(model) model.image)" />
    <meta property="og:description" content="@Html.DisplayFor(Function(model) model.description)" />
    <meta property="og:url" content="@Html.DisplayFor(Function(model) model.url)" />
    @For Each P In model.prices
    @<meta property="product:price:amount" content="@P.amount"/>
    @<meta property="product:price:currency" content="@P.currency"/>
    Next
</head>  
</html>
