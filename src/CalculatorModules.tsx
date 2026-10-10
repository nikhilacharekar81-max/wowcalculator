import React, { useState, useEffect, useMemo, useId } from 'react';
import { 
  Wallet, Briefcase, Landmark, RefreshCw, Zap, Calculator, TrendingUp, Compass, 
  CircleDollarSign, ShieldAlert, DollarSign, ArrowRight, ChevronDown, ChevronUp, 
  Percent, CheckCircle2, Calendar, Info
} from 'lucide-react';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, Line 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  calculateLoan, 
  calculateAutoLoan, 
  calculateInterest, 
  calculatePayment, 
  calculateSalary, 
  calculateInterestRate, 
  calculateSalesTax, 
  calculateFinanceTVM, 
  calculateInflation, 
  calculateIncomeTax, 
  calculateFicaTax,
  calculateComprehensiveTax,
  calculateCompoundInterest,
  calculateMortgage,
  calculateRetirement,
  calculateCaliforniaDailyOvertime,
  US_STATE_OVERTIME_RULES,
  solveRegulationZ_Apr,
  US_AUTO_SALES_TAX_LIST,
  type AutoStateTaxConfig,
  US_TAX_CONFIG_BY_YEAR,
  SUPPORTED_TAX_YEARS,
  DEFAULT_TAX_YEAR,
  US_STATE_TAX_CONFIGS,
  US_STATE_LIST,
  getStateConfig,
  type FilingStatus,
  MONTH_NAMES,
  FULL_MONTH_NAMES,
  parseStartDate,
  formatMonthYear,
  computePayoffMonthYear,
  normalizeMonthYearStr,
  addMonthsToDateStr
} from './engine';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-sm text-slate-900 dark:text-slate-100 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 transition-colors", className)}>
    {children}
  </div>
);

export const MetricCard = ({ label, value, subtext, icon: Icon, color }: any) => (
  <div 
    className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 p-4 sm:p-6 rounded-2xl shadow-sm space-y-2.5 sm:space-y-4 transition-colors"
    aria-live="polite"
    aria-atomic="true"
  >
    <div className="flex justify-between items-start gap-2 sm:gap-4">
      <div className={cn("p-2 sm:p-2.5 rounded-xl flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] shrink-0", color)} aria-hidden="true">
        <Icon size={18} className="text-white sm:w-5 sm:h-5" />
      </div>
      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-right leading-tight">{label}</span>
    </div>
    <div>
      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">{value}</h3>
      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">{subtext}</p>
    </div>
  </div>
);

export function CalculatorDisclaimer() {
  return (
    <div className="mt-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 text-xs text-amber-900 dark:text-amber-200 leading-relaxed shadow-xs">
      <div className="flex items-center gap-2 font-bold uppercase tracking-wider mb-1">
        <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Disclaimer & Assumptions (Tax Year 2026)</span>
      </div>
      <p className="mb-1">
        Results are estimates for informational purposes only and do not constitute professional tax, legal, financial, or insurance advice.
      </p>
      <p>
        Calculations assume Tax Year 2026 rules and standard modeling parameters. See <a href="/docs/ASSUMPTIONS.md" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-100">docs/ASSUMPTIONS.md</a> for detailed defaults, preset rates, and methodology assumptions. Actual outcomes vary based on individual financial circumstances and lender agreements.
      </p>
    </div>
  );
}

export const InputGroup = ({ label, value, onChange, min, step, prefix, suffix, type = "number", id: customId, placeholder }: any) => {
  const generatedId = useId();
  const inputId = customId || `input-${generatedId}`;
  const isNumber = type === "number";

  // Local text state to allow seamless backspacing, wiping out, and free typing without stuck 0s
  const [localText, setLocalText] = useState(value === 0 && !prefix ? '0' : (value !== undefined && value !== null ? String(value) : ''));

  useEffect(() => {
    // Only synchronize if the numeric value actually diverged
    const numInLocal = parseFloat(localText);
    if (value === '' || value === undefined || value === null) {
      if (localText !== '') setLocalText('');
    } else if (isNaN(numInLocal) || numInLocal !== value) {
      setLocalText(String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setLocalText(text);

    if (isNumber) {
      if (text.trim() === '') {
        onChange(0);
      } else {
        const parsed = Number(text);
        if (!isNaN(parsed)) {
          onChange(parsed);
        }
      }
    } else {
      onChange(text);
    }
  };

  const handleBlur = () => {
    if (isNumber) {
      if (localText.trim() === '' || isNaN(Number(localText))) {
        setLocalText(String(value ?? 0));
      }
    }
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <div aria-hidden="true" className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 font-bold text-sm pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          id={inputId}
          aria-label={label}
          type={isNumber ? "text" : type}
          inputMode={isNumber ? (step && String(step).includes('.') ? "decimal" : "numeric") : undefined}
          value={localText}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 text-slate-900 dark:text-slate-100 font-bold text-base sm:text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            prefix ? "pl-8 sm:pl-9 pr-3 sm:pr-4" : "px-3.5 sm:px-4",
            suffix && "pr-10 sm:pr-12"
          )}
        />
        {suffix && (
          <div aria-hidden="true" className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 font-bold text-xs pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export interface StartDatePickerProps {
  value: string; // "YYYY-MM"
  onChange: (dateStr: string) => void;
  label?: string;
  termYears?: number;
  payoffDate?: string;
  firstPaymentDate?: string;
  id?: string;
}

export const StartDatePicker = ({
  value,
  onChange,
  label = "Start Date",
  termYears = 30,
  payoffDate,
  firstPaymentDate,
  id
}: StartDatePickerProps) => {
  const generatedId = useId();
  const inputId = id || `start-date-${generatedId}`;

  const parsed = useMemo(() => parseStartDate(value), [value]);
  const currentYear = parsed.year;
  const currentMonth = parsed.month;

  // Local state for free-form year text: allows user to freely backspace, delete, or clear to empty!
  const [yearText, setYearText] = useState(String(currentYear));

  // Sync yearText when external value changes (e.g., clicking presets)
  useEffect(() => {
    setYearText(String(currentYear));
  }, [currentYear]);

  const livePayoff = useMemo(() => {
    if (payoffDate) return payoffDate;
    return computePayoffMonthYear(value, (termYears || 30) * 12);
  }, [value, termYears, payoffDate]);

  const liveFirst = useMemo(() => {
    if (firstPaymentDate) return firstPaymentDate;
    return formatMonthYear(parsed.year, parsed.month);
  }, [firstPaymentDate, parsed]);

  const handleMonthSelect = (m: number) => {
    const yr = Number(yearText) >= 1900 && Number(yearText) <= 2150 ? Number(yearText) : currentYear;
    const nextVal = `${yr}-${String(m).padStart(2, '0')}`;
    onChange(nextVal);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow digits only up to 4 chars; can be completely empty if backspaced/deleted!
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 4);
    setYearText(digitsOnly);

    // If complete 4-digit year typed, immediately propagate change!
    if (digitsOnly.length === 4) {
      const num = Number(digitsOnly);
      if (num >= 1900 && num <= 2150) {
        const nextVal = `${num}-${String(currentMonth).padStart(2, '0')}`;
        onChange(nextVal);
      }
    }
  };

  const handleYearBlur = () => {
    const num = Number(yearText);
    if (!yearText || isNaN(num) || num < 1900 || num > 2150) {
      // If user blurred leaving it empty or invalid, restore to current valid year
      setYearText(String(currentYear));
    } else {
      const nextVal = `${num}-${String(currentMonth).padStart(2, '0')}`;
      onChange(nextVal);
    }
  };

  const setPresetOffset = (offsetMonths: number) => {
    const nextDate = addMonthsToDateStr(value, offsetMonths);
    onChange(nextDate);
  };

  return (
    <div className="space-y-3 bg-white/50 dark:bg-slate-900/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <label htmlFor={`${inputId}-month`} className="block text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
            {label}
          </span>
        </label>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
          {liveFirst}
        </span>
      </div>

      {/* Calculator.net style: Month Dropdown + Clearable Year Text Box Side-by-Side (No Spinners) */}
      <div className="grid grid-cols-12 gap-2 sm:gap-3">
        {/* Month Dropdown */}
        <div className="col-span-7">
          <label htmlFor={`${inputId}-month`} className="sr-only">Start Month</label>
          <select
            id={`${inputId}-month`}
            value={currentMonth}
            onChange={(e) => handleMonthSelect(Number(e.target.value))}
            className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2.5 sm:px-3 py-2 text-base sm:text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx + 1}>
                {name} ({FULL_MONTH_NAMES[idx]})
              </option>
            ))}
          </select>
        </div>

        {/* Year Input: Pure text, no up/down spinner arrows, wipes out completely on backspace */}
        <div className="col-span-5">
          <label htmlFor={`${inputId}-year`} className="sr-only">Start Year</label>
          <input
            id={`${inputId}-year`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={yearText}
            onChange={handleYearChange}
            onBlur={handleYearBlur}
            placeholder="YYYY"
            className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2.5 sm:px-3 py-2 text-base sm:text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </div>
      </div>

      {/* Quick Month Preset Buttons */}
      <div className="space-y-1.5 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-600 dark:text-slate-400 px-0.5">
          <span className="font-bold">Presets:</span>
          <div className="grid grid-cols-4 sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                onChange(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
              }}
              className="min-h-[36px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 flex items-center justify-center"
            >
              This Mo
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                now.setMonth(now.getMonth() + 1);
                onChange(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
              }}
              className="min-h-[36px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 flex items-center justify-center"
            >
              Next Mo
            </button>
            <button
              type="button"
              onClick={() => setPresetOffset(6)}
              className="min-h-[36px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 flex items-center justify-center"
            >
              +6 Mo
            </button>
            <button
              type="button"
              onClick={() => setPresetOffset(12)}
              className="min-h-[36px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 flex items-center justify-center"
            >
              +1 Yr
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic Date Audit Badge */}
      <div className="p-2.5 bg-blue-50/90 dark:bg-blue-950/60 rounded-xl border border-blue-200/80 dark:border-blue-800/80 text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between">
        <span>First: <strong className="font-mono text-slate-900 dark:text-white">{liveFirst}</strong></span>
        <span>Payoff: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{livePayoff}</strong></span>
      </div>
    </div>
  );
};

