# Code Style Guide - Medix Web

This document defines the coding standards, conventions, and best practices for the **Medix Web** application. The project follows strict TypeScript and JavaScript standards to ensure consistency, maintainability, and type safety.

---

## 1. TypeScript Configuration

### 1.1 Project Settings

**`tsconfig.app.json`** enables strict type checking:

```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 1.2 Type-Only Imports

**Always use `import type` for type-only imports**:

```typescript
// ❌ Wrong - includes implementation
import { useState } from 'react';

// ✅ Correct - type-only import
import type { UseStateReturn } from 'react';
```

### 1.3 Constructor Property Initialization

**Never use parameter property syntax** (rejected by `erasableSyntaxOnly`):

```typescript
// ❌ Wrong - parameter property
class UserService {
  constructor(public api: ApiClient, private logger: Logger) {}
  // Error: Parameter-property syntax is not supported
}

// ✅ Correct - explicit property initialization
class UserService {
  api: ApiClient;
  private logger: Logger;
  
  constructor(api: ApiClient, logger: Logger) {
    this.api = api;
    this.logger = logger;
  }
}
```

---

## 2. Import/Export Conventions

### 2.1 Import Structure

```typescript
// Order imports
1. Core libraries (React, etc.)
2. Framework libraries (@tanstack/react-table, etc.)
3. Local files (same directory → upward)
4. Type definitions
5. Component styles

// Example
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '../../services/api';
import type { User } from '../../types/user.types';
import './UserComponent.css';
```

### 2.2 Export Structure

```typescript
// Export types separately
export type { User, UserRole } from './types';
export { default as UserComponent } from './UserComponent';

// Export everything else
export * from './utils';
export { UserService } from './services';
```

### 2.3 File Pathing

```typescript
// Same directory
import { Component } from './Component';

// Up one level
import { utils } from '../utils';

// Down one level (avoid if possible)
import { SubComponent } from './sub/SubComponent';
```

---

## 3. Component Patterns

### 3.1 React Component Structure

```typescript
// Components should follow this pattern
interface ComponentProps {
  // Props interface
  prop1: string;
  prop2?: number;
}

interface ComponentState {
  // Internal state (if not using hooks)
  loading: boolean;
  data: any[];
}

function ComponentName({ prop1, prop2 }: ComponentProps): JSX.Element {
  // Component implementation
  const [state, setState] = useState<ComponentState>({ ... });
  
  return (
    <div className="component">
      {/* Component JSX */}
    </div>
  );
}

ComponentName.displayName = 'ComponentName';
```

### 3.2 Functional Component Pattern

```typescript
// Functional components with hooks
function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.login(email, password);
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
}
```

---

## 4. Custom Hook Patterns

### 4.1 Hook Structure

```typescript
// Hook files in src/features/*/hooks/
// Example: src/features/users/hooks/useUsers.ts

