import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Sparkles, Zap, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = ({ currentView, setCurrentView }) => {
  const { credits } = useApp();

  return (
    <header className="glass-effect border-b border-white/20">
      <div className="container mx-auto px-6 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">AdSparkr</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setCurrentView('create')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  currentView === 'create'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Create Ads</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-white font-medium">{credits} credits</span>
            </div>
            
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};