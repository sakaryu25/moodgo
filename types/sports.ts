// ── 体を動かしたい カテゴリの型定義 ─────────────────────────────────────────────

export type SportsSubCategory =
  | "training"        // 💪 がっつり汗を流してトレーニングしたい
  | "stress_relief"   // 🏏 打って投げてストレスを発散したい
  | "amusement_sport" // 🎯 遊び感覚でワイワイ体を動かしたい
  | "outdoor_sports"; // 🌳 外の風を感じながらスポーツしたい

export interface SportsRequest {
  subCategory:  SportsSubCategory;
  lat:          number;
  lng:          number;
  areaLabel?:   string;
  transport?:   string | string[];
}

export interface SportsApiResponse {
  data:             import("./onsen").PlaceResponse[];
  subCategoryLabel: string;
  areaLabel:        string;
}

export interface SportsErrorResponse {
  error: string;
}
