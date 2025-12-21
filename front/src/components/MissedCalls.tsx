import { ArrowLeft, Phone } from 'lucide-react';
import { MissedCall, Contact } from '../types';

interface MissedCallsProps {
  missedCalls: MissedCall[];
  onBack: () => void;
  onCall: (contact: Contact) => void;
  contacts: Contact[];
}

export function MissedCalls({ missedCalls, onBack, onCall, contacts }: MissedCallsProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    if (hours < 24) return `${hours} ч. назад`;
    return `${days} дн. назад`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-lg">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 min-h-[72px] flex items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="hover:bg-red-700 p-2 rounded-lg transition-colors"
              aria-label="Назад"
            >
              <ArrowLeft size={24} />
            </button>
            <h1>Пропущенные вызовы</h1>
          </div>
        </div>

        {/* Missed Calls List */}
        <div className="divide-y divide-gray-200">
          {missedCalls.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Нет пропущенных вызовов
            </div>
          ) : (
            missedCalls.map((missedCall) => (
              <div
                key={missedCall.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-red-600">{missedCall.contact.name}</div>
                  </div>
                  <div className="text-gray-600">{missedCall.contact.phone}</div>
                  <div className="text-gray-500">{formatTime(missedCall.timestamp)}</div>
                </div>
                <button
                  onClick={() => onCall(missedCall.contact)}
                  className="ml-4 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
                  aria-label={`Позвонить ${missedCall.contact.name}`}
                >
                  <Phone size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
