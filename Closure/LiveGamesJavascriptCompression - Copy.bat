@ECHO OFF

ECHO Compiling Javascript files...
java -jar compiler.jar  --js ..\Scripts\jquery.json-2.3.js  --js ..\Scripts\error.js --js ..\Scripts\init.js --js ..\Scripts\interface\ui.js --js ..\Scripts\iscroll.js --js ..\Scripts\scrollhelper.js --js ..\Scripts\leaderboard\leaderboardmanagement.js --js ..\Scripts\league\leaguemanger.js  --js ..\Scripts\lsbind.js --js ..\Scripts\customObjects\bet.js  --js ..\Scripts\user.js --js ..\Scripts\fb.js  --js ..\Scripts\jquery.countdown.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file C:\GoogleClosure\allmin.js
pause