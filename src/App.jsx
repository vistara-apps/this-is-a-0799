import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AdCreator } from './components/AdCreator';
import { GrowthAgent } from './components/GrowthAgent';
import { SocialConnect } from './components/ui/SocialConnect';
import { AppProvider } from './context/AppContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;
      case 'create':
        return <AdCreator setCurrentView={setCurrentView} />;
      case 'analytics':
        return <GrowthAgent />;
      case 'social':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">Social Media Management</h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Connect your social accounts and manage your ad posting campaigns.
              </p>
            </div>
            <SocialConnect />
          </div>
        );
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen gradient-bg">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main className="container mx-auto px-6 py-8 max-w-6xl">
          {renderCurrentView()}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
