import React, { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../ui/modal';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { UserIcon } from '@heroicons/react/24/outline';
import { mockUsers } from '../../data/mockUsers';

const AssignUserModal = ({ 
  isOpen, 
  onClose, 
  onAssign, 
  targetType = 'group', // 'group' or 'role'
  targetName = '',
  excludeUserIds = [] // Users to exclude from selection (e.g., users already in the group/role)
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter out excluded users and apply search
  const availableUsers = mockUsers
    .filter(user => !excludeUserIds.includes(user.id))
    .filter(user => 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAssign = async () => {
    if (selectedUsers.length === 0) return;

    setIsLoading(true);
    try {
      // Get the actual user objects for selected IDs
      const selectedUserObjects = availableUsers.filter(user => 
        selectedUsers.includes(user.id)
      );
      
      // Call the onAssign callback with selected user objects
      await onAssign(selectedUserObjects);
      
      // Reset state and close modal
      setSelectedUsers([]);
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error assigning users:', error);
      // Handle error (could show toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedUsers([]);
    setSearchTerm('');
    onClose();
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === availableUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(availableUsers.map(user => user.id));
    }
  };

  const getModalTitle = () => {
    switch (targetType) {
      case 'group':
        return `Assign Users to ${targetName}`;
      case 'role':
        return `Assign Users to Role: ${targetName}`;
      default:
        return 'Assign Users';
    }
  };

  const getModalDescription = () => {
    switch (targetType) {
      case 'group':
        return `Select one or more users to add to the group ${targetName}. Users will gain access to all resources and permissions associated with this group.`;
      case 'role':
        return `Select one or more users to assign the role ${targetName}. Users will inherit all permissions and access rights from this role.`;
      default:
        return 'Select users to assign.';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleCancel}
      className="max-w-lg tablet:max-w-2xl w-full max-h-[80vh] h-[80vh] flex flex-col mx-4 tablet:mx-0"
    >
      <ModalHeader onClose={handleCancel}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <ModalTitle>{getModalTitle()}</ModalTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getModalDescription()}
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalContent className="space-y-4 flex-1 flex flex-col">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Search Users
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, username, or email..."
            className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
        </div>

        {/* Users Table */}
        <div className="flex-1 min-h-0">
          <div className="border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b">
              <div className="flex items-center p-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === availableUsers.length && availableUsers.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    Select All ({availableUsers.length} users)
                  </span>
                </div>
                {selectedUsers.length > 0 && (
                  <span className="text-sm text-primary ml-auto">
                    {selectedUsers.length} selected
                  </span>
                )}
              </div>
            </div>

            {/* Table Content - Scrollable */}
            <div className="max-h-80 overflow-y-auto">
              {availableUsers.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <div className="text-sm text-muted-foreground">
                    {searchTerm ? 'No users match your search' : 'No users available for assignment'}
                  </div>
                </div>
              ) : (
                availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserToggle(user.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserToggle(user.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.username} • {user.email}
                      </div>
                    </div>
                    <Badge 
                      variant={user.status === 'Active' ? 'success' : 'secondary'}
                      className="shrink-0"
                    >
                      {user.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <Button
          onClick={handleAssign}
          disabled={selectedUsers.length === 0 || isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? 'Assigning...' : `Assign ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}`}
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AssignUserModal;