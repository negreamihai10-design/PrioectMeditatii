import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  Eye,
  Star,
  Crown,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ActivePromotion {
  id: string;
  package_type: string;
  credits_spent: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

const promotionPackages = [
  {
    type: 'visibility',
    name: 'Vizibilitate',
    credits: 50,
    duration: 7,
    icon: Eye,
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    features: [
      'Apari in topul listei de profesori',
      'Badge de "Profesor Promovat"',
      'Vizibilitate crescuta 7 zile',
    ],
  },
  {
    type: 'highlight',
    name: 'Evidential',
    credits: 100,
    duration: 14,
    icon: Star,
    color: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    popular: true,
    features: [
      'Toate beneficiile pachetului Vizibilitate',
      'Profil evidentiat cu chenar special',
      'Prioritate in rezultatele cautarii',
      'Vizibilitate crescuta 14 zile',
    ],
  },
  {
    type: 'premium',
    name: 'Premium',
    credits: 200,
    duration: 30,
    icon: Crown,
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    features: [
      'Toate beneficiile pachetului Evidentiat',
      'Aparitie pe pagina principala',
      'Badge "Profesor Premium" pe profil',
      'Statistici avansate de vizualizare',
      'Vizibilitate crescuta 30 zile',
    ],
  },
];

export default function PromotionPage() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();

  const [balance, setBalance] = useState(0);
  const [activePromotions, setActivePromotions] = useState<ActivePromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || role !== 'tutor') {
      navigate('/');
      return;
    }

    Promise.all([
      supabase
        .from('credits')
        .select('amount')
        .eq('user_id', user.id),
      supabase
        .from('tutor_promotions')
        .select('*')
        .eq('tutor_id', user.id)
        .eq('is_active', true)
        .gte('ends_at', new Date().toISOString())
        .order('created_at', { ascending: false }),
    ]).then(([creditsRes, promoRes]) => {
      const total = (creditsRes.data ?? []).reduce((sum, r) => sum + r.amount, 0);
      setBalance(total);
      setActivePromotions(promoRes.data ?? []);
      setLoading(false);
    });
  }, [user, role, authLoading, navigate]);

  const handleActivate = async (pkg: typeof promotionPackages[number]) => {
    if (!user) return;
    if (balance < pkg.credits) {
      setErrorMsg(`Nu ai suficiente credite. Ai nevoie de ${pkg.credits} credite, dar ai doar ${balance}.`);
      setTimeout(() => setErrorMsg(''), 5000);
      return;
    }

    const existing = activePromotions.find((p) => p.package_type === pkg.type);
    if (existing) {
      setErrorMsg(`Ai deja o promotie ${pkg.name} activa.`);
      setTimeout(() => setErrorMsg(''), 5000);
      return;
    }

    setActivating(pkg.type);
    setErrorMsg('');
    setSuccessMsg('');

    const now = new Date();
    const endsAt = new Date(now.getTime() + pkg.duration * 24 * 60 * 60 * 1000);

    const { error: promoError } = await supabase.from('tutor_promotions').insert({
      tutor_id: user.id,
      package_type: pkg.type,
      credits_spent: pkg.credits,
      starts_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      is_active: true,
    });

    if (promoError) {
      setErrorMsg('A aparut o eroare. Incearca din nou.');
      setActivating(null);
      return;
    }

    const { error: creditError } = await supabase.from('credits').insert({
      user_id: user.id,
      amount: -pkg.credits,
      type: 'usage',
      description: `Promovare: ${pkg.name} (${pkg.duration} zile)`,
    });

    if (creditError) {
      setErrorMsg('A aparut o eroare la deducerea creditelor.');
      setActivating(null);
      return;
    }

    setBalance((prev) => prev - pkg.credits);
    setActivePromotions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        package_type: pkg.type,
        credits_spent: pkg.credits,
        starts_at: now.toISOString(),
        ends_at: endsAt.toISOString(),
        is_active: true,
      },
    ]);

    setActivating(null);
    setSuccessMsg(`Pachetul ${pkg.name} a fost activat cu succes pentru ${pkg.duration} zile!`);
    setTimeout(() => setSuccessMsg(''), 5000);
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
            Creste-ti vizibilitatea
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Promovare
          </h1>
          <p className="mt-4 text-lg text-primary-100/80">
            Foloseste creditele pentru a aparea in topul listei de profesori si a atrage mai multi elevi.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent-100 flex items-center justify-center">
                <Coins className="w-7 h-7 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Sold curent</p>
                <p className="text-3xl font-extrabold text-gray-900">{balance} <span className="text-base font-medium text-gray-400">credite</span></p>
              </div>
            </div>
            <button
              onClick={() => navigate('/credite')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-600/25"
            >
              <Coins className="w-4 h-4" />
              Cumpara credite
            </button>
          </div>

          {activePromotions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent-500" />
                Promotii active
              </h2>
              <div className="space-y-3">
                {activePromotions.map((promo) => {
                  const pkg = promotionPackages.find((p) => p.type === promo.package_type);
                  if (!pkg) return null;
                  const daysLeft = Math.max(
                    0,
                    Math.ceil((new Date(promo.ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  );
                  return (
                    <div key={promo.id} className={`flex items-center justify-between p-4 rounded-2xl ${pkg.bgLight} border ${pkg.borderColor}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                          <pkg.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${pkg.textColor}`}>{pkg.name}</p>
                          <p className="text-xs text-gray-500">
                            Expira pe {new Date(promo.ends_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                        <Clock className="w-4 h-4" />
                        {daysLeft} {daysLeft === 1 ? 'zi' : 'zile'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Pachete de promovare</h2>
            <p className="text-gray-500 mb-8">Alege pachetul potrivit pentru a-ti creste vizibilitatea pe platforma.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promotionPackages.map((pkg) => {
                const isActive = activePromotions.some((p) => p.package_type === pkg.type);
                const canAfford = balance >= pkg.credits;
                const isActivating = activating === pkg.type;
                const IconComp = pkg.icon;

                return (
                  <div
                    key={pkg.type}
                    className={`relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      pkg.popular
                        ? 'border-amber-300 shadow-lg shadow-amber-100/50'
                        : 'border-gray-100 shadow-sm'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold text-center py-1.5">
                        Cel mai popular
                      </div>
                    )}

                    <div className={`p-8 ${pkg.popular ? 'pt-12' : ''}`}>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-5 shadow-lg`}>
                        <IconComp className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-xl font-extrabold text-gray-900">{pkg.name}</h3>

                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-gray-900">{pkg.credits}</span>
                        <span className="text-sm text-gray-400 font-medium">credite</span>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {pkg.duration} zile de promovare
                      </div>

                      <div className="mt-6 space-y-3">
                        {pkg.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-2.5">
                            <div className={`mt-0.5 w-5 h-5 rounded-full ${pkg.bgLight} flex items-center justify-center flex-shrink-0`}>
                              <CheckCircle className={`w-3.5 h-3.5 ${pkg.textColor}`} />
                            </div>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8">
                        {isActive ? (
                          <div className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 ${pkg.bgLight} ${pkg.textColor} font-bold rounded-xl text-sm`}>
                            <Shield className="w-4 h-4" />
                            Activ
                          </div>
                        ) : (
                          <button
                            onClick={() => handleActivate(pkg)}
                            disabled={!canAfford || isActivating}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 font-bold rounded-xl text-sm transition-all duration-200 ${
                              canAfford
                                ? `bg-gradient-to-r ${pkg.color} text-white hover:shadow-lg hover:-translate-y-0.5`
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {isActivating ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : canAfford ? (
                              <>
                                <TrendingUp className="w-4 h-4" />
                                Activeaza - {pkg.credits} credite
                              </>
                            ) : (
                              <>
                                <Coins className="w-4 h-4" />
                                Credite insuficiente
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
