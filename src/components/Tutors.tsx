import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import { useFeaturedTutors } from '../hooks/useTutors';

export default function Tutors() {
  const { tutors, loading } = useFeaturedTutors();

  return (
    <section id="profesori" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
            Echipa noastra
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Profesori de top, verificati
          </h2>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            Toti profesorii nostri sunt atent selectati, cu experienta dovedita
            si recenzii excelente de la elevi si parinti.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutors.map((tutor) => (
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
                      <span className="text-sm font-bold text-gray-900">{tutor.rating}</span>
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
                  <p className="mt-3 text-xs text-gray-400">
                    {tutor.reviews} recenzii verificate
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/materii"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/25 hover:-translate-y-0.5"
          >
            Vezi toti profesorii pe materii
          </Link>
        </div>
      </div>
    </section>
  );
}
