from ultralytics import YOLO

# Load the trained model
model_path = 'bovine_lens_ai/indian_bovine_classifier_v2/weights/best.pt'
print(f"Loading model from {model_path}...")
model = YOLO(model_path)

# Export to ONNX
print("Exporting model to ONNX format...")
try:
    model.export(format='onnx')
    print("Export successful!")
except Exception as e:
    print(f"Export failed: {e}")
