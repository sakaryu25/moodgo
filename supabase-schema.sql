-- ─── MoodGo Supabase スキーマ ──────────────────────────────────────────────
-- Supabase Dashboard の SQL Editor でこのファイルを実行してください
-- https://supabase.com/dashboard → プロジェクト → SQL Editor → New query

-- ── places テーブル（スポット登録）──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS places (
  id               UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  name             TEXT          NOT NULL,
  address          TEXT          NOT NULL,
  nearest_station  TEXT,
  lat              DOUBLE PRECISION,
  lng              DOUBLE PRECISION,
  google_place_id  TEXT,
  tags             TEXT[]        NOT NULL DEFAULT '{}',
  area             TEXT,
  description      TEXT,
  is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── place_photos テーブル（スポット写真）────────────────────────────────────
CREATE TABLE IF NOT EXISTS place_photos (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id     UUID        NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  photo_url    TEXT        NOT NULL,
  storage_path TEXT,
  is_primary   BOOLEAN     DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── インデックス ────────────────────────────────────────────────────────────
-- タグ検索用 GIN インデックス（@> 演算子の高速化に必須）
CREATE INDEX IF NOT EXISTS idx_places_tags     ON places USING GIN(tags);
-- 位置情報検索用
CREATE INDEX IF NOT EXISTS idx_places_location ON places(lat, lng);
-- アクティブフラグ
CREATE INDEX IF NOT EXISTS idx_places_active   ON places(is_active);
-- 写真の place_id 外部キー検索
CREATE INDEX IF NOT EXISTS idx_photos_place_id ON place_photos(place_id);

-- ── updated_at 自動更新トリガー ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_places_updated_at ON places;
CREATE TRIGGER update_places_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── RLS（Row Level Security）設定 ──────────────────────────────────────────
-- Service Key（サーバーサイド）は RLS をバイパスするため、
-- 読み取り専用のポリシーのみ設定（フロントから直接参照する場合）
ALTER TABLE places       ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_photos ENABLE ROW LEVEL SECURITY;

-- 全ユーザーに読み取りを許可（is_active=true のみ）
CREATE POLICY IF NOT EXISTS "places_read_active"
  ON places FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "photos_read_all"
  ON place_photos FOR SELECT USING (true);

-- ── サンプルデータ（動作確認用）────────────────────────────────────────────
-- 以下のINSERT文をテスト用に使用してください（必要に応じて変更）
/*
INSERT INTO places (name, address, nearest_station, lat, lng, tags, area, description)
VALUES (
  '鳥貴族 渋谷道玄坂店',
  '東京都渋谷区道玄坂1-6-8',
  '渋谷駅から徒歩5分',
  35.6592,
  139.6983,
  ARRAY['#お腹すいた', '#居酒屋', '#焼き鳥_串焼き', '#大衆酒場_コスパ重視', '#友達向け'],
  '東京・渋谷',
  '全品298円均一の人気焼き鳥チェーン。コスパ重視で楽しみたい人に最適。'
);
*/
