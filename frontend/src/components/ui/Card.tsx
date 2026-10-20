import { forwardRef, type HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'cream' | 'pink' | 'sage';
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'white', interactive = false, className = '', children, ...props }, ref) => {
    const variantClasses = {
      white: 'bg-white dark:bg-[#25312A]',
      cream: 'bg-[#FEFAF3] dark:bg-[#1C2620]',
      pink: 'bg-[#F6E2E9] dark:bg-[#25312A] border-[#24302A]',
      sage: 'bg-[#B8CFB3] dark:bg-[#2F4A38] text-[#24302A] dark:text-[#FEFAF3]',
    }[variant];

    const interactiveClasses = interactive
      ? 'hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#24302A] dark:hover:shadow-[4px_4px_0px_#0E1410] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#24302A] cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={`border-[1.5px] border-[#24302A] dark:border-[#3A4A40] rounded-xl p-4 shadow-[3px_3px_0px_#24302A] dark:shadow-[3px_3px_0px_#0E1410] transition-all text-[#24302A] dark:text-[#FEFAF3] ${variantClasses} ${interactiveClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
