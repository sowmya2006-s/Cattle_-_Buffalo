import re

def add_invalid(content):
    # Translations for "invalid"
    invalid_translations = {
        "en": "Invalid Image",
        "hi": "अमान्य छवि",
        "ta": "சரியற்ற படம்",
        "te": "చెల్లని చిత్రం",
        "kn": "ಅಮಾನ್ಯ ಚಿತ್ರ",
        "ml": "അമാന്യ ചിത്രം",
        "bn": "অবৈধ ছবি",
        "mr": "अवैध प्रतिमा",
        "gu": "અમાન્ય છબી"
    }

    # Find each translation block
    blocks = re.split(r'(\w{2}:\s*\{)', content)
    new_content = blocks[0]
    
    current_lang = None
    for i in range(1, len(blocks), 2):
        lang_match = re.match(r'(\w{2}):', blocks[i])
        current_lang = lang_match.group(1) if lang_match else None
        
        header = blocks[i]
        body = blocks[i+1]
        
        if current_lang in invalid_translations:
            # Find the "breeds": { ... } block
            if '"breeds": {' in body:
                # Add "invalid": "..." to the end of the breeds object
                # Finding the end of breeds object
                breed_start_idx = body.find('"breeds": {')
                brace_count = 0
                breed_end_idx = -1
                for j in range(breed_start_idx, len(body)):
                    if body[j] == '{': brace_count += 1
                    if body[j] == '}': brace_count -= 1
                    if brace_count == 0 and body[j] == '}':
                        breed_end_idx = j
                        break
                
                if breed_end_idx != -1:
                    translation = invalid_translations[current_lang]
                    # Check if "invalid" already exists to avoid duplicates
                    if '"invalid":' not in body[breed_start_idx:breed_end_idx]:
                        # Insert before the closing brace
                        body = body[:breed_end_idx] + f', \n                "invalid": "{translation}"' + body[breed_end_idx:]
        
        new_content += header + body
        
    return new_content

file_path = "d:/sih final/bovine-lens/src/locales/index.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

updated_content = add_invalid(content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(updated_content)

print("Added 'invalid' translation to all languages")
