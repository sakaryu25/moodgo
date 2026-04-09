import { NextResponse } from "next/server";

type Answers = {
  mood?: string;
  area?: string;
  companion?: string;
  transport?: string;
  budget?: number;
  time?: string;
  atmosphere?: string;
  priority?: string;
  freeWord?: string;
  originLat?: number;
  originLng?: number;
};

type Bucket = "food" | "spot" | "activity" | "scenic" | "relax" | "mixed" | "indoor";

type SearchPlan = {
  query: string;
  weight: number;
  bucket: Bucket;
};

type SearchPlace = {
  displayName?: { text?: string };
  formattedAddress?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  primaryType?: string;
  types?: string[];
  currentOpeningHours?: {
    openNow?: boolean;
    weekdayDescriptions?: string[];
  };
  regularOpeningHours?: {
    weekdayDescriptions?: string[];
  };
  photos?: Array<{
    name?: string;
  }>;
};

type RoutingSummary = {
  legs?: Array<{
    distanceMeters?: number;
    duration?: string;
  }>;
};

type TextSearchResponse = {
  places?: SearchPlace[];
  routingSummaries?: RoutingSummary[];
};

type WeatherContext = {
  weatherCode?: number;
  isDay?: boolean;
};

type ScoredItem = {
  title: string;
  vibe: string;
  budget: string;
  time: string;
  address: string;
  mapUrl: string;
  rating: number | null;
  userRatingCount: number | null;
  photoUrl: string;
  openingHoursText: string;
  distanceText: string;
  durationText: string;
  openNow?: boolean;
  bucket: Bucket;
  score: number;
};

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

function toPriceLabel(budget?: number) {
  if (budget === undefined || budget === null) return "";
  if (budget <= 1000) return "低予算";
  if (budget <= 3000) return "手頃";
  if (budget <= 10000) return "中価格帯";
  return "高価格帯";
}

function mapTransportToTravelMode(transport?: string) {
  switch (transport) {
    case "徒歩のみ":
      return "WALK";
    case "自転車・バイク":
      return "BICYCLE";
    case "車":
      return "DRIVE";
    default:
      return undefined;
  }
}

function companionHint(companion?: string) {
  switch (companion) {
    case "一人":
      return "一人でも行きやすい";
    case "友達":
      return "友達と楽しめる";
    case "恋人":
      return "デート向き";
    case "家族":
      return "家族で行きやすい";
    case "大人数グループ":
      return "大人数でも楽しめる";
    case "先輩":
      return "会話しやすい";
    default:
      return "";
  }
}

function moodPlans(mood?: string): Array<[string, number, Bucket]> {
  switch (mood) {
    case "お腹すいた":
      return [
        ["レストラン", 16, "food"],
        ["ランチ", 13, "food"],
        ["ディナー", 13, "food"],
        ["カフェ", 11, "food"],
        ["ベーカリー", 10, "food"],
        ["フードホール", 9, "food"],
        ["景色のいいカフェ", 6, "scenic"],
      ];
    case "ゆっくりしたい":
      return [
        ["公園", 14, "spot"],
        ["散歩スポット", 13, "relax"],
        ["庭園", 12, "relax"],
        ["図書館", 10, "indoor"],
        ["落ち着くカフェ", 10, "food"],
        ["展望スポット", 7, "scenic"],
      ];
    case "楽しみたい":
      return [
        ["アミューズメント", 14, "activity"],
        ["観光スポット", 13, "spot"],
        ["体験スポット", 12, "activity"],
        ["ボウリング", 10, "activity"],
        ["ゲームセンター", 10, "indoor"],
        ["人気スポット", 8, "spot"],
      ];
    case "発散したい":
      return [
        ["アクティビティ", 14, "activity"],
        ["カラオケ", 13, "indoor"],
        ["スポーツ施設", 12, "activity"],
        ["サウナ", 9, "relax"],
        ["屋外スポット", 8, "spot"],
      ];
    case "体を動かしたい":
      return [
        ["スポーツ施設", 14, "activity"],
        ["ランニングスポット", 13, "activity"],
        ["公園", 12, "spot"],
        ["ジム", 11, "indoor"],
        ["ハイキング", 10, "spot"],
      ];
    case "遠くに行きたい":
      return [
        ["観光スポット", 15, "spot"],
        ["日帰りスポット", 14, "spot"],
        ["展望台", 12, "scenic"],
        ["海", 11, "scenic"],
        ["水族館", 9, "indoor"],
      ];
    default:
      return [
        ["観光スポット", 9, "spot"],
        ["公園", 8, "spot"],
        ["カフェ", 8, "food"],
      ];
  }
}

