// ── 遠くに行きたい カテゴリの型定義 ─────────────────────────────────────────────

export type TravelSubCategory =
  | "power_spot"  // ⛩️ パワースポットや歴史ある場所で心を洗いたい
  | "theme_park"  // 🎡 日常を忘れて別世界に入り込みたい
  | "town_walk"   // 🚶 まだ行ったことのない街をブラブラ歩きたい
  | "super_view"; // 🌄 息を呑むような絶景や大自然を見に行きたい

export interface TravelRequest {
  subCategory:  TravelSubCategory;
  lat:          number;
  lng:          number;
  areaLabel?:   string;
  transport?:   string | string[];
}

export interface TravelApiResponse {
  data:             import("./onsen").PlaceResponse[];
  subCategoryLabel: string;
  areaLabel:        string;
}

export interface TravelErrorResponse {
  error: string;
}
