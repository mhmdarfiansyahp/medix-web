# Environment Variables Documentation - Medix Web

This document describes all environment variables, LocalStorage keys, and configuration options used in the **Medix Web** application.

---

## 1. Vite Environment Variables

### 1.1 Core Variables

| Variable | Type | Default | Description | Required |
| :--- | :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | string | `http://localhost:8080/api/v1` | Base URL for the backend API | No |

### 1.2 Usage Examples

```bash
# Development
npm run dev
# Uses default: http://localhost:8080/api/v1

# Production with custom backend
VITE_API_BASE_URL=https://api.medix.pharmacy/v1 npm run build
```

---

## 2. LocalStorage Keys

The application uses `localStorage` for client-side data storage:

### 2.1 Authentication Keys

| Key | Purpose | Data Type | Security Level |
| :--- | :--- | :--- | :--- |
| `medix_token` | JWT Access Token | string | Sensitive |
| `medix_user` | User profile data | JSON object | Sensitive |

### 2.2 Key Management

```javascript
// Access token
localStorage.getItem('medix_token') // Returns JWT string
localStorage.setItem('medix_token', jwtToken)

// User profile
localStorage.getItem('medix_user') // Returns JSON string
localStorage.setItem('medix_user', JSON.stringify(userData))
```

---

## 3. Demo Credentials (`.env.demo`)

**⚠️ SECURITY WARNING**: This file contains demo credentials for development purposes only. **NEVER** use these credentials in production.

### 3.1 Demo Users

| Role | Username | Password | Default Permissions |
| :--- | :--- | :--- | :--- |
| Admin | `admin` | `admin123` | Full system access |
| Cashier | `kasir` | `kasir123` | Transaction & settings |
| Owner | `owner` | `owner123` | Dashboard, reports, settings |

### 3.2 Usage in Development

```bash
# Create .env file from .env.demo
cp .env.demo .env

# In development, you can override these in .env
ROLE_ADMIN_USER=admin_user
ROLE_ADMIN_PASS=secure_password_123
```

---

## 4. Environment Configuration

### 4.1 Development Environment

```bash
# Standard development setup
VITE_API_BASE_URL=http://localhost:8080/api/v1
NODE_ENV=development
```

### 4.2 Production Environment

```bash
# Production setup
VITE_API_BASE_URL=https://api.medix.pharmacy/v1
NODE_ENV=production
```

### 4.3 Testing Environment

```bash
# Testing setup
VITE_API_BASE_URL=http://test-api.medix.pharmacy/v1
NODE_ENV=test
```

---

## 5. API Configuration

### 5.1 Request Configuration

```javascript
// src/services/api.ts
const apiClient = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}
```

### 5.2 Response Handling

The API expects and returns the following structure:

```json
{
  "status": "success" | "error",
  "message": "Optional message",
  "data": { ... }, // Response data
  "pagination": { // Optional for paginated responses
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 6. Environment-Specific Behavior

### 6.1 API Endpoints

| Environment | API Base URL | Notes |
| :--- | :--- | :--- |
| Development | `http://localhost:8080/api/v1` | Backend runs on localhost:8080 |
| Staging | `https://staging-api.medix.pharmacy/v1` | Pre-production testing |
| Production | `https://api.medix.pharmacy/v1` | Live production |

### 6.2 Feature Flags

```javascript
// Example feature flag pattern
const FEATURE_FLAGS = {
  ENABLE_TESTING_MODE: import.meta.env.VITE_ENABLE_TESTING_MODE === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  MAINTENANCE_MODE: import.meta.env.VITE_MAINTENANCE_MODE === 'true'
}
```

---

## 7. Security Considerations

### 7.1 Environment File Security

**Important**:
- `.env` files should be added to `.gitignore`
- Never commit credentials to version control
- Use environment managers (AWS Secrets Manager, Azure Key Vault, etc.) in production
- Rotate credentials regularly

### 7.2 Sensitive Data Protection

```bash
# Add to .gitignore
.env
.env.local
.env.production
.env.staging
```

---

## 8. Configuration Validation

### 8.1 Required Variables

The following variables are checked at application startup:

```javascript
// Validation logic example
const validateEnv = () => {
  if (!import.meta.env.VITE_API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required')
  }
  
  // Additional validation can be added here
}
```

### 8.2 Default Fallbacks

If environment variables are not set, the application uses sensible defaults:

