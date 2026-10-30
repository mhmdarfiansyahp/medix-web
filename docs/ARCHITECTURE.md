# Architecture Documentation - Medix Web

This document describes the software architecture, directory structure, data flow, and design patterns used in the Medix Web application.

---

## 1. Technology Summary (Tech Stack)

* **Core Framework**: React 19 + TypeScript + Vite 8
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
* **Routing**: React Router v7 (`react-router-dom`)
* **Tables**: `@tanstack/react-table`
* **Charts**: `recharts`
* **Alerts/Modals**: `sweetalert2` + `sweetalert2-react-content`
* **Icons**: `lucide-react`
* **HTTP Client**: Native `fetch` API with custom `ApiClient` wrapper (`src/services/api.ts`)

---

## 2. Source Directory Structure (`src/`)

```
src/
├── assets/             # Static assets (images, logos)
├── components/         # Global UI components / layout
│   └── layout/         # Layout, Navbar, Sidebar
├── features/           # Feature-driven modules (Feature-Driven Architecture)
│   ├── dashboard/      # Sales statistics & medication summary
│   ├── drugs/          # Medicine management & drug categories
│   ├── reports/        # Sales & drug ranking reports
│   ├── transactions/   # Cashier, POS, shopping cart, receipt printing
│   └── users/          # User management & profile
├── hooks/              # Global custom hooks (example: useAuth)
├── pages/              # Route-level page components
├── routes/             # Routing + guards
├── services/           # API clients and backend service modules
├── types/              # Shared/global types
└── utils/              # Utilities (sweetalert, helpers)
```

---

## 3. Architectural Patterns & Principles

### 3.1 Feature-Driven Architecture
Code is organized by business domain in `src/features/`. Each feature has a self-contained structure:
* `components/`: UI components specific to the feature.
* `hooks/`: Custom React hooks for data fetching and feature logic.
* `types/`: Internal type definitions/interfaces for the feature.

### 3.2 Service Layer & API Client (`src/services/`)
All HTTP interactions with the backend are isolated in the service layer:
* **`api.ts` (`ApiClient`)**:
  * Uses standard `fetch` API with basic configuration (`VITE_API_BASE_URL`).
  * Automatically attaches JWT token via `Authorization: Bearer <token>` header.
  * Handles automatic token refresh (401 response handling) and redirects to login if session expires.
  * Prevents XSS/HTTP Parameter Pollution with `encodePathParam` and `buildUrl`.
* **`api-helpers.ts`**:
  * Normalizes backend response envelope `{ status, message, data, pagination }`.
  * Provides standardized error extraction and data handling.

### 3.3 Authentication & Authorization (Auth & RBAC)
* **Token Storage**: JWT Access Token stored in `localStorage` (`medix_token`). User login data cached in `medix_user`.
* **Role-Based Access Control (RBAC)**:
  * Three main roles: `admin`, `kasir`, and `owner`.
  * Detailed access permissions set in `src/utils/role.ts` (`PERMISSIONS`, `hasPermission`, `hasAnyPermission`).
* **Route Protection**:
  * `ProtectedRoute.tsx` checks token availability and user role match via `allowedRoles` prop.
  * Unauthenticated users are redirected to `/login`.
  * Users without proper role permissions are redirected to `/unauthorized`.
  * Sidebar filters menu items based on the current user's role.

---

## 4. Role Permission Matrix (RBAC Matrix)

| Feature / Page | Admin | Cashier | Owner |
| :--- | :---: | :---: | :---: |
| Dashboard | ✅ | ✅ | ✅ |
| Drug Management | ✅ | ❌ | ❌ |
| Drug Categories | ✅ | ❌ | ❌ |
| Stock Alerts | ✅ | ❌ | ❌ |
| Transactions / POS | ✅ | ✅ | ❌ |
| Reports | ✅ | ❌ | ✅ |
| User Management | ✅ | ❌ | ❌ |
| Profile Settings | ✅ | ✅ | ✅ |

---

## 5. Backend Integration (OpenAPI Alignment)

The application consumes a backend (Go/Gin) with base path `/api/v1`:

* **Auth**: `POST /users/login`, `GET /users/profile`, `PUT /users/profile`
* **Medicines**: `GET|POST /medicines`, `GET|PUT|PATCH|DELETE /medicines/:id`, `GET /medicines/barcode/:barcode`, `GET /medicines/alerts/{low-stock,expiring,summary}`
* **Drug Types**: `GET|POST /type-drugs`, `GET|PUT|DELETE /type-drugs/:id`
* **Transactions**: `GET|POST /transactions`, `GET /transactions/today`, `GET|PATCH /transactions/:id/{cancel,receipt}`
* **Reports**: `GET /reports/sales-summary`, `GET /reports/drug-ranking`, `GET /reports/export/excel`

---

## 6. Thermal Receipt Feature

The application has a special design specification for printing thermal receipts 80mm wide, configured in `src/index.css` under `@media print`:

* **Receipt Width**: Fixed `80mm`
* **Margins**: `0 auto` (centered), padding `6mm 5mm`
* **Colors**: Black text on white background (`color: #0f172a !important`)
* **Compliance**: Force `print-color-adjust: exact` so background and colors print correctly

---

## 7. Security & Best Practices

1. **Path Parameter Safety**: Uses `encodePathParam()` for all variable URL parameters to prevent injection attacks.
2. **Type Safety**: TypeScript with strict rules (`verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals`).
3. **Session Management**: Automatic clearing of `localStorage` and redirect when JWT token expires or becomes invalid (HTTP 401).
4. **Error Sanitization**: Error messages from backend are extracted and displayed safely via SweetAlert2 toast notifications.

---

## 8. Command Guide

```bash
npm run dev      # Run development server (Vite)
npm run build    # Compile TypeScript & build production bundle
npm run lint     # Lint code with ESLint
npm run preview  # Preview production build locally
```
