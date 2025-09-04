import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AdCreator } from './components/AdCreator';
import { AppProvider } from './context/AppContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <AppProvider>
      <div className="min-h-screen gradient-bg">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main className="container mx-auto px-6 py-8 max-w-6xl">
          {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
          {currentView === 'create' && <AdCreator setCurrentView={setCurrentView} />}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;