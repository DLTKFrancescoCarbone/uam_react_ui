import React, { useState } from 'react';
import { RevoGrid, Template } from '@revolist/react-datagrid';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { mockUsers } from '../../data/mockUsers';
import UserDetailPanel from './UserDetailPanel';

const UserTable = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  // Handle user click to show detail panel
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowDetailPanel(true);
  };

  // Handle closing detail panel
  const handleCloseDetailPanel = () => {
    setShowDetailPanel(false);
    setSelectedUser(null);
  };

  // Handle saving user changes
  const handleSaveUser = (updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  // Status cell component
  const StatusCell = ({ model, prop, value }) => {
    const isActive = value === 'Active';
    return (
      <Badge 
        variant={isActive ? 'default' : 'secondary'}
        className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
      >
        {value}
      </Badge>
    );
  };

  // Username cell component
  const UsernameCell = ({ model, prop, value }) => (
    <button 
      className="text-blue-600 hover:text-blue-800 underline text-left"
      onClick={() => handleUserClick(model)}
    >
      {value}
    </button>
  );

  // Actions cell component
  const ActionsCell = ({ model, prop, value }) => (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleUserClick(model)}
      >
        <EyeIcon className="h-4 w-4 text-gray-600" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
      >
        <PencilIcon className="h-4 w-4 text-gray-600" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
      >
        <TrashIcon className="h-4 w-4 text-gray-600" />
      </Button>
    </div>
  );

  // Column definitions
  const columns = [
    {
      prop: 'select',
      name: '',
      size: 50,
      minSize: 50,
      autoSize: true,
      cellTemplate: Template(() => (
        <input 
          type="checkbox" 
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ))
    },
    {
      prop: 'username',
      name: 'Username',
      size: 150,
      minSize: 150,
      autoSize: true,
      cellTemplate: Template(UsernameCell)
    },
    {
      prop: 'firstName',
      name: 'First Name',
      size: 150,
      minSize: 150,
      autoSize: true
    },
    {
      prop: 'lastName',
      name: 'Last Name',
      size: 150,
      minSize: 150,
      autoSize: true
    },
    {
      prop: 'email',
      name: 'Email',
      size: 250,
      minSize: 200,
      autoSize: true
    },
    {
      prop: 'status',
      name: 'Status',
      size: 100,
      minSize: 100,
      autoSize: true,
      cellTemplate: Template(StatusCell)
    },
    {
      prop: 'created',
      name: 'Created',
      size: 180,
      minSize: 180,
      autoSize: true
    },
    {
      prop: 'actions',
      name: 'Actions',
      size: 120,
      minSize: 120,
      autoSize: true,
      cellTemplate: Template(ActionsCell)
    }
  ];

  return (
    <div className="w-full h-[calc(100vh-300px)] relative">
      <RevoGrid
        source={users}
        columns={columns}
        theme="compact"
        resize={true}
        range={true}
        rowHeaders={true}
        rowSize={45}
        readonly={true}
        className="revogrid-container"
        autoSizeColumn={true}
        trimmedRows={false}
        exporting={true}
      />
      
      {/* User Detail Panel */}
      {showDetailPanel && selectedUser && (
        <UserDetailPanel
          user={selectedUser}
          onClose={handleCloseDetailPanel}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UserTable;
