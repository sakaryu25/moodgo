import { BlurView } from 'expo-blur';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Search } from 'lucide-react-native';
import type { Recommendation, FavoriteItem } from '@/types/app';
import type { PlaceResponse } from '@/types/onsen';
import PlaceCard from './PlaceCard';

// Convert PlaceResponse to Recommendation for unified rendering
function placeToRec(fac: PlaceResponse, featLabel?: string): Recommendation {
  const photos = (fac.photoUrls ?? []).length > 0 ? fac.photoUrls : fac.imageUrl ? [fac.imageUrl] : [];
  return {
    title: fac.name,
    address: fac.address,
    mapUrl: fac.googleMapsUrl,
    rating: fac.rating,
    userRatingCount: fac.reviewCount,
    photoUrl: fac.imageUrl || undefined,
    photoUrls: photos,
    openNow: fac.openNow ?? undefined,
    openingHoursText: fac.openingHours ?? undefined,
    priceLevel: fac.priceLevel ?? undefined,
    distanceText: fac.distanceInfo || undefined,
    stationText: fac.stationInfo || undefined,
    features: [fac.description || featLabel || ''].filter(Boolean),
    source: fac.source,
    hotpepperUrl: fac.hotpepperUrl,
  };
}

type Props = {
  selectedMood: string;
  selectedArea: string;
  recommendations: Recommendation[];
  onsenFacilities: PlaceResponse[] | null;
  onsenCategoryLabel: string;
  natureFacilities: PlaceResponse[] | null;
  natureSubGenreLabel: string;
  cafeFacilities: PlaceResponse[] | null;
  cafeSubCategoryLabel: string;
  waiWaiFacilities: PlaceResponse[] | null;
  waiWaiSubCategoryLabel: string;
  isLoading: boolean;
  loadingMessage: string;
  apiWarning: string;
  favorites: FavoriteItem[];
  onToggleFavorite: (rec: Recommendation) => void;
  placeRatings: Record<string, 'good' | 'bad'>;
  onSetPlaceRatings: (r: Record<string, 'good' | 'bad'>) => void;
  photoIndices: Record<string, number>;
  onSetPhotoIndices: (r: Record<string, number>) => void;
  blockedPlaces: string[];
  onBlockPlace: (title: string) => void;
  feedbackRating: number | null;
  feedbackSubmitted: boolean;
  onSubmitFeedback: (rating: number) => void;
  likedInSession: string[];
  onSetLikedInSession: (v: string[]) => void;
  mapClickedInSession: string[];
  onSetMapClickedInSession: (v: string[]) => void;
  refinementText: string;
  onSetRefinementText: (v: string) => void;
  isRefining: boolean;
  onRefine: () => void;
  onReset: () => void;
  reportingSpot: { title: string; address: string } | null;
  onSetReportingSpot: (v: { title: string; address: string } | null) => void;
  reportReason: string;
  onSetReportReason: (v: string) => void;
  reportNote: string;
  onSetReportNote: (v: string) => void;
  reportSubmitting: boolean;
  reportDone: boolean;
  onSubmitReport: () => void;
};