import { useState, useEffect, useCallback } from 'react';
import type { User, UsersResponse } from '../types/user.types';
import { userService } from '../../services';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  fetchUsers: (page?: number) => Promise<void>;
  createUser: (user: CreateUserData) => Promise<User>;
  updateUser: (id: string, updates: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

export function useUsers(initialPage: number = 1, initialLimit: number = 10): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
  });

  const fetchUsers = useCallback(async (page: number = pagination.page) => {
    setLoading(true);
    setError(null);
    try {
      const response: UsersResponse = await userService.getUsers(page, pagination.limit);
      setUsers(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  // ... other hook functions

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
```

---

## 5. Service Layer Patterns

### 5.1 API Service Structure

```typescript
// src/services/api.ts
import type { User } from '../types/user.types';
import { ApiClient } from './api-client';

class UserService {
  private readonly api: ApiClient;

  constructor() {
    this.api = new ApiClient();
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    return this.api.get<UsersResponse>('/users', { page, limit });
  }

  async getUserById(id: string): Promise<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  async createUser(userData: CreateUserData): Promise<User> {
    return this.api.post<User>('/users', userData);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return this.api.put<User>(`/users/${id}`, updates);
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  async getCurrentUser(): Promise<User> {
    return this.api.get<User>('/users/profile');
  }
}

export const userService = new UserService();
```

### 5.2 Error Handling Pattern

```typescript
// Centralized error handling in api-client.ts
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Handle token expiration
      await handleTokenRefresh();
      return retryRequest();
    }
    
    const errorData = await response.json();
    throw new Error(errorData.message || 'Request failed');
  }
  
  return response.json();
} catch (error) {
  // Log error and rethrow
  console.error('API Error:', error);
  throw error;
}
```

---

## 6. Utility Functions

### 6.1 Utility Categories

**Place utilities in appropriate subdirectories**:

```typescript
src/utils/
├── api-helpers.ts          # API response helpers
├── jwt-utils.ts           # JWT token utilities  
├── role.ts               # Role/permission helpers
├── sweetalert.ts         # SweetAlert2 helpers
└── utils.ts              # General utilities
```

### 6.2 Utility Function Pattern

```typescript
// src/utils/jwt-utils.ts
export function decodeToken(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
}
```

---

## 7. File Structure & Organization

### 7.1 Feature-Driven Structure

```
src/
├── components/              # Shared components
│   └── layout/              # Layout components
├── features/                # Feature modules
│   ├── dashboard/           # Dashboard feature
│   │   ├── components/      # Dashboard components
│   │   ├── hooks/           # Dashboard hooks
│   │   └── types/           # Dashboard types
│   ├── drugs/               # Drugs feature
│   │   ├── components/      # Drug components
│   │   ├── hooks/           # Drug hooks
│   │   └── types/           # Drug types
│   └── users/               # Users feature
│       ├── components/      # User components
│       ├── hooks/           # User hooks
│       └── types/           # User types
├── hooks/                   # Global hooks
├── pages/                   # Page components
├── routes/                  # Routing
├── services/                # API services
├── types/                   # Global types
└── utils/                   # Utility functions
```

### 7.2 Component File Naming

```typescript
// File naming conventions
file-name.tsx          // kebab-case for files
FileName.tsx           // PascalCase for components
file_utils.ts           // kebab-case for utility modules
FileUtils.ts            // PascalCase for utility classes
```

### 7.3 Type File Naming

```typescript
// Type definitions in separate files
src/types/
├── api.types.ts          # API response types
├── user.types.ts         # User-related types
├── drug.types.ts         # Drug-related types
└── navigation.types.ts   # Navigation types
```

---

## 8. Error Handling Standards

### 8.1 Error Types

```typescript
// src/types/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### 8.2 Error Display Pattern

```typescript
// src/utils/error-utils.ts
import Swal from 'sweetalert2';

export function handleApiError(error: Error): void {
  // Log error to monitoring service
  console.error('API Error:', error);
  
  // Display user-friendly error message
  if (error instanceof ApiError) {
    Swal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  } else {
    Swal.fire({
      title: 'Unexpected Error',
      text: 'Something went wrong. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}
```

---

## 9. Testing Patterns

### 9.1 Test File Structure

```typescript
tests/
├── unit/                 # Unit tests
│   ├── components/       # Component tests
│   ├── hooks/            # Hook tests
│   └── services/         # Service tests
├── integration/           # Integration tests
└── e2e/                  # End-to-end tests
```

### 9.2 Test File Naming

```typescript
// Test file naming
testComponent.spec.tsx      // .spec.tsx suffix
component.test.tsx          // .test.tsx suffix
```

### 9.3 Test Structure

```typescript
// tests/components/LoginPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../../pages/LoginPage';
import { authService } from '../../services';

describe('LoginPage', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('calls login service on submit', async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
```

---

## 10. Linting & Code Quality

### 10.1 ESLint Configuration

**`eslint.config.js`** with strict rules:

```javascript
module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    '@eslint/js',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'react-refresh'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
```

### 10.2 Known Lint Issues

The following lint errors are acknowledged but not blocking build:

- `react-hooks/set-state-in-effect` in some dashboard/user modal components
- `@typescript-eslint/no-explicit-any` in components using complex generic types

---

## 11. Documentation Standards

### 11.1 JSDoc Comments

```typescript
/**
 * Component that displays a list of users.
 * 
 * @param {User[]} users - Array of user objects to display
 * @param {function} onUserClick - Callback when user is clicked
 * @param {boolean} [loading=false] - Whether data is loading
 * @returns {JSX.Element} User list component
 */
function UserList({ users, onUserClick, loading = false }: UserListProps): JSX.Element {
  // Implementation
}
```

---

## 12. Build & Deployment

### 12.1 Build Process

```bash
# Build command
npm run build

# Output structure
tsc -b               # TypeScript compilation
vite build          # Vite bundling
```

### 12.2 Environment-Specific Builds

```bash
# Development build
VITE_ENV=development npm run build

# Production build
VITE_ENV=production npm run build
```

---

## 13. Common Code Patterns

### 13.1 React State Management

```typescript
// Controlled components
function ControlledInput() {
  const [value, setValue] = useState<string>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  return <input value={value} onChange={handleChange} />;
}
```

### 13.2 API Integration

```typescript
// useQuery hook pattern
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['medicines'],
  queryFn: () => medicineService.getMedicines(),
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

### 13.3 Modal/Dialog Pattern

```typescript
// Reusable modal component pattern
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps): JSX.Element | null {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}
```

---

## 14. Version Control & Branching

### 14.1 Git Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/xxx`: Feature branches
- `bugfix/xxx`: Bug fix branches

### 14.2 Commit Message Format

```
<type>(<scope>): <short description>

<optional body>

<co>Co-authored-by: open-code <openhands@all-hands.dev></co: 12:[0]>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

---

## 15. Performance Optimization

### 15.1 React Optimization

```typescript
// React memoization
const ExpensiveComponent = memo(({ data }: { data: expensiveDataType }) => {
  // Expensive computation
  const computedValue = useMemo(() => computeExpensive(data), [data]);
  
  return <div>{computedValue}</div>;
});

// Hook optimization
const useExpensiveHook = () => {
  const [state, setState] = useState(initialState);
  
  // Cache expensive calculations
  const processedData = useMemo(() => processData(state.data), [state.data]);
  
  return { ...state, processedData, setState };
};
```

### 15.2 Component Optimization

```typescript
// Avoid inline styles in production
const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px'
  }
};

