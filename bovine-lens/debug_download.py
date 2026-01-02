from duckduckgo_search import DDGS
from fastdownload import download_url
import time
import os

def debug_download():
    print("DEBUG: Starting download test...")
    breed = "Gir"
    query = "Gir cattle animal"
    
    print(f"DEBUG: Initializing DDGS for '{query}'...")
    try:
        with DDGS() as ddgs:
            # Fetch just 5 results to test
            print("DEBUG: Searching...")
            results = list(ddgs.images(query, max_results=5))
            
            print(f"DEBUG: Found {len(results)} results.")
            
            if len(results) == 0:
                print("ERROR: Search returned NO results. Rate limit or library issue.")
                return

            print("DEBUG: First URL found:", results[0]['image'])
            
            # Try downloading
            dest = "debug_image.jpg"
            print(f"DEBUG: Attempting to download to {dest}...")
            try:
                download_url(results[0]['image'], dest, show_progress=False)
                if os.path.exists(dest):
                    print(f"SUCCESS: File downloaded! Size: {os.path.getsize(dest)} bytes")
                else:
                    print("ERROR: Download function finished but file does not exist.")
            except Exception as e:
                print(f"ERROR: Download failed: {e}")
                
    except Exception as e:
        print(f"CRITICAL ERROR during search: {e}")

if __name__ == "__main__":
    debug_download()
