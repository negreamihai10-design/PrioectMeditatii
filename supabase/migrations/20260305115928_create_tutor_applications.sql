/*
  # Create tutor applications table

  1. New Tables
    - `tutor_applications`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Full name of the applicant
      - `email` (text, not null) - Contact email
      - `phone` (text, not null) - Contact phone number
      - `city` (text, not null) - City where they can teach
      - `bio` (text, not null) - Short biography / introduction
      - `experience` (text, not null) - Years/description of experience
      - `education` (text, not null) - Education background
      - `subject_ids` (uuid[], not null) - Which subjects they want to teach
      - `specialties` (text[], not null) - Their specific specialties
      - `mode` (text, not null) - online / fizic / ambele
      - `session_type` (text, not null) - individual / grup / ambele
      - `price` (text, not null) - Desired price per hour
      - `days` (text[], not null) - Available days
      - `hours` (text[], not null) - Available hour slots
      - `levels` (text[], not null) - Teaching levels
      - `status` (text, not null, default 'pending') - pending / approved / rejected
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on tutor_applications
    - Allow anonymous INSERT (anyone can apply)
    - No SELECT/UPDATE/DELETE for anon (applications are private)

  3. Notes
    - Applications stay in this table until an admin reviews them
    - On approval, a matching row would be created in the tutors table
*/

CREATE TABLE IF NOT EXISTS tutor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  bio text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  education text NOT NULL DEFAULT '',
  subject_ids uuid[] NOT NULL DEFAULT '{}',
  specialties text[] NOT NULL DEFAULT '{}',
  mode text NOT NULL DEFAULT 'ambele',
  session_type text NOT NULL DEFAULT 'individual',
  price text NOT NULL DEFAULT '',
  days text[] NOT NULL DEFAULT '{}',
  hours text[] NOT NULL DEFAULT '{}',
  levels text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tutor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a tutor application"
  ON tutor_applications
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');
