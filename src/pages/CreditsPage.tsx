import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

const packages = [
  { credits: 10, price: 25, label: '10 credite', popular: false },
  { credits: 25, price: 55, label: '25 credite', popular: false },
  { credits: 50, price: 99, label: '50 credite', popular: true },
  { credits: 100, price: 179, label: '100 credite', popular: false },
];

export default function CreditsPage() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || role !== 'tutor') {
      navigate('/');
      return;
    }

    supabase
      .from('credits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const txns = data ?? [];
        setTransactions(txns);
        const total = txns.reduce((sum, t) => sum + t.amount, 0);
        setBalance(total);
        setLoading(false);
      });
  }, [user, role, authLoading, navigate]);

  const handleBuy = async (credits: number) => {
    if (!user) return;
    setBuying(credits);

    const { error } = await supabase.from('credits').insert({
      user_id: user.id,
      amount: credits,
      type: 'purchase',
      description: `Achizitie ${credits} credite`,
    });

    setBuying(null);

    if (error) return;

    setBalance((prev) => prev + credits);
    setTransactions((prev) => [
      {
        id: crypto.randomUUID(),
        amount: credits,
        type: 'purchase',
        description: `Achizitie ${credits} credite`,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    setPurchased(true);
    setTimeout(() => setPurchased(false), 3000);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-start justify-center">
        <div className="w-8 h-8 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-primary-200 text-sm font-semibold rounded-full mb-4 border border-white/10">
            Contul meu
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Credite
          </h1>
          <p className="mt-4 text-lg text-primary-100/80">
            Cumpara credite pe care le poti folosi pentru functionalitati premium.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-accent-100 flex items-center justify-center">
                  <Coins className="w-8 h-8 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Sold curent</p>
                  <p className="text-4xl font-extrabold text-gray-900">{balance}</p>
                  <p className="text-sm text-gray-400">credite disponibile</p>
                </div>
              </div>

              {purchased && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl animate-in">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Creditele au fost adaugate!</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Cumpara credite</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.credits}
                  className={`relative bg-white rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                    pkg.popular
                      ? 'border-accent-400 shadow-md'
                      : 'border-gray-100 shadow-sm'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent-500 text-white text-xs font-bold rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-gray-900">{pkg.credits}</p>
                    <p className="text-sm text-gray-500 mb-4">credite</p>
                    <p className="text-lg font-bold text-primary-700 mb-5">
                      {pkg.price} <span className="text-sm font-normal text-gray-400">lei</span>
                    </p>
                    <button
                      onClick={() => handleBuy(pkg.credits)}
                      disabled={buying !== null}
                      className={`w-full px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                        pkg.popular
                          ? 'bg-accent-500 hover:bg-accent-600 text-white hover:shadow-lg hover:shadow-accent-500/25'
                          : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg hover:shadow-primary-600/25'
                      } disabled:bg-gray-300 disabled:cursor-not-allowed text-sm`}
                    >
                      {buying === pkg.credits ? (
                        <div className="w-5 h-5 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Cumpara'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Istoric tranzactii
            </h2>

            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <Coins className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Nicio tranzactie inca.</p>
                <p className="text-sm text-gray-400 mt-1">Cumpara credite pentru a incepe.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {transactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      {txn.type === 'purchase' ? (
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <ArrowDownCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                          <ArrowUpCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{txn.description}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(txn.created_at).toLocaleDateString('ro-RO', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        txn.amount > 0 ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {txn.amount > 0 ? '+' : ''}{txn.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
