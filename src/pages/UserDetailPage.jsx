import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { mockUsers } from '../data/mockUsers';
import { mockGroups } from '../data/mockGroups';
import { mockRoles } from '../data/mockRoles';

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    }
    setLoading(false);
  }, [userId, navigate]);

  const handleBack = () => {
    navigate('/users');
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
    <h1 className="page-title">User Details</h1>
    <p className="page-description">
      Complete information for {user.firstName} {user.lastName}
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
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">User Details</TabsTrigger>
                  <TabsTrigger value="groups">Groups</TabsTrigger>
                  <TabsTrigger value="roles">Roles</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Username</label>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                            {user.username}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Status</label>
                          <div>
                            <Badge 
                              variant={user.status === 'Active' ? 'default' : 'secondary'}
                              className={user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            >
                              {user.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">First Name</label>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                            {user.firstName}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Last Name</label>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                            {user.lastName}
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Email Address</label>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                            {user.email}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Created Date</label>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                            {user.created}
                          </div>
                        </div>
                      </div>
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
                          <div key={group.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="font-medium text-base mb-1">{group.name}</div>
                              <div className="text-sm text-gray-600 mb-2">{group.description}</div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{group.memberCount} members</span>
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
                          <div key={role.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="font-medium text-base mb-1">{role.name}</div>
                              <div className="text-sm text-gray-600 mb-2">{role.description}</div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{role.userCount} users</span>
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
      
      <Footer />
    </div>
  );
};

export default UserDetailPage;
