import { ReactNode } from 'react';

interface TabsProps {
  tabs: { id: string; label: string; content: ReactNode }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

