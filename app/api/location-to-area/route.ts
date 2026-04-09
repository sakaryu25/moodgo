import { NextResponse } from "next/server";

type RequestBody = {
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
};

type GoogleGeocodeResult = {
  formatted_address?: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
};

type GoogleGeocodeResponse = {
  status?: string;
  error_message?: string;
  results?: GoogleGeocodeResult[];
};

function pickAreaFromResult(result?: GoogleGeocodeResult) {
  if (!result) return null;

  const components = result.address_components ?? [];

  const findLongName = (targets: string[]) => {
    const found = components.find((component) =>
      targets.every((type) => component.types.includes(type))
    );
    return found?.long_name ?? null;
  };

  const locality = findLongName(["locality"]);
  const ward =
    findLongName(["sublocality_level_1", "sublocality"]) ||
    findLongName(["ward"]);
  const neighborhood = findLongName(["neighborhood"]);
  const admin2 = findLongName(["administrative_area_level_2"]);
  const admin1 = findLongName(["administrative_area_level_1"]);

  const area = locality || ward || neighborhood || admin2 || admin1 || null;

  return {
    area,
    locality,
    ward,
    neighborhood,
    prefecture: admin1,
    formattedAddress: result.formatted_address ?? null,
  };
}

async function reverseGeocode(latitude: number, longitude: number) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "GOOGLE_MAPS_API_KEY が .env.local にありません。",
      },
      { status: 500 }
    );
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("latlng", `${latitude},${longitude}`);
  url.searchParams.set("language", "ja");
  url.searchParams.set("region", "jp");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  const data =
    (await res.json().catch(() => null)) as GoogleGeocodeResponse | null;

  if (!res.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Geocoding API の呼び出しに失敗しました。",
        detail: data,
      },
      { status: 502 }
    );
  }

  if (!data || data.status !== "OK" || !data.results?.length) {
    return NextResponse.json(
      {
        ok: false,
        error: "位置情報からエリアを特定できませんでした。",
        googleStatus: data?.status ?? "UNKNOWN_ERROR",
        googleMessage: data?.error_message ?? null,
      },
      { status: 404 }
    );
  }

  const picked = pickAreaFromResult(data.results[0]);

  if (!picked?.area) {
    return NextResponse.json(
      {
        ok: false,
        error: "住所候補は取れましたが、エリア名に変換できませんでした。",
        formattedAddress: picked?.formattedAddress ?? null,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    area: picked.area,
    locality: picked.locality,
    ward: picked.ward,
    neighborhood: picked.neighborhood,
    prefecture: picked.prefecture,
    formattedAddress: picked.formattedAddress,
    latitude,
    longitude,
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = Number(searchParams.get("latitude") ?? searchParams.get("lat"));
    const longitude = Number(searchParams.get("longitude") ?? searchParams.get("lng"));

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json({
        ok: true,
        message:
          "location-to-area route is alive. GETで試すなら /api/location-to-area?latitude=35.4437&longitude=139.6380 のように開いてください。",
      });
    }

    return reverseGeocode(latitude, longitude);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "GET /api/location-to-area でエラーが発生しました。",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as RequestBody | null;

    const latitude =
      typeof body?.latitude === "number"
        ? body.latitude
        : typeof body?.lat === "number"
          ? body.lat
          : NaN;

    const longitude =
      typeof body?.longitude === "number"
        ? body.longitude
        : typeof body?.lng === "number"
          ? body.lng
          : NaN;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json(
        {
          ok: false,
          error: "latitude / longitude が不正です。",
        },
        { status: 400 }
      );
    }

    return reverseGeocode(latitude, longitude);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "POST /api/location-to-area でエラーが発生しました。",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
