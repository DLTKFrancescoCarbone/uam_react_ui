import React from 'react';

const Checkbox = React.forwardRef(({ className = '', textClassName = '', checked, onChange, children, ...props }, ref) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
      {children && (
        <span className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${textClassName}`}>
          {children}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
