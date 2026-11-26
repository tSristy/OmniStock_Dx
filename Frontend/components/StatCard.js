import React from 'react';
import { View, Text } from 'react-native';
import Icon from './Icon';
import { cardShadow } from '../theme';

// bg / iconColor: tile background class and icon hex, e.g. "bg-indigo-50" + colors.indigo600
const StatCard = ({ label, value, sub, icon, bg = 'bg-indigo-50', iconColor }) => (
  <View style={cardShadow} className="flex-1 bg-white p-4 rounded-2xl border border-slate-100">
    <View className={`h-10 w-10 rounded-xl items-center justify-center mb-3 ${bg}`}>
      <Icon name={icon} size={18} color={iconColor} />
    </View>
    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-[1.5px]">{label}</Text>
    <Text className="text-lg font-black text-slate-900 mt-0.5" numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    {sub ? <Text className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</Text> : null}
  </View>
);

export default StatCard;
