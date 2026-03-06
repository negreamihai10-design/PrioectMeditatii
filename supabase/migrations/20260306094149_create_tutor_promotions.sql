/*
  # Create tutor promotions system

  1. New Tables
    - `tutor_promotions`
      - `id` (uuid, primary key)
      - `tutor_id` (uuid, references auth.users)
      - `package_type` (text) - 'visibility' / 'highlight' / 'premium'
      - `credits_spent` (integer) - number of credits used
      - `starts_at` (timestamptz) - when the promotion starts
      - `ends_at` (timestamptz) - when the promotion expires
      - `is_active` (boolean) - whether the promotion is currently active
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `tutor_promotions` table
    - Tutors can read their own promotions
    - Tutors can insert their own promotions

  3. Notes
    - Three package types: visibility (50 credits, 7 days), highlight (100 credits, 14 days), premium (200 credits, 30 days)
    - Promotions determine tutor ranking in the list
*/

CREATE TABLE IF NOT EXISTS tutor_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES auth.users(id),
  package_type text NOT NULL DEFAULT 'visibility',
  credits_spent integer NOT NULL DEFAULT 0,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tutor_promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can read own promotions"
  ON tutor_promotions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can insert own promotions"
  ON tutor_promotions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update own promotions"
  ON tutor_promotions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = tutor_id)
  WITH CHECK (auth.uid() = tutor_id);
