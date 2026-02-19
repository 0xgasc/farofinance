'use client';

import { Upload, Plug, FlaskConical, Database } from 'lucide-react';
import { useNavigationStore } from '@/lib/stores/navigationStore';
import { useDataModeStore } from '@/lib/stores/dataModeStore';

interface Props {
  onOpenImporter: () => void;
}

export default function DemoBanner({ onOpenImporter }: Props) {
  const setActiveView = useNavigationStore((s) => s.setActiveView);
  const { demoMode, setDemoMode } = useDataModeStore();

  if (!demoMode) {
    // Live mode indicator — slim, unobtrusive
    return (
      <div className="bg-green-50 border-b border-green-100 px-4 py-2 flex items-center gap-3 text-xs">
        <Database size={13} className="text-green-500 flex-shrink-0" />
        <p className="text-green-700 flex-1">
          <span className="font-medium">Live data mode.</span>{' '}
          Showing your real data from imports and integrations.
        </p>
        <button
          onClick={() => setDemoMode(true)}
          className="text-green-600 hover:text-green-800 underline underline-offset-2"
        >
          Switch back to demo
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5 flex items-center gap-3 text-sm">
      <FlaskConical size={15} className="text-amber-500 flex-shrink-0" />
      <p className="text-amber-900 flex-1">
        <span className="font-medium">Sample data mode.</span>{' '}
        Everything you see is demo data — none of it is saved.
      </p>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onOpenImporter}
          className="flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Upload size={13} />
          Import CSV
        </button>
        <button
          onClick={() => { setActiveView('integrations'); }}
          className="flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plug size={13} />
          Connect
        </button>
        <button
          onClick={() => setDemoMode(false)}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition-colors"
        >
          Use my data →
        </button>
      </div>
    </div>
  );
}
