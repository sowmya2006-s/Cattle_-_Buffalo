@echo off
echo Running Data Fixer...
python fix_missing_data.py

echo.
echo Retraining Model...
python train_model.py

echo.
echo Exporting Model...
python export_model.py

echo.
echo DONE.
pause
