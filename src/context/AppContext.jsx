import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [credits, setCredits] = useState(3); // Free tier: 3 ad sets
  const [loading, setLoading] = useState(false);

  // Initialize user data
  useEffect(() => {
    // Simulate user session
    setUser({
      userId: 'user-123',
      email: 'user@example.com',
      stripeCustomerId: null,
      connectedSocialAccounts: []
    });
  }, []);

  const addCampaign = (campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
  };

  const updateCampaign = (campaignId, updates) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.campaignId === campaignId 
          ? { ...campaign, ...updates }
          : campaign
      )
    );
  };

  const useCredits = (amount = 1) => {
    if (credits >= amount) {
      setCredits(prev => prev - amount);
      return true;
    }
    return false;
  };

  const addCredits = (amount) => {
    setCredits(prev => prev + amount);
  };

  const value = {
    user,
    setUser,
    campaigns,
    setCampaigns,
    addCampaign,
    updateCampaign,
    credits,
    setCredits,
    useCredits,
    addCredits,
    loading,
    setLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};