import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Screen, SectionTitle, EmptyState, LoadingBlock, ErrorBlock, ProfileButton } from '../components/Screen';
import StatCard from '../components/StatCard';
import IncentiveCard from '../components/IncentiveCard';
import OrderCard from '../components/OrderCard';
import OrderDetailSheet from '../components/OrderDetailSheet';
import DepositForm from '../components/DepositForm';
import Segmented from '../components/Segmented';
import Icon from '../components/Icon';
import { STATUS_KEYS, statusLabel } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavContext';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { colors, cardShadow, bigShadow, cur, formatDate, initials } from '../theme';
import { tap, press } from '../haptics';

const DAY_OPTIONS = [10, 15];

export default function HomeScreen() {
  const { user } = useAuth();
  const { go } = useNav();
  const [days, setDays] = useState(15);
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(null);
  const [depositOpen, setDepositOpen] = useState(false);

  const dash = useApi(() => api.getDashboard(), []);
  const incentive = useApi(() => api.getIncentive(), []);
  const orders = useApi(() => api.getOrders({ days }), [days]);

  const refreshAll = () => Promise.all([dash.refresh(), incentive.refresh(), orders.refresh()]);
  const refreshing = dash.refreshing || incentive.refreshing || orders.refreshing;

  const all = orders.data || [];
  const visible = status === 'all' ? all : all.filter((o) => o.status === status);
  const d = dash.data;

  const segments = [{ value: 'all', label: 'All', count: all.length }].concat(
    STATUS_KEYS.map((k) => ({ value: k, label: statusLabel(k), count: all.filter((o) => o.status === k).length }))
  );

  const actions = [
    { icon: 'file-invoice-dollar', label: 'New Order', bg: 'bg-indigo-600', shadow: colors.indigo600, onPress: () => go('inventory') },
    { icon: 'piggy-bank', label: 'Deposit', bg: 'bg-blue-500', shadow: colors.blue500, onPress: () => setDepositOpen(true) },
    { icon: 'receipt', label: 'Orders', bg: 'bg-blue-700', shadow: colors.blue700, onPress: () => go('orders') },
    { icon: 'scale-balanced', label: 'Ledger', bg: 'bg-slate-900', shadow: colors.slate900, onPress: () => go('finance') },
  ];

  return (
    <>
      <Screen onRefresh={refreshAll} refreshing={refreshing}>
        {/* Header */}
        <View className="px-6 flex-row justify-between items-center mb-6">
          <View className="shrink">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-[2px]">{user.company} • {user.dms_code}</Text>
            <Text className="text-2xl font-black text-slate-900 tracking-tight" numberOfLines={1}>{user.name}</Text>
          </View>
          <ProfileButton />
        </View>

        <View className="px-6">
          {/* BIN / TIN are required */}
          {d && !d.profile_complete ? (
            <Pressable onPress={() => { tap(); go('profile'); }} className="flex-row items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6 active:opacity-80">
              <Icon name="id-card" size={18} color={colors.indigo600} />
              <View className="flex-1">
                <Text className="text-slate-900 font-bold text-sm">Complete your profile</Text>
                <Text className="text-slate-500 text-xs">BIN and TIN numbers are required.</Text>
              </View>
              <Icon name="chevron-right" size={12} color={colors.indigo600} />
            </Pressable>
          ) : null}

          {/* Order value + sell-out value, until today */}
          {dash.loading && !d ? <LoadingBlock /> : dash.error && !d ? (
            <ErrorBlock message={dash.error} onRetry={dash.reload} />
          ) : d ? (
            <View className="mb-8">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-4">Until today • {formatDate(d.as_of)}</Text>
              <View className="flex-row gap-4 mb-4">
                <StatCard label="Order Value" value={cur(d.order_value)} sub="Excluding cancelled" icon="file-invoice-dollar" bg="bg-indigo-50" iconColor={colors.indigo600} />
                <StatCard label="Sell-out Value" value={cur(d.sellout_value)} sub="To end customers" icon="chart-line" bg="bg-blue-50" iconColor={colors.blue600} />
              </View>
              <View className="flex-row gap-4">
                <StatCard label="Balance" value={cur(d.balance)} sub="Available" icon="scale-balanced" bg="bg-indigo-50" iconColor={colors.indigo600} />
                <StatCard label="Deposits" value={cur(d.deposit_total)} sub="Approved" icon="piggy-bank" bg="bg-blue-50" iconColor={colors.blue600} />
              </View>
            </View>
          ) : null}

          {/* Incentive: value comes from the backend */}
          {incentive.data ? <View className="mb-8"><IncentiveCard incentive={incentive.data} /></View> : null}

          {/* Operations */}
          <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-4">Operations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 8 }} style={{ marginBottom: 24 }}>
            {actions.map((a) => (
              <View key={a.label} className="items-center gap-2 min-w-[70px]">
                <Pressable onPress={() => { press(); a.onPress(); }} style={bigShadow(a.shadow)} className={`h-14 w-14 rounded-2xl items-center justify-center active:scale-90 ${a.bg}`}>
                  <Icon name={a.icon} size={18} color="#fff" />
                </Pressable>
                <Text className="text-[10px] font-bold text-slate-500 uppercase">{a.label}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Transactions */}
          <SectionTitle
            right={
              <View className="flex-row bg-slate-200/50 rounded-full p-0.5">
                {DAY_OPTIONS.map((n) => (
                  <Pressable key={n} onPress={() => { tap(); setDays(n); }} className={`px-3 py-1 rounded-full ${days === n ? 'bg-slate-900' : ''}`}>
                    <Text className={`text-[11px] font-black ${days === n ? 'text-white' : 'text-slate-500'}`}>{n}D</Text>
                  </Pressable>
                ))}
              </View>
            }
          >
            Last {days} days
          </SectionTitle>
          <View className="mb-5"><Segmented options={segments} value={status} onChange={setStatus} /></View>

          {orders.loading && !orders.data ? <LoadingBlock /> : orders.error && !orders.data ? (
            <ErrorBlock message={orders.error} onRetry={orders.reload} />
          ) : visible.length ? (
            <>
              {visible.map((o) => <OrderCard key={o.id} order={o} onPress={setSelected} />)}
              <Pressable onPress={() => { tap(); go('orders'); }} className="items-center py-3">
                <Text className="text-indigo-600 font-bold text-sm">View all orders</Text>
              </Pressable>
            </>
          ) : (
            <EmptyState icon="receipt" text="No transactions" />
          )}
        </View>
      </Screen>

      <OrderDetailSheet order={selected} onClose={() => setSelected(null)} />
      <DepositForm visible={depositOpen} onClose={() => setDepositOpen(false)} onDone={() => dash.reload(true)} />
    </>
  );
}
