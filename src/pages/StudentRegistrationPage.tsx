import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  CheckCircle,
  AlertCircle,
  User,
  BookOpen,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSubjects } from '../hooks/useSubjects';
import { ALL_CITIES, ALL_LEVELS } from '../data/constants';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  city: string;
  level: string;
  interests: string[];
}

const emptyForm: FormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  city: '',
  level: '',
  interests: [],
};

const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

function StepBadge({ step, label, icon: Icon }: { step: number; label: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white font-bold text-sm">
        {step}
      </div>
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-gray-900">{label}</h3>
      </div>
    </div>
  );
}

export default function StudentRegistrationPage() {
  const navigate = useNavigate();
  const { subjects } = useSubjects();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const toggleInterest = (id: string) => {
    setForm((p) => ({
      ...p,
      interests: p.interests.includes(id)
        ? p.interests.filter((i) => i !== id)
        : [...p.interests, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (form.password !== form.confirmPassword) {
      setErrorMsg('Parolele nu coincid.');
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg('Parola trebuie sa aiba cel putin 6 caractere.');
      return;
    }

    setStatus('loading');

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError || !authData.user) {
      setErrorMsg(
        authError?.message === 'User already registered'
          ? 'Exista deja un cont cu acest email.'
          : 'A aparut o eroare la crearea contului. Incearca din nou.'
      );
      setStatus('error');
      return;
    }

    const { error: profileError } = await supabase.from('students').insert({
      id: authData.user.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      level: form.level,
      interests: form.interests,
    });

    if (profileError) {
      setErrorMsg('Contul a fost creat, dar profilul nu a putut fi salvat. Contacteaza suportul.');
      setStatus('error');
      return;
    }

    setStatus('success');
    setForm(emptyForm);
  };

  if (status === 'success') {
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
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              Inscriere elev
            </h1>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Contul tau a fost creat!
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-3">
                Bine ai venit pe MeditatiiPro. Esti acum conectat si poti explora
                toti profesorii disponibili.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Exploreaza materiile si gaseste profesorul potrivit pentru tine.
              </p>
              <button
                onClick={() => navigate('/materii')}
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/25"
              >
                Exploreaza materiile
              </button>
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
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-primary-200 text-sm font-semibold rounded-full mb-4 border border-white/10">
            Cont nou
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Inscrie-te ca elev
          </h1>
          <p className="mt-4 text-lg text-primary-100/80 max-w-2xl mx-auto leading-relaxed">
            Creeaza-ti contul gratuit si conecteaza-te cu cei mai buni profesori
            pentru materiile care te intereseaza.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <StepBadge step={1} label="Date personale si cont" icon={User} />
              <div className="space-y-5">
                <div>
                  <label htmlFor="stu-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nume complet *
                  </label>
                  <input
                    id="stu-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    placeholder="ex: Ion Popescu"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="stu-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      id="stu-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder="email@exemplu.ro"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="stu-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefon
                    </label>
                    <input
                      id="stu-phone"
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="07xx xxx xxx"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="stu-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Parola *
                    </label>
                    <input
                      id="stu-password"
                      type="password"
                      required
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Minim 6 caractere"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="stu-confirm" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirma parola *
                    </label>
                    <input
                      id="stu-confirm"
                      type="password"
                      required
                      value={form.confirmPassword}
                      onChange={set('confirmPassword')}
                      placeholder="Repeta parola"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="stu-city" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Oras
                    </label>
                    <select
                      id="stu-city"
                      value={form.city}
                      onChange={set('city')}
                      className={inputClass}
                    >
                      <option value="">Selecteaza orasul</option>
                      {ALL_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="stu-level" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nivel *
                    </label>
                    <select
                      id="stu-level"
                      required
                      value={form.level}
                      onChange={set('level')}
                      className={inputClass}
                    >
                      <option value="">Selecteaza nivelul</option>
                      {ALL_LEVELS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <StepBadge step={2} label="Materii de interes" icon={BookOpen} />
              <p className="text-sm text-gray-500 mb-4">
                Selecteaza materiile la care esti interesat de meditatii (optional)
              </p>
              <div className="flex flex-wrap gap-2">
                {subjects.map((s) => {
                  const active = form.interests.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleInterest(s.id)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        active
                          ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {(status === 'error' || errorMsg) && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  {errorMsg || 'A aparut o eroare. Te rugam sa incerci din nou.'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/25 hover:-translate-y-0.5"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Creeaza contul
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
