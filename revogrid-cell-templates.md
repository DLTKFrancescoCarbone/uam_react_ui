# RevoGrid Cell Templates Guide

## Overview

RevoGrid allows you to render custom React components inside grid cells using the `cellTemplate` property. This enables rich, interactive content beyond plain text.

> **Performance Note**: For fastest rendering, consider using native VNode rendering instead of React components for simple cases.

## Basic Cell Template

```tsx
import { 
  type ColumnDataSchemaModel, 
  RevoGrid, 
  Template 
} from '@revolist/react-datagrid'
import { useState } from 'react'

/**
 * Custom cell component
 */
const Cell = ({ value }: Partial<ColumnDataSchemaModel>) => {
  return <div><strong>{value}</strong></div>
}

/**
 * Stable column reference to prevent re-renders
 */
const columns = [
  {
    prop: 'name',
    name: 'Name',
    cellTemplate: Template(Cell), // Wrap with Template()
  },
]

function App() {
  const [source] = useState([
    { name: 'John Doe', age: 30 },
    { name: 'Jane Smith', age: 25 },
  ])

  return <RevoGrid columns={columns} source={source} />
}
```

## Advanced Cell Template with Full Data Access

```tsx
interface CellProps extends Partial<ColumnDataSchemaModel> {
  model?: any      // Full row data
  prop?: string    // Current column property
  value?: any      // Current cell value
}

const DetailedCell = ({ value, model, prop }: CellProps) => {
  return (
    <div className="custom-cell">
      <div className="value">{value}</div>
      <div className="metadata">
        Row ID: {model?.id} | Column: {prop}
      </div>
    </div>
  )
}

const columns = [
  {
    prop: 'name',
    name: 'Name',
    cellTemplate: Template(DetailedCell),
  },
]
```

## Conditional Rendering

```tsx
const StatusCell = ({ value, model }: CellProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'inactive': return 'red'
      case 'pending': return 'orange'
      default: return 'gray'
    }
  }

  return (
    <div 
      style={{ 
        color: getStatusColor(value),
        fontWeight: 'bold',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: `${getStatusColor(value)}20`
      }}
    >
      {value?.toUpperCase()}
    </div>
  )
}
```

## Interactive Cell Components

```tsx
const ActionCell = ({ model }: CellProps) => {
  const handleEdit = () => {
    console.log('Edit:', model)
  }

  const handleDelete = () => {
    console.log('Delete:', model)
  }

  return (
    <div className="action-buttons">
      <button 
        onClick={handleEdit}
        style={{ marginRight: '8px', padding: '4px 8px' }}
      >
        Edit
      </button>
      <button 
        onClick={handleDelete}
        style={{ padding: '4px 8px', backgroundColor: '#ff4444', color: 'white' }}
      >
        Delete
      </button>
    </div>
  )
}

const columns = [
  { prop: 'name', name: 'Name' },
  { prop: 'email', name: 'Email' },
  {
    prop: 'actions',
    name: 'Actions',
    cellTemplate: Template(ActionCell),
    readonly: true, // Prevent editing
    size: 150
  },
]
```

## Image Cell Template

```tsx
const ImageCell = ({ value, model }: CellProps) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="image-cell">
      {!imageError ? (
        <img
          src={value}
          alt={model?.name || 'Image'}
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%',
            objectFit: 'cover'
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}
        >
          No Image
        </div>
      )}
    </div>
  )
}
```

## Progress Bar Cell

```tsx
const ProgressCell = ({ value }: CellProps) => {
  const percentage = Math.min(100, Math.max(0, value || 0))
  
  return (
    <div style={{ width: '100%', padding: '4px' }}>
      <div 
        style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: percentage > 70 ? '#4CAF50' : percentage > 30 ? '#FF9800' : '#F44336',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      <div style={{ fontSize: '12px', textAlign: 'center', marginTop: '2px' }}>
        {percentage}%
      </div>
    </div>
  )
}
```

## Chart/Graph Cell

```tsx
const MiniChart = ({ model }: CellProps) => {
  const data = model?.chartData || []
  const maxValue = Math.max(...data)
  
  return (
    <div style={{ display: 'flex', alignItems: 'end', height: '30px', gap: '2px' }}>
      {data.map((value: number, index: number) => (
        <div
          key={index}
          style={{
            width: '8px',
            height: `${(value / maxValue) * 100}%`,
            backgroundColor: '#2196F3',
            minHeight: '2px'
          }}
        />
      ))}
    </div>
  )
}

// Usage with data:
const source = [
  { 
    name: 'Product A', 
    chart: null, // This will be rendered by the template
    chartData: [10, 20, 15, 25, 30, 18, 22] 
  },
]
```

## Native VNode Rendering (High Performance)

For maximum performance, use native VNode rendering instead of React components:

```tsx
const columns = [
  {
    prop: 'name',
    name: 'Name',
    // Native VNode renderer (faster)
    cellTemplate: (h: any, { model, prop }: any) => {
      return h('strong', { 
        style: { color: 'blue' } 
      }, model[prop])
    }
  },
  {
    prop: 'status',
    name: 'Status',
    cellTemplate: (h: any, { value }: any) => {
      const color = value === 'active' ? 'green' : 'red'
      return h('span', {
        style: { 
          color, 
          fontWeight: 'bold',
          padding: '2px 6px',
          borderRadius: '3px',
          backgroundColor: `${color}20`
        }
      }, value)
    }
  }
]
```

## Complex Multi-Element Cell

```tsx
const ComplexCell = ({ value, model }: CellProps) => {
  return (
    <div className="complex-cell" style={{ padding: '8px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        {model?.title}
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        {model?.description}
      </div>
      <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
        Created: {new Date(model?.createdAt).toLocaleDateString()}
      </div>
    </div>
  )
}
```

## Best Practices

### 1. Performance Optimization
```tsx
// Use React.memo for expensive components
const ExpensiveCell = React.memo(({ value, model }: CellProps) => {
  // Complex rendering logic
  return <div>{/* Complex content */}</div>
})

const columns = [
  {
    prop: 'data',
    name: 'Data',
    cellTemplate: Template(ExpensiveCell),
  },
]
```

### 2. Event Handling
```tsx
const InteractiveCell = ({ value, model }: CellProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent grid cell selection
    // Handle click
  }

  return (
    <button onClick={handleClick}>
      {value}
    </button>
  )
}
```

### 3. Styling
```tsx
const StyledCell = ({ value }: CellProps) => {
  return (
    <div 
      className="custom-cell"
      style={{
        // Inline styles work
        padding: '4px',
        textAlign: 'center'
      }}
    >
      {value}
    </div>
  )
}

// Or use CSS classes
// .custom-cell { ... }
```

## Key Considerations

1. **Data Access**: Cell components receive `value`, `model` (full row), and `prop` (column property)
2. **Performance**: Custom renderers can impact performance with large datasets
3. **Event Handling**: Use `stopPropagation()` to prevent interfering with grid events
4. **Conditional Rendering**: Use conditional logic to change appearance based on data
5. **Interactivity**: Cells can include event handlers for clicks, changes, etc.
6. **Template Wrapper**: Always wrap React components with `Template()`

## Related Guides

- [Custom Editors](./revogrid-custom-editors.md) - Interactive cell editing
- [Column Configuration](./revogrid-column-config.md) - Column setup
- [Styling](./revogrid-styling.md) - Visual customization
