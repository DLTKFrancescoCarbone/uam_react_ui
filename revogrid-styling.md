# RevoGrid Styling and Themes Guide

## Built-in Themes

RevoGrid comes with several built-in themes that you can apply to your grid:

### Excel-like Theme (Default)
```tsx
import { RevoGrid } from '@revolist/react-datagrid'
// Default theme - no additional imports needed

function App() {
  return <RevoGrid columns={columns} source={source} />
}
```

### Material Theme
```tsx
import { RevoGrid } from '@revolist/react-datagrid'
import '@revolist/revogrid/dist/material.css' // Material theme

function App() {
  return (
    <RevoGrid 
      columns={columns} 
      source={source} 
      theme="material" 
    />
  )
}
```

### Compact Theme
```tsx
import '@revolist/revogrid/dist/compact.css'

function App() {
  return (
    <RevoGrid 
      columns={columns} 
      source={source} 
      theme="compact" 
    />
  )
}
```

### Dark Theme
```tsx
import '@revolist/revogrid/dist/dark.css'

function App() {
  return (
    <RevoGrid 
      columns={columns} 
      source={source} 
      theme="dark" 
    />
  )
}
```

## Custom CSS Styling

### Grid Container Styling
```css
/* Style the entire grid container */
.my-grid {
  border: 2px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Grid wrapper */
.my-grid revo-grid {
  --grid-border-color: #007bff;
  --cell-padding: 8px;
  --header-background: #f8f9fa;
}
```

```tsx
function App() {
  return (
    <div className="my-grid">
      <RevoGrid columns={columns} source={source} />
    </div>
  )
}
```

### Header Styling
```css
/* Header styling */
revo-grid::part(header) {
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  font-weight: bold;
  border-bottom: 2px solid #007bff;
}

/* Individual header cells */
revo-grid::part(header-cell) {
  color: #495057;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Header cell hover */
revo-grid::part(header-cell):hover {
  background-color: rgba(0, 123, 255, 0.1);
}
```

### Cell Styling
```css
/* All cells */
revo-grid::part(cell) {
  padding: 8px;
  border-right: 1px solid #e9ecef;
}

/* Specific column styling */
revo-grid::part(cell)[data-col="name"] {
  font-weight: bold;
  color: #007bff;
}

/* Row striping */
revo-grid::part(row):nth-child(even) {
  background-color: #f8f9fa;
}

/* Selected cells */
revo-grid::part(cell):focus,
revo-grid::part(cell).selected {
  background-color: #007bff;
  color: white;
  outline: 2px solid #0056b3;
}
```

### Custom Column Classes
```tsx
const columns = [
  {
    prop: 'name',
    name: 'Name',
    columnClass: 'name-column', // Custom CSS class
  },
  {
    prop: 'price',
    name: 'Price',
    columnClass: 'price-column',
  },
]
```

```css
/* Column-specific styling */
.name-column {
  background-color: #e3f2fd !important;
  font-weight: bold;
}

.price-column {
  text-align: right;
  font-family: monospace;
  color: #28a745;
}
```

### Cell Properties for Dynamic Styling
```tsx
const columns = [
  {
    prop: 'status',
    name: 'Status',
    cellProperties: (model, prop) => {
      const status = model[prop]
      return {
        class: `status-${status}`,
        style: {
          color: status === 'active' ? 'green' : 'red',
          fontWeight: 'bold'
        }
      }
    }
  }
]
```

```css
.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
}
```

### Responsive Design
```css
/* Responsive grid */
.responsive-grid {
  width: 100%;
  max-width: 100vw;
  overflow-x: auto;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  revo-grid::part(cell) {
    font-size: 12px;
    padding: 4px;
  }
  
  revo-grid::part(header-cell) {
    font-size: 11px;
    padding: 4px;
  }
}

/* Tablet adjustments */
@media (max-width: 1024px) {
  revo-grid {
    --cell-padding: 6px;
  }
}
```

## CSS Custom Properties (Variables)

RevoGrid supports CSS custom properties for easy theming:

```css
revo-grid {
  /* Colors */
  --grid-border-color: #dee2e6;
  --header-background: #f8f9fa;
  --header-text-color: #495057;
  --cell-background: #ffffff;
  --cell-text-color: #212529;
  --selected-background: #007bff;
  --selected-text-color: #ffffff;
  
  /* Spacing */
  --cell-padding: 8px;
  --header-padding: 12px;
  --row-height: 40px;
  --header-height: 45px;
  
  /* Borders */
  --border-width: 1px;
  --border-style: solid;
  
  /* Fonts */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size: 14px;
  --header-font-weight: 600;
  
  /* Shadows */
  --grid-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --cell-focus-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
```

