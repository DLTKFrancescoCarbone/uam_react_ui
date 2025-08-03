import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const tabs = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Users', path: '/users' },
    { name: 'Roles', path: '/roles' },
    { name: 'Groups', path: '/groups' }
  ];

  const getActiveTab = () => {
    return tabs.find(tab => 
      location.pathname === tab.path || location.pathname.startsWith(tab.path + '/')
    );
  };

  const activeTab = getActiveTab();

  if (!activeTab) {
    return null;
  }

  return (
    <footer className="w-full border-t border-gray-200 px-6 py-3 fixed bottom-0 left-0 right-0 footer-background">
      <div className="flex justify-start">
        <div className="px-4 py-2 text-sm font-medium border-b-2 border-blue-500 text-white">
          {activeTab.name}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
