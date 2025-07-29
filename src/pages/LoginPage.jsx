import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', username);
      navigate('/app-selection');
    }
  };

  const handleSSO = () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', 'sso.user@company.com');
    navigate('/app-selection');
  };

  return (
    <div className="min-h-screen bg-login-gradient flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Deltek Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-white mb-8">Deltek</h1>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white text-sm">
                Username / email
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 px-4 bg-white/90 border-0 rounded text-gray-900 placeholder:text-gray-500"
                placeholder="Enter your username or email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-white/90 border-0 rounded text-gray-900 placeholder:text-gray-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded"
              disabled={!username.trim() || !password.trim()}
            >
              Login
            </Button>

            <Button
              onClick={handleSSO}
              variant="outline"
              className="w-full h-12 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-medium rounded"
            >
              Use SSO: Single Sign-on
            </Button>
          </div>

          <div className="text-center">
            <button className="text-white/80 hover:text-white text-sm underline transition-colors">
              Forgot password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
