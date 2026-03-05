import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';

export default function Footer() {
  const { subjects } = useSubjects();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-primary-600 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Meditatii<span className="text-accent-400">Pro</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Platforma de meditatii care conecteaza elevii cu cei mai buni
              profesori din Romania. Online si fizic, pentru toate materiile.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2.5 bg-gray-800 hover:bg-primary-600 rounded-xl transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-gray-800 hover:bg-primary-600 rounded-xl transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-gray-800 hover:bg-primary-600 rounded-xl transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">Materii</h4>
            <ul className="space-y-3">
              {subjects.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/materii/${s.slug}`}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">Companie</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/materii" className="text-sm hover:text-primary-400 transition-colors">
                  Toate materiile
                </Link>
              </li>
              <li>
                <a href="/#cum-functioneaza" className="text-sm hover:text-primary-400 transition-colors">
                  Cum functioneaza
                </a>
              </li>
              <li>
                <a href="/#profesori" className="text-sm hover:text-primary-400 transition-colors">
                  Profesori
                </a>
              </li>
              <li>
                <a href="/#testimoniale" className="text-sm hover:text-primary-400 transition-colors">
                  Testimoniale
                </a>
              </li>
              <li>
                <Link to="/inscriere-profesor" className="text-sm hover:text-primary-400 transition-colors">
                  Inscriere profesor
                </Link>
              </li>
              <li>
                <Link to="/inscriere-elev" className="text-sm hover:text-primary-400 transition-colors">
                  Inscriere elev
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>+40 721 234 567</li>
              <li>contact@meditatiipro.ro</li>
              <li>Disponibil in toata Romania</li>
              <li className="pt-2">
                <span className="text-xs text-gray-500">Program suport:</span>
                <br />
                Luni - Vineri: 09:00 - 20:00
                <br />
                Sambata: 10:00 - 16:00
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MeditatiiPro. Toate drepturile rezervate.
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-2 bg-gray-800 hover:bg-primary-600 rounded-xl transition-colors"
            aria-label="Sus"
          >
            <ArrowUp className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
