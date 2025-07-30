RevoGrid Features Documentation
This document compiles details and code examples for various features in RevoGrid, extracted from its official documentation.

Column Definitions
Columns in RevoGrid are vertical lines that categorize and display data. They are defined using an array of ColumnRegular objects, each specifying a prop (data property) and a name (display name). Columns can also have an initial size defined for their width.

Details:

Columns are defined as an array of objects, typically ColumnRegular.

Each object requires a prop (the corresponding data field) and a name (the header text).

The size property can be used to set a fixed width in pixels.

Code Example:

const columns: ColumnRegular[] = [
  { prop: 'id', name: 'ID' },
  { prop: 'name', name: 'Name' },
  { prop: 'age', name: 'Age' },
  { prop: 'email', name: 'Email' },
];

// Example with defined sizes:
const columnsWithSizes = [
  { prop: 'id', name: 'ID', size: 100 }, // Column width is set to 100px
  { prop: 'name', name: 'Name', size: 150 }, // Column width is set to 150px
  { prop: 'age', name: 'Age', size: 80 }, // Column width is set to 80px
];

Column Resizing
RevoGrid allows users to resize columns by dragging their separators. This feature is enabled by setting a grid property, and individual columns can have predefined widths.

Details:

Column resizing is enabled by setting the resize property of the revo-grid element to true.

Individual column widths can be set using the size property in the column definition.

minSize and maxSize properties can also be defined for a column.

Ensure that any minimal size set is not smaller than the total sum of side padding.

Code Example:

// Programmatically enable resizing
const grid = div.querySelector('revo-grid');
grid.resize = true;

// Predefine column width in TypeScript JSX
const columns = [{ name: 'Name', prop: 'name', size: 500 }];
// In your render method or JSX:
// <revo-grid columns={columns}/>

Column Autosize
Column Autosize automatically adjusts column widths based on content, particularly text. This feature can be configured for basic Excel-like behavior or with an advanced configuration object.

Details:

Enabled by setting the autoSizeColumn grid property.

Excel-like option: Set autoSizeColumn to true. Columns with autoSize: true in their definition can be recalculated on a column header separator double-click.

Advance usage with config object: autoSizeColumn can be an object with parameters like mode, allColumns, letterBlockSize, and preciseSize.

ColumnAutoSizeMode enum defines modes: headerClickAutosize, autoSizeOnTextOverlap, autoSizeAll.

Currently, AutoSize is in Beta mode and only text autosize is supported. Mapped values and custom renders are not supported.

Code Example:

// Excel-like option
const columns = [{ prop: 'myField', autoSize: true }];
const rows = [{ 'myField': 'my long-long field' }];
const grid = document.querySelector('revo-grid');
grid.autoSizeColumn = true;
grid.source = rows;
grid.columns = columns;

// Advance usage with config object
// grid.autoSizeColumn = { mode: 'autoSizeOnTextOverlap' }; // Example configuration

Column Header Template
The Column Header Template feature allows using a custom function to render HTML content within a column header. This provides extensive customization capabilities for header appearance.

Details:

Uses the columnTemplate property within a column definition.

columnTemplate accepts a function with createElement (for creating VNodes), props (of type ColumnTemplateProp), and optional additionalData.

It is crucial to escape any HTML code to prevent XSS attacks.

Code Example:

const columns: ColumnRegular[] = [
  {
    name: 'Person name',
    prop: 'name',
    // use this to return custom html per column
    columnTemplate: (
      createElement: HyperFunc<VNode>,
      props: ColumnTemplateProp,
      additionalData?: any
    ) => {
      return createElement(
        'span',
        {
          style: {
            color: 'red',
          },
        },
        props.column.name // Accessing column name from props
      )
    },
  },
]

Column Header Properties
Custom properties for column headers can be applied to influence their behavior and presentation, including styling and class assignments.

Details:

Custom header properties are defined within the columnProperties attribute of a ColumnRegular object.

columnProperties expects a function that returns an object of CellProps.

This returned object can contain CSS style properties and CSS class names.

Code Example:

const columns: ColumnRegular[] = [{
  name: 'Person name',
  prop: 'name',
  // apply this for custom properties
  columnProperties: ({ prop }: ColumnRegular): CellProps => {
    return {
      style: {
        color: 'red',
      },
      class: {
        bank: true,
      },
    }
  },
}]

Column Readonly
The "Column Readonly" feature provides control over cell editability, allowing you to make an entire column or specific cells within it non-editable.

Details:

The readonly property in a column definition can be a boolean or a function.

Setting readonly: true makes the entire column read-only.

Providing a function allows for conditional read-only behavior based on cell data. The function receives params (including model) and should return a boolean.

Code Example:

// Entire column read-only
const columnsFullReadonly = [
  { prop: 'name', name: 'Name', readonly: true }, // This column is read-only
  { prop: 'age', name: 'Age' },
];

// Conditional read-only
const columnsConditionalReadonly = [
  {
    prop: 'name',
    name: 'Name',
    readonly: (params) => {
      // Make the cell read-only if the name is 'John'
      return params.model.name === 'John';
    },
  },
  { prop: 'age', name: 'Age' },
];

