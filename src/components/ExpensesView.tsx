import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR, formatDate } from '../lib/format';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, businessType } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Rent');
  const [amount, setAmount] = useState('5000');
  const [vendor, setVendor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Card'>('UPI');
  const [recurring, setRecurring] = useState(false);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Group by category
  const categoriesMap = expenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      title,
      category,
      amount: parseFloat(amount) || 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      recurring,
      businessType,
      vendor: vendor || 'Vendor / Utility Provider',
    });
    setIsAddOpen(false);
    setTitle('');
    setVendor('');
    setAmount('5000');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="h-6 w-6 text-rose-600" />
            <span>Operational Expenses & Overhead</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track business operating costs, rent, employee salaries, and recurring supplier commitments.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(categoriesMap).map(([cat, amt]) => (
          <div key={cat} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{cat} Outflows</div>
            <div className="mt-1 text-xl font-bold text-slate-900 tabular-nums">{formatINR(amt)}</div>
            <div className="mt-2 text-[10px] text-slate-400 font-medium">
              {Math.round((amt / (totalExpenses || 1)) * 100)}% of total expenses
            </div>
          </div>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500">
              <tr>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Expense Title</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Category</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Vendor / Payee</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Date</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Payment Method</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Type</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{exp.title}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{exp.category}</td>
                  <td className="py-3 px-3 text-slate-500">{exp.vendor}</td>
                  <td className="py-3 px-3 text-slate-500">{formatDate(exp.date)}</td>
                  <td className="py-3 px-3 text-slate-500">{exp.paymentMethod}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                        exp.recurring
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {exp.recurring ? 'Recurring' : 'One-Time'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-black text-rose-700 tabular-nums">
                    {formatINR(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Record Operating Expense</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600">Expense Description</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. November Facility Rent / Electricity Bill"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-rose-600 focus:outline-none"
                  >
                    <option value="Rent">Rent</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Inventory">Inventory / Supplies</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-rose-600 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Vendor / Payee</label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. City Properties Ltd / Adani Power"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-rose-600 focus:outline-none"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="recurringCheck"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <label htmlFor="recurringCheck" className="text-slate-700 cursor-pointer">
                  This is a fixed monthly recurring commitment (e.g. Rent, Salary)
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-700 shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
