import React from 'react';

const DiscountBadge = ({ percentage, size = 'default' }) => {
  if (!percentage || percentage <= 0) return null;
  
  const sizeClasses = {
    small: 'text-xs px-1.5 py-0.5',
    default: 'text-xs px-2 py-1',
    large: 'text-sm px-3 py-1.5',
  };
  
  return (
    <span className={`absolute top-2 right-2 bg-red-500 text-white font-bold rounded-full z-10 ${sizeClasses[size]}`}>
      {percentage}% تخفیف
    </span>
  );
};

export default DiscountBadge;