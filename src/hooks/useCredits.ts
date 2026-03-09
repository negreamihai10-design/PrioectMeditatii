import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { UserRole } from '../contexts/AuthContext';

export function useCreditBalance(userId: string | undefined, role: UserRole) {
  const [balance, setBalance] = useState(0);

  const refresh = useCallback(async () => {
    if (!userId || role !== 'tutor') return;
    const { data } = await supabase
      .from('credits')
      .select('amount')
      .eq('user_id', userId);
    const total = (data ?? []).reduce((sum, row) => sum + row.amount, 0);
    setBalance(total);
  }, [userId, role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { balance, refreshCredits: refresh };
}

export async function spendCredits(
  userId: string,
  amount: number,
  description: string
) {
  return supabase.from('credits').insert({
    user_id: userId,
    amount: -amount,
    type: 'usage',
    description,
  });
}
