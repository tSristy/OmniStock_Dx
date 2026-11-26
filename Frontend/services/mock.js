// Sample backend. Same function names/shapes as the real API (docs/API.md),
// so switching to the real server changes nothing in the screens.
import { toYMD } from '../theme';

const delay = (v, ms = 350) => new Promise((res) => setTimeout(() => res(v), ms));
const clone = (o) => JSON.parse(JSON.stringify(o));
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return toYMD(d); };

const COMPANIES = [
  { id: '1', name: 'DX Group' },
  { id: '2', name: 'Techno Bangla Ltd' },
  { id: '3', name: 'Demo Traders' },
];

const PRODUCTS = [
  { id: '1', product_name: 'iPhone 15 Pro Max', sku: 'AAPL-IP15PM-256G', category: 'Electronics', brand: 'Apple', unit_price: 185000, available: 57 },
  { id: '2', product_name: 'Galaxy S24 Ultra', sku: 'SAMS-GS24U-512G', category: 'Electronics', brand: 'Samsung', unit_price: 160000, available: 17 },
  { id: '3', product_name: 'EliteBook 840 G10', sku: 'HP-EB840G10-I7', category: 'Computers', brand: 'HP', unit_price: 150000, available: 10 },
  { id: '4', product_name: 'Mechanical Keyboard K3', sku: 'KEY-K3-V2-RGB', category: 'Accessories', brand: 'Keychron', unit_price: 9500, available: 165 },
  { id: '5', product_name: 'Sony WH-1000XM5', sku: 'SONY-WH1KXM5-BLK', category: 'Audio', brand: 'Sony', unit_price: 42000, available: 0 },
  { id: '6', product_name: 'Dell UltraSharp 27"', sku: 'DELL-U2723QE-4K', category: 'Monitors', brand: 'Dell', unit_price: 62000, available: 23 },
  { id: '7', product_name: 'MX Master 3S Mouse', sku: 'LOGI-MX3S-GRP', category: 'Accessories', brand: 'Logitech', unit_price: 12500, available: 80 },
  { id: '8', product_name: 'Anker 65W Charger', sku: 'ANK-A2663-65W', category: 'Accessories', brand: 'Anker', unit_price: 4500, available: 300 },
];
const byId = (id) => PRODUCTS.find((p) => p.id === id);

const BANKS = [
  { id: '1', name: 'Dutch-Bangla Bank', account_no: '****1234' },
  { id: '2', name: 'BRAC Bank', account_no: '****8821' },
  { id: '3', name: 'City Bank', account_no: '****4410' },
  { id: '4', name: 'Islami Bank', account_no: '****7305' },
];

const COURIER = { name: 'Pathao Courier', tracking_no: 'PC-88213', phone: '01700-000000' };
let orderSeq = 1000;
const makeOrder = (ago, status, lines, courier = null) => {
  const items = lines.map(([pid, qty]) => {
    const p = byId(pid);
    return { product_id: pid, product_name: p.product_name, sku: p.sku, qty, unit_price: p.unit_price };
  });
  orderSeq += 1;
  return {
    id: `o${orderSeq}`, order_no: `SO-${orderSeq}`, date: daysAgo(ago), status,
    total: items.reduce((s, i) => s + i.qty * i.unit_price, 0), items, courier, note: '',
  };
};

let ORDERS = [
  makeOrder(18, 'approved', [['2', 4]]),
  makeOrder(13, 'approved', [['7', 20], ['8', 50]]),
  makeOrder(12, 'cancelled', [['4', 30]]),
  makeOrder(9, 'approved', [['1', 5]], COURIER),
  makeOrder(7, 'pending', [['8', 40]]),
  makeOrder(5, 'cancelled', [['3', 2]]),
  makeOrder(4, 'approved', [['6', 5], ['7', 10]]),
  makeOrder(2, 'approved', [['2', 1]], COURIER),
  makeOrder(1, 'pending', [['1', 2], ['4', 10]]),
];

let DEPOSITS = [
  { id: 'd1', voucher_no: 'DEP-860', date: daysAgo(20), bank_id: '1', bank_name: 'Dutch-Bangla Bank', amount: 1800000, status: 'approved', attachment_url: null },
  { id: 'd2', voucher_no: 'DEP-901', date: daysAgo(10), bank_id: '2', bank_name: 'BRAC Bank', amount: 500000, status: 'approved', attachment_url: null },
  { id: 'd3', voucher_no: 'DEP-955', date: daysAgo(3), bank_id: '1', bank_name: 'Dutch-Bangla Bank', amount: 300000, status: 'pending', attachment_url: null },
];

