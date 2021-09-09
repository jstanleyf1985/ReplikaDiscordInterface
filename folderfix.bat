MsiExec.exe /i node-v16.8.0-x64.msi /qn
xcopy /s /y packages node_modules\
del /f/s/q packages > nul
rmdir /s/q packages