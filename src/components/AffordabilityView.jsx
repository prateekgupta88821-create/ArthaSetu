import React, { useState } from 'react';
import { api } from '../services/api';
import { Calculator, AlertCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AffordabilityView() {
  const [price, setPrice] = useState('60000');
  const [downPayment, setDownPayment] = useState('10000');
  const [tenureMonths, setTenureMonths] = useState('24');
  const [interestRate, setInterestRate] = useState('12.0');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!price || parseFloat(price) <= 0) return;
    try {
      setLoading(true);
      const res = await api.checkAffordability({
        product_price: parseFloat(price),
        down_payment: parseFloat(downPayment || 0),
        emi_months: parseInt(tenureMonths),
        annual_interest_rate: parseFloat(interestRate || 0)
      });
      setResult(res);
    } catch (err) {
      console.error("Affordability calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          <span>"Can I Afford It?" Universal Calculator</span>
        </h2>
        <p className="text-xs text-gray-400">
          Evaluates how major purchases impact your monthly buffer, debt ratio, and emergency fund safety.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Form */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 lg:col-span-1">
          <h3 className="text-sm font-bold text-white">Purchase & Financing Details</h3>
          
          <form onSubmit={handleCalculate} className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">Product Price (₹)</label>
              <input
                type="number"
                required
                placeholder="60000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Down Payment (₹)</label>
              <input
                type="number"
                placeholder="10000"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">EMI Tenure (Months)</label>
              <select
                value={tenureMonths}
                onChange={(e) => setTenureMonths(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.5"
                placeholder="12.0"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold shadow-md transition"
            >
              {loading ? 'Evaluating Financial Impact...' : 'Evaluate Affordability'}
            </button>
          </form>
        </div>

        {/* Evaluation Output Result */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-5 flex flex-col justify-between">
          {result ? (
            <div className="space-y-5">
              
              {/* Rating Banner */}
              <div className={`p-4 rounded-xl border space-y-1.5 ${
                result.badge_color === 'emerald' ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' :
                result.badge_color === 'yellow' ? 'bg-yellow-950/30 border-yellow-500/40 text-yellow-300' :
                result.badge_color === 'amber' ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' :
                'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Financial Rating</span>
                  <span className="text-sm font-extrabold px-3 py-0.5 rounded-full bg-black/40 border border-current">
                    {result.affordability_category}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-gray-200 pt-1">{result.description}</p>
              </div>

              {/* Impact Statement */}
              <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-300 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>{result.buffer_impact_statement}</p>
              </div>

              {/* Detailed Numbers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                  <span className="text-gray-400">Monthly EMI</span>
                  <p className="text-base font-bold text-white">₹{result.monthly_emi?.toLocaleString()}</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                  <span className="text-gray-400">Total Interest</span>
                  <p className="text-base font-bold text-amber-400">₹{result.total_interest?.toLocaleString()}</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                  <span className="text-gray-400">Post-Purchase Buffer</span>
                  <p className="text-base font-bold text-emerald-400">₹{result.post_purchase_buffer?.toLocaleString()}</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                  <span className="text-gray-400">Total EMI Burden</span>
                  <p className="text-base font-bold text-gray-200">{result.total_emi_burden_pct}%</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center space-y-2 text-gray-400">
              <HelpCircle className="w-10 h-10 text-gray-600" />
              <p className="text-xs">Fill out purchase price and click <strong>Evaluate Affordability</strong> to inspect budget impact.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
