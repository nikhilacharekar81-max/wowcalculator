import React, { useState, useEffect, useMemo, useId } from 'react';
import { 
  Home, TrendingUp, ShieldAlert, Zap, Compass, ArrowRight, ChevronDown, ChevronUp,
  DollarSign, PoundSterling, Euro, CircleDollarSign, Plus, Trash2,
  RefreshCw, Wallet, PiggyBank, Briefcase, Landmark, Info, LogOut, Settings,
  Sun, Moon, Database, Cpu, Calculator, CheckCircle2, Link2, Copy, Check, Search, X,
  Download, Printer, FileSpreadsheet, BookOpen, HelpCircle, ShieldCheck, Layers, Menu, Sliders
} from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  type User, 
  db, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp 
} from './firebase';
import { 
  calculateMortgage, 
  calculateInvestment, 
  calculateDebtPayoff, 
  calculateRetirement, 
  type Debt,
  US_MORTGAGE_CONFIG_2026
} from './engine';
import { 
  GlassCard, 
  MetricCard, 
  InputGroup, 
  StartDatePicker,
  ExpandableSchedule,
  LoanCalculatorModule,
  AutoLoanModule,
  InterestCalculatorModule,
  PaymentCalculatorModule,
  RetirementModule,
  AmortizationModule,
  InflationModule,
  FinanceTVMModule,
  IncomeTaxModule,
  CompoundInterestModule,
  SalaryModule,
  InterestRateModule,
  SalesTaxModule,
  CalculatorDisclaimer
} from './CalculatorModules';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, LineChart, Line
} from 'recharts';

import { 
  CALCULATORS_CONFIG, 
  HOME_CONFIG,
  getCalculatorById, 
  getCalculatorByPath, 
  syncSEOMetadata 
} from './seo';
import { HomePage } from './HomePage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Currencies & Tabs ---
const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
];

const TAB_ICONS: Record<string, any> = {
  mortgage: Home,
  loan: Wallet,
  auto: Briefcase,
  interest: Landmark,
  payment: RefreshCw,
  retirement: Zap,
  amortization: Calculator,
  investment: TrendingUp,
  inflation: Compass,
  finance: CircleDollarSign,
  tax: ShieldAlert,
  compound: TrendingUp,
  salary: Briefcase,
  rate: TrendingUp,
  'sales-tax': DollarSign,
  debt: ShieldAlert,
};

