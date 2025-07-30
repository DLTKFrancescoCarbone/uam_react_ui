import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { mockGroups } from '../../data/mockGroups';
import { mockRoles } from '../../data/mockRoles';

const UserDetailPanel = ({ user, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
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
    
    if (!editedUser.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    
    if (!editedUser.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }
    
    if (!editedUser.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editedUser.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ ...user, ...editedUser });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    setErrors({});
    setIsEditing(false);
  };

  // Mock user groups and roles for display
  const userGroups = mockGroups.slice(0, 3); // Show first 3 groups as example
  const userRoles = mockRoles.slice(0, 2); // Show first 2 roles as example

  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-white border-l border-gray-200 shadow-lg z-10">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">User Information</CardTitle>
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
                  {/* Username (read-only) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Username</Label>
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {user.username}
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="firstName"
                          value={editedUser.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={errors.firstName ? 'border-red-500' : ''}
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-500">{errors.firstName}</p>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-900">{user.firstName}</div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="lastName"
                          value={editedUser.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={errors.lastName ? 'border-red-500' : ''}
                        />
                        {errors.lastName && (
                          <p className="text-xs text-red-500">{errors.lastName}</p>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-900">{user.lastName}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="email"
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-900">{user.email}</div>
                    )}
                  </div>

                  {/* Status (read-only) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <div>
                      <Badge 
                        variant={user.status === 'Active' ? 'default' : 'secondary'}
                        className={user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Created Date (read-only) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Created</Label>
                    <div className="text-sm text-gray-600">{user.created}</div>
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

            {/* Groups Tab */}
            <TabsContent value="groups" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Group Memberships</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userGroups.map((group) => (
                      <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{group.name}</div>
                          <div className="text-xs text-gray-500">{group.description}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {group.memberCount} members • {group.department}
                          </div>
                        </div>
                      </div>
                    ))}
                    {userGroups.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No groups assigned
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Role Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userRoles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{role.name}</div>
                          <div className="text-xs text-gray-500">{role.description}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {role.userCount} users • {role.composite ? 'Composite' : 'Simple'} role
                          </div>
                        </div>
                      </div>
                    ))}
                    {userRoles.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No roles assigned
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
          <Link to={`/users/${user.id}`}>
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

export default UserDetailPanel;
