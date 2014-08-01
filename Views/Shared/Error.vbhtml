@ModelType System.Web.Mvc.HandleErrorInfo

@Code
    ViewData("Title") = "Error"
    Dim item As HandleErrorInfo = CType(Model, HandleErrorInfo)
End Code

<h2>
    Sorry, an error occurred while processing your request.<br />

    @item.ActionName<br />
    @item.ControllerName<br />
    @item.Exception.Message
</h2> 



