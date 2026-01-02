import os
from duckduckgo_search import DDGS
from fastdownload import download_url
from fastcore.all import *
import time

def check_and_fix_dataset():
    print("------------------------------------------------")
    print("BovineLens: Checking for Missing Data...")
    print("------------------------------------------------")
    
    base_path = "dataset/train"
    if not os.path.exists(base_path):
        print(f"Error: {base_path} not found. Please run clean_and_train.bat first.")
        return

    breeds_dirs = [d for d in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, d))]
    
    missing_breeds = []
    
    for breed_folder in breeds_dirs:
        path = os.path.join(base_path, breed_folder)
        files = os.listdir(path)
        if len(files) < 10: # threshold for "empty or broken"
            missing_breeds.append(breed_folder)
            print(f"[MISSING] {breed_folder} has only {len(files)} images.")
        else:
            print(f"[OK] {breed_folder}: {len(files)} images")

    print(f"\nFound {len(missing_breeds)} breeds with missing data.")
    
    if len(missing_breeds) == 0:
        print("Dataset looks good! You can train now.")
        return

    print("Attempting to fix missing breeds...")
    
    for breed_folder in missing_breeds:
        # Reconstruct query from folder name
        breed_name = breed_folder.replace("_", " ")
        # Try a few variations
        queries = [
            f"{breed_name} cattle animal",
            f"{breed_name} buffalo animal",
            f"{breed_name} indian breed"
        ]
        
        success = False
        for query in queries:
            print(f"\nTrying to download for '{breed_name}' using query: '{query}'")
            try:
                dest = Path(f"dataset/train/{breed_folder}")
                dest2 = Path(f"dataset/val/{breed_folder}")
                dest.mkdir(exist_ok=True, parents=True)
                dest2.mkdir(exist_ok=True, parents=True)
                
                with DDGS() as ddgs:
                    # Try to fetch 40 images
                    try:
                        urls = list(ddgs.images(query, max_results=50))
                    except Exception as search_err:
                        print(f"  -> Search Error (Rate Limit?): {search_err}")
                        print("  -> Waiting 30 seconds before retrying...")
                        time.sleep(30)
                        continue

                    if len(urls) < 5:
                        print("  -> Not enough images found, trying next query...")
                        time.sleep(5)
                        continue
                        
                    print(f"  -> Found {len(urls)} images. Downloading...")
                    
                    count = 0
                    for i, url_data in enumerate(urls):
                        try:
                            # Split into train/val
                            if i < 40:
                                download_url(url_data['image'], dest/f"fixed_{i}.jpg", show_progress=False)
                            else:
                                download_url(url_data['image'], dest2/f"fixed_{i}.jpg", show_progress=False)
                            count += 1
                        except:
                            pass
                    
                    if count > 5:
                        print(f"  -> Successfully downloaded {count} images!")
                        success = True
                        break # Stop trying other queries for this breed
            
            except Exception as e:
                print(f"  -> Error: {e}")
                time.sleep(5)
        
        if not success:
            print(f"CRITICAL: Could not find images for {breed_name}. Manual check required.")
        
        # Consistent delay between successful breeds to be nice to the API
        print("Waiting 15s to avoid rate limits...")
        time.sleep(15)

    print("\n------------------------------------------------")
    print("Fix process complete. Please run 'python train_model.py' again.")
    print("------------------------------------------------")

if __name__ == "__main__":
    check_and_fix_dataset()
