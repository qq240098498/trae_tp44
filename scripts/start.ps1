# Smart Recruitment Assistant - PowerShell Startup Script
$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Smart Recruitment Assistant System" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "[1/4] Checking Node.js environment..." -ForegroundColor Blue
try {
    $nodeVersion = node --version 2>$null
    if (-not $nodeVersion) { throw "Node.js not found" }
    Write-Host "    Node.js version: $nodeVersion" -ForegroundColor Green
    $npmVersion = npm --version 2>$null
    Write-Host "    npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "    ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "    Please install Node.js from https://nodejs.org/"
    exit 1
}
Write-Host ""

# Step 2: Check and clean ports
Write-Host "[2/4] Checking and cleaning ports..." -ForegroundColor Blue
$portsToCheck = @(3001, 3002, 3003, 5173, 5174, 5175, 5176, 5177, 5178)
$cleanedAny = $false
foreach ($port in $portsToCheck) {
    try {
        $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique
        if ($processes) {
            foreach ($pid in $processes) {
                if ($pid -ne 0 -and $pid -ne $PID) {
                    try {
                        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
                        if ($proc) {
                            Write-Host "    Terminating process on port $port (PID: $pid)" -ForegroundColor Yellow
                            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                            $cleanedAny = $true
                        }
                    } catch {}
                }
            }
        }
    } catch {}
}
if ($cleanedAny) {
    Start-Sleep -Seconds 2
}
Write-Host "    Ports checked successfully" -ForegroundColor Green
Write-Host ""

# Step 3: Check dependencies
Write-Host "[3/4] Checking dependencies..." -ForegroundColor Blue
$nodeModulesPath = Join-Path $ProjectRoot "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "    node_modules not found, installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "    ERROR: Dependency installation failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "    Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "    Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Step 4: Start system
Write-Host "[4/4] Starting Smart Recruitment Assistant..." -ForegroundColor Blue
Write-Host ""
Write-Host "  +---------------------------------------------+" -ForegroundColor Cyan
Write-Host "  |  Frontend: Vite + React + TypeScript        |" -ForegroundColor White
Write-Host "  |  Backend:  Express + TypeScript             |" -ForegroundColor White
Write-Host "  |  Fairness:   Bias detection enabled         |" -ForegroundColor Green
Write-Host "  +---------------------------------------------+" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

try {
    npm run dev
} catch {
    Write-Host ""
    Write-Host "System stopped" -ForegroundColor Yellow
}
