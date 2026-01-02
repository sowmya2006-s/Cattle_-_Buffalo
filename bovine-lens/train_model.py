from ultralytics import YOLO
import os

def main():
    print("------------------------------------------------")
    print("BovineLens: Starting AI Model Training Workflow")
    print("------------------------------------------------")

    # 1. Initialize the Model
    print("\n[1/4] Loading Pre-trained Model...")
    # Use yolov8n-cls for the best balance of speed and accuracy for web
    model = YOLO('yolov8n-cls.pt') 

    # 2. Train the Model
    print("\n[2/4] Starting Training (Real Data)...")
    results = model.train(
        data='./dataset',   
        epochs=30,          # Increased for better accuracy on large dataset
        imgsz=224,          
        device='cpu',       # Use '0' for GPU if available, but staying safe with 'cpu'
        project='bovine_lens_ai',
        name='indian_bovine_classifier_v2'
    )

    # 3. Validate Performance
    print("\n[3/4] Validating Model Accuracy...")
    metrics = model.val()
    print(f"Top-1 Accuracy: {metrics.top1:.4f}")
    print(f"Top-5 Accuracy: {metrics.top5:.4f}")

    # 4. Export for Web
    print("\n[4/4] Exporting to ONNX for Web App...")
    # Exporting to ONNX instead of TFJS as the app is already using ONNX
    model.export(format='onnx')
    
    print("\n------------------------------------------------")
    print("SUCCESS! Model trained and exported.")
    print(f"Weights saved in: {results.save_dir}")
    print("------------------------------------------------")

if __name__ == '__main__':
    main()
