import React, { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
              <Label htmlFor="username" className="text-sm font-medium">
                Enter username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={errors.username ? 'border-red-500' : ''}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Username can't be changed after creation.
              </p>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email and Phone Number */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.status}
                onChange={(checked) => handleInputChange('status', checked)}
              />
              <Label className="text-sm font-medium text-muted-foreground">
                Status ({formData.status ? 'Active' : 'Inactive'})
              </Label>
            </div>
          </div>
        </div>

        {/* Required Actions and Groups Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Required Actions */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Required Actions</h4>
            <div className="space-y-3">
              <Checkbox
                checked={formData.requiredActions.verifyEmail}
                onChange={(e) => handleRequiredActionChange('verifyEmail', e.target.checked)}
              >
                Verify email
              </Checkbox>
              <Checkbox
                checked={formData.requiredActions.configureMFA}
                onChange={(e) => handleRequiredActionChange('configureMFA', e.target.checked)}
              >
                Configure MFA
              </Checkbox>
            </div>
          </div>

          {/* Groups */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Groups</h4>
            <div className="space-y-3 max-h-24 overflow-y-auto">
              <Checkbox
                checked={formData.groups.fileManager1}
                onChange={(e) => handleGroupChange('fileManager1', e.target.checked)}
              >
                File-Manager1
              </Checkbox>
              <Checkbox
                checked={formData.groups.groupTest}
                onChange={(e) => handleGroupChange('groupTest', e.target.checked)}
              >
                GroupTest
              </Checkbox>
              <Checkbox
                checked={formData.groups.projectManager}
                onChange={(e) => handleGroupChange('projectManager', e.target.checked)}
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