## Dark Mode Implementation

```css
/* Dark theme variables */
[data-theme="dark"] revo-grid,
.dark-theme revo-grid {
  --grid-border-color: #495057;
  --header-background: #343a40;
  --header-text-color: #ffffff;
  --cell-background: #212529; 
  --cell-text-color: #ffffff;
  --selected-background: #0d6efd;
  --selected-text-color: #ffffff;
  
  /* Dark specific borders */
  --border-color: #495057;
}

/* Dark mode grid container */
[data-theme="dark"] .grid-container {
  background-color: #212529;
  color: #ffffff;
}
```

```tsx
function App() {
  const [darkMode, setDarkMode] = useState(false)
  
  return (
    <div data-theme={darkMode ? 'dark' : 'light'}>
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle Dark Mode
      </button>
      <RevoGrid columns={columns} source={source} />
    </div>
  )
}
```

## Custom Theme Creation

Create a complete custom theme:

```css
/* Custom theme: Ocean */
.ocean-theme revo-grid {
  /* Ocean color palette */
  --primary-color: #006d77;
  --secondary-color: #83c5be;
  --accent-color: #ffd60a;
  --background-color: #ffffff;
  --text-color: #2d3748;
  
  /* Apply colors */
  --grid-border-color: var(--primary-color);
  --header-background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  --header-text-color: #ffffff;
  --cell-background: var(--background-color);
  --cell-text-color: var(--text-color);
  --selected-background: var(--accent-color);
  --selected-text-color: #000000;
  
  /* Custom styling */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 109, 119, 0.15);
}

/* Ocean theme header cells */
.ocean-theme revo-grid::part(header-cell) {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

/* Ocean theme hover effects */
.ocean-theme revo-grid::part(cell):hover {
  background-color: rgba(131, 197, 190, 0.1);
  transition: background-color 0.2s ease;
}
```

## Styling Cell Templates

When using custom cell templates, you can apply styles directly:

```tsx
const StyledCell = ({ value, model }: CellProps) => {
  return (
    <div 
      style={{
        padding: '8px',
        background: model.priority === 'high' 
          ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)' 
          : 'transparent',
        color: model.priority === 'high' ? 'white' : 'inherit',
        borderRadius: '4px',
        fontWeight: model.priority === 'high' ? 'bold' : 'normal'
      }}
    >
      {value}
    </div>
  )
}
```

## Performance Considerations

### Efficient CSS Selectors
```css
/* Good - specific and efficient */
revo-grid::part(cell) { }
revo-grid::part(header-cell) { }

/* Avoid - too broad */
revo-grid * { }
```

### CSS-in-JS Alternative
```tsx
import styled from 'styled-components'

const StyledGrid = styled.div`
  revo-grid {
    --grid-border-color: ${props => props.theme.borderColor};
    --header-background: ${props => props.theme.headerBg};
    border-radius: 8px;
    box-shadow: ${props => props.theme.shadow};
  }
`

function App() {
  return (
    <StyledGrid>
      <RevoGrid columns={columns} source={source} />
    </StyledGrid>
  )
}
```

## Accessibility Styling

Ensure your styling maintains accessibility:

```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  revo-grid {
    --grid-border-color: #000000;
    --cell-text-color: #000000;
    --selected-background: #000000;
    --selected-text-color: #ffffff;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  revo-grid::part(cell) {
    transition: none;
  }
}

/* Focus indicators */
revo-grid::part(cell):focus-visible {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}
```

## Print Styles

```css
/* Print-friendly styling */
@media print {
  revo-grid {
    --grid-border-color: #000000;
    --cell-background: #ffffff;
    --cell-text-color: #000000;
    --header-background: #f0f0f0;
    box-shadow: none;
  }
  
  revo-grid::part(cell) {
    border: 1px solid #000000;
    padding: 4px;
  }
}
```

## Best Practices

1. **Use CSS Custom Properties**: Easier to maintain and update themes
2. **Leverage CSS Parts**: Use `::part()` pseudo-element for specific styling
3. **Responsive Design**: Ensure grid works on all screen sizes
4. **Performance**: Avoid complex selectors and animations on large datasets
5. **Accessibility**: Maintain proper contrast and focus indicators
6. **Testing**: Test themes in different browsers and devices
7. **Consistency**: Keep styling consistent with your application's design system

## Related Guides

- [Cell Templates](./revogrid-cell-templates.md) - Custom cell rendering with styles
- [Column Configuration](./revogrid-column-config.md) - Column-specific styling
- [Custom Editors](./revogrid-custom-editors.md) - Editor styling
