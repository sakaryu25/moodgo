"use client";

import { useEffect, useMemo, useState } from "react";

type Recommendation = {
  title: string;
  vibe?: string;
  budget?: string;
  time?: string;
  address?: string;
  mapUrl?: string;
  rating?: number | null;
  userRatingCount?: number | null;
  photoUrl?: string;
  openingHoursText?: string;
  distanceText?: string;
  durationText?: string;
  openNow?: boolean;
};

type FavoriteItem = {
  title: string;
  area: string;
  vibe: string;
  photoUrl?: string;
  mapUrl?: string;
  createdAt?: string;
};

type HistoryItem = {
  id: string;
  mood: string;
  area: string;
  companion: string;
  transport: string;
  budget: number;
  time: string;
  atmosphere: string;
  priority: string;
  freeWord: string;
  topRecommendation: string;
};

type Answers = {
  mood: string;
  area: string;
  companion: string;
  transport: string;
  budget: number;
  time: string;
  atmosphere: string;
  priority: string;
  freeWord: string;
  originLat?: number;
  originLng?: number;
};

const FAVORITES_KEY = "moodgo-favorites";
const HISTORY_KEY = "moodgo-history";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);

  const [selectedMood, setSelectedMood] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCompanion, setSelectedCompanion] = useState("");
  const [selectedTransport, setSelectedTransport] = useState("");
  const [budget, setBudget] = useState(3000);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedAtmosphere, setSelectedAtmosphere] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [freeWord, setFreeWord] = useState("");

  const [originLat, setOriginLat] = useState<number | undefined>(undefined);
  const [originLng, setOriginLng] = useState<number | undefined>(undefined);

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [homeView, setHomeView] = useState<"home" | "history" | "favorites">("home");
  const [favoriteSort, setFavoriteSort] = useState<"newest" | "title">("newest");

  const [apiRecommendations, setApiRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [apiWarning, setApiWarning] = useState("");

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [heroSrc, setHeroSrc] = useState("/moodgo-home-hero.png");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      const storedHistory = window.localStorage.getItem(HISTORY_KEY);

      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    } catch (error) {
      console.error("Failed to load local data", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const moods = [
    "お腹すいた",
    "ゆっくりしたい",
    "楽しみたい",
    "発散したい",
    "体を動かしたい",
    "遠くに行きたい",
  ];

  const companions = ["一人", "友達", "恋人", "家族", "大人数グループ", "先輩"];

  const transportOptions = [
    "徒歩のみ",
    "自転車・バイク",
    "電車",
    "車",
    "バス",
    "なんでも",
  ];

  const timeOptions = [
    "15〜30分",
    "30〜60分",
    "1〜2時間",
    "2〜4時間",
    "4〜6時間",
    "6時間以上",
  ];

  const atmosphereOptions = [
    "静か",
    "賑やか",
    "アクティブ",
    "スリル",
    "ロマンティック",
    "アットホーム",
  ];

  const priorityOptions = [
    "コスパ",
    "映え",
    "距離",
    "快適さ",
    "楽しさ",
    "質の高さ",
  ];

  const pageStyle = {
    minHeight: "100vh",
    background: "#ffffff",
    padding: "28px 18px",
    color: "#4a3034",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative" as const,
    overflow: "hidden" as const,
    fontFamily:
      '"Hiragino Maru Gothic ProN", "Yu Gothic", "Hiragino Sans", sans-serif',
  };

  const shellStyle = {
    width: "100%",
    maxWidth: "720px",
    position: "relative" as const,
    zIndex: 1,
  };

  const cardStyle = {
    width: "100%",
    background: "#ffffff",
    border: "3px solid #f0d7dc",
    borderRadius: "34px",
    padding: "28px",
    boxShadow: "0 14px 34px rgba(74,48,52,0.08)",
  } as const;

  const homePanelStyle = {
    background: "#ffffff",
    borderRadius: "28px",
    border: "1px solid #f2dfe3",
    boxShadow: "0 12px 28px rgba(74,48,52,0.08)",
    padding: "22px",
  } as const;

  const primaryButtonStyle = {
    height: "52px",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #ffbf67 0%, #ff8f7f 100%)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(255, 153, 122, 0.25)",
  } as const;

  const secondaryButtonStyle = {
    height: "52px",
    borderRadius: "999px",
    border: "1px solid #ead7db",
    background: "#ffffff",
    color: "#4a3034",
    fontSize: "15px",
    fontWeight: 900,
    cursor: "pointer",
  } as const;

  const sectionPanelStyle = {
    background: "#ffffff",
    borderRadius: "28px",
    border: "1px solid #ead7db",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(74,48,52,0.08)",
  } as const;

  const sectionHeaderBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid #ead7db",
    background: "#fff6f8",
    fontSize: "13px",
    fontWeight: 900,
    marginBottom: "14px",
  } as const;

  const listCardStyle = {
    background: "#fff",
    borderRadius: "22px",
    padding: "16px",
    border: "1px solid #ead7db",
    boxShadow: "0 8px 18px rgba(74,48,52,0.06)",
  } as const;

  const metaChipStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid #ead7db",
    background: "#fffaf3",
    fontSize: "12px",
    fontWeight: 800,
  } as const;


  const bubbleFieldStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "24px",
    padding: "20px 0",
    alignItems: "start",
  } as const;

  const uniformBubbleStyle = {
    width: "100%",
    aspectRatio: "1 / 1",
    minHeight: "138px",
    borderRadius: "999px",
    border: "1px solid #ead7db",
    background: "#ffffff",
    color: "#4a3034",
    fontSize: "16px",
    fontWeight: 900,
    cursor: "pointer",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    lineHeight: 1.45,
    transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
    boxShadow: "0 8px 18px rgba(74,48,52,0.06)",
  };

  const selectedBubbleStyle = {
    background: "linear-gradient(180deg, #fff8f2 0%, #ffe5ea 100%)",
    boxShadow: "0 0 0 5px rgba(255, 214, 223, 0.7)",
    transform: "scale(1.02)",
  };

  function normalizeRecommendations(data: any): Recommendation[] {
    const recommendationList = Array.isArray(data?.recommendations)
      ? data.recommendations
      : [];

    if (recommendationList.length > 0) {
      return recommendationList.map((item: any) => ({
        title:
          item?.title ||
          item?.name ||
          item?.displayName?.text ||
          item?.displayName ||
          "おすすめ候補",
        vibe: item?.vibe || item?.editorialSummary?.text || "",
        budget: item?.budget || item?.priceLevel || "",
        time: item?.time || "",
        address:
          item?.address ||
          item?.formattedAddress ||
          item?.formatted_address ||
          item?.shortFormattedAddress ||
          item?.vicinity ||
          "",
        mapUrl: item?.mapUrl || item?.googleMapsUri || item?.url || "",
        photoUrl: item?.photoUrl || item?.photoUri || "",
        openingHoursText:
          item?.openingHoursText ||
          item?.currentOpeningHours?.weekdayDescriptions?.[0] ||
          item?.regularOpeningHours?.weekdayDescriptions?.[0] ||
          "",
        distanceText: item?.distanceText || item?.distance || "",
        durationText: item?.durationText || item?.duration || "",
        openNow:
          typeof item?.openNow === "boolean"
            ? item.openNow
            : typeof item?.currentOpeningHours?.openNow === "boolean"
            ? item.currentOpeningHours.openNow
            : undefined,
        rating:
          typeof item?.rating === "number"
            ? item.rating
            : item?.rating
            ? Number(item.rating)
            : null,
        userRatingCount:
          typeof item?.userRatingCount === "number"
            ? item.userRatingCount
            : item?.userRatingCount
            ? Number(item.userRatingCount)
            : null,
      }));
    }

    const resultsList = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data?.places)
      ? data.places
      : [];

    return resultsList.map((item: any) => ({
      title:
        item?.title ||
        item?.name ||
        item?.displayName?.text ||
        item?.displayName ||
        "おすすめ候補",
      vibe: item?.vibe || item?.editorialSummary?.text || "",
      budget: item?.budget || item?.priceLevel || "",
      time: item?.time || "",
      address:
        item?.address ||
        item?.formattedAddress ||
        item?.formatted_address ||
        item?.shortFormattedAddress ||
        item?.vicinity ||
        "",
      mapUrl: item?.mapUrl || item?.googleMapsUri || item?.url || "",
      photoUrl: item?.photoUrl || item?.photoUri || "",
      openingHoursText:
        item?.openingHoursText ||
        item?.currentOpeningHours?.weekdayDescriptions?.[0] ||
        item?.regularOpeningHours?.weekdayDescriptions?.[0] ||
        "",
      distanceText: item?.distanceText || item?.distance || "",
      durationText: item?.durationText || item?.duration || "",
      openNow:
        typeof item?.openNow === "boolean"
          ? item.openNow
          : typeof item?.currentOpeningHours?.openNow === "boolean"
          ? item.currentOpeningHours.openNow
          : undefined,
      rating:
        typeof item?.rating === "number"
          ? item.rating
          : item?.rating
          ? Number(item.rating)
          : null,
      userRatingCount:
        typeof item?.userRatingCount === "number"
          ? item.userRatingCount
          : item?.userRatingCount
          ? Number(item.userRatingCount)
          : null,
    }));
  }

  function renderOptionGrid(
    options: string[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) {
    const columns = options.length === 6 ? 3 : options.length === 3 ? 3 : 2;

    return (
      <div
        style={{
          ...bubbleFieldStyle,
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => {
          const selected = selectedValue === option;

          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              style={{
                ...uniformBubbleStyle,
                ...(selected ? selectedBubbleStyle : {}),
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  async function parseJsonResponse(res: Response) {
    const text = await res.text();
    const contentType = res.headers.get("content-type") || "unknown";

    try {
      return JSON.parse(text);
    } catch {
      console.error("Non-JSON response:", text);
      throw new Error(
        `API のレスポンスを JSON として読めませんでした。status=${res.status} content-type=${contentType}`
      );
    }
  }

  const answers: Answers = {
    mood: selectedMood,
    area: selectedArea,
    companion: selectedCompanion,
    transport: selectedTransport,
    budget,
    time: selectedTime,
    atmosphere: selectedAtmosphere,
    priority: selectedPriority,
    freeWord,
    originLat,
    originLng,
  };

  const recommendations = apiRecommendations;

  const isFavorited = (title: string) =>
    favorites.some((item) => item.title === title);

  const toggleFavorite = (item: Recommendation) => {
    if (isFavorited(item.title)) {
      setFavorites((prev) => prev.filter((fav) => fav.title !== item.title));
      return;
    }

    setFavorites((prev) => [
      {
        title: item.title,
        area: answers.area,
        vibe: item.vibe || item.address || "おすすめスポット",
        photoUrl: item.photoUrl,
        mapUrl: item.mapUrl,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const resetAndStart = () => {
    setApiRecommendations([]);
    setApiWarning("");
    setLocationError("");
    setHomeView("home");
    setStarted(true);
    setStep(1);
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("このブラウザでは位置情報が使えません。");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setOriginLat(latitude);
          setOriginLng(longitude);

          const res = await fetch("/api/location-to-area", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          const data = await parseJsonResponse(res);

          if (!res.ok) {
            throw new Error(data?.error || "エリアの取得に失敗しました。");
          }

          setSelectedArea(data?.area || "現在地周辺");
        } catch (error) {
          console.error(error);
          const message =
            error instanceof Error
              ? error.message
              : "現在地からエリアを取得できませんでした。";
          setLocationError(message);
          alert(message);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        setIsLocating(false);

        if (error.code === 1) {
          setLocationError("位置情報の許可がオフです。手入力で進めてください。");
          alert("位置情報の許可がオフです。手入力で進めてください。");
        } else if (error.code === 3) {
          setLocationError("位置情報の取得がタイムアウトしました。");
          alert("位置情報の取得がタイムアウトしました。");
        } else {
          setLocationError("現在地を取得できませんでした。");
          alert("現在地を取得できませんでした。");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const openResults = async () => {
    if (!answers.priority) return;

    try {
      setIsLoadingRecommendations(true);
      setApiWarning("");

      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const data = await parseJsonResponse(res);

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "おすすめ取得に失敗しました。");
      }

      const normalizedRecommendations = normalizeRecommendations(data);
      setApiRecommendations(normalizedRecommendations);
      setApiWarning(data?.warning || "");

      const topRecommendation =
        normalizedRecommendations?.[0]?.title ?? "おすすめ候補";

      const newHistoryItem: HistoryItem = {
        id: `${Date.now()}`,
        mood: answers.mood,
        area: answers.area,
        companion: answers.companion,
        transport: answers.transport,
        budget: answers.budget,
        time: answers.time,
        atmosphere: answers.atmosphere,
        priority: answers.priority,
        freeWord: answers.freeWord,
        topRecommendation,
      };

      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 30));
      setStep(10);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "おすすめの取得に失敗しました。"
      );
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const latestHistory = useMemo(() => history.slice(0, 5), [history]);
  const sortedFavorites = useMemo(() => {
    return [...favorites].sort((a, b) => {
      if (favoriteSort === "title") {
        return a.title.localeCompare(b.title, "ja");
      }
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
  }, [favorites, favoriteSort]);

  const resultCardStyle = {
    background: "#ffffff",
    borderRadius: "30px",
    overflow: "hidden",
    border: "1px solid #f0dfe3",
    boxShadow: "0 14px 30px rgba(74,48,52,0.08)",
    position: "relative" as const,
  };

  const chipStyle = {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#fff7f8",
    border: "1px solid #f0d7dc",
    fontSize: "12px",
    fontWeight: 800,
  } as const;

  // OPEN NOW COLOR PATCH
  const getOpeningChipStyle = (openNow?: boolean) => {
    if (openNow === true) {
      return {
        ...chipStyle,
        background: "#e9f8ef",
        border: "1px solid #bfe7cc",
        color: "#18794e",
      } as const;
    }

    if (openNow === false) {
      return {
        ...chipStyle,
        background: "#f3f4f6",
        border: "1px solid #d9dde3",
        color: "#6b7280",
      } as const;
    }

    return chipStyle;
  };

  const infoLineStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: "#6c565a",
    lineHeight: 1.6,
  } as const;

  const renderHome = () => {
    return (
      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        <div
          style={{
            ...homePanelStyle,
            padding: "20px 20px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "520px",
              margin: "0 auto 18px",
            }}
          >
            <img
              src={heroSrc}
              alt="MoodGo home visual"
              onError={() => setHeroSrc("/brain-home.png")}
              style={{
                width: "100%",
                display: "block",
                borderRadius: "26px",
                objectFit: "cover",
              }}
            />

            <button
              type="button"
              onClick={resetAndStart}
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                bottom: "19%",
                width: "62%",
                height: "11.5%",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #f7c7d3 0%, #f2a8bb 100%)",
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: 900,
                boxShadow: "0 12px 22px rgba(242, 168, 187, 0.34)",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              はじめる
            </button>

            <button
              type="button"
              onClick={() => setHomeView("history")}
              style={{
                position: "absolute",
                left: "8%",
                bottom: "7%",
                width: "36%",
                height: "9.5%",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #ffca7d 0%, #ff9f57 100%)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 900,
                boxShadow: "0 10px 18px rgba(255, 161, 87, 0.25)",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              履歴を見る
            </button>

            <button
              type="button"
              onClick={() => setHomeView("favorites")}
              style={{
                position: "absolute",
                right: "8%",
                bottom: "7%",
                width: "36%",
                height: "9.5%",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #ffb8c6 0%, #ff879f 100%)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 900,
                boxShadow: "0 10px 18px rgba(255, 135, 159, 0.22)",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              お気に入りを見る
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHistoryPage = () => {
    return (
      <div style={{ display: "grid", gap: "18px" }}>
        <div style={{ ...homePanelStyle, padding: "22px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <div style={{ fontWeight: 900, fontSize: "24px", marginBottom: "4px" }}>
                履歴
              </div>
              <div style={{ fontSize: "14px", opacity: 0.72 }}>
                これまで見たおすすめをチェック
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHomeView("home")}
              style={{
                ...secondaryButtonStyle,
                minWidth: "110px",
                height: "44px",
                fontSize: "14px",
              }}
            >
              戻る
            </button>
          </div>

          {latestHistory.length === 0 ? (
            <div
              style={{
                background: "#fffaf8",
                borderRadius: "18px",
                padding: "18px",
                border: "1px solid #f2dfe3",
                fontSize: "14px",
                opacity: 0.82,
              }}
            >
              まだ履歴はありません
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {latestHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#fffaf8",
                    borderRadius: "20px",
                    padding: "16px",
                    border: "1px solid #f2dfe3",
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: "16px", marginBottom: "6px" }}>
                    {item.topRecommendation}
                  </div>
                  <div style={{ fontSize: "13px", opacity: 0.78, lineHeight: 1.8 }}>
                    気分：{item.mood}
                    <br />
                    エリア：{item.area}
                    <br />
                    誰と：{item.companion}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFavoritesPage = () => {
    return (
      <div style={{ display: "grid", gap: "18px" }}>
        <div style={{ ...homePanelStyle, padding: "22px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <div style={{ fontWeight: 900, fontSize: "24px", marginBottom: "4px" }}>
                お気に入り
              </div>
              <div style={{ fontSize: "14px", opacity: 0.72 }}>
                保存した場所をまとめて見られるよ
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHomeView("home")}
              style={{
                ...secondaryButtonStyle,
                minWidth: "110px",
                height: "44px",
                fontSize: "14px",
              }}
            >
              戻る
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setFavoriteSort("newest")}
              style={{
                ...secondaryButtonStyle,
                height: "40px",
                padding: "0 14px",
                background: favoriteSort === "newest" ? "#fff1f5" : "#fff",
              }}
            >
              新しい順
            </button>

            <button
              type="button"
              onClick={() => setFavoriteSort("title")}
              style={{
                ...secondaryButtonStyle,
                height: "40px",
                padding: "0 14px",
                background: favoriteSort === "title" ? "#fff1f5" : "#fff",
              }}
            >
              名前順
            </button>
          </div>

          {sortedFavorites.length === 0 ? (
            <div
              style={{
                background: "#fffaf8",
                borderRadius: "18px",
                padding: "18px",
                border: "1px solid #f2dfe3",
                fontSize: "14px",
                opacity: 0.82,
              }}
            >
              保存した場所はまだありません
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {sortedFavorites.slice(0, 12).map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: "grid",
                    gridTemplateColumns: item.photoUrl ? "90px 1fr" : "1fr",
                    gap: "14px",
                    background: "#fffaf8",
                    borderRadius: "20px",
                    padding: "14px",
                    border: "1px solid #f2dfe3",
                  }}
                >
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "16px",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}

                  <div>
                    <div style={{ fontWeight: 900, fontSize: "16px", marginBottom: "6px" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "13px", opacity: 0.78, lineHeight: 1.8 }}>
                      {item.area}
                      <br />
                      {item.vibe}
                    </div>

                    {item.mapUrl ? (
                      <a
                        href={item.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "10px",
                          padding: "8px 12px",
                          borderRadius: "999px",
                          background: "#ffffff",
                          border: "1px solid #f0d7dc",
                          color: "#4a3034",
                          fontSize: "12px",
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        Googleマップで見る
                      </a>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => {
                        setFavorites((prev) =>
                          prev.filter((f) => f.title !== item.title)
                        );
                      }}
                      style={{
                        marginTop: "10px",
                        border: "none",
                        background: "transparent",
                        color: "#b26073",
                        fontSize: "12px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        {!started ? (
          homeView === "home" ? renderHome() : homeView === "history" ? renderHistoryPage() : renderFavoritesPage()
        ) : (
          <div style={cardStyle}>
            <div
              style={{
                marginBottom: "20px",
                fontSize: "14px",
                opacity: 0.75,
                fontWeight: 800,
              }}
            >
              {step <= 9 ? `${step} / 9` : "結果"}
            </div>

            {step === 1 && (
              <>
                <h2 style={{ fontSize: "34px", marginTop: 0, marginBottom: "10px", fontWeight: 900 }}>
                  今の気分は？
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "10px" }}>
                  近いものを選んでください。未選択のままでも進めます。
                </p>

                {renderOptionGrid(moods, selectedMood, setSelectedMood)}

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => setStarted(false)}
                    style={{ ...secondaryButtonStyle, flex: 1 }}
                  >
                    戻る
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    style={{ ...primaryButtonStyle, flex: 1 }}
                  >
                    次へ
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ fontSize: "34px", marginTop: 0, marginBottom: "10px", fontWeight: 900 }}>
                  今いるエリアは？
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "10px" }}>
                  現在地を使うか、エリア名を手入力してください。
                </p>

                <div
                  style={{
                    background: "#fffaf8",
                    borderRadius: "28px",
                    padding: "24px",
                    border: "1px solid #f1dfe3",
                    marginBottom: "24px",
                  }}
                >
                  <button
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    style={{
                      ...primaryButtonStyle,
                      width: "100%",
                      opacity: isLocating ? 0.7 : 1,
                      marginBottom: "18px",
                    }}
                  >
                    {isLocating ? "現在地を取得中..." : "現在地を使う"}
                  </button>

                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: 800,
                      opacity: 0.75,
                      marginBottom: "18px",
                    }}
                  >
                    または
                  </div>

                  <input
                    type="text"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    placeholder="例：横浜 / 渋谷 / みなとみらい"
                    style={{
                      width: "100%",
                      height: "56px",
                      borderRadius: "18px",
                      border: "1px solid #ead7db",
                      padding: "0 16px",
                      fontSize: "16px",
                      outline: "none",
                      color: "#4a3034",
                      background: "#fff",
                      marginBottom: "14px",
                      boxSizing: "border-box",
                    }}
                  />

                  <div style={{ fontSize: "13px", opacity: 0.75, lineHeight: 1.6 }}>
                    現在地がうまく取れない場合は、エリア名をそのまま入力してください。
                  </div>

                  {locationError ? (
                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        color: "#9b3c50",
                      }}
                    >
                      {locationError}
                    </div>
                  ) : null}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(1)} style={{ ...secondaryButtonStyle, flex: 1 }}>
                    戻る
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    style={{
                      ...primaryButtonStyle,
                      flex: 1,
                    }}
                  >
                    次へ
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 style={{ fontSize: "34px", marginTop: 0, marginBottom: "10px", fontWeight: 900 }}>
                  誰と？
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "10px" }}>
                  誰と行くかでおすすめが変わります。未選択のままでも進めます。
                </p>
                {renderOptionGrid(companions, selectedCompanion, setSelectedCompanion)}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(2)} style={{ ...secondaryButtonStyle, flex: 1 }}>
                    戻る
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    style={{ ...primaryButtonStyle, flex: 1 }}
                  >
                    次へ
                  </button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 style={{ fontSize: "34px", marginTop: 0, marginBottom: "10px", fontWeight: 900 }}>
                  交通手段は？
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "10px" }}>
                  無理なく行ける手段を選んでください。未選択のままでも進めます。
                </p>
                {renderOptionGrid(transportOptions, selectedTransport, setSelectedTransport)}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(3)} style={{ ...secondaryButtonStyle, flex: 1 }}>
                    戻る
                  </button>
                  <button
                    onClick={() => setStep(5)}
                    style={{ ...primaryButtonStyle, flex: 1 }}
                  >
                    次へ
                  </button>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h2 style={{ fontSize: "34px", marginTop: 0, marginBottom: "10px", fontWeight: 900 }}>
                  予算はどのくらい？
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>
                  ざっくり上限を決めてください。
                </p>

                <div
                  style={{
                    background: "#fffaf8",
                    borderRadius: "28px",
                    padding: "24px",
                    border: "1px solid #f1dfe3",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ textAlign: "center", fontSize: "38px", fontWeight: 900, marginBottom: "8px" }}>
                    ¥{budget.toLocaleString("ja-JP")}
                  </div>
                  <div style={{ textAlign: "center", fontSize: "14px", opacity: 0.75, marginBottom: "20px" }}>
                    予算の上限
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#ff9f86", marginBottom: "14px" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", opacity: 0.7 }}>
                    <span>¥0</span>
                    <span>¥10,000</span>
                    <span>¥30,000</span>
                    <span>¥50,000</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
                  {[0, 1000, 3000, 10000, 30000, 50000].map((price) => (
                    <button
                      key={price}
                      onClick={() => setBudget(price)}
                      style={{
                        borderRadius: "999px",
                        border: "1px solid #ead7db",
                        background: budget === price ? "#ffe9ea" : "#fff",
                        color: "#4a3034",
                        padding: "10px 14px",
                        fontSize: "14px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {price === 0 ? "無料" : `¥${price.toLocaleString("ja-JP")}`}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(4)} style={{ ...secondaryButtonStyle, flex: 1 }}>
                    戻る
                  </button>
                  <button onClick={() => setStep(6)} style={{ ...primaryButtonStyle, flex: 1 }}>
                    次へ
                  </button>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <h2 style={{ fontSize: "34px", marginTop: 0, marginBottom: "10px", fontWeight: 900 }}>
                  どのくらい時間ある？
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "10px" }}>
                  空き時間に合う過ごし方を考えるために選んでください。未選択のままでも進めます。
                </p>
                {renderOptionGrid(timeOptions, selectedTime, setSelectedTime)}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(5)} style={{ ...secondaryButtonStyle, flex: 1 }}>
                    戻る
                  </button>
                  <button
                    onClick={() => setStep(7)}
                    style={{ ...primaryButtonStyle, flex: 1 }}
                  >
                    次へ
                  </button>
                </div>
              </>
            )}

            {step === 7 && (
              <>
                <h2 style={{ fontSize: "34px", marginTop: 0, marginBottom: "10px", fontWeight: 900 }}>
                  雰囲気は？
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "10px" }}>
                  今日の気分に合う空気感を選んでください。未選択のままでも進めます。
                </p>
                {renderOptionGrid(atmosphereOptions, selectedAtmosphere, setSelectedAtmosphere)}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(6)} style={{ ...secondaryButtonStyle, flex: 1 }}>
                    戻る
                  </button>
                  <button
                    onClick={() => setStep(8)}
                    style={{ ...primaryButtonStyle, flex: 1 }}
                  >
                    次へ
                  </button>
                </div>
              </>
            )}

            {step === 8 && (
              <>
                <h2 style={{ fontSize: "34px", marginTop: 0, marginBottom: "10px", fontWeight: 900 }}>
                  優先したいものは？
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "10px" }}>
                  いちばん大事にしたいポイントを選んでください。未選択のままでも進めます。
                </p>
                {renderOptionGrid(priorityOptions, selectedPriority, setSelectedPriority)}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(7)} style={{ ...secondaryButtonStyle, flex: 1 }}>
                    戻る
                  </button>
                  <button
                    onClick={() => setStep(9)}
                    style={{ ...primaryButtonStyle, flex: 1 }}
                  >
                    次へ
                  </button>
                </div>
              </>
            )}

            {step === 9 && (
              <>
                <h2 style={{ fontSize: "34px", marginTop: 0, marginBottom: "10px", fontWeight: 900 }}>
                  自由ワード
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "16px" }}>
                  行きたい場所のイメージがあれば自由に書いてください。
                </p>
                <textarea
                  value={freeWord}
                  onChange={(e) => setFreeWord(e.target.value)}
                  placeholder="例：夜景、甘いもの、公園、静かな場所、海が見たい など"
                  style={{
                    width: "100%",
                    minHeight: "130px",
                    borderRadius: "22px",
                    border: "1px solid #ead7db",
                    padding: "16px",
                    fontSize: "15px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    outline: "none",
                    background: "#fffaf8",
                    marginBottom: "24px",
                  }}
                />
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(8)} style={{ ...secondaryButtonStyle, flex: 1 }}>
                    戻る
                  </button>
                  <button onClick={openResults} style={{ ...primaryButtonStyle, flex: 1 }}>
                    {isLoadingRecommendations ? "考え中..." : "おすすめを見る"}
                  </button>
                </div>
              </>
            )}

            {step === 10 && (
              <>
                <h2 style={{ fontSize: "34px", marginTop: 0, marginBottom: "10px", fontWeight: 900 }}>
                  {answers.area}でのおすすめ
                </h2>

                {apiWarning ? (
                  <div
                    style={{
                      background: "#fff7e6",
                      borderRadius: "18px",
                      padding: "12px 14px",
                      border: "1px solid #f0d7dc",
                      marginBottom: "16px",
                      fontSize: "13px",
                      lineHeight: 1.6,
                    }}
                  >
                    {apiWarning}
                  </div>
                ) : null}

                <div
                  style={{
                    background: "#fffaf8",
                    borderRadius: "24px",
                    padding: "16px",
                    border: "1px solid #f0dfe3",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ fontWeight: 900, marginBottom: "10px" }}>今回の条件</div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <div>気分：{answers.mood}</div>
                    <div>エリア：{answers.area}</div>
                    <div>誰と：{answers.companion}</div>
                    <div>交通手段：{answers.transport}</div>
                    <div>予算：¥{answers.budget.toLocaleString("ja-JP")}</div>
                    <div>時間：{answers.time}</div>
                    <div>雰囲気：{answers.atmosphere}</div>
                    <div>優先：{answers.priority}</div>
                  </div>
                  {answers.freeWord ? (
                    <div style={{ marginTop: "12px", fontSize: "14px" }}>
                      自由ワード：{answers.freeWord}
                    </div>
                  ) : null}
                </div>

                <div style={{ display: "grid", gap: "18px", marginBottom: "24px" }}>
                  {recommendations.length > 0 ? (
                    recommendations.map((item, index) => {
                      const favorited = isFavorited(item.title);

                      return (
                        <div key={`${item.title}-${index}`} style={resultCardStyle}>
                          <div style={{ position: "relative" }}>
                            {item.photoUrl ? (
                              <img
                                src={item.photoUrl}
                                alt={item.title}
                                style={{
                                  width: "100%",
                                  height: "220px",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                  height: "220px",
                                  background: "linear-gradient(135deg, #fff2ef 0%, #ffe3e8 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "16px",
                                  fontWeight: 900,
                                  color: "#8b6d72",
                                }}
                              >
                                MoodGo recommendation
                              </div>
                            )}

                            <button
                              onClick={() => toggleFavorite(item)}
                              style={{
                                position: "absolute",
                                top: "14px",
                                right: "14px",
                                width: "48px",
                                height: "48px",
                                borderRadius: "999px",
                                border: "none",
                                background: favorited ? "#ff8fa5" : "rgba(255,255,255,0.92)",
                                color: favorited ? "#ffffff" : "#ff8fa5",
                                fontSize: "24px",
                                fontWeight: 900,
                                cursor: "pointer",
                                boxShadow: "0 10px 20px rgba(74,48,52,0.16)",
                              }}
                              aria-label="お気に入り"
                            >
                              {favorited ? "♥" : "♡"}
                            </button>
                          </div>

                          <div style={{ padding: "20px 18px 18px" }}>
                            <div
                              style={{
                                fontWeight: 900,
                                fontSize: "34px",
                                lineHeight: 1.15,
                                marginBottom: "10px",
                                letterSpacing: "-0.03em",
                              }}
                            >
                              {item.title}
                            </div>

                            {item.address ? (
                              <div style={{ fontSize: "14px", opacity: 0.76, marginBottom: "12px" }}>
                                {item.address}
                              </div>
                            ) : null}

                            {item.vibe ? (
                              <div style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "14px" }}>
                                {item.vibe}
                              </div>
                            ) : null}

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                              {item.budget ? <div style={chipStyle}>{item.budget}</div> : null}
                              {item.time ? <div style={chipStyle}>{item.time}</div> : null}

                              {item.rating !== null && item.rating !== undefined ? (
                                <div style={chipStyle}>
                                  ⭐ {item.rating}
                                  {item.userRatingCount ? ` (${item.userRatingCount})` : ""}
                                </div>
                              ) : null}

                              {item.distanceText ? (
                                <div style={chipStyle}>🚶 {item.distanceText}</div>
                              ) : null}

                              {item.openNow !== undefined || item.openingHoursText ? (
                                <div style={getOpeningChipStyle(item.openNow)}>
                                  🕒 {item.openNow === true ? "営業中" : item.openNow === false ? "閉店中" : item.openingHoursText}
                                </div>
                              ) : null}
                            </div>

                            <div style={{ display: "grid", gap: "10px", marginBottom: "18px" }}>
                              {item.openingHoursText || item.openNow !== undefined ? (
                                <div style={infoLineStyle}>
                                  <span style={{ fontSize: "20px" }}>🕒</span>
                                  <span>{item.openingHoursText || (item.openNow ? "営業中" : "閉店中")}</span>
                                </div>
                              ) : null}

                              {item.distanceText || item.durationText ? (
                                <div style={infoLineStyle}>
                                  <span style={{ fontSize: "20px" }}>🚶</span>
                                  <span>
                                    {[item.distanceText, item.durationText].filter(Boolean).join(" / ")}
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            {item.mapUrl ? (
                              <a
                                href={item.mapUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  width: "100%",
                                  height: "52px",
                                  borderRadius: "999px",
                                  border: "none",
                                  background: "linear-gradient(135deg, #4184ff 0%, #2a6fe6 100%)",
                                  color: "#ffffff",
                                  fontSize: "15px",
                                  fontWeight: 900,
                                  textDecoration: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 10px 22px rgba(42, 111, 230, 0.2)",
                                }}
                              >
                                Googleマップで見る
                              </a>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: "26px",
                        padding: "18px",
                        border: "1px solid #f0dfe3",
                        textAlign: "center",
                        lineHeight: 1.8,
                      }}
                    >
                      条件に合う候補が見つからなかったよ。
                      <br />
                      条件を少し変えてもう一度試してみてね。
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(2)} style={{ ...secondaryButtonStyle, flex: 1 }}>
                    条件を見直す
                  </button>
                  <button
                    onClick={() => {
                      setApiRecommendations([]);
                      setApiWarning("");
                      setLocationError("");
                      setStarted(false);
                      setStep(1);
                    }}
                    style={{ ...primaryButtonStyle, flex: 1 }}
                  >
                    ホームに戻る
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
