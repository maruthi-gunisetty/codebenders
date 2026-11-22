import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  AlertTriangle,
  MessageCircle,
  Check,
  X,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../lib/format';

export const EducationView: React.FC = () => {
  const { students, addStudent, addInvoice, profile } = useApp();

  const [search, setSearch] = useState('');
  const [filterBatch, setFilterBatch] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [batch, setBatch] = useState('Class 10 Science & Math');
  const [monthlyFee, setMonthlyFee] = useState('8500');
  const [dueDay, setDueDay] = useState('5');

  const batches = ['All', 'Class 10 Science & Math', 'Class 12 CBSE Entrance', 'IIT Foundation Batch A'];

  const filteredStudents = students.filter((s) => {
    const matchesBatch = filterBatch === 'All' || s.batch === filterBatch;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.guardianPhone.includes(search);
    return matchesBatch && matchesSearch;
  });

  const defaulters = students.filter((s) => s.status === 'Defaulter');

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      name,
      phone,
      guardianPhone,
      batch,
      monthlyFee: parseFloat(monthlyFee) || 0,
      status: 'Active',
      dueDay: parseInt(dueDay) || 5,
      lastPaymentDate: new Date().toISOString().split('T')[0],
    });
    setIsAddOpen(false);
    setName('');
    setPhone('');
    setGuardianPhone('');
  };

  const handleCollectFee = (stName: string, fee: number) => {
    addInvoice({
      customerId: `c-${Date.now()}`,
      customerName: `${stName} (Fee Collection)`,
      customerPhone: '+91 98000 00000',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: [
        {
          id: `fee-${Date.now()}`,
          description: `Tuition Fee Payment - ${stName}`,
          quantity: 1,
          unitPrice: fee,
          amount: fee,
        },
      ],
      subtotal: fee,
      tax: 0,
      total: fee,
      paidAmount: fee,
      status: 'Paid',
      businessType: 'education',
      notes: 'Counter Fee Receipt Generated',
    });
    alert(`Fee of ${formatINR(fee)} for ${stName} collected and recorded to cash ledger!`);
  };

  const copyParentReminder = (stName: string, fee: number, id: string) => {
    const text = `Dear Parent / Guardian of ${stName},\nGreetings from ${profile.name}.\nThis is a friendly reminder that the monthly tuition fee of ${formatINR(
      fee
    )} is currently pending. Kindly complete the payment via UPI or visit the academy office.\nThank you,\n${profile.ownerName}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span>Education Workspace: Student & Fee Defaulters</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage batches, monthly fee cycles, overdue fee defaulters, and automated parent notifications.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Defaulter Priority Banner (Precision Ledger Alert) */}
      {defaulters.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">
                {defaulters.length} Students Have Overdue Tuition Fees
              </h4>
              <p className="mt-1 text-xs text-slate-600">
                Total uncollected tuition from defaulters:{' '}
                <span className="font-bold text-rose-700 tabular-nums">
                  {formatINR(defaulters.reduce((acc, s) => acc + s.monthlyFee, 0))}
                </span>
                . Follow up with parents using the instant WhatsApp draft buttons below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Batches */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {batches.map((b) => (
            <button
              key={b}
              onClick={() => setFilterBatch(b)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterBatch === b
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or phone..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500">
              <tr>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Student Name</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Batch</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Guardian Phone</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Monthly Fee</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Due Cycle</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Fee Status</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{st.name}</td>
                  <td className="py-3 px-3 text-slate-600">{st.batch}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono">{st.guardianPhone}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">{formatINR(st.monthlyFee)}</td>
                  <td className="py-3 px-3 text-slate-500">{st.dueDay}th of month</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                        st.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    {st.status === 'Defaulter' ? (
                      <button
                        onClick={() => copyParentReminder(st.name, st.monthlyFee, st.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 shadow-xs"
                      >
                        {copiedId === st.id ? (
                          <>
                            <Check className="h-3 w-3" /> Copied!
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-3 w-3" /> WhatsApp Parent
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Paid
                      </span>
                    )}

                    <button
                      onClick={() => handleCollectFee(st.name, st.monthlyFee)}
                      className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 shadow-xs"
                    >
                      Collect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll Student Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Enroll Student in Academy</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditya Verma"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Student Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 00000"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Parent / Guardian Phone</label>
                <input
                  type="text"
                  required
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+91 98200 11111"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Assigned Batch</label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="Class 10 Science & Math">Class 10 Science & Math</option>
                  <option value="Class 12 CBSE Entrance">Class 12 CBSE Entrance</option>
                  <option value="IIT Foundation Batch A">IIT Foundation Batch A</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600">Monthly Due Day</label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    required
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none tabular-nums"
                  />
                </div>
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
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
