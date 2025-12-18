import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full h-11 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
