import React, { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../ui/modal';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CogIcon } from '@heroicons/react/24/outline';
import { mockRoles } from '../../data/mockRoles';

const AssignRoleModal = ({ 
  isOpen, 
  onClose, 
  onAssign, 
  targetType = 'user', // 'user' or 'group'
  targetName = '',
  excludeRoleIds = [] // Roles to exclude from selection (e.g., roles user already has)
}) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter out excluded roles and apply search
  const availableRoles = mockRoles
    .filter(role => !excludeRoleIds.includes(role.id))
    .filter(role => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.attributes?.department && role.attributes.department.some(dept => 
        dept.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );

  const handleAssign = async () => {
    if (selectedRoles.length === 0) return;

    setIsLoading(true);
    try {
      // Get the actual role objects for selected IDs
      const selectedRoleObjects = availableRoles.filter(role => 
        selectedRoles.includes(role.id)
      );
      
      // Call the onAssign callback with selected role objects
      await onAssign(selectedRoleObjects);
      
      // Reset state and close modal
      setSelectedRoles([]);
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error assigning roles:', error);
      // Handle error (could show toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedRoles([]);
    setSearchTerm('');
    onClose();
  };

  const handleRoleToggle = (roleId) => {
    setSelectedRoles(prev => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRoles.length === availableRoles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(availableRoles.map(role => role.id));
    }
  };

  const getModalTitle = () => {
    switch (targetType) {
      case 'user':
        return `Assign Roles to ${targetName}`;
      case 'group':
        return `Assign Roles to Group: ${targetName}`;
      default:
        return 'Assign Roles';
    }
  };

  const getModalDescription = () => {
    switch (targetType) {
      case 'user':
        return `Select one or more roles to assign to user ${targetName}. The user will inherit all permissions and access rights from the selected roles.`;
      case 'group':
        return `Select one or more roles to assign to the group ${targetName}. All members of this group will inherit the selected roles.`;
      default:
        return 'Select roles to assign.';
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
            <CogIcon className="h-5 w-5 text-primary" />
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
            Search Roles
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, description, or department..."
            className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
        </div>

        {/* Roles Table */}
        <div className="flex-1 min-h-0">
          <div className="border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b">
              <div className="flex items-center p-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedRoles.length === availableRoles.length && availableRoles.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    Select All ({availableRoles.length} roles)
                  </span>
                </div>
                {selectedRoles.length > 0 && (
                  <span className="text-sm text-primary ml-auto">
                    {selectedRoles.length} selected
                  </span>
                )}
              </div>
            </div>

            {/* Table Content - Scrollable */}
            <div className="max-h-80 overflow-y-auto">
              {availableRoles.length === 0 ? (
                <div className="text-center py-8">
                  <CogIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <div className="text-sm text-muted-foreground">
                    {searchTerm ? 'No roles match your search' : 'No roles available for assignment'}
                  </div>
                </div>
              ) : (
                availableRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-start gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRoleToggle(role.id)}
                  >
                    <div className="flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="p-1.5 bg-primary/10 rounded-md shrink-0 mt-0.5">
                      <CogIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium text-sm">{role.name}</div>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                        >
                          {role.composite ? 'Composite' : 'Simple'}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {role.description}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{role.userCount} users</span>
                        {role.attributes?.department && (
                          <>
                            <span>•</span>
                            <span>{role.attributes.department.join(', ')}</span>
                          </>
                        )}
                        {role.attributes?.permissions && (
                          <>
                            <span>•</span>
                            <span>{role.attributes.permissions.length} permissions</span>
                          </>
                        )}
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
          disabled={selectedRoles.length === 0 || isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? 'Assigning...' : `Assign ${selectedRoles.length} Role${selectedRoles.length !== 1 ? 's' : ''}`}
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

export default AssignRoleModal;