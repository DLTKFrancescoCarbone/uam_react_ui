import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { XMarkIcon, ArrowTopRightOnSquareIcon, CogIcon } from '@heroicons/react/24/outline';
import { getRoleMembers } from '../../data/mockRoles';

const RoleDetailPanel = ({ role, onClose, onSave }) => {
  const [editedRole, setEditedRole] = useState({
    name: role.name,
    description: role.description
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("general");
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);

  // Initialize permissions on component mount or role change
  useEffect(() => {
    const initialPermissions = [
      { id: 1, name: 'User Management', description: 'Create, edit, and delete users', granted: true },
      { id: 2, name: 'Role Management', description: 'Manage roles and permissions', granted: role.composite },
      { id: 3, name: 'System Settings', description: 'Configure system settings', granted: role.name === 'admin' },
      { id: 4, name: 'Project Access', description: 'Access to project data', granted: true },
      { id: 5, name: 'Financial Data', description: 'Access to financial information', granted: role.name.includes('finance') },
    ];
    setRolePermissions(initialPermissions);
  }, [role]);

  const handleInputChange = (field, value) => {
    setEditedRole(prev => ({
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
    
    if (!editedRole.name.trim()) {
      newErrors.name = 'Role name is required';
    }
    
    if (!editedRole.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ ...role, ...editedRole });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedRole({
      name: role.name,
      description: role.description
    });
    setErrors({});
    setIsEditing(false);
  };

  // Get role members
  const roleMembers = getRoleMembers(role.id);

  // Initialize edited permissions when entering edit mode
  const handleEditPermissions = () => {
    setEditedPermissions([...rolePermissions]);
    setIsEditingPermissions(true);
  };

  const handleCancelPermissions = () => {
    setEditedPermissions([]);
    setIsEditingPermissions(false);
  };

  const handleSavePermissions = () => {
    setRolePermissions([...editedPermissions]);
    setIsEditingPermissions(false);
    setEditedPermissions([]);
    // Here you would typically make an API call to save permissions
  };

  const handlePermissionToggle = (permissionId) => {
    setEditedPermissions(prev =>
      prev.map(permission =>
        permission.id === permissionId
          ? { ...permission, granted: !permission.granted }
          : permission
      )
    );
  };

  const displayPermissions = isEditingPermissions ? editedPermissions : rolePermissions;

  return (
    <div className="absolute top-0 right-0 w-[420px] h-full bg-white border-l border-gray-200 shadow-lg z-10">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
              <CogIcon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-header">Role Details</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <XMarkIcon className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="tabs-list-underline">
              <TabsTrigger value="general" className="tabs-trigger-underline">General</TabsTrigger>
              <TabsTrigger value="permissions" className="tabs-trigger-underline">Permissions</TabsTrigger>
              <TabsTrigger value="users" className="tabs-trigger-underline">Users</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Role Information</CardTitle>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Role Name */}
                  <div className="space-y-2">
                    <Label htmlFor="roleName" className="text-sm font-medium">
                      Role Name
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="roleName"
                          value={editedRole.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-body">{role.name}</div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    {isEditing ? (
                      <>
                        <textarea
                          id="description"
                          value={editedRole.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500' : ''}`}
                          rows={3}
                        />
                        {errors.description && (
                          <p className="text-xs text-red-500">{errors.description}</p>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-body">{role.description}</div>
                    )}
                  </div>

                  {/* Role Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Role Type</Label>
                    <div>
                      <Badge 
                        variant={role.composite ? 'purple' : 'cyan'}
                        className="text-xs"
                      >
                        {role.composite ? 'Composite' : 'Simple'}
                      </Badge>
                    </div>
                  </div>

                  {/* User Count */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Assigned Users</Label>
                    <div className="text-sm text-gray-600">{role.userCount} users</div>
                  </div>

                  {/* Created Date */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Created</Label>
                    <div className="text-sm text-gray-600">{role.createdDate}</div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSave} size="sm">
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancel} size="sm">
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Role Permissions</CardTitle>
                    {!isEditingPermissions ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditPermissions}
                      >
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSavePermissions} size="sm">
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancelPermissions} size="sm">
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {displayPermissions.map((permission) => (
                      <div key={permission.id} className={`flex items-center justify-between p-3 border rounded-lg ${isEditingPermissions ? 'hover:bg-gray-50' : ''}`}>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{permission.name}</div>
                          <div className="text-xs text-gray-500">{permission.description}</div>
                        </div>
                        {isEditingPermissions ? (
                          <label className="flex items-center justify-between cursor-pointer min-w-[100px]">
                            <span className="text-sm font-medium">
                              {permission.granted ? 'Granted' : 'Denied'}
                            </span>
                            <input
                              type="checkbox"
                              checked={permission.granted}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 ml-3"
                            />
                          </label>
                        ) : (
                          <Badge 
                            variant={permission.granted ? 'success' : 'secondary'}
                          >
                            {permission.granted ? 'Granted' : 'Denied'}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Assigned Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roleMembers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="font-medium text-sm text-blue-600">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{user.firstName} {user.lastName}</div>
                            <div className="text-xs text-gray-500">{user.username} • {user.email}</div>
                          </div>
                        </div>
                        <Badge 
                          variant={user.status === 'Active' ? 'success' : 'secondary'}
                        >
                          {user.status}
                        </Badge>
                      </div>
                    ))}
                    {roleMembers.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No users assigned to this role
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white z-20">
          <Link to={`/roles/${role.id}`}>
            <Button 
              variant="default"
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              View All Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleDetailPanel;