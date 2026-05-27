import { Check } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const PREFECTURE_OPTIONS = [
  '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島',
  '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川',
  '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜',
  '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫',
  '奈良', '和歌山', '鳥取', '島根', '岡山', '広島', '山口',
  '徳島', '香川', '愛媛', '高知', '福岡', '佐賀', '長崎',
  '熊本', '大分', '宮崎', '鹿児島', '沖縄',
];

type Props = {
  visible: boolean;
  value: string;
  onSelect: (v: string) => void;
  onClose: () => void;
  lang?: 'ja' | 'en';
};

export default function PrefecturePicker({ visible, value, onSelect, onClose, lang = 'ja' }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[s.root, { paddingTop: insets.top || 20 }]}>
        <View style={s.header}>
          <Text style={s.title}>{lang === 'ja' ? '都道府県' : 'Prefecture'}</Text>
          <TouchableOpacity onPress={onClose} style={s.doneBtn}>
            <Text style={s.doneBtnText}>{lang === 'ja' ? '完了' : 'Done'}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={s.scroll}
          contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.card}>
            {PREFECTURE_OPTIONS.map((pref, i) => (
              <TouchableOpacity
                key={pref}
                onPress={() => { onSelect(pref); onClose(); }}
                style={[s.row, i < PREFECTURE_OPTIONS.length - 1 && s.rowBorder]}
                activeOpacity={0.7}
              >
                <Text style={[s.rowText, value === pref && s.rowTextActive]}>{pref}</Text>
                {value === pref && <Check size={18} color="#FF6B35" strokeWidth={2.5} />}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.12)',
  },
  title: { fontSize: 17, fontWeight: '700', color: '#000' },
  doneBtn: { paddingVertical: 4, paddingHorizontal: 2 },
  doneBtnText: { fontSize: 17, fontWeight: '600', color: '#FF6B35' },
  scroll: { flex: 1 },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, minHeight: 48,
  },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5EA' },
  rowText: { fontSize: 16, color: '#000' },
  rowTextActive: { color: '#FF6B35', fontWeight: '600' },
});
