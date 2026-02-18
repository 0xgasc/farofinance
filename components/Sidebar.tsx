'use client';

import { useSession, signOut } from 'next-auth/react';
import { useNavigationStore } from '@/lib/stores/navigationStore';
import {
  LayoutDashboard,
  Calculator,
  DollarSign,
  GitBranch,
  TrendingUp,
  Plug,
  Building2,
  FileText,
  Flame,
  Wallet,
  BarChart3,
  Users,
  Rocket,
  FileSpreadsheet,
  Eye,
  FileBarChart,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  defaultOpen?: boolean;
}

const menuSections: MenuSection[] = [
  {
    title: 'Overview',
    defaultOpen: true,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Startup Essentials',
    defaultOpen: true,
    items: [
      { id: 'runway', label: 'Burn & Runway', icon: Flame },
      { id: 'cashflow', label: 'Cash Flow', icon: Wallet },
      { id: 'saas-metrics', label: 'SaaS Metrics', icon: BarChart3 },
      { id: 'hiring', label: 'Hiring Plan', icon: Users },
      { id: 'fundraising', label: 'Fundraising', icon: Rocket },
    ],
  },
  {
    title: 'Financial Planning',
    defaultOpen: true,
    items: [
      { id: 'models', label: 'Models', icon: Calculator },
      { id: 'budgets', label: 'Budgets', icon: DollarSign },
      { id: 'scenarios', label: 'Scenarios', icon: GitBranch },
      { id: 'metrics', label: 'Metrics', icon: TrendingUp },
    ],
  },
  {
    title: 'Reporting',
    defaultOpen: false,
    items: [
      { id: 'statements', label: 'Statements', icon: FileSpreadsheet },
      { id: 'investor-dashboard', label: 'Investor View', icon: Eye },
      { id: 'reports', label: 'Reports', icon: FileBarChart },
    ],
  },
  {
    title: 'Administration',
    defaultOpen: false,
    items: [
      { id: 'integrations', label: 'Integrations', icon: Plug },
      { id: 'entities', label: 'Entities', icon: Building2 },
      { id: 'rules', label: 'Rules', icon: FileText },
    ],
  },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const { activeView, setActiveView } = useNavigationStore();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(menuSections.map((s) => [s.title, s.defaultOpen ?? false]))
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-primary">Faro Finance</h2>
        <p className="text-xs text-gray-400 mt-0.5">Financial Planning & Analysis</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuSections.map((section) => (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600"
            >
              <span>{section.title}</span>
              {openSections[section.title] ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
            {openSections[section.title] && (
              <div className="mt-1 space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-3 space-y-1">
        <button
          onClick={() => setActiveView('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            activeView === 'settings'
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        {session?.user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-gray-400 hover:text-gray-600"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
