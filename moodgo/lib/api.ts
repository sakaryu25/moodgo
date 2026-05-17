import Constants from "expo-constants";

// EXPO_PUBLIC_API_BASE_URL を優先（.env で Mac の LAN IP を指定する）
// 未設定の場合は localhost fallback（シミュレータのみ動く）
const DEV_API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
const PROD_API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export const API_BASE = __DEV__ ? DEV_API_BASE : PROD_API_BASE;

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, options);
  return res;
}
