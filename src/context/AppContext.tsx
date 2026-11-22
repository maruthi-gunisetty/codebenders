import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BusinessType,
  NavigationTab,
  BusinessProfile,
  Customer,
  Invoice,
  InvoiceStatus,
  Expense,
  Student,
  Appointment,
  Product,
  SmartAlert,
} from '../types';
import {
  initialProfiles,
  initialCustomers,
  initialInvoices,
  initialExpenses,
  initialStudents,
  initialAppointments,
  initialProducts,
  initialAlerts,
} from '../lib/mockData';

interface AppContextType {
  view: 'landing' | 'app';
  setView: (v: 'landing' | 'app') => void;
  activeTab: NavigationTab;
  setActiveTab: (t: NavigationTab) => void;
  businessType: BusinessType;
  setBusinessType: (b: BusinessType) => void;
  profile: BusinessProfile;
  updateProfile: (p: Partial<BusinessProfile>) => void;
  customers: Customer[];
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt'>) => void;
  invoices: Invoice[];
  addInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus, paidAmount?: number) => void;
  expenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id'>) => void;
  students: Student[];
  addStudent: (st: Omit<Student, 'id'>) => void;
  appointments: Appointment[];
  addAppointment: (ap: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: 'Scheduled' | 'Completed' | 'Cancelled') => void;
  products: Product[];
  addProduct: (prod: Omit<Product, 'id'>) => void;
  updateProductStock: (id: string, delta: number) => void;
  alerts: SmartAlert[];
  markAlertRead: (id: string) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<'landing' | 'app'>(() => {
    return (localStorage.getItem('cashflow_view') as 'landing' | 'app') || 'landing';
  });

  const [businessType, setBusinessTypeState] = useState<BusinessType>(() => {
    return (localStorage.getItem('cashflow_btype') as BusinessType) || 'education';
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [profiles, setProfiles] = useState<Record<string, BusinessProfile>>(() => {
    const saved = localStorage.getItem('cashflow_profiles');
    return saved ? JSON.parse(saved) : initialProfiles;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('cashflow_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('cashflow_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('cashflow_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('cashflow_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('cashflow_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cashflow_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [alerts, setAlerts] = useState<SmartAlert[]>(() => {
    const saved = localStorage.getItem('cashflow_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cashflow_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('cashflow_btype', businessType);
  }, [businessType]);

  useEffect(() => {
    localStorage.setItem('cashflow_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('cashflow_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('cashflow_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('cashflow_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('cashflow_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('cashflow_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('cashflow_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cashflow_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const setBusinessType = (b: BusinessType) => {
    setBusinessTypeState(b);
    setActiveTab('dashboard');
  };

  const currentProfile = profiles[businessType] || initialProfiles[businessType];

  const updateProfile = (p: Partial<BusinessProfile>) => {
    setProfiles((prev) => ({
      ...prev,
      [businessType]: { ...prev[businessType], ...p },
    }));
  };

  const addCustomer = (c: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust: Customer = {
      ...c,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const addInvoice = (inv: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const prefix = businessType === 'education' ? 'EDU' : businessType === 'salon' ? 'SAL' : 'RET';
    const newInv: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${prefix}-${Math.floor(100 + Math.random() * 900)}`,
    };
    setInvoices((prev) => [newInv, ...prev]);
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus, paidAmount?: number) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;
        const newPaid = paidAmount !== undefined ? paidAmount : status === 'Paid' ? inv.total : inv.paidAmount;
        return {
          ...inv,
          status,
          paidAmount: newPaid,
        };
      })
    );
  };

  const addExpense = (exp: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const addStudent = (st: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...st,
      id: `st-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const addAppointment = (ap: Omit<Appointment, 'id'>) => {
    const newApp: Appointment = {
      ...ap,
      id: `app-${Date.now()}`,
    };
    setAppointments((prev) => [newApp, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: 'Scheduled' | 'Completed' | 'Cancelled') => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProductStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        activeTab,
        setActiveTab,
        businessType,
        setBusinessType,
        profile: currentProfile,
        updateProfile,
        customers,
        addCustomer,
        invoices,
        addInvoice,
        updateInvoiceStatus,
        expenses,
        addExpense,
        students,
        addStudent,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        products,
        addProduct,
        updateProductStock,
        alerts,
        markAlertRead,
        isOnboardingOpen,
        setIsOnboardingOpen,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
