import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import { TrendingUp, Plus, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function IncomeView() {
  const { refreshData } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Income Entry State
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Gig Payout');
  const [frequency, setFrequency] = useState('Monthly');
  const [date, setDate] = useState('2026-09-23');

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const res = await api.getIncome();
      setData(res);
    } catch (err) {
      console.error("Income fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    try {
      await api.addIncome({
        amount: parseFloat(amount),
        source,
        frequency,
        date,
        notes: "Added via Income Analyzer"
      });
      setShowAddModal(false);
      setAmount('');
      await fetchIncome();
      await refreshData();
    } catch (err) {
      console.error("Failed to add income:", err);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { metrics, raw_history, income_source } = data;

  const chartData = raw_history.map((val, idx) => ({
    month: `Period ${idx + 1}`,
    amount: val
  }));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Income Volatility Analyzer</span>
          </h2>
          <p className="text-xs text-gray-400">
            Source: <span className="text-gray-200 font-medium">{income_source}</span> | Frequency: Adaptive
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Income Record</span>
        </button>
      </div>

      {/* Statistical Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <p className="text-[11px] uppercase font-bold text-gray-400">Average Income</p>
          <p className="text-xl font-extrabold text-emerald-400">₹{metrics.average_income?.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <p className="text-[11px] uppercase font-bold text-gray-400">Median Income</p>
          <p className="text-xl font-extrabold text-white">₹{metrics.median_income?.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <p className="text-[11px] uppercase font-bold text-gray-400">Lowest Month</p>
          <p className="text-xl font-extrabold text-rose-400">₹{metrics.min_income?.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <p className="text-[11px] uppercase font-bold text-gray-400">Highest Month</p>
          <p className="text-xl font-extrabold text-teal-400">₹{metrics.max_income?.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1 col-span-2 lg:col-span-1">
          <p className="text-[11px] uppercase font-bold text-gray-400">Stability Score</p>
          <p className="text-xl font-extrabold text-amber-400">{metrics.stability_score}/100</p>
        </div>
      </div>

      {/* Typical Range Highlight Banner */}
      <div className="glass-panel p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">Typical Income Volatility Range</h4>
            <p className="text-xs text-gray-300">
              Your realistic monthly earnings fluctuate between <span className="text-emerald-400 font-bold">₹{metrics.typical_range[0]?.toLocaleString()}</span> and <span className="text-emerald-400 font-bold">₹{metrics.typical_range[1]?.toLocaleString()}</span>.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-800 text-gray-300 border border-gray-700">
          Trend: {metrics.trend?.toUpperCase()}
        </span>
      </div>

      {/* Income Trend Line Chart */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-white">Historical Payout Records</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Income Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4 border border-gray-700 bg-gray-900">
            <h3 className="text-base font-bold text-white">Record New Income Entry</h3>
            <form onSubmit={handleAddIncome} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 29500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Source</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Daily">Daily Payout</option>
                  <option value="Weekly">Weekly Settlement</option>
                  <option value="Monthly">Monthly Summary</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
