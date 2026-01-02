import numpy as np
from PIL import Image
import os

def create_noise_image(path):
    # Create a random noise image (224x224 RGB)
    # Using random colors to simulate non-specific "junk" input
    im_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
    img = Image.fromarray(im_array)
    
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path)
    print(f"Created noise image at: {path}")

if __name__ == "__main__":
    create_noise_image("d:/sih final/bovine-lens/source_data/invalid_source.jpg")
