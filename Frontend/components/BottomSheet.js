import React from 'react';
import { Modal, View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { bigShadow } from '../theme';

// Rounded sheet that floats up from the bottom (cart, order detail, deposit form)
const BottomSheet = ({ visible, onClose, children }) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Pressable onPress={onClose} className="flex-1 bg-slate-900/60 justify-end p-4">
        <Pressable onPress={() => {}} style={bigShadow()} className="bg-white rounded-[40px] p-8 max-h-[90%]">
          <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-8" />
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </KeyboardAvoidingView>
  </Modal>
);

export default BottomSheet;
