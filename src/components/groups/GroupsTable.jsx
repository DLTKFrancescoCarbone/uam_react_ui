import React, { useState } from 'react';
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
  // Only include properties defined in columns to prevent extra columns
  const columnProps = [
    'select',
    'name',
    'department',
    'memberCount',
    'roleCount',
    'manager',
    'createdDate'
  ];
  const [filteredGroups] = useState(
    groups.map(group =>
      Object.fromEntries(
        Object.entries(group).filter(([key]) => columnProps.includes(key))
      )
    )
  );

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

  // Group name cell component - now read-only
  const GroupNameCell = ({ model, prop, value }) => (
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
        <UserGroupIcon className="h-4 w-4 text-primary" />
      </div>
      <span className="text-left font-medium">
        {value}
      </span>
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
      name: 'Group Name',
      size: 250,
      minSize: 200,
      autoSize: false,
      cellTemplate: Template(GroupNameCell),
      headerTemplate: Template(() => <HeaderTemplate name="Group Name" />)
    },
    {
      prop: 'department',
      name: 'Department',
      size: 150,
      minSize: 120,
      autoSize: false,
      cellTemplate: Template(DepartmentCell),
      headerTemplate: Template(() => <HeaderTemplate name="Department" />)
    },
    {
      prop: 'memberCount',
      name: 'Members',
      size: 100,
      minSize: 80,
      autoSize: false,
      headerTemplate: Template(() => <HeaderTemplate name="Members" />)
    },
    {
      prop: 'roleCount',
      name: 'Roles',
      size: 100,
      minSize: 80,
      autoSize: false,
      headerTemplate: Template(() => <HeaderTemplate name="Roles" />)
    },
    {
      prop: 'manager',
      name: 'Manager',
      size: 200,
      minSize: 150,
      autoSize: false,
      headerTemplate: Template(() => <HeaderTemplate name="Manager" />)
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
    <div className="flex-1 h-full flex flex-col revogrid-scrollable-container" style={{ minHeight: 0, width: '100%', overflowX: 'auto' }}>
      <div className="flex-1 h-full mb-5">
        <RevoGrid
          source={filteredGroups}
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
      </div>
    </div>
  );
};

export default GroupsTable;
