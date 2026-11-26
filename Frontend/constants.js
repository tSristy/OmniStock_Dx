export const MOCK_PRODUCTS = [
  { id: '1', product_name: 'iPhone 15 Pro Max', sku: 'AAPL-IP15PM-256G', category: 'Electronics', brand: 'Apple', dms_stock: 45, ims_stock: 12, unit_price: 1199, currency: 'USD' },
  { id: '2', product_name: 'Galaxy S24 Ultra', sku: 'SAMS-GS24U-512G', category: 'Electronics', brand: 'Samsung', dms_stock: 12, ims_stock: 5, unit_price: 1299, currency: 'USD' },
  { id: '3', product_name: 'EliteBook 840 G10', sku: 'HP-EB840G10-I7', category: 'Computers', brand: 'HP', dms_stock: 8, ims_stock: 2, unit_price: 1450, currency: 'USD' },
  { id: '4', product_name: 'Mechanical Keyboard K3', sku: 'KEY-K3-V2-RGB', category: 'Accessories', brand: 'Keychron', dms_stock: 120, ims_stock: 45, unit_price: 89, currency: 'USD' },
  { id: '5', product_name: 'Sony WH-1000XM5', sku: 'SONY-WH1KXM5-BLK', category: 'Audio', brand: 'Sony', dms_stock: 3, ims_stock: 1, unit_price: 399, currency: 'USD' },
  { id: '6', product_name: 'Dell UltraSharp 27"', sku: 'DELL-U2723QE-4K', category: 'Monitors', brand: 'Dell', dms_stock: 15, ims_stock: 8, unit_price: 580, currency: 'USD' },
];

export const MOCK_LEDGER = [
  { id: 'L1', date: '2024-06-10', voucher: 'JV-001', particular: 'Opening Balance', narration: 'Initial system balance migration', debit: 50000.0, credit: 0, balance: 50000.0, type: 'Adjustment' },
  { id: 'L2', date: '2024-06-11', voucher: 'SL-882', particular: 'Sales: iPhone 15 Pro', narration: 'Customer order #ORD-992', debit: 1200.0, credit: 0, balance: 51200.0, type: 'Sales' },
  { id: 'L3', date: '2024-06-12', voucher: 'PY-441', particular: 'Office Rent', narration: 'June 2024 rent payment', debit: 0, credit: 2500.0, balance: 48700.0, type: 'Bank' },
  { id: 'L4', date: '2024-06-12', voucher: 'DEP-901', particular: 'Cash Deposit', narration: 'Transfer from store petty cash', debit: 500.0, credit: 0, balance: 49200.0, type: 'Cash' },
];

// PLACEHOLDER: sample incentive data until the backend/ERP provides the real scheme
export const MOCK_INCENTIVE = {
  period: 'November 2026',
  earned: 2450,
  salesAchieved: 61250,
  salesTarget: 100000,
  rate: 4, // % of sales
  nextTier: { label: 'Gold tier', bonus: 1500 },
};
