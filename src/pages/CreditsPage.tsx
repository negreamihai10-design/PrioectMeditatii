import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  Plus,
  Minus,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  ShoppingCart,
  Trash2,
  ArrowRight,
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

export interface CartItem {
  credits: number;
  price: number;
  label: string;
  quantity: number;
}

export const packages = [
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
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const addToCart = (pkg: typeof packages[number]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.credits === pkg.credits);
      if (existing) {
        return prev.map((item) =>
          item.credits === pkg.credits
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...pkg, quantity: 1 }];
    });
  };

  const updateQuantity = (credits: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) =>
          item.credits === credits
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (credits: number) => {
    setCart((prev) => prev.filter((item) => item.credits !== credits));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCredits = cart.reduce((sum, item) => sum + item.credits * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/credite/plata', { state: { cart, cartTotal, cartCredits } });
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Cumpara credite</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packages.map((pkg) => {
                  const inCart = cart.find((item) => item.credits === pkg.credits);
                  return (
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
                          <Coins className="w-6 h-6 text-primary-600" />
                        </div>
                        <p className="text-2xl font-extrabold text-gray-900">{pkg.credits}</p>
                        <p className="text-sm text-gray-500 mb-4">credite</p>
                        <p className="text-lg font-bold text-primary-700 mb-5">
                          {pkg.price} <span className="text-sm font-normal text-gray-400">lei</span>
                        </p>
                        <button
                          onClick={() => addToCart(pkg)}
                          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-xl transition-all duration-200 text-sm ${
                            pkg.popular
                              ? 'bg-accent-500 hover:bg-accent-600 text-white hover:shadow-lg hover:shadow-accent-500/25'
                              : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg hover:shadow-primary-600/25'
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {inCart ? `In cos (${inCart.quantity})` : 'Adauga in cos'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Cosul tau</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                {cart.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">Cosul este gol</p>
                    <p className="text-xs text-gray-400 mt-1">Adauga pachete de credite</p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-gray-100">
                      {cart.map((item) => (
                        <div key={item.credits} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900">{item.label}</span>
                            <button
                              onClick={() => removeFromCart(item.credits)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.credits, -1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.credits, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              {item.price * item.quantity} lei
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 p-4 bg-gray-50/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-500">Total credite</span>
                        <span className="text-sm font-bold text-primary-700">{cartCredits} credite</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Total de plata</span>
                        <span className="text-lg font-extrabold text-gray-900">{cartTotal} lei</span>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent-500/25"
                      >
                        Cumpara
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
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
