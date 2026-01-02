import os
from duckduckgo_search import DDGS
from fastdownload import download_url
from fastcore.all import *
import time

def search_images(term, max_images=50):
    print(f"Searching for '{term}'...")
    time.sleep(3) # Wait to avoid rate limits
    try:
        with DDGS() as ddgs:
            return [r for r in ddgs.images(term, max_results=max_images)]
    except Exception as e:
        print(f"Error searching for {term}: {e}")
        return []

def download_images(query, folder, max_count=100):
    dest = Path(folder)
    dest.mkdir(exist_ok=True, parents=True)
    
    urls = search_images(query, max_images=max_count + 20) # Buffer for failures
    
    count = 0
    for i, url_data in enumerate(urls):
        if count >= max_count:
            break
        try:
            download_url(url_data['image'], dest/f"{query}_{i}.jpg", show_progress=False)
            count += 1
            print(f"[{count}/{max_count}] Downloaded {query}_{i}.jpg")
        except Exception as e:
            # print(f"Failed to download {query}_{i}: {e}")
            pass
    print(f"Finished downloading {count} images for {query}.")

if __name__ == "__main__":
    print("Starting automatic dataset download for Indian Cattle & Buffalo Breeds...")
    
    # Full list provided by user
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

    def process_breeds(breed_list, animal_type):
        for breed in breed_list:
            try:
                query = f"{breed} {animal_type} animal"
                print(f"\nProcessing {breed}...")
                
                # Using specific sanitized folder names
                folder_name = breed.lower().replace(" ", "_").replace("(", "").replace(")", "")
                
                download_images(query, f"dataset/train/{folder_name}", max_count=40)
                download_images(query, f"dataset/val/{folder_name}", max_count=10)
                
                print("Waiting 10 seconds to avoid rate limits...")
                time.sleep(10) 
            except Exception as breed_error:
                print(f"FAILED to process {breed}: {breed_error}")
                continue

    # Execute
    process_breeds(cattle_breeds, "cattle")
    process_breeds(buffalo_breeds, "buffalo")
    
    print("\nDataset download complete!")
