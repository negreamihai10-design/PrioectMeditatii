import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Mail,
  User,
  BookOpen,
  MessageCircle,
  Filter,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  useTutorRequests,
  replyToRequest,
  type TutorRequestWithSubject,
} from '../hooks/useRequests';

type StatusFilter = 'all' | 'pending' | 'accepted' | 'declined';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'In asteptare', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  accepted: { label: 'Acceptat', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  declined: { label: 'Refuzat', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

function ReplyModal({
  request,
  onClose,
  onSent,
}: {
  request: TutorRequestWithSubject;
  onClose: () => void;
  onSent: () => void;
}) {
  const [reply, setReply] = useState('');
  const [action, setAction] = useState<'accepted' | 'declined' | null>(null);
  const [sending, setSending] = useState(false);

  const handleSend = async (status: 'accepted' | 'declined') => {
    setSending(true);
    setAction(status);
    await replyToRequest(request.id, reply.trim(), status);
    setSending(false);
    onSent();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Raspunde la cerere</h3>
          <p className="text-sm text-gray-500">
            De la {request.student_name} &middot; {request.subjects?.name}
          </p>
        </div>

        <div className="px-6 py-4">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 italic">"{request.message}"</p>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Raspunsul tau
          </label>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
            placeholder="Scrie un mesaj catre elev..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={() => handleSend('accepted')}
            disabled={sending}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors"
          >
            {sending && action === 'accepted' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Accepta
              </>
            )}
          </button>
          <button
            onClick={() => handleSend('declined')}
            disabled={sending}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-xl transition-colors"
          >
            {sending && action === 'declined' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Refuza
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Anuleaza
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestCard({
  request,
  onReply,
}: {
  request: TutorRequestWithSubject;
  onReply: () => void;
}) {
  const config = statusConfig[request.status] ?? statusConfig.pending;
  const StatusIcon = config.icon;
  const date = new Date(request.created_at);
  const formattedDate = date.toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{request.student_name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {request.student_email}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${config.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg">
            <BookOpen className="w-3 h-3" />
            {request.subjects?.name ?? 'Necunoscut'}
          </span>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">{request.message}</p>
        </div>

        {request.tutor_reply && (
          <div className="bg-primary-50 rounded-xl p-4 mb-4 border border-primary-100">
            <p className="text-xs font-semibold text-primary-700 mb-1 flex items-center gap-1">
              <Send className="w-3 h-3" />
              Raspunsul tau
            </p>
            <p className="text-sm text-primary-900 leading-relaxed">{request.tutor_reply}</p>
          </div>
        )}

        {request.status === 'pending' && (
          <button
            onClick={onReply}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Raspunde
          </button>
        )}
      </div>
    </div>
  );
}

export default function RequestsPage() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const { requests, loading, refresh } = useTutorRequests(user?.id);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [replyingTo, setReplyingTo] = useState<TutorRequestWithSubject | null>(null);

  if (!authLoading && (!user || role !== 'tutor')) {
    navigate('/');
    return null;
  }

  const filtered =
    statusFilter === 'all'
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: `Toate (${requests.length})` },
    { key: 'pending', label: `In asteptare (${pendingCount})` },
    { key: 'accepted', label: 'Acceptate' },
    { key: 'declined', label: 'Refuzate' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary-600 text-white">
              <Inbox className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Cereri de la elevi</h1>
          </div>
          <p className="text-gray-500">
            Gestioneaza cererile primite de la elevi care vor sa lucreze cu tine.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-all duration-200 ${
                statusFilter === f.key
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-20 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Inbox className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {statusFilter === 'all'
                ? 'Nicio cerere momentan'
                : 'Nicio cerere cu acest filtru'}
            </h3>
            <p className="text-gray-500 text-sm">
              {statusFilter === 'all'
                ? 'Cand un elev te contacteaza, cererea va aparea aici.'
                : 'Incearca sa schimbi filtrul pentru a vedea alte cereri.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onReply={() => setReplyingTo(req)}
              />
            ))}
          </div>
        )}
      </div>

      {replyingTo && (
        <ReplyModal
          request={replyingTo}
          onClose={() => setReplyingTo(null)}
          onSent={() => {
            setReplyingTo(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
