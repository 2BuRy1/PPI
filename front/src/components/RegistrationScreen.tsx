import { FormEvent, useEffect, useRef, useState } from 'react';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { RegistrationData } from '../types';

interface RegistrationScreenProps {
  onRegister: (data: RegistrationData) => void;
}

export function RegistrationScreen({ onRegister }: RegistrationScreenProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    pinCode: '',
  });
  const [hasConsented, setHasConsented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (field: keyof RegistrationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!formData.fullName || !formData.email || !formData.pinCode) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    if (!hasConsented) {
      setError('Подтвердите согласие на обработку данных');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Имитируем сетевой запрос
    timeoutRef.current = window.setTimeout(() => {
      onRegister(formData);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
            <UserPlus className="text-blue-600" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Регистрация</h1>
            <p className="text-gray-500">Создайте профиль, чтобы перейти к приложению звонков</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Как к вам обращаться?
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Мария Иванова"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Рабочая почта
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="name@company.ru"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пин-код для входа
            </label>
            <input
              type="password"
              value={formData.pinCode}
              onChange={(e) => handleChange('pinCode', e.target.value)}
              maxLength={4}
              placeholder="••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none tracking-[0.5em]"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={hasConsented}
              onChange={(e) => setHasConsented(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>
              Подтверждаю корректность данных и разрешаю обработку персональной информации
            </span>
          </label>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Создаем профиль...' : 'Перейти в приложение'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
          <ShieldCheck size={20} className="text-blue-500" />
          <p>Мы используем данные только для имитации регистрации.</p>
        </div>
      </div>
    </div>
  );
}
