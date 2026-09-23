import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PiggyBank, ShieldCheck, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function SavingsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetMonths, setTargetMonths] = useState(6);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        setLoading(true);
        const res = await api.getSavings();
        setData(res);
      } catch (err) {
        console.error("Savings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavings();
  }, [targetMonths]);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { smart_savings, emergency_fund } = data;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <PiggyBank className="w-5 h-5 text-teal-400" />
          <span>Smart Adaptive Savings & Emergency Fund Planner</span>
        </h2>
        <p className="text-xs text-gray-400">
          Dynamically adjusts recommended savings based on monthly income fluctuations and fixed obligations.
        </p>
      </div>

      {/* Recommended Savings Hero Banner */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-teal-950/40 via-gray-900 to-emerald-950/30 border border-teal-500/30 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
              Recommended Monthly Savings Allocation
            </span>
            <p className="text-3xl font-extrabold text-white mt-1">
              ₹{smart_savings.recommended_savings?.toLocaleString()}
              <span className="text-xs font-normal text-gray-400 ml-2">
                ({smart_savings.savings_rate_pct}% of earnings)
              </span>
            </p>
            <p className="text-xs text-teal-300/80 mt-1">
              {smart_savings.explanation}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-gray-900/90 border border-gray-800 p-3 rounded-xl text-xs">
            <div>
              <p className="text-gray-400">Monthly Surplus</p>
              <p className="text-sm font-bold text-emerald-400">₹{smart_savings.surplus?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Allocation Flow Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-gray-900/80 border border-teal-500/20 space-y-1">
            <span className="text-[10px] font-bold text-teal-400 uppercase">Emergency Reserve (60%)</span>
            <p className="text-base font-bold text-white">₹{smart_savings.allocations.emergency_fund?.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">Protects essential living expenses</p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-900/80 border border-indigo-500/20 space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Goal Targets (30%)</span>
            <p className="text-base font-bold text-white">₹{smart_savings.allocations.goals?.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">Vehicle / Laptop upgrade</p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-900/80 border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Flexible Buffer (10%)</span>
            <p className="text-base font-bold text-white">₹{smart_savings.allocations.flexible_buffer?.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">Smoothes low-income weeks</p>
          </div>
        </div>
      </div>

      {/* Emergency Reserve Module */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Emergency Cash Reserve Status</span>
            </h3>
            <p className="text-xs text-gray-400">
              Target = Monthly Essential Expenses (₹{emergency_fund.essential_monthly_expenses?.toLocaleString()}) × Target Months
            </p>
          </div>

          {/* Month Target Selector */}
          <div className="flex items-center space-x-1.5 bg-gray-900 border border-gray-800 p-1 rounded-xl text-xs">
            <span className="text-gray-400 px-2">Target Horizon:</span>
            {[3, 6, 9].map((m) => (
              <button
                key={m}
                onClick={() => setTargetMonths(m)}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  targetMonths === m
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {m} Months
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Fund Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Current Saved: <strong className="text-white">₹{emergency_fund.current_savings?.toLocaleString()}</strong></span>
            <span className="text-indigo-400 font-semibold">{emergency_fund.progress_pct}% of ₹{emergency_fund.target_amount?.toLocaleString()} Target</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-teal-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, emergency_fund.progress_pct)}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
            <span className="text-gray-400">Remaining Reserve Gap:</span>
            <p className="text-sm font-bold text-rose-400">₹{emergency_fund.remaining_amount?.toLocaleString()}</p>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
            <span className="text-gray-400">Est. Months to Target:</span>
            <p className="text-sm font-bold text-emerald-400">{emergency_fund.estimated_months_to_target} Months</p>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
            <span className="text-gray-400">Reserve Status:</span>
            <p className="text-sm font-bold text-teal-300">{emergency_fund.status}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
