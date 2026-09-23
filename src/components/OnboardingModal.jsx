import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import { X, Sparkles, User, ShieldCheck } from 'lucide-react';

export default function OnboardingModal() {
  const { showOnboarding, setShowOnboarding, refreshData } = useUser();

  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('Delivery Partner');
  const [incomeSource, setIncomeSource] = useState('Gig Platform Payouts');
  const [avgDailyIncome, setAvgDailyIncome] = useState('1000');
  const [incomeFreq, setIncomeFreq] = useState('Daily');
  const [essentialExpenses, setEssentialExpenses] = useState('16000');
  const [workExpenses, setWorkExpenses] = useState('4000');
  const [existingEmi, setExistingEmi] = useState('2000');
  const [currentSavings, setCurrentSavings] = useState('18000');
  const [emergencyTarget, setEmergencyTarget] = useState('30000');
  const [riskPref, setRiskPref] = useState('Conservative');
  const [goalName, setGoalName] = useState('Emergency Reserve');
  const [goalTarget, setGoalTarget] = useState('30000');

  const [loading, setLoading] = useState(false);

  if (!showOnboarding) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.submitOnboarding({
        name,
        occupation,
        income_source: incomeSource,
        average_daily_income: parseFloat(avgDailyIncome),
        income_frequency: incomeFreq,
        monthly_essential_expenses: parseFloat(essentialExpenses),
        work_related_expenses: parseFloat(workExpenses),
        existing_emi: parseFloat(existingEmi),
        current_savings: parseFloat(currentSavings),
        emergency_fund_target: parseFloat(emergencyTarget),
        risk_preference: riskPref,
        goal_name: goalName,
        goal_target: parseFloat(goalTarget)
      });
      setShowOnboarding(false);
      await refreshData();
    } catch (err) {
      console.error("Onboarding error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel p-6 rounded-2xl max-w-xl w-full my-8 border border-gray-700 bg-gray-900 space-y-4">
        
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">GigWorker Financial Onboarding</h3>
          </div>
          <button onClick={() => setShowOnboarding(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Occupation</label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Delivery Partner">Delivery Partner (Zomato/Swiggy/Zepto)</option>
                <option value="Ride-hailing Driver">Ride-hailing Driver (Uber/Ola/Rapido)</option>
                <option value="Freelancer">Freelancer / Independent Contractor</option>
                <option value="Other Gig Worker">Other Gig Worker</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 mb-1">Average Daily Income (₹)</label>
              <input
                type="number"
                required
                value={avgDailyIncome}
                onChange={(e) => setAvgDailyIncome(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Monthly Essential Living Expenses (₹)</label>
              <input
                type="number"
                required
                value={essentialExpenses}
                onChange={(e) => setEssentialExpenses(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-400 mb-1">Work Expenses (₹)</label>
              <input
                type="number"
                value={workExpenses}
                onChange={(e) => setWorkExpenses(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Existing EMI (₹)</label>
              <input
                type="number"
                value={existingEmi}
                onChange={(e) => setExistingEmi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Current Savings (₹)</label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 mb-1">Risk Preference</label>
              <select
                value={riskPref}
                onChange={(e) => setRiskPref(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Conservative">Conservative (Capital Safety First)</option>
                <option value="Moderate">Moderate (Balanced Surplus Growth)</option>
                <option value="Growth-oriented">Growth-oriented (Educational Focus)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Emergency Fund Target (₹)</label>
              <input
                type="number"
                value={emergencyTarget}
                onChange={(e) => setEmergencyTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <p className="text-[10px] text-gray-400 italic pt-1">
            Note: We do not ask for bank passwords, UPI PINs, or card PINs. All data remains local and synthetic.
          </p>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setShowOnboarding(false)}
              className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md"
            >
              {loading ? 'Creating Profile...' : 'Save Financial Profile'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
