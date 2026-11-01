@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 >nul
title BAFU Club Portal - He Thong Quan Ly CLB BAFU

rem Keep auxiliary E2E port away from 8080 default
if not defined BAFU_E2E_PORT set "BAFU_E2E_PORT=18080"

rem Resolve project folder Web_GT-CLB
set "PROJECT_ROOT=%~dp0Web_GT-CLB"
if not exist "%PROJECT_ROOT%\docker-compose.yml" set "PROJECT_ROOT=%~dp0"
if not exist "%PROJECT_ROOT%\docker-compose.yml" (
    echo [LOI] Khong tim thay file docker-compose.yml!
    echo Vui long dam bao thu muc Web_GT-CLB nam cung cap hoac chua script nay.
    pause
    exit /b 1
)

pushd "%PROJECT_ROOT%"
if errorlevel 1 goto FAILED

if /i "%~1"=="--now" goto OPTION_DOCKER_UP
if /i "%~1"=="--auto" goto OPTION_DOCKER_UP
if /i "%~1"=="--check" goto OPTION_CHECK

:MAIN_MENU
cls
echo =====================================================================
echo        CONG THONG TIN CAU LAC BO SINH VIEN BAFU (WEB_GT-CLB)
echo            Truong Dai hoc Nong - Lam Bac Giang
echo =====================================================================
echo.
echo   [1] Khoi chay toan bo he thong bang Docker (Khuyen dung)
echo       - Bao gom: Nginx (Cong 80), Frontend, Backend, PostgreSQL
echo       - Tu dong mo trinh duyet http://localhost
echo.
echo   [2] Khoi chay che do Lap trinh Dev (Local Node.js)
echo       - Bat PostgreSQL Docker (Cong 5433)
echo       - Mo Backend Dev (npm run dev tren cong 5000)
echo       - Mo Frontend Dev (npm run dev tren cong 5173)
echo.
echo   [3] Kiem tra trang thai he thong va Container Health
echo.
echo   [4] Dung toan bo he thong Docker (docker compose down)
echo.
echo   [5] Build lai toan bo Docker tu dau (No cache rebuild)
echo.
echo   [6] Xem Logs thoi gian thuc cua he thong (docker compose logs)
echo.
echo   [0] Thoat
echo =====================================================================
set /p "CHOICE=Nhap lua chon cua ban (Mac dinh [1]): "
if "%CHOICE%"=="" set "CHOICE=1"

if "%CHOICE%"=="1" goto OPTION_DOCKER_UP
if "%CHOICE%"=="2" goto OPTION_DEV_MODE
if "%CHOICE%"=="3" goto OPTION_STATUS
if "%CHOICE%"=="4" goto OPTION_DOCKER_DOWN
if "%CHOICE%"=="5" goto OPTION_REBUILD
if "%CHOICE%"=="6" goto OPTION_LOGS
if "%CHOICE%"=="0" goto EXIT_SCRIPT

echo [LOI] Lua chon khong hop le! Vui long chon tu 0 den 6.
timeout /t 2 >nul
goto MAIN_MENU

rem -------------------------------------------------------------------------
rem [1] Khoi chay toan bo he thong bang Docker
rem -------------------------------------------------------------------------
:OPTION_DOCKER_UP
cls
echo =====================================================================
echo    DANG KHOI CHAY HE THONG CLB BAFU BANG DOCKER COMPOSE...
echo =====================================================================
where docker >nul 2>&1
if errorlevel 1 (
    echo [LOI] Khong tim thay Docker tren may tinh!
    echo Vui long cai dat Docker Desktop va khoi dong truoc khi chay script.
    goto FAILED_IN_PROJECT
)

docker compose version >nul 2>&1
if errorlevel 1 (
    echo [LOI] Docker Compose chua san sang! Vui long cap nhat Docker Desktop.
    goto FAILED_IN_PROJECT
)

docker info >nul 2>&1
if not errorlevel 1 goto DOCKER_ENGINE_READY

