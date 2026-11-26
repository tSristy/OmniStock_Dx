import * as Haptics from 'expo-haptics';

// Small iOS touches; every call is fire-and-forget
export const tap = () => Haptics.selectionAsync().catch(() => {});
export const press = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
export const success = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
export const warn = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
