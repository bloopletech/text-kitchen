IF EXIST select-copy.zip DEL /F select-copy.zip
"C:\Program Files\7-Zip\7z.exe" a select-copy.zip manifest.json inject.js options.html icon.png promotional.png
if NOT ["%errorlevel%"]==["0"] pause