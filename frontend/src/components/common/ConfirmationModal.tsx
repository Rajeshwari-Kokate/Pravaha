import { useEffect, useRef, type FC } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab' && modalRef.current) {
          const focusables = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24302A]/60 dark:bg-black/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#25312A] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] p-6 shadow-[6px_6px_0px_#24302A] dark:shadow-[6px_6px_0px_#0E1410] text-left transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg border ${
                isDestructive
                  ? 'bg-[#FEFAF3] dark:bg-[#25312A] border-2 border-[#B3261E] text-[#B3261E] dark:text-[#F08A80]'
                  : 'bg-[#B8CFB3] border-[#24302A] text-[#24302A]'
              }`}
            >
              <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            </div>
            <h2 id="modal-title" className="text-base font-bold font-heading text-[#24302A] dark:text-[#FEFAF3]">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg border border-[#24302A]/20 dark:border-[#3A4A40] text-[#24302A] dark:text-[#FEFAF3] hover:bg-[#F6E2E9]/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p id="modal-desc" className="mt-3 text-xs text-[#55655B] dark:text-[#B9C7BD] leading-relaxed">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#1C2620] text-[#24302A] dark:text-[#FEFAF3] shadow-[1px_1px_0px_#24302A] hover:bg-[#F6E2E9]/40 active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#24302A] shadow-[2px_2px_0px_#24302A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
              isDestructive
                ? 'bg-[#B3261E] text-white hover:bg-[#8F1A14]'
                : 'bg-[#84A282] text-[#24302A] hover:bg-[#739171]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
