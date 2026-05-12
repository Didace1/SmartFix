# Intelligent Corex - GitHub Push Script
# This script helps push your repository to GitHub with multiple retry options

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing Intelligent Corex to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Function to test internet connectivity
function Test-InternetConnection {
    Write-Host "Testing internet connection..." -ForegroundColor Yellow
    try {
        $response = Test-Connection -ComputerName github.com -Count 2 -Quiet
        if ($response) {
            Write-Host "✓ Internet connection OK" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ Cannot reach github.com" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ Internet connection test failed" -ForegroundColor Red
        return $false
    }
}

# Test connection
if (-not (Test-InternetConnection)) {
    Write-Host ""
    Write-Host "Please check your internet connection and try again." -ForegroundColor Red
    Write-Host ""
    pause
    exit 1
}

Write-Host ""
Write-Host "Step 1: Checking git status..." -ForegroundColor Yellow
git status --short
Write-Host ""

Write-Host "Step 2: Verifying remote URL..." -ForegroundColor Yellow
git remote -v
Write-Host ""

Write-Host "Step 3: Attempting to push to GitHub..." -ForegroundColor Yellow
Write-Host "This may take a few minutes for large repositories..." -ForegroundColor Gray
Write-Host ""

# Try push with progress
$pushResult = git push origin main --force --progress 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Repository pushed to GitHub" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Visit: https://github.com/Didace1/intelligent_corex" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "PUSH FAILED - Error Code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error details:" -ForegroundColor Yellow
    Write-Host $pushResult -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Possible solutions:" -ForegroundColor Yellow
    Write-Host "1. Check your internet connection" -ForegroundColor White
    Write-Host "2. Verify GitHub credentials (username and personal access token)" -ForegroundColor White
    Write-Host "3. Try using GitHub Desktop (recommended)" -ForegroundColor White
    Write-Host "4. Check if firewall is blocking git" -ForegroundColor White
    Write-Host "5. Try using VPN if behind corporate firewall" -ForegroundColor White
    Write-Host "6. Try SSH instead of HTTPS" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Quick fix options:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Option A: Use GitHub Desktop (Easiest)" -ForegroundColor Green
    Write-Host "  1. Download from: https://desktop.github.com/" -ForegroundColor White
    Write-Host "  2. Install and sign in to GitHub" -ForegroundColor White
    Write-Host "  3. File > Add Local Repository" -ForegroundColor White
    Write-Host "  4. Select this folder: $(Get-Location)" -ForegroundColor White
    Write-Host "  5. Click 'Publish repository'" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Option B: Try SSH" -ForegroundColor Green
    Write-Host "  Run: git remote set-url origin git@github.com:Didace1/intelligent_corex.git" -ForegroundColor White
    Write-Host "  Then: git push origin main --force" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Option C: Create Personal Access Token" -ForegroundColor Green
    Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. Generate new token (classic) with 'repo' scope" -ForegroundColor White
    Write-Host "  3. Use token as password when pushing" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
