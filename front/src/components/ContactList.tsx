import { useEffect, useRef, useState } from 'react';
import { Phone, PhoneMissed, UploadCloud } from 'lucide-react';
import { Contact } from '../types';

interface ContactListProps {
  contacts: Contact[];
  onCall: (contact: Contact) => void;
  missedCallsCount: number;
  onShowMissedCalls: () => void;
}

export function ContactList({ contacts, onCall, missedCallsCount, onShowMissedCalls }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const importTimerRef = useRef<number | null>(null);
  const messageTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (importTimerRef.current) {
        clearTimeout(importTimerRef.current);
      }
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  const handleImportContacts = () => {
    if (importTimerRef.current) {
      clearTimeout(importTimerRef.current);
    }
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    setIsImporting(true);
    setImportMessage(null);

    importTimerRef.current = window.setTimeout(() => {
      setIsImporting(false);
      setImportMessage('Контакты импортированы');
      messageTimerRef.current = window.setTimeout(() => setImportMessage(null), 3000);
    }, 1000);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        {importMessage && (
          <div className="px-6 py-3 bg-green-50 text-green-800 text-sm border-b border-green-100">
            {importMessage}
          </div>
        )}
        {/* Search */}
        <div className="p-6 bg-blue-600">
          <div className="search-import-stack">
            <div className="search-input-shell">
              <input
                type="text"
                placeholder="Поиск контактов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full text-white placeholder-white text-2xl font-medium"
              />
            </div>

            <div className="bg-white rounded-[4.5rem] shadow-2xl shadow-blue-900/30 p-4 border border-white/70">
              <button
                onClick={handleImportContacts}
                disabled={isImporting}
                className="w-full flex items-center justify-center gap-6 px-16 py-10 rounded-[4rem] text-blue-900 text-3xl font-black tracking-wider bg-gradient-to-r from-blue-200 via-white to-blue-50 border-4 border-white active:scale-95 transition-transform disabled:opacity-60"
              >
                <UploadCloud size={40} />
                {isImporting ? 'Импортируем...' : 'Импортировать контакты'}
              </button>
            </div>
          </div>
        </div>

        {/* Missed Calls Button */}
        {missedCallsCount > 0 && (
          <button
            onClick={onShowMissedCalls}
            className="w-full bg-red-600 text-white border-b-2 border-red-700 px-6 py-5 min-h-[88px] flex items-center gap-4 hover:bg-red-700 active:bg-red-800 transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <PhoneMissed className="text-white" size={24} />
            </div>
            <span className="font-bold text-lg">Посмотреть пропущенные вызовы</span>
          </button>
        )}

        {/* Contacts List */}
        <div className="divide-y divide-gray-200">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Контакты не найдены
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div>{contact.name}</div>
                    {contact.blocked && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                        Заблокирован
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600">{contact.phone}</div>
                </div>
                <button
                  onClick={() => onCall(contact)}
                  className="ml-4 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
                  aria-label={`Позвонить ${contact.name}`}
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
