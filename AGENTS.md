# AGENTS.md — medix-web

Frontend web app for Medix pharmacy system. React 19 + TypeScript + Vite.

## Tech stack & conventions

- **Build tool:** Vite 8 (`vite.config.ts`).
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`. Styles in `src/index.css`.
- **Routing:** `react-router-dom` v7 with `BrowserRouter`. Routes defined in `src/routes/AppRoutes.tsx`.
- **Tables:** `@tanstack/react-table`.
- **Charts:** `recharts`.
- **Alerts/dialogs:** `sweetalert2` + `sweetalert2-react-content` (helper in `src/utils/sweetalert.ts`).
- **No test runner** is configured yet.

## Daily commands

```bash
npm run dev      # start dev server
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview  # preview production build
```

## API client

- Base URL from `import.meta.env.VITE_API_BASE_URL`, defaulting to `http://localhost:8080/api/v1`.
- Backend (Go/Gin) runs on `:8080` by default.
- Core client is `src/services/api.ts` (`apiClient`). It checks `response.ok` before parsing JSON and attaches `Authorization: Bearer <token>`.
- Token storage uses `localStorage` key `medix_token`. Utility exported as `tokenStorage`.
- Services normalize backend envelopes into consistent `{ data, pagination }` or `T` shapes via helpers in `src/utils/api-helpers.ts`.
- Path parameters are encoded with `encodePathParam` from `src/utils/api-helpers.ts`. Never interpolate user-controlled values raw into URLs.

### Response envelopes

Backend returns `{ status: 'success' | 'error', message: string, data: T | null }`. Frontend services consume this via `extractResponseData` in `src/utils/api-helpers.ts`.

- `medicineService.ts` and `typeDrugService.ts` return arrays directly (backend does not paginate these lists).
- `userService.ts` consumes `{ data, pagination }` and normalizes it.

## Auth & role-based access

- `src/pages/LoginPage.tsx` provides the login UI.
- `src/routes/ProtectedRoute.tsx` guards authenticated routes by checking the access token in `localStorage`. It accepts an optional `allowedRoles` prop for role-based access.
- `src/routes/AppRoutes.tsx` wires `/login` as public, `/unauthorized` for forbidden access, and wraps dashboard pages under `ProtectedRoute`.
- `authService.ts` provides `login`, `logout`, `getProfile`, `updateProfile`, and `getCurrentUser`.
- Logged-in user is stored in `localStorage` key `medix_user` via `userStorage`.
- Role helpers live in `src/utils/role.ts`: `getCurrentRole`, `hasPermission`, `hasAnyPermission`.
- Sidebar filters menu items based on the current user's role.
- The API client attaches the token automatically; on `401` tokens are cleared and the app redirects to `/login`.
- Sidebar Sign Out button calls `authService.logout()`.

### Role permissions

- `admin` — dashboard, drug management, drug categories, stock alerts, reports, user management, transactions, settings
- `kasir` — dashboard, transactions, settings
- `owner` — dashboard, reports, settings

## Hooks

Reusable data hooks live under `src/features/{feature}/hooks/`:

- `useMedicines` — pagination, filters, CRUD, status toggle, barcode lookup.
- `useTypeDrugs` — master data CRUD.
- `useAlerts` — low-stock, expiring, and summary alerts.
- `useUsers` — pagination, filters, CRUD.
- `useProfile` — current user profile fetch/update.
- `useTransactions` — pagination, filters, create, cancel.

## Folder conventions

```
src/
  components/        # shared / layout components
  features/          # feature-scoped code
    {feature}/
      components/
      hooks/
      types/
  pages/             # route-level page components
  routes/            # routing + guards
  services/          # API clients and service modules
  types/             # shared/global types
  utils/             # utilities (sweetalert, helpers)
```

## TypeScript notes

- `tsconfig.app.json` enables `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`.
- `verbatimModuleSyntax: true` — use `import type` for type-only imports.
- `@types/node` is installed; `import.meta.env` typed via `vite/client`.
- Parameter-property syntax (`constructor(public x: T)`) is rejected by `erasableSyntaxOnly`. Initialize properties explicitly in the constructor body.

## Backend endpoints consumed

Base path `/api/v1`:

