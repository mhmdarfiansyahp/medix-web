# Testing Guide for Medix Web Application

## Overview

This document describes the testing strategy, structure, and setup for the Medix web application (React 19 + TypeScript + Vite). The testing approach is comprehensive and covers unit, integration, and end-to-end testing with a focus on the pharmacy application's critical workflows.

## Current Status

**No test runner is currently configured** in the project. This guide provides recommendations for setting up a complete testing infrastructure.

## Recommended Testing Setup

### Recommended Test Runner

**Primary Recommendation:** Vitest
- Built for Vue.js but excellent for React with React Testing Library
- TypeScript-first, fast performance
- Native integration with Vite

**Secondary Recommendation:** Jest + React Testing Library
- Proven solution for React applications
- Extensive ecosystem
- Good documentation and community support

**End-to-End Testing:** Playwright (already configured as dev dependency)
- Excellent for browser-based testing
- Supports multiple browsers
- Good for complex workflows

## Test Structure

Based on the established code style patterns, the recommended test structure is:

```
tests/
├── unit/
│   ├── components/     # Component tests
│   ├── hooks/          # Hook tests
│   └── services/       # Service tests
├── integration/          # Integration tests
└── e2e/                  # End-to-end tests
```

### Test File Naming Convention

```typescript
# Test file naming

testComponent.spec.tsx      # .spec.tsx suffix (preferred)
component.test.tsx          # .test.tsx suffix (alternative)
```

## Unit Testing

### Unit Testing Framework

Use Vitest with React Testing Library:

**Installation:**
```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D jsdom
```

**Configuration:** Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

### Component Test Structure

**Example: LoginPage.test.tsx**

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

## Integration Testing

### Integration Test Structure

Integration tests verify the interaction between different components and services without requiring the actual backend API.

**Example: authService.test.ts**

```typescript
// tests/services/authService.test.ts
import { authService } from '../../services/authService';
import { apiClient } from '../../services/apiClient';

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle login successfully', async () => {
    const mockResponse = { status: 'success', data: { token: 'fake-token', user: { role: 'admin' } } };
    apiClient.post.mockResolvedValueOnce(mockResponse);
    
    const result = await authService.login('test@example.com', 'password123');
    
    expect(apiClient.post).toHaveBeenCalledWith('/users/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.token).toBe('fake-token');
  });
});
```

## End-to-End Testing

### E2E Test Framework

Use Playwright (already configured in package.json):

**Installation:** Playwright is already installed as dev dependency.

**Setup:**

```bash
# Initialize Playwright
npx playwright install

# Create a test example
npx playwright test --create
```

**Example: Login E2E Test**

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('should login successfully with valid credentials', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Fill in login form
  await page.fill('[data-testid="email-input"]', 'test@example.com');
  await page.fill('[data-testid="password-input"]', 'password123');
  
  // Click login button
  await page.click('[data-testid="login-button"]');
  
  // Wait for navigation to complete
  await page.waitForURL('/');
  
  // Verify login succeeded
  expect(page.url()).not.toContain('/login');
  expect(await page.locator('[data-testid="user-menu"]')).toBeVisible();
});

 test('should show error on invalid credentials', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('[data-testid="email-input"]', 'wrong@example.com');
  await page.fill('[data-testid="password-input"]', 'wrongpassword');
  
  await page.click('[data-testid="login-button"]');
  
  // Verify error message
  expect(await page.locator('[data-testid="error-message"]')).toBeVisible();
  expect(await page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
});
```

## Security Testing

### Security Testing Requirements

Based on SECURITY.md, the following security testing must be implemented:

#### 9.1 Testing Requirements

- **Unit Tests**: Authentication and authorization logic
- **Integration Tests**: API security endpoints  
- **Penetration Testing**: Regular security assessments
- **Code Reviews**: Security-focused code reviews

#### 9.2 Common Vulnerability Tests

- **JWT Token Validation**: Token format, signature verification
- **Input Validation**: XSS, SQL injection prevention
- **Authorization Bypasses**: Role escalation attempts
- **Session Security**: Session fixation, token leakage

### Security Test Examples

**Example: Input Validation Test**

```typescript
// tests/unit/components/ProductForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '../../components/ProductForm';

