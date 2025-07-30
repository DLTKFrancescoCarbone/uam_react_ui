import React from 'react';
import { RevoGrid, Template } from '@revolist/react-datagrid';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { 
  UserGroupIcon, 
  PencilIcon,
  TrashIcon,
  UsersIcon,
  CogIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const GroupsTable = ({ 
  groups, 
  onEditGroup, 
  onDeleteGroup, 
  onViewMembers,
  onViewRoles 
}) => {
  // Helper function for department badge colors
  const getDepartmentColor = (department) => {
    const colors = {
      'Engineering': 'default',
      'Management': 'secondary',
      'Finance': 'outline',
      'IT': 'secondary',
      'Marketing': 'outline',
      'Construction': 'default'
    };
    return colors[department] || 'outline';
  };

  // Department cell component with colored badge
  const DepartmentCell = ({ model, prop, value }) => (
    <Badge variant={getDepartmentColor(value)} className="text-xs">
      {value}
    </Badge>
  );

  // Group name cell component
  const GroupNameCell = ({ model, prop, value }) => (
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
        <UserGroupIcon className="h-4 w-4 text-primary" />
      </div>
      <button 
        className="text-blue-600 hover:text-blue-800 underline text-left font-medium"
        onClick={() => onEditGroup(model.id)}
      >
        {value}
      </button>
    </div>
  );

  // Actions cell component
  const ActionsCell = ({ model, prop, value }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEditGroup(model.id)}>
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Group
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewMembers(model.id)}>
          <UsersIcon className="h-4 w-4 mr-2" />
          View Members
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewRoles(model.id)}>
          <CogIcon className="h-4 w-4 mr-2" />
          View Roles
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDeleteGroup(model.id)}
          className="text-destructive focus:text-destructive"
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete Group
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
      autoSize: true,
      cellTemplate: Template(() => (
        <input 
          type="checkbox" 
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ))
    },
    {
      prop: 'name',
      name: 'Group Name',
      size: 250,
      minSize: 200,
      autoSize: true,
      cellTemplate: Template(GroupNameCell)
    },
    {
      prop: 'department',
      name: 'Department',
      size: 150,
      minSize: 120,
      autoSize: true,
      cellTemplate: Template(DepartmentCell)
    },
    {
      prop: 'memberCount',
      name: 'Members',
      size: 100,
      minSize: 80,
      autoSize: true
    },
    {
      prop: 'roleCount',
      name: 'Roles',
      size: 100,
      minSize: 80,
      autoSize: true
    },
    {
      prop: 'manager',
      name: 'Manager',
      size: 200,
      minSize: 150,
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
      autoSize: true,
      cellTemplate: Template(ActionsCell)
    }
  ];

  return (
    <div className="w-full h-[calc(100vh-300px)] relative">
      <RevoGrid
        source={groups}
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
    </div>
  );
};

export default GroupsTable;
