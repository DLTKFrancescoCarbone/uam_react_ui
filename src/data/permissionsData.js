// Enhanced hierarchical permissions data structure
export const permissionsData = {
  projects: {
    id: 'projects',
    name: 'Projects',
    description: 'Access to Projects',
    expanded: false,
    children: {
      project: {
        id: 'projects.project',
        name: 'Project',
        path: 'Projects.Project',
        expanded: false,
        permissions: [
          {
            id: 'projects-project-delete',
            name: 'Delete Project',
            fullId: 'Projects.Project.Delete',
            description: 'Delete a project',
            tags: ['critical', 'delete'],
            granted: false
          },
          {
            id: 'projects-project-new',
            name: 'Create Project',
            fullId: 'Projects.Project.New',
            description: 'Create a new project',
            tags: ['write'],
            granted: false
          },
          {
            id: 'projects-project-purge',
            name: 'Purge Project',
            fullId: 'Projects.Project.Purge',
            description: 'Purge a project',
            tags: ['critical', 'delete'],
            granted: false
          },
          {
            id: 'projects-project-rename',
            name: 'Rename Project',
            fullId: 'Projects.Project.Rename',
            description: 'Rename a project',
            tags: ['write'],
            granted: false
          },
          {
            id: 'projects-project-copy',
            name: 'Copy Project',
            fullId: 'Projects.Project.Copy',
            description: 'Copy a project',
            tags: ['write'],
            granted: false
          },
          {
            id: 'projects-project-changeacl',
            name: 'Change Access Control',
            fullId: 'Projects.Project.ChangeACL',
            description: 'Change the project access control',
            tags: ['admin', 'critical'],
            granted: false
          },
          {
            id: 'projects-project-changeowner',
            name: 'Change Owner',
            fullId: 'Projects.Project.ChangeOwner',
            description: 'Change the owner of a project',
            tags: ['admin'],
            granted: false
          },
          {
            id: 'projects-project-changecountry',
            name: 'Change Country of Control',
            fullId: 'Projects.Project.ChangeCountryOfControl',
            description: 'Change country of control of a project',
            tags: ['admin'],
            granted: false
          }
        ],
        children: {
          snapshot: {
            id: 'projects.project.snapshot',
            name: 'Snapshot',
            path: 'Projects.Project.Snapshot',
            expanded: false,
            permissions: [
              {
                id: 'projects-snapshot-new',
                name: 'Add Snapshot',
                fullId: 'Projects.Project.Snapshot.New',
                description: 'Add a project snapshot',
                tags: ['write'],
                granted: false
              },
              {
                id: 'projects-snapshot-update',
                name: 'Update Snapshot',
                fullId: 'Projects.Project.Snapshot.Update',
                description: 'Update a project snapshot',
                tags: ['write'],
                granted: false
              },
              {
                id: 'projects-snapshot-delete',
                name: 'Delete Snapshot',
                fullId: 'Projects.Project.Snapshot.Delete',
                description: 'Delete a project snapshot',
                tags: ['delete'],
                granted: false
              }
            ]
          },
          data: {
            id: 'projects.project.data',
            name: 'Data',
            path: 'Projects.Project.Data',
            expanded: false,
            permissions: [
              {
                id: 'projects-data-budget',
                name: 'Edit Budget Classes',
                fullId: 'Projects.Project.Data.Budget.Update',
                description: 'Edit Budget Classes',
                tags: ['data', 'write'],
                granted: false
              },
              {
                id: 'projects-data-actuals-history',
                name: 'Edit Historical Actuals',
                fullId: 'Projects.Project.Data.Actuals.EditHistory',
                description: 'Prevent editing of historical actual costs',
                tags: ['data', 'write', 'critical'],
                granted: false
              },
              {
                id: 'projects-data-actuals-update',
                name: 'Edit Actuals Classes',
                fullId: 'Projects.Project.Data.Actuals.Update',
                description: 'Edit Actuals Classes',
                tags: ['data', 'write'],
                granted: false
              },
              {
                id: 'projects-data-forecast',
                name: 'Edit Forecast Classes',
                fullId: 'Projects.Project.Data.Forecast.Update',
                description: 'Edit Forecast Classes',
                tags: ['data', 'write'],
                granted: false
              },
              {
                id: 'projects-data-earned',
                name: 'Edit Earned Classes',
                fullId: 'Projects.Project.Data.Earned.Update',
                description: 'Edit Earned Classes',
                tags: ['data', 'write'],
                granted: false
              },
              {
                id: 'projects-data-totals',
                name: 'Update Totals',
                fullId: 'Projects.Project.Data.Totals.Update',
                description: 'Update Totals',
                tags: ['data', 'write'],
                granted: false
              }
            ],
            children: {
              milestones: {
                id: 'projects.project.data.milestones',
                name: 'Milestones',
                path: 'Projects.Project.Data.Milestones',
                expanded: false,
                permissions: [
                  {
                    id: 'projects-milestones-status',
                    name: 'Status Milestones',
                    fullId: 'Projects.Project.Data.Milestones.Status',
                    description: 'Status milestones/steps',
                    tags: ['data', 'readonly'],
                    granted: false
                  },
                  {
                    id: 'projects-milestones-edit',
                    name: 'Edit Milestones',
                    fullId: 'Projects.Project.Data.Milestones.Edit',
                    description: 'Add/Delete/Reconcile milestones/steps',
                    tags: ['data', 'write'],
                    granted: false
                  }
                ]
              },
              codes: {
                id: 'projects.project.data.codes',
                name: 'Codes',
                path: 'Projects.Project.Data.Codes',
                expanded: false,
                permissions: [
                  {
                    id: 'projects-codes-ca',
                    name: 'Update CA Codes',
                    fullId: 'Projects.Project.Data.Codes.CAUpdate',
                    description: 'Update CA code assignments',
                    tags: ['data', 'write'],
                    granted: false
                  },
                  {
                    id: 'projects-codes-wp',
                    name: 'Update WP Codes',
                    fullId: 'Projects.Project.Data.Codes.WPUpdate',
                    description: 'Update WP code assignments',
                    tags: ['data', 'write'],
                    granted: false
                  }
                ]
              }
            }
          },
          properties: {
            id: 'projects.project.properties',
            name: 'Properties',
            path: 'Projects.Project.Prop',
            expanded: false,
            permissions: [
              {
                id: 'projects-prop-general',
                name: 'General Tab',
                fullId: 'Projects.Project.Prop.General',
                description: 'General tab',
                tags: ['readonly'],
                granted: false
              },
              {
                id: 'projects-prop-budget',
                name: 'Budget Tab',
                fullId: 'Projects.Project.Prop.Budget',
                description: 'Budget tab',
                tags: ['data'],
                granted: false
              },
              {
                id: 'projects-prop-fields',
                name: 'Fields Tab',
                fullId: 'Projects.Project.Prop.Fields',
                description: 'Fields tab',
                tags: ['write'],
                granted: false
              },
              {
                id: 'projects-prop-files',
                name: 'Files Tab',
                fullId: 'Projects.Project.Prop.Files',
                description: 'Files tab',
                tags: ['write'],
                granted: false
              },
              {
                id: 'projects-prop-classes',
                name: 'Classes Tab',
                fullId: 'Projects.Project.Prop.Classes',
                description: 'Classes tab',
                tags: ['data'],
                granted: false
              },
              {
                id: 'projects-prop-costsets',
                name: 'Cost Sets Tab',
                fullId: 'Projects.Project.Prop.CostSets',
                description: 'Cost Sets tab',
                tags: ['data'],
                granted: false
              },
              {
                id: 'projects-prop-codes',
                name: 'Code Assignments Tab',
                fullId: 'Projects.Project.Prop.Codes',
                description: 'Code Assignments tab',
                tags: ['data'],
                granted: false
              }
            ]
          }
        }
      }
    }
  },
  rates: {
    id: 'rates',
    name: 'Rates',
    description: 'Access to Rates',
    expanded: false,
    children: {
      ratefile: {
        id: 'rates.ratefile',
        name: 'Rate File',
        path: 'Rates.RateFile',
        expanded: false,
        permissions: [
          {
            id: 'rates-ratefile-delete',
            name: 'Delete Rate File',
            fullId: 'Rates.RateFile.Delete',
            description: 'Delete a rate file from the system',
            tags: ['delete', 'critical'],
            granted: false
          },
          {
            id: 'rates-ratefile-new',
            name: 'Create Rate File',
            fullId: 'Rates.RateFile.New',
            description: 'Create a new rate file',
            tags: ['write'],
            granted: false
          },
          {
            id: 'rates-ratefile-settings',
            name: 'Edit Settings',
            fullId: 'Rates.RateFile.Settings',
            description: 'Edit rate file settings',
            tags: ['write'],
            granted: false
          },
          {
            id: 'rates-ratefile-rename',
            name: 'Rename Rate File',
            fullId: 'Rates.RateFile.Rename',
            description: 'Rename a rate file',
            tags: ['write'],
            granted: false
          },
          {
            id: 'rates-ratefile-copy',
            name: 'Copy Rate File',
            fullId: 'Rates.RateFile.Copy',
            description: 'Copy a rate file',
            tags: ['write'],
            granted: false
          },
          {
            id: 'rates-ratefile-changeacl',
            name: 'Change Access Control',
            fullId: 'Rates.RateFile.ChangeACL',
            description: 'Change the rate file access control',
            tags: ['admin', 'critical'],
            granted: false
          },
          {
            id: 'rates-ratefile-changeowner',
            name: 'Change Owner',
            fullId: 'Rates.RateFile.ChangeOwner',
            description: 'Change the owner of a rate file',
            tags: ['admin'],
            granted: false
          },
          {
            id: 'rates-ratefile-changecountry',
            name: 'Change Country of Control',
            fullId: 'Rates.RateFile.ChangeCountryOfControl',
            description: 'Change country of control of a rate file',
            tags: ['admin'],
            granted: false
          }
        ]
      }
    }
  },
  users: {
    id: 'users',
    name: 'User Management',
    description: 'User management operations',
    expanded: false,
    children: {
      user: {
        id: 'users.user',
        name: 'User',
        path: 'Users.User',
        expanded: false,
        permissions: [
          {
            id: 'users-user-create',
            name: 'Create User',
            fullId: 'Users.User.Create',
            description: 'Create new user accounts',
            tags: ['write'],
            granted: false
          },
          {
            id: 'users-user-view',
            name: 'View User',
            fullId: 'Users.User.View',
            description: 'View user details',
            tags: ['readonly'],
            granted: false
          },
          {
            id: 'users-user-edit',
            name: 'Edit User',
            fullId: 'Users.User.Edit',
            description: 'Edit user information',
            tags: ['write'],
            granted: false
          },
          {
            id: 'users-user-delete',
            name: 'Delete User',
            fullId: 'Users.User.Delete',
            description: 'Delete user accounts',
            tags: ['delete', 'critical'],
            granted: false
          },
          {
            id: 'users-user-changepassword',
            name: 'Change Password',
            fullId: 'Users.User.ChangePassword',
            description: 'Change user passwords',
            tags: ['admin'],
            granted: false
          },
          {
            id: 'users-user-assignroles',
            name: 'Assign Roles',
            fullId: 'Users.User.AssignRoles',
            description: 'Assign roles to users',
            tags: ['admin'],
            granted: false
          }
        ]
      }
    }
  }
};

