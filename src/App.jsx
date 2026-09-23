import React from 'react';
import { UserProvider, useUser } from './context/UserContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import IncomeView from './components/IncomeView';
import ExpensesView from './components/ExpensesView';
import SavingsView from './components/SavingsView';
import GoalsView from './components/GoalsView';
import InvestingView from './components/InvestingView';
import AffordabilityView from './components/AffordabilityView';
import GadgetAdvisorView from './components/GadgetAdvisorView';
import VehiclePlannerView from './components/VehiclePlannerView';
import SimulatorView from './components/SimulatorView';
import ForecastView from './components/ForecastView';
import TaxAssistantView from './components/TaxAssistantView';
import AICopilotView from './components/AICopilotView';
import OnboardingModal from './components/OnboardingModal';
import SnapshotModal from './components/SnapshotModal';

function MainContent() {
  const { activeTab } = useUser();

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'income':
        return <IncomeView />;
      case 'expenses':
        return <ExpensesView />;
      case 'savings':
        return <SavingsView />;
      case 'goals':
        return <GoalsView />;
      case 'investing':
        return <InvestingView />;
      case 'affordability':
        return <AffordabilityView />;
      case 'gadgets':
        return <GadgetAdvisorView />;
      case 'vehicles':
        return <VehiclePlannerView />;
      case 'simulator':
        return <SimulatorView />;
      case 'forecast':
        return <ForecastView />;
      case 'tax':
        return <TaxAssistantView />;
      case 'copilot':
        return <AICopilotView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {renderTab()}
        </main>
      </div>

      <OnboardingModal />
      <SnapshotModal />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainContent />
    </UserProvider>
  );
}
