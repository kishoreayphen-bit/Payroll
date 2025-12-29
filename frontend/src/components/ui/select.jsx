import React from 'react';
import { cn } from '../../lib/utils';

export const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full h-11 px-3 rounded-lg border border-slate-200 bg-white text-slate-900',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2',
        'disabled:bg-slate-50 disabled:text-slate-400',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
