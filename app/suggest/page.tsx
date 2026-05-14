"use client";

import { useState } from "react";
import { TAG_CATEGORIES, MOOD_TAGS } from "@/lib/predefined-tags";

export default function SuggestPage() {
  const [spotName, setSpotName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [contact, setContact] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const font = '"Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setImages(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) { setError("位置情報が使えません"); return; }
    setIsLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        try {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          if (apiKey) {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ja&key=${apiKey}`
            );
            const data = await res.json();
            const addr = data.results?.[0]?.formatted_address ?? "";
            setAddress(addr);
          }
        } catch {}
        setIsLocating(false);
      },
      () => { setError("位置情報の取得に失敗しました。住所を手入力してください。"); setIsLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!spotName.trim()) { setError("スポット名を入力してください"); return; }
    setIsSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("spotName", spotName.trim());
      fd.append("description", description);
      fd.append("address", address);
      if (lat !== null) fd.append("lat", String(lat));
      if (lng !== null) fd.append("lng", String(lng));
      fd.append("contact", contact);
      fd.append("autoTags", JSON.stringify(selectedTags));
      for (const img of images) fd.append("images", img);

      const res = await fetch("/api/suggestions", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "送信失敗");
      setSubmitted(true);
    } catch (e) {
      setError(String(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf8f9", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: font }}>
        <div style={{ textAlign: "center", maxWidth: "380px" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>🎉</div>
          <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#4a3034", marginBottom: "12px" }}>
            ありがとうございます！
          </h2>
          <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#7a5860", marginBottom: "24px" }}>
            投稿を受け付けました。<br />
            スタッフが確認後、MoodGoに掲載されます。<br />
            掲載された場合はご連絡いたします！
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "14px 36px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #ffbf67 0%, #ff8f7f 100%)",
              color: "#fff",
              fontWeight: 900,
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            トップへ戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f9", padding: "24px 16px", fontFamily: font, color: "#4a3034" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: "24px" }}>
          <a href="/" style={{ fontSize: "13px", color: "#b07080", textDecoration: "none", fontWeight: 700 }}>← トップへ戻る</a>
          <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "12px 0 6px" }}>📍 穴場スポットを教えて！</h1>
          <p style={{ fontSize: "14px", lineHeight: 1.75, color: "#7a5860", margin: 0 }}>
            あなたが知っている素敵な場所をMoodGoに投稿しよう。<br />
            スタッフが確認して掲載された場合は、特典をプレゼント予定です🎁
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", border: "1px solid #f0dfe3", boxShadow: "0 8px 24px rgba(74,48,52,0.07)", marginBottom: "16px" }}>

          {/* スポット名 */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: 800, fontSize: "14px", marginBottom: "8px" }}>
              スポット名 <span style={{ color: "#ff6b6b" }}>*</span>
            </label>
            <input
              type="text"
              value={spotName}
              onChange={(e) => setSpotName(e.target.value)}
              placeholder="例：緑ヶ丘公園の秘密の展望台"
              style={inputStyle}
            />
          </div>

          {/* 説明 */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: 800, fontSize: "14px", marginBottom: "8px" }}>
              どんな場所？おすすめポイント
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例：駐車場が平日2時間無料で、穴場だから空いてる。夕日が最高！"
              rows={4}
              style={{ ...inputStyle, height: "auto", resize: "vertical", padding: "14px 16px" }}
            />
          </div>

          {/* 位置情報 */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: 800, fontSize: "14px", marginBottom: "8px" }}>
              場所・住所
            </label>
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "999px",
                border: "none",
                background: lat ? "#e8f5e9" : "linear-gradient(135deg, #ffbf67 0%, #ff8f7f 100%)",
                color: lat ? "#18794e" : "#fff",
                fontSize: "14px",
                fontWeight: 900,
                cursor: isLocating ? "default" : "pointer",
                marginBottom: "12px",
                opacity: isLocating ? 0.7 : 1,
              }}
            >
              {isLocating ? "取得中..." : lat ? `✅ 位置情報取得済み` : "📍 現在地を自動取得（推奨）"}
            </button>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="または住所・エリア名を入力（例：神奈川県横浜市中区）"
              style={inputStyle}
            />
            {lat && (
              <div style={{ fontSize: "12px", color: "#18794e", marginTop: "6px", fontWeight: 700 }}>
                緯度: {lat.toFixed(5)} / 経度: {lng?.toFixed(5)}
              </div>
            )}
          </div>

          {/* 画像アップロード */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: 800, fontSize: "14px", marginBottom: "8px" }}>
              写真を添付（最大3枚）
            </label>
            <div style={{ fontSize: "12px", color: "#9b7080", marginBottom: "10px", lineHeight: 1.6 }}>
              駐車場の看板、穴場の建物、景色など。雰囲気が伝わる写真を！
            </div>
            <label
              htmlFor="suggest-image-input"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "52px",
                borderRadius: "18px",
                border: "2px dashed #f0c0c8",
                background: "#fffaf8",
                color: "#b07080",
                fontSize: "14px",
                fontWeight: 800,
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              📷 写真を選ぶ
            </label>
            <input
              id="suggest-image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                opacity: 0,
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                pointerEvents: "none",
              }}
            />
            {previews.length > 0 && (
              <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                {previews.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`preview-${i}`}
                    style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "14px", border: "1px solid #f0dfe3" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 気分タグ */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: 800, fontSize: "14px", marginBottom: "6px" }}>
              🏷 気分タグを選ぼう
              <span style={{ fontWeight: 400, fontSize: "12px", color: "#9b7080", marginLeft: "6px" }}>どんな気分の人に合う場所？</span>
            </label>
            <button
              type="button"
              onClick={() => setTagPickerOpen((p) => !p)}
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "16px",
                border: "1px dashed #f0c0c8",
                background: "#fffaf8",
                color: "#b07080",
                fontSize: "14px",
                fontWeight: 800,
                cursor: "pointer",
                marginBottom: "8px",
              }}
            >
              {tagPickerOpen ? "▲ タグ選択を閉じる" : "▼ タグを選ぶ"}
            </button>

            {/* 選択済みタグ */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
              {selectedTags.map((tag, i) => {
                const isMood = MOOD_TAGS.includes(tag);
                return (
                  <span
                    key={i}
                    onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
                    style={{ padding: "4px 10px", borderRadius: "999px", background: isMood ? "#ffe0e8" : "#fff3e6", border: `1px solid ${isMood ? "#ffb0c0" : "#ffd8a8"}`, fontSize: "12px", fontWeight: 700, color: isMood ? "#c0385a" : "#8a4500", cursor: "pointer" }}
                  >
                    {tag} ✕
                  </span>
                );
              })}
              {selectedTags.length === 0 && <span style={{ fontSize: "12px", color: "#b07080" }}>タグ未選択（任意）</span>}
            </div>

            {tagPickerOpen && (
              <div style={{ border: "1px solid #ead7db", borderRadius: "16px", padding: "12px", background: "#fffaf8", maxHeight: "320px", overflowY: "auto" }}>
                {TAG_CATEGORIES.filter((c) => c.key === "mood" || c.key === "companion" || c.key === "scenery" || c.key === "activity" || c.key === "atmosphere").map((cat) => (
                  <div key={cat.key} style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 900, color: cat.key === "mood" ? "#c0385a" : "#6a4a50", marginBottom: "6px" }}>
                      {cat.key === "mood" ? "🎭 " : ""}{cat.label}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {cat.tags.map((tag) => {
                        const selected = selectedTags.includes(tag);
                        return (
                          <span
                            key={tag}
                            onClick={() => setSelectedTags((prev) => selected ? prev.filter((t) => t !== tag) : [...prev, tag])}
                            style={{
                              padding: "3px 9px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              background: selected ? (cat.key === "mood" ? "#ffe0e8" : "#e8f4ff") : "#f0f0f0",
                              border: `1px solid ${selected ? (cat.key === "mood" ? "#ffb0c0" : "#90c0f0") : "#d0d0d0"}`,
                              color: selected ? (cat.key === "mood" ? "#c0385a" : "#1a5080") : "#555",
                            }}
                          >
                            {selected ? "✓ " : ""}{tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 連絡先 */}
          <div style={{ marginBottom: "8px" }}>
            <label style={{ display: "block", fontWeight: 800, fontSize: "14px", marginBottom: "8px" }}>
              連絡先（任意）
            </label>
            <div style={{ fontSize: "12px", color: "#9b7080", marginBottom: "10px", lineHeight: 1.6 }}>
              掲載された場合に特典をお送りするため、LINEのIDやメールアドレスを教えていただけると助かります。
            </div>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="例：@line_id / example@email.com"
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <div style={{ background: "#fff0f2", border: "1px solid #ffc0c8", borderRadius: "14px", padding: "12px 16px", fontSize: "13px", color: "#c0385a", marginBottom: "12px" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !spotName.trim()}
          style={{
            width: "100%",
            height: "56px",
            borderRadius: "999px",
            border: "none",
            background: spotName.trim()
              ? "linear-gradient(135deg, #ffbf67 0%, #ff8f7f 100%)"
              : "#e0d0d4",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 900,
            cursor: spotName.trim() ? "pointer" : "default",
            boxShadow: spotName.trim() ? "0 10px 28px rgba(255,143,127,0.35)" : "none",
            marginBottom: "32px",
          }}
        >
          {isSubmitting ? "送信中..." : "投稿する 🚀"}
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "52px",
  borderRadius: "16px",
  border: "1px solid #ead7db",
  padding: "0 16px",
  fontSize: "15px",
  outline: "none",
  background: "#fffaf8",
  color: "#4a3034",
  boxSizing: "border-box",
  fontFamily: '"Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif',
};
