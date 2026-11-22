import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './components/DashboardView';
import { CashFlowView } from './components/CashFlowView';
import { SimulatorView } from './components/SimulatorView';
import { InvoicesView } from './components/InvoicesView';
import { CustomersView } from './components/CustomersView';
import { ExpensesView } from './components/ExpensesView';
import { AIAssistantView } from './components/AIAssistantView';
import { EducationView } from './components/EducationView';
import { SalonView } from './components/SalonView';
import { RetailView } from './components/RetailView';

const MainLayout: React.FC = () => {
  const { view, activeTab } = useApp();

  if (view === 'landing') {
    return (
      <>
        <LandingPage />
        <OnboardingModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'cashflow' && <CashFlowView />}
          {activeTab === 'simulator' && <SimulatorView />}
          {activeTab === 'invoices' && <InvoicesView />}
          {activeTab === 'customers' && <CustomersView />}
          {activeTab === 'expenses' && <ExpensesView />}
          {activeTab === 'ai-assistant' && <AIAssistantView />}
          {activeTab === 'students' && <EducationView />}
          {activeTab === 'appointments' && <SalonView />}
          {(activeTab === 'pos' || activeTab === 'products' || activeTab === 'credit-book') && (
            <RetailView />
          )}
          {activeTab === 'reports' && <CashFlowView />}
        </main>
      </div>
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
