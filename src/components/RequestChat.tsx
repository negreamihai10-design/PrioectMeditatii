import { useState, useRef, useEffect } from 'react';
import { Send, User, GraduationCap } from 'lucide-react';
import {
  useRequestMessages,
  sendMessage,
  type TutorRequestWithSubject,
} from '../hooks/useRequests';

interface Props {
  request: TutorRequestWithSubject;
  currentUserId: string;
  currentRole: 'tutor' | 'student';
}

export default function RequestChat({ request, currentUserId, currentRole }: Props) {
  const { messages, loading, refreshMessages } = useRequestMessages(request.id);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(refreshMessages, 8000);
    return () => clearInterval(interval);
  }, [refreshMessages]);

  const handleSend = async () => {
    if (!body.trim() || sending) return;
    setSending(true);
    await sendMessage({
      request_id: request.id,
      sender_id: currentUserId,
      sender_role: currentRole,
      body: body.trim(),
    });
    setBody('');
    await refreshMessages();
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[420px]">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 mb-1">Mesajul initial</p>
          <p className="text-sm text-gray-700">{request.message}</p>
        </div>

        {loading && messages.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
          </div>
        )}

        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender_role === 'tutor'
                  ? 'bg-primary-100'
                  : 'bg-accent-100'
              }`}>
                {msg.sender_role === 'tutor' ? (
                  <GraduationCap className="w-3.5 h-3.5 text-primary-600" />
                ) : (
                  <User className="w-3.5 h-3.5 text-accent-600" />
                )}
              </div>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isOwn
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}
              >
                {msg.body}
                <p className={`text-[10px] mt-1 ${isOwn ? 'text-primary-200' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString('ro-RO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Scrie un mesaj..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!body.trim() || sending}
            className="flex items-center justify-center w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-xl transition-colors flex-shrink-0"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
