// Import actual users to use real user data for group members
import { mockUsers } from './mockUsers.js';

export const mockGroups = [
  {
    id: '1',
    name: 'Engineering Team',
    description: 'Software and systems engineering group responsible for product development and technical architecture',
    memberCount: 45,
    roleCount: 8,
    department: 'Engineering',
    attributes: { 
      location: ['Seattle', 'Remote'], 
      clearance: ['standard'],
      project: ['ProjectWise', 'Vantagepoint'],
      tools: ['CAD Software', 'Development Tools'],
      shift: ['Day Shift']
    },
    createdDate: '2024-01-10',
    lastModified: '2024-11-25',
    manager: 'Sarah Chen'
  },
  {
    id: '2',
    name: 'Project Managers',
    description: 'Project management and coordination team overseeing multiple construction and engineering projects',
    memberCount: 23,
    roleCount: 5,
    department: 'Management',
    attributes: { 
      location: ['Multiple'], 
      clearance: ['elevated'],
      certification: ['PMP', 'Agile'],
      tools: ['Project Management Software', 'Scheduling Tools'],
      responsibility: ['Budget Management', 'Timeline Coordination']
    },
    createdDate: '2024-02-05',
    lastModified: '2024-12-01',
    manager: 'Michael Rodriguez'
  },
  {
    id: '3',
    name: 'Finance Department',
    description: 'Financial planning, accounting, and budget management team handling all fiscal operations',
    memberCount: 18,
    roleCount: 6,
    department: 'Finance',
    attributes: { 
      location: ['New York'], 
      clearance: ['confidential'],
      access: ['ERP', 'Financial Reports', 'Banking Systems'],
      certification: ['CPA', 'CFA'],
      responsibility: ['Budget Planning', 'Financial Reporting']
    },
    createdDate: '2024-01-20',
    lastModified: '2024-11-30',
    manager: 'Jennifer Walsh'
  },
  {
    id: '4',
    name: 'IT Support',
    description: 'Technical support and system administration team providing 24/7 infrastructure support',
    memberCount: 12,
    roleCount: 4,
    department: 'IT',
    attributes: { 
      location: ['Seattle', 'Remote'], 
      shift: ['24/7', 'On-Call'],
      specialization: ['Network', 'Security', 'Database'],
      tools: ['Monitoring Tools', 'Security Software'],
      certification: ['CompTIA', 'Cisco']
    },
    createdDate: '2024-03-01',
    lastModified: '2024-12-05',
    manager: 'David Kim'
  },
  {
    id: '5',
    name: 'Marketing Team',
    description: 'Marketing and communications group handling brand management and customer outreach',
    memberCount: 15,
    roleCount: 3,
    department: 'Marketing',
    attributes: { 
      location: ['Boston'], 
      focus: ['Digital Marketing', 'Content Creation', 'Brand Management'],
      tools: ['CRM', 'Analytics', 'Design Software'],
      specialization: ['Social Media', 'Content Strategy'],
      target: ['B2B', 'Enterprise Clients']
    },
    createdDate: '2024-04-15',
    lastModified: '2024-11-18',
    manager: 'Lisa Thompson'
  },
  {
    id: '6',
    name: 'Construction Managers',
    description: 'Field construction management team overseeing on-site operations and safety compliance',
    memberCount: 34,
    roleCount: 7,
    department: 'Construction',
    attributes: { 
      location: ['Field Sites', 'Multiple Locations'], 
      certification: ['Safety Training', 'OSHA 30', 'Project Management'],
      equipment: ['Mobile Devices', 'Safety Equipment'],
      responsibility: ['Site Safety', 'Quality Control'],
      shift: ['Day Shift', 'Extended Hours']
    },
    createdDate: '2024-02-20',
    lastModified: '2024-11-22',
    manager: 'Robert Martinez'
  },
  {
    id: '7',
    name: 'Quality Assurance',
    description: 'Quality control and assurance team ensuring compliance with industry standards and regulations',
    memberCount: 19,
    roleCount: 4,
    department: 'Quality',
    attributes: { 
      location: ['Multiple Sites'], 
      certification: ['ISO 9001', 'Six Sigma', 'Quality Management'],
      tools: ['Inspection Software', 'Testing Equipment'],
      focus: ['Process Improvement', 'Compliance'],
      standards: ['ISO Standards', 'Industry Regulations']
    },
    createdDate: '2024-03-10',
    lastModified: '2024-12-02',
    manager: 'Amanda Foster'
  },
  {
    id: '8',
    name: 'Human Resources',
    description: 'HR team managing employee relations, recruitment, and organizational development',
    memberCount: 11,
    roleCount: 5,
    department: 'HR',
    attributes: { 
      location: ['Corporate HQ'], 
      clearance: ['confidential'],
      access: ['Employee Records', 'Payroll Systems', 'Benefits Administration'],
      specialization: ['Recruitment', 'Employee Relations', 'Training'],
      certification: ['SHRM', 'PHR']
    },
    createdDate: '2024-01-25',
    lastModified: '2024-11-28',
    manager: 'Patricia Johnson'
  },
  {
    id: '9',
    name: 'Sales Team',
    description: 'Sales and business development team focused on client acquisition and relationship management',
    memberCount: 22,
    roleCount: 4,
    department: 'Sales',
    attributes: { 
      location: ['Multiple Regions'], 
      territory: ['North America', 'International'],
      tools: ['CRM', 'Sales Analytics', 'Proposal Software'],
      focus: ['Enterprise Sales', 'Client Relations'],
      target: ['Fortune 500', 'Government Contracts']
    },
    createdDate: '2024-02-12',
    lastModified: '2024-12-04',
    manager: 'Thomas Anderson'
  },
  {
    id: '10',
    name: 'Research & Development',
    description: 'R&D team focused on innovation, product development, and emerging technology research',
    memberCount: 16,
    roleCount: 6,
    department: 'R&D',
    attributes: { 
      location: ['Innovation Lab', 'Seattle'], 
      clearance: ['confidential'],
      focus: ['Product Innovation', 'Technology Research'],
      tools: ['Research Software', 'Prototyping Tools'],
      specialization: ['AI/ML', 'Cloud Technologies', 'IoT']
    },
    createdDate: '2024-05-01',
    lastModified: '2024-11-15',
    manager: 'Dr. Emily Watson'
  }
];

