import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

const Tabs = ({ defaultValue, value, onValueChange, className = '', children, ...props }) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className = '', children, ...props }) => {
  const baseClasses = 'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground';
  
  return (
    <div
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, className = '', children, ...props }) => {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;
  
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  const activeClasses = isActive
    ? 'bg-background text-foreground shadow-sm'
    : 'hover:bg-muted hover:text-foreground';

  return (
    <button
      className={`${baseClasses} ${activeClasses} ${className}`}
      onClick={() => context?.onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className = '', children, ...props }) => {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;

  if (!isActive) return null;

  const baseClasses = 'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <div
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
