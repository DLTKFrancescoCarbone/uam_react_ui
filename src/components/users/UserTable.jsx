import React, { useState } from 'react';
import { RevoGrid, Template } from '@revolist/react-datagrid';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
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
        size="sm" 
        className="h-8 w-8 p-0"
        onClick={() => handleUserClick(model)}
      >
        <Eye size={16} className="text-gray-600" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Edit size={16} className="text-gray-600" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Trash2 size={16} className="text-gray-600" />
      </Button>
    </div>
  );

  // Column definitions
  const columns = [
    {
      prop: 'select',
      name: '',
      size: 50,
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
      cellTemplate: Template(UsernameCell)
    },
    {
      prop: 'firstName',
      name: 'First Name',
      size: 150
    },
    {
      prop: 'lastName',
      name: 'Last Name',
      size: 150
    },
    {
      prop: 'email',
      name: 'Email',
      size: 250
    },
    {
      prop: 'status',
      name: 'Status',
      size: 100,
      cellTemplate: Template(StatusCell)
    },
    {
      prop: 'created',
      name: 'Created',
      size: 180
    },
    {
      prop: 'actions',
      name: 'Actions',
      size: 120,
      cellTemplate: Template(ActionsCell)
    }
  ];

  return (
    <div className="w-full relative">
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
