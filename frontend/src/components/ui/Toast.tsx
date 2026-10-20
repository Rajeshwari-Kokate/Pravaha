import { type FC, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  onClose: () => void;
  action?: ReactNode;
}

export const Toast: FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  action,
}) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#2F4A38] dark:text-[#B8CFB3] shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-[#C98A1B] dark:text-[#E6B04A] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#B3261E] dark:text-[#F08A80] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#3A7F8F] dark:text-[#6FC0D0] shrink-0" />,
  };

  const bgClasses = {
    success: 'bg-[#B8CFB3]/40 border-[#2F4A38]',
    warning: 'bg-[#FEFAF3] dark:bg-[#25312A] border-[#C98A1B]',
    error: 'bg-[#FEFAF3] dark:bg-[#25312A] border-2 border-[#B3261E]',
    info: 'bg-white dark:bg-[#25312A] border-[#24302A]',
  }[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 rounded-xl border-[1.5px] shadow-[3px_3px_0px_#24302A] dark:shadow-[3px_3px_0px_#0E1410] max-w-sm w-full transition-all text-[#24302A] dark:text-[#FEFAF3] ${bgClasses}`}
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message && (
          <p className="mt-0.5 text-xs text-[#55655B] dark:text-[#B9C7BD]">{message}</p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="p-1 rounded-[4px] hover:bg-[#F6E2E9]/60 active:translate-y-[1px] transition-colors"
      >
        <X className="w-4 h-4 text-[#55655B] dark:text-[#B9C7BD]" />
      </button>
    </div>
  );
};
