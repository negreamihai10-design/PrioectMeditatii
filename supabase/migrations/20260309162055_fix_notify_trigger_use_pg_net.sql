/*
  # Fix email notification trigger to use pg_net

  1. Changes
    - Rewrite `notify_tutor_on_new_request()` to use `net.http_post` from pg_net extension
    - Uses the Supabase project URL directly since app.settings are not available
    - Sends request_id as JSON payload to the edge function
    - The edge function fetches all request details server-side
*/

CREATE OR REPLACE FUNCTION notify_tutor_on_new_request()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://stwwivneqzvljeksxoxf.supabase.co/functions/v1/send-student-request',
    body := jsonb_build_object('request_id', NEW.id),
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
