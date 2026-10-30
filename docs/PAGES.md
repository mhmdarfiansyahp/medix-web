# Pages Documentation - Medix Web

This document describes all available pages in the **Medix Web** application, their URL routes, access permissions, function descriptions, and the components/hooks used on each page.

---

## 1. Route & Access Summary

| URL Path | Page Name | Access / Role | Layout | Brief Description |
| :--- | :--- | :--- | :--- | :--- |
| `/login` | Login Page | Public | Plain | Authentication form with email/username & password. |
| `/forgot-password` | Forgot Password Page | Public | Plain | Password recovery request form. |
| `/reset-password` | Reset Password Page | Public | Plain | New password form from reset link. |
| `/unauthorized` | Unauthorized Page | Public (Authenticated) | Plain | Access denied warning page (403). |
| `/dashboard` | Dashboard Page | `admin`, `kasir`, `owner` | Main Layout | Sales statistics & medication inventory summary. |
| `/drug-management` | Drug Management | `admin` | Main Layout | Master data management for medicines, add/edit/delete/filter. |
| `/drug-categories` | Drug Categories | `admin` | Main Layout | Management of medicine types/categories (`type-drugs`). |
| `/stock-alerts/low-stock` | Stock Alerts (Low Stock) | `admin` | Main Layout | List of medicines with critical stock levels. |
| `/stock-alerts/expiring-soon` | Stock Alerts (Expiring) | `admin` | Main Layout | List of medicines approaching expiration dates. |
| `/transactions` | Transactions / POS | `admin`, `kasir`, `owner` | Main Layout | Cashier transactions, shopping cart, checkout & receipt printing. |
| `/reports` | Reports Page | `admin`, `owner` | Main Layout | Sales reports, product analysis, Excel export. |
| `/users` | User Management | `admin` | Main Layout | System user management, add/edit users, roles. |
| `/settings` | Settings Page | `admin`, `kasir`, `owner` | Main Layout | Current user profile settings & password change. |

---

## 2. Page Details

### 1. Public Pages

#### 1.1 Login Page (`/login`)
* **File**: `src/pages/LoginPage.tsx`
* **Features & Functions**:
  * Username/email and password input fields.
  * "Remember Me" option.
  * Integration with `authService.login()`.
  * JWT Access Token storage to `localStorage`.
  * Automatic redirection to `/dashboard` after successful login.
* **Service / Hooks**: `authService`

#### 1.2 Forgot & Reset Password Pages (`/forgot-password`, `/reset-password`)
* **File**: `src/pages/ForgotPasswordPage.tsx`
* **Features & Functions**:
  * Email input for password reset request.
  * New password form.

#### 1.3 Unauthorized Page (`/unauthorized`)
* **File**: `src/pages/UnauthorizedPage.tsx`
* **Features & Functions**:
  * Displayed when users attempt to access pages unauthorized for their role.
  * Button to navigate back to Dashboard.

---

### 2. Protected Pages

#### 2.1 Dashboard Page (`/dashboard`)
* **File**: `src/pages/DashboardPage.tsx`
* **Access Permissions**: `admin`, `kasir`, `owner`
* **Features & Functions**:
  * KPI cards (Total Medicines, Today's Sales, Critical Stock, Expiring Soon).
  * Monthly/daily sales charts (`SalesChart` via `recharts`).
  * Summary medication availability table.
  * Quick actions (Add medication, Export report).
* **Components Used**: `DashboardHeader`, `SalesChart`, `MedicationTable`, `AddMedicationModal`, `ExportReportModal`
* **Hooks**: `useMedicines`, `useAlerts`

#### 2.2 Drug Management Page (`/drug-management`)
* **File**: `src/pages/DrugManagementPage.tsx`
* **Access Permissions**: `admin`
* **Features & Functions**:
  * Master table data for medicines using `@tanstack/react-table`.
  * Search medicines by name/SKU/barcode.
  * Filter by medicine category and stock availability status.
  * CRUD operations (Add, Edit, Delete, Detail modal).
  * Toggle active/inactive medicine status.
* **Components Used**: `DrugFilterBar`, `DrugTable`, `AddMedicationModal`
* **Hooks**: `useMedicines`, `useTypeDrugs`

#### 2.3 Drug Categories Page (`/drug-categories`)
* **File**: `src/pages/DrugCategoriesPage.tsx`
* **Access Permissions**: `admin`
* **Features & Functions**:
  * Management of medicine types/categories (`type-drugs`).
  * Search and creation of new categories.
  * Edit and delete category confirmation modal.
* **Components Used**: `CategoryFilterBar`, `CategoryTable`, `CategoryModal`
* **Hooks**: `useTypeDrugs`

#### 2.4 Stock Alerts Page (`/stock-alerts/low-stock`, `/stock-alerts/expiring-soon`)
* **File**: `src/pages/StockAlertsPage.tsx`
* **Access Permissions**: `admin`
* **Features & Functions**:
  * Tab navigation between **Low Stock** and **Expiring Soon**.
  * Periodic monitoring (polling interval) for stock alerts.
  * Quick stock update directly from the table.
* **Hooks**: `useAlerts`

#### 2.5 Transactions / POS Page (`/transactions`)
* **File**: `src/pages/TransactionsPage.tsx`
* **Access Permissions**: `admin`, `kasir`, `owner`
* **Features & Functions**:
  * Quick search via text input or barcode scanner.
  * Interactive shopping cart (add/remove quantity, delete items).
  * Calculation of subtotal, discounts, taxes, and grand total.
  * Checkout modal (payment methods: Cash, QRIS, Transfer, Debit).
  * Thermal receipt printing modal 80mm via `@media print`.
  * Daily transaction history and transaction cancellation option.
* **Components Used**: `DrugSelectionModal`, `CartModal`, `CheckoutModal`, `ReceiptModal`, `TransactionTable`, `TransactionSummary`
* **Hooks**: `useTransactions`, `useMedicines`

#### 2.6 Reports Page (`/reports`)
* **File**: `src/pages/ReportsPage.tsx`
* **Access Permissions**: `admin`, `owner`
* **Features & Functions**:
  * Sales performance summary by date range.
  * Best-selling/least-selling drug ranking table.
  * Excel report download and export.
* **Hooks**: `useReports`

#### 2.7 Users Page (`/users`)
* **File**: `src/pages/UsersPage.tsx`
* **Access Permissions**: `admin`
* **Features & Functions**:
  * System user management (Admin, Cashier, Owner).
  * Filter by role and active status.
  * Add and edit user modal.
  * Admin password reset for users.
* **Components Used**: `UserFilterBar`, `UserManagementTable`, `UserModal`
* **Hooks**: `useUsers`

#### 2.8 Settings Page (`/settings`)
* **File**: `src/pages/SettingsPage.tsx`
* **Access Permissions**: `admin`, `kasir`, `owner`
* **Features & Functions**:
  * Current user's profile settings (Name, Email, Phone Number).
  * Account password change form.
* **Hooks**: `useProfile`

---

## 3. Utility Layout Components

All protected pages are wrapped by the main layout:
* **`MainLayout` (`src/components/layout/Layout.tsx`)**: Includes left sidebar and top navbar.
* **`Sidebar` (`src/components/layout/Sidebar.tsx`)**: Lateral navigation, responsive, and role-aware.
* **`Navbar` (`src/components/layout/Navbar.tsx`)**: Displays user name, role badge, and logout button.
