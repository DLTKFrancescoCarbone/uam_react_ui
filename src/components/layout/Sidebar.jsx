import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  RectangleGroupIcon, 
  UsersIcon, 
  CogIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { icon: RectangleGroupIcon, label: 'Dashboard', path: '/dashboard' },
    { icon: UsersIcon, label: 'Manage Users', path: '/users' },
    { icon: CogIcon, label: 'Manage Roles', path: '/roles' },
    { icon: UserGroupIcon, label: 'Manage Groups', path: '/groups' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside 
      className={`sidebar-container ${
        isHovered ? 'sidebar-expanded' : 'sidebar-collapsed'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {sidebarItems.map((item, index) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <button
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`sidebar-item ${
              isHovered ? 'sidebar-item-expanded' : 'sidebar-item-collapsed'
            } ${
              active ? 'sidebar-item-active' : 'sidebar-item-inactive'
            }`}
            title={!isHovered ? item.label : ''}
          >
            <Icon className="sidebar-item-icon" />
            {isHovered && (
              <span className="sidebar-item-label">
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
};

export default Sidebar;
