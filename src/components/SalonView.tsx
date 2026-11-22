import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../lib/format';

export const SalonView: React.FC = () => {
  const { appointments, addAppointment, updateAppointmentStatus, addInvoice } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 00000');
  const [serviceName, setServiceName] = useState('Hair Spa & Keratin Therapy');
  const [staffName, setStaffName] = useState('Sanjay Stylist');
  const [time, setTime] = useState('12:00 PM');
  const [price, setPrice] = useState('3500');

  const services = [
    { name: 'Hair Spa & Keratin Therapy', defaultPrice: 3500 },
    { name: 'Hydra Glow Facial', defaultPrice: 2400 },
    { name: 'Full Bridal Trial & Makeup', defaultPrice: 6500 },
    { name: 'Executive Haircut & Beard Grooming', defaultPrice: 900 },
    { name: 'Manicure & Pedicure Deluxe', defaultPrice: 1800 },
  ];

  const staffMembers = [
    { name: 'Sanjay Stylist', role: 'Master Hair Stylist', commissionRate: 0.2 },
    { name: 'Neha Skin Expert', role: 'Dermal Aesthetician', commissionRate: 0.25 },
    { name: 'Pooja Verma', role: 'Senior Bridal Makeup Artist', commissionRate: 0.3 },
  ];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      customerName,
      customerPhone,
      serviceName,
      staffName,
      date: new Date().toISOString().split('T')[0],
      time,
      price: parseFloat(price) || 0,
      status: 'Scheduled',
    });
    setIsAddOpen(false);
    setCustomerName('');
  };

  const handleComplete = (appId: string, customer: string, service: string, amount: number) => {
    updateAppointmentStatus(appId, 'Completed');
    addInvoice({
      customerId: `c-${Date.now()}`,
      customerName: customer,
      customerPhone: '+91 98765 00000',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: [
        {
          id: `item-${Date.now()}`,
          description: service,
          quantity: 1,
          unitPrice: amount,
          amount,
        },
      ],
      subtotal: amount,
      tax: 0,
      total: amount,
      paidAmount: amount,
      status: 'Paid',
      businessType: 'salon',
      notes: 'Counter POS Service Checkout',
    });
    alert(`Appointment completed! Invoice generated and ${formatINR(amount)} added to salon cash.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Scissors className="h-6 w-6 text-pink-600" />
            <span>Salon Workspace: Appointments & Staff Billing</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time appointment scheduler, multi-service counter checkout, and stylist commission breakdown.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white hover:bg-pink-700 shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Staff Commission Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {staffMembers.map((staff) => {
          const completedCount = appointments.filter(
            (a) => a.staffName === staff.name && a.status === 'Completed'
          ).length;
          const totalRevenueGenerated = appointments
            .filter((a) => a.staffName === staff.name && a.status === 'Completed')
            .reduce((sum, a) => sum + a.price, 0);
          const commissionEarned = totalRevenueGenerated * staff.commissionRate;

          return (
            <div key={staff.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{staff.name}</span>
                <span className="rounded-full bg-pink-50 border border-pink-200 px-2.5 py-0.5 text-[10px] font-bold text-pink-700">
                  {staff.commissionRate * 100}% Comm
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {staff.role} • {completedCount} completed
              </div>
              <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5">
                <span className="text-slate-500">Commission Earned:</span>
                <span className="font-bold text-emerald-700 tabular-nums">{formatINR(commissionEarned)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointments Schedule Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="text-base font-bold text-slate-900 mb-4">Today's Appointment Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500">
              <tr>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Client Name</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Contact</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Service</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Assigned Stylist</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Time Slot</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Service Price</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((ap) => (
                <tr key={ap.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{ap.customerName}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono">{ap.customerPhone}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{ap.serviceName}</td>
                  <td className="py-3 px-3 text-slate-900 font-medium">{ap.staffName}</td>
                  <td className="py-3 px-3 text-slate-500 font-medium">{ap.time}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">{formatINR(ap.price)}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                        ap.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {ap.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {ap.status !== 'Completed' ? (
                      <button
                        onClick={() =>
                          handleComplete(ap.id, ap.customerName, ap.serviceName, ap.price)
                        }
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-xs"
                      >
                        Complete & Bill
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Billed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Book Salon Appointment</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600">Client Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Shalini Roy"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-pink-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Client Phone</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-pink-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Select Service</label>
                <select
                  value={serviceName}
                  onChange={(e) => {
                    setServiceName(e.target.value);
                    const found = services.find((s) => s.name === e.target.value);
                    if (found) setPrice(found.defaultPrice.toString());
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-pink-600 focus:outline-none"
                >
                  {services.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} ({formatINR(s.defaultPrice)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600">Assigned Specialist</label>
                  <select
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-pink-600 focus:outline-none"
                  >
                    {staffMembers.map((st) => (
                      <option key={st.name} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 03:00 PM"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-pink-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Price (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-pink-600 focus:outline-none tabular-nums"
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
                  className="rounded-xl bg-pink-600 px-5 py-2 font-bold text-white hover:bg-pink-700 shadow-xs"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
