@ECHO OFF

ECHO Compiling Javascript files...
java -jar compiler.jar  --js ..\Scripts\jquery.signalR-1.0.1.min.js --js ..\Scripts\hubs.js --js ..\Scripts\T5Pusher.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file C:\GoogleClosure\t5pushermin.js
pause