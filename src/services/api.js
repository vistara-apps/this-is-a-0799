/**
 * API Services Layer for AdSparkr
 * Handles all external API integrations including OpenAI, Social Media APIs, and backend services
 */

import axios from 'axios';

// API Configuration
const API_CONFIG = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  INSTAGRAM_CLIENT_ID: import.meta.env.VITE_INSTAGRAM_CLIENT_ID || '',
  TIKTOK_CLIENT_KEY: import.meta.env.VITE_TIKTOK_CLIENT_KEY || '',
};

// OpenAI API Client
const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Supabase Client (for backend data storage)
const supabaseClient = axios.create({
  baseURL: API_CONFIG.SUPABASE_URL,
  headers: {
    'apikey': API_CONFIG.SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
});

/**
 * OpenAI Service - Handles AI-powered ad generation
 */
export const OpenAIService = {
  /**
   * Generate ad variations from product image and description
   */
  async generateAdCreatives(productImage, description, targetAudience) {
    try {
      // Generate ad copy variations
      const copyPrompts = [
        `Create a compelling Instagram ad headline and description for: ${description}. Target audience: ${targetAudience || 'general audience'}. Make it engaging and conversion-focused.`,
        `Write a TikTok-style ad copy for: ${description}. Target: ${targetAudience || 'young adults'}. Use trendy language and include a strong call-to-action.`,
        `Create a professional Facebook ad copy for: ${description}. Target: ${targetAudience || 'professionals'}. Focus on benefits and urgency.`,
      ];

      const adCopyPromises = copyPrompts.map(async (prompt, index) => {
        const response = await openaiClient.post('/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert ad copywriter. Create compelling, conversion-focused ad copy. Return only the headline and description in JSON format: {"headline": "...", "description": "...", "cta": "..."}'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.8,
        });

        const content = response.data.choices[0].message.content;
        try {
          return JSON.parse(content);
        } catch {
          // Fallback if JSON parsing fails
          return {
            headline: content.split('\n')[0] || 'Transform Your Life Today!',
            description: content.split('\n').slice(1).join(' ') || description,
            cta: ['Shop Now', 'Learn More', 'Get Started'][index] || 'Shop Now'
          };
        }
      });

      const adCopies = await Promise.all(adCopyPromises);

      // Generate image variations (using DALL-E for creative backgrounds)
      const imagePromises = [
        `Product photography of ${description} with modern minimalist background, professional lighting, high quality`,
        `${description} in lifestyle setting, natural lighting, Instagram-worthy composition`,
        `Creative flat lay of ${description} with complementary props, vibrant colors, social media style`,
      ];

      const imageVariations = await Promise.all(
        imagePromises.map(async (prompt, index) => {
          try {
            const response = await openaiClient.post('/images/generations', {
              model: 'dall-e-3',
              prompt: prompt,
              n: 1,
              size: '1024x1024',
              quality: 'standard',
            });
            return response.data.data[0].url;
          } catch (error) {
            console.warn(`Image generation failed for variation ${index}:`, error);
            // Fallback to original image
            return productImage;
          }
        })
      );

      // Combine ad copy with image variations
      const creatives = adCopies.map((copy, index) => ({
        creativeId: `ad-${Date.now()}-${index + 1}`,
        imageUrl: imageVariations[index] || productImage,
        originalImageUrl: productImage,
        adCopy: copy,
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

      return creatives;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate ad creatives. Please check your API configuration.');
    }
  },

  /**
   * Generate growth hacking insights based on performance data
   */
  async generateGrowthInsights(campaigns, performanceData) {
    try {
      const prompt = `Analyze this ad campaign performance data and provide actionable growth hacking insights:
      
      Campaigns: ${JSON.stringify(campaigns.slice(0, 3))}
      Performance: ${JSON.stringify(performanceData)}
      
      Provide insights on:
      1. Best performing ad formats
      2. Optimal posting times
      3. Audience engagement patterns
      4. Recommendations for improvement
      
      Return as JSON: {"insights": [...], "recommendations": [...], "bestTimes": [...]}`;

      const response = await openaiClient.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI growth hacking expert. Analyze ad performance data and provide actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const content = response.data.choices[0].message.content;
      try {
        return JSON.parse(content);
      } catch {
        return {
          insights: ['Focus on high-performing ad formats', 'Test different posting times'],
          recommendations: ['Increase budget for top performers', 'A/B test new creative angles'],
          bestTimes: ['9:00 AM', '2:00 PM', '7:00 PM']
        };
      }
    } catch (error) {
      console.error('Growth insights generation failed:', error);
      return {
        insights: ['Unable to generate insights at this time'],
        recommendations: ['Please try again later'],
        bestTimes: ['9:00 AM', '2:00 PM', '7:00 PM']
      };
    }
  }
};

/**
 * Social Media Service - Handles Instagram and TikTok integrations
 */
export const SocialMediaService = {
  /**
   * Instagram Graph API integration
   */
  instagram: {
    async getAuthUrl(redirectUri) {
      const params = new URLSearchParams({
        client_id: API_CONFIG.INSTAGRAM_CLIENT_ID,
        redirect_uri: redirectUri,
        scope: 'user_profile,user_media',
        response_type: 'code',
      });
      return `https://api.instagram.com/oauth/authorize?${params}`;
    },

    async exchangeCodeForToken(code, redirectUri) {
      try {
        const response = await axios.post('https://api.instagram.com/oauth/access_token', {
          client_id: API_CONFIG.INSTAGRAM_CLIENT_ID,
          client_secret: import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: code,
        });
        return response.data;
      } catch (error) {
        console.error('Instagram token exchange failed:', error);
        throw new Error('Failed to connect Instagram account');
      }
    },

    async postMedia(accessToken, imageUrl, caption) {
      try {
        // Create media object
        const mediaResponse = await axios.post(`https://graph.instagram.com/me/media`, {
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken,
        });

        // Publish media
        const publishResponse = await axios.post(`https://graph.instagram.com/${mediaResponse.data.id}/publish`, {
          access_token: accessToken,
        });

        return publishResponse.data;
      } catch (error) {
        console.error('Instagram posting failed:', error);
        throw new Error('Failed to post to Instagram');
      }
    },

    async getInsights(accessToken, mediaId) {
      try {
        const response = await axios.get(`https://graph.instagram.com/${mediaId}/insights`, {
          params: {
            metric: 'impressions,reach,likes,comments,shares',
            access_token: accessToken,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Instagram insights failed:', error);
        return null;
      }
    }
  },

  /**
   * TikTok API integration
   */
  tiktok: {
    async getAuthUrl(redirectUri) {
      const params = new URLSearchParams({
        client_key: API_CONFIG.TIKTOK_CLIENT_KEY,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'user.info.basic,video.publish',
      });
      return `https://www.tiktok.com/auth/authorize/?${params}`;
    },

    async exchangeCodeForToken(code, redirectUri) {
      try {
        const response = await axios.post('https://open-api.tiktok.com/oauth/access_token/', {
          client_key: API_CONFIG.TIKTOK_CLIENT_KEY,
          client_secret: import.meta.env.VITE_TIKTOK_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        });
        return response.data;
      } catch (error) {
        console.error('TikTok token exchange failed:', error);
        throw new Error('Failed to connect TikTok account');
      }
    },

    async uploadVideo(accessToken, videoUrl, caption) {
      try {
        // TikTok video upload is more complex and requires video processing
        // This is a simplified version - in production, you'd need proper video handling
        const response = await axios.post('https://open-api.tiktok.com/share/video/upload/', {
          access_token: accessToken,
          video_url: videoUrl,
          text: caption,
        });
        return response.data;
      } catch (error) {
        console.error('TikTok upload failed:', error);
        throw new Error('Failed to post to TikTok');
      }
    }
  }
};

/**
 * Backend Service - Handles data persistence with Supabase
 */
export const BackendService = {
  /**
   * User management
   */
  async createUser(userData) {
    try {
      const response = await supabaseClient.post('/rest/v1/users', userData);
      return response.data;
    } catch (error) {
      console.error('User creation failed:', error);
      throw new Error('Failed to create user');
    }
  },

  async updateUser(userId, updates) {
    try {
      const response = await supabaseClient.patch(`/rest/v1/users?userId=eq.${userId}`, updates);
      return response.data;
    } catch (error) {
      console.error('User update failed:', error);
      throw new Error('Failed to update user');
    }
  },

  /**
   * Campaign management
   */
  async saveCampaign(campaignData) {
    try {
      const response = await supabaseClient.post('/rest/v1/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Campaign save failed:', error);
      throw new Error('Failed to save campaign');
    }
  },

  async getCampaigns(userId) {
    try {
      const response = await supabaseClient.get(`/rest/v1/campaigns?userId=eq.${userId}&order=creationTimestamp.desc`);
      return response.data;
    } catch (error) {
      console.error('Campaign fetch failed:', error);
      return [];
    }
  },

  async updateCampaign(campaignId, updates) {
    try {
      const response = await supabaseClient.patch(`/rest/v1/campaigns?campaignId=eq.${campaignId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Campaign update failed:', error);
      throw new Error('Failed to update campaign');
    }
  },

  /**
   * Social account management
   */
  async saveSocialAccount(accountData) {
    try {
      const response = await supabaseClient.post('/rest/v1/social_accounts', accountData);
      return response.data;
    } catch (error) {
      console.error('Social account save failed:', error);
      throw new Error('Failed to save social account');
    }
  },

  async getSocialAccounts(userId) {
    try {
      const response = await supabaseClient.get(`/rest/v1/social_accounts?userId=eq.${userId}`);
      return response.data;
    } catch (error) {
      console.error('Social accounts fetch failed:', error);
      return [];
    }
  },

  /**
   * Performance metrics
   */
  async savePerformanceMetrics(creativeId, metrics) {
    try {
      const response = await supabaseClient.patch(`/rest/v1/ad_creatives?creativeId=eq.${creativeId}`, {
        performanceMetrics: metrics
      });
      return response.data;
    } catch (error) {
      console.error('Metrics save failed:', error);
      throw new Error('Failed to save performance metrics');
    }
  }
};

/**
 * Analytics Service - Handles performance tracking and insights
 */
export const AnalyticsService = {
  /**
   * Track ad performance across platforms
   */
  async trackPerformance(creativeId, platform, metrics) {
    try {
      const performanceData = {
        creativeId,
        platform,
        metrics,
        timestamp: new Date().toISOString(),
      };

      // Save to backend
      await BackendService.savePerformanceMetrics(creativeId, metrics);

      // Return aggregated data
      return performanceData;
    } catch (error) {
      console.error('Performance tracking failed:', error);
      throw new Error('Failed to track performance');
    }
  },

  /**
   * Generate performance insights
   */
  async generateInsights(campaigns) {
    try {
      const performanceData = campaigns.flatMap(campaign => 
        campaign.generatedCreatives.map(creative => ({
          creativeId: creative.creativeId,
          format: creative.format,
          metrics: creative.performanceMetrics,
        }))
      );

      // Use OpenAI to generate insights
      const insights = await OpenAIService.generateGrowthInsights(campaigns, performanceData);
      return insights;
    } catch (error) {
      console.error('Insights generation failed:', error);
      return {
        insights: ['Unable to generate insights'],
        recommendations: ['Please try again later'],
        bestTimes: ['9:00 AM', '2:00 PM', '7:00 PM']
      };
    }
  }
};

export default {
  OpenAIService,
  SocialMediaService,
  BackendService,
  AnalyticsService,
};
