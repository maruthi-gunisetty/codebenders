export type BusinessType = 'education' | 'salon' | 'retail';

export type NavigationTab =
  | 'dashboard'
  | 'cashflow'
  | 'simulator'
  | 'invoices'
  | 'customers'
  | 'expenses'
  | 'ai-assistant'
  | 'reports'
  | 'students'
  | 'appointments'
  | 'pos'
  | 'products'
  | 'credit-book';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  outstanding: number;
  totalBilled: number;
  businessType: BusinessType;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type InvoiceStatus = 'Draft' | 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  status: InvoiceStatus;
  businessType: BusinessType;
  notes?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Card';
  recurring: boolean;
  businessType: BusinessType;
  vendor: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  guardianPhone: string;
  batch: string;
  monthlyFee: number;
  status: 'Active' | 'Defaulter' | 'Inactive';
  dueDay: number;
  lastPaymentDate: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  staffName: string;
  date: string;
  time: string;
  price: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  purchaseCost: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
}

export interface SmartAlert {
  id: string;
  title: string;
  severity: 'danger' | 'warning' | 'info' | 'success';
  message: string;
  actionText: string;
  actionTab: NavigationTab;
  date: string;
  read: boolean;
}

export interface BusinessProfile {
  name: string;
  type: BusinessType;
  ownerName: string;
  phone: string;
  email: string;
  openingCash: number;
  openingBank: number;
  monthlyFixedExpenses: number;
}
