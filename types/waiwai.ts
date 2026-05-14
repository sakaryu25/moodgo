// ── わいわい楽しみたい カテゴリの型定義 ─────────────────────────────────────

export type WaiWaiSubCategory =
  | "active"       // 💪 体を動かしてはしゃぎたい（ボウリング・スポッチャ）
  | "party"        // 🎤 歌って飲んで騒ぎたい（カラオケ・ダーツ）
  | "experience"   // 🎲 非日常の体験で盛り上がりたい（ボドゲ・脱出ゲーム）
  | "food_drink";  // 🍻 美味しいご飯とお酒でワイワイ（居酒屋・食べ放題）

export interface WaiWaiRequest {
  subCategory: WaiWaiSubCategory;
  lat:         number;
  lng:         number;
  areaLabel?:  string;
  transport?:  string | string[];
  age?:        string;  // "10代" | "20代" | "30代" | "40代以上"
}

export interface WaiWaiApiResponse {
  data:               import("./onsen").PlaceResponse[];
  subCategoryLabel:   string;
  areaLabel:          string;
}

export interface WaiWaiErrorResponse {
  error: string;
}
