# AI Backend Cleanup Script
# This script removes all fault diagnosis code and keeps only inventory recommendations

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SmartFix AI Backend Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will:" -ForegroundColor Yellow
Write-Host "  - Create a backup of AI_BACKEND folder" -ForegroundColor Yellow
Write-Host "  - Delete fault diagnosis code" -ForegroundColor Yellow
Write-Host "  - Delete prediction models" -ForegroundColor Yellow
Write-Host "  - Delete training scripts" -ForegroundColor Yellow
Write-Host "  - Delete test files" -ForegroundColor Yellow
Write-Host "  - Keep ONLY inventory recommendations" -ForegroundColor Yellow
Write-Host ""

# Confirm before proceeding
$confirmation = Read-Host "Do you want to proceed? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Cleanup cancelled." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Starting cleanup..." -ForegroundColor Green
Write-Host ""

# Set base path
$basePath = "c:\Users\adidace\Documents\Courses\January$\FINAL_YEAR\smartfix (1)\smartfix\AI_BACKEND"

# Check if path exists
if (-not (Test-Path $basePath)) {
    Write-Host "ERROR: AI_BACKEND folder not found at: $basePath" -ForegroundColor Red
    exit
}

# Step 1: Create Backup
Write-Host "[1/8] Creating backup..." -ForegroundColor Cyan
$backupPath = "c:\Users\adidace\Documents\Courses\January$\FINAL_YEAR\smartfix (1)\smartfix\AI_BACKEND_BACKUP_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
try {
    Copy-Item -Path $basePath -Destination $backupPath -Recurse -Force
    Write-Host "  ✓ Backup created at: $backupPath" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Failed to create backup: $_" -ForegroundColor Red
    exit
}

# Step 2: Delete API files (except inventory.py)
Write-Host "[2/8] Cleaning API files..." -ForegroundColor Cyan
$apiPath = Join-Path $basePath "api"
$filesToDelete = @("auth.py", "prediction.py", "repair.py", "recommendations.py", "chatbot.py")
foreach ($file in $filesToDelete) {
    $filePath = Join-Path $apiPath $file
    if (Test-Path $filePath) {
        Remove-Item $filePath -Force
        Write-Host "  ✓ Deleted: $file" -ForegroundColor Green
    }
}

# Step 3: Delete model files
Write-Host "[3/8] Deleting model files..." -ForegroundColor Cyan
$modelsPath = Join-Path $basePath "app\models"
if (Test-Path $modelsPath) {
    Remove-Item $modelsPath -Recurse -Force
    Write-Host "  ✓ Deleted: app/models/" -ForegroundColor Green
}

# Also delete brand_knowledge.py if in app folder
$brandKnowledgePath = Join-Path $basePath "app\brand_knowledge.py"
if (Test-Path $brandKnowledgePath) {
    Remove-Item $brandKnowledgePath -Force
    Write-Host "  ✓ Deleted: app/brand_knowledge.py" -ForegroundColor Green
}

# Step 4: Delete training scripts
Write-Host "[4/8] Deleting training scripts..." -ForegroundColor Cyan
$trainingScripts = @(
    "add_acer_training_data.py",
    "add_apple_training_data.py",
    "add_asus_training_data.py",
    "add_dell_training_data.py",
    "add_hp_training_data.py",
    "add_lenovo_training_data.py",
    "save_and_load_models.py"
)
foreach ($script in $trainingScripts) {
    $scriptPath = Join-Path $basePath $script
    if (Test-Path $scriptPath) {
        Remove-Item $scriptPath -Force
        Write-Host "  ✓ Deleted: $script" -ForegroundColor Green
    }
}

# Step 5: Delete test files
Write-Host "[5/8] Deleting test files..." -ForegroundColor Cyan
$testFiles = Get-ChildItem -Path $basePath -Filter "test_*.py" -File
foreach ($file in $testFiles) {
    Remove-Item $file.FullName -Force
    Write-Host "  ✓ Deleted: $($file.Name)" -ForegroundColor Green
}

$debugFiles = Get-ChildItem -Path $basePath -Filter "debug_*.py" -File
foreach ($file in $debugFiles) {
    Remove-Item $file.FullName -Force
    Write-Host "  ✓ Deleted: $($file.Name)" -ForegroundColor Green
}

$otherTestFiles = @("simple_api_test.py")
foreach ($file in $otherTestFiles) {
    $filePath = Join-Path $basePath $file
    if (Test-Path $filePath) {
        Remove-Item $filePath -Force
        Write-Host "  ✓ Deleted: $file" -ForegroundColor Green
    }
}