export default function ResultsView(props: Props) {
  const {
    selectedMood, selectedArea,
    recommendations, onsenFacilities, onsenCategoryLabel,
    natureFacilities, natureSubGenreLabel, cafeFacilities, cafeSubCategoryLabel,
    waiWaiFacilities, waiWaiSubCategoryLabel,
    isLoading, loadingMessage, apiWarning,
    favorites, onToggleFavorite, blockedPlaces, onBlockPlace,
    feedbackRating, feedbackSubmitted, onSubmitFeedback,
    refinementText, onSetRefinementText, isRefining, onRefine,
    onReset, onSetReportingSpot, reportingSpot,
    reportReason, onSetReportReason, reportNote, onSetReportNote,
    reportSubmitting, reportDone, onSubmitReport,
  } = props;

  const insets = useSafeAreaInsets();
  const isFav = (title: string) => favorites.some((f) => f.title === title);

  // Determine what to show
  const facilityList: PlaceResponse[] | null =
    waiWaiFacilities ?? cafeFacilities ?? onsenFacilities ?? natureFacilities ?? null;
  const facilityLabel =
    waiWaiFacilities ? waiWaiSubCategoryLabel :
    cafeFacilities ? cafeSubCategoryLabel :
    onsenFacilities ? onsenCategoryLabel :
    natureFacilities ? natureSubGenreLabel : '';
  const accentColor =
    waiWaiFacilities ? '#ff4da6' :
    cafeFacilities ? '#a96032' :
    onsenFacilities ? '#1565c0' :
    natureFacilities ? '#4caf50' :
    '#ff8fa5';

  const pageTitle =
    facilityList
      ? `${facilityLabel || '検索結果'}`
      : `${selectedArea}でのおすすめ`;

  // Items to render
  const facilityItems = facilityList
    ? facilityList
        .filter((f) => !blockedPlaces.includes(f.name))
        .map((f) => placeToRec(f, facilityLabel))
    : recommendations.filter((r) => !blockedPlaces.includes(r.title));

  return (
    <View style={s.root}>
      {/* iOS navigation bar */}
      <View style={[s.navBar, { paddingTop: insets.top }]}>
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <View style={s.navBarBorder} />
        <View style={s.navBarInner}>
          <TouchableOpacity onPress={onReset} style={s.backBtn} activeOpacity={0.6} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ChevronLeft size={20} color="#FF6B35" strokeWidth={2.5} />
            <Text style={s.backText}>戻る</Text>
          </TouchableOpacity>
          <Text style={s.navTitle} numberOfLines={1}>{pageTitle}</Text>
          <View style={s.navRight} />
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {facilityLabel ? (
          <View style={s.labelBadge}>
            <Text style={[s.labelBadgeText, { color: accentColor }]}>{facilityLabel}</Text>
          </View>
        ) : null}

        {/* Loading */}
        {isLoading && (
          <View style={s.loadingBox}>
            <ActivityIndicator size="large" color={accentColor} />
            <Text style={s.loadingText}>{loadingMessage}</Text>
          </View>
        )}

        {/* Warning */}
        {apiWarning && !isLoading ? (
          <View style={s.warningBox}>
            <Text style={s.warningText}>{apiWarning}</Text>
          </View>
        ) : null}

        {/* Results */}
        {!isLoading && facilityItems.length > 0 && facilityItems.map((item, i) => (
          <PlaceCard
            key={`${item.title}-${i}`}
            item={item}
            isFavorited={isFav(item.title)}
            onToggleFavorite={() => onToggleFavorite(item)}
            onBlock={() => onBlockPlace(item.title)}
            onReport={() => onSetReportingSpot({ title: item.title, address: item.address ?? '' })}
            accentColor={accentColor}
          />
        ))}

        {/* Empty state */}
        {!isLoading && facilityItems.length === 0 && (
          <View style={s.emptyBox}>
            <Search size={48} color="#C7C7CC" strokeWidth={1.5} />
            <Text style={s.emptyText}>条件に合う候補が見つかりませんでした。{'\n'}条件を変えて再検索してみてください。</Text>
          </View>
        )}

        {/* Refinement */}
        {!isLoading && facilityItems.length > 0 && (
          <View style={s.refinementBox}>
            <Text style={s.refinementTitle}>絞り込む</Text>
            <TextInput
              value={refinementText}
              onChangeText={onSetRefinementText}
              placeholder="例：もっと近い場所、夜遅くまで営業、駐車場あり…"
              placeholderTextColor="#C7C7CC"
              multiline
              style={s.refinementInput}
            />
            <TouchableOpacity
              onPress={onRefine}
              disabled={isRefining || !refinementText.trim()}
              activeOpacity={0.75}
              style={[s.refinementBtn, (isRefining || !refinementText.trim()) && s.refinementBtnDisabled]}
            >
              <Text style={s.refinementBtnText}>
                {isRefining ? '検索中...' : '再検索する'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Feedback */}
        {!isLoading && !feedbackSubmitted && recommendations.length > 0 && !facilityList && (
          <View style={s.feedbackBox}>
            <Text style={s.feedbackTitle}>おすすめはいかがでしたか？</Text>
            <View style={s.stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => onSubmitFeedback(n)} style={s.starBtn}>
                  <Text style={[s.starText, feedbackRating !== null && n <= (feedbackRating ?? 0) && s.starActive]}>
                    {feedbackRating !== null && n <= feedbackRating ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {feedbackSubmitted && (
          <View style={s.feedbackBox}>
            <Text style={s.feedbackThanks}>ありがとうございました！🎉</Text>
          </View>
        )}

        {/* Reset button */}
        <TouchableOpacity onPress={onReset} style={s.resetBtn} activeOpacity={0.7}>
          <Text style={s.resetBtnText}>最初からやり直す</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Report modal */}
      {reportingSpot && (
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>不適切な内容を報告</Text>
            <Text style={s.modalSpotName}>{reportingSpot.title}</Text>
            {reportDone ? (
              <>
                <Text style={s.modalThanks}>報告ありがとうございました。</Text>
                <TouchableOpacity onPress={() => onSetReportingSpot(null)} style={s.modalCloseBtn}>
                  <Text style={s.modalCloseBtnText}>閉じる</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={s.modalLabel}>理由</Text>
                <View style={s.modalOptions}>
                  {['不正確な情報', '不適切なコンテンツ', '存在しない場所', 'その他'].map((r) => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => onSetReportReason(r)}
                      style={[s.modalOption, reportReason === r && s.modalOptionActive]}
                    >
                      <Text style={[s.modalOptionText, reportReason === r && s.modalOptionTextActive]}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  value={reportNote}
                  onChangeText={onSetReportNote}
                  placeholder="詳細（任意）"
                  placeholderTextColor="#b07080"
                  style={s.modalInput}
                />
                <View style={s.modalBtns}>
                  <TouchableOpacity onPress={() => onSetReportingSpot(null)} style={s.modalCancelBtn}>
                    <Text style={s.modalCancelText}>キャンセル</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onSubmitReport}
                    disabled={reportSubmitting || !reportReason}
                    style={s.modalSubmitBtn}
                  >
                    <Text style={s.modalSubmitText}>
                      {reportSubmitting ? '送信中...' : '送信'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F7' },

  // iOS nav bar
  navBar: {
    zIndex: 10, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 0,
  },
  navBarBorder: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(0,0,0,0.15)',
  },
  navBarInner: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 10, minHeight: 44,
  },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    paddingHorizontal: 6, paddingVertical: 4, minWidth: 72,
  },
  backText: { fontSize: 17, color: '#FF6B35', fontWeight: '400' },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600', color: '#000' },
  navRight: { minWidth: 72 },

  scroll: { flex: 1 },
  content: { padding: 16 },

  labelBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, marginBottom: 12,
    backgroundColor: '#F2F2F7',
  },
  labelBadgeText: { fontSize: 13, fontWeight: '600' },

  loadingBox: { alignItems: 'center', paddingVertical: 60, gap: 16 },
  loadingText: { fontSize: 15, color: '#6D6D72', textAlign: 'center', lineHeight: 22 },

  warningBox: {
    backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14, marginBottom: 12,
  },
  warningText: { fontSize: 13, color: '#92600A', lineHeight: 20 },

  emptyBox: { alignItems: 'center', paddingVertical: 60, gap: 14 },
  emptyText: { fontSize: 15, color: '#8E8E93', textAlign: 'center', lineHeight: 22 },

  // Refinement
  refinementBox: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    marginTop: 4, marginBottom: 12, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  refinementTitle: { fontSize: 15, fontWeight: '600', color: '#000' },
  refinementInput: {
    borderRadius: 10, backgroundColor: '#F2F2F7', padding: 12,
    fontSize: 14, color: '#000', minHeight: 72, textAlignVertical: 'top',
  },
  refinementBtn: {
    height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FF6B35',
  },
  refinementBtnDisabled: { backgroundColor: '#C7C7CC' },
  refinementBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },

  // Feedback
  feedbackBox: {
    backgroundColor: '#fff', borderRadius: 14, padding: 20, marginBottom: 12,
    alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  feedbackTitle: { fontSize: 15, fontWeight: '600', color: '#000' },
  stars: { flexDirection: 'row', gap: 6 },
  starBtn: { padding: 6 },
  starText: { fontSize: 30, color: '#E5E5EA' },
  starActive: { color: '#FF9F0A' },
  feedbackThanks: { fontSize: 15, fontWeight: '600', color: '#34C759' },

  resetBtn: {
    alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 999, marginBottom: 12,
  },
  resetBtnText: { fontSize: 15, color: '#FF6B35', fontWeight: '500' },

  // Report modal
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'flex-end', padding: 0,
  },
  modal: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, width: '100%',
  },
  modalTitle: { fontSize: 17, fontWeight: '600', color: '#000', marginBottom: 4 },
  modalSpotName: { fontSize: 13, color: '#8E8E93', marginBottom: 16 },
  modalThanks: { fontSize: 15, fontWeight: '600', color: '#34C759', textAlign: 'center', marginVertical: 16 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#6D6D72', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  modalOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  modalOption: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  modalOptionActive: { backgroundColor: '#FF6B3520' },
  modalOptionText: { fontSize: 14, fontWeight: '500', color: '#000' },
  modalOptionTextActive: { color: '#FF6B35' },
  modalInput: {
    borderRadius: 10, backgroundColor: '#F2F2F7', padding: 12,
    fontSize: 14, color: '#000', marginBottom: 16, minHeight: 60, textAlignVertical: 'top',
  },
  modalBtns: { flexDirection: 'row', gap: 10 },
  modalCancelBtn: {
    flex: 1, height: 48, borderRadius: 10, backgroundColor: '#F2F2F7',
    alignItems: 'center', justifyContent: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '500', color: '#6D6D72' },
  modalSubmitBtn: {
    flex: 1, height: 48, borderRadius: 10, backgroundColor: '#FF3B30',
    alignItems: 'center', justifyContent: 'center',
  },
  modalSubmitText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  modalCloseBtn: {
    alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: 10, backgroundColor: '#F2F2F7', marginTop: 8,
  },
  modalCloseBtnText: { fontSize: 14, fontWeight: '500', color: '#6D6D72' },
});
