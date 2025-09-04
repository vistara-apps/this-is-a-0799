import React from 'react';
import { Download, Share2, Instagram, Play } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export const AdPreview = ({ ad, variant = 'large' }) => {
  const handleDownload = () => {
    // Create a download link for the image
    const link = document.createElement('a');
    link.href = ad.imageUrl;
    link.download = `ad-${ad.creativeId}.jpg`;
    link.click();
  };

  const formatIcon = {
    'instagram-post': <Instagram className="w-4 h-4" />,
    'instagram-story': <Instagram className="w-4 h-4" />,
    'tiktok-post': <Play className="w-4 h-4" />
  };

  return (
    <Card className={`space-y-4 ${variant === 'small' ? 'p-4' : 'p-6'}`}>
      {/* Format indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-white/60 text-sm">
          {formatIcon[ad.format]}
          <span className="capitalize">{ad.format.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-white/60" />
          </button>
          <button
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Image preview */}
      <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
        <img 
          src={ad.imageUrl} 
          alt="Ad creative"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Ad copy */}
      <div className="space-y-2">
        <h4 className="font-semibold text-white">{ad.adCopy.headline}</h4>
        <p className="text-white/80 text-sm">{ad.adCopy.description}</p>
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full">
          {ad.adCopy.cta}
        </div>
      </div>

      {/* Performance metrics (if any) */}
      {ad.performanceMetrics && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
          <div className="text-center">
            <div className="text-white font-medium">{ad.performanceMetrics.impressions}</div>
            <div className="text-white/60 text-xs">Impressions</div>
          </div>
          <div className="text-center">
            <div className="text-white font-medium">{ad.performanceMetrics.clicks}</div>
            <div className="text-white/60 text-xs">Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-white font-medium">{ad.performanceMetrics.conversions}</div>
            <div className="text-white/60 text-xs">Conversions</div>
          </div>
        </div>
      )}
    </Card>
  );
};