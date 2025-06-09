@echo off
powershell -NoProfile -Command ^
"[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('Du är fin som du är :) orm', 'Meddelande')"