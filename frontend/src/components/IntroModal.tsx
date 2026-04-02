import { useState } from 'react';

interface IntroModalProps {
  isOpen: boolean;
  onConfirm: (dontShowAgain: boolean) => void;
  onClose: () => void;
  showDontShowOption?: boolean;
}

export default function IntroModal({ isOpen, onConfirm, onClose, showDontShowOption = true }: IntroModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(dontShowAgain);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        aria-label="Close introduction modal"
      />

      <div className="relative z-10 w-full max-w-md sm:max-w-2xl rounded-2xl border border-amber-200 bg-white shadow-lg shadow-black/20">
        <div className="px-5 py-5 sm:px-7 sm:py-6 border-b border-amber-100">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome to AI English Polisher ✨
          </h3>
        </div>

        <div className="px-5 py-5 sm:px-7 sm:py-6 space-y-5 text-slate-700">
          <section>
            <p className="text-sm sm:text-base leading-relaxed">
              Your smart assistant for crafting professional, natural, and error-free English messages instantly. Powered by advanced AI.
            </p>
          </section>

          <section className="space-y-3">
            <p className="text-sm sm:text-base leading-relaxed">
              💬 <strong>Text Mode</strong>: Perfect for casual chats, slack messages, or general text. It fixes grammar and refines the tone while keeping your original meaning intact.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              📧 <strong>Email Mode</strong>: Designed for professional correspondence. It automatically structures your input into a formal email, generating a subject line and appropriate greetings/sign-offs.
            </p>
          </section>

          <section>
            <p className="text-sm sm:text-base leading-relaxed">
              🚀 <strong>Currently in Free Beta</strong>: Enjoy full access to all features! (Note: To ensure a smooth experience for everyone, requests are limited to 10 times per minute.)
            </p>
          </section>
        </div>

        <div className="px-5 py-4 sm:px-7 sm:py-5 border-t border-amber-100 bg-amber-50/50 rounded-b-2xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {showDontShowOption ? (
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              <span>Don't show this again</span>
            </label>
          ) : (
            <div className="hidden sm:block" />
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
          >
            Got it! Let's start
          </button>
        </div>
      </div>
    </div>
  );
}
