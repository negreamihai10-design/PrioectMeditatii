/*
  # Add authenticated access policies for tutors, subjects, and tutor_subjects

  1. Security Changes
    - Add SELECT policy for authenticated users on `subjects` table
    - Add SELECT policy for authenticated users on `tutors` table
    - Add SELECT policy for authenticated users on `tutor_subjects` table
    - Add INSERT policy for authenticated users on `tutors` table (own records only)
    - Add INSERT policy for authenticated users on `tutor_subjects` table (own records only)

  2. Notes
    - Authenticated users need to read subjects during registration and browsing
    - Authenticated users need to read tutors for browsing the platform
    - INSERT on tutors is restricted so that newly registered tutors can only create their own record
    - INSERT on tutor_subjects is restricted so tutors can only link their own tutor ID
*/

CREATE POLICY "Authenticated can read subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (name IS NOT NULL);

CREATE POLICY "Authenticated can read tutors"
  ON tutors
  FOR SELECT
  TO authenticated
  USING (name IS NOT NULL);

CREATE POLICY "Authenticated can read tutor_subjects"
  ON tutor_subjects
  FOR SELECT
  TO authenticated
  USING (tutor_id IS NOT NULL);

CREATE POLICY "Authenticated can insert own tutor record"
  ON tutors
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Authenticated can update own tutor record"
  ON tutors
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Authenticated can insert own tutor_subjects"
  ON tutor_subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (tutor_id = auth.uid());
