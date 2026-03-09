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
  unlocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface TutorRequestWithSubject extends TutorRequest {
  subjects: { name: string } | null;
}

export interface RequestMessage {
  id: string;
  request_id: string;
  sender_id: string;
  sender_role: string;
  body: string;
  created_at: string;
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

export async function unlockRequest(requestId: string) {
  return supabase
    .from('tutor_requests')
    .update({ unlocked: true, updated_at: new Date().toISOString() })
    .eq('id', requestId);
}

export function useRequestMessages(requestId: string | null) {
  const [messages, setMessages] = useState<RequestMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    const { data } = await supabase
      .from('request_messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });
    setMessages((data as RequestMessage[] | null) ?? []);
    setLoading(false);
  }, [requestId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { messages, loading, refreshMessages: refresh };
}

export async function sendMessage(payload: {
  request_id: string;
  sender_id: string;
  sender_role: string;
  body: string;
}) {
  return supabase.from('request_messages').insert(payload);
}
