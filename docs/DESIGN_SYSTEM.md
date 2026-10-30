# Design System Documentation - Medix Web

This document defines the visual standards, design tokens, and component guidelines for the **Medix Web** application. The application uses **Tailwind CSS v4** with a utility-first approach.

---

## 1. Design Tokens

### 1.1 Colors
The application uses standard Tailwind CSS v4 color palette, with emphasis on:
* **Primary**: Dark blue/slate (for pharmacy branding)
* **Success/Error**: Semantic colors for transaction status & stock alerts
* **Neutral**: Slate/gray for typography and backgrounds

### 1.2 Typography
* **Font**: System font (browser default sans-serif)
* **Scale**: Standard Tailwind text utilities (`text-sm`, `text-base`, `text-lg`, `text-2xl`, etc.)

### 1.3 Spacing
* Uses standard Tailwind spacing scale (`m-4`, `p-6`, `gap-4`, etc.) for layout consistency

---

## 2. Component Library

### 2.1 Layout Components
* **Main Layout (`MainLayout`)**: Wrapper for pages with grid sidebar + content
* **Sidebar**: Lateral navigation, responsive, and role-aware
* **Navbar**: Top header for profile & quick actions

### 2.2 Data Components
* **Tables (`@tanstack/react-table`)**: Used throughout management pages (Medicines, Users, Transactions)
    * *Style*: Border-collapse, optional zebra striping, hover state on rows
* **Charts (`recharts`)**: Data visualization on Dashboard & Reports
    * *Palette*: Consistent with application theme

### 2.3 Feedback Components
* **Toasts/Alerts (`sweetalert2`)**:
    * *Success*: Green notification
    * *Error*: Red notification
    * *Confirm*: Modal dialog for destructive actions (Delete data, Cancel transaction)

### 2.4 Modal Components
* Used for CRUD (Add/Edit) and transaction flows (Cart, Checkout)
* *Style*: Semi-transparent background, centered content, responsive

---

## 3. Thermal Receipt Design

The application has special thermal receipt printing design for 80mm printers configured in `src/index.css` under `@media print`:

* **Receipt Width**: Fixed `80mm`
* **Margins**: `0 auto` (centered), padding `6mm 5mm`
* **Colors**: Black text on white background (`color: #0f172a !important`)
* **Compliance**: Force `print-color-adjust: exact` so background and colors print correctly

---

## 4. Usage Guidelines

1. **Utility-First**: Use Tailwind utilities directly in components. Don't create additional CSS files unless for print overrides or global resets.
2. **Consistency**: Use `lucide-react` for all icons for uniform styling.
3. **Responsiveness**: Use Tailwind breakpoint modifiers (`md:`, `lg:`) to ensure optimal display on tablets through wide desktops.
4. **Interaction**:
    * Use hover transitions (`transition-colors duration-200`) for all buttons
    * Show loading states (spinner/disabled) on buttons during API operations

---

## 5. External Resources
* **Icons**: [Lucide React](https://lucide.dev/)
* **Charts**: [Recharts](https://recharts.org/)
* **Tables**: [TanStack Table](https://tanstack.com/table/v8)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
