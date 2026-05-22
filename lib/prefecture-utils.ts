// ─── 都道府県ユーティリティ ──────────────────────────────────────────────────
// 都道府県の重心座標・実際の隣接マップ・近隣都道府県の計算

export const PREFECTURES: { name: string; lat: number; lng: number }[] = [
  { name: "北海道", lat: 43.064, lng: 141.347 },
  { name: "青森県", lat: 40.824, lng: 140.740 },
  { name: "岩手県", lat: 39.704, lng: 141.153 },
  { name: "宮城県", lat: 38.269, lng: 140.872 },
  { name: "秋田県", lat: 39.719, lng: 140.102 },
  { name: "山形県", lat: 38.240, lng: 140.364 },
  { name: "福島県", lat: 37.750, lng: 140.468 },
  { name: "茨城県", lat: 36.341, lng: 140.447 },
  { name: "栃木県", lat: 36.566, lng: 139.883 },
  { name: "群馬県", lat: 36.391, lng: 139.060 },
  { name: "埼玉県", lat: 35.857, lng: 139.649 },
  { name: "千葉県", lat: 35.606, lng: 140.123 },
  { name: "東京都", lat: 35.690, lng: 139.692 },
  { name: "神奈川県", lat: 35.447, lng: 139.642 },
  { name: "新潟県", lat: 37.902, lng: 139.023 },
  { name: "富山県", lat: 36.695, lng: 137.211 },
  { name: "石川県", lat: 36.594, lng: 136.626 },
  { name: "福井県", lat: 36.065, lng: 136.222 },
  { name: "山梨県", lat: 35.664, lng: 138.568 },
  { name: "長野県", lat: 36.651, lng: 138.181 },
  { name: "岐阜県", lat: 35.391, lng: 136.722 },
  { name: "静岡県", lat: 34.977, lng: 138.383 },
  { name: "愛知県", lat: 35.180, lng: 136.907 },
  { name: "三重県", lat: 34.730, lng: 136.509 },
  { name: "滋賀県", lat: 35.004, lng: 135.869 },
  { name: "京都府", lat: 35.021, lng: 135.756 },
  { name: "大阪府", lat: 34.686, lng: 135.520 },
  { name: "兵庫県", lat: 34.691, lng: 135.183 },
  { name: "奈良県", lat: 34.685, lng: 135.805 },
  { name: "和歌山県", lat: 34.226, lng: 135.168 },
  { name: "鳥取県", lat: 35.504, lng: 134.238 },
  { name: "島根県", lat: 35.472, lng: 133.051 },
  { name: "岡山県", lat: 34.662, lng: 133.935 },
  { name: "広島県", lat: 34.396, lng: 132.460 },
  { name: "山口県", lat: 34.186, lng: 131.471 },
  { name: "徳島県", lat: 34.066, lng: 134.560 },
  { name: "香川県", lat: 34.340, lng: 134.043 },
  { name: "愛媛県", lat: 33.842, lng: 132.766 },
  { name: "高知県", lat: 33.560, lng: 133.531 },
  { name: "福岡県", lat: 33.607, lng: 130.418 },
  { name: "佐賀県", lat: 33.249, lng: 130.299 },
  { name: "長崎県", lat: 32.745, lng: 129.873 },
  { name: "熊本県", lat: 32.790, lng: 130.742 },
  { name: "大分県", lat: 33.238, lng: 131.613 },
  { name: "宮崎県", lat: 31.911, lng: 131.424 },
  { name: "鹿児島県", lat: 31.560, lng: 130.558 },
  { name: "沖縄県", lat: 26.212, lng: 127.681 },
];

