import { useState } from 'react';

export default function EMICalculator() {
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [emi, setEmi] = useState(null);

  const calculateEMI = () => {
    const P = parseFloat(amount);
    const R = parseFloat(interestRate) / 100 / 12;
    const N = parseFloat(years) * 12;

    if (P && R && N) {
      const monthlyEMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      setEmi(monthlyEMI.toFixed(2));
    } else {
      setEmi(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-slate-200 rounded-xl shadow-md">
      <h2 className="text-3xl font-semibold text-slate-700 mb-6 text-center">EMI Calculator</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Loan Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Interest Rate (%)"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          className="p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Tenure (Years)"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className="p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="text-center mt-6">
        <button
          onClick={calculateEMI}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Calculate EMI
        </button>
      </div>
      {emi && (
        <div className="text-center mt-6 text-xl text-green-600 font-bold">
          Monthly EMI: ₹{emi}
        </div>
      )}
    </div>
  );
}
