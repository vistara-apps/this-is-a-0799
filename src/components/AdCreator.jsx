import React, { useState } from 'react';
import { Upload, Wand2, Share2, ArrowLeft, Download, Instagram, Play, CheckSquare } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ImageUploader } from './ui/ImageUploader';
import { AdPreview } from './ui/AdPreview';
import { PaymentModal } from './ui/PaymentModal';
import { SocialConnect } from './ui/SocialConnect';
import { useApp } from '../context/AppContext';
import { useOpenAI } from '../hooks/useOpenAI';

export const AdCreator = ({ setCurrentView }) => {
  const { credits, useCredits } = useApp();
  const { generateAds, loading } = useOpenAI();
  
  const [step, setStep] = useState(1);
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedAds, setGeneratedAds] = useState([]);
  const [selectedAds, setSelectedAds] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleImageUpload = (file) => {
    setProductImage(file);
    setStep(2);
  };

  const handleGenerateAds = async () => {
    if (credits < 1) {
      setShowPaymentModal(true);
      return;
    }

    if (useCredits(1)) {
      setStep(3);
      try {
        const ads = await generateAds(productImage, productDescription, targetAudience);
        setGeneratedAds(ads);
        setStep(4);
      } catch (error) {
        console.error('Failed to generate ads:', error);
        alert('Failed to generate ads. Please try again.');
        setStep(2);
      }
    }
  };

  const handleSocialConnect = (platform) => {
    alert(`Connecting to ${platform}... (Demo mode)`);
  };

  const handleAdSelection = (ad) => {
    setSelectedAds(prev => {
      const isSelected = prev.some(selectedAd => selectedAd.creativeId === ad.creativeId);
      if (isSelected) {
        return prev.filter(selectedAd => selectedAd.creativeId !== ad.creativeId);
      } else {
        return [...prev, ad];
      }
    });
  };

  const handleSocialPost = (platform, ad, status) => {
    console.log(`Posted to ${platform}:`, ad, status);
    // You could update the ad's performance metrics here
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Upload Your Product Image</h2>
              <p className="text-white/80 max-w-lg mx-auto">
                Start by uploading a high-quality image of your product. Our AI will analyze it and create multiple ad variations.
              </p>
            </div>
            <ImageUploader onUpload={handleImageUpload} />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Describe Your Product</h2>
              <p className="text-white/80 max-w-lg mx-auto">
                Help our AI understand your product better by providing a description and target audience.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Product Description</label>
                    <Input
                      placeholder="Describe your product, its benefits, and key features..."
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      variant="textarea"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Target Audience (Optional)</label>
                    <Input
                      placeholder="e.g., Young professionals, fitness enthusiasts, tech-savvy millennials..."
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                <Button 
                  onClick={handleGenerateAds}
                  disabled={!productDescription.trim() || loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {loading ? (
                    <>
                      <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Ads ({credits} credits)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Wand2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-white">Creating Your Ads</h2>
            <p className="text-white/80 max-w-lg mx-auto">
              Our AI is analyzing your product and generating multiple creative variations. This usually takes 30-60 seconds.
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Your Generated Ads</h2>
              <p className="text-white/80 max-w-lg mx-auto">
                Here are your AI-generated ad creatives. Select the ones you want to post to social media.
              </p>
            </div>
            
            {/* Ad Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedAds.map((ad, index) => {
                const isSelected = selectedAds.some(selectedAd => selectedAd.creativeId === ad.creativeId);
                return (
                  <div key={index} className="relative">
                    <div 
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent' : ''
                      }`}
                      onClick={() => handleAdSelection(ad)}
                    >
                      <AdPreview ad={ad} />
                    </div>
                    
                    {/* Selection Indicator */}
                    <div className="absolute top-2 right-2">
                      <div 
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-purple-500 border-purple-500' 
                            : 'border-white/40 bg-black/20'
                        }`}
                      >
                        {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selection Summary */}
            {selectedAds.length > 0 && (
              <Card className="p-4 bg-purple-400/10 border-purple-400/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckSquare className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">
                      {selectedAds.length} ad{selectedAds.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAds([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </Card>
            )}
            
            {/* Social Media Integration */}
            <div className="max-w-4xl mx-auto">
              <SocialConnect 
                selectedAds={selectedAds}
                onConnect={handleSocialConnect}
                onPost={handleSocialPost}
              />
            </div>
            
            <div className="flex justify-between max-w-2xl mx-auto">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
              >
                Create Another
              </Button>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('analytics')}
                >
                  View Analytics
                </Button>
                
                <Button 
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-white/20 text-white/60'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-12 h-1 ml-2 ${
                  step > stepNumber ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {renderStep()}

      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            handleGenerateAds();
          }}
        />
      )}
    </div>
  );
};
