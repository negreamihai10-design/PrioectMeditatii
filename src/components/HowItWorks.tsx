import { Link } from 'react-router-dom';
import { Search, CalendarCheck, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Alege materia',
    description:
      'Spune-ne ce materie si nivel te intereseaza. Noi gasim profesorii potriviti pentru nevoile tale.',
  },
  {
    icon: CalendarCheck,
    step: '02',
    title: 'Programeaza o sedinta',
    description:
      'Alege data si ora care ti se potrivesc. Prima sedinta de cunoastere este gratuita!',
  },
  {
    icon: TrendingUp,
    step: '03',
    title: 'Progreseaza rapid',
    description:
      'Invata in ritmul tau cu un plan personalizat. Urmareste-ti progresul si obtine rezultatele dorite.',
  },
];

export default function HowItWorks() {
  return (
    <section id="cum-functioneaza" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent-100 text-accent-700 text-sm font-semibold rounded-full mb-4">
            Simplu si rapid
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Cum functioneaza?
          </h2>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            Trei pasi simpli pentru a incepe sa inveti cu cel mai bun profesor
            pentru tine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, index) => (
            <div key={item.step} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-200 to-transparent" />
              )}

              <div className="relative bg-gray-50 rounded-3xl p-8 lg:p-10 hover:bg-primary-50 transition-all duration-500 group-hover:shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                    <item.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <span className="text-6xl font-extrabold text-gray-100 group-hover:text-primary-100 transition-colors select-none">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/inscriere-profesor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/25 hover:-translate-y-0.5"
          >
            Devino profesor
          </Link>
        </div>
      </div>
    </section>
  );
}
