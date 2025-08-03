import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RevoGrid, Template } from '@revolist/react-datagrid';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  CogIcon, 
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { mockRoles } from '../../data/mockRoles';
import RoleDetailPanel from './RoleDetailPanel';

const RolesTable = ({ className = '' }) => {
  const navigate = useNavigate();
  // Only include properties defined in columns to prevent extra columns
  const columnProps = [
    'id',
    'select',
    'name',
    'description',
    'composite',
    'userCount',
    'createdDate'
  ];
  const [roles, setRoles] = useState(
    mockRoles.map(role =>
      Object.fromEntries(
        Object.entries(role).filter(([key]) => columnProps.includes(key))
      )
    )
  );
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  // Handle role click to show detail panel
  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setShowDetailPanel(true);
  };

  // Handle closing detail panel
  const handleCloseDetailPanel = () => {
    setShowDetailPanel(false);
    setSelectedRole(null);
  };

  // Handle saving role changes
  const handleSaveRole = (updatedRole) => {
    setRoles(prevRoles => 
      prevRoles.map(role => 
        role.id === updatedRole.id ? updatedRole : role
      )
    );
  };

  // Type cell component with badge
  const TypeCell = ({ model, prop, value }) => {
    const isComposite = model.composite;
    return (
      <Badge 
        variant={isComposite ? 'purple' : 'cyan'}
        className="text-xs"
      >
        {isComposite ? 'Composite' : 'Simple'}
      </Badge>
    );
  };

  // Role name cell component - clickable link to role detail page
  const RoleNameCell = ({ model, prop, value }) => {
    const handleRoleNameClick = (e) => {
      e.preventDefault();
      navigate(`/roles/${model.id}`);
    };

    return (
      <button
        onClick={handleRoleNameClick}
        className="text-left text-blue-600 hover:text-blue-800 hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1 py-0.5 w-full text-left flex items-center gap-3"
        style={{ background: 'transparent', border: 'none' }}
      >
        <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
          <CogIcon className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium">
          {value}
        </span>
      </button>
    );
  };

  // Actions cell component
  const ActionsCell = ({ model, prop, value }) => (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleRoleClick(model)}
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
      prop: 'name',
      name: 'Role',
      size: 200,
      minSize: 200,
      autoSize: false,
      cellTemplate: Template(RoleNameCell),
      headerTemplate: Template(() => <HeaderTemplate name="Role" />)
    },
    {
      prop: 'description',
      name: 'Description',
      size: 600,
      minSize: 300,
      autoSize: false,
      headerTemplate: Template(() => <HeaderTemplate name="Description" />)
    },
    {
      prop: 'composite',
      name: 'Composite',
      size: 120,
      minSize: 120,
      autoSize: false,
      cellTemplate: Template(TypeCell),
      headerTemplate: Template(() => <HeaderTemplate name="Composite" />)
    },
    {
      prop: 'userCount',
      name: 'Users',
      size: 100,
      minSize: 100,
      autoSize: false,
      headerTemplate: Template(() => <HeaderTemplate name="Users" />)
    },
    {
      prop: 'createdDate',
      name: 'Created',
      size: 120,
      minSize: 120,
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
        source={roles}
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

      {/* Role Detail Panel */}
      {showDetailPanel && selectedRole && (
        <RoleDetailPanel
          role={selectedRole}
          onClose={handleCloseDetailPanel}
          onSave={handleSaveRole}
        />
      )}
    </div>
  );
};

export default RolesTable;
