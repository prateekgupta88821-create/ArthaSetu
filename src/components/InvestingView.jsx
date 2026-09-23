import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function InvestingView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvesting = async () => {
      try {
        setLoading(true);
        const res = await api.getInvesting();
        setData(res);
      } catch (err) {
        console.error("Investing fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvesting();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { is_emergency_safe, warning_banner, risk_preference, guidance_options, disclaimer } = data;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Educational Conservative Investment Guidance</span>
        </h2>
        <p className="text-xs text-gray-400">
          Educational evaluation of lower-risk savings & liquid deposit options tailored for gig income stability.
        </p>
      </div>

      {/* Safety / Warning Banner */}
      {!is_emergency_safe && warning_banner && (
        <div className="glass-panel p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start space-x-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-300 text-sm">Emergency Reserve Priority Warning</h4>
            <p className="text-gray-300 mt-1">{warning_banner}</p>
          </div>
        </div>
      )}

      {is_emergency_safe && (
        <div className="glass-panel p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center space-x-3 text-xs">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-emerald-300 font-medium">
            Your emergency reserve is healthy! Below are conservative, capital-protected instruments suitable for your surplus.
          </p>
        </div>
      )}

      {/* Educational Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guidance_options.map((opt, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl space-y-3 border border-gray-800 hover:border-emerald-500/30 transition">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {opt.risk_level} Risk
            </span>
            <h3 className="text-base font-bold text-white">{opt.name}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{opt.description}</p>
            
            <div className="border-t border-gray-800/80 pt-3 space-y-1.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Indicative Return:</span>
                <span className="font-bold text-emerald-400">{opt.indicative_return}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time Horizon:</span>
                <span className="text-gray-200">{opt.horizon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Liquidity:</span>
                <span className="text-gray-200">{opt.liquidity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 text-xs text-gray-400 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-gray-200">Disclaimer:</strong> {disclaimer} GigWealth AI does not execute real-money investments, promise guaranteed returns, or act as a regulated SEBI financial advisor.
        </p>
      </div>

    </div>
  );
}
