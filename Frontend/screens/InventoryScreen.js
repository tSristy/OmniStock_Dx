import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, PageHeader, EmptyState, LoadingBlock, ErrorBlock } from '../components/Screen';
import ProductCard from '../components/ProductCard';
import CartSheet from '../components/CartSheet';
import Icon from '../components/Icon';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { colors, cardShadow, bigShadow, cur, NAV_HEIGHT } from '../theme';
import { tap, success } from '../haptics';

export default function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const { notify } = useToast();
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const products = useApi(() => api.getProducts(), []);

  // Only products with stock can be ordered
  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (products.data || []).filter(
      (p) => p.available > 0 && (!q || p.product_name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    );
  }, [products.data, search]);

  const onAdd = (product, qtyText, reset) => {
    const n = parseInt(qtyText, 10);
    if (!n || n < 1) { notify('Enter a quantity of 1 or more.', 'error'); return; }
    const inCart = cart.qtyOf(product.id);
    if (inCart + n > product.available) {
      notify(`Only ${product.available} available${inCart ? ` (${inCart} already in your cart)` : ''}.`, 'error');
      return;
    }
    cart.add(product, n);
    reset();
    success();
    notify(`${n} × ${product.product_name} added to cart`);
  };

  const barBottom = Math.max(insets.bottom, 12) + 12 + NAV_HEIGHT + 12;

  return (
    <View className="flex-1 bg-slate-50">
      <Screen onRefresh={products.refresh} refreshing={products.refreshing} bottomPad={cart.lines ? 220 : 140}>
        <PageHeader
          kicker="Products available to order"
          title="Active Stock"
          right={
            <Pressable onPress={() => { tap(); setCartOpen(true); }} style={cardShadow} className="h-12 w-12 rounded-2xl bg-white border border-slate-100 items-center justify-center active:opacity-80">
              <Icon name="cart-shopping" size={18} color={colors.slate900} />
              {cart.lines > 0 ? (
                <View className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-indigo-600 border-2 border-white items-center justify-center">
                  <Text className="text-white text-[10px] font-black">{cart.lines}</Text>
                </View>
              ) : null}
            </Pressable>
          }
        />

        <View className="px-6">
          <View className="mb-5">
            <View pointerEvents="none" className="absolute left-4 top-0 bottom-0 justify-center z-10">
              <Icon name="magnifying-glass" size={14} color={colors.slate400} />
            </View>
            <TextInput
              placeholder="Search name or SKU…"
              placeholderTextColor={colors.slate400}
              value={search}
              onChangeText={setSearch}
              clearButtonMode="while-editing"
              autoCorrect={false}
              selectionColor={colors.indigo500}
              className="bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-[15px] text-slate-900"
            />
          </View>

          <Text className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-[1px]">{list.length} product{list.length === 1 ? '' : 's'} available</Text>

          {products.loading && !products.data ? <LoadingBlock /> : products.error && !products.data ? (
            <ErrorBlock message={products.error} onRetry={products.reload} />
          ) : list.length ? (
            list.map((p) => <ProductCard key={p.id} product={p} inCart={cart.qtyOf(p.id)} onAdd={onAdd} />)
          ) : (
            <EmptyState icon="boxes-stacked" text="No products found" />
          )}
        </View>
      </Screen>

      {/* Floating cart bar */}
      {cart.lines > 0 && (
        <Pressable
          onPress={() => { tap(); setCartOpen(true); }}
          style={[bigShadow(), { position: 'absolute', left: 24, right: 24, bottom: barBottom }]}
          className="bg-slate-900 rounded-3xl px-6 py-4 flex-row items-center justify-between active:opacity-90"
        >
          <View>
            <Text className="text-white/60 text-[10px] font-black uppercase tracking-[1.5px]">{cart.lines} product{cart.lines === 1 ? '' : 's'} • {cart.units} unit{cart.units === 1 ? '' : 's'}</Text>
            <Text className="text-white text-lg font-black">{cur(cart.total)}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-extrabold text-sm">View cart</Text>
            <Icon name="chevron-right" size={12} color="#fff" />
          </View>
        </Pressable>
      )}

      <CartSheet visible={cartOpen} onClose={() => setCartOpen(false)} />
    </View>
  );
}
