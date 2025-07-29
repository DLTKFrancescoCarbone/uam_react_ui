import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const CompanySetupPage = () => {
  const [companyName, setCompanyName] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (companyName.trim()) {
      localStorage.setItem('companyName', companyName);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-login-gradient flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Deltek Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-white mb-8">Deltek</h1>
        </div>

        {/* Company Input Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-white text-sm">
              Company name
            </Label>
            <Input
              id="company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full h-12 px-4 bg-white/90 border-0 rounded text-gray-900 placeholder:text-gray-500"
              placeholder="Enter company name"
            />
          </div>

          <Button 
            onClick={handleNext}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded"
            disabled={!companyName.trim()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanySetupPage;
