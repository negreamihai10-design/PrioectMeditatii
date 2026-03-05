import { useState } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  User,
  BookOpen,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import {
  ALL_CITIES,
  ALL_DAYS,
  ALL_HOURS,
  ALL_LEVELS,
} from '../data/constants';
import type { SubjectRow } from '../types/database';

interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  experience: string;
  education: string;
  subjectIds: string[];
  specialties: string;
  mode: string;
  sessionType: string;
  price: string;
  days: string[];
  hours: string[];
  levels: string[];
}

const emptyForm: FormData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  bio: '',
  experience: '',
  education: '',
  subjectIds: [],
  specialties: '',
  mode: 'ambele',
  sessionType: 'individual',
  price: '',
  days: [],
  hours: [],
  levels: [],
};

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

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (v: string) => {
    onChange(
      selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
              active
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function SubjectCheckboxGroup({
  subjects,
  selected,
  onChange,
}: {
  subjects: SubjectRow[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {subjects.map((s) => {
        const active = selected.includes(s.id);
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => toggle(s.id)}
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
  );
}

const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

export default function TutorRegistrationPage() {
  const { subjects } = useSubjects();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const setArray = (field: keyof FormData) => (val: string[]) =>
    setForm((p) => ({ ...p, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const subjectNames = subjects
      .filter((s) => form.subjectIds.includes(s.id))
      .map((s) => s.name);

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-tutor-application`;

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          bio: form.bio,
          experience: form.experience,
          education: form.education,
          subjects: subjectNames,
          specialties: form.specialties
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          mode: form.mode,
          sessionType: form.sessionType,
          price: form.price,
          days: form.days,
          hours: form.hours,
          levels: form.levels,
        }),
      });

      if (!res.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm(emptyForm);
    } catch {
      setStatus('error');
    }
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
              Inscriere profesor
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
                Aplicatia a fost trimisa!
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-3">
                Multumim pentru interesul tau de a deveni profesor pe MeditatiiPro.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Echipa noastra va analiza datele tale si te va contacta in cel mult
                48 de ore la adresa de email sau numarul de telefon furnizat.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/25"
              >
                Trimite o alta aplicatie
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
            Devino profesor
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Inscrie-te ca profesor
          </h1>
          <p className="mt-4 text-lg text-primary-100/80 max-w-2xl mx-auto leading-relaxed">
            Completeaza formularul de mai jos cu datele tale si te vom contacta
            pentru a te adauga pe platforma. Procesul dureaza cel mult 48 de ore.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <StepBadge step={1} label="Date personale" icon={User} />
              <div className="space-y-5">
                <div>
                  <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nume complet *
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    placeholder="ex: Prof. Maria Ionescu"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder="email@exemplu.ro"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefon *
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="07xx xxx xxx"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-city" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Oras *
                  </label>
                  <select
                    id="reg-city"
                    required
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
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <StepBadge step={2} label="Experienta si educatie" icon={Briefcase} />
              <div className="space-y-5">
                <div>
                  <label htmlFor="reg-education" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Studii / Calificari *
                  </label>
                  <input
                    id="reg-education"
                    type="text"
                    required
                    value={form.education}
                    onChange={set('education')}
                    placeholder="ex: Absolvent Facultatea de Matematica, Universitatea Bucuresti"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="reg-experience" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Experienta in predare *
                  </label>
                  <input
                    id="reg-experience"
                    type="text"
                    required
                    value={form.experience}
                    onChange={set('experience')}
                    placeholder="ex: 5 ani experienta"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="reg-bio" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Despre tine *
                  </label>
                  <textarea
                    id="reg-bio"
                    required
                    rows={4}
                    value={form.bio}
                    onChange={set('bio')}
                    placeholder="Descrie-te pe scurt: ce te motiveaza, cum abordezi predarea, rezultatele elevilor tai..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <StepBadge step={3} label="Materii si competente" icon={BookOpen} />
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Materii predate *
                  </label>
                  <SubjectCheckboxGroup
                    subjects={subjects}
                    selected={form.subjectIds}
                    onChange={setArray('subjectIds')}
                  />
                  {form.subjectIds.length === 0 && (
                    <p className="mt-2 text-xs text-gray-400">Selecteaza cel putin o materie</p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-specialties" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Specializari
                  </label>
                  <input
                    id="reg-specialties"
                    type="text"
                    value={form.specialties}
                    onChange={set('specialties')}
                    placeholder="ex: BAC, Admitere Poli, Olimpiada (separate prin virgula)"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    Separa specializarile prin virgula
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Niveluri predate *
                  </label>
                  <CheckboxGroup
                    options={ALL_LEVELS}
                    selected={form.levels}
                    onChange={setArray('levels')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="reg-mode" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Mod de predare *
                    </label>
                    <select
                      id="reg-mode"
                      required
                      value={form.mode}
                      onChange={set('mode')}
                      className={inputClass}
                    >
                      <option value="online">Online</option>
                      <option value="fizic">Fizic</option>
                      <option value="ambele">Online + Fizic</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="reg-session" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tipul sedintelor *
                    </label>
                    <select
                      id="reg-session"
                      required
                      value={form.sessionType}
                      onChange={set('sessionType')}
                      className={inputClass}
                    >
                      <option value="individual">Individual</option>
                      <option value="grup">Grup</option>
                      <option value="ambele">Individual + Grup</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-price" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Pret dorit per ora *
                  </label>
                  <input
                    id="reg-price"
                    type="text"
                    required
                    value={form.price}
                    onChange={set('price')}
                    placeholder="ex: 80 lei / ora"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <StepBadge step={4} label="Disponibilitate" icon={Calendar} />
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Zile disponibile *
                  </label>
                  <CheckboxGroup
                    options={ALL_DAYS}
                    selected={form.days}
                    onChange={setArray('days')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Intervale orare *
                  </label>
                  <CheckboxGroup
                    options={ALL_HOURS}
                    selected={form.hours}
                    onChange={setArray('hours')}
                  />
                </div>
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  A aparut o eroare. Te rugam sa verifici datele si sa incerci din nou.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={
                status === 'loading' ||
                form.subjectIds.length === 0 ||
                form.days.length === 0 ||
                form.hours.length === 0 ||
                form.levels.length === 0
              }
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/25 hover:-translate-y-0.5"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Trimite aplicatia
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
