/**
 * WorkspaceSidebar.tsx
 * Slim left sidebar with brand mark, core workspace navigation links,
 * and bottom Settings & Help triggers. Supports mobile drawer overlay.
 */
import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, GitCompare, FileText, BookOpen, Settings, HelpCircle, X } from 'lucide-react';
import { PravahaLogo } from '../common/PravahaLogo';

interface WorkspaceSidebarProps {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const WorkspaceSidebar: FC<WorkspaceSidebarProps> = ({
  onOpenSettings,
  onOpenHelp,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    { to: '/workspace', label: 'Workspace', icon: LayoutGrid },
    { to: '/scenarios', label: 'Scenarios', icon: GitCompare },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/methodology', label: 'Methodology', icon: BookOpen },
  ];

  const content = (
    <div className="w-56 h-full flex flex-col justify-between py-4 px-3 bg-surface select-none">
      <div className="flex flex-col gap-6">
        {/* Brand header */}
        <div className="px-2 pt-1 flex items-center justify-between">
          <PravahaLogo size={28} />
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-md text-ink-muted hover:text-ink hover:bg-pink/40"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5" aria-label="Workspace navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sage-300/40 text-sage-900 dark:text-cream font-bold border border-sage-500/30 shadow-sm'
                    : 'text-ink-muted hover:text-ink hover:bg-pink/50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom utility triggers */}
      <div className="flex flex-col gap-1.5 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => {
            onCloseMobile?.();
            onOpenSettings();
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-ink-muted hover:text-ink hover:bg-pink/50 transition-colors text-left"
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>
        <button
          type="button"
          onClick={() => {
            onCloseMobile?.();
            onOpenHelp();
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-ink-muted hover:text-ink hover:bg-pink/50 transition-colors text-left"
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>Help & Guide</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:flex shrink-0 border-r border-border z-30">
        {content}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full border-r border-border shadow-offset">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
