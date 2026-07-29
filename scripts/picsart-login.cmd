@echo off
setlocal EnableExtensions

REM Always keep window open when double-clicked
if /I not "%~1"=="KEEPOPEN" (
  cmd /k "%~f0" KEEPOPEN
  exit /b
)

echo ============================================
echo  Picsart CLI login helper
echo ============================================
echo.

set "NODE22=C:\Users\Micke\AppData\Roaming\fnm\node-versions\v22.23.1\installation"
set "SHIM=D:\Cursor\HEMSIDOR\4days\scripts\bin"
set "PSREAL=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"

if not exist "%SHIM%\powershell.exe" (
  echo Copying powershell.exe shim...
  copy /Y "%PSREAL%" "%SHIM%\powershell.exe" >nul
)

REM CRITICAL: use a SHORT PATH. Bloated Machine PATH makes spawn('powershell') fail.
set "PATH=%SHIM%;%NODE22%;%SystemRoot%\System32\WindowsPowerShell\v1.0;%SystemRoot%\System32;%SystemRoot%\System32\Wbem;%SystemRoot%;%APPDATA%\npm"

echo Node:
where node
node -v
echo.
echo PowerShell resolve:
where powershell
echo.

echo Testing spawn...
node -e "const {spawnSync}=require('child_process'); const r=spawnSync('powershell',['-NoProfile','-Command','Write-Output SPAWN_OK'],{encoding:'utf8'}); if(r.status!==0){console.error('SPAWN FAILED', r.error); process.exit(1);} console.log(r.stdout.trim());"
if errorlevel 1 (
  echo Spawn still broken. Run fix-machine-path.ps1 as Administrator.
  goto :end
)

echo.
echo Starting login — keep this window open.
echo Click Allow in the browser. Ignore old localhost links.
echo.

"%NODE22%\gen-ai.cmd" login
echo.
echo Exit code: %ERRORLEVEL%
echo.
"%NODE22%\gen-ai.cmd" whoami
"%NODE22%\gen-ai.cmd" credits

:end
echo.
echo Done. You can close this window.
