import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import BottomSheet from './BottomSheet';
import Icon from './Icon';
import { Label, IconInput, Dropdown, SheetHeader } from './FormParts';
import DateField from './DateField';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { colors, toYMD } from '../theme';
import { tap, success, warn } from '../haptics';

const MAX_BYTES = 5 * 1024 * 1024;

// Submit a bank deposit for approval. Banks come from the API.
const DepositForm = ({ visible, onClose, onDone }) => {
  const { notify } = useToast();
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [voucherNo, setVoucherNo] = useState('');
  const [date, setDate] = useState(new Date());
  const [bankId, setBankId] = useState('');
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setBanksLoading(true);
    api.getBanks().then(setBanks).catch((e) => notify(e.message, 'error')).finally(() => setBanksLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const reset = () => { setVoucherNo(''); setDate(new Date()); setBankId(''); setAmount(''); setFile(null); };

  const pickFile = async () => {
    tap();
    const res = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
    if (res.canceled || !res.assets?.length) return;
    const f = res.assets[0];
    if (f.size && f.size > MAX_BYTES) {
      warn();
      Alert.alert('File too large', 'Max size is 5MB.');
      return;
    }
    setFile(f);
  };

  const valid = voucherNo.trim() && bankId && parseFloat(amount) > 0;

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      await api.createDeposit({ voucher_no: voucherNo.trim(), date: toYMD(date), bank_id: bankId, amount: parseFloat(amount), attachment: file });
      success();
      reset();
      onClose();
      notify('Deposit submitted. Waiting for approval.');
      onDone && onDone();
    } catch (e) {
      notify(e.message || 'Could not submit the deposit.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <SheetHeader badge="Financial entry" title="New deposit" subtitle="Submit a bank deposit for approval." onClose={onClose} />

      <View className="gap-5">
        <View>
          <Label required>Voucher no.</Label>
          <IconInput icon="hashtag" placeholder="e.g. DEP-9921" value={voucherNo} onChangeText={setVoucherNo} autoCapitalize="characters" />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Label>Deposit date</Label>
            <DateField value={date} onChange={setDate} />
          </View>
          <View className="flex-1">
            <Label required>Amount</Label>
            <IconInput icon="coins" keyboardType="decimal-pad" placeholder="0.00" value={amount} onChangeText={setAmount} />
          </View>
        </View>

        <View>
          <Label required>Bank account</Label>
          <Dropdown
            icon="building-columns"
            placeholder="Select bank account"
            title="Bank account"
            loading={banksLoading}
            value={bankId}
            onChange={setBankId}
            options={banks.map((b) => ({ value: b.id, label: b.name, sub: `A/C ${b.account_no}` }))}
          />
        </View>

        <View>
          <Label>Deposit copy</Label>
          <Pressable
            onPress={pickFile}
            className={`flex-row items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-5 px-4 ${file ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}
          >
            <View className={`h-10 w-10 rounded-xl items-center justify-center ${file ? 'bg-indigo-600' : 'bg-slate-200'}`}>
              <Icon name={file ? 'check' : 'paperclip'} size={15} color={file ? '#fff' : colors.slate500} />
            </View>
            <View className="shrink">
              <Text className={`text-sm font-bold ${file ? 'text-indigo-700' : 'text-slate-600'}`} numberOfLines={1}>{file ? file.name : 'Upload attachment'}</Text>
              <Text className="text-[10px] text-slate-400 font-medium">Max size: 5MB (PDF, JPG, PNG)</Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          onPress={submit}
          disabled={!valid || busy}
          className={`py-5 bg-slate-900 rounded-3xl flex-row items-center justify-center gap-3 mt-1 active:opacity-80 ${valid && !busy ? '' : 'opacity-40'}`}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Icon name="circle-check" size={14} color="#fff" />}
          <Text className="text-white font-black text-sm uppercase tracking-[2px]">{busy ? 'Submitting…' : 'Submit deposit'}</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

export default DepositForm;
