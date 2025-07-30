import React from 'react';
import { RevoGrid, Template } from '@revolist/react-datagrid';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { 
  CogIcon, 
  PencilIcon,
  TrashIcon,
  UsersIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const RolesTable = ({ 
  roles, 
  onEditRole, 
  onDeleteRole, 
  onViewUsers 
}) => {
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

  // Role name cell component
  const RoleNameCell = ({ model, prop, value }) => (
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
        <CogIcon className="h-4 w-4 text-primary" />
      </div>
      <button 
        className="text-blue-600 hover:text-blue-800 underline text-left font-medium"
        onClick={() => onEditRole(model.id)}
      >
        {value}
      </button>
    </div>
  );


  // Actions cell component
  const ActionsCell = ({ model, prop, value }) => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
          <EllipsisVerticalIcon className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEditRole(model.id)}>
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Role
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewUsers(model.id)}>
          <UsersIcon className="h-4 w-4 mr-2" />
          View Users
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDeleteRole(model.id)}
          className="text-destructive focus:text-destructive"
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete Role
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Column definitions
  const columns = [
    {
      prop: 'select',
      name: '',
      size: 50,
      minSize: 50,
      cellTemplate: Template(() => (
        <input 
          type="checkbox" 
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ))
    },
    {
      prop: 'name',
      name: 'Role Name',
      size: 200,
      minSize: 200,
      autoSize: true,
      cellTemplate: Template(RoleNameCell)
    },
    {
      prop: 'description',
      name: 'Description',
      size: 600,
      minSize: 300,
      autoSize: true
    },
    {
      prop: 'composite',
      name: 'Type',
      size: 120,
      minSize: 120,
      autoSize: true,
      cellTemplate: Template(TypeCell)
    },
    {
      prop: 'userCount',
      name: 'Users',
      size: 100,
      minSize: 100,
      autoSize: true
    },
    {
      prop: 'createdDate',
      name: 'Created',
      size: 120,
      minSize: 120,
      autoSize: true
    },
    {
      prop: 'actions',
      name: 'Actions',
      size: 120,
      minSize: 120,
      cellTemplate: Template(ActionsCell)
    }
  ];

  return (
    <div className="w-full h-[calc(100vh-300px)] relative">
      <RevoGrid
        source={roles}
        columns={columns}
        theme="compact"
        resize={true}
        range={true}
        rowHeaders={true}
        rowSize={45}
        readonly={true}
        className="revogrid-container"
        autoSizeColumn={true}
      />
    </div>
  );
};

export default RolesTable;
