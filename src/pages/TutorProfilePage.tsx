import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  Camera,
  CheckCircle,
  AlertCircle,
  User,
  BookOpen,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSubjects } from '../hooks/useSubjects';
import {
  ALL_CITIES,
  ALL_DAYS,
  ALL_HOURS,
  ALL_LEVELS,
} from '../data/constants';
import type { SubjectRow } from '../types/database';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  experience: string;
  education: string;
  avatar_url: string;
  subject_ids: string[];
  specialties: string[];
  mode: string;
  session_type: string;
  price: string;
  days: string[];
  hours: string[];
  levels: string[];
}

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
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
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
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
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

export default function TutorProfilePage() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const { subjects } = useSubjects();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || role !== 'tutor') {
      navigate('/');
      return;
    }

    supabase
      .from('tutor_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile({
            name: data.name,
            email: data.email,
            phone: data.phone,
            city: data.city,
            bio: data.bio,
            experience: data.experience,
            education: data.education,
            avatar_url: data.avatar_url,
            subject_ids: data.subject_ids,
            specialties: data.specialties,
            mode: data.mode,
            session_type: data.session_type,
            price: data.price,
            days: data.days,
            hours: data.hours,
            levels: data.levels,
          });
        }
        setLoading(false);
      });
  }, [user, role, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-start justify-center">
        <div className="w-8 h-8 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const set = (field: keyof ProfileData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setProfile((p) => p ? { ...p, [field]: e.target.value } : p);

  const setArray = (field: keyof ProfileData) => (val: string[]) =>
    setProfile((p) => p ? { ...p, [field]: val } : p);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setErrorMsg('Imaginea nu a putut fi incarcata. Incearca din nou.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = `${publicUrl}?t=${Date.now()}`;

    await supabase.from('tutor_profiles').update({ avatar_url: url }).eq('id', user.id);
    setProfile((p) => p ? { ...p, avatar_url: url } : p);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaved(false);
    setErrorMsg('');

    const { error } = await supabase
      .from('tutor_profiles')
      .update({
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        bio: profile.bio,
        experience: profile.experience,
        education: profile.education,
        subject_ids: profile.subject_ids,
        specialties: profile.specialties,
        mode: profile.mode,
        session_type: profile.session_type,
        price: profile.price,
        days: profile.days,
        hours: profile.hours,
        levels: profile.levels,
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setErrorMsg('Datele nu au putut fi salvate. Incearca din nou.');
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
            Profilul Meu
          </h1>
          <p className="mt-4 text-lg text-primary-100/80">
            Actualizeaza datele tale personale si informatiile profesionale.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-2 -right-2 p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Apasa pe camera pentru a schimba poza de profil
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <StepBadge step={1} label="Date personale" icon={User} />
              <div className="space-y-5">
                <div>
                  <label htmlFor="p-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nume complet
                  </label>
                  <input id="p-name" type="text" required value={profile.name} onChange={set('name')} className={inputClass} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="p-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input id="p-email" type="email" value={profile.email} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
                  </div>
                  <div>
                    <label htmlFor="p-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefon
                    </label>
                    <input id="p-phone" type="tel" value={profile.phone} onChange={set('phone')} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="p-city" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Oras
                  </label>
                  <select id="p-city" value={profile.city} onChange={set('city')} className={inputClass}>
                    <option value="">Selecteaza orasul</option>
                    {ALL_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <StepBadge step={2} label="Experienta si educatie" icon={Briefcase} />
              <div className="space-y-5">
                <div>
                  <label htmlFor="p-education" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Studii / Calificari
                  </label>
                  <input id="p-education" type="text" value={profile.education} onChange={set('education')} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="p-experience" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Experienta in predare
                  </label>
                  <input id="p-experience" type="text" value={profile.experience} onChange={set('experience')} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="p-bio" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Despre tine
                  </label>
                  <textarea id="p-bio" rows={4} value={profile.bio} onChange={set('bio')} className={`${inputClass} resize-none`} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <StepBadge step={3} label="Materii si competente" icon={BookOpen} />
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Materii predate</label>
                  <SubjectCheckboxGroup subjects={subjects} selected={profile.subject_ids} onChange={setArray('subject_ids')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Niveluri predate</label>
                  <CheckboxGroup options={ALL_LEVELS} selected={profile.levels} onChange={setArray('levels')} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="p-mode" className="block text-sm font-medium text-gray-700 mb-1.5">Mod de predare</label>
                    <select id="p-mode" value={profile.mode} onChange={set('mode')} className={inputClass}>
                      <option value="online">Online</option>
                      <option value="fizic">Fizic</option>
                      <option value="ambele">Online + Fizic</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="p-session" className="block text-sm font-medium text-gray-700 mb-1.5">Tipul sedintelor</label>
                    <select id="p-session" value={profile.session_type} onChange={set('session_type')} className={inputClass}>
                      <option value="individual">Individual</option>
                      <option value="grup">Grup</option>
                      <option value="ambele">Individual + Grup</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="p-price" className="block text-sm font-medium text-gray-700 mb-1.5">Pret per ora</label>
                  <input id="p-price" type="text" value={profile.price} onChange={set('price')} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <StepBadge step={4} label="Disponibilitate" icon={Calendar} />
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Zile disponibile</label>
                  <CheckboxGroup options={ALL_DAYS} selected={profile.days} onChange={setArray('days')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Intervale orare</label>
                  <CheckboxGroup options={ALL_HOURS} selected={profile.hours} onChange={setArray('hours')} />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-xl">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Profilul a fost actualizat cu succes!</p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/25 hover:-translate-y-0.5"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salveaza modificarile
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
