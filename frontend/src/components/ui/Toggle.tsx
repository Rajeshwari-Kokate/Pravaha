import { type FC } from 'react';

export interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
  className?: string;
}

export const Toggle: FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  description,
  className = '',
}) => {
  return (
    <label
      className={`flex items-start justify-between gap-3 select-none cursor-pointer group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="flex-1">
        {label && (
          <span className="block text-xs font-semibold uppercase tracking-wider text-[#24302A] dark:text-[#FEFAF3]">
            {label}
          </span>
        )}
        {description && (
          <span className="block text-xs text-[#55655B] dark:text-[#B9C7BD]">
            {description}
          </span>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-md border-2 border-[#24302A] dark:border-[#3A4A40] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F6B52] ${
          checked
            ? 'bg-[#84A282] shadow-[2px_2px_0px_#24302A] dark:shadow-[2px_2px_0px_#0E1410]'
            : 'bg-[#FEFAF3] dark:bg-[#1C2620]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-[3px] border border-[#24302A] bg-white transition-transform ${
            checked ? 'translate-x-5 bg-[#24302A]' : 'translate-x-1 bg-white'
          }`}
        />
      </button>
    </label>
  );
};