// Usage in RevoGrid:
// <revo-grid source={data} columns={columnsFullReadonly}></revo-grid>
// <revo-grid source={data} columns={columnsConditionalReadonly}></revo-grid>

Column Ordering
The Column Ordering plugin allows users to reorder columns using drag-and-drop. It provides events to manage the drag operation and prevent movement of specific columns.

Details:

Enabled by setting the grid's canMoveColumns property to true.

Events available: columndragstart (triggered at drag start, allows e.preventDefault() to stop movement), columndragmousemove, beforecolumndragend, columndragend.

Code Example:

import { defineCustomElement } from '@revolist/revogrid/standalone';
defineCustomElement();

const columns = [
  { name: 'ID', prop: 'id' },
  { name: 'Name', prop: 'name' },
  { name: 'Price', prop: 'price' }
];

const grid = document.querySelector('revo-grid');
if (grid) {
  grid.source = [
    { id: 1, name: 'Apple', price: 1.2 },
    { id: 2, name: 'Banana', price: 0.5 },
    { id: 3, name: 'Cherry', price: 2.0 }
  ];
  grid.columns = columns;

  // Enable column movement
  grid.canMoveColumns = true;

  // Event listener to prevent certain columns from being moved
  grid.addEventListener('columndragstart', (e) => {
    const { detail } = e;
    if (detail.data.prop === 'id') {
      e.preventDefault(); // Prevent moving the 'ID' column
    }
  });

  // Optional: Handle column drag end
  grid.addEventListener('columndragend', (e) => {
    console.log('Column drag ended:', e.detail);
  });
}

Column Pinning
Column Pinning fixes columns to either the start (left) or end (right) of the grid, ensuring they remain visible during horizontal scrolling.

Details:

Implemented by setting the pin property within the column definition.

Values for pin:

'colPinStart': Pins the column to the beginning (left).

'colPinEnd': Pins the column to the end (right).

Pinning introduces virtual indexes to the grid.

Code Example:

const columns = [
  { name: 'First Name', prop: 'firstName', },
  { name: 'Status', prop: 'status', pin: 'colPinStart', },
  { name: 'Age', prop: 'age', pin: 'colPinEnd', },
];

Column Groups
Column Grouping, or stacked columns, allows organizing columns under a shared header for improved data management and visual clarity. Groups can be nested.

Details:

A column group is defined as a ColumnGrouping object.

A group has a name and a children array, which can contain ColumnGrouping or ColumnRegular objects.

This allows for nested column hierarchies.

Code Example:

const columns: (ColumnGrouping | ColumnRegular)[] = [
  // Stacked column group
  {
    name: 'Personal',
    children: [
      {
        name: 'Full Name',
        children: [
          { name: 'First Name', prop: 'firstName', size: 200 }, // Regular column within the group
          { name: 'Last Name', prop: 'lastName', size: 200 }, // Regular column within the group
        ],
      },
      { name: 'Info', children: [{ name: 'Age', prop: 'age' }], // Regular column
      },
    ],
  },
]

Custom Columns
Custom Columns, often referred to as "Column Formats" or custom cell types, allow you to define how data is rendered within cells of a specific column beyond standard types.

Details:

The documentation refers to custom column rendering and formatting through the concept of "Column Types".

This often involves defining a cellTemplate or cellFormatter function within the column definition to return custom HTML or formatted values based on the cell's data.

