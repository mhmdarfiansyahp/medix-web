import { chromium } from 'playwright';
import { mkdir, rm, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const wait = (ms) => new Promise(r => setTimeout(r, ms));
const now = () => Date.now();

async function slowScroll(page) { await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' })); await wait(400); }

async function fillInput(page, selector, value) {
  try {
    await page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
    await page.locator(selector).fill(value);
    await wait(300);
  } catch (e) {
    console.log(`Fill error: ${selector} - ${e.message}`);
  }
}

async function clickElement(page, selector, timeout = 5000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout });
  await page.locator(selector).click();
  await wait(300);
}

async function safeClick(page, selector, timeout = 3000) {
  try {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
    await page.locator(selector).click();
    return true;
  } catch {
    return false;
  }
}

async function dismissAlerts(page) { 
  try { 
    const btn = page.locator('.swal2-confirm'); 
    if (await btn.count()) { await btn.first().click(); await wait(500); }
  } catch {} 
}

async function closeModal(page) { 
  try { await page.keyboard.press('Escape'); await wait(200); } catch {}
  try {
    const closeBtn = page.getByRole('button', { name: /cancel|tutup|close|×/i }).first();
    if (await closeBtn.count()) { await closeBtn.click(); await wait(200); }
  } catch {}
  try {
    const swalBtn = page.locator('.swal2-confirm, .swal2-cancel').first();
    if (await swalBtn.count()) await swalBtn.click(); await wait(200);
  } catch {}
}