let PROFILE = {
  name: 'Rahim Traders', dms_code: 'DMS-0042', company: 'DX Group',
  phone: '01711-000000', email: 'rahim@example.com', address: 'Motijheel, Dhaka',
  bin: '', tin: '', // empty on purpose: shows the "complete your profile" prompt
};

// Ledger is derived: opening balance + approved deposits (credit) - approved orders (debit)
const buildLedger = () => {
  const rows = [{ date: daysAgo(30), voucher: 'JV-001', particular: 'Opening Balance', narration: 'Initial system balance migration', debit: 0, credit: 500000, type: 'Adjustment' }];
  DEPOSITS.filter((d) => d.status === 'approved').forEach((d) => rows.push({ date: d.date, voucher: d.voucher_no, particular: `Bank Deposit: ${d.bank_name}`, narration: 'Deposit approved', debit: 0, credit: d.amount, type: 'Bank' }));
  ORDERS.filter((o) => o.status === 'approved').forEach((o) => rows.push({ date: o.date, voucher: o.order_no, particular: `Order ${o.order_no}`, narration: `${o.items.length} item(s)`, debit: o.total, credit: 0, type: 'Sales' }));
  rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  let bal = 0;
  return rows.map((x, i) => { bal += x.credit - x.debit; return { id: `L${i}`, ...x, balance: bal }; });
};

const mock = {
  getCompanies: () => delay(clone(COMPANIES), 250),

  login: async ({ username, password, company_id }) => {
    await delay(null, 600);
    if (!username || !password) throw new Error('Enter your DMS code and password.');
    const company = COMPANIES.find((c) => c.id === company_id);
    if (!company) throw new Error('Select a company.');
    return { token: 'mock-token', user: { id: 'u1', name: PROFILE.name, dms_code: username.toUpperCase(), company: company.name } };
  },
  logout: () => delay({ ok: true }, 100),

  getDashboard: async () => {
    const ledger = buildLedger();
    const live = ORDERS.filter((o) => o.status !== 'cancelled');
    return delay({
      as_of: toYMD(new Date()),
      order_value: live.reduce((s, o) => s + o.total, 0),   // all non-cancelled orders until today
      sellout_value: 3420000,                                // sales to end customers until today
      balance: ledger.length ? ledger[ledger.length - 1].balance : 0,
      deposit_total: DEPOSITS.filter((d) => d.status === 'approved').reduce((s, d) => s + d.amount, 0),
      profile_complete: !!(PROFILE.bin && PROFILE.tin),
    });
  },

  // Incentive is calculated by the backend; the app only displays what it gets.
  getIncentive: () => delay({ period: 'November 2026', earned: 24500, sales_achieved: 612500, sales_target: 1000000, note: 'Calculated by head office' }),

  getProducts: async ({ search } = {}) => {
    const q = (search || '').toLowerCase();
    return delay(clone(PRODUCTS.filter((p) => !q || p.product_name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))));
  },

  getOrders: async ({ days, status } = {}) => {
    const from = days ? daysAgo(Number(days)) : '0000-00-00';
    const list = ORDERS.filter((o) => o.date >= from && (!status || o.status === status));
    return delay(clone([...list].sort((a, b) => (a.date < b.date ? 1 : -1))));
  },

  createOrder: async ({ items, note }) => {
    if (!items || !items.length) throw new Error('Your cart is empty.');
    for (const it of items) {
      const p = byId(it.product_id);
      if (!p || it.qty > p.available) throw new Error(`${p ? p.product_name : 'A product'} has only ${p ? p.available : 0} available.`);
    }
    const order = makeOrder(0, 'pending', items.map((i) => [i.product_id, i.qty]));
    order.note = note || '';
    ORDERS = [...ORDERS, order];
    return delay(clone(order), 700);
  },

  getLedger: () => delay(buildLedger()),
  getBanks: () => delay(clone(BANKS), 200),
  getDeposits: () => delay(clone([...DEPOSITS].sort((a, b) => (a.date < b.date ? 1 : -1)))),

  createDeposit: async (d) => {
    const bank = BANKS.find((b) => b.id === d.bank_id);
    if (!bank) throw new Error('Select a bank account.');
    if (!(Number(d.amount) > 0)) throw new Error('Enter a valid amount.');
    const dep = { id: `d${Date.now()}`, voucher_no: d.voucher_no, date: d.date, bank_id: bank.id, bank_name: bank.name, amount: Number(d.amount), status: 'pending', attachment_url: d.attachment ? d.attachment.name : null };
    DEPOSITS = [...DEPOSITS, dep];
    return delay(clone(dep), 700);
  },

  getProfile: () => delay(clone(PROFILE)),
  updateProfile: async (p) => {
    PROFILE = { ...PROFILE, ...p };
    return delay(clone(PROFILE), 500);
  },
};

export default mock;
