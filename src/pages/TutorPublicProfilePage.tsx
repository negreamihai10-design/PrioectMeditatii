import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Wifi,
  Users,
  Calendar,
  GraduationCap,
  MessageCircle,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { useTutorById } from '../hooks/useTutors';
import { useAuth } from '../contexts/AuthContext';
import ContactTutorModal from '../components/ContactTutorModal';

function modeLabel(mode: string) {
  if (mode === 'online') return 'Online';
  if (mode === 'fizic') return 'Fizic';
  return 'Online + Fizic';
}

function sessionLabel(st: string) {
  if (st === 'individual') return 'Individual';
  if (st === 'grup') return 'Grup';
  return 'Individual / Grup';
}

export default function TutorPublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { tutor, loading } = useTutorById(id);
  const { role } = useAuth();
  const [contactSubject, setContactSubject] = useState<{ id: string; name: string } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="h-72 bg-primary-900 animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 -mt-20">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-2xl bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-100 rounded w-32" />
                <div className="h-4 bg-gray-100 rounded w-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Profesorul nu a fost gasit
          </h1>
          <p className="text-gray-500 mb-8">
            Ne pare rau, dar acest profil nu exista.
          </p>
          <Link
            to="/materii"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Inapoi la materii
          </Link>
        </div>
      </div>
    );
  }

  const firstSubject = tutor.subjects[0] ?? null;

  return (
    <>
      <section className="relative pt-24 pb-32 overflow-hidden">
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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Inapoi
          </button>
        </div>
      </section>

      <section className="relative -mt-24 pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative flex-shrink-0">
                  <img
                    src={tutor.image}
                    alt={tutor.name}
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg shadow-md border border-gray-100">
                    <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                    <span className="text-sm font-bold text-gray-900">{tutor.rating}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {tutor.name}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {tutor.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {tutor.experience}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-accent-500" />
                      {tutor.reviews} recenzii
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                      <Wifi className="w-3.5 h-3.5" />
                      {modeLabel(tutor.mode)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg">
                      <Users className="w-3.5 h-3.5" />
                      {sessionLabel(tutor.session_type)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-50 text-accent-700 text-sm font-bold rounded-lg">
                      {tutor.price}
                    </span>
                  </div>

                  {role !== 'tutor' && firstSubject && (
                    <button
                      onClick={() => setContactSubject(firstSubject)}
                      className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-600/25"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Solicita o intalnire
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100">
              <div className="p-6 sm:p-8 lg:p-10 space-y-8">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                    Despre profesor
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{tutor.bio}</p>
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    Materii predate
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((s) => (
                      <Link
                        key={s.id}
                        to={`/materii/${s.slug}`}
                        className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium rounded-xl transition-colors text-sm"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                    Specializari
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tutor.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                    Niveluri predate
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tutor.levels.map((l) => (
                      <span
                        key={l}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    Disponibilitate
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Zile</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.days.map((d) => (
                          <span key={d} className="px-2.5 py-1 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ore</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.hours.map((h) => (
                          <span key={h} className="px-2.5 py-1 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {role !== 'tutor' && tutor.subjects.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      Solicita o intalnire pentru o materie
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {tutor.subjects.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setContactSubject(s)}
                          className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-600/25"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactTutorModal
        open={contactSubject !== null}
        onClose={() => setContactSubject(null)}
        tutorId={tutor.id}
        tutorName={tutor.name}
        subjectId={contactSubject?.id ?? ''}
        subjectName={contactSubject?.name ?? ''}
      />
    </>
  );
}
