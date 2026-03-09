import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Wifi,
  Users,
  Search,
  MessageCircle,
} from 'lucide-react';
import { useSubjects, useSubjectBySlug } from '../hooks/useSubjects';
import { useTutorsBySubject } from '../hooks/useTutors';
import { useAuth } from '../contexts/AuthContext';
import SubjectIcon from '../components/SubjectIcon';
import ContactTutorModal from '../components/ContactTutorModal';
import TutorFilters, { type FilterState, emptyFilters } from '../components/TutorFilters';
import type { TutorRow } from '../types/database';

function applyFilters(tutorsList: TutorRow[], f: FilterState): TutorRow[] {
  return tutorsList.filter((t) => {
    if (f.mode) {
      if (f.mode === 'online' && t.mode === 'fizic') return false;
      if (f.mode === 'fizic' && t.mode === 'online') return false;
    }
    if (f.city && (f.mode === 'fizic' || f.mode === 'ambele')) {
      if (t.mode === 'online') return false;
      if (t.city !== f.city) return false;
    }
    if (f.days.length > 0 && !f.days.some((d) => t.days.includes(d))) return false;
    if (f.hours.length > 0 && !f.hours.some((h) => t.hours.includes(h))) return false;
    if (f.levels.length > 0 && !f.levels.some((l) => t.levels.includes(l))) return false;
    if (f.sessionType) {
      if (f.sessionType === 'individual' && t.session_type === 'grup') return false;
      if (f.sessionType === 'grup' && t.session_type === 'individual') return false;
    }
    return true;
  });
}

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

export default function SubjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { subject, loading: subjectLoading } = useSubjectBySlug(slug);
  const { subjects: allSubjects } = useSubjects();
  const { tutors: allTutors, loading: tutorsLoading } = useTutorsBySubject(subject?.name);
  const { role } = useAuth();
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [contactTutor, setContactTutor] = useState<{ id: string; name: string } | null>(null);

  const filtered = useMemo(() => applyFilters(allTutors, filters), [allTutors, filters]);
  const otherSubjects = allSubjects.filter((s) => s.slug !== slug).slice(0, 4);

  if (subjectLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="h-64 bg-primary-900 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Materia nu a fost gasita
          </h1>
          <p className="text-gray-500 mb-8">
            Ne pare rau, dar aceasta materie nu exista in oferta noastra.
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/materii"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Toate materiile
          </Link>

          <div className="flex items-start gap-6">
            <div
              className={`hidden sm:flex p-4 rounded-2xl bg-gradient-to-br ${subject.color} text-white shadow-xl`}
            >
              <SubjectIcon icon={subject.icon} className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
                {subject.name}
              </h1>
              <p className="mt-3 text-lg text-primary-100/80 max-w-2xl leading-relaxed">
                {subject.long_description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {subject.levels.map((level) => (
                  <span
                    key={level}
                    className="px-3 py-1.5 bg-white/10 text-primary-100 text-sm font-medium rounded-lg border border-white/10"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TutorFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
          />

          <div className="mt-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Profesori de {subject.name}
              </h2>
              <p className="mt-1 text-gray-500">
                {tutorsLoading ? (
                  <span className="inline-block h-4 w-32 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <>
                    {filtered.length}{' '}
                    {filtered.length === 1
                      ? 'profesor disponibil'
                      : 'profesori disponibili'}
                  </>
                )}
              </p>
            </div>
          </div>

          {tutorsLoading ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-8 bg-white rounded-2xl p-12 text-center border border-gray-100">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                Niciun profesor nu corespunde filtrelor selectate.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Incearca sa modifici sau sa stergi unele filtre.
              </p>
              <button
                onClick={() => setFilters(emptyFilters)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
              >
                Sterge toate filtrele
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tutor) => (
                <div
                  key={tutor.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={tutor.image}
                      alt={tutor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-semibold text-gray-900 rounded-lg">
                        {tutor.price}
                      </span>
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg">
                        <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                        <span className="text-sm font-bold text-gray-900">
                          {tutor.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg">{tutor.name}</h3>

                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {tutor.experience}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {tutor.location}
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                        <Wifi className="w-3 h-3" />
                        {modeLabel(tutor.mode)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg">
                        <Users className="w-3 h-3" />
                        {sessionLabel(tutor.session_type)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {tutor.bio}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tutor.specialties.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-gray-400">
                        Disponibil: {tutor.days.slice(0, 3).join(', ')}
                        {tutor.days.length > 3 && ` +${tutor.days.length - 3}`}
                        {' | '}
                        {tutor.hours[0]}
                        {tutor.hours.length > 1 && ` +${tutor.hours.length - 1}`}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {tutor.reviews} recenzii verificate
                      </p>
                      {role !== 'tutor' && (
                        <button
                          onClick={() => setContactTutor({ id: tutor.id, name: tutor.name })}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contacteaza
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {otherSubjects.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
              Alte materii disponibile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {otherSubjects.map((s) => (
                <Link
                  key={s.slug}
                  to={`/materii/${s.slug}`}
                  className="group flex items-center gap-4 bg-gray-50 hover:bg-primary-50 rounded-xl p-4 border border-gray-100 hover:border-primary-200 transition-all duration-300"
                >
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} text-white`}
                  >
                    <SubjectIcon icon={s.icon} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-700 transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{s.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {subject && (
        <ContactTutorModal
          open={contactTutor !== null}
          onClose={() => setContactTutor(null)}
          tutorId={contactTutor?.id ?? ''}
          tutorName={contactTutor?.name ?? ''}
          subjectId={subject.id}
          subjectName={subject.name}
        />
      )}
    </>
  );
}
