// ─── /api/mood-rating ────────────────────────────────────────────────────────
// 気分別のスポット評価（合う/合わない）を記録・集計するエンドポイント。
//
// POST body:
//   place_name  string   スポット名
//   mood        string   気分（例: "まったりしたい"）
//   verdict     string   "good" | "bad"
//
// GET (admin):
//   ?secret=moodgoadmin123  → 全集計データを返す
//   ?secret=...&threshold=20 → 合わない件数がthreshold以上のみ

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_SECRET = "moodgoadmin123";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { place_name, mood, sub_category, verdict } = body;

    if (!place_name || !verdict) {
      return NextResponse.json({ ok: false, error: "place_name と verdict は必須です" }, { status: 400 });
    }
    if (verdict !== "good" && verdict !== "bad") {
      return NextResponse.json({ ok: false, error: "verdict は good または bad のみ有効です" }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const { error } = await supabase
      .from("mood_place_ratings")
      .insert({ place_name, mood: mood ?? null, sub_category: sub_category ?? null, verdict });

    if (error) {
      // テーブル未作成の場合はスキップ（エラーにしない）
      console.warn("[mood-rating] insert skipped:", error.message);
      return NextResponse.json({ ok: true, skipped: true });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[mood-rating] POST error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const threshold = Number(searchParams.get("threshold") ?? "0");

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
  }

  try {
    // place_name + mood + sub_category 別に good/bad 件数を集計
    const { data, error } = await supabase
      .from("mood_place_ratings")
      .select("place_name, mood, sub_category, verdict, created_at");

    if (error) throw error;

    // クライアント側で集計（Supabase RLS でグループ集計できない場合の対応）
    const map: Record<string, { place_name: string; mood: string; sub_category: string; good: number; bad: number; last_bad_at: string }> = {};

    for (const row of data ?? []) {
      const key = `${row.place_name}||${row.mood ?? ""}||${row.sub_category ?? ""}`;
      if (!map[key]) {
        map[key] = { place_name: row.place_name, mood: row.mood ?? "", sub_category: row.sub_category ?? "", good: 0, bad: 0, last_bad_at: "" };
      }
      if (row.verdict === "good") map[key].good++;
      if (row.verdict === "bad") {
        map[key].bad++;
        if (!map[key].last_bad_at || row.created_at > map[key].last_bad_at) {
          map[key].last_bad_at = row.created_at;
        }
      }
    }

    let results = Object.values(map)
      .sort((a, b) => b.bad - a.bad); // 合わない件数降順

    if (threshold > 0) {
      results = results.filter(r => r.bad >= threshold);
    }

    return NextResponse.json({ ok: true, data: results, total: results.length });
  } catch (e) {
    console.error("[mood-rating] GET error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
