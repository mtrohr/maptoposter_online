/*
  # Create credit transactions table (immutable ledger)

  1. New Tables
    - `credit_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles) - The user whose balance changed
      - `amount` (integer) - Positive for credits added, negative for credits spent
      - `type` (text) - Transaction type: purchase, usage, refund, admin_adjustment
      - `description` (text) - Human-readable reason for the transaction
      - `reference_id` (uuid) - Optional reference to related record (job_id, payment_id, etc.)
      - `balance_after` (integer) - User's credit balance after this transaction
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `credit_transactions` table
    - Users can read their own transactions
    - Admins can read all transactions
    - No direct inserts/updates/deletes from client (service role only via Edge Functions)

  3. Notes
    - This table is append-only by design. No update or delete policies exist.
    - All inserts happen through Edge Functions using the service role key.
*/

CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  type text NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'admin_adjustment')),
  description text NOT NULL DEFAULT '',
  reference_id uuid,
  balance_after integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON credit_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all transactions"
  ON credit_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
