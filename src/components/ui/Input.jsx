import React from 'react';

export const Input = ({ 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent';

  if (variant === 'textarea') {
    return (
      <textarea 
        className={`${baseClasses} resize-none ${className}`}
        {...props}
      />
    );
  }

  return (
    <input 
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
};