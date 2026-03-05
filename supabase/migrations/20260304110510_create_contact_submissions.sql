/*
  # Create contact_submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key, auto-generated)
      - `name` (text, not null) - Name of the person submitting
      - `email` (text, not null) - Contact email
      - `phone` (text, nullable) - Optional phone number
      - `subject` (text, nullable) - Subject they are interested in
      - `message` (text, not null) - The inquiry message
      - `created_at` (timestamptz, default now()) - Submission timestamp

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add INSERT policy for anonymous users (public form)
    - No SELECT/UPDATE/DELETE policies for anon (submissions are admin-only readable)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL AND
    email IS NOT NULL AND
    message IS NOT NULL
  );
