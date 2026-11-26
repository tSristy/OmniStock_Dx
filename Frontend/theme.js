// Blue + black palette. Hex values are only for things classes can't reach
// (icon colors, native shadows, gradients). Everything else uses Tailwind classes.
export const CURRENCY = '৳';

export const colors = {
  white: '#ffffff',
  slate50: '#f8fafc', slate100: '#f1f5f9', slate200: '#e2e8f0', slate300: '#cbd5e1',
  slate400: '#94a3b8', slate500: '#64748b', slate600: '#475569', slate900: '#0f172a',
  indigo50: '#eef2ff', indigo100: '#e0e7ff', indigo200: '#c7d2fe', indigo500: '#6366f1', indigo600: '#4f46e5', indigo700: '#4338ca',
  violet500: '#8b5cf6', violet700: '#6d28d9',
  blue50: '#eff6ff', blue100: '#dbeafe', blue200: '#bfdbfe', blue300: '#93c5fd',
  blue500: '#3b82f6', blue600: '#2563eb', blue700: '#1d4ed8', blue900: '#0b1f5c',
  slate800: '#1e293b', ink: '#0b0b0c',
};

export const cardShadow = {
  shadowColor: '#0f172a',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 3,
  elevation: 1,
};

export const bigShadow = (color = '#0f172a') => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.25,
  shadowRadius: 15,
  elevation: 8,
});

export const money = (n, decimals) => {
  const v = Number(n) || 0;
  const fixed = decimals ? v.toFixed(decimals) : String(Math.round(v * 100) / 100);
  const [i, d] = fixed.split('.');
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : '');
};
export const cur = (n, decimals) => `${CURRENCY}${money(n, decimals)}`;

// yyyy-mm-dd in local time (toISOString would shift the day in UTC)
export const toYMD = (date) => {
  const p = (x) => String(x).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = (ymd) => {
  const [y, m, d] = String(ymd).split('-').map(Number);
  return y ? `${d} ${MONTHS[m - 1]} ${y}` : String(ymd);
};

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join('') || '?';
export const NAV_HEIGHT = 64;
