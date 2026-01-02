import os
from pathlib import Path
import json

def extract_classes():
    dataset_path = Path("dataset/train")
    if not dataset_path.exists():
        print("Dataset path not found.")
        return

    classes = sorted([d.name for d in dataset_path.iterdir() if d.is_dir()])
    print(f"Total classes: {len(classes)}")
    print(json.dumps(classes, indent=2))

if __name__ == "__main__":
    extract_classes()