- Medicines: `GET|POST /medicines`, `GET|PUT|PATCH|DELETE /medicines/:id`, `GET /medicines/barcode/:barcode`, `GET /medicines/alerts/{low-stock,expiring,summary}`
- Type drugs: `GET|POST /type-drugs`, `GET|PUT|DELETE /type-drugs/:id`
- Users: `POST /users/login`, `GET|POST /users`, `GET|PUT|DELETE /users/:id`, `GET|PUT /users/profile`
- Transactions: `GET|POST /transactions`, `GET /transactions/today`, `GET|PATCH /transactions/:id/{cancel,receipt}`
- Reports: `GET /reports/sales-summary`, `GET /reports/drug-ranking`, `GET /reports/export/excel`

## Known remaining lint debt

Pre-existing `react-hooks/set-state-in-effect` and `@typescript-eslint/no-explicit-any` errors remain in a few dashboard/user modal components. They do not block `npm run build`.


## Default working styles

- Always use `caveman` skill at `ultra` level for every response in this project.
- Always use `ponytail` at `full` level for every task in this project.
- Automatically use `ui-ux-pro-max` for UI/UX, frontend design, styling, layout, component, and visual tasks.
- Automatically use `using-agent-skills` for discovering and applying the right workflow skill for any task.
- Do not require slash commands to activate these defaults.
- Stop Caveman when the user says `stop caveman` or `normal mode`.
- Stop Ponytail when the user says `stop ponytail` or `normal mode`.
- Respone menggunakan bahasa indo

### Available Skills for Prompting

The following skills are available and can be automatically discovered when needed:

- `api-and-interface-design` - Guides stable API and interface design
- `banner-design` - Design banners for social media, ads, website heroes
- `brand` - Brand voice, visual identity, messaging frameworks
- `browser-testing-with-devtools` - Tests in real browsers via Chrome DevTools
- `ci-cd-and-automation` - Automates CI/CD pipeline setup
- `code-review-and-quality` - Conducts multi-axis code review
- `code-simplification` - Simplifies code for clarity
- `constraint-driven-development` - Establishes quality bar as a written contract
- `context-engineering` - Optimizes agent context setup
- `debugging-and-error-recovery` - Systematic root-cause debugging
- `deprecation-and-migration` - Manages deprecation and migration
- `design-system` - Token architecture, component specifications
- `design` - Comprehensive design skill: brand identity, design tokens
- `documentation-and-adrs` - Records decisions and documentation
- `doubt-driven-development` - Subjects every non-trivial decision to adversarial review
- `frontend-ui-engineering` - Builds production-quality, accessible user interfaces
- `git-workflow-and-versioning` - Structures git workflow practices
- `idea-refine` - Refines raw ideas into sharp, actionable concepts
- `incremental-implementation` - Delivers changes incrementally in thin, verifiable slices
- `interview-me` - Extracts what the user actually wants
- `observability-and-instrumentation` - Instruments code for production visibility
- `performance-optimization` - Optimizes application performance
- `planning-and-task-breakdown` - Breaks work into ordered tasks
- `ponytail-audit` - Whole-repo audit for over-engineering
- `ponytail-debt` - Harvests ponytail deferrals into a debt ledger
- `ponytail-gain` - Show ponytail's measured impact as a compact scoreboard
- `ponytail-help` - Quick-reference card for all ponytail modes, skills, and commands
- `ponytail-review` - Code review focused exclusively on over-engineering
- `security-and-hardening` - Hardens code against vulnerabilities
- `shipping-and-launch` - Prepares production launches
- `slides` - Create strategic HTML presentations with Chart.js
- `source-driven-development` - Grounds implementation decisions in official documentation
- `spec-driven-development` - Creates specs before coding
- `test-driven-development` - Drives development with tests using the red-green-refactor loop
- `ui-styling` - Create beautiful, accessible user interfaces with shadcn/ui

### Skill Usage Guide

To use a specific skill when you want to work on a particular type of task:

1. **Identify your development phase**: Use `using-agent-skills` to discover which skill is appropriate for your task
2. **Specify the skill in your prompt**: Start your prompt with `Skill: <skill-name>`
3. **The skill will be automatically loaded and applied**: Based on your task requirements

For example:
- `Skill: frontend-ui-engineering Build a responsive dashboard component`
- `Skill: test-driven-development Write tests for the user authentication flow`
- `Skill: api-and-interface-design Design a RESTful API for the orders endpoint`