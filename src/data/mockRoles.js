// Import actual users to use real user data for role members
import { mockUsers } from './mockUsers.js';

export const mockRoles = [
  {
    id: '1',
    name: 'admin',
    description: 'Full system administrator access with complete control over all UAM functions',
    composite: true,
    userCount: 5,
    attributes: { 
      department: ['IT'], 
      level: ['senior'],
      clearance: ['top-secret'],
      permissions: ['read', 'write', 'delete', 'admin']
    },
    createdDate: '2024-01-15',
    lastModified: '2024-12-01'
  },
  {
    id: '2',
    name: 'project-manager',
    description: 'Project management and team oversight with access to project planning tools',
    composite: false,
    userCount: 23,
    attributes: { 
      department: ['Engineering', 'Construction'],
      level: ['senior', 'mid'],
      tools: ['ProjectWise', 'Scheduling'],
      permissions: ['read', 'write']
    },
    createdDate: '2024-02-10',
    lastModified: '2024-11-15'
  },
  {
    id: '3',
    name: 'engineer',
    description: 'Engineering and technical access for design and development work',
    composite: false,
    userCount: 156,
    attributes: { 
      department: ['Engineering'],
      level: ['junior', 'mid', 'senior'],
      specialization: ['Civil', 'Mechanical', 'Electrical'],
      permissions: ['read', 'write']
    },
    createdDate: '2024-01-20',
    lastModified: '2024-10-30'
  },
  {
    id: '4',
    name: 'viewer',
    description: 'Read-only access to projects and documentation',
    composite: false,
    userCount: 89,
    attributes: {
      access: ['read-only'],
      permissions: ['read']
    },
    createdDate: '2024-03-05',
    lastModified: '2024-09-12'
  },
  {
    id: '5',
    name: 'finance-manager',
    description: 'Financial data and reporting access with budget management capabilities',
    composite: true,
    userCount: 12,
    attributes: { 
      department: ['Finance'], 
      clearance: ['confidential'],
      tools: ['ERP', 'Financial Reports', 'Budget Planning'],
      permissions: ['read', 'write', 'approve']
    },
    createdDate: '2024-02-28',
    lastModified: '2024-11-20'
  },
  {
    id: '6',
    name: 'hr-specialist',
    description: 'Human resources management with employee data access',
    composite: false,
    userCount: 8,
    attributes: { 
      department: ['HR'], 
      clearance: ['confidential'],
      access: ['Employee Records', 'Payroll'],
      permissions: ['read', 'write']
    },
    createdDate: '2024-04-12',
    lastModified: '2024-10-05'
  },
  {
    id: '7',
    name: 'field-supervisor',
    description: 'Field operations supervision with mobile access capabilities',
    composite: false,
    userCount: 34,
    attributes: { 
      department: ['Construction', 'Operations'], 
      location: ['Field Sites'],
      equipment: ['Mobile Devices', 'Tablets'],
      permissions: ['read', 'write', 'approve']
    },
    createdDate: '2024-03-18',
    lastModified: '2024-11-08'
  },
  {
    id: '8',
    name: 'quality-assurance',
    description: 'Quality control and assurance with inspection and audit capabilities',
    composite: false,
    userCount: 19,
    attributes: { 
      department: ['Quality', 'Engineering'], 
      certification: ['ISO 9001', 'Six Sigma'],
      tools: ['Inspection Software', 'Audit Tools'],
      permissions: ['read', 'write', 'audit']
    },
    createdDate: '2024-05-22',
    lastModified: '2024-12-03'
  }
];

export const getRoleById = (id) => {
  return mockRoles.find(role => role.id === id);
};

export const getRolesByDepartment = (department) => {
  return mockRoles.filter(role => 
    role.attributes.department && role.attributes.department.includes(department)
  );
};

export const getCompositeRoles = () => {
  return mockRoles.filter(role => role.composite);
};

export const getSimpleRoles = () => {
  return mockRoles.filter(role => !role.composite);
};

// Create realistic role member assignments using actual user data
const createRoleMembers = (userIds) => {
  return userIds.map(id => {
    const user = mockUsers.find(u => u.id === id);
    return user ? {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status
    } : null;
  }).filter(Boolean);
};

// Generate additional mock users for larger roles (since we only have 15 real users)
const generateAdditionalRoleMembers = (count, startId = 400) => {
  const firstNames = ['Aaron', 'Adam', 'Alex', 'Amanda', 'Amelia', 'Benjamin', 'Bella', 'Beth', 'Carl', 'Chris', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Isabella', 'Jack', 'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Ryan', 'Sarah', 'Tom', 'Uma', 'Victor', 'Wendy'];
  const lastNames = ['Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Fisher', 'Green', 'Hall', 'Johnson', 'King', 'Lee', 'Miller', 'Nelson', 'Parker', 'Rodriguez', 'Smith', 'Taylor', 'Wilson', 'Young', 'Zhang'];
  const domains = ['example.com', 'company.com', 'corp.com', 'enterprise.com'];
  
  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + startId}`;
    const email = `${username}@${domains[index % domains.length]}`;
    const status = Math.random() > 0.15 ? 'Active' : 'Inactive';
    
    return {
      id: startId + index,
      username,
      firstName,
      lastName,
      email,
      status
    };
  });
};

export const mockRoleMembers = {
  // admin - Mix of real users + generated ones to reach 5
  '1': [
    ...createRoleMembers([4, 1]), // 2 real users (admin, aaa)
    ...generateAdditionalRoleMembers(3, 400) // 3 additional members
  ],
  // project-manager - Mix of real users + generated ones to reach 23
  '2': [
    ...createRoleMembers([6, 7, 11]), // 3 real users
    ...generateAdditionalRoleMembers(20, 500) // 20 additional members
  ]
};

export const getRoleMembers = (roleId) => {
  return mockRoleMembers[roleId] || [];
};