// Utility functions for working with permissions data
export const getPermissionCount = (node) => {
  let count = 0;
  
  if (node.permissions) {
    count += node.permissions.length;
  }
  
  if (node.children) {
    Object.values(node.children).forEach(child => {
      count += getPermissionCount(child);
    });
  }
  
  return count;
};

export const getAllPermissions = (data) => {
  const permissions = [];
  
  const traverse = (node) => {
    if (node.permissions) {
      permissions.push(...node.permissions);
    }
    
    if (node.children) {
      Object.values(node.children).forEach(child => {
        traverse(child);
      });
    }
  };
  
  Object.values(data).forEach(rootNode => {
    traverse(rootNode);
  });
  
  return permissions;
};

export const getCheckedPermissions = (data) => {
  return getAllPermissions(data).filter(permission => permission.granted);
};

export const updatePermissionGranted = (data, permissionId, granted) => {
  const traverse = (node) => {
    if (node.permissions) {
      const permission = node.permissions.find(p => p.id === permissionId);
      if (permission) {
        permission.granted = granted;
        return true;
      }
    }
    
    if (node.children) {
      for (const child of Object.values(node.children)) {
        if (traverse(child)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  Object.values(data).forEach(rootNode => {
    traverse(rootNode);
  });
};

export const toggleNodeExpansion = (data, nodeId) => {
  const traverse = (node) => {
    if (node.id === nodeId) {
      node.expanded = !node.expanded;
      return true;
    }
    
    if (node.children) {
      for (const child of Object.values(node.children)) {
        if (traverse(child)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  Object.values(data).forEach(rootNode => {
    traverse(rootNode);
  });
};