import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { UserRound } from 'lucide-react-native';

const AGE_OPTIONS    = ['10代', '20代', '30代', '40代', '50代', '60代以上'];
const GENDER_OPTIONS = ['男性', '女性', 'その他', '答えたくない'];

type Props = { onDone: (age: string, gender: string) => void };

export default function ProfileSetup({ onDone }: Props) {
  const [age, setAge]       = useState('');
  const [gender, setGender] = useState('');

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.iconWrap}>
          <UserRound size={44} color="#FF6B35" strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>プロフィール設定</Text>
        <Text style={styles.sub}>より良いおすすめのために教えてください。{'\n'}後からいつでも変更できます。</Text>

        <Text style={styles.sectionLabel}>年代</Text>
        <View style={styles.optionGrid}>
          {AGE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setAge(opt)}
              style={[styles.optionBtn, age === opt && styles.optionBtnActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, age === opt && styles.optionTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>性別</Text>
        <View style={styles.optionGrid}>
          {GENDER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setGender(opt)}
              style={[styles.optionBtn, gender === opt && styles.optionBtnActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, gender === opt && styles.optionTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => onDone(age, gender)}
          style={styles.doneBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.doneBtnText}>はじめる</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDone('', '')} style={styles.skipBtn}>
          <Text style={styles.skipText}>スキップ</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 24, paddingTop: 48, alignItems: 'center' },
  iconWrap: {
    width: 88, height: 88, borderRadius: 22, backgroundColor: '#FF6B3515',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#000', marginBottom: 8, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: '#8E8E93', textAlign: 'center', lineHeight: 22, marginBottom: 36 },
  sectionLabel: {
    alignSelf: 'flex-start', fontSize: 13, fontWeight: '600', color: '#6D6D72',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },
  optionGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: '100%', marginBottom: 28,
  },
  optionBtn: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2,
  },
  optionBtnActive: { backgroundColor: '#FF6B3515', shadowOpacity: 0 },
  optionText: { fontSize: 14, fontWeight: '500', color: '#000' },
  optionTextActive: { color: '#FF6B35', fontWeight: '600' },
  doneBtn: {
    width: '100%', height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FF6B35', marginTop: 8,
    shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
  },
  doneBtnText: { fontSize: 17, fontWeight: '600', color: '#fff' },
  skipBtn: { marginTop: 16, padding: 8 },
  skipText: { fontSize: 15, color: '#8E8E93' },
});
