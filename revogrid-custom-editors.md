# RevoGrid Custom Editors Guide

## Overview

Custom editors allow users to edit cell values with specialized input components beyond the default text input. RevoGrid supports both predefined editors and fully custom React components.

## Basic Custom Editor Setup

```tsx
import { 
  useState 
} from 'react'
import { 
  RevoGrid, 
  Editor, 
  type EditorType, 
  type Editors 
} from '@revolist/react-datagrid'

/**
 * Custom editor component
 */
const CustomButton = ({ close }: EditorType) => {
  return (
    <button onClick={close} style={{ padding: '8px 16px' }}>
      Close Editor
    </button>
  )
}

// Register the editor
const gridEditors: Editors = {
  'custom-button': Editor(CustomButton)
}

const columns = [
  {
    prop: 'name',
    name: 'Name',
    editor: 'custom-button', // Reference the editor
  },
]

function App() {
  const [source] = useState([
    { name: 'Item 1', details: 'Description 1' },
    { name: 'Item 2', details: 'Description 2' },
  ])

  return (
    <RevoGrid 
      columns={columns} 
      source={source} 
      editors={gridEditors} 
    />
  )
}
```

## Editor Interface

Custom editors receive these props through `EditorType`:

```tsx
interface EditorType {
  // Editor control methods
  close: () => void           // Close the editor
  save?: () => void          // Save the current value
  
  // Cell data
  value?: any                // Current cell value
  model?: any                // Full row data
  prop?: string              // Column property name
  
  // Grid context
  rowIndex?: number          // Current row index
  colIndex?: number          // Current column index
}
```

## Text Input Editor

```tsx
const TextEditor = ({ value, close, save }: EditorType) => {
  const [inputValue, setInputValue] = useState(value || '')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      close()
    }
  }

  const handleSave = () => {
    // Update the cell value
    save?.()
    close()
  }

  useEffect(() => {
    // Auto-focus when editor opens
    const input = document.querySelector('.custom-text-editor') as HTMLInputElement
    input?.focus()
  }, [])

  return (
    <input
      className="custom-text-editor"
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleSave}
      style={{
        width: '100%',
        padding: '4px',
        border: '2px solid #007bff',
        borderRadius: '4px'
      }}
    />
  )
}

const gridEditors: Editors = {
  'text-editor': Editor(TextEditor)
}
```

## Dropdown/Select Editor

```tsx
const SelectEditor = ({ value, close, save, model }: EditorType) => {
  const [selectedValue, setSelectedValue] = useState(value || '')
  
  const options = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value)
    // Auto-save on selection
    setTimeout(() => {
      save?.()
      close()
    }, 100)
  }

  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      onBlur={() => close()}
      style={{
        width: '100%',
        padding: '4px',
        border: '2px solid #007bff',
        borderRadius: '4px'
      }}
      autoFocus
    >
      <option value="">Select...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

const gridEditors: Editors = {
  'select-editor': Editor(SelectEditor)
}
```

## Number Input Editor

```tsx
const NumberEditor = ({ value, close, save }: EditorType) => {
  const [numberValue, setNumberValue] = useState(
    typeof value === 'number' ? value : parseFloat(value) || 0
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      save?.()
      close()
    } else if (e.key === 'Escape') {
      close()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setNumberValue(isNaN(val) ? 0 : val)
  }

  return (
    <input
      type="number"
      value={numberValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        save?.()
        close()
      }}
      style={{
        width: '100%',
        padding: '4px',
        border: '2px solid #007bff',
        borderRadius: '4px'
      }}
      autoFocus
    />
  )
}
```

## Date Picker Editor

```tsx
const DateEditor = ({ value, close, save }: EditorType) => {
  // Convert value to date string format for input
  const formatDateForInput = (date: any) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  const [dateValue, setDateValue] = useState(formatDateForInput(value))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateValue(e.target.value)
  }

  const handleSave = () => {
    save?.()
    close()
  }

  return (
    <input
      type="date"
      value={dateValue}
      onChange={handleChange}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSave()
        if (e.key === 'Escape') close()
      }}
      style={{
        width: '100%',
        padding: '4px',
        border: '2px solid #007bff',
        borderRadius: '4px'
      }}
      autoFocus
    />
  )
}
```

## Checkbox Editor

```tsx
const CheckboxEditor = ({ value, close, save }: EditorType) => {
  const [checked, setChecked] = useState(Boolean(value))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
    // Auto-save checkbox changes
    setTimeout(() => {
      save?.()
      close()
    }, 100)
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%',
      padding: '4px'
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        autoFocus
        style={{ transform: 'scale(1.2)' }}
      />
    </div>
  )
}
```

## Textarea Editor

```tsx
const TextareaEditor = ({ value, close, save }: EditorType) => {
  const [textValue, setTextValue] = useState(value || '')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
    // Allow Enter for new lines, use Ctrl+Enter to save
    if (e.key === 'Enter' && e.ctrlKey) {
      save?.()
      close()
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          save?.()
          close()
        }}
        style={{
          width: '200px',
          height: '80px',
          padding: '4px',
          border: '2px solid #007bff',
          borderRadius: '4px',
          resize: 'none'
        }}
        autoFocus
      />
      <div style={{ 
        fontSize: '10px', 
        color: '#666', 
        marginTop: '2px' 
      }}>
        Ctrl+Enter to save, Esc to cancel
      </div>
    </div>
  )
}
```

