import React, { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../ui/modal';
import { Button } from '../ui/button';
import { FloatingLabelInput } from '../ui/floating-label-input';
import { Label } from '../ui/label';

const AddRoleModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    roleName: '',
    description: ''
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.roleName.trim()) {
      newErrors.roleName = 'Role Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      setFormData({ roleName: '', description: '' });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({ roleName: '', description: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} className="w-full max-w-md">
      <ModalHeader onClose={handleCancel}>
        <ModalTitle>Add Role</ModalTitle>
      </ModalHeader>
      
      <ModalContent className="space-y-6">
        <FloatingLabelInput
          id="roleName"
          label="Role Name *"
          value={formData.roleName}
          onChange={(e) => handleInputChange('roleName', e.target.value)}
          error={errors.roleName}
        />
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-header">
            Description
          </Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter role description"
            rows={4}
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>
      </ModalContent>
      
      <ModalFooter>
        <Button onClick={handleSave}>
          Save
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddRoleModal;
