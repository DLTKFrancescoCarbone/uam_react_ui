import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  UserPlusIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const currentUser = localStorage.getItem('currentUser') || 'AA';
  const initials = currentUser.split('@')[0].substring(0, 2).toUpperCase();

  return (
    <header className="w-full bg-card shadow-md px-6 py-4 fixed top-0 left-0 right-0 z-50 h-14">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="header-breadcrumb-icon">
            <ChevronRightIcon className="h-4 w-4" />
          </div>
          <h1 className="text-lg font-medium">User Access Management</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Avatar className="w-8 h-8 rounded">
            <AvatarFallback className="text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
