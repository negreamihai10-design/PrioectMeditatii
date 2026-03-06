import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { UserRole } from '../contexts/AuthContext';

export function useCreditBalance(userId: string | undefined, role: UserRole): number {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!userId || role !== 'tutor') return;

    supabase
      .from('credits')
      .select('amount')
      .eq('user_id', userId)
      .then(({ data }) => {
        const total = (data ?? []).reduce((sum, row) => sum + row.amount, 0);
        setBalance(total);
      });
  }, [userId, role]);

  return balance;
}
