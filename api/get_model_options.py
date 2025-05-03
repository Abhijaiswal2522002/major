import joblib
import json

le_locality = joblib.load('api/le_locality.pkl')
le_furnishing = joblib.load('api/le_furnishing.pkl')
le_parking = joblib.load('api/le_parking.pkl')

options = {
    "Localities": le_locality.classes_.tolist(),
    "Furnishings": le_furnishing.classes_.tolist(),
    "ParkingOptions": le_parking.classes_.tolist()
}

print(json.dumps(options))
