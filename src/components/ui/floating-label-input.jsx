import React, { useState, forwardRef } from 'react';

const FloatingLabelInput = forwardRef(({ 
  className = '', 
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
    <div className="floating-label-input">
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={`${error ? 'error' : ''} ${className}`}
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
        className={`${isFloating ? 'floating' : ''} ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}
      >
        {label}
      </label>
      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
});

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };