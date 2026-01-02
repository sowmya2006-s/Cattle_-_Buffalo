import re

def normalize_keys(content):
    # This regex looks for "Key": "Value" within the breeds object
    # and converts "Key" to sanitized version (lowercase, underscores)
    
    def sanitize(match):
        key = match.group(1)
        # Sanitize key like in import_dataset.py
        clean_key = key.lower().replace(" ", "_").replace("(", "").replace(")", "").replace("-", "_")
        return f'"{clean_key}":'

    # We only want to target keys inside "breeds": { ... }
    # Let's find each breeds block
    parts = re.split(r'("breeds":\s*\{)', content)
    new_content = parts[0]
    
    for i in range(1, len(parts), 2):
        header = parts[i]
        block = parts[i+1]
        
        # Split block into the portion inside braces and the rest
        # This is a bit simplified, assuming breeds is the last object or followed by }
        # Finding the matching closing brace
        brace_count = 1
        end_idx = 0
        for idx, char in enumerate(block):
            if char == '{': brace_count += 1
            if char == '}': brace_count -= 1
            if brace_count == 0:
                end_idx = idx
                break
        
        breeds_inner = block[:end_idx]
        remainder = block[end_idx:]
        
        # Replace keys in breeds_inner
        normalized_inner = re.sub(r'"([^"]+)":', sanitize, breeds_inner)
        
        new_content += header + normalized_inner + remainder
        
    return new_content

file_path = "d:/sih final/bovine-lens/src/locales/index.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

updated_content = normalize_keys(content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(updated_content)

print("Normalized translation keys in index.js")
