import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import { X, FileSpreadsheet, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SnapshotModal() {
  const { showSnapshot, setShowSnapshot } = useUser();
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showSnapshot) {
      const fetchSnap = async () => {
        try {
          setLoading(true);
          const res = await api.getSnapshot();
          setSnapshot(res);
        } catch (err) {
          console.error("Snapshot error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchSnap();
    }
  }, [showSnapshot]);

  if (!showSnapshot) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-2xl w-full my-8 border border-emerald-500/40 bg-[#0b0f19] space-y-6 shadow-2xl shadow-emerald-500/10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">GigWealth Financial Snapshot</h3>
              <p className="text-xs text-gray-400">Final Personalized Hackathon Executive Summary</p>
            </div>
          </div>
          <button onClick={() => setShowSnapshot(false)} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading || !snapshot ? (
          <div className="flex justify-center items-center min-h-[250px]">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-5 text-xs">
            
            {/* User Info Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-900 border border-gray-800">
              <div>
                <span className="text-gray-400">User:</span> <strong className="text-white text-sm ml-1">{snapshot.user_name}</strong>
              </div>
              <div>
                <span className="text-gray-400">Role:</span> <strong className="text-emerald-400 ml-1">{snapshot.occupation}</strong>
              </div>
              <div>
                <span className="text-gray-400">Health:</span> <strong className="text-teal-300 ml-1">{snapshot.financial_health}</strong>
              </div>
            </div>

            {/* Core Financial Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Average Income</span>
                <p className="text-base font-extrabold text-white">₹{snapshot.average_monthly_income?.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-400">{snapshot.typical_income_range}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Essential Expenses</span>
                <p className="text-base font-extrabold text-rose-400">₹{snapshot.essential_expenses?.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Living costs protected</p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Work Expenses</span>
                <p className="text-base font-extrabold text-sky-400">₹{snapshot.work_expenses?.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Fuel & vehicle service</p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Net Surplus</span>
                <p className="text-base font-extrabold text-teal-300">₹{snapshot.monthly_surplus?.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Available cash buffer</p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Rec. Savings</span>
                <p className="text-base font-extrabold text-emerald-400">₹{snapshot.recommended_savings?.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Adaptive rule engine</p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Emergency Reserve</span>
                <p className="text-base font-extrabold text-indigo-400">₹{snapshot.current_savings?.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">{snapshot.emergency_fund_progress}</p>
              </div>
            </div>

            {/* Insights & Action Card */}
            <div className="space-y-2.5 pt-1">
              <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Top Data Insight</span>
                <p className="text-gray-200">{snapshot.major_spending_insight}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Suggested Next Action</span>
                <p className="text-emerald-300 font-semibold flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  {snapshot.next_suggested_action}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSnapshot(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md"
              >
                Close Snapshot
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
