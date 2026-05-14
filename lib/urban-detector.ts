// ─── 都市近傍判定ユーティリティ ──────────────────────────────────────────────
// 指定座標が主要都市・市街地の近くにあるか判定し、近ければ #都市 タグを返す。

// 夜も賑わっている主要繁華街・都市エリアのみ掲載（マイナー観光地は除外）
const URBAN_CENTERS: { name: string; lat: number; lng: number; radiusKm: number }[] = [
  // ── 東京 主要繁華街 ──
  { name: "新宿",       lat: 35.6938, lng: 139.7034, radiusKm: 3 },
  { name: "渋谷",       lat: 35.6580, lng: 139.7016, radiusKm: 3 },
  { name: "池袋",       lat: 35.7295, lng: 139.7109, radiusKm: 3 },
  { name: "六本木",     lat: 35.6627, lng: 139.7318, radiusKm: 2 },
  { name: "銀座",       lat: 35.6717, lng: 139.7649, radiusKm: 2 },
  { name: "秋葉原",     lat: 35.7023, lng: 139.7745, radiusKm: 2 },
  { name: "新橋・汐留", lat: 35.6659, lng: 139.7584, radiusKm: 2 },
  { name: "上野",       lat: 35.7141, lng: 139.7774, radiusKm: 2 },
  { name: "品川",       lat: 35.6284, lng: 139.7387, radiusKm: 2 },
  { name: "恵比寿・代官山", lat: 35.6464, lng: 139.7102, radiusKm: 2 },
  { name: "中目黒",     lat: 35.6439, lng: 139.6990, radiusKm: 1.5 },
  { name: "吉祥寺",     lat: 35.7034, lng: 139.5797, radiusKm: 2 },
  { name: "下北沢",     lat: 35.6614, lng: 139.6679, radiusKm: 1.5 },
  { name: "立川",       lat: 35.6978, lng: 139.4130, radiusKm: 2 },
  // ── 神奈川 ──
  { name: "横浜",       lat: 35.4437, lng: 139.6380, radiusKm: 4 },
  { name: "みなとみらい", lat: 35.4579, lng: 139.6330, radiusKm: 2 },
  { name: "川崎",       lat: 35.5308, lng: 139.7030, radiusKm: 3 },
  // ── 埼玉 ──
  { name: "大宮",       lat: 35.9063, lng: 139.6234, radiusKm: 3 },
  // ── 千葉 ──
  { name: "千葉",       lat: 35.6074, lng: 140.1065, radiusKm: 3 },
  // ── 大阪 ──
  { name: "大阪梅田",   lat: 34.7024, lng: 135.4959, radiusKm: 4 },
  { name: "難波・心斎橋", lat: 34.6686, lng: 135.4998, radiusKm: 3 },
  { name: "天王寺",     lat: 34.6466, lng: 135.5136, radiusKm: 2 },
  // ── 名古屋 ──
  { name: "名古屋",     lat: 35.1706, lng: 136.8814, radiusKm: 4 },
  // ── 福岡 ──
  { name: "福岡天神・中洲", lat: 33.5897, lng: 130.3985, radiusKm: 3 },
  // ── 札幌 ──
  { name: "札幌すすきの", lat: 43.0561, lng: 141.3534, radiusKm: 3 },
  // ── 仙台 ──
  { name: "仙台",       lat: 38.2682, lng: 140.8694, radiusKm: 3 },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * 指定座標が都市近傍にあるか判定する。
 * 近ければ true を返す。
 */
export function isNearUrban(lat: number, lng: number): boolean {
  return URBAN_CENTERS.some(
    c => haversineKm(lat, lng, c.lat, c.lng) <= c.radiusKm,
  );
}

/**
 * 必要なら #都市 タグを tags 配列に追加して返す（破壊的変更なし）。
 */
export function addUrbanTagIfNeeded(tags: string[], lat: number | null, lng: number | null): string[] {
  if (lat == null || lng == null) return tags;
  if (tags.includes("#都市")) return tags;
  if (isNearUrban(lat, lng)) return [...tags, "#都市"];
  return tags;
}
