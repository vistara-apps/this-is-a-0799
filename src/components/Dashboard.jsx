import React from 'react';
import { Plus, TrendingUp, Eye, MousePointer, Calendar } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useApp } from '../context/AppContext';

export const Dashboard = ({ setCurrentView }) => {
  const { campaigns, credits } = useApp();

  const stats = [
    {
      label: 'Total Campaigns',
      value: campaigns.length,
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      label: 'Total Impressions',
      value: '12.4K',
      icon: <Eye className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      label: 'Click Rate',
      value: '3.2%',
      icon: <MousePointer className="w-5 h-5" />,
      color: 'text-purple-400'
    },
    {
      label: 'Performance',
      value: '+12%',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-white">
          Welcome to AdSparkr
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Effortlessly spin up and test social ad creatives that convert.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center p-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-white/60 text-sm">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Create New Campaign</h3>
            <p className="text-white/60">
              Upload a product image and generate multiple ad variations in seconds
            </p>
            <Button 
              onClick={() => setCurrentView('create')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Start Creating
            </Button>
          </div>
        </Card>

        <Card className="p-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Recent Campaigns</h3>
            {campaigns.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No campaigns yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.campaignId} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <img 
                        src={campaign.productImage} 
                        alt="Product" 
                        className="w-8 h-8 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Campaign #{campaign.campaignId.slice(-4)}</div>
                      <div className="text-white/60 text-sm">{campaign.generatedCreatives.length} creatives</div>
                    </div>
                    <div className="text-white/60 text-sm">
                      {new Date(campaign.creationTimestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Credits Info */}
      <Card className="p-6 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Your Credits</h3>
            <p className="text-white/80">You have {credits} ad generation credits remaining</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-300">{credits}</div>
            <div className="text-white/60 text-sm">Credits</div>
          </div>
        </div>
      </Card>
    </div>
  );
};