import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { 
  UsersIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const AppSelectionPage = () => {
  const navigate = useNavigate();

  const handleAppSelection = (appName) => {
    if (appName === 'User Access Management') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-login-gradient">
      <div className="container mx-auto px-8 py-12">
        {/* Deltek Logo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-white mb-8">Deltek</h1>
        </div>

        {/* Available Applications Section */}
        <div className="mb-12">
          <h2 className="text-xl text-white mb-6">Available applications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* User Access Management Card */}
            <Card 
              className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleAppSelection('User Access Management')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 rounded">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <h3 className="text-gray-900 font-medium">User Access Management</h3>
              </CardContent>
            </Card>

            {/* Project Portfolio Management Card */}
            <Card className="bg-white hover:bg-gray-50 cursor-pointer transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 rounded">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <h3 className="text-gray-900 font-medium">Project Portfolio Management</h3>
              </CardContent>
            </Card>

            {/* Risk Manager Card */}
            <Card className="bg-white hover:bg-gray-50 cursor-pointer transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 rounded">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
                <h3 className="text-gray-900 font-medium">Risk manager</h3>
              </CardContent>
            </Card>

            {/* Coming Soon Card */}
            <Card className="bg-gray-100 cursor-not-allowed opacity-60">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-400 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 rounded">
                  <QuestionMarkCircleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-gray-600 font-medium">Coming soon</h3>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Center Section */}
        <div>
          <h2 className="text-xl text-white mb-6">Support center (Placeholder for now)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deltek Support Center Card */}
            <Card className="bg-white hover:bg-gray-50 cursor-pointer transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 rounded">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
                <h3 className="text-gray-900 font-medium">Deltek Support Center</h3>
              </CardContent>
            </Card>

            {/* Coming Soon Card */}
            <Card className="bg-gray-100 cursor-not-allowed opacity-60">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-400 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 rounded">
                  <QuestionMarkCircleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-gray-600 font-medium">Coming soon</h3>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Decorative Network Icon */}
        <div className="fixed bottom-8 right-8">
          <div className="w-24 h-24 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
              <circle cx="20" cy="20" r="8" />
              <circle cx="80" cy="20" r="8" />
              <circle cx="50" cy="50" r="8" />
              <circle cx="20" cy="80" r="8" />
              <circle cx="80" cy="80" r="8" />
              <line x1="20" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="2" />
              <line x1="80" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="50" x2="20" y2="80" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="50" x2="80" y2="80" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSelectionPage;
