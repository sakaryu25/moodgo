export type CafeSubCategory = "book_relax" | "animal" | "view" | "sweets";
export type CafeDetail = "cat" | "dog" | "rare" | "ocean" | "forest" | "city";
export type CafeDistancePref = "近場" | "ほどほど" | "遠く";

export interface CafeRequest {
  subCategory: CafeSubCategory;
  detail?: CafeDetail;
  lat: number;
  lng: number;
  areaLabel?: string;
  transport?: string | string[];
  distancePref?: CafeDistancePref;
}

export interface CafeApiResponse {
  data: import("./onsen").PlaceResponse[];
  subCategoryLabel: string;
  areaLabel: string;
}
