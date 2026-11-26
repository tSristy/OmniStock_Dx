import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from './Icon';
import QtyStepper, { parseQty } from './QtyStepper';
import { cardShadow, cur } from '../theme';
import { press } from '../haptics';

// Stock level pill (original design); "High" is blue instead of green
const level = (n) =>
  n < 10 ? { label: 'Low', bg: 'bg-rose-100', fg: 'text-rose-700' }
  : n < 50 ? { label: 'Medium', bg: 'bg-amber-100', fg: 'text-amber-700' }
  : { label: 'High', bg: 'bg-blue-100', fg: 'text-blue-700' };

const ProductCard = ({ product, inCart, onAdd }) => {
  const [qty, setQty] = useState('1');
  const n = parseQty(qty) || 0;
  const st = level(product.available);

  return (
    <View style={cardShadow} className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 pr-2">
          <Text className="font-bold text-lg text-slate-800" numberOfLines={2}>{product.product_name}</Text>
          <Text className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-[1px]">{product.sku}</Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${st.bg}`}>
          <Text className={`text-[10px] font-bold uppercase ${st.fg}`}>{st.label}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2 mb-4">
        <View className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200"><Text className="text-[11px] text-slate-600">{product.category}</Text></View>
        <View className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100"><Text className="text-[11px] text-indigo-600 font-medium">{product.brand}</Text></View>
      </View>

      <View className="flex-row justify-between border-t border-slate-50 pt-3 mb-4">
        <View>
          <Text className="text-[10px] text-slate-400 uppercase font-semibold">Available</Text>
          <Text className="text-lg font-bold text-slate-900">{product.available}</Text>
        </View>
        <View className="items-end">
          <Text className="text-[10px] text-slate-400 uppercase font-semibold">Unit price</Text>
          <Text className="text-lg font-bold text-indigo-600">{cur(product.unit_price)}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3">
        <QtyStepper value={qty} onChange={setQty} max={product.available} />
        <Pressable
          onPress={() => { press(); onAdd(product, qty, () => setQty('1')); }}
          className="flex-1 h-12 bg-indigo-600 rounded-2xl flex-row items-center justify-center gap-2 active:bg-indigo-700"
        >
          <Icon name="cart-plus" size={14} color="#fff" />
          <Text className="text-white font-black text-[13px] uppercase tracking-[1px]">Add to cart</Text>
        </Pressable>
      </View>

      <View className="flex-row justify-between mt-3">
        <Text className="text-xs text-slate-400 font-medium">{n ? `${n} × ${cur(product.unit_price)} = ` : ''}<Text className="text-slate-900 font-bold">{n ? cur(n * product.unit_price) : ''}</Text></Text>
        {inCart > 0 ? <Text className="text-xs font-bold text-indigo-600">In cart: {inCart}</Text> : null}
      </View>
    </View>
  );
};

export default ProductCard;
