import { useEffect, type FC, type ReactNode } from 'react';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Dialog: FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Tactile Backdrop */}
      <div
        className="fixed inset-0 bg-[#24302A]/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Window */}
      <div
        className={`relative w-full ${widthClasses} bg-white dark:bg-[#25312A] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] rounded-2xl shadow-[6px_6px_0px_#24302A] dark:shadow-[6px_6px_0px_#0E1410] p-6 text-[#24302A] dark:text-[#FEFAF3] z-10 animate-in fade-in zoom-in-95 duration-150`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-bold font-heading text-[#24302A] dark:text-[#FEFAF3]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-[#55655B] dark:text-[#B9C7BD]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg border border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#1C2620] hover:bg-[#F6E2E9] active:translate-y-[1px] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#24302A] dark:text-[#FEFAF3]" />
          </button>
        </div>

        <div className="py-2">{children}</div>

        {footer && (
          <div className="mt-6 pt-4 border-t border-[#24302A]/15 dark:border-[#3A4A40] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
