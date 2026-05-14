import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { addUrbanTagIfNeeded } from "@/lib/urban-detector";
import { ALL_PREDEFINED_TAGS } from "@/lib/predefined-tags";

const ADMIN_SECRET  = process.env.ADMIN_SECRET ?? "moodgoadmin123";
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY ?? "";

export const runtime = "nodejs";

async function searchPlace(query: string) {
  const params = new URLSearchParams({ query, language: "ja", key: GOOGLE_API_KEY });
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`);
  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Places error: ${data.status}`);
  }
  return (data.results?.[0] ?? null) as {
    place_id: string; name: string; formatted_address?: string;
    geometry?: { location: { lat: number; lng: number } };
    types?: string[];
  } | null;
}

async function generateTags(name: string, address: string): Promise<string[]> {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return ["#まったりしたい"];
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `スポット情報のタグ付け専門AIです。以下のタグリストからのみ選んでJSON { "tags": [...] }で出力。\n${ALL_PREDEFINED_TAGS.join(", ")}` },
          { role: "user", content: `スポット名: ${name}\n住所: ${address}\n当てはまるタグを全て選んでください。` },
        ],
      }),
    });
    if (!res.ok) return ["#まったりしたい"];
    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
    const tags: string[] = Array.isArray(parsed.tags) ? parsed.tags : [];
    const validated = tags.filter((t: string) => ALL_PREDEFINED_TAGS.includes(t));
    return validated.length > 0 ? validated : ["#まったりしたい"];
  } catch { return ["#まったりしたい"]; }
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ ok: false, error: "Supabase未設定" }, { status: 503 });
  if (!GOOGLE_API_KEY) return NextResponse.json({ ok: false, error: "Google APIキー未設定" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  if (body?.secret !== ADMIN_SECRET) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const names: string[] = Array.isArray(body.names) ? body.names.filter((n: string) => n.trim()) : [];
  const dryRun: boolean = body.dryRun === true;

  if (names.length === 0) return NextResponse.json({ ok: false, error: "names が必要です" }, { status: 400 });

  // 既存スポットを全件取得（Supabase 1000件上限をページネーションで回避）
  const existingNames = new Set<string>();
  const existingIds   = new Set<string>();
  const batchSize = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("places")
      .select("name, google_place_id")
      .range(from, from + batchSize - 1);
    if (error || !data || data.length === 0) break;
    for (const p of data) {
      existingNames.add((p.name as string).toLowerCase().trim());
      if (p.google_place_id) existingIds.add(p.google_place_id as string);
    }
    if (data.length < batchSize) break;
    from += batchSize;
  }

  const results: Array<{ name: string; status: "inserted" | "skipped" | "not_found" | "error"; address?: string; tags?: string[]; error?: string }> = [];
  let inserted = 0, skipped = 0, notFound = 0;

  for (const query of names) {
    try {
      const place = await searchPlace(query);
      if (!place) { results.push({ name: query, status: "not_found" }); notFound++; continue; }

      if (existingIds.has(place.place_id) || existingNames.has(place.name.toLowerCase().trim())) {
        results.push({ name: place.name, status: "skipped", address: place.formatted_address });
        skipped++;
        continue;
      }

      const tags = await generateTags(place.name, place.formatted_address ?? "");
      const finalTags = addUrbanTagIfNeeded(tags, place.geometry?.location.lat ?? 0, place.geometry?.location.lng ?? 0);

      results.push({ name: place.name, status: "inserted", address: place.formatted_address, tags: finalTags });

      // dryRun問わずバッチ内重複を防ぐためにセットを更新
      existingIds.add(place.place_id);
      existingNames.add(place.name.toLowerCase().trim());

      if (!dryRun) {
        await supabase.from("places").insert({
          name: place.name,
          address: place.formatted_address ?? "",
          lat: place.geometry?.location.lat ?? null,
          lng: place.geometry?.location.lng ?? null,
          google_place_id: place.place_id,
          tags: finalTags,
          description: null,
          is_active: true,
        });
      }
      inserted++;
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      results.push({ name: query, status: "error", error: String(e) });
    }
  }

  return NextResponse.json({ ok: true, dryRun, inserted, skipped, notFound, results });
}