echo Dang khoi dong Docker Desktop...
set "DOCKER_DESKTOP=%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
if exist "%DOCKER_DESKTOP%" goto START_DOCKER_APP
set "DOCKER_DESKTOP=%LOCALAPPDATA%\Programs\DockerDesktop\Docker Desktop.exe"
if exist "%DOCKER_DESKTOP%" goto START_DOCKER_APP
echo [LOI] Vui long mo Docker Desktop thu cong, sau do chay lai script.
goto FAILED_IN_PROJECT

:START_DOCKER_APP
powershell.exe -NoProfile -Command "Start-Process -FilePath $env:DOCKER_DESKTOP -WindowStyle Hidden"
set /a DOCKER_WAIT_ATTEMPTS=0 >nul
:WAIT_DOCKER_LOOP
docker info >nul 2>&1
if not errorlevel 1 goto DOCKER_ENGINE_READY
set /a DOCKER_WAIT_ATTEMPTS+=1 >nul
if %DOCKER_WAIT_ATTEMPTS% geq 60 (
    echo [LOI] Docker khong khoi dong kip sau 180 giay. Vui long kiem tra Docker Desktop.
    goto FAILED_IN_PROJECT
)
timeout /t 3 /nobreak >nul
goto WAIT_DOCKER_LOOP

:DOCKER_ENGINE_READY
echo [OK] Docker Engine dang hoat dong.
echo Dang kich hoat cac container: PostgreSQL, Backend, Frontend, Nginx...
docker compose -f docker-compose.yml up -d --wait --wait-timeout 180
if errorlevel 1 (
    echo [LOI] Qua trinh khoi chay container gap su co!
    goto FAILED_IN_PROJECT
)

rem Lam moi cau hinh Nginx sau khi backend va frontend san sang
docker compose -f docker-compose.yml exec -T nginx nginx -s reload >nul 2>&1

echo.
echo Dang kiem tra phan hoi tu Website BAFU...
powershell.exe -NoProfile -Command "$ErrorActionPreference = 'Stop'; for ($i = 0; $i -lt 30; $i++) { try { $r = Invoke-WebRequest -Uri 'http://localhost' -UseBasicParsing -TimeoutSec 4; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Seconds 2 }; exit 1"
if errorlevel 1 (
    echo [CANH BAO] Container da chay nhung website chua phan hoi kip ma 200.
) else (
    echo [THANH CONG] Website da san sang phuc vu!
)

echo.
echo =====================================================================
echo  HE THONG CONG THONG TIN CLB BAFU DA DUOC KHOI CHAY THANH CONG!
echo =====================================================================
echo  - Cong thong tin (Chinh thuc): http://localhost
echo  - Backend API:                 http://localhost:5000
echo  - Backend API Health:          http://localhost:5000/health
echo  - PostgreSQL Database:         localhost:5433 (user: postgres)
echo  - E2E Test Server (Nginx):     http://localhost:%BAFU_E2E_PORT%
echo =====================================================================
echo.
echo Dang mo trinh duyet vao http://localhost...
start "" "http://localhost"
echo.
echo Bam phim bat ky de quay lai menu chinh...
pause >nul
goto MAIN_MENU

rem -------------------------------------------------------------------------
rem [2] Khoi chay che do Lap trinh Dev (Local Node.js)
rem -------------------------------------------------------------------------
:OPTION_DEV_MODE
cls
echo =====================================================================
echo    DANG KHOI CHAY CHE DO LAP TRINH DEV (LOCAL NODE.JS)...
echo =====================================================================
echo [1/3] Khoi chay PostgreSQL qua Docker...
docker compose -f docker-compose.yml up -d postgres
if errorlevel 1 (
    echo [CANH BAO] Khong the bat PostgreSQL qua Docker. Dam bao cong 5432/5433 da co DB san.
)

echo [2/3] Mo cua so Backend trong tien trinh rieng...
start "BAFU Backend [Port 5000]" cmd /k "cd backend && npm run dev"

