import React, { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const AddRoleModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    roleName: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (formData.roleName.trim()) {
      onSave(formData);
      setFormData({ roleName: '', description: '' });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({ roleName: '', description: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} className="w-full max-w-md">
      <ModalHeader onClose={handleCancel}>
        <ModalTitle>Add Role</ModalTitle>
      </ModalHeader>
      
      <ModalContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="roleName" className="text-sm font-medium">
            Role Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="roleName"
            name="roleName"
            type="text"
            value={formData.roleName}
            onChange={handleInputChange}
            placeholder="Enter role name"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
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
