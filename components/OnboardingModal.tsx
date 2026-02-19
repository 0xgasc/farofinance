'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  TrendingUp, LayoutDashboard, Calculator, DollarSign,
  BarChart3, Plug, ChevronRight, Upload, Database,
  X, Sparkles, ArrowRight
} from 'lucide-react';

const TOUR_ITEMS = [
  { icon: LayoutDashboard, title: 'Dashboard', desc: 'Burn rate, runway, and key KPIs at a glance', color: 'bg-blue-50 text-blue-600' },
  { icon: Calculator, title: 'Financial Models', desc: 'Driver-based forecasting and scenario planning', color: 'bg-purple-50 text-purple-600' },
  { icon: DollarSign, title: 'Budgets', desc: 'Plan vs actuals with variance analysis', color: 'bg-green-50 text-green-600' },
  { icon: BarChart3, title: 'SaaS Metrics', desc: 'MRR, churn, CAC, LTV — auto-calculated', color: 'bg-orange-50 text-orange-600' },
  { icon: TrendingUp, title: 'Investor Dashboard', desc: 'Shareable deck for your board and investors', color: 'bg-pink-50 text-pink-600' },
  { icon: Plug, title: 'Integrations', desc: 'Sync QuickBooks, Stripe, Plaid, and more', color: 'bg-teal-50 text-teal-600' },
];

interface Props {
  onOpenImporter: () => void;
}

export default function OnboardingModal({ onOpenImporter }: Props) {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  const storageKey = session?.user?.id ? `faro_onboarded_${session.user.id}` : null;

  useEffect(() => {
    if (!storageKey) return;
    const done = localStorage.getItem(storageKey);
    if (!done) setVisible(true);
  }, [storageKey]);

  const dismiss = async (markComplete = true) => {
    if (storageKey) localStorage.setItem(storageKey, '1');
    setVisible(false);
    if (markComplete) {
      setCompleting(true);
      await fetch('/api/onboarding', { method: 'POST' }).catch(() => null);
      setCompleting(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
              <TrendingUp size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Faro Finance{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Your FP&A command center. Let us show you around and help you get your first numbers in.
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90"
            >
              Take a quick tour <ArrowRight size={18} />
            </button>
            <button
              onClick={() => dismiss()}
              className="mt-3 w-full text-sm text-gray-400 hover:text-gray-600 py-2"
            >
              Skip — I'll explore on my own
            </button>
          </div>
        )}

        {/* Step 1 — Tour */}
        {step === 1 && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">What's inside</h2>
              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">2 of 3</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {TOUR_ITEMS.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="p-3 border border-gray-100 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color}`}>
                    <Icon size={16} />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90"
            >
              Get my data in <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2 — Get started */}
        {step === 2 && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">How do you want to start?</h2>
              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">3 of 3</span>
            </div>

            <div className="space-y-3 mb-6">
              {/* Option A: Stay with sample data */}
              <button
                onClick={() => dismiss()}
                className="w-full text-left p-4 border-2 border-gray-100 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Explore with sample data</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      All views are pre-loaded with realistic demo numbers so you can click around immediately.
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-primary mt-1 ml-auto flex-shrink-0" />
                </div>
              </button>

              {/* Option B: Import CSV */}
              <button
                onClick={() => { dismiss(); onOpenImporter(); }}
                className="w-full text-left p-4 border-2 border-gray-100 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Upload size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Import my own CSV files</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Upload budgets, metrics, revenue, or headcount data. Download templates included.
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-primary mt-1 ml-auto flex-shrink-0" />
                </div>
              </button>

              {/* Option C: Connect integrations */}
              <button
                onClick={() => dismiss()}
                className="w-full text-left p-4 border-2 border-gray-100 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Connect integrations</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Sync QuickBooks, Stripe, or Plaid for automatic real-time financial data.
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-primary mt-1 ml-auto flex-shrink-0" />
                </div>
              </button>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-400 hover:text-gray-600 py-1"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Step indicator dots */}
        {step > 0 && (
          <div className="flex justify-center gap-1.5 pb-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${step - 1 === i ? 'w-4 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-gray-200'}`}
              />
            ))}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => dismiss()}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 rounded-full p-1"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
