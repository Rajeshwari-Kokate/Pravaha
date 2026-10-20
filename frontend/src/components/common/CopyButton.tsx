import { useState, type FC } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
  onCopied?: () => void;
}

export const CopyButton: FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  className = '',
  onCopied,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      if (onCopied) onCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`${label}: ${copied ? 'Copied' : 'Click to copy'}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] shadow-[2px_2px_0px_#24302A] dark:shadow-[2px_2px_0px_#0E1410] hover:bg-[#F6E2E9]/60 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#2F4A38] dark:text-[#B8CFB3]" aria-hidden="true" />
          <span className="text-[#2F4A38] dark:text-[#B8CFB3] font-bold">Copied</span>
          <span className="sr-only" role="status" aria-live="polite">
            Content copied to clipboard
          </span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-[#55655B] dark:text-[#B9C7BD]" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
