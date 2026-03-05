import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '2,500+', label: 'Elevi multumiti' },
  { icon: Star, value: '4.9/5', label: 'Rating mediu' },
  { icon: Award, value: '150+', label: 'Profesori verificati' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-primary-200 mb-8 border border-white/10">
              <Star className="w-4 h-4 text-accent-400 fill-accent-400" />
              <span>Platforma #1 de meditatii din Romania</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Gaseste profesorul
              <span className="block mt-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                  perfect
                </span>{' '}
                pentru tine
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-primary-100/80 max-w-xl leading-relaxed">
              Conecteaza-te cu profesori verificati si experimentati. Meditatii personalizate
              pentru fiecare nivel, de la scoala primara pana la admitere la facultate.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/inscriere-profesor"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-accent-500/30 hover:-translate-y-0.5"
              >
                Devino profesor
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/materii"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-2xl transition-all duration-300 border border-white/10"
              >
                Exploreaza materiile
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-600/20 to-accent-500/20 rounded-3xl blur-2xl" />
              <img
                src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&dpr=2"
                alt="Profesor si elev"
                className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">2,500+ elevi</p>
                    <p className="text-sm text-gray-500">s-au inscris luna aceasta</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 text-accent-400 fill-accent-400" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">4.9</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">din 1,200+ recenzii</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
            >
              <div className="p-3 bg-accent-500/20 rounded-xl">
                <Icon className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-primary-200/70">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
