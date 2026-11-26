import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import BottomSheet from './BottomSheet';
import Icon from './Icon';
import { Label, ChipPicker, SheetHeader, DateField } from './FormParts';
import { colors, bigShadow, money, toYMD } from '../theme';
import { tap, success } from '../haptics';

const SalesOrderForm = ({ products, onClose, onSubmit }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState(new Date());
  const [unitPrice, setUnitPrice] = useState('0');

  const selectedProduct = useMemo(() => products.find((p) => p.id === selectedProductId), [selectedProductId, products]);

  useEffect(() => {
    if (selectedProduct) setUnitPrice(String(selectedProduct.unit_price));
  }, [selectedProduct]);

  const priceNum = parseFloat(unitPrice) || 0;
  const totalPrice = qty * priceNum;

  const handleSubmit = () => {
    if (!selectedProductId) return;
    success();
    onSubmit({
      date: toYMD(date),
      productName: selectedProduct.product_name,
      sku: selectedProduct.sku,
      qty,
      unitPrice: priceNum,
      totalPrice,
    });
    onClose();
  };

  return (
    <BottomSheet visible onClose={onClose}>
      <SheetHeader
        badge="New Transaction"
        badgeBg="bg-emerald-50"
        badgeFg="text-emerald-600"
        title="Sales Order"
        subtitle="Create a new outbound shipment order."
        onClose={onClose}
      />

      <View className="gap-6">
        <View>
          <Label>Order Date</Label>
          <DateField value={date} onChange={setDate} />
        </View>

        <View>
          <Label>Select Product</Label>
          <ChipPicker
            value={selectedProductId}
            onChange={setSelectedProductId}
            options={products.map((p) => ({ value: p.id, label: p.product_name }))}
          />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Label>Quantity</Label>
            <View className="flex-row items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
              <Pressable onPress={() => { tap(); setQty(Math.max(1, qty - 1)); }} className="h-10 w-9 items-center justify-center">
                <Icon name="minus" size={14} color={colors.slate400} />
              </Pressable>
              <TextInput
                keyboardType="number-pad"
                value={String(qty)}
                onChangeText={(t) => setQty(parseInt(t, 10) || 1)}
                className="flex-1 text-center font-black text-lg text-slate-900 p-0"
              />
              <Pressable onPress={() => { tap(); setQty(qty + 1); }} className="h-10 w-9 items-center justify-center">
                <Icon name="plus" size={14} color={colors.slate400} />
              </Pressable>
            </View>
          </View>
          <View className="flex-1">
            <Label>Unit Price ($)</Label>
            <TextInput
              keyboardType="decimal-pad"
              value={unitPrice}
              onChangeText={setUnitPrice}
              className="bg-slate-50 rounded-2xl p-4 text-lg font-black text-slate-900"
            />
          </View>
        </View>

        <View style={bigShadow('#e2e8f0')} className="bg-slate-900 rounded-[32px] p-6 overflow-hidden">
          <View className="absolute -right-2.5 -top-2.5 rotate-12">
            <Icon name="file-invoice-dollar" size={90} color="rgba(255,255,255,0.08)" />
          </View>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-[1.5px]">Total Amount</Text>
              <Text className="text-3xl font-black text-white">${money(totalPrice, { minimumFractionDigits: 2 })}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-[1.5px]">Items</Text>
              <Text className="text-xl font-bold text-white">{qty}</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={!selectedProductId}
          style={bigShadow(colors.indigo200)}
          className={`bg-indigo-600 py-5 rounded-3xl flex-row items-center justify-center gap-3 active:scale-95 ${selectedProductId ? '' : 'opacity-50'}`}
        >
          <Text className="text-white font-black text-sm uppercase tracking-[2px]">Confirm Sales Order</Text>
          <Icon name="paper-plane" size={14} color="#fff" />
        </Pressable>
      </View>
    </BottomSheet>
  );
};

export default SalesOrderForm;
