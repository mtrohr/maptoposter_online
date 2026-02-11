/*
  # Create credit packages table

  1. New Tables
    - `credit_packages`
      - `id` (uuid, primary key)
      - `name` (text) - Package display name
      - `description` (text) - Short description for the pricing card
      - `credits_amount` (integer) - Number of credits in this package
      - `price_cents` (integer) - Price in cents (e.g., 499 = $4.99)
      - `currency` (text, default 'usd')
      - `stripe_price_id` (text) - Stripe Price ID for checkout
      - `is_active` (boolean, default true) - Whether package is available for purchase
      - `sort_order` (integer) - Display ordering
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `credit_packages` table
    - Anyone can read active packages (needed for pricing page)
    - Only admins can manage packages

  3. Seed Data
    - 3 starter packages: Starter (5 credits), Popular (20 credits), Pro (50 credits)
*/

CREATE TABLE IF NOT EXISTS credit_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  credits_amount integer NOT NULL CHECK (credits_amount > 0),
  price_cents integer NOT NULL CHECK (price_cents > 0),
  currency text NOT NULL DEFAULT 'usd',
  stripe_price_id text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active credit packages"
  ON credit_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert credit packages"
  ON credit_packages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update credit packages"
  ON credit_packages FOR UPDATE
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

CREATE POLICY "Admins can delete credit packages"
  ON credit_packages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

INSERT INTO credit_packages (name, description, credits_amount, price_cents, currency, sort_order) VALUES
  ('Starter', '5 poster credits to get started', 5, 499, 'usd', 1),
  ('Popular', '20 poster credits - best value', 20, 1499, 'usd', 2),
  ('Pro', '50 poster credits for power users', 50, 2999, 'usd', 3);
