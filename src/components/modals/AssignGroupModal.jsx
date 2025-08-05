import React, { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../ui/modal';
import { Button } from '../ui/button';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { mockGroups } from '../../data/mockGroups';

const AssignGroupModal = ({ 
  isOpen, 
  onClose, 
  onAssign, 
  targetType = 'user', // 'user', 'role', or 'group'
  targetName = '',
  excludeGroupIds = [] // Groups to exclude from selection (e.g., groups user already belongs to)
}) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter out excluded groups and apply search
  const availableGroups = mockGroups
    .filter(group => !excludeGroupIds.includes(group.id))
    .filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAssign = async () => {
    if (selectedGroups.length === 0) return;

    setIsLoading(true);
    try {
      // Get the actual group objects for selected IDs
      const selectedGroupObjects = availableGroups.filter(group => 
        selectedGroups.includes(group.id)
      );
      
      // Call the onAssign callback with selected group objects
      await onAssign(selectedGroupObjects);
      
      // Reset state and close modal
      setSelectedGroups([]);
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error assigning groups:', error);
      // Handle error (could show toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedGroups([]);
    setSearchTerm('');
    onClose();
  };

  const handleGroupToggle = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSelectAll = () => {
    if (selectedGroups.length === availableGroups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(availableGroups.map(group => group.id));
    }
  };

  const getModalTitle = () => {
    switch (targetType) {
      case 'user':
        return `Assign Groups to ${targetName}`;
      case 'role':
        return `Assign Groups to Role: ${targetName}`;
      case 'group':
        return `Assign Groups to Group: ${targetName}`;
      default:
        return 'Assign Groups';
    }
  };

  const getModalDescription = () => {
    switch (targetType) {
      case 'user':
        return `Select one or more groups to assign to user ${targetName}. The user will inherit all permissions and access rights from the selected groups.`;
      case 'role':
        return `Select one or more groups to assign to the role ${targetName}. All users with this role will be added to the selected groups.`;
      case 'group':
        return `Select one or more groups to create relationships with ${targetName}.`;
      default:
        return 'Select groups to assign.';
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
            <UserGroupIcon className="h-5 w-5 text-primary" />
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
            Search Groups
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, description, or department..."
            className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
        </div>

        {/* Groups Table */}
        <div className="flex-1 min-h-0">
          <div className="border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b">
              <div className="flex items-center p-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedGroups.length === availableGroups.length && availableGroups.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    Select All ({availableGroups.length} groups)
                  </span>
                </div>
                {selectedGroups.length > 0 && (
                  <span className="text-sm text-primary ml-auto">
                    {selectedGroups.length} selected
                  </span>
                )}
              </div>
            </div>

            {/* Table Content - Scrollable */}
            <div className="max-h-80 overflow-y-auto">
              {availableGroups.length === 0 ? (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <div className="text-sm text-muted-foreground">
                    {searchTerm ? 'No groups match your search' : 'No groups available for assignment'}
                  </div>
                </div>
              ) : (
                availableGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-start gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleGroupToggle(group.id)}
                  >
                    <div className="flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.id)}
                        onChange={() => handleGroupToggle(group.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <UserGroupIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{group.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {group.description}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                        <span>{group.department}</span>
                        <span>•</span>
                        <span>{group.memberCount} members</span>
                        <span>•</span>
                        <span>{group.roleCount} roles</span>
                      </div>
                    </div>
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
          disabled={selectedGroups.length === 0 || isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? 'Assigning...' : `Assign ${selectedGroups.length} Group${selectedGroups.length !== 1 ? 's' : ''}`}
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

export default AssignGroupModal;