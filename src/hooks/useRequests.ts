import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface TutorRequest {
  id: string;
  student_id: string;
  tutor_id: string;
  subject_id: string;
  student_name: string;
  student_email: string;
  message: string;
  status: string;
  tutor_reply: string;
  created_at: string;
  updated_at: string;
}

export interface TutorRequestWithSubject extends TutorRequest {
  subjects: { name: string } | null;
}

export function useTutorRequests(tutorId: string | undefined) {
  const [requests, setRequests] = useState<TutorRequestWithSubject[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!tutorId) return;
    setLoading(true);
    const { data } = await supabase
      .from('tutor_requests')
      .select('*, subjects(name)')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });
    setRequests((data as TutorRequestWithSubject[] | null) ?? []);
    setLoading(false);
  }, [tutorId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { requests, loading, refresh };
}

export async function sendRequest(payload: {
  student_id: string;
  tutor_id: string;
  subject_id: string;
  student_name: string;
  student_email: string;
  message: string;
}) {
  return supabase.from('tutor_requests').insert(payload);
}

export async function replyToRequest(
  requestId: string,
  reply: string,
  status: 'accepted' | 'declined'
) {
  return supabase
    .from('tutor_requests')
    .update({ tutor_reply: reply, status, updated_at: new Date().toISOString() })
    .eq('id', requestId);
}
