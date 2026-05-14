// ── カフェ カテゴリの型定義 ──────────────────────────────────────────────────

export type CafeSubCategory =
  | "book_relax"  // 📚 ブックカフェ・隠れ家カフェ
  | "animal"      // 🐱 アニマルカフェ
  | "view"        // 🌅 景色が良いカフェ
  | "sweets";     // 🍰 絶品スイーツカフェ

// animal / view の深掘り回答
export type CafeDetail =
  | "cat"     // 🐱 猫カフェ
  | "dog"     // 🐶 犬カフェ
  | "rare"    // 🦔 小動物・珍しい動物
  | "ocean"   // 🌊 海・水辺
  | "forest"  // 🌲 森・緑
  | "city";   // 🏙️ 街並み・高層ビル

export type CafeDistancePref = "近場" | "ほどほど" | "遠く";

export interface CafeRequest {
  subCategory:   CafeSubCategory;
  detail?:       CafeDetail;   // animal / view のみ送信
  lat:           number;
  lng:           number;
  areaLabel?:    string;
  transport?:    string | string[];
  distancePref?: CafeDistancePref;
}

export interface CafeApiResponse {
  data:               import("./onsen").PlaceResponse[];
  subCategoryLabel:   string;
  areaLabel:          string;
}

export interface CafeErrorResponse {
  error: string;
}
