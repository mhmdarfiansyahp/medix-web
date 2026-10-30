# Security Documentation - Medix Web

This document outlines the security architecture, practices, and guidelines for the **Medix Web** application. The application implements multiple layers of security to protect user data, prevent unauthorized access, and ensure safe operation.

---

## 1. Authentication & Authorization

### 1.1 Authentication Flow
* **Protocol**: JWT (JSON Web Token) based authentication
* **Token Storage**: JWT Access Token stored in `localStorage` with key `medix_token`
* **Refresh Mechanism**: Automatic token refresh on 401 responses (see `ApiClient` implementation)
* **User Data**: User profile data cached in `localStorage` with key `medix_user`

### 1.2 Role-Based Access Control (RBAC)
* **Roles**: Three distinct roles:
  * `admin`: Full system access (dashboard, drug management, categories, alerts, reports, user management, transactions, settings)
  * `kasir`: Transaction & settings access (dashboard, transactions, settings)
  * `owner`: Limited access (dashboard, reports, settings)
* **Permission Matrix**: Defined in `src/utils/role.ts` with `hasPermission()` and `hasAnyPermission()` helper functions
* **Route Protection**: `ProtectedRoute.tsx` enforces role-based access control
* **Sidebar Navigation**: Dynamic menu filtering based on user permissions

---

## 2. API Security

### 2.1 Token Management
* **Automatic Attachment**: Tokens automatically added to request headers via `ApiClient`
* **401 Handling**: Automatic token refresh attempt; redirect to login on failure
* **Secure Storage**: JWT tokens stored in `localStorage` (consider HttpOnly cookies in production)

### 2.2 Input Validation & Sanitization
* **Path Parameters**: All path parameters encoded via `encodePathParam()` from `src/utils/api-helpers.ts`
* **URL Building**: Safe URL construction via `buildUrl()` to prevent injection
* **Response Sanitization**: Error messages from backend sanitized before display
* **Content-Type**: Proper request headers set for JSON content

### 2.3 Rate Limiting & Throttling
* **Client-side**: Implemented in hooks (e.g., 30s polling for alerts with fallback to SSE/WebSocket)
* **Server-side**: Implemented in Go/Gin backend (see OpenAPI spec)

---

## 3. Client-Side Security

### 3.1 Local Storage Security
* **Token Cleanup**: Automatic token removal on login/logout and 401 responses
* **Session Management**: User session ends on token expiration or manual logout
* **Cross-Tab Synchronization**: Not implemented (single tab session)

### 3.2 CORS & CSP
* **CORS**: Configured in backend (see OpenAPI spec)
* **CSP**: Not explicitly configured (implement in production)

---

## 4. Data Protection

### 4.1 Sensitive Data Handling
* **Passwords**: Never stored client-side; only password reset tokens temporarily stored
* **Transaction Data**: Sensitive financial data encrypted during transmission (HTTPS)
* **Audit Logs**: All sensitive operations logged in backend

### 4.2 Error Handling
* **Information Leakage**: Generic error messages displayed to users
* **Debug Mode**: Disabled in production builds
* **Stack Traces**: Never exposed to end users

---

## 5. Network Security

### 5.1 HTTPS Requirements
* **Protocol**: All API calls must use HTTPS in production
* **Certificate**: Valid SSL/TLS certificates required
* **Mixed Content**: Prevents HTTP resources on HTTPS pages

### 5.2 Security Headers
* **To Implement in Production**:
  * `Content-Security-Policy`: Prevent XSS attacks
  * `Strict-Transport-Security`: Enforce HTTPS
  * `X-Content-Type-Options`: Prevent MIME sniffing
  * `X-Frame-Options`: Prevent clickjacking
  * `X-XSS-Protection`: Enable XSS filtering

---

## 6. Session Management

### 6.1 Session Lifespan
* **Access Token**: Short-lived (1-4 hours) with refresh capability
* **Refresh Token**: Long-lived, stored in `localStorage`
* **Idle Timeout**: Not implemented (consider adding)
* **Concurrent Sessions**: Not limited (single session per user)

### 6.2 Session Termination
* **Manual Logout**: `authService.logout()` clears tokens and redirects
* **Automatic Logout**: On token expiration (401 response)
* **Session Overflow**: Multiple tabs/logins possible (consider single session enforcement)

---

## 7. Third-Party Integrations

### 7.1 API Dependencies
* **Vite**: Local development server with HMR
* **React Router**: Client-side routing security
* **TanStack Table**: Data grid with built-in XSS protection
* **Recharts**: Chart library (sanitize external data)

### 7.2 Security Audits
* **Regular Updates**: Keep dependencies updated
* **Vulnerability Scanning**: Scheduled security audits
* **Dependency Monitoring**: Track known vulnerabilities (e.g., Snyk, GitHub Dependabot)

---

## 8. Production Deployment Security

### 8.1 Environment Configuration
* **Environment Variables**: Sensitive data in `.env` files
* **Build Secrets**: API keys, database credentials in environment variables
* **Configuration Management**: Environment-specific configurations

### 8.2 Deployment Hardening
* **Server Access**: Restrict server access to authorized IPs/users
* **Database Security**: SSL connections, encrypted at rest
* **File Uploads**: Not implemented (prevent in future if needed)
* **Logging**: Security-relevant logs to monitoring systems

---

## 9. Security Testing

### 9.1 Testing Requirements
* **Unit Tests**: Authentication and authorization logic
* **Integration Tests**: API security endpoints
* **Penetration Testing**: Regular security assessments
* **Code Reviews**: Security-focused code reviews

### 9.2 Common Vulnerability Tests
* **JWT Token Validation**: Token format, signature verification
* **Input Validation**: XSS, SQL injection prevention
* **Authorization Bypasses**: Role escalation attempts
* **Session Security**: Session fixation, token leakage

---

## 10. Incident Response

### 10.1 Security Incident Handling
* **Token Compromise**: Immediate token invalidation and user notification
* **Data Breach**: Investigation and user notification (if applicable)
* **Unauthorized Access**: Account lockout and security review
* **Vulnerability Disclosure**: Responsible reporting process

### 10.2 Monitoring & Alerting
* **Failed Login Attempts**: Rate limiting and account lockout
* **Unusual Activity**: Anomaly detection (to implement)
* **Security Events**: Logging of security-relevant activities

---

## 11. Future Security Enhancements

### 11.1 Recommended Improvements
* **HttpOnly Cookies**: Replace `localStorage` for JWT tokens
* **Refresh Token Rotation**: Implement refresh token rotation
* **Multi-Factor Authentication**: Add MFA support
* **Single Session Enforcement**: Prevent multiple concurrent sessions
* **Advanced CSP**: Implement Content Security Policy
* **RANSOMWARE Protection**: Email protection and backup security
* **API Gateway**: Centralized security enforcement

---

## 12. Compliance Requirements

### 12.1 Regulatory Considerations
* **GDPR**: User data protection and privacy rights
* **PCI DSS**: If payment processing implemented
* **HIPAA**: If health data processed
* **Local Regulations**: Compliance with applicable laws

---

## 13. Security Tools & References

* **Libraries**: Tailwind CSS, React Router, TanStack Table, Recharts, Lucide React
* **Security Standards**: OWASP Top 10, CWE, OWASP ASVS
* **Testing Tools**: Jest (for unit tests), Cypress (for E2E), OWASP ZAP
* **Monitoring**: Application performance monitoring (APM) systems