function atmospherePlans(atmosphere?: string): Array<[string, number, Bucket]> {
  switch (atmosphere) {
    case "静か":
      return [
        ["静かな公園", 9, "relax"],
        ["落ち着くカフェ", 8, "food"],
        ["図書館", 8, "indoor"],
      ];
    case "賑やか":
      return [
        ["にぎやかなスポット", 9, "spot"],
        ["人気スポット", 8, "spot"],
        ["商業施設", 7, "indoor"],
      ];
    case "アクティブ":
      return [
        ["アクティビティ", 9, "activity"],
        ["体験スポット", 8, "activity"],
        ["屋外スポット", 7, "spot"],
      ];
    case "スリル":
      return [
        ["アミューズメント", 9, "activity"],
        ["体験スポット", 8, "activity"],
      ];
    case "ロマンティック":
      return [
        ["夜景スポット", 10, "scenic"],
        ["展望台", 9, "scenic"],
        ["デートスポット", 8, "scenic"],
      ];
    case "アットホーム":
      return [
        ["居心地のいいカフェ", 9, "food"],
        ["ローカルスポット", 7, "spot"],
        ["小さな公園", 7, "relax"],
      ];
    default:
      return [];
  }
}

function priorityPlans(priority?: string): Array<[string, number, Bucket]> {
  switch (priority) {
    case "コスパ":
      return [
        ["安いカフェ", 8, "food"],
        ["無料スポット", 8, "spot"],
        ["低予算スポット", 7, "spot"],
      ];
    case "映え":
      return [
        ["写真映えスポット", 10, "scenic"],
        ["おしゃれカフェ", 9, "food"],
        ["景色がいい場所", 9, "scenic"],
      ];
    case "距離":
      return [
        ["近くのカフェ", 8, "food"],
        ["近くのスポット", 8, "spot"],
      ];
    case "快適さ":
      return [
        ["居心地のいいカフェ", 9, "food"],
        ["過ごしやすいスポット", 8, "relax"],
      ];
    case "楽しさ":
      return [
        ["楽しいスポット", 9, "activity"],
        ["体験スポット", 9, "activity"],
      ];
    case "質の高さ":
      return [
        ["評価が高いカフェ", 9, "food"],
        ["評価が高いスポット", 8, "spot"],
      ];
    default:
      return [];
  }
}

function allowedBucketsForMood(mood?: string) {
  switch (mood) {
    case "お腹すいた":
      return {
        primary: new Set<Bucket>(["food"]),
        fallback: new Set<Bucket>(["scenic", "indoor"]),
      };
    case "ゆっくりしたい":
      return {
        primary: new Set<Bucket>(["relax", "spot", "indoor", "food"]),
        fallback: new Set<Bucket>(["scenic"]),
      };
    case "楽しみたい":
      return {
        primary: new Set<Bucket>(["activity", "spot", "scenic"]),
        fallback: new Set<Bucket>(["food", "indoor"]),
      };
    case "発散したい":
      return {
        primary: new Set<Bucket>(["activity", "indoor", "spot"]),
        fallback: new Set<Bucket>(["relax"]),
      };
    case "体を動かしたい":
      return {
        primary: new Set<Bucket>(["activity", "spot"]),
        fallback: new Set<Bucket>(["indoor"]),
      };
    case "遠くに行きたい":
      return {
        primary: new Set<Bucket>(["spot", "scenic"]),
        fallback: new Set<Bucket>(["indoor"]),
      };
    default:
      return {
        primary: new Set<Bucket>(["spot", "food", "scenic"]),
        fallback: new Set<Bucket>(["activity", "indoor", "relax"]),
      };
  }
}