# Step 6: Delete data folders
Write-Host "[6/8] Deleting data folders..." -ForegroundColor Cyan
$dataFolders = @("data\models", "data\processed", "data\raw")
foreach ($folder in $dataFolders) {
    $folderPath = Join-Path $basePath $folder
    if (Test-Path $folderPath) {
        Remove-Item $folderPath -Recurse -Force
        Write-Host "  ✓ Deleted: $folder/" -ForegroundColor Green
    }
}

# Delete notebooks folder
$notebooksPath = Join-Path $basePath "notebooks"
if (Test-Path $notebooksPath) {
    Remove-Item $notebooksPath -Recurse -Force
    Write-Host "  ✓ Deleted: notebooks/" -ForegroundColor Green
}

# Step 7: Replace main.py with main_clean.py
Write-Host "[7/8] Replacing main.py..." -ForegroundColor Cyan
$mainPath = Join-Path $basePath "app\main.py"
$mainCleanPath = Join-Path $basePath "app\main_clean.py"

if (Test-Path $mainCleanPath) {
    if (Test-Path $mainPath) {
        Remove-Item $mainPath -Force
        Write-Host "  ✓ Deleted old main.py" -ForegroundColor Green
    }
    Rename-Item -Path $mainCleanPath -NewName "main.py"
    Write-Host "  ✓ Renamed main_clean.py to main.py" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Warning: main_clean.py not found. Keeping existing main.py" -ForegroundColor Yellow
}

# Step 8: Clean up __pycache__ folders
Write-Host "[8/8] Cleaning __pycache__ folders..." -ForegroundColor Cyan
$pycacheFolders = Get-ChildItem -Path $basePath -Filter "__pycache__" -Directory -Recurse
foreach ($folder in $pycacheFolders) {
    Remove-Item $folder.FullName -Recurse -Force
    Write-Host "  ✓ Deleted: $($folder.FullName.Replace($basePath, '.'))" -ForegroundColor Green
}

# Create minimal requirements.txt
Write-Host ""
Write-Host "Creating minimal requirements.txt..." -ForegroundColor Cyan
$requirementsContent = @"
fastapi==0.104.1
uvicorn==0.24.0
requests==2.31.0
python-multipart==0.0.6
"@
$requirementsPath = Join-Path $basePath "requirements.txt"
Set-Content -Path $requirementsPath -Value $requirementsContent
Write-Host "  ✓ Created minimal requirements.txt" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cleanup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  ✓ Backup created at: $backupPath" -ForegroundColor Green
Write-Host "  ✓ Deleted fault diagnosis code" -ForegroundColor Green
Write-Host "  ✓ Deleted prediction models" -ForegroundColor Green
Write-Host "  ✓ Deleted training scripts" -ForegroundColor Green
Write-Host "  ✓ Deleted test files" -ForegroundColor Green
Write-Host "  ✓ Cleaned data folders" -ForegroundColor Green
Write-Host "  ✓ Updated main.py" -ForegroundColor Green
Write-Host "  ✓ Created minimal requirements.txt" -ForegroundColor Green
Write-Host ""
Write-Host "Remaining structure:" -ForegroundColor Yellow
Write-Host "  AI_BACKEND/" -ForegroundColor White
Write-Host "  ├── api/" -ForegroundColor White
Write-Host "  │   └── inventory.py      (Inventory recommendations)" -ForegroundColor Green
Write-Host "  ├── app/" -ForegroundColor White
Write-Host "  │   └── main.py           (Clean main file)" -ForegroundColor Green
Write-Host "  ├── .venv/                (Virtual environment)" -ForegroundColor White
Write-Host "  ├── .env                  (Configuration)" -ForegroundColor White
Write-Host "  └── requirements.txt      (Minimal dependencies)" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd '$basePath'" -ForegroundColor White
Write-Host "  2. .venv\Scripts\activate" -ForegroundColor White
Write-Host "  3. pip install -r requirements.txt" -ForegroundColor White
Write-Host "  4. uvicorn app.main:app --reload --port 8000" -ForegroundColor White
Write-Host ""
Write-Host "Test the API at: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "If anything goes wrong, restore from backup:" -ForegroundColor Yellow
Write-Host "  Remove-Item '$basePath' -Recurse -Force" -ForegroundColor White
Write-Host "  Copy-Item '$backupPath' -Destination '$basePath' -Recurse" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
