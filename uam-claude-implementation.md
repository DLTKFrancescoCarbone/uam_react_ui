# User Access Management Platform - Implementation Guide

## Project Overview
Build a complete User Access Management (UAM) platform prototype with React, Tailwind CSS 3.4, shadcn/ui, and RevoGrid. The application includes a login flow with purple gradient theme and a main application with clean white/blue business styling.

## Tech Stack
- **React** 18+ with functional components and hooks
- **Tailwind CSS 3.4** (stable version)
- **shadcn/ui** for UI components
- **@revolist/react-datagrid** for data table
- **React Router** for navigation
- **Lucide React** for icons

## Installation & Setup

### 1. Create React Project
```bash
npx create-react-app uam-platform
cd uam-platform
```

### 2. Install Dependencies
```bash
# Core dependencies
npm install react-router-dom @revolist/react-datagrid lucide-react

# Install Tailwind CSS 3.4 (stable)
npm install -D tailwindcss@^3.4.0 postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### 3. Setup Tailwind CSS
Update your `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Verify your `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4. Setup shadcn/ui
```bash
# Initialize shadcn/ui (choose default options)
npx shadcn-ui@latest init

# Add required components
npx shadcn-ui@latest add button input label card avatar badge dropdown-menu
```

### 5. Create jsconfig.json (for @/ imports)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### 6. Update tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'login-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## Project Structure
```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   └── UserTable.jsx
├── pages/
│   ├── CompanySetup.jsx
│   ├── Login.jsx
│   └── Dashboard.jsx
├── data/
│   └── mockUsers.js
├── App.jsx
├── App.css
└── index.js
```

## Implementation

### 1. App.jsx - Main Router Setup
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CompanySetup from './pages/CompanySetup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/setup" replace />} />
          <Route path="/setup" element={<CompanySetup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

### 2. pages/CompanySetup.jsx - Company Setup Screen
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CompanySetup = () => {
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
              className="w-full h-12 px-4 bg-white/90 border-0 rounded text-gray-900 placeholder-gray-500"
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

export default CompanySetup;
```

### 3. pages/Login.jsx - Login Screen
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', username);
      navigate('/dashboard');
    }
  };

  const handleSSO = () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', 'sso.user@company.com');
    navigate('/dashboard');
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
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 px-4 bg-white/90 border-0 rounded text-gray-900"
              placeholder="Username / email"
            />

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 bg-white/90 border-0 rounded text-gray-900"
              placeholder="Password"
            />
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
            <button className="text-white/80 hover:text-white text-sm underline">
              Forgot password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

### 4. components/layout/Header.jsx - Full Width Header
```jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  const currentUser = localStorage.getItem('currentUser') || 'AA';
  const initials = currentUser.split('@')[0].substring(0, 2).toUpperCase();

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
            &gt;
          </div>
          <h1 className="text-lg font-medium text-gray-900">User Access Management</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Add User
          </Button>
          <Avatar className="w-8 h-8 bg-blue-600">
            <AvatarFallback className="text-white text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### 5. components/layout/Sidebar.jsx - Hugs Content, Doesn't Touch Header
```jsx
import React from 'react';
import { Home, Users, Settings, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  const sidebarItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: Users, label: 'Users', active: true },
    { icon: Settings, label: 'Settings', active: false },
    { icon: HelpCircle, label: 'Help', active: false },
  ];

  return (
    <aside className="bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-4 w-fit px-3">
      {sidebarItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              item.active 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title={item.label}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </aside>
  );
};

export default Sidebar;
```

### 6. components/layout/Footer.jsx - Full Width Footer
```jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 px-6 py-3 fixed bottom-0 left-0 right-0">
      <div className="text-center text-sm text-gray-500">
        © 2025 Deltek. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
```

### 7. data/mockUsers.js - Sample User Data
```javascript
export const mockUsers = [
  {
    id: 1,
    username: 'aaa',
    firstName: 'aaa123ad',
    lastName: 'aaa',
    email: 'aaaa@aaa.com',
    status: 'Inactive',
    created: '06/27/2025 21:29:59'
  },
  {
    id: 2,
    username: 'aaron.clark',
    firstName: 'Aaron',
    lastName: 'Clark',
    email: 'aaron.clark@example.com',
    status: 'Active',
    created: '07/23/2025 12:59:35'
  },
  {
    id: 3,
    username: 'adam.evans',
    firstName: 'Adam',  
    lastName: 'Evans',
    email: 'adam.evans@example.com',
    status: 'Active',
    created: '07/23/2025 12:59:56'
  },
  {
    id: 4,
    username: 'admin',
    firstName: 'admin',
    lastName: 'admin',
    email: 'admin@admin.com',
    status: 'Active',
    created: '05/27/2025 04:56:25'
  },
  {
    id: 5,
    username: 'alex.green',
    firstName: 'Alex',
    lastName: 'Green',
    email: 'alex.green@example.com',
    status: 'Active',
    created: '07/23/2025 13:00:17'
  },
  {
    id: 6,
    username: 'amanda.anderson',
    firstName: 'Amanda',
    lastName: 'Anderson',
    email: 'amanda.anderson@example.com',
    status: 'Active',
    created: '07/23/2025 12:53:45'
  },
  {
    id: 7,
    username: 'aparker980',
    firstName: 'Amelia',
    lastName: 'Parker',
    email: 'amelia.parker@example.com',
    status: 'Active',
    created: '05/17/2025 20:35:06'
  },
  {
    id: 8,
    username: 'bella.fisher',
    firstName: 'Bella',
    lastName: 'Fisher',
    email: 'bella.fisher@example.com',
    status: 'Active',
    created: '07/23/2025 12:59:57'
  },
  {
    id: 9,
    username: 'beth.davis',
    firstName: 'Beth',
    lastName: 'Davis',
    email: 'beth.davis@example.com',
    status: 'Inactive',
    created: '07/23/2025 12:59:36'
  },
  {
    id: 10,
    username: 'blake.hall',
    firstName: 'Blake',
    lastName: 'Hall',
    email: 'blake.hall@example.com',
    status: 'Inactive',
    created: '07/23/2025 13:00:18'
  }
];
```

### 8. components/UserTable.jsx - RevoGrid Implementation
```jsx
import React, { useState } from 'react';
import { RevoGrid } from '@revolist/react-datagrid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { mockUsers } from '../data/mockUsers';

