import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CompanySetupPage from './pages/CompanySetupPage';
import LoginPage from './pages/LoginPage';
import AppSelectionPage from './pages/AppSelectionPage';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import GroupsPage from './pages/GroupsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/setup" replace />} />
          <Route path="/setup" element={<CompanySetupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app-selection" element={<AppSelectionPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/groups" element={<GroupsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
