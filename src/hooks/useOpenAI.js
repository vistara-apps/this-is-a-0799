import { useState } from 'react';
import { useApp } from '../context/AppContext';

export const useOpenAI = () => {
  const [loading, setLoading] = useState(false);
  const { addCampaign } = useApp();

  const generateAds = async (productImage, description, targetAudience) => {
    setLoading(true);
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated ads data
      const mockAds = [
        {
          creativeId: `ad-${Date.now()}-1`,
          imageUrl: productImage,
          adCopy: {
            headline: "Transform Your Style Today!",
            description: `Discover ${description.slice(0, 50)}... Perfect for ${targetAudience || 'everyone'}!`,
            cta: "Shop Now"
          },
          format: "instagram-post",
          performanceMetrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0
          }
        },
        {
          creativeId: `ad-${Date.now()}-2`,
          imageUrl: productImage,
          adCopy: {
            headline: "Limited Time Offer!",
            description: `Get yours before it's gone! ${description.slice(0, 40)}...`,
            cta: "Get Yours"
          },
          format: "instagram-story",
          performanceMetrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0
          }
        },
        {
          creativeId: `ad-${Date.now()}-3`,
          imageUrl: productImage,
          adCopy: {
            headline: "You Need This!",
            description: `Join thousands who love ${description.slice(0, 30)}... Special deal inside!`,
            cta: "Learn More"
          },
          format: "tiktok-post",
          performanceMetrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0
          }
        }
      ];

      // Create campaign
      const campaign = {
        campaignId: `campaign-${Date.now()}`,
        userId: 'user-123',
        productImage: productImage,
        generatedCreatives: mockAds,
        creationTimestamp: new Date().toISOString(),
        status: 'active'
      };

      addCampaign(campaign);
      
      return mockAds;
      
    } catch (error) {
      console.error('Error generating ads:', error);
      throw new Error('Failed to generate ads');
    } finally {
      setLoading(false);
    }
  };

  return { generateAds, loading };
};