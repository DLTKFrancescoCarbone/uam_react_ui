import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import MultiSelectDropdown from '../ui/multi-select-dropdown';
import { 
  ChevronRightIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { 
  permissionsData, 
  getPermissionCount, 
  getAllPermissions, 
  getCheckedPermissions,
  toggleNodeExpansion
} from '../../data/permissionsData';

const EnhancedPermissionsTab = ({ 
  rolePermissions = [], 
  onPermissionsChange,
  onSavePermissions,
  showFilters = true
}) => {
  const [permissionTree, setPermissionTree] = useState(permissionsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedQuickActions, setSelectedQuickActions] = useState([]);

  // Initialize permissions based on current role permissions
  useEffect(() => {
    const updatedTree = JSON.parse(JSON.stringify(permissionsData));
    
    // Set granted permissions based on rolePermissions prop
    rolePermissions.forEach(rolePermission => {
      const allPermissions = getAllPermissions(updatedTree);
      const permission = allPermissions.find(p => 
        p.name === rolePermission.name || 
        p.fullId === rolePermission.name ||
        p.id === rolePermission.id
      );
      if (permission) {
        permission.granted = rolePermission.granted;
      }
    });
    
    setPermissionTree(updatedTree);
  }, [rolePermissions]);

  // Filter and search logic
  const filteredData = useMemo(() => {
    const filterNode = (node, level = 0) => {
      const clonedNode = { ...node };
      let hasVisibleContent = false;

      // Filter permissions
      if (clonedNode.permissions) {
        clonedNode.permissions = clonedNode.permissions.filter(permission => {
          const matchesSearch = !searchTerm || 
            permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            permission.fullId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            permission.description.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesFilters = activeFilters.length === 0 ||
            activeFilters.some(filter => permission.tags.includes(filter));

          return matchesSearch && matchesFilters;
        });
        
        if (clonedNode.permissions.length > 0) {
          hasVisibleContent = true;
        }
      }

      // Filter children recursively
      if (clonedNode.children) {
        const filteredChildren = {};
        Object.entries(clonedNode.children).forEach(([key, child]) => {
          const filteredChild = filterNode(child, level + 1);
          if (filteredChild) {
            filteredChildren[key] = filteredChild;
            hasVisibleContent = true;
          }
        });
        
        if (Object.keys(filteredChildren).length > 0) {
          clonedNode.children = filteredChildren;
        } else {
          delete clonedNode.children;
        }
      }

      // Also check if node name matches search
      if (searchTerm && clonedNode.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        hasVisibleContent = true;
      }

      return hasVisibleContent ? clonedNode : null;
    };

    const filtered = {};
    Object.entries(permissionTree).forEach(([key, rootNode]) => {
      const filteredNode = filterNode(rootNode);
      if (filteredNode) {
        filtered[key] = filteredNode;
      }
    });

    return filtered;
  }, [permissionTree, searchTerm, activeFilters]);

  const handlePermissionToggle = (permissionId) => {
    const updatedTree = JSON.parse(JSON.stringify(permissionTree));
    const allPermissions = getAllPermissions(updatedTree);
    const permission = allPermissions.find(p => p.id === permissionId);
    
    if (permission) {
      permission.granted = !permission.granted;
      updateParentStates(updatedTree);
      setPermissionTree(updatedTree);
      
      // Notify parent component
      if (onPermissionsChange) {
        onPermissionsChange(getCheckedPermissions(updatedTree));
      }
    }
  };

  const handleNodeToggle = (nodeId) => {
    const updatedTree = JSON.parse(JSON.stringify(permissionTree));
    toggleNodeExpansion(updatedTree, nodeId);
    setPermissionTree(updatedTree);
  };

  const handleResourcePermissionToggle = (nodeId, checked) => {
    const updatedTree = JSON.parse(JSON.stringify(permissionTree));
    
    const setNodePermissions = (node, granted) => {
      if (node.permissions) {
        node.permissions.forEach(permission => {
          permission.granted = granted;
        });
      }
      
      if (node.children) {
        Object.values(node.children).forEach(child => {
          setNodePermissions(child, granted);
        });
      }
    };

    const findAndUpdateNode = (nodes) => {
      for (const node of Object.values(nodes)) {
        if (node.id === nodeId) {
          setNodePermissions(node, checked);
          return true;
        }
        
        if (node.children && findAndUpdateNode(node.children)) {
          return true;
        }
      }
      return false;
    };

    findAndUpdateNode(updatedTree);
    updateParentStates(updatedTree);
    setPermissionTree(updatedTree);
    
    if (onPermissionsChange) {
      onPermissionsChange(getCheckedPermissions(updatedTree));
    }
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleQuickActionsChange = (newActions) => {
    // Find newly selected actions
    const newlySelected = newActions.filter(action => !selectedQuickActions.includes(action));
    
    // Apply only newly selected actions to avoid duplicate selections
    newlySelected.forEach(action => {
      selectByType(action);
    });
    
    setSelectedQuickActions(newActions);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const expandAll = () => {
    const updatedTree = JSON.parse(JSON.stringify(permissionTree));
    const expandNode = (node) => {
      node.expanded = true;
      if (node.children) {
        Object.values(node.children).forEach(expandNode);
      }
    };
    Object.values(updatedTree).forEach(expandNode);
    setPermissionTree(updatedTree);
  };

  const collapseAll = () => {
    const updatedTree = JSON.parse(JSON.stringify(permissionTree));
    const collapseNode = (node) => {
      node.expanded = false;
      if (node.children) {
        Object.values(node.children).forEach(collapseNode);
      }
    };
    Object.values(updatedTree).forEach(collapseNode);
    setPermissionTree(updatedTree);
  };

  const selectByType = (type) => {
    const updatedTree = JSON.parse(JSON.stringify(permissionTree));
    const allPermissions = getAllPermissions(updatedTree);
    
    const typeMap = {
      'read': ['readonly', 'view', 'status', 'general'],
      'write': ['write', 'create', 'new', 'update', 'edit', 'settings', 'rename', 'copy', 'fields', 'files'],
      'delete': ['delete', 'purge'],
      'admin': ['admin', 'changeacl', 'changeowner', 'changecountry']
    };
    
    const targetTags = typeMap[type] || [];
    
    allPermissions.forEach(permission => {
      if (targetTags.some(tag => 
        permission.tags.includes(tag) || 
        permission.fullId.toLowerCase().includes(tag) ||
        permission.name.toLowerCase().includes(tag)
      )) {
        permission.granted = true;
      }
    });
    
    updateParentStates(updatedTree);
    setPermissionTree(updatedTree);
    
    if (onPermissionsChange) {
      onPermissionsChange(getCheckedPermissions(updatedTree));
    }
  };

  const clearAll = () => {
    const updatedTree = JSON.parse(JSON.stringify(permissionTree));
    const allPermissions = getAllPermissions(updatedTree);
    allPermissions.forEach(permission => {
      permission.granted = false;
    });
    setPermissionTree(updatedTree);
    
    if (onPermissionsChange) {
      onPermissionsChange(getCheckedPermissions(updatedTree));
    }
  };

  const getNodeState = (node) => {
    const allPermissions = [];
    const collectPermissions = (n) => {
      if (n.permissions) allPermissions.push(...n.permissions);
      if (n.children) Object.values(n.children).forEach(collectPermissions);
    };
    collectPermissions(node);
    
    if (allPermissions.length === 0) return { checked: false, indeterminate: false };
    
    const checkedCount = allPermissions.filter(p => p.granted).length;
    return {
      checked: checkedCount === allPermissions.length && checkedCount > 0,
      indeterminate: checkedCount > 0 && checkedCount < allPermissions.length
    };
  };

  const updateParentStates = (updatedTree) => {
    // This function ensures parent checkboxes reflect the state of their children
    const updateNodeState = (node) => {
      if (node.children) {
        Object.values(node.children).forEach(updateNodeState);
      }
      // The state is now calculated dynamically, no need to store it
    };
    
    Object.values(updatedTree).forEach(updateNodeState);
  };

  const renderPermissionNode = (node, level = 0) => {
    const nodeState = getNodeState(node);
    const permissionCount = getPermissionCount(node);
    const paddingLeft = level * 24;

    return (
      <div key={node.id} className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
        {/* Node Header */}
        <div 
          className={`flex items-center p-3 cursor-pointer transition-colors hover:bg-gray-50 ${node.expanded ? 'bg-gray-50' : 'bg-white'}`}
          style={{ paddingLeft: `${12 + paddingLeft}px` }}
          onClick={() => handleNodeToggle(node.id)}
        >
          <div className="mr-2">
            {node.expanded ? (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            )}
          </div>
          
          {/* Always visible checkbox for resource groups */}
          <div className="mr-3">
            <input
              type="checkbox"
              checked={nodeState.checked}
              ref={(el) => {
                if (el) el.indeterminate = nodeState.indeterminate;
              }}
              onChange={(e) => handleResourcePermissionToggle(node.id, e.target.checked)}
              className="permissions-checkbox"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="flex-1">
            <div className="font-semibold text-gray-900">
              {highlightText(node.name, searchTerm)}
            </div>
            {node.path && (
              <div className="text-xs text-gray-500 font-mono mt-1">
                {node.path}
              </div>
            )}
            {node.description && (
              <div className="text-sm text-gray-600">
                - {node.description}
              </div>
            )}
          </div>
          
          <Badge variant="secondary" className="text-xs">
            {permissionCount}
          </Badge>
        </div>

        {/* Node Content */}
        {node.expanded && (
          <div className="bg-white">
            {/* Direct permissions */}
            {node.permissions && node.permissions.map(permission => (
              <div 
                key={permission.id}
                className="flex items-start p-3 border-t border-gray-100 hover:bg-gray-50 transition-colors"
                style={{ paddingLeft: `${24 + paddingLeft}px` }}
              >
                {/* Always visible checkbox for individual permissions */}
                <div className="mr-3 mt-0.5">
                  <input
                    type="checkbox"
                    checked={permission.granted}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="permissions-checkbox"
                        />
                </div>
                
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {highlightText(permission.name, searchTerm)}
                  </div>
                  <div className="text-xs text-gray-500 font-mono mb-2">
                    {highlightText(permission.fullId, searchTerm)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {permission.description}
                  </div>
                  <div className="flex gap-1">
                    {permission.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs px-2 py-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Child nodes */}
            {node.children && Object.values(node.children).map(child => 
              renderPermissionNode(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const highlightText = (text, search) => {
    if (!search) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const allPermissions = getAllPermissions(permissionTree);
  const checkedPermissions = getCheckedPermissions(permissionTree);
  const visiblePermissions = getAllPermissions(filteredData);

  // Filter options for the dropdown
  const filterOptions = [
    { value: 'critical', label: 'Critical', description: 'High-risk permissions' },
    { value: 'readonly', label: 'Read Only', description: 'View-only permissions' },
    { value: 'admin', label: 'Admin', description: 'Administrative permissions' },
    { value: 'data', label: 'Data Management', description: 'Data manipulation permissions' },
    { value: 'write', label: 'Write', description: 'Create/edit permissions' },
    { value: 'delete', label: 'Delete', description: 'Removal permissions' }
  ];

  // Quick action options for the dropdown
  const quickActionOptions = [
    { value: 'read', label: 'All View/Read', description: 'Select all view and read permissions' },
    { value: 'write', label: 'All Create/Edit', description: 'Select all create and edit permissions' },
    { value: 'delete', label: 'All Delete', description: 'Select all delete permissions' },
    { value: 'admin', label: 'All Admin', description: 'Select all administrative permissions' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg">Role Permissions</CardTitle>
            <div className="text-sm text-gray-600">
              <strong>{checkedPermissions.length}</strong> permissions selected
            </div>
          </div>
          {showFilters && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={onSavePermissions}
              >
                Save Permissions
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Controls Panel */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 space-y-4">
            {/* Search and View Controls */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-8"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full bg-gray-400 text-white text-xs hover:bg-gray-500"
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={expandAll}>
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                  Collapse All
                </Button>
                
                {/* Filter Dropdowns */}
                <MultiSelectDropdown
                  options={filterOptions}
                  selectedValues={activeFilters}
                  onChange={handleFilterChange}
                  placeholder="Filter by Type"
                  className="w-[180px]"
                />
                
                <MultiSelectDropdown
                  options={quickActionOptions}
                  selectedValues={selectedQuickActions}
                  onChange={handleQuickActionsChange}
                  placeholder="Filter Permission"
                  className="w-[180px]"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="flex justify-end">
              <div className="flex gap-4 text-sm text-gray-600">
                <div>
                  <strong>{visiblePermissions.length}</strong> visible
                </div>
                <div>
                  <strong>{allPermissions.length}</strong> total
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Simple controls for slideout */}
        {!showFilters && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          </div>
        )}

        {/* Permissions Tree */}
        <div className="max-h-[600px] overflow-y-auto p-4">
          {Object.keys(filteredData).length > 0 ? (
            Object.values(filteredData).map(node => renderPermissionNode(node))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <h3 className="font-medium mb-2">No permissions found</h3>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
};

export default EnhancedPermissionsTab;