Note: The specific documentation page found for "Custom Columns" was general (https://rv-grid.com/guide/column/types) and did not contain a direct code example of defining a new custom column type but rather discussed "Column Formats". The general approach for custom rendering is typically through cellTemplate or similar properties on the column definition, allowing you to provide a function that generates the cell's content.

Conceptual Code Example for Custom Cell Rendering (based on common grid patterns):

// This is a conceptual example for a custom cell renderer,
// as the documentation for 'column/types' was less specific on direct 'custom columns'.
const columns: ColumnRegular[] = [
  {
    prop: 'status',
    name: 'Status',
    // Example: custom cell template to render a colored status indicator
    cellTemplate: (
      createElement: HyperFunc<VNode>,
      props: CellTemplateProp,
      additionalData?: any
    ) => {
      const status = props.model[props.prop];
      let color = 'black';
      if (status === 'active') {
        color = 'green';
      } else if (status === 'inactive') {
        color = 'red';
      }
      return createElement(
        'span',
        { style: { color: color } },
        status
      );
    },
  },
  { prop: 'value', name: 'Value' }
];

Column Stretching
Column Stretching automatically expands the last column, or other specified columns, to fill any remaining horizontal space in the grid. This ensures no empty space appears at the end of the grid.

Details:

Enabled by setting the stretch attribute to "true" on the <revo-grid> element.

When enabled, the last column typically adjusts its width to fill unused space.

Improves aesthetics, provides responsive design, and is simple to implement.

Code Example:

<revo-grid stretch="true"></revo-grid>

Cell Definitions
In RevoGrid, a cell is the intersection point of a row and a column, responsible for displaying and editing data. Cells can be highly customized with custom renderers and editors, which are closely tied to the column properties. You can use templates to modify a cell's appearance or behavior.

Details:

A cell is a fundamental unit for data display and interaction.

Customization options include:

Cell Properties: Adding various properties, including tags, styles, classes, and events (like onClick). These can be dynamically assigned based on cell data using the cellProperties function.

Cell Templates: Customizing the HTML content displayed within a cell.

Cell Editors: Defining custom components for data input when a cell is in edit mode.

Code Example for Cell Properties:

const columns = [{
  name: 'Person Name',
  prop: 'name',
  // Apply custom properties
  cellProperties: ({prop, model, data, column}) => {
    return {
      // Custom styles
      style: {
        color: model[prop] === 'John Doe' ? 'red' : 'black'
      },
      // Custom classes
      class: {
        'bank': data.isBankCustomer,
        'vip': data.isVIP
      },
      // Custom events
      onClick: (event) => {
        console.log(`Cell clicked: ${model[prop]}`);
      },
      // Custom attributes (tags)
      attributes: {
        'data-tooltip': model[prop]
      }
    };
  },
}];

const items = [
  { name: 'John Doe', isBankCustomer: true, isVIP: false },
  { name: 'Jane Smith', isBankCustomer: false, isVIP: true },
];

Cell Readonly
The readonly property in RevoGrid can be applied at the cell level to control editability, similar to how it's used for columns. This allows for fine-grained control over which cells can be edited.

Details:

The readonly property can be set as a boolean value or as a function that returns a boolean.

When readonly: true is set on a column, all cells in that column become read-only.

When readonly is a function, it receives params (which includes model) and can conditionally make a cell read-only based on its data.

Code Example (from Column Readonly, applicable to cells):

// Entire column read-only (all cells in 'name' column are read-only)
const columnsFullReadonly = [
  { prop: 'name', name: 'Name', readonly: true },
  { prop: 'age', name: 'Age' },
];

// Conditional read-only (cells in 'name' column are read-only if name is 'John')
const columnsConditionalReadonly = [
  {
    prop: 'name',
    name: 'Name',
    readonly: (params) => {
      return params.model.name === 'John';
    },
  },
  { prop: 'age', name: 'Age' },
];

// Usage with RevoGrid:
// <revo-grid source={data} columns={columnsFullReadonly}></revo-grid>
// <revo-grid source={data} columns={columnsConditionalReadonly}></revo-grid>

Cell Template
The Cell Template feature allows you to customize the HTML content displayed within individual cells, enabling the rendering of complex or interactive UI elements.

Details:

RevoGrid provides a way to render native components inside of cells.

Customization is achieved by defining a cellTemplate function within the column definition.

The cellTemplate function receives createElement (a HyperFunc for creating VNodes), props (of type CellTemplateProp), and optional additionalData.

Benefits include embedding components (buttons, images, input fields), dynamic content based on data, and enhanced interactivity.

Code Example (Conceptual, adapted from Vue example but showing general principle):

const columns = [
  {
    prop: 'status',
    name: 'Status',
    // Example: custom cell template to render a colored status indicator
    cellTemplate: (
      createElement: HyperFunc<VNode>,
      props: CellTemplateProp,
      additionalData?: any
    ) => {
      const status = props.model[props.prop];
      let color = 'black';
      if (status === 'active') {
        color = 'green';
      } else if (status === 'inactive') {
        color = 'red';
      }
      return createElement(
        'span',
        { style: { color: color } },
        status
      );
    },
  },
  { prop: 'value', name: 'Value' }
];

Cell Editor
RevoGrid provides the capability to define custom editors for cells, allowing for tailored data input experiences beyond the default text editor.

Details:

You can define your own editor classes or functions.

An editor must have a render method that returns the custom component structure.

Editors can be defined as a class or a function.

Key methods for an editor include constructor (receives dataSchema, saveCallback, closeCallback), componentDidRender() (optional, called after render), disconnectedCallback() (optional, called after destroy), getValue() (required, retrieves current value), and beforeAutoSave() (optional, allows preventing auto-save).

Editors are registered with the grid using the grid.editors property, mapping an editor name to the editor component.

The editor property in a column definition then references the registered editor by its name.

Code Example (Class Format Editor):

// Define a custom TextEditor class
class TextEditor {
  public element: Element | null = null;
  public editCell: Edition.EditCell | null = null;

  constructor(
    public dataSchema: ColumnDataSchemaModel,
    saveCallback: (value: any) => void,
    closeCallback: () => void
  ) {
    // Constructor logic, typically setting up the editor element
    this.element = document.createElement('input');
    this.element.type = 'text';
    this.element.value = dataSchema.model[dataSchema.prop]; // Initial value
    this.element.addEventListener('blur', () => saveCallback(this.getValue()));
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveCallback(this.getValue());
      } else if (e.key === 'Escape') {
        closeCallback();
      }
    });
  }

  // Required: returns the current value of the editor
  getValue(): any {
    return (this.element as HTMLInputElement).value;
  }

  // Optional: called after editor rendered
  componentDidRender() {
    this.element?.focus();
  }

  // Optional: called after editor destroyed
  disconnectedCallback() {
    // Cleanup if necessary
  }
}

// Define columns, specifying the custom editor by name
const columns = [{
  name: 'Person',
  prop: 'name',
  editor: 'myTextEditor', // Reference the custom editor by name
}];

