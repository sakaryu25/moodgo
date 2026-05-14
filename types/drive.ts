// ── ドライブしたい カテゴリの型定義 ──────────────────────────────────────────

export type DriveSubCategory =
  | "ocean_drive"   // 🌊 海沿いを爽快に走りたい
  | "night_view"    // 🌉 綺麗な景色や夜景を見に行きたい
  | "road_station"  // 🏪 道の駅やSAでご当地グルメを楽しみたい
  | "outlet";       // 🛍️ 郊外の大型施設に行きたい

export interface DriveRequest {
  subCategory:  DriveSubCategory;
  lat:          number;
  lng:          number;
  areaLabel?:   string;
  transport?:   string | string[];
}

export interface DriveApiResponse {
  data:             import("./onsen").PlaceResponse[];
  subCategoryLabel: string;
  areaLabel:        string;
}

export interface DriveErrorResponse {
  error: string;
}