// Use CSS classes instead
<div className="bg-white p-4 rounded-lg">Content</div>
```

---

## 16. Security Coding Practices

### 16.1 Input Validation

```typescript
// Validate input data
def validateInput(data: any): ValidatedData {
  const schema = z.object({
    email: z.string().email(),
    age: z.number().min(0).max(120),
    name: z.string().min(2).max(50)
  });
  
  return schema.parse(data);
}
```

### 16.2 Safe Rendering

```typescript
// Safe HTML rendering
function SafeHtml({ html }: { html: string }) {
  return (
    <div 
      className="safe-html"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
```

---

## 17. Accessibility (A11y)

### 17.1 ARIA Labels

```typescript
// Include ARIA labels for accessibility
<button
  aria-label="Close modal"
  onClick={onClose}
>
  <XIcon />
</button>
```

### 17.2 Keyboard Navigation

```typescript
// Support keyboard navigation
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      // Manage focus trap
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

## 18. TypeScript Best Practices

### 18.1 Type Definitions

```typescript
// Use utility types
type PartialUser = Partial<User>;
type UserId = string & { readonly brand: unique symbol };

// Use discriminated unions
interface SuccessResponse {
  status: 'success';
  data: any;
}

interface ErrorResponse {
  status: 'error';
  message: string;
}

export type ApiResponse = SuccessResponse | ErrorResponse;
```

### 18.2 Generic Components

```typescript
// Generic component pattern
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyFn?: (item: T, index: number) => string | number;
}

function List<T>({ items, renderItem, keyFn }: ListProps<T>): JSX.Element {
  return (
    <div>
      {items.map((item, index) => (
        <div key={keyFn ? keyFn(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
```

---

## 19. Documentation Generation

### 19.1 API Documentation

```typescript
// Add JSDoc to exports
/**
 * Calculate user permissions based on role and resource.
 * 
 * @param role - User role
 * @param resource - Resource type
 * @param action - Action to perform
 * @returns Whether user has permission
 */
export function hasPermission(role: UserRole, resource: Resource, action: Action): boolean;
```

### 19.2 Component Documentation

```typescript
/**
 * Medication management component.
 * 
 * @example
 * <MedicationTable medications={medications} onEdit={handleEdit} />
 */
function MedicationTable({ medications, onEdit }: MedicationTableProps): JSX.Element {
  // Implementation
}
```

---

## 20. Project Maintenance

### 20.1 Code Cleanup

```bash
# Remove unused imports and code
npm run lint
# Fix lint errors and TODOs

# Run TypeScript compiler
npm run build
# Check for any TypeScript errors
```

### 20.2 Dependency Updates

```bash
# Check for outdated dependencies
npm outdated

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
```

---

## 21. Conclusion

This code style guide ensures consistency, maintainability, and quality across the Medix Web application. By following these standards, developers can work more efficiently, reduce bugs, and create a more maintainable codebase.

**Always review this document** when making significant changes to ensure compliance with the established standards.

---

## References

- TypeScript Documentation: https://www.typescriptlang.org/
- ESLint Configuration: https://eslint.org/docs/latest/
- React Documentation: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- TanStack Table: https://tanstack.com/table/v8
- Recharts: https://recharts.org/
- SweetAlert2: https://sweetalert2.github.io/
