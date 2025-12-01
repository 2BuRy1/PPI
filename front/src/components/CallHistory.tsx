import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, PhoneOff } from 'lucide-react';
import { CallHistoryItem, Contact } from '../types';

interface CallHistoryProps {
  callHistory: CallHistoryItem[];
  onCall: (contact: Contact) => void;
}

export function CallHistory({ callHistory, onCall }: CallHistoryProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const callDate = new Date(date);
    const callDay = new Date(callDate.getFullYear(), callDate.getMonth(), callDate.getDate());

    const diffDays = Math.floor((today.getTime() - callDay.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Сегодня';
    } else if (diffDays === 1) {
      return 'Вчера';
    } else if (diffDays < 7) {
      return `${diffDays} дн. назад`;
    } else {
      return callDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: callDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
    }
  };

  const formatTimeOfDay = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallIcon = (type: CallHistoryItem['type']) => {
    switch (type) {
      case 'incoming':
        return <PhoneIncoming className="text-blue-600" size={20} />;
      case 'outgoing':
        return <PhoneOutgoing className="text-green-600" size={20} />;
      case 'missed':
        return <PhoneMissed className="text-red-600" size={20} />;
      case 'blocked':
        return <PhoneOff className="text-gray-600" size={20} />;
    }
  };

  const getCallTypeLabel = (type: CallHistoryItem['type']) => {
    switch (type) {
      case 'incoming':
        return 'Входящий';
      case 'outgoing':
        return 'Исходящий';
      case 'missed':
        return 'Пропущенный';
      case 'blocked':
        return 'Заблокирован';
    }
  };

  // Группируем звонки по датам
  const groupedCalls = callHistory.reduce((acc, call) => {
    const dateKey = formatTime(call.timestamp);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(call);
    return acc;
  }, {} as Record<string, CallHistoryItem[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        {/* Call History List */}
        {callHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Phone className="mx-auto mb-4 text-gray-400" size={48} />
            <p>История звонков пуста</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {Object.entries(groupedCalls).map(([dateKey, calls]) => (
              <div key={dateKey}>
                {/* Date Header */}
                <div className="bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 sticky top-0 z-10">
                  {dateKey}
                </div>
                {/* Calls for this date */}
                {calls.map((call) => (
                  <div
                    key={call.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getCallIcon(call.type)}
                      </div>
                      
                      {/* Contact Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-medium text-gray-900 truncate">
                            {call.contact.name}
                          </div>
                          {call.contact.blocked && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs flex-shrink-0">
                              Заблокирован
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {call.contact.phone}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{getCallTypeLabel(call.type)}</span>
                          {call.duration && (
                            <>
                              <span>•</span>
                              <span>{formatDuration(call.duration)}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatTimeOfDay(call.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Call Button */}
                    {!call.contact.blocked && (
                      <button
                        onClick={() => onCall(call.contact)}
                        className="ml-4 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors flex-shrink-0"
                        aria-label={`Позвонить ${call.contact.name}`}
                      >
                        <Phone size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

