import React from 'react';
import { Button } from './button';
import { TableCellsIcon, ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const ViewToggle = ({ viewMode, onViewModeChange, className = '', options = ['list', 'table'] }) => {
  // Handle different toggle types based on options
  const getIcon = (option) => {
    switch (option) {
      case 'card':
        return <Squares2X2Icon className="h-4 w-4 tablet:h-5 tablet:w-5" />;
      case 'list':
        return <ListBulletIcon className="h-4 w-4 tablet:h-5 tablet:w-5" />;
      case 'table':
        return <TableCellsIcon className="h-4 w-4 tablet:h-5 tablet:w-5" />;
      default:
        return <ListBulletIcon className="h-4 w-4 tablet:h-5 tablet:w-5" />;
    }
  };

  return (
    <div className={`flex items-center gap-1 bg-muted rounded-lg p-1 ${className}`}>
      {options.map((option) => (
        <Button 
          key={option}
          variant={viewMode === option ? 'default' : 'ghost'} 
          size="sm"
          className="h-8 px-3 tablet:h-11 tablet:px-4 tablet:min-w-[44px]"
          onClick={() => onViewModeChange(option)}
        >
          {getIcon(option)}
        </Button>
      ))}
    </div>
  );
};

export default ViewToggle;
