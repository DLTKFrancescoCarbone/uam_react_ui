import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Label } from '../components/ui/label';
import { FloatingLabelInput } from '../components/ui/floating-label-input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { ArrowLeftIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { mockGroups, getGroupMembers } from '../data/mockGroups';
import { mockRoles, getRoleMembers } from '../data/mockRoles';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedGroup, setEditedGroup] = useState({
    name: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('details');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/setup');
      return;
    }

    // Find group by ID
    const foundGroup = mockGroups.find(g => g.id === groupId);
    if (foundGroup) {
      setGroup(foundGroup);
      setEditedGroup({
        name: foundGroup.name,
        description: foundGroup.description
      });
      // Reset to details tab when loading a new group
      setActiveTab('details');
    }
    setLoading(false);
  }, [groupId, navigate]);

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
      setGroup({ ...group, ...editedGroup });
      setIsEditing(false);
      // Here you would typically make an API call to save the changes
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

  const handleBack = () => {
    navigate('/groups');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-[76px] pb-16 min-h-screen">
          <Sidebar />
          <div className="ml-[66px] px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading...</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-[76px] pb-16 min-h-screen">
          <Sidebar />
          <div className="ml-[66px] px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-500">Group not found</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-[76px] pb-16 min-h-screen">
        <Sidebar />
        
        <div className="ml-[66px] px-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="page-title">{group.name}</h1>
              </div>
              <p className="page-description">
                Group details for {group.name}
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Groups
            </Button>
          </div>

          {/* Main Content Container */}
          <Card className="main-content-card">
            <CardContent className="main-content-body">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="tabs-container">
                <TabsList className="tabs-list-underline">
                  <TabsTrigger value="details" className="tabs-trigger-underline">Group Details</TabsTrigger>
                  <TabsTrigger value="members" className="tabs-trigger-underline">Members</TabsTrigger>
                  <TabsTrigger value="roles" className="tabs-trigger-underline">Assigned Roles</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between w-full">
                        <CardTitle className="text-lg">Group Information</CardTitle>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">Created: {group.createdDate}</span>
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
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Department Display */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Department:</Label>
                        <Badge variant={getDepartmentColor(group.department)} className="text-xs">
                          {group.department}
                        </Badge>
                      </div>

                      {/* First Row: Group Name */}
                      <div className="grid grid-cols-1 gap-4 items-end">
                        <div className="min-h-[4rem] flex flex-col justify-end">
                          {isEditing ? (
                            <FloatingLabelInput
                              id="groupName"
                              label="Group Name"
                              value={editedGroup.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              error={errors.name}
                              className="form-field-editable"
                            />
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Group Name</Label>
                              <div className="form-field-readonly">{group.name}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Second Row: Description (full width) */}
                      <div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
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
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Description</Label>
                            <div className="form-field-readonly">{group.description}</div>
                          </div>
                        )}
                      </div>

                      {/* Third Row: Statistics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Members</Label>
                          <div className="form-field-readonly">{group.memberCount} users</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Assigned Roles</Label>
                          <div className="form-field-readonly">{group.roleCount} roles</div>
                        </div>
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
                <TabsContent value="members" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Group Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {groupMembers.map((member) => (
                          <div 
                            key={member.id} 
                            className="flex items-start justify-between p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedMember(member);
                              setShowMemberModal(true);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="font-medium text-sm text-blue-600">
                                  {member.firstName[0]}{member.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-base mb-1">
                                  {member.firstName} {member.lastName}
                                  {Number(member.id) <= 15 && <span className="ml-2 text-xs text-blue-500">• View Profile</span>}
                                </div>
                                <div className="text-sm text-gray-600">{member.username} • {member.email}</div>
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
                          <div className="text-center py-8 text-gray-500">
                            No members in this group
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Assigned Roles Tab */}
                <TabsContent value="roles" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Assigned Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {assignedRoles.map((role) => (
                          <div 
                            key={role.id} 
                            className="flex items-start justify-between p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedRole(role);
                              setShowRoleModal(true);
                            }}
                          >
                            <div className="flex-1">
                              <div className="font-medium text-base mb-1">
                                {role.name}
                                <span className="ml-2 text-xs text-blue-500">• View Details</span>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">{role.description}</div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="text-blue-600">{role.userCount} users</span>
                                <span>•</span>
                                <span>{role.composite ? 'Composite' : 'Simple'} role</span>
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
                          <div className="text-center py-8 text-gray-500">
                            No roles assigned to this group
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
      
      {/* Member Details Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-medium text-lg text-blue-600">
                      {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedMember.firstName} {selectedMember.lastName}</h2>
                    <p className="text-sm text-gray-600">Member of {group?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowMemberModal(false);
                    setSelectedMember(null);
                  }}
                  className="modal-close-button"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Username</Label>
                      <div className="text-sm text-body mt-1">{selectedMember.username}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <div className="text-sm text-body mt-1">{selectedMember.email}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Status</Label>
                      <div className="mt-1">
                        <Badge variant={selectedMember.status === 'Active' ? 'success' : 'secondary'}>
                          {selectedMember.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Group Role</Label>
                      <div className="text-sm text-body mt-1">Member</div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                {selectedMember.department && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Department Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Department</Label>
                        <div className="text-sm text-body mt-1">{selectedMember.department}</div>
                      </div>
                      {selectedMember.position && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Position</Label>
                          <div className="text-sm text-body mt-1">{selectedMember.position}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-between items-center rounded-b-lg">
              <div className="text-sm text-gray-500">
                Member since: {selectedMember.created || 'N/A'}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMemberModal(false);
                    setSelectedMember(null);
                  }}
                >
                  Close
                </Button>
                {Number(selectedMember.id) <= 15 && (
                  <Button
                    onClick={() => {
                      setShowMemberModal(false);
                      setSelectedMember(null);
                      navigate(`/users/${selectedMember.id}`);
                    }}
                  >
                    View Full Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Details Modal */}
      {showRoleModal && selectedRole && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col">
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="font-medium text-lg text-purple-600">
                      {selectedRole.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedRole.name}</h2>
                    <p className="text-sm text-gray-600">Role assigned to {group?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedRole(null);
                  }}
                  className="modal-close-button"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Role Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Role Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Role Name</Label>
                      <div className="text-sm text-body mt-1">{selectedRole.name}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Type</Label>
                      <div className="text-sm text-body mt-1">
                        {selectedRole.composite ? 'Composite Role' : 'Simple Role'}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <div className="text-sm text-body mt-1">{selectedRole.description}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Total Users</Label>
                      <div className="text-sm text-body mt-1">{selectedRole.userCount} users</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Created</Label>
                      <div className="text-sm text-body mt-1">{selectedRole.createdDate}</div>
                    </div>
                  </div>
                </div>

                {/* Users with this Role */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Users with this Role ({getRoleMembers(selectedRole.id).length})</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {getRoleMembers(selectedRole.id).map((user) => {
                      const isRealUser = Number(user.id) <= 15;
                      
                      return (
                        <div 
                          key={user.id} 
                          className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                            isRealUser 
                              ? 'hover:bg-blue-50 hover:border-blue-200 cursor-pointer' 
                              : 'hover:bg-gray-50 cursor-default opacity-90'
                          }`}
                          onClick={() => {
                            if (isRealUser) {
                              setShowRoleModal(false);
                              setSelectedRole(null);
                              navigate(`/users/${user.id}`);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isRealUser ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <span className={`font-medium text-sm ${
                                isRealUser ? 'text-blue-600' : 'text-gray-600'
                              }`}>
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium text-sm ${
                                isRealUser 
                                  ? 'text-blue-900 hover:text-blue-700' 
                                  : 'text-gray-700'
                              }`}>
                                {user.firstName} {user.lastName}
                                {isRealUser && <span className="ml-2 text-xs text-blue-500">• View Profile</span>}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {user.username} • {user.email}
                              </div>
                            </div>
                          </div>
                          <Badge 
                            variant={user.status === 'Active' ? 'success' : 'secondary'}
                            className="shrink-0"
                          >
                            {user.status}
                          </Badge>
                        </div>
                      );
                    })}
                    {getRoleMembers(selectedRole.id).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No users found with this role
                      </div>
                    )}
                  </div>
                </div>

                {/* Permissions */}
                {selectedRole.attributes?.permissions && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Permissions</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.attributes.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-between items-center rounded-b-lg">
              <div className="text-sm text-gray-500">
                Last modified: {selectedRole.lastModified}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedRole(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedRole(null);
                    navigate(`/roles/${selectedRole.id}`);
                  }}
                >
                  View Full Role Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetailPage;