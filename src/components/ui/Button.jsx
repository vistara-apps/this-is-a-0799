import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-white text-gray-900 hover:bg-gray-100 shadow-md',
    secondary: 'bg-white/20 text-white hover:bg-white/30 border border-white/30',
    outline: 'border border-white/30 text-white hover:bg-white/10',
    ghost: 'text-white hover:bg-white/10',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    link: 'text-white underline hover:no-underline'
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};