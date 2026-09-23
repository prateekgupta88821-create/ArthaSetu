import React from 'react';
import { useUser } from '../context/UserContext';
import {
  TrendingUp, CreditCard, ShieldCheck, PiggyBank, ArrowUpRight,
  PlusCircle, MinusCircle, Calculator, Bike, Smartphone, Bot,
  AlertCircle, CheckCircle2, Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell
} from 'recharts';

export default function DashboardView() {
  const { dashboardData, loading, setActiveTab, triggerCopilotQuestion } = useUser();

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400">Loading GigWealth Financial Engine...</p>
        </div>
      </div>
    );
  }

  const {
    user_name,
    occupation,
    income,
    expenses,
    savings_and_emergency,
    financial_health,
    latest_insights
  } = dashboardData;

  // Chart data setup
  const expensePieData = [
    { name: 'Essential', value: expenses.essential_expenses, color: '#10b981' },
    { name: 'Work', value: expenses.work_expenses, color: '#0ea5e9' },
    { name: 'Financial/EMI', value: expenses.financial_expenses, color: '#f59e0b' },
    { name: 'Discretionary', value: expenses.discretionary_expenses, color: '#ec4899' }
  ].filter(d => d.value > 0);

  const incomeComparisonData = [
    { name: 'Lowest', amount: income.typical_range[0] },
    { name: 'Average', amount: income.average_monthly_income },
    { name: 'Current', amount: income.current_month_income },
    { name: 'Highest', amount: income.typical_range[1] }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome & Persona Banner */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-emerald-950/30 border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">Welcome back, {user_name}!</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {occupation}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Typical earnings range: <span className="text-emerald-400 font-semibold">₹{income.typical_range[0]?.toLocaleString()} – ₹{income.typical_range[1]?.toLocaleString()}</span>/month. Stability Score: <span className="text-gray-200 font-medium">{income.stability_score}/100</span>
          </p>
        </div>

        {/* Financial Health Score Widget */}
        <div className="flex items-center space-x-4 bg-gray-900/90 border border-gray-800 p-3.5 rounded-xl">
          <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-gray-800 border-2 border-emerald-500/80">
            <span className="text-lg font-extrabold text-emerald-400">{financial_health.score}</span>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Financial Health</p>
            <p className="text-sm font-bold text-white">{financial_health.grade}</p>
            <button
              onClick={() => setActiveTab('health')}
              className="text-[11px] text-emerald-400 hover:underline flex items-center mt-0.5"
            >
              View Diagnosis <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          <button
            onClick={() => setActiveTab('income')}
            className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1.5 hover:border-emerald-500/40 transition group"
          >
            <PlusCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
            <span className="text-[11px] font-semibold text-gray-200">Add Income</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1.5 hover:border-rose-500/40 transition group"
          >
            <MinusCircle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition" />
            <span className="text-[11px] font-semibold text-gray-200">Add Expense</span>
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1.5 hover:border-teal-500/40 transition group"
          >
            <PiggyBank className="w-5 h-5 text-teal-400 group-hover:scale-110 transition" />
            <span className="text-[11px] font-semibold text-gray-200">Save Money</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1.5 hover:border-indigo-500/40 transition group"
          >
            <ShieldCheck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition" />
            <span className="text-[11px] font-semibold text-gray-200">Set Goal</span>
          </button>

          <button
            onClick={() => setActiveTab('affordability')}
            className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1.5 hover:border-amber-500/40 transition group"
          >
            <Calculator className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
            <span className="text-[11px] font-semibold text-gray-200">Can I Afford?</span>
          </button>

          <button
            onClick={() => setActiveTab('gadgets')}
            className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1.5 hover:border-purple-500/40 transition group"
          >
            <Smartphone className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
            <span className="text-[11px] font-semibold text-gray-200">Gadget Advisor</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1.5 hover:border-cyan-500/40 transition group"
          >
            <Bike className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
            <span className="text-[11px] font-semibold text-gray-200">Vehicle Planner</span>
          </button>

          <button
            onClick={() => triggerCopilotQuestion('How much should I save this month?')}
            className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1.5 hover:border-emerald-400 transition group bg-emerald-950/20"
          >
            <Bot className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
            <span className="text-[11px] font-semibold text-emerald-300">Ask AI</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Monthly Income Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase">Avg Monthly Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            ₹{income.average_monthly_income?.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400">
            Stability: <span className="text-emerald-400 font-medium">{income.stability_score}/100</span> ({income.trend})
          </p>
        </div>

        {/* Total Expenses Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase">Monthly Expenses</span>
            <CreditCard className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            ₹{expenses.total_expenses?.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400">
            Essential: ₹{expenses.essential_expenses?.toLocaleString()} | Work: ₹{expenses.work_expenses?.toLocaleString()}
          </p>
        </div>

        {/* Available Surplus Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase">Available Surplus</span>
            <PiggyBank className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-teal-300">
            ₹{savings_and_emergency.available_surplus?.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400">
            Recommended Savings: <span className="text-teal-400 font-semibold">₹{savings_and_emergency.recommended_savings?.toLocaleString()}</span>
          </p>
        </div>

        {/* Emergency Reserve Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase">Emergency Reserve</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            ₹{savings_and_emergency.current_savings?.toLocaleString()}
          </p>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden mt-1">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, savings_and_emergency.emergency_progress_pct)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-400">
            Target: ₹{savings_and_emergency.emergency_target?.toLocaleString()} ({savings_and_emergency.emergency_progress_pct}%)
          </p>
        </div>

      </div>

      {/* Charts & Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Spending Distribution Pie Chart */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Monthly Spending Breakdown</span>
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {expensePieData.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-300">{item.name}:</span>
                <span className="font-semibold text-white">₹{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Income Range Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Income Volatility Spectrum</span>
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeComparisonData}>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} tickLine={false} />
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-gray-400">
            Needs vs Wants Ratio: <span className="text-emerald-400 font-semibold">{expenses.needs_vs_wants.needs_percentage}% Needs</span> vs <span className="text-rose-400 font-semibold">{expenses.needs_vs_wants.wants_percentage}% Wants</span>
          </p>
        </div>

        {/* Data-Grounded AI Insights List */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Grounded Financial Insights</span>
            </h3>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Auto-Calculated</span>
          </div>

          <div className="space-y-2.5">
            {latest_insights.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 text-xs space-y-1"
              >
                <div className="flex items-center space-x-2">
                  {item.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {item.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  {item.type === 'alert' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  <span className="font-semibold text-gray-200">{item.title}</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed pl-5">
                  {item.message}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => triggerCopilotQuestion('Explain my top financial insight in detail')}
            className="w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-medium text-emerald-300 transition flex items-center justify-center space-x-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Discuss Insights with AI Copilot</span>
          </button>
        </div>

      </div>

    </div>
  );
}
