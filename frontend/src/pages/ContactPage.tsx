import { useState, type FC } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactPage: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    consent: false,
    website_hp: '', // Honeypot field
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website_hp) {
      setStatus('success');
      return;
    }

    if (!formData.consent) {
      setStatus('error');
      setErrorMessage('You must acknowledge and consent to the data processing policy.');
      return;
    }

    setStatus('submitting');
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          consent: formData.consent,
          website_hp: formData.website_hp,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Unable to store message at this time.');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Connection failure. Please retry.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-sage-300">
          Inquiries & Feedback
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink dark:text-cream mt-1 font-sans">
          Technical Contact
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted dark:text-muted-dark mt-2 leading-relaxed">
          Submit technical feedback, report potential drainage network discrepancies, or inquire regarding methodology implementations.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark shadow-tactile">
        {status === 'success' ? (
          <div className="p-4 rounded-lg bg-sage-300/30 dark:bg-sage-500/20 border border-sage-500 text-ink dark:text-cream space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-sage-700 dark:text-sage-300" />
              <span>Message Transmitted Successfully</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-muted dark:text-muted-dark">
              Your inquiry has been recorded in the system audit log. Technical administrators will review your submission.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {status === 'error' && (
              <div className="p-3 rounded-lg bg-critical/10 border border-critical text-critical flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Honeypot field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_hp">Leave blank</label>
              <input
                type="text"
                id="website_hp"
                name="website_hp"
                tabIndex={-1}
                value={formData.website_hp}
                onChange={e => setFormData({ ...formData, website_hp: e.target.value })}
                autoComplete="off"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="name" className="block text-ink dark:text-cream font-bold">
                Full Name or Institution *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-cream dark:bg-bg-dark text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-sage-700 font-mono text-xs"
                placeholder="Dr. S. Ramanujam"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-ink dark:text-cream font-bold">
                Contact Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-cream dark:bg-bg-dark text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-sage-700 font-mono text-xs"
                placeholder="s.ramanujam@institute.ac.in"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="block text-ink dark:text-cream font-bold">
                Technical Feedback or Inquiry *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-cream dark:bg-bg-dark text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-sage-700 font-mono text-xs leading-relaxed"
                placeholder="Detail observations on culvert flow capacity or catchment boundaries..."
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-ink dark:text-cream">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 accent-sage-500 rounded"
                />
                <span className="text-[11px] leading-snug text-ink-muted dark:text-muted-dark">
                  I consent to the recording of this technical correspondence in the administrative log for research and verification purposes.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 border-ink bg-sage-500 hover:bg-sage-700 text-ink hover:text-cream font-bold text-xs shadow-tactile transition-all active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{status === 'submitting' ? 'Submitting...' : 'Send Inquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
