@echo off
powershell -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('Du är fin som du är', 'Meddelande')"