# RevoGrid Advanced Features Guide

## Plugin System

RevoGrid supports a powerful plugin system for extending functionality:

### Creating Custom Plugins

```tsx
// Custom plugin example
class CustomPlugin {
  constructor(grid: any) {
    this.grid = grid
    this.init()
  }

  init() {
    // Plugin initialization logic
    this.grid.addEventListener('cellclick', this.handleCellClick.bind(this))
  }

  handleCellClick(event: any) {
    // Custom cell click handling
    console.log('Plugin handling cell click:', event.detail)
  }

  destroy() {
    // Cleanup when plugin is removed
    this.grid.removeEventListener('cellclick', this.handleCellClick)
  }
}

// Register plugin
const plugins = {
  'custom-plugin': CustomPlugin
}

function App() {
  return (
    <RevoGrid
      columns={columns}
      source={source}
      plugins={plugins}
    />
  )
}
```

### Using Existing Plugins

```tsx
// Example with export plugin
import ExportPlugin from '@revolist/revogrid-export'

const plugins = {
  export: new ExportPlugin()
}

const columns = [
  { prop: 'name', name: 'Name' },
  { prop: 'age', name: 'Age' },
  {
    prop: 'export',
    name: 'Export',
    readonly: true,
    cellTemplate: Template(({ model }: any) => (
      <button onClick={() => exportRow(model)}>
        Export Row
      </button>
    ))
  }
]
```

## Context Menu Customization

```tsx
import { useState } from 'react'

function GridWithContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    data: any
  }>({ visible: false, x: 0, y: 0, data: null })

  const handleContextMenu = (event: any) => {
    event.preventDefault()
    const { clientX, clientY } = event
    const { model, rowIndex } = event.detail

    setContextMenu({
      visible: true,
      x: clientX,
      y: clientY,
      data: { model, rowIndex }
    })
  }

  const contextMenuItems = [
    {
      label: 'Copy Row',
      action: () => copyRow(contextMenu.data.model)
    },
    {
      label: 'Delete Row',
      action: () => deleteRow(contextMenu.data.rowIndex)
    },
    {
      label: 'Duplicate Row',
      action: () => duplicateRow(contextMenu.data.model)
    }
  ]

  const copyRow = (rowData: any) => {
    navigator.clipboard.writeText(JSON.stringify(rowData))
    setContextMenu({ ...contextMenu, visible: false })
  }

  const deleteRow = (rowIndex: number) => {
    // Implement delete logic
    console.log('Delete row:', rowIndex)
    setContextMenu({ ...contextMenu, visible: false })
  }

  const duplicateRow = (rowData: any) => {
    // Implement duplicate logic
    const newRow = { ...rowData, id: Date.now() }
    console.log('Duplicate row:', newRow)
    setContextMenu({ ...contextMenu, visible: false })
  }

  return (
    <div style={{ position: 'relative' }}>
      <RevoGrid
        columns={columns}
        source={source}
        onContextmenu={handleContextMenu}
      />
      
      {contextMenu.visible && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}
        >
          {contextMenuItems.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                borderBottom: index < contextMenuItems.length - 1 ? '1px solid #eee' : 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
      
      {contextMenu.visible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setContextMenu({ ...contextMenu, visible: false })}
        />
      )}
    </div>
  )
}
```

## Advanced Filtering

