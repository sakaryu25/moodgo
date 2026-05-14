// ── 自然感じたい カテゴリの型定義 ──────────────────────────────────────────────

export type NatureSubGenre =
  | "ocean"    // 🌊 波の音と海風
  | "forest"   // 🌳 森の中で深呼吸
  | "park"     // 🧺 広い芝生でゴロゴロ
  | "view";    // 🌅 圧倒的な絶景

export interface NatureRequest {
  subGenre:   NatureSubGenre;
  lat:        number;
  lng:        number;
  areaLabel?: string;
  transport?: string | string[];
}

export interface NatureApiResponse {
  data:          import("./onsen").PlaceResponse[];
  subGenreLabel: string;
  areaLabel:     string;
}

export interface NatureErrorResponse {
  error: string;
}
