import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { FloatingLabelInput } from '../components/ui/floating-label-input';
import { ToggleSwitch } from '../components/ui/toggle-switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { ArrowLeftIcon, CogIcon, UserIcon, TrashIcon } from '@heroicons/react/24/outline';
import ViewToggle from '../components/ui/view-toggle';
import { mockRoles, getRoleMembers } from '../data/mockRoles';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/ui/modal';
import AssignUserModal from '../components/modals/AssignUserModal';
import EnhancedPermissionsTab from '../components/roles/EnhancedPermissionsTab';

const RoleDetailPage = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedRole, setEditedRole] = useState({
    name: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isComposite, setIsComposite] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [editedPermissions, setEditedPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [usersViewMode, setUsersViewMode] = useState(() => {
    return localStorage.getItem('roleDetailUsersViewMode') || 'list';
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/setup');
      return;
    }

    // Find role by ID
    const foundRole = mockRoles.find(r => r.id === roleId);
    if (foundRole) {
      setRole(foundRole);
      setIsComposite(foundRole.composite);
      setEditedRole({
        name: foundRole.name,
        description: foundRole.description
      });
      // Reset to details tab when loading a new role
      setActiveTab('details');
    }
    setLoading(false);
  }, [roleId, navigate]);

  // Initialize permissions when role is loaded
  useEffect(() => {
    if (role) {
      const initialPermissions = [
        { id: 1, name: 'User Management', description: 'Create, edit, and delete users', granted: true },
        { id: 2, name: 'Role Management', description: 'Manage roles and permissions', granted: role.composite },
        { id: 3, name: 'System Settings', description: 'Configure system settings', granted: role.name === 'admin' },
        { id: 4, name: 'Project Access', description: 'Access to project data', granted: true },
        { id: 5, name: 'Financial Data', description: 'Access to financial information', granted: role.name.includes('finance') },
        { id: 6, name: 'HR Data Access', description: 'Access to employee records', granted: role.name.includes('hr') },
        { id: 7, name: 'Quality Control', description: 'Quality assurance and audit capabilities', granted: role.name.includes('quality') },
        { id: 8, name: 'Field Operations', description: 'Mobile and field access capabilities', granted: role.name.includes('field') },
      ];
      setRolePermissions(initialPermissions);
    }
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
      setRole({ ...role, ...editedRole, composite: isComposite });
      setIsEditing(false);
      // Here you would typically make an API call to save the changes
    }
  };

  const handleCompositeToggle = (value) => {
    setIsComposite(value);
    // Don't update role immediately, wait for save
  };

  const handleCancel = () => {
    setEditedRole({
      name: role.name,
      description: role.description
    });
    setIsComposite(role.composite);
    setErrors({});
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate('/roles');
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

  if (!role) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-[76px] pb-16 min-h-screen">
          <Sidebar />
          <div className="ml-[66px] px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-muted-foreground">Role not found</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get role members
  const roleMembers = getRoleMembers(role.id);

  const handleSavePermissions = () => {
    setRolePermissions([...editedPermissions]);
    setEditedPermissions([]);
    // Here you would typically make an API call to save permissions
    console.log('Saving permissions:', editedPermissions);
  };


  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleCloseUserDetail = () => {
    setShowUserDetail(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (user, e) => {
    e.stopPropagation();
    setDeleteUser(user);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    // Here you would typically make an API call to remove the user from the role
    console.log(`Removing user ${deleteUser.firstName} ${deleteUser.lastName} from role ${role.name}`);
    
    setShowDeleteConfirm(false);
    setDeleteUser(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteUser(null);
  };

  const handleUsersViewModeChange = (newViewMode) => {
    setUsersViewMode(newViewMode);
    localStorage.setItem('roleDetailUsersViewMode', newViewMode);
  };

  const handleAssignUsers = () => {
    setShowAssignUserModal(true);
  };

  const handleAssignUsersConfirm = async (selectedUsers) => {
    // TODO: Implement actual user assignment logic
    console.log('Assigning users to role:', role.id, selectedUsers);
    // Here you would typically make an API call to assign the users
    // For now, we'll just log the action
    alert(`Successfully assigned ${selectedUsers.length} user(s) to role ${role.name}`);
  };

  const handleUnassignUsers = () => {
    // TODO: Implement unassign users functionality
    console.log('Unassign users clicked', selectedUsers);
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === roleMembers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(roleMembers.map(user => user.id));
    }
  };

  const handleBulkDeleteUsers = () => {
    // TODO: Implement bulk delete users functionality
    console.log('Bulk delete users clicked', selectedUsers);
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
                  <CogIcon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="page-title">{role.name}</h1>
              </div>
              <p className="page-description">
                Role details for {role.name}
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Roles
            </Button>
          </div>

          {/* Main Content Container */}
          <Card className="main-content-card">
            <CardContent className="main-content-body">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="tabs-container">
                <TabsList className="tabs-list-underline">
                  <TabsTrigger value="details" className="tabs-trigger-underline">Role Details</TabsTrigger>
                  <TabsTrigger value="permissions" className="tabs-trigger-underline">Permissions</TabsTrigger>
                  <TabsTrigger value="users" className="tabs-trigger-underline">Assigned Users ({roleMembers.length})</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between w-full">
                        <CardTitle className="text-lg">Role Information</CardTitle>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">Created: {role.createdDate}</span>
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
                      {/* Role Type Display and Active Users Summary */}
                      {isEditing ? (
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <ToggleSwitch
                              checked={isComposite}
                              onChange={handleCompositeToggle}
                            />
                            <Label className="text-sm font-medium text-muted-foreground">
                              Type
                            </Label>
                            <Badge 
                              variant={isComposite ? 'purple' : 'cyan'}
                              className="text-xs"
                            >
                              {isComposite ? 'Composite' : 'Simple'}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">Active Users: </span>
                            <span className="text-sm text-gray-600">
                              {roleMembers.filter(user => user.status === 'Active').length}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium">Type:</Label>
                            <Badge 
                              variant={isComposite ? 'purple' : 'cyan'}
                              className="text-xs"
                            >
                              {isComposite ? 'Composite' : 'Simple'}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">Active Users: </span>
                            <span className="text-sm text-gray-600">
                              {roleMembers.filter(user => user.status === 'Active').length}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* First Row: Role Name */}
                      <div className="grid grid-cols-1 gap-4 items-end">
                        <div className="min-h-[4rem] flex flex-col justify-end">
                          {isEditing ? (
                            <FloatingLabelInput
                              id="roleName"
                              label="Role Name"
                              value={editedRole.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              error={errors.name}
                              className="form-field-editable"
                            />
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Role Name</Label>
                              <div className="form-field-readonly">{role.name}</div>
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
                              value={editedRole.description}
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
                            <div className="form-field-readonly">{role.description}</div>
                          </div>
                        )}
                      </div>

                      {/* Third Row: User Count */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Assigned Users</Label>
                          <div className="form-field-readonly">{role.userCount} users</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Last Modified</Label>
                          <div className="form-field-readonly">{role.lastModified}</div>
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

                {/* Enhanced Permissions Tab */}
                <TabsContent value="permissions" className="space-y-6 mt-6">
                  <EnhancedPermissionsTab
                    rolePermissions={rolePermissions}
                    onPermissionsChange={(updatedPermissions) => {
                      setEditedPermissions(updatedPermissions);
                    }}
                    onSavePermissions={handleSavePermissions}
                    showFilters={true}
                  />
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between w-full">
                        <CardTitle className="text-lg">User Assignments</CardTitle>
                        <div className="flex items-center gap-3">
                          {selectedUsers.length > 0 && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={handleBulkDeleteUsers}
                              className="flex items-center gap-2"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Delete ({selectedUsers.length})
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleUnassignUsers}
                          >
                            Unassign User(s)
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={handleAssignUsers}
                          >
                            Assign User(s)
                          </Button>
                          <ViewToggle 
                            viewMode={usersViewMode} 
                            onViewModeChange={handleUsersViewModeChange} 
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {usersViewMode === 'list' ? (
                        <div className="space-y-4">
                          {/* Select All Header for List View */}
                          {roleMembers.length > 0 && (
                            <div className="flex items-center gap-3 pb-2 border-b">
                              <input
                                type="checkbox"
                                checked={selectedUsers.length === roleMembers.length && roleMembers.length > 0}
                                onChange={handleSelectAllUsers}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="text-sm font-medium text-muted-foreground">
                                Select All ({roleMembers.length} users)
                              </span>
                              {selectedUsers.length > 0 && (
                                <span className="text-sm text-primary ml-auto">
                                  {selectedUsers.length} selected
                                </span>
                              )}
                            </div>
                          )}
                          
                          {roleMembers.map((user) => (
                            <div 
                              key={user.id} 
                              className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => {
                                // Check if this is a real user ID that has a detail page
                                if (Number(user.id) <= 15) {
                                  handleUserClick(user);
                                }
                              }}
                            >
                              {/* Checkbox */}
                              <div className="flex items-center pt-1">
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleUserSelect(user.id);
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-base mb-1">
                                  {user.firstName} {user.lastName}
                                  {Number(user.id) <= 15 && <span className="ml-2 text-xs text-blue-500">• View Details</span>}
                                </div>
                                <div className="text-sm text-body mb-2">{user.username} • {user.email}</div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={user.status === 'Active' ? 'success' : 'secondary'}
                                  >
                                    {user.status}
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Delete Icon */}
                              <div className="flex items-center pt-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => handleDeleteClick(user, e)}
                                  className="text-primary hover:text-white hover:bg-primary"
                                  title="Remove user from role"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {roleMembers.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              No users assigned to this role
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
                                    checked={selectedUsers.length === roleMembers.length && roleMembers.length > 0}
                                    onChange={handleSelectAllUsers}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Name</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Username</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Email</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground w-12">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {roleMembers.map((user) => (
                                <tr 
                                  key={user.id} 
                                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                                  onClick={() => {
                                    // Check if this is a real user ID that has a detail page
                                    if (Number(user.id) <= 15) {
                                      handleUserClick(user);
                                    }
                                  }}
                                >
                                  <td className="py-3 px-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedUsers.includes(user.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleUserSelect(user.id);
                                      }}
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="font-medium text-sm">
                                      {user.firstName} {user.lastName}
                                      {Number(user.id) <= 15 && <span className="ml-2 text-xs text-blue-500">• View Details</span>}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-sm text-body">{user.username}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-sm text-body">{user.email}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge 
                                      variant={user.status === 'Active' ? 'success' : 'secondary'}
                                    >
                                      {user.status}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => handleDeleteClick(user, e)}
                                      className="text-primary hover:text-white hover:bg-primary"
                                      title="Remove user from role"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                              {roleMembers.length === 0 && (
                                <tr>
                                  <td colSpan="6" className="text-center py-8 text-muted-foreground">
                                    No users assigned to this role
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
      
      {/* User Detail Modal */}
      <Modal isOpen={showUserDetail} onClose={handleCloseUserDetail} className="max-w-2xl w-full">
        <ModalHeader onClose={handleCloseUserDetail}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <ModalTitle className="text-header">{selectedUser?.firstName} {selectedUser?.lastName}</ModalTitle>
              <p className="text-sm text-muted-foreground mt-1">{selectedUser?.email}</p>
            </div>
          </div>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-header mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Username</Label>
                  <div className="text-sm text-body mt-1">{selectedUser?.username}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedUser?.status === 'Active' ? 'success' : 'secondary'}>
                      {selectedUser?.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">First Name</Label>
                  <div className="text-sm text-body mt-1">{selectedUser?.firstName}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Name</Label>
                  <div className="text-sm text-body mt-1">{selectedUser?.lastName}</div>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <div className="text-sm text-body mt-1">{selectedUser?.email}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <div className="text-sm text-body mt-1">{selectedUser?.created}</div>
                </div>
              </div>
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button
            onClick={() => {
              handleCloseUserDetail();
              navigate(`/users/${selectedUser.id}`);
            }}
          >
            View Full Profile
          </Button>
          <Button
            variant="outline"
            onClick={handleCloseUserDetail}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={handleDeleteCancel} className="max-w-md w-full">
        <ModalHeader onClose={handleDeleteCancel}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg shrink-0">
              <TrashIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <ModalTitle className="text-header">Confirm Removal</ModalTitle>
              <p className="text-sm text-muted-foreground mt-1">Remove user from role</p>
            </div>
          </div>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-4">
            <p className="text-sm text-body">
              Are you sure you want to remove <strong>{deleteUser?.firstName} {deleteUser?.lastName}</strong> from the role <strong>{role?.name}</strong>?
            </p>
            <p className="text-xs text-muted-foreground">
              This action cannot be undone. The user will no longer have the permissions associated with this role.
            </p>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Remove User
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteCancel}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Assign Users Modal */}
      <AssignUserModal
        isOpen={showAssignUserModal}
        onClose={() => setShowAssignUserModal(false)}
        onAssign={handleAssignUsersConfirm}
        targetType="role"
        targetName={role?.name}
        excludeUserIds={roleMembers.map(user => user.id)}
      />
      
      <Footer />
    </div>
  );
};

export default RoleDetailPage;