echo [3/3] Mo cua so Frontend Vite trong tien trinh rieng...
start "BAFU Frontend [Port 5173]" cmd /k "cd frontend && npm run dev"

echo.
echo [THANH CONG] Da kich hoat moi truong Dev:
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:5000
echo.
echo Bam phim bat ky de quay lai menu chinh...
pause >nul
goto MAIN_MENU

rem -------------------------------------------------------------------------
rem [3] Kiem tra trang thai he thong va Container Health
rem -------------------------------------------------------------------------
:OPTION_STATUS
cls
echo =====================================================================
echo             TRANG THAI CAC DICH VU DOCKER HIEN TAI
echo =====================================================================
docker compose -f docker-compose.yml ps -a
echo.
echo =====================================================================
echo Kiem tra nhanh ket noi HTTP:
powershell.exe -NoProfile -Command "try { $res = Invoke-WebRequest -Uri 'http://localhost' -UseBasicParsing -TimeoutSec 3; Write-Host ('[Website http://localhost] : OK (HTTP ' + $res.StatusCode + ')') -ForegroundColor Green } catch { Write-Host '[Website http://localhost] : Chua ket noi duoc' -ForegroundColor Red }"
powershell.exe -NoProfile -Command "try { $res = Invoke-WebRequest -Uri 'http://localhost:5000/health' -UseBasicParsing -TimeoutSec 3; Write-Host ('[Backend /health]          : OK (HTTP ' + $res.StatusCode + ')') -ForegroundColor Green } catch { Write-Host '[Backend /health]          : Chua ket noi duoc' -ForegroundColor Red }"
echo =====================================================================
echo.
echo Bam phim bat ky de quay lai menu chinh...
pause >nul
goto MAIN_MENU

rem -------------------------------------------------------------------------
rem [4] Dung toan bo he thong Docker
rem -------------------------------------------------------------------------
:OPTION_DOCKER_DOWN
cls
echo =====================================================================
echo       DANG DUNG TOAN BO CAC DICH VU CONTAINER DOCKER...
echo =====================================================================
docker compose -f docker-compose.yml down
echo.
echo [OK] Da dung va giai phong tai nguyen toan bo he thong!
echo Bam phim bat ky de quay lai menu chinh...
pause >nul
goto MAIN_MENU

rem -------------------------------------------------------------------------
rem [5] Rebuild toan bo Docker tu dau (No Cache)
rem -------------------------------------------------------------------------
:OPTION_REBUILD
cls
echo =====================================================================
echo    DANG REBUILD TOAN BO DOCKER CONTAINER (KHONG DUNG CACHE)...
echo =====================================================================
docker compose -f docker-compose.yml build --no-cache
if errorlevel 1 (
    echo [LOI] Qua trinh build gap su co!
    pause
    goto MAIN_MENU
)
echo.
echo [OK] Da build thanh cong! Khoi dong lai he thong...
goto OPTION_DOCKER_UP

rem -------------------------------------------------------------------------
rem [6] Xem Logs thoi gian thuc
rem -------------------------------------------------------------------------
:OPTION_LOGS
cls
echo =====================================================================
echo        LOGS HE THONG CLB BAFU (Nhan Ctrl+C de thoat xem logs)
echo =====================================================================
docker compose -f docker-compose.yml logs -f --tail=50
goto MAIN_MENU

rem -------------------------------------------------------------------------
rem Xu ly kiem tra cau hinh
rem -------------------------------------------------------------------------
:OPTION_CHECK
docker compose -f docker-compose.yml config --quiet
if errorlevel 1 goto FAILED_IN_PROJECT
echo [OK] Cau hinh Docker Compose hop le.
popd
exit /b 0

:FAILED_IN_PROJECT
echo.
echo [LOI] Khoi chay that bai! Xem thong tin chi tiet o phia tren.
echo Ban co the kiem tra logs bang: docker compose logs --tail 80
popd
pause
exit /b 1

:FAILED
pause
exit /b 1

:EXIT_SCRIPT
popd
exit /b 0
