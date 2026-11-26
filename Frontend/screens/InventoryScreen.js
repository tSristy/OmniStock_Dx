import React, { useState, useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Screen, PageHeader, EmptyState, LoadingBlock, ErrorBlock } from '../components/Screen';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { colors, cardShadow } from '../theme';
import { success } from '../haptics';

export default function InventoryScreen() {
  const cart = useCart();
  const { notify } = useToast();
  const [search, setSearch] = useState('');
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

  return (
    <View className="flex-1 bg-slate-50">
      <Screen onRefresh={products.refresh} refreshing={products.refreshing} bottomPad={140}>
        <PageHeader
          kicker="Products available to order"
          title="Active Stock"
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

    </View>
  );
}
