@echo off
cd /d "%~dp0"
title Agenda Vital - Servidor
echo ==========================================
echo      INICIANDO AGENDA VITAL & DIDACTICA
echo ==========================================
echo.
echo Directorio: %CD%
echo.

:: Try to find python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set PY_CMD=python
    goto :FOUND
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set PY_CMD=py
    goto :FOUND
)

echo ERROR: No se encontro Python instalado.
echo Por favor instala Python desde microsoft store o python.org
pause
exit /b

:FOUND
echo Python encontrado: %PY_CMD%
echo.
echo 1. Abriendo tu navegador...
start http://localhost:8081
echo.
echo 2. Iniciando servidor local en puerto 8081...
echo    (Por favor, NO cierres esta ventana mientras usas la app)
echo.

%PY_CMD% server.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo HUBO UN ERROR AL INICIAR EL SERVIDOR.
    echo Asegurate de que no haya otra cosa usando el puerto 8081.
    pause
)
pause
