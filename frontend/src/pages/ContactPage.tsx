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
      // Honeypot caught
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
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Inquiries & Feedback
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Technical Contact
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          Submit technical feedback, report potential data discrepancies in the study area, or inquire regarding methodology implementations.
        </p>
      </div>

      <div className="p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {status === 'success' ? (
          <div className="p-4 rounded-md bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Message Transmitted Successfully</span>
            </div>
            <p className="text-xs leading-relaxed">
              Your message has been verified and recorded in the system audit log. Technical administrators will review your inquiry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {status === 'error' && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Honeypot field (hidden from legitimate users) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_hp">Leave this field blank</label>
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

            <div>
              <label htmlFor="name" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-teal-500"
                placeholder="Engineer or Researcher Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-teal-500"
                placeholder="name@organization.gov.in"
              />
            </div>

            <div>
              <label htmlFor="message" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Technical Inquiry or Observation *
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-teal-500"
                placeholder="Detail network segment observations, model assumptions, or dataset questions..."
              />
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="consent"
                checked={formData.consent}
                onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="consent" className="text-slate-600 dark:text-slate-400 leading-tight">
                I understand that PRAVAHA stores inquiries in local audit storage for engineering review, and that this platform does not dispatch emergency services.
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{status === 'submitting' ? 'Transmitting...' : 'Submit Inquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
