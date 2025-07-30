import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import CreateGroupModal from '../components/groups/CreateGroupModal';
import GroupsTable from '../components/groups/GroupsTable';
import ViewToggle from '../components/ui/view-toggle';
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
import { mockGroups, getDepartments } from '../data/mockGroups';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  CogIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const GroupsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('groupsViewMode') || 'card';
  });

  // Use mock groups data
  const [groups] = useState(mockGroups);
  const departments = ['all', ...getDepartments()];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/setup');
    }
  }, [navigate]);

  const handleCreateGroup = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSaveGroup = (groupData) => {
    console.log('Save group:', groupData);
    // Here you would typically make an API call to save the group
    // For now, just log the data
  };

  const handleEditGroup = (groupId) => {
    console.log('Edit group:', groupId);
  };

  const handleDeleteGroup = (groupId) => {
    console.log('Delete group:', groupId);
  };

  const handleViewMembers = (groupId) => {
    console.log('View members for group:', groupId);
  };

  const handleViewRoles = (groupId) => {
    console.log('View roles for group:', groupId);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    localStorage.setItem('groupsViewMode', newViewMode);
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterDepartment === 'all' || group.department === filterDepartment;
    
    return matchesSearch && matchesFilter;
  });

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="page-title">Group Management</h1>
              <p className="page-description">
                Manage groups, members, and group role assignments.
              </p>
            </div>
            <Button variant="primary-header" onClick={handleCreateGroup} className="shrink-0">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Group
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
                      placeholder="Search groups..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 w-full"
                    />
                  </div>

                  {/* Department Filter */}
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept === 'all' ? 'All Departments' : dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Results Count */}
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    Showing {filteredGroups.length} of {groups.length} groups
                  </div>
                  
                  {/* View Toggle */}
                  <ViewToggle 
                    viewMode={viewMode} 
                    onViewModeChange={handleViewModeChange} 
                  />
                </div>
              </div>

              {/* Groups Content - Card or Table View */}
              {viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <Card key={group.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                              <UserGroupIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <CardTitle className="text-lg truncate">{group.name}</CardTitle>
                              <Badge variant={getDepartmentColor(group.department)} className="text-xs">
                                {group.department}
                              </Badge>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <EllipsisVerticalIcon className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditGroup(group.id)}>
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit Group
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewMembers(group.id)}>
                                <UsersIcon className="h-4 w-4 mr-2" />
                                View Members
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewRoles(group.id)}>
                                <CogIcon className="h-4 w-4 mr-2" />
                                View Roles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteGroup(group.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete Group
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <CardDescription className="line-clamp-2">
                          {group.description}
                        </CardDescription>

                        {/* Stats */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{group.memberCount}</span>
                            <span className="text-muted-foreground">members</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CogIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{group.roleCount}</span>
                            <span className="text-muted-foreground">roles</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="flex gap-2 w-full">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditGroup(group.id)}
                            className="flex-1"
                          >
                            <PencilIcon className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewMembers(group.id)}
                            className="flex-1"
                          >
                            <UsersIcon className="h-3 w-3 mr-1" />
                            Members
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="overflow-visible mb-5 h-full">
                  <GroupsTable
                    groups={filteredGroups}
                    onEditGroup={handleEditGroup}
                    onDeleteGroup={handleDeleteGroup}
                    onViewMembers={handleViewMembers}
                    onViewRoles={handleViewRoles}
                  />
                </Card>
              )}

              {/* Empty State */}
              {filteredGroups.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <UserGroupIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">No groups found</CardTitle>
                    <CardDescription className="text-center mb-4">
                      {searchTerm || filterDepartment !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by creating your first group.'
                      }
                    </CardDescription>
                    {(!searchTerm && filterDepartment === 'all') && (
                      <Button variant="primary-header" onClick={handleCreateGroup}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Group
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
      
      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveGroup}
      />
    </div>
  );
};

export default GroupsPage;
