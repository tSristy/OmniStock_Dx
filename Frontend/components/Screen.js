import React from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavContext';
import { colors, cardShadow, initials } from '../theme';

// Standard scrolling page: safe-area padding, pull-to-refresh, room for the floating tab bar.
export const Screen = ({ children, onRefresh, refreshing, bottomPad = 140 }) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.indigo600} /> : undefined}
    >
      {children}
    </ScrollView>
  );
};

// Top corner: avatar that opens Profile. On the Profile page itself: a back button instead.
export const ProfileButton = () => {
  const { user } = useAuth();
  const { go } = useNav();
  return (
    <Pressable onPress={() => go('profile')} style={cardShadow} className="h-12 w-12 rounded-2xl bg-white items-center justify-center border border-slate-100 active:opacity-70">
      <Text className="text-slate-900 font-black">{initials(user.name)}</Text>
    </Pressable>
  );
};

export const PageHeader = ({ kicker, title, right, back }) => {
  const { go } = useNav();
  return (
    <View className="px-6 mb-6 flex-row justify-between items-center">
      <View className="flex-row items-center gap-3 shrink">
        {back ? (
          <Pressable onPress={() => go('home')} style={cardShadow} className="h-12 w-12 rounded-2xl bg-white items-center justify-center border border-slate-100 active:opacity-70">
            <Icon name="chevron-left" size={16} color={colors.slate900} />
          </Pressable>
        ) : null}
        <View className="shrink">
          {kicker ? <Text className="text-slate-400 text-xs font-bold uppercase tracking-[2px]">{kicker}</Text> : null}
          <Text className="text-2xl font-black text-slate-900 tracking-tight" numberOfLines={1}>{title}</Text>
        </View>
      </View>
      {back ? null : right !== undefined ? right : <ProfileButton />}
    </View>
  );
};

export const SectionTitle = ({ children, right }) => (
  <View className="flex-row justify-between items-center mb-3">
    <Text className="text-sm font-black text-slate-900 uppercase tracking-[1.5px]">{children}</Text>
    {right}
  </View>
);

export const EmptyState = ({ icon, text }) => (
  <View className="items-center py-14 bg-white rounded-3xl border border-dashed border-slate-200">
    <Icon name={icon} size={24} color={colors.slate300} style={{ marginBottom: 10 }} />
    <Text className="text-slate-400 text-xs font-bold uppercase tracking-[1.5px]">{text}</Text>
  </View>
);

export const LoadingBlock = () => (
  <View className="items-center py-14"><ActivityIndicator color={colors.indigo600} /></View>
);

export const ErrorBlock = ({ message, onRetry }) => (
  <View className="items-center py-10 bg-slate-50 rounded-3xl border border-slate-100 px-6">
    <Icon name="triangle-exclamation" size={22} color={colors.slate400} style={{ marginBottom: 10 }} />
    <Text className="text-slate-600 text-sm text-center mb-4">{message}</Text>
    <Pressable onPress={onRetry} className="bg-slate-900 px-5 py-2.5 rounded-full active:opacity-80">
      <Text className="text-white text-xs font-bold uppercase tracking-[1px]">Try again</Text>
    </Pressable>
  </View>
);
