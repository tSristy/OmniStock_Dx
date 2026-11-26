import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

// items: [{ product, qty }]   (product comes straight from the API)
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const add = useCallback((product, qty) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.product.id === product.id);
      if (i === -1) return [...prev, { product, qty }];
      const next = [...prev];
      next[i] = { ...next[i], product, qty: next[i].qty + qty };
      return next;
    });
  }, []);
  const setQty = useCallback((id, qty) => setItems((prev) => prev.map((x) => (x.product.id === id ? { ...x, qty } : x))), []);
  const remove = useCallback((id) => setItems((prev) => prev.filter((x) => x.product.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const qtyOf = useCallback((id) => (items.find((x) => x.product.id === id) || { qty: 0 }).qty, [items]);

  const value = useMemo(() => ({
    items, add, setQty, remove, clear, qtyOf,
    lines: items.length,
    units: items.reduce((s, x) => s + x.qty, 0),
    total: items.reduce((s, x) => s + x.qty * x.product.unit_price, 0),
  }), [items, add, setQty, remove, clear, qtyOf]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
