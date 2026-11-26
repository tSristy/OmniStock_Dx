import React from 'react';
import { View, Text } from 'react-native';
import BottomSheet from './BottomSheet';
import { SheetHeader } from './FormParts';
import StatusBadge from './StatusBadge';
import Icon from './Icon';
import { colors, cur, formatDate } from '../theme';

const note = {
  pending: 'Waiting for approval.',
  approved: 'Approved. Courier details will appear here once logistics dispatches the order.',
  cancelled: 'This order was cancelled.',
};

// Order summary: items, total, status and courier information
const OrderDetailSheet = ({ order, onClose }) => (
  <BottomSheet visible={!!order} onClose={onClose}>
    {order && (
      <View>
        <SheetHeader
          title={order.order_no}
          subtitle={formatDate(order.date)}
          onClose={onClose}
          right={<View className="mt-3"><StatusBadge status={order.status} /></View>}
        />

        <View className="border border-slate-100 rounded-2xl overflow-hidden mb-4">
          {order.items.map((it, i) => (
            <View key={`${it.product_id}-${i}`} className={`p-4 flex-row justify-between ${i ? 'border-t border-slate-100' : ''}`}>
              <View className="flex-1 pr-3">
                <Text className="font-bold text-slate-900 text-sm">{it.product_name}</Text>
                <Text className="text-[11px] text-slate-400 mt-0.5">{it.qty} × {cur(it.unit_price)}</Text>
              </View>
              <Text className="font-extrabold text-slate-900 text-sm">{cur(it.qty * it.unit_price)}</Text>
            </View>
          ))}
        </View>

        <View className="bg-slate-900 rounded-[32px] p-6 flex-row justify-between items-center mb-4">
          <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[1.5px]">Order total</Text>
          <Text className="text-white text-2xl font-black">{cur(order.total)}</Text>
        </View>

        <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Icon name="truck" size={13} color={colors.indigo600} />
            <Text className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-slate-400">Courier</Text>
          </View>
          {order.courier ? (
            <View>
              <Text className="font-bold text-slate-900 text-sm">{order.courier.name}</Text>
              <Text className="text-xs text-slate-500 mt-0.5">Tracking: {order.courier.tracking_no}</Text>
              {order.courier.phone ? <Text className="text-xs text-slate-500">Phone: {order.courier.phone}</Text> : null}
            </View>
          ) : (
            <Text className="text-xs text-slate-500">{note[order.status]}</Text>
          )}
        </View>
      </View>
    )}
  </BottomSheet>
);

export default OrderDetailSheet;
