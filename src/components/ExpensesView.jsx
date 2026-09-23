import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import { CreditCard, Plus, Trash2, Search, Filter } from 'lucide-react';

export default function ExpensesView() {
  const { refreshData } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Expense Form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [group, setGroup] = useState('Essential');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.getExpenses();
      setData(res);
    } catch (err) {
      console.error("Expenses fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount || parseFloat(amount) <= 0) return;
    try {
      await api.addExpense({
        title,
        amount: parseFloat(amount),
        category,
        group,
        date: new Date().toISOString().split('T')[0],
        notes: ""
      });
      setShowAddModal(false);
      setTitle('');
      setAmount('');
      await fetchExpenses();
      await refreshData();
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  const handleDeleteExpense = async (index) => {
    try {
      await api.deleteExpense(index);
      await fetchExpenses();
      await refreshData();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { analysis, expenses } = data;

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'All' || exp.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-rose-400" />
            <span>Expense Management & Needs vs Wants</span>
          </h2>
          <p className="text-xs text-gray-400">
            Total Monthly Spend: <span className="text-rose-400 font-bold">₹{analysis.total_expenses?.toLocaleString()}</span> ({analysis.expense_ratio_pct}% of average earnings)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Subtotal Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-emerald-500 space-y-1">
          <p className="text-[11px] uppercase font-bold text-gray-400">Essential Living</p>
          <p className="text-lg font-extrabold text-white">₹{analysis.essential_expenses?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">Rent, Groceries, Healthcare</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-sky-500 space-y-1">
          <p className="text-[11px] uppercase font-bold text-gray-400">Work & Vehicle</p>
          <p className="text-lg font-extrabold text-sky-400">₹{analysis.work_expenses?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">Fuel, Oil, Data, Platform Fees</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-amber-500 space-y-1">
          <p className="text-[11px] uppercase font-bold text-gray-400">Financial EMIs</p>
          <p className="text-lg font-extrabold text-amber-400">₹{analysis.financial_expenses?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">Vehicle / Gadget Loans</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-pink-500 space-y-1">
          <p className="text-[11px] uppercase font-bold text-gray-400">Discretionary</p>
          <p className="text-lg font-extrabold text-pink-400">₹{analysis.discretionary_expenses?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">Shopping & Dining Out</p>
        </div>
      </div>

      {/* Search & Group Filter Bar */}
      <div className="glass-panel p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search expense title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center space-x-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
          {['All', 'Essential', 'Work', 'Financial', 'Discretionary'].map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1 rounded-lg transition ${
                selectedGroup === grp
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Expense List Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-900/90 text-gray-400 font-semibold uppercase text-[10px] border-b border-gray-800">
            <tr>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Group</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {filteredExpenses.map((exp, idx) => (
              <tr key={idx} className="hover:bg-gray-800/40 transition">
                <td className="py-3 px-4 font-semibold text-white">{exp.title}</td>
                <td className="py-3 px-4">{exp.category}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    exp.group === 'Essential' ? 'bg-emerald-500/10 text-emerald-400' :
                    exp.group === 'Work' ? 'bg-sky-500/10 text-sky-400' :
                    exp.group === 'Financial' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-pink-500/10 text-pink-400'
                  }`}>
                    {exp.group}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400">{exp.date}</td>
                <td className="py-3 px-4 text-right font-bold text-white">₹{exp.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDeleteExpense(idx)}
                    className="p-1 text-gray-400 hover:text-rose-400 transition"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4 border border-gray-700 bg-gray-900">
            <h3 className="text-base font-bold text-white">Record New Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bike Petrol"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Group classification</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Essential">Essential Living (Rent, Food, Utilities)</option>
                  <option value="Work">Work & Vehicle (Fuel, Maintenance, Data)</option>
                  <option value="Financial">Financial Obligation (EMI, Loan)</option>
                  <option value="Discretionary">Discretionary (Shopping, Dining)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Rent">Rent</option>
                  <option value="Food">Food / Groceries</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Fuel">Fuel / Energy</option>
                  <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                  <option value="Mobile/Data">Mobile / Data</option>
                  <option value="EMI">EMI Loan</option>
                  <option value="Dining">Dining Out</option>
                  <option value="Shopping">Shopping</option>
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
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
