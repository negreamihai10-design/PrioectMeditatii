/*
  # Allow tutors to delete requests sent to them

  1. Security
    - Add DELETE policy on `tutor_requests` so tutors can remove requests addressed to them
    - Also cascade-delete related messages in `request_messages` via a trigger
*/

CREATE POLICY "Tutors can delete requests sent to them"
  ON tutor_requests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = tutor_id);

CREATE OR REPLACE FUNCTION delete_request_messages()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM request_messages WHERE request_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_delete_request_messages'
  ) THEN
    CREATE TRIGGER trg_delete_request_messages
      BEFORE DELETE ON tutor_requests
      FOR EACH ROW
      EXECUTE FUNCTION delete_request_messages();
  END IF;
END $$;
