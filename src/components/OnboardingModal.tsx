import React, { useState } from 'react';
import {
  GraduationCap,
  Scissors,
  Store,
  X,
  ArrowRight,
  Building2,
  Phone,
  Mail,
  IndianRupee,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BusinessType } from '../types';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setBusinessType, updateProfile, setView } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<BusinessType>('education');
  const [businessName, setBusinessName] = useState('Apex Coaching Institute');
  const [ownerName, setOwnerName] = useState('Business Owner');
  const [phone, setPhone] = useState('+91 98000 12345');
  const [email, setEmail] = useState('owner@business.com');
  const [openingCash, setOpeningCash] = useState('50000');
  const [openingBank, setOpeningBank] = useState('200000');
  const [monthlyRent, setMonthlyRent] = useState('30000');

  if (!isOnboardingOpen) return null;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessType(selectedType);
    updateProfile({
      name: businessName,
      ownerName,
      phone,
      email,
      openingCash: parseFloat(openingCash) || 0,
      openingBank: parseFloat(openingBank) || 0,
      monthlyFixedExpenses: parseFloat(monthlyRent) || 0,
    });
    setIsOnboardingOpen(false);
    setView('app');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                <Sparkles className="h-3 w-3" />
                <span>Tailored Workspace Setup</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Business Selection Wizard</h3>
            </div>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
          <span className={step === 1 ? 'font-bold text-blue-600' : 'text-slate-900 font-medium'}>
            1. Choose Business Type
          </span>
          <span className={step === 2 ? 'font-bold text-blue-600' : 'text-slate-400 font-medium'}>
            2. Initial Balances
          </span>
        </div>

        {/* Step 1: Industry Selection */}
        {step === 1 && (
          <div className="mt-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">What type of business do you run?</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose your business type. We will customize your workspace to match the way you work.
              </p>
            </div>

            <div className="grid gap-3">
              {/* Option 1: Education */}
              <button
                type="button"
                onClick={() => {
                  setSelectedType('education');
                  setBusinessName('Apex Coaching Institute');
                }}
                className={`flex flex-col rounded-xl p-4 text-left transition-all ${
                  selectedType === 'education'
                    ? 'border-2 border-blue-600 bg-blue-50/70 shadow-sm'
                    : 'border border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedType === 'education'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Education & Coaching
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Home tutors, Tuition centres, Coaching institutes
                      </p>
                    </div>
                  </div>
                  {selectedType === 'education' && (
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-blue-100/60">
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-blue-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Student management
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-blue-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Monthly fee collection
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-blue-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Attendance
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-blue-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Fee reminders
                  </span>
                </div>
              </button>

              {/* Option 2: Salon */}
              <button
                type="button"
                onClick={() => {
                  setSelectedType('salon');
                  setBusinessName('Glow Salon & Studio');
                }}
                className={`flex flex-col rounded-xl p-4 text-left transition-all ${
                  selectedType === 'salon'
                    ? 'border-2 border-pink-600 bg-pink-50/70 shadow-sm'
                    : 'border border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedType === 'salon'
                          ? 'bg-pink-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Scissors className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Salon & Beauty
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Beauty salons, Barbershops, Small beauty studios
                      </p>
                    </div>
                  </div>
                  {selectedType === 'salon' && (
                    <CheckCircle2 className="h-5 w-5 text-pink-600 shrink-0" />
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-pink-100/60">
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-pink-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Appointments
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-pink-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Service billing
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-pink-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Staff management
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-pink-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Commission tracking
                  </span>
                </div>
              </button>

              {/* Option 3: Retail */}
              <button
                type="button"
                onClick={() => {
                  setSelectedType('retail');
                  setBusinessName('Shreeji Retail Mart');
                }}
                className={`flex flex-col rounded-xl p-4 text-left transition-all ${
                  selectedType === 'retail'
                    ? 'border-2 border-emerald-600 bg-emerald-50/70 shadow-sm'
                    : 'border border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedType === 'retail'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Store className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Retail & Small Shops
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kirana shops, Grocery stores, Small retailers
                      </p>
                    </div>
                  </div>
                  {selectedType === 'retail' && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-emerald-100/60">
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    POS billing
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Inventory tracking
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Credit management (Udhar)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-200 text-slate-700 text-[11px] font-medium shadow-xs">
                    Supplier payments
                  </span>
                </div>
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
              >
                <span>Continue to Financial Setup</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Financial Opening Balances */}
        {step === 2 && (
          <form onSubmit={handleFinish} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600">
                  Business Display Name
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Building2 className="h-4 w-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Owner Name</label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Owner Phone</label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Phone className="h-4 w-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Email Address</label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Mail className="h-4 w-4 text-slate-400 mr-2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">
                  Opening Cash in Hand (₹)
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <IndianRupee className="h-4 w-4 text-slate-400 mr-2" />
                  <input
                    type="number"
                    required
                    value={openingCash}
                    onChange={(e) => setOpeningCash(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">
                  Opening Bank Balance (₹)
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <IndianRupee className="h-4 w-4 text-slate-400 mr-2" />
                  <input
                    type="number"
                    required
                    value={openingBank}
                    onChange={(e) => setOpeningBank(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600">
                Monthly Fixed Rent / Overhead (₹)
              </label>
              <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <IndianRupee className="h-4 w-4 text-slate-400 mr-2" />
                <input
                  type="number"
                  required
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-900 focus:outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
              >
                <span>Enter Workspace</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
