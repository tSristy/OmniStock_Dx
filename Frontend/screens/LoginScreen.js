import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MeshBackground from '../components/MeshBackground';
import Icon from '../components/Icon';
import { Label, IconInput, Dropdown } from '../components/FormParts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { press, warn } from '../haptics';

// Login: DMS code + password + company. The session is saved on the device
// (see AuthContext) so this screen only shows again after Logout.
export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [companyCode, setCompanyCode] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadCompanies = useCallback(async () => {
    setCompaniesLoading(true);
    setCompaniesError(null);
    try { setCompanies((await api.getCompanies()).data); }
    catch (e) { setCompaniesError(e.message); }
    finally { setCompaniesLoading(false); }
  }, []);
  useEffect(() => { loadCompanies(); }, [loadCompanies]);

  const submit = async () => {
    if (busy) return;
    if (!username.trim() || !password || !companyCode) {
      warn();
      setError('Enter your DMS code, password and choose a company.');
      return;
    }
    press();
    setBusy(true);
    setError(null);
    try {
      await signIn({ username, password, company_code: companyCode });
    } catch (e) {
      warn();
      setError(e.message || 'Could not sign in.');
      setBusy(false);
    }
  };

  return (
    <View className="flex-1 bg-ink">
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill}><MeshBackground /></View>

      {/* Brand */}
      <View style={{ paddingTop: insets.top + 28 }} className="px-7">
        <View className="h-12 w-12 rounded-2xl bg-white/20 items-center justify-center mb-4">
          <Icon name="boxes-stacked" size={20} color="#fff" />
        </View>
        <Text className="text-white text-3xl font-black tracking-tight">OmniStock</Text>
        <Text className="text-white/70 text-sm font-medium mt-1">Distributor portal</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'flex-end' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ flexGrow: 0 }}
        >
          <View className="bg-ink-800 rounded-t-[40px] px-6 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) + 12 }}>
            <View className="w-10 h-1 bg-white/20 rounded-full self-center mb-6" />

            <View className="items-center mb-6">
              <View className="h-12 w-12 rounded-2xl bg-ink border border-white/10 items-center justify-center mb-4">
                <Icon name="lock" size={16} color="#fff" />
              </View>
              <Text className="text-white text-[26px] font-bold">Welcome <Text className="text-blue-300">back</Text></Text>
              <Text className="text-white/45 text-sm mt-1.5">Sign in to place orders and track your account</Text>
            </View>

            <View className="gap-4">
              <View>
                <Label dark>DMS code / username</Label>
                <IconInput dark icon="user" placeholder="e.g. DMS-0042" value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} returnKeyType="next" />
              </View>

              <View>
                <Label dark>Password</Label>
                <IconInput
                  dark
                  icon="lock"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="go"
                  onSubmitEditing={submit}
                  right={
                    <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={10}>
                      <Icon name={showPw ? 'eye-slash' : 'eye'} size={15} color="#8b8b96" />
                    </Pressable>
                  }
                />
              </View>

              <View>
                <Label dark>Company</Label>
                <Dropdown
                  dark
                  icon="building"
                  title="Select company"
                  placeholder="Select your company"
                  loading={companiesLoading}
                  value={companyCode}
                  onChange={setCompanyCode}
                  options={companies.map((c) => ({ value: c.code, label: c.name }))}
                />
                {companiesError ? (
                  <Pressable onPress={loadCompanies} className="mt-2">
                    <Text className="text-rose-400 text-xs">{companiesError} <Text className="underline">Retry</Text></Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            {error ? <Text className="text-rose-400 text-[13px] mt-4 text-center">{error}</Text> : null}

            <Pressable
              onPress={submit}
              disabled={busy}
              className={`mt-6 h-[60px] bg-[#f5f5f5] rounded-full items-center justify-center active:opacity-80 ${busy ? 'opacity-70' : ''}`}
            >
              {busy ? <ActivityIndicator color="#0b0b0c" /> : <Text className="text-ink text-base font-bold">Sign in</Text>}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
