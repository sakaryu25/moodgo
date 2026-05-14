"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type RecommendedItem = {
  name: string;
  description?: string;
  price?: string;
  image_url?: string;
};

type FeaturedPage = {
  id: string;
  slug: string;
  partner_name: string;
  spot_name: string;
  catch_copy?: string;
  description?: string;
  access?: string;
  address?: string;
  lat?: number;
  lng?: number;
  phone?: string;
  website?: string;
  instagram?: string;
  business_hours?: string;
  recommended_items: RecommendedItem[];
  features: string[];
  congestion_info?: string;
  cover_image_url?: string;
  gallery_image_urls: string[];
  tags: string[];
  is_published: boolean;
};

const font = '"Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif';

export default function FeaturePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [page, setPage] = useState<FeaturedPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/featured/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok || !d.data?.is_published) {
          setNotFound(true);
        } else {
          setPage(d.data);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff9f5", fontFamily: font }}>
        <div style={{ fontSize: "18px", color: "#c0385a", opacity: 0.7 }}>読み込み中...</div>
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fff9f5", fontFamily: font, gap: "16px" }}>
        <div style={{ fontSize: "48px" }}>🔍</div>
        <div style={{ fontSize: "20px", fontWeight: 800, color: "#4a3034" }}>ページが見つかりません</div>
        <div style={{ fontSize: "14px", color: "#888" }}>このURLは存在しないか、現在非公開です</div>
        <a href="/" style={{ marginTop: "8px", padding: "12px 28px", background: "linear-gradient(135deg, #ffbf67, #ff8f7f)", color: "#fff", borderRadius: "999px", fontWeight: 800, textDecoration: "none", fontSize: "15px" }}>
          MoodGoトップへ
        </a>
      </div>
    );
  }

  const allGalleryImages = [
    ...(page.cover_image_url ? [page.cover_image_url] : []),
    ...page.gallery_image_urls,
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff9f5", fontFamily: font }}>

      {/* ─── MoodGoヘッダー ─── */}
      <header style={{ background: "linear-gradient(135deg, #ffbf67 0%, #ff8f7f 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>MoodGo</span>
        </a>
        <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px" }}>
          ⭐ 特集
        </span>
      </header>

      {/* ─── カバー画像 ─── */}
      {page.cover_image_url && (
        <div style={{ width: "100%", maxHeight: "420px", overflow: "hidden", position: "relative" }}>
          <img
            src={page.cover_image_url}
            alt={page.spot_name}
            style={{ width: "100%", height: "420px", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
            padding: "32px 24px 24px",
          }}>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", marginBottom: "6px" }}>{page.partner_name} 特集</div>
            <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 900, margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{page.spot_name}</h1>
            {page.catch_copy && (
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "15px", margin: "8px 0 0", fontWeight: 600 }}>{page.catch_copy}</p>
            )}
          </div>
        </div>
      )}

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 16px 80px" }}>

        {/* カバー画像がない場合のタイトル */}
        {!page.cover_image_url && (
          <div style={{ padding: "32px 0 16px" }}>
            <div style={{ color: "#ff8f7f", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>⭐ {page.partner_name} 特集</div>
            <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#4a3034", margin: "0 0 8px" }}>{page.spot_name}</h1>
            {page.catch_copy && (
              <p style={{ fontSize: "16px", color: "#666", margin: 0 }}>{page.catch_copy}</p>
            )}
          </div>
        )}

        {/* ─── タグ ─── */}
        {page.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "20px 0 0" }}>
            {page.tags.map((tag, i) => (
              <span key={i} style={{ background: "#fff3e0", color: "#e65100", fontSize: "12px", fontWeight: 700, padding: "5px 12px", borderRadius: "999px" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ─── 説明 ─── */}
        {page.description && (
          <section style={{ marginTop: "28px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#4a3034", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
              📖 このスポットについて
            </h2>
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 2px 12px rgba(74,48,52,0.08)",
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#333",
              whiteSpace: "pre-wrap",
            }}>
              {page.description}
            </div>
          </section>
        )}

        {/* ─── 特徴 ─── */}
        {page.features.length > 0 && (
          <section style={{ marginTop: "28px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#4a3034", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
              ✨ 特徴・こだわり
            </h2>
            <div style={{ display: "grid", gap: "10px" }}>
              {page.features.map((f, i) => (
                <div key={i} style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  boxShadow: "0 2px 8px rgba(74,48,52,0.07)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "14px",
                  color: "#4a3034",
                  fontWeight: 600,
                }}>
                  <span style={{ color: "#ff8f7f", fontSize: "18px" }}>◆</span>
                  {f}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── おすすめ商品 ─── */}
        {page.recommended_items.length > 0 && (
          <section style={{ marginTop: "28px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#4a3034", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
              🛍 おすすめ商品・メニュー
            </h2>
            <div style={{ display: "grid", gap: "14px" }}>
              {page.recommended_items.map((item, i) => (
                <div key={i} style={{
                  background: "#fff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(74,48,52,0.08)",
                  display: "flex",
                  gap: "0",
                }}>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ width: "110px", minHeight: "110px", objectFit: "cover", flexShrink: 0 }}
                    />
                  )}
                  <div style={{ padding: "16px", flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: "15px", color: "#4a3034", marginBottom: "6px" }}>{item.name}</div>
                    {item.description && (
                      <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, marginBottom: "8px" }}>{item.description}</div>
                    )}
                    {item.price && (
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#ff8f7f" }}>{item.price}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 混雑状況 ─── */}
        {page.congestion_info && (
          <section style={{ marginTop: "28px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#4a3034", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
              🕐 混雑状況
            </h2>
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 2px 12px rgba(74,48,52,0.08)",
              fontSize: "14px",
              lineHeight: 1.8,
              color: "#333",
              whiteSpace: "pre-wrap",
            }}>
              {page.congestion_info}
            </div>
          </section>
        )}

        {/* ─── ギャラリー ─── */}
        {page.gallery_image_urls.length > 0 && (
          <section style={{ marginTop: "28px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#4a3034", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
              📸 ギャラリー
            </h2>
            <div style={{
              position: "relative",
              background: "#000",
              borderRadius: "16px",
              overflow: "hidden",
              aspectRatio: "16/9",
            }}>
              <img
                src={allGalleryImages[galleryIndex] ?? page.gallery_image_urls[0]}
                alt={`ギャラリー ${galleryIndex + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {allGalleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setGalleryIndex((galleryIndex - 1 + allGalleryImages.length) % allGalleryImages.length)}
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: "36px", height: "36px", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >‹</button>
                  <button
                    onClick={() => setGalleryIndex((galleryIndex + 1) % allGalleryImages.length)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: "36px", height: "36px", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >›</button>
                  <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: "12px", padding: "4px 10px", borderRadius: "999px" }}>
                    {galleryIndex + 1} / {allGalleryImages.length}
                  </div>
                </>
              )}
            </div>
            {/* サムネイル */}
            <div style={{ display: "flex", gap: "8px", marginTop: "10px", overflowX: "auto", paddingBottom: "4px" }}>
              {allGalleryImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`サムネイル ${i + 1}`}
                  onClick={() => setGalleryIndex(i)}
                  style={{
                    width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px", cursor: "pointer", flexShrink: 0,
                    border: i === galleryIndex ? "3px solid #ff8f7f" : "3px solid transparent",
                    opacity: i === galleryIndex ? 1 : 0.7,
                    transition: "opacity 0.2s",
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── アクセス情報 ─── */}
        <section style={{ marginTop: "28px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#4a3034", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
            🗺 アクセス・基本情報
          </h2>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(74,48,52,0.08)", display: "grid", gap: "14px" }}>
            {page.address && (
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>📍</span>
                <div>
                  <div style={{ fontSize: "12px", color: "#999", marginBottom: "2px" }}>住所</div>
                  <div style={{ fontSize: "14px", color: "#333", fontWeight: 600 }}>{page.address}</div>
                  {page.lat && page.lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${page.lat},${page.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "13px", color: "#ff8f7f", fontWeight: 700, textDecoration: "none", display: "inline-block", marginTop: "4px" }}
                    >
                      🗺 Googleマップで開く →
                    </a>
                  )}
                </div>
              </div>
            )}
            {page.access && (
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>🚉</span>
                <div>
                  <div style={{ fontSize: "12px", color: "#999", marginBottom: "2px" }}>アクセス</div>
                  <div style={{ fontSize: "14px", color: "#333", whiteSpace: "pre-wrap" }}>{page.access}</div>
                </div>
              </div>
            )}
            {page.business_hours && (
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>🕐</span>
                <div>
                  <div style={{ fontSize: "12px", color: "#999", marginBottom: "2px" }}>営業時間</div>
                  <div style={{ fontSize: "14px", color: "#333", whiteSpace: "pre-wrap" }}>{page.business_hours}</div>
                </div>
              </div>
            )}
            {page.phone && (
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>📞</span>
                <div>
                  <div style={{ fontSize: "12px", color: "#999", marginBottom: "2px" }}>電話番号</div>
                  <a href={`tel:${page.phone}`} style={{ fontSize: "14px", color: "#333", fontWeight: 600, textDecoration: "none" }}>{page.phone}</a>
                </div>
              </div>
            )}
            {page.website && (
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>🌐</span>
                <div>
                  <div style={{ fontSize: "12px", color: "#999", marginBottom: "2px" }}>ウェブサイト</div>
                  <a href={page.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px", color: "#ff8f7f", fontWeight: 700, textDecoration: "none" }}>
                    {page.website}
                  </a>
                </div>
              </div>
            )}
            {page.instagram && (
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>📷</span>
                <div>
                  <div style={{ fontSize: "12px", color: "#999", marginBottom: "2px" }}>Instagram</div>
                  <a
                    href={page.instagram.startsWith("http") ? page.instagram : `https://instagram.com/${page.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "14px", color: "#ff8f7f", fontWeight: 700, textDecoration: "none" }}
                  >
                    {page.instagram.startsWith("@") ? page.instagram : `@${page.instagram}`}
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── MoodGoリンク ─── */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "16px 36px",
              background: "linear-gradient(135deg, #ffbf67 0%, #ff8f7f 100%)",
              color: "#fff",
              borderRadius: "999px",
              fontWeight: 900,
              fontSize: "16px",
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(255,143,127,0.35)",
            }}
          >
            気分で行き先を探す →
          </a>
          <div style={{ marginTop: "12px", fontSize: "12px", color: "#aaa" }}>Powered by MoodGo</div>
        </div>
      </div>
    </div>
  );
}
