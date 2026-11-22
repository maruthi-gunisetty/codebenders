import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
  ShieldAlert,
  Info,
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
import { formatINR } from '../lib/format';

export const SimulatorView: React.FC = () => {
  const { profile, invoices } = useApp();

  // Simulation parameters
  const [collectionDelayDays, setCollectionDelayDays] = useState<number>(15);
  const [rentIncrease, setRentIncrease] = useState<number>(5000);
  const [salesDropPct, setSalesDropPct] = useState<number>(20);
  const [unexpectedExpense, setUnexpectedExpense] = useState<number>(15000);

  const openingCash = profile.openingCash + profile.openingBank;
  const pendingReceivables = invoices.reduce(
    (sum, inv) => sum + (inv.total - inv.paidAmount),
    0
  );
  const baselineExpenses = profile.monthlyFixedExpenses;

  // Baseline 30-day forecast
  const baselineClosing = openingCash + pendingReceivables - baselineExpenses;

  // Simulated calculation
  const delayedFactor = collectionDelayDays > 20 ? 0.4 : collectionDelayDays > 10 ? 0.7 : 0.9;
  const simulatedReceivables = pendingReceivables * delayedFactor * (1 - salesDropPct / 100);
  const simulatedExpenses = baselineExpenses + rentIncrease + unexpectedExpense;
  const simulatedClosing = openingCash + simulatedReceivables - simulatedExpenses;

  const cashDifference = simulatedClosing - baselineClosing;

  // Chart comparison data
  const comparisonData = [
    {
      metric: 'Receivables Inflow',
      Baseline: pendingReceivables,
      Simulated: Math.round(simulatedReceivables),
    },
    {
      metric: 'Monthly Expenses',
      Baseline: baselineExpenses,
      Simulated: Math.round(simulatedExpenses),
    },
    {
      metric: 'Projected Closing Cash',
      Baseline: baselineClosing,
      Simulated: Math.round(simulatedClosing),
    },
  ];

  const handleReset = () => {
    setCollectionDelayDays(0);
    setRentIncrease(0);
    setSalesDropPct(0);
    setUnexpectedExpense(0);
  };

  const isSevere = simulatedClosing < profile.monthlyFixedExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="h-6 w-6 text-blue-600" />
            <span>Interactive What-If Financial Simulator</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Test business resilience against unexpected payment delays, rent hikes, and demand slowdowns
            without altering real accounts.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Simulator Inputs & Result Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Simulation Variables
          </h3>

          {/* Slider 1: Payment Delay */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-800">Customer Payment Delay</span>
              <span className="font-mono font-bold text-blue-600">{collectionDelayDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="5"
              value={collectionDelayDays}
              onChange={(e) => setCollectionDelayDays(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>On Time</span>
              <span>15 Days</span>
              <span>30 Days</span>
              <span>45 Days</span>
            </div>
          </div>

          {/* Slider 2: Rent / Overhead Increase */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-800">Monthly Rent / Expense Increase</span>
              <span className="font-mono font-bold text-amber-600">
                +{formatINR(rentIncrease)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="1000"
              value={rentIncrease}
              onChange={(e) => setRentIncrease(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹0</span>
              <span>+₹10,000</span>
              <span>+₹20,000</span>
            </div>
          </div>

          {/* Slider 3: Sales Drop */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-800">Sales & New Billing Drop</span>
              <span className="font-mono font-bold text-rose-600">-{salesDropPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={salesDropPct}
              onChange={(e) => setSalesDropPct(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% Normal</span>
              <span>-25% Slowdown</span>
              <span>-50% Recession</span>
            </div>
          </div>

          {/* Slider 4: Unexpected Expense */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-800">One-time Emergency Outflow</span>
              <span className="font-mono font-bold text-rose-600">
                +{formatINR(unexpectedExpense)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="2500"
              value={unexpectedExpense}
              onChange={(e) => setUnexpectedExpense(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹0</span>
              <span>₹25,000</span>
              <span>₹50,000</span>
            </div>
          </div>
        </div>

        {/* Right Column: Comparison & Actionable Insights */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Scorecard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Baseline Projected Cash
              </span>
              <div className="mt-1 text-2xl font-black text-slate-900 tabular-nums">
                {formatINR(baselineClosing)}
              </div>
              <div className="mt-2 text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Normal operational state
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Simulated Projected Cash
              </span>
              <div
                className={`mt-1 text-2xl font-black tabular-nums ${
                  isSevere ? 'text-rose-700' : 'text-blue-700'
                }`}
              >
                {formatINR(simulatedClosing)}
              </div>
              <div className="mt-2 text-[11px] text-rose-700 flex items-center gap-1 font-semibold">
                <TrendingDown className="h-3.5 w-3.5" /> Impact: {formatINR(cashDifference)}
              </div>
            </div>
          </div>

          {/* Comparison Bar Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Scenario Comparison Analysis</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="metric" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(15,23,42,0.08)' }}
                    itemStyle={{ color: '#0F172A', fontSize: '12px' }}
                    formatter={(value: number) => [formatINR(value), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
                  <Bar dataKey="Baseline" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#D97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommended Financial Safeguards */}
          <div
            className={`rounded-2xl border p-5 ${
              isSevere
                ? 'border-rose-200 bg-rose-50/80 text-rose-950'
                : 'border-blue-200 bg-blue-50/80 text-blue-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {isSevere ? (
                <ShieldAlert className="h-6 w-6 text-rose-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isSevere
                    ? 'Caution: Severe Liquidity Crunch Detected'
                    : 'Simulation Insights & Recommended Precautions'}
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {isSevere
                    ? `Under this scenario, your closing cash drops to ${formatINR(
                        simulatedClosing
                      )}, falling below 1 month of fixed operational overhead (${formatINR(
                        profile.monthlyFixedExpenses
                      )}).`
                    : `Your business retains a buffer of ${formatINR(
                        simulatedClosing
                      )}, but profit margins will shrink by ${Math.abs(
                        Math.round((cashDifference / (baselineClosing || 1)) * 100)
                      )}%.`}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-lg bg-white px-3 py-1 text-slate-700 border border-slate-200 shadow-xs font-medium">
                    Priority 1: Enforce strict WhatsApp follow-up for 100% of overdue invoices
                  </span>
                  <span className="rounded-lg bg-white px-3 py-1 text-slate-700 border border-slate-200 shadow-xs font-medium">
                    Priority 2: Negotiate staggered payments for emergency expenses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