test('should reject XSS in product name', async () => {
  render(<ProductForm onSubmit={jest.fn()} />);
  
  const xssPayload = '<script>alert("xss")</script>';
  fireEvent.change(screen.getByLabelText(/product name/i), {
    target: { value: xssPayload }
  });
  
  // Verify the component sanitizes the input
  await waitFor(() => {
    expect(screen.getByLabelText(/product name/i)).not.toHaveValue(xssPayload);
  });
});
```

## Testing Strategies

### Test-Driven Development (TDD)

1. **Write failing test first** - Define the expected behavior
2. **Implement minimum code** to make the test pass
3. **Refactor** - Ensure tests still pass while improving code quality

### Mocking Strategy

- **API calls**: Use MSW (Mock Service Worker) or jest mocks
- **LocalStorage**: Use `jest.spyOn(localStorage, 'getItem')`
- **Navigation**: Use `react-router-dom`'s `MemoryRouter`
- **Components**: Isolate components from external dependencies

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage for critical paths
- **Component Tests**: 70%+ coverage for UI components
- **Security Tests**: 100% for authentication flows
- **Integration Tests**: 60%+ for service interactions

## Test Setup

### Global Test Setup

Create `tests/setup.ts`:

```typescript
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
vi.mock('localStorage', () => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

### Environment Configuration

**Test Environment Variables:**

```bash
# tests/.env
VITE_API_BASE_URL=http://test-api.medix.pharmacy/v1
NODE_ENV=test
```

## Testing Development Commands

### Commands to Add to package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test && npm run test:e2e",
    "test:security": "vitest tests/unit/ tests/integration/ --grep security",
    "lint:test": "eslint tests/"
  }
}
```

### Daily Commands

```bash
# Start Vitest in watch mode
npm run test

# Run tests once
npm run test -- --run

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

## Testing Best Practices

### 1. Test Isolation

- Each test should be independent
- Use beforeEach/afterEach for setup/teardown
- Mock external dependencies
- Clean up localStorage between tests

### 2. Test Structure

- Use describe blocks for related tests
- Use it blocks for individual test cases
- Include clear test descriptions
- Use beforeEach for shared setup

### 3. Error Handling

- Test error states and edge cases
- Verify error messages are user-friendly
- Test network failures
- Test validation failures

### 4. Accessibility Testing

- Test keyboard navigation
- Verify ARIA labels are correct
- Test screen reader compatibility
- Test color contrast in dark mode

## Test Development Workflow

### Phase 1: Initial Setup

1. Configure test runner (Vitest recommended)
2. Set up test directory structure
3. Create global test setup
4. Configure environment variables
5. Add test scripts to package.json

### Phase 2: Core Feature Testing

1. Identify critical user flows
2. Write unit tests for components
3. Write integration tests for services
4. Write E2E tests for user workflows
5. Implement tests alongside features

### Phase 3: Security Testing

1. Implement authentication tests
2. Add input validation tests
3. Create security vulnerability tests
4. Add authorization tests

### Phase 4: Quality Assurance

1. Run all tests regularly
2. Maintain test coverage goals
3. Review security tests
4. Update tests as application changes

## Implementation Roadmap

### Immediate Actions (Week 1-2)

1. Set up Vitest test runner
2. Create test directory structure
3. Write tests for authentication flow
4. Write tests for medicine management UI

### Short-term Actions (Week 3-4)

1. Implement integration tests for API services
2. Add E2E tests for key workflows
3. Create security test suite
4. Set up CI/CD pipeline integration

### Long-term Actions (Month 2+)

1. Achieve 80%+ test coverage
2. Implement automated security scanning
3. Add performance testing
4. Establish testing as part of the development workflow

## Conclusion

Testing is critical for maintaining the reliability and security of the Medix pharmacy application. This guide provides a comprehensive testing strategy that covers all aspects of the application while maintaining the quality and performance standards established in the project's code style guide.

Implement the testing setup incrementally, starting with unit tests for critical components and expanding to integration and E2E testing as the testing infrastructure matures.