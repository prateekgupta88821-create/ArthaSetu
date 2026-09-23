import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileCheck2, Info, CheckSquare, AlertCircle } from 'lucide-react';

export default function TaxAssistantView() {
  const [taxData, setTaxData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTax = async () => {
      try {
        setLoading(true);
        const res = await api.getTax();
        setTaxData(res);
      } catch (err) {
        console.error("Tax fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTax();
  }, []);

  if (loading || !taxData) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const {
    occupation,
    annual_gross_income_estimate,
    total_annual_work_deductions,
    estimated_net_taxable_base,
    deductible_expenses_breakdown,
    tax_checklist,
    disclaimer
  } = taxData;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <FileCheck2 className="w-5 h-5 text-emerald-400" />
          <span>Tax Organization & Deductible Expense Assistant</span>
        </h2>
        <p className="text-xs text-gray-400">
          Tracks deductible operational work costs (fuel, vehicle service, data packs) to organize your annual tax filing.
        </p>
      </div>

      {/* Tax Summary Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <span className="text-[11px] uppercase font-bold text-gray-400">Annual Gross Income Est.</span>
          <p className="text-2xl font-extrabold text-white">₹{annual_gross_income_estimate?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">Based on monthly average payouts</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1 border border-emerald-500/30 bg-emerald-950/20">
          <span className="text-[11px] uppercase font-bold text-emerald-400">Work Expense Deductions</span>
          <p className="text-2xl font-extrabold text-emerald-300">₹{total_annual_work_deductions?.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400/80">Fuel, maintenance & equipment</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <span className="text-[11px] uppercase font-bold text-gray-400">Net Taxable Baseline Est.</span>
          <p className="text-2xl font-extrabold text-teal-300">₹{estimated_net_taxable_base?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">After work-related deductions</p>
        </div>
      </div>

      {/* Deductible Items List */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-white">Eligible Work-Related Deductible Expenses</h3>
        <div className="space-y-2 text-xs">
          {deductible_expenses_breakdown.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{item.title} ({item.category})</p>
                <p className="text-gray-400 text-[11px]">{item.deductible_reason}</p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-emerald-400 text-sm">₹{item.annual_deductible?.toLocaleString()}</span>
                <span className="block text-[10px] text-gray-400">₹{item.monthly_amount?.toLocaleString()}/mo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Checklist Reminders */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <span>Gig Worker Tax Filing Checklist</span>
        </h3>
        <ul className="space-y-2 text-xs text-gray-300">
          {tax_checklist.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2.5 bg-gray-900/60 p-2.5 rounded-xl border border-gray-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 flex items-start space-x-2.5">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Disclaimer:</strong> {disclaimer}
        </p>
      </div>

    </div>
  );
}
