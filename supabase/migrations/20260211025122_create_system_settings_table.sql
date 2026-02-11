/*
  # Create system settings table for global configuration

  1. New Tables
    - `system_settings`
      - `key` (text, primary key) - Setting identifier
      - `value` (jsonb) - Setting value (flexible JSON structure)
      - `updated_by` (uuid, references profiles) - Last admin who edited
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `system_settings` table
    - Authenticated users can read settings (some needed for frontend behavior)
    - Only admins can update settings

  3. Seed Data
    - max_concurrent_jobs: 3 (worker concurrency limit)
    - maintenance_mode: false
    - max_dimension_inches: 20
    - default_distance: 18000
    - welcome_credits: 2 (free credits for new signups)
    - max_jobs_per_user_concurrent: 3
*/

CREATE TABLE IF NOT EXISTS system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update settings"
  ON system_settings FOR UPDATE
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

CREATE POLICY "Admins can insert settings"
  ON system_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

INSERT INTO system_settings (key, value) VALUES
  ('max_concurrent_jobs', '3'),
  ('maintenance_mode', 'false'),
  ('max_dimension_inches', '20'),
  ('default_distance', '18000'),
  ('welcome_credits', '2'),
  ('max_jobs_per_user_concurrent', '3');
