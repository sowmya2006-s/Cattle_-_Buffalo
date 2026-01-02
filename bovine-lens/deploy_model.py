import os
import shutil
import glob
from pathlib import Path

def deploy_model():
    print("------------------------------------------------")
    print("BovineLens: Deploying Trained Model")
    print("------------------------------------------------")

    # 1. Find the latest training run
    runs_dir = Path("runs/classify")
    if not runs_dir.exists():
        print("Error: 'runs/classify' directory not found. Has training started?")
        return

    # Get all project folders (e.g., indian_bovine_classifier_v2, ...v22, etc.)
    # We look for folders starting with our project name
    project_name = "indian_bovine_classifier_v2"
    candidates = list(runs_dir.glob(f"{project_name}*"))
    
    if not candidates:
        print(f"Error: No training runs found for project '{project_name}'")
        return

    # Sort by modification time (newest first)
    latest_run = max(candidates, key=os.path.getmtime)
    print(f"Latest run found: {latest_run}")

    # 2. Locate the ONNX file
    # Note: train_model.py exports to 'weights/best.onnx' usually
    # But sometimes YOLO export saves it in the main run folder or 'weights'
    onnx_path = latest_run / "weights" / "best.onnx"
    
    if not onnx_path.exists():
        # Fallback check
        onnx_path = latest_run / "best.onnx"
    
    if not onnx_path.exists():
        print(f"Error: 'best.onnx' not found in {latest_run}")
        print("Did the training finish and export successfully?")
        return

    print(f"Found model: {onnx_path}")

    # 3. Copy to Public Directory
    dest_dir = Path("public/models")
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_file = dest_dir / "bovine_classifier.onnx"

    try:
        shutil.copy(onnx_path, dest_file)
        print(f"Successfully deployed to: {dest_file}")
        print("------------------------------------------------")
        print("Deployment Complete! Please refresh the web application.")
        print("------------------------------------------------")
    except Exception as e:
        print(f"Error copying file: {e}")

if __name__ == "__main__":
    deploy_model()
