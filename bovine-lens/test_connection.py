from duckduckgo_search import DDGS
from fastdownload import download_url
from fastcore.all import *

def test_download():
    print("Testing download for 'Gir cattle'...")
    try:
        with DDGS() as ddgs:
            results = list(ddgs.images("Gir cattle animal", max_results=5))
            print(f"Found {len(results)} images.")
            if len(results) > 0:
                print(f"First image URL: {results[0]['image']}")
                download_url(results[0]['image'], "test_gir.jpg", show_progress=False)
                print("Download successful!")
            else:
                print("No results found.")
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_download()
