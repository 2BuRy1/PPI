import { useEffect, useState } from 'react';
import { Phone, PhoneOff, PhoneIncoming } from 'lucide-react';
import { CallState } from '../types';

interface CallScreenProps {
  callState: CallState;
  onEndCall: () => void;
  onAnswer: () => void;
  onDecline: () => void;
}

export function CallScreen({ callState, onEndCall, onAnswer, onDecline }: CallScreenProps) {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (callState.type === 'active') {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [callState.type]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (callState.type) {
      case 'incoming':
        return 'Входящий вызов...';
      case 'outgoing':
        return 'Вызов...';
      case 'active':
        return formatDuration(callDuration);
      case 'blocked':
        return 'Контакт заблокирован';
      default:
        return '';
    }
  };

  const getBackgroundColor = () => {
    switch (callState.type) {
      case 'blocked':
        return 'bg-red-600';
      case 'incoming':
        return 'bg-blue-600';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundColor()} text-white flex flex-col items-center justify-between p-8`}>
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Avatar Circle */}
        <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
          <div className="text-6xl">
            {callState.contact.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Contact Name */}
        <h2 className="mb-2">{callState.contact.name}</h2>
        
        {/* Phone Number */}
        <div className="text-white text-opacity-80 mb-6">
          {callState.contact.phone}
        </div>

        {/* Status */}
        <div className="text-xl text-white text-opacity-90">
          {getStatusText()}
        </div>

        {callState.type === 'blocked' && (
          <div className="mt-4 text-center text-white text-opacity-90">
            Невозможно совершить звонок
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="w-full max-w-md">
        {callState.type === 'incoming' ? (
          <div className="flex justify-center gap-8">
            {/* Decline Button */}
            <button
              onClick={onDecline}
              className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
              aria-label="Отклонить"
            >
              <PhoneOff size={32} />
            </button>

            {/* Answer Button */}
            <button
              onClick={onAnswer}
              className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg"
              aria-label="Ответить"
            >
              <PhoneIncoming size={32} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            {/* End Call Button */}
            <button
              onClick={onEndCall}
              className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
              aria-label="Завершить звонок"
            >
              <PhoneOff size={32} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
