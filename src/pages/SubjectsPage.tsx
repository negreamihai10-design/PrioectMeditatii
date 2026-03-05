import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { useTutorCountBySubject } from '../hooks/useTutors';
import SubjectIcon from '../components/SubjectIcon';
import type { SubjectRow } from '../types/database';

function SubjectCard({ subject }: { subject: SubjectRow }) {
  const tutorCount = useTutorCountBySubject(subject.name);

  return (
    <Link
      to={`/materii/${subject.slug}`}
      className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      <div
        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${subject.color} text-white shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}
      >
        <SubjectIcon icon={subject.icon} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
        {subject.name}
      </h3>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        {subject.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {subject.levels.map((level) => (
          <span
            key={level}
            className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg"
          >
            {level}
          </span>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {tutorCount} {tutorCount === 1 ? 'profesor' : 'profesori'}
        </span>
        <span className="flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
          Vezi profesori
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

export default function SubjectsPage() {
  const { subjects, loading } = useSubjects();

  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-primary-200 text-sm font-semibold rounded-full mb-4 border border-white/10">
            Toate materiile
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
            Alege materia
          </h1>
          <p className="mt-4 text-lg text-primary-100/80 max-w-2xl mx-auto leading-relaxed">
            Selecteaza materia care te intereseaza si descopera toti profesorii disponibili, gata sa te ajute sa obtii rezultatele dorite.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="mt-5 h-5 bg-gray-200 rounded w-2/3" />
                  <div className="mt-3 h-4 bg-gray-100 rounded w-full" />
                  <div className="mt-2 h-4 bg-gray-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
