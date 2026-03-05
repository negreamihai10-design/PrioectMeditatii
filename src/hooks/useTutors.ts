import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { TutorRow } from '../types/database';

export function useFeaturedTutors() {
  const [tutors, setTutors] = useState<TutorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('tutors')
      .select('*')
      .eq('is_featured', true)
      .order('rating', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        setTutors(data ?? []);
        setLoading(false);
      });
  }, []);

  return { tutors, loading };
}

export function useTutorsBySubject(subjectName: string | undefined) {
  const [tutors, setTutors] = useState<TutorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectName) {
      setLoading(false);
      return;
    }

    supabase
      .from('tutors')
      .select('*, tutor_subjects!inner(subject_id, subjects!inner(name))')
      .eq('tutor_subjects.subjects.name', subjectName)
      .order('rating', { ascending: false })
      .then(({ data }) => {
        setTutors((data as TutorRow[] | null) ?? []);
        setLoading(false);
      });
  }, [subjectName]);

  return { tutors, loading };
}

export function useTutorCountBySubject(subjectName: string): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    supabase
      .from('tutors')
      .select('id, tutor_subjects!inner(subject_id, subjects!inner(name))', { count: 'exact', head: true })
      .eq('tutor_subjects.subjects.name', subjectName)
      .then(({ count: c }) => {
        setCount(c ?? 0);
      });
  }, [subjectName]);

  return count;
}
