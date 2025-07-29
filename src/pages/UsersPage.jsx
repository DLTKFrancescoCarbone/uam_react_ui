import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import UserTable from '../components/users/UserTable';
import AddUserModal from '../components/users/AddUserModal';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const UsersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

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

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
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
              <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
              <p className="text-muted-foreground">
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
            <CardContent className="main-content-body space-y-8">
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
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={handleSearch}
                          className="pl-10"
                        />
                      </div>

                      {/* Status Filter */}
                      <div className="flex items-center gap-2">
                        <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                        <Select 
                          value={filterStatus}
                          onChange={handleFilterChange}
                          className="w-48"
                        >
                          <option value="all">All Users</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </Select>
                      </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      Showing 1,247 users
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card className="overflow-hidden">
                <UserTable 
                  searchTerm={searchTerm}
                  filterStatus={filterStatus}
                />
              </Card>
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
