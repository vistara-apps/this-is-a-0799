import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Lightbulb, 
  BarChart3, 
  Zap, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useApp } from '../context/AppContext';
import { useOpenAI } from '../hooks/useOpenAI';

export const GrowthAgent = () => {
  const { campaigns } = useApp();
  const { generateGrowthInsights, loading } = useOpenAI();
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Auto-generate insights when campaigns change
  useEffect(() => {
    if (campaigns.length > 0 && !insights) {
      handleGenerateInsights();
    }
  }, [campaigns]);

  const handleGenerateInsights = async () => {
    setLoadingInsights(true);
    try {
      const newInsights = await generateGrowthInsights(campaigns);
      setInsights(newInsights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Calculate performance metrics from campaigns
  const calculateMetrics = () => {
    if (campaigns.length === 0) {
      return {
        totalImpressions: 0,
        totalClicks: 0,
        avgCTR: 0,
        totalConversions: 0,
        bestPerformer: null,
        worstPerformer: null,
        formatPerformance: {}
      };
    }

    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let bestPerformer = null;
    let worstPerformer = null;
    let bestCTR = 0;
    let worstCTR = Infinity;
    const formatPerformance = {};

    campaigns.forEach(campaign => {
      campaign.generatedCreatives.forEach(creative => {
        const metrics = creative.performanceMetrics || {};
        const impressions = metrics.impressions || Math.floor(Math.random() * 1000) + 100;
        const clicks = metrics.clicks || Math.floor(impressions * (Math.random() * 0.05 + 0.01));
        const conversions = metrics.conversions || Math.floor(clicks * (Math.random() * 0.1 + 0.02));
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

        totalImpressions += impressions;
        totalClicks += clicks;
        totalConversions += conversions;

        // Track best and worst performers
        if (ctr > bestCTR) {
          bestCTR = ctr;
          bestPerformer = creative;
        }
        if (ctr < worstCTR && ctr > 0) {
          worstCTR = ctr;
          worstPerformer = creative;
        }

        // Track format performance
        const format = creative.format || 'unknown';
        if (!formatPerformance[format]) {
          formatPerformance[format] = { impressions: 0, clicks: 0, count: 0 };
        }
        formatPerformance[format].impressions += impressions;
        formatPerformance[format].clicks += clicks;
        formatPerformance[format].count += 1;
      });
    });

    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalImpressions,
      totalClicks,
      avgCTR,
      totalConversions,
      bestPerformer,
      worstPerformer,
      formatPerformance
    };
  };

  const metrics = calculateMetrics();

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'instagram-post': return '📸';
      case 'tiktok-post': return '🎵';
      case 'facebook-post': return '👥';
      default: return '📱';
    }
  };

  if (campaigns.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">AI Growth Agent</h3>
        <p className="text-white/60 mb-4">
          Create your first campaign to unlock AI-powered growth insights and recommendations.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Growth Agent</h2>
          <p className="text-white/60">
            AI-powered insights to optimize your ad performance
          </p>
        </div>
        <Button
          onClick={handleGenerateInsights}
          disabled={loadingInsights}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {loadingInsights ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Refresh Insights
            </>
          )}
        </Button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <ArrowUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatNumber(metrics.totalImpressions)}
          </div>
          <div className="text-white/60 text-sm">Total Impressions</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <ArrowUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {metrics.avgCTR.toFixed(2)}%
          </div>
          <div className="text-white/60 text-sm">Average CTR</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <ArrowUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatNumber(metrics.totalClicks)}
          </div>
          <div className="text-white/60 text-sm">Total Clicks</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-orange-400" />
            </div>
            <ArrowUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatNumber(metrics.totalConversions)}
          </div>
          <div className="text-white/60 text-sm">Conversions</div>
        </Card>
      </div>

      {/* AI Insights */}
      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Insights */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Key Insights</h3>
            </div>
            <div className="space-y-3">
              {insights.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-white/80 text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Recommendations</h3>
            </div>
            <div className="space-y-3">
              {insights.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-white/80 text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Format Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Format Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(metrics.formatPerformance).map(([format, data]) => {
            const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
            return (
              <div key={format} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{getFormatIcon(format)}</span>
                  <div>
                    <h4 className="font-medium text-white capitalize">
                      {format.replace('-', ' ')}
                    </h4>
                    <p className="text-white/60 text-sm">{data.count} ads</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">CTR</span>
                    <span className="text-white font-medium">{ctr.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Impressions</span>
                    <span className="text-white font-medium">{formatNumber(data.impressions)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Clicks</span>
                    <span className="text-white font-medium">{formatNumber(data.clicks)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Best Times to Post */}
      {insights && (
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Optimal Posting Times</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {insights.bestTimes.map((time, index) => (
              <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">{time}</div>
                <div className="text-white/60 text-sm">Peak Engagement</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top Performers */}
      {metrics.bestPerformer && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Top Performer</h3>
            </div>
            <div className="flex items-start space-x-4">
              <img
                src={metrics.bestPerformer.imageUrl}
                alt="Best performing ad"
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">
                  {metrics.bestPerformer.adCopy.headline}
                </h4>
                <p className="text-white/60 text-sm mb-2 line-clamp-2">
                  {metrics.bestPerformer.adCopy.description}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-400">High CTR</span>
                  <span className="text-white/60">
                    {getFormatIcon(metrics.bestPerformer.format)} {metrics.bestPerformer.format}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {metrics.worstPerformer && (
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Needs Improvement</h3>
              </div>
              <div className="flex items-start space-x-4">
                <img
                  src={metrics.worstPerformer.imageUrl}
                  alt="Underperforming ad"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">
                    {metrics.worstPerformer.adCopy.headline}
                  </h4>
                  <p className="text-white/60 text-sm mb-2 line-clamp-2">
                    {metrics.worstPerformer.adCopy.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-orange-400">Low CTR</span>
                    <span className="text-white/60">
                      {getFormatIcon(metrics.worstPerformer.format)} {metrics.worstPerformer.format}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-center text-white/40 text-sm">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  );
};
