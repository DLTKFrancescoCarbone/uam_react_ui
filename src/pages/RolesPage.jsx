import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select } from '../components/ui/select';
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
import { mockRoles } from '../data/mockRoles';
import { 
  CogIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
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
    console.log('Edit role:', roleId);
  };

  const handleDeleteRole = (roleId) => {
    console.log('Delete role:', roleId);
  };

  const handleViewUsers = (roleId) => {
    console.log('View users for role:', roleId);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
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
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                      {/* Search Input */}
                      <div className="relative flex-1 max-w-sm">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search roles..."
                          value={searchTerm}
                          onChange={handleSearch}
                          className="pl-10"
                        />
                      </div>

                      {/* Type Filter */}
                      <div className="flex items-center gap-2">
                        <Select 
                          value={filterType}
                          onChange={handleFilterChange}
                          className="w-48"
                        >
                          <option value="all">All Roles</option>
                          <option value="composite">Composite Roles</option>
                          <option value="simple">Simple Roles</option>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
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
                </CardContent>
              </Card>

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
                              <EllipsisVerticalIcon className="h-4 w-4" />
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
                <Card className="overflow-hidden mb-5">
                  <RolesTable
                    roles={filteredRoles}
                    onEditRole={handleEditRole}
                    onDeleteRole={handleDeleteRole}
                    onViewUsers={handleViewUsers}
                  />
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
    </div>
  );
};

export default RolesPage;
