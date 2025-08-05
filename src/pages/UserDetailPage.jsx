import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { XMarkIcon, ArrowLeftIcon, CogIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Label } from '../components/ui/label';
import { FloatingLabelInput } from '../components/ui/floating-label-input';
import { ToggleSwitch } from '../components/ui/toggle-switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/ui/modal';
import ViewToggle from '../components/ui/view-toggle';
import AssignGroupModal from '../components/modals/AssignGroupModal';
import AssignRoleModal from '../components/modals/AssignRoleModal';
import { mockUsers } from '../data/mockUsers';
import { mockGroups, getGroupMembers } from '../data/mockGroups';
import { mockRoles, getRoleMembers } from '../data/mockRoles';

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
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleDetail, setShowRoleDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [groupsViewMode, setGroupsViewMode] = useState(() => {
    return localStorage.getItem('userDetailGroupsViewMode') || 'list';
  });
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [rolesViewMode, setRolesViewMode] = useState(() => {
    return localStorage.getItem('userDetailRolesViewMode') || 'list';
  });
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showAssignGroupModal, setShowAssignGroupModal] = useState(false);
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);

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

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setShowRoleDetail(true);
  };

  const handleCloseRoleDetail = () => {
    setShowRoleDetail(false);
    setSelectedRole(null);
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

  const handleRoleDetailClick = (roleId) => {
    // Close the modal first
    setShowRoleDetail(false);
    setSelectedRole(null);
    // Navigate to the role detail page
    navigate(`/roles/${roleId}`);
  };

  const handleGroupsViewModeChange = (newViewMode) => {
    setGroupsViewMode(newViewMode);
    localStorage.setItem('userDetailGroupsViewMode', newViewMode);
  };

  const handleRolesViewModeChange = (newViewMode) => {
    setRolesViewMode(newViewMode);
    localStorage.setItem('userDetailRolesViewMode', newViewMode);
  };

  const handleAssignGroups = () => {
    setShowAssignGroupModal(true);
  };

  const handleAssignGroupsConfirm = async (selectedGroups) => {
    // TODO: Implement actual group assignment logic
    console.log('Assigning groups to user:', user.id, selectedGroups);
    // Here you would typically make an API call to assign the groups
    // For now, we'll just log the action
    alert(`Successfully assigned ${selectedGroups.length} group(s) to ${user.firstName} ${user.lastName}`);
  };

  const handleUnassignGroups = () => {
    // TODO: Implement unassign groups functionality
    console.log('Unassign groups clicked', selectedGroups);
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSelectAllGroups = () => {
    if (selectedGroups.length === userGroups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(userGroups.map(group => group.id));
    }
  };

  const handleDeleteGroup = (groupId, e) => {
    e.stopPropagation();
    // TODO: Implement delete group functionality
    console.log('Delete group clicked', groupId);
  };

  const handleBulkDeleteGroups = () => {
    // TODO: Implement bulk delete groups functionality
    console.log('Bulk delete groups clicked', selectedGroups);
  };

  const handleAssignRoles = () => {
    setShowAssignRoleModal(true);
  };

  const handleAssignRolesConfirm = async (selectedRoles) => {
    // TODO: Implement actual role assignment logic
    console.log('Assigning roles to user:', user.id, selectedRoles);
    // Here you would typically make an API call to assign the roles
    // For now, we'll just log the action
    alert(`Successfully assigned ${selectedRoles.length} role(s) to ${user.firstName} ${user.lastName}`);
  };

  const handleUnassignRoles = () => {
    // TODO: Implement unassign roles functionality
    console.log('Unassign roles clicked', selectedRoles);
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSelectAllRoles = () => {
    if (selectedRoles.length === userRoles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(userRoles.map(role => role.id));
    }
  };

  const handleDeleteRole = (roleId, e) => {
    e.stopPropagation();
    // TODO: Implement delete role functionality
    console.log('Delete role clicked', roleId);
  };

  const handleBulkDeleteRoles = () => {
    // TODO: Implement bulk delete roles functionality
    console.log('Bulk delete roles clicked', selectedRoles);
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
              <div className="text-lg text-muted-foreground">User not found</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock user groups and roles for display
  const userGroups = mockGroups.slice(0, 20); // Show first 20 groups as example
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
                  <TabsTrigger value="groups" className="tabs-trigger-underline">Assigned Groups ({userGroups.length})</TabsTrigger>
                  <TabsTrigger value="roles" className="tabs-trigger-underline">Assigned Roles ({userRoles.length})</TabsTrigger>
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
                      <div className="flex items-center justify-between w-full">
                        <CardTitle className="text-lg">Group Memberships</CardTitle>
                        <div className="flex items-center gap-3">
                          {selectedGroups.length > 0 && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={handleBulkDeleteGroups}
                              className="flex items-center gap-2"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Delete ({selectedGroups.length})
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleUnassignGroups}
                          >
                            Unassign Group(s)
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={handleAssignGroups}
                          >
                            Assign Group(s)
                          </Button>
                          <ViewToggle 
                            viewMode={groupsViewMode} 
                            onViewModeChange={handleGroupsViewModeChange} 
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {groupsViewMode === 'list' ? (
                        <div className="space-y-4">
                          {/* Select All Header for List View */}
                          {userGroups.length > 0 && (
                            <div className="flex items-center gap-3 pb-2 border-b">
                              <input
                                type="checkbox"
                                checked={selectedGroups.length === userGroups.length && userGroups.length > 0}
                                onChange={handleSelectAllGroups}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="text-sm font-medium text-muted-foreground">
                                Select All ({userGroups.length} groups)
                              </span>
                              {selectedGroups.length > 0 && (
                                <span className="text-sm text-primary ml-auto">
                                  {selectedGroups.length} selected
                                </span>
                              )}
                            </div>
                          )}
                          
                          {userGroups.map((group) => (
                            <div 
                              key={group.id} 
                              className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => handleGroupClick(group)}
                            >
                              {/* Checkbox */}
                              <div className="flex items-center pt-1">
                                <input
                                  type="checkbox"
                                  checked={selectedGroups.includes(group.id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleGroupSelect(group.id);
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-base mb-1">{group.name}</div>
                                <div className="text-sm text-body mb-2 line-clamp-2">{group.description}</div>
                              </div>
                              
                              {/* Delete Icon */}
                              <div className="flex items-center pt-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => handleDeleteGroup(group.id, e)}
                                  className="text-primary hover:text-white hover:bg-primary"
                                  title="Remove group from user"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {userGroups.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              No groups assigned to this user
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground w-12">
                                  <input
                                    type="checkbox"
                                    checked={selectedGroups.length === userGroups.length && userGroups.length > 0}
                                    onChange={handleSelectAllGroups}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Group Name</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Description</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Department</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Members</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground w-12">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userGroups.map((group) => (
                                <tr 
                                  key={group.id} 
                                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                                  onClick={() => handleGroupClick(group)}
                                >
                                  <td className="py-3 px-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedGroups.includes(group.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleGroupSelect(group.id);
                                      }}
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="font-medium text-sm">{group.name}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-sm text-body line-clamp-2">{group.description}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-sm text-muted-foreground">{group.department}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-sm text-muted-foreground">{group.memberCount}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => handleDeleteGroup(group.id, e)}
                                      className="text-primary hover:text-white hover:bg-primary"
                                      title="Remove group from user"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                              {userGroups.length === 0 && (
                                <tr>
                                  <td colSpan="6" className="text-center py-8 text-muted-foreground">
                                    No groups assigned to this user
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Roles Tab */}
                <TabsContent value="roles" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between w-full">
                        <CardTitle className="text-lg">Role Assignments</CardTitle>
                        <div className="flex items-center gap-3">
                          {selectedRoles.length > 0 && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={handleBulkDeleteRoles}
                              className="flex items-center gap-2"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Delete ({selectedRoles.length})
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleUnassignRoles}
                          >
                            Unassign Role(s)
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={handleAssignRoles}
                          >
                            Assign Role(s)
                          </Button>
                          <ViewToggle 
                            viewMode={rolesViewMode} 
                            onViewModeChange={handleRolesViewModeChange} 
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {rolesViewMode === 'list' ? (
                        <div className="space-y-4">
                          {/* Select All Header for List View */}
                          {userRoles.length > 0 && (
                            <div className="flex items-center gap-3 pb-2 border-b">
                              <input
                                type="checkbox"
                                checked={selectedRoles.length === userRoles.length && userRoles.length > 0}
                                onChange={handleSelectAllRoles}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="text-sm font-medium text-muted-foreground">
                                Select All ({userRoles.length} roles)
                              </span>
                              {selectedRoles.length > 0 && (
                                <span className="text-sm text-primary ml-auto">
                                  {selectedRoles.length} selected
                                </span>
                              )}
                            </div>
                          )}
                          
                          {userRoles.map((role) => (
                            <div 
                              key={role.id} 
                              className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => handleRoleClick(role)}
                            >
                              {/* Checkbox */}
                              <div className="flex items-center pt-1">
                                <input
                                  type="checkbox"
                                  checked={selectedRoles.includes(role.id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleRoleSelect(role.id);
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-base mb-1">{role.name}</div>
                                <div className="text-sm text-body mb-2 line-clamp-2">{role.description}</div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="text-blue-600 hover:text-blue-800">{role.userCount} users</span>
                                  <span>•</span>
                                  <span>{role.composite ? 'Composite' : 'Simple'} role</span>
                                </div>
                              </div>
                              
                              {/* Delete Icon */}
                              <div className="flex items-center pt-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => handleDeleteRole(role.id, e)}
                                  className="text-primary hover:text-white hover:bg-primary"
                                  title="Remove role from user"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {userRoles.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              No roles assigned to this user
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground w-12">
                                  <input
                                    type="checkbox"
                                    checked={selectedRoles.length === userRoles.length && userRoles.length > 0}
                                    onChange={handleSelectAllRoles}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Role Name</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Description</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Type</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Users</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground w-12">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userRoles.map((role) => (
                                <tr 
                                  key={role.id} 
                                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                                  onClick={() => handleRoleClick(role)}
                                >
                                  <td className="py-3 px-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedRoles.includes(role.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleRoleSelect(role.id);
                                      }}
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="font-medium text-sm">{role.name}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-sm text-body line-clamp-2">{role.description}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-sm text-muted-foreground">{role.composite ? 'Composite' : 'Simple'}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-sm text-muted-foreground">{role.userCount}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => handleDeleteRole(role.id, e)}
                                      className="text-primary hover:text-white hover:bg-primary"
                                      title="Remove role from user"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                              {userRoles.length === 0 && (
                                <tr>
                                  <td colSpan="6" className="text-center py-8 text-muted-foreground">
                                    No roles assigned to this user
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
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
                  <h2 className="text-xl font-semibold text-header">{selectedGroup.name} ({getGroupMembers(selectedGroup.id).length})</h2>
                  <p className="text-sm text-body mt-1">{selectedGroup.description}</p>
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
                            isClickable ? 'text-blue-600' : 'text-muted-foreground'
                          }`}>
                            {member.firstName[0]}{member.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className={`font-medium text-sm ${
                            isClickable 
                              ? 'text-blue-900 hover:text-blue-700' 
                              : 'text-body'
                          }`}>
                            {member.firstName} {member.lastName}
                            {isClickable && <span className="ml-2 text-xs text-blue-500">• View Profile</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">
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
                  <div className="text-center py-8 text-muted-foreground">
                    No members found in this group
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Role Detail Modal */}
      <Modal isOpen={showRoleDetail} onClose={handleCloseRoleDetail} className="max-w-4xl w-full max-h-[90vh] flex flex-col">
        <ModalHeader onClose={handleCloseRoleDetail} className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <CogIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <ModalTitle className="text-header">{selectedRole?.name}</ModalTitle>
              <p className="text-sm text-muted-foreground mt-1">Role assigned to {user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </ModalHeader>

        <ModalContent className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            {/* Role Information */}
            <div>
              <h3 className="text-lg font-medium text-header mb-4">Role Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Role Name</Label>
                  <div className="text-sm text-body mt-1">{selectedRole?.name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <div className="text-sm text-body mt-1">
                    {selectedRole?.composite ? 'Composite Role' : 'Simple Role'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="text-sm text-body mt-1">{selectedRole?.description}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Users</Label>
                  <div className="text-sm text-body mt-1">{selectedRole?.userCount} users</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <div className="text-sm text-body mt-1">{selectedRole?.createdDate}</div>
                </div>
              </div>
            </div>

            {/* Users with this Role */}
            <div>
              <h3 className="text-lg font-medium text-header mb-4">Users with this Role ({getRoleMembers(selectedRole?.id || '').length})</h3>
              <div className="space-y-3">
                {getRoleMembers(selectedRole?.id || '').map((user) => {
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
                          handleCloseRoleDetail();
                          navigate(`/users/${user.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isRealUser ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <span className={`font-medium text-sm ${
                            isRealUser ? 'text-blue-600' : 'text-muted-foreground'
                          }`}>
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm ${
                            isRealUser 
                              ? 'text-blue-900 hover:text-blue-700' 
                              : 'text-body'
                          }`}>
                            {user.firstName} {user.lastName}
                            {isRealUser && <span className="ml-2 text-xs text-blue-500">• View Profile</span>}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
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
                {getRoleMembers(selectedRole?.id || '').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found with this role
                  </div>
                )}
              </div>
            </div>

            {/* Permissions */}
            {selectedRole?.attributes?.permissions && (
              <div>
                <h3 className="text-lg font-medium text-header mb-4">Permissions</h3>
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
        </ModalContent>

        <ModalFooter className="flex-shrink-0">
          <Button
            onClick={() => handleRoleDetailClick(selectedRole.id)}
          >
            View Full Role Details
          </Button>
          <Button
            variant="outline"
            onClick={handleCloseRoleDetail}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Assign Groups Modal */}
      <AssignGroupModal
        isOpen={showAssignGroupModal}
        onClose={() => setShowAssignGroupModal(false)}
        onAssign={handleAssignGroupsConfirm}
        targetType="user"
        targetName={`${user?.firstName} ${user?.lastName}`}
        excludeGroupIds={userGroups.map(group => group.id)}
      />

      {/* Assign Roles Modal */}
      <AssignRoleModal
        isOpen={showAssignRoleModal}
        onClose={() => setShowAssignRoleModal(false)}
        onAssign={handleAssignRolesConfirm}
        targetType="user"
        targetName={`${user?.firstName} ${user?.lastName}`}
        excludeRoleIds={userRoles.map(role => role.id)}
      />
      
      <Footer />
    </div>
  );
};

export default UserDetailPage;