export const getGroupById = (id) => {
  return mockGroups.find(group => group.id === id);
};

export const getGroupsByDepartment = (department) => {
  return mockGroups.filter(group => group.department === department);
};

export const getGroupsByLocation = (location) => {
  return mockGroups.filter(group => 
    group.attributes.location && group.attributes.location.includes(location)
  );
};

export const getDepartments = () => {
  return [...new Set(mockGroups.map(group => group.department))].sort();
};

export const getTotalMembers = () => {
  return mockGroups.reduce((total, group) => total + group.memberCount, 0);
};

export const getTotalRoles = () => {
  return mockGroups.reduce((total, group) => total + group.roleCount, 0);
};

// Create realistic group member assignments using actual user data
const createGroupMembers = (userIds) => {
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

// Generate additional mock users for larger groups (since we only have 15 real users)
const generateAdditionalMembers = (count, startId = 100) => {
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

export const mockGroupMembers = {
  // Engineering Team - Mix of real users + generated ones to reach 45
  '1': [
    ...createGroupMembers([2, 3, 5, 13, 15]), // 5 real users
    ...generateAdditionalMembers(40, 100) // 40 additional members
  ],
  // Project Managers - Mix of real users + generated ones to reach 23  
  '2': [
    ...createGroupMembers([6, 7, 11]), // 3 real users
    ...generateAdditionalMembers(20, 200) // 20 additional members
  ],
  // Finance Department - Mix of real users + generated ones to reach 18
  '3': [
    ...createGroupMembers([8, 9, 14]), // 3 real users  
    ...generateAdditionalMembers(15, 300) // 15 additional members
  ]
};

export const getGroupMembers = (groupId) => {
  return mockGroupMembers[groupId] || [];
};
