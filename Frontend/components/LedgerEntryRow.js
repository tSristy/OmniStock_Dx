import React from 'react';
import { View, Text } from 'react-native';
import { cur, formatDate } from '../theme';

const typeClasses = {
  Sales: { bg: 'bg-indigo-50', fg: 'text-indigo-600' },
  Bank: { bg: 'bg-blue-50', fg: 'text-blue-600' },
  Cash: { bg: 'bg-amber-50', fg: 'text-amber-600' },
  Adjustment: { bg: 'bg-slate-100', fg: 'text-slate-600' },
};

// Debit = money out (orders), Credit = money in (deposits), Balance = available balance
const LedgerEntryRow = ({ entry, isLast }) => {
  const tc = typeClasses[entry.type] || typeClasses.Adjustment;
  return (
    <View className={`bg-white p-4 ${isLast ? '' : 'border-b border-slate-100'}`}>
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 pr-2">
          <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[1.5px]">{formatDate(entry.date)}</Text>
          <Text className="font-bold text-slate-900 text-sm mt-0.5">{entry.particular}</Text>
        </View>
        <View className="items-end">
          <View className={`px-1.5 py-0.5 rounded ${tc.bg}`}>
            <Text className={`text-[9px] font-bold uppercase ${tc.fg}`}>{entry.type}</Text>
          </View>
          <Text className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: 'Courier' }}>{entry.voucher}</Text>
        </View>
      </View>

      {entry.narration ? <Text className="text-[11px] text-slate-500 italic mb-3">"{entry.narration}"</Text> : null}

      <View className="flex-row gap-2 pt-3 border-t border-slate-100">
        <View className="flex-1">
          <Text className="text-[8px] font-bold text-slate-400 uppercase">Debit</Text>
          <Text className={`text-xs font-bold ${entry.debit > 0 ? 'text-rose-600' : 'text-slate-300'}`}>{entry.debit > 0 ? cur(entry.debit) : '—'}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-[8px] font-bold text-slate-400 uppercase">Credit</Text>
          <Text className={`text-xs font-bold ${entry.credit > 0 ? 'text-blue-600' : 'text-slate-300'}`}>{entry.credit > 0 ? cur(entry.credit) : '—'}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-[8px] font-bold text-slate-400 uppercase">Balance</Text>
          <Text className="text-xs font-black text-slate-900">{cur(entry.balance)}</Text>
        </View>
      </View>
    </View>
  );
};

export default LedgerEntryRow;