const grid = document.querySelector('revo-grid');
if (grid) {
  // Register the custom editor with the grid
  grid.editors = {
    'myTextEditor': TextEditor, // Map the name to the editor class
  };
  grid.columns = columns;
  // ... set grid.source and other properties
}

Code Example (Function Format Editor):

// Define a custom TextEditor as a function
function TextEditorFunction(dataSchema, saveCallback, closeCallback) {
  const element = document.createElement('input');
  element.type = 'text';
  element.value = dataSchema.model[dataSchema.prop];

  element.addEventListener('blur', () => saveCallback(element.value));
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveCallback(element.value);
    } else if (e.key === 'Escape') {
      closeCallback();
    }
  });

  return {
    element: element,
    // Optional lifecycle methods
    componentDidRender: () => element.focus(),
    getValue: () => element.value,
  };
}

// Apply editor to grid (similar to class format)
const columns = [{
  name: 'Person',
  prop: 'name',
  editor: 'myFunctionEditor',
}];

const grid = document.querySelector('revo-grid');
if (grid) {
  grid.editors = {
    'myFunctionEditor': TextEditorFunction,
  };
  grid.columns = columns;
  // ... set grid.source and other properties
}

Accessibility
RevoGrid is committed to making data grids accessible by following international accessibility standards like WCAG (Web Content Accessibility Guidelines) and WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Applications). It supports keyboard navigation, screen readers, and ensures interactive elements are easy to use for people with disabilities.

Details:

Adheres to WCAG 2.1 Level AA, ADA, and Section 508.

Keyboard Navigation:

Tab Sequence Management: Only relevant focusable elements are in the tab sequence.

Arrow Keys: Navigate between cells.

Ctrl/CMD + A: Select all cells.

Enter/Escape: Select/edit cell or exit edit mode.

Ctrl/CMD + C/V: Copy and paste cells.

Customizing Accessibility: Grid events allow developers to intercept and modify behavior for accessibility needs (e.g., auto-focus on the next row).

Density and Accessibility: Themes offer options to adjust row and column density for readability (Standard, Compact, Material).

Code Example (Setting Density):

// Example of setting grid density programmatically
const grid = document.querySelector('revo-grid');
// Set to a specific row height, e.g., for standard density (27px), compact (32px), or material (42px)
grid.rowSize = 32; // Example for compact theme density

RTL (Right-to-Left) Support
RevoGrid provides comprehensive support for Right-to-Left (RTL) languages and layouts, suitable for applications targeting users of languages like Arabic, Hebrew, and Persian. This is implemented via a dedicated plugin.

Details:

Automatically handles column reordering, text alignment, and layout adjustments.

Enabled by setting the rtl property to true on the revo-grid component.

Can be toggled dynamically, and rtlstatechanged events are emitted.

Automatically applies RTL-specific styles, and custom CSS can be added using revo-grid[rtl] selectors.

When using custom cell renderers, ensure they respect RTL layout by conditionally setting textAlign and direction.

Code Example (Enabling RTL):

<revo-grid rtl></revo-grid>

Code Example (Dynamic RTL Toggle):

// Toggle RTL mode
function toggleRTL() {
  const grid = document.querySelector('revo-grid');
  grid.rtl = !grid.rtl;
}

// Listen for RTL state changes
grid.addEventListener('rtlstatechanged', (event) => {
  console.log('RTL state changed:', event.detail.rtl);
});

Code Example (RTL with Custom Cell Renderers):

const columns = [
  {
    prop: 'name',
    name: 'الاسم', // Example RTL name
    cellTemplate: (h, props) => {
      return h('div', {
        style: {
          textAlign: props.model.rtl ? 'right' : 'left',
          direction: props.model.rtl ? 'rtl' : 'ltr'
        }
      }, props.model[props.prop]);
    }
  }
];

Editing
RevoGrid offers robust built-in support for editing, enabling full-featured CRUD (Create, Read, Update, Delete) operations directly within the grid.

Details:

Users can create new rows, view existing data, update data in-place, and delete rows.

Editing can be enabled for specific columns by setting editable: true in their definition.

Events like beforeedit and afteredit allow interception and handling of edits.

The entire grid or specific columns can be set to read-only mode using the readonly attribute/property.

Code Example (Enabling Editing and Handling Events):

const grid = document.querySelector('revo-grid');

// Enable editing for specific columns
grid.columns = [
  { prop: 'id', name: 'ID', readonly: true },
  { prop: 'name', name: 'Name' },
  { prop: 'price', name: 'Price', editable: true }, // Make 'Price' column editable
];

// Set data source
grid.source = [
  { id: 1, name: 'Apple', price: 1.2 },
  { id: 2, name: 'Banana', price: 0.5 },
];

// Handle create, update, and delete operations via events
grid.addEventListener('beforeedit', (event) => {
  const { detail } = event;
  console.log('Before edit:', detail);
  // Example: Prevent editing for a specific condition
  // if (detail.prop === 'price' && detail.model.id === 1) {
  //   event.preventDefault();
  // }
});

