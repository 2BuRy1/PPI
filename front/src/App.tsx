import { useState, useEffect } from 'react';
import { ContactList } from './components/ContactList';
import { CallScreen } from './components/CallScreen';
import { MissedCalls } from './components/MissedCalls';
import { CallHistory } from './components/CallHistory';
import { Tabs } from './components/Tabs';
import { Contact, CallState, MissedCall, CallHistoryItem } from './types';

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
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'contacts' | 'history'>('contacts');
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);

  const handleCall = (contact: Contact) => {
    if (contact.blocked) {
      setCallState({
        type: 'blocked',
        contact,
      });
      
      // Добавляем в историю заблокированный звонок
      setCallHistory(prev => [
        {
          id: Date.now().toString(),
          contact,
          type: 'blocked',
          timestamp: new Date(),
        },
        ...prev,
      ]);
      
      setTimeout(() => {
        setCallState(null);
      }, 3000);
    } else {
      setCallState({
        type: 'outgoing',
        contact,
      });
      setCallStartTime(new Date());
    }
  };

  const handleEndCall = () => {
    if (callState && callStartTime) {
      const duration = Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000);
      
      // Добавляем завершенный звонок в историю
      if (callState.type === 'active' || callState.type === 'outgoing') {
        setCallHistory(prev => [
          {
            id: Date.now().toString(),
            contact: callState.contact,
            type: callState.type === 'active' ? 'incoming' : 'outgoing',
            timestamp: callStartTime,
            duration: duration > 0 ? duration : undefined,
          },
          ...prev,
        ]);
      }
    }
    
    setCallState(null);
    setCallStartTime(null);
  };

  const handleAnswer = () => {
    if (callState?.type === 'incoming') {
      const incomingTime = new Date();
      setCallState({
        ...callState,
        type: 'active',
      });
      setCallStartTime(incomingTime);
      
      // Добавляем входящий звонок в историю при ответе
      setCallHistory(prev => [
        {
          id: Date.now().toString(),
          contact: callState.contact,
          type: 'incoming',
          timestamp: incomingTime,
        },
        ...prev,
      ]);
    }
  };

  const handleDecline = () => {
    if (callState?.type === 'incoming') {
      const now = new Date();
      setMissedCalls(prev => [
        {
          id: Date.now().toString(),
          contact: callState.contact,
          timestamp: now,
        },
        ...prev,
      ]);
      
      // Добавляем пропущенный звонок в историю
      setCallHistory(prev => [
        {
          id: Date.now().toString(),
          contact: callState.contact,
          type: 'missed',
          timestamp: now,
        },
        ...prev,
      ]);
    }
    setCallState(null);
    setCallStartTime(null);
  };

  // Симулируем входящий звонок через 5 секунд после загрузки
  useEffect(() => {
    const timer = setTimeout(() => {
      const randomContact = INITIAL_CONTACTS[Math.floor(Math.random() * INITIAL_CONTACTS.length)];
      setCallState({
        type: 'incoming',
        contact: randomContact,
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
    <Tabs
      tabs={[
        {
          id: 'contacts',
          label: 'Контакты',
          content: (
            <ContactList
              contacts={INITIAL_CONTACTS}
              onCall={handleCall}
              missedCallsCount={missedCalls.length}
              onShowMissedCalls={() => setShowMissedCalls(true)}
            />
          ),
        },
        {
          id: 'history',
          label: 'История',
          content: (
            <CallHistory
              callHistory={callHistory}
              onCall={handleCall}
            />
          ),
        },
      ]}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as 'contacts' | 'history')}
    />
  );
}
