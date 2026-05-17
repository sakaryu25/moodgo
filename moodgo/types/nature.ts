export type NatureSubGenre = "sea" | "forest" | "park" | "panorama";
export type NatureDistancePref = "近場" | "ほどほど" | "遠く";

export interface NatureRequest {
  subGenre: NatureSubGenre;
  lat: number;
  lng: number;
  areaLabel?: string;
  transport?: string | string[];
  distancePref?: NatureDistancePref;
}

export interface NatureApiResponse {
  data: import("./onsen").PlaceResponse[];
  subGenreLabel: string;
  areaLabel: string;
}