```tsx
import { useState, useMemo } from 'react'

function AdvancedFilterGrid() {
  const [source] = useState(initialData)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [globalFilter, setGlobalFilter] = useState('')

  // Custom filter functions
  const filterFunctions = {
    text: (value: any, filterValue: string) => 
      String(value).toLowerCase().includes(filterValue.toLowerCase()),
    
    number: (value: any, filterValue: { min?: number, max?: number }) => {
      const num = Number(value)
      if (filterValue.min !== undefined && num < filterValue.min) return false
      if (filterValue.max !== undefined && num > filterValue.max) return false
      return true
    },
    
    date: (value: any, filterValue: { start?: Date, end?: Date }) => {
      const date = new Date(value)
      if (filterValue.start && date < filterValue.start) return false
      if (filterValue.end && date > filterValue.end) return false
      return true
    },
    
    select: (value: any, filterValue: string[]) =>
      filterValue.length === 0 || filterValue.includes(String(value))
  }

  // Apply filters
  const filteredData = useMemo(() => {
    return source.filter(row => {
      // Apply column-specific filters
      for (const [prop, filterConfig] of Object.entries(filters)) {
        if (filterConfig.value && filterConfig.type) {
          const filterFn = filterFunctions[filterConfig.type as keyof typeof filterFunctions]
          if (filterFn && !filterFn(row[prop], filterConfig.value)) {
            return false
          }
        }
      }

      // Apply global filter
      if (globalFilter) {
        const searchText = globalFilter.toLowerCase()
        return Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchText)
        )
      }

      return true
    })
  }, [source, filters, globalFilter])

  const updateFilter = (prop: string, type: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [prop]: { type, value }
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setGlobalFilter('')
  }

  return (
    <div>
      {/* Global Filter */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Global search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {/* Column-specific filters */}
      <div style={{ marginBottom: '16px' }}>
        <div>Age Range:</div>
        <input
          type="number"
          placeholder="Min age"
          onChange={(e) => updateFilter('age', 'number', { 
            ...filters.age?.value, 
            min: Number(e.target.value) || undefined 
          })}
        />
        <input
          type="number"
          placeholder="Max age"
          onChange={(e) => updateFilter('age', 'number', { 
            ...filters.age?.value, 
            max: Number(e.target.value) || undefined 
          })}
        />
      </div>

      <div>Showing {filteredData.length} of {source.length} rows</div>

      <RevoGrid
        columns={columns}
        source={filteredData}
      />
    </div>
  )
}
```

## Virtual Scrolling Configuration

```tsx
function VirtualScrollGrid() {
  const [source] = useState(() => {
    // Generate large dataset
    return Array.from({ length: 10000 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      age: Math.floor(Math.random() * 50) + 18,
      department: ['Engineering', 'Sales', 'Marketing', 'HR'][index % 4]
    }))
  })

  return (
    <RevoGrid
      columns={columns}
      source={source}
      // Virtual scrolling is enabled by default
      // You can configure buffer sizes
      rowBufferSize={10}      // Number of rows to render outside viewport
      columnBufferSize={3}    // Number of columns to render outside viewport
      
      // Performance optimizations
      useConstantRowHeight={true}  // If all rows have same height
      rowHeight={40}               // Fixed row height
      
      // Large dataset optimizations
      range={{
        rowStart: 0,
        rowEnd: 100    // Only render first 100 rows initially
      }}
    />
  )
}
```

## Row Grouping

```tsx
interface GroupedData {
  [key: string]: any[]
}

function GroupedGrid() {
  const [source] = useState(initialData)
  const [groupBy, setGroupBy] = useState<string>('department')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const groupedData = useMemo(() => {
    const groups: GroupedData = {}
    source.forEach(row => {
      const groupKey = row[groupBy] || 'Ungrouped'
      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(row)
    })
    return groups
  }, [source, groupBy])

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey)
    } else {
      newExpanded.add(groupKey)
    }
    setExpandedGroups(newExpanded)
  }

  // Flatten data for display with group headers
  const displayData = useMemo(() => {
    const result: any[] = []
    
    Object.entries(groupedData).forEach(([groupKey, groupRows]) => {
      // Add group header row
      result.push({
        _isGroupHeader: true,
        _groupKey: groupKey,
        _groupCount: groupRows.length,
        [groupBy]: `${groupKey} (${groupRows.length} items)`
      })

      // Add group rows if expanded
      if (expandedGroups.has(groupKey)) {
        result.push(...groupRows.map(row => ({
          ...row,
          _isGroupChild: true
        })))
      }
    })

    return result
  }, [groupedData, expandedGroups, groupBy])

  const GroupHeaderCell = ({ value, model }: any) => {
    if (!model._isGroupHeader) return <span>{value}</span>

    return (
      <div 
        style={{ 
          fontWeight: 'bold', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
        onClick={() => toggleGroup(model._groupKey)}
      >
        <span style={{ marginRight: '8px' }}>
          {expandedGroups.has(model._groupKey) ? '▼' : '▶'}
        </span>
        {value}
      </div>
    )
  }

  const columns = [
    {
      prop: groupBy,
      name: 'Group',
      cellTemplate: Template(GroupHeaderCell),
      cellProperties: (model: any) => ({
        style: {
          backgroundColor: model._isGroupHeader ? '#f5f5f5' : 'transparent',
          paddingLeft: model._isGroupChild ? '20px' : '8px'
        }
      })
    },
    ...originalColumns.filter(col => col.prop !== groupBy)
  ]

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        Group by:
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          style={{ marginLeft: '8px' }}
        >
          <option value="department">Department</option>
          <option value="age">Age</option>
          <option value="status">Status</option>
        </select>
      </div>

      <RevoGrid
        columns={columns}
        source={displayData}
      />
    </div>
  )
}
```

