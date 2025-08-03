import React, { forwardRef } from 'react';

const FloatingLabelInput = forwardRef(({ 
  className = '', 
  type = 'text', 
  label, 
  id,
  value,
  error,
  disabled = false,
  readOnly = false,
  ...props 
}, ref) => {
  const inputId = id || `floating-input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Handle both controlled and uncontrolled inputs
  const inputProps = value !== undefined 
    ? { value: value || '' }  // Controlled - ensure empty string for empty values
    : {};  // Uncontrolled

  const isReadOnlyOrDisabled = disabled || readOnly;

  return (
    <div className="floating-label-input">
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={`peer ${error ? 'error' : ''} ${isReadOnlyOrDisabled ? 'readonly' : ''} ${className}`}
        placeholder=" "
        disabled={disabled}
        readOnly={readOnly}
        {...inputProps}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={`floating-label ${error ? 'error' : ''} ${isReadOnlyOrDisabled ? 'readonly' : ''}`}
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