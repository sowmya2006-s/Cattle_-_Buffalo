from ultralytics import YOLO
import json

def check_classes():
    # Load the model that we exported
    model_path = 'bovine_lens_ai/indian_bovine_classifier_v2/weights/best.pt'
    print(f"Loading model: {model_path}")
    
    try:
        model = YOLO(model_path)
        print("\n--- Model Class Mapping ---")
        # model.names can be a dict {0: 'name', ...} or list
        names = model.names
        print(f"Type: {type(names)}")
        print(json.dumps(names, indent=2))
        
        print("\n--- Sorted List for Helper ---")
        # If it's a dict, sort by index to verify order
        if isinstance(names, dict):
            sorted_names = [names[i] for i in sorted(names.keys())]
            print(json.dumps(sorted_names, indent=2))
        else:
            print(json.dumps(list(names), indent=2))
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    check_classes()
