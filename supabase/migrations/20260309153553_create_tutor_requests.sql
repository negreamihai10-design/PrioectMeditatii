/*
  # Create tutor_requests table for student-to-tutor messaging

  1. New Tables
    - `tutor_requests`
      - `id` (uuid, primary key) - unique request identifier
      - `student_id` (uuid, FK to auth.users) - the student who sent the request
      - `tutor_id` (uuid, FK to tutors) - the tutor receiving the request
      - `subject_id` (uuid, FK to subjects) - which subject the student needs help with
      - `student_name` (text) - student display name
      - `student_email` (text) - student contact email
      - `message` (text) - the student's message describing their needs
      - `status` (text) - request status: pending, accepted, declined
      - `tutor_reply` (text) - optional reply from the tutor
      - `created_at` (timestamptz) - when the request was created
      - `updated_at` (timestamptz) - when the request was last updated

  2. Security
    - Enable RLS on `tutor_requests` table
    - Students can insert their own requests
    - Students can read their own requests
    - Tutors can read requests sent to them
    - Tutors can update requests sent to them (to reply / accept / decline)
*/

CREATE TABLE IF NOT EXISTS tutor_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id),
  tutor_id uuid NOT NULL REFERENCES tutors(id),
  subject_id uuid NOT NULL REFERENCES subjects(id),
  student_name text NOT NULL DEFAULT '',
  student_email text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  tutor_reply text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tutor_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can insert own requests"
  ON tutor_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can read own requests"
  ON tutor_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Tutors can read requests sent to them"
  ON tutor_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update requests sent to them"
  ON tutor_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = tutor_id)
  WITH CHECK (auth.uid() = tutor_id);