const UserTable = () => {
  const [users, setUsers] = useState(mockUsers);

  // Status cell renderer
  const StatusCell = ({ model }) => {
    const isActive = model.status === 'Active';
    return (
      <Badge 
        variant={isActive ? 'default' : 'secondary'}
        className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
      >
        {model.status}
      </Badge>
    );
  };

  // Username cell renderer with link styling
  const UsernameCell = ({ model }) => (
    <button className="text-blue-600 hover:text-blue-800 underline text-left">
      {model.username}
    </button>
  );

  // Actions cell renderer
  const ActionsCell = ({ model }) => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Eye size={16} className="text-gray-600" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Edit size={16} className="text-gray-600" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Trash2 size={16} className="text-gray-600" />
      </Button>
    </div>
  );

  // Column definitions
  const columns = [
    {
      prop: 'select',
      name: '',
      size: 50,
      cellTemplate: () => (
        <input 
          type="checkbox" 
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      )
    },
    {
      prop: 'username',
      name: 'Username',
      size: 150,
      cellTemplate: UsernameCell
    },
    {
      prop: 'firstName',
      name: 'First Name',
      size: 150
    },
    {
      prop: 'lastName',
      name: 'Last Name',
      size: 150
    },
    {
      prop: 'email',
      name: 'Email',
      size: 250
    },
    {
      prop: 'status',
      name: 'Status',
      size: 100,
      cellTemplate: StatusCell
    },
    {
      prop: 'created',
      name: 'Created',
      size: 180
    },
    {
      prop: 'actions',
      name: 'Actions',
      size: 120,
      cellTemplate: ActionsCell
    }
  ];

  return (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">User Management</h2>
        </div>
        
        <div className="p-4">
          <RevoGrid
            source={users}
            columns={columns}
            theme="compact"
            resize={true}
            range={true}
            rowHeaders={true}
            rowSize={45}
            readonly={true}
            style={{
              height: '600px',
              '--rgrid-color-border': '#e5e7eb',
              '--rgrid-color-border-focus': '#3b82f6',
              '--rgrid-color-bg-primary': '#ffffff',
              '--rgrid-color-bg-primary-hover': '#f9fafb',
              '--rgrid-color-text-primary': '#111827'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserTable;
```

### 9. pages/Dashboard.jsx - Proper Layout Structure
```jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import UserTable from '../components/UserTable';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header - Full Width */}
      <Header />
      
      {/* Main Content Area - Below Header */}
      <div className="pt-20 pb-16 flex min-h-screen">
        {/* Sidebar - Hugs Content, Doesn't Touch Header */}
        <Sidebar />
        
        {/* Main Content */}
        <UserTable />
      </div>
      
      {/* Fixed Footer - Full Width */}
      <Footer />
    </div>
  );
};

export default Dashboard;
```

### 10. App.css - Additional Styles
```css
/* Custom styles for RevoGrid */
.App {
  text-align: left;
}

/* Ensure proper grid styling */
revo-grid {
  --rgrid-color-border: #e5e7eb;
  --rgrid-color-border-focus: #3b82f6;
  --rgrid-color-bg-primary: #ffffff;
  --rgrid-color-bg-primary-hover: #f9fafb;
  --rgrid-color-text-primary: #111827;
  --rgrid-font-size: 14px;
  --rgrid-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Ensure full height layout */
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Login gradient background */
.bg-login-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Key Layout Features

### ✅ Full-Width Header
- Fixed position header that spans entire viewport width
- Z-index ensures it stays above other content
- Contains logo, title, Add User button, and avatar

### ✅ Sidebar That Hugs Content
- Uses `w-fit px-3` to hug the 4 navigation icons
- Positioned below header (doesn't touch it)
- Background and border styling for clean separation

### ✅ Proper Content Flow
- Header: `fixed top-0` for full-width positioning
- Main content: `pt-20` to account for fixed header height
- Footer: `fixed bottom-0` for full-width positioning
- Sidebar: Auto-sized to content with proper spacing

### ✅ Responsive Design
- Tailwind classes ensure proper responsive behavior
- Clean separation between layout components
- Proper z-index stacking for fixed elements

## Running the Application

### 1. Start Development Server
```bash
npm start
```

### 2. Application Flow Test
1. **Company Setup** (`/setup`) - Enter company name
2. **Login** (`/login`) - Username/password or SSO  
3. **Dashboard** (`/dashboard`) - Main application with proper layout

## Common Issues & Fixes

### If you get PostCSS errors:
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

### If shadcn/ui imports fail:
- Make sure `jsconfig.json` exists with proper path mapping
- Restart your development server
- Verify components were installed: `ls src/components/ui/`

### Layout Issues:
- Header should be full-width and fixed at top
- Sidebar should be positioned below header and hug its 4 icons
- Main content should have proper padding to account for fixed header/footer

The application is now ready with Tailwind 3.4, proper layout structure, and shadcn/ui integration!