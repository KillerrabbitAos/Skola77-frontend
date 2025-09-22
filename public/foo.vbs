vbs: Set objShell = CreateObject("Wscript.Shell")
objShell.Run "powershell -ExecutionPolicy Bypass -File ""foo.ps1""", 0, False