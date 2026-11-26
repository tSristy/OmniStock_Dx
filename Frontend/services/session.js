import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Token + user are kept in the device Keychain/Keystore until the user logs out.
const KEY = 'omnistock.session';

export async function saveSession(session) {
  try {
    const v = JSON.stringify(session);
    if (Platform.OS === 'web') localStorage.setItem(KEY, v);
    else await SecureStore.setItemAsync(KEY, v);
  } catch (e) { /* storage unavailable: user simply has to log in next time */ }
}

export async function loadSession() {
  try {
    const v = Platform.OS === 'web' ? localStorage.getItem(KEY) : await SecureStore.getItemAsync(KEY);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
}

export async function clearSession() {
  try {
    if (Platform.OS === 'web') localStorage.removeItem(KEY);
    else await SecureStore.deleteItemAsync(KEY);
  } catch (e) { /* ignore */ }
}
