// ─── MoodGo フード専用タグマッピング ────────────────────────────────────────
// food_genre_new / food_sub_choice の回答文字列 → Supabase タグ名に変換するための定義
// Supabase places テーブルの tags TEXT[] に保存される値はここのキーと一致させること

// ─────────────────────────────────────────────────────────────────────────────
// ジャンルタグ（food_genre_new の選択肢 → タグ名）
// ─────────────────────────────────────────────────────────────────────────────
// キーは food_genre_new の選択肢テキスト（絵文字なし・部分一致で検索）
export const FOOD_GENRE_TAG_MAP: Record<string, string> = {
  "居酒屋":         "#居酒屋",
  "和食":           "#和食",
  "洋食":           "#洋食",
  "イタリアン":     "#イタリアン",
  "中華":           "#中華",
  "焼肉":           "#焼肉",
  "韓国":           "#韓国料理",
  "アジア系統":     "#アジア料理",
  "各国料理":       "#各国料理",
  "ラーメン":       "#ラーメン",
  "お好み焼き":     "#お好み焼き_もんじゃ",
  "カフェ・スイーツ": "#カフェ_スイーツ",
  "高層ビル":       "#高層ビル料理",
};

// ─────────────────────────────────────────────────────────────────────────────
// サブ選択タグ（food_sub_choice の選択肢テキスト → タグ名）
// ─────────────────────────────────────────────────────────────────────────────
export const FOOD_SUB_TAG_MAP: Record<string, string> = {
  // 居酒屋
  "新鮮な魚介・海鮮メイン":       "#海鮮_魚介メイン",
  "焼き鳥・串焼きメイン":         "#焼き鳥_串焼き",
  "個室あり":                     "#個室あり",
  "大衆酒場・コスパ重視":         "#大衆酒場_コスパ重視",
  // 和食
  "お寿司・海鮮丼":               "#寿司_海鮮丼",
  "天ぷら・揚げ物":               "#天ぷら_揚げ物",
  "うどん・そば":                 "#うどん_そば",
  "割烹・懐石料理":               "#割烹_懐石料理",
  // 洋食
  "肉汁たっぷりハンバーグ":       "#ハンバーグ",
  "ふわとろオムライス":           "#オムライス",
  "ガッツリステーキ・肉料理":     "#ステーキ_肉料理",
  "昔ながらの定食・レトロな洋食": "#レトロ洋食",
  // イタリアン
  "本格ピザ":                     "#ピザ",
  "こだわりパスタ":               "#パスタ",
  "カジュアルなバル":             "#バル",
  "本格リストランテ":             "#リストランテ",
  // 焼肉
  "食べ放題でコスパ重視":         "#食べ放題焼肉",
  "黒毛和牛・厚切り肉":           "#黒毛和牛",
  "ホルモン焼き":                 "#ホルモン焼き",
  "ヘルシーなジンギスカン":       "#ジンギスカン",
  // アジア系統
  "インド・ネパールカレー":       "#インド_ネパールカレー",
  "タイ料理":                     "#タイ料理",
  "ベトナム料理・フォー":         "#ベトナム料理",
  "アジアン・エスニック全般":     "#エスニック全般",
  // 各国料理
  "メキシコ料理・タコス":         "#メキシコ料理",
  "ブラジル料理・シュラスコ":     "#ブラジル料理",
  "ロシア料理":                   "#ロシア料理",
  "その他の西洋・中南米料理":     "#その他各国料理",
  // ラーメン
  "こってり濃厚":                 "#こってりラーメン",
  "あっさり王道":                 "#あっさりラーメン",
  "コクのある味噌ラーメン":       "#味噌ラーメン",
  "つけ麺・まぜそば":             "#つけ麺_まぜそば",
  // カフェ・スイーツ
  "スイーツ目当て":               "#スイーツ目当て",
  "おしゃれカフェごはん":         "#おしゃれカフェごはん",
  "コーヒー・紅茶":               "#コーヒー_紅茶",
  "Wi-Fi・電源あり":              "#Wi-Fi_電源あり",
};

// ─────────────────────────────────────────────────────────────────────────────
// 全フードジャンルタグ一覧（管理画面などで参照）
// ─────────────────────────────────────────────────────────────────────────────
export const FOOD_GENRE_TAGS = Object.values(FOOD_GENRE_TAG_MAP);

export const FOOD_SUB_TAGS = Object.values(FOOD_SUB_TAG_MAP);

export const ALL_FOOD_TAGS = [
  "#お腹すいた",
  ...FOOD_GENRE_TAGS,
  ...FOOD_SUB_TAGS,
];

// ─────────────────────────────────────────────────────────────────────────────
// ユーティリティ: 回答文字列 → タグ配列 変換
// ─────────────────────────────────────────────────────────────────────────────

/**
 * food_genre_new の選択肢テキスト（絵文字込みでもOK）からタグを返す
 * 例: "居酒屋🍺" → "#居酒屋"
 */
export function genreAnswerToTag(genreAnswer: string): string | null {
  for (const [key, tag] of Object.entries(FOOD_GENRE_TAG_MAP)) {
    if (genreAnswer.includes(key)) return tag;
  }
  return null;
}

/**
 * food_sub_choice の選択肢テキスト（絵文字込みでもOK）からタグを返す
 * 例: "焼き鳥・串焼きメイン🍡" → "#焼き鳥_串焼き"
 */
export function subAnswerToTag(subAnswer: string): string | null {
  for (const [key, tag] of Object.entries(FOOD_SUB_TAG_MAP)) {
    if (subAnswer.includes(key)) return tag;
  }
  return null;
}

/**
 * genreAnswer と subAnswer から Supabase 検索に使うタグ配列を構築する。
 * mustTags: Supabase の @> (contains) クエリに使う必須タグ
 * fallbackTags: mustTags でヒットしなかった場合の緩い検索用タグ
 */
export function buildFoodSearchTags(
  genreAnswer: string,
  subAnswer: string,
): { mustTags: string[]; fallbackTags: string[] } {
  const genreTag = genreAnswerToTag(genreAnswer);
  const subTag = subAnswerToTag(subAnswer);

  const mustTags: string[] = ["#お腹すいた"];
  if (genreTag) mustTags.push(genreTag);
  if (subTag) mustTags.push(subTag);

  // フォールバック: sub タグなし（ジャンルのみ）
  const fallbackTags: string[] = ["#お腹すいた"];
  if (genreTag) fallbackTags.push(genreTag);

  return { mustTags, fallbackTags };
}
