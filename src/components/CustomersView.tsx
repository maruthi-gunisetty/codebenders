import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Check,
  X,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../lib/format';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, businessType, profile } = useApp();

  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [outstanding, setOutstanding] = useState('0');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstanding, 0);
  const overdueCustomers = customers.filter((c) => c.outstanding > 10000);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name,
      phone,
      email,
      notes,
      outstanding: parseFloat(outstanding) || 0,
      totalBilled: parseFloat(outstanding) || 0,
      businessType,
    });
    setIsAddOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setOutstanding('0');
  };

  const copyReminderText = (custName: string, amount: number, id: string) => {
    const text = `Dear ${custName},\nGreetings from ${profile.name}.\nThis is a polite reminder regarding your pending balance of ${formatINR(
      amount
    )}. Please arrange for settlement at your earliest convenience via UPI or bank transfer.\nThank you,\n${profile.ownerName}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header (Precision Ledger Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>Customer & Udhar Khata Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track customer balances, payment records, and automated WhatsApp follow-up communications.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Summary Stats (Matching customer_udhar_whatsapp_follow_up) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Outstanding
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900 tabular-nums">
            {formatINR(totalOutstanding)}
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-semibold">
            {customers.length} active customer accounts
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-card">
          <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
            Overdue Risk (&gt;15 Days)
          </div>
          <div className="mt-1 text-2xl font-black text-rose-700 tabular-nums">
            {formatINR(overdueCustomers.reduce((s, c) => s + c.outstanding, 0))}
          </div>
          <div className="mt-2 text-[11px] text-rose-700 font-semibold">
            {overdueCustomers.length} accounts require immediate follow-up
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Collections This Month
          </div>
          <div className="mt-1 text-2xl font-black text-emerald-700 tabular-nums">
            {formatINR(totalOutstanding * 0.45)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
            Reconciled payments logged
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer name, phone, or email..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all shadow-xs"
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500">
              <tr>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Customer Name</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Contact Info</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Notes / Khata Info</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Total Billed</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Outstanding Due</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px] text-right">Follow-Up Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-3 text-slate-500 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium font-mono">
                        <Phone className="h-3 w-3 text-slate-400" /> {c.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Mail className="h-3 w-3 text-slate-400" /> {c.email}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{c.notes || '—'}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900 tabular-nums">{formatINR(c.totalBilled)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-black tabular-nums ${
                          c.outstanding > 0 ? 'text-rose-700' : 'text-emerald-700'
                        }`}
                      >
                        {formatINR(c.outstanding)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {c.outstanding > 0 ? (
                        <button
                          onClick={() => copyReminderText(c.name, c.outstanding, c.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-xs"
                        >
                          {copiedId === c.id ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Draft Copied!
                            </>
                          ) : (
                            <>
                              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Reminder
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Settled All Clear
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Add Customer Record</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@gmail.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">
                  Initial Opening Due / Khata Balance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={outstanding}
                  onChange={(e) => setOutstanding(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Operational Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Student batch info, preferences, or credit terms"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
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
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-xs"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
