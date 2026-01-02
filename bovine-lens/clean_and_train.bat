@echo off
echo ===========================================
echo BovineLens: CLEAN Training Pipeline (Real Data)
echo ===========================================

echo [1/5] Removing old Mock Data...
if exist "dataset" (
    rmdir /s /q "dataset"
    echo Dataset folder cleared.
) else (
    echo Dataset folder not found, skipping clean.
)

echo.
echo [2/5] Dependencies...
pip install -r requirements.txt

echo.
echo [3/5] Downloading Real Data...
echo This will take 20-30 minutes due to rate limits. Please be patient.
python download_data.py
if %ERRORLEVEL% NEQ 0 (
    echo Error downloading data.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [4/5] Training Model...
python train_model.py

echo.
echo [5/5] Exporting Model...
python export_model.py

echo.
echo ===========================================
echo SUCCESS!
echo ===========================================
pause
