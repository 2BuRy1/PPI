export interface Contact {
  id: string;
  name: string;
  phone: string;
  blocked: boolean;
}

export interface CallState {
  type: 'incoming' | 'outgoing' | 'active' | 'blocked';
  contact: Contact;
}

export interface MissedCall {
  id: string;
  contact: Contact;
  timestamp: Date;
}

export interface CallHistoryItem {
  id: string;
  contact: Contact;
  type: 'incoming' | 'outgoing' | 'missed' | 'blocked';
  timestamp: Date;
  duration?: number; // в секундах, только для завершенных звонков
}