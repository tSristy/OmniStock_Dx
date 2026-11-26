import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cardShadow } from '../theme';
import { tap } from '../haptics';

// The original pill-style segmented control. options: [{ value, label, count? }]
const Segmented = ({ options, value, onChange }) => (
  <View className="bg-slate-200/50 p-1.5 rounded-2xl flex-row">
    {options.map((o) => {
      const active = value === o.value;
      return (
        <Pressable
          key={String(o.value)}
          onPress={() => { if (!active) tap(); onChange(o.value); }}
          style={active ? cardShadow : undefined}
          className={`flex-1 py-2.5 rounded-xl items-center ${active ? 'bg-white' : ''}`}
        >
          <Text className={`text-[10px] font-black uppercase tracking-[1px] ${active ? 'text-slate-900' : 'text-slate-400'}`}>{o.label}</Text>
          {o.count !== undefined ? <Text className={`text-sm font-black mt-0.5 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{o.count}</Text> : null}
        </Pressable>
      );
    })}
  </View>
);

export default Segmented;
