import React, { useState, forwardRef } from 'react';

// Simple className utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const FloatingLabelInput = forwardRef(({ 
  className, 
  type = 'text', 
  label, 
  id,
  value = '',
  error,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;
  const isFloating = isFocused || hasValue;

  const inputId = id || `floating-input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative">
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={cn(
          "flex h-12 w-full rounded-md border border-input bg-background px-3 pt-4 pb-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        value={value}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        placeholder=""
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "absolute left-3 top-3 text-sm text-muted-foreground transition-all duration-200 ease-in-out cursor-text pointer-events-none select-none",
          isFloating && "top-1 text-xs font-medium transform-gpu",
          isFocused && "text-primary",
          error && "text-red-500"
        )}
      >
        {label}
      </label>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
});

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };