import React from 'react';

export const Radio = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="radio"
      className={`h-4 w-4 rounded-full border-slate-300 text-pink-600 focus:ring-pink-500 ${className}`}
      {...props}
    />
  );
});

Radio.displayName = 'Radio';
