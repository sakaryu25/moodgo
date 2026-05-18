import { Clock } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { HistoryItem, FavoriteItem, Recommendation } from '@/types/app';
import PlaceCard from './PlaceCard';

type Props = {
  history: HistoryItem[];
  selectedHistoryItem: HistoryItem | null;
  onSelectHistoryItem: (item: HistoryItem | null) => void;
  onClearHistory: () => void;
  favorites: FavoriteItem[];
  onToggleFavorite: (rec: Recommendation) => void;
  lang?: 'ja' | 'en';
};

const T = {
  ja: {
    backToList: '← 履歴一覧',
    title: '履歴',
    sub: 'これまで見たおすすめ',
    clear: 'クリア',
    empty: 'まだ履歴はありません\n気分から場所を探してみましょう！',
    recCount: (n: number) => `${n}件のおすすめ`,
    noRecs: '詳細なし',
    today: '今日',
    withLabel: '同伴', transportLabel: '交通', budgetLabel: '予算', timeLabel: '時間',
    free: '無料',
  },
  en: {
    backToList: '← History',
    title: 'History',
    sub: 'Past recommendations',
    clear: 'Clear',
    empty: 'No history yet\nLet\'s find a place by mood!',
    recCount: (n: number) => `${n} spots`,
    noRecs: 'No detail',
    today: 'Today',
    withLabel: 'With', transportLabel: 'Transport', budgetLabel: 'Budget', timeLabel: 'Time',
    free: 'Free',
  },
} as const;

