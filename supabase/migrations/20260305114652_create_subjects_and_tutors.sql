/*
  # Create subjects and tutors tables

  1. New Tables
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null) - Subject name (e.g. "Matematica")
      - `slug` (text, unique, not null) - URL-friendly identifier
      - `description` (text, not null) - Short description for card views
      - `long_description` (text, not null) - Detailed description for detail pages
      - `levels` (text[], not null) - Array of level labels
      - `color` (text, not null) - Tailwind gradient class
      - `icon` (text, not null) - Lucide icon name
      - `created_at` (timestamptz)

    - `tutors`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Tutor display name
      - `bio` (text, not null) - Short biography
      - `experience` (text, not null) - Experience description
      - `location` (text, not null) - Location display string
      - `city` (text, not null) - City for filtering
      - `rating` (numeric, not null) - Average rating (0-5)
      - `reviews` (integer, not null, default 0) - Number of reviews
      - `image` (text, not null) - Profile image URL
      - `specialties` (text[], not null) - Array of specialties
      - `price` (text, not null) - Price display string
      - `mode` (text, not null) - Session mode: online/fizic/ambele
      - `days` (text[], not null) - Available days
      - `hours` (text[], not null) - Available hour slots
      - `levels` (text[], not null) - Teaching levels
      - `session_type` (text, not null) - individual/grup/ambele
      - `is_featured` (boolean, default false) - Show on homepage
      - `created_at` (timestamptz)

    - `tutor_subjects` (junction table)
      - `tutor_id` (uuid, FK to tutors)
      - `subject_id` (uuid, FK to subjects)
      - Primary key on (tutor_id, subject_id)

  2. Security
    - Enable RLS on all tables
    - Add SELECT policy for anonymous users on all three tables (public data)
    - No INSERT/UPDATE/DELETE for anon users

  3. Indexes
    - Index on subjects.slug for fast lookups
    - Index on tutors.city and tutors.mode for filtering
    - Index on tutors.is_featured for homepage queries
*/

CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  long_description text NOT NULL,
  levels text[] NOT NULL DEFAULT '{}',
  color text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read subjects"
  ON subjects
  FOR SELECT
  TO anon
  USING (name IS NOT NULL);

CREATE TABLE IF NOT EXISTS tutors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  rating numeric NOT NULL DEFAULT 0,
  reviews integer NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT '',
  specialties text[] NOT NULL DEFAULT '{}',
  price text NOT NULL DEFAULT '',
  mode text NOT NULL DEFAULT 'online',
  days text[] NOT NULL DEFAULT '{}',
  hours text[] NOT NULL DEFAULT '{}',
  levels text[] NOT NULL DEFAULT '{}',
  session_type text NOT NULL DEFAULT 'individual',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tutors"
  ON tutors
  FOR SELECT
  TO anon
  USING (name IS NOT NULL);

CREATE TABLE IF NOT EXISTS tutor_subjects (
  tutor_id uuid NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (tutor_id, subject_id)
);

ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tutor_subjects"
  ON tutor_subjects
  FOR SELECT
  TO anon
  USING (tutor_id IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_subjects_slug ON subjects(slug);
CREATE INDEX IF NOT EXISTS idx_tutors_city ON tutors(city);
CREATE INDEX IF NOT EXISTS idx_tutors_mode ON tutors(mode);
CREATE INDEX IF NOT EXISTS idx_tutors_featured ON tutors(is_featured) WHERE is_featured = true;
