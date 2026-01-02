from ultralytics import YOLO
import sys

def resume():
    print("------------------------------------------------")
    print("BovineLens: Resuming Training (Attempt 2 - v23)")
    print("------------------------------------------------")

    # Try newer v23 checkopint
    model_path = 'bovine_lens_ai/indian_bovine_classifier_v23/weights/last.pt'
    
    print(f"Loading checkpoint: {model_path}...")
    try:
        model = YOLO(model_path)
        # Resume training
        print("Resuming training...")
        results = model.train(resume=True)

        # Export for Web after it finishes
        print("\nExporting to ONNX for Web App...")
        model.export(format='onnx')
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    resume()
