# UAM Admin Frontend - Application Analysis for React Migration

This document provides a comprehensive analysis of the UAM Admin Frontend application (currently built with SvelteKit) to facilitate its migration to React while maintaining the same functionality.

## 1. Application Entry Point and Routing

### Entry Point
The application is a SvelteKit project with:
- **Main entry point:** `src/app.js` (initializes authentication)
- **Base HTML:** `src/index.html` (includes Harmony UI components and external libraries)
- **Layout:** `src/routes/+layout.svelte` and `src/routes/+layout.js`

### Routing Structure
Uses SvelteKit's file-based routing with centralized navigation service (`src/framework/routing.js`)

**Key routes:**
- `/` - Home page
- `/users` - User management listing
- `/users/[username]` - User details with tabs (Details, Groups, Roles)
- `/users/[username]/edit` - User edit form
- `/roles` - Role management listing
- `/roles/[rolename]` - Role details with tabs (Details, Associated Roles, Attributes, Users in Role)
- `/roles/[rolename]/edit` - Role edit form
- `/groups` - Group management listing
- `/groups/[groupid]` - Group details with tabs (Details, Attributes, Members, Assigned Roles)
- `/groups/[groupid]/edit` - Group edit form

### Navigation Guards
Implemented to prevent navigation with unsaved changes using `src/lib/navigation-guard/`

## 2. Core Functionalities and UI Components

### Main Features

#### User Management
- Create, read, update, delete users
- Assign/unassign users to/from groups
- Assign/unassign roles to/from users
- User attributes management
- Export users to CSV

#### Role Management
- Create, read, update, delete roles
- Role attributes management
- Associated roles (composite roles)
- View users assigned to roles

#### Group Management
- Create, read, update, delete groups
- Group attributes management
- Assign/unassign users to/from groups
- Assign/unassign roles to/from groups

### UI Component Architecture
- Uses Harmony UI (dltk-*) components throughout
- Shared Header component (`src/lib/components/Header.svelte`)
- Global components: Toast notifications, Global loader
- Form components with validation using `dltk-form`, `dltk-field`, `dltk-validator`
- Data tables using `dltk-table-revogrid`
- Modal dialogs using `dltk-dialog` with dynamic component mounting

## 3. API Interactions

### API Architecture
- **Base API client:** `src/framework/api.js` with `RestClient`, `UamApiClient`, and `KeycloakApiClient`
- **Service layer pattern** with dedicated services:
  - `src/routes/users/services/user-service.js`
  - `src/routes/roles/services/roles-service.js`
  - `src/routes/groups/services/groups-service.js`

### API Endpoints

#### UAM API (Primary)

**Users:**
- `GET /users/export?first=0&max=1000` - Get users list
- `POST /users` - Create user
- `PUT /users` - Update user
- `GET /users/{userId}` - Get user by ID
- `GET /users/name/{username}` - Get user by username
- `GET /users/{username}/groups` - Get user's groups
- `PUT /groups/addUsers?groupId={groupId}&userId={userId}` - Add users to group
- `DELETE /groups/terminate/users?userId={userId}&groupId={groupId}` - Remove users from group
- `GET /protocol/openid-connect/userinfo` - Get current user info

**Roles:**
- `GET /roles` - Get roles list
- `GET /roles/{roleName}` - Get role details
- `POST /roles` - Create role
- `PUT /roles/{roleName}` - Update role
- `DELETE /roles/{roleName}` - Delete role
- `GET /roles/{roleName}/users` - Get users with role

**Groups:**
- `GET /groups` - Get groups list
- `GET /groups/{groupId}` - Get group details
- `POST /groups` - Create group
- `PUT /groups` - Update group
- `DELETE /groups/{groupId}` - Delete group
- `GET /groups/{groupId}/users` - Get group members
- `GET /groups/{groupId}/roles` - Get group roles
- `PUT /groups/{groupId}/users` - Update group users (Add/Remove)
- `DELETE /groups/terminate/users?userId={userId}&groupId={groupId}` - Remove users from group
- `DELETE /groups/deleteCustomerRoles?groupId={groupId}` - Remove roles from group

#### Keycloak Admin API (Secondary)
- Used for some user operations and client management
- Authentication token management
- `GET /admin/realms/{realm}/roles` - Get realm roles
- `GET /admin/realms/{realm}/clients` - Get clients
- `GET /admin/realms/{realm}/clients/{clientId}/roles` - Get client roles
- `DELETE /admin/realms/{realm}/users/{userId}` - Delete user

### API Configuration
- **Development:** Uses proxy `/uam-api/` 
- **Production:** Uses `https://uam.{hostname}/`
- **Keycloak URL:** Dynamic based on hostname (`https://keycloak.{hostname}`)

## 4. Data Management/State

### State Management
Svelte stores for global state management:
- `src/stores/auth.js` - Authentication state
- `src/stores/users.js` - Users data
- `src/stores/roles.js` - Roles data
- `src/stores/groups.js` - Groups data with sub-stores for users and roles
- `src/stores/notifications.js` - Toast notifications
- `src/stores/table.js` - Table selection state
- `src/stores/utilsStore.js` - Global utilities (toast, dialog references)

### Data Flow
- Services fetch data from APIs and update stores
- Components subscribe to stores for reactive updates
- Form data managed with local state and validation
- Data transformation utilities for server-to-UI format conversion

### Key Data Structures

