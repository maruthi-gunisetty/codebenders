import React, { useState } from 'react';
import {
  Bell,
  Search,
  Sparkles,
  ChevronDown,
  ArrowLeft,
  X,
  ExternalLink,
  Store,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BusinessType } from '../types';

export const Navbar: React.FC = () => {
  const {
    profile,
    businessType,
    setBusinessType,
    alerts,
    markAlertRead,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    setView,
  } = useApp();

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.read);

  const businessTypes: { type: BusinessType; label: string; desc: string }[] = [
    { type: 'education', label: 'Education & Coaching', desc: 'Tuition, Batches, Fees & Defaulters' },
    { type: 'salon', label: 'Salon & Beauty Studio', desc: 'Appointments, Staff & Service Billing' },
    { type: 'retail', label: 'Retail & Kirana Store', desc: 'POS Terminal, Inventory & Credit Book' },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-xl px-6 text-slate-900 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Left: Brand & Business Switcher */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          title="Back to Landing Page"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Landing</span>
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            CF
          </div>
          <div className="flex items-center gap-0.5 font-bold tracking-tight text-slate-900">
            <span>CASHFLOW</span>
            <span className="text-blue-600">AI</span>
          </div>
        </div>

        {/* Workspace selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsBusinessMenuOpen(!isBusinessMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all"
          >
            <Store className="h-3.5 w-3.5 text-blue-600" />
            <span className="font-semibold text-slate-800 truncate max-w-[140px] sm:max-w-[180px]">
              {profile.name}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isBusinessMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-panel z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Switch Business Workspace
              </div>
              <div className="space-y-1">
                {businessTypes.map((b) => (
                  <button
                    key={b.type}
                    onClick={() => {
                      setBusinessType(b.type);
                      setIsBusinessMenuOpen(false);
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-left transition-colors flex flex-col ${
                      businessType === b.type
                        ? 'bg-blue-50 border border-blue-200 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-semibold">{b.label}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">{b.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Quick Search */}
      <div className="hidden md:flex items-center w-80 relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search records, ledger, bills..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* AI Assistant Quick Trigger */}
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-all shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            title="Smart Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Financial Alerts</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {unreadAlerts.length} new
                  </span>
                </div>
                <button
                  onClick={() => setIsAlertsOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-xl border p-3 text-xs transition-colors ${
                      alert.read
                        ? 'border-slate-100 bg-slate-50/60 opacity-75'
                        : 'border-slate-200 bg-white shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900">{alert.title}</span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          alert.severity === 'danger'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : alert.severity === 'warning'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-600 leading-relaxed text-[11px]">{alert.message}</p>
                    <div className="mt-2 flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">{alert.date}</span>
                      <button
                        onClick={() => {
                          markAlertRead(alert.id);
                          setActiveTab(alert.actionTab);
                          setIsAlertsOpen(false);
                        }}
                        className="flex items-center gap-1 font-semibold text-blue-600 hover:underline text-[11px]"
                      >
                        {alert.actionText}
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200">
            {profile.ownerName.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">{profile.ownerName}</div>
            <div className="text-[10px] text-slate-500">Business Owner</div>
          </div>
        </div>
      </div>
    </header>
  );
};
