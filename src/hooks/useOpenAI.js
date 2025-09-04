import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OpenAIService, BackendService } from '../services/api';

export const useOpenAI = () => {
  const [loading, setLoading] = useState(false);
  const { addCampaign, user } = useApp();

  const generateAds = async (productImage, description, targetAudience) => {
    setLoading(true);
    
    try {
      // Check if OpenAI API key is configured
      const hasApiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      let generatedCreatives;
      
      if (hasApiKey) {
        // Use real OpenAI API
        generatedCreatives = await OpenAIService.generateAdCreatives(
          productImage, 
          description, 
          targetAudience
        );
      } else {
        // Fallback to enhanced mock data with better variety
        console.warn('OpenAI API key not configured, using enhanced mock data');
        
        // Simulate realistic API delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
        
        const mockVariations = [
          {
            headline: "Transform Your Life Today!",
            description: `Discover the power of ${description.slice(0, 50)}... Perfect for ${targetAudience || 'everyone who wants better results'}!`,
            cta: "Shop Now"
          },
          {
            headline: "Limited Time: 50% Off!",
            description: `Don't miss out! ${description.slice(0, 40)}... Join thousands of satisfied customers.`,
            cta: "Get Yours"
          },
          {
            headline: "The Secret Everyone's Talking About",
            description: `Finally revealed: ${description.slice(0, 35)}... See why ${targetAudience || 'smart shoppers'} choose us.`,
            cta: "Learn More"
          },
          {
            headline: "Before You Buy Anywhere Else...",
            description: `Read this! ${description.slice(0, 45)}... Exclusive deal for first-time buyers.`,
            cta: "Claim Deal"
          }
        ];

        generatedCreatives = mockVariations.slice(0, 3).map((variation, index) => ({
          creativeId: `ad-${Date.now()}-${index + 1}`,
          imageUrl: productImage,
          originalImageUrl: productImage,
          adCopy: variation,
          format: ['instagram-post', 'tiktok-post', 'facebook-post'][index] || 'instagram-post',
          performanceMetrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            cost: 0,
          },
          generatedAt: new Date().toISOString(),
        }));
      }

      // Create campaign object
      const campaign = {
        campaignId: `campaign-${Date.now()}`,
        userId: user?.userId || 'user-123',
        productImage: productImage,
        productDescription: description,
        targetAudience: targetAudience,
        generatedCreatives: generatedCreatives,
        creationTimestamp: new Date().toISOString(),
        status: 'active'
      };

      // Save to backend if configured
      try {
        if (import.meta.env.VITE_SUPABASE_URL) {
          await BackendService.saveCampaign(campaign);
        }
      } catch (error) {
        console.warn('Failed to save campaign to backend:', error);
        // Continue anyway - local storage will handle it
      }

      // Add to local state
      addCampaign(campaign);
      
      return generatedCreatives;
      
    } catch (error) {
      console.error('Error generating ads:', error);
      
      // Provide helpful error messages
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
      } else if (error.message.includes('quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your billing settings.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else {
        throw new Error('Failed to generate ads. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateGrowthInsights = async (campaigns) => {
    try {
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        return await OpenAIService.generateGrowthInsights(campaigns, []);
      } else {
        // Mock insights for demo
        return {
          insights: [
            'Instagram posts perform 23% better than TikTok for your audience',
            'Posts with urgency-based headlines get 2x more clicks',
            'Visual content with lifestyle settings converts better'
          ],
          recommendations: [
            'Focus more budget on Instagram campaigns',
            'Test more urgency-based copy variations',
            'Create lifestyle-focused image variations',
            'Post during peak engagement hours (2-4 PM)'
          ],
          bestTimes: ['9:00 AM', '2:00 PM', '7:00 PM']
        };
      }
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return {
        insights: ['Unable to generate insights at this time'],
        recommendations: ['Please try again later'],
        bestTimes: ['9:00 AM', '2:00 PM', '7:00 PM']
      };
    }
  };

  return { generateAds, generateGrowthInsights, loading };
};
