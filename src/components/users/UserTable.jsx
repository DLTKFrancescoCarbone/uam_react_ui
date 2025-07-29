import React, { useState, useMemo, useCallback } from 'react';
import { RevoGrid } from '@revolist/react-datagrid';
import { mockUsers } from '../../data/mockUsers';
import UserDetailPanel from './UserDetailPanel';

const UserTable = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  // Handle row selection
  const handleRowSelect = useCallback((rowIndex, isSelected) => {
    const newSelectedRows = new Set(selectedRows);
    if (isSelected) {
      newSelectedRows.add(rowIndex);
    } else {
      newSelectedRows.delete(rowIndex);
    }
    setSelectedRows(newSelectedRows);
  }, [selectedRows]);

  // Handle select all
  const handleSelectAll = useCallback((isSelected) => {
    if (isSelected) {
      setSelectedRows(new Set(users.map((_, index) => index)));
    } else {
      setSelectedRows(new Set());
    }
  }, [users]);

  // Handle user click to show detail panel
  const handleUserClick = useCallback((user) => {
    setSelectedUser(user);
    setShowDetailPanel(true);
  }, []);

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

  // Column definitions with proper RevoGrid format
  const columns = useMemo(() => [
    {
      prop: 'select',
      name: '',
      size: 50,
      pin: 'colPinStart',
      columnType: 'rowHeaders',
      cellTemplate: (createElement, props) => {
        const isSelected = selectedRows.has(props.rowIndex);
        return createElement('input', {
          type: 'checkbox',
          className: 'checkbox checkbox-primary',
          checked: isSelected,
          onChange: (e) => handleRowSelect(props.rowIndex, e.target.checked)
        });
      },
      headerTemplate: (createElement) => {
        const allSelected = users.length > 0 && selectedRows.size === users.length;
        const someSelected = selectedRows.size > 0 && selectedRows.size < users.length;
        return createElement('input', {
          type: 'checkbox',
          className: 'checkbox checkbox-primary',
          checked: allSelected,
          ref: (el) => {
            if (el) el.indeterminate = someSelected;
          },
          onChange: (e) => handleSelectAll(e.target.checked)
        });
      }
    },
    {
      prop: 'username',
      name: 'Username',
      size: 150,
      cellTemplate: (createElement, props) => {
        return createElement('button', {
          className: 'text-primary hover:text-primary/80 underline text-left w-full font-medium',
          onClick: () => {
            handleUserClick(props.model);
          }
        }, props.model.username);
      }
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
      cellTemplate: (createElement, props) => {
        const isActive = props.model.status === 'Active';
        return createElement('span', {
          className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            isActive 
              ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' 
              : 'text-foreground'
          }`
        }, props.model.status);
      }
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
      cellTemplate: (createElement, props) => {
        return createElement('div', {
          className: 'flex items-center gap-1'
        }, [
          createElement('button', {
            key: 'view',
            className: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8',
            onClick: () => {
              console.log('View user:', props.model);
              alert(`Viewing user: ${props.model.username}`);
            },
            title: 'View user'
          }, createElement('svg', {
            className: 'h-4 w-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
            strokeWidth: 2
          }, [
            createElement('path', {
              key: 'path1',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            }),
            createElement('path', {
              key: 'path2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              d: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
            })
          ])),
          createElement('button', {
            key: 'edit',
            className: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8',
            onClick: () => {
              console.log('Edit user:', props.model);
              alert(`Editing user: ${props.model.username}`);
            },
            title: 'Edit user'
          }, createElement('svg', {
            className: 'h-4 w-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
            strokeWidth: 2
          }, createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            d: 'm16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
          }))),
          createElement('button', {
            key: 'delete',
            className: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-destructive hover:text-destructive-foreground h-8 w-8 text-destructive',
            onClick: () => {
              console.log('Delete user:', props.model);
              if (window.confirm(`Are you sure you want to delete user: ${props.model.username}?`)) {
                alert(`User ${props.model.username} would be deleted`);
              }
            },
            title: 'Delete user'
          }, createElement('svg', {
            className: 'h-4 w-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
            strokeWidth: 2
          }, createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            d: 'm14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
          })))
        ]);
      }
    }
  ], [selectedRows, users.length, handleUserClick, handleRowSelect, handleSelectAll]);

  return (
    <div className="w-full relative">
      <RevoGrid
        source={users}
        columns={columns}
        theme="compact"
        resize={true}
        range={false}
        rowHeaders={false}
        rowSize={45}
        readonly={false}
        canFocus={true}
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
