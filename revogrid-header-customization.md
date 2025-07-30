# RevoGrid Header Customization Guide

## Overview

RevoGrid headers can be extensively customized including styling, custom components, grouping, and dynamic content. This guide covers header cell customization, empty vs filled headers, and content hugging techniques.

## Basic Header Styling

### Header Cell Colors and Styling

```css
/* Basic header styling */
revo-grid::part(header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: 3px solid #4c63d2;
}

/* Individual header cells */
revo-grid::part(header-cell) {
  color: white;
  font-weight: 600;
  text-align: center;
  padding: 12px 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

/* Header cell hover effects */
revo-grid::part(header-cell):hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Last header cell - remove right border */
revo-grid::part(header-cell):last-child {
  border-right: none;
}
```

### Column-Specific Header Colors

```tsx
const columns = [
  {
    prop: 'id',
    name: 'ID',
    headerClass: 'header-primary'
  },
  {
    prop: 'name', 
    name: 'Name',
    headerClass: 'header-success'
  },
  {
    prop: 'status',
    name: 'Status', 
    headerClass: 'header-warning'
  },
  {
    prop: 'actions',
    name: 'Actions',
    headerClass: 'header-danger'
  }
]
```

```css
/* Column-specific header colors */
.header-primary {
  background-color: #007bff !important;
  color: white;
}

.header-success {
  background-color: #28a745 !important;
  color: white;
}

.header-warning {
  background-color: #ffc107 !important;
  color: #212529;
}

.header-danger {
  background-color: #dc3545 !important;
  color: white;
}
```

## Custom Header Templates

### Basic Header Template

```tsx
import { Template } from '@revolist/react-datagrid'

const CustomHeader = ({ column }: { column: any }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px',
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      color: 'white',
      fontWeight: 'bold'
    }}>
      <span>{column.name}</span>
      <span style={{ fontSize: '12px', opacity: 0.8 }}>
        ⚡
      </span>
    </div>
  )
}

const columns = [
  {
    prop: 'name',
    name: 'User Name',
    headerTemplate: Template(CustomHeader)
  }
]
```

### Interactive Header with Sorting Indicators

```tsx
const SortableHeader = ({ column, sortOrder }: { column: any, sortOrder?: 'asc' | 'desc' | null }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const getSortIcon = () => {
    if (sortOrder === 'asc') return '▲'
    if (sortOrder === 'desc') return '▼'
    return '⇅'
  }

  const getSortColor = () => {
    if (sortOrder) return '#007bff'
    return isHovered ? '#666' : '#ccc'
  }

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        cursor: 'pointer',
        background: isHovered ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ fontWeight: '600' }}>{column.name}</span>
      <span style={{ 
        color: getSortColor(),
        fontSize: '14px',
        marginLeft: '8px'
      }}>
        {getSortIcon()}
      </span>
    </div>
  )
}
```

### Header with Filter Indicator

```tsx
const FilterableHeader = ({ column, hasFilter }: { column: any, hasFilter?: boolean }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '8px',
      background: hasFilter ? '#e3f2fd' : '#f8f9fa',
      borderBottom: hasFilter ? '2px solid #2196f3' : '1px solid #dee2e6'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontWeight: '600' }}>{column.name}</span>
        {hasFilter && (
          <span style={{
            backgroundColor: '#2196f3',
            color: 'white',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            ✓
          </span>
        )}
      </div>
      {hasFilter && (
        <div style={{
          fontSize: '10px',
          color: '#666',
          marginTop: '2px'
        }}>
          Filtered
        </div>
      )}
    </div>
  )
}
```

## Empty vs Filled Header Handling

### Empty Header Cells

```tsx
const EmptyHeaderCell = ({ column }: { column: any }) => {
  const isEmpty = !column.name || column.name.trim() === ''
  
  return (
    <div style={{
      padding: '12px 8px',
      background: isEmpty ? '#f8f9fa' : '#ffffff',
      border: isEmpty ? '2px dashed #dee2e6' : '1px solid #dee2e6',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isEmpty ? '#6c757d' : '#212529'
    }}>
      {isEmpty ? (
        <span style={{ 
          fontStyle: 'italic',
          fontSize: '12px'
        }}>
          Empty Header
        </span>
      ) : (
        <span style={{ fontWeight: '600' }}>
          {column.name}
        </span>
      )}
    </div>
  )
}

const columns = [
  {
    prop: 'id',
    name: 'ID',
    headerTemplate: Template(EmptyHeaderCell)
  },
  {
    prop: 'name',
    name: '', // Empty header
    headerTemplate: Template(EmptyHeaderCell)
  },
  {
    prop: 'description',
    name: 'Description',
    headerTemplate: Template(EmptyHeaderCell)
  }
]
```

