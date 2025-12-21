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
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <div className="tab-switch-panel">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-pressed={isActive}
                className={`tab-switch-button ${isActive ? 'is-active' : ''}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
