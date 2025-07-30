import React from 'react';
import { Button } from './button';
import { Squares2X2Icon, TableCellsIcon } from '@heroicons/react/24/outline';

const ViewToggle = ({ viewMode, onViewModeChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 bg-muted rounded-lg p-1 ${className}`}>
      <Button 
        variant={viewMode === 'card' ? 'default' : 'ghost'} 
        size="sm"
        className="h-8 px-3"
        onClick={() => onViewModeChange('card')}
      >
        <Squares2X2Icon className="h-4 w-4" />
      </Button>
      <Button 
        variant={viewMode === 'table' ? 'default' : 'ghost'} 
        size="sm"
        className="h-8 px-3"
        onClick={() => onViewModeChange('table')}
      >
        <TableCellsIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
