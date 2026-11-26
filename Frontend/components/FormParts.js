import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, ScrollView } from 'react-native';
import Icon from './Icon';
import { colors } from '../theme';
import { tap } from '../haptics';

export const Label = ({ children, required, dark }) => (
  <Text className={`text-[10px] font-black uppercase tracking-[2px] mb-2 ${dark ? 'text-white/50' : 'text-slate-400'}`}>
    {children}{required ? <Text className="text-indigo-600"> *</Text> : null}
  </Text>
);

const fieldBase = (dark) =>
  dark ? 'bg-ink-700 text-white' : 'bg-slate-50 text-slate-900';

// Text input with a left icon (and optional right element, e.g. show/hide password)
export const IconInput = ({ icon, dark, right, error, className = '', ...props }) => (
  <View>
    <View pointerEvents="none" className="absolute left-4 top-0 bottom-0 justify-center z-10">
      <Icon name={icon} size={14} color={dark ? '#6b6b75' : colors.slate400} />
    </View>
    <TextInput
      placeholderTextColor={dark ? '#6b6b75' : colors.slate400}
      selectionColor={colors.indigo500}
      className={`${fieldBase(dark)} ${error ? 'border border-rose-500' : ''} rounded-2xl py-4 pl-11 ${right ? 'pr-12' : 'pr-4'} text-[15px] ${dark ? 'font-medium' : 'font-bold'} ${className}`}
      {...props}
    />
    {right ? <View className="absolute right-3 top-0 bottom-0 justify-center">{right}</View> : null}
  </View>
);

// Dropdown: looks like an input, opens a list from the bottom
export const Dropdown = ({ icon, placeholder, value, options, onChange, dark, title, loading }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const close = () => setOpen(false);

  return (
    <>
      <Pressable
        onPress={() => { tap(); setOpen(true); }}
        className={`${fieldBase(dark)} rounded-2xl py-4 pl-11 pr-4 flex-row items-center justify-between`}
      >
        <View pointerEvents="none" className="absolute left-4 top-0 bottom-0 justify-center">
          <Icon name={icon} size={14} color={dark ? '#6b6b75' : colors.slate400} />
        </View>
        <Text className={`text-[15px] font-medium shrink ${selected ? (dark ? 'text-white' : 'text-slate-900') : (dark ? 'text-[#6b6b75]' : 'text-slate-400')}`} numberOfLines={1}>
          {loading ? 'Loading…' : selected ? selected.label : placeholder}
        </Text>
        <Icon name="chevron-down" size={12} color={dark ? '#6b6b75' : colors.slate400} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={close}>
          <Pressable onPress={() => {}} className={`${dark ? 'bg-ink-800' : 'bg-white'} rounded-t-[32px] px-4 pt-3 pb-10 max-h-[70%]`}>
            <View className={`w-10 h-1 rounded-full self-center mb-4 ${dark ? 'bg-white/20' : 'bg-slate-200'}`} />
            {title ? <Text className={`text-xs font-extrabold uppercase tracking-[2px] px-2 mb-2 ${dark ? 'text-white/50' : 'text-slate-400'}`}>{title}</Text> : null}
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((o) => {
                const active = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    onPress={() => { tap(); onChange(o.value); close(); }}
                    className={`flex-row items-center justify-between px-3 py-4 rounded-2xl ${active ? (dark ? 'bg-white/10' : 'bg-indigo-50') : ''}`}
                  >
                    <View className="shrink">
                      <Text className={`text-[15px] font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{o.label}</Text>
                      {o.sub ? <Text className={`text-xs mt-0.5 ${dark ? 'text-white/40' : 'text-slate-400'}`}>{o.sub}</Text> : null}
                    </View>
                    {active ? <Icon name="check" size={14} color={colors.indigo500} /> : null}
                  </Pressable>
                );
              })}
              {options.length === 0 ? <Text className="text-center text-slate-400 py-6">Nothing to choose from</Text> : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export const ChipPicker = ({ options, value, onChange }) => (
  <View className="flex-row flex-wrap gap-2">
    {options.map((o) => {
      const active = value === o.value;
      return (
        <Pressable
          key={o.value}
          onPress={() => { tap(); onChange(o.value); }}
          className={`rounded-2xl px-3.5 py-3 border ${active ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-50 border-slate-100'}`}
        >
          <Text className={`text-[13px] font-bold ${active ? 'text-white' : 'text-slate-600'}`}>{o.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

export const SheetHeader = ({ badge, title, subtitle, onClose, right }) => (
  <View className="flex-row justify-between items-start mb-6">
    <View className="flex-1 pr-3">
      {badge ? (
        <View className="self-start px-3 py-1 rounded-full mb-3 bg-indigo-50">
          <Text className="text-[10px] font-black uppercase text-indigo-600">{badge}</Text>
        </View>
      ) : null}
      <Text className="text-3xl font-black text-slate-900 tracking-tight">{title}</Text>
      {subtitle ? <Text className="text-slate-400 text-xs mt-2 font-medium">{subtitle}</Text> : null}
      {right}
    </View>
    <Pressable onPress={onClose} className="h-12 w-12 bg-slate-50 rounded-2xl items-center justify-center active:bg-slate-100">
      <Icon name="xmark" size={20} color={colors.slate400} />
    </Pressable>
  </View>
);
