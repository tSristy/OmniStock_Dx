import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Screen, PageHeader, EmptyState, LoadingBlock, ErrorBlock } from '../components/Screen';
import LedgerEntryRow from '../components/LedgerEntryRow';
import StatusBadge from '../components/StatusBadge';
import DepositForm from '../components/DepositForm';
import Icon from '../components/Icon';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { colors, bigShadow, cardShadow, cur, formatDate } from '../theme';
import { tap, press } from '../haptics';

export default function FinanceScreen() {
  const [tab, setTab] = useState('ledger');
  const [depositOpen, setDepositOpen] = useState(false);
  const dash = useApi(() => api.getDashboard(), []);
  const ledger = useApi(() => api.getLedger(), []);
  const deposits = useApi(() => api.getDeposits(), []);

  const refreshAll = () => Promise.all([dash.refresh(), ledger.refresh(), deposits.refresh()]);
  const refreshing = dash.refreshing || ledger.refreshing || deposits.refreshing;
  const onDone = () => { dash.reload(true); ledger.reload(true); deposits.reload(true); };

  const entries = [...(ledger.data || [])].reverse(); // API is oldest-first; show newest first

  return (
    <>
      <Screen onRefresh={refreshAll} refreshing={refreshing}>
        <PageHeader kicker="Balance, ledger and deposits" title="Finance" />

        <View className="px-6">
          <View style={bigShadow(colors.slate900)} className="bg-slate-900 rounded-[32px] p-6 mb-6">
            <Text className="text-slate-400 text-xs font-black uppercase tracking-[3px]">Available balance</Text>
            <Text className="text-white text-[34px] font-black mt-2 mb-5" numberOfLines={1} adjustsFontSizeToFit>{dash.data ? cur(dash.data.balance) : '—'}</Text>
            <Pressable onPress={() => { press(); setDepositOpen(true); }} className="self-start flex-row items-center gap-2 bg-indigo-600 rounded-full px-5 py-3 active:bg-indigo-700">
              <Icon name="plus" size={12} color="#fff" />
              <Text className="text-white font-black text-[12px] uppercase tracking-[1px]">New deposit</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-6 border-b border-slate-200 mb-5">
            {[{ key: 'ledger', label: 'General ledger' }, { key: 'deposits', label: 'Deposits' }].map((t) => {
              const active = tab === t.key;
              return (
                <Pressable key={t.key} onPress={() => { tap(); setTab(t.key); }} className="pb-3">
                  <Text className={`text-xs font-black uppercase tracking-[1.5px] ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{t.label}</Text>
                  {active ? <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" /> : null}
                </Pressable>
              );
            })}
          </View>

          {tab === 'ledger' ? (
            ledger.loading && !ledger.data ? <LoadingBlock /> : ledger.error && !ledger.data ? (
              <ErrorBlock message={ledger.error} onRetry={ledger.reload} />
            ) : entries.length ? (
              <View style={cardShadow} className="bg-white rounded-3xl overflow-hidden border border-slate-200">
                <View className="bg-slate-900 p-4">
                  <Text className="text-white/60 text-[10px] font-black uppercase tracking-[1.5px]">Account statement</Text>
                </View>
                {entries.map((e, i) => <LedgerEntryRow key={e.id} entry={e} isLast={i === entries.length - 1} />)}
              </View>
            ) : (
              <EmptyState icon="scale-balanced" text="No ledger entries" />
            )
          ) : deposits.loading && !deposits.data ? <LoadingBlock /> : deposits.error && !deposits.data ? (
            <ErrorBlock message={deposits.error} onRetry={deposits.reload} />
          ) : (deposits.data || []).length ? (
            (deposits.data || []).map((d) => (
              <View key={d.id} style={cardShadow} className="bg-white rounded-2xl p-4 border border-slate-200 flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-3 shrink">
                  <View className="h-10 w-10 rounded-xl bg-indigo-50 items-center justify-center">
                    <Icon name="building-columns" size={15} color={colors.indigo600} />
                  </View>
                  <View className="shrink">
                    <Text className="font-bold text-slate-900 text-sm" numberOfLines={1}>{d.bank_name}</Text>
                    <Text className="text-[11px] text-slate-400 font-medium">{formatDate(d.date)} • {d.voucher_no}</Text>
                  </View>
                </View>
                <View className="items-end gap-1.5">
                  <Text className="font-black text-slate-900 text-sm">{cur(d.amount)}</Text>
                  <StatusBadge status={d.status} />
                </View>
              </View>
            ))
          ) : (
            <EmptyState icon="piggy-bank" text="No deposits yet" />
          )}
        </View>
      </Screen>

      <DepositForm visible={depositOpen} onClose={() => setDepositOpen(false)} onDone={onDone} />
    </>
  );
}
