import React, { useState, useEffect } from 'react';
import { Instagram, Play, CheckCircle, AlertCircle, ExternalLink, Settings } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { useApp } from '../../context/AppContext';
import { SocialMediaService, BackendService } from '../../services/api';

export const SocialConnect = ({ onConnect, onPost, selectedAds = [] }) => {
  const { user } = useApp();
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postingStatus, setPostingStatus] = useState({});

  // Load connected accounts on mount
  useEffect(() => {
    loadConnectedAccounts();
  }, [user]);

  const loadConnectedAccounts = async () => {
    try {
      if (user?.userId && import.meta.env.VITE_SUPABASE_URL) {
        const accounts = await BackendService.getSocialAccounts(user.userId);
        setConnectedAccounts(accounts);
      } else {
        // Load from localStorage for demo
        const stored = localStorage.getItem('connectedSocialAccounts');
        if (stored) {
          setConnectedAccounts(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
    }
  };

  const handleConnect = async (platform) => {
    setLoading(true);
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      let authUrl;

      if (platform === 'instagram') {
        if (!import.meta.env.VITE_INSTAGRAM_CLIENT_ID) {
          // Demo mode - simulate connection
          const mockAccount = {
            accountId: `${platform}-${Date.now()}`,
            userId: user?.userId || 'user-123',
            platform: platform,
            username: `demo_${platform}_user`,
            accessToken: 'demo_token',
            refreshToken: 'demo_refresh',
            connectedAt: new Date().toISOString(),
            isActive: true
          };

          const updatedAccounts = [...connectedAccounts, mockAccount];
          setConnectedAccounts(updatedAccounts);
          localStorage.setItem('connectedSocialAccounts', JSON.stringify(updatedAccounts));
          
          if (onConnect) onConnect(platform, mockAccount);
          alert(`✅ Successfully connected ${platform} account (Demo Mode)`);
          return;
        }
        authUrl = await SocialMediaService.instagram.getAuthUrl(redirectUri);
      } else if (platform === 'tiktok') {
        if (!import.meta.env.VITE_TIKTOK_CLIENT_KEY) {
          // Demo mode - simulate connection
          const mockAccount = {
            accountId: `${platform}-${Date.now()}`,
            userId: user?.userId || 'user-123',
            platform: platform,
            username: `demo_${platform}_user`,
            accessToken: 'demo_token',
            refreshToken: 'demo_refresh',
            connectedAt: new Date().toISOString(),
            isActive: true
          };

          const updatedAccounts = [...connectedAccounts, mockAccount];
          setConnectedAccounts(updatedAccounts);
          localStorage.setItem('connectedSocialAccounts', JSON.stringify(updatedAccounts));
          
          if (onConnect) onConnect(platform, mockAccount);
          alert(`✅ Successfully connected ${platform} account (Demo Mode)`);
          return;
        }
        authUrl = await SocialMediaService.tiktok.getAuthUrl(redirectUri);
      }

      // Open auth window
      const authWindow = window.open(authUrl, 'social-auth', 'width=600,height=600');
      
      // Listen for auth completion
      const checkClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkClosed);
          // Reload connected accounts
          loadConnectedAccounts();
        }
      }, 1000);

    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
      alert(`Failed to connect ${platform}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (accountId) => {
    try {
      const updatedAccounts = connectedAccounts.filter(acc => acc.accountId !== accountId);
      setConnectedAccounts(updatedAccounts);
      localStorage.setItem('connectedSocialAccounts', JSON.stringify(updatedAccounts));
      
      // Also remove from backend if configured
      if (import.meta.env.VITE_SUPABASE_URL) {
        // In a real app, you'd have a delete endpoint
        console.log('Would delete from backend:', accountId);
      }
      
      alert('Account disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      alert('Failed to disconnect account');
    }
  };

  const handlePostToSocial = async (platform, adCreative) => {
    const account = connectedAccounts.find(acc => acc.platform === platform && acc.isActive);
    if (!account) {
      alert(`Please connect your ${platform} account first`);
      return;
    }

    setPosting(true);
    setPostingStatus(prev => ({ ...prev, [adCreative.creativeId]: 'posting' }));

    try {
      const caption = `${adCreative.adCopy.headline}\n\n${adCreative.adCopy.description}\n\n#ad #marketing #${platform}`;
      
      if (platform === 'instagram') {
        if (account.accessToken === 'demo_token') {
          // Demo mode
          await new Promise(resolve => setTimeout(resolve, 2000));
          setPostingStatus(prev => ({ ...prev, [adCreative.creativeId]: 'success' }));
          alert('✅ Successfully posted to Instagram (Demo Mode)');
        } else {
          const result = await SocialMediaService.instagram.postMedia(
            account.accessToken,
            adCreative.imageUrl,
            caption
          );
          setPostingStatus(prev => ({ ...prev, [adCreative.creativeId]: 'success' }));
          console.log('Instagram post result:', result);
        }
      } else if (platform === 'tiktok') {
        if (account.accessToken === 'demo_token') {
          // Demo mode
          await new Promise(resolve => setTimeout(resolve, 2000));
          setPostingStatus(prev => ({ ...prev, [adCreative.creativeId]: 'success' }));
          alert('✅ Successfully posted to TikTok (Demo Mode)');
        } else {
          // TikTok requires video content, so this would need video generation
          alert('TikTok posting requires video content. Feature coming soon!');
          setPostingStatus(prev => ({ ...prev, [adCreative.creativeId]: 'error' }));
        }
      }

      if (onPost) {
        onPost(platform, adCreative, 'success');
      }

    } catch (error) {
      console.error(`Failed to post to ${platform}:`, error);
      setPostingStatus(prev => ({ ...prev, [adCreative.creativeId]: 'error' }));
      alert(`Failed to post to ${platform}. Please try again.`);
      
      if (onPost) {
        onPost(platform, adCreative, 'error');
      }
    } finally {
      setPosting(false);
    }
  };

  const getAccountStatus = (platform) => {
    const account = connectedAccounts.find(acc => acc.platform === platform && acc.isActive);
    return account ? 'connected' : 'disconnected';
  };

  const getAccountInfo = (platform) => {
    return connectedAccounts.find(acc => acc.platform === platform && acc.isActive);
  };

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-500',
      description: 'Post to Instagram feed and stories'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Play,
      color: 'from-black to-gray-800',
      description: 'Share on TikTok (video content)'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Connected Accounts Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Social Media Accounts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {platforms.map((platform) => {
            const status = getAccountStatus(platform.id);
            const account = getAccountInfo(platform.id);
            const Icon = platform.icon;

            return (
              <div
                key={platform.id}
                className={`p-4 rounded-lg border transition-all ${
                  status === 'connected'
                    ? 'border-green-400/30 bg-green-400/10'
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{platform.name}</h4>
                      {account && (
                        <p className="text-sm text-white/60">@{account.username}</p>
                      )}
                    </div>
                  </div>
                  
                  {status === 'connected' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-white/40" />
                  )}
                </div>

                <p className="text-sm text-white/60 mb-3">{platform.description}</p>

                <div className="flex space-x-2">
                  {status === 'connected' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(account.accountId)}
                        className="flex-1"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(platform.id)}
                      disabled={loading}
                      className={`flex-1 bg-gradient-to-r ${platform.color} hover:opacity-90`}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Post Selected Ads */}
      {selectedAds.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Post Selected Ads ({selectedAds.length})
          </h3>
          
          <div className="space-y-4">
            {selectedAds.map((ad) => (
              <div key={ad.creativeId} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-start space-x-4">
                  <img
                    src={ad.imageUrl}
                    alt="Ad creative"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{ad.adCopy.headline}</h4>
                    <p className="text-sm text-white/60 mb-3 line-clamp-2">
                      {ad.adCopy.description}
                    </p>
                    
                    <div className="flex space-x-2">
                      {platforms.map((platform) => {
                        const status = getAccountStatus(platform.id);
                        const postStatus = postingStatus[ad.creativeId];
                        const Icon = platform.icon;

                        return (
                          <Button
                            key={platform.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePostToSocial(platform.id, ad)}
                            disabled={status !== 'connected' || posting || postStatus === 'posting'}
                            className={`${
                              postStatus === 'success' ? 'border-green-400 text-green-400' :
                              postStatus === 'error' ? 'border-red-400 text-red-400' :
                              'border-white/20'
                            }`}
                          >
                            <Icon className="w-4 h-4 mr-1" />
                            {postStatus === 'posting' ? 'Posting...' :
                             postStatus === 'success' ? 'Posted' :
                             postStatus === 'error' ? 'Failed' :
                             `Post to ${platform.name}`}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card className="p-4 bg-blue-400/10 border-blue-400/30">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-300 mb-1">Setup Instructions</h4>
            <p className="text-sm text-blue-200/80">
              To enable real social media posting, add your API credentials to the environment variables:
              VITE_INSTAGRAM_CLIENT_ID, VITE_TIKTOK_CLIENT_KEY, etc. 
              Currently running in demo mode.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
