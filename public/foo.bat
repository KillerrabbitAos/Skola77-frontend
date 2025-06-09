@echo off
chcp 65001 >nul
powershell -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('Du är fin som du är :)', 'Meddelande')"