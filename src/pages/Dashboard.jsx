import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  CogIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/setup');
    }
  }, [navigate]);

  const [stats] = useState({
    totalUsers: 1247,
    activeUsers: 1089,
    totalRoles: 45,
    totalGroups: 23,
    pendingRequests: 12,
    systemAlerts: 3
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'user_created',
      message: 'New user John Smith added to Engineering group',
      timestamp: '2 minutes ago',
      severity: 'info'
    },
    {
      id: 2,
      type: 'access_granted',
      message: 'ProjectWise access granted to 5 users',
      timestamp: '15 minutes ago',
      severity: 'success'
    },
    {
      id: 3,
      type: 'system_alert',
      message: 'License limit approaching for Deltek Vantagepoint',
      timestamp: '1 hour ago',
      severity: 'warning'
    },
    {
      id: 4,
      type: 'role_assigned',
      message: 'Admin role assigned to Sarah Johnson',
      timestamp: '2 hours ago',
      severity: 'info'
    },
    {
      id: 5,
      type: 'group_created',
      message: 'New group "Marketing Team" created',
      timestamp: '3 hours ago',
      severity: 'success'
    }
  ]);

  const [systemHealth] = useState([
    { service: 'Authentication Service', status: 'healthy', uptime: '99.9%' },
    { service: 'User Management API', status: 'healthy', uptime: '99.8%' },
    { service: 'License Management', status: 'warning', uptime: '98.5%' },
    { service: 'Audit Logging', status: 'healthy', uptime: '99.9%' }
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_created':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'access_granted':
        return <ShieldCheckIcon className="h-5 w-5" />;
      case 'system_alert':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'role_assigned':
        return <CogIcon className="h-5 w-5" />;
      case 'group_created':
        return <UsersIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="page-container">
      <Header />
      
      <div className="page-content">
        <Sidebar />
        
        <div className="page-main">
          {/* Header Section */}
          <div className="page-header">
            <div className="page-title-section space-y-1">
              <h1 className="page-title">Dashboard</h1>
              <p className="page-description">
                Welcome back! Here's what's happening with your UAM platform.
              </p>
            </div>
            <div className="page-timestamp">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Main Content Container */}
          <Card className="main-content-card">
            <CardContent className="main-content-body space-y-4">
              {/* Key Metrics */}
              <div className="metrics-grid">
                <Card>
                  <CardContent className="dashboard-metric-card">
                    <div className="dashboard-metric-content">
                      <div className="dashboard-metric-info space-y-1">
                        <p className="dashboard-metric-label">Total Users</p>
                        <p className="dashboard-metric-value">{stats.totalUsers.toLocaleString()}</p>
                      </div>
                      <UserGroupIcon className="dashboard-metric-icon" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="dashboard-metric-card">
                    <div className="dashboard-metric-content">
                      <div className="dashboard-metric-info space-y-1">
                        <p className="dashboard-metric-label">Active Users</p>
                        <p className="dashboard-metric-value">{stats.activeUsers.toLocaleString()}</p>
                      </div>
                      <div className="dashboard-active-users-indicator">
                        <div className="dashboard-active-users-dot"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="dashboard-metric-card">
                    <div className="dashboard-metric-content">
                      <div className="dashboard-metric-info space-y-1">
                        <p className="dashboard-metric-label">Total Roles</p>
                        <p className="dashboard-metric-value">{stats.totalRoles}</p>
                      </div>
                      <CogIcon className="dashboard-metric-icon" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Total Groups</p>
                        <p className="text-2xl font-bold">{stats.totalGroups}</p>
                      </div>
                      <UsersIcon className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                        <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                      </div>
                      <ClockIcon className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">System Alerts</p>
                        <p className="text-2xl font-bold">{stats.systemAlerts}</p>
                      </div>
                      <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Activity</CardTitle>
                      <ChartBarIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="shrink-0 mt-0.5 text-muted-foreground">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm">{activity.message}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                            <Badge variant={getSeverityVariant(activity.severity)} className="text-xs">
                              {activity.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>System Health</CardTitle>
                      <ShieldCheckIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {systemHealth.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{service.service}</p>
                          <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            service.status === 'healthy' ? 'bg-green-600' : 
                            service.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                          }`}></div>
                          <span className={`text-sm font-medium capitalize ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => navigate('/users')}
                        className="justify-start h-auto p-4 w-full"
                      >
                        <UserGroupIcon className="h-5 w-5 mr-3" />
                        Manage Users
                      </Button>
                      <Button 
                        variant="secondary"
                        onClick={() => navigate('/roles')}
                        className="justify-start h-auto p-4 w-full"
                      >
                        <CogIcon className="h-5 w-5 mr-3" />
                        Manage Roles
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/groups')}
                        className="justify-start h-auto p-4 w-full"
                      >
                        <UsersIcon className="h-5 w-5 mr-3" />
                        Manage Groups
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
