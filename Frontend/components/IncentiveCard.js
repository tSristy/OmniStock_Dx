import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from './Icon';
import { colors, bigShadow, cur } from '../theme';

// Incentive is calculated by the backend; this only displays it.
// The progress bar appears only when the backend sends sales_target.
const IncentiveCard = ({ incentive }) => {
  const { period, earned, sales_achieved, sales_target, note } = incentive;
  const hasTarget = Number(sales_target) > 0;
  const pct = hasTarget ? Math.min(100, Math.round((sales_achieved / sales_target) * 100)) : 0;

  return (
    <LinearGradient
      colors={[colors.indigo600, colors.violet700]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ padding: 24, borderRadius: 24 }, bigShadow(colors.indigo600)]}
    >
      <View className="flex-row items-center gap-2 mb-4">
        <View className="bg-white/20 p-2 rounded-lg"><Icon name="award" size={16} color="#fff" /></View>
        <View>
          <Text className="text-white text-lg font-bold">Incentive</Text>
          <Text className="text-indigo-200 text-[10px] font-bold uppercase tracking-[1.5px]">{period}</Text>
        </View>
      </View>

      <Text className="text-indigo-100 text-[10px] font-bold uppercase tracking-[1.5px]">Earned so far</Text>
      <Text className="text-white text-4xl font-black mb-1">{cur(earned)}</Text>

      {hasTarget ? (
        <View className="mt-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-indigo-100 text-xs font-bold">{cur(sales_achieved)} of {cur(sales_target)}</Text>
            <Text className="text-white text-xs font-black">{pct}%</Text>
          </View>
          <View className="h-2 bg-white/20 rounded-full overflow-hidden">
            <View className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
          </View>
        </View>
      ) : null}
      {note ? <Text className="text-indigo-200 text-[11px] mt-3">{note}</Text> : null}
    </LinearGradient>
  );
};

export default IncentiveCard;
