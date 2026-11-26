// The ONE place screens talk to the backend.  Contract: docs/API.md
import { USE_MOCK } from './config';
import { request as r } from './http';
import mock from './mock';

const real = {
  // auth
  getCompanies: () => r('GET', '/companyList'),
  login: ({ username, password, company_id }) => r('POST', '/auth/login', { body: { username, password, company_id } }),
  logout: () => r('POST', '/auth/logout'),

  // home
  getDashboard: () => r('GET', '/dashboard'),
  getIncentive: () => r('GET', '/incentive'),

  // inventory + orders
  getProducts: (params) => r('GET', '/products', { query: params }),
  getOrders: (params) => r('GET', '/orders', { query: params }), // { days, status }
  createOrder: (order) => r('POST', '/orders', { body: order }), // { items:[{product_id,qty,unit_price}], note }

  // finance
  getLedger: () => r('GET', '/ledger'),
  getBanks: () => r('GET', '/banks'),
  getDeposits: () => r('GET', '/deposits'),
  createDeposit: (d) => {
    const f = new FormData();
    f.append('voucher_no', d.voucher_no);
    f.append('date', d.date);
    f.append('bank_id', d.bank_id);
    f.append('amount', String(d.amount));
    if (d.attachment) f.append('attachment', { uri: d.attachment.uri, name: d.attachment.name, type: d.attachment.mimeType || 'application/octet-stream' });
    return r('POST', '/deposits', { form: f });
  },

  // profile
  getProfile: () => r('GET', '/profile'),
  updateProfile: (p) => r('PUT', '/profile', { body: p }),
};

const api = USE_MOCK ? mock : real;
export default api;
