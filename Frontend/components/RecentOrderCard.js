import React from 'react';
import { View, Text } from 'react-native';
import Icon from './Icon';
import { colors, cardShadow, money } from '../theme';

const RecentOrderCard = ({ order }) => (
  <View style={cardShadow} className="bg-white rounded-2xl p-4 border border-slate-100 flex-row items-center justify-between mb-3">
    <View className="flex-row items-center gap-3 shrink">
      <View className="h-10 w-10 rounded-xl bg-indigo-50 items-center justify-center">
        <Icon name="receipt" size={16} color={colors.indigo600} />
      </View>
      <View className="shrink">
        <Text className="font-bold text-sm text-slate-800" numberOfLines={1}>{order.productName}</Text>
        <Text className="text-[10px] text-slate-400 font-medium uppercase tracking-[1px]">{order.date} • {order.qty} Units</Text>
      </View>
    </View>
    <View className="items-end">
      <Text className="font-black text-sm text-slate-900">${money(order.totalPrice)}</Text>
      <View className="bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
        <Text className="text-[9px] font-bold text-emerald-600 uppercase">Completed</Text>
      </View>
    </View>
  </View>
);

export default RecentOrderCard;
