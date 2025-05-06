import { useState } from "react";
import axios from "axios";
import EMICalculator from "../components/EMICalculator"; // Assuming EMI calculator is in components

const PricePrediction = () => {
  const [formData, setFormData] = useState({
    Area: "",
    Locality: "",
    BHK: "",
    Bathroom: "",
    Furnishing: "",
    Parking: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handles the form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles form submission and calls the backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

    try {
      const res = await axios.post("http://localhost:3000/api/price-predict", formData);
      setPrediction(res.data.predictedPrice); // Set predicted price in state
    } catch (error) {
      console.error("Prediction error:", error.response?.data || error.message);
      setError('Failed to fetch prediction. Please try again later.');
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md mt-10 rounded-xl">
      <h2 className="text-2xl text-slate-800 font-bold mb-6">Price Prediction</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Form fields */}
        {["Area", "Locality", "BHK", "Bathroom", "Furnishing", "Parking"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded"
          />
        ))}
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Predicting...' : 'Predict Price'}
        </button>
      </form>

      {/* Error Message */}
      {error && <div className="mt-4 text-red-500">{error}</div>}

      {/* Display Prediction */}
      {prediction !== null && !loading && (
        <div className="mt-4 text-lg font-semibold">
          Predicted Price: ₹ {prediction.toLocaleString()}
        </div>
      )}

      {/* EMI Calculator Section */}
      <div className="mt-10">
        <EMICalculator />
      </div>
    </div>
  );
};

export default PricePrediction;
