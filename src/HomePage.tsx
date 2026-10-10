import React, { useState, useMemo } from 'react';
import { 
  Home, TrendingUp, ShieldAlert, Zap, Compass, ArrowRight, ChevronRight,
  DollarSign, RefreshCw, Wallet, PiggyBank, Briefcase, Landmark, Info,
  Calculator, CheckCircle2, Link2, Search, Sliders, Layers, Sparkles, BookOpen,
  ArrowUpRight, ShieldCheck, FileSpreadsheet, Activity, BarChart3, Scale
} from 'lucide-react';
import { CALCULATORS_CONFIG, type CalculatorConfig } from './seo';
import { GlassCard, MetricCard } from './CalculatorModules';
import { calculateMortgage, calculateInvestment, calculateLoan, calculateRetirement } from './engine';

const CATEGORY_LIST = [
  'All Engines',
  'Mortgage & Real Estate',
  'Loans & Credit',
  'Investing & Wealth',
  'Income, Taxes & Economy'
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
  finance: DollarSign,
  tax: ShieldAlert,
  compound: TrendingUp,
  salary: Briefcase,
  rate: TrendingUp,
  'sales-tax': DollarSign,
  debt: ShieldAlert,
};

export function HomePage({ 
  currency, 
  onNavigate 
}: { 
  currency: any; 
  onNavigate: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Engines');
  
  // Interactive Quick Playground state
  const [quickTab, setQuickTab] = useState<'mortgage' | 'compound' | 'loan' | 'fire'>('mortgage');
  
  // Quick playground inputs
  const [quickHomePrice, setQuickHomePrice] = useState(400000);
  const [quickDownPct, setQuickDownPct] = useState(20);
  const [quickRate, setQuickRate] = useState(6.75);
  const [quickTerm, setQuickTerm] = useState(30);

  const [quickInitial, setQuickInitial] = useState(10000);
  const [quickMonthly, setQuickMonthly] = useState(500);
  const [quickInvRate, setQuickInvRate] = useState(8);
  const [quickYears, setQuickYears] = useState(20);

  const [quickLoanAmount, setQuickLoanAmount] = useState(25000);
  const [quickLoanRate, setQuickLoanRate] = useState(7.5);
  const [quickLoanYears, setQuickLoanYears] = useState(5);

  const [quickAge, setQuickAge] = useState(32);
  const [quickSavings, setQuickSavings] = useState(75000);
  const [quickFireMonthly, setQuickFireMonthly] = useState(2000);
  const [quickExpenses, setQuickExpenses] = useState(50000);

  // Quick calculations
  const quickMortgageRes = useMemo(() => {
    const down = (quickHomePrice * quickDownPct) / 100;
    return calculateMortgage({
      homePrice: quickHomePrice,
      downPayment: down,
      annualRate: quickRate,
      termYears: quickTerm,
      taxPercent: 1.1,
      insuranceAnnual: 1200,
      hoaAnnual: 0
    });
  }, [quickHomePrice, quickDownPct, quickRate, quickTerm]);

  const quickInvestmentRes = useMemo(() => {
    return calculateInvestment({
      initialAmount: quickInitial,
      monthlyContribution: quickMonthly,
      annualRate: quickInvRate,
      years: quickYears
    });
  }, [quickInitial, quickMonthly, quickInvRate, quickYears]);

  const quickLoanRes = useMemo(() => {
    return calculateLoan({
      loanAmount: quickLoanAmount,
      annualRate: quickLoanRate,
      termYears: quickLoanYears
    });
  }, [quickLoanAmount, quickLoanRate, quickLoanYears]);

  const quickFireRes = useMemo(() => {
    return calculateRetirement({
      currentAge: quickAge,
      currentSavings: quickSavings,
      monthlyContribution401k: quickFireMonthly / 3, // Assuming equal split
      monthlyContributionIra: quickFireMonthly / 3,
      monthlyContributionHsa: quickFireMonthly / 3,
      annualExpenses: quickExpenses,
      annualReturn: 8,
      safeWithdrawalRate: 4
    });
  }, [quickAge, quickSavings, quickFireMonthly, quickExpenses]);

  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;

  // Filtered calculators
  const filteredCalculators = useMemo(() => {
    return CALCULATORS_CONFIG.filter(calc => {
      const matchesCat = selectedCategory === 'All Engines' || calc.category === selectedCategory;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        calc.shortTitle.toLowerCase().includes(q) ||
        calc.label.toLowerCase().includes(q) ||
        calc.metaDescription.toLowerCase().includes(q) ||
        calc.keywords.toLowerCase().includes(q) ||
        calc.slug.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  // Group by category
  const categorizedList = useMemo(() => {
    const groups: Record<string, CalculatorConfig[]> = {};
    CALCULATORS_CONFIG.forEach(c => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-4 sm:pt-8 pb-4">
        <div className="max-w-4xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <span>Verified Financial Algorithms</span>
            <span aria-hidden="true">·</span>
            <span>16 Free Computation Engines</span>
            <span aria-hidden="true">·</span>
            <span>100% Client-Side Private</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Financial clarity computed with institutional precision.
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            High-performance mathematical tools for mortgages, loan amortization, wealth compounding, early retirement FIRE modeling, and tax analysis.
          </p>
        </div>

        {/* Live Search Omnibar */}
        <div className="mt-8 sm:mt-10 max-w-3xl space-y-4">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all 16 calculators (e.g. mortgage, loan, fire, compound, apr)..."
              aria-label="Search financial calculators"
              className="w-full pl-12 pr-4 py-3.5 min-h-[48px] rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-base font-medium shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_LIST.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-sm font-black'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. INSTANT SPOTLIGHT PLAYGROUND */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Instant Calculation Spotlight
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Test core calculations in real-time or launch the deep analytical engine.
            </p>
          </div>

          {/* Segmented control for quick playground */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-full overflow-x-auto no-scrollbar">
            {[
              { id: 'mortgage', label: 'Mortgage' },
              { id: 'compound', label: 'Compound Growth' },
              { id: 'loan', label: 'Personal Loan' },
              { id: 'fire', label: 'FIRE Target' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setQuickTab(tab.id as any)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  quickTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <GlassCard className="p-6 sm:p-8">
          {quickTab === 'mortgage' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Home Price</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{currency.symbol}</span>
                      <input
                        type="number"
                        value={quickHomePrice}
                        onChange={(e) => setQuickHomePrice(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-8 pr-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Down Payment (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={quickDownPct}
                        onChange={(e) => setQuickDownPct(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3 py-2.5 pr-8 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={quickRate}
                      onChange={(e) => setQuickRate(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Loan Term (Years)</label>
                    <div className="flex gap-2">
                      {[15, 30].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setQuickTerm(t)}
                          className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold border transition-colors ${
                            quickTerm === t
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {t} Years
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900 dark:bg-slate-950 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Estimated Monthly Payment (PITI)</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                    {format(quickMortgageRes.totalMonthly)}
                    <span className="text-xs text-slate-400 font-normal ml-1">/mo</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-xs uppercase font-bold">Principal &amp; Interest</span>
                    <span className="font-bold text-slate-200">{format(quickMortgageRes.monthlyPI)}/mo</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs uppercase font-bold">Total Interest</span>
                    <span className="font-bold text-slate-200">{format(quickMortgageRes.totalInterest)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('mortgage')}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Open Full Mortgage Engine</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {quickTab === 'compound' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Starting Balance</label>
                    <input
                      type="number"
                      value={quickInitial}
                      onChange={(e) => setQuickInitial(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Monthly Addition</label>
                    <input
                      type="number"
                      value={quickMonthly}
                      onChange={(e) => setQuickMonthly(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Annual Return (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={quickInvRate}
                      onChange={(e) => setQuickInvRate(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Horizon (Years)</label>
                    <input
                      type="number"
                      value={quickYears}
                      onChange={(e) => setQuickYears(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900 dark:bg-slate-950 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Future Portfolio Value</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                    {format(quickInvestmentRes.finalBalance)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-xs uppercase font-bold">Total Invested</span>
                    <span className="font-bold text-slate-200">{format(quickInvestmentRes.totalInvested)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs uppercase font-bold">Compound Gain</span>
                    <span className="font-bold text-emerald-400">+{format(quickInvestmentRes.totalGains)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('compound')}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Open Compound Engine</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {quickTab === 'loan' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Loan Amount</label>
                    <input
                      type="number"
                      value={quickLoanAmount}
                      onChange={(e) => setQuickLoanAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.25"
                      value={quickLoanRate}
                      onChange={(e) => setQuickLoanRate(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Term (Years)</label>
                    <input
                      type="number"
                      value={quickLoanYears}
                      onChange={(e) => setQuickLoanYears(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900 dark:bg-slate-950 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Monthly Installment</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">
                    {format(quickLoanRes.monthlyPayment)}
                    <span className="text-xs text-slate-400 font-normal ml-1">/mo</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-xs uppercase font-bold">Total Interest</span>
                    <span className="font-bold text-rose-400">{format(quickLoanRes.totalInterest)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs uppercase font-bold">Total Paid</span>
                    <span className="font-bold text-slate-200">{format(quickLoanRes.totalPayment)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('loan')}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Open Personal Loan Engine</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {quickTab === 'fire' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Age</label>
                    <input
                      type="number"
                      value={quickAge}
                      onChange={(e) => setQuickAge(Math.max(18, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Portfolio</label>
                    <input
                      type="number"
                      value={quickSavings}
                      onChange={(e) => setQuickSavings(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Monthly Savings</label>
                    <input
                      type="number"
                      value={quickFireMonthly}
                      onChange={(e) => setQuickFireMonthly(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Annual Spending</label>
                    <input
                      type="number"
                      value={quickExpenses}
                      onChange={(e) => setQuickExpenses(Math.max(1000, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900 dark:bg-slate-950 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">FIRE Target Net Worth (4% SWR)</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
                    {format(quickFireRes.targetNetWorth)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-xs uppercase font-bold">Years to Freedom</span>
                    <span className="font-bold text-slate-200">{quickFireRes.yearsToFIRE.toFixed(1)} Years</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs uppercase font-bold">Retirement Age</span>
                    <span className="font-bold text-amber-400">Age {Math.round(quickFireRes.fireAge)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('retirement')}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Open Retirement (FIRE) Simulator</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </section>

      {/* 3. CORE FINANCIAL ENGINES - 4 PILLARS */}
      <section className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Modular Architecture</span>
            <span aria-hidden="true">·</span>
            <span>4 Specialized Suites</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Comprehensive Financial Computation Suites
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Suite 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Home size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Mortgage &amp; Real Estate Suite</h3>
                  <p className="text-xs text-slate-500">PITI modeling, Escrow, Prepayments &amp; Amortization</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Full 30-year calendar amortization schedules with automatic Private Mortgage Insurance (PMI) thresholds, property tax modeling, hazard insurance, and accelerated prepayment savings.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  { id: 'mortgage', name: 'Mortgage & EMI Calculator', slug: '/mortgage-calculator' },
                  { id: 'amortization', name: 'Amortization Schedule Core', slug: '/amortization-calculator' },
                  { id: 'payment', name: 'Payment & Affordability Solver', slug: '/payment-calculator' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors group"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                      {item.slug} →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Suite 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Investing &amp; Wealth Accumulation</h3>
                  <p className="text-xs text-slate-500">Exponential growth, SIP planning &amp; FIRE modeling</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Compound growth engines across daily, monthly, and annual compounding frequencies. Simulate systematic investment plans (SIP), portfolio longevity, and early retirement dates.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  { id: 'compound', name: 'Compound Interest Kernel', slug: '/compound-interest-calculator' },
                  { id: 'investment', name: 'Investment & SIP Calculator', slug: '/investment-calculator' },
                  { id: 'retirement', name: 'Retirement & FIRE Simulator', slug: '/retirement-calculator' },
                  { id: 'interest', name: 'Simple & Compound Interest', slug: '/interest-calculator' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors group"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                      {item.slug} →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Suite 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Loans &amp; Debt Elimination</h3>
                  <p className="text-xs text-slate-500">Personal loans, vehicle financing &amp; payoff strategies</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Compare Debt Snowball vs. Debt Avalanche methodologies to eliminate multiple credit cards and loans with custom monthly extra payments and interest reduction modeling.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  { id: 'debt', name: 'Debt Snowball & Avalanche Engine', slug: '/debt-payoff-calculator' },
                  { id: 'loan', name: 'Personal Loan & Fee Estimator', slug: '/loan-calculator' },
                  { id: 'auto', name: 'Auto Loan & Trade-In Calculator', slug: '/auto-loan-calculator' },
                  { id: 'rate', name: 'Interest Rate (APR) Solver', slug: '/interest-rate-calculator' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors group"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs font-mono text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform">
                      {item.slug} →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Suite 4 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Income, Taxes &amp; Economics</h3>
                  <p className="text-xs text-slate-500">Take-home pay, purchasing power &amp; TVM solvers</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Model federal income tax brackets, FICA payroll withholding, salary to hourly conversion, inflation purchasing power loss, and Time Value of Money cash flows.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  { id: 'tax', name: 'Income Tax & Net Paycheck', slug: '/income-tax-calculator' },
                  { id: 'salary', name: 'Salary & Hourly Wage Converter', slug: '/salary-calculator' },
                  { id: 'inflation', name: 'Inflation & Purchasing Power', slug: '/inflation-calculator' },
                  { id: 'finance', name: 'TVM Finance Solver (PV, FV, PMT)', slug: '/finance-calculator' },
                  { id: 'sales-tax', name: 'Sales Tax & Reverse Extraction', slug: '/sales-tax-calculator' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors group"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      {item.slug} →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ALL 16 CALCULATORS DIRECTORY */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span>Search-Engine-Friendly Architecture</span>
              <span aria-hidden="true">·</span>
              <span>16 Direct Clean URLs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              All Financial Calculators Directory
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Showing {filteredCalculators.length} of {CALCULATORS_CONFIG.length} engines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCalculators.map((calc) => {
            const Icon = TAB_ICONS[calc.id] || Calculator;
            return (
              <div
                key={calc.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {calc.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {calc.shortTitle}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {calc.metaDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {calc.slug}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate(calc.id)}
                    aria-label={`Open ${calc.shortTitle}`}
                    className="min-h-[36px] px-3 py-1 bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 text-slate-700 dark:text-slate-300 group-hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Launch</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FINANCIAL RULES OF THUMB & BENCHMARKS */}
      <section className="space-y-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Essential Benchmarks</span>
            <span aria-hidden="true">·</span>
            <span>Mathematical Best Practices</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Standard Financial Rules of Thumb
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Housing Ratio</div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">The 28/36 Qualifying Rule</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Spend no more than <strong>28%</strong> of gross monthly income on housing costs (PITI) and no more than <strong>36%</strong> on total debt servicing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">FIRE Milestone</div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">The 4% Safe Withdrawal Rule</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Multiply annual expenses by <strong>25×</strong> to determine your target nest egg. Withdrawing 4% adjusted for inflation historically lasts 30+ years.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Doubling Time</div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">The Rule of 72</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Divide <strong>72</strong> by your expected annual rate of return to estimate how many years it takes for your investment principal to double.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Budget Allocation</div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">The 50/30/20 Framework</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Allocate <strong>50%</strong> of net pay to Needs, <strong>30%</strong> to Wants, and <strong>20%</strong> to Savings, Debt Payoff, and Investments.
            </p>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM TRUST & ARCHITECTURAL ADVANTAGES */}
      <section className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black">
            Engineered for computational speed and absolute privacy.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            ApexFinance executes mathematical kernels directly in your browser without telemetry, cloud storage dependencies, or paywalls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 size={16} />
              <span>100% Client-Side Computation</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No mortgage numbers, salaries, or debt balances leave your device. All calculations occur in real-time in memory.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Activity size={16} />
              <span>Real-Time Reactive Updates</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every keystroke and slider update triggers instantaneous formula re-computation with zero refresh lag.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <FileSpreadsheet size={16} />
              <span>Complete Amortization Export</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download clean CSV spreadsheets or generate printer-ready annual and monthly balance schedules.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
