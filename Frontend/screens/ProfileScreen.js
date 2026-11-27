import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, PageHeader, LoadingBlock, ErrorBlock } from '../components/Screen';
import { Label, IconInput } from '../components/FormParts';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { BIN_LENGTH, TIN_LENGTH } from '../services/config';
import { colors, cardShadow, bigShadow, initials } from '../theme';
import { press, success, warn } from '../haptics';

const onlyDigits = (t) => t.replace(/[^0-9]/g, '');
const FIELDS = ['bin', 'tin', 'phone', 'email', 'address'];

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

// White section card with an icon tile + title
const Card = ({ icon, title, hint, children }) => (
  <View style={cardShadow} className="bg-white rounded-[28px] border border-slate-100 p-5 mb-4">
    <View className="flex-row items-center gap-3 mb-5">
      <View className="h-10 w-10 rounded-xl bg-indigo-50 items-center justify-center">
        <Icon name={icon} size={16} color={colors.indigo600} />
      </View>
      <View className="shrink">
        <Text className="text-[15px] font-black text-slate-900">{title}</Text>
        {hint ? <Text className="text-xs text-slate-400 font-medium mt-0.5">{hint}</Text> : null}
      </View>
    </View>
    {children}
  </View>
);

// "7 / 13 digits" helper under BIN/TIN; turns into a check when complete
const DigitCounter = ({ value, length, error }) => {
  const done = value.length === length;
  return (
    <View className="flex-row justify-between items-center mt-2 px-1">
      {error ? <Text className="text-rose-600 text-xs font-semibold">{error}</Text> : <Text className="text-slate-400 text-xs">{length} digits</Text>}
      <View className="flex-row items-center gap-1">
        {done ? <Icon name="circle-check" size={11} color={colors.indigo600} /> : null}
        <Text className={`text-[11px] font-bold ${done ? 'text-indigo-600' : 'text-slate-400'}`}>{value.length} / {length}</Text>
      </View>
    </View>
  );
};

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();
  const { notify } = useToast();
  const profile = useApi(() => api.getProfile(), []);
  const [form, setForm] = useState({ bin: '', tin: '', phone: '', email: '', address: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const p = profile.data;

  useEffect(() => {
    if (p) setForm({ bin: p.bin || '', tin: p.tin || '', phone: p.phone || '', email: p.email || '', address: p.address || '' });
  }, [p]);

  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined })); };
  const dirty = !!p && FIELDS.some((k) => (p[k] || '') !== form[k]);
  const filled = FIELDS.filter((k) => !!form[k]).length;
  const pct = Math.round((filled / FIELDS.length) * 100);
  const taxDone = form.bin.length === BIN_LENGTH && form.tin.length === TIN_LENGTH;

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
      profile.reload(true);
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
  console.log(user);
  return (
    <Screen onRefresh={profile.refresh} refreshing={profile.refreshing}>
      <PageHeader kicker="Your account" title="Profile" back />

      <View className="px-6">
        {/* Identity card */}
        <LinearGradient
          colors={[colors.slate900, '#312e81']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[{ borderRadius: 32, padding: 24, marginBottom: 20 }, bigShadow(colors.slate900)]}
        >
          <View className="items-center">
            <View className="h-24 w-24 rounded-full bg-indigo-600 items-center justify-center border-4 border-white/20 mb-4">
              <Text className="text-white text-[32px] font-black">{initials(user.name)}</Text>
            </View>
            <Text className="text-white text-[22px] font-black tracking-tight text-center" numberOfLines={2}>{user.name}</Text>
            <Text className="text-slate-300 text-sm font-medium mt-1">{user.company}</Text>

            <View className="flex-row flex-wrap justify-center gap-2 mt-4">
              <View className="flex-row items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                <Icon name="id-badge" size={11} color="#c7d2fe" />
                <Text className="text-indigo-100 text-[11px] font-bold uppercase tracking-[1px]">{user.dms_code}</Text>
              </View>
              <View className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${taxDone ? 'bg-white/10' : 'bg-amber-400/20'}`}>
                <Icon name={taxDone ? 'circle-check' : 'triangle-exclamation'} size={11} color={taxDone ? '#c7d2fe' : '#fbbf24'} />
                <Text className={`text-[11px] font-bold uppercase tracking-[1px] ${taxDone ? 'text-indigo-100' : 'text-amber-300'}`}>{taxDone ? 'BIN & TIN added' : 'BIN / TIN needed'}</Text>
              </View>
            </View>
          </View>

          <View className="mt-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white/60 text-[10px] font-black uppercase tracking-[2px]">Profile completeness</Text>
              <Text className="text-white text-xs font-black">{pct}%</Text>
            </View>
            <View className="h-1.5 bg-white/15 rounded-full overflow-hidden">
              <View className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
            </View>
          </View>
        </LinearGradient>

        {profile.loading && !p ? <LoadingBlock /> : profile.error && !p ? (
          <ErrorBlock message={profile.error} onRetry={profile.reload} />
        ) : p ? (
          <>
            <Card icon="file-invoice" title="Tax information" hint="Required to place orders">
              <View className="gap-5">
                <View>
                  <Label required>BIN number</Label>
                  <IconInput icon="hashtag" placeholder={`${BIN_LENGTH}-digit BIN`} keyboardType="number-pad" maxLength={BIN_LENGTH} value={form.bin} onChangeText={(t) => set('bin')(onlyDigits(t))} error={errors.bin} />
                  <DigitCounter value={form.bin} length={BIN_LENGTH} error={errors.bin} />
                </View>
                <View>
                  <Label required>TIN number</Label>
                  <IconInput icon="hashtag" placeholder={`${TIN_LENGTH}-digit TIN`} keyboardType="number-pad" maxLength={TIN_LENGTH} value={form.tin} onChangeText={(t) => set('tin')(onlyDigits(t))} error={errors.tin} />
                  <DigitCounter value={form.tin} length={TIN_LENGTH} error={errors.tin} />
                </View>
              </View>
            </Card>

            <Card icon="address-book" title="Contact details" hint="How we reach your business">
              <View className="gap-5">
                <View>
                  <Label>Phone</Label>
                  <IconInput icon="phone" placeholder="Phone number" keyboardType="phone-pad" value={form.phone} onChangeText={set('phone')} />
                </View>
                <View>
                  <Label>Email</Label>
                  <IconInput icon="envelope" placeholder="Email address" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={set('email')} error={errors.email} />
                  {errors.email ? <Text className="text-rose-600 text-xs font-semibold mt-2 px-1">{errors.email}</Text> : null}
                </View>
                <View>
                  <Label>Address</Label>
                  <IconInput icon="location-dot" placeholder="Business address" value={form.address} onChangeText={set('address')} />
                </View>
              </View>
            </Card>

            <Pressable
              onPress={save}
              disabled={busy || !dirty}
              className={`py-5 bg-indigo-600 rounded-3xl flex-row items-center justify-center gap-3 active:bg-indigo-700 ${busy || !dirty ? 'opacity-40' : ''}`}
            >
              {busy ? <ActivityIndicator color="#fff" /> : <Icon name="floppy-disk" size={14} color="#fff" />}
              <Text className="text-white font-black text-sm uppercase tracking-[2px]">{busy ? 'Saving…' : dirty ? 'Save changes' : taxDone ? 'All saved' : 'Add BIN & TIN to continue'}</Text>
            </Pressable>
          </>
        ) : null}

        {/* Log out */}
        <Pressable onPress={confirmLogout} style={cardShadow} className="mt-6 bg-white rounded-3xl border border-slate-100 p-4 flex-row items-center gap-4 active:bg-slate-50">
          <View className="h-11 w-11 rounded-2xl bg-rose-50 items-center justify-center">
            <Icon name="right-from-bracket" size={16} color="#e11d48" />
          </View>
          <View className="flex-1">
            <Text className="text-rose-600 font-black text-[15px]">Log out</Text>
            <Text className="text-slate-400 text-xs mt-0.5">Sign out of {user.company}</Text>
          </View>
          <Icon name="chevron-right" size={12} color={colors.slate300} />
        </Pressable>

        <Text className="text-center text-slate-300 text-[11px] font-bold uppercase tracking-[2px] mt-6">OmniStock • v1.0.0</Text>
      </View>
    </Screen>
  );
}
