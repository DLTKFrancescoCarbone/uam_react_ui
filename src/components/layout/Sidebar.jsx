import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  RectangleGroupIcon, 
  UsersIcon, 
  CogIcon, 
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 834); // Below tablet breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const sidebarItems = [
    { icon: RectangleGroupIcon, label: 'Dashboard', path: '/dashboard' },
    { icon: UsersIcon, label: 'Manage Users', path: '/users' },
    { icon: CogIcon, label: 'Manage Roles', path: '/roles' },
    { icon: UserGroupIcon, label: 'Manage Groups', path: '/groups' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-0 left-6 z-[60] h-14 flex items-center rounded-md bg-transparent tablet:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? (
            <XMarkIcon className="h-3.5 w-3.5 text-gray-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      )}

      {/* Mobile Backdrop */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 tablet:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar-container ${
          isMobile 
            ? isMobileOpen 
              ? 'sidebar-mobile-open' 
              : 'sidebar-mobile-closed'
            : isHovered 
              ? 'sidebar-expanded' 
              : 'sidebar-collapsed'
        }`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const isExpanded = isMobile ? isMobileOpen : isHovered;
          
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`sidebar-item ${
                isExpanded ? 'sidebar-item-expanded' : 'sidebar-item-collapsed'
              } ${
                active ? 'sidebar-item-active' : 'sidebar-item-inactive'
              }`}
              title={!isExpanded ? item.label : ''}
            >
              <Icon className="sidebar-item-icon" />
              {isExpanded && (
                <span className="sidebar-item-label">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </aside>
    </>
  );
};

export default Sidebar;
