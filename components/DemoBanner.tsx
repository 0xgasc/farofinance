'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Info, X, Upload, Plug } from 'lucide-react';
import { useNavigationStore } from '@/lib/stores/navigationStore';

interface Props {
  onOpenImporter: () => void;
}

export default function DemoBanner({ onOpenImporter }: Props) {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  const setActiveView = useNavigationStore((s) => s.setActiveView);

  const storageKey = session?.user?.id ? `faro_demo_banner_${session.user.id}` : null;

  useEffect(() => {
    if (!storageKey) return;
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed) setVisible(true);
  }, [storageKey]);

  const dismiss = () => {
    if (storageKey) localStorage.setItem(storageKey, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-100 px-4 py-2.5 flex items-center gap-3 text-sm">
      <Info size={15} className="text-blue-500 flex-shrink-0" />
      <p className="text-blue-800 flex-1">
        <span className="font-medium">You're viewing sample data.</span>{' '}
        Import your own data or connect an integration to see real numbers.
      </p>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onOpenImporter}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Upload size={13} />
          Import CSV
        </button>
        <button
          onClick={() => { setActiveView('integrations'); dismiss(); }}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plug size={13} />
          Connect
        </button>
        <button onClick={dismiss} className="text-blue-400 hover:text-blue-600 ml-1">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
