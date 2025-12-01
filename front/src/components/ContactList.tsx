import { useState } from 'react';
import { Search, Phone, PhoneMissed } from 'lucide-react';
import { Contact } from '../types';

interface ContactListProps {
  contacts: Contact[];
  onCall: (contact: Contact) => void;
  missedCallsCount: number;
  onShowMissedCalls: () => void;
}

export function ContactList({ contacts, onCall, missedCallsCount, onShowMissedCalls }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск контактов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Missed Calls Button */}
        {missedCallsCount > 0 && (
          <button
            onClick={onShowMissedCalls}
            className="w-full bg-red-50 border-b border-red-200 p-4 flex items-center justify-between hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <PhoneMissed className="text-red-600" size={20} />
              <span className="text-red-900">Пропущенные вызовы</span>
            </div>
            <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
              {missedCallsCount}
            </div>
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
