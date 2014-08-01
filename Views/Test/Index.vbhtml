@Code
    Layout = Nothing
End Code

<!DOCTYPE html>

<html>
<head runat="server">
    <title>Test</title>

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>

    @Helpers.Script("jquery.countdownOLDVersion.min.js", Url)
    @Helpers.Style("ui-styles.css", Url, False)

    <script type="text/javascript">
        function powerplaypopupTest()
        {
            $('#m_powerplaytimertest').countdown({ until: 20,compact: true, format: 'MS' });
        }
    </script>
</head>
<body>
    <div>
           Doing countdown test here!!!!!

           <div class="powerplaytimer" id="m_powerplaytimertest" onclick="powerplaypopupTest(); return false;">
                    TestTestTest
           </div>
    </div>
</body>
</html>
