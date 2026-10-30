# Demo Plan — Medix Web Playwright Recording

## Ringkasan Role & Permission

Sumber: `src/routes/AppRoutes.tsx` + `src/utils/role.ts` + `src/components/layout/Sidebar.tsx`

| Role    | Halaman yang Bisa Diakses                                                                                     |
|---------|---------------------------------------------------------------------------------------------------------------|
| admin   | Dashboard, Drug Management, Drug Categories, Notifications & Stock (Low Stock + Expiring Soon), Reports & Export, User Management, Transactions, Settings   |
| kasir   | Dashboard, Transactions, Settings                                                                              |
| owner   | Dashboard, Reports & Export, Settings                                                                          |

---

## Alur Demo per Role

### 1. Admin (`ROLE_ADMIN_USER` / `ROLE_ADMIN_PASS`)

| # | Halaman | Langkah Demo |
|---|---------|--------------|
| 1 | `/login` | Isi field **Username** + **Password**, klik tombol **Sign In**. Tunggu redirect ke `/dashboard`. |
| 2 | `/dashboard` | Scroll pelan ke bawah. Tunjukkan card Today's Revenue, Total Alerts, dan Sales Chart. |
| 3 | `/drug-management` | Klik menu sidebar **Drug Management**. <br>• Ketik search "paracetamol" di kolom filter, tunggu tabel terfilter, lalu reset. <br>• Klik tombol **Add New** → isi modal: Nama **DEMO-Paracetamol Test**, Brand **DEMO-Brand**, pilih kategori dari dropdown, Harga **25000**, Stok **100** → klik **Save**. <br>• Tunggu tabel refresh, klik tombol **Edit** di baris pertama → ubah stok jadi **200** → klik **Save**. <br>• Tutup modal. |
| 4 | `/drug-categories` | Klik menu sidebar **Drug Categories**. <br>• Klik tombol **Add New Category** → isi nama **DEMO-Kategori Test** → klik **Save**. |
| 5 | `/stock-alerts/low-stock` | Klik menu sidebar **Notifications & Stock** → klik sub-menu **Low Stock**. Scroll tabel. |
| 6 | `/stock-alerts/expiring-soon` | Dari sidebar, klik sub-menu **Expiring Soon**. Scroll tabel. |
| 7 | `/reports` | Klik menu sidebar **Reports & Export**. <br>• Ubah filter **Period** jadi **Daily**. <br>• Klik tombol **Export Report** → tunggu modal muncul → klik tombol **Download**. |
| 8 | `/users` | Klik menu sidebar **User Management**. <br>• Klik tombol **Add New User** → isi: Full Name **DEMO-User Test**, Username **demo-user-test**, Password **DemoPass123**, Confirm Password **DemoPass123** → klik **Save**. <br>• Tutup modal, klik tombol **Edit** di baris pertama → ubah Role jadi **admin** → klik **Save**. |
| 9 | `/transactions` | Klik menu sidebar **Transactions**. Klik tab **History** → scroll tabel. |
| 10 | `/settings` | Klik menu sidebar **Settings**. Scroll ke section profile → klik **Save Changes**. <br>• Tutup SweetAlert. |
| 11 | Logout | Klik tombol **Sign Out** di bagian bawah sidebar. |

---

### 2. Kasir (`ROLE_KASIR_USER` / `ROLE_KASIR_PASS`)

| # | Halaman | Langkah Demo |
|---|---------|--------------|
| 1 | `/login` | Isi field **Username** + **Password**, klik tombol **Sign In**. Tunggu redirect. |
| 2 | `/dashboard` | Scroll pelan ke bawah. Tunjukkan ringkasan transaksi hari ini. |
| 3 | `/transactions` | Klik menu sidebar **Transactions**. <br>• Klik tombol **New Transaction**. <br>• Di modal cart, ketik search "paracetamol". <br>• Klik tombol **Add** di baris obat pertama (2x untuk quantity 2). <br>• Klik tombol **Checkout**. <br>• Di modal payment, pilih metode **Cash**. <br>• Klik tombol **Confirm Payment**. <br>• Tutup modal receipt. <br>• Klik tab **History** → scroll tabel. |
| 4 | `/settings` | Klik menu sidebar **Settings**. Scroll ke section profile → klik **Save Changes**. <br>• Tutup SweetAlert. |
| 5 | Logout | Klik tombol **Sign Out** di bagian bawah sidebar. |

---

### 3. Owner (`ROLE_OWNER_USER` / `ROLE_OWNER_PASS`)

| # | Halaman | Langkah Demo |
|---|---------|--------------|
| 1 | `/login` | Isi field **Username** + **Password**, klik tombol **Sign In**. Tunggu redirect. |
| 2 | `/dashboard` | Scroll pelan ke bawah. Tunjukkan card revenue. |
| 3 | `/reports` | Klik menu sidebar **Reports & Export**. <br>• Ubah filter **Period** jadi **Monthly**. <br>• Klik tombol **Export Report** → tunggu modal muncul → klik tombol **Download**. <br>• Tutup modal. |
| 4 | `/settings` | Klik menu sidebar **Settings**. Scroll ke section profile → klik **Save Changes**. <br>• Tutup SweetAlert. |
| 5 | Logout | Klik tombol **Sign Out** di bagian bawah sidebar. |

---

## Catatan Teknis

- **Data dummy:** semua create/edit pakai prefix `DEMO-` agar mudah diidentifikasi dan tidak merusak data asli.
- **Tidak ada aksi destruktif:** tidak ada delete, reset, atau kirim data ke pihak ketiga.
- **Kredensial:** dibaca dari `.env.demo` via `node --env-file=.env.demo`.
- **Video output:** `demo-out/<role>/` dengan resolusi 1280×720, format `.webm`.
- **Selector:** `getByRole`, `getByLabel`, `getByText` — tidak pakai CSS selector.
- **Timing:** jeda 1.5 detik antar langkah, slow scroll, tunggu `networkidle` sebelum lanjut.
- **Error handling:** try/catch per role, screenshot `error.png` saat gagal, video tetap tersimpan.
