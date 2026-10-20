import { type FC, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const Tabs: FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm';

  return (
    <div
      role="tablist"
      className={`inline-flex flex-wrap gap-1.5 p-1 bg-[#FEFAF3] dark:bg-[#1C2620] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] rounded-xl shadow-[2px_2px_0px_#24302A] dark:shadow-[2px_2px_0px_#0E1410] ${className}`}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-1.5 font-medium rounded-lg transition-all cursor-pointer select-none ${sizeClasses} ${
              isActive
                ? 'bg-[#B8CFB3] text-[#24302A] border border-[#24302A] shadow-[1px_1px_0px_#24302A] font-semibold'
                : 'text-[#55655B] dark:text-[#B9C7BD] hover:bg-[#F6E2E9]/50 hover:text-[#24302A] dark:hover:text-[#FEFAF3] border border-transparent'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-[4px] bg-[#24302A] text-[#FEFAF3]">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
