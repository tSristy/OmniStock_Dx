import React, { useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { NavContext } from '../context/NavContext';
import { bigShadow, NAV_HEIGHT } from '../theme';
import { tap } from '../haptics';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import OrdersScreen from '../screens/OrdersScreen';
import FinanceScreen from '../screens/FinanceScreen';
import ProfileScreen from '../screens/ProfileScreen';

const TABS = [
  { key: 'home', label: 'Home', icon: 'house', Component: HomeScreen },
  { key: 'inventory', label: 'Stock', icon: 'table-cells-large', Component: InventoryScreen },
  { key: 'orders', label: 'Orders', icon: 'receipt', Component: OrdersScreen },
  { key: 'finance', label: 'Finance', icon: 'wallet', Component: FinanceScreen },
  { key: 'profile', label: 'Profile', icon: 'circle-user', Component: ProfileScreen },
];

// Only the active page is mounted, so each visit loads fresh data from the API.
export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('home');
  const nav = useMemo(() => ({ tab, go: setTab }), [tab]);
  const Active = TABS.find((t) => t.key === tab).Component;

  return (
    <NavContext.Provider value={nav}>
      <View className="flex-1 bg-slate-50">
        <Active />

        {/* Floating dark nav bar */}
        <View
          style={[bigShadow(), { position: 'absolute', left: 24, right: 24, bottom: Math.max(insets.bottom, 12) + 12, height: NAV_HEIGHT, backgroundColor: 'rgba(15,23,42,0.95)', borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]}
          className="flex-row items-center justify-between px-6"
        >
          {TABS.map((t) => {
            const active = tab === t.key;
            const c = active ? '#fff' : 'rgba(255,255,255,0.4)';
            return (
              <Pressable key={t.key} onPress={() => { if (!active) tap(); setTab(t.key); }} className="items-center gap-1.5">
                <Icon name={t.icon} size={18} color={c} />
                <Text className={`text-[8px] font-black uppercase tracking-[1.5px] ${active ? 'text-white' : 'text-white/40'}`}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </NavContext.Provider>
  );
}