```javascript
const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
}
```

---

## 9. Docker & Container Configuration

### 9.1 Docker Environment Variables

```dockerfile
FROM node:18-alpine

# Build-time environment variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Runtime environment variables
ENV NODE_ENV=production
```

### 9.2 Docker Compose Example

```yaml
docker-compose.yml
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://backend:8080/api/v1
    depends_on:
      - backend

  backend:
    image: medix/backend:latest
    ports:
      - "8080:8080"
```

---

## 10. Monitoring & Logging

### 10.1 Environment Variables for Monitoring

```bash
# Monitoring configuration
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_LOG_LEVEL=info
```

### 10.2 Log Levels

- `debug`: Detailed debug information
- `info`: General application information
- `warn`: Warning messages
- `error`: Error messages only

---

## 11. Environment Variable Reference

### 11.1 Complete List

| Variable | Example | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend API base URL |
| `NODE_ENV` | `development|production|test` | Node environment |
| `VITE_ENABLE_ANALYTICS` | `true|false` | Analytics feature flag |
| `VITE_SENTRY_DSN` | `https://key@sentry.io/project` | Sentry error tracking |
| `VITE_LOG_LEVEL` | `debug|info|warn|error` | Logging level |

### 11.2 Variable Naming Convention

All Vite environment variables must use the `VITE_` prefix:

```bash
# Correct
VITE_API_BASE_URL=https://api.example.com/v1

# Incorrect (will not be available in code)
API_BASE_URL=https://api.example.com/v1
```

---

## 12. Environment Setup Commands

### 12.1 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 12.2 Environment File Management

```bash
# Copy demo environment
cp .env.demo .env

# Create environment for specific environment
cp .env.demo .env.production

# Remove sensitive files from git
 echo ".env" >> .gitignore
 echo ".env.local" >> .gitignore
```

---

## 13. Common Environment Issues

### 13.1 CORS Errors

**Symptom**: API requests fail with CORS errors
**Solution**: Ensure frontend and backend origins match or configure proper CORS headers

### 13.2 API Connection Issues

**Symptom**: Cannot connect to backend
**Solution**: Check `VITE_API_BASE_URL` and ensure backend is running

### 13.3 Build Errors

**Symptom**: Build fails in production
**Solution**: Ensure all required environment variables are set

---

## 14. Environment File Templates

### 14.1 Production Template

```bash
# .env.production
VITE_API_BASE_URL=https://api.medix.pharmacy/v1
NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=error
```

### 14.2 Development Template

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api/v1
NODE_ENV=development
VITE_ENABLE_ANALYTICS=false
VITE_LOG_LEVEL=debug
```

---

## 15. Environment Management Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment managers** in production
3. **Rotate credentials** regularly
4. **Use different environments** for development, testing, and production
5. **Document all environment variables** clearly
6. **Validate environment variables** at application startup
7. **Monitor environment-dependent functionality**
8. **Use secrets management** for sensitive configuration

---

## 16. Environment Variable Migration Guide

### 16.1 From Version 1.x to 2.x

If upgrading from version 1.x, update your `.env` file:

```bash
# Old
API_BASE_URL=http://localhost:8080/api/v1

# New
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 16.2 Environment Variable Changes

Check release notes for environment variable changes between versions.

---

## 17. Troubleshooting

### 17.1 Environment Variable Not Found

**Symptom**: `ReferenceError: process.env.VAR_NAME is not defined`
**Solution**: Prefix with `VITE_` for Vite environment variables

### 17.2 Default Values Not Working

**Symptom**: Application uses incorrect defaults
**Solution**: Check Vite configuration and environment file loading

### 17.3 Development vs Production Mismatch

**Symptom**: Different behavior in dev vs prod
**Solution**: Verify `NODE_ENV` and environment-specific configurations

---

## 18. Environment Variable Security Checklist

- [ ] `.env` files in `.gitignore`
- [ ] No `.env` files in version control
- [ ] Regular credential rotation
- [ ] Environment-specific configurations
- [ ] Sensitive data encrypted at rest
- [ ] Access controls on environment files
- [ ] Monitoring of environment variable changes
- [ ] Backup of environment configurations

---

## 19. Contact & Support

For environment configuration issues:
- Check this document first
- Contact development team with specific error messages
- Include environment details (`NODE_ENV`, `VITE_API_BASE_URL`)
- Provide `.env` file contents (without sensitive values)