import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type UserRole = 'tutor' | 'student' | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  loginOpen: false,
  openLogin: () => {},
  closeLogin: () => {},
  signOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

async function detectRole(userId: string): Promise<UserRole> {
  const { data: tutor } = await supabase
    .from('tutor_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (tutor) return 'tutor';

  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (student) return 'student';

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  const loadRole = useCallback(async (u: User | null) => {
    if (!u) {
      setRole(null);
      return;
    }
    const r = await detectRole(u.id);
    setRole(r);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      loadRole(u).then(() => setLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      (async () => {
        await loadRole(u);
      })();
    });

    return () => subscription.unsubscribe();
  }, [loadRole]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const handleSignOut = useCallback(() => {
    (async () => {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, loading, loginOpen, openLogin, closeLogin, signOut: handleSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
