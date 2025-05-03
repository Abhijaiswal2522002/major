# train_model.py
import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder

# Load and clean data
df = pd.read_csv('MagicBricks.csv')
df = df.dropna()

features = ['Area', 'BHK', 'Bathroom', 'Locality', 'Furnishing', 'Parking']
target = 'Price'
df = df[features + [target]]

# Encode categorical features
le_locality = LabelEncoder()
df['Locality'] = le_locality.fit_transform(df['Locality'])

le_furnishing = LabelEncoder()
df['Furnishing'] = le_furnishing.fit_transform(df['Furnishing'])

le_parking = LabelEncoder()
df['Parking'] = le_parking.fit_transform(df['Parking'])

# Train model
X = df[features]
y = df[target]
model = LinearRegression()
model.fit(X, y)

# Save model and encoders
joblib.dump(model, 'api/price_model.pkl')
joblib.dump(le_locality, 'api/le_locality.pkl')
joblib.dump(le_furnishing, 'api/le_furnishing.pkl')
joblib.dump(le_parking, 'api/le_parking.pkl')
