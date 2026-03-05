/*
  # Create student profiles table

  1. New Tables
    - `students`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text, not null) - Full name
      - `email` (text, not null) - Email address
      - `phone` (text, not null) - Phone number
      - `city` (text, not null) - City
      - `level` (text, not null) - Current education level
      - `interests` (text[], default '{}') - Subjects of interest
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on students table
    - Students can read their own profile
    - Students can insert their own profile (on registration)
    - Students can update their own profile

  3. Notes
    - The id column references auth.users(id) so each student
      profile is linked to a Supabase auth user
    - Students register with email/password via Supabase Auth, then
      their profile data is stored in this table
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  level text NOT NULL DEFAULT '',
  interests text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own profile"
  ON students
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Students can insert own profile"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can update own profile"
  ON students
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