function buildSearchPlans(answers: Answers): SearchPlan[] {
  const area = answers.area?.trim() || "現在地周辺";
  const freeWord = answers.freeWord?.trim() || "";
  const companion = companionHint(answers.companion);
  const priceHint = toPriceLabel(answers.budget);
  const atmosphere = answers.atmosphere?.trim() || "";
  const mood = answers.mood?.trim() || "";

  const baseHints = [atmosphere, companion, priceHint].filter(Boolean).join(" ");
  const { primary, fallback } = allowedBucketsForMood(mood);

  const rawPlans: SearchPlan[] = [];

  const pushPlan = (keyword: string, weight: number, bucket: Bucket, extraHint = "") => {
    if (!primary.has(bucket) && !fallback.has(bucket) && mood) return;
    rawPlans.push({
      query: [area, baseHints, extraHint, keyword].filter(Boolean).join(" "),
      weight,
      bucket,
    });
  };

  for (const [keyword, weight, bucket] of moodPlans(mood)) {
    pushPlan(keyword, weight, bucket);
  }

  for (const [keyword, weight, bucket] of atmospherePlans(answers.atmosphere)) {
    pushPlan(keyword, weight, bucket);
  }

  for (const [keyword, weight, bucket] of priorityPlans(answers.priority)) {
    pushPlan(keyword, weight, bucket);
  }

  if (freeWord) {
    rawPlans.unshift({
      query: [area, freeWord].filter(Boolean).join(" "),
      weight: 13,
      bucket: "mixed",
    });
  }

  if (mood === "お腹すいた") {
    rawPlans.push(
      { query: [area, "人気レストラン"].filter(Boolean).join(" "), weight: 10, bucket: "food" },
      { query: [area, "人気カフェ"].filter(Boolean).join(" "), weight: 9, bucket: "food" },
      { query: [area, "ごはん"].filter(Boolean).join(" "), weight: 9, bucket: "food" }
    );
  } else if (mood === "ゆっくりしたい") {
    rawPlans.push(
      { query: [area, "公園"].filter(Boolean).join(" "), weight: 9, bucket: "spot" },
      { query: [area, "庭園"].filter(Boolean).join(" "), weight: 8, bucket: "relax" }
    );
  } else if (mood === "楽しみたい") {
    rawPlans.push(
      { query: [area, "観光スポット"].filter(Boolean).join(" "), weight: 9, bucket: "spot" },
      { query: [area, "体験スポット"].filter(Boolean).join(" "), weight: 9, bucket: "activity" }
    );
  } else if (mood === "遠くに行きたい") {
    rawPlans.push(
      { query: [area, "展望台"].filter(Boolean).join(" "), weight: 9, bucket: "scenic" },
      { query: [area, "日帰りスポット"].filter(Boolean).join(" "), weight: 9, bucket: "spot" }
    );
  }

  const deduped = new Map<string, SearchPlan>();
  for (const plan of rawPlans) {
    const existing = deduped.get(plan.query);
    if (!existing || existing.weight < plan.weight) {
      deduped.set(plan.query, plan);
    }
  }

  return [...deduped.values()].slice(0, 8);
}

async function getPhotoUrl(photoName: string, apiKey: string) {
  const mediaUrl = new URL(`https://places.googleapis.com/v1/${photoName}/media`);
  mediaUrl.searchParams.set("maxHeightPx", "800");
  mediaUrl.searchParams.set("skipHttpRedirect", "true");

  const res = await fetch(mediaUrl.toString(), {
    headers: { "X-Goog-Api-Key": apiKey },
    cache: "no-store",
  });

  if (!res.ok) return "";

  const data = await res.json().catch(() => null);
  return data?.photoUri || "";
}

async function getWeatherContext(lat?: number, lng?: number): Promise<WeatherContext> {
  if (typeof lat !== "number" || typeof lng !== "number") return {};

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lng));
    url.searchParams.set("current", "weather_code,is_day");
    url.searchParams.set("timezone", "Asia/Tokyo");

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return {};

    const data = await res.json().catch(() => null);
    return {
      weatherCode: data?.current?.weather_code,
      isDay: typeof data?.current?.is_day === "number" ? data.current.is_day === 1 : undefined,
    };
  } catch {
    return {};
  }
}

function isRainLikeWeather(code?: number) {
  if (code === undefined) return false;
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
}

function isSnowLikeWeather(code?: number) {
  if (code === undefined) return false;
  return [71, 73, 75, 77, 85, 86].includes(code);
}

