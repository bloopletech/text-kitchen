IF EXIST story-leanback.zip DEL /F story-leanback.zip
"C:\Program Files\7-Zip\7z.exe" a story-leanback.zip manifest.json inject.js story.css icon.png
if NOT ["%errorlevel%"]==["0"] pause