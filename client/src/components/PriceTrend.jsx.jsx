import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PriceTrend = () => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/trend');
        setTrendData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch trend data');
        setLoading(false);
      }
    };
    fetchTrendData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Prepare data for the chart
  const localities = trendData.map(item => item.Locality);
  const prices = trendData.map(item => item.Price);

  const data = {
    labels: localities,  // Localities on the X-axis
    datasets: [
      {
        label: 'Average Price',
        data: prices,  // Prices on the Y-axis
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return 'Price: ₹' + context.raw; // Show price in ₹ on hover
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10, // Limits number of x-axis labels
          maxRotation: 90,   // Rotates x-axis labels for better visibility
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold text-slate-700 mb-4 text-center">
    Price Trend by Locality
  </h2>
  <div className="relative">
    <Bar data={data} options={options} />
  </div>
</div>

  );
};

export default PriceTrend;
