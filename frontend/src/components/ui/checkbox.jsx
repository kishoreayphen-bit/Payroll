import React from 'react';

export const Checkbox = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={`h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500 ${className}`}
      {...props}
    />
  );
});

Checkbox.displayName = 'Checkbox';
