from ultralytics import YOLO
import os

def export_model():
    print("=" * 60)
    print("BovineLens: Exporting Trained Model to ONNX Format")
    print("=" * 60)
    
    # Load the best trained model
    model_path = './bovine_lens_ai/indian_cattle_classifier10/weights/best.pt'
    
    if not os.path.exists(model_path):
        print(f"ERROR: Model not found at {model_path}")
        return
    
    print(f"\n[1/2] Loading trained model from: {model_path}")
    model = YOLO(model_path)
    
    # Export to ONNX format (works well with web deployment)
    print("\n[2/2] Exporting to ONNX format...")
    print("This format is optimized for web deployment using ONNX Runtime")
    
    export_path = model.export(
        format='onnx',
        imgsz=224,
        simplify=True  # Simplify the model for better compatibility
    )
    
    print("\n" + "=" * 60)
    print("SUCCESS! Model exported successfully")
    print(f"ONNX Model Location: {export_path}")
    print("=" * 60)
    print("\nModel Performance Summary:")
    print("- Top-1 Accuracy: 44.46% (Final epoch)")
    print("- Top-5 Accuracy: 77.57% (Final epoch)")
    print("- Total Classes: 64 cattle and buffalo breeds")
    print("- Training Images: 9,022")
    print("- Validation Images: 2,293")
    print("\nYou can now integrate this ONNX model into your React app!")
    
if __name__ == '__main__':
    export_model()
