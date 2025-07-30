# RevoGrid React Setup Guide

## Installation

Install RevoGrid for React using your preferred package manager:

```bash
# npm
npm i @revolist/react-datagrid

# pnpm  
pnpm add @revolist/react-datagrid

# yarn
yarn add @revolist/react-datagrid

# bun
bun add @revolist/react-datagrid
```

## Basic Setup

RevoGrid is designed for high performance with large datasets through virtualization of both rows and columns. It only renders the visible portion of the grid.

```tsx
// App.tsx
import { RevoGrid } from '@revolist/react-datagrid'
import { useState } from 'react'

/**
 * IMPORTANT: columns & source need a "stable" reference 
 * to prevent infinite re-renders
 */
const columns = [
  {
    prop: 'name',
    name: 'First',
  },
  {
    prop: 'details', 
    name: 'Second',
  },
]

function App() {
  const [source] = useState([
    {
      name: '1',
      details: 'Item 1',
    },
    {
      name: '2',
      details: 'Item 2',
    },
  ])

  return (
    <>
      <RevoGrid columns={columns} source={source} />
    </>
  )
}

export default App
```

## Key Concepts

- **Data Grid (`<revo-grid />`)**: The main component displaying data in tabular format
- **Columns**: Define the structure - each represents a data field with properties like header name, data type, and custom renderers
- **Rows**: Individual records of data within the grid
- **Cells**: Individual units where rows and columns intersect
- **Data Model**: Schema defining the structure of data to be displayed
- **Viewports**: Main sections displaying data based on current scroll position

## Performance Tips

1. **Stable References**: Always use stable references for `columns` and `source` props to prevent infinite re-renders
2. **Virtualization**: RevoGrid automatically handles virtualization - only visible cells are rendered
3. **Large Datasets**: Can handle millions of cells efficiently through intelligent virtual DOM and smart row recombination

## Next Steps

- [Column Configuration](./revogrid-column-config.md) - Learn how to configure columns
- [Cell Templates](./revogrid-cell-templates.md) - Create custom cell renderers  
- [Custom Editors](./revogrid-custom-editors.md) - Build interactive cell editors
- [Styling and Themes](./revogrid-styling.md) - Customize appearance
