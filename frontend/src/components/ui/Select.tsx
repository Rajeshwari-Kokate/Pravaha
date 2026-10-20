import { forwardRef, type SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, className = '', children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#24302A] dark:text-[#FEFAF3]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none px-3 py-2 text-sm bg-white dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] rounded-lg shadow-[2px_2px_0px_rgba(36,48,42,0.15)] dark:shadow-[2px_2px_0px_#0E1410] focus:outline-none focus:ring-2 focus:ring-[#4F6B52] transition-all cursor-pointer ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#24302A] dark:text-[#FEFAF3]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {helperText && (
          <p className="text-xs text-[#55655B] dark:text-[#B9C7BD]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