function getTimeContext() {
  const hour = Number(
    new Intl.DateTimeFormat("ja-JP", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Tokyo",
    }).format(new Date())
  );

  return {
    hour,
    isMorning: hour >= 5 && hour < 11,
    isDaytime: hour >= 11 && hour < 17,
    isEvening: hour >= 17 && hour < 22,
    isLateNight: hour >= 22 || hour < 5,
  };
}

function formatDistance(distanceMeters?: number) {
  if (distanceMeters === undefined || distanceMeters === null) return "";
  if (distanceMeters < 1000) return `${distanceMeters}m`;
  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

function formatDuration(duration?: string) {
  if (!duration) return "";
  const seconds = Number(duration.replace("s", ""));
  if (!Number.isFinite(seconds)) return "";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes}分`;
}

function scorePlace(params: {
  weight: number;
  rating?: number | null;
  userRatingCount?: number | null;
  openNow?: boolean;
  distanceMeters?: number;
  priority?: string;
  bucket: Bucket;
  mood?: string;
  weather: WeatherContext;
  timeContext: ReturnType<typeof getTimeContext>;
}) {
  let score = params.weight * 10;

  if (typeof params.rating === "number") score += params.rating * 8;
  if (typeof params.userRatingCount === "number") {
    score += Math.min(params.userRatingCount / 40, 12);
  }
  if (params.openNow === true) score += 6;

  if (params.priority === "距離" && typeof params.distanceMeters === "number") {
    score += Math.max(0, 18 - params.distanceMeters / 150);
  }

  if (params.mood === "ゆっくりしたい" && (params.bucket === "spot" || params.bucket === "relax")) score += 10;
  if (params.mood === "遠くに行きたい" && (params.bucket === "spot" || params.bucket === "scenic")) score += 10;
  if (params.mood === "楽しみたい" && (params.bucket === "activity" || params.bucket === "spot")) score += 9;
  if (params.mood === "発散したい" && (params.bucket === "activity" || params.bucket === "indoor")) score += 10;
  if (params.mood === "体を動かしたい" && (params.bucket === "activity" || params.bucket === "spot")) score += 10;

  if (params.mood === "お腹すいた") {
    if (params.bucket === "food") score += 18;
    if (params.bucket === "scenic") score += 2;
    if (params.bucket === "indoor") score -= 2;
    if (params.bucket === "spot" || params.bucket === "relax" || params.bucket === "activity") score -= 25;
  }

  if (isRainLikeWeather(params.weather.weatherCode) || isSnowLikeWeather(params.weather.weatherCode)) {
    if (params.bucket === "indoor" || params.bucket === "food" || params.bucket === "relax") score += 8;
    if (params.bucket === "spot" || params.bucket === "scenic" || params.bucket === "activity") score -= 4;
  } else if (params.timeContext.isDaytime && (params.bucket === "spot" || params.bucket === "scenic")) {
    score += 4;
  }

  if (params.timeContext.isEvening) {
    if (params.bucket === "scenic" || params.bucket === "food") score += 5;
  }

  if (params.timeContext.isLateNight) {
    if (params.bucket === "food" || params.bucket === "indoor") score += 4;
    if (params.bucket === "spot") score -= 3;
  }

  return score;
}

function chooseFinalResults(items: ScoredItem[], mood?: string) {
  const { primary, fallback } = allowedBucketsForMood(mood);

  const primaryItems = items.filter((item) => primary.has(item.bucket));
  const fallbackItems = items.filter(
    (item) => !primary.has(item.bucket) && fallback.has(item.bucket)
  );
  const restItems = items.filter(
    (item) => !primary.has(item.bucket) && !fallback.has(item.bucket)
  );

  const ordered = [...primaryItems, ...fallbackItems, ...restItems];

  const final: ScoredItem[] = [];
  const used = new Set<string>();

  for (const item of ordered) {
    const key = `${item.title}__${item.address}`;
    if (used.has(key)) continue;
    used.add(key);

    if (mood === "お腹すいた") {
      if (item.bucket !== "food" && item.bucket !== "scenic" && item.bucket !== "indoor") {
        if (final.length < 8) continue;
      }
    }

    final.push(item);
    if (final.length >= 12) break;
  }

  return final;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return json(
        { error: "GOOGLE_MAPS_API_KEY が設定されていません。" },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    const answers = (body?.answers || {}) as Answers;

    const plans = buildSearchPlans(answers);
    const travelMode = mapTransportToTravelMode(answers.transport);
    const hasOrigin =
      typeof answers.originLat === "number" && typeof answers.originLng === "number";

    const weather = await getWeatherContext(answers.originLat, answers.originLng);
    const timeContext = getTimeContext();

    const baseFields = [
      "places.displayName",
      "places.formattedAddress",
      "places.googleMapsUri",
      "places.rating",
      "places.userRatingCount",
      "places.primaryType",
      "places.types",
      "places.photos",
      "places.currentOpeningHours",
      "places.regularOpeningHours",
    ];

    const fieldMask = hasOrigin && travelMode
      ? [...baseFields, "routingSummaries"].join(",")
      : baseFields.join(",");

    const searchResults = await Promise.all(
      plans.map(async (plan) => {
        const payload: Record<string, unknown> = {
          textQuery: plan.query,
          languageCode: "ja",
          regionCode: "JP",
          pageSize: 4,
        };

        if (hasOrigin && travelMode) {
          payload.routingParameters = {
            origin: {
              latitude: answers.originLat,
              longitude: answers.originLng,
            },
            travelMode,
          };
        }

        const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": fieldMask,
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        });

        if (!res.ok) {
          const errorText = await res.text().catch(() => "");
          throw new Error(`Places API error: ${res.status} ${errorText}`);
        }

        const data = (await res.json()) as TextSearchResponse;
        return { data, plan };
      })
    );

    const mergedMap = new Map<string, ScoredItem>();

    for (const { data, plan } of searchResults) {
      const places = data.places ?? [];
      const summaries = data.routingSummaries ?? [];

      for (let i = 0; i < places.length; i += 1) {
        const place = places[i];
        const summary = summaries[i];
        const leg = summary?.legs?.[0];

        const title = place.displayName?.text || "おすすめ候補";
        const address = place.formattedAddress || "";
        const dedupeKey = `${title}__${address}`;

        const photoName = place.photos?.[0]?.name || "";
        const photoUrl = photoName ? await getPhotoUrl(photoName, apiKey) : "";

        const openNow = place.currentOpeningHours?.openNow;
        const weekdayText =
          place.currentOpeningHours?.weekdayDescriptions?.[0] ||
          place.regularOpeningHours?.weekdayDescriptions?.[0] ||
          "";

        const nextItem: ScoredItem = {
          title,
          vibe: answers.mood || "",
          budget: answers.budget ? `予算 ¥${answers.budget.toLocaleString("ja-JP")}目安` : "",
          time: answers.time || "",
          address,
          mapUrl: place.googleMapsUri || "",
          rating: typeof place.rating === "number" ? place.rating : null,
          userRatingCount:
            typeof place.userRatingCount === "number" ? place.userRatingCount : null,
          photoUrl,
          openingHoursText: weekdayText,
          distanceText: formatDistance(leg?.distanceMeters),
          durationText: formatDuration(leg?.duration),
          openNow,
          bucket: plan.bucket,
          score: scorePlace({
            weight: plan.weight,
            rating: place.rating,
            userRatingCount: place.userRatingCount,
            openNow,
            distanceMeters: leg?.distanceMeters,
            priority: answers.priority,
            bucket: plan.bucket,
            mood: answers.mood,
            weather,
            timeContext,
          }),
        };

        const existing = mergedMap.get(dedupeKey);
        if (!existing || existing.score < nextItem.score) {
          mergedMap.set(dedupeKey, nextItem);
        }
      }
    }

    const sorted = [...mergedMap.values()].sort((a, b) => b.score - a.score);
    const finalResults = chooseFinalResults(sorted, answers.mood).map(({ score, bucket, ...rest }) => rest);

    const warningNotes: string[] = [];
    if (!hasOrigin || !travelMode) {
      warningNotes.push("現在地や交通手段によっては距離・所要時間が出ないことがあります。");
    }
    if (!weather.weatherCode && typeof answers.originLat !== "number") {
      warningNotes.push("現在地未使用の場合、天気連動は弱めになります。");
    }

    return json({
      recommendations: finalResults,
      warning: warningNotes.join(" "),
    });
  } catch (error) {
    console.error(error);
    return json(
      {
        error: "おすすめの取得に失敗しました。",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
