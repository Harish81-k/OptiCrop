import sys
import json
import joblib
import pandas as pd
import numpy as np
import os

def predict():
    try:
        # Read JSON string from command line arg
        input_data_str = sys.argv[1]
        data = json.loads(input_data_str)
        
        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])
        temperature = float(data["temperature"])
        humidity = float(data["humidity"])
        ph = float(data["ph"])
        rainfall = float(data["rainfall"])
        
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "../models_ml/crop_model.pkl")
        scaler_path = os.path.join(base_dir, "../models_ml/scaler.pkl")
        
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        input_df = pd.DataFrame({
            "N": [N],
            "P": [P],
            "K": [K],
            "temperature": [temperature],
            "humidity": [humidity],
            "ph": [ph],
            "rainfall": [rainfall]
        })
        
        scaled_data = scaler.transform(input_df)
        
        crop = str(model.predict(scaled_data)[0])
        
        if hasattr(model, "predict_proba"):
            confidence = float(
                round(
                    float(np.max(model.predict_proba(scaled_data))) * 100,
                    2
                )
            )
        else:
            confidence = 100.0
            
        result = {
            "crop": crop,
            "confidence": confidence
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    predict()
