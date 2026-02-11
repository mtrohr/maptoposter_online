/*
  # Create storage buckets for poster files and thumbnails

  1. Storage Buckets
    - `posters` - Private bucket for full-resolution generated poster files
    - `thumbnails` - Private bucket for lower-resolution preview images

  2. Storage Policies
    - Users can read files in their own user-id-prefixed path
    - Admins can read all files
    - Service role handles all uploads (from the worker)

  3. File Naming Convention
    - Posters: {user_id}/{job_id}.{format}
    - Thumbnails: {user_id}/{job_id}_thumb.png
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('posters', 'posters', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can read own poster files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'posters'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read own thumbnail files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'thumbnails'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can read all poster files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'posters'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can read all thumbnail files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'thumbnails'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
