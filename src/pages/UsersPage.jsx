import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import UserTable from '../components/users/UserTable';
import AddUserModal from '../components/users/AddUserModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import ViewToggle from '../components/ui/view-toggle';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select-shadcn';
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { mockUsers } from '../data/mockUsers';

const UsersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('usersViewMode') || 'table';
  });
  
  // Import mock users data
  const [users] = useState(mockUsers);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/setup');
    }
  }, [navigate]);

  const handleCreateUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleSaveUser = (userData) => {
    // Here you would typically save the user data to your backend
    console.log('Saving user:', userData);
    
    // For now, just show a success message
    alert(`User ${userData.username} has been created successfully!`);
    
    // Close the modal
    setIsAddUserModalOpen(false);
  };

  const handleExportUsers = () => {
    // Export users functionality
    console.log('Export users clicked');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    localStorage.setItem('usersViewMode', newViewMode);
  };

  const handleEditUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleViewUser = (user) => {
    // This would open the user detail panel (slideout)
    // For now, navigate to user detail page
    navigate(`/users/${user.id}`);
  };

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         user.status.toLowerCase() === filterStatus.toLowerCase();
    
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
              <h1 className="page-title">User Management</h1>
              <p className="page-description">
                Manage users, their roles, and group memberships.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={handleExportUsers}
                className="shrink-0"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="primary-header"
                onClick={handleCreateUser}
                className="shrink-0"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Main Content Container */}
          <Card className="main-content-card">
            <CardContent className="main-content-body space-y-2 h-full">
              {/* Search and Filter Section */}
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-card">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 flex-1">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-auto sm:max-w-sm">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 w-full"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Results Count */}
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    Showing {filteredUsers.length} of {users.length} users
                  </div>
                  
                  {/* View Toggle */}
                  <ViewToggle 
                    viewMode={viewMode} 
                    onViewModeChange={handleViewModeChange} 
                  />
                </div>
              </div>

              {/* Users Content - Card or Table View */}
              {viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => {
                    const getStatusVariant = (status) => {
                      switch (status.toLowerCase()) {
                        case 'active':
                          return 'success';
                        case 'inactive':
                          return 'secondary';
                        case 'pending':
                          return 'warning';
                        case 'suspended':
                          return 'error';
                        default:
                          return 'secondary';
                      }
                    };

                    return (
                      <Card key={user.id} className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <span className="font-medium text-sm text-blue-600">
                                  {user.firstName[0]}{user.lastName[0]}
                                </span>
                              </div>
                              <div className="space-y-1 min-w-0">
                                <CardTitle className="text-lg truncate">{user.firstName} {user.lastName}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Badge variant={getStatusVariant(user.status)} className="text-xs">
                                    {user.status}
                                  </Badge>
                                  <div className="text-sm text-muted-foreground truncate">
                                    @{user.username}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600 truncate">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              Created: {user.created}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0">
                          <div className="flex gap-2 w-full">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewUser(user)}
                              className="flex-1"
                            >
                              <EyeIcon className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditUser(user.id)}
                              className="flex-1"
                            >
                              <PencilIcon className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="overflow-visible h-full">
                  <UserTable 
                    searchTerm={searchTerm}
                    filterStatus={filterStatus}
                  />
                </Card>
              )}

              {/* Empty State */}
              {filteredUsers.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">No users found</CardTitle>
                    <CardDescription className="text-center mb-4">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by creating your first user.'
                      }
                    </CardDescription>
                    {(!searchTerm && filterStatus === 'all') && (
                      <Button variant="primary-header" onClick={handleCreateUser}>
                        <UserPlusIcon className="h-4 w-4 mr-2" />
                        Add User
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
      
      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UsersPage;