// --- Calculator Sub-Navigation Component for Inner Pages ---
function CalculatorSubNav({ currentId, onNavigate }: { currentId: string; onNavigate: (id: string) => void }) {
  const currentCalc = CALCULATORS_CONFIG.find(c => c.id === currentId) || CALCULATORS_CONFIG[0];
  const [selectedCat, setSelectedCat] = useState(currentCalc.category);

  const categories = ['All', 'Mortgage & Real Estate', 'Loans & Credit', 'Investing & Wealth', 'Income, Taxes & Economy'];
  const calculatorsInCat = CALCULATORS_CONFIG.filter(c => selectedCat === 'All' || c.category === selectedCat);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-3 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <button type="button" onClick={() => onNavigate('home')} className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
            <Home size={14} /> Home
          </button>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300">{currentCalc.category}</span>
          <span>/</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-black">{currentCalc.label}</span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
        >
          ← Back to All Calculators
        </button>
      </div>

      {/* Category Selection Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all",
              selectedCat === cat
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sub-Category / Calculator Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs border-t border-slate-100 dark:border-slate-800 pt-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">Switch Engine:</span>
        {calculatorsInCat.map(calc => {
          const isActive = calc.id === currentId;
          return (
            <button
              key={calc.id}
              type="button"
              onClick={() => onNavigate(calc.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border",
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm font-black"
                  : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
            >
              {calc.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Mortgage Module ---
function MortgageModule({ currency, onNavigate }: { currency: any; onNavigate?: (id: string) => void }) {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [loanProgram, setLoanProgram] = useState<'conventional' | 'fha' | 'va' | 'usda'>('conventional');
  const [presetId, setPresetId] = useState<'30-fixed' | '15-fixed' | 'fha' | 'va' | 'usda'>('30-fixed');

  // Exact 2-decimal down payment percentage
  const [downPercent, setDownPercent] = useState<number>(20.0);

  const [params, setParams] = useState({ 
    homePrice: 400000, 
    downPayment: 80000, 
    rate: US_MORTGAGE_CONFIG_2026.sampleRates.fixed30, 
    term: 30, 
    // Assessed value for taxes
    assessedValue: 0,
    taxPercent: 1.2, 
    insAnnual: 1200,
    pmiAnnual: '' as string | number, // explicit override; empty string means use engine program default
    hoaAnnual: 0,
    otherAnnual: 0,
    taxInc: 0,
    insInc: 0,
    hoaInc: 0,
    otherInc: 0,
    // Prepaid finance charges & APR
    pointsPercent: 0,
    originationFee: 0,
    otherPrepaidFinanceCharges: 0,
    // Program specifics
    requestPmiCancellation80: true,
    vaIsSubsequentUse: false,
    vaIsExempt: false,
    upfrontFeeFinanced: true,
    // Extra payments
    extraMonthly: 0,
    extraYearly: 0,
    extraYearlyMonth: 0, // 0 = unselected (not applied per Req 13), 1-12 = month chosen
    extraOneTime: 0,
    extraOneTimeMonth: 1
  });

  const [activeSubTab, setActiveSubTab] = useState<'setup' | 'costs' | 'fees-apr' | 'extra'>('setup');
  const [scheduleView, setScheduleView] = useState<'yearly' | 'monthly'>('yearly');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const downPercentId = useId();

  // Handle Preset selection with rates sourced from config
  const handlePresetSelect = (id: '30-fixed' | '15-fixed' | 'fha' | 'va' | 'usda') => {
    setPresetId(id);
    if (id === '30-fixed') {
      setLoanProgram('conventional');
      setDownPercent(20.0);
      setParams(p => ({
        ...p,
        term: 30,
        rate: US_MORTGAGE_CONFIG_2026.sampleRates.fixed30,
        downPayment: Math.round(p.homePrice * 0.20 * 100) / 100,
        pmiAnnual: ''
      }));
    } else if (id === '15-fixed') {
      setLoanProgram('conventional');
      setDownPercent(20.0);
      setParams(p => ({
        ...p,
        term: 15,
        rate: US_MORTGAGE_CONFIG_2026.sampleRates.fixed15,
        downPayment: Math.round(p.homePrice * 0.20 * 100) / 100,
        pmiAnnual: ''
      }));
    } else if (id === 'fha') {
      setLoanProgram('fha');
      setDownPercent(3.5);
      setParams(p => ({
        ...p,
        term: 30,
        rate: US_MORTGAGE_CONFIG_2026.sampleRates.fha30,
        downPayment: Math.round(p.homePrice * 0.035 * 100) / 100,
        pmiAnnual: ''
      }));
    } else if (id === 'va') {
      setLoanProgram('va');
      setDownPercent(0.0);
      setParams(p => ({
        ...p,
        term: 30,
        rate: US_MORTGAGE_CONFIG_2026.sampleRates.va30,
        downPayment: 0,
        pmiAnnual: ''
      }));
    } else if (id === 'usda') {
      setLoanProgram('usda');
      setDownPercent(0.0);
      setParams(p => ({
        ...p,
        term: 30,
        rate: US_MORTGAGE_CONFIG_2026.sampleRates.usda30,
        downPayment: 0,
        pmiAnnual: ''
      }));
    }
  };

  // Changing home price preserves exact two-decimal down payment percentage
  const handleHomePriceChange = (newPrice: number) => {
    const validPrice = Math.max(0, newPrice);
    const newDown = Math.round(validPrice * (downPercent / 100) * 100) / 100;
    setParams(p => ({
      ...p,
      homePrice: validPrice,
      downPayment: newDown
    }));
  };

  // Changing down payment in dollars updates exact two-decimal percentage
  const handleDownPaymentChange = (newDown: number) => {
    const validDown = Math.max(0, newDown);
    const pct = params.homePrice > 0 ? Number(((validDown / params.homePrice) * 100).toFixed(2)) : 0;
    setDownPercent(pct);
    setParams(p => ({
      ...p,
      downPayment: validDown
    }));
  };

  // Changing down payment percentage updates dollars
  const handleDownPercentChange = (newPct: number) => {
    const validPct = Math.max(0, Math.min(100, newPct));
    setDownPercent(validPct);
    const newDown = Math.round(params.homePrice * (validPct / 100) * 100) / 100;
    setParams(p => ({
      ...p,
      downPayment: newDown
    }));
  };

  // LTV & PMI trigger (LTV > 80%)
  const originalLtv = params.homePrice > 0 ? ((params.homePrice - params.downPayment) / params.homePrice) * 100 : 0;
  const isLtvOver80 = originalLtv > 80;

  const res = useMemo(() => calculateMortgage({ 
    loanProgram,
    homePrice: params.homePrice,
    downPayment: params.downPayment,
    annualRate: params.rate,
    termYears: params.term,
    startDate,
    assessedValue: params.assessedValue > 0 ? params.assessedValue : undefined,
    taxPercent: params.taxPercent,
    insuranceAnnual: params.insAnnual,
    pmiAnnual: params.pmiAnnual !== '' ? Number(params.pmiAnnual) : undefined,
    hoaAnnual: params.hoaAnnual,
    otherAnnual: params.otherAnnual,
    taxIncrease: params.taxInc,
    insuranceIncrease: params.insInc,
    hoaIncrease: params.hoaInc,
    otherIncrease: params.otherInc,
    pointsPercent: params.pointsPercent,
    originationFee: params.originationFee,
    otherPrepaidFinanceCharges: params.otherPrepaidFinanceCharges,
    requestPmiCancellation80: params.requestPmiCancellation80,
    vaIsSubsequentUse: params.vaIsSubsequentUse,
    vaIsExempt: params.vaIsExempt,
    upfrontFeeFinanced: params.upfrontFeeFinanced,
    extraMonthly: params.extraMonthly,
    extraYearly: params.extraYearly,
    extraYearlyMonth: params.extraYearlyMonth > 0 ? params.extraYearlyMonth : undefined,
    extraOneTime: params.extraOneTime,
    extraOneTimeMonth: params.extraOneTimeMonth
  }), [startDate, loanProgram, params]);

  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;
  const formatDetailed = (v: number) => `${currency.symbol}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)}`;

  // CSV Export
  const exportScheduleCsv = () => {
    const headers = ['Month #', 'Payment Date', 'Total Payment', 'Principal', 'Interest', 'Extra Principal', 'Taxes', 'Insurance', 'PMI', 'HOA', 'Ending Balance'];
    const rows = res.schedule.map((r: any) => [
      r.month,
      `"${r.dateStr}"`,
      r.totalMonthly.toFixed(2),
      r.principal.toFixed(2),
      r.interest.toFixed(2),
      (r.appliedExtra || 0).toFixed(2),
      (r.taxes || 0).toFixed(2),
      (r.insurance || 0).toFixed(2),
      (r.pmi || 0).toFixed(2),
      (r.hoa || 0).toFixed(2),
      r.balance.toFixed(2)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mortgage_amortization_schedule_${startDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = [
    { name: 'P&I', value: res.monthlyPI, color: '#3b82f6' },
    { name: 'Taxes', value: res.schedule[0]?.taxes || 0, color: '#f43f5e' },
    { name: 'Ins', value: res.schedule[0]?.insurance || 0, color: '#10b981' },
    ...(res.schedule[0]?.pmi > 0 ? [{ name: 'PMI/MIP', value: res.schedule[0].pmi, color: '#8b5cf6' }] : []),
    ...(res.schedule[0]?.hoa > 0 ? [{ name: 'HOA', value: res.schedule[0].hoa, color: '#f59e0b' }] : []),
    ...(res.schedule[0]?.other > 0 ? [{ name: 'Other', value: res.schedule[0].other, color: '#94a3b8' }] : []),
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Mobile Sticky Quick Summary Card */}
      <div className="lg:hidden sticky top-[72px] z-30 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between gap-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-300 block">Est. Monthly (PITI)</span>
          <div className="text-xl font-black text-white">{format(res.totalMonthly)}<span className="text-xs font-normal text-indigo-200">/mo</span></div>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block">Principal &amp; Interest</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">{format(res.monthlyPI)}/mo</span>
        </div>
      </div>

      {/* 1. ABOVE-THE-FOLD UTILITY FIRST (TWO-COLUMN LAYOUT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Interactive Inputs & Accordions */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-0 overflow-hidden shadow-md">
            {/* Loan Program Quick Presets */}
            <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Loan Program Preset
                </span>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                  {loanProgram}
                </span>
              </div>
              <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-0.5 sm:grid sm:grid-cols-5">
                {[
                  { id: '30-fixed', label: '30Y Conv' },
                  { id: '15-fixed', label: '15Y Conv' },
                  { id: 'fha', label: 'FHA 3.5%' },
                  { id: 'va', label: 'VA 0%' },
                  { id: 'usda', label: 'USDA 0%' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePresetSelect(item.id as any)}
                    className={cn(
                      "min-h-[38px] px-3 sm:px-1 py-2 text-xs font-bold rounded-xl text-center shrink-0 sm:shrink transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 whitespace-nowrap sm:whitespace-normal",
                      presetId === item.id
                        ? "bg-indigo-600 text-white shadow-sm font-black"
                        : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Info size={13} className="shrink-0" />
                <span>Preset rates: sample market rates (update regularly or enter custom rate).</span>
              </div>
            </div>

            {/* Input Category Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800" role="tablist" aria-label="Mortgage inputs view">
              {(['setup', 'costs', 'fees-apr', 'extra'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={activeSubTab === t}
                  onClick={() => setActiveSubTab(t)}
                  className={cn(
                    "flex-1 min-h-[44px] py-2.5 text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                    activeSubTab === t 
                      ? "bg-white dark:bg-[#1e293b] text-blue-700 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-400 font-black" 
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {t === 'setup' ? 'Core Loan' : t === 'costs' ? 'Taxes & Escrow' : t === 'fees-apr' ? 'APR / Fees' : 'Extra Prepay'}
                </button>
              ))}
            </div>
            
            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              {activeSubTab === 'setup' && (
                <div className="space-y-5 sm:space-y-6">
                  {/* Loan Program Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Loan Program
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['conventional', 'fha', 'va', 'usda'] as const).map(prog => (
                        <button
                          key={prog}
                          type="button"
                          onClick={() => setLoanProgram(prog)}
                          className={cn(
                            "py-2 px-3 text-xs font-bold rounded-xl border transition-all uppercase tracking-wide",
                            loanProgram === prog
                              ? "bg-blue-600 text-white border-blue-600 font-black shadow-sm"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {prog}
                        </button>
                      ))}
                    </div>
                  </div>

                  <InputGroup 
                    label="Home Purchase Price" 
                    value={params.homePrice} 
                    prefix={currency.symbol} 
                    onChange={handleHomePriceChange} 
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup 
                      label="Down Payment ($)" 
                      value={params.downPayment} 
                      prefix={currency.symbol} 
                      onChange={handleDownPaymentChange} 
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between ml-1">
                        <label htmlFor={downPercentId} className="block text-xs font-bold text-slate-800 dark:text-slate-200">Down %</label>
                        {isLtvOver80 && loanProgram === 'conventional' && (
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            PMI Required (&gt;80% LTV)
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id={downPercentId}
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={downPercent}
                          onChange={(e) => handleDownPercentChange(Number(e.target.value))}
                          className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 px-4 outline-none text-slate-900 dark:text-white text-base sm:text-sm font-bold pr-10 focus-visible:ring-2 focus-visible:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 font-bold text-xs">%</div>
                      </div>
                    </div>
                  </div>

                  {/* Program-Specific Options */}
                  {loanProgram === 'conventional' && isLtvOver80 && (
                    <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          id="req-pmi-cancel"
                          type="checkbox"
                          checked={params.requestPmiCancellation80}
                          onChange={(e) => setParams(p => ({ ...p, requestPmiCancellation80: e.target.checked }))}
                          className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="req-pmi-cancel" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                          I request PMI cancellation at 80% LTV of original value
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                        Under the Homeowners Protection Act (HPA 1998), cancellation occurs at the first of: (a) borrower request at 80% LTV, (b) automatic termination at 78% original scheduled balance, or (c) term midpoint.
                      </p>
                    </div>
                  )}

                  {loanProgram === 'fha' && (
                    <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-950 dark:text-indigo-200">
                        <span>FHA Upfront MIP (1.75%):</span>
                        <span className="font-mono">{format(res.upfrontFee)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="fha-finance-fee"
                          type="checkbox"
                          checked={params.upfrontFeeFinanced}
                          onChange={(e) => setParams(p => ({ ...p, upfrontFeeFinanced: e.target.checked }))}
                          className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="fha-finance-fee" className="text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                          Finance Upfront MIP into Loan Balance (adds to financed principal)
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                        Per HUD ML 2023-05: Annual MIP does not cancel at 80% LTV. It lasts 11 years for initial LTV ≤ 90%, or the entire loan life for LTV &gt; 90%.
                      </p>
                    </div>
                  )}

                  {loanProgram === 'va' && (
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-200">
                        <span>VA Funding Fee:</span>
                        <span className="font-mono">{params.vaIsExempt ? 'Exempt ($0)' : format(res.upfrontFee)}</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            id="va-exempt"
                            type="checkbox"
                            checked={params.vaIsExempt}
                            onChange={(e) => setParams(p => ({ ...p, vaIsExempt: e.target.checked }))}
                            className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <label htmlFor="va-exempt" className="text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                            Exempt (service-connected disability)
                          </label>
                        </div>
                        {!params.vaIsExempt && (
                          <div className="flex items-center gap-2">
                            <input
                              id="va-subsequent"
                              type="checkbox"
                              checked={params.vaIsSubsequentUse}
                              onChange={(e) => setParams(p => ({ ...p, vaIsSubsequentUse: e.target.checked }))}
                              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="va-subsequent" className="text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                              Subsequent VA loan use (3.30% fee if &lt;5% down)
                            </label>
                          </div>
                        )}
                        {!params.vaIsExempt && (
                          <div className="flex items-center gap-2">
                            <input
                              id="va-finance-fee"
                              type="checkbox"
                              checked={params.upfrontFeeFinanced}
                              onChange={(e) => setParams(p => ({ ...p, upfrontFeeFinanced: e.target.checked }))}
                              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="va-finance-fee" className="text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                              Finance Funding Fee into Loan Amount
                            </label>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                        ✓ VA loans carry $0 monthly mortgage insurance.
                      </p>
                    </div>
                  )}

                  {loanProgram === 'usda' && (
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-950 dark:text-amber-200">
                        <span>USDA Upfront Guarantee Fee (1.00%):</span>
                        <span className="font-mono">{format(res.upfrontFee)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="usda-finance-fee"
                          type="checkbox"
                          checked={params.upfrontFeeFinanced}
                          onChange={(e) => setParams(p => ({ ...p, upfrontFeeFinanced: e.target.checked }))}
                          className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor="usda-finance-fee" className="text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                          Finance Guarantee Fee into Loan Amount
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        USDA loans charge a 0.35% annual fee billed monthly for the loan term.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup 
                      label="Interest Note Rate" 
                      value={params.rate} 
                      suffix="%" 
                      step="0.001" 
                      onChange={(v: number) => setParams(p => ({ ...p, rate: v }))} 
                    />
                    <div className="space-y-1.5">
                      <InputGroup 
                        label="Loan Term" 
                        value={params.term} 
                        suffix="yrs" 
                        onChange={(v: number) => setParams(p => ({ ...p, term: v }))} 
                      />
                      <div className="flex gap-1.5 pt-1">
                        {[30, 20, 15, 10].map(y => (
                          <button
                            key={y}
                            type="button"
                            onClick={() => setParams(p => ({ ...p, term: y }))}
                            className={cn(
                              "flex-1 min-h-[36px] py-1 text-xs font-bold rounded-lg border transition-all flex items-center justify-center",
                              params.term === y 
                                ? "bg-blue-600 text-white border-blue-600 font-black" 
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                            )}
                          >
                            {y}y
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Start Date & Presets */}
                  <StartDatePicker 
                    value={startDate} 
                    onChange={(v: string) => setStartDate(v)} 
                    termYears={params.term}
                    payoffDate={res.payoffDate}
                    firstPaymentDate={res.firstPaymentDate}
                  />
                </div>
              )}

              {activeSubTab === 'costs' && (
                <div className="space-y-5 sm:space-y-6">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                    <strong>PITI &amp; Escrow:</strong> Property taxes, hazard insurance, and optional HOA dues are amortized into your monthly escrow payment.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <InputGroup 
                        label="Property Tax Rate" 
                        value={params.taxPercent} 
                        suffix="%" 
                        step="0.05" 
                        onChange={(v: number) => setParams(p => ({ ...p, taxPercent: v }))} 
                      />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Estimated on purchase price by default.
                      </span>
                    </div>
                    <InputGroup 
                      label="Assessed Value (Optional)" 
                      value={params.assessedValue} 
                      prefix={currency.symbol} 
                      onChange={(v: number) => setParams(p => ({ ...p, assessedValue: v }))} 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup label="Homeowners Ins. / Yr" value={params.insAnnual} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, insAnnual: v }))} />
                    <div className="space-y-1">
                      <InputGroup 
                        label="PMI / MIP Annual ($)" 
                        value={params.pmiAnnual !== '' ? Number(params.pmiAnnual) : (res.schedule[0]?.pmi ? res.schedule[0].pmi * 12 : 0)} 
                        prefix={currency.symbol} 
                        onChange={(v: number) => setParams(p => ({ ...p, pmiAnnual: v }))} 
                      />
                      {params.pmiAnnual === '' && res.pmiEstimateLabel && (
                        <span className="text-xs text-amber-700 dark:text-amber-400 italic block">
                          Assumption ({res.pmiEstimateLabel}): {format(res.schedule[0]?.pmi ? res.schedule[0].pmi * 12 : 0)}/yr
                        </span>
                      )}
                      {params.pmiAnnual === 0 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 italic block">
                          Explicitly set to $0 by user.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup label="HOA Dues / Yr" value={params.hoaAnnual} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, hoaAnnual: v }))} />
                    <InputGroup label="Other Annual Costs" value={params.otherAnnual} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, otherAnnual: v }))} />
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Annual Escalation %</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputGroup label="Tax Escalation" value={params.taxInc} suffix="%" onChange={(v: number) => setParams(p => ({ ...p, taxInc: v }))} />
                      <InputGroup label="Insurance Escalation" value={params.insInc} suffix="%" onChange={(v: number) => setParams(p => ({ ...p, insInc: v }))} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputGroup label="HOA Escalation" value={params.hoaInc} suffix="%" onChange={(v: number) => setParams(p => ({ ...p, hoaInc: v }))} />
                      <InputGroup label="Other Escalation" value={params.otherInc} suffix="%" onChange={(v: number) => setParams(p => ({ ...p, otherInc: v }))} />
                    </div>
                  </div>
                </div>
              )}

              {activeSubTab === 'fees-apr' && (
                <div className="space-y-5 sm:space-y-6">
                  <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                    <strong>Prepaid Finance Charges &amp; APR (TILA / Regulation Z):</strong>
                    <p className="mt-1">
                      Under 12 CFR Part 1026 (Regulation Z), the Annual Percentage Rate reflects the true cost of credit by deducting prepaid finance charges (discount points, origination fees) from the amount financed, and incorporating ongoing mortgage insurance premiums.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup 
                      label="Discount Points (% of loan)" 
                      value={params.pointsPercent} 
                      suffix="%" 
                      step="0.125" 
                      onChange={(v: number) => setParams(p => ({ ...p, pointsPercent: v }))} 
                    />
                    <InputGroup 
                      label="Lender Origination Fee ($)" 
                      value={params.originationFee} 
                      prefix={currency.symbol} 
                      onChange={(v: number) => setParams(p => ({ ...p, originationFee: v }))} 
                    />
                  </div>

                  <InputGroup 
                    label="Other Prepaid Finance Charges ($)" 
                    value={params.otherPrepaidFinanceCharges} 
                    prefix={currency.symbol} 
                    onChange={(v: number) => setParams(p => ({ ...p, otherPrepaidFinanceCharges: v }))} 
                  />

                  {/* APR Results Panel */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-indigo-300">Actuarial Regulation Z APR</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        {res.hasFeesOrMi ? `${res.regulationZApr.toFixed(3)}%` : `${params.rate}%`}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span>Label:</span>
                        <span className="font-sans font-medium text-slate-200">{res.aprLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base Note Rate:</span>
                        <span>{params.rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prepaid Finance Charges:</span>
                        <span>{formatDetailed(res.totalPrepaidFinanceCharges)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount Financed:</span>
                        <span>{formatDetailed(res.amountFinanced)}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      Note: This is an analytical estimate computed via Regulation Z Appendix J actuarial solving. This is not a formal Loan Estimate or Closing Disclosure disclosure-grade APR.
                    </p>
                  </div>
                </div>
              )}

              {activeSubTab === 'extra' && (
                <div className="space-y-5 sm:space-y-6">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    <strong>Accelerated Payoff Power:</strong> Every extra dollar goes 100% toward the principal balance, slashing total compound interest and shortening the loan term.
                  </div>

                  <InputGroup label="Extra Monthly Principal" value={params.extraMonthly} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, extraMonthly: v }))} />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup label="Extra Annual Principal" value={params.extraYearly} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, extraYearly: v }))} />
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Month Applied Each Year
                      </label>
                      <select
                        value={params.extraYearlyMonth}
                        onChange={(e) => setParams(p => ({ ...p, extraYearlyMonth: Number(e.target.value) }))}
                        className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl py-2.5 px-3 outline-none text-slate-900 dark:text-white text-xs font-bold focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <option value={0}>Not applied (select a month)</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Month {i + 1} ({['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]})
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Extra annual payment is applied only if a month is chosen.
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">One-Time Extra Lump Sum</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputGroup label="Lump Sum Amount" value={params.extraOneTime} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, extraOneTime: v }))} />
                      <InputGroup label="Month Applied (#)" value={params.extraOneTimeMonth} onChange={(v: number) => setParams(p => ({ ...p, extraOneTimeMonth: v }))} />
                    </div>
                  </div>

                  {res.isAccelerated && (
                    <div className="p-4 bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 rounded-2xl space-y-1 text-emerald-900 dark:text-emerald-100">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Prepayment Savings Active</span>
                      </div>
                      <p className="text-xs leading-relaxed">
                        You will eliminate <strong>{res.yearsSaved} years ({res.monthsSaved} payments)</strong> and save <strong>{format(Math.max(0, (res.monthlyPI * params.term * 12) - (res.totalPayment - res.yearlySchedule.reduce((a: any, b: any) => a + b.totalTaxes + b.totalIns + b.totalHoa + b.totalOther, 0))))}</strong> in total interest!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Instant Hero Metric & Itemized Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Regulatory & Conforming Limit Warnings Banner */}
          {res.warnings && res.warnings.length > 0 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-2xl space-y-2">
              {res.warnings.map((warn: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 font-medium">
                  <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          {/* Instant Hero Metric: Big Monthly Payment Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-indigo-900/50 space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Total Estimated Monthly Payment (PITI)
                </span>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-1">
                  {format(res.totalMonthly)}
                  <span className="text-base sm:text-xl font-normal text-indigo-200">/mo</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
                  Base Principal &amp; Interest
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {format(res.monthlyPI)}
                  <span className="text-xs font-normal text-indigo-200">/mo</span>
                </span>
              </div>
            </div>

            {/* Quick Escrow Sub-Breakdown Strip */}
            <div className={cn(
              "grid gap-2.5 sm:gap-3 pt-4 border-t border-indigo-800/60 text-xs",
              (res.schedule[0]?.other || 0) > 0 ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-4"
            )}>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="text-indigo-200 text-xs uppercase font-bold block truncate">Principal &amp; Interest</span>
                <span className="font-black text-white text-sm truncate block">{format(res.monthlyPI)}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="text-indigo-200 text-xs uppercase font-bold block truncate">Property Taxes</span>
                <span className="font-black text-white text-sm truncate block">{format(res.schedule[0]?.taxes || 0)}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="text-indigo-200 text-xs uppercase font-bold block truncate">Home Insurance</span>
                <span className="font-black text-white text-sm truncate block">{format(res.schedule[0]?.insurance || 0)}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="text-indigo-200 text-xs uppercase font-bold block truncate">PMI / MIP / HOA</span>
                <span className="font-black text-white text-sm truncate block">{format((res.schedule[0]?.pmi || 0) + (res.schedule[0]?.hoa || 0))}</span>
              </div>
              {(res.schedule[0]?.other || 0) > 0 && (
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <span className="text-indigo-200 text-xs uppercase font-bold block truncate">Other Fees</span>
                  <span className="font-black text-white text-sm truncate block">{format(res.schedule[0]?.other || 0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline & Payoff Milestones */}
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">First Payment</span>
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono">{res.firstPaymentDate}</span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" aria-hidden="true" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Final Payoff Date</span>
                <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">{res.payoffDate}</span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" aria-hidden="true" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Duration</span>
                <span className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {res.payoffMonth} Mo ({(res.payoffMonth / 12).toFixed(1)} Yrs)
                </span>
              </div>
            </div>
            {res.isAccelerated ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} aria-hidden="true" className="shrink-0" />
                <span>Paid off {res.yearsSaved} yrs early!</span>
              </div>
            ) : (
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Standard {params.term}-Year Term
              </div>
            )}
          </div>

          {/* Key Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <MetricCard label="Loan Principal" value={format(res.loanAmount)} subtext={res.isUpfrontFeeFinanced ? `Includes ${format(res.upfrontFee)} fee` : "Initial borrowed amount"} icon={ShieldAlert} color="bg-slate-800 dark:bg-slate-700" />
            <MetricCard label="Regulation Z APR" value={res.hasFeesOrMi ? `${res.regulationZApr.toFixed(3)}%` : `${params.rate}%`} subtext={res.hasFeesOrMi ? "Includes fees & MI" : "Equals note rate"} icon={RefreshCw} color="bg-indigo-600" />
            <MetricCard label="Total Interest" value={format(res.totalInterest)} subtext="Total financing cost" icon={Landmark} color="bg-rose-600" />
            <MetricCard label="Total with Escrow" value={format(res.totalOutOfPocket)} subtext="Includes taxes & ins" icon={Wallet} color="bg-emerald-600" />
          </div>
          
          {/* Itemized Cost Breakdown Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-4 sm:p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Initial Monthly Allocation</h4>
              <div className="h-48 sm:h-56" aria-label="Monthly Allocation Donut Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={chartData} innerRadius={45} outerRadius={68} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {chartData.map(d => (
                  <div key={d.name} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-center">
                    <div className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 truncate">{d.name}</div>
                    <div className="text-xs font-black truncate" style={{ color: d.color }}>{format(d.value)}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
            
            <GlassCard className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Principal vs Interest</h4>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                  {res.firstPaymentDate} – {res.payoffDate}
                </span>
              </div>
              <div className="h-48 sm:h-56" aria-label="Principal vs Interest Trend Area Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={res.yearlySchedule}>
                    <defs>
                      <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                    <XAxis dataKey="dateLabel" tickFormatter={y => `${y}`} fontSize={10} stroke="#64748b" />
                    <YAxis hide />
                    <ReTooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                      labelFormatter={(val) => `Period: ${val}`}
                    />
                    <Area type="monotone" dataKey="principal" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorPrincipal)" name="Principal Paid" />
                    <Area type="monotone" dataKey="interest" stroke="#f43f5e" strokeWidth={2.5} fill="url(#colorInterest)" name="Interest Paid" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* 4. AMORTIZATION SCHEDULE */}
      <GlassCard className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Amortization Schedule ({res.firstPaymentDate} – {res.payoffDate})</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Monthly breakdown and annual calendar schedule reflecting your exact start date and extra principal payments.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setScheduleView('yearly')}
                className={cn(
                  "flex-1 sm:flex-none min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500",
                  scheduleView === 'yearly'
                    ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm font-black"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Calendar Year
              </button>
              <button
                type="button"
                onClick={() => setScheduleView('monthly')}
                className={cn(
                  "flex-1 sm:flex-none min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500",
                  scheduleView === 'monthly'
                    ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm font-black"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Monthly Schedule
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={exportScheduleCsv}
                aria-label="Export amortization schedule as CSV"
                className="flex-1 sm:flex-none min-h-[36px] px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                aria-label="Print amortization schedule"
                className="flex-1 sm:flex-none min-h-[36px] px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Printer size={14} />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 sm:hidden flex items-center gap-1 font-medium">
            <span>Swipe horizontally to view full schedule →</span>
          </div>

          <div className="overflow-x-auto touch-pan-x max-h-[500px] border border-slate-200 dark:border-slate-700 rounded-2xl">
            {scheduleView === 'yearly' ? (
              <table className="w-full text-left text-xs sm:text-sm font-medium" aria-label="Annual Calendar Amortization Schedule">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs font-bold sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-3.5 sm:px-5 py-3 whitespace-nowrap">Calendar Year</th>
                    <th scope="col" className="px-3.5 sm:px-5 py-3 whitespace-nowrap">Date Period</th>
                    <th scope="col" className="px-3.5 sm:px-5 py-3 whitespace-nowrap">Principal Paid</th>
                    <th scope="col" className="px-3.5 sm:px-5 py-3 whitespace-nowrap">Interest Paid</th>
                    <th scope="col" className="px-3.5 sm:px-5 py-3 whitespace-nowrap">Taxes &amp; Escrow</th>
                    <th scope="col" className="px-3.5 sm:px-5 py-3 whitespace-nowrap">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {res.yearlySchedule.map((row: any) => (
                    <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="px-3.5 sm:px-5 py-2.5 sm:py-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">{row.year}</td>
                      <td className="px-3.5 sm:px-5 py-2.5 sm:py-3 text-slate-600 dark:text-slate-400 font-mono text-xs whitespace-nowrap">{row.dateRange}</td>
                      <td className="px-3.5 sm:px-5 py-2.5 sm:py-3 text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap">{format(row.principal)}</td>
                      <td className="px-3.5 sm:px-5 py-2.5 sm:py-3 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap">{format(row.interest)}</td>
                      <td className="px-3.5 sm:px-5 py-2.5 sm:py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{format(row.totalTaxes + row.totalIns + row.totalHoa + row.totalOther)}</td>
                      <td className="px-3.5 sm:px-5 py-2.5 sm:py-3 font-black text-slate-900 dark:text-white whitespace-nowrap">{format(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm font-medium" aria-label="Monthly Payment Amortization Schedule">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs font-bold sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">Pmt #</th>
                    <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">Payment Date</th>
                    <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">Total Payment</th>
                    <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">Principal</th>
                    <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">Interest</th>
                    <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">Extra Principal</th>
                    <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                  {res.schedule.map((row: any) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">#{row.month}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-bold text-indigo-700 dark:text-indigo-300 whitespace-nowrap">{row.dateStr}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-slate-900 dark:text-white font-bold whitespace-nowrap">{format(row.totalMonthly)}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap">{format(row.principal)}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap">{format(row.interest)}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{row.appliedExtra > 0 ? `+${format(row.appliedExtra)}` : '—'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-black text-slate-900 dark:text-white whitespace-nowrap">{format(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </GlassCard>

      {/* 5. EDUCATIONAL CONTENT & 50-STATE PROPERTY TAX REFERENCE GUIDE */}
      <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-5 sm:space-y-6 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Mortgage &amp; EMI Calculator: How to Estimate Payments, Escrow, and Amortization
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            <strong>Bottom Line Up Front (BLUF):</strong> Your total monthly housing outlay—often called PITI (Principal, Interest, Taxes, and Insurance)—hinges on four core variables: your home purchase price, down payment percentage, interest rate, and loan term. On a typical $600,000 purchase with 20% down ($120,000) at a 7.65% fixed rate over 30 years, the baseline principal and interest payment works out to $3,404 per month. Adding standard escrow costs ($400/month property tax and $100/month home insurance) pushes your total monthly payment to $3,904. Making optional extra principal payments early in the loan term directly cuts your lifetime interest costs and shortens your payoff timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Understanding Your Total Estimated Monthly Payment (PITI)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When you take out a mortgage, your monthly check covers more than just paying off the house. Most lenders use an escrow account to collect taxes and insurance premiums on a monthly schedule alongside your principal and interest.
            </p>
            <div className="space-y-1 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <div className="font-bold text-indigo-600 dark:text-indigo-400">Total Monthly Housing Payment (PITI)</div>
              <div>├── Principal (P): Repayment of the original borrowed money</div>
              <div>├── Interest (I): The fee charged by the lender to borrow funds</div>
              <div>├── Property Taxes (T): Local municipal real estate taxes</div>
              <div>└── Homeowner's Insurance (I): Property protection policy coverage</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Breakdown of Monthly Outlay Components</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>Base Principal &amp; Interest (P&amp;I):</strong> Computed directly from your borrowed loan amount, your annual interest rate, and your amortization schedule.</li>
              <li><strong>Property Taxes:</strong> Collected monthly by your lender and held in escrow until local tax bills are due. Property tax rates vary significantly across U.S. states and counties.</li>
              <li><strong>Home Insurance:</strong> Required by lenders to cover potential physical damage to the property.</li>
              <li><strong>HOA Fees:</strong> Mandatory dues paid to a homeowners association for maintenance, security, or common amenities.</li>
              <li><strong>Private Mortgage Insurance (PMI):</strong> Applies if your down payment is below 20% on a conventional loan.</li>
            </ul>
          </GlassCard>
        </div>

        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">The Mathematics of Loan Amortization</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Amortization is the process of spreading out a loan into a series of equal periodic payments. While your total base monthly payment stays fixed on a standard fixed-rate mortgage, the internal mix of interest versus principal shifts continuously over time.
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            <div className="font-bold text-indigo-600 dark:text-indigo-400">The Standard Monthly Amortization Formula</div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg text-center font-bold text-sm">
              M = P • [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <div>P = Principal loan amount borrowed (Home Price - Down Payment)</div>
              <div>r = Monthly interest rate (Annual Interest Rate ÷ 12 ÷ 100)</div>
              <div>n = Total number of monthly payments (Loan Term in Years × 12)</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Step-by-Step Payment Calculation Example</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-mono">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white text-sm mb-2">Loan Parameters</div>
              <div>1. Home Purchase Price: $600,000</div>
              <div>2. Down Payment (20%): -$120,000</div>
              <div>3. Net Loan Principal (P): $480,000</div>
              <div>4. Quoted Annual Interest Rate: 7.65%</div>
              <div>5. Loan Term: 30 Years (360 Months)</div>
              <div>6. Start Date: October 2026</div>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl space-y-1.5 border border-indigo-200 dark:border-indigo-800">
              <div className="font-bold text-indigo-900 dark:text-indigo-200 text-sm mb-2">Calculation Breakdown</div>
              <div>• Monthly Interest Rate (r): 0.006375 / mo</div>
              <div>• Monthly Base P&amp;I: $3,404.02</div>
              <div>• Monthly Property Tax Escrow: $400.00</div>
              <div>• Monthly Home Insurance Escrow: $100.00</div>
              <div className="pt-2 font-black text-emerald-600 dark:text-emerald-400 text-sm">Total PITI: $3,904.02/mo</div>
              <div>• Total Lifetime Interest Paid: $745,447</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">How Extra Principal Payments Accelerate Payoff</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Adding extra cash directly toward your loan principal bypasses interest charges completely. Every dollar contributed directly reduces the balance used to calculate your next month's interest charge.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <div className="font-bold text-base text-slate-900 dark:text-white">Standard Scenario (30 Years)</div>
              <div>• Monthly Payment: $3,404 P&amp;I</div>
              <div>• Time to Pay Off: 30 Years (360 Months)</div>
              <div>• Total Interest Paid: $745,447</div>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl space-y-2 border border-emerald-200 dark:border-emerald-800">
              <div className="font-bold text-base text-emerald-900 dark:text-emerald-200">Accelerated Scenario (+$300/mo Extra)</div>
              <div>• Monthly Payment: $3,704 P&amp;I</div>
              <div>• Time to Pay Off: 23 Years 4 Months (280 Months)</div>
              <div>• Total Interest Paid: $542,120</div>
              <div className="font-black text-emerald-600 dark:text-emerald-400 pt-1">Total Net Savings: $203,327 in Interest!</div>
            </div>
          </div>
        </GlassCard>

        {/* 50-State Property Tax Reference Guide Table */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Complete 50-State Property Tax Reference Guide
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Because real estate tax structures vary dramatically across all 50 U.S. states, our free-type input field lets you enter any exact custom rate or dollar amount. Use the table below to look up average effective property tax rates.
            </p>
          </div>

          <div className="overflow-x-auto max-h-[400px] border border-slate-200 dark:border-slate-700 rounded-2xl">
            <table className="w-full text-left text-xs sm:text-sm" aria-label="50-State Property Tax Reference Guide">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-3">State</th>
                  <th scope="col" className="px-4 py-3">Avg. Effective Tax Rate</th>
                  <th scope="col" className="px-4 py-3">Tax on $400,000 Home</th>
                  <th scope="col" className="px-4 py-3">Tax on $600,000 Home</th>
                  <th scope="col" className="px-4 py-3">Tax on $800,000 Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {[
                  ['Alabama', '0.41%', '$1,640', '$2,460', '$3,280'],
                  ['Alaska', '1.17%', '$4,680', '$7,020', '$9,360'],
                  ['Arizona', '0.62%', '$2,480', '$3,720', '$4,960'],
                  ['Arkansas', '0.64%', '$2,560', '$3,840', '$5,120'],
                  ['California', '0.75%', '$3,000', '$4,500', '$6,000'],
                  ['Colorado', '0.55%', '$2,200', '$3,300', '$4,400'],
                  ['Connecticut', '1.96%', '$7,840', '$11,760', '$15,680'],
                  ['Delaware', '0.61%', '$2,440', '$3,660', '$4,880'],
                  ['Florida', '0.91%', '$3,640', '$5,460', '$7,280'],
                  ['Georgia', '0.90%', '$3,600', '$5,400', '$7,200'],
                  ['Hawaii', '0.29%', '$1,160', '$1,740', '$2,320'],
                  ['Idaho', '0.67%', '$2,680', '$4,020', '$5,360'],
                  ['Illinois', '2.23%', '$8,920', '$13,380', '$17,840'],
                  ['Indiana', '0.81%', '$3,240', '$4,860', '$6,480'],
                  ['Iowa', '1.52%', '$6,080', '$9,120', '$12,160'],
                  ['Kansas', '1.33%', '$5,320', '$7,980', '$10,640'],
                  ['Kentucky', '0.83%', '$3,320', '$4,980', '$6,640'],
                  ['Louisiana', '0.56%', '$2,240', '$3,360', '$4,480'],
                  ['Maine', '1.24%', '$4,960', '$7,440', '$9,920'],
                  ['Maryland', '1.05%', '$4,200', '$6,300', '$8,400'],
                  ['Massachusetts', '1.12%', '$4,480', '$6,720', '$8,960'],
                  ['Michigan', '1.38%', '$5,520', '$8,280', '$11,040'],
                  ['Minnesota', '1.11%', '$4,440', '$6,660', '$8,880'],
                  ['Mississippi', '0.77%', '$3,080', '$4,620', '$6,160'],
                  ['Missouri', '1.01%', '$4,040', '$6,060', '$8,080'],
                  ['Montana', '0.73%', '$2,920', '$4,380', '$5,840'],
                  ['Nebraska', '1.63%', '$6,520', '$9,780', '$13,040'],
                  ['Nevada', '0.59%', '$2,360', '$3,540', '$4,720'],
                  ['New Hampshire', '1.93%', '$7,720', '$11,580', '$15,440'],
                  ['New Jersey', '2.47%', '$9,880', '$14,820', '$19,760'],
                  ['New Mexico', '0.74%', '$2,960', '$4,440', '$5,920'],
                  ['New York', '1.73%', '$6,920', '$10,380', '$13,840'],
                  ['North Carolina', '0.80%', '$3,200', '$4,800', '$6,400'],
                  ['North Dakota', '0.98%', '$3,920', '$5,880', '$7,840'],
                  ['Ohio', '1.53%', '$6,120', '$9,180', '$12,240'],
                  ['Oklahoma', '0.87%', '$3,480', '$5,220', '$6,960'],
                  ['Oregon', '0.93%', '$3,720', '$5,580', '$7,440'],
                  ['Pennsylvania', '1.53%', '$6,120', '$9,180', '$12,240'],
                  ['Rhode Island', '1.40%', '$5,600', '$8,400', '$11,200'],
                  ['South Carolina', '0.56%', '$2,240', '$3,360', '$4,480'],
                  ['South Dakota', '1.17%', '$4,680', '$7,020', '$9,360'],
                  ['Tennessee', '0.67%', '$2,680', '$4,020', '$5,360'],
                  ['Texas', '1.74%', '$6,960', '$10,440', '$13,920'],
                  ['Utah', '0.57%', '$2,280', '$3,420', '$4,560'],
                  ['Vermont', '1.83%', '$7,320', '$10,980', '$14,640'],
                  ['Virginia', '0.87%', '$3,480', '$5,220', '$6,960'],
                  ['Washington', '0.94%', '$3,760', '$5,640', '$7,520'],
                  ['West Virginia', '0.57%', '$2,280', '$3,420', '$4,560'],
                  ['Wisconsin', '1.61%', '$6,440', '$9,660', '$12,880'],
                  ['Wyoming', '0.56%', '$2,240', '$3,360', '$4,480'],
                ].map(([st, rate, v1, v2, v3]) => (
                  <tr key={st} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-2 font-bold text-slate-900 dark:text-white">{st}</td>
                    <td className="px-4 py-2 font-bold text-indigo-600 dark:text-indigo-400">{rate}</td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{v1}</td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{v2}</td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{v3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
            Data source: U.S. Census Bureau American Community Survey (ACS) property tax averages.
          </div>
        </GlassCard>

        {/* FAQ Section */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h4>
          <div className="space-y-4">
            {[
              {
                q: "What is the difference between a conventional loan and an FHA loan?",
                a: "Conventional loans are backed by private lenders and follow standards set by Fannie Mae and Freddie Mac. They generally require higher credit scores (typically 620+) and allow you to cancel Private Mortgage Insurance (PMI) once you reach 20% home equity. FHA loans are insured by the Federal Housing Administration, allow lower down payments (as low as 3.5%) and lower credit scores, but require Mortgage Insurance Premiums (MIP) that often last for the full life of the loan."
              },
              {
                q: "What is the 28/36 rule in mortgage underwriting?",
                a: "The 28/36 rule is a standard guideline used by lenders to assess borrowing capacity: Front-End Ratio (28%): Your total monthly housing expenses (PITI + HOA fees) should not exceed 28% of your gross monthly income. Back-End Ratio (36%): Your total monthly debt obligations (housing payment + car loans + student loans + credit card minimums) should not exceed 36% of your gross monthly income."
              },
              {
                q: "How does my down payment percentage affect my interest rate and fees?",
                a: "Putting down 20% or more eliminates the need for monthly PMI fees, reducing your total monthly outlay. Higher down payments also lower the lender's risk, which can help you qualify for lower quoted interest rates."
              },
              {
                q: "Should I choose a 15-year or a 30-year mortgage term?",
                a: "A 15-year mortgage offers lower interest rates and allows you to build equity twice as fast while paying significantly less total interest over the life of the loan. However, it comes with a much higher required monthly payment. A 30-year mortgage provides a lower required monthly payment, giving you greater budget flexibility. You can also make voluntary extra principal payments on a 30-year loan to match a 15-year payoff timeline without committing to a higher fixed monthly obligation."
              },
              {
                q: "What is an escrow shortage, and why do monthly payments change?",
                a: "An escrow shortage happens when local property tax rates increase or your homeowner's insurance premiums go up. When these underlying costs rise, your lender recalculates your escrow requirements and raises your total monthly payment to cover the shortfall."
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">{faq.q}</h5>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <CalculatorDisclaimer />
    </div>
  );
}

// --- Investment & SIP Module ---
function InvestmentModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({ initial: 10000, monthly: 500, rate: 8, years: 20 });
  const res = useMemo(() => calculateInvestment({ initialAmount: params.initial, monthlyContribution: params.monthly, annualRate: params.rate, years: params.years }), [params]);
  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <TrendingUp size={20} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> Wealth Plan
          </h3>
          <InputGroup label="Initial Savings" value={params.initial} prefix={currency.symbol} onChange={(v: number) => setParams({...params, initial: v})} />
          <InputGroup label="Monthly SIP" value={params.monthly} prefix={currency.symbol} onChange={(v: number) => setParams({...params, monthly: v})} />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Expected Return" value={params.rate} suffix="%" onChange={(v: number) => setParams({...params, rate: v})} />
            <InputGroup label="Time Horizon" value={params.years} suffix="yrs" onChange={(v: number) => setParams({...params, years: v})} />
          </div>
        </GlassCard>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Final Balance" value={format(res.finalBalance)} subtext="Projected worth" icon={PiggyBank} color="bg-emerald-600" />
          <MetricCard label="Total Invested" value={format(res.totalInvested)} subtext="Your contributions" icon={RefreshCw} color="bg-blue-600" />
          <MetricCard label="Wealth Gained" value={format(res.totalGains)} subtext="Interest compounding" icon={Zap} color="bg-amber-600" />
        </div>

        <GlassCard className="p-6 lg:p-8 space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Wealth Projection</h4>
          <div className="h-80" aria-label="Wealth Projection Chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={res.schedule}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="year" fontSize={11} stroke="#64748b" tickFormatter={y => `Y${y}`} />
                <YAxis hide />
                <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="invested" stackId="a" fill="#3b82f6" name="Invested Principal" />
                <Bar dataKey="interestGained" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} name="Compound Growth" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <ExpandableSchedule 
          data={res.schedule} 
          columns={[
            { key: 'year', label: 'Year' },
            { key: 'invested', label: 'Total Invested', format },
            { key: 'interestGained', label: 'Wealth Gained', format },
            { key: 'balance', label: 'Net Worth', format },
          ]}
        />
        <CalculatorDisclaimer />
      </div>
    </div>
  );
}

// --- Debt Snowball / Avalanche Module ---
function DebtModule({ currency }: { currency: any }) {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card', balance: 5000, rate: 19.9, minPayment: 150 },
    { id: '2', name: 'Student Loan', balance: 25000, rate: 4.5, minPayment: 300 },
  ]);
  const [extra, setExtra] = useState(500);
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('avalanche');

  const res = useMemo(() => calculateDebtPayoff(debts, extra, strategy), [debts, extra, strategy]);
  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;

  const addDebt = () => {
    setDebts([...debts, { id: Math.random().toString(), name: 'New Debt', balance: 1000, rate: 5, minPayment: 50 }]);
  };

  const removeDebt = (id: string) => setDebts(debts.filter(d => d.id !== id));
  const updateDebt = (id: string, field: keyof Debt, val: any) => {
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: val } : d));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <ShieldAlert size={20} className="text-rose-600 dark:text-rose-400" aria-hidden="true" /> Debt List
            </h3>
            <button 
              type="button"
              onClick={addDebt} 
              aria-label="Add new debt account"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex items-center justify-center"
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {debts.map(d => (
              <div key={d.id} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 relative group">
                <button 
                  type="button"
                  onClick={() => removeDebt(d.id)} 
                  aria-label={`Remove debt account: ${d.name}`}
                  className="min-h-[44px] min-w-[44px] absolute top-2 right-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 flex items-center justify-center rounded-xl"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <InputGroup label="Name" type="text" value={d.name} onChange={(v: string) => updateDebt(d.id, 'name', v)} />
                  <InputGroup label="Balance" value={d.balance} prefix={currency.symbol} onChange={(v: number) => updateDebt(d.id, 'balance', v)} />
                  <InputGroup label="Rate" value={d.rate} suffix="%" onChange={(v: number) => updateDebt(d.id, 'rate', v)} />
                  <InputGroup label="Min Payment" value={d.minPayment} prefix={currency.symbol} onChange={(v: number) => updateDebt(d.id, 'minPayment', v)} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-6">
            <InputGroup label="Monthly Extra Payment" value={extra} prefix={currency.symbol} onChange={(v: number) => setExtra(v)} />
            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">Payoff Strategy</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onClick={() => setStrategy('snowball')}
                  aria-pressed={strategy === 'snowball'}
                  className={cn("min-h-[44px] py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", strategy === 'snowball' ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700")}
                >
                  Snowball
                </button>
                <button 
                  type="button"
                  onClick={() => setStrategy('avalanche')}
                  aria-pressed={strategy === 'avalanche'}
                  className={cn("min-h-[44px] py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", strategy === 'avalanche' ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700")}
                >
                  Avalanche
                </button>
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-900 dark:text-blue-100 leading-relaxed flex gap-3 border border-blue-200 dark:border-blue-800">
              <Info size={20} className="shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-semibold">{strategy === 'avalanche' ? "Avalanche strategy focuses extra payments on debts with the highest interest rates first, saving you the most money over time." : "Snowball strategy focuses on paying off the smallest balances first to build psychological momentum."}</p>
                <p className="text-[11px] opacity-90">Interest Convention: Monthly rate = APR / 12, applied to current balance before monthly payments are deducted.</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="lg:col-span-7 space-y-8">
        {res.status === 'NEVER_PAID_OFF' && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-3">
            <ShieldAlert size={20} className="shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold">Warning: Some debts cannot be paid off within 600 months</p>
              <p className="mt-0.5">Minimum payments do not cover monthly interest on certain accounts, or the extra budget is insufficient.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard label="Time to Debt Free" value={res.status === 'NEVER_PAID_OFF' ? 'Never' : `${res.monthsToPayoff} Months`} subtext={res.status === 'NEVER_PAID_OFF' ? 'Exceeds 600 months' : `~${(res.monthsToPayoff/12).toFixed(1)} Years`} icon={RefreshCw} color="bg-rose-600" />
          <MetricCard label="Total Interest Paid" value={format(res.totalInterest)} subtext="Over the payoff period" icon={Zap} color="bg-amber-600" />
        </div>

        <GlassCard className="p-6 space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Debt Payoff Status & Milestone Months</h4>
          <div className="space-y-3">
            {res.debts.map(d => (
              <div key={d.id} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{d.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Initial: {format(d.balance)} @ {d.rate}% • Min: {format(d.minPayment)}</p>
                  {d.warning && (
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                      <ShieldAlert size={14} /> {d.warning}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-bold", d.paidOffMonth !== null ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200" : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200")}>
                    {d.paidOffMonth !== null ? `Paid Off: Month ${d.paidOffMonth}` : 'Not Paid Off'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 lg:p-8 space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Debt Reduction Curve</h4>
          <div className="h-80" aria-label="Debt Reduction Curve Chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={res.timeline}>
                <defs>
                  <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="month" fontSize={11} stroke="#64748b" tickFormatter={m => `M${m}`} />
                <YAxis hide />
                <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="totalBalance" stroke="#f43f5e" strokeWidth={3} fill="url(#colorDebt)" name="Total Remaining Debt" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <CalculatorDisclaimer />
      </div>
    </div>
  );
}

// --- Admin Module ---
function AdminModule({ cats, subs }: { cats: any[], subs: any[] }) {
  const [newCat, setNewCat] = useState('');
  const [newSub, setNewSub] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const newCatId = useId();
  const selectCatId = useId();
  const newSubId = useId();

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between pb-8 border-b border-slate-200 dark:border-slate-700">
        <div className="space-y-1">
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Administration Console</h2>
          <p className="text-slate-600 dark:text-slate-400 font-bold uppercase text-xs tracking-wider">System Routing & Data Models</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <GlassCard className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300" aria-hidden="true"><Database size={24} /></div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Category Models</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={newCatId} className="sr-only">New Category Module Name</label>
              <input 
                id={newCatId}
                type="text" 
                value={newCat} 
                onChange={e => setNewCat(e.target.value)} 
                placeholder="Category Module Name..." 
                className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-2xl px-5 py-3 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm font-bold"
              />
            </div>
            <button 
              type="button"
              onClick={() => newCat && addDoc(collection(db, 'categories'), { title: newCat, createdAt: serverTimestamp() }).then(() => setNewCat(''))}
              className="min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Deploy
            </button>
          </div>
          <div className="space-y-3">
            {cats.map(c => (
              <div key={c.id} className="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl flex justify-between items-center border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200">{c.title}</span>
                <button 
                  type="button"
                  onClick={() => deleteDoc(doc(db, 'categories', c.id))} 
                  aria-label={`Delete category: ${c.title}`}
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300" aria-hidden="true"><Cpu size={24} /></div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Subsystem Mapping</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor={selectCatId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">Target Category</label>
              <select 
                id={selectCatId}
                value={selectedCatId} 
                onChange={e => setSelectedCatId(e.target.value)}
                className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-2xl px-5 py-3 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm font-bold appearance-none cursor-pointer"
              >
                <option value="">Select Target Root Category...</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor={newSubId} className="sr-only">Subsystem Engine Title</label>
                <input 
                  id={newSubId}
                  type="text" 
                  value={newSub} 
                  onChange={e => setNewSub(e.target.value)} 
                  placeholder="Engine Title..." 
                  className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-2xl px-5 py-3 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm font-bold"
                />
              </div>
              <button 
                type="button"
                onClick={() => newSub && selectedCatId && addDoc(collection(db, 'subcategories'), { categoryId: selectedCatId, title: newSub, createdAt: serverTimestamp() }).then(() => setNewSub(''))}
                className="min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Link
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {subs.map(s => (
              <div key={s.id} className="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl flex justify-between items-center border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{s.title}</p>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">{cats.find(c => c.id === s.categoryId)?.title}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => deleteDoc(doc(db, 'subcategories', s.id))} 
                  aria-label={`Delete subcategory: ${s.title}`}
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// --- Main App Shell ---

export default function App() {
  // Initialize activeTab based on current search-engine-friendly URL path or query/hash
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const match = getCalculatorByPath(window.location.pathname, window.location.hash, window.location.search);
      if (match) return match.id;
    }
    return 'home';
  });

  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [user, setUser] = useState<User | null>(null);
  const [cats, setCats] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);

  // Mobile menu & Directory Finder states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [finderSearch, setFinderSearch] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // High contrast theme state with OS system preference and localStorage sync
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apex_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const activeConfig = useMemo(() => getCalculatorById(activeTab) || HOME_CONFIG, [activeTab]);

  const filteredCalculators = useMemo(() => {
    if (!finderSearch.trim()) return CALCULATORS_CONFIG;
    const q = finderSearch.toLowerCase();
    return CALCULATORS_CONFIG.filter(c => 
      c.label.toLowerCase().includes(q) ||
      c.shortTitle.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.keywords.toLowerCase().includes(q)
    );
  }, [finderSearch]);

  // Group calculators by category for clean mobile navigation
  const categorizedCalculators = useMemo(() => {
    const groups: Record<string, typeof CALCULATORS_CONFIG> = {};
    CALCULATORS_CONFIG.forEach(c => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, []);

  // Sync SEO metadata and Canonical/Schema.org whenever active calculator changes
  useEffect(() => {
    syncSEOMetadata(activeConfig);
  }, [activeConfig]);

  // Ensure initial direct visit sets clean URL without breaking browser history
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const match = getCalculatorByPath(window.location.pathname, window.location.hash, window.location.search);
      if (match) {
        setActiveTab(match.id);
        syncSEOMetadata(match);
      } else {
        setActiveTab('home');
        syncSEOMetadata(HOME_CONFIG);
      }
    }
  }, []);

  // Listen to browser Back and Forward history navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const match = getCalculatorByPath(window.location.pathname, window.location.hash, window.location.search);
      if (match) {
        setActiveTab(match.id);
        syncSEOMetadata(match);
      } else {
        setActiveTab('home');
        syncSEOMetadata(HOME_CONFIG);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (calcId: string) => {
    setActiveTab(calcId);
    setIsFinderOpen(false);
    setIsMobileMenuOpen(false);
    const target = getCalculatorById(calcId);
    if (target && typeof window !== 'undefined') {
      // Push search engine friendly clean URL into browser address bar
      window.history.pushState({ id: calcId }, '', target.slug);
      syncSEOMetadata(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const copyCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${activeConfig.slug}`;
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      });
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('apex_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('apex_theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('apex_theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, setUser);
    const unsubCats = onSnapshot(collection(db, 'categories'), s => setCats(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubSubs = onSnapshot(collection(db, 'subcategories'), s => setSubs(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { unsubAuth(); unsubCats(); unsubSubs(); };
  }, []);

  const isAdmin = user?.email === 'classifiedsmine@gmail.com';

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#121827] text-slate-900 dark:text-[#f9fafb] font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-150">
      {/* WCAG Skip to Main Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-indigo-600 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white min-h-[44px] flex items-center"
      >
        Skip to main content
      </a>

      {/* Dynamic Accessible Header with Responsive Controls */}
      <header className="h-16 sm:h-20 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-4 sm:px-6 lg:px-12 sticky top-0 z-40 transition-colors">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open financial calculators navigation menu"
              className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <Menu size={20} aria-hidden="true" />
            </button>

            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
              }}
              aria-label="ApexFinance Home"
              className="min-h-[44px] flex items-center gap-2 sm:gap-3 hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl shrink-0"
            >
              <div className="h-9 w-9 sm:h-10 sm:w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shrink-0" aria-hidden="true">
                <Landmark size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">Apex<span className="text-indigo-600 dark:text-indigo-400">Finance</span></span>
            </a>
            
            {/* Desktop Navigation Tabs */}
            <div className="hidden lg:block relative group/nav">
              <nav 
                role="tablist" 
                aria-label="Financial Calculator Modules"
                className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto no-scrollbar max-w-[45vw] xl:max-w-[50vw] scroll-smooth"
              >
                <a
                  href="/"
                  role="tab"
                  aria-selected={activeTab === 'home'}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('home');
                  }}
                  className={cn(
                    "min-h-[40px] flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                    activeTab === 'home' 
                      ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm font-black" 
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Home size={15} className={activeTab === 'home' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"} aria-hidden="true" />
                  Home
                </a>
                {CALCULATORS_CONFIG.map(tab => {
                  const Icon = TAB_ICONS[tab.id] || Landmark;
                  const isActive = activeTab === tab.id;
                  return (
                    <a
                      key={tab.id}
                      href={tab.slug}
                      role="tab"
                      aria-selected={isActive}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(tab.id);
                      }}
                      className={cn(
                        "min-h-[40px] flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                        isActive 
                          ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm font-black" 
                          : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <Icon size={15} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"} aria-hidden="true" />
                      {tab.label}
                    </a>
                  );
                })}
                {isAdmin && (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'admin'}
                    onClick={() => setActiveTab('admin')}
                    className={cn(
                      "min-h-[40px] flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                      activeTab === 'admin' 
                        ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm font-black" 
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <Settings size={15} className={activeTab === 'admin' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"} aria-hidden="true" />
                    Admin
                  </button>
                )}
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Quick Currency Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700">
              <label htmlFor="currency-select" className="sr-only">Currency</label>
              <select
                id="currency-select"
                value={currency.code}
                onChange={(e) => {
                  const found = CURRENCIES.find(c => c.code === e.target.value);
                  if (found) setCurrency(found);
                }}
                className="bg-transparent text-xs font-black px-2 py-1.5 text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* High-Contrast Theme Switcher */}
            <button
              type="button"
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className="min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex items-center justify-center"
              aria-label={theme === 'dark' ? "Switch to light theme" : "Switch to high contrast dark theme"}
              title={theme === 'dark' ? "Switch to light theme" : "Switch to high contrast dark theme"}
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" aria-hidden="true" /> : <Moon size={17} className="text-slate-700" aria-hidden="true" />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 sm:p-1.5 sm:pr-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[40px] sm:min-h-[44px]">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs" aria-hidden="true">{user.displayName?.[0]}</div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:inline">{user.displayName?.split(' ')[0]}</span>
                <button 
                  type="button"
                  onClick={() => signOut(auth)} 
                  aria-label="Sign out"
                  className="min-h-[36px] min-w-[36px] text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <LogOut size={15} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => signInWithPopup(auth, googleProvider)}
                className="min-h-[40px] sm:min-h-[44px] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Horizontal Swipeable Mobile Category Pill Bar */}
      <div className="lg:hidden bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-800 px-3 py-2 overflow-x-auto touch-pan-x no-scrollbar flex items-center gap-1.5 sticky top-16 z-35">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('home');
          }}
          className={cn(
            "min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors whitespace-nowrap",
            activeTab === 'home'
              ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-sm font-black"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          )}
        >
          <Home size={13} className={activeTab === 'home' ? "text-white" : "text-slate-500"} />
          Home
        </a>
        <button
          type="button"
          onClick={() => setIsFinderOpen(true)}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center gap-1.5 shrink-0"
        >
          <Search size={13} />
          <span>All ({CALCULATORS_CONFIG.length})</span>
        </button>
        {CALCULATORS_CONFIG.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = TAB_ICONS[tab.id] || Landmark;
          return (
            <a
              key={tab.id}
              href={tab.slug}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(tab.id);
              }}
              className={cn(
                "min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors whitespace-nowrap",
                isActive 
                  ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-sm font-black" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              )}
            >
              <Icon size={13} className={isActive ? "text-white" : "text-slate-500"} />
              {tab.label}
            </a>
          );
        })}
      </div>

      {/* Dedicated Mobile Navigation Slide-Over Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide Drawer Content */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-[85vw] max-w-[360px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-r border-slate-200 dark:border-slate-800"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white" aria-hidden="true">
                    <Landmark size={18} />
                  </div>
                  <span className="font-black text-lg text-slate-900 dark:text-white">ApexFinance</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Search & Calculator List */}
              <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('home');
                  }}
                  className={cn(
                    "w-full min-h-[44px] p-2.5 rounded-xl flex items-center gap-2.5 text-left text-xs font-bold transition-all",
                    activeTab === 'home'
                      ? "bg-indigo-600 text-white shadow-sm font-black"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                  )}
                >
                  <Home size={16} className={activeTab === 'home' ? "text-white" : "text-indigo-600 dark:text-indigo-400"} />
                  <span>Platform Overview &amp; Home</span>
                </a>

                <div className="space-y-6 pt-2">
                  {Object.entries(categorizedCalculators).map(([cat, items]) => (
                    <div key={cat} className="space-y-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block px-2">
                        {cat}
                      </span>
                      <div className="space-y-1">
                        {items.map(c => {
                          const Icon = TAB_ICONS[c.id] || Landmark;
                          const isActive = activeTab === c.id;
                          return (
                            <a
                              key={c.id}
                              href={c.slug}
                              onClick={(e) => {
                                e.preventDefault();
                                navigateTo(c.id);
                              }}
                              className={cn(
                                "w-full min-h-[44px] p-2.5 rounded-xl flex items-center justify-between gap-3 text-left text-xs font-bold transition-all",
                                isActive
                                  ? "bg-indigo-600 text-white shadow-sm font-black"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                              )}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Icon size={16} className={isActive ? "text-white" : "text-indigo-600 dark:text-indigo-400"} />
                                <span className="truncate">{c.shortTitle}</span>
                              </div>
                              <span className={cn("text-xs font-mono", isActive ? "text-indigo-200" : "text-slate-400")}>
                                {c.slug}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>All 16 Calculators Verified</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">100% Free</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-12 focus:outline-none">
        <div className="space-y-8 sm:space-y-12">
          {activeTab !== 'home' && activeTab !== 'admin' && (
            <>
              {/* Category & Sub-Category Selection Bar */}
              <CalculatorSubNav currentId={activeTab} onNavigate={navigateTo} />

              {/* Search Engine Friendly Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 flex-wrap">
                <a 
                  href="/" 
                  onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  ApexFinance Home
                </a>
                <span aria-hidden="true" className="text-slate-400">/</span>
                <span className="text-slate-600 dark:text-slate-400">{activeConfig.category}</span>
                <span aria-hidden="true" className="text-slate-400">/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold" aria-current="page">
                  {activeConfig.shortTitle}
                </span>
              </nav>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 rounded-full">
                      {activeConfig.category}
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">• Clean URL: {activeConfig.slug}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {activeConfig.shortTitle}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 font-normal text-sm sm:text-base max-w-3xl leading-relaxed">
                    {activeConfig.metaDescription}
                  </p>
                </div>
                <div className="flex gap-2.5 sm:gap-4 shrink-0 flex-wrap">
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-blue-200 dark:border-blue-800">
                    <CheckCircle2 size={15} aria-hidden="true" /> Verified Algorithm
                  </div>
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                    <RefreshCw size={15} aria-hidden="true" /> Real-time Sync
                  </div>
                </div>
              </div>

              {/* Search-Engine-Friendly URL & Share Bar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true">
                    <Link2 size={18} />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
                      <span>Search-Engine-Friendly URL</span>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={12} aria-hidden="true" /> Crawlable &amp; Indexed
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-black text-indigo-700 dark:text-indigo-300 truncate">
                      <span className="text-slate-400 dark:text-slate-500 select-none hidden sm:inline">
                        {typeof window !== 'undefined' ? window.location.origin : 'https://apexfinance.app'}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-4 truncate">
                        {activeConfig.slug}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={copyCurrentUrl}
                    aria-label={`Copy search engine friendly URL ${activeConfig.slug} to clipboard`}
                    className={cn(
                      "flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                      copiedUrl
                        ? "bg-emerald-600 text-white font-black shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    )}
                  >
                    {copiedUrl ? (
                      <>
                        <Check size={16} aria-hidden="true" />
                        <span>Copied URL!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} aria-hidden="true" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFinderOpen(true)}
                    aria-label="Open directory of all 16 search engine friendly calculator URLs"
                    className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-indigo-200 dark:border-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Search size={16} aria-hidden="true" />
                    <span>All Calculators ({CALCULATORS_CONFIG.length})</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'home' && <HomePage currency={currency} onNavigate={navigateTo} />}
              {activeTab === 'mortgage' && <MortgageModule currency={currency} onNavigate={navigateTo} />}
              {activeTab === 'loan' && <LoanCalculatorModule currency={currency} />}
              {activeTab === 'auto' && <AutoLoanModule currency={currency} />}
              {activeTab === 'interest' && <InterestCalculatorModule currency={currency} />}
              {activeTab === 'payment' && <PaymentCalculatorModule currency={currency} />}
              {activeTab === 'retirement' && <RetirementModule currency={currency} />}
              {activeTab === 'amortization' && <AmortizationModule currency={currency} />}
              {activeTab === 'investment' && <InvestmentModule currency={currency} />}
              {activeTab === 'inflation' && <InflationModule currency={currency} />}
              {activeTab === 'finance' && <FinanceTVMModule currency={currency} />}
              {activeTab === 'tax' && <IncomeTaxModule currency={currency} />}
              {activeTab === 'compound' && <CompoundInterestModule currency={currency} />}
              {activeTab === 'salary' && <SalaryModule currency={currency} />}
              {activeTab === 'rate' && <InterestRateModule currency={currency} />}
              {activeTab === 'sales-tax' && <SalesTaxModule currency={currency} />}
              {activeTab === 'debt' && <DebtModule currency={currency} />}
              {activeTab === 'admin' && <AdminModule cats={cats} subs={subs} />}
            </motion.div>
          </AnimatePresence>

          {activeTab !== 'home' && activeTab !== 'admin' && (
            <CalculatorDisclaimer />
          )}
        </div>
      </main>

      {/* Accessible Footer with Complete Directory of Search-Engine-Friendly URLs */}
      <footer className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-24 pb-20 border-t border-slate-200 dark:border-slate-800 pt-16 space-y-16 text-slate-800 dark:text-slate-200 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
              }}
              aria-label="ApexFinance Home"
              className="min-h-[44px] flex items-center gap-3 hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
            >
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md" aria-hidden="true"><Landmark size={16} /></div>
              <span className="text-lg font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">ApexFinance</span>
            </a>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">Industrial-grade financial computation platform. Providing high-performance tools for personal and professional wealth management.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Core Engines</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <li><a href="/mortgage-calculator" onClick={(e) => { e.preventDefault(); navigateTo('mortgage'); }} className="min-h-[44px] flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">Mortgage & EMI Calculator</a></li>
              <li><a href="/amortization-calculator" onClick={(e) => { e.preventDefault(); navigateTo('amortization'); }} className="min-h-[44px] flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">Amortization Schedule Core</a></li>
              <li><a href="/compound-interest-calculator" onClick={(e) => { e.preventDefault(); navigateTo('compound'); }} className="min-h-[44px] flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">Compound Interest Kernel</a></li>
              <li><a href="/retirement-calculator" onClick={(e) => { e.preventDefault(); navigateTo('retirement'); }} className="min-h-[44px] flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">FIRE Simulator</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Financing & Credit</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <li><a href="/loan-calculator" onClick={(e) => { e.preventDefault(); navigateTo('loan'); }} className="min-h-[44px] flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">Personal Loan Calculator</a></li>
              <li><a href="/auto-loan-calculator" onClick={(e) => { e.preventDefault(); navigateTo('auto'); }} className="min-h-[44px] flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">Auto Loan & Car Financing</a></li>
              <li><a href="/interest-calculator" onClick={(e) => { e.preventDefault(); navigateTo('interest'); }} className="min-h-[44px] flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">Simple & Compound Interest</a></li>
              <li><a href="/debt-payoff-calculator" onClick={(e) => { e.preventDefault(); navigateTo('debt'); }} className="min-h-[44px] flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">Debt Snowball & Avalanche</a></li>
            </ul>
          </div>
          <div className="space-y-6 text-center lg:text-left">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">System Status</p>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                All 16 Calculators Indexed
              </div>
            </div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">© 2026 Apex Computing Systems</div>
          </div>
        </div>
      </footer>

      {/* Accessible Calculator Finder Modal */}
      <AnimatePresence>
        {isFinderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="finder-title">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFinderOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white" aria-hidden="true">
                    <Search size={20} />
                  </div>
                  <div>
                    <h2 id="finder-title" className="text-base font-black text-slate-900 dark:text-white">
                      Search All 16 Calculators &amp; Clean URLs
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Instantly jump to any calculator or copy its search-engine-friendly link
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFinderOpen(false)}
                  aria-label="Close calculator finder"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    type="text"
                    autoFocus
                    value={finderSearch}
                    onChange={(e) => setFinderSearch(e.target.value)}
                    placeholder="Search by name, category, or URL slug (e.g. loan, interest, tax)..."
                    aria-label="Search all 16 calculators"
                    className="w-full pl-11 pr-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-y-auto p-4 space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCalculators.length === 0 ? (
                  <div className="py-12 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                    No calculators found matching &ldquo;{finderSearch}&rdquo;
                  </div>
                ) : (
                  filteredCalculators.map(calc => {
                    const Icon = TAB_ICONS[calc.id] || Landmark;
                    const isCurrent = activeTab === calc.id;
                    return (
                      <div
                        key={calc.id}
                        className={cn(
                          "pt-2 first:pt-0 p-3 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group",
                          isCurrent
                            ? "bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        )}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                            isCurrent
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                          )} aria-hidden="true">
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-black text-slate-900 dark:text-white">
                                {calc.shortTitle}
                              </span>
                              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {calc.category}
                              </span>
                              {isCurrent && (
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {calc.metaDescription}
                            </p>
                            <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                              {calc.slug}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              const fullUrl = `${window.location.origin}${calc.slug}`;
                              navigator.clipboard.writeText(fullUrl);
                              setCopiedUrl(true);
                              setTimeout(() => setCopiedUrl(false), 2000);
                            }}
                            aria-label={`Copy link for ${calc.shortTitle}`}
                            className="min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          >
                            <Copy size={14} aria-hidden="true" />
                            <span>Copy Slug</span>
                          </button>
                          <a
                            href={calc.slug}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo(calc.id);
                            }}
                            className="min-h-[44px] px-4 py-1.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            <span>Open</span>
                            <ArrowRight size={14} aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

