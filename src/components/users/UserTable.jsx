import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RevoGrid, Template } from '@revolist/react-datagrid';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { mockUsers } from '../../data/mockUsers';
import UserDetailPanel from './UserDetailPanel';

const UserTable = ({ className = '' }) => {
  const navigate = useNavigate();
  const [isTablet, setIsTablet] = useState(false);
  
  // Check if we're on tablet/mobile
  useEffect(() => {
    const checkIsTablet = () => {
      setIsTablet(window.innerWidth < 1024); // Below lg breakpoint
    };
    
    checkIsTablet();
    window.addEventListener('resize', checkIsTablet);
    return () => window.removeEventListener('resize', checkIsTablet);
  }, []);
  
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
    const getStatusVariant = (status) => {
      switch (status.toLowerCase()) {
        case 'active':
          return 'success';
        case 'inactive':
          return 'secondary';
        case 'pending':
          return 'warning';
        case 'suspended':
          return 'error';
        default:
          return 'secondary';
      }
    };

    return (
      <Badge variant={getStatusVariant(value)}>
        {value}
      </Badge>
    );
  };

  // Username cell component - clickable link to user detail page
  const UsernameCell = ({ model, prop, value }) => {
    const handleUsernameClick = (e) => {
      e.preventDefault();
      navigate(`/users/${model.id}`);
    };

    return (
      <button
        onClick={handleUsernameClick}
        className="text-left text-blue-600 hover:text-blue-800 hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1 py-0.5 w-full text-left"
        style={{ background: 'transparent', border: 'none' }}
      >
        {value}
      </button>
    );
  };

  // Actions cell component with tablet-friendly touch targets
  const ActionsCell = ({ model, prop, value }) => (
    <div className="flex items-center space-x-1">
      <Button 
        variant="ghost" 
        size={isTablet ? "sm" : "icon"}
        className={isTablet ? "min-h-[44px] px-3" : ""}
        onClick={() => handleUserClick(model)}
      >
        <EyeIcon className={`${isTablet ? "h-5 w-5" : "h-4 w-4"} text-gray-600`} />
      </Button>
      <Button 
        variant="ghost" 
        size={isTablet ? "sm" : "icon"}
        className={isTablet ? "min-h-[44px] px-3" : ""}
      >
        <TrashIcon className={`${isTablet ? "h-5 w-5" : "h-4 w-4"} text-gray-600`} />
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

  // Responsive column definitions
  const getColumns = () => {
    const baseColumns = [
      {
        prop: 'select',
        name: '',
        size: isTablet ? 60 : 50,
        minSize: isTablet ? 60 : 50,
        maxSize: isTablet ? 60 : 50,
        autoSize: false,
        cellTemplate: Template(() => (
          <input 
            type="checkbox" 
            className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${isTablet ? 'w-5 h-5' : 'w-4 h-4'}`}
          />
        )),
        headerTemplate: Template(() => (
          <div
            style={{
              background: '#EDF0F6',
              minHeight: isTablet ? '50px' : '45px',
              height: '100%',
              width: '100%',
            }}
          />
        ))
      },
      {
        prop: 'username',
        name: 'Username',
        size: isTablet ? 160 : 200,
        minSize: isTablet ? 140 : 150,
        autoSize: false,
        cellTemplate: Template(UsernameCell),
        headerTemplate: Template(() => <HeaderTemplate name="Username" />)
      },
      {
        prop: 'email',
        name: 'Email',
        size: isTablet ? 200 : 250,
        minSize: isTablet ? 180 : 200,
        autoSize: false,
        headerTemplate: Template(() => <HeaderTemplate name="Email" />)
      },
      {
        prop: 'status',
        name: 'Status',
        size: isTablet ? 100 : 120,
        minSize: isTablet ? 90 : 100,
        autoSize: false,
        cellTemplate: Template(StatusCell),
        headerTemplate: Template(() => <HeaderTemplate name="Status" />)
      },
      {
        prop: 'actions',
        name: 'Actions',
        size: isTablet ? 140 : 120,
        minSize: isTablet ? 140 : 120,
        maxSize: isTablet ? 140 : 120,
        autoSize: false,
        cellTemplate: Template(ActionsCell),
        pin: 'colPinEnd',
        columnClass: 'actions-column',
        headerTemplate: Template(() => <HeaderTemplate name="Actions" />)
      }
    ];

    // Add name columns only on desktop
    if (!isTablet) {
      baseColumns.splice(2, 0, 
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
        }
      );
      
      // Add created column only on desktop
      baseColumns.splice(-1, 0, {
        prop: 'created',
        name: 'Created',
        size: 180,
        minSize: 160,
        autoSize: false,
        headerTemplate: Template(() => <HeaderTemplate name="Created" />)
      });
    }

    return baseColumns;
  };

  const columns = getColumns();

  return (
    <div
      className={`flex-1 mb-5 h-full relative revogrid-scrollable-container ${className}`}
      style={{ minHeight: 0, width: '100%', overflowX: 'auto' }}
    >
      <RevoGrid
        source={users}
        columns={columns}
        theme="compact"
        resize={!isTablet}
        range={!isTablet}
        rowHeaders={!isTablet}
        rowSize={isTablet ? 55 : 45}
        readonly={true}
        className="revogrid-container w-full h-full"
        autoSizeColumn={isTablet}
        trimmedRows={false}
        exporting={!isTablet}
        useVirtualScrolling={true}
        stretch={true}
        height="100%"
        style={{ width: '100%', minWidth: isTablet ? '100%' : 'auto' }}
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
