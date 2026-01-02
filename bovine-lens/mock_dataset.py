import shutil
import os
from pathlib import Path

# Source images (based on what you uploaded)
# Adjust these paths if necessary
base_path = "C:/Users/Archana/.gemini/antigravity/brain/9e49b2bd-ee5b-4a7c-b29a-6bcdd36e34e2/"
buffalo_src = base_path + "uploaded_image_0_1766214317382.jpg"
cattle_src = base_path + "uploaded_image_1_1766214317382.jpg"

invalid_src = "d:/sih final/bovine-lens/source_data/invalid_source.jpg"

def populate_folder(src_file, dest_folder, count=50):
    os.makedirs(dest_folder, exist_ok=True)
    if not os.path.exists(src_file):
        print(f"Warning: Source file {src_file} not found. Skipping.")
        return
        
    print(f"Populating {dest_folder} with {count} copies...")
    for i in range(count):
        shutil.copy(src_file, f"{dest_folder}/image_{i:03d}.jpg")

if __name__ == "__main__":
    print("Creating Mock Dataset for Indian Cattle & Buffalo Breeds...")
    
    cattle_breeds = [
        "Gir", "Sahiwal", "Red Sindhi", "Tharparkar", "Kankrej", "Ongole", "Hariana", 
        "Rathi", "Deoni", "Gaolao", "Khillari", "Hallikar", "Amritmahal", "Kangayam", 
        "Bargur", "Umblachery", "Alambadi", "Pulikulam", "Vechur", "Kasaragod Dwarf", 
        "Malnad Gidda", "Krishna Valley", "Nagori", "Nimari", "Dangi", "Mewati", "Ponwar", 
        "Siri", "Ladakhi", "Tho-Tho", "Bachaur", "Gangatiri", "Kenkatha", "Shahabadi", 
        "Purnea", "Motu", "Binjharpuri", "Kosali", "Belahi", "Manipuri"
    ]
    
    buffalo_breeds = [
        "Murrah", "Nili-Ravi", "Jafarabadi", "Surti", "Mehsana", "Bhadawari", "Nagpuri", 
        "Pandharpuri", "Toda", "Kundi", "Marathwadi", "Chilika", "Luit", "Bargur Buffalo", 
        "Godavari", "Gojri", "Manda"
    ]

    # 1. Populate Cattle
    for breed in cattle_breeds:
        folder_name = breed.lower().replace(" ", "_").replace("(", "").replace(")", "")
        # Train
        populate_folder(cattle_src, f"dataset/train/{folder_name}", 50)
        # Val
        populate_folder(cattle_src, f"dataset/val/{folder_name}", 10)
        
    # 2. Populate Buffalo
    for breed in buffalo_breeds:
        folder_name = breed.lower().replace(" ", "_").replace("(", "").replace(")", "")
        # Train
        populate_folder(buffalo_src, f"dataset/train/{folder_name}", 50)
        # Val
        populate_folder(buffalo_src, f"dataset/val/{folder_name}", 10)
        
    # 3. Populate Invalid
    print("Populating Invalid class...")
    # Train
    populate_folder(invalid_src, "dataset/train/invalid", 50)
    # Val
    populate_folder(invalid_src, "dataset/val/invalid", 10)
    
    print("Dataset populated with mock data for all breeds + invalid class!")
    print("You can now run train_model.py to test the training pipeline.")
