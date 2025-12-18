import React from 'react';

export const Checkbox = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={`h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 ${className}`}
      {...props}
    />
  );
});

Checkbox.displayName = 'Checkbox';
