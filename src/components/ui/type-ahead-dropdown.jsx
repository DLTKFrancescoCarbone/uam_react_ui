import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './button';

const TypeAheadDropdown = ({ 
  items = [], 
  value = [], 
  onChange = () => {}, 
  placeholder = "Search and select...", 
  displayField = "name",
  searchFields = ["name"],
  multiple = true,
  className = "",
  disabled = false,
  maxHeight = "300px"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const triggerRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const filteredItems = items.filter(item => 
    searchFields.some(field => 
      item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const selectedItems = multiple ? value : (value ? [value] : []);
  const selectedIds = selectedItems.map(item => typeof item === 'object' ? item.id : item);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchTerm]);

  // Auto-scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex];
      if (focusedElement) {
        focusedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [focusedIndex]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredItems.length) {
          handleSelect(filteredItems[focusedIndex], e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      default:
        // No action for other keys
        break;
    }
  };

  const handleSelect = (item, event) => {
    if (multiple) {
      const isSelected = selectedIds.includes(item.id);
      const newValue = isSelected
        ? selectedItems.filter(selected => 
            (typeof selected === 'object' ? selected.id : selected) !== item.id
          )
        : [...selectedItems, item];
      onChange(newValue);
      
      // Keep dropdown open for multiple selection (MUI behavior)
      // Close only if not holding Ctrl/Cmd or on mobile
      if (!event?.ctrlKey && !event?.metaKey) {
        // Clear search but keep dropdown open for easier multi-selection
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    } else {
      onChange(item);
      setIsOpen(false);
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  };

  const handleRemove = (item, e) => {
    e.stopPropagation();
    if (multiple) {
      const newValue = selectedItems.filter(selected => 
        (typeof selected === 'object' ? selected.id : selected) !== item.id
      );
      onChange(newValue);
    } else {
      onChange(null);
    }
  };

  const getDisplayText = () => {
    if (selectedItems.length === 0) {
      return placeholder;
    }
    if (multiple) {
      return `${selectedItems.length} selected`;
    }
    return selectedItems[0][displayField] || selectedItems[0];
  };

  const handleCloseDropdown = () => {
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full justify-between text-left font-normal ${
          selectedItems.length === 0 ? 'text-muted-foreground' : 'text-foreground'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="truncate">{getDisplayText()}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 shrink-0" />
        )}
      </Button>

      {/* Selected Items Display */}
      {multiple && selectedItems.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedItems.map(item => (
            <span
              key={typeof item === 'object' ? item.id : item}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
            >
              {typeof item === 'object' ? item[displayField] : item}
              <button
                type="button"
                onClick={(e) => handleRemove(item, e)}
                className="text-muted-foreground hover:text-primary ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Portal */}
      {isOpen && createPortal(
        <div 
          className="fixed bg-white border border-border rounded-md shadow-lg z-[9999]"
          style={{
            top: dropdownPosition.top + 4,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxHeight: maxHeight
          }}
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between p-2 border-b bg-gray-50">
            <span className="text-sm font-medium text-muted-foreground">
              {filteredItems.length} option{filteredItems.length !== 1 ? 's' : ''} available
            </span>
            <button
              type="button"
              onClick={handleCloseDropdown}
              className="p-1 hover:bg-gray-200 rounded-md transition-colors"
              title="Close dropdown"
            >
              <XMarkIcon className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-2 border-b">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to search..."
              className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
          </div>

          {/* Options List */}
          <div 
            ref={listRef}
            className="max-h-64 overflow-y-auto"
            style={{ maxHeight }}
          >
            {filteredItems.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                No items found
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);
                const isFocused = index === focusedIndex;
                
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={(e) => handleSelect(item, e)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                      isFocused ? 'bg-gray-100' : ''
                    } ${isSelected ? 'bg-primary/10' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {item[displayField]}
                        </div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground truncate mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <CheckIcon className="h-4 w-4 text-primary shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TypeAheadDropdown;