## Export Functionality

```tsx
function ExportableGrid() {
  const [source] = useState(initialData)

  const exportToCSV = () => {
    const headers = columns.map(col => col.name).join(',')
    const rows = source.map(row => 
      columns.map(col => row[col.prop]).join(',')
    ).join('\n')
    
    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'grid-data.csv'
    a.click()
    
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const json = JSON.stringify(source, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'grid-data.json'
    a.click()
    
    URL.revokeObjectURL(url)
  }

  const exportToExcel = async () => {
    // Using SheetJS library (you'll need to install it)
    const XLSX = await import('xlsx')
    
    const ws = XLSX.utils.json_to_sheet(source)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    
    XLSX.writeFile(wb, 'grid-data.xlsx')
  }

  const printGrid = () => {
    const printContent = `
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${source.map(row => 
            `<tr>${columns.map(col => `<td>${row[col.prop]}</td>`).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
    `
    
    const printWindow = window.open('', '', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={exportToCSV} style={{ marginRight: '8px' }}>
          Export CSV
        </button>
        <button onClick={exportToJSON} style={{ marginRight: '8px' }}>
          Export JSON
        </button>
        <button onClick={exportToExcel} style={{ marginRight: '8px' }}>
          Export Excel
        </button>
        <button onClick={printGrid}>
          Print
        </button>
      </div>

      <RevoGrid
        columns={columns}
        source={source}
      />
    </div>
  )
}
```

## Drag and Drop

```tsx
function DragDropGrid() {
  const [source, setSource] = useState(initialData)
  const [draggedRow, setDraggedRow] = useState<number | null>(null)

  const handleRowDragStart = (event: any) => {
    const { rowIndex } = event.detail
    setDraggedRow(rowIndex)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleRowDragOver = (event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleRowDrop = (event: any) => {
    event.preventDefault()
    const { rowIndex: dropIndex } = event.detail
    
    if (draggedRow !== null && draggedRow !== dropIndex) {
      const newSource = [...source]
      const draggedItem = newSource.splice(draggedRow, 1)[0]
      newSource.splice(dropIndex, 0, draggedItem)
      setSource(newSource)
    }
    
    setDraggedRow(null)
  }

  const DragHandleCell = ({ model, rowIndex }: any) => (
    <div
      draggable
      onDragStart={(e) => handleRowDragStart({ detail: { rowIndex }, dataTransfer: e.dataTransfer })}
      style={{
        cursor: 'grab',
        padding: '4px',
        textAlign: 'center'
      }}
    >
      ⋮⋮
    </div>
  )

  const columnsWithDrag = [
    {
      prop: '_drag',
      name: '',
      size: 40,
      readonly: true,
      cellTemplate: Template(DragHandleCell)
    },
    ...columns
  ]

  return (
    <div
      onDragOver={handleRowDragOver}
      onDrop={handleRowDrop}
    >
      <RevoGrid
        columns={columnsWithDrag}
        source={source.map((row, index) => ({ ...row, _rowIndex: index }))}
        rowDraggable={true}
      />
    </div>
  )
}
```

## Best Practices for Advanced Features

1. **Performance**: Use virtualization for large datasets
2. **Memory**: Clean up event listeners and plugins when components unmount
3. **UX**: Provide loading states for async operations
4. **Accessibility**: Ensure custom features maintain keyboard navigation
5. **Testing**: Test advanced features with various data sizes and types
6. **Documentation**: Document custom plugins and complex features
7. **Error Handling**: Implement robust error handling for advanced features

## Related Guides

- [Events and Callbacks](./revogrid-events-guide.md) - Event handling for advanced features
- [Custom Editors](./revogrid-custom-editors.md) - Advanced editor customization
- [Cell Templates](./revogrid-cell-templates.md) - Complex cell rendering
- [Styling](./revogrid-styling.md) - Advanced styling techniques
