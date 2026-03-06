import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  Coins,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { CartItem } from './CreditsPage';

interface LocationState {
  cart: CartItem[];
  cartTotal: number;
  cartCredits: number;
}

const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as LocationState | null;

  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    address: '',
    city: '',
    county: '',
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!state || !state.cart || state.cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <Coins className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Cosul este gol</h1>
          <p className="text-gray-500 mb-6">Nu ai niciun pachet de credite in cos.</p>
          <Link
            to="/credite"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Inapoi la credite
          </Link>
        </div>
      </div>
    );
  }

  const { cart, cartTotal, cartCredits } = state;

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProcessing(true);

    await new Promise((r) => setTimeout(r, 2000));

    for (const item of cart) {
      const totalCredits = item.credits * item.quantity;
      await supabase.from('credits').insert({
        user_id: user.id,
        amount: totalCredits,
        type: 'purchase',
        description: `Achizitie ${item.quantity}x ${item.label}`,
      });
    }

    setProcessing(false);
    setSuccess(true);
  };

  if (success) {
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              Plata finalizata
            </h1>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                Plata a fost procesata cu succes!
              </h2>
              <p className="text-gray-500 mb-2">
                Ai achizitionat <span className="font-bold text-primary-700">{cartCredits} credite</span>.
              </p>
              <p className="text-sm text-gray-400 mb-8">
                Creditele au fost adaugate in contul tau.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/credite')}
                  className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Inapoi la credite
                </button>
                <button
                  onClick={() => navigate('/profil')}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  Profilul meu
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
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
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/credite"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Inapoi la credite
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Finalizare comanda
          </h1>
          <p className="mt-4 text-lg text-primary-100/80">
            Completeaza datele de plata pentru a finaliza achizitia.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Date card</h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Numele de pe card
                      </label>
                      <input
                        id="cardName"
                        type="text"
                        required
                        placeholder="Ion Popescu"
                        value={form.cardName}
                        onChange={set('cardName')}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Numar card
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        required
                        placeholder="1234 5678 9012 3456"
                        value={formatCardNumber(form.cardNumber)}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, cardNumber: e.target.value.replace(/\D/g, '') }))
                        }
                        maxLength={19}
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Data expirare
                        </label>
                        <input
                          id="expiry"
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={formatExpiry(form.expiry)}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, expiry: e.target.value.replace(/\D/g, '') }))
                          }
                          maxLength={5}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1.5">
                          CVV
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          required
                          placeholder="123"
                          value={form.cvv}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))
                          }
                          maxLength={4}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Adresa de facturare</h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Adresa
                      </label>
                      <input
                        id="address"
                        type="text"
                        required
                        placeholder="Strada, numar, bloc, apartament"
                        value={form.address}
                        onChange={set('address')}
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Oras
                        </label>
                        <input
                          id="billingCity"
                          type="text"
                          required
                          placeholder="Bucuresti"
                          value={form.city}
                          onChange={set('city')}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Judet
                        </label>
                        <input
                          id="county"
                          type="text"
                          required
                          placeholder="Bucuresti"
                          value={form.county}
                          onChange={set('county')}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <p className="text-sm text-emerald-700">
                    Datele tale sunt protejate si criptate. Nu stocam informatii de card.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-accent-500/25 hover:-translate-y-0.5"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Se proceseaza plata...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Plateste {cartTotal} lei
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Sumar comanda</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item.credits} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {item.price * item.quantity} lei
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 p-5 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500">Total credite</span>
                    <span className="text-sm font-bold text-primary-700">{cartCredits}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="text-xl font-extrabold text-gray-900">{cartTotal} lei</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