function formatDate(dateStr: string | undefined, lang: 'ja' | 'en'): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const today = new Date();
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
  if (isToday) {
    return d.toLocaleTimeString(lang === 'ja' ? 'ja-JP' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', { month: 'short', day: 'numeric' });
}

export default function HistoryView({
  history, selectedHistoryItem, onSelectHistoryItem, onClearHistory,
  favorites, onToggleFavorite, lang = 'ja',
}: Props) {
  const insets = useSafeAreaInsets();
  const isFav = (title: string) => favorites.some((f) => f.title === title);
  const t = T[lang];

  if (selectedHistoryItem) {
    const item = selectedHistoryItem;
    const recCount = item.recommendations?.length ?? 0;
    const transports = Array.isArray(item.transport) ? item.transport.join('・') : item.transport;

    return (
      <ScrollView
        style={s.root}
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => onSelectHistoryItem(null)} style={s.backRow}>
          <Text style={s.backText}>{t.backToList}</Text>
        </TouchableOpacity>

        {/* Session summary card */}
        <View style={s.summaryCard}>
          <View style={s.summaryTop}>
            <View style={s.moodBadgeLg}>
              <Text style={s.moodBadgeLgText}>{item.mood}</Text>
            </View>
            <Text style={s.summaryDate}>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : ''}
            </Text>
          </View>
          <Text style={s.summaryArea} numberOfLines={1}>{item.area || '—'}</Text>
          <View style={s.summaryMeta}>
            {item.companion ? (
              <View style={s.metaChip}>
                <Text style={s.metaChipLabel}>{t.withLabel}</Text>
                <Text style={s.metaChipValue}>{item.companion}</Text>
              </View>
            ) : null}
            {transports ? (
              <View style={s.metaChip}>
                <Text style={s.metaChipLabel}>{t.transportLabel}</Text>
                <Text style={s.metaChipValue}>{transports}</Text>
              </View>
            ) : null}
            {item.time ? (
              <View style={s.metaChip}>
                <Text style={s.metaChipLabel}>{t.timeLabel}</Text>
                <Text style={s.metaChipValue}>{item.time}</Text>
              </View>
            ) : null}
            {item.budget != null && item.budget > 0 ? (
              <View style={s.metaChip}>
                <Text style={s.metaChipLabel}>{t.budgetLabel}</Text>
                <Text style={s.metaChipValue}>¥{item.budget.toLocaleString()}</Text>
              </View>
            ) : null}
          </View>
          {recCount > 0 && (
            <Text style={s.recCountText}>{t.recCount(recCount)}</Text>
          )}
        </View>

        {item.recommendations && item.recommendations.length > 0
          ? item.recommendations.map((rec, i) => (
            <PlaceCard
              key={`${rec.title}-${i}`}
              item={rec}
              isFavorited={isFav(rec.title)}
              onToggleFavorite={() => onToggleFavorite(rec)}
              lang={lang}
            />
          ))
          : (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>{t.noRecs}</Text>
            </View>
          )
        }
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 80 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>{t.title}</Text>
          <Text style={s.pageSub}>{t.sub}</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity onPress={onClearHistory} style={s.clearBtn}>
            <Text style={s.clearText}>{t.clear}</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={s.emptyBox}>
          <Clock size={52} color="#C7C7CC" strokeWidth={1.5} />
          <Text style={s.emptyText}>{t.empty}</Text>
        </View>
      ) : (
        history.map((item) => {
          const recCount = item.recommendations?.length ?? 0;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onSelectHistoryItem(item)}
              style={s.historyCard}
              activeOpacity={0.7}
            >
              <View style={s.historyHeader}>
                <View style={s.moodBadge}>
                  <Text style={s.moodBadgeText}>{item.mood}</Text>
                </View>
                <View style={s.headerRight}>
                  {recCount > 0 && (
                    <View style={s.recBadge}>
                      <Text style={s.recBadgeText}>{t.recCount(recCount)}</Text>
                    </View>
                  )}
                  <Text style={s.dateText}>{formatDate(item.createdAt, lang)}</Text>
                </View>
              </View>
              <Text style={s.spotName} numberOfLines={1}>{item.topRecommendation}</Text>
              <View style={s.tags}>
                {[item.area, item.companion].filter(Boolean).map((tag, i) => (
                  <View key={i} style={s.tag}>
                    <Text style={s.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  pageTitle: { fontSize: 34, fontWeight: '700', color: '#000', letterSpacing: -0.5 },
  pageSub: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  clearBtn: { paddingHorizontal: 4, paddingVertical: 6 },
  clearText: { fontSize: 15, color: '#FF3B30', fontWeight: '400' },
  emptyBox: { alignItems: 'center', paddingVertical: 60, gap: 16 },
  emptyText: { fontSize: 15, color: '#8E8E93', textAlign: 'center', lineHeight: 24 },

  // List card
  historyCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    marginBottom: 10, gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  historyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moodBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
    backgroundColor: '#FF6B3515',
  },
  moodBadgeText: { fontSize: 12, fontWeight: '600', color: '#FF6B35' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5,
    backgroundColor: '#007AFF15',
  },
  recBadgeText: { fontSize: 11, fontWeight: '600', color: '#007AFF' },
  dateText: { fontSize: 12, color: '#8E8E93' },
  spotName: { fontSize: 17, fontWeight: '600', color: '#000' },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: {
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6,
    backgroundColor: '#F2F2F7',
  },
  tagText: { fontSize: 12, fontWeight: '500', color: '#6D6D72' },

  // Detail view
  backRow: { marginBottom: 16 },
  backText: { fontSize: 15, fontWeight: '500', color: '#FF6B35' },
  summaryCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  summaryTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moodBadgeLg: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8,
    backgroundColor: '#FF6B3515',
  },
  moodBadgeLgText: { fontSize: 14, fontWeight: '700', color: '#FF6B35' },
  summaryDate: { fontSize: 13, color: '#8E8E93' },
  summaryArea: { fontSize: 26, fontWeight: '700', color: '#000', letterSpacing: -0.4, lineHeight: 32 },
  summaryMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  metaChipLabel: { fontSize: 11, color: '#8E8E93', fontWeight: '500' },
  metaChipValue: { fontSize: 12, color: '#3C3C43', fontWeight: '600' },
  recCountText: { fontSize: 13, color: '#007AFF', fontWeight: '600' },
});
