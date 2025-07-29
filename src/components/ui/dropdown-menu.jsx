import React, { useState, useRef, useEffect } from 'react';

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen }) => {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8 shrink-0"
    >
      {children}
    </button>
  );
};

const DropdownMenuContent = ({ children, isOpen, align = 'end' }) => {
  if (!isOpen) return null;

  const alignmentClasses = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={`absolute top-full mt-1 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50 ${alignmentClasses[align]}`}>
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className = '', destructive = false }) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left ${destructive ? 'text-body focus:text-body' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const DropdownMenuSeparator = () => {
  return <div className="-mx-1 my-1 h-px bg-muted" />;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
