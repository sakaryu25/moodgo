import { Image } from 'expo-image';
import { Camera, Star } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FeaturedPageSummary } from '@/types/app';
import { useRouter } from 'expo-router';

type Props = {
  featuredList: FeaturedPageSummary[];
  featuredListLoading: boolean;
  lang?: 'ja' | 'en';
};

const T = {
  ja: {
    title: '特集',
    sub: 'MoodGoが厳選したスポット',
    all: 'すべて',
    empty: '特集コンテンツを読み込み中…\nインターネット接続を確認してください。',
    by: 'by',
  },
  en: {
    title: 'Featured',
    sub: 'Spots curated by MoodGo',
    all: 'All',
    empty: 'Loading featured content…\nPlease check your internet connection.',
    by: 'by',
  },
};

export default function FeaturedView({ featuredList, featuredListLoading, lang = 'ja' }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const t = T[lang];
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    featuredList.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [featuredList]);

  const filtered = selectedTag
    ? featuredList.filter((item) => item.tags.includes(selectedTag))
    : featuredList;

  const heroItem = filtered[0] ?? null;
  const restItems = filtered.slice(1);

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 80 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.pageTitle}>{t.title}</Text>
      <Text style={s.pageSub}>{t.sub}</Text>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filterScroll}
          contentContainerStyle={s.filterRow}
        >
          <TouchableOpacity
            onPress={() => setSelectedTag(null)}
            style={[s.filterChip, selectedTag === null && s.filterChipActive]}
          >
            <Text style={[s.filterChipText, selectedTag === null && s.filterChipTextActive]}>
              {t.all}
            </Text>
          </TouchableOpacity>
          {allTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
              style={[s.filterChip, selectedTag === tag && s.filterChipActive]}
            >
              <Text style={[s.filterChipText, selectedTag === tag && s.filterChipTextActive]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {featuredListLoading ? (
        <View style={s.loading}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.emptyBox}>
          <Star size={52} color="#C7C7CC" strokeWidth={1.5} />
          <Text style={s.emptyText}>{t.empty}</Text>
        </View>
      ) : (
        <>
          {/* Hero card */}
          {heroItem && (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/feature/[slug]', params: { slug: heroItem.slug, lang } })}
              style={s.heroCard}
              activeOpacity={0.88}
            >
              {heroItem.cover_image_url ? (
                <Image source={{ uri: heroItem.cover_image_url }} style={s.heroImg} contentFit="cover" />
              ) : (
                <View style={[s.heroImg, s.imgPlaceholder]}>
                  <Camera size={48} color="#C7C7CC" strokeWidth={1.5} />
                </View>
              )}
              <View style={s.heroOverlay} />
              <View style={s.heroBody}>
                {heroItem.partner_name ? (
                  <Text style={s.heroPartner}>{t.by} {heroItem.partner_name}</Text>
                ) : null}
                <Text style={s.heroTitle} numberOfLines={2}>{heroItem.spot_name}</Text>
                {heroItem.catch_copy ? (
                  <Text style={s.heroCopy} numberOfLines={2}>{heroItem.catch_copy}</Text>
                ) : null}
                <View style={s.heroTags}>
                  {heroItem.tags.slice(0, 3).map((tag, i) => (
                    <View key={i} style={s.heroTag}>
                      <Text style={s.heroTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Remaining cards */}
          {restItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push({ pathname: '/feature/[slug]', params: { slug: item.slug, lang } })}
              style={s.card}
              activeOpacity={0.85}
            >
              {item.cover_image_url ? (
                <Image source={{ uri: item.cover_image_url }} style={s.cardImg} contentFit="cover" />
              ) : (
                <View style={[s.cardImg, s.imgPlaceholder]}>
                  <Camera size={40} color="#C7C7CC" strokeWidth={1.5} />
                </View>
              )}
              <View style={s.cardBody}>
                {item.partner_name ? (
                  <Text style={s.partnerName}>{t.by} {item.partner_name}</Text>
                ) : null}
                <Text style={s.cardTitle} numberOfLines={2}>{item.spot_name}</Text>
                {item.catch_copy ? (
                  <Text style={s.cardCopy} numberOfLines={2}>{item.catch_copy}</Text>
                ) : null}
                <View style={s.tags}>
                  {item.tags.slice(0, 3).map((tag, i) => (
                    <View key={i} style={s.tag}>
                      <Text style={s.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 16 },
  pageTitle: { fontSize: 34, fontWeight: '700', color: '#000', letterSpacing: -0.5 },
  pageSub: { fontSize: 13, color: '#8E8E93', marginTop: 2, marginBottom: 12 },

  filterScroll: { marginHorizontal: -16, marginBottom: 16 },
  filterRow: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5EA',
  },
  filterChipActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#3C3C43' },
  filterChipTextActive: { color: '#fff' },

  loading: { paddingVertical: 60, alignItems: 'center' },
  emptyBox: { alignItems: 'center', paddingVertical: 60, gap: 16 },
  emptyText: { fontSize: 15, color: '#8E8E93', textAlign: 'center', lineHeight: 24 },

  // Hero card
  heroCard: {
    borderRadius: 18, overflow: 'hidden', marginBottom: 14, height: 280,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 5,
  },
  heroImg: { position: 'absolute', width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
    // gradient-like fade from transparent to black
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroBody: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 18, gap: 4,
  },
  heroPartner: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#fff', lineHeight: 28, letterSpacing: -0.3 },
  heroCopy: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 18 },
  heroTags: { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  heroTag: {
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  heroTagText: { fontSize: 11, fontWeight: '600', color: '#fff' },

  // Regular card
  card: {
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  cardImg: { width: '100%', height: 180 },
  imgPlaceholder: { backgroundColor: '#F2F2F7', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 14, gap: 5 },
  partnerName: { fontSize: 12, color: '#8E8E93' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#000', lineHeight: 24 },
  cardCopy: { fontSize: 14, color: '#3C3C43', lineHeight: 20 },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 2 },
  tag: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
    backgroundColor: '#F2F2F7',
  },
  tagText: { fontSize: 12, fontWeight: '500', color: '#6D6D72' },
});
