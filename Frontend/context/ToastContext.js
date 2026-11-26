import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { bigShadow } from '../theme';

const ToastContext = createContext({ notify: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState(null);
  const y = useRef(new Animated.Value(-140)).current;
  const timer = useRef(null);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    Animated.timing(y, { toValue: 0, duration: 280, useNativeDriver: true }).start();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      Animated.timing(y, { toValue: -140, duration: 240, useNativeDriver: true }).start(() => setToast(null));
    }, 3000);
  }, [y]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const isError = toast && toast.type === 'error';
  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {toast && (
        <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 20, right: 20, zIndex: 999, top: insets.top + 10, transform: [{ translateY: y }] }}>
          <View style={bigShadow('#000')} className={`p-4 rounded-2xl flex-row items-center gap-3 border ${isError ? 'bg-rose-600 border-rose-400' : 'bg-blue-600 border-blue-400'}`}>
            <Icon name={isError ? 'triangle-exclamation' : 'circle-check'} size={18} color="#fff" />
            <Text className="text-white text-sm font-semibold shrink">{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}
