import React, { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../ui/modal';
import { Button } from '../ui/button';
import { FloatingLabelInput } from '../ui/floating-label-input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';

const AddUserModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    status: false, // false = Inactive, true = Active
    requiredActions: {
      verifyEmail: false,
      configureMFA: false
    },
    groups: {
      fileManager1: false,
      groupTest: false,
      projectManager: false
    }
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleRequiredActionChange = (action, checked) => {
    setFormData(prev => ({
      ...prev,
      requiredActions: {
        ...prev.requiredActions,
        [action]: checked
      }
    }));
  };

  const handleGroupChange = (group, checked) => {
    setFormData(prev => ({
      ...prev,
      groups: {
        ...prev.groups,
        [group]: checked
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      status: false,
      requiredActions: {
        verifyEmail: false,
        configureMFA: false
      },
      groups: {
        fileManager1: false,
        groupTest: false,
        projectManager: false
      }
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="w-full max-w-2xl">
      <ModalHeader onClose={handleClose}>
        <ModalTitle>Add New User</ModalTitle>
      </ModalHeader>
      
      <ModalContent className="space-y-6">
        {/* Basic Information Section */}
        <div>
          <h3 className="text-base font-medium text-muted-foreground mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <FloatingLabelInput
                id="username"
                label="Enter username *"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                error={errors.username}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Username can't be changed after creation.
              </p>
            </div>

            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <FloatingLabelInput
                id="firstName"
                label="First Name *"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
              />
              <FloatingLabelInput
                id="lastName"
                label="Last Name *"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
              />
            </div>

            {/* Email and Phone Number */}
            <div className="grid grid-cols-2 gap-4">
              <FloatingLabelInput
                id="email"
                type="email"
                label="Email *"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
              />
              <FloatingLabelInput
                id="phoneNumber"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.status}
                onChange={(checked) => handleInputChange('status', checked)}
              />
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              <Badge 
                variant={formData.status ? 'success' : 'secondary'}
              >
                {formData.status ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Required Actions and Groups Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Required Actions */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Required Actions</h4>
            <div className="space-y-3">
              <Checkbox
                checked={formData.requiredActions.verifyEmail}
                onChange={(e) => handleRequiredActionChange('verifyEmail', e.target.checked)}
                textClassName="text-muted-foreground"
              >
                Verify email
              </Checkbox>
              <Checkbox
                checked={formData.requiredActions.configureMFA}
                onChange={(e) => handleRequiredActionChange('configureMFA', e.target.checked)}
                textClassName="text-muted-foreground"
              >
                Configure MFA
              </Checkbox>
            </div>
          </div>

          {/* Groups */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Groups</h4>
            <div className="space-y-3 max-h-24 overflow-y-auto">
              <Checkbox
                checked={formData.groups.fileManager1}
                onChange={(e) => handleGroupChange('fileManager1', e.target.checked)}
                textClassName="text-muted-foreground"
              >
                File-Manager1
              </Checkbox>
              <Checkbox
                checked={formData.groups.groupTest}
                onChange={(e) => handleGroupChange('groupTest', e.target.checked)}
                textClassName="text-muted-foreground"
              >
                GroupTest
              </Checkbox>
              <Checkbox
                checked={formData.groups.projectManager}
                onChange={(e) => handleGroupChange('projectManager', e.target.checked)}
                textClassName="text-muted-foreground"
              >
                Project-Manager
              </Checkbox>
            </div>
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <Button onClick={handleSave}>
          Save
        </Button>
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddUserModal;
