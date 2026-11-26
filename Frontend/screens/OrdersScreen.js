import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Screen, PageHeader, EmptyState, LoadingBlock, ErrorBlock } from '../components/Screen';
import OrderCard from '../components/OrderCard';
import OrderDetailSheet from '../components/OrderDetailSheet';
import Segmented from '../components/Segmented';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { cur } from '../theme';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'cancelled', label: 'Cancelled' },
];
const DAY_OPTIONS = [7, 10, 15, 30].map((n) => ({ value: n, label: `${n} days` }));

export default function OrdersScreen() {
  const [status, setStatus] = useState('all');
  const [days, setDays] = useState(15);
  const [selected, setSelected] = useState(null);
  const orders = useApi(() => api.getOrders({ days, status: status === 'all' ? undefined : status }), [days, status]);

  const list = orders.data || [];
  const total = list.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  return (
    <>
      <Screen onRefresh={orders.refresh} refreshing={orders.refreshing}>
        <PageHeader kicker="Track status and courier" title="Sales Orders" />
        <View className="px-6">
          <View className="mb-3"><Segmented options={STATUS_OPTIONS} value={status} onChange={setStatus} /></View>
          <View className="mb-6"><Segmented options={DAY_OPTIONS} value={days} onChange={setDays} /></View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-black text-slate-900 uppercase tracking-[1.5px]">{list.length} order{list.length === 1 ? '' : 's'}</Text>
            <Text className="text-[10px] font-bold text-slate-400">Value excl. cancelled: {cur(total)}</Text>
          </View>

          {orders.loading && !orders.data ? <LoadingBlock /> : orders.error && !orders.data ? (
            <ErrorBlock message={orders.error} onRetry={orders.reload} />
          ) : list.length ? (
            list.map((o) => <OrderCard key={o.id} order={o} onPress={setSelected} />)
          ) : (
            <EmptyState icon="receipt" text="No orders found" />
          )}
        </View>
      </Screen>
      <OrderDetailSheet order={selected} onClose={() => setSelected(null)} />
    </>
  );
}
