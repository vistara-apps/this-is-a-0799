import React, { useState } from 'react';
import { X, Zap, CreditCard } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { usePaymentContext } from '../../hooks/usePaymentContext';
import { useApp } from '../../context/AppContext';

export const PaymentModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('small');
  const { createSession } = usePaymentContext();
  const { addCredits } = useApp();

  const packages = [
    {
      id: 'small',
      name: 'Starter Pack',
      credits: 10,
      price: '$4.99',
      amount: '$4.99',
      popular: false
    },
    {
      id: 'medium',
      name: 'Growth Pack',
      credits: 25,
      price: '$9.99',
      amount: '$9.99',
      popular: true
    },
    {
      id: 'large',
      name: 'Pro Pack',
      credits: 50,
      price: '$17.99',
      amount: '$17.99',
      popular: false
    }
  ];

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
      await createSession(selectedPkg.amount);
      
      // Add credits to user account
      addCredits(selectedPkg.credits);
      
      // Show success and close modal
      alert(`Successfully purchased ${selectedPkg.credits} credits!`);
      onSuccess();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Purchase Credits</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                selectedPackage === pkg.id
                  ? 'border-purple-400 bg-purple-400/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-4 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">{pkg.name}</h3>
                  <div className="flex items-center space-x-2 text-white/60">
                    <Zap className="w-4 h-4" />
                    <span>{pkg.credits} credits</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{pkg.price}</div>
                  <div className="text-white/60 text-sm">
                    ${(parseFloat(pkg.price.slice(1)) / pkg.credits).toFixed(2)}/credit
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {loading ? (
              <>
                <CreditCard className="w-4 h-4 mr-2 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Purchase with Wallet
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>

        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <p className="text-white/60 text-xs text-center">
            Credits never expire. Secure payment powered by x402 platform.
          </p>
        </div>
      </Card>
    </div>
  );
};