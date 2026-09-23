import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CalendarRange, TrendingUp, TrendingDown, Shield } from 'lucide-react';

export default function ForecastView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const res = await api.getForecast();
        setData(res);
      } catch (err) {
        console.error("Forecast fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { daily_income_avg, daily_expense_avg, forecasts } = data;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <CalendarRange className="w-5 h-5 text-teal-400" />
          <span>7-Day, 30-Day & 90-Day Cash-Flow Forecast</span>
        </h2>
        <p className="text-xs text-gray-400">
          Projects expected income and expense bounds using historical volatility patterns to prevent unexpected cash shortfalls.
        </p>
      </div>

      {/* Daily Baseline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-gray-400">Daily Average Run-Rate</span>
            <p className="text-xl font-extrabold text-emerald-400">₹{daily_income_avg?.toLocaleString()}/day</p>
          </div>
          <TrendingUp className="w-6 h-6 text-emerald-400 opacity-80" />
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-gray-400">Daily Expense Baseline</span>
            <p className="text-xl font-extrabold text-rose-400">₹{daily_expense_avg?.toLocaleString()}/day</p>
          </div>
          <TrendingDown className="w-6 h-6 text-rose-400 opacity-80" />
        </div>
      </div>

      {/* Period Forecast Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(forecasts).map(([label, fc], idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl space-y-4 border border-gray-800 hover:border-teal-500/30 transition">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
              <h3 className="text-base font-bold text-white">{label} Projection</h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400">
                {fc.confidence} Confidence
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400">Expected Income Range:</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">
                  ₹{fc.income_range[0]?.toLocaleString()} – ₹{fc.income_range[1]?.toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-gray-400">Expected Expense Range:</span>
                <p className="text-sm font-bold text-rose-400 mt-0.5">
                  ₹{fc.expense_range[0]?.toLocaleString()} – ₹{fc.expense_range[1]?.toLocaleString()}
                </p>
              </div>

              <div className="border-t border-gray-800 pt-2.5">
                <span className="text-gray-400">Expected Net Surplus:</span>
                <p className="text-base font-extrabold text-teal-300 mt-0.5">
                  ₹{fc.expected_surplus?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
