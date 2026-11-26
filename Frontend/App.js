import './global.css';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import LoginScreen from './screens/LoginScreen';
import MainTabs from './navigation/MainTabs';

// Gate: checking saved login -> splash, logged out -> Login, logged in -> app.
function Gate() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <StatusBar style="light" />
        <ActivityIndicator color="#3b82f6" />
      </View>
    );
  }
  if (status === 'out') return <LoginScreen />;

  return (
    <CartProvider>
      <StatusBar style="dark" />
      <MainTabs />
    </CartProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <Gate />
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
