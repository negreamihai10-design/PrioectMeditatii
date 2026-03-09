import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Inbox,
  Clock,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Mail,
  User,
  BookOpen,
  MessageCircle,
  Filter,
  Coins,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCreditBalance, spendCredits } from '../hooks/useCredits';
import {
  useTutorRequests,
  unlockRequest,
  deleteRequest,
  type TutorRequestWithSubject,
} from '../hooks/useRequests';
import RequestChat from '../components/RequestChat';

const UNLOCK_COST = 1;

type StatusFilter = 'all' | 'pending' | 'accepted' | 'declined';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'In asteptare', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  accepted: { label: 'Acceptat', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  declined: { label: 'Refuzat', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

function ConfirmDeleteModal({
  onConfirm,
  onCancel,
  deleting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-red-100 mb-4">
            <Trash2 className="w-7 h-7 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Sterge cererea</h3>
          <p className="text-sm text-gray-500">
            Esti sigur ca vrei sa stergi aceasta cerere? Aceasta actiune nu poate fi anulata.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
          >
            Anuleaza
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {deleting ? (
              <div className="w-4 h-4 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sterge'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function LockedCard({
  request,
  onUnlock,
  onDelete,
  unlocking,
  balance,
}: {
  request: TutorRequestWithSubject;
  onUnlock: () => void;
  onDelete: () => void;
  unlocking: boolean;
  balance: number;
}) {
  const config = statusConfig[request.status] ?? statusConfig.pending;
  const StatusIcon = config.icon;
  const formattedDate = new Date(request.created_at).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const hasCredits = balance >= UNLOCK_COST;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-400">Cerere noua</h3>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {request.subjects?.name ?? 'Necunoscut'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${config.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {config.label}
            </span>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sterge cererea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-400 mb-4">{formattedDate}</div>

        <div className="relative bg-gray-50 rounded-xl p-4 mb-4 overflow-hidden">
          <div className="blur-sm select-none pointer-events-none">
            <p className="text-sm text-gray-700">
              Aceasta cerere contine informatii despre elev si mesajul sau. Deblocheaza cererea pentru a vedea detaliile complete si a incepe o conversatie.
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/60">
            <Lock className="w-6 h-6 text-gray-300" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onUnlock}
            disabled={unlocking || !hasCredits}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-sm hover:shadow-lg hover:shadow-primary-600/25"
          >
            {unlocking ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                Deblocheaza ({UNLOCK_COST} credit)
              </>
            )}
          </button>
          {!hasCredits && (
            <Link
              to="/credite"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700 transition-colors"
            >
              <Coins className="w-4 h-4" />
              Cumpara credite
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function UnlockedCard({
  request,
  userId,
  onDelete,
}: {
  request: TutorRequestWithSubject;
  userId: string;
  onDelete: () => void;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const config = statusConfig[request.status] ?? statusConfig.pending;
  const StatusIcon = config.icon;
  const formattedDate = new Date(request.created_at).toLocaleDateString('ro-RO', {
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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg">
              <Unlock className="w-3 h-3" />
              Deblocat
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${config.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {config.label}
            </span>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sterge cererea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
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

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 text-sm hover:shadow-lg hover:shadow-primary-600/25"
        >
          <MessageCircle className="w-4 h-4" />
          {chatOpen ? 'Inchide conversatia' : 'Deschide conversatia'}
        </button>
      </div>

      {chatOpen && (
        <div className="border-t border-gray-100">
          <RequestChat
            request={request}
            currentUserId={userId}
            currentRole="tutor"
          />
        </div>
      )}
    </div>
  );
}

export default function RequestsPage() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const { requests, loading, refresh } = useTutorRequests(user?.id);
  const { balance, refreshCredits } = useCreditBalance(user?.id, role);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

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

  const handleUnlock = async (request: TutorRequestWithSubject) => {
    if (!user) return;
    setError('');
    setUnlockingId(request.id);

    if (balance < UNLOCK_COST) {
      setError('Nu ai suficiente credite. Cumpara credite pentru a debloca cereri.');
      setUnlockingId(null);
      return;
    }

    const { error: creditError } = await spendCredits(
      user.id,
      UNLOCK_COST,
      `Deblocare cerere de la ${request.subjects?.name ?? 'elev'}`
    );

    if (creditError) {
      setError('Eroare la procesarea creditelor. Incearca din nou.');
      setUnlockingId(null);
      return;
    }

    const { error: unlockError } = await unlockRequest(request.id);

    if (unlockError) {
      setError('Eroare la deblocarea cererii. Incearca din nou.');
      setUnlockingId(null);
      return;
    }

    await Promise.all([refresh(), refreshCredits()]);
    setUnlockingId(null);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeletingId(confirmDeleteId);

    const { error: delError } = await deleteRequest(confirmDeleteId);

    if (delError) {
      setError('Cererea nu a putut fi stearsa. Incearca din nou.');
      setDeletingId(null);
      setConfirmDeleteId(null);
      return;
    }

    setConfirmDeleteId(null);
    setDeletingId(null);
    await refresh();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-600 text-white">
                  <Inbox className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900">Cereri de la elevi</h1>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-50 text-accent-700 border border-accent-200 rounded-lg text-xs font-bold">
                <Coins className="w-3.5 h-3.5" />
                {balance} credite
              </div>
            </div>
            <p className="text-gray-500">
              Deblocheaza cererile cu credite pentru a vedea detaliile elevilor si a incepe o conversatie.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

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
              {filtered.map((req) =>
                req.unlocked ? (
                  <UnlockedCard
                    key={req.id}
                    request={req}
                    userId={user!.id}
                    onDelete={() => setConfirmDeleteId(req.id)}
                  />
                ) : (
                  <LockedCard
                    key={req.id}
                    request={req}
                    onUnlock={() => handleUnlock(req)}
                    onDelete={() => setConfirmDeleteId(req.id)}
                    unlocking={unlockingId === req.id}
                    balance={balance}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>

      {confirmDeleteId && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
          deleting={deletingId === confirmDeleteId}
        />
      )}
    </>
  );
}