grid.addEventListener('afteredit', (event) => {
  const { detail } = event;
  console.log('After edit:', detail);
  // Example: Update backend with new data
  // updateDataInDatabase(detail.prop, detail.val, detail.model.id);
});

Code Example (Setting Grid to Read-Only):

const grid = document.querySelector('revo-grid');
grid.readonly = true; // Makes the entire grid read-only

Export
RevoGrid allows you to export grid data to files, supporting CSV and Excel formats.

Details:

To enable export, set the exporting property on the revo-grid component to true.

The export functionality is provided by an export plugin.

Public methods available on the export plugin: exportFile(options) (downloads file), exportBlob(options) (exports Blob object), exportString(options) (gets data string).

FormatterOptions define general export options like mime, encoding, fileKind, columnDelimiter, rowDelimiter, and filename.

Code Example (Exporting to CSV):

// Enable exporting on the grid component
// <revo-grid exporting="true"/>

// Access export plugin and export file
const grid = document.querySelector('revo-grid');
grid.getPlugins().then(plugins => {
  plugins.forEach(p => {
    if (p.exportFile) {
      const exportPlugin = p;
      exportPlugin.exportFile({ filename: 'my_grid_data.csv' });
    }
  });
});

Filtering
RevoGrid supports a Filtering Plugin that allows users to filter grid data based on various criteria.

Details:

Enabled by setting the filter property on the revo-grid component to true.

Includes built-in string and number filter types (e.g., eq, contains, gt, lt).

Filtering can be disabled for specific columns.

Advanced filtering can be configured using ColumnFilterConfig to include specific filters or define custom filter functions.

Custom filter functions receive cellValue and extraValue and return a boolean.

Code Example (Basic Filtering):

// Enable filtering on the grid component
// <revo-grid source={source} columns={columns} filter={true}/>

// Example column definition for basic filtering
const columns = [{ prop: 'name' }];
const source = [{ name: 'Steve' }, { name: 'John' }];

Code Example (Disabling Filter for a Column):

const columns = [{ prop: 'name', filter: false }]; // Filter icon disabled for 'name' column
const source = [{ name: 'Steve' }];
// <revo-grid source={source} columns={columns} filter={true}/>

Code Example (Advanced Filtering with Custom Filter):

const columns = [{ prop: 'name', filter: 'myFilterType' }];
const source = [{ name: 'Steve' }];

const filterFunc = (cellValue, extraValue) => {
  if (!cellValue) {
    return false;
  }
  if (typeof cellValue !== 'string') {
    cellValue = JSON.stringify(cellValue);
  }
  return cellValue === 'A';
};
filterFunc.extra = 'input'; // If an extra input field is desired for @extraValue

const filterConfig = {
  include: ['newEqual'],
  customFilters: {
    'newEqual': {
      columnFilterType: 'myFilterType',
      name: 'Equal to A',
      func: filterFunc
    }
  }
};

// <revo-grid source={source} columns={columns} filter={filterConfig}/>

Plugins
RevoGrid's functionality is extended through a plugin-based architecture, allowing for modular and customizable features. Plugins enhance the core grid capabilities.

Details:

Many advanced features (like autosize, column move, export, grouping, sorting, stretch) are implemented as plugins.

Plugins can be added or removed at runtime.

The plugins property on the revo-grid element is used to register custom plugins.

Plugins can interact with grid events and data.

Code Example (General Plugin Registration - Conceptual):

// Example: Registering a custom plugin (replace CustomPlugin with an actual plugin)
import { ColumnStretchPlugin } from '@revolist/revogrid-pro'; // Example import for a known plugin

const grid = document.querySelector('revo-grid');
if (grid) {
  grid.plugins = [
    // new MyCustomPlugin(), // Your custom plugin instance
    ColumnStretchPlugin // An example of a built-in plugin
  ];
  // ... other grid configurations
}

Security
RevoGrid is designed with security in mind, aiming to meet application security requirements. It undergoes security vulnerability testing to ensure high standards.

Details:

Tested for various security vulnerabilities using SonarQube, evaluating against standards like CWE, SANS Top 25, and OWASP Top 10.

Applications using RevoGrid may need to pass security tests before production deployment.

Developers should be mindful of XSS (Cross-Site Scripting) when using custom templates (e.g., columnTemplate, cellTemplate) and ensure proper HTML escaping.

Note: The documentation primarily discusses security testing and compliance, rather than providing direct code examples for security implementation within the grid itself. The responsibility for secure coding practices, especially with custom content, lies with the developer.

Slots
RevoGrid utilizes StencilJS slots to allow developers to inject custom content into specific parts of the grid, providing flexibility for customizing appearance and functionality.

Details:

Data Slots: Add extra elements to the main data area of the grid. Format: data-{column-type}-{row-type} (e.g., data-rgCol-rgRow). These apply within the <revogr-data /> component.

Focus Slots: Add elements to the focus layer of the grid, indicating the currently focused cell or range. Format: focus-{column-type}-{row-type} (e.g., focus-rgCol-rgRow). These apply within the <revogr-focus /> component.

Code Example (Data Slot):

<revogr-grid>
    <div slot="data-rgCol-rgRow">Custom Content in Data Area</div>
