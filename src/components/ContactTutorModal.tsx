import { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sendRequest } from '../hooks/useRequests';

interface Props {
  open: boolean;
  onClose: () => void;
  tutorId: string;
  tutorName: string;
  subjectId: string;
  subjectName: string;
}

export default function ContactTutorModal({
  open,
  onClose,
  tutorId,
  tutorName,
  subjectId,
  subjectName,
}: Props) {
  const { user, role, openLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      openLogin();
      return;
    }

    if (role !== 'student') {
      setErrorMsg('Doar elevii pot trimite cereri catre profesori.');
      setStatus('error');
      return;
    }

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Te rugam sa completezi toate campurile.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    const { error } = await sendRequest({
      student_id: user.id,
      tutor_id: tutorId,
      subject_id: subjectId,
      student_name: name.trim(),
      student_email: email.trim(),
      message: message.trim(),
    });

    if (error) {
      setErrorMsg('Nu am putut trimite cererea. Incearca din nou.');
      setStatus('error');
      return;
    }

    fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-student-request`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutor_id: tutorId,
          student_name: name.trim(),
          student_email: email.trim(),
          subject_name: subjectName,
          message: message.trim(),
        }),
      }
    ).catch(() => {});

    setStatus('success');
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setMessage('');
    setStatus('idle');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Contacteaza profesor</h3>
            <p className="text-sm text-gray-500">
              {tutorName} &middot; {subjectName}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Cerere trimisa!</h4>
            <p className="text-gray-500 mb-6">
              Profesorul va primi cererea ta si te va contacta in curand.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
            >
              Inchide
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            {!user && (
              <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Trebuie sa fii autentificat ca elev pentru a trimite o cerere.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Numele tau</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Introdu numele complet"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplu.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mesaj</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Descrie ce ajutor ai nevoie, nivelul tau, disponibilitatea..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold rounded-xl transition-all duration-200"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Trimite cererea
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
