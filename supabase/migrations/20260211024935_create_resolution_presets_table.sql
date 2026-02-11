/*
  # Create resolution presets table and seed with standard sizes

  1. New Tables
    - `resolution_presets`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Internal identifier
      - `label` (text) - Display label for UI
      - `width_inches` (numeric) - Width in inches for the poster generator
      - `height_inches` (numeric) - Height in inches for the poster generator
      - `pixel_width` (integer) - Calculated pixel width at 300 DPI
      - `pixel_height` (integer) - Calculated pixel height at 300 DPI
      - `category` (text) - Grouping category (print, digital, social)
      - `sort_order` (integer) - Display ordering
      - `is_active` (boolean, default true) - Whether preset is shown to users

  2. Security
    - Enable RLS on `resolution_presets` table
    - Anyone can read active presets
    - Only admins can manage presets

  3. Seed Data
    - 6 presets: Default Poster, A4 Print, 4K Wallpaper, HD Wallpaper,
      Mobile Wallpaper, Instagram Post
*/

CREATE TABLE IF NOT EXISTS resolution_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  label text NOT NULL,
  width_inches numeric NOT NULL CHECK (width_inches > 0 AND width_inches <= 20),
  height_inches numeric NOT NULL CHECK (height_inches > 0 AND height_inches <= 20),
  pixel_width integer NOT NULL,
  pixel_height integer NOT NULL,
  category text NOT NULL DEFAULT 'digital' CHECK (category IN ('print', 'digital', 'social')),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE resolution_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active resolution presets"
  ON resolution_presets FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert resolution presets"
  ON resolution_presets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update resolution presets"
  ON resolution_presets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete resolution presets"
  ON resolution_presets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

INSERT INTO resolution_presets (name, label, width_inches, height_inches, pixel_width, pixel_height, category, sort_order) VALUES
  ('default_poster', 'Default Poster (12x16")', 12, 16, 3600, 4800, 'print', 1),
  ('a4_print', 'A4 Print', 8.3, 11.7, 2490, 3510, 'print', 2),
  ('4k_wallpaper', '4K Wallpaper', 12.8, 7.2, 3840, 2160, 'digital', 3),
  ('hd_wallpaper', 'HD Wallpaper', 6.4, 3.6, 1920, 1080, 'digital', 4),
  ('mobile_wallpaper', 'Mobile Wallpaper', 3.6, 6.4, 1080, 1920, 'digital', 5),
  ('instagram_post', 'Instagram Post', 3.6, 3.6, 1080, 1080, 'social', 6);
