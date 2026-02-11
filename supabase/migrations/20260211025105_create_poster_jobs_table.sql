/*
  # Create poster jobs table for tracking map poster generation requests

  1. New Tables
    - `poster_jobs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles) - The user who requested the poster
      - `status` (text, default 'queued') - Job lifecycle: queued, processing, completed, failed
      - `city` (text) - City name for geocoding
      - `country` (text) - Country name for geocoding
      - `display_city` (text) - Optional custom display name for city label
      - `display_country` (text) - Optional custom display name for country label
      - `theme_slug` (text) - Theme identifier matching themes table slug
      - `distance` (integer, default 18000) - Map radius in meters
      - `width_inches` (numeric, default 12) - Poster width in inches
      - `height_inches` (numeric, default 16) - Poster height in inches
      - `output_format` (text, default 'png') - Output file format
      - `font_family` (text) - Optional Google Fonts family name
      - `latitude` (numeric) - Optional latitude override
      - `longitude` (numeric) - Optional longitude override
      - `credits_cost` (integer) - Credits charged for this job
      - `file_path` (text) - Supabase Storage path to the generated poster
      - `thumbnail_path` (text) - Supabase Storage path to the thumbnail
      - `error_message` (text) - Error details if job failed
      - `created_at` (timestamptz) - When the job was submitted
      - `started_at` (timestamptz) - When the worker picked up the job
      - `completed_at` (timestamptz) - When the job finished (success or failure)

  2. Security
    - Enable RLS on `poster_jobs` table
    - Users can read their own jobs
    - Admins can read all jobs
    - No direct client inserts/updates (service role via Edge Functions and worker only)

  3. Indexes
    - user_id for dashboard queries
    - status for worker polling
    - created_at for ordering
*/

CREATE TABLE IF NOT EXISTS poster_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  city text NOT NULL,
  country text NOT NULL,
  display_city text DEFAULT '',
  display_country text DEFAULT '',
  theme_slug text NOT NULL DEFAULT 'terracotta',
  distance integer NOT NULL DEFAULT 18000 CHECK (distance >= 1000 AND distance <= 50000),
  width_inches numeric NOT NULL DEFAULT 12 CHECK (width_inches > 0 AND width_inches <= 20),
  height_inches numeric NOT NULL DEFAULT 16 CHECK (height_inches > 0 AND height_inches <= 20),
  output_format text NOT NULL DEFAULT 'png' CHECK (output_format IN ('png', 'svg', 'pdf')),
  font_family text DEFAULT '',
  latitude numeric,
  longitude numeric,
  credits_cost integer NOT NULL DEFAULT 1 CHECK (credits_cost >= 0),
  file_path text DEFAULT '',
  thumbnail_path text DEFAULT '',
  error_message text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

CREATE INDEX idx_poster_jobs_user_id ON poster_jobs(user_id);
CREATE INDEX idx_poster_jobs_status ON poster_jobs(status);
CREATE INDEX idx_poster_jobs_created_at ON poster_jobs(created_at DESC);

ALTER TABLE poster_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own jobs"
  ON poster_jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all jobs"
  ON poster_jobs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
