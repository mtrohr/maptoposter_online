/*
  # Create pricing configuration table

  1. New Tables
    - `pricing_config`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Configuration identifier (single row: 'default')
      - `base_credits_per_job` (integer) - Base credit cost for a standard poster
      - `format_multipliers` (jsonb) - Multipliers by output format (png, svg, pdf)
      - `resolution_multipliers` (jsonb) - Multipliers by resolution tier
      - `distance_multipliers` (jsonb) - Multipliers by map distance range
      - `updated_by` (uuid, references profiles) - Last admin who edited
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `pricing_config` table
    - Anyone can read pricing config (needed for cost previews)
    - Only admins can update pricing

  3. Seed Data
    - Default pricing: 1 credit base cost, format and resolution multipliers
*/

CREATE TABLE IF NOT EXISTS pricing_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  base_credits_per_job integer NOT NULL DEFAULT 1,
  format_multipliers jsonb NOT NULL DEFAULT '{"png": 1, "svg": 2, "pdf": 2}',
  resolution_multipliers jsonb NOT NULL DEFAULT '{"small": 1, "medium": 1, "large": 1.5, "xl": 2}',
  distance_multipliers jsonb NOT NULL DEFAULT '{"small": 1, "medium": 1, "large": 1}',
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read pricing config"
  ON pricing_config FOR SELECT
  USING (true);

CREATE POLICY "Admins can update pricing config"
  ON pricing_config FOR UPDATE
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

INSERT INTO pricing_config (key, base_credits_per_job, format_multipliers, resolution_multipliers, distance_multipliers)
VALUES (
  'default',
  1,
  '{"png": 1, "svg": 2, "pdf": 2}',
  '{"small": 1, "medium": 1, "large": 1.5, "xl": 2}',
  '{"small": 1, "medium": 1, "large": 1}'
);
