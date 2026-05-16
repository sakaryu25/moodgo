/**
 * 交通手段と時間から検索半径（km）を計算する
 */
export function calcRadiusKm(transports: string[], time: string): number {
  const timeToMins: Record<string, number> = {
    "15~30分": 22,
    "30~60分": 45,
    "1~2時間": 90,
    "2~4時間": 180,
    "4~6時間": 300,
    "6時間以上": 420,
  };
  const speedMap: Record<string, number> = {
    "徒歩": 4,
    "自転車": 12,
    "電車": 35,
    "バス": 25,
    "車": 60,
    "バイク": 60,
  };
  const mins = timeToMins[time] ?? 90;
  const oneWayMins = mins * 0.35;
  const speeds = transports.map(t => speedMap[t] ?? 35);
  const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 35;
  const km = (oneWayMins / 60) * maxSpeed;
  return Math.max(3, Math.min(50, Math.round(km * 10) / 10));
}

/**
 * 車・バイク・なんでもで長時間の場合、近場を除外するための最小半径（km）を返す
 * この距離未満の場所は結果の後ろに回す
 */
export function calcMinRadiusKm(transports: string[], time: string): number {
  const isFarTransport = transports.some(t => ["車", "バイク", "なんでも"].includes(t));
  if (!isFarTransport) return 0;
  switch (time) {
    case "4~6時間":   return 15;
    case "6時間以上":  return 25;
    default:          return 0;
  }
}

/**
 * Google priceLevel と予算が合致するか判定
 * budget=0 または未設定の場合は制限なし
 */
export function isPriceWithinBudget(
  priceLevel: string | null | undefined,
  budget: number | undefined,
): boolean {
  if (!budget || budget <= 0) return true;
  if (!priceLevel) return true;
  // Google priceLevel の大まかな金額
  const levelCost: Record<string, number> = {
    PRICE_LEVEL_FREE:           0,
    PRICE_LEVEL_INEXPENSIVE: 1500,
    PRICE_LEVEL_MODERATE:    4000,
    PRICE_LEVEL_EXPENSIVE:  10000,
    PRICE_LEVEL_VERY_EXPENSIVE: 30000,
  };
  // supabase-places.ts では priceLevel は日本語表記（￥, ￥￥, など）に変換済みなので両方対応
  const displayCost: Record<string, number> = {
    "無料":     0,
    "￥":    1500,
    "￥￥":   4000,
    "￥￥￥":  10000,
    "￥￥￥￥": 30000,
  };
  const estimated = levelCost[priceLevel] ?? displayCost[priceLevel] ?? 0;
  return estimated <= budget;
}
