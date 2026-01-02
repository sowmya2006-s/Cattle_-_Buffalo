import os
import shutil

def clean_empty_folders():
    base_path = "dataset/train"
    if not os.path.exists(base_path):
        print("Dataset folder not found.")
        return

    print("Checking for empty folders...")
    folders = [f for f in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, f))]
    
    count = 0
    for folder in folders:
        path = os.path.join(base_path, folder)
        files = os.listdir(path)
        if len(files) == 0:
            print(f"Removing empty folder: {folder}")
            shutil.rmtree(path)
            # Also remove from val if exists
            val_path = os.path.join("dataset/val", folder)
            if os.path.exists(val_path):
                shutil.rmtree(val_path)
            count += 1
            
    print(f"Removed {count} empty breed folders.")
    print("You can now train on the remaining folders!")

if __name__ == "__main__":
    clean_empty_folders()
