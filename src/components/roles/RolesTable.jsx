import React, { useState } from 'react';
import { RevoGrid, Template } from '@revolist/react-datagrid';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  CogIcon, 
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const RolesTable = ({ 
  roles, 
  onEditRole, 
  onDeleteRole, 
  onViewUsers 
}) => {
  // Only include properties defined in columns to prevent extra columns
  const columnProps = [
    'select',
    'name',
    'description',
    'composite',
    'userCount',
    'createdDate'
  ];
  const [filteredRoles] = useState(
    roles.map(role =>
      Object.fromEntries(
        Object.entries(role).filter(([key]) => columnProps.includes(key))
      )
    )
  );

  // Type cell component with badge
  const TypeCell = ({ model, prop, value }) => {
    const isComposite = model.composite;
    return (
      <Badge 
        variant={isComposite ? 'secondary' : 'outline'}
        className="text-xs"
      >
        {isComposite ? 'Composite' : 'Simple'}
      </Badge>
    );
  };

  // Role name cell component - now read-only
  const RoleNameCell = ({ model, prop, value }) => (
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
        <CogIcon className="h-4 w-4 text-primary" />
      </div>
      <span className="text-left font-medium">
        {value}
      </span>
    </div>
  );

  // Actions cell component
  const ActionsCell = ({ model, prop, value }) => (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onEditRole(model.id)}
      >
        <EyeIcon className="h-4 w-4 text-gray-600" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onDeleteRole(model.id)}
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
      name: 'Role Name',
      size: 200,
      minSize: 200,
      autoSize: false,
      cellTemplate: Template(RoleNameCell),
      headerTemplate: Template(() => <HeaderTemplate name="Role Name" />)
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
      name: 'Type',
      size: 120,
      minSize: 120,
      autoSize: false,
      cellTemplate: Template(TypeCell),
      headerTemplate: Template(() => <HeaderTemplate name="Type" />)
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
      className={`flex-1 mb-5 h-full relative revogrid-scrollable-container`}
      style={{ minHeight: 0, width: '100%', overflowX: 'auto' }}
    >
      <RevoGrid
        source={filteredRoles}
        columns={columns}
        theme="compact"
        resize={true}
        range={true}
        rowHeaders={true}
        rowSize={45}
        readonly={true}
        className="revogrid-container w-full h-full"
        autoSizeColumn={true}
        useVirtualScrolling={true}
        stretch={true}
        height="100%"
        trimmedRows={false}
        exporting={true}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default RolesTable;
