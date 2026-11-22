import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Scissors,
  Store,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BusinessType } from '../types';

export const LandingPage: React.FC = () => {
  const { setView, setBusinessType, setIsOnboardingOpen } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  const handleLaunch = (type: BusinessType) => {
    setBusinessType(type);
    setView('app');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl px-6 py-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-xs">
              CF
            </div>
            <div className="flex items-center gap-0.5 text-xl font-bold tracking-tight text-slate-900">
              <span>CASHFLOW</span>
              <span className="text-blue-600">AI</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#workspaces" className="hover:text-blue-600 transition-colors">
              Workspaces
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLaunch('education')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => handleLaunch('education')}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm hover:shadow transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Precision Ledger: Institutional Multi-Business Back Office
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 leading-tight">
            Your Business Deserves More Than a Notebook.
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Manage every customer, invoice, payment and expense. Know what you have today and
            simulate what your business can afford tomorrow with real-time cash flow intelligence.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleLaunch('education')}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Live Platform</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 font-semibold text-slate-800 hover:bg-slate-50 transition-all shadow-xs"
            >
              <span>Custom Onboarding Wizard</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Live Interactive Mock Preview (Precision Ledger Style) */}
        <div className="mx-auto mt-16 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-panel text-left">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs text-slate-500">
                cashflow-ai.app / precision-ledger-preview
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-semibold text-emerald-700">
                Deterministic Engine Active
              </span>
              <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 font-semibold text-blue-700">
                INR (₹) Standard
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="text-xs font-semibold text-slate-500">Total Monthly Revenue</div>
              <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">₹1,24,500</div>
              <div className="mt-2 text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                <TrendingUp className="h-3 w-3 text-emerald-600" /> +14.2% from last month
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="text-xs font-semibold text-slate-500">Outstanding Receivables</div>
              <div className="mt-1 text-2xl font-bold text-amber-700 tabular-nums">₹34,000</div>
              <div className="mt-2 text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3 text-amber-600" /> 3 invoices awaiting payment
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="text-xs font-semibold text-slate-500">Liquid Cash & Bank</div>
              <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">₹4,25,000</div>
              <div className="mt-2 text-[11px] text-blue-700 flex items-center gap-1 font-medium">
                <ShieldCheck className="h-3 w-3 text-blue-600" /> 5.8 months runway
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="text-xs font-semibold text-slate-500">Overdue Alert</div>
              <div className="mt-1 text-2xl font-bold text-rose-700 tabular-nums">₹17,000</div>
              <div className="mt-2 text-[11px] text-rose-700 flex items-center gap-1 font-semibold">
                <AlertTriangle className="h-3 w-3 text-rose-600" /> Immediate follow-up draft
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="features" className="border-t border-slate-200 bg-slate-50/60 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Real Business Friction
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Why Small Businesses Struggle With Cash Flow
            </h2>
            <p className="mt-3 text-sm text-slate-600 max-w-2xl mx-auto">
              Paper notebooks, fragmented WhatsApp chats, and disconnected spreadsheets leave business
              owners in the dark about their actual bank runway.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 mb-4">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">The "Notebook" Blindspot</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Recording customer dues in diaries makes it impossible to know total pending amounts or
                predict if you will have enough cash for rent and salaries next week.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Awkward Payment Follow-ups</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Business owners delay asking for money because polite, professional follow-up drafting
                takes time. Uncollected payments silently bleed cash flow.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Unplanned Expense Crises</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Without a forward-looking cash flow forecast, an unexpected supplier hike or equipment
                repair pushes bank accounts into negative balances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Business Workspaces Section */}
      <section id="workspaces" className="border-t border-slate-200 px-6 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Dedicated Workspaces
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              One Financial Engine. Three Tailored Workspaces.
            </h2>
            <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto">
              Select your business type below to test the dedicated dashboard, workflows, and tools
              instantly.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {/* Card 1: Education */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-blue-500 hover:shadow-panel flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 mb-5">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Education & Coaching</h3>
                <p className="mt-1 text-xs text-slate-500">
                  For tuition centres, home tutors & coaching institutes
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Student enrollment & monthly fee records</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Fee defaulters list & automated reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Batch schedules & teacher salary ledger</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>30-90 Day tuition collection forecast</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleLaunch('education')}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
              >
                <span>Launch Education Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Card 2: Salon */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-pink-500 hover:shadow-panel flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600 border border-pink-200 mb-5">
                  <Scissors className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Salon & Beauty Studio</h3>
                <p className="mt-1 text-xs text-slate-500">
                  For beauty parlours, hair salons & grooming spas
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Live daily appointment calendar & status</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Multi-service billing & package discounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Staff performance & commission tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Consumables & product expense management</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleLaunch('salon')}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3 text-xs font-bold text-white hover:bg-pink-700 transition-colors shadow-xs"
              >
                <span>Launch Salon Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Card 3: Retail */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-emerald-500 hover:shadow-panel flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 mb-5">
                  <Store className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Retail & Kirana Store</h3>
                <p className="mt-1 text-xs text-slate-500">
                  For grocery stores, retail shops & supermarket counters
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Fast POS billing terminal with instant total</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Udhar Khata (Customer Credit Ledger)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Automated low stock alerts & purchase costs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Supplier invoices & cash margin calculations</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleLaunch('retail')}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <span>Launch Retail Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t border-slate-200 px-6 py-20 bg-slate-50/60">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Transparent Pricing
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Plans Built for Small Businesses
            </h2>
            <div className="mt-6 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedPlan === 'monthly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setSelectedPlan('annual')}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedPlan === 'annual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Annual (20% Off)
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {/* Starter */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-card">
              <div>
                <h3 className="text-base font-bold text-slate-900">Starter</h3>
                <p className="text-xs text-slate-500 mt-1">Single owner, basic cash flow tracking</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    {selectedPlan === 'monthly' ? '₹799' : '₹640'}
                  </span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Up to 50 active customers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Invoicing & payment tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 30-Day cash flow projection
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleLaunch('education')}
                className="mt-8 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Start Free Trial
              </button>
            </div>

            {/* Growth */}
            <div className="rounded-2xl border-2 border-blue-600 bg-white p-8 relative flex flex-col justify-between shadow-panel">
              <div className="absolute -top-3.5 right-6 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                Most Popular
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Growth</h3>
                <p className="text-xs text-slate-500 mt-1">Full operational suites & AI reminders</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    {selectedPlan === 'monthly' ? '₹1,499' : '₹1,199'}
                  </span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Unlimited customers & invoices
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 90-Day Cash Flow Forecasting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Interactive What-If Simulator
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> AI WhatsApp Reminder Drafter
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleLaunch('education')}
                className="mt-8 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
              >
                Launch Growth Tier
              </button>
            </div>

            {/* Business */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-card">
              <div>
                <h3 className="text-base font-bold text-slate-900">Business Pro</h3>
                <p className="text-xs text-slate-500 mt-1">Multi-branch & advanced staff tracking</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    {selectedPlan === 'monthly' ? '₹2,999' : '₹2,399'}
                  </span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> All 3 business workspaces
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Staff commission & payroll engine
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> POS terminal & inventory tools
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleLaunch('education')}
                className="mt-8 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Contact Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-10 text-xs text-slate-500">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
              CF
            </div>
            <span className="font-bold text-slate-900">CASHFLOW AI</span>
            <span>&copy; 2026. Precision Ledger Fintech Edition.</span>
          </div>
          <div className="flex gap-6 font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#workspaces" className="hover:text-blue-600 transition-colors">
              Workspaces
            </a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <span className="text-blue-600 font-semibold">Zero plain-text credentials</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