### Conditional Header Styling

```tsx
const ConditionalHeader = ({ column, data }: { column: any, data?: any[] }) => {
  const hasData = data && data.length > 0
  const hasValues = hasData && data.some(row => row[column.prop] != null && row[column.prop] !== '')
  
  return (
    <div style={{
      padding: '8px 12px',
      background: hasValues 
        ? 'linear-gradient(135deg, #28a745, #20c997)' 
        : 'linear-gradient(135deg, #6c757d, #adb5bd)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontWeight: '600' }}>
          {column.name || 'Unnamed'}
        </span>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: hasValues ? '#fff' : 'rgba(255,255,255,0.5)'
        }} />
      </div>
      
      {/* Data indicator bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        width: hasValues ? '100%' : '0%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        transition: 'width 0.3s ease'
      }} />
    </div>
  )
}
```

## Content Hugging in Rows

### Auto-Sizing Headers Based on Content

```tsx
const ContentHuggingHeader = ({ column, maxWidth }: { column: any, maxWidth?: number }) => {
  const [headerRef, setHeaderRef] = useState<HTMLDivElement | null>(null)
  const [contentWidth, setContentWidth] = useState(0)

  useEffect(() => {
    if (headerRef) {
      // Measure content width
      const measureElement = document.createElement('span')
      measureElement.style.visibility = 'hidden'
      measureElement.style.position = 'absolute'
      measureElement.style.fontSize = '14px'
      measureElement.style.fontWeight = '600'
      measureElement.textContent = column.name
      
      document.body.appendChild(measureElement)
      const width = measureElement.offsetWidth
      document.body.removeChild(measureElement)
      
      setContentWidth(Math.min(width + 32, maxWidth || 200)) // Add padding
    }
  }, [column.name, maxWidth])

  return (
    <div 
      ref={setHeaderRef}
      style={{
        padding: '8px 16px',
        background: '#f8f9fa',
        borderRight: '1px solid #dee2e6',
        fontWeight: '600',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: contentWidth > 0 ? `${contentWidth}px` : 'auto',
        minWidth: '80px',
        maxWidth: maxWidth ? `${maxWidth}px` : 'none'
      }}
      title={column.name} // Tooltip for long names
    >
      {column.name}
    </div>
  )
}

// Apply to columns with dynamic sizing
const dynamicColumns = originalColumns.map(col => ({
  ...col,
  headerTemplate: Template(ContentHuggingHeader),
  size: undefined, // Let header determine size
  autoSize: true
}))
```

### Multi-line Header Content

```tsx
const MultiLineHeader = ({ column }: { column: any }) => {
  const [title, subtitle] = column.name?.split('|') || [column.name, '']
  
  return (
    <div style={{
      padding: '6px 8px',
      background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
      borderRight: '1px solid #dee2e6',
      textAlign: 'center',
      minHeight: '50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{
        fontWeight: '600',
        fontSize: '13px',
        lineHeight: '1.2',
        marginBottom: subtitle ? '2px' : '0'
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{
          fontSize: '10px',
          color: '#6c757d',
          lineHeight: '1.1'
        }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}

// Usage with pipe-separated titles
const columns = [
  {
    prop: 'name',
    name: 'Full Name|Personal Info',
    headerTemplate: Template(MultiLineHeader)
  },
  {
    prop: 'email',
    name: 'Email Address|Contact Details',
    headerTemplate: Template(MultiLineHeader)
  }
]
```

## Header Groups and Nested Headers

### Complex Header Grouping

```tsx
const GroupHeader = ({ 
  children, 
  title, 
  color = '#007bff' 
}: { 
  children: any[], 
  title: string,
  color?: string 
}) => {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
      color: 'white',
      padding: '8px',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: '14px',
      borderBottom: '2px solid rgba(255,255,255,0.3)'
    }}>
      {title}
    </div>
  )
}

const SubHeader = ({ column }: { column: any }) => {
  return (
    <div style={{
      padding: '6px 8px',
      background: '#f8f9fa',
      borderRight: '1px solid #dee2e6',
      fontSize: '12px',
      fontWeight: '500',
      textAlign: 'center'
    }}>
      {column.name}
    </div>
  )
}

// Nested header structure
const nestedColumns = [
  {
    name: 'Personal Information',
    headerTemplate: Template(() => <GroupHeader title="Personal Information" color="#28a745" />),
    children: [
      {
        prop: 'firstName',
        name: 'First Name',
        headerTemplate: Template(SubHeader)
      },
      {
        prop: 'lastName', 
        name: 'Last Name',
        headerTemplate: Template(SubHeader)
      },
      {
        prop: 'age',
        name: 'Age',
        headerTemplate: Template(SubHeader)
      }
    ]
  },
  {
    name: 'Contact Details',
    headerTemplate: Template(() => <GroupHeader title="Contact Details" color="#17a2b8" />),
    children: [
      {
        prop: 'email',
        name: 'Email',
        headerTemplate: Template(SubHeader)
      },
      {
        prop: 'phone',
        name: 'Phone',
        headerTemplate: Template(SubHeader)
      }
    ]
  }
]
```

