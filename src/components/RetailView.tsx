import React, { useState } from 'react';
import {
  Store,
  ShoppingCart,
  Plus,
  Minus,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { formatINR } from '../lib/format';

interface CartItem {
  product: Product;
  qty: number;
}

export const RetailView: React.FC = () => {
  const { products, updateProductStock, addInvoice, customers } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'pos' | 'inventory' | 'udhar'>('pos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('Counter Walk-in Customer');

  // POS Cart management
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Product is out of stock!');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.qty, 0);

  const handleCheckout = (paymentType: 'Cash' | 'UPI' | 'Credit') => {
    if (cart.length === 0) return;

    // Deduct stock
    cart.forEach((item) => {
      updateProductStock(item.product.id, -item.qty);
    });

    const isCredit = paymentType === 'Credit';

    addInvoice({
      customerId: `c-${Date.now()}`,
      customerName: isCredit ? `${customerName} (Udhar Khata)` : customerName,
      customerPhone: '+91 99887 00000',
      date: new Date().toISOString().split('T')[0],
      dueDate: isCredit ? '2026-12-05' : new Date().toISOString().split('T')[0],
      items: cart.map((item) => ({
        id: `pos-${item.product.id}`,
        description: item.product.name,
        quantity: item.qty,
        unitPrice: item.product.sellingPrice,
        amount: item.product.sellingPrice * item.qty,
      })),
      subtotal: cartSubtotal,
      tax: 0,
      total: cartSubtotal,
      paidAmount: isCredit ? 0 : cartSubtotal,
      status: isCredit ? 'Unpaid' : 'Paid',
      businessType: 'retail',
      notes: `POS Terminal Sale (${paymentType})`,
    });

    alert(
      `Sale complete! ${formatINR(cartSubtotal)} billed via ${paymentType}.${
        isCredit ? ' Recorded into Customer Credit Ledger (Udhar).' : ''
      }`
    );
    setCart([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Store className="h-6 w-6 text-emerald-600" />
            <span>Retail & Kirana Workspace: POS Terminal & Inventory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            High-speed counter billing, real-time stock deductions, and customer Udhar Khata credit.
          </p>
        </div>

        {/* Sub-Tabs (Precision Ledger Style) */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-xs">
          <button
            onClick={() => setActiveSubTab('pos')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeSubTab === 'pos'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            POS Terminal
          </button>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeSubTab === 'inventory'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inventory & Stock
          </button>
          <button
            onClick={() => setActiveSubTab('udhar')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeSubTab === 'udhar'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Udhar Khata (Credit)
          </button>
        </div>
      </div>

      {/* POS Billing Screen (Inspired by stitch_smart_cashflow_back_office) */}
      {activeSubTab === 'pos' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Products Grid */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Click Product to Add to Counter Bill</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-emerald-500 hover:shadow-card-hover transition-all flex flex-col justify-between min-h-[120px] shadow-card"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {p.category}
                    </span>
                    <div className="font-bold text-xs text-slate-900 leading-snug mt-1">{p.name}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="font-extrabold text-sm text-emerald-700 tabular-nums">
                      {formatINR(p.sellingPrice)}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        p.stock <= p.minStock ? 'text-rose-600' : 'text-slate-400'
                      }`}
                    >
                      {p.stock} left
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart & Checkout Panel */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-card">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold text-slate-900">Current Cart ({cart.length} items)</span>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-[11px] text-rose-600 hover:underline font-semibold"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Customer Selector */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Customer / Khata Account
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Counter Walk-in / Sunita Joshi"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Cart Items List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Cart is empty. Click any item on the left to add.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-xs"
                    >
                      <div className="flex-1 pr-2">
                        <div className="font-semibold text-slate-900 truncate max-w-[150px]">
                          {item.product.name}
                        </div>
                        <div className="text-[10px] text-slate-500 tabular-nums">
                          {formatINR(item.product.sellingPrice)} each
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQty(item.product.id, -1)}
                          className="h-6 w-6 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 shadow-xs"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono font-bold text-slate-900 w-4 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product.id, 1)}
                          className="h-6 w-6 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 shadow-xs"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <div className="font-bold text-slate-900 ml-2 tabular-nums">
                          {formatINR(item.product.sellingPrice * item.qty)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Total & Checkout Buttons */}
            <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-500 font-semibold">Total Amount Payable:</span>
                <span className="text-2xl font-black text-emerald-700 tabular-nums">
                  {formatINR(cartSubtotal)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={cart.length === 0}
                  onClick={() => handleCheckout('Cash')}
                  className="rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-xs transition-all"
                >
                  Cash Sale
                </button>
                <button
                  disabled={cart.length === 0}
                  onClick={() => handleCheckout('UPI')}
                  className="rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 shadow-xs transition-all"
                >
                  UPI QR Sale
                </button>
                <button
                  disabled={cart.length === 0}
                  onClick={() => handleCheckout('Credit')}
                  className="rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50 shadow-xs transition-all"
                >
                  Udhar (Credit)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory & Stock Management */}
      {activeSubTab === 'inventory' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Stock & Inventory Management</h3>
              <p className="text-xs text-slate-500">Automatic low-stock detection and restock tools</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Product Name</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">SKU</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Category</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Purchase Cost</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Selling Price</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Current Stock</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px] text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-3 text-slate-500 font-mono">{p.sku}</td>
                      <td className="py-3 px-3 text-slate-600">{p.category}</td>
                      <td className="py-3 px-3 text-slate-500 tabular-nums">{formatINR(p.purchaseCost)}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">{formatINR(p.sellingPrice)}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 tabular-nums">{p.stock} units</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                            isLow
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isLow ? 'Low Stock' : 'Optimal'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => updateProductStock(p.id, 20)}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 shadow-xs"
                        >
                          <RefreshCw className="h-3 w-3" /> +20 Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Udhar Khata (Customer Credit Ledger) */}
      {activeSubTab === 'udhar' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Udhar Khata (Customer Credit Ledger)</h3>
            <p className="text-xs text-slate-500">
              Manage retail customers who purchase goods on credit and settle monthly.
            </p>
          </div>

          <div className="space-y-3">
            {customers
              .filter((c) => c.businessType === 'retail' || c.outstanding > 0)
              .map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">Phone: {c.phone}</div>
                    <div className="text-[11px] text-slate-600 mt-1">{c.notes}</div>
                  </div>
                  <div className="text-right space-y-1.5">
                    <div className="text-xs text-slate-500">Total Pending Udhar:</div>
                    <div className="text-lg font-black text-rose-700 tabular-nums">
                      {formatINR(c.outstanding)}
                    </div>
                    <button
                      onClick={() => alert(`Recorded cash receipt from ${c.name}. Udhar cleared!`)}
                      className="rounded-lg bg-emerald-600 px-3.5 py-1 font-bold text-white hover:bg-emerald-700 shadow-xs"
                    >
                      Collect Payment
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
