import React, { useState } from 'react';
import { RevoGrid, Template } from '@revolist/react-datagrid';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { mockUsers } from '../../data/mockUsers';
import UserDetailPanel from './UserDetailPanel';

const UserTable = ({ className = '' }) => {
  // Only include properties defined in columns to prevent extra columns
  const columnProps = [
    'id',
    'select',
    'username',
    'firstName',
    'lastName',
    'email',
    'status',
    'created'
  ];
  const [users, setUsers] = useState(
    mockUsers.map(user =>
      Object.fromEntries(
        Object.entries(user).filter(([key]) => columnProps.includes(key))
      )
    )
  );
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

  // Username cell component - now read-only
  const UsernameCell = ({ model, prop, value }) => (
    <span className="text-left">
      {value}
    </span>
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
        <TrashIcon className="h-4 w-4 text-gray-600" />
      </Button>
    </div>
  );

  // Header template for consistent background
  const HeaderTemplate = ({ name }) => (
    <div
      style={{
        background: '#EDF0F6',
        minHeight: '45px',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '8px',
        fontWeight: '600'
      }}
    >
      {name}
    </div>
  );

  // Column definitions
  const columns = [
    {
      prop: 'select',
      name: '',
      size: 50,
      minSize: 50,
      maxSize: 50,
      autoSize: false,
      cellTemplate: Template(() => (
        <input 
          type="checkbox" 
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      )),
      headerTemplate: Template(() => (
        <div
          style={{
            background: '#EDF0F6',
            minHeight: '45px',
            height: '100%',
            width: '100%',
          }}
        />
      ))
    },
    {
      prop: 'username',
      name: 'Username',
      size: 200,
      minSize: 150,
      autoSize: false,
      cellTemplate: Template(UsernameCell),
      headerTemplate: Template(() => <HeaderTemplate name="Username" />)
    },
    {
      prop: 'firstName',
      name: 'First Name',
      size: 150,
      minSize: 120,
      autoSize: false,
      headerTemplate: Template(() => <HeaderTemplate name="First Name" />)
    },
    {
      prop: 'lastName',
      name: 'Last Name',
      size: 150,
      minSize: 120,
      autoSize: false,
      headerTemplate: Template(() => <HeaderTemplate name="Last Name" />)
    },
    {
      prop: 'email',
      name: 'Email',
      size: 250,
      minSize: 200,
      autoSize: false,
      headerTemplate: Template(() => <HeaderTemplate name="Email" />)
    },
    {
      prop: 'status',
      name: 'Status',
      size: 120,
      minSize: 100,
      autoSize: false,
      cellTemplate: Template(StatusCell),
      headerTemplate: Template(() => <HeaderTemplate name="Status" />)
    },
    {
      prop: 'created',
      name: 'Created',
      size: 180,
      minSize: 160,
      autoSize: false,
      headerTemplate: Template(() => <HeaderTemplate name="Created" />)
    },
    {
      prop: 'actions',
      name: 'Actions',
      size: 120,
      minSize: 120,
      maxSize: 120,
      autoSize: false,
      cellTemplate: Template(ActionsCell),
      pin: 'colPinEnd',
      columnClass: 'actions-column',
      headerTemplate: Template(() => <HeaderTemplate name="Actions" />)
    }
  ];

  return (
    <div
      className={`flex-1 mb-5 h-full relative revogrid-scrollable-container ${className}`}
      style={{ minHeight: 0, width: '100%', overflowX: 'auto' }}
    >
      <RevoGrid
        source={users}
        columns={columns}
        theme="compact"
        resize={true}
        range={true}
        rowHeaders={true}
        rowSize={45}
        readonly={true}
        className="revogrid-container w-full h-full"
        autoSizeColumn={true}
        trimmedRows={false}
        exporting={true}
        useVirtualScrolling={true}
        stretch={true}
        height="100%"
        style={{ width: '100%' }}
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
