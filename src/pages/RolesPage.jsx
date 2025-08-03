import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select-shadcn';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import AddRoleModal from '../components/roles/AddRoleModal';
import RolesTable from '../components/roles/RolesTable';
import ViewToggle from '../components/ui/view-toggle';
import { mockRoles, getRoleMembers } from '../data/mockRoles';
import { mockUsers } from '../data/mockUsers';
import { 
  CogIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const RolesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('rolesViewMode') || 'card';
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const [showUsersModal, setShowUsersModal] = useState(false);

  // Import mock roles data
  const [roles] = useState(mockRoles);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/setup');
    }
  }, [navigate]);

  const handleCreateRole = () => {
    setIsAddRoleModalOpen(true);
  };

  const handleCloseAddRoleModal = () => {
    setIsAddRoleModalOpen(false);
  };

  const handleSaveRole = (roleData) => {
    console.log('Save role:', roleData);
    // Here you would typically save the role to your backend
    // For now, just log the data
  };

  const handleEditRole = (roleId) => {
    navigate(`/roles/${roleId}`);
  };

  const handleDeleteRole = (roleId) => {
    console.log('Delete role:', roleId);
  };

  const handleViewUsers = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role);
      setShowUsersModal(true);
    }
  };

  const handleCloseUsersModal = () => {
    setShowUsersModal(false);
    setSelectedRole(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    localStorage.setItem('rolesViewMode', newViewMode);
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'composite' && role.composite) ||
                         (filterType === 'simple' && !role.composite);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-[76px] pb-16 min-h-screen">
        <Sidebar />
        
        <div className="ml-[66px] px-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="page-title">Role Management</h1>
              <p className="page-description">
                Manage roles, permissions, and role assignments.
              </p>
            </div>
            <Button variant="primary-header" onClick={handleCreateRole} className="shrink-0">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>

          {/* Main Content Container */}
          <Card className="main-content-card">
            <CardContent className="main-content-body space-y-2">
              {/* Search and Filter Section */}
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-card">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 flex-1">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-auto sm:max-w-sm">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search roles..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 w-full"
                    />
                  </div>

                  {/* Type Filter */}
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="composite">Composite Roles</SelectItem>
                      <SelectItem value="simple">Simple Roles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Results Count */}
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    Showing {filteredRoles.length} of {roles.length} roles
                  </div>
                  
                  {/* View Toggle */}
                  <ViewToggle 
                    viewMode={viewMode} 
                    onViewModeChange={handleViewModeChange} 
                  />
                </div>
              </div>

              {/* Roles Content - Card or Table View */}
              {viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRoles.map((role) => (
                    <Card key={role.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                              <CogIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <CardTitle className="text-lg truncate">{role.name}</CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge variant={role.composite ? 'secondary' : 'outline'} className="text-xs">
                                  {role.composite ? 'Composite' : 'Simple'}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <UsersIcon className="h-3 w-3" />
                                  <span>{role.userCount}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditRole(role.id)}>
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit Role
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewUsers(role.id)}>
                                <UsersIcon className="h-4 w-4 mr-2" />
                                View Users
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteRole(role.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete Role
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <CardDescription className="line-clamp-2">
                          {role.description}
                        </CardDescription>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="flex gap-2 w-full">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditRole(role.id)}
                            className="flex-1"
                          >
                            <PencilIcon className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewUsers(role.id)}
                            className="flex-1"
                          >
                            <UsersIcon className="h-3 w-3 mr-1" />
                            Users ({role.userCount})
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="overflow-visible mb-5 h-full">
                  <RolesTable />
                </Card>
              )}

              {/* Empty State */}
              {filteredRoles.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <CogIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">No roles found</CardTitle>
                    <CardDescription className="text-center mb-4">
                      {searchTerm || filterType !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by creating your first role.'
                      }
                    </CardDescription>
                    {(!searchTerm && filterType === 'all') && (
                      <Button variant="primary-header" onClick={handleCreateRole}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Role
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
      
      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={handleCloseAddRoleModal}
        onSave={handleSaveRole}
      />

      {/* Role Users Modal */}
      {showUsersModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedRole.name} ({getRoleMembers(selectedRole.id).length})</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedRole.description}</p>
                </div>
                <button
                  onClick={handleCloseUsersModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-3">
                {getRoleMembers(selectedRole.id).map((user) => {
                  // Check if this is a real user ID that has a detail page
                  const isRealUser = mockUsers.find(u => Number(u.id) === Number(user.id));
                  const isClickable = Boolean(isRealUser);
                  
                  return (
                    <div 
                      key={user.id} 
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                        isClickable 
                          ? 'hover:bg-blue-50 hover:border-blue-200 cursor-pointer' 
                          : 'hover:bg-gray-50 cursor-default opacity-90'
                      }`}
                      onClick={() => {
                        if (isClickable) {
                          handleCloseUsersModal();
                          navigate(`/users/${user.id}`);
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
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className={`font-medium text-sm ${
                            isClickable 
                              ? 'text-blue-900 hover:text-blue-700' 
                              : 'text-gray-700'
                          }`}>
                            {user.firstName} {user.lastName}
                            {isClickable && <span className="ml-2 text-xs text-blue-500">• View Profile</span>}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.username} • {user.email}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={user.status === 'Active' ? 'success' : 'secondary'}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  );
                })}
                {getRoleMembers(selectedRole.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users assigned to this role
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
