# AdSparkr API Documentation

This document outlines all the API integrations and services used in AdSparkr.

## Table of Contents

1. [OpenAI Service](#openai-service)
2. [Social Media Services](#social-media-services)
3. [Backend Service](#backend-service)
4. [Analytics Service](#analytics-service)
5. [Error Handling](#error-handling)
6. [Rate Limits](#rate-limits)

## OpenAI Service

### Overview
The OpenAI service handles AI-powered ad generation using GPT models for copywriting and DALL-E for image variations.

### Configuration
```javascript
const API_CONFIG = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
};
```

### Methods

#### `generateAdCreatives(productImage, description, targetAudience)`

Generates multiple ad creatives from a product image and description.

**Parameters:**
- `productImage` (string): URL or base64 of the product image
- `description` (string): Product description
- `targetAudience` (string): Target audience description

**Returns:**
```javascript
[
  {
    creativeId: "ad-1234567890-1",
    imageUrl: "https://generated-image-url.com",
    originalImageUrl: "https://original-image-url.com",
    adCopy: {
      headline: "Transform Your Life Today!",
      description: "Discover the power of...",
      cta: "Shop Now"
    },
    format: "instagram-post",
    performanceMetrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cost: 0
    },
    generatedAt: "2024-01-01T00:00:00.000Z"
  }
]
```

**Example Usage:**
```javascript
import { OpenAIService } from '../services/api';

const creatives = await OpenAIService.generateAdCreatives(
  'https://example.com/product.jpg',
  'Premium wireless headphones with noise cancellation',
  'Tech-savvy millennials'
);
```

#### `generateGrowthInsights(campaigns, performanceData)`

Generates AI-powered growth insights based on campaign performance.

**Parameters:**
- `campaigns` (array): Array of campaign objects
- `performanceData` (array): Performance metrics data

**Returns:**
```javascript
{
  insights: [
    "Instagram posts perform 23% better than TikTok for your audience",
    "Posts with urgency-based headlines get 2x more clicks"
  ],
  recommendations: [
    "Focus more budget on Instagram campaigns",
    "Test more urgency-based copy variations"
  ],
  bestTimes: ["9:00 AM", "2:00 PM", "7:00 PM"]
}
```

## Social Media Services

### Instagram API

#### Configuration
```javascript
const API_CONFIG = {
  INSTAGRAM_CLIENT_ID: import.meta.env.VITE_INSTAGRAM_CLIENT_ID || '',
  INSTAGRAM_CLIENT_SECRET: import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET || '',
};
```

#### Methods

##### `getAuthUrl(redirectUri)`
Generates Instagram OAuth authorization URL.

**Parameters:**
- `redirectUri` (string): Callback URL after authorization

**Returns:** Authorization URL string

##### `exchangeCodeForToken(code, redirectUri)`
Exchanges authorization code for access token.

**Parameters:**
- `code` (string): Authorization code from OAuth callback
- `redirectUri` (string): Same redirect URI used in authorization

**Returns:**
```javascript
{
  access_token: "IGQVJYeUhB...",
  user_id: "123456789"
}
```

##### `postMedia(accessToken, imageUrl, caption)`
Posts media to Instagram.

**Parameters:**
- `accessToken` (string): User's Instagram access token
- `imageUrl` (string): URL of image to post
- `caption` (string): Post caption

**Returns:**
```javascript
{
  id: "17841405309211844"
}
```

##### `getInsights(accessToken, mediaId)`
Retrieves performance insights for a post.

**Parameters:**
- `accessToken` (string): User's Instagram access token
- `mediaId` (string): Instagram media ID

**Returns:**
```javascript
{
  data: [
    {
      name: "impressions",
      values: [{ value: 1234 }]
    },
    {
      name: "reach",
      values: [{ value: 987 }]
    }
  ]
}
```

### TikTok API

#### Configuration
```javascript
const API_CONFIG = {
  TIKTOK_CLIENT_KEY: import.meta.env.VITE_TIKTOK_CLIENT_KEY || '',
  TIKTOK_CLIENT_SECRET: import.meta.env.VITE_TIKTOK_CLIENT_SECRET || '',
};
```

#### Methods

##### `getAuthUrl(redirectUri)`
Generates TikTok OAuth authorization URL.

##### `exchangeCodeForToken(code, redirectUri)`
Exchanges authorization code for access token.

##### `uploadVideo(accessToken, videoUrl, caption)`
Uploads video content to TikTok.

**Note:** TikTok requires video content. For image-based ads, consider generating video content or using TikTok's image-to-video features.

## Backend Service

### Overview
Handles data persistence using Supabase as Backend-as-a-Service.

### Configuration
```javascript
const API_CONFIG = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};
```

### Methods

#### User Management

##### `createUser(userData)`
Creates a new user record.

**Parameters:**
```javascript
{
  userId: "user-123",
  email: "user@example.com",
  stripeCustomerId: null,
  connectedSocialAccounts: []
}
```

##### `updateUser(userId, updates)`
Updates user information.

#### Campaign Management

##### `saveCampaign(campaignData)`
Saves a campaign to the database.

**Parameters:**
```javascript
{
  campaignId: "campaign-1234567890",
  userId: "user-123",
  productImage: "https://image-url.com",
  productDescription: "Product description",
  targetAudience: "Target audience",
  generatedCreatives: [...],
  creationTimestamp: "2024-01-01T00:00:00.000Z",
  status: "active"
}
```

##### `getCampaigns(userId)`
Retrieves all campaigns for a user.

##### `updateCampaign(campaignId, updates)`
Updates campaign information.

#### Social Account Management

##### `saveSocialAccount(accountData)`
Saves social media account connection.

**Parameters:**
```javascript
{
  accountId: "instagram-1234567890",
  userId: "user-123",
  platform: "instagram",
  accessToken: "token...",
  refreshToken: "refresh...",
  username: "user_handle",
  connectedAt: "2024-01-01T00:00:00.000Z",
  isActive: true
}
```

##### `getSocialAccounts(userId)`
Retrieves connected social accounts for a user.

## Analytics Service

### Overview
Handles performance tracking and insights generation.

### Methods

#### `trackPerformance(creativeId, platform, metrics)`
Tracks ad performance metrics.

**Parameters:**
- `creativeId` (string): Unique creative identifier
- `platform` (string): Social media platform
- `metrics` (object): Performance metrics

**Metrics Object:**
```javascript
{
  impressions: 1234,
  clicks: 56,
  conversions: 7,
  ctr: 4.54,
  cost: 12.50,
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

#### `generateInsights(campaigns)`
Generates performance insights from campaign data.

**Parameters:**
- `campaigns` (array): Array of campaign objects

**Returns:** Insights object with recommendations and best practices.

## Error Handling

### Common Error Types

#### OpenAI Errors
```javascript
// API Key Error
{
  error: "Invalid API key",
  code: "invalid_api_key",
  message: "Please check your OpenAI API key configuration"
}

// Quota Exceeded
{
  error: "Quota exceeded",
  code: "quota_exceeded", 
  message: "OpenAI API quota exceeded. Please check your billing settings."
}

// Rate Limited
{
  error: "Rate limited",
  code: "rate_limited",
  message: "Rate limit exceeded. Please wait a moment and try again."
}
```

#### Social Media API Errors
```javascript
// Instagram Error
{
  error: "Instagram API Error",
  code: "instagram_error",
  message: "Failed to post to Instagram",
  details: {
    error_type: "OAuthException",
    error_message: "Invalid access token"
  }
}

// TikTok Error
{
  error: "TikTok API Error", 
  code: "tiktok_error",
  message: "Failed to upload to TikTok"
}
```

#### Backend Errors
```javascript
// Database Error
{
  error: "Database Error",
  code: "db_error",
  message: "Failed to save data to database"
}

// Network Error
{
  error: "Network Error",
  code: "network_error", 
  message: "Unable to connect to backend service"
}
```

### Error Handling Best Practices

1. **Graceful Degradation**: App continues to work with mock data when APIs fail
2. **User-Friendly Messages**: Technical errors are translated to user-friendly messages
3. **Retry Logic**: Automatic retries for transient failures
4. **Fallback Options**: Alternative flows when primary services are unavailable

## Rate Limits

### OpenAI API
- **GPT Models**: 3,500 requests per minute (RPM)
- **DALL-E**: 50 images per minute
- **Tokens**: Varies by model and plan

### Instagram API
- **Basic Display**: 200 requests per hour per user
- **Graph API**: 200 requests per hour per user
- **Publishing**: 25 posts per day per user

### TikTok API
- **User Info**: 100 requests per day per user
- **Video Upload**: 10 videos per day per user
- **Analytics**: 1,000 requests per day per app

### Supabase
- **Free Tier**: 500MB database, 2GB bandwidth
- **API Requests**: No hard limit, but subject to fair use

## Demo Mode

When API keys are not configured, the application runs in demo mode with:

- **Mock Data**: Realistic sample data for testing
- **Simulated Delays**: Realistic API response times
- **Full UI**: All features available for demonstration
- **Local Storage**: Data persisted locally instead of backend

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **Environment Variables**: Use VITE_ prefix for client-side variables
3. **Token Storage**: Securely store social media tokens
4. **CORS**: Configure proper CORS policies for production
5. **Rate Limiting**: Implement client-side rate limiting to prevent abuse

## Testing

### Unit Tests
```javascript
// Example test for OpenAI service
import { OpenAIService } from '../services/api';

test('generates ad creatives', async () => {
  const creatives = await OpenAIService.generateAdCreatives(
    'test-image.jpg',
    'Test product',
    'Test audience'
  );
  
  expect(creatives).toHaveLength(3);
  expect(creatives[0]).toHaveProperty('creativeId');
  expect(creatives[0]).toHaveProperty('adCopy');
});
```

### Integration Tests
```javascript
// Example integration test
test('complete ad creation flow', async () => {
  // 1. Generate ads
  const creatives = await generateAds(image, description, audience);
  
  // 2. Save campaign
  const campaign = await saveCampaign(campaignData);
  
  // 3. Post to social media
  const result = await postToInstagram(creative, accessToken);
  
  expect(result).toHaveProperty('id');
});
```

## Monitoring and Analytics

### Key Metrics to Track
- API response times
- Error rates by service
- User engagement metrics
- Credit usage patterns
- Social media posting success rates

### Logging
```javascript
// Example logging
console.log('API Request:', {
  service: 'OpenAI',
  endpoint: '/chat/completions',
  timestamp: new Date().toISOString(),
  userId: user.id
});
```

---

For more detailed implementation examples, see the source code in `src/services/api.js`.
