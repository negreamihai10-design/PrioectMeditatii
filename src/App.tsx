import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import TutorRegistrationPage from './pages/TutorRegistrationPage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/materii" element={<SubjectsPage />} />
        <Route path="/materii/:slug" element={<SubjectDetailPage />} />
        <Route path="/inscriere-profesor" element={<TutorRegistrationPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
