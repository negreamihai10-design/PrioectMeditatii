import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import TutorRegistrationPage from './pages/TutorRegistrationPage';
import StudentRegistrationPage from './pages/StudentRegistrationPage';
import TutorProfilePage from './pages/TutorProfilePage';
import CreditsPage from './pages/CreditsPage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <ScrollToTop />
        <Header />
        <LoginModal />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/materii" element={<SubjectsPage />} />
          <Route path="/materii/:slug" element={<SubjectDetailPage />} />
          <Route path="/inscriere-profesor" element={<TutorRegistrationPage />} />
          <Route path="/inscriere-elev" element={<StudentRegistrationPage />} />
          <Route path="/profil" element={<TutorProfilePage />} />
          <Route path="/credite" element={<CreditsPage />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}