## Responsive Header Design

### Mobile-Friendly Headers

```css
/* Responsive header styling */
@media (max-width: 768px) {
  revo-grid::part(header-cell) {
    font-size: 11px;
    padding: 6px 4px;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    min-height: 80px;
  }
  
  /* Rotate header text on mobile */
  .mobile-header {
    transform: rotate(-45deg);
    transform-origin: center;
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  revo-grid::part(header-cell) {
    font-size: 10px;
    padding: 4px 2px;
  }
}
```

```tsx
const ResponsiveHeader = ({ column }: { column: any }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isMobile) {
    return (
      <div style={{
        writing: 'vertical-rl',
        textOrientation: 'mixed',
        padding: '4px',
        fontSize: '11px',
        fontWeight: '600',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {column.name}
      </div>
    )
  }

  return (
    <div style={{
      padding: '8px 12px',
      fontWeight: '600',
      fontSize: '14px'
    }}>
      {column.name}
    </div>
  )
}
```

## Header Animations and Transitions

### Animated Header Effects

```css
/* Animated header effects */
revo-grid::part(header-cell) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

revo-grid::part(header-cell):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Ripple effect on click */
revo-grid::part(header-cell):active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}
```

## Complete Header Customization Example

```tsx
function FullyCustomizedHeaderGrid() {
  const [source] = useState(sampleData)
  const [sortConfig, setSortConfig] = useState<{column: string, direction: 'asc' | 'desc'} | null>(null)
  const [filters, setFilters] = useState<Record<string, any>>({})

  const CompleteHeader = ({ column }: { column: any }) => {
    const hasFilter = filters[column.prop]
    const sortDirection = sortConfig?.column === column.prop ? sortConfig.direction : null
    const isEmpty = !column.name || column.name.trim() === ''

    return (
      <div style={{
        background: isEmpty 
          ? 'repeating-linear-gradient(45deg, #f8f9fa, #f8f9fa 10px, #ffffff 10px, #ffffff 20px)'
          : hasFilter 
            ? 'linear-gradient(135deg, #007bff, #0056b3)'
            : 'linear-gradient(135deg, #6c757d, #495057)',
        color: isEmpty ? '#6c757d' : 'white',
        padding: '10px 12px',
        borderRight: '1px solid rgba(255,255,255,0.2)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern for empty headers */}
        {isEmpty && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(108,117,125,0.1) 5px, rgba(108,117,125,0.1) 10px)',
            pointerEvents: 'none'
          }} />
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1
        }}>
          <span style={{ 
            fontWeight: '600',
            fontSize: '13px'
          }}>
            {column.name || 'Empty'}
          </span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {hasFilter && (
              <span style={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                ⚪
              </span>
            )}
            
            {sortDirection && (
              <span style={{ fontSize: '12px' }}>
                {sortDirection === 'asc' ? '▲' : '▼'}
              </span>
            )}
          </div>
        </div>

        {/* Loading bar animation */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          width: hasFilter ? '100%' : '0%',
          background: 'rgba(255,255,255,0.8)',
          transition: 'width 0.5s ease'
        }} />
      </div>
    )
  }

  const columns = originalColumns.map(col => ({
    ...col,
    headerTemplate: Template(CompleteHeader)
  }))

  return (
    <RevoGrid
      columns={columns}
      source={source}
      onAftersortingapply={(e: any) => {
        setSortConfig({ 
          column: e.detail.column, 
          direction: e.detail.order 
        })
      }}
    />
  )
}
```

## Best Practices

1. **Performance**: Use React.memo for complex header components
2. **Accessibility**: Include proper ARIA labels and roles
3. **Responsive**: Design headers that work on all screen sizes
4. **Content**: Handle empty headers gracefully with visual indicators
5. **Consistency**: Maintain consistent styling across all headers
6. **Interactivity**: Provide clear visual feedback for sortable/filterable headers
7. **Loading States**: Show loading indicators during async operations

## Related Guides

- [Column Configuration](./revogrid-column-config.md) - Column properties and setup
- [Styling and Themes](./revogrid-styling.md) - CSS customization
- [Cell Templates](./revogrid-cell-templates.md) - Custom cell rendering
- [Events and Callbacks](./revogrid-events-guide.md) - Header event handling