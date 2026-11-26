import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { IconInput, Dropdown } from '../components/FormParts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { press, warn } from '../haptics';

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

// Soft tilted squares in the background (decoration only)
const Square = ({ style }) => (
  <View pointerEvents="none" style={[{ position: 'absolute', backgroundColor: '#f4f4f4', borderRadius: 28 }, style]} />
);

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
    try { setCompanies(await api.getCompanies()); }
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
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <Square style={{ width: 120, height: 120, right: -28, top: '22%', transform: [{ rotate: '14deg' }] }} />
      <Square style={{ width: 96, height: 96, left: -34, top: '34%', transform: [{ rotate: '-14deg' }] }} />
      <Square style={{ width: 120, height: 120, right: -36, top: '46%', transform: [{ rotate: '12deg' }] }} />

      {/* Logo */}
      <View style={{ paddingTop: insets.top + 14 }} className="px-6">
        <Image source={require('../assets/dx-logo.png')} style={{ width: 64, height: 48 }} resizeMode="contain" />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 16) + 12 }}
        >
          <Text style={{ fontFamily: SERIF, fontSize: 30, lineHeight: 36, color: '#111', textAlign: 'center', marginBottom: 28 }}>
            Your own{'\n'}Distributor Portal
          </Text>

          <View className="gap-3">
            <IconInput pill icon="user" placeholder="DMS code / username" value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} returnKeyType="next" />
            <IconInput
              pill
              icon="lock"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={submit}
              right={
                <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={10}>
                  <Icon name={showPw ? 'eye-slash' : 'eye'} size={15} color="#8e8e93" />
                </Pressable>
              }
            />
            <Dropdown
              pill
              icon="building"
              title="Select company"
              placeholder="Select your company"
              loading={companiesLoading}
              value={companyCode}
              onChange={setCompanyCode}
              options={companies.map((c) => ({ value: c.code, label: c.name }))}
            />
            {companiesError ? (
              <Pressable onPress={loadCompanies}>
                <Text className="text-rose-600 text-xs text-center">{companiesError} <Text className="underline">Retry</Text></Text>
              </Pressable>
            ) : null}
          </View>

          {error ? <Text className="text-rose-600 text-[13px] mt-4 text-center">{error}</Text> : null}

          <Pressable
            onPress={submit}
            disabled={busy}
            className={`mt-4 h-[58px] bg-[#222] rounded-full items-center justify-center active:opacity-80 ${busy ? 'opacity-70' : ''}`}
          >
            {busy ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-[15px] font-medium">Sign in</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
