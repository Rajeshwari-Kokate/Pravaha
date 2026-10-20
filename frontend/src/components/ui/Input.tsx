import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#24302A] dark:text-[#FEFAF3]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 text-sm bg-white dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] border-[1.5px] ${
            error
              ? 'border-[#B3261E] focus:ring-[#B3261E]'
              : 'border-[#24302A] dark:border-[#3A4A40] focus:border-[#4F6B52]'
          } rounded-lg shadow-[2px_2px_0px_rgba(36,48,42,0.15)] dark:shadow-[2px_2px_0px_#0E1410] focus:outline-none focus:ring-2 focus:ring-[#4F6B52] transition-all disabled:opacity-50 disabled:bg-[#FEFAF3] ${className}`}
          {...props}
        />
        {error && <p className="text-xs font-medium text-[#B3261E]">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-[#55655B] dark:text-[#B9C7BD]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
