# Graph Report - medix-web  (2026-10-12)

## Corpus Check
- Corpus is ~30,105 words - fits in a single context window. You may not need a graph.

## Summary
- 425 nodes · 1024 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- User Management & Auth
- Returns Management
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- API Client & JWT
- Community 11
- Community 12
- Design System
- Social Icons
- Dashboard Types
- Community 16
- Brand & Icons
- Hero Image

## God Nodes (most connected - your core abstractions)
1. `react` - 33 edges
2. `lucide-react` - 32 edges
3. `formatCurrency()` - 24 edges
4. `apiClient` - 20 edges
5. `compilerOptions` - 18 edges
6. `showSuccessToast()` - 17 edges
7. `showErrorToast()` - 17 edges
8. `cn()` - 17 edges
9. `AppRoutes()` - 16 edges
10. `getErrorMessage()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `US-05 Edit & Nonaktifkan Obat` --shares_data_with--> `US-08w Input Transaksi (web fallback)`  [INFERRED]
  02-obat.md → 06-transaksi.md
- `Feature Hooks (useMedicines, useTransactions, useAlerts, useUsers ...)` --shares_data_with--> `Medicine (obat: nama, merk, jenis, harga, stok, kadaluarsa, barcode)`  [INFERRED]
  AGENTS.md → 02-obat.md
- `US-15 Grafik Penjualan (per metode bayar)` --shares_data_with--> `US-08w Input Transaksi (web fallback)`  [INFERRED]
  05-laporan-dashboard.md → 06-transaksi.md
- `US-17 Ekspor Laporan (PDF/Excel)` --shares_data_with--> `US-08w Input Transaksi (web fallback)`  [INFERRED]
  05-laporan-dashboard.md → 06-transaksi.md
- `Medix index.html entry (mounts /src/main.tsx)` --conceptually_related_to--> `AGENTS.md medix-web (React 19 + TS + Vite conventions)`  [INFERRED]
  index.html → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Authentication Flow** — 01_auth_us_01_login, 01_auth_us_02_sesi_login, 01_auth_jwt_token, agents_token_storage, agents_protected_route [INFERRED 0.85]
- **Medicine Management Backlog** — 02_obat_us_04_tambah_obat, 02_obat_us_05_edit_nonaktifkan_obat, 02_obat_us_06_cari_filter_obat, 02_obat_us_06b_input_massal, 02_obat_medicine [EXTRACTED 1.00]
- **Web Transaction Workflow** — 06_transaksi_us_08w_input_transaksi, 06_transaksi_us_09w_harga_snapshot, 06_transaksi_us_10w_batalkan_transaksi, 06_transaksi_us_12w_riwayat_transaksi, 06_approval_transaksi_us_20_approval_retur [EXTRACTED 1.00]

## Communities (20 total, 4 thin omitted)

### Community 0 - "User Management & Auth"
Cohesion: 0.08
Nodes (43): react, react-dom, UserFilterBar(), UserFilterBarProps, UserTable(), UserTableProps, UserModal(), UserModalProps (+35 more)

### Community 1 - "Returns Management"
Cohesion: 0.05
Nodes (44): dependencies, clsx, lucide-react, react, react-dom, react-router-dom, react-to-print, recharts (+36 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (30): lucide-react, CartModal(), CartModalProps, DrugSelectionModal(), DrugSelectionModalProps, ReceiptModal, ReceiptModalProps, receiptNo() (+22 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (25): @tanstack/react-table, AddMedicationModal(), AddMedicationModalProps, DrugFilterBar(), DrugFilterBarProps, columnHelper, DrugTable(), DrugTableProps (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (23): react-router-dom, App(), MainLayout(), Navbar(), ALL_NAV_ITEMS, getInitials(), Sidebar(), useAlerts() (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (23): CategoryFilterBar(), CategoryFilterBarProps, CategoryModal(), CategoryModalProps, CategoryTable(), CategoryTableProps, useTypeDrugs(), CreateTypeDrugRequest (+15 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (31): JWT Token (8h expiry, bcrypt-verified login), US-01 Login, US-02 Sesi Login, Medicine (obat: nama, merk, jenis, harga, stok, kadaluarsa, barcode), US-04 Tambah Obat, US-05 Edit & Nonaktifkan Obat, US-06 Cari & Filter Obat, US-06b Input Massal (Bulk) (+23 more)

### Community 7 - "Community 7"
Cohesion: 0.19
Nodes (19): DashboardHeader(), ExportReportModal(), ExportReportModalProps, MedicationTable(), MedicationTableProps, formatAxisValue(), SalesChart(), SalesChartProps (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (18): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+10 more)

### Community 10 - "API Client & JWT"
Cohesion: 0.21
Nodes (14): ReturnDetailModal(), ReturnDetailModalProps, useReturns(), UseReturnsReturn, ApproveReturnResponse, CreateReturnRequest, RejectReturnResponse, Return (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.24
Nodes (4): apiClient, decodeToken(), isTokenExpired(), isTokenValid()

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 13 - "Design System"
Cohesion: 0.38
Nodes (6): ASCII Bracket Markers [+] [-] [x] as iconography, Berkeley Mono (single monospaced face, all text roles), Hero TUI Mockup (only dark surface, faux terminal), OpenCode Design System (terminal-native marketing), Apple HIG Semantic Palette (accent/danger/warning/success), Warm Cream Canvas #fdfcfc

### Community 14 - "Social Icons"
Cohesion: 0.29
Nodes (7): Bluesky Icon, Discord Icon, Documentation Icon, GitHub Icon, Icon Sprite (icons.svg), Social Icon, X (Twitter) Icon

### Community 15 - "Dashboard Types"
Cohesion: 0.40
Nodes (4): InventoryAlert, MedicationPerformance, SalesTrend, StockStatus

## Knowledge Gaps
- **27 isolated node(s):** `@types/node`, `@types/react`, `@types/react-dom`, `@types/react-router-dom`, `autoprefixer` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 132 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `User Management & Auth` to `Returns Management`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 7`, `API Client & JWT`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **What connects `@types/node`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `User Management & Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.08302485457429931 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Community 2` to `User Management & Auth`, `Returns Management`, `Community 3`, `Community 4`, `Community 5`, `Community 7`, `API Client & JWT`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Should `Returns Management` be split into smaller, more focused modules?**
  _Cohesion score 0.04902867715078631 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `Community 9` to `Returns Management`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12195121951219512 - nodes in this community are weakly interconnected._