async function injectCursor(page) {
  await page.addInitScript(() => {
    const dot = document.createElement('div');
    Object.assign(dot.style, {
      position: 'fixed', width: '16px', height: '16px', borderRadius: '50%',
      background: 'rgba(239, 68, 68, 0.9)', border: '2px solid white',
      pointerEvents: 'none', zIndex: '999999', transition: 'transform 0.05s ease-out',
      transform: 'translate(-50%, -50%)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    });
    document.body.appendChild(dot);
    document.addEventListener('mousemove', e => { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; });
  });
}

async function doLogin(page, user, pass) {
  await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
  await fillInput(page, 'input#username', user);
  await fillInput(page, 'input#password', pass);
  await clickElement(page, 'button:has-text("Sign In")');
  await page.waitForLoadState('networkidle');
  await wait(800);
  await dismissAlerts(page);
  await closeModal(page);
}

async function createUniqueDir(baseDir) {
  const timestamp = Date.now();
  const uniqueDir = `${baseDir}-${timestamp}`;
  await mkdir(uniqueDir, { recursive: true });
  return uniqueDir;
}

async function flowAdmin(page, roleDir) {
  console.log(`[${roleDir}] Starting admin flow...`);

  // ===== Drug Categories =====
  await page.goto('http://localhost:5173/drug-categories', { waitUntil: 'domcontentloaded' }); await wait(1000);
  await closeModal(page);

  await clickElement(page, 'button:has-text("Add")');
  await fillInput(page, 'input[placeholder="e.g. Ointment, Tablet, Syrup"]', 'Category001');
  await safeClick(page, 'form button:has-text("Add Category")');
  await wait(1500); await dismissAlerts(page);

  await fillInput(page, 'input[placeholder*="Search categories"]', 'Category001'); await wait(800);
  const catEditBtns = await page.locator('tbody tr button[name="Edit"]').all();
  if (catEditBtns.length > 0) {
    await catEditBtns[0].click(); await wait(1200);
    await fillInput(page, 'input[placeholder="e.g. Ointment, Tablet, Syrup"]', 'Category001-updated');
    await safeClick(page, 'form button:has-text("Save Changes")');
    await wait(1200); await dismissAlerts(page);
  }

  // ===== Drug Management =====
  await page.goto('http://localhost:5173/drug-management', { waitUntil: 'domcontentloaded' }); await wait(1000);
  await closeModal(page);

  await clickElement(page, 'button:has-text("Add New")');
  await fillInput(page, 'input[name="nama_obat"]', 'Paracetamol');
  await fillInput(page, 'input[name="merk_obat"]', 'BrandParacetamol');
  await page.locator('select[name="jenis_obat_id"]').selectOption({ index: 1 }); await wait(300);
  await fillInput(page, 'input[name="harga"]', '25000');
  await fillInput(page, 'input[name="stok"]', '100');
  const expInput = page.locator('input[name="tgl_kadaluarsa"]');
  if (await expInput.count()) { await expInput.fill('2028-12-31'); }
  await safeClick(page, 'button:has-text("Save Medication")');
  await wait(1500); await dismissAlerts(page);

  await fillInput(page, 'input[placeholder*="Search"]', 'Paracetamol'); await wait(800);
  const editBtns = await page.locator('tbody tr button[name="Edit"]').all();
  if (editBtns.length > 0) {
    await editBtns[0].click(); await wait(1200);
    await fillInput(page, 'input[name="stok"]', '200');
    const updateBtn = page.getByRole('button', { name: /Update Medication/i });
    if (await updateBtn.count()) { await updateBtn.click(); }
    await wait(1200); await dismissAlerts(page);
  }

  // ===== Notifications & Stock =====
  await page.goto('http://localhost:5173/stock-alerts/low-stock', { waitUntil: 'domcontentloaded' }); await wait(800); await slowScroll(page);
  await page.goto('http://localhost:5173/stock-alerts/expiring-soon', { waitUntil: 'domcontentloaded' }); await wait(800); await slowScroll(page);

  // ===== Reports =====
  await page.goto('http://localhost:5173/reports', { waitUntil: 'domcontentloaded' }); await wait(2000);
  await closeModal(page);
  
  const periodSelect = page.locator('div:has-text("Period") + select');
  if (await periodSelect.count()) {
    await periodSelect.selectOption({ value: 'monthly' }); await wait(500);
  }
  
  await safeClick(page, 'button:has-text("Export Report")');
  await wait(1500); await closeModal(page);

  // ===== User Management =====
  await page.goto('http://localhost:5173/users', { waitUntil: 'domcontentloaded' }); await wait(1500);
  await closeModal(page);
  await clickElement(page, 'button:has-text("Add")');
  await fillInput(page, 'input[placeholder="Enter user name"]', 'UserAdmin');
  await fillInput(page, 'input[placeholder="Enter username"]', 'adminuser');
  await fillInput(page, 'input[placeholder="Enter password"]', 'AdminPass123');
  await clickElement(page, 'button:has-text("Create User")');
  await wait(1500); await dismissAlerts(page);

  await fillInput(page, 'input[placeholder*="Search by name, username, or ID"]', 'adminuser'); await wait(800);
  const userEditBtns = await page.locator('tbody tr button[name="Edit"]').all();
  if (userEditBtns.length > 0) {
    await userEditBtns[0].click(); await wait(1200);
    await page.locator('select[name="role"]').selectOption({ index: 1 }); await wait(300);
    const saveSelectors = [
      'button:has-text("Save Changes")',
      'button:has-text("Update")',
      'button[type="submit"]'
    ];
    let saveClicked = false;
    for (const sel of saveSelectors) {
      if (await safeClick(page, sel, 2000)) {
        saveClicked = true;
        break;
      }
    }
    if (!saveClicked) console.log('Save button not found, continuing...');
    await wait(1200); await dismissAlerts(page);
  }

  // ===== Transactions =====
  await page.goto('http://localhost:5173/transactions', { waitUntil: 'domcontentloaded' }); await wait(800); await slowScroll(page);

  // ===== Settings =====
  await page.goto('http://localhost:5173/settings', { waitUntil: 'domcontentloaded' }); await wait(1500);
  await closeModal(page);
  await safeClick(page, 'button:has-text("Edit Profile")');
  await wait(800);
  const settingsSave = page.locator('button:has-text("Save Changes")');
  if (await settingsSave.count()) {
    await settingsSave.click();
    await wait(1200); await dismissAlerts(page);
  } else {
    console.log('Settings save button not found');
  }

  // ===== Logout =====
  await clickElement(page, 'button:has-text("Sign Out")');
  await wait(600);
}

async function flowKasir(page, roleDir) {
  console.log(`[${roleDir}] Starting kasir flow...`);
  await page.goto('http://localhost:5173/transactions', { waitUntil: 'domcontentloaded' }); await wait(2000);
  
  // Search for medicine using aria label or placeholder
  const searchInput = page.locator('input[placeholder*="Search"]');
  if (await searchInput.count()) {
    await searchInput.first().fill('paracetamol'); await wait(1500);
  }
  
  // Click Add button (Plus icon) for first result
  const addButtons = await page.locator('button[class*="rounded-xl"]:has(svg[class*="lucide-plus"])').all();
  if (addButtons.length > 0) {
    await addButtons[0].click(); await wait(1000);
  }
  
  // Click "Pay Now" button
  const payNowBtn = page.locator('button.bg-blue-600');
  if (await payNowBtn.count()) {
    await payNowBtn.click(); await wait(1500);
  }
  
  // Select Cash payment method
  const cashBtn = page.locator('button:has-text("Cash")');
  if (await cashBtn.count()) {
    await cashBtn.click(); await wait(1000);
  }
  
  // Enter cash amount
  const cashInput = page.locator('input[placeholder="0"]');
  if (await cashInput.count()) {
    await cashInput.fill('50000'); await wait(500);
  }
  
  // Confirm Payment
  const confirmBtn = page.locator('button:has-text("Confirm Payment")');
  if (await confirmBtn.count()) {
    await confirmBtn.click(); await wait(2000);
  }
  await closeModal(page);
}

async function flowOwner(page, roleDir) {
  console.log(`[${roleDir}] Starting owner flow...`);
  await page.goto('http://localhost:5173/reports', { waitUntil: 'domcontentloaded' }); await wait(2000);
  await closeModal(page);
  
  const periodSelect = page.locator('div:has-text("Period") + select');
  if (await periodSelect.count()) {
    await periodSelect.selectOption({ value: 'monthly' }); await wait(500);
  }
  
  await safeClick(page, 'button:has-text("Export Report")');
  await wait(1500); await closeModal(page);
}

async function main() {
  const argRole = process.argv[2];
  const allRoles = [
    { label: 'admin', user: process.env.ROLE_ADMIN_USER, pass: process.env.ROLE_ADMIN_PASS, flow: flowAdmin },
    { label: 'kasir', user: process.env.ROLE_KASIR_USER, pass: process.env.ROLE_KASIR_PASS, flow: flowKasir },
    { label: 'owner', user: process.env.ROLE_OWNER_USER, pass: process.env.ROLE_OWNER_PASS, flow: flowOwner },
  ];
  const roles = argRole ? allRoles.filter(r => r.label === argRole) : allRoles;

  const browser = await chromium.launch({ headless: false, slowMo: 300 });

  for (const { label, user, pass, flow } of roles) {
    const baseDir = `demo-out/${label}`;
    const roleDir = await createUniqueDir(baseDir);
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    await injectCursor(page);

    try {
      await doLogin(page, user, pass);
      await flow(page, roleDir);
      console.log(`\n✓ ${label} completed successfully`);
    } catch (e) {
      console.error(`✗ ${label} failed: ${e.message}`);
      await page.screenshot({ path: `${roleDir}/error.png`, fullPage: true });
    } finally { await context.close(); console.log(`  • Context closed for ${label}`); }
  }

  await browser.close();
  console.log('\n═════════════════════════════════════════');
  console.log('✅ Automated all role flows completed');
  console.log('📺 Browser is visible for manual recording');
  console.log('═════════════════════════════════════════');
}

main().catch(e => { console.error(e); process.exit(1); });