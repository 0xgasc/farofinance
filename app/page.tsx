'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useNavigationStore } from '@/lib/stores/navigationStore';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import ModelBuilder from '@/components/ModelBuilder';
import BudgetManager from '@/components/BudgetManager';
import ScenarioPlanner from '@/components/ScenarioPlanner';
import MetricsView from '@/components/MetricsView';
import Integrations from '@/components/Integrations';
import MultiEntity from '@/components/MultiEntity';
import AccountingRules from '@/components/AccountingRules';
import RunwayCalculator from '@/components/RunwayCalculator';
import CashFlowForecast from '@/components/CashFlowForecast';
import SaaSMetrics from '@/components/SaaSMetrics';
import HiringPlan from '@/components/HiringPlan';
import FundraisingScenarios from '@/components/FundraisingScenarios';
import FinancialStatements from '@/components/FinancialStatements';
import InvestorDashboard from '@/components/InvestorDashboard';
import ReportBuilder from '@/components/ReportBuilder';
import OrgSettings from '@/components/OrgSettings';
import FeedbackWidget from '@/components/FeedbackWidget';
import LandingPage from '@/components/LandingPage';
import OnboardingModal from '@/components/OnboardingModal';
import DemoBanner from '@/components/DemoBanner';
import CSVImporter from '@/components/CSVImporter';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const activeView = useNavigationStore((s) => s.activeView);
  const [importerOpen, setImporterOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500">Loading Faro Finance...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated visitors
  if (!session) return <LandingPage />;

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'models': return <ModelBuilder />;
      case 'budgets': return <BudgetManager />;
      case 'scenarios': return <ScenarioPlanner />;
      case 'metrics': return <MetricsView />;
      case 'integrations': return <Integrations />;
      case 'entities': return <MultiEntity />;
      case 'rules': return <AccountingRules />;
      case 'runway': return <RunwayCalculator />;
      case 'cashflow': return <CashFlowForecast />;
      case 'saas-metrics': return <SaaSMetrics />;
      case 'hiring': return <HiringPlan />;
      case 'fundraising': return <FundraisingScenarios />;
      case 'statements': return <FinancialStatements />;
      case 'investor-dashboard': return <InvestorDashboard />;
      case 'reports': return <ReportBuilder />;
      case 'settings': return <OrgSettings />;
      default: return <Dashboard />;
    }
  };

  const viewTitles: Record<string, { title: string; description: string }> = {
    dashboard: { title: 'Dashboard', description: 'Financial overview and key metrics' },
    models: { title: 'Financial Models', description: 'Build and manage financial models' },
    budgets: { title: 'Budgets', description: 'Plan and track budgets vs actuals' },
    scenarios: { title: 'Scenario Planning', description: 'Compare what-if scenarios' },
    metrics: { title: 'Metrics', description: 'Track KPIs and business metrics' },
    integrations: { title: 'Integrations', description: 'Connect your financial tools' },
    entities: { title: 'Entities', description: 'Manage subsidiaries and business units' },
    rules: { title: 'Accounting Rules', description: 'Automate transaction processing' },
    runway: { title: 'Burn & Runway', description: 'Track burn rate and cash runway' },
    cashflow: { title: 'Cash Flow', description: '13-week cash flow forecast' },
    'saas-metrics': { title: 'SaaS Metrics', description: 'MRR, churn, LTV, CAC and more' },
    hiring: { title: 'Hiring Plan', description: 'Plan headcount and compensation' },
    fundraising: { title: 'Fundraising', description: 'Model fundraising scenarios' },
    statements: { title: 'Financial Statements', description: 'P&L, Balance Sheet, Cash Flow' },
    'investor-dashboard': { title: 'Investor Dashboard', description: 'Shareable investor view' },
    reports: { title: 'Reports', description: 'Generate board decks and reports' },
    settings: { title: 'Settings', description: 'Organization and account settings' },
  };

  const current = viewTitles[activeView] || viewTitles.dashboard;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Onboarding modal — fires once per user via localStorage */}
      <OnboardingModal onOpenImporter={() => setImporterOpen(true)} />

      {/* Global CSV importer modal */}
      <CSVImporter isOpen={importerOpen} onClose={() => setImporterOpen(false)} />

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Demo data banner */}
        <DemoBanner onOpenImporter={() => setImporterOpen(true)} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{current.title}</h1>
              <p className="text-gray-600 mt-1">{current.description}</p>
            </header>
            {renderView()}
          </div>
        </main>
      </div>

      <FeedbackWidget />
    </div>
  );
}
