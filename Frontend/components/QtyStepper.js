import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import Icon from './Icon';
import { colors } from '../theme';
import { tap } from '../haptics';

// Quantity box for bulk orders: type a number directly, or use - / +.
// `value` is a string; the parent parses it when it needs the number.
export const parseQty = (text, max = Infinity) => {
  const n = parseInt(text, 10);
  if (!n || n < 1) return null;
  return n > max ? null : n;
};

const QtyStepper = ({ value, onChange, onCommit, max = 999999 }) => {
  const step = (d) => {
    tap();
    const cur = parseInt(value, 10) || 1;
    const next = String(Math.min(max, Math.max(1, cur + d)));
    onChange(next);
    onCommit && onCommit(next);
  };
  return (
    <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl">
      <Pressable onPress={() => step(-1)} hitSlop={6} className="h-12 w-10 items-center justify-center">
        <Icon name="minus" size={12} color={colors.slate600} />
      </Pressable>
      <TextInput
        value={value}
        onChangeText={(t) => onChange(t.replace(/[^0-9]/g, ''))}
        onBlur={() => onCommit && onCommit(value)}
        onSubmitEditing={() => onCommit && onCommit(value)}
        keyboardType="number-pad"
        selectTextOnFocus
        maxLength={7}
        selectionColor={colors.indigo500}
        className="w-16 text-center font-extrabold text-base text-slate-900 p-0"
      />
      <Pressable onPress={() => step(1)} hitSlop={6} className="h-12 w-10 items-center justify-center">
        <Icon name="plus" size={12} color={colors.slate600} />
      </Pressable>
    </View>
  );
};

export default QtyStepper;
