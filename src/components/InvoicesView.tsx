import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Printer,
  X,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Invoice, InvoiceStatus } from '../types';
import { formatINR, formatDate } from '../lib/format';

export const InvoicesView: React.FC = () => {
  const { invoices, addInvoice, updateInvoiceStatus, businessType, profile } = useApp();

  const [filter, setFilter] = useState<'all' | InvoiceStatus>('all');
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+91 98000 00000');
  const [itemDesc, setItemDesc] = useState('');
  const [itemQty, setItemQty] = useState('1');
  const [itemPrice, setItemPrice] = useState('5000');
  const [taxPct, setTaxPct] = useState('0');
  const [dueDate, setDueDate] = useState('2026-11-30');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = filter === 'all' || inv.status === filter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(itemQty) || 1;
    const price = parseFloat(itemPrice) || 0;
    const subtotal = qty * price;
    const tax = subtotal * ((parseFloat(taxPct) || 0) / 100);
    const total = subtotal + tax;

    addInvoice({
      customerId: `c-${Date.now()}`,
      customerName,
      customerPhone,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      items: [
        {
          id: `item-${Date.now()}`,
          description: itemDesc || 'Service / Product Billing',
          quantity: qty,
          unitPrice: price,
          amount: subtotal,
        },
      ],
      subtotal,
      tax,
      total,
      paidAmount: 0,
      status: 'Unpaid',
      businessType,
      notes: 'Generated via CASHFLOW AI Billing Module',
    });

    setIsCreateOpen(false);
    setCustomerName('');
    setItemDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span>Invoices & Billing Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, track, and collect invoices. Compliant with deterministic payment reconciliation.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'Unpaid', 'Overdue', 'Partially Paid', 'Paid'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice or client..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
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
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No invoices match your current search or filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
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
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600"
                        title="View printable invoice"
                      >
                        <Eye className="h-3 w-3 inline mr-1" /> View
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                          className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Generate Customer Invoice</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600">Customer / Client Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Customer Phone (for WhatsApp)</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Item / Service Description</label>
                <input
                  type="text"
                  required
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="e.g. Monthly Tuition Fee / Bridal Hair Styling / Wholesale Order"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={itemQty}
                    onChange={(e) => setItemQty(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600">Unit Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600">GST Tax %</label>
                  <input
                    type="number"
                    min="0"
                    value={taxPct}
                    onChange={(e) => setTaxPct(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-xs"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal (Precision Ledger Style) */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl text-slate-900">
            {/* Header / Actions */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  CF
                </div>
                <span className="font-bold text-slate-900">{profile.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
                >
                  <Printer className="h-3.5 w-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="mt-6 space-y-6 text-xs">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">TAX INVOICE</h2>
                  <p className="font-mono text-sm text-blue-600 font-bold">
                    {selectedInvoice.invoiceNumber}
                  </p>
                  <p className="mt-1 text-slate-500">Date: {formatDate(selectedInvoice.date)}</p>
                  <p className="text-slate-500">Due Date: {formatDate(selectedInvoice.dueDate)}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{profile.name}</div>
                  <div className="text-slate-500">{profile.phone}</div>
                  <div className="text-slate-500">{profile.email}</div>
                  <div className="mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700 border-emerald-200 bg-emerald-50">
                    Status: {selectedInvoice.status}
                  </div>
                </div>
              </div>

              {/* Billed To */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-[11px] font-bold uppercase text-slate-500">Billed To:</div>
                <div className="mt-1 font-bold text-sm text-slate-900">{selectedInvoice.customerName}</div>
                <div className="text-slate-500">{selectedInvoice.customerPhone}</div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Description</th>
                    <th className="py-2 px-3 font-semibold text-center">Qty</th>
                    <th className="py-2 px-3 font-semibold text-right">Unit Price</th>
                    <th className="py-2 px-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items.map((it) => (
                    <tr key={it.id}>
                      <td className="py-2.5 px-3 text-slate-900 font-medium">{it.description}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600 tabular-nums">{it.quantity}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600 tabular-nums">{formatINR(it.unitPrice)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">{formatINR(it.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-56 space-y-1.5 border-t border-slate-200 pt-3 text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="tabular-nums font-semibold">{formatINR(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax (GST):</span>
                    <span className="tabular-nums font-semibold">{formatINR(selectedInvoice.tax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 text-sm font-black text-slate-900">
                    <span>Total Due:</span>
                    <span className="text-blue-600 tabular-nums">{formatINR(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
