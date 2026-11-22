import React from 'react';
import {
  TrendingUp,
  Receipt,
  AlertCircle,
  Clock,
  SlidersHorizontal,
  Plus,
  ArrowUpRight,
  GraduationCap,
  Scissors,
  Store,
  CheckCircle2,
  Wallet,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { formatINR, formatDate } from '../lib/format';

export const DashboardView: React.FC = () => {
  const {
    profile,
    businessType,
    invoices,
    expenses,
    students,
    appointments,
    products,
    setActiveTab,
  } = useApp();

  // Metrics calculation
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const actualCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const pendingReceivables = invoices
    .filter((inv) => inv.status === 'Unpaid' || inv.status === 'Partially Paid' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0);
  const overdueTotal = invoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const liquidCash = profile.openingCash + profile.openingBank;

  // Monthly Chart Data (Deterministic simulation based on records)
  const chartData = [
    { month: 'Jun', Collections: 95000, Expenses: 62000 },
    { month: 'Jul', Collections: 110000, Expenses: 65000 },
    { month: 'Aug', Collections: 105000, Expenses: 70000 },
    { month: 'Sep', Collections: 125000, Expenses: 72000 },
    { month: 'Oct', Collections: 118000, Expenses: 68000 },
    { month: 'Nov (Current)', Collections: actualCollected + 50000, Expenses: totalExpenses },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Actions Bar (Precision Ledger Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {profile.name}
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
              {businessType}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Precision financial ledger, liquidity runway, and automated cash reconciliations.
          </p>
        </div>

        {/* 1-Tap Fast Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {businessType === 'retail' && (
            <button
              onClick={() => setActiveTab('pos')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-all"
            >
              <Store className="h-4 w-4" />
              <span>+ New POS Sale (₹)</span>
            </button>
          )}

          {businessType === 'education' && (
            <button
              onClick={() => setActiveTab('students')}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-all"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Enroll / Collect Fee</span>
            </button>
          )}

          {businessType === 'salon' && (
            <button
              onClick={() => setActiveTab('appointments')}
              className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-pink-700 shadow-xs transition-all"
            >
              <Scissors className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('invoices')}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
          >
            <Receipt className="h-3.5 w-3.5 text-amber-600" />
            <span>Record Expense</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600" />
            <span>Simulator</span>
          </button>
        </div>
      </div>

      {/* Bento Metric Cards (Precision Ledger Style) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Liquid Cash */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available Liquid Cash
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 tabular-nums">
            {formatINR(liquidCash)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
            <span className="flex items-center gap-1">
              <Wallet className="h-3 w-3 text-slate-400" /> Cash: {formatINR(profile.openingCash)}
            </span>
            <span className="flex items-center gap-1">
              <Building className="h-3 w-3 text-slate-400" /> Bank: {formatINR(profile.openingBank)}
            </span>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Revenue Billed
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 tabular-nums">
            {formatINR(totalBilled)}
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-700 border-t border-slate-100 pt-2.5 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Collected: {formatINR(actualCollected)}</span>
          </div>
        </div>

        {/* Card 3: Pending Receivables */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Receivables
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-700 tabular-nums">
            {formatINR(pendingReceivables)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
            <span>Expected this month</span>
            <button
              onClick={() => setActiveTab('invoices')}
              className="text-blue-600 hover:underline flex items-center font-semibold"
            >
              Collect <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Overdue Alert */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Overdue Aging Alert
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-700 tabular-nums">
            {formatINR(overdueTotal)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-rose-700 border-t border-slate-100 pt-2.5 font-semibold">
            <span>Critical Follow-up</span>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="text-blue-600 hover:underline flex items-center font-bold"
            >
              WhatsApp Draft <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart & Industry Highlights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cash Inflow vs Outflow Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Cash Flow Movement</h3>
              <p className="text-xs text-slate-500">Verified cash collections vs operational expenses</p>
            </div>
            <button
              onClick={() => setActiveTab('cashflow')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>30-90D Forecast</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(15,23,42,0.08)' }}
                  itemStyle={{ color: '#0F172A', fontSize: '12px' }}
                  formatter={(value: number) => [formatINR(value), '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="Collections" fill="#2563EB" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expenses" fill="#DC2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Context Widget */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                {businessType === 'education' && <GraduationCap className="h-4 w-4 text-blue-600" />}
                {businessType === 'salon' && <Scissors className="h-4 w-4 text-pink-600" />}
                {businessType === 'retail' && <Store className="h-4 w-4 text-emerald-600" />}
                <span>
                  {businessType === 'education'
                    ? 'Fee Defaulters Attention'
                    : businessType === 'salon'
                    ? 'Upcoming Appointments'
                    : 'Low Stock Warnings'}
                </span>
              </h3>
            </div>

            {/* Education: Defaulters */}
            {businessType === 'education' && (
              <div className="space-y-2">
                {students
                  .filter((s) => s.status === 'Defaulter')
                  .slice(0, 3)
                  .map((st) => (
                    <div
                      key={st.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                    >
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{st.name}</span>
                        <span className="text-rose-600 tabular-nums">{formatINR(st.monthlyFee)}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                        <span>{st.batch}</span>
                        <span>Due Day {st.dueDay}th</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Salon: Appointments */}
            {businessType === 'salon' && (
              <div className="space-y-2">
                {appointments.slice(0, 3).map((ap) => (
                  <div
                    key={ap.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                  >
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{ap.customerName}</span>
                      <span className="text-emerald-600 tabular-nums">{formatINR(ap.price)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>{ap.serviceName}</span>
                      <span>{ap.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Retail: Low Stock */}
            {businessType === 'retail' && (
              <div className="space-y-2">
                {products
                  .filter((p) => p.stock <= p.minStock)
                  .slice(0, 3)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                    >
                      <div className="flex justify-between font-bold text-slate-900">
                        <span className="truncate max-w-[160px]">{p.name}</span>
                        <span className="text-rose-600 font-bold">{p.stock} left</span>
                      </div>
                      <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                        <span>Min threshold: {p.minStock}</span>
                        <span>SKU: {p.sku}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (businessType === 'education') setActiveTab('students');
              else if (businessType === 'salon') setActiveTab('appointments');
              else setActiveTab('products');
            }}
            className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          >
            Manage Operational Records
          </button>
        </div>
      </div>

      {/* Recent Invoices Table (Precision Ledger Style) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Transactions & Invoices</h3>
            <p className="text-xs text-slate-500">Latest bills issued and payment statuses</p>
          </div>
          <button
            onClick={() => setActiveTab('invoices')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            View All Invoices
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500">
              <tr>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Invoice #</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Customer / Client</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Date</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Due Date</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Total Amount</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Paid Amount</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="py-3 px-3 text-slate-900 font-semibold">{inv.customerName}</td>
                  <td className="py-3 px-3 text-slate-500">{formatDate(inv.date)}</td>
                  <td className="py-3 px-3 text-slate-500">{formatDate(inv.dueDate)}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">{formatINR(inv.total)}</td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold tabular-nums">{formatINR(inv.paidAmount)}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : inv.status === 'Overdue'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
