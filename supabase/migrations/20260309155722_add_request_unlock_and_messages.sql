/*
  # Add request unlock system and messages table

  1. Modified Tables
    - `tutor_requests`
      - `unlocked` (boolean, default false) - whether the tutor has spent credits to unlock this request

  2. New Tables
    - `request_messages`
      - `id` (uuid, primary key)
      - `request_id` (uuid, FK to tutor_requests)
      - `sender_id` (uuid, FK to auth.users)
      - `sender_role` (text: 'tutor' or 'student')
      - `body` (text) - the message content
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on `request_messages`
    - Tutors can read/insert messages on requests they own (and that are unlocked)
    - Students can read/insert messages on requests they created (and that are unlocked)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor_requests' AND column_name = 'unlocked'
  ) THEN
    ALTER TABLE tutor_requests ADD COLUMN unlocked boolean DEFAULT false NOT NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS request_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES tutor_requests(id),
  sender_id uuid NOT NULL REFERENCES auth.users(id),
  sender_role text NOT NULL DEFAULT 'student',
  body text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE request_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can read messages on their requests"
  ON request_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tutor_requests tr
      WHERE tr.id = request_messages.request_id
      AND tr.tutor_id = auth.uid()
      AND tr.unlocked = true
    )
  );

CREATE POLICY "Students can read messages on their requests"
  ON request_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tutor_requests tr
      WHERE tr.id = request_messages.request_id
      AND tr.student_id = auth.uid()
      AND tr.unlocked = true
    )
  );

CREATE POLICY "Tutors can insert messages on their unlocked requests"
  ON request_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND sender_role = 'tutor'
    AND EXISTS (
      SELECT 1 FROM tutor_requests tr
      WHERE tr.id = request_messages.request_id
      AND tr.tutor_id = auth.uid()
      AND tr.unlocked = true
    )
  );

CREATE POLICY "Students can insert messages on their unlocked requests"
  ON request_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND sender_role = 'student'
    AND EXISTS (
      SELECT 1 FROM tutor_requests tr
      WHERE tr.id = request_messages.request_id
      AND tr.student_id = auth.uid()
      AND tr.unlocked = true
    )
  );
