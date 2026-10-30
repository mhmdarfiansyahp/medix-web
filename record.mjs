// record.mjs – Playwright video recorder
// Record video 1280x720 → demo-out/
// Alur: navigasi → tunggu → interaksi → langkah (jeda 1.5s) → tutup browser

import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  // Buat direktori demo-out kalau belum ada
  const path = './demo-out';
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  // Browser context dengan video recording
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: './demo-out',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  // Langkah 1 – buka halaman utama (atau login)
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Langkah 2 – coba buka halaman login (kalau routing menggunakan /login)
  await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Langkah 3 – jika ada form login, isi dengan dummy data (jaga-jaga aman)
  // Hanya if kita tahu struktur UI; kini kosong untuk safety.

  // Langkah 4 – kembali ke dashboard (secara navigasi)
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Langkah 5 – tutup browser dan simpan video
  await context.close();
  await browser.close();
})();