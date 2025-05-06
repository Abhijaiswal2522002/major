from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import joblib
import pandas as pd

app = Flask(__name__)

# Enable CORS for the app
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Load model once when the server starts
model = joblib.load('price_model.pkl')
le_locality = joblib.load('le_locality.pkl')
le_furnishing = joblib.load('le_furnishing.pkl')
le_parking = joblib.load('le_parking.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        # Encode categorical values
        locality_encoded = le_locality.transform([data['Locality']])[0]
        furnishing_encoded = le_furnishing.transform([data['Furnishing']])[0]
        parking_encoded = le_parking.transform([data['Parking']])[0]

        # Prepare DataFrame for prediction
        input_data = pd.DataFrame([{
            'Area': data['Area'],
            'BHK': data['BHK'],
            'Bathroom': data['Bathroom'],
            'Locality': locality_encoded,
            'Furnishing': furnishing_encoded,
            'Parking': parking_encoded
        }])

        # Predict the price
        predicted_price = model.predict(input_data)[0]
        return jsonify({'predictedPrice': round(predicted_price, 2)})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/trend', methods=['GET'])
def trend():
    try:
        df = pd.read_csv('MagicBricks.csv')
        df = df.dropna()

        # Group by Locality and get average price
        trend_data = (
            df.groupby('Locality')['Price']
            .mean()
            .reset_index()
            .sort_values(by='Price', ascending=False)
        )

        # Modify data to match expected structure
        trend_data['date'] = '2025-05-05'  # Placeholder date or calculate based on actual data
        return jsonify(trend_data[['Locality', 'Price', 'date']].to_dict(orient='records'))
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
