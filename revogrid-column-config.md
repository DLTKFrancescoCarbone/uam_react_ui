# RevoGrid Column Configuration Guide

## Basic Column Structure

Columns define the structure of your data grid. Each column represents a specific data field and can be extensively customized.

```tsx
import { type ColumnRegular } from '@revolist/react-datagrid'

const columns: ColumnRegular[] = [
  { 
    prop: 'id', 
    name: 'ID' 
  },
  { 
    prop: 'name', 
    name: 'Name' 
  },
  { 
    prop: 'age', 
    name: 'Age' 
  },
  { 
    prop: 'email', 
    name: 'Email' 
  },
]
```

## Column Sizing

Control column widths using `size`, `minSize`, and `maxSize` properties:

```tsx
const columns = [
  { 
    prop: 'id', 
    name: 'ID', 
    size: 100,        // Fixed width of 100px
    minSize: 80,      // Minimum width when resizing
    maxSize: 150      // Maximum width when resizing
  },
  { 
    prop: 'name', 
    name: 'Name', 
    size: 200 
  },
  { 
    prop: 'description', 
    name: 'Description', 
    size: 300,
    autoSize: true    // Auto-size based on content
  },
]
```

## Column Types

RevoGrid supports various column types through plugins:

### Text/String (Default)
```tsx
const columns = [
  { 
    prop: 'name', 
    name: 'Name' 
    // No columnType specified = default text
  },
]
```

### Numeric
```tsx
import NumberColumnType from '@revolist/revogrid-column-numeral'

const plugin = { 
  numeric: new NumberColumnType('0,0.00') // Format: 1,000.50
}

const columns = [
  { 
    prop: 'price', 
    name: 'Price',
    columnType: 'numeric' 
  },
]

// Apply to grid
<RevoGrid 
  columns={columns} 
  source={source} 
  columnTypes={plugin} 
/>
```

### Select/Dropdown
```tsx
import SelectTypePlugin from '@revolist/revogrid-column-select'

const dropdown = {
  labelKey: 'label',
  valueKey: 'value',
  source: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ],
}

const columns = [
  {
    ...dropdown,
    prop: 'status',
    name: 'Status',
    columnType: 'select',
  },
]

const plugin = {
  select: new SelectTypePlugin()
}
```

### Date
```tsx
import DatePlugin from '@revolist/revogrid-column-date'

const columns = [
  { 
    prop: 'birthdate', 
    name: 'Birth Date',
    columnType: 'date' 
  }
]

const columnTypes = {
  date: new DatePlugin()
}
```

## Column Pinning

Pin columns to left or right side:

```tsx
const columns = [
  { 
    prop: 'id', 
    name: 'ID',
    pin: 'colPinStart' // Pin to left
  },
  { 
    prop: 'name', 
    name: 'Name' 
  },
  { 
    prop: 'actions', 
    name: 'Actions',
    pin: 'colPinEnd' // Pin to right
  },
]
```

## Sorting and Filtering

```tsx
const columns = [
  { 
    prop: 'name', 
    name: 'Name',
    sortable: true,    // Enable sorting
    filter: true,      // Enable filtering
    filterType: 'text' // Filter type
  },
  { 
    prop: 'age', 
    name: 'Age',
    sortable: true,
    filter: 'number'   // Number filter
  },
]
```

## Column Grouping

Create nested headers:

```tsx
const columns = [
  {
    name: 'Personal Info',
    children: [
      { prop: 'firstName', name: 'First Name' },
      { prop: 'lastName', name: 'Last Name' },
      { prop: 'age', name: 'Age' }
    ]
  },
  {
    name: 'Contact',
    children: [
      { prop: 'email', name: 'Email' },
      { prop: 'phone', name: 'Phone' }
    ]
  }
]
```

## Read-Only Columns

```tsx
const columns = [
  { 
    prop: 'id', 
    name: 'ID',
    readonly: true  // Cannot be edited
  },
  { 
    prop: 'name', 
    name: 'Name' 
    // Editable by default
  },
]
```

## Advanced Column Properties

```tsx
const columns = [
  {
    prop: 'name',
    name: 'Name',
    size: 200,
    minSize: 100,
    maxSize: 300,
    sortable: true,
    filter: true,
    readonly: false,
    pin: 'colPinStart',
    autoSize: true,
    cellTemplate: customCellRenderer, // See Cell Templates guide
    editor: 'custom-editor',          // See Custom Editors guide
    columnType: 'text',
    filterType: 'text',
    // Custom CSS class for column
    columnClass: 'my-custom-column',
    // Custom cell properties
    cellProperties: () => ({
      class: 'my-cell-class'
    })
  }
]
```

## Dynamic Column Management

Add/remove columns dynamically:

```tsx
function App() {
  const [columns, setColumns] = useState(initialColumns)
  
  const addColumn = () => {
    setColumns(prev => [...prev, {
      prop: 'newField',
      name: 'New Field',
      size: 150
    }])
  }
  
  const removeColumn = (propToRemove: string) => {
    setColumns(prev => prev.filter(col => col.prop !== propToRemove))
  }
  
  return (
    <>
      <button onClick={addColumn}>Add Column</button>
      <RevoGrid columns={columns} source={source} />
    </>
  )
}
```

## TypeScript Support

For full type safety, use the provided interfaces:

```tsx
import { 
  type ColumnRegular, 
  type ColumnGrouping,
  type ColumnDataSchemaModel 
} from '@revolist/react-datagrid'

const columns: ColumnRegular[] = [
  // Your column definitions with full type support
]
```

## Best Practices

1. **Stable References**: Define columns outside component or use `useMemo`
2. **Performance**: Use `readonly` for non-editable columns
3. **UX**: Set appropriate `minSize` and `maxSize` for better user experience
4. **Accessibility**: Always provide descriptive `name` properties
5. **Type Safety**: Use TypeScript interfaces for better development experience

## Related Guides

- [Cell Templates](./revogrid-cell-templates.md) - Custom cell rendering
- [Custom Editors](./revogrid-custom-editors.md) - Interactive cell editing
- [Styling](./revogrid-styling.md) - Visual customization
