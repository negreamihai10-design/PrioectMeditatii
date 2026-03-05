import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { SubjectRow } from '../types/database';

export function useSubjects() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('subjects')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setSubjects(data ?? []);
        setLoading(false);
      });
  }, []);

  return { subjects, loading };
}

export function useSubjectBySlug(slug: string | undefined) {
  const [subject, setSubject] = useState<SubjectRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    supabase
      .from('subjects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        setSubject(data);
        setLoading(false);
      });
  }, [slug]);

  return { subject, loading };
}
