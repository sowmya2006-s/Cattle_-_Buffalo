import os

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

# Generate folder names as per mock_dataset.py logic
folders = []
for b in cattle_breeds:
    folders.append(b.lower().replace(" ", "_").replace("(", "").replace(")", ""))

for b in buffalo_breeds:
    folders.append(b.lower().replace(" ", "_").replace("(", "").replace(")", ""))

folders.append("invalid")

# Sort them alphabetically (this is how ImageFolder/YOLO assigns indices)
sorted_folders = sorted(folders)

print("Total classes:", len(sorted_folders))
print("Sorted Classes:")
print(sorted_folders)

print("\nJSON Array for JS:")
import json
print(json.dumps(sorted_folders))
