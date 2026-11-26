import React from 'react';
import { View, Text } from 'react-native';

// Full class strings so Tailwind can see them. Status colors are the only non-blue/black accents.
const STYLES = {
  pending: { bg: 'bg-amber-100', fg: 'text-amber-700', label: 'Pending' },
  approved: { bg: 'bg-blue-100', fg: 'text-blue-700', label: 'Approved' },
  cancelled: { bg: 'bg-rose-100', fg: 'text-rose-700', label: 'Cancelled' },
};
export const STATUS_KEYS = ['pending', 'approved', 'cancelled'];
export const statusLabel = (s) => (STYLES[s] || { label: s }).label;

const StatusBadge = ({ status }) => {
  const s = STYLES[status] || STYLES.pending;
  return (
    <View className={`px-2.5 py-1 rounded-full self-start ${s.bg}`}>
      <Text className={`text-[10px] font-extrabold uppercase tracking-[0.5px] ${s.fg}`}>{s.label}</Text>
    </View>
  );
};

export default StatusBadge;