// ─── 実際の隣接都道府県マップ（陸続き・実際の境界線ベース）───────────────────
// 地図上で実際に境界を接している都道府県を列挙
export const ADJACENT_PREFECTURES: Record<string, string[]> = {
  "北海道":   [],
  "青森県":   ["岩手県", "秋田県"],
  "岩手県":   ["青森県", "秋田県", "宮城県"],
  "宮城県":   ["岩手県", "秋田県", "山形県", "福島県"],
  "秋田県":   ["青森県", "岩手県", "宮城県", "山形県"],
  "山形県":   ["秋田県", "宮城県", "福島県", "新潟県"],
  "福島県":   ["宮城県", "山形県", "新潟県", "栃木県", "群馬県", "埼玉県", "茨城県"],
  "茨城県":   ["福島県", "栃木県", "埼玉県", "千葉県"],
  "栃木県":   ["福島県", "群馬県", "茨城県", "埼玉県"],
  "群馬県":   ["福島県", "新潟県", "長野県", "埼玉県", "栃木県"],
  "埼玉県":   ["群馬県", "栃木県", "茨城県", "千葉県", "東京都", "山梨県", "長野県", "福島県"],
  "千葉県":   ["茨城県", "埼玉県", "東京都"],
  "東京都":   ["埼玉県", "千葉県", "神奈川県", "山梨県"],
  "神奈川県": ["東京都", "埼玉県", "山梨県", "静岡県"],
  "新潟県":   ["山形県", "福島県", "群馬県", "長野県", "富山県"],
  "富山県":   ["新潟県", "長野県", "岐阜県", "石川県"],
  "石川県":   ["富山県", "岐阜県", "福井県"],
  "福井県":   ["石川県", "岐阜県", "滋賀県", "京都府"],
  "山梨県":   ["埼玉県", "東京都", "神奈川県", "静岡県", "長野県"],
  "長野県":   ["新潟県", "群馬県", "埼玉県", "山梨県", "静岡県", "愛知県", "岐阜県", "富山県"],
  "岐阜県":   ["富山県", "石川県", "福井県", "長野県", "愛知県", "三重県", "滋賀県"],
  "静岡県":   ["神奈川県", "山梨県", "長野県", "愛知県"],
  "愛知県":   ["静岡県", "長野県", "岐阜県", "三重県"],
  "三重県":   ["愛知県", "岐阜県", "滋賀県", "奈良県", "和歌山県", "京都府"],
  "滋賀県":   ["福井県", "岐阜県", "三重県", "京都府"],
  "京都府":   ["福井県", "兵庫県", "大阪府", "奈良県", "三重県", "滋賀県"],
  "大阪府":   ["京都府", "兵庫県", "奈良県", "和歌山県"],
  "兵庫県":   ["京都府", "大阪府", "奈良県", "和歌山県", "岡山県", "鳥取県"],
  "奈良県":   ["京都府", "大阪府", "兵庫県", "三重県", "和歌山県"],
  "和歌山県": ["大阪府", "奈良県", "三重県", "兵庫県"],
  "鳥取県":   ["兵庫県", "岡山県", "島根県"],
  "島根県":   ["鳥取県", "岡山県", "広島県", "山口県"],
  "岡山県":   ["鳥取県", "兵庫県", "広島県", "島根県"],
  "広島県":   ["島根県", "岡山県", "山口県"],
  "山口県":   ["島根県", "広島県"],
  "徳島県":   ["香川県", "愛媛県", "高知県"],
  "香川県":   ["徳島県", "愛媛県"],
  "愛媛県":   ["香川県", "徳島県", "高知県"],
  "高知県":   ["徳島県", "愛媛県"],
  "福岡県":   ["佐賀県", "長崎県", "熊本県", "大分県"],
  "佐賀県":   ["福岡県", "長崎県"],
  "長崎県":   ["福岡県", "佐賀県"],
  "熊本県":   ["福岡県", "大分県", "宮崎県", "鹿児島県"],
  "大分県":   ["福岡県", "熊本県", "宮崎県"],
  "宮崎県":   ["大分県", "熊本県", "鹿児島県"],
  "鹿児島県": ["熊本県", "宮崎県"],
  "沖縄県":   [],
};

function distKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** ユーザーのlat/lngから最も近い都道府県を返す */
export function detectUserPrefecture(lat: number, lng: number): string {
  if (!lat && !lng) return "";
  let best = PREFECTURES[0];
  let bestDist = Infinity;
  for (const pref of PREFECTURES) {
    const d = distKm(lat, lng, pref.lat, pref.lng);
    if (d < bestDist) { bestDist = d; best = pref; }
  }
  return best.name;
}

/**
 * ユーザーの実際のGPS座標から都道府県フィルターボタンリストを生成する。
 *
 * ロジック:
 * 1. 隣接マップから実際に境界を接する都道府県を取得（順番は重心との距離順）
 * 2. それでも6件未満なら GPS座標から近い順に補完
 * 3. 自県を先頭に配置
 */
export function getPrefectureButtonList(
  userLat: number,
  userLng: number,
  maxCount = 7,
): string[] {
  const userPref = detectUserPrefecture(userLat, userLng);
  if (!userPref) return [];

  // 実際の隣接県を重心距離順に並べる
  const adjacent = (ADJACENT_PREFECTURES[userPref] ?? [])
    .map(name => {
      const p = PREFECTURES.find(x => x.name === name);
      return p ? { name, dist: distKm(userLat, userLng, p.lat, p.lng) } : null;
    })
    .filter((x): x is { name: string; dist: number } => x !== null)
    .sort((a, b) => a.dist - b.dist)
    .map(x => x.name);

  // 隣接県が少ない場合はGPS座標から近い順に補完
  const result: string[] = [userPref, ...adjacent];
  if (result.length < maxCount) {
    const extras = PREFECTURES
      .filter(p => !result.includes(p.name))
      .map(p => ({ name: p.name, dist: distKm(userLat, userLng, p.lat, p.lng) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, maxCount - result.length)
      .map(x => x.name);
    result.push(...extras);
  }

  return result.slice(0, maxCount);
}

/** 後方互換用: 都道府県名から近隣県を返す（旧API） */
export function getNearbyPrefectures(userPref: string, count = 5): string[] {
  const base = PREFECTURES.find(p => p.name === userPref);
  if (!base) return [];
  // 隣接マップ優先、不足分は距離で補完
  const adjacent = (ADJACENT_PREFECTURES[userPref] ?? [])
    .map(name => {
      const p = PREFECTURES.find(x => x.name === name);
      return p ? { name, dist: distKm(base.lat, base.lng, p.lat, p.lng) } : null;
    })
    .filter((x): x is { name: string; dist: number } => x !== null)
    .sort((a, b) => a.dist - b.dist)
    .map(x => x.name);

  if (adjacent.length >= count) return adjacent.slice(0, count);

  const extras = PREFECTURES
    .filter(p => p.name !== userPref && !adjacent.includes(p.name))
    .map(p => ({ name: p.name, dist: distKm(base.lat, base.lng, p.lat, p.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count - adjacent.length)
    .map(x => x.name);

  return [...adjacent, ...extras].slice(0, count);
}
