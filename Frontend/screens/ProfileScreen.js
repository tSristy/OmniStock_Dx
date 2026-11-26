import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator, Platform } from 'react-native';
import { Screen, PageHeader, LoadingBlock, ErrorBlock } from '../components/Screen';
import { Label, IconInput } from '../components/FormParts';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { BIN_LENGTH, TIN_LENGTH } from '../services/config';
import { colors, initials } from '../theme';
import { press, success, warn } from '../haptics';

const ReadRow = ({ label, value, last }) => (
  <View className={`flex-row justify-between py-3.5 ${last ? '' : 'border-b border-slate-100'}`}>
    <Text className="text-xs font-bold text-slate-400 uppercase tracking-[1px]">{label}</Text>
    <Text className="text-sm font-bold text-slate-900 shrink ml-4 text-right">{value || '—'}</Text>
  </View>
);

const onlyDigits = (t) => t.replace(/[^0-9]/g, '');

// BIN and TIN are mandatory
export const validateProfile = (f) => {
  const e = {};
  if (!f.bin) e.bin = 'BIN is required';
  else if (f.bin.length !== BIN_LENGTH) e.bin = `BIN must be ${BIN_LENGTH} digits`;
  if (!f.tin) e.tin = 'TIN is required';
  else if (f.tin.length !== TIN_LENGTH) e.tin = `TIN must be ${TIN_LENGTH} digits`;
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email';
  return e;
};

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();
  const { notify } = useToast();
  const profile = useApi(() => api.getProfile(), []);
  const [form, setForm] = useState({ bin: '', tin: '', phone: '', email: '', address: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile.data) {
      const p = profile.data;
      setForm({ bin: p.bin || '', tin: p.tin || '', phone: p.phone || '', email: p.email || '', address: p.address || '' });
    }
  }, [profile.data]);

  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined })); };

  const save = async () => {
    const e = validateProfile(form);
    setErrors(e);
    if (Object.keys(e).length) { warn(); notify('Please fix the highlighted fields.', 'error'); return; }
    press();
    setBusy(true);
    try {
      await api.updateProfile(form);
      success();
      updateUser({}); // keep stored session fresh
      notify('Profile saved.');
    } catch (err) {
      notify(err.message || 'Could not save the profile.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const confirmLogout = () => {
    if (Platform.OS === 'web') { if (window.confirm('Log out? You will need to sign in again.')) signOut(); return; }
    Alert.alert('Log out', 'You will need to sign in again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: signOut },
    ]);
  };

  const p = profile.data;

  return (
    <Screen onRefresh={profile.refresh} refreshing={profile.refreshing}>
      <PageHeader kicker="Your account details" title="Profile" />

      <View className="px-6">
        {/* Identity */}
        <View className="items-center mb-6">
          <View className="h-20 w-20 rounded-3xl bg-slate-900 items-center justify-center mb-3">
            <Text className="text-white text-2xl font-black">{initials(user.name)}</Text>
          </View>
          <Text className="text-xl font-black text-slate-900">{user.name}</Text>
          <Text className="text-slate-400 text-xs font-semibold mt-0.5">{user.company}</Text>
        </View>

        {profile.loading && !p ? <LoadingBlock /> : profile.error && !p ? (
          <ErrorBlock message={profile.error} onRetry={profile.reload} />
        ) : p ? (
          <>
            <View className="bg-white border border-slate-100 rounded-3xl px-5 mb-6">
              <ReadRow label="Name" value={p.name} />
              <ReadRow label="DMS code" value={p.dms_code} />
              <ReadRow label="Company" value={p.company} last />
            </View>

            <View className="gap-5">
              <View>
                <Label required>BIN number</Label>
                <IconInput icon="id-card" placeholder={`${BIN_LENGTH}-digit BIN`} keyboardType="number-pad" maxLength={BIN_LENGTH} value={form.bin} onChangeText={(t) => set('bin')(onlyDigits(t))} error={errors.bin} />
                {errors.bin ? <Text className="text-rose-600 text-xs mt-1.5">{errors.bin}</Text> : null}
              </View>
              <View>
                <Label required>TIN number</Label>
                <IconInput icon="id-card" placeholder={`${TIN_LENGTH}-digit TIN`} keyboardType="number-pad" maxLength={TIN_LENGTH} value={form.tin} onChangeText={(t) => set('tin')(onlyDigits(t))} error={errors.tin} />
                {errors.tin ? <Text className="text-rose-600 text-xs mt-1.5">{errors.tin}</Text> : null}
              </View>
              <View>
                <Label>Phone</Label>
                <IconInput icon="phone" placeholder="Phone number" keyboardType="phone-pad" value={form.phone} onChangeText={set('phone')} />
              </View>
              <View>
                <Label>Email</Label>
                <IconInput icon="envelope" placeholder="Email address" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={set('email')} error={errors.email} />
                {errors.email ? <Text className="text-rose-600 text-xs mt-1.5">{errors.email}</Text> : null}
              </View>
              <View>
                <Label>Address</Label>
                <IconInput icon="location-dot" placeholder="Business address" value={form.address} onChangeText={set('address')} />
              </View>
            </View>

            <Pressable onPress={save} disabled={busy} className={`mt-7 py-5 bg-indigo-600 rounded-3xl flex-row items-center justify-center gap-3 active:bg-indigo-700 ${busy ? 'opacity-60' : ''}`}>
              {busy ? <ActivityIndicator color="#fff" /> : <Icon name="floppy-disk" size={14} color="#fff" />}
              <Text className="text-white font-black text-sm uppercase tracking-[2px]">{busy ? 'Saving…' : 'Save changes'}</Text>
            </Pressable>
          </>
        ) : null}

        <Pressable onPress={confirmLogout} className="mt-4 py-5 border border-slate-100 rounded-3xl flex-row items-center justify-center gap-3 active:bg-slate-50">
          <Icon name="right-from-bracket" size={14} color={colors.ink} />
          <Text className="text-slate-900 font-black text-sm uppercase tracking-[2px]">Log out</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
