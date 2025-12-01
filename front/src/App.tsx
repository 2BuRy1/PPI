import { useState } from 'react';
import { ContactList } from './components/ContactList';
import { CallScreen } from './components/CallScreen';
import { MissedCalls } from './components/MissedCalls';
import { Contact, CallState, MissedCall } from './types';

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Алексей Иванов', phone: '+7 (999) 123-45-67', blocked: false },
  { id: '2', name: 'Мария Петрова', phone: '+7 (999) 234-56-78', blocked: false },
  { id: '3', name: 'Дмитрий Смирнов', phone: '+7 (999) 345-67-89', blocked: true },
  { id: '4', name: 'Елена Кузнецова', phone: '+7 (999) 456-78-90', blocked: false },
  { id: '5', name: 'Сергей Попов', phone: '+7 (999) 567-89-01', blocked: false },
  { id: '6', name: 'Анна Соколова', phone: '+7 (999) 678-90-12', blocked: false },
  { id: '7', name: 'Игорь Новиков', phone: '+7 (999) 789-01-23', blocked: false },
];

export default function App() {
  const [callState, setCallState] = useState<CallState | null>(null);
  const [missedCalls, setMissedCalls] = useState<MissedCall[]>([]);
  const [showMissedCalls, setShowMissedCalls] = useState(false);

  const handleCall = (contact: Contact) => {
    if (contact.blocked) {
      setCallState({
        type: 'blocked',
        contact,
      });
      
      setTimeout(() => {
        setCallState(null);
      }, 3000);
    } else {
      setCallState({
        type: 'outgoing',
        contact,
      });
    }
  };

  const handleEndCall = () => {
    setCallState(null);
  };

  const handleAnswer = () => {
    if (callState?.type === 'incoming') {
      setCallState({
        ...callState,
        type: 'active',
      });
    }
  };

  const handleDecline = () => {
    if (callState?.type === 'incoming') {
      setMissedCalls(prev => [
        {
          id: Date.now().toString(),
          contact: callState.contact,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
    setCallState(null);
  };

  // Симулируем входящий звонок через 5 секунд после загрузки
  useState(() => {
    setTimeout(() => {
      const randomContact = INITIAL_CONTACTS[Math.floor(Math.random() * INITIAL_CONTACTS.length)];
      setCallState({
        type: 'incoming',
        contact: randomContact,
      });
    }, 5000);
  });

  if (callState) {
    return (
      <CallScreen
        callState={callState}
        onEndCall={handleEndCall}
        onAnswer={handleAnswer}
        onDecline={handleDecline}
      />
    );
  }

  if (showMissedCalls) {
    return (
      <MissedCalls
        missedCalls={missedCalls}
        onBack={() => setShowMissedCalls(false)}
        onCall={handleCall}
        contacts={INITIAL_CONTACTS}
      />
    );
  }

  return (
    <ContactList
      contacts={INITIAL_CONTACTS}
      onCall={handleCall}
      missedCallsCount={missedCalls.length}
      onShowMissedCalls={() => setShowMissedCalls(true)}
    />
  );
}
