import React, { useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartSheet from '../components/CartSheet';
import { NavContext } from '../context/NavContext';
import { useCart } from '../context/CartContext';
import { NAV_HEIGHT } from '../theme';
import { tap } from '../haptics';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import OrdersScreen from '../screens/OrdersScreen';
import FinanceScreen from '../screens/FinanceScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Bottom bar tabs. Profile is NOT a tab: it opens from the avatar in the top corner.
const TABS = [
  { key: 'home', label: 'Home', icon: 'home', Component: HomeScreen },
  { key: 'inventory', label: 'Stock', icon: 'cube', Component: InventoryScreen },
  { key: 'orders', label: 'Orders', icon: 'receipt', Component: OrdersScreen },
  { key: 'finance', label: 'Finance', icon: 'wallet', Component: FinanceScreen },
];

const floating = {
  backgroundColor: '#ffffff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 18,
  elevation: 10,
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.04)',
};

// Only the active page is mounted, so each visit loads fresh data from the API.
export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const [tab, setTab] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const nav = useMemo(() => ({ tab, go: setTab, openCart: () => setCartOpen(true) }), [tab]);
  const Active = tab === 'profile' ? ProfileScreen : TABS.find((t) => t.key === tab).Component;

  return (
    <NavContext.Provider value={nav}>
      <View className="flex-1 bg-slate-50">
        <Active />

        {/* Floating nav: tab pill + separate cart button */}
        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(insets.bottom, 12) + 12, height: NAV_HEIGHT, flexDirection: 'row', gap: 12 }}
        >
          <View style={[floating, { flex: 1, borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }]}>
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => { if (!active) tap(); setTab(t.key); }}
                  className={`h-12 rounded-full flex-row items-center justify-center ${active ? 'bg-[#ececec] px-4 gap-2' : 'w-12'}`}
                >
                  <Ionicons name={active ? t.icon : `${t.icon}-outline`} size={22} color={active ? '#0b0b0c' : '#9a9a9f'} />
                  {active ? <Text className="text-[#0b0b0c] text-sm font-bold">{t.label}</Text> : null}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => { tap(); setCartOpen(true); }}
            style={[floating, { width: NAV_HEIGHT, height: NAV_HEIGHT, borderRadius: NAV_HEIGHT / 2, alignItems: 'center', justifyContent: 'center' }]}
          >
            <Ionicons name="cart-outline" size={26} color="#0b0b0c" />
            {cart.lines > 0 ? (
              <View className="absolute top-2 right-2 min-w-[20px] h-5 px-1 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-white text-[11px] font-bold">{cart.lines}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <CartSheet visible={cartOpen} onClose={() => setCartOpen(false)} />
    </NavContext.Provider>
  );
}
