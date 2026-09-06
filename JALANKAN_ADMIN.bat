@echo off
title ROHIS Kabupaten Banyumas - Panel Admin CMS (Port 5174)
echo ====================================================
echo    MENJALANKAN PANEL ADMIN CMS KHUSUS (STANDALONE)
echo ====================================================
echo Panel Admin aktif di: http://localhost:5174
echo Login Default: admin / rohisbanyumas2026
echo Terhubung Cloud Sync (Upstash Redis)
echo.
cd /d "%~dp0\admin"
npm run dev
pause
