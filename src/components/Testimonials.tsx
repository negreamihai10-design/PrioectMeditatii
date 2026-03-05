import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Maria Constantinescu',
    role: 'Eleva, clasa a XII-a',
    text: 'Datorita meditatiilor la matematica, am reusit sa iau 9.80 la BAC. Profesorul meu a fost extrem de rabdator si mi-a explicat totul pas cu pas. Recomand cu incredere!',
    rating: 5,
  },
  {
    name: 'Alexandru Popa',
    role: 'Student, Politehnica',
    text: 'Am fost pregatit excelent pentru admiterea la Politehnica. Meditatiile de informatica m-au ajutat sa inteleg algoritmi complecsi intr-un mod simplu si intuitiv.',
    rating: 5,
  },
  {
    name: 'Cristina Rusu',
    role: 'Parinte',
    text: 'Fiul meu a trecut de la nota 5 la nota 9 la fizica in doar 3 luni. Profesorii sunt profesionisti si dedicati. Platforme foarte usor de utilizat.',
    rating: 5,
  },
  {
    name: 'Dan Vasilescu',
    role: 'Elev, clasa a X-a',
    text: 'Meditatiile online sunt super convenabile. Pot invata de acasa, iar profesoara de limba engleza m-a ajutat sa obtin certificatul Cambridge B2.',
    rating: 5,
  },
  {
    name: 'Ioana Stanciu',
    role: 'Parinte',
    text: 'Fiica mea avea probleme mari cu chimia. Dupa 2 luni de meditatii, a inceput sa inteleaga materia si sa ia note mari. Suntem foarte multumiti!',
    rating: 5,
  },
  {
    name: 'Radu Mihai',
    role: 'Elev, clasa a VIII-a',
    text: 'M-am pregatit pentru evaluarea nationala si am obtinut 9.65 la matematica. Profesorul meu stia exact ce tipuri de probleme sa exersam. Super recomandat!',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimoniale" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent-100 text-accent-700 text-sm font-semibold rounded-full mb-4">
            Testimoniale
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Ce spun elevii si parintii
          </h2>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            Sute de elevi si-au imbunatatit notele si au atins obiectivele
            academice cu ajutorul profesorilor nostri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group bg-gray-50 hover:bg-white rounded-2xl p-7 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-primary-200 mb-4" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-accent-400 fill-accent-400"
                  />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
