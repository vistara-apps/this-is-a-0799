# AdSparkr - AI-Powered Ad Creative Generator

**Effortlessly spin up and test social ad creatives that convert.**

AdSparkr is a comprehensive web application that helps solo founders and marketers generate multiple ad variations from a product image and automatically post them to social media for testing. Built with React, powered by AI, and integrated with social media APIs.

![AdSparkr Screenshot](https://via.placeholder.com/800x400/6366f1/ffffff?text=AdSparkr+Dashboard)

## 🚀 Features

### ✨ Core Features
- **AI-Powered Image-to-Ad Conversion**: Upload a product image and generate 3-5 distinct ad creatives with AI-generated copy
- **Automated Social Posting & Scheduling**: Connect Instagram and TikTok accounts to automatically post ad variations
- **AI Growth Hacking Agent**: Get actionable insights on ad performance and optimal posting times
- **Automated Ad Copywriting**: Generate compelling headlines and descriptions tailored to your audience

### 💰 Business Model
- **Micro-transactions**: Pay-per-generation ($0.50 per ad set) or batch pricing
- **Flexible Pricing**: 10 ad sets for $4, with subscription options available
- **Low Barrier to Entry**: Perfect for testing new creatives without high upfront costs

### 🛠 Technical Features
- **Modern React Stack**: Built with React 18, Vite, and Tailwind CSS
- **Web3 Integration**: Wallet connection with RainbowKit and Wagmi
- **Real-time Analytics**: Performance tracking and insights dashboard
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- OpenAI API key (for AI ad generation)
- Social media API credentials (optional, for posting)
- Supabase account (optional, for data persistence)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-0799.git
   cd this-is-a-0799
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id
   VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 API Configuration

### OpenAI API (Required)
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env`: `VITE_OPENAI_API_KEY=your_key_here`
3. Ensure you have credits in your OpenAI account

### Instagram API (Optional)
1. Create a Facebook App at [Facebook Developers](https://developers.facebook.com/)
2. Add Instagram Basic Display product
3. Get your Client ID and Secret
4. Add to `.env`:
   ```env
   VITE_INSTAGRAM_CLIENT_ID=your_client_id
   VITE_INSTAGRAM_CLIENT_SECRET=your_client_secret
   ```

### TikTok API (Optional)
1. Apply for TikTok for Developers at [TikTok Developers](https://developers.tiktok.com/)
2. Create an app and get your Client Key
3. Add to `.env`:
   ```env
   VITE_TIKTOK_CLIENT_KEY=your_client_key
   VITE_TIKTOK_CLIENT_SECRET=your_client_secret
   ```

### Supabase (Optional)
1. Create a project at [Supabase](https://supabase.com/)
2. Get your project URL and anon key
3. Add to `.env`:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## 📊 Database Schema

If using Supabase, create these tables:

```sql
-- Users table
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  connected_social_accounts JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
  campaign_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id),
  product_image TEXT NOT NULL,
  product_description TEXT,
  target_audience TEXT,
  generated_creatives JSONB NOT NULL,
  creation_timestamp TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);

-- Social accounts table
CREATE TABLE social_accounts (
  account_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id),
  platform TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  username TEXT,
  connected_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Ad creatives table (for detailed tracking)
CREATE TABLE ad_creatives (
  creative_id TEXT PRIMARY KEY,
  campaign_id TEXT REFERENCES campaigns(campaign_id),
  image_url TEXT NOT NULL,
  ad_copy JSONB NOT NULL,
  format TEXT NOT NULL,
  performance_metrics JSONB DEFAULT '{}',
  generated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Usage Guide

### 1. Creating Your First Campaign
1. Click "Create Ads" in the navigation
2. Upload a high-quality product image
3. Describe your product and target audience
4. Click "Generate Ads" (uses 1 credit)
5. Review your AI-generated ad variations

### 2. Posting to Social Media
1. After generating ads, select the ones you want to post
2. Connect your Instagram/TikTok accounts
3. Click "Post to [Platform]" for each selected ad
4. Monitor performance in the Analytics dashboard

### 3. Analyzing Performance
1. Navigate to the "Analytics" tab
2. View AI-generated insights and recommendations
3. See which ad formats perform best
4. Get optimal posting time suggestions

### 4. Managing Credits
- Start with 3 free credits
- Purchase more through the payment modal
- Each ad generation uses 1 credit
- Credits never expire

## 🏗 Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and context
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

### Web3 Integration
- **RainbowKit**: Wallet connection UI
- **Wagmi**: React hooks for Ethereum
- **x402**: Micro-payment integration

### API Services
- **OpenAI**: GPT-3.5/4 for ad copy, DALL-E for images
- **Instagram Graph API**: For posting to Instagram
- **TikTok API**: For posting to TikTok
- **Supabase**: Backend-as-a-Service for data storage

### Key Components
```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard view
│   ├── AdCreator.jsx          # Ad creation workflow
│   ├── GrowthAgent.jsx        # AI analytics dashboard
│   └── ui/
│       ├── SocialConnect.jsx  # Social media integration
│       ├── AdPreview.jsx      # Ad creative preview
│       └── PaymentModal.jsx   # Credit purchase modal
├── services/
│   └── api.js                 # All API integrations
├── hooks/
│   ├── useOpenAI.js          # OpenAI integration hook
│   └── usePaymentContext.js   # Payment handling
└── context/
    └── AppContext.jsx         # Global app state
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Modes
- **Development**: Full functionality with API keys
- **Demo Mode**: Mock data when API keys are missing
- **Production**: Optimized build with all features

### Adding New Features
1. Create components in `src/components/`
2. Add API services to `src/services/api.js`
3. Update routing in `src/App.jsx`
4. Add navigation items to `src/components/Header.jsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **API Limits**: Monitor your OpenAI and social media API usage
- **Demo Mode**: App works with mock data when API keys aren't configured

## 🔮 Roadmap

- [ ] Video ad generation for TikTok
- [ ] Advanced A/B testing features
- [ ] Automated bid optimization
- [ ] Multi-language support
- [ ] Team collaboration features
- [ ] Advanced analytics and reporting
- [ ] Integration with more social platforms
- [ ] Bulk campaign management

## 📊 Performance Metrics

The app tracks various metrics to help optimize your ad campaigns:

- **Impressions**: How many people saw your ad
- **Click-through Rate (CTR)**: Percentage of people who clicked
- **Conversions**: Actions taken after clicking
- **Cost per Click (CPC)**: Average cost for each click
- **Return on Ad Spend (ROAS)**: Revenue generated per dollar spent

---

**Built with ❤️ by the AdSparkr team**

*Transform your product images into high-converting ad campaigns with the power of AI.*
