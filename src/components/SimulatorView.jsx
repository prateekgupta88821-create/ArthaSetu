import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sliders, ArrowRight, TrendingDown, TrendingUp, ShieldCheck } from 'lucide-react';

export default function SimulatorView() {
  const [incomePct, setIncomePct] = useState(0);
  const [expensePct, setExpensePct] = useState(0);
  const [newEmi, setNewEmi] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);

  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    try {
      setLoading(true);
      const res = await api.runSimulator({
        income_change_pct: parseFloat(incomePct),
        expense_change_pct: parseFloat(expensePct),
        new_monthly_emi: parseFloat(newEmi),
        one_time_purchase_amount: parseFloat(purchaseAmount)
      });
      setSimulation(res);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [incomePct, expensePct, newEmi, purchaseAmount]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <span>What-If Financial Scenario Simulator</span>
        </h2>
        <p className="text-xs text-gray-400">
          Simulate income drops, expense surges, or major purchase additions to inspect before-and-after financial stability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sliders Control Panel */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 lg:col-span-1 border border-gray-800">
          <h3 className="text-sm font-bold text-white">Scenario Control Sliders</h3>

          <div className="space-y-4 text-xs">
            {/* Income Shift */}
            <div>
              <div className="flex justify-between font-medium text-gray-300 mb-1">
                <span>Income Change:</span>
                <span className={incomePct >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {incomePct > 0 ? `+${incomePct}%` : `${incomePct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-40"
                max="50"
                step="5"
                value={incomePct}
                onChange={(e) => setIncomePct(e.target.value)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Expense Shift */}
            <div>
              <div className="flex justify-between font-medium text-gray-300 mb-1">
                <span>Expense Change:</span>
                <span className={expensePct > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {expensePct > 0 ? `+${expensePct}%` : `${expensePct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                step="5"
                value={expensePct}
                onChange={(e) => setExpensePct(e.target.value)}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* New Monthly EMI */}
            <div>
              <label className="block text-gray-400 mb-1">Add New Monthly EMI (₹)</label>
              <input
                type="number"
                step="500"
                placeholder="0"
                value={newEmi}
                onChange={(e) => setNewEmi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* One-time Purchase Cash Outflow */}
            <div>
              <label className="block text-gray-400 mb-1">One-Time Cash Outflow (₹)</label>
              <input
                type="number"
                step="1000"
                placeholder="0"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => {
                setIncomePct(0);
                setExpensePct(0);
                setNewEmi(0);
                setPurchaseAmount(0);
              }}
              className="w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-xs transition"
            >
              Reset Simulation Sliders
            </button>
          </div>
        </div>

        {/* Before vs After Comparison Matrix */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-5">
          {simulation ? (
            <div className="space-y-6">
              
              {/* Header Status */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-sm font-bold text-white">Simulated Financial Shift</h3>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-400">Health Score Change:</span>
                  <span className={`font-extrabold px-2.5 py-0.5 rounded-full ${
                    simulation.deltas.health_score_delta >= 0
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {simulation.deltas.health_score_delta >= 0 ? `+${simulation.deltas.health_score_delta}` : simulation.deltas.health_score_delta} Pts
                  </span>
                </div>
              </div>

              {/* Side by Side Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* BEFORE CARD */}
                <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Baseline (Current)</span>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-400">Monthly Income:</span>
                    <span className="font-bold text-white">₹{simulation.before.income?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Expenses:</span>
                    <span className="font-bold text-gray-300">₹{simulation.before.expenses?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Surplus:</span>
                    <span className="font-bold text-teal-400">₹{simulation.before.surplus?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-2 font-bold">
                    <span className="text-gray-300">Health Score:</span>
                    <span className="text-emerald-400">{simulation.before.health_score}/100 ({simulation.before.health_grade})</span>
                  </div>
                </div>

                {/* AFTER CARD */}
                <div className="p-4 rounded-xl bg-gray-900/80 border border-emerald-500/30 space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Simulated Outcome</span>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-400">Monthly Income:</span>
                    <span className="font-bold text-white">₹{simulation.after.income?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Expenses:</span>
                    <span className="font-bold text-gray-300">₹{simulation.after.expenses?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Surplus:</span>
                    <span className="font-bold text-teal-300">₹{simulation.after.surplus?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-2 font-bold">
                    <span className="text-gray-300">Health Score:</span>
                    <span className="text-emerald-300">{simulation.after.health_score}/100 ({simulation.after.health_grade})</span>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex justify-center items-center min-h-[250px]">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
