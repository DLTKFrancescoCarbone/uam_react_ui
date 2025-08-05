import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { 
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const currentUser = localStorage.getItem('currentUser') || 'AA';
  const initials = currentUser.split('@')[0].substring(0, 2).toUpperCase();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 834); // Below tablet breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <header className="w-full bg-card shadow-md px-6 py-4 fixed top-0 left-0 right-0 z-50 h-14">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isMobile ? 'ml-10' : ''}`}>
          <img 
            src="/bluechevron.svg" 
            alt="Logo" 
            className="h-6 w-auto"
          />
          <h1 className="text-lg font-medium text-header">User Access Management</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="w-8 h-8 rounded">
                <AvatarFallback className="text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} destructive>
                <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
