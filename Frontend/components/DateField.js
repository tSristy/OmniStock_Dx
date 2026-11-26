import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Icon from './Icon';
import { colors, toYMD } from '../theme';

// iOS: compact native picker. Android: tap to open the native date dialog.
const DateField = ({ value, onChange }) => {
  const openAndroid = () =>
    DateTimePickerAndroid.open({ value, mode: 'date', onChange: (_, d) => d && onChange(d) });

  return (
    <View className="bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-3 justify-center" style={{ minHeight: 54 }}>
      <View pointerEvents="none" className="absolute left-4 top-0 bottom-0 justify-center z-10">
        <Icon name="calendar" size={14} color={colors.slate400} />
      </View>
      {Platform.OS === 'ios' ? (
        <View className="items-start">
          <DateTimePicker value={value} mode="date" display="compact" accentColor={colors.indigo600} onChange={(_, d) => d && onChange(d)} />
        </View>
      ) : (
        <Pressable onPress={openAndroid} className="py-4">
          <Text className="text-[15px] font-medium text-slate-900">{toYMD(value)}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default DateField;