## Multi-Value Editor (Tags)

```tsx
const TagsEditor = ({ value, close, save }: EditorType) => {
  const [tags, setTags] = useState<string[]>(
    Array.isArray(value) ? value : (value ? [value] : [])
  )
  const [inputValue, setInputValue] = useState('')

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Escape') {
      close()
    }
  }

  const handleSave = () => {
    save?.()
    close()
  }

  return (
    <div style={{ 
      minWidth: '200px', 
      padding: '8px',
      border: '2px solid #007bff',
      borderRadius: '4px',
      backgroundColor: 'white'
    }}>
      <div style={{ marginBottom: '8px' }}>
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              display: 'inline-block',
              backgroundColor: '#e0e0e0',
              padding: '2px 6px',
              margin: '2px',
              borderRadius: '12px',
              fontSize: '12px'
            }}
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              style={{
                marginLeft: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tag..."
        style={{
          width: '100%',
          padding: '4px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
        autoFocus
      />
      <div style={{ marginTop: '8px', textAlign: 'right' }}>
        <button onClick={close} style={{ marginRight: '8px' }}>
          Cancel
        </button>
        <button onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  )
}
```

## Editor with Validation

```tsx
const ValidatedEditor = ({ value, close, save }: EditorType) => {
  const [inputValue, setInputValue] = useState(value || '')
  const [error, setError] = useState('')

  const validate = (val: string) => {
    if (!val.trim()) {
      return 'Value is required'
    }
    if (val.length < 3) {
      return 'Value must be at least 3 characters'
    }
    return ''
  }

  const handleSave = () => {
    const errorMsg = validate(inputValue)
    if (errorMsg) {
      setError(errorMsg)
      return
    }
    save?.()
    close()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (error) setError('') // Clear error on change
  }

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave()
          if (e.key === 'Escape') close()
        }}
        style={{
          width: '100%',
          padding: '4px',
          border: error ? '2px solid red' : '2px solid #007bff',
          borderRadius: '4px'
        }}
        autoFocus
      />
      {error && (
        <div style={{ 
          color: 'red', 
          fontSize: '12px', 
          marginTop: '2px' 
        }}>
          {error}
        </div>
      )}
    </div>
  )
}
```

## Complete Editor Registration

```tsx
const gridEditors: Editors = {
  'text-editor': Editor(TextEditor),
  'select-editor': Editor(SelectEditor),
  'number-editor': Editor(NumberEditor),
  'date-editor': Editor(DateEditor),
  'checkbox-editor': Editor(CheckboxEditor),
  'textarea-editor': Editor(TextareaEditor),
  'tags-editor': Editor(TagsEditor),
  'validated-editor': Editor(ValidatedEditor),
}

const columns = [
  { 
    prop: 'name', 
    name: 'Name', 
    editor: 'text-editor' 
  },
  { 
    prop: 'status', 
    name: 'Status', 
    editor: 'select-editor' 
  },
  { 
    prop: 'count', 
    name: 'Count', 
    editor: 'number-editor' 
  },
  { 
    prop: 'date', 
    name: 'Date', 
    editor: 'date-editor' 
  },
  { 
    prop: 'active', 
    name: 'Active', 
    editor: 'checkbox-editor' 
  },
  { 
    prop: 'description', 
    name: 'Description', 
    editor: 'textarea-editor' 
  },
]

function App() {
  const [source] = useState([
    { 
      name: 'Item 1', 
      status: 'active', 
      count: 10,
      date: '2024-01-01',
      active: true,
      description: 'Sample description'
    },
  ])

  return (
    <RevoGrid 
      columns={columns} 
      source={source} 
      editors={gridEditors} 
    />
  )
}
```

## Best Practices

1. **Auto-focus**: Use `autoFocus` or programmatic focus for better UX
2. **Keyboard Navigation**: Handle Enter (save) and Escape (cancel) keys
3. **Auto-save**: Consider auto-saving on blur or selection change
4. **Validation**: Implement validation with clear error messages
5. **Sizing**: Consider editor size relative to cell size
6. **Performance**: Use React.memo for complex editors
7. **Accessibility**: Include proper ARIA labels and keyboard support

## Integration with Column Types

You can combine custom editors with column types:

```tsx
import SelectTypePlugin from '@revolist/revogrid-column-select'

const columnTypes = {
  select: new SelectTypePlugin()
}

const columns = [
  {
    prop: 'category',
    name: 'Category',
    columnType: 'select',     // Built-in select type
    editor: 'select-editor',  // Custom select editor
    // Select configuration
    source: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
    ],
    labelKey: 'label',
    valueKey: 'value'
  }
]
```

## Related Guides

- [Cell Templates](./revogrid-cell-templates.md) - Custom cell rendering
- [Column Configuration](./revogrid-column-config.md) - Column setup
- [Event Handling](./revogrid-events.md) - Grid events and callbacks