</revogr-grid>

Code Example (Focus Slot):

<revogr-grid>
    <div slot="focus-rgCol-rgRow">Focused Content Element</div>
</revogr-grid>

Sorting
RevoGrid provides sorting capabilities, allowing users to sort data by clicking on column headers.

Details:

To enable sorting for a column, set its sortable property to true.

The order property can be used to set a default sorting order ('asc' for ascending, 'desc' for descending).

Custom sorting logic can be provided using the cellCompare method on the column definition.

Events are available to intercept sorting operations: beforeSorting, beforeSortingApply, beforeSourceSortingApply. These events allow preventing default sorting behavior and implementing custom logic.

Code Example (Basic Sorting):

const columns = [
  { name: 'Person name', prop: 'name', sortable: true, order: 'asc' }, // Sortable, default ascending
  { name: 'Age', prop: 'age', sortable: true } // Sortable, no default order
];

Standalone
RevoGrid components can be used as standalone components, particularly relevant in frameworks like Angular. This means they can be imported and utilized without requiring a containing module.

Details:

For Angular, RevoGrid can be imported and used directly in standalone components by adding it to the imports array of the @Component decorator.

This approach simplifies project structure and reduces bundle sizes.

Code Example (Angular Standalone Component):

// app.component.ts
import { Component } from "@angular/core";
import { RevoGrid } from "@revolist/angular-datagrid"; // Assuming this import path

@Component({
  selector: "app-root",
  standalone: true, // Mark component as standalone
  imports: [RevoGrid], // Import RevoGrid directly
  template: `<revo-grid style="height: 200px; width: 200px" [columns]="columns" [source]="source" ></revo-grid>`
})
export class AppComponent {
  source = [
    { name: "Item 1", details: "Details A" },
    { name: "Item 2", details: "Details B" },
  ];
  columns = [
    { prop: "name", name: "First Column" },
    { prop: "details", name: "Second Column" },
  ];
}

SSR (Server Side Rendering)
RevoGrid provides a hydrate app that enables server-side rendering (SSR) of its components, allowing them to be hydrated on a NodeJS server to generate static HTML and CSS.

Details:

The hydrate app from @revolist/revogrid/hydrate can be imported into server-side code.

This allows rendering RevoGrid components to static HTML, which can improve initial page load performance and SEO.

Requires pre-rendering content separately for each theme if multiple themes are supported.

Frameworks like SvelteKit might require disabling SSR for pages using RevoGrid or using client-side rendering (CSR) techniques for the grid itself due to its browser environment dependencies.

Code Example (NodeJS Hydration with Eleventy):

import hydrate from "@revolist/revogrid/hydrate"

eleventyConfig.addTransform("hydrate", async(content, outputPath) => {
  if (process.env.ELEVENTY_ENV == "production") {
    if (outputPath.endsWith(".html")) {
      try {
        const results = await hydrate.renderToString(content, {
          clientHydrateAnnotations: true,
          removeScripts: false,
          removeUnusedStyles: false
        })
        return results.html
      } catch (error) {
        return error
      }
    }
  }
  return content
})

Theme Manager
RevoGrid offers various built-in themes to control the visual appearance of the grid. Themes can be easily applied to change the look and feel.

Details:

Themes include:

Light themes: default (Excel-like), material, compact (material compact).

Dark themes: darkMaterial, darkCompact.

Themes are applied by setting the theme property on the revo-grid element.

Code Example (Applying a Theme):

const grid = document.querySelector('revo-grid');

// Apply the 'material' theme
grid.theme = 'material';

// Apply the 'darkCompact' theme
// grid.theme = 'darkCompact';

Row Definitions
Rows in RevoGrid represent individual data items from the source. RevoGrid offers extensive capabilities for managing rows, including customizing their appearance, handling complex data structures, and controlling visibility.

Details:

Row Class Binding: Dynamically apply CSS classes to individual rows based on data. This is done by defining a property in your data source (e.g., myRowClass) and binding it using the rowClass attribute on the <revo-grid> component (e.g., rowClass="myRowClass").

Handling Complex Row Data: RevoGrid can manage rows with nested data, custom templates, or dynamic content.

Managing Row Visibility (Trimmed Rows): The trimmedRows feature allows selectively hiding rows from the main dataset using physical rgRow indexes. This is useful for large datasets to enhance performance and usability.

Code Example (Row Class Binding):

// In your CSS:
/*
.blue { background-color: lightblue; }
.green { background-color: lightgreen; }
*/

const columns = [
  { prop: 'name', name: 'Name' },
  { prop: 'status', name: 'Status' }
];

const items = [
  { name: 'John Doe', status: 'active', myRowClass: 'blue' },
  { name: 'Jane Smith', status: 'inactive', myRowClass: 'green' },
  { name: 'Peter Jones', status: 'active', myRowClass: 'blue' }
];

// In your HTML or JavaScript:
// <revo-grid rowClass="myRowClass" source={items} columns={columns}></revo-grid>

Code Example (Managing Row Visibility - Trimmed Rows):

const grid = document.querySelector('revo-grid');

// Define row indexes to hide
grid.trimmedRows = {
  0: true, // Hide row at index 0
  2: true  // Hide row at index 2
};

