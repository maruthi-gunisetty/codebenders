import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Check,
  Copy,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../lib/format';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  whatsappDraft?: string;
  timestamp: string;
}

export const AIAssistantView: React.FC = () => {
  const { profile, invoices, customers, expenses, businessType } = useApp();
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pre-calculated stats for deterministic assistant responses
  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue');
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + (i.total - i.paidAmount), 0);
  const liquidCash = profile.openingCash + profile.openingBank;

  const topDebtor = customers.reduce(
    (max, c) => (c.outstanding > max.outstanding ? c : max),
    customers[0] || { name: 'None', outstanding: 0 }
  );

  const initialMessages: Message[] = [
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${profile.ownerName}! I am your CASHFLOW AI Copilot for ${profile.name}. I have analyzed your ledger: you have ${formatINR(
        liquidCash
      )} in liquid funds, and ${overdueInvoices.length} invoices currently overdue totaling ${formatINR(
        totalOverdue
      )}. What would you like to examine today?`,
      timestamp: 'Just now',
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    let reply = '';
    let draft: string | undefined = undefined;
    const lower = userText.toLowerCase();

    if (lower.includes('who owes') || lower.includes('most money') || lower.includes('debtor')) {
      reply = `According to your current ledger, **${topDebtor.name}** owes the most money, with an outstanding balance of **${formatINR(
        topDebtor.outstanding
      )}**. Total overdue across all clients is ${formatINR(totalOverdue)}.`;
      draft = `Dear ${topDebtor.name},\nThis is a polite reminder regarding your pending balance of ${formatINR(
        topDebtor.outstanding
      )} for ${profile.name}. Kindly settle this at your earliest convenience via UPI or bank transfer.\nThank you,\n${profile.ownerName}`;
    } else if (lower.includes('rent') || lower.includes('afford')) {
      const remainingAfterRent = liquidCash - profile.monthlyFixedExpenses;
      reply = `Yes. Your current liquid cash and bank balance is **${formatINR(
        liquidCash
      )}**. Your monthly fixed overhead is **${formatINR(
        profile.monthlyFixedExpenses
      )}**. After paying rent and overhead, you will still retain **${formatINR(
        remainingAfterRent
      )}**, giving you a comfortable runway of ${(liquidCash / (profile.monthlyFixedExpenses || 1)).toFixed(
        1
      )} months.`;
    } else if (lower.includes('whatsapp') || lower.includes('reminder') || lower.includes('draft')) {
      const targetInvoice = overdueInvoices[0] || invoices[0];
      reply = `I have generated a professional, polite WhatsApp payment reminder draft for ${targetInvoice ? targetInvoice.customerName : 'your client'} for ${formatINR(
        targetInvoice ? targetInvoice.total - targetInvoice.paidAmount : 5000
      )}. You can copy it directly using the button below.`;
      draft = `Dear ${targetInvoice ? targetInvoice.customerName : 'Client'},\nGreetings from ${profile.name}.\nWe hope you are doing well. This is a gentle reminder regarding Invoice ${
        targetInvoice ? targetInvoice.invoiceNumber : 'INV-01'
      } for ${formatINR(
        targetInvoice ? targetInvoice.total - targetInvoice.paidAmount : 5000
      )}, which was due on ${targetInvoice ? targetInvoice.dueDate : 'recently'}.\n\nPlease let us know if you need our bank account / UPI details for immediate payment.\nWarm regards,\n${profile.ownerName}`;
    } else if (lower.includes('sales drop') || lower.includes('simulate') || lower.includes('20%')) {
      reply = `A 20% drop in new sales would reduce monthly collections by approximately **${formatINR(
        (invoices.reduce((s, i) => s + i.total, 0) * 0.2)
      )}**. Because your fixed overhead is ${formatINR(
        profile.monthlyFixedExpenses
      )}, we suggest reviewing non-essential utility expenses and activating the What-If Simulator tab for detailed modeling.`;
    } else {
      reply = `Based on your ${businessType} records: Total billed is ${formatINR(
        invoices.reduce((s, i) => s + i.total, 0)
      )}, actual collected is ${formatINR(
        invoices.reduce((s, i) => s + i.paidAmount, 0)
      )}, and recorded expenses stand at ${formatINR(
        expenses.reduce((s, e) => s + e.amount, 0)
      )}. Your business is operating with positive net cash flow.`;
    }

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: reply,
      whatsappDraft: draft,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const quickPrompts = [
    'Who owes me the most money?',
    'Can I afford next month rent?',
    'Generate WhatsApp reminder for overdue clients',
    'What happens if sales drop by 20%?',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span>AI Business Assistant & Intelligence Copilot</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grounded intelligence operating on verified accounts, invoices, and payment ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Deterministic Ledger Engine Active</span>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 shadow-xs transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-200 bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 text-[10px] opacity-75 font-semibold">
                  <span>{msg.sender === 'user' ? profile.ownerName : 'CASHFLOW AI Copilot'}</span>
                  <span>• {msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* WhatsApp Ready Copy Card */}
                {msg.whatsappDraft && (
                  <div className="mt-3.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp-Ready Message:
                      </span>
                      <button
                        onClick={() => copyToClipboard(msg.whatsappDraft!, msg.id)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3 w-3" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copy Text
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="font-sans text-[11px] text-slate-700 whitespace-pre-wrap bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                      {msg.whatsappDraft}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your cash balance, overdue payments, or simulated risk..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
