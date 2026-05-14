// ── 集中したい カテゴリの型定義 ─────────────────────────────────────────────────

export type FocusSubCategory =
  | "work_cafe"         // ☕ カフェでコーヒーを飲みながら作業したい
  | "coworking"         // 🖥️ 雑音のない専用スペースで黙々とやりたい
  | "family_restaurant" // 🍳 時間を気にせず深夜まで粘りたい
  | "netcafe_library";  // 📚 漫画や本に囲まれて完全にこもりたい

export interface FocusRequest {
  subCategory:  FocusSubCategory;
  lat:          number;
  lng:          number;
  areaLabel?:   string;
  transport?:   string | string[];
}

export interface FocusApiResponse {
  data:             import("./onsen").PlaceResponse[];
  subCategoryLabel: string;
  areaLabel:        string;
}

export interface FocusErrorResponse {
  error: string;
}
