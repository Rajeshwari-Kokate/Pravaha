import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      children,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    }[size];

    const variantClasses = {
      primary:
        'bg-[#84A282] text-[#24302A] border-2 border-[#24302A] shadow-[3px_3px_0px_#24302A] hover:shadow-[4px_4px_0px_#24302A] active:shadow-[1px_1px_0px_#24302A] active:translate-x-[2px] active:translate-y-[2px]',
      secondary:
        'bg-[#FEFAF3] dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] shadow-[2px_2px_0px_#24302A] dark:shadow-[2px_2px_0px_#0E1410] hover:shadow-[3px_3px_0px_#24302A] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
      outline:
        'bg-transparent text-[#24302A] dark:text-[#FEFAF3] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] hover:bg-[#F6E2E9]/40 active:translate-y-[1px]',
      ghost:
        'bg-transparent text-[#24302A] dark:text-[#FEFAF3] hover:bg-[#F6E2E9]/40 active:bg-[#B8CFB3]/30',
      critical:
        'bg-[#B3261E] text-white border-2 border-[#24302A] shadow-[3px_3px_0px_#24302A] hover:shadow-[4px_4px_0px_#24302A] active:shadow-[1px_1px_0px_#24302A] active:translate-x-[2px] active:translate-y-[2px]',
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
