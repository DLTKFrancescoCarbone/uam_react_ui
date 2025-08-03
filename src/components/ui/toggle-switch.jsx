import React from 'react';

const ToggleSwitch = ({ checked, onChange, disabled = false, className = '' }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? 'bg-[#30659F] focus:ring-[#30659F]' : 'bg-gray-200 focus:ring-gray-300'}
        ${className}
      `}
    >
      <span
        className={`
          inline-block h-3 w-3 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export { ToggleSwitch };