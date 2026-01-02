@echo off
echo ===========================================
echo BovineLens: Starting Real Data Training Pipeline
echo ===========================================

echo [1/4] Installing dependencies...
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo Error installing dependencies.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/4] Downloading Real Data (This may take 10-20 minutes)...
echo NOTE: If this fails, please ensure you have internet access.
python download_data.py
if %ERRORLEVEL% NEQ 0 (
    echo Error downloading data.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/4] Training Model on Real Images...
python train_model.py
if %ERRORLEVEL% NEQ 0 (
    echo Error training model.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [4/4] Exporting Model to ONNX...
python export_model.py
if %ERRORLEVEL% NEQ 0 (
    echo Error exporting model.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===========================================
echo SUCCESS! New model ready.
echo ===========================================
pause
