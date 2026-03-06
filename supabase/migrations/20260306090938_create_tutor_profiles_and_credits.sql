/*
  # Create tutor profiles and credits system

  1. New Tables
    - `tutor_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text) - Full name
      - `email` (text) - Email address
      - `phone` (text) - Phone number
      - `city` (text) - City
      - `bio` (text) - About text
      - `experience` (text) - Teaching experience
      - `education` (text) - Education background
      - `avatar_url` (text) - Profile picture URL
      - `subject_ids` (uuid[]) - Subject IDs they teach
      - `specialties` (text[]) - Specializations
      - `mode` (text) - online/fizic/ambele
      - `session_type` (text) - individual/grup/ambele
      - `price` (text) - Price per hour
      - `days` (text[]) - Available days
      - `hours` (text[]) - Available hours
      - `levels` (text[]) - Teaching levels
      - `created_at` (timestamptz)

    - `credits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (integer) - Number of credits in transaction
      - `type` (text) - 'purchase' or 'usage'
      - `description` (text) - What the credits were for
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Tutor profiles: tutors can read/insert/update own profile
    - Credits: users can read own credits, insert own credits (purchase)

  3. Notes
    - tutor_profiles.id references auth.users so each profile is linked to an auth account
    - Credits table tracks both purchases and usage as separate rows
*/

CREATE TABLE IF NOT EXISTS tutor_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  education text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  subject_ids uuid[] NOT NULL DEFAULT '{}',
  specialties text[] NOT NULL DEFAULT '{}',
  mode text NOT NULL DEFAULT 'ambele',
  session_type text NOT NULL DEFAULT 'individual',
  price text NOT NULL DEFAULT '',
  days text[] NOT NULL DEFAULT '{}',
  hours text[] NOT NULL DEFAULT '{}',
  levels text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can read own profile"
  ON tutor_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Tutors can insert own profile"
  ON tutor_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Tutors can update own profile"
  ON tutor_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


CREATE TABLE IF NOT EXISTS credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  amount integer NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'purchase',
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credits"
  ON credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits"
  ON credits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
