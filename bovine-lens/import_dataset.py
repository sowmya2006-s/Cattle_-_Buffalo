import os
import shutil
import random
from pathlib import Path

def import_dataset():
    print("------------------------------------------------")
    print("BovineLens: Importing External Dataset")
    print("------------------------------------------------")

    source_dir = Path("source_data")
    dest_base = Path("dataset")
    
    if not source_dir.exists():
        print(f"ERROR: '{source_dir}' folder not found!")
        return

    # Clear existing dataset to avoid mixing
    if dest_base.exists():
        print("Cleaning old dataset folder...")
        shutil.rmtree(dest_base)
    
    (dest_base / "train").mkdir(parents=True, exist_ok=True)
    (dest_base / "val").mkdir(parents=True, exist_ok=True)

    # Categories to process
    categories = ["cattle", "buffalo"]
    
    processed_count = 0
    total_images = 0

    for cat in categories:
        cat_dir = source_dir / cat
        # Sometimes there's a nested folder with the same name
        if (cat_dir / cat).exists():
            cat_dir = cat_dir / cat
            
        print(f"Scanning {cat} in {cat_dir}...")
        
        if not cat_dir.exists():
            print(f"Warning: category folder '{cat_dir}' not found. Skipping.")
            continue

        for folder in cat_dir.iterdir():
            if folder.is_dir():
                original_name = folder.name
                # Sanitize and prefix
                clean_name = f"{cat}_{original_name.lower().replace(' ', '_').replace('(', '').replace(')', '').replace('-', '_')}"
                
                # Get images
                images = [f for f in folder.glob("*") if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']]
                if not images:
                    continue
                    
                print(f"Processing '{original_name}' -> '{clean_name}' ({len(images)} images)...")
                
                # Create dest folders
                train_dest = dest_base / "train" / clean_name
                val_dest = dest_base / "val" / clean_name
                train_dest.mkdir(parents=True, exist_ok=True)
                val_dest.mkdir(parents=True, exist_ok=True)
                
                random.shuffle(images)
                
                # Split 80/20
                split_idx = int(len(images) * 0.8)
                train_imgs = images[:split_idx]
                val_imgs = images[split_idx:]
                
                for img in train_imgs:
                    try:
                        shutil.copy(img, train_dest / img.name)
                    except Exception as e:
                        print(f"Error copying {img} to {train_dest}: {e}")
                    
                for img in val_imgs:
                    try:
                        shutil.copy(img, val_dest / img.name)
                    except Exception as e:
                        print(f"Error copying {img} to {val_dest}: {e}")
                    
                processed_count += 1
                total_images += len(images)

    # Handle Invalid class
    print("Adding 'invalid' class...")
    invalid_src = source_dir / "invalid_source.jpg"
    if not invalid_src.exists():
        print("Generating invalid source image...")
        import subprocess
        subprocess.run(["python", "generate_invalid_image.py"], check=True)
        
    train_invalid = dest_base / "train" / "invalid"
    val_invalid = dest_base / "val" / "invalid"
    train_invalid.mkdir(parents=True, exist_ok=True)
    val_invalid.mkdir(parents=True, exist_ok=True)
    
    for i in range(50):
        shutil.copy(invalid_src, train_invalid / f"invalid_{i}.jpg")
    for i in range(10):
        shutil.copy(invalid_src, val_invalid / f"invalid_{i}.jpg")

    print("------------------------------------------------")
    print(f"Successfully imported {processed_count} breeds and 1 invalid class!")
    print(f"Total images: {total_images + 60}")
    print("You can now run 'python train_model.py'")
    print("------------------------------------------------")

if __name__ == "__main__":
    import_dataset()
