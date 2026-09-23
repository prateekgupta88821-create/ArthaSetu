import React from 'react';
import { useUser } from '../context/UserContext';
import { Sparkles, RefreshCw, UserCheck, FileSpreadsheet, Layers, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const {
    currentPersonaKey,
    personas,
    handleSwitchPersona,
    handleResetData,
    setShowOnboarding,
    setShowSnapshot,
    dashboardData
  } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-800/80 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Brand & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-emerald-400 bg-clip-text text-transparent">
                GigWealth AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Hackathon Demo
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Earn Irregularly. Plan Intelligently. Spend Confidently.
            </p>
          </div>
        </div>

        {/* Persona Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Persona selector */}
          <div className="relative flex items-center bg-gray-900/90 border border-gray-800 rounded-xl px-2.5 py-1.5 text-xs text-gray-300">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span className="text-gray-400 mr-1 hidden sm:inline">Persona:</span>
            <select
              value={currentPersonaKey}
              onChange={(e) => handleSwitchPersona(e.target.value)}
              className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer pr-4"
            >
              {personas.map((p) => (
                <option key={p.key} value={p.key} className="bg-gray-900 text-gray-200">
                  {p.name} ({p.occupation})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Onboarding Modal */}
          <button
            onClick={() => setShowOnboarding(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 border border-gray-700 transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Onboarding</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={handleResetData}
            title="Reset Persona Demo Data"
            className="p-1.5 text-xs rounded-xl bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-gray-200 border border-gray-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Final Snapshot Modal Button */}
          <button
            onClick={() => setShowSnapshot(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition transform active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>GigWealth Snapshot</span>
          </button>

        </div>
      </div>
    </header>
  );
}