// You can dynamically update this:
// grid.trimmedRows = {}; // Show all rows

Row Height
RevoGrid provides options to customize row heights, allowing for uniform height across all rows or individual adjustments.

Details:

Setting Uniform Row Height: Use the rowSize property on the <revo-grid> component to apply the same height to all rows.

Customizing Individual Row Sizes: Use the rowDefinitions property to specify heights for specific rows by their index. This property takes an array of objects, where each object defines type (always 'rgRow'), index, and size.

Combining rowSize and rowDefinitions allows for a default height with specific overrides.

Code Example (Setting Uniform Row Height):

<revo-grid row-size="50"></revo-grid>

Code Example (Setting Uniform Row Height Programmatically):

const grid = document.querySelector('revo-grid');
grid.rowSize = 50; // Sets all rows to 50 pixels height

Code Example (Customizing Individual Row Sizes):

const grid = document.querySelector('revo-grid');
const rowDefinitions = [
  { type: 'rgRow', index: 0, size: 45 }, // Row at index 0 will have a height of 45px
  { type: 'rgRow', index: 1, size: 60 }  // Row at index 1 will have a height of 60px
];
grid.rowDefinitions = rowDefinitions;

Code Example (Combining Uniform and Individual Row Sizes):

const grid = document.querySelector('revo-grid');
grid.rowSize = 50; // Set all rows to 50px by default
const rowDefinitions = [
  { type: 'rgRow', index: 0, size: 70 }, // Make the first row larger
  { type: 'rgRow', index: 5, size: 30 }  // Make the sixth row smaller
];
grid.rowDefinitions = rowDefinitions;

Row Pinning
Row Pinning (or freezing) allows specific rows to remain visible at the top or bottom of the grid, even when the user scrolls vertically through other data.

Details:

Pinned rows are fixed in place and managed through separate data sources.

pinnedTopSource: Data source for rows pinned to the top.

pinnedBottomSource: Data source for rows pinned to the bottom.

Useful for displaying headers, totals, or sticky notes.

Pinning rows introduces virtual indexes to the grid.

Code Example (Pinning Rows):

// Define the data sources for pinned rows
const pinnedTopSource = [{ name: 'Header Row 1' }, { name: 'Header Row 2' }];
const pinnedBottomSource = [{ name: 'Total Row' }];

// Initialize the RevoGrid
const grid = document.querySelector('revo-grid');

// Assign the pinned rows
grid.pinnedTopSource = pinnedTopSource;
grid.pinnedBottomSource = pinnedBottomSource;

// Example main data source
grid.source = [
  { name: 'Item A' },
  { name: 'Item B' },
  { name: 'Item C' },
  // ... more data
];

Row Grouping
Row Grouping in RevoGrid allows you to organize rows based on a specific property, making it easy to categorize and visualize hierarchical data.

Details:

Enabled by providing a grouping configuration object to the grid.

The grouping object typically contains a props array, specifying the data properties to group by.

Can be updated dynamically by modifying the grouping property.

Code Example (Row Grouping):

import { defineCustomElements } from '@revolist/revogrid/loader';
import { type DataType } from '@revolist/revogrid';

defineCustomElements();

const grid = document.createElement('revo-grid');
document.body.appendChild(grid);

const columns = [
  { name: 'Project Name', prop: 'projectName' },
  { name: 'Status', prop: 'status' },
  { name: 'Value', prop: 'value' }
];

const source: DataType[] = [
  { projectName: 'Project Alpha', status: 'Completed', value: 100, group: 'Group 1' },
  { projectName: 'Project Beta', status: 'In Progress', value: 150, group: 'Group 1' },
  { projectName: 'Project Gamma', status: 'Completed', value: 200, group: 'Group 2' },
  { projectName: 'Project Delta', status: 'Pending', value: 75, group: 'Group 2' },
];

grid.columns = columns;
grid.source = source;

// Enable row grouping by the 'group' property
grid.grouping = {
  props: ['group'],
  // Optional: control initial expansion
  // expandedAll: true,
  // prevExpanded: { 'Group 1': true } // Example for specific group expansion
};

Data Synchronization
RevoGrid provides different approaches for working with data, emphasizing that mutating the data passed to the grid is crucial for optimal performance.

Details:

Grid-Centric Data Management: Work directly with the grid and request data from it. Subscribe to afteredit events to retrieve updated data.

Source-Centric Data Management: Manage data independently. Pass the updated source array to the grid after each edit, triggering a re-render.

Pagination and Dynamic Data Loading: For large datasets, pagination allows breaking data into manageable parts. Dynamic data loading (an advanced version of pagination) loads data in chunks based on user interactions like scrolling. The EventManagerPlugin (part of the Pro version) consolidates various edit events into a single gridedit event.

Code Example (Grid-Centric Data Management with afteredit):

const grid = document.querySelector('revo-grid');

// Assume columns and initial source are set
grid.columns = [
  { prop: 'id', name: 'ID', readonly: true },
  { prop: 'name', name: 'Name', editable: true },
];
grid.source = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// Listen for afteredit event to get updated data
grid.addEventListener('afteredit', (event) => {
  const { detail } = event;
  console.log('Cell edited:', detail);
  // Retrieve the entire updated source from the grid
  const updatedSource = grid.source;
  console.log('Current grid data:', updatedSource);
  // Here you would typically send `updatedSource` to your backend
});

