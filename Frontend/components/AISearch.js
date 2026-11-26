import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from './Icon';
import { geminiService } from '../services/geminiService';
import { colors, bigShadow } from '../theme';
import { press, success } from '../haptics';

const AISearch = ({ products }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAISearch = async () => {
    if (!query.trim() || isLoading) return;
    press();
    setIsLoading(true);
    const aiResponse = await geminiService.analyzeInventory(products, query);
    setResult(aiResponse);
    setIsLoading(false);
    success();
  };

  return (
    <LinearGradient
      colors={[colors.indigo600, colors.violet700]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ padding: 24, borderRadius: 24, marginBottom: 24 }, bigShadow(colors.indigo600)]}
    >
      <View className="flex-row items-center gap-2 mb-4">
        <View className="bg-white/20 p-2 rounded-lg">
          <Icon name="wand-magic-sparkles" size={16} color="#fff" />
        </View>
        <Text className="text-white text-lg font-bold">OmniStock AI Analyst</Text>
      </View>

      <Text className="text-indigo-100 text-sm mb-4">Ask anything about your stock across DMS and IMS systems.</Text>

      <View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleAISearch}
          returnKeyType="send"
          placeholder="e.g. Which brand has the highest value?"
          placeholderTextColor="rgba(255,255,255,0.5)"
          selectionColor="#fff"
          className="bg-white/10 border border-white/20 rounded-xl py-3 pl-4 pr-[52px] text-sm text-white"
        />
        <Pressable
          onPress={handleAISearch}
          disabled={isLoading}
          className={`absolute right-2 top-1.5 bg-white h-9 w-9 rounded-lg items-center justify-center ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? <ActivityIndicator size="small" color={colors.indigo600} /> : <Icon name="arrow-right" size={14} color={colors.indigo600} />}
        </Pressable>
      </View>

      {result ? (
        <View className="mt-4 p-4 bg-white/10 rounded-xl border border-white/10">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[10px] font-bold uppercase tracking-[1.5px] text-indigo-200">AI Response</Text>
            <Pressable onPress={() => setResult(null)} hitSlop={10}>
              <Icon name="xmark" size={14} color="rgba(255,255,255,0.5)" />
            </Pressable>
          </View>
          <Text className="text-white text-sm leading-5">{result}</Text>
        </View>
      ) : null}
    </LinearGradient>
  );
};

export default AISearch;
