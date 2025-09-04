import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Sparkles, Zap, BarChart3, TrendingUp, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = ({ currentView, setCurrentView }) => {
  const { credits } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3
    },
    {
      id: 'create',
      label: 'Create Ads',
      icon: Zap
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp
    },
    {
      id: 'social',
      label: 'Social Media',
      icon: Share2
    }
  ];

  return (
    <header className="glass-effect border-b border-white/20">
      <div className="container mx-auto px-6 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setCurrentView('dashboard')}
            >
              <Sparkles className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">AdSparkr</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      currentView === item.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
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
