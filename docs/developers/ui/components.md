# UI Component Library

The Discord Bot Plugin System provides a comprehensive library of reusable UI components for building consistent and responsive web interfaces for your plugins.

## Table of Contents

1. [Overview](#overview)
2. [Layout Components](#layout-components)
3. [Form Components](#form-components)
4. [Data Display Components](#data-display-components)
5. [Feedback Components](#feedback-components)
6. [Navigation Components](#navigation-components)
7. [Utility Components](#utility-components)
8. [Styling Guide](#styling-guide)
9. [Responsive Design](#responsive-design)
10. [Accessibility](#accessibility)

## Overview

The UI component library is built with React and follows modern design principles. All components are designed to be:

- **Reusable**: Consistent across different parts of the application
- **Accessible**: Compliant with WCAG standards
- **Responsive**: Work well on all device sizes
- **Customizable**: Easy to style and extend
- **Performant**: Optimized for fast rendering

### Using Components

To use UI components in your plugin pages:

```javascript
import React from 'react';
import { Button, Card, Input } from '../../components';

export default function MyPluginPage() {
  return (
    <div className="container">
      <Card>
        <h2>My Plugin Settings</h2>
        <Input 
          label="API Key" 
          type="password" 
          placeholder="Enter your API key" 
        />
        <Button variant="primary">Save Settings</Button>
      </Card>
    </div>
  );
}
```

## Layout Components

### Container

The Container component provides consistent page width and padding:

```javascript
import { Container } from '../../components';

export default function MyPage() {
  return (
    <Container>
      <h1>Page Content</h1>
      <p>This content is contained within a consistent width.</p>
    </Container>
  );
}
```

Props:
- `fluid` (boolean): Makes container full width
- `className` (string): Additional CSS classes

### Grid

The Grid component creates responsive layouts:

```javascript
import { Grid, Col } from '../../components';

export default function Dashboard() {
  return (
    <Grid>
      <Col span={4}>
        <div>Column 1</div>
      </Col>
      <Col span={8}>
        <div>Column 2</div>
      </Col>
    </Grid>
  );
}
```

Grid Props:
- `gutter` (number): Spacing between columns (default: 16)
- `className` (string): Additional CSS classes

Col Props:
- `span` (number): Column width (1-12)
- `offset` (number): Column offset
- `className` (string): Additional CSS classes

### Card

The Card component groups related content:

```javascript
import { Card } from '../../components';

export default function FeatureCard() {
  return (
    <Card>
      <h3>Feature Title</h3>
      <p>Description of the feature.</p>
    </Card>
  );
}
```

Props:
- `title` (string): Card title
- `actions` (ReactNode): Action buttons
- `className` (string): Additional CSS classes

### Layout

The Layout component provides the main page structure:

```javascript
import { Layout } from '../../components';

export default function MyPage() {
  return (
    <Layout>
      <h1>Page Content</h1>
      <p>This content is within the main layout.</p>
    </Layout>
  );
}
```

## Form Components

### Button

The Button component provides consistent button styling:

```javascript
import { Button } from '../../components';

export default function ActionButtons() {
  return (
    <div>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}
```

Props:
- `variant` (string): Button style ('primary', 'secondary', 'success', 'warning', 'danger')
- `size` (string): Button size ('small', 'medium', 'large')
- `disabled` (boolean): Disable the button
- `loading` (boolean): Show loading state
- `onClick` (function): Click handler
- `className` (string): Additional CSS classes

### Input

The Input component provides consistent text input styling:

```javascript
import { Input } from '../../components';

export default function FormInputs() {
  return (
    <div>
      <Input 
        label="Username" 
        placeholder="Enter your username" 
      />
      <Input 
        label="Password" 
        type="password" 
        placeholder="Enter your password" 
      />
      <Input 
        label="Email" 
        type="email" 
        placeholder="Enter your email" 
      />
    </div>
  );
}
```

Props:
- `label` (string): Input label
- `type` (string): Input type ('text', 'password', 'email', etc.)
- `placeholder` (string): Placeholder text
- `value` (string): Input value
- `onChange` (function): Change handler
- `disabled` (boolean): Disable the input
- `error` (string): Error message
- `className` (string): Additional CSS classes

### Select

The Select component provides dropdown selection:

```javascript
import { Select } from '../../components';

export default function ThemeSelector() {
  const options = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'auto', label: 'Auto (System)' }
  ];

  return (
    <Select 
      label="Theme" 
      options={options} 
      defaultValue="auto" 
    />
  );
}
```

Props:
- `label` (string): Select label
- `options` (array): Array of { value, label } objects
- `value` (string): Selected value
- `onChange` (function): Change handler
- `disabled` (boolean): Disable the select
- `className` (string): Additional CSS classes

### Checkbox

The Checkbox component provides boolean selection:

```javascript
import { Checkbox } from '../../components';

export default function Preferences() {
  return (
    <div>
      <Checkbox label="Enable notifications" defaultChecked />
      <Checkbox label="Send email alerts" />
      <Checkbox label="Auto-update plugins" disabled />
    </div>
  );
}
```

Props:
- `label` (string): Checkbox label
- `checked` (boolean): Checked state
- `defaultChecked` (boolean): Initial checked state
- `onChange` (function): Change handler
- `disabled` (boolean): Disable the checkbox
- `className` (string): Additional CSS classes

### Textarea

The Textarea component provides multi-line text input:

```javascript
import { Textarea } from '../../components';

export default function DescriptionInput() {
  return (
    <Textarea 
      label="Description" 
      placeholder="Enter a detailed description" 
      rows={4} 
    />
  );
}
```

Props:
- `label` (string): Textarea label
- `placeholder` (string): Placeholder text
- `value` (string): Textarea value
- `rows` (number): Number of visible rows
- `onChange` (function): Change handler
- `disabled` (boolean): Disable the textarea
- `className` (string): Additional CSS classes

## Data Display Components

### Table

The Table component displays tabular data:

```javascript
import { Table } from '../../components';

export default function PluginTable() {
  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'version', title: 'Version' },
    { key: 'status', title: 'Status' }
  ];

  const data = [
    { name: 'Weather Plugin', version: '1.2.3', status: 'Active' },
    { name: 'Music Plugin', version: '2.0.1', status: 'Inactive' }
  ];

  return (
    <Table 
      columns={columns} 
      data={data} 
      striped 
      hoverable 
    />
  );
}
```

Props:
- `columns` (array): Array of column definitions
- `data` (array): Array of data objects
- `striped` (boolean): Alternate row colors
- `hoverable` (boolean): Highlight rows on hover
- `className` (string): Additional CSS classes

### Badge

The Badge component displays status indicators:

```javascript
import { Badge } from '../../components';

export default function StatusBadges() {
  return (
    <div>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  );
}
```

Props:
- `variant` (string): Badge style ('success', 'warning', 'danger', 'info')
- `children` (ReactNode): Badge content
- `className` (string): Additional CSS classes

### Progress

The Progress component displays progress indicators:

```javascript
import { Progress } from '../../components';

export default function TaskProgress() {
  return (
    <div>
      <Progress percent={75} status="active" />
      <Progress percent={100} status="success" />
      <Progress percent={50} status="exception" />
    </div>
  );
}
```

Props:
- `percent` (number): Progress percentage (0-100)
- `status` (string): Progress status ('active', 'success', 'exception')
- `showInfo` (boolean): Show percentage text
- `className` (string): Additional CSS classes

## Feedback Components

### Alert

The Alert component displays important messages:

```javascript
import { Alert } from '../../components';

export default function SystemAlerts() {
  return (
    <div>
      <Alert variant="info" message="This is an informational message" />
      <Alert variant="success" message="Operation completed successfully" />
      <Alert variant="warning" message="This is a warning message" />
      <Alert variant="danger" message="This is an error message" closable />
    </div>
  );
}
```

Props:
- `variant` (string): Alert style ('info', 'success', 'warning', 'danger')
- `message` (string): Alert message
- `closable` (boolean): Show close button
- `onClose` (function): Close handler
- `className` (string): Additional CSS classes

### Modal

The Modal component displays overlay dialogs:

```javascript
import { Modal, Button } from '../../components';
import { useState } from 'react';

export default function ConfirmationModal() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button onClick={() => setVisible(true)}>Open Modal</Button>
      <Modal
        title="Confirm Action"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          // Handle confirmation
          setVisible(false);
        }}
      >
        <p>Are you sure you want to perform this action?</p>
      </Modal>
    </div>
  );
}
```

Props:
- `title` (string): Modal title
- `visible` (boolean): Show/hide modal
- `onOk` (function): OK button handler
- `onCancel` (function): Cancel button handler
- `okText` (string): OK button text
- `cancelText` (string): Cancel button text
- `children` (ReactNode): Modal content
- `className` (string): Additional CSS classes

### Toast

The Toast component displays temporary notifications:

```javascript
import { Toast, Button } from '../../components';

export default function NotificationToast() {
  const showToast = () => {
    Toast.success('Operation completed successfully');
  };

  return (
    <Button onClick={showToast}>Show Toast</Button>
  );
}
```

Static Methods:
- `Toast.success(content, duration)`
- `Toast.error(content, duration)`
- `Toast.info(content, duration)`
- `Toast.warning(content, duration)`

## Navigation Components

### Breadcrumb

The Breadcrumb component shows navigation hierarchy:

```javascript
import { Breadcrumb } from '../../components';

export default function PageBreadcrumb() {
  const items = [
    { title: 'Home', href: '/' },
    { title: 'Plugins', href: '/plugins' },
    { title: 'Weather Plugin' }
  ];

  return <Breadcrumb items={items} />;
}
```

Props:
- `items` (array): Array of breadcrumb items
- `separator` (string): Separator character (default: '/')
- `className` (string): Additional CSS classes

### Pagination

The Pagination component handles large datasets:

```javascript
import { Pagination } from '../../components';

export default function DataPagination() {
  return (
    <Pagination
      total={100}
      current={1}
      pageSize={10}
      onChange={(page) => console.log('Page changed to:', page)}
    />
  );
}
```

Props:
- `total` (number): Total number of items
- `current` (number): Current page
- `pageSize` (number): Items per page
- `onChange` (function): Page change handler
- `className` (string): Additional CSS classes

## Utility Components

### Skeleton

The Skeleton component displays loading placeholders:

```javascript
import { Skeleton } from '../../components';

export default function LoadingSkeleton() {
  return (
    <div>
      <Skeleton active />
      <Skeleton avatar paragraph={{ rows: 4 }} />
    </div>
  );
}
```

Props:
- `active` (boolean): Show animated loading
- `avatar` (boolean): Show avatar placeholder
- `paragraph` (object): Paragraph placeholder options
- `className` (string): Additional CSS classes

### Divider

The Divider component separates content sections:

```javascript
import { Divider } from '../../components';

export default function ContentSections() {
  return (
    <div>
      <p>First section content</p>
      <Divider />
      <p>Second section content</p>
      <Divider orientation="left">Section Title</Divider>
      <p>Third section content</p>
    </div>
  );
}
```

Props:
- `orientation` (string): Title orientation ('left', 'right', 'center')
- `children` (ReactNode): Divider title
- `className` (string): Additional CSS classes

## Styling Guide

### CSS Custom Properties

The system uses CSS custom properties for consistent styling:

```css
:root {
  /* Colors */
  --primary-color: #6366f1;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --info-color: #3b82f6;
  
  /* Dark theme colors */
  --bg-color: #0f172a;
  --card-bg: #1e293b;
  --text-color: #f1f5f9;
  --border-color: #334155;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Borders */
  --border-radius: 0.375rem;
  --border-width: 1px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Using Custom Properties

Apply custom properties in your components:

```css
.my-component {
  background-color: var(--card-bg);
  color: var(--text-color);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--space-md);
  box-shadow: var(--shadow-md);
}
```

### Responsive Breakpoints

Use responsive breakpoints for different screen sizes:

```css
/* Mobile first */
.container {
  padding: var(--space-sm);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--space-md);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-lg);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## Responsive Design

All components are designed to be responsive:

### Grid System

Use the 12-column grid system for layouts:

```javascript
import { Grid, Col } from '../../components';

export default function ResponsiveLayout() {
  return (
    <Grid gutter={16}>
      <Col span={24} md={12} lg={8}>
        <div>Column 1</div>
      </Col>
      <Col span={24} md={12} lg={8}>
        <div>Column 2</div>
      </Col>
      <Col span={24} md={24} lg={8}>
        <div>Column 3</div>
      </Col>
    </Grid>
  );
}
```

Breakpoint props:
- `xs` (number): Extra small screens (< 576px)
- `sm` (number): Small screens (≥ 576px)
- `md` (number): Medium screens (≥ 768px)
- `lg` (number): Large screens (≥ 1024px)
- `xl` (number): Extra large screens (≥ 1200px)

## Accessibility

All components follow accessibility best practices:

### Semantic HTML

Components use semantic HTML elements:

```javascript
// Good: Semantic button
<button type="button" onClick={handleClick}>
  Click me
</button>

// Bad: Non-semantic div
<div onClick={handleClick}>
  Click me
</div>
```

### Keyboard Navigation

Components are keyboard accessible:

```javascript
// All interactive components can be focused and activated with keyboard
<Button onClick={handleClick}>
  Can be activated with Enter or Space
</Button>
```

### ARIA Attributes

Components include appropriate ARIA attributes:

```javascript
// Modal component includes proper ARIA attributes
<Modal 
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description content</p>
</Modal>
```

By using these UI components and following the styling guide, you can create consistent, accessible, and responsive interfaces for your plugins that integrate seamlessly with the Discord Bot Plugin System.