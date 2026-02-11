/*
  # Create payments table for Stripe payment records

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles) - The user who made the payment
      - `credit_package_id` (uuid, references credit_packages) - The package purchased
      - `stripe_session_id` (text) - Stripe Checkout Session ID for idempotency
      - `stripe_payment_intent_id` (text) - Stripe PaymentIntent ID
      - `amount_cents` (integer) - Amount charged in cents
      - `currency` (text, default 'usd')
      - `status` (text) - Payment status: pending, completed, failed, refunded
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `payments` table
    - Users can read their own payments
    - Admins can read all payments
    - No direct client inserts/updates (service role via Edge Functions only)
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  credit_package_id uuid NOT NULL REFERENCES credit_packages(id),
  stripe_session_id text DEFAULT '',
  stripe_payment_intent_id text DEFAULT '',
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_session_id ON payments(stripe_session_id);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
