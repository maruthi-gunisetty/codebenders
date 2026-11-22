import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  SlidersHorizontal,
  FileText,
  Users,
  Receipt,
  Sparkles,
  GraduationCap,
  Scissors,
  Store,
  Calendar,
  Package,
  BookOpen,
  LogOut,
  IndianRupee,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import { formatINR } from '../lib/format';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, businessType, profile, setView } = useApp();

  // Shared core financial modules
  const commonFinancialTabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Financial Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'cashflow', label: '30-90D Forecast', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'simulator', label: 'What-If Simulator', icon: <SlidersHorizontal className="h-4 w-4" /> },
    { id: 'invoices', label: 'Invoices & Billing', icon: <FileText className="h-4 w-4" /> },
    { id: 'customers', label: 'Customers / Khata', icon: <Users className="h-4 w-4" /> },
    { id: 'expenses', label: 'Expenses & Overhead', icon: <Receipt className="h-4 w-4" /> },
    { id: 'ai-assistant', label: 'AI Financial Copilot', icon: <Sparkles className="h-4 w-4 text-blue-600" /> },
  ];

  // Specific workspace modules
  const educationTabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'students', label: 'Students & Defaulters', icon: <GraduationCap className="h-4 w-4" /> },
  ];

  const salonTabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'appointments', label: 'Appointments & Staff', icon: <Calendar className="h-4 w-4" /> },
  ];

  const retailTabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'pos', label: 'POS Terminal (Billing)', icon: <Store className="h-4 w-4" /> },
    { id: 'products', label: 'Inventory & Stock', icon: <Package className="h-4 w-4" /> },
    { id: 'credit-book', label: 'Credit Book (Udhar)', icon: <BookOpen className="h-4 w-4" /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200/80 bg-white flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Workspace Mode Badge */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <div className="flex items-center gap-2.5">
            {businessType === 'education' && <GraduationCap className="h-5 w-5 text-blue-600" />}
            {businessType === 'salon' && <Scissors className="h-5 w-5 text-pink-600" />}
            {businessType === 'retail' && <Store className="h-5 w-5 text-emerald-600" />}
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                {businessType === 'education' ? 'Education' : businessType === 'salon' ? 'Salon & Beauty' : 'Retail Kirana'}
              </span>
              <div className="text-xs font-bold text-slate-900 truncate">{profile.name}</div>
            </div>
          </div>
        </div>

        {/* Business Specific Modules */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Operations
          </div>
          <nav className="space-y-1">
            {businessType === 'education' &&
              educationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}

            {businessType === 'salon' &&
              salonTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}

            {businessType === 'retail' &&
              retailTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
          </nav>
        </div>

        {/* Financial Intelligence Modules */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Financial Engine
          </div>
          <nav className="space-y-1">
            {commonFinancialTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Liquid Cash Widget & Exit */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Liquid Cash + Bank</span>
            <IndianRupee className="h-3 w-3 text-emerald-600" />
          </div>
          <div className="mt-1 text-base font-extrabold text-slate-900 tabular-nums">
            {formatINR(profile.openingCash + profile.openingBank)}
          </div>
        </div>

        <button
          onClick={() => setView('landing')}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit to Landing</span>
        </button>
      </div>
    </aside>
  );
};
