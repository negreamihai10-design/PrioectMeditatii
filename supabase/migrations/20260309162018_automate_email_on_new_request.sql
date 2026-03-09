/*
  # Automate email notification when a student creates a request

  1. Extensions
    - Enable `pg_net` for making async HTTP calls from database triggers

  2. Functions
    - Create `notify_tutor_on_new_request()` trigger function
    - Calls the `send-student-request` edge function via HTTP POST
    - Passes the new request ID so the edge function fetches all details server-side

  3. Triggers
    - Add AFTER INSERT trigger on `tutor_requests` table
    - Fires automatically every time a student submits a new request
    - Ensures the professor always receives an email regardless of frontend behavior
*/

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION notify_tutor_on_new_request()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url text;
  service_role_key text;
BEGIN
  edge_function_url := rtrim(current_setting('app.settings.supabase_url', true), '/') 
    || '/functions/v1/send-student-request';

  service_role_key := current_setting('app.settings.service_role_key', true);

  IF edge_function_url IS NOT NULL AND service_role_key IS NOT NULL THEN
    PERFORM extensions.http_post(
      edge_function_url,
      jsonb_build_object(
        'request_id', NEW.id
      )::text,
      'application/json'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_notify_tutor_new_request'
  ) THEN
    CREATE TRIGGER trg_notify_tutor_new_request
      AFTER INSERT ON tutor_requests
      FOR EACH ROW
      EXECUTE FUNCTION notify_tutor_on_new_request();
  END IF;
END $$;
