import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from './Icon';
import StatusBadge from './StatusBadge';
import { colors, cardShadow, cur, formatDate } from '../theme';
import { tap } from '../haptics';

const OrderCard = ({ order, onPress }) => (
  <Pressable
    onPress={() => { tap(); onPress && onPress(order); }}
    style={cardShadow}
    className="bg-white rounded-2xl p-4 border border-slate-100 flex-row items-center justify-between mb-3 active:bg-slate-50"
  >
    <View className="flex-row items-center gap-3 shrink">
      <View className="h-10 w-10 rounded-xl bg-indigo-50 items-center justify-center">
        <Icon name="receipt" size={16} color={colors.indigo600} />
      </View>
      <View className="shrink">
        <Text className="font-bold text-sm text-slate-800" numberOfLines={1}>{order.order_no}</Text>
        <Text className="text-[10px] text-slate-400 font-medium uppercase tracking-[1px]">{formatDate(order.date)} • {order.items.length} item{order.items.length === 1 ? '' : 's'}</Text>
      </View>
    </View>
    <View className="items-end gap-1">
      <Text className="font-black text-sm text-slate-900">{cur(order.total)}</Text>
      <StatusBadge status={order.status} />
    </View>
  </Pressable>
);

export default OrderCard;
