from ultralytics import YOLO
import os

# Define the path to the model
# Assuming 'indian_cattle_classifier11' is the latest based on recent training
model_path = os.path.join("bovine_lens_ai", "indian_cattle_classifier11", "weights", "best.pt")
image_path = "debug_image.jpg"

def verify_model():
    print(f"Checking model at: {model_path}")
    if not os.path.exists(model_path):
        print("Error: Model file not found!")
        return

    try:
        model = YOLO(model_path)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    print(f"Running inference on: {image_path}")
    if not os.path.exists(image_path):
        print("Error: Debug image not found!")
        return

    try:
        results = model(image_path)
        for result in results:
            print("\n--- Prediction Results ---")
            top1_index = result.probs.top1
            top1_conf = result.probs.top1conf.item()
            
            # Get class name safely
            class_name = result.names[top1_index]
            print(f"Predicted Class: {class_name}")
            print(f"Confidence: {top1_conf:.4f}")
            
            print("All Probabilities:")
            for i, prob in enumerate(result.probs.data):
                name = result.names[i]
                print(f"  {name}: {prob:.4f}")

    except Exception as e:
        print(f"Error during inference: {e}")

if __name__ == "__main__":
    verify_model()
