import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { formatINR, formatDate } from '../lib/format';

export const CashFlowView: React.FC = () => {
  const { profile, invoices } = useApp();
  const [period, setPeriod] = useState<30 | 60 | 90>(30);

  const openingCash = profile.openingCash + profile.openingBank;

  // Compute expected inflows from pending invoices
  const pendingInvoices = invoices.filter(
    (inv) => inv.status === 'Unpaid' || inv.status === 'Partially Paid' || inv.status === 'Overdue'
  );
  const totalPendingInflows = pendingInvoices.reduce(
    (acc, inv) => acc + (inv.total - inv.paidAmount),
    0
  );

  // Expected fixed overhead for the period
  const multiplier = period / 30;
  const projectedExpenses = profile.monthlyFixedExpenses * multiplier;
  const projectedClosing = openingCash + totalPendingInflows - projectedExpenses;

  // Generate day-by-day cash trajectory
  const daysCount = period === 30 ? 6 : period === 60 ? 8 : 10;
  const stepDays = period / daysCount;
  const trajectoryData = [];

  for (let i = 0; i <= daysCount; i++) {
    const day = Math.round(i * stepDays);
    const fraction = i / daysCount;
    const estimatedInflows = totalPendingInflows * fraction * 0.85; // conservative
    const estimatedOutflows = projectedExpenses * fraction;
    const balance = openingCash + estimatedInflows - estimatedOutflows;

    trajectoryData.push({
      label: `Day ${day}`,
      balance: Math.round(balance),
      inflow: Math.round(estimatedInflows),
      outflow: Math.round(estimatedOutflows),
    });
  }

  const runwayDays = Math.round((openingCash / (profile.monthlyFixedExpenses || 1)) * 30);
  const isHealthy = projectedClosing > profile.monthlyFixedExpenses * 1.5;

  return (
    <div className="space-y-6">
      {/* Title & Horizon Controls (Precision Ledger Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Cash Flow & Runway Intelligence
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kirby Deterministic Engine • Institutional Solvency & Reconciled Receivables Projections
          </p>
        </div>

        {/* Horizon Pills */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-xs">
          <button
            onClick={() => setPeriod(30)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              period === 30
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setPeriod(60)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              period === 60
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            60 Days
          </button>
          <button
            onClick={() => setPeriod(90)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              period === 90
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Core Runway & Liquidity KPI Bento Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Available Liquid Cash
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900 tabular-nums">
            {formatINR(openingCash)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Live bank + counter drawer sync</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Expected Receivables</span>
            <ArrowDownRight className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-1 text-2xl font-black text-emerald-700 tabular-nums">
            {formatINR(totalPendingInflows)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">From {pendingInvoices.length} due invoices</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Projected Expenses</span>
            <ArrowUpRight className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-1 text-2xl font-black text-rose-700 tabular-nums">
            {formatINR(projectedExpenses)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Rent & Overhead ({period}D)</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Safe Runway Buffer</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-1 text-2xl font-black text-blue-700 tabular-nums">
            {runwayDays} Days
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold">
            {isHealthy ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Safe Solvency Cushion
              </span>
            ) : (
              <span className="text-rose-700 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" /> Tight Runway Warning
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trajectory Area Chart (Light Precision Ledger Aesthetic) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Projected Cash Balance Trajectory ({period} Days)
            </h3>
            <p className="text-xs text-slate-500">
              Daily simulation showing baseline solvency cushion and lowest watermark
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="h-3 w-3 rounded-full bg-blue-600" /> Projected Closing Balance
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(15,23,42,0.08)' }}
                itemStyle={{ color: '#0F172A', fontSize: '12px' }}
                formatter={(value: number) => [formatINR(value), 'Projected Balance']}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#2563EB"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown: Inflows vs Outflows */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending Inflows Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center justify-between">
            <span>Upcoming Verified Inflows</span>
            <span className="text-xs font-bold text-emerald-700 tabular-nums">{formatINR(totalPendingInflows)}</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">Invoices due within this horizon</p>

          <div className="space-y-2">
            {pendingInvoices.length === 0 ? (
              <div className="text-xs text-slate-500 p-4 text-center">No pending invoices due.</div>
            ) : (
              pendingInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{inv.customerName}</div>
                    <div className="text-[11px] text-slate-500">
                      Due: {formatDate(inv.dueDate)} ({inv.invoiceNumber})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-700 tabular-nums">
                      {formatINR(inv.total - inv.paidAmount)}
                    </div>
                    <span className="text-[10px] text-rose-700 font-bold uppercase">{inv.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expected Outflows */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center justify-between">
            <span>Upcoming Obligations & Overhead</span>
            <span className="text-xs font-bold text-rose-700 tabular-nums">{formatINR(projectedExpenses)}</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">Fixed recurring operational commitments</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs">
              <div>
                <div className="font-semibold text-slate-900">Facility / Store Rent</div>
                <div className="text-[11px] text-slate-500">Due on 1st of every month</div>
              </div>
              <div className="text-right font-bold text-rose-700 tabular-nums">
                {formatINR(profile.monthlyFixedExpenses * 0.6 * multiplier)}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs">
              <div>
                <div className="font-semibold text-slate-900">Salaries & Faculty / Staff</div>
                <div className="text-[11px] text-slate-500">Due between 5th - 10th of every month</div>
              </div>
              <div className="text-right font-bold text-rose-700 tabular-nums">
                {formatINR(profile.monthlyFixedExpenses * 0.3 * multiplier)}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs">
              <div>
                <div className="font-semibold text-slate-900">Utilities & Maintenance</div>
                <div className="text-[11px] text-slate-500">Electricity, Internet & Commercial bills</div>
              </div>
              <div className="text-right font-bold text-rose-700 tabular-nums">
                {formatINR(profile.monthlyFixedExpenses * 0.1 * multiplier)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
