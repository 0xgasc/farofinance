'use client';

import { useState } from 'react';
import { MessageSquarePlus, X, Bug, Lightbulb, MessageCircle, Check, ChevronDown, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

type FeedbackType = 'bug' | 'feature' | 'feedback';
type Priority = 'low' | 'medium' | 'high';

const typeConfig = {
  bug: {
    icon: Bug,
    label: 'Report a Bug',
    placeholder: 'Describe what went wrong and how to reproduce it...',
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-200',
    selectedBg: 'bg-red-500 text-white',
  },
  feature: {
    icon: Lightbulb,
    label: 'Request a Feature',
    placeholder: 'Describe the feature you\'d like and why it would help...',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 border-yellow-200',
    selectedBg: 'bg-yellow-500 text-white',
  },
  feedback: {
    icon: MessageCircle,
    label: 'Share Feedback',
    placeholder: 'Tell us what you think — what\'s working, what\'s not, anything on your mind...',
    color: 'text-blue-500',
    bg: 'bg-blue-50 border-blue-200',
    selectedBg: 'bg-blue-500 text-white',
  },
};

export default function FeedbackWidget() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('feedback');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setType('feedback');
    setTitle('');
    setDescription('');
    setPriority('medium');
    setSubmitted(false);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(reset, 300);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Please describe your feedback');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title: title.trim() || typeConfig[type].label,
          description: description.trim(),
          priority,
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full shadow-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 text-sm font-medium"
        aria-label="Send feedback"
      >
        <MessageSquarePlus size={16} />
        Feedback
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end pb-20 pr-6 sm:items-center sm:justify-center sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquarePlus size={18} className="text-primary" />
                <span className="font-semibold text-gray-900">Send Feedback</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check size={28} className="text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Thanks for your feedback!</h3>
                <p className="text-sm text-gray-500 mb-6">
                  We read every submission and use it to make Faro Finance better.
                </p>
                <button
                  onClick={handleClose}
                  className="px-5 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Form */
              <div className="p-5 space-y-4">
                {/* Type selector */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">What kind of feedback?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(typeConfig) as [FeedbackType, typeof typeConfig[FeedbackType]][]).map(([key, cfg]) => {
                      const Icon = cfg.icon;
                      const isSelected = type === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setType(key)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                            isSelected
                              ? `${cfg.selectedBg} border-transparent shadow-sm`
                              : `bg-white border-gray-200 text-gray-600 hover:${cfg.bg}`
                          }`}
                        >
                          <Icon size={18} className={isSelected ? 'text-white' : cfg.color} />
                          <span className="leading-tight text-center">
                            {key === 'bug' ? 'Bug' : key === 'feature' ? 'Feature' : 'Feedback'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title (optional) */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Title <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={typeConfig[type].label}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-400"
                    maxLength={100}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setError(''); }}
                    placeholder={typeConfig[type].placeholder}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-400 resize-none ${
                      error ? 'border-red-300' : 'border-gray-200'
                    }`}
                    maxLength={1000}
                  />
                  <div className="flex justify-between mt-1">
                    {error ? (
                      <span className="text-xs text-red-500">{error}</span>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-gray-400">{description.length}/1000</span>
                  </div>
                </div>

                {/* Priority (only for bugs) */}
                {type === 'bug' && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Priority</label>
                    <div className="relative">
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white pr-8"
                      >
                        <option value="low">Low — minor issue, workaround exists</option>
                        <option value="medium">Medium — impacts workflow</option>
                        <option value="high">High — blocking, can't continue</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Feedback'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
