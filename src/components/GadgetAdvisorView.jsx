import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Smartphone, CheckCircle, AlertTriangle } from 'lucide-react';

export default function GadgetAdvisorView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGadgets = async () => {
      try {
        setLoading(true);
        const res = await api.getGadgets();
        setData(res);
      } catch (err) {
        console.error("Gadgets fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGadgets();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { gadget_comparisons, recommended_budget_range, current_monthly_surplus } = data;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-purple-400" />
          <span>Gadget Affordability Advisor & Comparison</span>
        </h2>
        <p className="text-xs text-gray-400">
          Compare up to 3 devices side-by-side to find the right gadget that fits comfortably inside your monthly surplus buffer.
        </p>
      </div>

      {/* Recommended Budget Range Banner */}
      <div className="glass-panel p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
          Recommended Budget Range
        </span>
        <h3 className="text-xl font-extrabold text-white">
          ₹{recommended_budget_range.min_price?.toLocaleString()} – ₹{recommended_budget_range.max_price?.toLocaleString()}
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          {recommended_budget_range.explanation}
        </p>
      </div>

      {/* Side-by-side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gadget_comparisons.map((g, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl space-y-4 border border-gray-800 hover:border-purple-500/30 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {g.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{g.name}</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  g.badge_color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300' :
                  g.badge_color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300' :
                  g.badge_color === 'amber' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-rose-500/20 text-rose-300'
                }`}>
                  {g.affordability_category}
                </span>
              </div>

              <div className="border-t border-b border-gray-800/80 py-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="font-bold text-white">₹{g.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly EMI ({g.tenure_months}m):</span>
                  <span className="font-bold text-purple-400">₹{g.monthly_emi?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Financing Cost:</span>
                  <span className="text-gray-300">₹{g.total_financing_cost?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Remaining Buffer:</span>
                  <span className="font-bold text-emerald-400">₹{g.post_purchase_buffer?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed italic bg-gray-900/60 p-2.5 rounded-xl border border-gray-800">
              "{g.impact_summary}"
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
