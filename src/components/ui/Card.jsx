import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`glass-effect rounded-lg p-6 hover-lift ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};