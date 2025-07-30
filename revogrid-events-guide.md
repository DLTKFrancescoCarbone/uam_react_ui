# RevoGrid Events and Callbacks Guide

## Overview

RevoGrid provides a comprehensive event system that allows you to respond to user interactions and grid changes. All event names are lowercase and follow modern naming conventions.

## Basic Event Handling

```tsx
import { RevoGrid } from '@revolist/react-datagrid'
import { useState } from 'react'

function App() {
  const [source, setSource] = useState([
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
  ])

  const handleCellClick = (event: any) => {
    console.log('Cell clicked:', event.detail)
  }

  const handleAfterEdit = (event: any) => {
    console.log('Cell edited:', event.detail)
    // Update your data source
    const { rowIndex, prop, val } = event.detail
    setSource(prev => prev.map((row, index) => 
      index === rowIndex ? { ...row, [prop]: val } : row
    ))
  }

  return (
    <RevoGrid
      columns={columns}
      source={source}
      onCellclick={handleCellClick}
      onAftereditApply={handleAfterEdit}
    />
  )
}
```

## Grid Events

### Cell Events

```tsx
function GridWithCellEvents() {
  const handleCellEvents = {
    // Cell selection
    onCellclick: (event: any) => {
      const { rowIndex, colIndex, prop, model } = event.detail
      console.log(`Cell clicked: Row ${rowIndex}, Col ${colIndex}`, model[prop])
    },
    
    onCelldblclick: (event: any) => {
      console.log('Cell double-clicked:', event.detail)
    },
    
    // Cell editing
    onBeforeedit: (event: any) => {
      const { rowIndex, prop, model } = event.detail
      console.log('About to edit:', model[prop])
      
      // Prevent editing for certain conditions
      if (model.readonly) {
        event.preventDefault()
        return false
      }
    },
    
    onAfteredit: (event: any) => {
      const { rowIndex, prop, val, oldVal } = event.detail
      console.log(`Cell edited: ${oldVal} -> ${val}`)
    },
    
    onAftereditApply: (event: any) => {
      // This fires after the edit is applied to the grid
      const { rowIndex, prop, val } = event.detail
      console.log('Edit applied:', { rowIndex, prop, val })
    }
  }

  return (
    <RevoGrid
      columns={columns}
      source={source}
      {...handleCellEvents}
    />
  )
}
```

### Row Events

```tsx
function GridWithRowEvents() {
  const handleRowEvents = {
    // Row selection
    onRowclick: (event: any) => {
      const { rowIndex, model } = event.detail
      console.log('Row clicked:', rowIndex, model)
    },
    
    onRowdblclick: (event: any) => {
      console.log('Row double-clicked:', event.detail)
    },
    
    // Row operations
    onBeforerowupdate: (event: any) => {
      const { rowIndex, model } = event.detail
      console.log('Before row update:', model)
      
      // Validate before update
      if (!model.name) {
        event.preventDefault()
        alert('Name is required')
        return false
      }
    },
    
    onRowupdated: (event: any) => {
      console.log('Row updated:', event.detail)
    }
  }

  return (
    <RevoGrid
      columns={columns}
      source={source}
      {...handleRowEvents}
    />
  )
}
```

### Column Events

```tsx
function GridWithColumnEvents() {
  const handleColumnEvents = {
    // Column sorting
    onBeforesortingapply: (event: any) => {
      const { column, order } = event.detail
      console.log(`Sorting ${column} in ${order} order`)
    },
    
    onAftersortingapply: (event: any) => {
      console.log('Sorting applied:', event.detail)
    },
    
    // Column resizing
    onBeforecolumnresize: (event: any) => {
      const { column, newSize } = event.detail
      console.log(`Resizing column ${column} to ${newSize}px`)
      
      // Prevent resize if too small
      if (newSize < 50) {
        event.preventDefault()
        return false
      }
    },
    
    onAftercolumnresize: (event: any) => {
      console.log('Column resized:', event.detail)
    }
  }

  return (
    <RevoGrid
      columns={columns}
      source={source}
      {...handleColumnEvents}
    />
  )
}
```

### Focus and Selection Events

```tsx
function GridWithFocusEvents() {
  const [selectedCells, setSelectedCells] = useState([])
  
  const handleFocusEvents = {
    onFocusChanged: (event: any) => {
      const { rowIndex, colIndex } = event.detail
      console.log(`Focus changed to: Row ${rowIndex}, Col ${colIndex}`)
    },
    
    onSelectionChanged: (event: any) => {
      const { selection } = event.detail
      setSelectedCells(selection)
      console.log('Selection changed:', selection)
    },
    
    onRangeChanged: (event: any) => {
      console.log('Range selection changed:', event.detail)
    }
  }

  return (
    <div>
      <div>Selected cells: {selectedCells.length}</div>
      <RevoGrid
        columns={columns}
        source={source}
        {...handleFocusEvents}
      />
    </div>
  )
}
```

## Data Events

### Source Data Changes

```tsx
function GridWithDataEvents() {
  const [source, setSource] = useState(initialData)
  
  const handleDataEvents = {
    onBeforesourceset: (event: any) => {
      console.log('Before source set:', event.detail)
    },
    
    onAftersourceset: (event: any) => {
      console.log('After source set:', event.detail)
    },
    
    onBeforerowsupdate: (event: any) => {
      console.log('Before rows update:', event.detail)
    },
    
    onAfterrowsupdate: (event: any) => {
      console.log('After rows update:', event.detail)
    }
  }

  const addRow = () => {
    const newRow = { 
      id: Date.now(), 
      name: 'New User', 
      age: 25 
    }
    setSource(prev => [...prev, newRow])
  }

  const removeRow = (index: number) => {
    setSource(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      <button onClick={addRow}>Add Row</button>
      <RevoGrid
        columns={columns}
        source={source}
        {...handleDataEvents}
      />
    </div>
  )
}
```

## Validation Events

```tsx
function GridWithValidation() {
  const handleValidation = {
    onBeforeedit: (event: any) => {
      const { prop, model } = event.detail
      
      // Custom validation logic
      if (prop === 'email' && !model.email?.includes('@')) {
        event.preventDefault()
        alert('Please enter a valid email address')
        return false
      }
      
      if (prop === 'age' && model.age < 0) {
        event.preventDefault()
        alert('Age cannot be negative')
        return false
      }
    },
    
    onAftereditApply: (event: any) => {
      const { rowIndex, prop, val } = event.detail
      
      // Additional validation after edit
      if (prop === 'name' && !val.trim()) {
        alert('Name cannot be empty')
        // Revert the change
        event.preventDefault()
        return false
      }
    }
  }

  return (
    <RevoGrid
      columns={columns}
      source={source}
      {...handleValidation}
    />
  )
}
```

## Context Menu Events

```tsx
function GridWithContextMenu() {
  const handleContextMenu = {
    onContextmenu: (event: any) => {
      // Prevent default browser context menu
      event.preventDefault()
      
      const { rowIndex, colIndex, model } = event.detail
      console.log('Context menu triggered:', { rowIndex, colIndex, model })
      
      // Show custom context menu
      showCustomContextMenu(event.clientX, event.clientY, model)
    }
  }

  const showCustomContextMenu = (x: number, y: number, data: any) => {
    // Implementation of custom context menu
    console.log('Show context menu at:', x, y, 'for data:', data)
  }

  return (
    <RevoGrid
      columns={columns}
      source={source}
      {...handleContextMenu}
    />
  )
}
```

##