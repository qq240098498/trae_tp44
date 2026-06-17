@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ============================================================
REM   智能招聘辅助系统 - Windows 批处理启动脚本
REM   Smart Recruitment Assistant - Windows Batch Startup Script
REM ============================================================

title 智能招聘辅助系统启动器
cd /d "%~dp0\.."

set "PROJECT_ROOT=%cd%"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║          智能招聘辅助系统 (Smart Recruitment Assistant)        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM ===== 检查 Node.js 环境 =====
echo [1/4] 检查 Node.js 环境...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
for /f "delims=" %%v in ('node --version') do set NODE_VER=%%v
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] npm 不可用
    pause
    exit /b 1
)
for /f "delims=" %%v in ('npm --version') do set NPM_VER=%%v
echo       Node.js 版本: %NODE_VER%
echo       npm 版本:     %NPM_VER%
echo.

REM ===== 检查依赖 =====
echo [2/4] 检查项目依赖...
if not exist "node_modules" (
    echo       未检测到 node_modules 目录，开始安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo       依赖安装完成
) else (
    echo       依赖目录已存在
)
echo.

REM ===== 清理占用端口的进程 =====
echo [3/4] 检查并清理占用端口的进程...
set "PORTS=3001 5173 5174 5175 5176 5177 5178"
for %%p in (%PORTS%) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%p " ^| findstr "LISTENING"') do (
        echo       端口 %%p 被进程 %%a 占用，正在终止...
        taskkill /F /PID %%a >nul 2>&1
    )
)
timeout /t 1 /nobreak >nul
echo       端口清理完成
echo.

REM ===== 启动系统 =====
echo [4/4] 启动智能招聘辅助系统...
echo.
echo   ┌─────────────────────────────────────────────────┐
echo   │  前端: Vite + React + TypeScript                 │
echo   │  后端: Express + TypeScript                      │
echo   │  公平性检测: 已启用                               │
echo   └─────────────────────────────────────────────────┘
echo.
echo   系统启动后，按 Ctrl+C 可以停止所有服务
echo.
echo ============================================================
echo.

call npm run dev

echo.
echo 系统已停止运行
pause
endlocal
