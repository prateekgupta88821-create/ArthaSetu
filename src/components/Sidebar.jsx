import React from 'react';
import { useUser } from '../context/UserContext';
import {
  LayoutDashboard, TrendingUp, CreditCard, PiggyBank, Target,
  ShieldCheck, Calculator, Smartphone, Bike, Sliders, CalendarRange,
  FileCheck2, Bot
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useUser();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'income', label: 'Income Analyzer', icon: TrendingUp },
    { id: 'expenses', label: 'Expense Tracker', icon: CreditCard },
    { id: 'savings', label: 'Smart Savings & Reserve', icon: PiggyBank },
    { id: 'goals', label: 'Goal Planner', icon: Target },
    { id: 'investing', label: 'Conservative Investing', icon: ShieldCheck },
    { id: 'affordability', label: 'Can I Afford It?', icon: Calculator },
    { id: 'gadgets', label: 'Gadget Advisor', icon: Smartphone },
    { id: 'vehicles', label: 'Vehicle Planner (EV)', icon: Bike },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'forecast', label: 'Cash-Flow Forecast', icon: CalendarRange },
    { id: 'tax', label: 'Tax Assistant', icon: FileCheck2 },
    { id: 'copilot', label: 'AI Financial Copilot', icon: Bot, badge: 'AI' }
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0b0f19] border-r border-gray-800/80 p-4 shrink-0">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Financial Navigation
        </p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10 font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