#### User Object
```javascript
{
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  enabled: boolean,
  requiredActions: string[],
  emailVerified: boolean,
  attributes: { phone: [string] },
  groups: string[]
}
```

#### Role Object
```javascript
{
  id: string,
  name: string,
  description: string,
  composite: boolean,
  attributes: { [key]: [string] }
}
```

#### Group Object
```javascript
{
  id: string,
  name: string,
  attributes: { [key]: [string] }
}
```

## 5. Authentication/Authorization

### Authentication System
- **Keycloak-based authentication** using `keycloak-js` library
- Token management with session storage
- Automatic token refresh
- Realm-based multi-tenancy support

### Key Components
- `src/stores/auth.js` - Main authentication store
- `src/framework/auth.js` - Authentication utilities
- `src/utils/auth-utils.js` - Helper functions for tokens, realm management

### Authentication Flow
1. Initialize Keycloak instance with realm and client ID
2. Attempt login with stored credentials or redirect to Keycloak
3. Store tokens in session storage
4. Automatic token refresh on expiry
5. Logout clears tokens and redirects

### Authorization
- Route-level protection in `+layout.js`
- Protected paths: users, home, roles, groups
- Realm-based access control

### Configuration
- **Client ID:** `'uam-admin-frontend'`
- **Realm:** Retrieved from localStorage
- **Keycloak URL:** Dynamic based on hostname

## 6. Form Validation and Data Processing

### Validation Configuration
Each entity has validation rules defined in service files:

#### User Validation
```javascript
USER_VALIDATION_CONFIG = {
  username: { regex: /^[a-zA-Z0-9._-]+$/, maxLength: 50 },
  firstName: { regex: /^[a-zA-Z\s]+$/, maxLength: 50 },
  lastName: { regex: /^[a-zA-Z\s]+$/, maxLength: 50 },
  email: { pattern: email regex, maxLength: 255 },
  phoneNumber: { pattern: phone regex }
}
```

#### Role Validation
```javascript
ROLE_VALIDATION_CONFIG = {
  name: { regex: /^[a-zA-Z0-9._-]+$/, maxLength: 50 },
  description: { regex: /^[\s\S]*$/, maxLength: 500 }
}
```

#### Group Validation
```javascript
GROUP_VALIDATION_CONFIG = {
  name: { regex: /^[a-zA-Z0-9._-]+$/, maxLength: 50 }
}
```

### Data Transformation
- Server attributes format: `{ "key": ["value"] }`
- UI attributes format: `{ "key": "value" }`
- Transformation utilities handle conversion between formats

## 7. Key Libraries and Dependencies

### External Libraries
- **Keycloak JS** for authentication
- **RevoGrid** for data tables
- **Harmony UI (dltk-*)** for UI components
- **Marked** for markdown processing
- **ApexCharts** for potential charting

### Development Patterns
- Component-based architecture
- Service layer for API interactions
- Centralized state management
- Form validation with regex patterns
- Navigation guards for unsaved changes
- Error handling with toast notifications

## 8. Environment Configuration

### Configuration Details
- Dynamic API URL detection based on hostname
- Development vs production environment handling
- Realm configuration from localStorage
- Client ID: 'uam-admin-frontend'

### Environment Variables
- API endpoints determined by hostname
- Keycloak URL determined by hostname
- Default realm: 'uam'

## 9. UI/UX Patterns

### Layout Structure
- Application uses grid-based layout with:
  - Header area
  - Navigation area
  - Main content area
  - Footer area

### Page Patterns
- **List pages:** Header + Table with actions
- **Detail pages:** Header + Tabbed content
- **Edit pages:** Header + Form with validation
- **Modal dialogs:** Dynamic component mounting

### Component Hierarchy
```
dltk-app (layout)
├── dltk-header (grid-area="header")
├── dltk-navigation (grid-area="navigation")  
├── dltk-grid (grid-area="main")
│   └── Page Content
│       ├── Header Component
│       └── dltk-container (grid-area="main")
└── dltk-footer (grid-area="footer")
```

## 10. Error Handling and User Feedback

### Error Handling
- Centralized error handling in API services
- Toast notifications for user feedback
- Form validation errors displayed inline
- Global error boundaries for unhandled errors

### User Feedback
- Toast notifications for success/error messages
- Loading states during API calls
- Form validation feedback
- Confirmation dialogs for destructive actions

## 11. Testing Considerations

### Current Testing Structure
- Component tests in `src/test/` directory
- DFT (Design For Test) patterns
- Mock utilities for testing
- API service testing

### Test Categories
- Component unit tests
- Integration tests for user flows
- API service tests
- Form validation tests

## Migration Recommendations for React

### State Management
- Consider using Redux Toolkit or Zustand for global state
- React Query/TanStack Query for server state management
- Context API for authentication state

### Routing
- React Router for client-side routing
- Route guards using higher-order components or hooks
- Dynamic route parameters handling

### Form Management
- React Hook Form for form state and validation
- Yup or Zod for validation schemas
- Custom validation hooks

### UI Components
- Continue using Harmony UI components if compatible
- Create React wrappers for dltk-* components if needed
- Maintain same layout patterns and component hierarchy

### Authentication
- Adapt Keycloak integration for React
- Custom hooks for authentication state
- Protected route components

This analysis provides the foundation needed to recreate the UAM Admin Frontend functionality in React while maintaining the same user experience and feature set.