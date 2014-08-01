@ECHO OFF

ECHO Compiling Javascript files...
java -jar compiler.jar   --js ..\Scripts\jquery-1.8.2.min.js --js ..\Scripts\t5pusher_23_04_13_14_45.js --js ..\Scripts\errornew.js  --js ..\Scripts\League.js --js ..\Scripts\Store.js --js ..\Scripts\administrator.js --js ..\Scripts\init.js --js ..\Scripts\pushutilities.js --js ..\Scripts\jquery.json-2.3.js  --js ..\Scripts\ui.js --js ..\Scripts\iscroll.js  --js ..\Scripts\scrollhelper.js --js ..\Scripts\bet.js  --js ..\Scripts\user.js --js ..\Scripts\fb.js --js ..\Scripts\t5ticker.js --js ..\Scripts\jquery.ticker.js --js ..\Scripts\jquery.countdown.js --js ..\Scripts\newpush.js --js ..\Scripts\ga.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file C:\GoogleClosure\allmin.js
pause