export const AdvancedToggle = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => (
  <button 
    type="button"
    onClick={onToggle}
    aria-expanded={isOpen}
    className="w-full min-h-[44px] flex items-center justify-between py-3 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
  >
    <span className="flex items-center gap-2">
      <Percent size={16} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
      {isOpen ? 'Hide Advanced Options' : 'Show Advanced Options'}
    </span>
    {isOpen ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
  </button>
);

export const ExpandableSchedule = ({ data, columns }: { data: any[], columns: { key: string, label: string, format?: (v: any) => string }[] }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="space-y-4">
      <button 
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full min-h-[44px] flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-800 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <RefreshCw size={16} className={cn("transition-transform duration-500", expanded && "rotate-180")} aria-hidden="true" />
          Detailed Payment Schedule
        </span>
        {expanded ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
      </button>
      {expanded && (
        <div className="overflow-hidden space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 sm:hidden flex items-center gap-1 font-medium">
            <span>Swipe horizontally to view full schedule →</span>
          </div>
          <div className="overflow-x-auto touch-pan-x rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <table className="w-full text-left text-xs sm:text-sm font-medium">
              <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs font-bold sticky top-0">
                <tr>
                  {columns.map(col => <th key={col.key} className="px-3 sm:px-6 py-3 sm:py-4 text-xs whitespace-nowrap">{col.label}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    {columns.map(col => (
                      <td key={col.key} className="px-3 sm:px-6 py-2.5 sm:py-4 font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm whitespace-nowrap">
                        {col.format ? col.format(row[col.key]) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 1. LOAN CALCULATOR MODULE
 * ========================================================================== */
export function LoanCalculatorModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({
    amount: 25000,
    rate: 8.5,
    termValue: 5,
    termUnit: 'years' as 'years' | 'months',
    originationFee: 1.5,
    feeDeducted: true,
    extraMonthly: 0
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const termMonths = params.termUnit === 'years' ? params.termValue * 12 : params.termValue;

  const res = useMemo(() => calculateLoan({
    loanAmount: params.amount,
    annualRate: params.rate,
    termMonths,
    originationFeePercent: params.originationFee,
    feeDeductedFromProceeds: params.feeDeducted,
    extraMonthly: params.extraMonthly
  }), [params, termMonths]);

  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;

  const chartData = [
    { name: 'Principal', value: res.loanAmount, color: '#3b82f6' },
    { name: 'Total Interest', value: res.totalInterest, color: '#f43f5e' },
    ...(res.originationFee > 0 ? [{ name: 'Fees', value: res.originationFee, color: '#8b5cf6' }] : [])
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <Wallet size={20} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" /> Loan Setup
            </h3>
            <InputGroup label="Loan Amount" value={params.amount} prefix={currency.symbol} onChange={(v: number) => setParams({...params, amount: v})} />
            
            <InputGroup 
              label="Interest rate (note rate)" 
              value={params.rate} 
              suffix="%" 
              step="0.1" 
              onChange={(v: number) => setParams({...params, rate: v})} 
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              The annual note rate used to calculate scheduled P&amp;I payments. APR is calculated separately and includes upfront origination fees.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Loan Term</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  min="1"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700" 
                  value={params.termValue} 
                  onChange={e => setParams({...params, termValue: Math.max(1, parseInt(e.target.value) || 1)}) } 
                />
                <select 
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  value={params.termUnit}
                  onChange={e => setParams({...params, termUnit: e.target.value as 'years' | 'months'})}
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <AdvancedToggle isOpen={showAdvanced} onToggle={() => setShowAdvanced(!showAdvanced)} />
            {showAdvanced && (
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                <InputGroup label="Origination Fee (%)" value={params.originationFee} suffix="%" step="0.25" onChange={(v: number) => setParams({...params, originationFee: v})} />
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Fee Handling (TILA Reg Z)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setParams({...params, feeDeducted: true})}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${params.feeDeducted ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                    >
                      Fee deducted from proceeds
                    </button>
                    <button
                      type="button"
                      onClick={() => setParams({...params, feeDeducted: false})}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors {!params.feeDeducted ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                    >
                      Fee added to loan
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {params.feeDeducted ? 'Fee is withheld from proceeds (Amount Financed < Loan Amount).' : 'Fee is financed into the loan principal.'}
                  </p>
                </div>

                <InputGroup label="Extra Monthly Pay" value={params.extraMonthly} prefix={currency.symbol} onChange={(v: number) => setParams({...params, extraMonthly: v})} />
              </div>
            )}
          </GlassCard>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard label="Monthly Payment" value={format(res.monthlyPayment)} subtext="Standard P&I per month" icon={Wallet} color="bg-indigo-600" />
            <MetricCard label="Interest Rate / APR" value={`${res.annualRate.toFixed(2)}%`} subtext={`Calculated APR: ${res.apr.toFixed(2)}%`} icon={Landmark} color="bg-purple-600" />
            <MetricCard label="Total Interest" value={format(res.totalInterest)} subtext="Total interest paid" icon={Landmark} color="bg-rose-600" />
            <MetricCard label="Total Paid" value={format(res.totalPayment)} subtext="Principal + Interest + Fees" icon={RefreshCw} color="bg-blue-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-6 lg:p-8 space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Loan Cost Allocation</h4>
              <div className="h-64" aria-label="Loan Cost Allocation Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                      {chartData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                    </Pie>
                    <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                {chartData.map(d => (
                  <div key={d.name} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <div className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">{d.name}</div>
                    <div className="text-sm font-black" style={{ color: d.color }}>{format(d.value)}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 lg:p-8 space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Balance Progression</h4>
              <div className="h-64" aria-label="Balance Progression Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={res.schedule.filter((_, i) => i % Math.max(1, Math.floor(res.schedule.length / 15)) === 0 || i === res.schedule.length - 1)}>
                    <defs>
                      <linearGradient id="loanColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                    <XAxis dataKey="month" tickFormatter={m => `M${m}`} fontSize={11} stroke="#64748b" />
                    <YAxis hide />
                    <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} fill="url(#loanColor)" name="Remaining Balance" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE EDUCATIONAL GUIDE & REGULATORY NOTES */}
      <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-5 sm:space-y-6 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Personal Loan Calculator: Note Rate vs. APR, Origination Fees, and Regulation Z
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            <strong>Bottom Line Up Front (BLUF):</strong> The note rate is the baseline interest rate applied to your amortization schedule, whereas the Annual Percentage Rate (APR) incorporates upfront finance charges (such as origination fees) and the timing of payments to reflect the true annual cost of borrowing under Truth in Lending Act (TILA) Regulation Z.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Federal Preemption and State Rate Caps</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              While various states impose statutory usury limits or small-loan interest rate caps, <strong>federal preemption</strong> (under the National Bank Act and federal banking statutes) allows national banks, federal savings associations, and certain partner lenders to export their home-state interest rates nationwide. Consequently, state-specific interest caps do not apply uniformly to every lender or credit product.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Military Lending Act (MLA) 36% MAPR Cap</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Under the <strong>Military Lending Act (MLA)</strong>, covered borrowers—including active-duty service members, National Guard and Reserve members on active duty, and their certified dependents—are protected by a strict <strong>36% Military Annual Percentage Rate (MAPR)</strong> ceiling on consumer credit. Origination fees, credit insurance, and finance charges are factored directly into the MAPR calculation.
            </p>
          </GlassCard>
        </div>

        {/* The Mathematics of Personal Loan Amortization */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">The Mathematics of Personal Loan Amortization</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Personal loans operate on a fixed amortization schedule. Every monthly installment is divided into two distinct portions: interest owed to the lender for the past billing cycle and principal used to reduce your balance.
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            <div className="font-bold text-indigo-600 dark:text-indigo-400">The Standard Amortization Formula</div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg text-center font-bold text-sm">
              M = P • [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <div>P = Net loan principal amount borrowed</div>
              <div>r = Monthly interest rate (Annual Interest Rate ÷ 12 ÷ 100)</div>
              <div>n = Total number of monthly payments (Loan Term in Years × 12)</div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="font-bold text-base text-slate-900 dark:text-white">Amortization Balance Reduction Curve</div>
            <div className="space-y-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-mono text-xs sm:text-sm">
              <div>├── Early Loan Months: Higher Interest Allocation / Lower Principal Reduction</div>
              <div>├── Midpoint (M30):    Balanced Split Between Interest and Principal</div>
              <div>└── Late Loan Months:  Lower Interest Allocation / Rapid Principal Paydown</div>
            </div>
            <p className="pt-1 leading-relaxed">
              Because interest is calculated based on your remaining balance at the beginning of each cycle, the interest portion of your monthly payment decreases over time. Consequently, the portion allocated toward principal grows larger with every subsequent payment.
            </p>
          </div>
        </GlassCard>

        {/* Step-by-Step Payment Calculation Example */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Step-by-Step Payment Calculation Example</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">Using the default figures from the calculator interface, here is the complete mathematical breakdown:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-mono">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white text-sm mb-2">Loan Parameters</div>
              <div>1. Total Loan Amount Borrowed (P): $25,000</div>
              <div>2. Quoted Annual Interest Rate: 8.50%</div>
              <div>3. Loan Term: 5 Years (60 Months)</div>
              <div>4. Origination Fee Percentage: 1.50%</div>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl space-y-1.5 border border-indigo-200 dark:border-indigo-800">
              <div className="font-bold text-indigo-900 dark:text-indigo-200 text-sm mb-2">Calculation Breakdown</div>
              <div>• Monthly Interest Rate (r): 8.5% / 12 = 0.0070833</div>
              <div>• Monthly Base Payment (M): $512.91 ($513/mo)</div>
              <div>• Total 60-Month Base Payments: $30,774.60</div>
              <div>• Total Cumulative Interest Paid: $5,774.60 ($5,775)</div>
              <div>• Upfront Origination Fee: $25,000 × 1.5% = $375.00</div>
              <div className="pt-2 font-black text-emerald-600 dark:text-emerald-400 text-sm">Total Final Outlay: $31,149.60 ($31,150)</div>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            In this setup, the borrower pays $5,775 in total interest and $375 in fees over the 5-year period. The origination fee represents 6.1% of total borrowing costs ($375 out of $6,150 total cost).
          </p>
        </GlassCard>

        {/* How Origination Fees Impact Net Loan Proceeds */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">How Origination Fees Impact Net Loan Proceeds</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            It is essential to distinguish between deducted origination fees and financed origination fees when accepting a loan offer:
          </p>
          <div className="space-y-2 text-xs sm:text-sm font-mono bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <div className="font-bold text-indigo-600 dark:text-indigo-400">Handling Origination Fees</div>
            <div>├── Option A: Deducted from Loan Proceeds (Net Payout Reduced)</div>
            <div>└── Option B: Added to Total Principal (Monthly Payment Increased)</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 dark:text-slate-300">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white text-base block">Deducted from Proceeds (Most Common)</span>
              <p className="leading-relaxed">If you request $25,000 with a 1.5% fee ($375), the lender deducts $375 upfront and deposits $24,625 into your bank account. However, you still pay monthly interest on the full $25,000 loan agreement.</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white text-base block">Financed into the Balance</span>
              <p className="leading-relaxed">If you need exactly $25,000 in net cash, you must request a higher gross loan amount (approximately $25,381) to cover the 1.5% fee without reducing your net cash payout.</p>
            </div>
          </div>
        </GlassCard>

        {/* The Benefits of Extra Principal Payments */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">The Benefits of Extra Principal Payments</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Paying more than your required monthly payment accelerates loan payoff and lowers total interest expenses. Because personal loans do not carry prepayment penalties under federal law, any extra funds applied directly to principal reduce your outstanding balance immediately.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <div className="font-bold text-base text-slate-900 dark:text-white">Standard Scenario ($25,000 at 8.5% over 5 Years)</div>
              <div>• Monthly Payment: $513</div>
              <div>• Total Time to Pay Off: 60 Months (5 Years)</div>
              <div>• Cumulative Interest Paid: $5,775</div>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl space-y-2 border border-emerald-200 dark:border-emerald-800">
              <div className="font-bold text-base text-emerald-900 dark:text-emerald-200">Accelerated Scenario (Adding $100 Extra Monthly)</div>
              <div>• Monthly Payment: $613 ($513 + $100)</div>
              <div>• Total Time to Pay Off: 49 Months (4 Years 1 Month)</div>
              <div>• Cumulative Interest Paid: $4,631</div>
              <div className="font-black text-emerald-600 dark:text-emerald-400 pt-1">Direct Financial Savings: $1,144 in Interest &amp; 11 Months Sooner!</div>
            </div>
          </div>
        </GlassCard>

        {/* FAQs */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h4>
          <div className="space-y-4">
            {[
              {
                q: "What is a personal loan origination fee?",
                a: "An origination fee is an upfront processing fee charged by lenders to cover underwriting and administrative costs. It typically ranges from 1% to 8% of the total loan amount and is either deducted from your disbursement proceeds or added to your starting balance."
              },
              {
                q: "How does my credit score impact my personal loan rate?",
                a: "Lenders use your credit score to evaluate default risk. Borrowers with excellent credit (720+) qualify for single-digit interest rates, whereas borrowers with fair or poor credit face higher double-digit APRs, increasing total monthly and lifetime interest costs."
              },
              {
                q: "Can I make extra payments on a personal loan without penalty?",
                a: "Most reputable personal lenders do not charge prepayment penalties. Making extra monthly principal payments reduces your outstanding balance faster, substantially decreasing lifetime interest charges and shortening your repayment timeline."
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
    </div>
  );
}

/* ============================================================================
 * 2. AUTO LOAN CALCULATOR MODULE
 * ========================================================================== */
/* ============================================================================
 * 2. AUTO LOAN CALCULATOR MODULE
 * ========================================================================== */

export function AutoLoanModule({ currency }: { currency: any }) {
  const [stateCode, setStateCode] = useState('CA');
  const [tradeInReducesTaxOverride, setTradeInReducesTaxOverride] = useState<boolean | null>(null);
  const [params, setParams] = useState({
    vehiclePrice: 38000,
    downPayment: 6000,
    tradeInValue: 4000,
    tradeInLoanPayoff: 0,
    manufacturerRebate: 0,
    rebateIsTaxable: true,
    annualRate: 6.2,
    termMonths: 60,
    salesTaxPercent: 7.25,
    localTaxPercent: 0.0,
    titleFees: 450,
    dealerDocFee: 350,
    docFeeIsFinancingOnly: false
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sourced state configuration from master 50-state regulatory repository
  const selectedStateConfig = useMemo(() => {
    return US_AUTO_SALES_TAX_LIST.find(s => s.code === stateCode);
  }, [stateCode]);

  // Sync state baseline sales tax when state changes
  const handleStateChange = (newCode: string) => {
    setStateCode(newCode);
    setTradeInReducesTaxOverride(null); // Reset manual override to follow selected state's statutory rule
    if (newCode === 'CUSTOM') return;
    const item = US_AUTO_SALES_TAX_LIST.find(s => s.code === newCode);
    if (item) {
      setParams(p => ({ ...p, salesTaxPercent: item.rate }));
    }
  };

  // Statutory determination for whether trade-in reduces taxable amount
  const stateStatutoryTradeInCredit = selectedStateConfig ? selectedStateConfig.tradeInTaxCredit === true : true;
  const effectiveTradeInReducesTax = tradeInReducesTaxOverride !== null ? tradeInReducesTaxOverride : stateStatutoryTradeInCredit;

  const res = useMemo(() => calculateAutoLoan({
    vehiclePrice: params.vehiclePrice,
    downPayment: params.downPayment,
    tradeInValue: params.tradeInValue,
    tradeInLoanPayoff: params.tradeInLoanPayoff,
    manufacturerRebate: params.manufacturerRebate,
    rebateIsTaxable: params.rebateIsTaxable,
    annualRate: params.annualRate,
    termMonths: params.termMonths,
    salesTaxPercent: params.salesTaxPercent,
    localTaxPercent: params.localTaxPercent,
    titleFees: params.titleFees,
    dealerDocFee: params.dealerDocFee,
    docFeeIsFinancingOnly: params.docFeeIsFinancingOnly,
    stateCode: stateCode !== 'CUSTOM' ? stateCode : undefined,
    tradeInReducesTax: effectiveTradeInReducesTax
  }), [params, stateCode, effectiveTradeInReducesTax]);

  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;
  const formatDetailed = (v: number) => `${currency.symbol}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)}`;

  // Worked example computed dynamically from engine (CA, $38,000 price, $4,000 trade, 7.25% tax = $2,755 on full price)
  const workedExample = useMemo(() => calculateAutoLoan({
    vehiclePrice: 38000,
    downPayment: 6000,
    tradeInValue: 4000,
    tradeInLoanPayoff: 0,
    manufacturerRebate: 0,
    rebateIsTaxable: true,
    annualRate: 6.2,
    termMonths: 60,
    salesTaxPercent: 7.25,
    localTaxPercent: 0,
    titleFees: 450,
    dealerDocFee: 350,
    docFeeIsFinancingOnly: false,
    stateCode: 'CA',
    tradeInReducesTax: false
  }), []);

  const combinedTaxRate = Math.max(0, params.salesTaxPercent) + Math.max(0, params.localTaxPercent);

  const chartData = [
    { name: 'Vehicle Financed', value: res.totalFinanced, color: '#3b82f6' },
    { name: 'Total Interest', value: res.totalInterest, color: '#f43f5e' },
    { name: 'Cash Down', value: params.downPayment, color: '#10b981' },
    ...(res.tradeInNetEquity > 0 ? [{ name: 'Trade Net Equity', value: res.tradeInNetEquity, color: '#8b5cf6' }] : [])
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
                <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span>Vehicle Financing (US)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                TILA Reg Z
              </span>
            </div>

            {/* State Jurisdiction Dropdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                  State Sales Tax Jurisdiction
                </label>
                {selectedStateConfig?.needsVerification && (
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                    Needs verification: {selectedStateConfig.code}
                  </span>
                )}
              </div>
              <select
                value={stateCode}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="CUSTOM">-- Custom Manual Entry / No State Pre-fill --</option>
                {US_AUTO_SALES_TAX_LIST.map(st => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.rate === 0 ? '0% State Base' : `${st.rate}% State Base`}
                    {st.tradeInTaxCredit === false ? ' • No Trade Credit' : ''}
                    {st.maxTaxCap ? ` • $${st.maxTaxCap} Cap` : ''}
                    {st.needsVerification ? ' • Unverified' : ''})
                  </option>
                ))}
              </select>
              {selectedStateConfig?.notes && (
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-900 dark:text-blue-300 leading-normal">
                  <strong>Statutory Rule ({selectedStateConfig.code}):</strong> {selectedStateConfig.notes} (Source: {selectedStateConfig.source})
                </div>
              )}
            </div>

            {/* Sales Tax Rates: State % + Local % + Combined Display */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sales Tax Rates</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                  Combined: {combinedTaxRate.toFixed(3).replace(/\.?0+$/, '')}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputGroup 
                  label="State Tax Rate" 
                  value={params.salesTaxPercent} 
                  suffix="%" 
                  step="0.01" 
                  onChange={(v: number) => {
                    setParams(p => ({ ...p, salesTaxPercent: v }));
                  }} 
                />
                <InputGroup 
                  label="Local / County Tax" 
                  value={params.localTaxPercent} 
                  suffix="%" 
                  step="0.01" 
                  onChange={(v: number) => {
                    setParams(p => ({ ...p, localTaxPercent: v }));
                  }} 
                />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Taxable Base: {formatDetailed(res.taxableBase)}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">Total Tax: {formatDetailed(res.salesTax)}</span>
              </div>
            </div>

            {/* Vehicle Price & Down Payment */}
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Vehicle Price" value={params.vehiclePrice} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, vehiclePrice: v }))} />
              <InputGroup label="Cash Down Payment" value={params.downPayment} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, downPayment: v }))} />
            </div>

            {/* Trade-in Value & Loan Payoff (Negative Equity Support) */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">Trade-In Allowance &amp; Equity</span>
                {res.negativeEquity > 0 ? (
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                    Negative Equity: +{format(res.negativeEquity)}
                  </span>
                ) : res.tradeInNetEquity > 0 ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    Net Equity Credit: -{format(res.tradeInNetEquity)}
                  </span>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputGroup label="Trade-in Value" value={params.tradeInValue} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, tradeInValue: v }))} />
                <InputGroup label="Loan Payoff on Trade-in" value={params.tradeInLoanPayoff} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, tradeInLoanPayoff: v }))} />
              </div>
              {params.tradeInLoanPayoff > params.tradeInValue && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 leading-normal">
                  Loan payoff exceeds trade-in value: difference of {format(res.negativeEquity)} is added to the amount financed.
                </p>
              )}

              {/* Trade-in Tax Credit Manual Override Toggle */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    id="tradein-tax-credit-toggle"
                    type="checkbox"
                    checked={effectiveTradeInReducesTax}
                    onChange={(e) => setTradeInReducesTaxOverride(e.target.checked)}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="tradein-tax-credit-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Trade-in reduces taxable amount
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Statutory default for {selectedStateConfig?.name || stateCode}: {stateStatutoryTradeInCredit ? 'Allowed (tax on net difference)' : 'Prohibited (tax on full price)'}.
                  {tradeInReducesTaxOverride !== null && (
                    <span className="font-bold text-indigo-600 dark:text-indigo-400"> (Manual override active)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Manufacturer Rebate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <InputGroup label="Manufacturer Rebate ($)" value={params.manufacturerRebate} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, manufacturerRebate: v }))} />
              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    id="rebate-taxable-toggle"
                    type="checkbox"
                    checked={params.rebateIsTaxable}
                    onChange={(e) => setParams(p => ({ ...p, rebateIsTaxable: e.target.checked }))}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="rebate-taxable-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Rebate is taxable
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {params.rebateIsTaxable ? 'Applied after tax (standard in CA, TX, NY).' : 'Applied before tax (dealer discount).'}
                </p>
              </div>
            </div>

            {/* Rate & Term */}
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Interest Note Rate" value={params.annualRate} suffix="%" step="0.05" onChange={(v: number) => setParams(p => ({ ...p, annualRate: v }))} />
              <InputGroup label="Loan Term" value={params.termMonths} suffix="mo" step="12" onChange={(v: number) => setParams(p => ({ ...p, termMonths: v }))} />
            </div>

            {/* Advanced Fees & Doc Fee Regulation Z Toggle */}
            <AdvancedToggle isOpen={showAdvanced} onToggle={() => setShowAdvanced(!showAdvanced)} />
            {showAdvanced && (
              <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Title & Reg Fees" value={params.titleFees} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, titleFees: v }))} />
                  <InputGroup label="Dealer Doc Fee" value={params.dealerDocFee} prefix={currency.symbol} onChange={(v: number) => setParams(p => ({ ...p, dealerDocFee: v }))} />
                </div>

                {/* Regulation Z Doc Fee Checkbox */}
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      id="doc-fee-financing-only"
                      type="checkbox"
                      checked={params.docFeeIsFinancingOnly}
                      onChange={(e) => setParams(p => ({ ...p, docFeeIsFinancingOnly: e.target.checked }))}
                      className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="doc-fee-financing-only" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                      Fee is charged only to financing customers (default off)
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                    Under Regulation Z (12 CFR § 1026.4), documentation fees payable by cash buyers too are not finance charges. Check this box only if the doc fee is charged exclusively to financing customers to treat it as a prepaid finance charge in the APR.
                  </p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Hero Metrics & TILA Summary */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <MetricCard 
              label="Monthly Payment" 
              value={format(res.monthlyPayment)} 
              subtext={res.finalPayment !== res.monthlyPayment ? `Final mo: ${formatDetailed(res.finalPayment)}` : `For ${params.termMonths} months`} 
              icon={Wallet} 
              color="bg-slate-800 dark:bg-slate-700" 
            />
            <MetricCard 
              label="Regulation Z APR" 
              value={`${res.regulationZApr.toFixed(3)}%`} 
              subtext={params.docFeeIsFinancingOnly ? "Includes doc fee" : "Equals note rate"} 
              icon={Percent} 
              color="bg-indigo-600" 
            />
            <MetricCard 
              label="Total Financed" 
              value={format(res.totalFinanced)} 
              subtext="Includes tax & fees" 
              icon={ShieldAlert} 
              color="bg-blue-600" 
            />
            <MetricCard 
              label="Total Interest" 
              value={format(res.totalInterest)} 
              subtext="Total financing cost" 
              icon={Landmark} 
              color="bg-rose-600" 
            />
          </div>

          {/* Breakdown Charts & TILA Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Vehicle Cost Allocation</h4>
              <div className="h-56" aria-label="Vehicle Cost Breakdown Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={chartData} innerRadius={55} outerRadius={75} paddingAngle={6} dataKey="value">
                      {chartData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                    </Pie>
                    <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                {chartData.map(d => (
                  <div key={d.name} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <div className="font-bold uppercase text-slate-700 dark:text-slate-300 truncate">{d.name}</div>
                    <div className="text-sm font-black truncate" style={{ color: d.color }}>{format(d.value)}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Auto Deal Summary (TILA)</h4>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{res.regulationZApr.toFixed(3)}% APR</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Vehicle Base Price</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatDetailed(params.vehiclePrice)}</span>
                  </div>
                  {params.manufacturerRebate > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Manufacturer Rebate {params.rebateIsTaxable ? '(Taxable)' : '(Non-Taxable)'}</span>
                      <span className="font-bold">-{formatDetailed(params.manufacturerRebate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Sales Tax ({combinedTaxRate.toFixed(2)}% on {format(res.taxableBase)})
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">+{formatDetailed(res.salesTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Doc &amp; Title Fees</span>
                    <span className="font-bold text-slate-900 dark:text-white">+{formatDetailed(res.fees)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Down Payment</span>
                    <span className="font-bold">-{formatDetailed(params.downPayment)}</span>
                  </div>
                  {params.tradeInValue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Trade-In Allowance</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">-{formatDetailed(params.tradeInValue)}</span>
                    </div>
                  )}
                  {params.tradeInLoanPayoff > 0 && (
                    <div className="flex justify-between text-rose-600 dark:text-rose-400">
                      <span>Trade-in Loan Payoff</span>
                      <span className="font-bold">+{formatDetailed(params.tradeInLoanPayoff)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold">
                    <span className="text-slate-900 dark:text-white">Amount Financed</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-black">{formatDetailed(res.totalFinanced)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-900 dark:text-white">Total Out-of-Pocket Outlay</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">{formatDetailed(res.totalVehicleCost)}</span>
                  </div>
                  {res.finalPayment !== res.monthlyPayment && (
                    <p className="text-[11px] text-slate-500 pt-1">
                      Final payment trued-up to {formatDetailed(res.finalPayment)} in Month {params.termMonths} so total principal matches exactly {format(res.totalFinanced)}.
                    </p>
                  )}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                {res.aprLabel}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE EDUCATIONAL GUIDE & BENCHMARKS */}
      <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
        {/* BLUF Banner */}
        <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-5 sm:space-y-6 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Auto Loan Calculator: How to Estimate Monthly Car Payments, Sales Tax, Trade-In Credit, and Dealer Fees
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            <strong>Bottom Line Up Front (BLUF):</strong> Financing a vehicle involves calculating several upfront and recurring expenses beyond the vehicle sticker price. Your total financed amount is determined by adding state sales tax, title/registration charges, and dealer documentation fees to the vehicle purchase price, then subtracting your cash down payment and trade-in allowance. On a {format(workedExample.vehiclePrice)} vehicle in California with a {format(6000)} cash down payment, {format(workedExample.tradeInValue)} trade-in credit, 7.25% sales tax ({format(workedExample.salesTax)} on full vehicle price under Cal. Rev. &amp; Tax. Code § 6012 with no trade-in tax credit), {format(workedExample.titleFees)} title/reg fees, and {format(workedExample.dealerDocFee)} doc fees, the net loan principal comes out to {format(workedExample.totalFinanced)}. At a 6.20% annual interest rate over a 60-month term, the monthly payment works out to {format(workedExample.monthlyPayment)}, generating {format(workedExample.totalInterest)} in total interest charges for an overall transaction cost of {format(workedExample.totalVehicleCost)}.
          </p>
        </div>

        {/* 2-Column: Total Outlay Tree & Core Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Understanding Total Vehicle Financing Outlay</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When negotiating a car purchase at a dealership, focusing solely on the vehicle sticker price often leads to underestimating your out-of-pocket costs. Dealership financing incorporates statutory state fees, local sales taxes, dealer documentation charges, and credit adjustments before arriving at your final financed loan balance.
            </p>
            <div className="space-y-1 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <div className="font-bold text-indigo-600 dark:text-indigo-400">Total Out-of-Pocket Vehicle Expenditure</div>
              <div>├── Vehicle Sticker Price (Base Price)</div>
              <div>├── State &amp; Local Sales Tax (Calculated on Taxable Net Base)</div>
              <div>├── Mandatory Government Fees (Title &amp; Registration)</div>
              <div>├── Dealer Administrative Charges (Documentation Fee)</div>
              <div>├── Less: Cash Down Payment</div>
              <div>└── Less: Trade-In Equity Credit</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Core Auto Financing Terms Defined</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>Vehicle Base Price:</strong> The negotiated sale price of the vehicle before taxes, state fees, optional dealer add-ons, or financing charges.</li>
              <li><strong>Trade-In Equity Credit:</strong> The net dollar value granted by the dealership for your existing vehicle. In many U.S. states, trading in a vehicle provides a major tax advantage by reducing the taxable price of the new car.</li>
              <li><strong>Net Financed Principal:</strong> The remaining balance financed through an auto loan after factoring in taxes, dealer fees, down payment, and trade-in credit.</li>
              <li><strong>Regulation Z APR:</strong> The true annualized cost of financing required under the Truth in Lending Act (TILA). It integrates prepaid finance charges, mandatory lender fees, and interest rates into a standardized yearly percentage rate.</li>
              <li><strong>Total Out-of-Pocket Expenditure:</strong> The absolute sum of all capital deployed across the ownership transaction, combining cash down payment, trade-in credit, principal payments, interest charges, and upfront fees.</li>
            </ul>
          </GlassCard>
        </div>

        {/* How to Use the Calculator Inputs */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">How to Use the Calculator Inputs</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The auto loan calculator provides a complete Truth in Lending Act (TILA) financing breakdown by accepting core purchase parameters alongside state-specific fee fields:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 dark:text-white text-base">1. Primary Financing Inputs</div>
              <ul className="space-y-1.5 list-disc pl-4 text-sm leading-relaxed">
                <li><strong>State Jurisdiction:</strong> Select your state or choose custom manual inputs. Choosing a state automatically provides baseline sales tax and fee benchmarks.</li>
                <li><strong>Vehicle Price ($):</strong> Enter the agreed negotiated price of the vehicle (e.g., $38,000).</li>
                <li><strong>Down Payment ($):</strong> Input your upfront cash contribution (e.g., $6,000). Higher down payments reduce loan-to-value (LTV) ratios and mitigate early equity depreciation.</li>
                <li><strong>Trade-in Value ($):</strong> Enter the allowance offered for your existing vehicle (e.g., $4,000).</li>
                <li><strong>Interest Rate (%):</strong> Input your quoted annual rate (e.g., 6.20%). Auto loan interest rates vary depending on whether the vehicle is new or used, your credit tier, and the repayment term length.</li>
                <li><strong>Term (Months):</strong> Select your loan horizon (e.g., 60 months / 5 years). Common auto loan terms include 36, 48, 60, 72, and 84 months.</li>
              </ul>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl space-y-2 border border-indigo-200 dark:border-indigo-800">
              <div className="font-bold text-indigo-900 dark:text-indigo-200 text-base">2. Advanced Tax &amp; Dealer Fee Inputs</div>
              <ul className="space-y-1.5 list-disc pl-4 text-sm leading-relaxed">
                <li><strong>Sales Tax (%):</strong> Enter your state and local combined sales tax percentage (e.g., 7.25%).</li>
                <li><strong>Title &amp; Reg ($):</strong> Input mandatory state department of motor vehicles (DMV) licensing and titling fees (e.g., $450).</li>
                <li><strong>Doc Fee ($):</strong> Enter the administrative documentation fee charged by the dealership (e.g., $350).</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* 50-State Reference Guide Table */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Complete 50-State Reference Guide: Sales Taxes, Trade-In Tax Rules, and Dealer Doc Fees
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Auto financing costs vary dramatically depending on the state where you register the vehicle. Two key state-level factors directly affect your final monthly payment:
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc pl-5 space-y-1 pt-1 leading-relaxed">
              <li><strong>Trade-In Sales Tax Credit Rules:</strong> Most U.S. states allow a trade-in tax credit, meaning sales tax is charged only on the difference (Vehicle Price − Trade-In Value). A few states do not allow this credit, requiring you to pay sales tax on the full purchase price regardless of your trade-in.</li>
              <li><strong>Dealer Documentation Fee Caps:</strong> Some states set strict legal limits on dealer documentation fees (e.g., $175 in New York, $85 in California), while unregulated states allow dealerships to charge $800 to $1,000 or more.</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1">
              Because municipal taxes and dealer practices vary, our free-entry tax and fee fields let you enter any custom rate or dollar amount.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">All 50 U.S. States Auto Finance Reference Table</h5>
            <div className="overflow-x-auto max-h-[420px] border border-slate-200 dark:border-slate-700 rounded-2xl">
              <table className="w-full text-left text-xs" aria-label="All 50 U.S. States Auto Finance Reference Table">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-4 py-3">State</th>
                    <th scope="col" className="px-4 py-3">State Sales Tax Rate</th>
                    <th scope="col" className="px-4 py-3">Trade-In Tax Credit Allowed?</th>
                    <th scope="col" className="px-4 py-3">Avg. Combined Tax Rate</th>
                    <th scope="col" className="px-4 py-3">Dealer Doc Fee Status / Cap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {[
                    ['Alabama', '2.00% (Auto)', 'Yes', '3.50% – 4.00%', 'Uncapped ($400 – $500 avg)'],
                    ['Alaska', '0.00%', 'N/A (No State Tax)', '0.00% – 7.50% (Local)', 'Uncapped ($200 – $400 avg)'],
                    ['Arizona', '5.60%', 'Yes', '7.20% – 9.20%', 'Uncapped ($400 – $500 avg)'],
                    ['Arkansas', '6.50%', 'Yes (If trade > $4,000)', '7.50% – 10.00%', 'Uncapped ($150 – $300 avg)'],
                    ['California', '7.25%', 'No (Tax on full price)', '7.25% – 10.75%', 'Capped at $85'],
                    ['Colorado', '2.90%', 'Yes', '6.00% – 9.50%', 'Uncapped ($500 – $700 avg)'],
                    ['Connecticut', '6.35% (7.75% over $50k)', 'Yes', '6.35% – 7.75%', 'Uncapped ($400 – $600 avg)'],
                    ['Delaware', '0.00%', 'N/A (4.25% Doc Fee)', '4.25% (Doc Fee)', 'Uncapped ($300 – $500 avg)'],
                    ['Florida', '6.00%', 'Yes', '6.00% – 7.50%', 'Uncapped ($800 – $1,000+ avg)'],
                    ['Georgia', '7.00% (TAVT)', 'Yes', '7.00% (Flat TAVT)', 'Uncapped ($500 – $700 avg)'],
                    ['Hawaii', '4.00%', 'No', '4.00% – 4.50%', 'Uncapped ($250 – $450 avg)'],
                    ['Idaho', '6.00%', 'Yes', '6.00%', 'Uncapped ($300 – $400 avg)'],
                    ['Illinois', '6.25%', 'Yes (Restored limit)', '7.25% – 10.25%', 'Capped at $358 (Adjusted yearly)'],
                    ['Indiana', '7.00%', 'Yes', '7.00%', 'Capped at $230'],
                    ['Iowa', '5.00%', 'Yes', '5.00%', 'Uncapped ($150 – $300 avg)'],
                    ['Kansas', '6.50%', 'Yes', '7.50% – 10.50%', 'Uncapped ($200 – $400 avg)'],
                    ['Kentucky', '6.00% (Usage Tax)', 'Yes', '6.00%', 'Uncapped ($300 – $500 avg)'],
                    ['Louisiana', '4.45%', 'Yes', '8.50% – 10.00%', 'Capped at $200'],
                    ['Maine', '5.50%', 'Yes', '5.50%', 'Uncapped ($400 – $500 avg)'],
                    ['Maryland', '6.00%', 'Yes', '6.00%', 'Capped at $500'],
                    ['Massachusetts', '6.25%', 'Yes', '6.25%', 'Uncapped ($400 – $600 avg)'],
                    ['Michigan', '6.00%', 'Yes (Capped max trade credit)', '6.00%', 'Capped at $260 (Adjusted yearly)'],
                    ['Minnesota', '6.875%', 'Yes', '6.875% – 8.00%', 'Capped at $275'],
                    ['Mississippi', '5.00% (Auto)', 'Yes', '5.00%', 'Uncapped ($300 – $500 avg)'],
                    ['Missouri', '4.225%', 'Yes', '6.00% – 9.00%', 'Uncapped ($200 – $500 avg)'],
                    ['Montana', '0.00%', 'N/A', '0.00% (1.5% over $150k)', 'Uncapped ($200 – $400 avg)'],
                    ['Nebraska', '5.50%', 'Yes', '5.50% – 7.50%', 'Uncapped ($200 – $400 avg)'],
                    ['Nevada', '4.60%', 'Yes', '8.10% – 8.38%', 'Uncapped ($400 – $600 avg)'],
                    ['New Hampshire', '0.00%', 'N/A', '0.00%', 'Uncapped ($300 – $500 avg)'],
                    ['New Jersey', '6.625%', 'Yes', '6.625%', 'Uncapped ($400 – $600 avg)'],
                    ['New Mexico', '4.00% (Motor Vehicle)', 'Yes', '4.00%', 'Uncapped ($300 – $400 avg)'],
                    ['New York', '4.00%', 'Yes', '7.00% – 8.875%', 'Capped at $175'],
                    ['North Carolina', '3.00% (HUT)', 'Yes', '3.00% (Highway Use Tax)', 'Uncapped ($500 – $700 avg)'],
                    ['North Dakota', '5.00%', 'Yes', '5.00%', 'Uncapped ($250 – $350 avg)'],
                    ['Ohio', '5.75%', 'Yes', '6.50% – 8.00%', 'Capped at $250 (or 10% of sale)'],
                    ['Oklahoma', '3.25% (Auto)', 'Yes', '3.25% – 4.50%', 'Uncapped ($300 – $500 avg)'],
                    ['Oregon', '0.50% (Privilege Tax)', 'No', '0.50%', 'Capped at $150 (or $115 without electronic processing)'],
                    ['Pennsylvania', '6.00%', 'Yes', '6.00% (7% Allegheny / 8% Phila)', 'Capped at $463 (Adjusted yearly)'],
                    ['Rhode Island', '7.00%', 'Yes', '7.00%', 'Capped at $200'],
                    ['South Carolina', '5.00% (Capped at $500)', 'Yes', 'Max $500 (Infrastructure Maintenance Fee)', 'Uncapped ($400 – $600 avg)'],
                    ['South Dakota', '4.00%', 'Yes', '4.00%', 'Uncapped ($150 – $300 avg)'],
                    ['Tennessee', '7.00%', 'Yes', '8.50% – 9.75%', 'Uncapped ($500 – $700 avg)'],
                    ['Texas', '6.25%', 'Yes', '6.25%', 'Capped at $150'],
                    ['Utah', '6.85%', 'Yes', '6.85% – 7.25%', 'Uncapped ($300 – $450 avg)'],
                    ['Vermont', '6.00%', 'Yes', '6.00%', 'Uncapped ($300 – $500 avg)'],
                    ['Virginia', '4.15% (SUT)', 'No (Tax on full price)', '4.15% (Sales and Use Tax)', 'Uncapped ($500 – $800 avg)'],
                    ['Washington', '6.50% (+0.3% Motor Vehicle)', 'Yes', '8.00% – 10.60%', 'Capped at $200'],
                    ['West Virginia', '6.00%', 'Yes', '6.00%', 'Capped at $175'],
                    ['Wisconsin', '5.00%', 'Yes', '5.00% – 5.60%', 'Uncapped ($200 – $350 avg)'],
                    ['Wyoming', '4.00%', 'Yes', '4.00% – 6.00%', 'Uncapped ($200 – $400 avg)']
                  ].map(([st, rate, cred, avgRate, doc], idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-900 dark:text-white">{st}</td>
                      <td className="px-4 py-2 text-indigo-600 dark:text-indigo-400 font-bold">{rate}</td>
                      <td className="px-4 py-2 font-bold text-slate-800 dark:text-slate-200">{cred}</td>
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{avgRate}</td>
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{doc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>

        {/* National Benchmark Auto Loan Rates by Credit Score */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              National Benchmark Auto Loan Rates by Credit Score
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Auto loan interest rates are primarily determined by your credit score, loan duration, and whether you are purchasing a new or used vehicle. Lenders classify credit profiles into five main tiers.
            </p>
          </div>

          <div className="overflow-x-auto max-h-[400px] border border-slate-200 dark:border-slate-700 rounded-2xl">
            <table className="w-full text-left text-xs" aria-label="U.S. Auto Loan Interest Rates">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-3">Credit Tier</th>
                  <th scope="col" className="px-4 py-3">Score Range</th>
                  <th scope="col" className="px-4 py-3">Avg. New Car APR</th>
                  <th scope="col" className="px-4 py-3">Avg. Used Car APR</th>
                  <th scope="col" className="px-4 py-3">Monthly Payment (New)</th>
                  <th scope="col" className="px-4 py-3">Total Interest Paid (New)</th>
                  <th scope="col" className="px-4 py-3">Total Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {[
                  ['Super Prime', '781 to 850', '5.25%', '6.75%', '$569', '$4,170', '$34,170'],
                  ['Prime', '661 to 780', '6.45%', '8.85%', '$586', '$5,178', '$35,178'],
                  ['Non-Prime', '601 to 660', '9.60%', '13.25%', '$632', '$7,896', '$37,896'],
                  ['Subprime', '501 to 600', '12.85%', '18.10%', '$680', '$10,812', '$40,812'],
                  ['Deep Subprime', '300 to 500', '15.75%', '21.30%', '$726', '$13,538', '$43,538']
                ].map(([tier, rng, newApr, usedApr, pmt, intPaid, totPaid], idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{tier}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{rng}</td>
                    <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-bold">{newApr}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{usedApr}</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white">{pmt}</td>
                    <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-bold">{intPaid}</td>
                    <td className="px-4 py-3 font-black text-slate-900 dark:text-white">{totPaid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
            Note: Figures assume a $30,000 financed principal over 60 months.
          </div>
        </GlassCard>

        {/* The Mathematics of Auto Loan Amortization */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">The Mathematics of Auto Loan Amortization</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Auto financing relies on simple interest amortization. Interest accrues daily based on your remaining principal balance between payment dates.
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            <div className="font-bold text-indigo-600 dark:text-indigo-400">Standard Amortization Formula</div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg text-center font-bold text-sm">
              M = P • [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <div>P = Net Financed Principal (Vehicle Price + Taxes + Fees − Down Payment − Trade Credit)</div>
              <div>r = Monthly interest rate (Annual Interest Rate ÷ 12 ÷ 100)</div>
              <div>n = Loan term in months (e.g., 60 months)</div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="font-bold text-base text-slate-900 dark:text-white">Auto Amortization Balance Progression</div>
            <div className="space-y-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-mono text-xs sm:text-sm">
              <div>├── Month 1:  High Principal Balance ──► Higher Monthly Interest Charge</div>
              <div>├── Month 30: Midpoint Balance      ──► Equal Division of Payment</div>
              <div>└── Month 60: Minimal Balance       ──► Final Principal Settlement</div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="font-bold text-slate-900 dark:text-white text-base">Truth in Lending Act (TILA) Disclosure Formula</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Under Federal Regulation Z (12 CFR Part 1026), auto lenders must disclose four key financial metrics before contract execution:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-mono">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 block text-sm">Annual Percentage Rate (APR)</span>
                <span className="text-slate-600 dark:text-slate-400">Nominal Interest Rate + Prepaid Finance Fees</span>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800">
                <span className="font-bold text-rose-900 dark:text-rose-200 block text-sm">Finance Charge</span>
                <span className="text-slate-600 dark:text-slate-400">Total Interest Paid + Financing Fees</span>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="font-bold text-blue-900 dark:text-blue-200 block text-sm">Amount Financed</span>
                <span className="text-slate-600 dark:text-slate-400">Net Credit Provided to Your Account</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-sm">Total of Payments</span>
                <span className="text-slate-600 dark:text-slate-400">Amount Financed + Total Finance Charges</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Step-by-Step Payment Calculation Example */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Step-by-Step Payment Calculation Example</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            California benchmark worked example (under California law, sales tax applies to full vehicle purchase price with no trade-in deduction):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-mono">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white text-sm mb-2">Deal Setup &amp; Net Loan (P)</div>
              <div>Step 1: Vehicle Purchase Price: {formatDetailed(workedExample.vehiclePrice)}</div>
              <div>Step 2: Less Trade-In Allowance: -{formatDetailed(workedExample.tradeInValue)}</div>
              <div>Step 3: Taxable Base Price (CA Rules: No Credit): {formatDetailed(workedExample.taxableBase)}</div>
              <div>Step 4: State Sales Tax (7.25% on full {formatDetailed(workedExample.taxableBase)}): +{formatDetailed(workedExample.salesTax)}</div>
              <div>Step 5: Mandatory Title &amp; Registration Fees: +{formatDetailed(workedExample.titleFees)}</div>
              <div>Step 6: Dealer Administrative Documentation Fee: +{formatDetailed(workedExample.dealerDocFee)}</div>
              <div className="pt-2 font-bold text-slate-900 dark:text-white">
                Gross Total Purchase Price: {formatDetailed(workedExample.vehiclePrice + workedExample.salesTax + workedExample.fees)}
              </div>
              <div>Less Total Deductions ($6k Down + $4k Trade): -{formatDetailed(6000 + workedExample.tradeInValue)}</div>
              <div className="pt-1 font-black text-indigo-600 dark:text-indigo-400 text-sm">
                Net Amount Financed (P): {formatDetailed(workedExample.totalFinanced)}
              </div>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl space-y-1.5 border border-indigo-200 dark:border-indigo-800">
              <div className="font-bold text-indigo-900 dark:text-indigo-200 text-sm mb-2">Financing &amp; Outlay Results</div>
              <div>• Quoted Interest Rate: 6.20%</div>
              <div>• Loan Term: 60 Months</div>
              <div>• Monthly Interest Rate (r): 6.20% / 12 = {(6.2 / 1200).toFixed(7)}</div>
              <div className="pt-1 font-bold text-slate-900 dark:text-white text-sm">
                • Calculated Monthly Payment (M): {formatDetailed(workedExample.monthlyPayment)} / mo
              </div>
              <div>• Final Trued-Up Payment (Month 60): {formatDetailed(workedExample.finalPayment)}</div>
              <div>• Total Interest Paid Over 60 Months: {formatDetailed(workedExample.totalInterest)}</div>
              <div>
                • Total Amount Paid on Loan ({format(workedExample.totalFinanced)} + {format(workedExample.totalInterest)}): {formatDetailed(workedExample.totalPayments)}
              </div>
              <div className="pt-2 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                • Total Transaction Cost: {formatDetailed(workedExample.totalVehicleCost)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                ({formatDetailed(workedExample.totalPayments)} loan payments + {formatDetailed(6000 + workedExample.tradeInValue)} cash down &amp; trade equity)
              </div>
            </div>
          </div>

          {/* Federal Auto Loan Interest Tax Deduction Advisory */}
          <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-2 font-sans">
            <div className="flex items-center gap-2 font-bold text-blue-950 dark:text-blue-200 text-sm">
              <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Federal Auto-Loan Interest Tax Deduction Advisory (IRC § 163)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Statutory Overview:</strong> Under current Internal Revenue Code rules (IRC § 163(h)), interest paid on personal auto loans is classified as non-deductible personal interest unless the vehicle is used for business or trade purposes (IRC § 162). Recent federal policy proposals have considered introducing an above-the-line interest deduction for qualifying new, American-assembled passenger vehicles. Because statutory deduction caps, income phaseouts, and domestic assembly thresholds depend on enacted federal legislation, taxpayers should consult IRS Publication 535 and their CPA or tax advisor for current-year eligibility before claiming vehicle interest deductions.
            </p>
          </div>
        </GlassCard>

        {/* 5 Practical Strategies to Lower Total Auto Loan Costs */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">5 Practical Strategies to Lower Total Auto Loan Costs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">1. Keep the Loan Term to 60 Months or Fewer</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                While 72-month and 84-month loans lower your monthly payment, they significantly increase total interest expenses and heighten the risk of becoming "upside-down" on your loan (owing more than the car is worth).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">2. Put Down at Least 20% on New Cars</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                New vehicles lose 15% to 20% of their value in the first year. A 20% down payment prevents negative equity and protects you if the vehicle is totaled or sold early.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">3. Get Pre-Approved Before Visiting the Dealer</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Dealerships often add a 1% to 2% interest rate markup on financing arranged through their finance office. Securing a pre-approved rate from a credit union or bank gives you leverage to negotiate lower rates at the dealership.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">4. Negotiate Dealer Fees and Add-Ons</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Review the itemized loan contract for optional add-ons like extended warranties, GAP insurance, tire protection, or dealer prep charges. These non-essential add-ons can be declined or negotiated down.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 md:col-span-2">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">5. Pay Taxes and Registration Fees Out-of-Pocket</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Avoid rolling sales tax, title, and documentation fees into your loan. Financing these administrative costs increases your monthly payment and incurs long-term interest charges on non-asset fees.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* FAQs */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h4>
          <div className="space-y-4">
            {[
              {
                q: "What is GAP insurance, and do I need it?",
                a: "Guaranteed Asset Protection (GAP) insurance covers the financial gap between what your auto insurance company pays if your vehicle is totaled or stolen and the remaining balance on your auto loan. GAP insurance is recommended if your down payment is less than 20%, if you choose a loan term longer than 60 months, or if you are leasing a vehicle."
              },
              {
                q: "Can I refinance my auto loan later if interest rates drop?",
                a: "Yes. Auto loans can be refinanced at any time without federal prepayment penalties. If your credit score improves significantly or market interest rates drop by 1% to 2%, refinancing can lower your monthly payment and reduce remaining interest charges."
              },
              {
                q: "How does trading in a car with negative equity affect my loan?",
                a: "If you owe more on your trade-in vehicle than the dealer offers for it, you have negative equity (often called being 'underwater'). Dealerships typically offer to roll this remaining debt into your new auto loan. Doing so increases your new loan principal, raises your monthly payment, and compounds your interest expenses."
              },
              {
                q: "What is the 20/4/10 rule for buying a car?",
                a: "The 20/4/10 rule is a practical budgeting framework for purchasing a vehicle: 20% Down Payment: Put down at least 20% in cash or trade-in equity. 4-Year Term: Limit the loan length to no more than 4 years (48 months). 10% of Income: Keep your total monthly vehicle expenses (loan payment, auto insurance, and fuel) below 10% of your gross monthly income."
              },
              {
                q: "Why is my first auto loan payment slightly higher or lower than my estimated installment?",
                a: "Your first auto loan payment may differ slightly from your standard monthly estimate depending on the number of days between loan origination and your first due date. Because auto interest accrues daily, scheduling your first payment 45 days after delivery instead of the standard 30 days generates extra daily interest charges, which are added to your initial billing statement."
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
    </div>
  );
}

/* ============================================================================
 * 3. INTEREST CALCULATOR MODULE
 * ========================================================================== */
export function InterestCalculatorModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({
    principal: 20000,
    annualRate: 5.5,
    years: 5,
    type: 'compound' as 'compound' | 'simple',
    frequency: 365 as 1 | 2 | 4 | 12 | 365,
    monthlyDeposit: 157
  });
  const [showAdvanced, setShowAdvanced] = useState(true);

  const res = useMemo(() => calculateInterest(params), [params]);
  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)}`;

  const freqLabel = params.frequency === 365 ? 'Daily' : params.frequency === 12 ? 'Monthly' : params.frequency === 4 ? 'Quarterly' : 'Annual';

  // Real-time comparison across all compounding schedules to demonstrate exact delta
  const frequencyComparison = useMemo(() => {
    if (params.type !== 'compound') return [];
    const freqs: Array<{ freq: 365 | 12 | 4 | 1; label: string; times: string }> = [
      { freq: 365, label: 'Daily', times: '365/yr' },
      { freq: 12, label: 'Monthly', times: '12/yr' },
      { freq: 4, label: 'Quarterly', times: '4/yr' },
      { freq: 1, label: 'Annually', times: '1/yr' }
    ];
    return freqs.map(f => {
      const computed = calculateInterest({ ...params, frequency: f.freq });
      return {
        freq: f.freq,
        label: f.label,
        times: f.times,
        finalBalance: computed.finalBalance,
        totalInterest: computed.totalInterest,
        apy: computed.apy
      };
    });
  }, [params]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <Landmark size={20} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> Interest Growth
            </h3>
            <InputGroup label="Initial Principal" value={params.principal} prefix={currency.symbol} onChange={(v: number) => setParams({...params, principal: v})} />
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Interest Rate" value={params.annualRate} suffix="%" step="0.1" onChange={(v: number) => setParams({...params, annualRate: v})} />
              <InputGroup label="Time Horizon" value={params.years} suffix="yrs" onChange={(v: number) => setParams({...params, years: v})} />
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">Interest Method</span>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button 
                  type="button" 
                  onClick={() => setParams({...params, type: 'compound'})}
                  className={cn("min-h-[44px] py-2.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", params.type === 'compound' ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm font-black" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white")}
                >
                  Compound
                </button>
                <button 
                  type="button" 
                  onClick={() => setParams({...params, type: 'simple'})}
                  className={cn("min-h-[44px] py-2.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", params.type === 'simple' ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm font-black" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white")}
                >
                  Simple
                </button>
              </div>
            </div>

            {params.type === 'compound' && (
              <div className="space-y-2">
                <label htmlFor="compounding-freq-select" className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                  Compounding Frequency
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 365, label: 'Daily (365/yr)' },
                    { value: 12, label: 'Monthly (12/yr)' },
                    { value: 4, label: 'Quarterly (4/yr)' },
                    { value: 1, label: 'Annually (1/yr)' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setParams({ ...params, frequency: opt.value as any })}
                      className={cn(
                        "min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                        params.frequency === opt.value
                          ? "bg-emerald-600 border-emerald-600 text-white font-black shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <select 
                  id="compounding-freq-select"
                  aria-label="Compounding Frequency Dropdown"
                  value={params.frequency} 
                  onChange={e => setParams({...params, frequency: Number(e.target.value) as any})}
                  className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl py-2 px-3 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer mt-1"
                >
                  <option value={365}>Daily (365/yr)</option>
                  <option value={12}>Monthly (12/yr)</option>
                  <option value={4}>Quarterly (4/yr)</option>
                  <option value={1}>Annually (1/yr)</option>
                </select>
              </div>
            )}

            <AdvancedToggle isOpen={showAdvanced} onToggle={() => setShowAdvanced(!showAdvanced)} />
            {showAdvanced && (
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                <InputGroup label="Monthly Addition" value={params.monthlyDeposit} prefix={currency.symbol} onChange={(v: number) => setParams({...params, monthlyDeposit: v})} />
              </div>
            )}
          </GlassCard>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard label="Final Balance" value={format(res.finalBalance)} subtext={`Principal + Growth (${freqLabel})`} icon={TrendingUp} color="bg-emerald-600" />
            <MetricCard label="Total Interest Earned" value={format(res.totalInterest)} subtext={`Pure interest yield (${freqLabel})`} icon={Zap} color="bg-amber-600" />
            <MetricCard label="Effective APY" value={`${res.apy}%`} subtext={`Annual yield (${freqLabel} compounding)`} icon={Percent} color="bg-blue-600" />
          </div>

          <GlassCard className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Wealth Accrual Trajectory</h4>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                {freqLabel} Compounding Active
              </span>
            </div>
            <div className="h-80" aria-label="Wealth Accrual Trajectory Chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={res.timeline}>
                  <defs>
                    <linearGradient id="interestGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                  <XAxis dataKey="year" tickFormatter={y => `Year ${y}`} fontSize={11} stroke="#64748b" />
                  <YAxis hide />
                  <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={3} fill="url(#interestGrowth)" name="Total Balance" />
                  <Area type="monotone" dataKey="principal" stroke="#64748b" strokeWidth={2} fillOpacity={0} name="Total Deposits" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {params.type === 'compound' && (
            <GlassCard className="p-6 lg:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Compounding Frequency Yield Comparison
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Direct calculation across daily, monthly, quarterly, and annual compounding (click row to select)
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Active: {freqLabel} ({params.frequency}/yr)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left" aria-label="Compounding Frequency Yield Comparison">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                      <th scope="col" className="py-2.5 px-3">Compounding Schedule</th>
                      <th scope="col" className="py-2.5 px-3">Effective APY</th>
                      <th scope="col" className="py-2.5 px-3">Total Interest Earned</th>
                      <th scope="col" className="py-2.5 px-3">Final Balance</th>
                      <th scope="col" className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {frequencyComparison.map(row => {
                      const isSelected = params.frequency === row.freq;
                      return (
                        <tr 
                          key={row.freq} 
                          onClick={() => setParams({ ...params, frequency: row.freq })}
                          className={cn(
                            "cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80",
                            isSelected ? "bg-emerald-50/70 dark:bg-emerald-950/40 font-bold" : ""
                          )}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" aria-hidden="true" />
                              )}
                              <span className={isSelected ? "text-emerald-700 dark:text-emerald-300 font-black" : "text-slate-900 dark:text-white"}>
                                {row.label} ({row.times})
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {row.apy}%
                          </td>
                          <td className="py-3 px-3 font-mono font-black text-amber-700 dark:text-amber-300">
                            {format(row.totalInterest)}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                            {format(row.finalBalance)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setParams({ ...params, frequency: row.freq });
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                                isSelected 
                                  ? "bg-emerald-600 text-white font-black" 
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                              )}
                            >
                              {isSelected ? 'Active' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* COMPREHENSIVE EDUCATIONAL GUIDE & BENCHMARKS */}
      <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
        {/* BLUF Banner */}
        <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-5 sm:space-y-6 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Interest Calculator: How to Estimate Compound and Simple Interest Gains
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            <strong>Bottom Line Up Front (BLUF):</strong> The true return on invested capital depends heavily on three core factors: interest calculation method (compound vs. simple), compounding frequency (daily, monthly, quarterly, or annually), and recurring contributions. Starting with a $20,000 initial principal at a 5.50% annual interest rate over a 5-year investment horizon with daily compounding and $157 monthly additions yields a final balance of $37,147.74. This reflects $20,000 in starting principal, $9,420 in cumulative monthly contributions, and $7,727.74 in total compound interest earned—delivering an effective Annual Percentage Yield (APY) of 5.65%.
          </p>
        </div>

        {/* 2-Column: Total Outlay Tree & Core Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Understanding Interest Calculations: Simple vs. Compound Interest</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Interest is the monetary return earned on invested capital or the cost paid for borrowing funds. The method used to calculate interest significantly impacts wealth growth over time.
            </p>
            <div className="space-y-1 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <div className="font-bold text-emerald-600 dark:text-emerald-400">Total Investment Growth Value</div>
              <div>├── Initial Principal: The baseline capital deposited at investment origination</div>
              <div>├── Cumulative Recurring Additions: Total scheduled periodic contributions</div>
              <div>└── Total Interest Earned: Pure yield generated through simple or compound growth</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Core Financial Metrics Defined</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>Initial Principal ($):</strong> The starting capital deposit placed into a savings account, certificate of deposit (CD), treasury bond, or investment portfolio.</li>
              <li><strong>Nominal Interest Rate (%):</strong> The stated annual percentage rate (APR) paid by the financial institution before accounting for compounding effects.</li>
              <li><strong>Compounding Frequency:</strong> The schedule at which accrued interest is calculated and added back to the principal balance (daily, monthly, quarterly, or annually).</li>
              <li><strong>Effective Annual Percentage Yield (APY):</strong> The actual annualized rate of return earned when compounding frequency is factored into the nominal interest rate.</li>
              <li><strong>Monthly Addition ($):</strong> Regular supplemental capital contributions made at the end of each billing or calendar cycle to accelerate balance accumulation.</li>
            </ul>
          </GlassCard>
        </div>

        {/* Simple Interest vs. Compound Interest Mechanics */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Simple Interest vs. Compound Interest Mechanics</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Understanding the structural difference between simple and compound interest is fundamental to long-term wealth planning:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 dark:text-slate-300">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-900 dark:text-white text-base">1. Simple Interest Model</div>
              <p className="leading-relaxed">
                Simple interest calculates yield exclusively on the original initial principal balance. Interest earned in previous cycles is paid out or held separately and does not generate additional earnings.
              </p>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                Simple Interest (I) = P • r • t
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-0.5 font-mono">
                <div>P = Initial Principal</div>
                <div>r = Stated Annual Interest Rate (decimal)</div>
                <div>t = Time Horizon in Years</div>
              </div>
            </div>

            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl space-y-3 border border-emerald-200 dark:border-emerald-800">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 text-base">2. Compound Interest Model</div>
              <p className="leading-relaxed">
                Compound interest calculates yield on both the initial principal balance and all cumulative interest earned from prior compounding periods. This creates an exponential growth curve often referred to as financial compounding.
              </p>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-center font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                A = P(1 + r/n)^(nt) + PMT • [((1 + r/n)^(nt) - 1) / (r/n)]
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-0.5 font-mono">
                <div>A = Final Accumulated Balance</div>
                <div>P = Initial Principal</div>
                <div>r = Annual Interest Rate (decimal)</div>
                <div>n = Compounding Periods per Year (e.g., 365 daily, 12 monthly)</div>
                <div>t = Time Horizon in Years</div>
                <div>PMT = Periodic Contribution Amount</div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* How Compounding Frequency Increases Annual Yield (APY) & Matrix */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              How Compounding Frequency Increases Annual Yield (APY)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Compounding frequency determines how often accrued earnings are reinvested into the principal base. Increasing the compounding frequency raises the effective yield without changing the nominal interest rate.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 max-w-md mx-auto">
              Effective APY = (1 + r/n)^n - 1
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Yield Comparison Matrix ($20,000 Principal at 5.50% APR with $157 Monthly Additions over 5 Years)
            </h5>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm" aria-label="Yield Comparison Matrix">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">
                  <tr>
                    <th scope="col" className="px-4 py-3">Compounding Schedule</th>
                    <th scope="col" className="px-4 py-3">Nominal APR</th>
                    <th scope="col" className="px-4 py-3">Effective APY</th>
                    <th scope="col" className="px-4 py-3">Total Interest Earned</th>
                    <th scope="col" className="px-4 py-3">Final Accumulated Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">Daily (365/yr)</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.50%</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">5.65%</td>
                    <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">$7,727.74</td>
                    <td className="px-4 py-3 font-black text-slate-900 dark:text-white">$37,147.74</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">Monthly (12/yr)</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.50%</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">5.64%</td>
                    <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">$7,708.56</td>
                    <td className="px-4 py-3 font-black text-slate-900 dark:text-white">$37,128.56</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">Quarterly (4/yr)</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.50%</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">5.61%</td>
                    <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">$7,668.69</td>
                    <td className="px-4 py-3 font-black text-slate-900 dark:text-white">$37,088.69</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">Annually (1/yr)</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.50%</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">5.50%</td>
                    <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">$7,496.47</td>
                    <td className="px-4 py-3 font-black text-slate-900 dark:text-white">$36,916.47</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                    <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Simple Interest</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.50%</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-bold">5.50%</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,500.00 (No Additions)</td>
                    <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">$25,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>

        {/* U.S. Deposit Account Regulatory & Tax Framework */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            U.S. Deposit Account Regulatory &amp; Tax Framework
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            When evaluating interest-bearing products in the United States, several federal regulatory standards and tax rules govern consumer savings and investment vehicles:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-base block">1. Truth in Savings Act (Regulation DD)</span>
              <p className="leading-relaxed">
                Federal Regulation DD requires financial institutions to disclose interest rates using the standardized Annual Percentage Yield (APY) metric. This ensures consumers can make direct side-by-side comparisons across banks regardless of compounding schedules.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-base block">2. FDIC &amp; NCUA Insurance Limits</span>
              <p className="leading-relaxed">
                <strong>FDIC Insurance:</strong> Deposits at insured commercial banks are protected up to $250,000 per depositor, per insured bank, for each ownership category.
              </p>
              <p className="leading-relaxed">
                <strong>NCUA Insurance:</strong> Share accounts at federally insured credit unions receive identical coverage up to $250,000 through the National Credit Union Share Insurance Fund (NCUSIF).
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-base block">3. IRS Tax Treatment of Interest Income</span>
              <p className="leading-relaxed">
                Under U.S. tax law, interest earned on high-yield savings accounts (HYSA), certificates of deposit (CDs), and corporate bonds is categorized as ordinary income and taxed at standard federal income tax rates.
              </p>
              <p className="leading-relaxed">
                <strong>Form 1099-INT:</strong> Financial institutions issue IRS Form 1099-INT annually to account holders who earn $10 or more in interest during the tax year.
              </p>
              <p className="leading-relaxed">
                <strong>Tax-Exempt Interest:</strong> Interest earned on municipal bonds issued by state and local governments is typically exempt from federal income tax and, in many cases, state taxes if you reside in the issuing jurisdiction.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Complete 50-State Income Tax Overview for Savings Interest */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Complete 50-State Income Tax Overview for Savings Interest
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Interest income earned on cash deposits is subject to state income taxes in states that levy an income tax. Use the complete reference table below to understand how state income tax rates apply to interest earnings.
            </p>
          </div>

          <div className="overflow-x-auto max-h-[440px] border border-slate-200 dark:border-slate-700 rounded-2xl">
            <table className="w-full text-left text-xs sm:text-sm" aria-label="All 50 U.S. States Interest Tax Overview">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-3">State</th>
                  <th scope="col" className="px-4 py-3">State Income Tax Treatment on Interest</th>
                  <th scope="col" className="px-4 py-3">Top Marginal State Tax Rate</th>
                  <th scope="col" className="px-4 py-3">Primary Tax Framework</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {[
                  ['Alabama', 'Taxed as ordinary income', '5.00%', 'Progressive bracket schedule'],
                  ['Alaska', 'No State Income Tax', '0.00%', 'Zero state tax on interest income'],
                  ['Arizona', 'Taxed as ordinary income', '2.50%', 'Flat tax rate structure'],
                  ['Arkansas', 'Taxed as ordinary income', '4.40%', 'Graduated income tax scale'],
                  ['California', 'Taxed as ordinary income', '13.30% (Up to 14.4%)', 'Top progressive state tax rate'],
                  ['Colorado', 'Taxed as ordinary income', '4.40%', 'Flat tax on state taxable income'],
                  ['Connecticut', 'Taxed as ordinary income', '6.99%', 'Progressive multi-bracket system'],
                  ['Delaware', 'Taxed as ordinary income', '6.60%', 'Graduated income tax brackets'],
                  ['Florida', 'No State Income Tax', '0.00%', 'Zero state tax on interest income'],
                  ['Georgia', 'Taxed as ordinary income', '5.39%', 'Transitioning to flat tax model'],
                  ['Hawaii', 'Taxed as ordinary income', '11.00%', 'High progressive bracket schedule'],
                  ['Idaho', 'Taxed as ordinary income', '5.69%', 'Flat income tax system'],
                  ['Illinois', 'Taxed as ordinary income', '4.95%', 'Constitutional flat tax rate'],
                  ['Indiana', 'Taxed as ordinary income', '3.05%', 'Low flat tax rate structure'],
                  ['Iowa', 'Taxed as ordinary income', '3.80%', 'Flat tax implementation'],
                  ['Kansas', 'Taxed as ordinary income', '5.70%', 'Multi-tier graduated brackets'],
                  ['Kentucky', 'Taxed as ordinary income', '4.00%', 'Flat tax rate system'],
                  ['Louisiana', 'Taxed as ordinary income', '4.25%', 'Graduated individual income tax'],
                  ['Maine', 'Taxed as ordinary income', '7.15%', 'Progressive three-bracket system'],
                  ['Maryland', 'Taxed as ordinary income', '5.75% (+ Local county tax)', 'Combined state and county rates'],
                  ['Massachusetts', 'Taxed as ordinary income', '5.00% (4% Surtax over $1M)', 'Flat base rate with high-earner surtax'],
                  ['Michigan', 'Taxed as ordinary income', '4.25%', 'Flat income tax rate'],
                  ['Minnesota', 'Taxed as ordinary income', '9.85%', 'High progressive top bracket'],
                  ['Mississippi', 'Taxed as ordinary income', '4.00%', 'Single flat tax rate'],
                  ['Missouri', 'Taxed as ordinary income', '4.80%', 'Graduated tax bracket schedule'],
                  ['Montana', 'Taxed as ordinary income', '5.90%', 'Simplified two-bracket system'],
                  ['Nebraska', 'Taxed as ordinary income', '5.84%', 'Graduated individual tax rate'],
                  ['Nevada', 'No State Income Tax', '0.00%', 'Zero state tax on interest income'],
                  ['New Hampshire', 'Phasing Out Interest/Dividends Tax', '1.00% (0% effective 2027)', 'Special tax on investment income phasing out'],
                  ['New Jersey', 'Taxed as ordinary income', '10.75%', 'High progressive top rate'],
                  ['New Mexico', 'Taxed as ordinary income', '5.90%', 'Graduated income tax brackets'],
                  ['New York', 'Taxed as ordinary income', '10.90% (+ NYC local tax)', 'High progressive state and city rates'],
                  ['North Carolina', 'Taxed as ordinary income', '4.50%', 'Flat individual tax rate'],
                  ['North Dakota', 'Taxed as ordinary income', '2.50%', 'Low progressive bracket structure'],
                  ['Ohio', 'Taxed as ordinary income', '3.50%', 'Graduated income tax brackets'],
                  ['Oklahoma', 'Taxed as ordinary income', '4.75%', 'Multi-tier graduated brackets'],
                  ['Oregon', 'Taxed as ordinary income', '9.90%', 'High progressive top tax rate'],
                  ['Pennsylvania', 'Taxed as ordinary income', '3.07%', 'Low statutory flat tax rate'],
                  ['Rhode Island', 'Taxed as ordinary income', '5.99%', 'Progressive three-bracket system'],
                  ['South Carolina', 'Taxed as ordinary income', '6.40%', 'Graduated individual income tax'],
                  ['South Dakota', 'No State Income Tax', '0.00%', 'Zero state tax on interest income'],
                  ['Tennessee', 'No State Income Tax', '0.00%', 'Zero state tax on interest income'],
                  ['Texas', 'No State Income Tax', '0.00%', 'Zero state tax on interest income'],
                  ['Utah', 'Taxed as ordinary income', '4.55%', 'Flat state income tax rate'],
                  ['Vermont', 'Taxed as ordinary income', '8.75%', 'Progressive multi-bracket schedule'],
                  ['Virginia', 'Taxed as ordinary income', '5.75%', 'Graduated individual tax rate'],
                  ['Washington', 'No State Income Tax on Savings', '0.00%', 'No tax on interest (7% tax on capital gains >$250k)'],
                  ['West Virginia', 'Taxed as ordinary income', '5.12%', 'Graduated income tax brackets'],
                  ['Wisconsin', 'Taxed as ordinary income', '7.65%', 'Progressive four-bracket scale'],
                  ['Wyoming', 'No State Income Tax', '0.00%', 'Zero state tax on interest income']
                ].map(([st, treat, rate, frame], idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-2 font-bold text-slate-900 dark:text-white">{st}</td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{treat}</td>
                    <td className="px-4 py-2 text-indigo-600 dark:text-indigo-400 font-bold">{rate}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{frame}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Step-by-Step Mathematical Calculation Walkthrough */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Step-by-Step Mathematical Calculation Walkthrough
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Using the parameters from the calculator setup, here is the exact mathematical calculation for daily compounding with recurring monthly contributions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-mono">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white text-sm mb-2">Calculation Inputs</div>
              <div>• Initial Principal Deposit (P): $20,000.00</div>
              <div>• Stated Annual Interest Rate (r): 5.50% (0.055 per year)</div>
              <div>• Time Horizon (t): 5 Years (60 Months)</div>
              <div>• Compounding Frequency (n): 365 Days per Year</div>
              <div>• Monthly Contribution (PMT): $157.00 per month</div>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl space-y-2 border border-emerald-200 dark:border-emerald-800">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 text-sm mb-2">Step-by-Step Breakdown</div>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">1. Initial Principal Compound Growth:</div>
                <div>$20,000 × (1 + 0.055 / 365)^(365 × 5)</div>
                <div>= $20,000 × (1.00015068)^1825 = $26,329.83</div>
              </div>
              <div className="space-y-1 pt-1">
                <div className="font-bold text-slate-900 dark:text-white">2. Monthly Additions Accumulation Growth:</div>
                <div>Total Cash Additions = $157 × 60 Months = $9,420.00</div>
                <div>Future Value of Monthly Additions (Daily Compounded) = $10,817.91</div>
              </div>
              <div className="space-y-1 pt-1">
                <div className="font-bold text-slate-900 dark:text-white">3. Combined Final Portfolio Balance:</div>
                <div>$26,329.83 + $10,817.91 = $37,147.74</div>
              </div>
              <div className="pt-2 font-black text-emerald-600 dark:text-emerald-400 text-sm border-t border-emerald-200 dark:border-emerald-800">
                • Total Contributed: $29,420.00 | Total Interest Earned: $7,727.74 | Final Value: $37,147.74
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 5 Practical Wealth-Building Strategies Using Compounding */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            5 Practical Wealth-Building Strategies Using Compounding
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">1. Start Investing Early</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Because time (t) acts as an exponent in the compound interest formula, doubling your investment horizon quadruples compounding growth potential rather than merely doubling it.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">2. Increase Compounding Frequency</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Choose financial accounts that compound interest daily rather than quarterly or annually to capture maximum effective yield (APY).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">3. Automate Monthly Contributions</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Setting up recurring monthly deposits ensures continuous capital additions, fueling compound growth regardless of market volatility.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">4. Utilize Tax-Advantaged Accounts</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Holding cash and fixed-income assets inside tax-advantaged accounts like Traditional IRAs, Roth IRAs, or 401(k)s delays or eliminates annual taxes on interest income, keeping 100% of yield compounding.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 md:col-span-2">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">5. Reinvest All Interest Distributions</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Avoid withdrawing interest payments as cash. Keeping earnings within the account ensures the entire balance generates interest during subsequent compounding cycles.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* FAQs */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h4>
          <div className="space-y-4">
            {[
              {
                q: "What is the Rule of 72, and how does it work?",
                a: "The Rule of 72 is a quick mental math shortcut used to estimate how many years it will take for an investment to double at a fixed annual interest rate. Divide 72 by your annual interest rate. For example, at a 5.50% interest rate, your money will double in approximately 13.09 years (72 ÷ 5.50)."
              },
              {
                q: "How does inflation affect compound interest returns?",
                a: "Inflation reduces the purchasing power of money over time. To calculate your real rate of return, subtract the annual inflation rate from your nominal APY. If your account earns a 5.65% APY and inflation averages 2.50%, your real purchasing power return is 3.15%."
              },
              {
                q: "What is the difference between APR and APY?",
                a: "Annual Percentage Rate (APR) is the simple annual interest rate without taking compounding into account. Annual Percentage Yield (APY) incorporates the effect of compounding frequency, reflecting the true annual percentage earned on your deposit. APY is always equal to or higher than APR."
              },
              {
                q: "Can interest rates on high-yield savings accounts change over time?",
                a: "Yes. High-yield savings accounts carry variable interest rates that fluctuate based on target federal funds rate adjustments set by the Federal Reserve. Conversely, Certificates of Deposit (CDs) lock in a fixed interest rate for a specific term length (e.g., 12 or 60 months)."
              },
              {
                q: "Are there penalties for withdrawing funds from a Certificate of Deposit (CD) early?",
                a: "Yes. Withdrawing principal or interest from a standard CD before its maturity date incurs an early withdrawal penalty, usually calculated as a set number of days or months of simple interest (e.g., 90 days or 180 days of interest)."
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
    </div>
  );
}

/* ============================================================================
 * 4. PAYMENT CALCULATOR MODULE
 * ========================================================================== */
export const US_USURY_REGULATION_LIST = [
  { state: 'Alabama', limit: '8.00% (Legal rate without contract)', authority: 'AL State Banking Department', framework: 'Contractual rates allowed with disclosure' },
  { state: 'Alaska', limit: '10.50% (5% above Fed discount rate)', authority: 'AK Division of Banking & Securities', framework: 'Statutory caps on unwritten credit' },
  { state: 'Arizona', limit: '10.00% (Unwritten contracts)', authority: 'AZ Dept of Insurance and Financial Institutions', framework: 'Flexible contractual rates permitted' },
  { state: 'Arkansas', limit: '17.00% Constitutional Cap', authority: 'AR State Bank Department', framework: 'Strict constitutional usury enforcement' },
  { state: 'California', limit: '10.00% (Personal/consumer loans)', authority: 'CA Dept of Financial Protection and Innovation', framework: 'Exemptions for licensed lenders/banks' },
  { state: 'Colorado', limit: '45.00% Consumer Credit Code cap', authority: 'CO Attorney General - Consumer Credit', framework: 'Uniform Consumer Credit Code guidelines' },
  { state: 'Connecticut', limit: '12.00% Statutory civil usury cap', authority: 'CT Department of Banking', framework: 'Strict rate caps on unlicensed lenders' },
  { state: 'Delaware', limit: '5.00% above Fed discount rate', authority: 'DE Office of State Bank Commissioner', framework: 'Flexible banking hub rate structures' },
  { state: 'Florida', limit: '18.00% (Loans under $500k)', authority: 'FL Office of Financial Regulation', framework: 'Criminal usury applies above 25%' },
  { state: 'Georgia', limit: '7.00% (Legal rate without contract)', authority: 'GA Office of Commissioner of Insurance', framework: '16% cap on loans under $3,000' },
  { state: 'Hawaii', limit: '10.00% Statutory consumer limit', authority: 'HI Division of Financial Institutions', framework: 'Credit extension rate protections' },
  { state: 'Idaho', limit: '12.00% Statutory default limit', authority: 'ID Department of Finance', framework: 'Contractual rates allowed with disclosure' },
  { state: 'Illinois', limit: '9.00% Statutory limit (36% PLPA)', authority: 'IL Dept of Financial & Professional Regulation', framework: 'Predatory Loan Prevention Act caps' },
  { state: 'Indiana', limit: '8.00% Default statutory cap', authority: 'IN Department of Financial Institutions', framework: 'UCCC regulated consumer loan rates' },
  { state: 'Iowa', limit: '5.00% Statutory baseline rate', authority: 'IA Division of Banking', framework: 'Iowa Consumer Credit Code protections' },
  { state: 'Kansas', limit: '10.00% Default usury limit', authority: 'KS Office of State Bank Commissioner', framework: 'UCCC consumer credit limits' },
  { state: 'Kentucky', limit: '8.00% (Loans under $15,000)', authority: 'KY Department of Financial Institutions', framework: 'Statutory limits on small consumer credit' },
  { state: 'Louisiana', limit: '12.00% Legal interest rate limit', authority: 'LA Office of Financial Institutions', framework: 'Louisiana Consumer Credit Law' },
  { state: 'Maine', limit: '6.00% Default statutory limit', authority: 'ME Bureau of Consumer Credit Protection', framework: '36% APR cap on small consumer loans' },
  { state: 'Maryland', limit: '6.00% (Unwritten) / 24% contract', authority: 'MD Office of Commissioner of Financial Regulation', framework: 'Strict small loan regulatory caps' },
  { state: 'Massachusetts', limit: '20.00% Criminal usury threshold', authority: 'MA Division of Banks', framework: 'Small Loan Law rate restrictions' },
  { state: 'Michigan', limit: '5.00% (Legal) / 7.00% (Contract)', authority: 'MI Dept of Insurance & Financial Services', framework: 'Regulatory Loan Act rules' },
  { state: 'Minnesota', limit: '6.00% Legal statutory rate limit', authority: 'MN Department of Commerce', framework: 'Regulated Loan Act consumer protections' },
  { state: 'Mississippi', limit: '8.00% Default legal interest cap', authority: 'MS Dept of Banking & Consumer Finance', framework: 'Small Loan Regulatory Act schedules' },
  { state: 'Missouri', limit: '9.00% Legal baseline rate limit', authority: 'MO Division of Finance', framework: 'Contractual rate disclosures required' },
  { state: 'Montana', limit: '10.00% Statutory legal limit', authority: 'MT Division of Banking & Financial Institutions', framework: '36% voter-approved cap on small loans' },
  { state: 'Nebraska', limit: '6.00% Statutory legal baseline', authority: 'NE Department of Banking and Finance', framework: '36% voter-approved small loan cap' },
  { state: 'Nevada', limit: 'Market rate with clear disclosures', authority: 'NV Financial Institutions Division', framework: 'Clear contract rate rules' },
  { state: 'New Hampshire', limit: '10.00% Statutory legal rate limit', authority: 'NH Banking Department', framework: '36% APR cap on small consumer credit' },
  { state: 'New Jersey', limit: '30.00% Criminal usury limit', authority: 'NJ Department of Banking and Insurance', framework: 'Consumer Finance Licensing Act rules' },
  { state: 'New Mexico', limit: '15.00% Statutory default rate', authority: 'NM Financial Institutions Division', framework: '36% APR cap under HB 132' },
  { state: 'New York', limit: '16.00% Civil / 25.00% Criminal cap', authority: 'NY Department of Financial Services', framework: 'Strict statutory usury enforcement' },
  { state: 'North Carolina', limit: '8.00% Statutory legal rate limit', authority: 'NC Commissioner of Banks', framework: 'Consumer Finance Act rate limits' },
  { state: 'North Dakota', limit: '5.50% above Fed discount rate', authority: 'ND Department of Financial Institutions', framework: 'Consumer finance lending limits' },
  { state: 'Ohio', limit: '8.00% Legal rate without contract', authority: 'OH Division of Financial Institutions', framework: 'Ohio Small Loan Law protections' },
  { state: 'Oklahoma', limit: '6.00% Statutory legal baseline', authority: 'OK Department of Consumer Credit', framework: 'Uniform Consumer Credit Code schedule' },
  { state: 'Oregon', limit: '9.00% Default statutory legal rate', authority: 'OR Division of Financial Regulation', framework: '36% APR cap on small consumer loans' },
  { state: 'Pennsylvania', limit: '6.00% Statutory cap under CFTAPA', authority: 'PA Department of Banking and Securities', framework: 'Consumer Discount Company Act caps' },
  { state: 'Rhode Island', limit: '12.00% Statutory civil usury cap', authority: 'RI Department of Business Regulation', framework: 'Small loan licensing protections' },
  { state: 'South Carolina', limit: 'Fixed rate disclosure requirements', authority: 'SC Department of Consumer Affairs', framework: 'Consumer Protection Code guidelines' },
  { state: 'South Dakota', limit: '36.00% Voter-approved cap', authority: 'SD Division of Banking', framework: 'Money Lending license limits' },
  { state: 'Tennessee', limit: 'Formula rate (4% above prime)', authority: 'TN Dept of Financial Institutions', framework: 'Flexible statutory rate limits' },
  { state: 'Texas', limit: '6.00% Legal / Tiered Finance Code', authority: 'TX Office of Consumer Credit Commissioner', framework: 'OCCC regulated loan rate schedules' },
  { state: 'Utah', limit: 'Contractual rate market rules', authority: 'UT Dept of Financial Institutions', framework: 'Consumer Credit Code protections' },
  { state: 'Vermont', limit: '12.00% Statutory usury limit', authority: 'VT Dept of Financial Regulation', framework: 'Small Loan Act regulations' },
  { state: 'Virginia', limit: '6.00% Statutory / 36% cap', authority: 'VA State Corporation Commission', framework: 'Bureau of Financial Institutions rules' },
  { state: 'Washington', limit: '12.00% Civil usury statutory limit', authority: 'WA Department of Financial Institutions', framework: 'Consumer Loan Act regulations' },
  { state: 'West Virginia', limit: '6.00% Statutory legal limit', authority: 'WV Division of Financial Institutions', framework: 'Consumer Credit and Protection Act' },
  { state: 'Wisconsin', limit: '5.00% Default legal interest cap', authority: 'WI Dept of Financial Institutions', framework: 'Wisconsin Consumer Act guidelines' },
  { state: 'Wyoming', limit: '7.00% Statutory legal baseline', authority: 'WY Division of Banking', framework: 'Uniform Consumer Credit Code' }
];

export function PaymentCalculatorModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({
    mode: 'solve_payment' as 'solve_payment' | 'solve_loan',
    amount: 508763,
    annualRate: 7.0,
    termYears: 10,
    frequency: 'biweekly' as 'monthly' | 'biweekly' | 'weekly',
    extraPayment: 0
  });

  const res = useMemo(() => calculatePayment(params), [params]);
  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">Goal Mode</span>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button 
                  type="button" 
                  onClick={() => setParams({...params, mode: 'solve_payment', amount: 508763})}
                  className={cn("min-h-[44px] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", params.mode === 'solve_payment' ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white")}
                >
                  Find Payment
                </button>
                <button 
                  type="button" 
                  onClick={() => setParams({...params, mode: 'solve_loan', amount: 2723})}
                  className={cn("min-h-[44px] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", params.mode === 'solve_loan' ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white")}
                >
                  Find Loan Size
                </button>
              </div>
            </div>

            <InputGroup 
              label={params.mode === 'solve_payment' ? "Loan Amount" : "Target Periodic Payment"} 
              value={params.amount} 
              prefix={currency.symbol} 
              onChange={(v: number) => setParams({...params, amount: v})} 
            />

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Interest Rate" value={params.annualRate} suffix="%" step="0.1" onChange={(v: number) => setParams({...params, annualRate: v})} />
              <InputGroup label="Term" value={params.termYears} suffix="yrs" onChange={(v: number) => setParams({...params, termYears: v})} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="payment-freq-select" className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">Payment Frequency</label>
              <select 
                id="payment-freq-select"
                value={params.frequency}
                onChange={e => setParams({...params, frequency: e.target.value as any})}
                className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="monthly">Monthly</option>
                <option value="biweekly">Bi-Weekly (Every 2 weeks)</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {params.mode === 'solve_payment' && (
              <InputGroup label="Extra Principal / Period" value={params.extraPayment} prefix={currency.symbol} onChange={(v: number) => setParams({...params, extraPayment: v})} />
            )}
          </GlassCard>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              label={`${res.frequencyLabel} Payment`} 
              value={format(res.periodicPayment)} 
              subtext={params.mode === 'solve_payment' ? "Required periodic obligation" : "Affordable target payment"} 
              icon={RefreshCw} 
              color="bg-rose-600" 
            />
            <MetricCard 
              label={params.mode === 'solve_payment' ? "Loan Principal" : "Affordable Loan Amount"} 
              value={format(res.loanAmount)} 
              subtext="Total principal balance" 
              icon={Wallet} 
              color="bg-indigo-600" 
            />
            <MetricCard 
              label="Total Interest" 
              value={format(res.totalInterest)} 
              subtext="Over the entire term" 
              icon={Landmark} 
              color="bg-slate-800 dark:bg-slate-700" 
            />
          </div>

          <GlassCard className="p-6 lg:p-8 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Payment Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-64" aria-label="Payment Breakdown Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie 
                      data={[
                        { name: 'Principal Loan', value: res.loanAmount, color: '#4f46e5' },
                        { name: 'Total Interest', value: res.totalInterest, color: '#f43f5e' }
                      ]} 
                      innerRadius={65} 
                      outerRadius={85} 
                      paddingAngle={8} 
                      dataKey="value"
                    >
                      <Cell fill="#4f46e5" />
                      <Cell fill="#f43f5e" />
                    </Pie>
                    <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">Cumulative Payments:</span>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{format(res.totalPayment)}</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total money paid back to lender including all interest fees.</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {res.schedule && res.schedule.length > 0 && (
            <ExpandableSchedule 
              data={res.schedule}
              columns={[
                { key: 'period', label: `${res.frequencyLabel} #` },
                { key: 'payment', label: 'Payment', format },
                { key: 'principal', label: 'Principal', format },
                { key: 'interest', label: 'Interest', format },
                { key: 'totalInterest', label: 'Total Interest', format },
                { key: 'balance', label: 'Ending Balance', format }
              ]}
            />
          )}
        </div>
      </div>

      {/* COMPREHENSIVE EDUCATIONAL GUIDE & AFFORDABILITY BENCHMARKS */}
      <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-5 sm:space-y-6 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Payment &amp; Affordability Calculator: How to Estimate Periodic Payments and Maximum Loan Eligibility
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            <strong>Bottom Line Up Front (BLUF):</strong> Calculating loan affordability requires evaluating the mathematical relationship between periodic payment frequency (monthly, bi-weekly, or weekly), interest compounding, and total borrowing capacity. On a $508,763 loan principal at a 7.00% annual interest rate over a 10-year term with bi-weekly payments (26 payments per year), your required periodic payment equals $2,723. Over the 260 total payment periods, cumulative payments equal $708,094—comprising $508,763 in repaid principal and $199,331 in total interest charges. Switching to accelerated bi-weekly or weekly payment schedules reduces total lifetime interest expenses and shortens repayment horizons compared to standard monthly schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Understanding Periodic Payment Schedules and Affordability</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Whether financing real estate, personal debt consolidation, or commercial equipment, loan agreements structure payments across specific time intervals. Lenders evaluate borrowing eligibility based on debt-to-income (DTI) thresholds, interest compounding mechanics, and installment frequencies.
            </p>
            <div className="space-y-1 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <div className="font-bold text-indigo-600 dark:text-indigo-400">Total Out-of-Pocket Debt Obligation</div>
              <div>├── Loan Principal: The baseline capital sum borrowed from the lender</div>
              <div>├── Total Interest Charges: Accrued interest calculated over the loan term</div>
              <div>└── Periodic Installment: Fixed payment made monthly, bi-weekly, or weekly</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Key Financial Metrics Defined</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>Goal Mode (Find Payment vs. Find Loan Size):</strong> Dual calculation modes allowing users to compute the required installment for a known loan amount or solve for maximum affordable borrowing capacity based on a target budget.</li>
              <li><strong>Payment Frequency:</strong> The schedule at which installments are made—Monthly (12/yr), Bi-Weekly (26/yr), or Weekly (52/yr).</li>
              <li><strong>Required Periodic Obligation ($2,723):</strong> The fixed dollar amount owed during each payment cycle to fully amortize the loan by the target maturity date.</li>
              <li><strong>Total Principal Balance ($508,763):</strong> The original net sum financed through the credit agreement.</li>
              <li><strong>Cumulative Payments ($708,094):</strong> The total dollar amount remitted over the entire loan life (Principal + Interest).</li>
              <li><strong>Total Interest Paid ($199,331):</strong> The cumulative financing cost charged by the lender over the 10-year term.</li>
            </ul>
          </GlassCard>
        </div>

        {/* How Payment Frequencies Impact Lifetime Interest Charges */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">How Payment Frequencies Impact Lifetime Interest Charges</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Choosing between monthly, bi-weekly, and weekly payment schedules alters the rate at which principal decreases, directly impacting cumulative interest accrual:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-base block">1. Monthly Payments (12 Payments / Year)</span>
              <p className="leading-relaxed">
                Standard monthly amortization calculates interest on the remaining principal balance 12 times per year. Payments remain identical each month, spreading balance reduction evenly across the year.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 border border-indigo-200 dark:border-indigo-800">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 text-base block">2. Bi-Weekly Payments (26 Payments / Year)</span>
              <p className="leading-relaxed">
                Bi-weekly schedules divide the year into 26 equal payment periods (every two weeks). Because there are 52 weeks in a year, bi-weekly schedules result in 26 half-payments—the equivalent of 13 full monthly payments per year. This extra annual payment reduces principal faster and shortens overall payoff timelines.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-base block">3. Weekly Payments (52 Payments / Year)</span>
              <p className="leading-relaxed">
                Weekly payment schedules divide the year into 52 equal installments. Making 52 weekly payments continuously reduces the principal balance, slightly lowering total interest costs compared to monthly payments.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h5 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Payment Frequency Comparison Table ($508,763 Principal at 7.00% Interest over 10 Years)
            </h5>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm" aria-label="Payment Frequency Comparison Table">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">
                  <tr>
                    <th scope="col" className="px-4 py-3">Payment Frequency</th>
                    <th scope="col" className="px-4 py-3">Payments per Year</th>
                    <th scope="col" className="px-4 py-3">Periodic Payment Amount</th>
                    <th scope="col" className="px-4 py-3">Total Payments Made</th>
                    <th scope="col" className="px-4 py-3">Cumulative Outlay</th>
                    <th scope="col" className="px-4 py-3">Total Interest Paid</th>
                    <th scope="col" className="px-4 py-3">Interest Savings vs. Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">Monthly (12/yr)</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">$5,907</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                    <td className="px-4 py-3 font-black text-slate-900 dark:text-white">$708,867</td>
                    <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-bold">$200,104</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">Baseline</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors bg-indigo-50/40 dark:bg-indigo-950/20">
                    <td className="px-4 py-3 font-bold text-indigo-700 dark:text-indigo-300">Bi-Weekly (26/yr)</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26</td>
                    <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-bold">$2,723</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">260</td>
                    <td className="px-4 py-3 font-black text-slate-900 dark:text-white">$708,094</td>
                    <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-bold">$199,331</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">$773 Saved</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">Weekly (52/yr)</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">$1,361</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">520</td>
                    <td className="px-4 py-3 font-black text-slate-900 dark:text-white">$707,935</td>
                    <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-bold">$199,172</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">$932 Saved</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>

        {/* The Mathematics of Loan Payment and Affordability Formulas */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">The Mathematics of Loan Payment and Affordability Formulas</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Loan payment calculations use time-value-of-money formulas based on interest rates, compounding frequency, and loan duration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 dark:text-slate-300">
            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-900 dark:text-white text-base">1. Solving for Periodic Payment (PMT)</div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl text-center space-y-1 shadow-sm border border-slate-200 dark:border-slate-700/60">
                <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Standard Amortization Formula</div>
                <div className="font-mono font-bold text-sm sm:text-base text-indigo-600 dark:text-indigo-400">
                  PMT = P • [ i(1 + i)ⁿ ] / [ (1 + i)ⁿ - 1 ]
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 font-mono">
                <div>P = Loan Principal Amount ($508,763)</div>
                <div>i = Periodic Interest Rate (Annual Rate ÷ Periods per Year = 0.07 ÷ 26 = 0.00269230769)</div>
                <div>n = Total Number of Payment Periods (10 Years × 26 = 260 Periods)</div>
              </div>
            </div>

            <div className="p-5 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl space-y-3 border border-indigo-200 dark:border-indigo-800">
              <div className="font-bold text-indigo-900 dark:text-indigo-200 text-base">2. Solving for Maximum Loan Principal (P) — Affordability Mode</div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl text-center space-y-1 shadow-sm border border-indigo-200 dark:border-indigo-800">
                <div className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">Borrowing Capacity Inversion Formula</div>
                <div className="font-mono font-bold text-sm sm:text-base text-indigo-600 dark:text-indigo-400">
                  P = PMT • [ (1 + i)ⁿ - 1 ] / [ i(1 + i)ⁿ ]
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                This inverse formula calculates maximum borrowing capacity based on a user's target periodic budget (PMT), interest rate (i), and loan term (n).
              </p>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 font-mono">
                <div>P = Maximum Loan Principal Amount</div>
                <div>PMT = Target Periodic Installment Budget ($2,723)</div>
                <div>i = Periodic Interest Rate (0.07 ÷ 26 = 0.00269230769)</div>
                <div>n = Total Payment Periods (10 × 26 = 260)</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="font-bold text-base text-slate-900 dark:text-white">Amortization Balance Progression (10-Year Bi-Weekly Term)</div>
            <div className="space-y-1 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-xs sm:text-sm">
              <div>├── Year 1 (Period 26):   High Balance ($471,085)  ──► High Interest Share ($34,171)</div>
              <div>├── Year 5 (Period 130):  Midpoint Balance ($290,140) ──► Balanced Division</div>
              <div>└── Year 10 (Period 260): Zero Balance ($0)          ──► Final Principal Settlement</div>
            </div>
          </div>
        </GlassCard>

        {/* U.S. Lending Regulations and Borrower Affordability Guidelines */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">U.S. Lending Regulations and Borrower Affordability Guidelines</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When applying for loans in the United States, federal underwriting standards and debt guidelines govern borrowing limits:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 dark:text-slate-300">
            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-700">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">1. Debt-to-Income (DTI) Ratios</h5>
              <p className="leading-relaxed">
                Lenders evaluate creditworthiness using two primary Debt-to-Income (DTI) ratios:
              </p>
              <ul className="space-y-2 list-disc pl-5 leading-relaxed">
                <li><strong>Front-End DTI Ratio (Housing/Primary Debt):</strong> Measures the percentage of gross monthly income allocated toward housing or primary loan payments. Standard guidelines recommend keeping front-end DTI at or below 28%.</li>
                <li><strong>Back-End DTI Ratio (Total Debt Obligations):</strong> Measures total monthly debt payments (housing + student loans + car payments + credit cards) against gross monthly income. Most conventional underwriting caps back-end DTI at 36% to 43%.</li>
              </ul>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-700">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">2. Truth in Lending Act (TILA) &amp; Regulation Z Disclosures</h5>
              <p className="leading-relaxed">
                Under Federal Regulation Z (12 CFR Part 1026), lenders must disclose four standardized metrics before loan execution:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-xs sm:text-sm">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block">Annual Percentage Rate (APR)</span>
                  <span className="text-slate-600 dark:text-slate-400">Total cost of credit as a yearly rate, including interest &amp; upfront fees.</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-rose-600 dark:text-rose-400 block">Finance Charge</span>
                  <span className="text-slate-600 dark:text-slate-400">The total dollar amount the credit will cost over the term.</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-blue-600 dark:text-blue-400 block">Amount Financed</span>
                  <span className="text-slate-600 dark:text-slate-400">The net amount of credit provided to the borrower.</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Total of Payments</span>
                  <span className="text-slate-600 dark:text-slate-400">The total amount paid after making all scheduled payments.</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Complete 50-State Mortgage and Personal Loan Usury Limits */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Complete 50-State Mortgage and Personal Loan Usury Limits
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Interest rate caps and usury laws vary across all 50 U.S. states. Use the reference table below to review regulatory frameworks and statutory limits across jurisdictions.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              All 50 U.S. States Interest Rate Regulations Overview
            </h5>
            <div className="overflow-x-auto max-h-[440px] border border-slate-200 dark:border-slate-700 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm" aria-label="All 50 U.S. States Interest Rate Regulations Overview">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-4 py-3">State</th>
                    <th scope="col" className="px-4 py-3">Statutory Usury Rate Limit</th>
                    <th scope="col" className="px-4 py-3">State Financial Regulatory Body</th>
                    <th scope="col" className="px-4 py-3">Primary Lending Framework</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {US_USURY_REGULATION_LIST.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-900 dark:text-white">{row.state}</td>
                      <td className="px-4 py-2 text-indigo-600 dark:text-indigo-400 font-bold">{row.limit}</td>
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{row.authority}</td>
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{row.framework}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>

        {/* Step-by-Step Mathematical Calculation Walkthrough */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Step-by-Step Mathematical Calculation Walkthrough
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Using the parameters from the calculator setup ($508,763 Loan Amount, 7.00% Interest Rate, 10-Year Term, Bi-Weekly Schedule), here is the step-by-step mathematical breakdown:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-mono">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 dark:text-white text-sm mb-2">Calculation Inputs:</div>
              <div>• Loan Principal Financed (P):        $508,763.00</div>
              <div>• Quoted Annual Interest Rate (r):     7.00% (0.07 per year)</div>
              <div>• Loan Duration (t):                   10 Years</div>
              <div>• Payment Frequency (n):               Bi-Weekly (26 Periods / Year)</div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">Step 1: Calculate Periodic Interest Rate (i)</div>
                <div>i = Annual Interest Rate / Periods per Year</div>
                <div>i = 0.07 / 26 = 0.00269230769 per period</div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">Step 2: Calculate Total Payment Periods (n_total)</div>
                <div>n_total = Years × Periods per Year</div>
                <div>n_total = 10 × 26 = 260 Periods</div>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl space-y-2 border border-indigo-200 dark:border-indigo-800">
              <div className="space-y-1">
                <div className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">Step 3: Calculate Periodic Payment (PMT)</div>
                <div>PMT = $508,763 × [0.00269230769 × (1 + 0.00269230769)^260] / [(1 + 0.00269230769)^260 - 1]</div>
                <div>PMT = $508,763 × [0.00269230769 × 2.0102919] / [2.0102919 - 1]</div>
                <div>PMT = $508,763 × 0.00541232 / 1.0102919</div>
                <div className="font-bold text-indigo-700 dark:text-indigo-300">PMT = $2,723.44 per period (Rounded to $2,723)</div>
              </div>
              <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800 space-y-1">
                <div className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">Step 4: Calculate Cumulative Outlay and Total Interest</div>
                <div>Total Outlay = 260 Payments × $2,723.4402 = $708,094.45</div>
                <div>Total Interest = $708,094.45 - $508,763.00 = $199,331.45</div>
              </div>
              <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800 font-bold text-emerald-700 dark:text-emerald-400">
                <div>Final Calculation Summary:</div>
                <div>• Required Bi-Weekly Payment:          $2,723.00</div>
                <div>• Net Financed Principal:              $508,763.00</div>
                <div>• Total Cumulative Interest Paid:      $199,331.00</div>
                <div>• Total Cumulative Outlay:             $708,094.00</div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 5 Practical Strategies to Maximize Borrowing Affordability */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            5 Practical Strategies to Maximize Borrowing Affordability
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">1. Opt for Bi-Weekly or Weekly Payment Schedules</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Making bi-weekly payments results in 26 half-payments per year—the equivalent of 13 full monthly payments. This extra annual contribution accelerates principal reduction and lowers cumulative interest costs.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">2. Improve Credit Tier Prior to Application</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Lenders assign interest rates based on credit score bands. Raising a credit score from 660 to 740 can reduce interest rates by 1.5% to 2.5%, saving tens of thousands of dollars on long-term loan agreements.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">3. Keep Total Debt-to-Income (DTI) Below 36%</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Maintaining a conservative DTI ratio ensures monthly debt obligations remain manageable relative to gross earnings, improving financial stability and lender approval odds.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">4. Make Optional Extra Principal Contributions</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Applying extra payments directly toward principal bypasses interest charges, reducing the outstanding balance used to calculate subsequent interest fees.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 md:col-span-2">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">5. Shop Multiple Lenders for Rate Disclosures</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Requesting loan estimates from banks, credit unions, and online lenders allows borrowers to compare Annual Percentage Rates (APR) and upfront fee structures to secure optimal financing terms.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* FAQs */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h4>
          <div className="space-y-4">
            {[
              {
                q: "What is the difference between simple interest and compound interest on loans?",
                a: "Simple interest calculates interest charges solely on the remaining principal balance. Compound interest calculates interest on both the principal balance and accrued unpaid interest. Most consumer loans (auto, mortgage, personal loans) use simple interest calculated on a daily or monthly basis."
              },
              {
                q: "How does changing payment frequency from monthly to bi-weekly reduce interest?",
                a: "Switching to bi-weekly payments means making 26 half-payments per year, which equals 13 full monthly payments annually. This extra payment goes directly toward principal reduction, shortening the overall loan duration and lowering cumulative interest charges."
              },
              {
                q: "What is the difference between nominal interest rate and APR?",
                a: "The nominal interest rate is the base percentage charged on borrowed funds. The Annual Percentage Rate (APR) reflects the true annual cost of credit, incorporating the nominal interest rate alongside mandatory upfront lender fees (e.g., origination fees, processing charges)."
              },
              {
                q: "How does a shorter loan term affect monthly payments and total interest?",
                a: "Shorter loan terms (e.g., 5 years vs. 10 years) require higher periodic payments because principal is repaid faster. However, shorter terms dramatically reduce total interest expenses because interest accrues over fewer billing cycles."
              },
              {
                q: "What happens if I make a lump-sum principal prepayment?",
                a: "Making a lump-sum principal prepayment reduces your remaining balance immediately. On standard simple-interest loans, this lowers future interest charges and shortens the remaining loan term without changing the required periodic payment amount unless the loan is formally re-amortized (re-casted)."
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">{faq.q}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ============================================================================
 * 4.5. RETIREMENT & FIRE CALCULATOR MODULE
 * ========================================================================== */
export const US_RETIREMENT_STATE_TAX_LIST = [
  { state: 'Alabama', treatment: 'Exempts defined benefit pensions', rate: '5.00%', protections: 'Traditional 401(k)/IRA withdrawals taxed' },
  { state: 'Alaska', treatment: 'No State Income Tax', rate: '0.00%', protections: 'Zero state tax on all retirement withdrawals' },
  { state: 'Arizona', treatment: 'Taxed as ordinary income', rate: '2.50%', protections: 'Low flat tax rate on distributions' },
  { state: 'Arkansas', treatment: 'Up to $6,000 retirement exemption', rate: '4.40%', protections: 'Partial exemption for qualified distributions' },
  { state: 'California', treatment: 'Taxed as ordinary income', rate: '13.30% (Up to 14.4%)', protections: 'Full state tax rates on pre-tax distributions' },
  { state: 'Colorado', treatment: 'Exemption up to $24,000 for 65+', rate: '4.40%', protections: 'Flat tax rate with age-based deductions' },
  { state: 'Connecticut', treatment: 'Phase-out exemptions for low/mid income', rate: '6.99%', protections: 'Partial exemptions on pension/401(k) income' },
  { state: 'Delaware', treatment: 'Up to $12,000 exclusion for 60+', rate: '6.60%', protections: 'Graduated state income tax schedule' },
  { state: 'Florida', treatment: 'No State Income Tax', rate: '0.00%', protections: 'Zero state tax on all retirement withdrawals' },
  { state: 'Georgia', treatment: 'Up to $65,000 retirement exclusion for 65+', rate: '5.39%', protections: 'Generous exclusions for senior distributions' },
  { state: 'Hawaii', treatment: 'Exempts public and private pensions', rate: '11.00%', protections: '401(k)/IRA distributions remain taxable' },
  { state: 'Idaho', treatment: 'Taxed as ordinary income', rate: '5.69%', protections: 'Flat state income tax rate' },
  { state: 'Illinois', treatment: 'Exempts Most Retirement Income', rate: '4.95%', protections: 'Excludes 401(k), IRA, and pension income' },
  { state: 'Indiana', treatment: 'Taxed as ordinary income', rate: '3.05%', protections: 'Low flat tax rate on retirement income' },
  { state: 'Iowa', treatment: 'Exempts Retirement Income for 55+', rate: '3.80%', protections: 'Complete exemption on retirement income for 55+' },
  { state: 'Kansas', treatment: 'Exempts in-state public pensions', rate: '5.70%', protections: 'Out-of-state and private 401(k)/IRA taxed' },
  { state: 'Kentucky', treatment: 'Excludes up to $31,110 retirement income', rate: '4.00%', protections: 'High exclusion threshold for retirees' },
  { state: 'Louisiana', treatment: 'Excludes up to $6,000 for 65+', rate: '4.25%', protections: 'Low state income tax environment' },
  { state: 'Maine', treatment: 'Up to $35,000 pension/IRA deduction', rate: '7.15%', protections: 'Moderate state deductions available' },
  { state: 'Maryland', treatment: 'Pension exclusion up to statutory cap', rate: '5.75% (+ Local county tax)', protections: 'Combined state and county tax burden' },
  { state: 'Massachusetts', treatment: 'Taxed as ordinary income', rate: '5.00%', protections: 'Flat state tax on IRA/401(k) distributions' },
  { state: 'Michigan', treatment: 'Tiered age-based retirement deductions', rate: '4.25%', protections: 'Deductions vary by birth year tiers' },
  { state: 'Minnesota', treatment: 'Taxed as ordinary income', rate: '9.85%', protections: 'Partial subtraction for social security' },
  { state: 'Mississippi', treatment: 'Exempts Most Retirement Income', rate: '4.00%', protections: 'Complete state tax exemption on distributions' },
  { state: 'Missouri', treatment: 'Complete deduction for qualifying incomes', rate: '4.80%', protections: 'Income caps apply for full exclusions' },
  { state: 'Montana', treatment: 'Partial exclusion up to statutory limit', rate: '5.90%', protections: 'Two-bracket income tax system' },
  { state: 'Nebraska', treatment: 'Phasing out tax on social security', rate: '5.84%', protections: 'Traditional 401(k)/IRA income taxed' },
  { state: 'Nevada', treatment: 'No State Income Tax', rate: '0.00%', protections: 'Zero state tax on all retirement withdrawals' },
  { state: 'New Hampshire', treatment: 'No Earned/Retirement Income Tax', rate: '0.00%', protections: 'Tax applies only to dividend/interest income' },
  { state: 'New Jersey', treatment: 'Exclusions up to $100,000 for low/mid income', rate: '10.75%', protections: 'High exclusions for qualifying income tiers' },
  { state: 'New Mexico', treatment: 'Exemption up to statutory limits for 65+', rate: '5.90%', protections: 'Graduated state income tax schedule' },
  { state: 'New York', treatment: 'Excludes up to $20,000 for 59.5+', rate: '10.90% (+ NYC local tax)', protections: 'State and local taxes apply above limit' },
  { state: 'North Carolina', treatment: 'Taxed as ordinary income', rate: '4.50%', protections: 'Low flat state income tax rate' },
  { state: 'North Dakota', treatment: 'Taxed as ordinary income', rate: '2.50%', protections: 'Very low progressive tax brackets' },
  { state: 'Ohio', treatment: 'Retirement income tax credits available', rate: '3.50%', protections: 'Credits offset low state tax liabilities' },
  { state: 'Oklahoma', treatment: 'Up to $10,000 retirement exclusion', rate: '4.75%', protections: 'Moderate deduction for retirement income' },
  { state: 'Oregon', treatment: 'Taxed as ordinary income', rate: '9.90%', protections: 'High progressive top state rate' },
  { state: 'Pennsylvania', treatment: 'Exempts Most Retirement Income', rate: '3.07%', protections: 'Complete exemption on qualified retirement distributions' },
  { state: 'Rhode Island', treatment: 'Partial exclusions for 65+', rate: '5.99%', protections: 'Exclusions subject to income eligibility limits' },
  { state: 'South Carolina', treatment: 'Up to $10,000 retirement deduction', rate: '6.40%', protections: 'Age-based deductions for senior income' },
  { state: 'South Dakota', treatment: 'No State Income Tax', rate: '0.00%', protections: 'Zero state tax on all retirement withdrawals' },
  { state: 'Tennessee', treatment: 'No State Income Tax', rate: '0.00%', protections: 'Zero state tax on all retirement withdrawals' },
  { state: 'Texas', treatment: 'No State Income Tax', rate: '0.00%', protections: 'Zero state tax on all retirement withdrawals' },
  { state: 'Utah', treatment: 'Retirement tax credit available', rate: '4.55%', protections: 'Tax credit offsets flat state rate' },
  { state: 'Vermont', treatment: 'Taxed as ordinary income', rate: '8.75%', protections: 'Progressive state income tax brackets' },
  { state: 'Virginia', treatment: 'Up to $12,000 deduction for 65+', rate: '5.75%', protections: 'Age-based Virginia state deductions' },
  { state: 'Washington', treatment: 'No State Income Tax', rate: '0.00%', protections: 'Zero state tax on retirement income' },
  { state: 'West Virginia', treatment: 'Phasing out tax on social security', rate: '5.12%', protections: 'Graduated state income tax schedule' },
  { state: 'Wisconsin', treatment: 'Up to $5,000 exclusion for 65+', rate: '7.65%', protections: 'Exclusions apply under income limits' },
  { state: 'Wyoming', treatment: 'No State Income Tax', rate: '0.00%', protections: 'Zero state tax on all retirement withdrawals' }
];

export function RetirementModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({ 
    age: 30, 
    savings: 50000, 
    monthlyContribution401k: 0,
    monthlyContributionIra: 0,
    monthlyContributionHsa: 0, 
    expenses: 40253, 
    return: 7, 
    inflation: 2.5,
    returnMode: 'real' as 'real' | 'nominal',
    swr: 4,
    horizonYears: 30,
    adjustForTaxes: false,
    useBracketTaxes: false,
    retirementTaxRate: 15,
    filingStatus: 'single' as 'single' | 'mfj' | 'mfs' | 'hoh',
    stateCode: 'CA',
    capitalGainsTaxDrag: 0.5
  });

  const res = useMemo(() => calculateRetirement({ 
    currentAge: params.age, 
    currentSavings: params.savings, 
    monthlyContribution401k: params.monthlyContribution401k,
    monthlyContributionIra: params.monthlyContributionIra,
    monthlyContributionHsa: params.monthlyContributionHsa,
    annualExpenses: params.expenses, 
    annualReturn: params.return, 
    inflationRate: params.inflation,
    returnMode: params.returnMode,
    safeWithdrawalRate: params.swr,
    horizonYears: params.horizonYears,
    adjustForTaxes: params.adjustForTaxes,
    useBracketTaxes: params.useBracketTaxes,
    retirementTaxRatePercent: params.retirementTaxRate,
    filingStatus: params.filingStatus,
    stateCode: params.stateCode,
    capitalGainsTaxDrag: params.capitalGainsTaxDrag
  }), [params]);

  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <Zap size={20} className="text-amber-500" aria-hidden="true" /> FIRE Strategy (Trinity 4% Rule)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Current Age" value={params.age} onChange={(v: number) => setParams({...params, age: v})} />
              <InputGroup label="Planning Horizon" value={params.horizonYears} suffix=" yrs" onChange={(v: number) => setParams({...params, horizonYears: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Safe Withdrawal Rate" value={params.swr} suffix="%" step="0.25" onChange={(v: number) => setParams({...params, swr: v})} />
              <InputGroup label="Inflation Assumption" value={params.inflation} suffix="%" step="0.5" onChange={(v: number) => setParams({...params, inflation: v})} />
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">Return Presentation Mode</span>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button 
                  type="button" 
                  onClick={() => setParams({...params, returnMode: 'real'})}
                  className={cn("min-h-[40px] px-2 rounded-xl text-xs font-bold uppercase transition-all", params.returnMode === 'real' ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm" : "text-slate-700 dark:text-slate-300")}
                >
                  Real (Today's $)
                </button>
                <button 
                  type="button" 
                  onClick={() => setParams({...params, returnMode: 'nominal'})}
                  className={cn("min-h-[40px] px-2 rounded-xl text-xs font-bold uppercase transition-all", params.returnMode === 'nominal' ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm" : "text-slate-700 dark:text-slate-300")}
                >
                  Nominal (Future $)
                </button>
              </div>
            </div>

            <InputGroup label="Current Savings" value={params.savings} prefix={currency.symbol} onChange={(v: number) => setParams({...params, savings: v})} />
            <InputGroup label="Monthly 401(k) Contribution" value={params.monthlyContribution401k} prefix={currency.symbol} onChange={(v: number) => setParams({...params, monthlyContribution401k: v})} />
            <InputGroup label="Monthly IRA Contribution" value={params.monthlyContributionIra} prefix={currency.symbol} onChange={(v: number) => setParams({...params, monthlyContributionIra: v})} />
            <InputGroup label="Monthly HSA Contribution" value={params.monthlyContributionHsa} prefix={currency.symbol} onChange={(v: number) => setParams({...params, monthlyContributionHsa: v})} />

            {res.contributionWarning && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                {res.contributionWarning}
                <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-800">
                  <InputGroup label="Taxable Capital Gains Drag %" value={params.capitalGainsTaxDrag} suffix="%" step="0.1" onChange={(v: number) => setParams({...params, capitalGainsTaxDrag: v})} />
                </div>
              </div>
            )}

            <InputGroup label="Annual Living Expenses" value={params.expenses} prefix={currency.symbol} onChange={(v: number) => setParams({...params, expenses: v})} />
            <InputGroup label="Expected Investment Return (ROI)" value={params.return} suffix="%" step="0.5" onChange={(v: number) => setParams({...params, return: v})} />

            {/* Tax-Adjusted FIRE Target Toggle & Setting */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">Tax-Adjusted FIRE Target</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Account for taxes on retirement withdrawals</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={params.adjustForTaxes}
                  onClick={() => setParams(p => ({ ...p, adjustForTaxes: !p.adjustForTaxes }))}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                    params.adjustForTaxes ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      params.adjustForTaxes ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {params.adjustForTaxes && (
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Use Federal Tax Engine Brackets</span>
                    <input 
                      type="checkbox" 
                      checked={params.useBracketTaxes} 
                      onChange={e => setParams({...params, useBracketTaxes: e.target.checked})}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                  </div>

                  {params.useBracketTaxes ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Filing Status</label>
                        <select 
                          value={params.filingStatus} 
                          onChange={e => setParams({...params, filingStatus: e.target.value as any})}
                          className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="single">Single</option>
                          <option value="mfj">Married Joint</option>
                          <option value="mfs">Married Sep</option>
                          <option value="hoh">Head of Household</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">State</label>
                        <select 
                          value={params.stateCode} 
                          onChange={e => setParams({...params, stateCode: e.target.value})}
                          className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                        >
                          {['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'WA', 'AZ', 'MA', 'TN', 'IN', 'CO', 'MN'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <InputGroup 
                      label="Expected Retirement Tax Bracket" 
                      value={params.retirementTaxRate} 
                      suffix="%" 
                      step="1" 
                      onChange={(v: number) => setParams(p => ({ ...p, retirementTaxRate: v }))} 
                    />
                  )}

                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    Gross annual withdrawal increases to <strong>{format(res.grossAnnualExpenses)}</strong> to provide <strong>{format(params.expenses)}</strong> net spend (Effective tax rate: {res.taxRatePercent.toFixed(1)}%).
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              label={params.adjustForTaxes ? "Gross FIRE Target (Tax-Adjusted)" : "FIRE Target (4% Rule)"} 
              value={format(res.targetNetWorth)} 
              subtext={params.adjustForTaxes ? `Standard net target: ${format(res.standardTargetNetWorth)}` : `25× annual expenses (${format(params.expenses)})`} 
              icon={Landmark} 
              color="bg-amber-600" 
            />
            <MetricCard 
              label="Years to FIRE" 
              value={`${res.yearsToFIRE.toFixed(1)} Years`} 
              subtext={`Retire at age ${Math.round(res.fireAge)}`} 
              icon={Compass} 
              color="bg-blue-600" 
            />
            <MetricCard 
              label="Monthly Spend" 
              value={format(params.expenses / 12)} 
              subtext="Required living budget" 
              icon={Wallet} 
              color="bg-slate-800 dark:bg-slate-700" 
            />
          </div>

          <GlassCard className="p-6 lg:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  FIRE Benchmark Formula ({params.swr}% SWR)
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Baseline standard derived from the Trinity Study (25× annual living expenses for a 30+ year retirement)
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-black">
                Target: {format(res.targetNetWorth)}
              </div>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 font-mono">
                <span>Standard 4% Rule Target:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {format(params.expenses)} ÷ {(params.swr / 100).toFixed(2)} = {format(res.standardTargetNetWorth)}
                </span>
              </div>
              {params.adjustForTaxes && (
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 font-mono">
                  <span>Gross Tax-Adjusted Target ({params.retirementTaxRate}% tax):</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {format(res.grossAnnualExpenses)} ÷ {(params.swr / 100).toFixed(2)} = {format(res.targetNetWorth)}
                  </span>
                </div>
              )}
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                At a {params.swr}% withdrawal rate, your portfolio can sustainably generate {format(params.expenses)} in annual living expenses with high historical survival rates across multi-decade market cycles.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 lg:p-8 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">The Path to Freedom</h4>
            <div className="h-80" aria-label="FIRE Net Worth Path Chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={res.timeline}>
                  <defs>
                    <linearGradient id="colorFIRE" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                  <XAxis dataKey="age" fontSize={12} stroke="#64748b" tickFormatter={a => `Age ${Math.round(a)}`} />
                  <YAxis hide />
                  <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="balance" stroke="#f59e0b" strokeWidth={3} fill="url(#colorFIRE)" name="Net Worth" />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" dot={false} strokeWidth={2} name="FIRE Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* COMPREHENSIVE EDUCATIONAL GUIDE & FINANCIAL BENCHMARKS */}
      <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-5 sm:space-y-6 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Retirement &amp; FIRE Calculator: How to Estimate Financial Independence, FIRE Target Nest Egg, and Years to Retire
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            <strong>Bottom Line Up Front (BLUF):</strong> Achieving Financial Independence, Retire Early (FIRE) hinges on determining your baseline FIRE nest egg target using the empirical 4% Safe Withdrawal Rate (SWR) rule established by the Trinity Study. Under this framework, your required financial independence corpus equals 25 times your expected annual living expenses. For a 30-year-old starting with $50,000 in current savings, investing $2,000 per month at a 7.00% expected annual investment return (ROI), and maintaining an annual living budget of $40,253 ($3,354 monthly spend), your target FIRE corpus is $1,006,325. At this rate of portfolio accumulation, you will achieve financial independence in 17.8 years, allowing you to retire at age 48.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Understanding Financial Independence and the FIRE Movement</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Financial Independence, Retire Early (FIRE) is a financial strategy focused on maximizing savings rates, maintaining prudent living expenses, and systematically investing in yield-generating assets to reach a portfolio size capable of sustaining lifetime living expenses without mandatory employment.
            </p>
            <div className="space-y-1 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <div className="font-bold text-amber-600 dark:text-amber-400">Total Financial Independence Ecosystem</div>
              <div>├── Current Portfolio Capital: Initial baseline savings deployed in growth assets</div>
              <div>├── Monthly Net Capital Inflow: Regular ongoing investments into low-cost market index funds</div>
              <div>├── Cumulative Portfolio Compound Yield: Real annualized investment returns (ROI)</div>
              <div>└── Target FIRE Portfolio Corpus: 25x Annual Living Expenses (SWR Capital Target)</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Key Financial Independence Metrics Defined</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>Current Age:</strong> Your starting age at the beginning of the accumulation phase (e.g., 30 years old).</li>
              <li><strong>Safe Withdrawal Rate (SWR):</strong> The percentage of your total invested portfolio withdrawn annually in retirement to cover living expenses without exhausting capital over a 30-to-40-year horizon. The global empirical standard is 4.00%.</li>
              <li><strong>Current Savings ($50,000):</strong> Liquid investment capital currently invested across tax-advantaged retirement accounts, individual brokerage accounts, or real estate assets.</li>
              <li><strong>Monthly Invested ($2,000):</strong> Regular recurring capital contributed monthly to grow your investment portfolio.</li>
              <li><strong>Annual Living Expenses ($40,253):</strong> Total annual out-of-pocket costs required to maintain your living standard ($3,354 monthly budget).</li>
              <li><strong>Expected Investment Return (ROI) (7.00%):</strong> The projected net real annual rate of return on invested assets after accounting for baseline fee drags and inflation.</li>
              <li><strong>FIRE Target ($1,006,325):</strong> The total accumulated investment corpus needed to safely generate $40,253 per year at a 4.00% safe withdrawal rate.</li>
              <li><strong>Years to FIRE (17.8 Years):</strong> The total accumulation time required for your portfolio to compound from $50,000 to $1,006,325 with $2,000 monthly contributions at a 7.00% annual return.</li>
            </ul>
          </GlassCard>
        </div>

        {/* The Trinity Study and the Mathematics of the 4% Rule */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">The Trinity Study and the Mathematics of the 4% Rule</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The foundational pillar of modern FIRE modeling is the 4% Rule, derived from the landmark 1998 Trinity Study (authored by Professors Cooley, Hubbard, and Walz at Trinity University). The study evaluated historical market performance across rolling 30-year retirement windows using diversified portfolios of equities and bonds.
            </p>
          </div>

          <div className="p-5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl space-y-3 border border-amber-200 dark:border-amber-800">
            <div className="font-bold text-amber-900 dark:text-amber-200 text-base">The 4% Rule Formula Mechanics</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The target nest egg required for financial independence is the inverse of the Safe Withdrawal Rate:
            </p>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl text-center space-y-1 shadow-sm border border-amber-200 dark:border-amber-800">
              <div className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">Standard SWR Capital Formula</div>
              <div className="font-mono font-bold text-sm sm:text-base text-amber-600 dark:text-amber-400">
                FIRE Target Corpus (S) = Annual Living Expenses / SWR = Annual Living Expenses × 25
              </div>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
              <div>For a target annual expenditure of $40,253:</div>
              <div className="font-bold text-amber-700 dark:text-amber-300">
                FIRE Target Corpus = $40,253 ÷ 0.04 = $40,253 × 25 = $1,006,325
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Variations of FIRE Strategies */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Variations of FIRE Strategies</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The FIRE movement incorporates several distinct lifestyle strategies tailored to different spending goals and risk tolerances:
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
            <table className="w-full text-left text-xs sm:text-sm" aria-label="Variations of FIRE Strategies Table">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">
                <tr>
                  <th scope="col" className="px-4 py-3">FIRE Strategy Variation</th>
                  <th scope="col" className="px-4 py-3">Target Annual Expense Level</th>
                  <th scope="col" className="px-4 py-3">Required Portfolio Multiple</th>
                  <th scope="col" className="px-4 py-3">Typical Nest Egg Range</th>
                  <th scope="col" className="px-4 py-3">Primary Lifestyle Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">LeanFIRE</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Below $30,000 / year</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">25x Annual Expenses</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">$500,000 – $750,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Minimalist spending, hyper-frugal lifestyle</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors bg-amber-50/40 dark:bg-amber-950/20">
                  <td className="px-4 py-3 font-bold text-amber-800 dark:text-amber-300">Standard FIRE</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">$40,000 – $80,000 / year</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">25x Annual Expenses</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">$1,000,000 – $2,000,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Standard moderate lifestyle replacement</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">ChubbyFIRE</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">$80,000 – $150,000 / year</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">25x to 28x Expenses</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">$2,000,000 – $4,200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Upper-middle-class comfort with leisure buffer</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">FatFIRE</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Above $150,000 / year</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">28x to 30x Expenses</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">$4,200,000+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Luxury lifestyle without budget constraints</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">BaristaFIRE</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Partial Expense Coverage</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">12.5x to 15x Expenses</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">$400,000 – $700,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Part-time work covers baseline lifestyle costs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* How Savings Rate Accelerates Time to Retirement */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">How Savings Rate Accelerates Time to Retirement</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Your savings rate—the percentage of gross income saved and invested rather than spent—is the single most important variable determining your timeline to financial independence. Higher savings rates simultaneously increase the capital invested each month and reduce the annual living expense target your portfolio must support.
            </p>
          </div>

          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="font-bold text-base text-slate-900 dark:text-white">Impact of Savings Rate on Accumulation Horizon</div>
            <div className="space-y-1 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-xs sm:text-sm">
              <div>├── 10% Savings Rate ──► Requires ~51.4 Years of Full-Time Work</div>
              <div>├── 25% Savings Rate ──► Requires ~32.0 Years of Full-Time Work</div>
              <div>├── 50% Savings Rate ──► Requires ~16.6 Years of Full-Time Work</div>
              <div>└── 70% Savings Rate ──► Requires ~8.5 Years of Full-Time Work</div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h5 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Savings Rate vs. Years to Financial Independence (Assuming 7.00% Real Return &amp; 4% SWR)
            </h5>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm" aria-label="Savings Rate vs Years to Financial Independence Table">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">
                  <tr>
                    <th scope="col" className="px-4 py-3">Savings Rate (% of Net Income)</th>
                    <th scope="col" className="px-4 py-3">Estimated Years to Reach FIRE</th>
                    <th scope="col" className="px-4 py-3">Typical Working Career Horizon</th>
                    <th scope="col" className="px-4 py-3">Net Working Horizon Reduction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">10%</td>
                    <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-bold">51.4 Years</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Standard Traditional Career</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-sans">Baseline</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">20%</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">36.7 Years</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Early Traditional Retirement</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">14.7 Years Earlier</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">30%</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">28.0 Years</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Moderate Early Retirement</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">23.4 Years Earlier</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">40%</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">21.6 Years</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Accelerated FIRE Target</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">29.8 Years Earlier</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors bg-amber-50/40 dark:bg-amber-950/20">
                    <td className="px-4 py-3 font-bold text-amber-700 dark:text-amber-300">50%</td>
                    <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-bold">16.6 Years</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Standard Aggressive FIRE</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">34.8 Years Earlier</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">60%</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">12.4 Years</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Ultra-Aggressive FIRE</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">39.0 Years Earlier</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">70%</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">8.5 Years</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">Extreme Hyper-Saver FIRE</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">42.9 Years Earlier</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>

        {/* The Compound Accumulation Growth Formula */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">The Compound Accumulation Growth Formula</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Portfolio accumulation during the pre-retirement growth phase combines compound interest on initial savings with the future value of monthly contributions:
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-700">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl text-center space-y-1 shadow-sm border border-slate-200 dark:border-slate-700/60">
              <div className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">Future Value of Investment Growth</div>
              <div className="font-mono font-bold text-sm sm:text-base text-amber-600 dark:text-amber-400">
                V(t) = P • (1 + r)ᵗ + PMT • [ ((1 + r)ᵗ - 1) / r ]
              </div>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 font-mono">
              <div>V(t) = Total Accumulated Portfolio Balance at Year t</div>
              <div>P = Starting Current Savings ($50,000)</div>
              <div>PMT = Annual Investment Addition ($2,000 × 12 = $24,000)</div>
              <div>r = Annual Real Investment Return (7.00% or 0.07)</div>
              <div>t = Duration in Years (17.8 Years)</div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="font-bold text-base text-slate-900 dark:text-white">Portfolio Balance Trajectory over 17.8 Years ($50,000 Start + $2,000/mo at 7% ROI)</div>
            <div className="space-y-1 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-xs sm:text-sm">
              <div>├── Year 1 (Age 31):   $77,900  (Contributions: $24,000 | Interest: $3,900)</div>
              <div>├── Year 5 (Age 35):   $212,410 (Contributions: $120,000 | Interest: $42,410)</div>
              <div>├── Year 10 (Age 40):  $448,510 (Contributions: $240,000 | Interest: $158,510)</div>
              <div>├── Year 15 (Age 45):  $779,840 (Contributions: $360,000 | Interest: $369,840)</div>
              <div>└── Year 17.8 (Age 48):$1,006,325 (Contributions: $427,200 | Interest: $529,125)</div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic pt-1">
              At the target age of 48, cumulative investment returns ($529,125) exceed total out-of-pocket capital contributions ($427,200), demonstrating the power of long-term financial compounding.
            </p>
          </div>
        </GlassCard>

        {/* Tax-Advantaged Retirement Accounts and Pre-Tax Adjustments */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Tax-Advantaged Retirement Accounts and Pre-Tax Adjustments</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Achieving financial independence efficiently requires leveraging tax-advantaged accounts in the United States. Balancing pre-tax retirement vehicles with taxable brokerage accounts ensures both tax optimization and liquidity prior to traditional retirement age (59.5).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 dark:text-slate-300">
            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-700">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">Core U.S. Account Types for FIRE Planning</h5>
              <ul className="space-y-2 leading-relaxed">
                <li><strong>401(k) / 403(b) Employer Plans:</strong> Allow high pre-tax contributions ($23,500 annual limit for 2026). Growth accumulates tax-deferred, reducing taxable income during your peak earning years.</li>
                <li><strong>Individual Retirement Accounts (Traditional &amp; Roth IRA):</strong> Annual contribution limits ($7,000 limit for 2026). Roth IRAs allow tax-free withdrawals in retirement, while Traditional IRAs offer upfront tax deductions.</li>
                <li><strong>Health Savings Accounts (HSA):</strong> Offers triple tax advantages—pre-tax contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses.</li>
                <li><strong>Taxable Brokerage Accounts:</strong> Crucial for early retirees before age 59.5. Offers no contribution limits and qualifies for long-term capital gains tax rates (0%, 15%, or 20%) rather than ordinary income tax rates.</li>
              </ul>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-700">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">Early Access Strategies Before Age 59.5</h5>
              <p className="leading-relaxed">
                Early retirees can access pre-tax retirement funds before age 59.5 without paying early withdrawal penalties by using established IRS tax frameworks:
              </p>
              <ul className="space-y-3 leading-relaxed">
                <li><strong>Roth IRA Conversion Ladder:</strong> Convert pre-tax 401(k) funds to a Roth IRA annually. After a mandatory 5-year holding period, converted principal balances can be withdrawn tax- and penalty-free.</li>
                <li><strong>Rule 72(t) / SEPP (Substantially Equal Periodic Payments):</strong> Allows early penalty-free distributions from traditional IRAs based on IRS life expectancy tables, provided payments continue for at least 5 years or until age 59.5 (whichever is longer).</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Complete 50-State Income Tax Overview for Retirement Withdrawals */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Complete 50-State Income Tax Overview for Retirement Withdrawals
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Retirement portfolio withdrawals are subject to state income taxes in states that tax personal income or investment distributions. Use the complete reference table below to analyze state tax environments for retirement planning.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              All 50 U.S. States Retirement Tax Environment Overview
            </h5>
            <div className="overflow-x-auto max-h-[440px] border border-slate-200 dark:border-slate-700 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm" aria-label="All 50 U.S. States Retirement Tax Environment Overview">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-4 py-3">State</th>
                    <th scope="col" className="px-4 py-3">State Income Tax Treatment on Retirement</th>
                    <th scope="col" className="px-4 py-3">Top Marginal State Rate</th>
                    <th scope="col" className="px-4 py-3">Primary Retirement Tax Protections</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {US_RETIREMENT_STATE_TAX_LIST.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-900 dark:text-white">{row.state}</td>
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-300 font-sans">{row.treatment}</td>
                      <td className="px-4 py-2 text-amber-600 dark:text-amber-400 font-bold">{row.rate}</td>
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-400 font-sans">{row.protections}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>

        {/* Step-by-Step Mathematical Calculation Walkthrough */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Step-by-Step Mathematical Calculation Walkthrough
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Using the input parameters from the calculator setup, here is the complete mathematical step-by-step breakdown:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-mono">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 dark:text-white text-sm mb-2">Inputs:</div>
              <div>• Current Age:                         30 Years</div>
              <div>• Safe Withdrawal Rate (SWR):          4.00% (0.04)</div>
              <div>• Current Savings (P):                 $50,000.00</div>
              <div>• Monthly Investment (PMT_m):          $2,000.00 ($24,000.00 per year)</div>
              <div>• Expected Annual Return (r):          7.00% (0.07 real return)</div>
              <div>• Target Annual Living Expenses (E):   $40,253.00</div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">Step 1: Calculate Target FIRE Corpus</div>
                <div>Corpus Target = E / SWR</div>
                <div>Corpus Target = $40,253 / 0.04 = $1,006,325.00</div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl space-y-2 border border-amber-200 dark:border-amber-800">
              <div className="space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-200 text-sm">Step 2: Solve for Accumulation Timeline (t)</div>
                <div>Set Portfolio Growth Formula equal to $1,006,325:</div>
                <div className="text-xs sm:text-sm">$1,006,325 = $50,000 × (1.07)^t + $24,000 × [((1.07)^t - 1) / 0.07]</div>
                <div className="font-bold text-amber-700 dark:text-amber-300 pt-1">Solving for t yields: t ≈ 17.80 Years</div>
              </div>
              <div className="pt-2 border-t border-amber-200 dark:border-amber-800 space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-200 text-sm">Step 3: Calculate Retirement Age</div>
                <div>Retirement Age = Current Age + t</div>
                <div className="font-bold text-amber-700 dark:text-amber-300">Retirement Age = 30 + 17.8 = 47.8 Years Old (Rounded to Age 48)</div>
              </div>
              <div className="pt-2 border-t border-amber-200 dark:border-amber-800 font-bold text-emerald-700 dark:text-emerald-400">
                <div>Financial Summary:</div>
                <div>• Required Living Budget:              $3,354.42 / month ($40,253 / yr)</div>
                <div>• FIRE Nest Egg Target:                $1,006,325.00</div>
                <div>• Time to Reach Target:                17.8 Years</div>
                <div>• Target Early Retirement Age:         48 Years Old</div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 5 Practical Strategies to Accelerate Your FIRE Timeline */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            5 Practical Strategies to Accelerate Your FIRE Timeline
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">1. Increase Your Savings Rate</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Because savings rate drives timeline exponentially, increasing your savings rate from 30% to 50% can shorten your working career by more than 11 years.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">2. Optimize Investment Asset Allocation</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Maintain a low-cost, broadly diversified portfolio dominated by low-expense equity index funds (e.g., total stock market index funds) during the accumulation phase to capture market growth.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">3. Minimize Investment Management Fees</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Keeping expense ratios below 0.05% saves tens of thousands of dollars in compounding drag over a 15-to-20-year accumulation horizon.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">4. Utilize Health Savings Accounts (HSAs)</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Maximize HSA contributions to secure triple-tax savings for long-term health and medical costs in early retirement.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 md:col-span-2">
              <h5 className="font-bold text-slate-900 dark:text-white text-base">5. Incorporate Geographic Arbitrage</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Moving to a lower-cost region or state with no income tax in retirement reduces your annual expense baseline (E), instantly lowering your target FIRE nest egg requirement.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* FAQs */}
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h4>
          <div className="space-y-4">
            {[
              {
                q: "What is Sequence of Returns Risk (SRR)?",
                a: "Sequence of Returns Risk is the risk that market downturns occur in the early years of retirement while you are making withdrawals. Experiencing negative returns early in retirement depletes portfolio principal faster, increasing the risk of running out of money. FIRE practitioners mitigate this risk by maintaining a 1-to-3-year cash and short-term bond cushion to avoid selling equities during market declines."
              },
              {
                q: "What is the difference between nominal returns and real returns in FIRE calculations?",
                a: "Nominal returns reflect absolute investment growth before inflation. Real returns account for inflation (e.g., subtracting 2% to 3% annual inflation from a 10% nominal return to arrive at a 7% real return). FIRE calculations use real returns to project future purchasing power in today's dollar terms."
              },
              {
                q: "Can I withdraw money from my Roth IRA before age 59.5 without penalty?",
                a: "Yes. Contributions made to a Roth IRA can be withdrawn at any time, at any age, tax- and penalty-free. However, earnings on contributions are subject to taxes and penalties if withdrawn prior to age 59.5 without meeting specific IRS exceptions."
              },
              {
                q: "What is Flex-FIRE or Dynamic Withdrawal Strategy?",
                a: "A Dynamic Withdrawal Strategy involves adjusting annual retirement spending based on market performance rather than withdrawing a fixed 4% every year. Reducing spending by 10% to 20% during market downturns drastically reduces portfolio failure risk and allows for lower initial target nest eggs."
              },
              {
                q: "How does healthcare coverage work for early retirees in the U.S. before Medicare age (65)?",
                a: "Early retirees before age 65 obtain health insurance through state or federal ACA Health Insurance Exchanges (Obamacare), COBRA coverage, private health plans, or Health Savings Accounts (HSAs). Controlling taxable income in early retirement can also help retirees qualify for Premium Tax Credits (subsidies) under the ACA."
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <h5 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{faq.q}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ============================================================================
 * 5. AMORTIZATION CALCULATOR MODULE
 * ========================================================================== */
export function AmortizationModule({ currency }: { currency: any }) {
  const [params, setParams] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    const defaultDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return {
      loanAmount: 320000,
      rate: 6.75,
      termYears: 30,
      startDate: defaultDate,
      extraMonthly: 100
    };
  });

  const [scheduleView, setScheduleView] = useState<'yearly' | 'monthly'>('yearly');

  const res = useMemo(() => calculateMortgage({
    loanProgram: 'conventional',
    homePrice: params.loanAmount,
    downPayment: 0,
    annualRate: params.rate,
    termYears: params.termYears,
    startDate: params.startDate,
    pmiAnnual: 0,
    extraMonthly: params.extraMonthly
  }), [params]);

  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <Calculator size={20} className="text-blue-600 dark:text-blue-400" aria-hidden="true" /> Amortization Engine
          </h3>
          <InputGroup label="Original Loan Principal" value={params.loanAmount} prefix={currency.symbol} onChange={(v: number) => setParams({...params, loanAmount: v})} />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Interest Rate" value={params.rate} suffix="%" step="0.05" onChange={(v: number) => setParams({...params, rate: v})} />
            <InputGroup label="Loan Term" value={params.termYears} suffix="yrs" onChange={(v: number) => setParams({...params, termYears: v})} />
          </div>
          <StartDatePicker 
            value={params.startDate} 
            onChange={(v: string) => setParams({...params, startDate: v})} 
            termYears={params.termYears}
            payoffDate={res.payoffDate}
            firstPaymentDate={res.firstPaymentDate}
          />
          <InputGroup label="Extra Monthly Principal" value={params.extraMonthly} prefix={currency.symbol} onChange={(v: number) => setParams({...params, extraMonthly: v})} />
        </GlassCard>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Monthly P&I" value={format(res.monthlyPI)} subtext="Standard monthly installment" icon={Wallet} color="bg-blue-600" />
          <MetricCard label="Total Interest" value={format(res.totalInterest)} subtext="Total interest paid" icon={Landmark} color="bg-rose-600" />
          <MetricCard 
            label="Payoff Date" 
            value={res.payoffDate} 
            subtext={params.extraMonthly > 0 ? `${res.yearsSaved} yrs early! (${res.payoffMonth} payments)` : `Full term: ${res.payoffDate}`} 
            icon={Zap} 
            color="bg-emerald-600" 
          />
        </div>

        <GlassCard className="p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Principal vs Interest Trend</h4>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              {res.firstPaymentDate} – {res.payoffDate}
            </span>
          </div>
          <div className="h-72" aria-label="Amortization Trend Chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={res.yearlySchedule}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="dateLabel" tickFormatter={y => `${y}`} fontSize={11} stroke="#64748b" />
                <YAxis hide />
                <ReTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                  labelFormatter={(val) => `Date Period: ${val}`}
                />
                <Area type="monotone" dataKey="principal" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} name="Principal Paid" />
                <Area type="monotone" dataKey="interest" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.25} name="Interest Paid" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm transition-colors">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                Amortization Schedule ({res.firstPaymentDate} – {res.payoffDate})
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {scheduleView === 'yearly' ? `${res.yearlySchedule.length} Calendar Years` : `${res.schedule.length} Monthly Payments`}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-700 p-1 rounded-xl border border-slate-200 dark:border-slate-600">
              <button
                type="button"
                onClick={() => setScheduleView('yearly')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500",
                  scheduleView === 'yearly' ? "bg-indigo-600 text-white" : "text-slate-700 dark:text-slate-300"
                )}
              >
                Annual
              </button>
              <button
                type="button"
                onClick={() => setScheduleView('monthly')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500",
                  scheduleView === 'monthly' ? "bg-indigo-600 text-white" : "text-slate-700 dark:text-slate-300"
                )}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="overflow-x-auto max-h-96">
            {scheduleView === 'yearly' ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-bold text-slate-700 dark:text-slate-300 sticky top-0">
                  <tr>
                    <th className="p-3.5">Calendar Year</th>
                    <th className="p-3.5">Date Period</th>
                    <th className="p-3.5">Principal Paid</th>
                    <th className="p-3.5">Interest Paid</th>
                    <th className="p-3.5">Cumul. Interest</th>
                    <th className="p-3.5">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-medium">
                  {res.yearlySchedule.map((row: any) => (
                    <tr key={row.year} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{row.year}</td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-xs">{row.dateRange}</td>
                      <td className="p-3.5 text-emerald-700 dark:text-emerald-400 font-bold">{format(row.principal)}</td>
                      <td className="p-3.5 text-rose-600 dark:text-rose-400 font-bold">{format(row.interest)}</td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">{format(row.totalInterest)}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{format(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-bold text-slate-700 dark:text-slate-300 sticky top-0">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Payment Date</th>
                    <th className="p-3">Principal</th>
                    <th className="p-3">Interest</th>
                    <th className="p-3">Extra</th>
                    <th className="p-3">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-mono">
                  {res.schedule.map((row: any) => (
                    <tr key={row.month} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">#{row.month}</td>
                      <td className="p-3 font-bold text-indigo-700 dark:text-indigo-300">{row.dateStr}</td>
                      <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">{format(row.principal)}</td>
                      <td className="p-3 text-rose-600 dark:text-rose-400 font-bold">{format(row.interest)}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{row.appliedExtra > 0 ? `+${format(row.appliedExtra)}` : '—'}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{format(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 6. INFLATION CALCULATOR MODULE
 * ========================================================================== */
export function InflationModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({
    amount: 10000,
    rate: 3.2,
    years: 15
  });

  const res = useMemo(() => calculateInflation(params.amount, params.rate, params.years), [params]);
  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <Compass size={20} className="text-orange-500" aria-hidden="true" /> Inflation Simulator
          </h3>
          <InputGroup label="Current Amount" value={params.amount} prefix={currency.symbol} onChange={(v: number) => setParams({...params, amount: v})} />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Annual Inflation" value={params.rate} suffix="%" step="0.1" onChange={(v: number) => setParams({...params, rate: v})} />
            <InputGroup label="Years Ahead" value={params.years} suffix="yrs" onChange={(v: number) => setParams({...params, years: v})} />
          </div>
        </GlassCard>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Future Equivalent Cost" value={format(res.futureValue)} subtext={`What takes ${format(params.amount)} today`} icon={TrendingUp} color="bg-orange-500" />
          <MetricCard label="Purchasing Power" value={format(res.purchasingPower)} subtext={`Value of today's ${format(params.amount)}`} icon={Zap} color="bg-rose-600" />
          <MetricCard label="Purchasing Power Loss" value={`-${((1 - res.purchasingPower / params.amount) * 100).toFixed(1)}%`} subtext="Loss in real wealth" icon={ShieldAlert} color="bg-slate-800 dark:bg-slate-700" />
        </div>

        <GlassCard className="p-6 lg:p-8 space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Purchasing Power Erosion</h4>
          <div className="h-72" aria-label="Purchasing Power Erosion Chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={res.timeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="year" tickFormatter={y => `Yr ${y}`} fontSize={11} stroke="#64748b" />
                <YAxis hide />
                <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="futureCost" stroke="#f97316" fill="#f97316" fillOpacity={0.2} name="Equivalent Future Cost" />
                <Area type="monotone" dataKey="purchasingPower" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Diminishing Real Value" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ============================================================================
 * 7. FINANCE TVM MODULE
 * ========================================================================== */
export function FinanceTVMModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({
    solveFor: 'fv' as 'pv' | 'fv' | 'pmt' | 'periods',
    pv: -10000,
    fv: 25000,
    pmt: -200,
    annualRate: 6.5,
    periods: 60
  });

  const res = useMemo(() => calculateFinanceTVM(params), [params]);
  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <CircleDollarSign size={20} className="text-slate-800 dark:text-slate-200" aria-hidden="true" /> TVM Time-Value Solver
          </h3>
          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">Solve For</span>
            <div className="grid grid-cols-2 gap-2">
              {(['fv', 'pv', 'pmt', 'periods'] as const).map(target => (
                <button
                  key={target}
                  type="button"
                  onClick={() => setParams({...params, solveFor: target})}
                  className={cn(
                    "min-h-[44px] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                    params.solveFor === target ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  {target.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {params.solveFor !== 'pv' && (
            <InputGroup label="Present Value (PV)" value={params.pv} prefix={currency.symbol} onChange={(v: number) => setParams({...params, pv: v})} />
          )}
          {params.solveFor !== 'pmt' && (
            <InputGroup label="Payment (PMT)" value={params.pmt} prefix={currency.symbol} onChange={(v: number) => setParams({...params, pmt: v})} />
          )}
          {params.solveFor !== 'fv' && (
            <InputGroup label="Future Value (FV)" value={params.fv} prefix={currency.symbol} onChange={(v: number) => setParams({...params, fv: v})} />
          )}
          {params.solveFor !== 'periods' && (
            <InputGroup label="Total Periods (N - Months)" value={params.periods} onChange={(v: number) => setParams({...params, periods: v})} />
          )}
          <InputGroup label="Annual Rate (I/Y)" value={params.annualRate} suffix="%" step="0.1" onChange={(v: number) => setParams({...params, annualRate: v})} />
        </GlassCard>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard 
            label={`Computed ${params.solveFor.toUpperCase()}`} 
            value={params.solveFor === 'periods' ? `${Math.round(res.solvedValue)} Periods` : format(res.solvedValue)} 
            subtext="Exact mathematical TVM resolution" 
            icon={Calculator} 
            color="bg-slate-900 dark:bg-slate-700" 
          />
          <MetricCard 
            label="Interest Rate" 
            value={`${params.annualRate}%`} 
            subtext={`${(params.annualRate / 12).toFixed(3)}% effective per monthly period`} 
            icon={TrendingUp} 
            color="bg-blue-600" 
          />
        </div>

        <GlassCard className="p-6 lg:p-8 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">TVM Cashflow Analysis</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Based on the standard Time Value of Money cashflow convention:
            outflows (investments/payments) are negative values while inflows (cash returned/future value) are positive.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">PV</span>
              <p className="text-base font-black text-slate-900 dark:text-white">{params.solveFor === 'pv' ? format(res.solvedValue) : format(params.pv)}</p>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">PMT</span>
              <p className="text-base font-black text-slate-900 dark:text-white">{params.solveFor === 'pmt' ? format(res.solvedValue) : format(params.pmt)}</p>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">FV</span>
              <p className="text-base font-black text-slate-900 dark:text-white">{params.solveFor === 'fv' ? format(res.solvedValue) : format(params.fv)}</p>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">N (Months)</span>
              <p className="text-base font-black text-slate-900 dark:text-white">{params.solveFor === 'periods' ? Math.round(res.solvedValue) : params.periods}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ============================================================================
 * 8. INCOME TAX CALCULATOR MODULE (US JURISDICTION ONLY)
 * ========================================================================== */
export function IncomeTaxModule({ currency }: { currency: any }) {
  const [year, setYear] = useState<number>(DEFAULT_TAX_YEAR);
  const [unsupportedYearError, setUnsupportedYearError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const urlYear = sp.get('year') || sp.get('taxYear');
      if (urlYear) {
        const parsed = parseInt(urlYear, 10);
        if (!isNaN(parsed) && parsed !== 2026) {
          setUnsupportedYearError(
            `Unsupported tax year requested: ${parsed}. WowCalc currently supports Tax Year 2026 only for US federal and state income tax calculations until additional years are independently verified. Years 2024, 2025, and 2027 are not supported.`
          );
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [stateCode, setStateCode] = useState<string>('CA');
  const [annualIncome, setAnnualIncome] = useState<number>(95000);
  const [age, setAge] = useState<number>(35);
  const [hsaCoverage, setHsaCoverage] = useState<'single' | 'family'>('single');
  const [preTax401k, setPreTax401k] = useState<number>(6000);
  const [preTaxHsaFsa, setPreTaxHsaFsa] = useState<number>(0);
  const [deductionMode, setDeductionMode] = useState<'standard' | 'itemized'>('standard');
  const [itemizedAmount, setItemizedAmount] = useState<number>(10000);

  const yrConfig = US_TAX_CONFIG_BY_YEAR[2026] || US_TAX_CONFIG_BY_YEAR[DEFAULT_TAX_YEAR];
  const standardDeductionVal = yrConfig?.standardDeduction[filingStatus]?.value || 0;

  // Contribution limits calculation based on year and age
  const retLimits = yrConfig?.retirementLimits;
  const max401kLimit = useMemo(() => {
    if (!retLimits) return 24500;
    const base = retLimits.elective401kLimit.value;
    if (age >= 60 && age <= 63) {
      return base + (retLimits.catchUp401kSpecialAge60_63?.value || retLimits.catchUp401kAge50.value);
    } else if (age >= 50) {
      return base + retLimits.catchUp401kAge50.value;
    }
    return base;
  }, [retLimits, age]);

  const maxHsaLimit = useMemo(() => {
    if (!retLimits) return 4400;
    const base = hsaCoverage === 'family' ? retLimits.hsaFamilyLimit.value : retLimits.hsaSingleLimit.value;
    // HSA 55+ catch-up is $1,000
    return age >= 55 ? base + 1000 : base;
  }, [retLimits, hsaCoverage, age]);

  const maxFsaLimit = useMemo(() => {
    return retLimits?.healthcareFsaLimit?.value || 3400;
  }, [retLimits]);

  // Combined max for HSA / FSA field
  const maxHsaFsaAllowed = maxHsaLimit + maxFsaLimit;

  // Cap effective values used in calculation
  const capped401k = Math.min(preTax401k, max401kLimit);
  const cappedHsaFsa = Math.min(preTaxHsaFsa, maxHsaFsaAllowed);

  const is401kOverLimit = preTax401k > max401kLimit;
  const isHsaFsaOverLimit = preTaxHsaFsa > maxHsaFsaAllowed;

  const taxResult = useMemo(() => {
    return calculateComprehensiveTax({
      annualIncome,
      year,
      filingStatus,
      stateCode,
      preTax401k: capped401k,
      preTaxHsaFsa: cappedHsaFsa,
      itemizedDeductions: deductionMode === 'itemized' ? itemizedAmount : undefined,
      deductionMode
    });
  }, [annualIncome, year, filingStatus, stateCode, capped401k, cappedHsaFsa, deductionMode, itemizedAmount]);

  const format = (v: number) => `$${new Intl.NumberFormat().format(Math.round(v))}`;
  const formatDetailed = (v: number) => `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)}`;

  const chartData = [
    { name: 'Take-Home Pay', value: taxResult.netTakeHome, color: '#10b981' },
    { name: 'Federal Income Tax', value: taxResult.federalTax, color: '#ef4444' },
    { name: 'FICA (SS & Medicare)', value: taxResult.ficaTax, color: '#f59e0b' },
    ...(taxResult.stateTax > 0 ? [{ name: `${taxResult.stateCode} State Tax`, value: taxResult.stateTax, color: '#6366f1' }] : []),
    ...(capped401k > 0 ? [{ name: 'Pre-Tax 401(k)', value: capped401k, color: '#06b6d4' }] : []),
    ...(cappedHsaFsa > 0 ? [{ name: 'Pre-Tax HSA/FSA', value: cappedHsaFsa, color: '#14b8a6' }] : []),
  ];

  const stateCfg = getStateConfig(stateCode, year);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Interactive Inputs */}
      <div className="lg:col-span-5 space-y-6">
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <ShieldAlert size={20} className="text-rose-600 dark:text-rose-400" aria-hidden="true" /> US Income Tax Setup
            </h3>
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Tax Year {year}
            </span>
          </div>

          {/* Validation Error Banner for URL or direct parameter errors */}
          {unsupportedYearError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-2xl flex items-start gap-3 text-rose-800 dark:text-rose-200">
              <ShieldAlert size={20} className="shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider">Validation Error: Unsupported Tax Year</h4>
                <p className="text-xs mt-1 leading-relaxed">{unsupportedYearError}</p>
              </div>
            </div>
          )}

          {/* Tax Year Selector (2026 Only Supported) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                Tax Year
              </label>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                2026 Only (Verified)
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 min-h-[42px] py-2 px-3 text-xs font-bold rounded-xl bg-indigo-600 text-white border border-indigo-600 shadow-sm flex items-center justify-center gap-1.5 cursor-default"
                aria-label="Tax Year 2026 Active"
              >
                <CheckCircle2 size={14} />
                <span>2026 IRS Tax Year (Active)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">
              IRS Rev. Proc. 2025-32 & Notice 2025-67. Historical years 2024 and 2025 are disabled.
            </p>
          </div>

          {/* Filing Status Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
              Federal Filing Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'single', label: 'Single' },
                { id: 'mfj', label: 'Married Joint' },
                { id: 'mfs', label: 'Married Sep' },
                { id: 'hoh', label: 'Head of House' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setFilingStatus(st.id as FilingStatus)}
                  className={cn(
                    "min-h-[38px] py-1.5 px-2 text-xs font-bold rounded-xl transition-all border text-center",
                    filingStatus === st.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                  )}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age & HSA Coverage inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputGroup 
              label="Taxpayer Age" 
              value={age} 
              onChange={(v: number) => setAge(Math.max(18, Math.min(100, Math.round(v) || 18)))} 
            />
            <div className="space-y-1.5">
              <label htmlFor="tax-hsa-coverage" className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                HSA Coverage Plan
              </label>
              <select
                id="tax-hsa-coverage"
                value={hsaCoverage}
                onChange={(e) => setHsaCoverage(e.target.value as 'single' | 'family')}
                className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="single">Self-Only (${new Intl.NumberFormat().format(retLimits?.hsaSingleLimit?.value || 4400)})</option>
                <option value="family">Family (${new Intl.NumberFormat().format(retLimits?.hsaFamilyLimit?.value || 8750)})</option>
              </select>
            </div>
          </div>

          {/* State Jurisdiction Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label htmlFor="tax-state-select" className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                State Jurisdiction
              </label>
              {!stateCfg.hasIncomeTax && !stateCfg.warning && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  0% State Income Tax
                </span>
              )}
            </div>
            <select
              id="tax-state-select"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {US_STATE_LIST.map(st => (
                <option key={st.code} value={st.code}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Visible State Banner if State Not Modeled */}
          {stateCfg.warning && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <ShieldAlert size={16} className="shrink-0 text-amber-600" />
              <span><strong>State income tax not modeled for {stateCfg.stateCode}:</strong> Federal income tax and FICA taxes are calculated; state tax is treated as $0.00.</span>
            </div>
          )}

          {/* Gross Annual Salary */}
          <InputGroup 
            label="Gross Annual Salary" 
            value={annualIncome} 
            prefix="$" 
            onChange={(v: number) => setAnnualIncome(v)} 
          />

          {/* Pre-Tax Deductions with Limit Warnings */}
          <div className="space-y-4">
            <div>
              <InputGroup 
                label={`Pre-Tax 401(k) / 403(b) (Max: ${format(max401kLimit)})`} 
                value={preTax401k} 
                prefix="$" 
                onChange={(v: number) => setPreTax401k(v)} 
              />
              {is401kOverLimit && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  Warning: Exceeds annual 401(k) limit of {format(max401kLimit)} for age {age}. Amount used in tax calculation is capped at {format(max401kLimit)}.
                </p>
              )}
            </div>

            <div>
              <InputGroup 
                label={`Pre-Tax HSA / Healthcare FSA (Combined Max: ${format(maxHsaFsaAllowed)})`} 
                value={preTaxHsaFsa} 
                prefix="$" 
                onChange={(v: number) => setPreTaxHsaFsa(v)} 
              />
              {isHsaFsaOverLimit && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  Warning: Exceeds combined annual statutory limit of {format(maxHsaFsaAllowed)} (HSA {format(maxHsaLimit)} + FSA {format(maxFsaLimit)}). Amount used is capped at {format(maxHsaFsaAllowed)}.
                </p>
              )}
            </div>
          </div>

          {/* Standard vs Itemized Deductions Toggle */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                Deduction Type
              </label>
              <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 p-0.5 bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setDeductionMode('standard')}
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded-md transition-all",
                    deductionMode === 'standard'
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  )}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setDeductionMode('itemized')}
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded-md transition-all",
                    deductionMode === 'itemized'
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  )}
                >
                  Itemized
                </button>
              </div>
            </div>

            {deductionMode === 'standard' ? (
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold">Federal Standard Deduction:</span> {format(standardDeductionVal)} for {filingStatus.toUpperCase()} in {year}.
              </div>
            ) : (
              <div className="space-y-2">
                <InputGroup 
                  label="Itemized Deductions Amount" 
                  value={itemizedAmount} 
                  prefix="$" 
                  onChange={(v: number) => setItemizedAmount(Math.max(0, v))} 
                />
                {itemizedAmount < standardDeductionVal && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Note: Your itemized deduction of {format(itemizedAmount)} is lower than the {year} standard deduction ({format(standardDeductionVal)}). Under itemized filing, the calculation uses exactly your entered amount ({format(itemizedAmount)}).
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Compliance Rule Note */}
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed space-y-1.5">
            <p><strong>Pre-Tax Take-Home Rule:</strong> 401(k) contributions reduce Federal &amp; State taxable income, but because funds are directed into retirement accounts, they are subtracted from liquid paycheck cash flow.</p>
            <p><strong>FICA Breakdown:</strong> 6.2% Social Security up to wage base cap (${new Intl.NumberFormat().format(taxResult.ficaDetails.ssCap)}) + 1.45% Medicare. Section 125 HSA/FSA is exempt from FICA; 401(k) is subject to FICA per IRC § 3121.</p>
          </div>
        </GlassCard>
      </div>

      {/* Right Column: Key Metrics & Paycheck Breakdown */}
      <div className="lg:col-span-7 space-y-8">
        {taxResult.warnings && taxResult.warnings.length > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 rounded-2xl space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
            <div className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <ShieldAlert size={14} className="shrink-0" />
              <span>Assumptions &amp; Verification Notice</span>
            </div>
            {taxResult.warnings.map((w: string, idx: number) => (
              <p key={idx} className="leading-relaxed">{w}</p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            label="Net Annual Take-Home" 
            value={formatDetailed(taxResult.netTakeHome)} 
            subtext={`${formatDetailed(taxResult.monthlyNetTakeHome)}/mo (${formatDetailed(taxResult.biweeklyNetTakeHome)} bi-weekly)`} 
            icon={Wallet} 
            color="bg-emerald-600" 
          />
          <MetricCard 
            label="Total Tax Obligation" 
            value={formatDetailed(taxResult.totalTax)} 
            subtext={`${taxResult.totalEffectiveTaxRate.toFixed(2)}% overall effective rate`} 
            icon={ShieldAlert} 
            color="bg-rose-600" 
          />
          <MetricCard 
            label="Federal Effective Rate" 
            value={`${taxResult.federalEffectiveRate.toFixed(2)}%`} 
            subtext={`Taxable: ${format(taxResult.federalTaxableIncome)}`} 
            icon={Percent} 
            color="bg-slate-900 dark:bg-slate-700" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Donut Chart */}
          <GlassCard className="p-6 lg:p-8 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Income Distribution</h4>
            <div className="h-64" aria-label="Income Distribution Chart">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={6} dataKey="value">
                    {chartData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                  </Pie>
                  <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              {chartData.map(d => (
                <div key={d.name} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <div className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 truncate">{d.name}</div>
                  <div className="text-xs sm:text-sm font-black truncate" style={{ color: d.color }}>{formatDetailed(d.value)}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Itemized Paycheck Breakdown Table */}
          <GlassCard className="p-6 lg:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Itemized Paycheck Breakdown</h4>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Monthly Basis</span>
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm pt-2">
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Gross Salary (Monthly)</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{formatDetailed(taxResult.monthlyGross)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Federal Withholding</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">-{formatDetailed(taxResult.monthlyFederalTax)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  FICA Social Security (6.2%)
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">-{formatDetailed(taxResult.ficaDetails.socialSecurity / 12)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  FICA Medicare (1.45% {taxResult.ficaDetails.additionalMedicare > 0 ? '+ 0.9%' : ''})
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">-{formatDetailed(taxResult.ficaDetails.medicare / 12)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {taxResult.stateName} Income Tax
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  {taxResult.monthlyStateTax > 0 ? `-${formatDetailed(taxResult.monthlyStateTax)}` : '$0.00'}
                </span>
              </div>
              {capped401k > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Pre-Tax 401(k) Elective Deferral</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">-{formatDetailed(capped401k / 12)}</span>
                </div>
              )}
              {cappedHsaFsa > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Pre-Tax HSA/FSA (Sec. 125)</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">-{formatDetailed(cappedHsaFsa / 12)}</span>
                </div>
              )}
              <div className="flex justify-between py-2.5 border-t-2 border-slate-300 dark:border-slate-600">
                <span className="font-black text-slate-900 dark:text-white">Net Liquid Paycheck</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-base">{formatDetailed(taxResult.monthlyNetTakeHome)}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Informational Guidance: Items Not Modeled & Special Rules */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <ShieldAlert size={16} className="text-amber-500" />
            <span>Important Tax Provisions &amp; Unmodeled Items</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Additional Medicare Tax Withholding:</p>
              <p>Employers are required by law to withhold the 0.9% Additional Medicare Tax on wages exceeding $200,000 in a calendar year, regardless of the employee's filing status. Actual annual liability depends on filing status threshold ($250k MFJ, $125k MFS, $200k Single/HOH) and is reconciled on Form 8959.</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">State Disability &amp; Paid Family Leave (SDI / PFL):</p>
              <p>Mandatory employee payroll contributions for disability insurance and paid family leave (such as CA SDI 1.2%, WA PFML, MA PFML, NJ TDI/FLI, NY DBL/PFL) are state-specific payroll taxes not modeled here. Check your pay stub for local deductions.</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">OBBBA Deductions &amp; Special Provisions:</p>
              <p>Special deductions under the One Big Beautiful Bill Act (OBBBA) — including deductions for tips, overtime compensation, seniors, and auto-loan interest — as well as Section 199A Qualified Business Income (QBI) deductions and the State &amp; Local Tax (SALT) cap, require individual return qualification and are not modeled in this wage calculator.</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Federal Tax Credits &amp; Local Taxes:</p>
              <p>Refundable and nonrefundable tax credits (such as the Child Tax Credit, Earned Income Tax Credit (EITC), Child Care Credit), and municipal/county local income taxes (e.g. NYC local tax, Philadelphia wage tax, Ohio municipal taxes) are not modeled in this paycheck engine.</p>
            </div>
          </div>
        </div>

        {/* Assumptions & Legal Sources Compliance Panel */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Landmark size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>US Statutory Sources &amp; Legal Citations</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Federal Income Tax:</p>
              <p>Internal Revenue Code § 1; Official IRS Guidance: {taxResult.statutorySources.federal.split('/').pop()?.replace('.pdf', '').toUpperCase() || taxResult.statutorySources.federal}.</p>
              <a href={taxResult.statutorySources.federal} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-medium mt-0.5 inline-block break-all">
                View Official IRS Document ({taxResult.statutorySources.federal})
              </a>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">FICA &amp; Social Security:</p>
              <p>IRC § 3101(a) (6.2% OASDI up to ${new Intl.NumberFormat().format(taxResult.ficaDetails.ssCap)} wage base) &amp; IRC § 3101(b) (1.45% Medicare uncapped + 0.9% surtax).</p>
              <a href={taxResult.statutorySources.socialSecurity} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-medium mt-0.5 inline-block break-all">
                View SSA Social Security Fact Sheet ({taxResult.statutorySources.socialSecurity})
              </a>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">State Jurisdiction:</p>
              <p>{taxResult.stateName} Department of Revenue / Tax Commission. Effective date {stateCfg.effectiveDate}.</p>
              <a href={taxResult.statutorySources.state} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-medium mt-0.5 inline-block break-all">
                View State Department of Revenue Source
              </a>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Section 125 &amp; Pre-Tax Savings:</p>
              <p>IRC § 125 (Cafeteria Plans), IRC § 402(g) (${new Intl.NumberFormat().format(US_TAX_CONFIG_BY_YEAR[year]?.retirementLimits?.elective401kLimit?.value || 24500)} elective deferral limit per Notice 2025-67).</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700 italic">
            Disclaimer: Calculations and estimates are for educational and informational purposes only. Results do not constitute certified tax, legal, or accounting advice. Consult a licensed CPA or tax professional for your specific situation.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 9. COMPOUND INTEREST CALCULATOR MODULE
 * ========================================================================== */
export function CompoundInterestModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({
    principal: 15000,
    annualRate: 7.5,
    years: 15,
    frequency: 12,
    monthlyContribution: 300
  });

  const res = useMemo(() => calculateCompoundInterest(
    params.principal,
    params.annualRate,
    params.years,
    params.frequency,
    params.monthlyContribution
  ), [params]);

  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)}`;
  const freqLabel = params.frequency === 365 ? 'Daily' : params.frequency === 12 ? 'Monthly' : params.frequency === 4 ? 'Quarterly' : 'Annual';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <TrendingUp size={20} className="text-violet-600 dark:text-violet-400" aria-hidden="true" /> Compound Growth
          </h3>
          <InputGroup label="Initial Deposit" value={params.principal} prefix={currency.symbol} onChange={(v: number) => setParams({...params, principal: v})} />
          <InputGroup label="Monthly Addition" value={params.monthlyContribution} prefix={currency.symbol} onChange={(v: number) => setParams({...params, monthlyContribution: v})} />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Annual Return" value={params.annualRate} suffix="%" step="0.1" onChange={(v: number) => setParams({...params, annualRate: v})} />
            <InputGroup label="Time Horizon" value={params.years} suffix="yrs" onChange={(v: number) => setParams({...params, years: v})} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="compound-frequency-select" className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">Compound Frequency</label>
            <select
              id="compound-frequency-select"
              value={params.frequency}
              onChange={e => setParams({...params, frequency: Number(e.target.value)})}
              className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl py-3 px-4 outline-none text-xs font-bold text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              <option value={365}>Daily (365 times / yr)</option>
              <option value={12}>Monthly (12 times / yr)</option>
              <option value={4}>Quarterly (4 times / yr)</option>
              <option value={1}>Annually (1 time / yr)</option>
            </select>
          </div>
        </GlassCard>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Future Portfolio Value" value={format(res.totalBalance)} subtext={`After ${params.years} yrs (${freqLabel} compounding)`} icon={Zap} color="bg-violet-600" />
          <MetricCard label="Total Interest Gained" value={format(res.totalInterest)} subtext={`Pure compound yield (${freqLabel})`} icon={TrendingUp} color="bg-emerald-600" />
          <MetricCard label="Total Invested Principal" value={format(res.totalInvested)} subtext="Your out-of-pocket deposits" icon={Wallet} color="bg-slate-800 dark:bg-slate-700" />
        </div>

        <GlassCard className="p-6 lg:p-8 space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Total Contributions vs Compound Gains</h4>
          <div className="h-64" aria-label="Contributions vs Compound Interest Chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Contributions', amount: res.totalInvested, fill: '#64748b' },
                { name: 'Compound Interest', amount: res.totalInterest, fill: '#8b5cf6' },
                { name: 'Total Wealth', amount: res.totalBalance, fill: '#10b981' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="name" fontSize={11} stroke="#64748b" />
                <YAxis hide />
                <ReTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ============================================================================
 * 10. SALARY CALCULATOR MODULE
 * ========================================================================== */
export function SalaryModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({
    amount: 75000,
    frequency: 'annual' as 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'annual',
    hoursPerWeek: 40,
    daysPerWeek: 5,
    paidWeeks: 52,
    unpaidWeeks: 0,
    isExempt: false,
    overtimeHours: 0,

    // Real Statutory Tax Engine Parameters
    year: DEFAULT_TAX_YEAR,
    filingStatus: 'single' as FilingStatus,
    stateCode: 'CA',
    preTax401k: 0,
    preTaxHsaFsa: 0,

    // Optional Flat Override (Rough estimate)
    useFlatTaxOverride: false,
    estimatedTaxPercent: 20, // Default 20% consistent between UI and engine

    // California Daily Overtime
    applyCaliforniaDailyOvertime: false,
    dailyHours: [8, 8, 8, 8, 8, 0, 0] as number[]
  });

  const [unsupportedYearError, setUnsupportedYearError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const urlYear = sp.get('year') || sp.get('taxYear');
      if (urlYear) {
        const parsed = parseInt(urlYear, 10);
        if (!isNaN(parsed) && parsed !== 2026) {
          setUnsupportedYearError(
            `Unsupported tax year requested: ${parsed}. WowCalc currently supports Tax Year 2026 only for US federal and state income tax calculations until additional years are independently verified. Years 2024, 2025, and 2027 are not supported.`
          );
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Keep paid and unpaid weeks in sync with 52-week baseline
  const handleUnpaidWeeksChange = (unpaid: number) => {
    const safeUnpaid = Math.max(0, Math.min(52, unpaid));
    setParams(prev => ({
      ...prev,
      unpaidWeeks: safeUnpaid,
      paidWeeks: Math.max(1, 52 - safeUnpaid)
    }));
  };

  const handlePaidWeeksChange = (paid: number) => {
    const safePaid = Math.max(1, Math.min(52, paid));
    setParams(prev => ({
      ...prev,
      paidWeeks: safePaid,
      unpaidWeeks: Math.max(0, 52 - safePaid)
    }));
  };

  const handleDailyHourChange = (index: number, val: number) => {
    const updated = [...params.dailyHours];
    updated[index] = Math.max(0, Math.min(24, val));
    setParams(prev => ({ ...prev, dailyHours: updated }));
  };

  const res = useMemo(() => calculateSalary({
    amount: params.amount,
    frequency: params.frequency,
    hoursPerWeek: params.hoursPerWeek,
    daysPerWeek: params.daysPerWeek,
    paidWeeks: params.paidWeeks,
    unpaidWeeks: params.unpaidWeeks,
    isExempt: params.isExempt,
    overtimeHours: params.overtimeHours,
    year: params.year,
    filingStatus: params.filingStatus,
    stateCode: params.stateCode,
    preTax401k: params.preTax401k,
    preTaxHsaFsa: params.preTaxHsaFsa,
    useFlatTaxOverride: params.useFlatTaxOverride,
    estimatedTaxPercent: params.estimatedTaxPercent,
    applyCaliforniaDailyOvertime: params.applyCaliforniaDailyOvertime && params.stateCode === 'CA',
    dailyHours: params.dailyHours
  }), [params]);

  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;
  const formatCents = (v: number) => `${currency.symbol}${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const stateRule = US_STATE_OVERTIME_RULES[params.stateCode?.toUpperCase() || ''];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form Controls */}
      <div className="lg:col-span-5 space-y-6">
        {unsupportedYearError && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-2xl flex items-start gap-3 text-rose-800 dark:text-rose-200">
            <ShieldAlert size={20} className="shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider">Validation Error: Unsupported Tax Year</h4>
              <p className="text-xs mt-1 leading-relaxed">{unsupportedYearError}</p>
            </div>
          </div>
        )}
        <GlassCard className="p-5 sm:p-6 space-y-5">
          <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <Briefcase size={20} className="text-teal-600 dark:text-teal-400" aria-hidden="true" />
            Wage & Compensation Inputs
          </h3>

          <InputGroup 
            label="Pay Rate" 
            value={params.amount} 
            prefix={currency.symbol} 
            onChange={(v: number) => setParams({ ...params, amount: v })} 
          />

          <div className="space-y-1.5">
            <label htmlFor="salary-frequency-select" className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
              Pay Frequency
            </label>
            <select
              id="salary-frequency-select"
              value={params.frequency}
              onChange={e => setParams({ ...params, frequency: e.target.value as any })}
              className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly (26 pay periods / yr)</option>
              <option value="semimonthly">Semi-Monthly (24 pay periods / yr)</option>
              <option value="monthly">Monthly (12 pay periods / yr)</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          {/* FLSA Exemption Status */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
              FLSA Overtime Classification
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setParams({ ...params, isExempt: false })}
                className={cn(
                  "min-h-[44px] p-2.5 rounded-xl border text-xs font-bold transition-all text-center",
                  !params.isExempt
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                Non-Exempt (1.5× OT)
              </button>
              <button
                type="button"
                onClick={() => setParams({ ...params, isExempt: true })}
                className={cn(
                  "min-h-[44px] p-2.5 rounded-xl border text-xs font-bold transition-all text-center",
                  params.isExempt
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                Exempt (Salaried)
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">
              {!params.isExempt 
                ? "Non-exempt employees receive statutory 1.5× regular pay for workweek hours over 40 under FLSA." 
                : "Exempt employees receive straight salary without statutory overtime requirements under FLSA § 13(a)(1)."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <InputGroup 
              label="Hours / Week" 
              value={params.hoursPerWeek} 
              onChange={(v: number) => setParams({ ...params, hoursPerWeek: v })} 
            />
            <InputGroup 
              label="Extra Overtime Hrs" 
              value={params.overtimeHours} 
              onChange={(v: number) => setParams({ ...params, overtimeHours: v })} 
            />
          </div>

          {/* Paid / Unpaid Weeks Annualization */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <InputGroup 
              label="Paid Weeks / Year" 
              value={params.paidWeeks} 
              onChange={handlePaidWeeksChange} 
            />
            <InputGroup 
              label="Unpaid Leave Weeks" 
              value={params.unpaidWeeks} 
              onChange={handleUnpaidWeeksChange} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <InputGroup 
              label="Work Days / Week" 
              value={params.daysPerWeek} 
              min={1} 
              onChange={(v: number) => setParams({ ...params, daysPerWeek: Math.max(1, v) })} 
            />
            <div className="space-y-1.5">
              <label htmlFor="salary-tax-year-select" className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                Tax Year
              </label>
              <select
                id="salary-tax-year-select"
                value={params.year}
                onChange={e => setParams({ ...params, year: Number(e.target.value) })}
                className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {SUPPORTED_TAX_YEARS.map(yr => (
                  <option key={yr} value={yr}>{yr} IRS Tax Year</option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Real Tax Engine Controls */}
        <GlassCard className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <Percent size={20} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              Tax Withholding Setup
            </h3>
            <span className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full",
              params.useFlatTaxOverride 
                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200" 
                : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200"
            )}>
              {params.useFlatTaxOverride ? "Flat Override" : "Statutory Engine"}
            </span>
          </div>

          {/* Toggle for Flat Rate Override */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <label htmlFor="salary-flat-override-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                Override with flat % (Rough estimate)
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bypass federal, state, and FICA statutory brackets
              </p>
            </div>
            <input
              id="salary-flat-override-toggle"
              type="checkbox"
              checked={params.useFlatTaxOverride}
              onChange={e => setParams({ ...params, useFlatTaxOverride: e.target.checked })}
              className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {params.useFlatTaxOverride ? (
            <div className="space-y-3">
              <InputGroup 
                label="Flat Estimated Tax Rate" 
                value={params.estimatedTaxPercent} 
                suffix="%" 
                step="1" 
                onChange={(v: number) => setParams({ ...params, estimatedTaxPercent: v })} 
              />
              <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
                Rough estimate mode: uses a flat {params.estimatedTaxPercent}% deduction. Uncheck the override above to calculate statutory Federal, FICA, and State taxes.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="salary-filing-status-select" className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                    Filing Status
                  </label>
                  <select
                    id="salary-filing-status-select"
                    value={params.filingStatus}
                    onChange={e => setParams({ ...params, filingStatus: e.target.value as FilingStatus })}
                    className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl py-3 px-3 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <option value="single">Single</option>
                    <option value="married_joint">Married Filing Jointly</option>
                    <option value="married_separate">Married Filing Separately</option>
                    <option value="head_of_household">Head of Household</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="salary-state-select" className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                    State of Residence
                  </label>
                  <select
                    id="salary-state-select"
                    value={params.stateCode}
                    onChange={e => setParams({ ...params, stateCode: e.target.value })}
                    className="w-full min-h-[44px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl py-3 px-3 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {US_STATE_LIST.map(st => (
                      <option key={st.code} value={st.code}>{st.code} - {st.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InputGroup 
                  label="Pre-Tax 401(k) / IRA" 
                  value={params.preTax401k} 
                  prefix={currency.symbol} 
                  onChange={(v: number) => setParams({ ...params, preTax401k: v })} 
                />
                <InputGroup 
                  label="Pre-Tax HSA / FSA" 
                  value={params.preTaxHsaFsa} 
                  prefix={currency.symbol} 
                  onChange={(v: number) => setParams({ ...params, preTaxHsaFsa: v })} 
                />
              </div>
            </div>
          )}
        </GlassCard>

        {/* State Daily Overtime Rule Banner */}
        {stateRule && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200">
              <Info size={16} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <span>{params.stateCode.toUpperCase()} Statutory Overtime Law ({stateRule.statute})</span>
            </div>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
              {stateRule.ruleSummary}
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400">
              Source: {stateRule.source}
            </p>
          </div>
        )}

        {/* California Daily Overtime Interactive Section */}
        {params.stateCode?.toUpperCase() === 'CA' && !params.isExempt && (
          <GlassCard className="p-5 sm:p-6 space-y-4 border-teal-200 dark:border-teal-900">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  California Daily Overtime Model
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Cal. Lab. Code § 510: 1.5× over 8h/day, 2.0× over 12h/day, 7th-day rules
                </p>
              </div>
              <input
                id="california-daily-ot-toggle"
                type="checkbox"
                checked={params.applyCaliforniaDailyOvertime}
                onChange={e => setParams({ ...params, applyCaliforniaDailyOvertime: e.target.checked })}
                className="h-5 w-5 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
              />
            </div>

            {params.applyCaliforniaDailyOvertime && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Daily Work Hours (Mon – Sun):
                </span>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {params.dailyHours.map((h, i) => (
                    <div key={dayNames[i]} className="text-center space-y-1">
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">
                        {dayNames[i]}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={h}
                        onChange={e => handleDailyHourChange(i, Number(e.target.value))}
                        className="w-full text-center py-2 px-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl text-center text-xs">
                  <div>
                    <div className="text-[10px] text-teal-700 dark:text-teal-300 font-bold uppercase">Regular (1.0×)</div>
                    <div className="font-mono font-bold text-teal-900 dark:text-teal-100">{res.regularHours}h</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-teal-700 dark:text-teal-300 font-bold uppercase">Daily OT (1.5×)</div>
                    <div className="font-mono font-bold text-teal-900 dark:text-teal-100">{res.overtimeHours}h</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-teal-700 dark:text-teal-300 font-bold uppercase">Double Time (2.0×)</div>
                    <div className="font-mono font-bold text-teal-900 dark:text-teal-100">{res.doubleTimeHours}h</div>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        )}
      </div>

      {/* Right Column: Results & Matrix */}
      <div className="lg:col-span-7 space-y-6">
        {/* Metric Cards - Hourly and Daily show exact cents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <MetricCard 
            label="Gross Annual Salary" 
            value={format(res.annualGross)} 
            subtext={`Gross earnings (${res.paidWeeks} paid wks)`} 
            icon={Briefcase} 
            color="bg-teal-600" 
          />
          <MetricCard 
            label="Net Annual Take-Home" 
            value={format(res.annualNet)} 
            subtext={`${res.effectiveTaxRate.toFixed(1)}% total effective deduction`} 
            icon={Wallet} 
            color="bg-emerald-600" 
          />
          <MetricCard 
            label="Base Hourly Rate" 
            value={`${formatCents(res.baseHourly)} / hr`} 
            subtext={res.isExempt ? "Exempt straight pay" : `1.5× Overtime: ${formatCents(res.overtimeHourly)} / hr`} 
            icon={Zap} 
            color="bg-blue-600" 
          />
          <MetricCard 
            label="Daily Rate Equivalent" 
            value={`${formatCents(res.weeklyGross / params.daysPerWeek)} / day`} 
            subtext={`${params.daysPerWeek} work days / week`} 
            icon={Calendar} 
            color="bg-purple-600" 
          />
        </div>

        {/* FLSA 40-hour rule alert banner */}
        {!params.isExempt && params.hoursPerWeek > 40 && (
          <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl flex items-center gap-3 text-xs text-teal-900 dark:text-teal-200">
            <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
            <span>
              <strong>FLSA Overtime Applied:</strong> First 40 hours paid at regular rate ({formatCents(res.baseHourly)}/hr = {format(res.baseHourly * 40)}). The {params.hoursPerWeek - 40} hours above 40 are automatically paid at 1.5× ({formatCents(res.overtimeHourly)}/hr = {format((params.hoursPerWeek - 40) * res.overtimeHourly)}), yielding <strong>{format(res.weeklyGross)}</strong> weekly gross.
            </span>
          </div>
        )}

        {/* Tax Deductions Summary Card */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Tax Withholding Breakdown ({res.taxMethod === 'statutory' ? `${params.year} IRS & State Statutory Brackets` : 'Flat Estimate'})
            </h4>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
              -{format(res.totalTax)} Total Tax ({res.effectiveTaxRate.toFixed(1)}%)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Federal Tax</span>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400">-{format(res.federalTax)}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">FICA (SS & Med)</span>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400">-{format(res.ficaTax)}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">State Tax ({params.stateCode})</span>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400">-{format(res.stateTax)}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Pre-Tax Deductions</span>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">-{format(res.totalPreTax)}</span>
            </div>
          </div>
        </div>

        {/* Salary Conversion Matrix Table - Hourly and Daily show exact cents */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm transition-colors">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Salary Conversion Matrix
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Exact cents preserved for hourly & daily rates
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-bold text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="p-3.5 sm:p-4">Pay Period</th>
                  <th className="p-3.5 sm:p-4">Gross Earnings</th>
                  <th className="p-3.5 sm:p-4">Est. Tax Withholding</th>
                  <th className="p-3.5 sm:p-4">Net Take-Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-medium">
                {res.breakdown.map((row: any) => {
                  const showCents = row.period === 'Hourly' || row.period === 'Daily';
                  const displayGross = showCents ? formatCents(row.gross) : format(row.gross);
                  const displayTax = showCents ? formatCents(row.tax) : format(row.tax);
                  const displayNet = showCents ? formatCents(row.net) : format(row.net);

                  return (
                    <tr key={row.period} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        {row.period}
                        {showCents && (
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            .¢¢
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 sm:p-4 text-slate-900 dark:text-white font-bold">{displayGross}</td>
                      <td className="p-3.5 sm:p-4 text-rose-600 dark:text-rose-400 font-bold">-{displayTax}</td>
                      <td className="p-3.5 sm:p-4 text-emerald-700 dark:text-emerald-400 font-black">{displayNet}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 11. INTEREST RATE CALCULATOR MODULE
 * ========================================================================== */
export function InterestRateModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({
    loanAmount: 30000,
    monthlyPayment: 620,
    termMonths: 60,
    upfrontFees: 500
  });

  const res = useMemo(() => calculateInterestRate(params), [params]);
  const format = (v: number) => `${currency.symbol}${new Intl.NumberFormat().format(Math.round(v))}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <TrendingUp size={20} className="text-cyan-600 dark:text-cyan-400" aria-hidden="true" /> APR Reverse Solver
          </h3>
          <InputGroup label="Original Loan Principal" value={params.loanAmount} prefix={currency.symbol} onChange={(v: number) => setParams({...params, loanAmount: v})} />
          <InputGroup label="Monthly Payment Made" value={params.monthlyPayment} prefix={currency.symbol} onChange={(v: number) => setParams({...params, monthlyPayment: v})} />
          <InputGroup label="Loan Duration (Months)" value={params.termMonths} onChange={(v: number) => setParams({...params, termMonths: v})} />
          <InputGroup label="Upfront Closing Fees" value={params.upfrontFees} prefix={currency.symbol} onChange={(v: number) => setParams({...params, upfrontFees: v})} />
        </GlassCard>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="True Nominal APR" value={`${res.nominalRate}%`} subtext="Annualized interest rate" icon={TrendingUp} color="bg-cyan-600" />
          <MetricCard label="Effective APR (with Fees)" value={`${res.aprWithFees}%`} subtext="Real cost of financing" icon={Percent} color="bg-rose-600" />
          <MetricCard label="Total Interest Paid" value={format(res.totalInterest)} subtext={`Total out: ${format(res.totalCost)}`} icon={Landmark} color="bg-slate-800 dark:bg-slate-700" />
        </div>

        <GlassCard className="p-6 lg:p-8 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Newton-Raphson Solver Result</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            By reverse engineering a <strong>{format(params.monthlyPayment)}</strong> monthly payment across <strong>{params.termMonths} months</strong> on a <strong>{format(params.loanAmount)}</strong> loan:
          </p>
          <div className="p-4 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 rounded-2xl flex items-center gap-3 text-cyan-900 dark:text-cyan-200 text-sm font-semibold">
            <CheckCircle2 size={20} className="shrink-0 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
            <span>The borrower is paying an exact nominal APR of <strong>{res.nominalRate}%</strong>. Factoring in <strong>{format(params.upfrontFees)}</strong> in fees raises the true loan APR to <strong>{res.aprWithFees}%</strong>.</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ============================================================================
 * 12. SALES TAX CALCULATOR MODULE
 * ========================================================================== */
export function SalesTaxModule({ currency }: { currency: any }) {
  const [params, setParams] = useState({
    amount: 1500,
    mode: 'add_tax' as 'add_tax' | 'extract_tax',
    stateRate: 6.25,
    localRate: 1.5,
    discountPercent: 10,
    discountType: 'store' as 'store' | 'manufacturer',
    itemType: 'general' as 'general' | 'groceries' | 'clothing' | 'prescription' | 'restaurant',
    stateCode: 'CA'
  });

  const res = useMemo(() => calculateSalesTax(params), [params]);
  const format = (v: number) => `${currency.symbol}${v.toFixed(2)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <DollarSign size={20} className="text-pink-600 dark:text-pink-400" aria-hidden="true" /> Sales Tax Engine
          </h3>
          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">Operation Mode</span>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button 
                type="button" 
                onClick={() => setParams({...params, mode: 'add_tax'})}
                className={cn("min-h-[44px] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", params.mode === 'add_tax' ? "bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white")}
              >
                Add Tax to Price
              </button>
              <button 
                type="button" 
                onClick={() => setParams({...params, mode: 'extract_tax'})}
                className={cn("min-h-[44px] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", params.mode === 'extract_tax' ? "bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white")}
              >
                Reverse Extraction
              </button>
            </div>
          </div>

          <InputGroup 
            label={params.mode === 'add_tax' ? "Before-Tax Price" : "Total Receipt Paid"} 
            value={params.amount} 
            prefix={currency.symbol} 
            onChange={(v: number) => setParams({...params, amount: v})} 
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">State Jurisdiction</label>
            <select
              value={params.stateCode}
              onChange={e => setParams({...params, stateCode: e.target.value})}
              className="w-full min-h-[44px] px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI', 'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT', 'IA', 'NV', 'AR', 'MS', 'KS', 'NM', 'NE', 'WV', 'ID', 'HI', 'NH', 'ME', 'RI', 'MT', 'DE', 'SD', 'ND', 'AK', 'VT', 'WY', 'DC'].map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">Taxable Item Type</label>
            <select
              value={params.itemType}
              onChange={e => setParams({...params, itemType: e.target.value as any})}
              className="w-full min-h-[44px] px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="general">General Merchandise</option>
              <option value="groceries">Groceries (Unprepared Food)</option>
              <option value="clothing">Clothing & Footwear</option>
              <option value="prescription">Prescription Drugs</option>
              <option value="restaurant">Restaurant / Prepared Meals</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="State Tax" value={params.stateRate} suffix="%" step="0.1" onChange={(v: number) => setParams({...params, stateRate: v})} />
            <InputGroup label="Local Tax" value={params.localRate} suffix="%" step="0.1" onChange={(v: number) => setParams({...params, localRate: v})} />
          </div>

          {params.mode === 'add_tax' && (
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
              <InputGroup label="Discount %" value={params.discountPercent} suffix="%" step="1" onChange={(v: number) => setParams({...params, discountPercent: v})} />
              <div className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">Discount Type</span>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                  <button 
                    type="button" 
                    onClick={() => setParams({...params, discountType: 'store'})}
                    className={cn("min-h-[40px] px-2 rounded-xl text-[11px] font-bold uppercase transition-all", params.discountType === 'store' ? "bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm" : "text-slate-700 dark:text-slate-300")}
                  >
                    Store Discount (Reduces Tax)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setParams({...params, discountType: 'manufacturer'})}
                    className={cn("min-h-[40px] px-2 rounded-xl text-[11px] font-bold uppercase transition-all", params.discountType === 'manufacturer' ? "bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm" : "text-slate-700 dark:text-slate-300")}
                  >
                    Mfr. Coupon (Taxed Pre-Coupon)
                  </button>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Final Out-of-Pocket" value={format(res.finalTotal)} subtext="Total receipt cost (with cents)" icon={Wallet} color="bg-pink-600" />
          <MetricCard label="Total Sales Tax" value={format(res.totalTax)} subtext={`State ($${res.stateTax.toFixed(2)}) + Local ($${res.localTax.toFixed(2)})`} icon={DollarSign} color="bg-slate-800 dark:bg-slate-700" />
          <MetricCard label="Pre-Tax Base Amount" value={format(res.beforeTax)} subtext="Taxable merchandise base" icon={ShieldAlert} color="bg-blue-600" />
        </div>

        <GlassCard className="p-6 lg:p-8 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Receipt Line Item Breakdown (Jurisdictional Computation)</h4>
          <div className="space-y-3 text-sm pt-2">
            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Item Base Price</span>
              <span className="font-bold text-slate-900 dark:text-white">{format(res.beforeTax)}</span>
            </div>
            {params.mode === 'add_tax' && res.savings > 0 && (
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {params.discountType === 'store' ? 'Store Discount Savings' : 'Manufacturer Coupon (Reimbursed)'}
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">-{format(res.savings)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-700 dark:text-slate-300 font-medium">State Tax ({params.stateRate}%) - Rounded per jurisdiction</span>
              <span className="font-bold text-slate-900 dark:text-white">+{format(res.stateTax)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Local / City Tax ({params.localRate}%) - Rounded per jurisdiction</span>
              <span className="font-bold text-slate-900 dark:text-white">+{format(res.localTax)}</span>
            </div>
            {res.centAdjustment !== 0 && (
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-amber-600 dark:text-amber-400 font-medium">Reverse Extraction Cent True-Up Adjustment</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{res.centAdjustment > 0 ? `+$${res.centAdjustment.toFixed(2)}` : `-$${Math.abs(res.centAdjustment).toFixed(2)}`}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t border-slate-200 dark:border-slate-700">
              <span className="font-black text-slate-900 dark:text-white text-base">Total Due (Exact Cent Sum)</span>
              <span className="font-black text-pink-600 dark:text-pink-400 text-xl">{format(res.finalTotal)}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl text-xs space-y-1.5 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
            <p className="font-bold text-slate-900 dark:text-white">Tax Authority & Exemption Note:</p>
            <p>{res.exemptionNote}</p>
            <p className="text-[11px] opacity-80">Sales tax is computed independently per tax jurisdiction (state tax and local tax are rounded separately to the nearest cent, then summed to ensure totalTax = stateTax + localTax).</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
