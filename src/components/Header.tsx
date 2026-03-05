import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Materii', href: '/materii' },
  { label: 'Cum functioneaza', href: '/#cum-functioneaza' },
  { label: 'Profesori', href: '/#profesori' },
  { label: 'Testimoniale', href: '/#testimoniale' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const showSolid = scrolled || !isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolid
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-colors duration-300 ${
              showSolid ? 'bg-primary-600' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 ${
              showSolid ? 'text-gray-900' : 'text-white'
            }`}>
              Meditatii<span className="text-accent-400">Pro</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isRouterLink = !link.href.includes('#');
              if (isRouterLink) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      showSolid
                        ? 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    showSolid
                      ? 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <Link
              to="/inscriere-profesor"
              className="ml-4 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent-500/25"
            >
              Devino profesor
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              showSolid ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isRouterLink = !link.href.includes('#');
              if (isRouterLink) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-4 py-3 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                >
                  {link.label}
                </a>
              );
            })}
            <Link
              to="/inscriere-profesor"
              className="block mt-3 px-4 py-3 bg-accent-500 hover:bg-accent-600 text-white text-center font-semibold rounded-xl transition-colors"
            >
              Devino profesor
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
