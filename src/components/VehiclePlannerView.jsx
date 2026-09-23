import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bike, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VehiclePlannerView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const res = await api.getVehicles();
        setData(res);
      } catch (err) {
        console.error("Vehicles fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { petrol_scooter, ev_scooter, monthly_ev_savings, three_year_ev_savings, recommendation } = data;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Bike className="w-5 h-5 text-cyan-400" />
          <span>Vehicle Affordability & Petrol vs EV Cost Planner</span>
        </h2>
        <p className="text-xs text-gray-400">
          Calculates total monthly cost of ownership (TCO) including EMI, fuel/energy, maintenance, insurance, and cost-per-kilometer.
        </p>
      </div>

      {/* EV Savings Highlight Banner */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-gray-900 to-emerald-950/30 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">EV Electric Advantage</span>
          </div>
          <p className="text-2xl font-extrabold text-white">
            Save ₹{monthly_ev_savings?.toLocaleString()}/month by switching to EV
          </p>
          <p className="text-xs text-gray-300">
            {recommendation}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-right text-xs">
          <span className="text-gray-400">Estimated 3-Year Savings</span>
          <p className="text-xl font-extrabold text-emerald-400">₹{three_year_ev_savings?.toLocaleString()}</p>
        </div>
      </div>

      {/* Side-by-side Petrol vs EV Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Petrol Scooter Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-gray-800">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Bike className="w-4 h-4 text-rose-400" />
              <span>{petrol_scooter.vehicle_type}</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400">
              Petrol Fueled
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Vehicle Price:</span>
              <span className="font-bold text-white">₹{petrol_scooter.vehicle_price?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Monthly EMI:</span>
              <span className="font-bold text-white">₹{petrol_scooter.monthly_emi?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Monthly Fuel Cost ({petrol_scooter.monthly_distance_km}km):</span>
              <span className="font-bold text-rose-400">₹{petrol_scooter.monthly_fuel_cost?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Maintenance & Insurance:</span>
              <span className="text-gray-300">₹{(petrol_scooter.monthly_maintenance + petrol_scooter.monthly_insurance)?.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-sm">
              <span className="text-gray-200">Total Monthly TCO:</span>
              <span className="text-rose-400">₹{petrol_scooter.total_monthly_cost?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="text-gray-400">Cost per kilometer:</span>
              <span className="font-bold text-rose-300">₹{petrol_scooter.cost_per_km}/km</span>
            </div>
          </div>
        </div>

        {/* EV Scooter Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-cyan-500/30 bg-cyan-950/10">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{ev_scooter.vehicle_type}</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
              Electric Smart Choice
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Vehicle Price:</span>
              <span className="font-bold text-white">₹{ev_scooter.vehicle_price?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Monthly EMI:</span>
              <span className="font-bold text-white">₹{ev_scooter.monthly_emi?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Monthly Electricity Cost ({ev_scooter.monthly_distance_km}km):</span>
              <span className="font-bold text-cyan-400">₹{ev_scooter.monthly_fuel_cost?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Maintenance & Insurance:</span>
              <span className="text-gray-300">₹{(ev_scooter.monthly_maintenance + ev_scooter.monthly_insurance)?.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-sm">
              <span className="text-gray-200">Total Monthly TCO:</span>
              <span className="text-cyan-400">₹{ev_scooter.total_monthly_cost?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="text-gray-400">Cost per kilometer:</span>
              <span className="font-bold text-cyan-300">₹{ev_scooter.cost_per_km}/km</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
