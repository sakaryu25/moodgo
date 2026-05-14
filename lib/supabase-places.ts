// ─── Supabase 場所検索ヘルパー ────────────────────────────────────────────────
// places テーブルからタグ検索 → Google Places で補強 → PlaceResponse[] に変換

import { supabase } from "@/lib/supabase";
import type { PlaceResponse } from "@/types/onsen";

// ─────────────────────────────────────────────────────────────────────────────
// Supabase レコード型
// ─────────────────────────────────────────────────────────────────────────────
export interface SupabasePlace {
  id: string;
  name: string;
  address: string;
  nearest_station: string | null;
  lat: number | null;
  lng: number | null;
  google_place_id: string | null;
  tags: string[];
  area: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabasePlacePhoto {
  id: string;
  place_id: string;
  photo_url: string;
  storage_path: string | null;
  is_primary: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Haversine 距離計算（メートル単位）
// ─────────────────────────────────────────────────────────────────────────────
function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(m: number, transport: string): string {
  const km = m / 1000;
  let speedKmh = 40;
  let mode = "";
  const t = Array.isArray(transport) ? transport.join(",") : (transport ?? "");
  if (t.includes("徒歩") || t.includes("walk"))                                                 { speedKmh = 4;  mode = "徒歩"; }
  else if (t.includes("自転車") || t.includes("bicycle"))                                        { speedKmh = 12; mode = "自転車"; }
  else if (t.includes("電車") || t.includes("バス") || t.includes("train") || t.includes("bus")) { speedKmh = 30; mode = "電車"; }
  else if (t.includes("車") || t.includes("バイク") || t.includes("car") || t.includes("bike"))  { speedKmh = 40; mode = "車"; }
  else                                                                                             { speedKmh = 30; mode = "電車"; }
  const mins = Math.round((km / speedKmh) * 60);
  if (mins < 60) return `${mode}で約${mins}分 / ${km.toFixed(1)}km`;
  const h = Math.floor(mins / 60);
  const m2 = mins % 60;
  return `${mode}で約${h}時間${m2 > 0 ? m2 + "分" : ""} / ${km.toFixed(1)}km`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Google Places (New) で詳細取得（写真・営業時間・評価など）
// ─────────────────────────────────────────────────────────────────────────────
async function fetchGooglePlaceDetail(
  placeId: string,
  apiKey: string,
): Promise<{
  photoUrls: string[];
  rating: number | null;
  reviewCount: number | null;
  openNow: boolean | null;
  openingHours: string | null;
  priceLevel: string | null;
  googleMapsUrl: string;
} | null> {
  try {
    const fields = [
      "id", "photos", "rating", "userRatingCount",
      "currentOpeningHours", "regularOpeningHours",
      "priceLevel", "googleMapsUri",
    ].join(",");
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&languageCode=ja`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fields,
      },
    });
    if (!res.ok) return null;
    const d = await res.json();

    // 写真URL最大5枚
    const photoUrls: string[] = [];
    for (const ph of (d.photos ?? []).slice(0, 5)) {
      const pUrl = `https://places.googleapis.com/v1/${ph.name}/media?maxWidthPx=800&key=${apiKey}`;
      photoUrls.push(pUrl);
    }

    // 営業時間テキスト
    const hours = d.currentOpeningHours ?? d.regularOpeningHours;
    const openingHours: string | null =
      hours?.weekdayDescriptions
        ? (hours.weekdayDescriptions as string[]).join("\n")
        : null;

    // 価格帯
    const priceLevelMap: Record<string, string> = {
      PRICE_LEVEL_FREE: "無料",
      PRICE_LEVEL_INEXPENSIVE: "￥",
      PRICE_LEVEL_MODERATE: "￥￥",
      PRICE_LEVEL_EXPENSIVE: "￥￥￥",
      PRICE_LEVEL_VERY_EXPENSIVE: "￥￥￥￥",
    };
    const priceLevel = d.priceLevel ? (priceLevelMap[d.priceLevel] ?? null) : null;

    return {
      photoUrls,
      rating: d.rating ?? null,
      reviewCount: d.userRatingCount ?? null,
      openNow: hours?.openNow ?? null,
      openingHours,
      priceLevel,
      googleMapsUrl: d.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${placeId}`,
    };
  } catch {
    return null;
  }
}

// Google Places Text Search (New) でプレイスIDを検索
async function findGooglePlaceId(
  name: string,
  address: string,
  apiKey: string,
): Promise<string | null> {
  try {
    const query = `${name} ${address}`;
    const url = "https://places.googleapis.com/v1/places:searchText";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id",
      },
      body: JSON.stringify({ textQuery: query, languageCode: "ja", maxResultCount: 1 }),
    });
    if (!res.ok) return null;
    const d = await res.json();
    return d.places?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase place → PlaceResponse 変換
// ─────────────────────────────────────────────────────────────────────────────
async function convertToPlaceResponse(
  place: SupabasePlace,
  photos: SupabasePlacePhoto[],
  userLat: number,
  userLng: number,
  transport: string,
  googleApiKey: string,
): Promise<PlaceResponse> {
  const distM = place.lat && place.lng
    ? haversineM(userLat, userLng, place.lat, place.lng)
    : null;
  const distanceInfo = distM !== null ? formatDistance(distM, transport) : "距離不明";

  // Supabase 登録写真を先頭に並べる
  const userPhotoUrls = photos
    .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
    .map(p => p.photo_url);

  // Google で補強
  let googleDetail: Awaited<ReturnType<typeof fetchGooglePlaceDetail>> = null;
  let resolvedPlaceId = place.google_place_id;

  if (googleApiKey) {
    if (!resolvedPlaceId) {
      resolvedPlaceId = await findGooglePlaceId(place.name, place.address, googleApiKey);
    }
    if (resolvedPlaceId) {
      googleDetail = await fetchGooglePlaceDetail(resolvedPlaceId, googleApiKey);
    }
  }

  const googlePhotoUrls = googleDetail?.photoUrls ?? [];
  // ユーザー投稿写真 → Google写真 の順で最大8枚
  const allPhotoUrls = [
    ...userPhotoUrls,
    ...googlePhotoUrls.filter(u => !userPhotoUrls.includes(u)),
  ].slice(0, 8);

  return {
    id: resolvedPlaceId ?? `sb-${place.id}`,
    name: place.name,
    category: place.tags.find(t => t !== "#お腹すいた") ?? "グルメ",
    description: place.description ?? `${place.name}の詳細情報です。`,
    imageUrl: allPhotoUrls[0] ?? "",
    rating: googleDetail?.rating ?? null,
    reviewCount: googleDetail?.reviewCount ?? null,
    address: place.address,
    distanceInfo,
    photoUrls: allPhotoUrls,
    openNow: googleDetail?.openNow ?? null,
    openingHours: googleDetail?.openingHours ?? null,
    priceLevel: googleDetail?.priceLevel ?? null,
    googleMapsUrl: googleDetail?.googleMapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`,
    stationInfo: place.nearest_station ?? null,
    source: "admin" as const,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// メイン検索関数
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// 交通手段に基づく最大半径（km）
// ─────────────────────────────────────────────────────────────────────────────
function getTransportMaxRadius(transport: string): number {
  const t = transport.toLowerCase();
  if (t.includes("徒歩"))         return 3;    // 徒歩: 最大3km
  if (t.includes("自転車"))       return 10;   // 自転車: 最大10km
  if (t.includes("電車") || t.includes("バス")) return 60; // 電車・バス: 最大60km
  // 車・バイク / なんでも → 制限なし（mood側のradiusKmをそのまま使う）
  return Infinity;
}

export interface SearchPlacesOptions {
  mustTags: string[];          // すべて含む場所のみ（@>）
  fallbackTags?: string[];     // mustTags がヒット0件時の緩いタグ
  lat?: number;
  lng?: number;
  radiusKm?: number;           // 半径フィルター（省略時: 10km）
  transport?: string | string[];
  limit?: number;              // 最大件数（省略時: 20）
  googleApiKey?: string;
}

export async function searchPlacesByTags(
  opts: SearchPlacesOptions,
): Promise<PlaceResponse[]> {
  if (!supabase) return [];

  const {
    mustTags,
    fallbackTags = [],
    lat = 0,
    lng = 0,
    radiusKm = 10,
    transport = "",
    limit = 20,
    googleApiKey = "",
  } = opts;

  const transportStr = Array.isArray(transport) ? transport.join(",") : (transport ?? "");

  // ── 交通手段で半径を上限調整 ────────────────────────────────────────────
  // 複数交通手段が選ばれている場合は最も広い上限を採用
  const transportList = Array.isArray(transport) ? transport : (transport ? [transport] : []);
  const transportMaxKm = transportList.length > 0
    ? Math.max(...transportList.map(t => getTransportMaxRadius(t)))
    : Infinity;
  const effectiveRadiusKm = Math.min(radiusKm, transportMaxKm);

  // ── Step1: mustTags すべてを含むスポットを検索 ──────────────────────────
  let places = await queryByTags(mustTags, limit * 2);

  // ── Step2: ヒット0件 → fallbackTags（sub タグなし）で再検索 ────────────
  if (places.length === 0 && fallbackTags.length > 0 && fallbackTags.join() !== mustTags.join()) {
    places = await queryByTags(fallbackTags, limit * 2);
  }

  // ── Step3: まだ0件 → ジャンルタグのみで再検索 ─────────────────────────
  if (places.length === 0) {
    const genreOnly = mustTags.filter(t => t !== "#お腹すいた").slice(0, 1);
    if (genreOnly.length > 0) {
      places = await queryByTags(["#お腹すいた", ...genreOnly], limit * 2);
    }
  }

  if (places.length === 0) return [];

  // ── 距離フィルター ─────────────────────────────────────────────────────
  const radiusM = effectiveRadiusKm * 1000;
  const filtered = (lat === 0 && lng === 0)
    ? places
    : places.filter(p =>
        p.lat != null && p.lng != null
          ? haversineM(lat, lng, p.lat, p.lng) <= radiusM
          : true,
      );

  const targets = filtered.length > 0 ? filtered : places;
  const sliced = targets.slice(0, limit);

  // ── 写真取得 ───────────────────────────────────────────────────────────
  const placeIds = sliced.map(p => p.id);
  const { data: photosData } = await supabase
    .from("place_photos")
    .select("*")
    .in("place_id", placeIds);
  const photosMap = new Map<string, SupabasePlacePhoto[]>();
  for (const ph of photosData ?? []) {
    if (!photosMap.has(ph.place_id)) photosMap.set(ph.place_id, []);
    photosMap.get(ph.place_id)!.push(ph as SupabasePlacePhoto);
  }

  // ── Google補強 & 変換（並列実行）──────────────────────────────────────
  const results = await Promise.allSettled(
    sliced.map(place =>
      convertToPlaceResponse(
        place,
        photosMap.get(place.id) ?? [],
        lat,
        lng,
        transportStr,
        googleApiKey,
      ),
    ),
  );

  return results
    .filter(r => r.status === "fulfilled")
    .map(r => (r as PromiseFulfilledResult<PlaceResponse>).value);
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase クエリ（タグが全て含まれるアクティブな場所）
// ─────────────────────────────────────────────────────────────────────────────
async function queryByTags(tags: string[], limit: number): Promise<SupabasePlace[]> {
  if (!supabase || tags.length === 0) return [];
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("is_active", true)
    .contains("tags", tags)
    .limit(limit);
  if (error) {
    console.error("[supabase-places] queryByTags error:", error.message);
    return [];
  }
  return (data ?? []) as SupabasePlace[];
}