Note: For source-centric data management, you would typically manage your data in a React state and pass a new array to the source prop of the <RevoGrid> component whenever the data changes.

Performance
RevoGrid is designed for high performance, especially when handling large datasets, by leveraging a reactive DOM model and virtual scrolling.

Details:

Reactive DOM: At its core, RevoGrid uses a reactive DOM model (similar to Vue or React Virtual DOM) to ensure that only necessary parts of the grid are re-rendered, optimizing updates.

Virtual Scrolling: This performance optimization technique renders only the rows and columns currently visible in the viewport, significantly enhancing performance for large datasets.

Optimized Rendering: Features like disableVirtualX and disableVirtualY can be used to prevent lazy rendering for smaller datasets, potentially improving initial render time.

Use Cases: Its performance makes it suitable for financial modeling, project management, e-commerce dashboards, healthcare data management, and logistics.

Code Example (Disabling Virtual Scrolling for X/Y Axis - Use with caution for large datasets):

const grid = document.querySelector('revo-grid');

// Disable lazy rendering for the X axis (columns)
// Use when not many columns are present and re-rendering cells during scroll is not needed.
grid.disableVirtualX = true;

// Disable lazy rendering for the Y axis (rows)
// Use when not many rows are present and re-rendering cells during scroll is not needed.
grid.disableVirtualY = true;

Events
RevoGrid provides a comprehensive event system that allows developers to interact with various grid actions and lifecycle stages. All events propagate to the root level of the grid.

Details:

Events cover a wide range of actions, including column updates, editing, focus/selection changes, and data rendering.

Events typically provide a detail object with relevant information about the event.

Many events allow e.preventDefault() to stop the default behavior.

Key Event Categories (Examples):

Column Events: beforecolumnapplied, beforecolumnsset, aftercolumnsset, aftercolumnresize.

Edit Events: beforeedit, beforerangeedit, beforeautofill, afteredit.

Focus/Selection Events: beforecellfocus, beforefocuslost, afterfocus.

Data/Render Events: afterrender, beforecellrender, beforedatarender, beforerowrender.

Drag & Drop Events: dragstartcell, columndragstart, columndragend.

Sorting Events: beforeSorting, beforeSortingApply, aftersortingapply.

RTL Events: rtlstatechanged.

Code Example (Listening to a General Event):

const grid = document.querySelector('revo-grid');

// Listen for an event after any source update (main or pinned viewports)
grid.addEventListener('afteranysource', (event) => {
  const { type, source } = event.detail;
  console.log(`Source of type '${type}' updated. New data length: ${source.length}`);
});

// Listen for an event before a cell is rendered
grid.addEventListener('beforecellrender', (event) => {
  const { detail } = event;
  // Example: Modify cell properties before rendering
  // detail.properties.style.backgroundColor = 'yellow';
});

Custom Renderers
RevoGrid provides robust support for custom cell renderers, allowing you to display native components or custom HTML content within grid cells. This is a powerful feature for creating highly customized and interactive grid UIs.

Details:

Custom renderers are typically implemented using the cellTemplate property in a column definition.

This property accepts a function that receives createElement (a utility for creating virtual DOM nodes), props (containing cell data and other properties), and additionalData.

You can embed complex UI elements like buttons, images, input fields, or even other React components within a cell.

Custom renderers enable dynamic content, conditional rendering, and event handling within cells.

While powerful, developers should consider performance implications, especially with very complex renderers on large datasets.

Code Example (React Custom Cell Template):

import { type ColumnDataSchemaModel, RevoGrid, Template } from '@revolist/react-datagrid';
import { useState } from 'react';

// Custom cell component (React functional component)
const MyCustomCell = ({ value, model }: Partial<ColumnDataSchemaModel>) => {
  const cellValue = value;
  const rowId = model?.id; // Access other row data if needed

  return (
    <div style={{ padding: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontWeight: 'bold', color: rowId % 2 === 0 ? 'blue' : 'purple' }}>
        {cellValue}
      </span>
      <button
        onClick={() => alert(`Button clicked for row ${rowId} with value: ${cellValue}`)}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer'
        }}
      >
        Action
      </button>
    </div>
  );
};

// Main App component using RevoGrid with the custom cell
const App = () => {
  const [source, setSource] = useState([
    { id: 1, name: 'Alice', status: 'active' },
    { id: 2, name: 'Bob', status: 'inactive' },
    { id: 3, name: 'Charlie', status: 'active' },
  ]);

  const columns = [
    { prop: 'id', name: 'ID' },
    {
      prop: 'name',
      name: 'Custom Name Cell',
      // Assign the custom React component as the cellTemplate
      cellTemplate: (h, props) => h(MyCustomCell, props)
    },
    { prop: 'status', name: 'Status' },
  ];

  return (
    <RevoGrid
      source={source}
      columns={columns}
      style={{ height: '300px', width: '100%' }}
    />
  );
};

export default App;
