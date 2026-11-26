import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native';
import BottomSheet from './BottomSheet';
import { SheetHeader, Label } from './FormParts';
import QtyStepper from './QtyStepper';
import Icon from './Icon';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { colors, cur } from '../theme';
import { success } from '../haptics';

const CartLine = ({ item, onQty, onRemove }) => {
  const { product, qty } = item;
  const [text, setText] = useState(String(qty));
  useEffect(() => setText(String(qty)), [qty]);

  const commit = (t) => {
    const n = Math.min(product.available, Math.max(1, parseInt(t, 10) || qty));
    setText(String(n));
    if (n !== qty) onQty(n);
  };

  return (
    <View className="py-4 border-b border-slate-100">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 pr-3">
          <Text className="font-bold text-slate-900 text-sm">{product.product_name}</Text>
          <Text className="text-[11px] text-slate-400 mt-0.5">{cur(product.unit_price)} each • {product.available} available</Text>
        </View>
        <Pressable onPress={onRemove} hitSlop={10} className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center">
          <Icon name="trash" size={12} color={colors.slate500} />
        </Pressable>
      </View>
      <View className="flex-row items-center justify-between">
        <QtyStepper value={text} onChange={setText} onCommit={commit} max={product.available} />
        <Text className="font-black text-slate-900 text-base">{cur(qty * product.unit_price)}</Text>
      </View>
    </View>
  );
};

const CartSheet = ({ visible, onClose }) => {
  const cart = useCart();
  const { notify } = useToast();
  const [noteText, setNoteText] = useState('');
  const [busy, setBusy] = useState(false);

  const place = async () => {
    setBusy(true);
    try {
      const order = await api.createOrder({
        items: cart.items.map((i) => ({ product_id: i.product.id, qty: i.qty, unit_price: i.product.unit_price })),
        note: noteText.trim(),
      });
      success();
      cart.clear();
      setNoteText('');
      onClose();
      notify(`Order ${order.order_no} placed. Waiting for approval.`);
    } catch (e) {
      notify(e.message || 'Could not place the order.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <SheetHeader
        badge="Your cart"
        title="Review order"
        subtitle={cart.lines ? `${cart.lines} product${cart.lines === 1 ? '' : 's'} • ${cart.units} unit${cart.units === 1 ? '' : 's'}` : undefined}
        onClose={onClose}
      />

      {cart.lines === 0 ? (
        <View className="items-center py-12">
          <Icon name="cart-shopping" size={26} color={colors.slate300} style={{ marginBottom: 10 }} />
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-[1.5px]">Your cart is empty</Text>
        </View>
      ) : (
        <View>
          {cart.items.map((it) => (
            <CartLine key={it.product.id} item={it} onQty={(n) => cart.setQty(it.product.id, n)} onRemove={() => cart.remove(it.product.id)} />
          ))}

          <View className="mt-5">
            <Label>Note (optional)</Label>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Delivery instructions, reference…"
              placeholderTextColor={colors.slate400}
              multiline
              className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-900 min-h-[64px]"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          <View className="bg-slate-900 rounded-[32px] p-6 flex-row justify-between items-center my-5">
            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[1.5px]">Total amount</Text>
            <Text className="text-white text-2xl font-black">{cur(cart.total)}</Text>
          </View>

          <Pressable
            onPress={place}
            disabled={busy}
            className={`py-5 bg-indigo-600 rounded-3xl flex-row items-center justify-center gap-3 active:bg-indigo-700 ${busy ? 'opacity-60' : ''}`}
          >
            {busy ? <ActivityIndicator color="#fff" /> : <Icon name="paper-plane" size={14} color="#fff" />}
            <Text className="text-white font-black text-sm uppercase tracking-[2px]">{busy ? 'Placing order…' : 'Place order'}</Text>
          </Pressable>
        </View>
      )}
    </BottomSheet>
  );
};

export default CartSheet;
