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
import { ToggleSwitch } from '../components/ui/toggle-switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { ArrowLeftIcon, CogIcon } from '@heroicons/react/24/outline';
import { mockUsers } from '../data/mockUsers';
import { mockGroups, getGroupMembers } from '../data/mockGroups';
import { mockRoles } from '../data/mockRoles';

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedUser, setEditedUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStatus, setCurrentStatus] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  // Removed selectedRole state as we now show all roles in modal
  const [showRoleMembers, setShowRoleMembers] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/setup');
      return;
    }

    // Find user by ID
    const foundUser = mockUsers.find(u => u.id === parseInt(userId));
    if (foundUser) {
      setUser(foundUser);
      setCurrentStatus(foundUser.status);
      setEditedUser({
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email
      });
      // Reset to details tab when loading a new user
      setActiveTab('details');
    }
    setLoading(false);
  }, [userId, navigate]);

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
      setUser({ ...user, ...editedUser, status: currentStatus });
      setIsEditing(false);
      // Here you would typically make an API call to save the changes
    }
  };

  const handleStatusToggle = (isActive) => {
    const newStatus = isActive ? 'Active' : 'Inactive';
    setCurrentStatus(newStatus);
    // Don't update user immediately, wait for save
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    setCurrentStatus(user.status);
    setErrors({});
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate('/users');
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setShowGroupMembers(true);
  };

  const handleCloseGroupMembers = () => {
    setShowGroupMembers(false);
    setSelectedGroup(null);
  };

  const handleRoleClick = () => {
    setShowRoleMembers(true);
  };

  const handleCloseRoleMembers = () => {
    setShowRoleMembers(false);
  };

  const handleGroupMemberClick = (memberId) => {
    // Check if this is a real user ID (1-15) that has a detail page
    const realUser = mockUsers.find(user => Number(user.id) === Number(memberId));
    if (realUser) {
      // Close the modal first
      setShowGroupMembers(false);
      setSelectedGroup(null);
      // Switch to the User Details tab to show the change
      setActiveTab('details');
      // Then navigate to the user's detail page
      navigate(`/users/${memberId}`);
    }
  };

  // Removed handleRoleMemberClick as we now navigate to role details instead

  const handleRoleDetailClick = (roleId) => {
    // Close the modal first
    setShowRoleMembers(false);
    // Navigate to the role detail page
    navigate(`/roles/${roleId}`);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-[76px] pb-16 min-h-screen">
          <Sidebar />
          <div className="ml-[66px] px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-500">User not found</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock user groups and roles for display
  const userGroups = mockGroups.slice(0, 3); // Show first 3 groups as example
  const userRoles = mockRoles.slice(0, 2); // Show first 2 roles as example

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-[76px] pb-16 min-h-screen">
        <Sidebar />
        
        <div className="ml-[66px] px-8">
          {/* Header Section */}
<div className="flex items-center justify-between mb-8">
  <div className="space-y-1">
    <h1 className="page-title">{user.firstName} {user.lastName}</h1>
    <p className="page-description">
      User details for {user.firstName} {user.lastName}
    </p>
  </div>
  <Button
    variant="default"
    size="sm"
    onClick={handleBack}
    className="flex items-center gap-2"
  >
    <ArrowLeftIcon className="h-4 w-4" />
    Back to Users
  </Button>
</div>

          {/* Main Content Container */}
          <Card className="main-content-card">
            <CardContent className="main-content-body">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="tabs-container">
                <TabsList className="tabs-list-underline">
                  <TabsTrigger value="details" className="tabs-trigger-underline">User Details</TabsTrigger>
                  <TabsTrigger value="groups" className="tabs-trigger-underline">Groups</TabsTrigger>
                  <TabsTrigger value="roles" className="tabs-trigger-underline">Roles</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between w-full">
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">Created: {user.created}</span>
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
                      {/* Status Display */}
                      {isEditing ? (
                        <div className="flex items-center space-x-3">
                          <ToggleSwitch
                            checked={currentStatus === 'Active'}
                            onChange={handleStatusToggle}
                          />
                          <Label className="text-sm font-medium text-muted-foreground">
                            Status
                          </Label>
                          <Badge 
                            variant={currentStatus === 'Active' ? 'success' : 'secondary'}
                          >
                            {currentStatus === 'Active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium">Status:</Label>
                          <Badge 
                            variant={currentStatus === 'Active' ? 'success' : 'secondary'}
                          >
                            {currentStatus}
                          </Badge>
                        </div>
                      )}

                      {/* First Row: Username, First Name, Last Name */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        {/* Username (read-only) */}
                        <div className="min-h-[4rem] flex flex-col justify-end">
                          <FloatingLabelInput
                            id="username"
                            label="Username"
                            value={user.username}
                            readOnly={true}
                          />
                        </div>

                        {/* First Name (editable) */}
                        <div className="min-h-[4rem] flex flex-col justify-end">
                          {isEditing ? (
                            <FloatingLabelInput
                              id="firstName"
                              label="First Name"
                              value={editedUser.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              error={errors.firstName}
                              className="form-field-editable"
                            />
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">First Name</Label>
                              <div className="form-field-readonly">{user.firstName}</div>
                            </div>
                          )}
                        </div>

                        {/* Last Name (editable) */}
                        <div className="min-h-[4rem] flex flex-col justify-end">
                          {isEditing ? (
                            <FloatingLabelInput
                              id="lastName"
                              label="Last Name"
                              value={editedUser.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              error={errors.lastName}
                              className="form-field-editable"
                            />
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Last Name</Label>
                              <div className="form-field-readonly">{user.lastName}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Second Row: Email (full width) */}
                      <div>
                        {isEditing ? (
                          <FloatingLabelInput
                            id="email"
                            type="email"
                            label="Email Address"
                            value={editedUser.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            error={errors.email}
                            className="form-field-editable"
                          />
                        ) : (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Email Address</Label>
                            <div className="form-field-readonly">{user.email}</div>
                          </div>
                        )}
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
                <TabsContent value="groups" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Group Memberships</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userGroups.map((group) => (
                          <div 
                            key={group.id} 
                            className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleGroupClick(group)}
                          >
                            <div className="flex-1">
                              <div className="font-medium text-base mb-1">{group.name}</div>
                              <div className="text-sm text-gray-600 mb-2">{group.description}</div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="text-blue-600 hover:text-blue-800">{group.memberCount} members</span>
                                <span>•</span>
                                <span>{group.department}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {userGroups.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            No groups assigned to this user
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Roles Tab */}
                <TabsContent value="roles" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Role Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userRoles.map((role) => (
                          <div 
                            key={role.id} 
                            className="flex items-start justify-between p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors"
                            onClick={() => handleRoleClick(role)}
                          >
                            <div className="flex-1">
                              <div className="font-medium text-base mb-1">{role.name}</div>
                              <div className="text-sm text-gray-600 mb-2">{role.description}</div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="text-blue-600 hover:text-blue-800">{role.userCount} users</span>
                                <span>•</span>
                                <span>{role.composite ? 'Composite' : 'Simple'} role</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {userRoles.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            No roles assigned to this user
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
      
      {/* Group Members Modal */}
      {showGroupMembers && selectedGroup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedGroup.name} ({getGroupMembers(selectedGroup.id).length})</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedGroup.description}</p>
                </div>
                <button
                  onClick={handleCloseGroupMembers}
                  className="modal-close-button"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-3">
                {getGroupMembers(selectedGroup.id).map((member) => {
                  // Ensure both IDs are numbers for proper comparison
                  const isRealUser = mockUsers.find(user => Number(user.id) === Number(member.id));
                  const isClickable = Boolean(isRealUser);
                  
                  return (
                    <div 
                      key={member.id} 
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                        isClickable 
                          ? 'hover:bg-blue-50 hover:border-blue-200 cursor-pointer' 
                          : 'hover:bg-gray-50 cursor-default opacity-90'
                      }`}
                      onClick={() => {
                        if (isClickable) {
                          handleGroupMemberClick(member.id);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isClickable ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <span className={`font-medium text-sm ${
                            isClickable ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {member.firstName[0]}{member.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className={`font-medium text-sm ${
                            isClickable 
                              ? 'text-blue-900 hover:text-blue-700' 
                              : 'text-gray-700'
                          }`}>
                            {member.firstName} {member.lastName}
                            {isClickable && <span className="ml-2 text-xs text-blue-500">• View Profile</span>}
                          </div>
                          <div className="text-xs text-gray-500">
                            {member.username} • {member.email}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={member.status === 'Active' ? 'success' : 'secondary'}
                      >
                        {member.status}
                      </Badge>
                    </div>
                  );
                })}
                {getGroupMembers(selectedGroup.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No members found in this group
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Available Roles Modal */}
      {showRoleMembers && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Available Roles ({mockRoles.length})</h2>
                  <p className="text-sm text-gray-600 mt-1">Select a role to view details</p>
                </div>
                <button
                  onClick={handleCloseRoleMembers}
                  className="modal-close-button"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-3">
                {mockRoles.map((role) => {
                  return (
                    <div 
                      key={role.id} 
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-200"
                      onClick={() => handleRoleDetailClick(role.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <CogIcon className="h-5 w-5 text-primary" />
                        </div>
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
                      </div>
                      <Badge 
                        variant={role.composite ? 'purple' : 'cyan'}
                        className="text-xs"
                      >
                        {role.composite ? 'Composite' : 'Simple'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default UserDetailPage;
