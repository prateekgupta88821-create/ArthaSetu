import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPersonaKey, setCurrentPersonaKey] = useState('rahul');
  const [personas, setPersonas] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSnapshot, setShowSnapshot] = useState(false);

  // Copilot quick prompt preset state
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');

  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Unable to connect to backend engine. Please check if Python server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const list = await api.getPersonas();
        setPersonas(list);
      } catch (e) {
        console.warn("Could not fetch personas list");
      }
      await refreshData();
    };
    init();
  }, []);

  const handleSwitchPersona = async (key) => {
    try {
      setLoading(true);
      await api.switchPersona(key);
      setCurrentPersonaKey(key);
      await refreshData();
    } catch (err) {
      console.error("Failed to switch persona:", err);
    }
  };

  const handleResetData = async () => {
    try {
      setLoading(true);
      await api.resetPersona();
      await refreshData();
    } catch (err) {
      console.error("Failed to reset persona data:", err);
    }
  };

  const triggerCopilotQuestion = (query) => {
    setCopilotInitialQuery(query);
    setActiveTab('copilot');
  };

  return (
    <UserContext.Provider value={{
      activeTab,
      setActiveTab,
      currentPersonaKey,
      personas,
      dashboardData,
      loading,
      error,
      refreshData,
      handleSwitchPersona,
      handleResetData,
      showOnboarding,
      setShowOnboarding,
      showSnapshot,
      setShowSnapshot,
      copilotInitialQuery,
      setCopilotInitialQuery,
      triggerCopilotQuestion
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
