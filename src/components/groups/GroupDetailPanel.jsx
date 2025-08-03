import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { XMarkIcon, ArrowTopRightOnSquareIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { getGroupMembers } from '../../data/mockGroups';
import { mockRoles } from '../../data/mockRoles';

const GroupDetailPanel = ({ group, onClose, onSave }) => {
  const [editedGroup, setEditedGroup] = useState({
    name: group.name,
    description: group.description
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("details");

  const handleInputChange = (field, value) => {
    setEditedGroup(prev => ({
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
    
    if (!editedGroup.name.trim()) {
      newErrors.name = 'Group name is required';
    }
    
    if (!editedGroup.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ ...group, ...editedGroup });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedGroup({
      name: group.name,
      description: group.description
    });
    setErrors({});
    setIsEditing(false);
  };

  // Get group members
  const groupMembers = getGroupMembers(group.id);

  // Mock assigned roles for the group (first 3 roles as example)
  const assignedRoles = mockRoles.slice(0, 3);

  const getDepartmentColor = (department) => {
    const colors = {
      'Engineering': 'default',
      'Management': 'secondary', 
      'Finance': 'outline',
      'IT': 'secondary',
      'Marketing': 'outline',
      'Construction': 'default'
    };
    return colors[department] || 'outline';
  };

  return (
    <div className="absolute top-0 right-0 w-[420px] h-full bg-white border-l border-gray-200 shadow-lg z-10">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
              <UserGroupIcon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-header">Group Details</h3>
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
              <TabsTrigger value="details" className="tabs-trigger-underline">Details</TabsTrigger>
              <TabsTrigger value="members" className="tabs-trigger-underline">Assigned Users</TabsTrigger>
              <TabsTrigger value="roles" className="tabs-trigger-underline">Assigned Roles</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Group Information</CardTitle>
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
                  {/* Group Name */}
                  <div className="space-y-2">
                    <Label htmlFor="groupName" className="text-sm font-medium">
                      Group Name
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="groupName"
                          value={editedGroup.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-body">{group.name}</div>
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
                          value={editedGroup.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500' : ''}`}
                          rows={3}
                        />
                        {errors.description && (
                          <p className="text-xs text-red-500">{errors.description}</p>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-body">{group.description}</div>
                    )}
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Department</Label>
                    <div>
                      <Badge variant={getDepartmentColor(group.department)} className="text-xs">
                        {group.department}
                      </Badge>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Members</Label>
                      <div className="text-sm text-gray-600">{group.memberCount} users</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Assigned Roles</Label>
                      <div className="text-sm text-gray-600">{group.roleCount} roles</div>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Created</Label>
                    <div className="text-sm text-gray-600">{group.createdDate}</div>
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

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Group Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {groupMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="font-medium text-sm text-blue-600">
                              {member.firstName[0]}{member.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{member.firstName} {member.lastName}</div>
                            <div className="text-xs text-gray-500">{member.username} • {member.email}</div>
                          </div>
                        </div>
                        <Badge 
                          variant={member.status === 'Active' ? 'success' : 'secondary'}
                        >
                          {member.status}
                        </Badge>
                      </div>
                    ))}
                    {groupMembers.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No members in this group
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assigned Roles Tab */}
            <TabsContent value="roles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Assigned Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignedRoles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{role.name}</div>
                          <div className="text-xs text-gray-500">{role.description}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {role.userCount} users • {role.composite ? 'Composite' : 'Simple'} role
                          </div>
                        </div>
                        <Badge 
                          variant={role.composite ? 'purple' : 'cyan'}
                          className="text-xs"
                        >
                          {role.composite ? 'Composite' : 'Simple'}
                        </Badge>
                      </div>
                    ))}
                    {assignedRoles.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No roles assigned to this group
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
          <Link to={`/groups/${group.id}`}>
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

export default GroupDetailPanel;