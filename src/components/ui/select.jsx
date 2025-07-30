import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Select = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={`flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
    <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
  </div>
));

Select.displayName = 'Select';

export { Select };
