import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from './button';

const MultiSelectDropdown = ({ 
  options = [], 
  selectedValues = [], 
  onChange, 
  placeholder = "Select options...",
  label,
  className = "",
  maxDisplayItems = 2
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    onChange(newSelected);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    
    if (selectedValues.length <= maxDisplayItems) {
      const selectedOptions = options.filter(opt => selectedValues.includes(opt.value));
      return selectedOptions.map(opt => opt.label).join(', ');
    }
    
    return `${selectedValues.length} selected`;
  };

  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="justify-between w-[180px] h-8"
      >
        <span className="text-sm truncate">{getDisplayText()}</span>
        <div className="flex items-center gap-1">
          {selectedValues.length > 0 && (
            <button
              onClick={clearAll}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
              title="Clear all"
            >
              <span className="h-4 w-4 flex items-center justify-center text-sm font-bold">
                ×
              </span>
            </button>
          )}
          <ChevronDownIcon 
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] max-w-[300px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2 space-y-1">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm flex items-center gap-3 ${
                    isSelected 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary pointer-events-none"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <span>{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-gray-500 mt-0.5">
                        {option.description}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            {options.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;