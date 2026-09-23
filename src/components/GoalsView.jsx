import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Target, Plus, CheckCircle, Clock } from 'lucide-react';

export default function GoalsView() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Goal State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('2027-06-30');
  const [category, setCategory] = useState('Gadget');

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.getGoals();
      setGoals(res);
    } catch (err) {
      console.error("Goals fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!name || !targetAmount || parseFloat(targetAmount) <= 0) return;
    try {
      await api.addGoal({
        name,
        target_amount: parseFloat(targetAmount),
        current_amount: parseFloat(currentAmount || 0),
        deadline,
        category
      });
      setShowAddModal(false);
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      await fetchGoals();
    } catch (err) {
      console.error("Failed to add goal:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span>Financial Goal Planner</span>
          </h2>
          <p className="text-xs text-gray-400">
            Set and track savings milestones for work equipment, gadgets, vehicles, and safety reserves.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((g, idx) => {
          const progress = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100));
          const remaining = max(0, g.target_amount - g.current_amount);
          
          return (
            <div key={idx} className="glass-panel p-5 rounded-2xl space-y-3.5 border border-gray-800 hover:border-indigo-500/30 transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {g.category || 'Goal'}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5">{g.name}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-300">{progress}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                  <span>Saved: <strong className="text-white">₹{g.current_amount?.toLocaleString()}</strong></span>
                  <span>Target: <strong className="text-gray-300">₹{g.target_amount?.toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Deadline & Remaining */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-800/80 pt-2.5">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  Target: {g.deadline}
                </span>
                <span className="text-indigo-400 font-medium">
                  Gap: ₹{remaining.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4 border border-gray-700 bg-gray-900">
            <h3 className="text-base font-bold text-white">Set New Goal</h3>
            <form onSubmit={handleAddGoal} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Laptop"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 45000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Currently Saved (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Gadget">Gadget (Phone, Laptop, Tablet)</option>
                  <option value="Vehicle">Vehicle Upgrade (Motorcycle, EV)</option>
                  <option value="Emergency">Emergency Reserve</option>
                  <option value="Education">Education & Skills</option>
                  <option value="Business Equipment">Business Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
                />
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function max(a, b) {
  return a > b ? a : b;
}
