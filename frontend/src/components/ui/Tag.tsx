import { type FC, type ReactNode } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface TagProps {
  variant?: 'pink' | 'sage' | 'amber' | 'critical' | 'neutral' | 'synthetic';
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const Tag: FC<TagProps> = ({
  variant = 'neutral',
  children,
  icon,
  className = '',
}) => {
  const getIcon = () => {
    if (icon) return icon;
    if (variant === 'critical') return <AlertCircle className="w-3 h-3 text-[#B3261E] dark:text-[#F08A80]" aria-hidden="true" />;
    if (variant === 'amber') return <AlertTriangle className="w-3 h-3 text-[#C98A1B] dark:text-[#E6B04A]" aria-hidden="true" />;
    if (variant === 'sage') return <CheckCircle className="w-3 h-3 text-[#2F4A38] dark:text-[#B8CFB3]" aria-hidden="true" />;
    if (variant === 'synthetic') return <Info className="w-3 h-3 text-[#55655B] dark:text-[#B9C7BD]" aria-hidden="true" />;
    return null;
  };

  const variantClasses = {
    pink: 'bg-[#F6E2E9] text-[#24302A] border-[#24302A]',
    sage: 'bg-[#B8CFB3] text-[#24302A] border-[#24302A]',
    amber: 'bg-[#FEFAF3] dark:bg-[#25312A] text-[#8F5E05] dark:text-[#E6B04A] border-[#C98A1B]',
    critical: 'bg-[#FEFAF3] dark:bg-[#25312A] text-[#B3261E] dark:text-[#F08A80] border-2 border-[#B3261E]',
    neutral: 'bg-[#FEFAF3] dark:bg-[#1C2620] text-[#24302A] dark:text-[#FEFAF3] border-[#24302A] dark:border-[#3A4A40]',
    synthetic: 'bg-[#FEFAF3] dark:bg-[#25312A] text-[#55655B] dark:text-[#B9C7BD] border-dashed border-[#55655B]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border font-mono text-[11px] font-bold select-none tracking-tight shadow-[1px_1px_0px_#24302A] dark:shadow-[1px_1px_0px_#0E1410] ${variantClasses} ${className}`}
    >
      {getIcon()}
      <span>{children}</span>
    </span>
  );
};
